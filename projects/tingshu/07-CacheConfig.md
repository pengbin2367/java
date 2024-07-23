# 缓存切面

目前我们实现的所有接口在获取数据的时候，基本都是从 MySQL 中获取的。但是在实际生产环境中，我们应该避免大量请求来到 MySQL, 造成 MySQL 负载过大而宕机。这个时候，缓存就派上用场了！

采用 `注解 + AOP + Redisson` 的方式，实现缓存切面。对于需要缓存的资源请求，在其方法上添加 `@GuiguCache` 注解，注解中的 `prefix` 参数为 Redis 中对应 `key` 的前缀。在切面类中，读取到这个 `prefix`，再加上所标注的方法的参数，组成一个完整的 key。在使用该注解时，约定以 `方法名:` 为 prefix。

总的来说，实现的过程类似与之前实现的登录认证

::: code-group

```java [GuiguCache]
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface GuiguCache {

    String prefix() default "cache";
}
```

```java [CacheAspect]
@Slf4j
@Aspect
@Component
public class CacheAspect {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redissonClient;

    @SneakyThrows
    @Around("@annotation(com.atguigu.tingshu.common.cache.GuiguCache)")
    public Object cacheAspect(ProceedingJoinPoint joinPoint) {
        Object result = new Object();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        GuiguCache guiguCache = method.getAnnotation(GuiguCache.class);
        String key = guiguCache.prefix();
        Object[] args = joinPoint.getArgs();
        key += Arrays.asList(args).toString();
        String redisData = (String) redisTemplate.opsForValue().get(key);
        if (StringUtils.isNotEmpty(redisData)) {
            return JSONObject.parseObject(redisData, method.getReturnType());
        }
        RLock lock = redissonClient.getLock(key + ":lock");
        if (lock.tryLock(100, 100, TimeUnit.SECONDS)) {
            try {
                result = joinPoint.proceed(args);
                if (result == null) {
                    Class<?> returnType = method.getReturnType();
                    result = returnType.getConstructor().newInstance();
                    redisTemplate.opsForValue().set(key, JSONObject.toJSONString(result), 5, TimeUnit.MINUTES);
                } else {
                    redisTemplate.opsForValue().set(key, JSONObject.toJSONString(result), 1, TimeUnit.DAYS);
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.error("切面缓存操作数据库异常：{}", e.getMessage());
            } finally {
                lock.unlock();
            }
        }
        return result;
    }
}
```

```java [AlbumInfoClientController]
@RestController
@RequestMapping("/client/album/albumInfo")
public class AlbumInfoClientController {

    @Autowired
    private AlbumInfoService albumInfoService;

    @Autowired
    private TrackInfoService trackInfoService;

    @GuiguCache(prefix = "getAlbumInfo:") // [!code ++]
    @GetMapping("/getAlbumInfo/{albumId}")
    public AlbumInfo getAlbumInfo(@PathVariable(value = "albumId") Long albumId) {
        return albumInfoService.getById(albumId);
    }

    @GuiguCache(prefix = "getAlbumStatInfo:") // [!code ++]
    @GetMapping("/getAlbumStatInfo/{albumId}")
    public Map<String, Integer> getAlbumStatInfo(@PathVariable(value = "albumId") Long albumId) {
        return albumInfoService.getAlbumStatInfo(albumId);
    }

    @GuiguCache(prefix = "getAlbumAttributeValue:") // [!code ++]
    @GetMapping("/getAlbumAttributeValue/{albumId}")
    public List<AlbumAttributeValue> getAlbumAttributeValue(@PathVariable(value = "albumId") Long albumId) {
        return albumInfoService.getAlbumAttributeValue(albumId);
    }

    @GetMapping("/getAlbumInfoByTrackId/{trackId}")
    public AlbumInfo getAlbumInfoByTrackId(@PathVariable(value = "trackId") Long trackId) {
        TrackInfo trackInfo = trackInfoService.getById(trackId);
        return albumInfoService.getById(trackInfo.getAlbumId());
    }
}
```

:::