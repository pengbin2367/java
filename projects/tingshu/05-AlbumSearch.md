# 专辑搜索

## 专辑数据从 DB 写入写出 ES

专辑数据从 DB 写入写出 ElasticSearch 的过程，其实就是专辑上下架的实现。在这一过程中，需要写入 ES 的对象是 **AlbumInfoIndex**，其中包含专辑的基础属性、一二三/级分类 id、作者、专辑统计信息和标签信息。因此，要实现这一功能，先要从数据库获取以下信息：

1. 先从 `album_info` 中获取专辑的基础信息
2. 根据 `album_info` 中获取的 `user_id` 从 `user_info` 中获取作者信息
3. 根据 `album_info` 中获取的 `id` 从 `base_category_view` 中获取各级分类的 id
4. 根据 `album_info` 中获取的 `id` 从 `album_stat` 中获取专辑统计信息
5. 根据 `album_info` 中获取的 `id` 从 `album_attribute_value` 中获取专辑标签信息

### 查询专辑信息

::: code-group

```java [AlbumInfoFeignClient]
@FeignClient(value = "service-album", path = "/client/album/albumInfo", contextId = "albumInfoFeignClient")
public interface AlbumInfoFeignClient {

    @GetMapping("/getAlbumInfo/{albumId}")
    public AlbumInfo getAlbumInfo(@PathVariable(value = "albumId") Long albumId);
}
```

```java [AlbumInfoClientController]
@RestController
@RequestMapping("/client/album/albumInfo")
public class AlbumInfoClientController {

    @Autowired
    private AlbumInfoService albumInfoService;

    @GetMapping("/getAlbumInfo/{albumId}")
    public AlbumInfo getAlbumInfo(@PathVariable(value = "albumId") Long albumId) {
        return albumInfoService.getById(albumId);
    }
}
```

:::

### 查询作者信息

::: code-group

```java [UserInfoFeignClient]
@FeignClient(value = "service-user", path = "/client/user/userInfo", contextId = "userInfoFeignClient")
public interface UserInfoFeignClient {

    @GetMapping("/getUserInfo/{userId}")
    public UserInfo getUserInfo(@PathVariable(value = "userId") Long userId);
}
```

```java [UserInfoClientController]
@RestController
@RequestMapping("/client/user/userInfo")
public class UserInfoClientController {

    @Autowired
    private UserInfoService userInfoService;

    @GetMapping("/getUserInfo/{userId}")
    public UserInfo getUserInfo(@PathVariable(value = "userId") Long userId) {
        return userInfoService.getById(userId);
    }
}
```

:::

### 查询各级分类 id

::: code-group

```java [CategoryFeignClient]
@FeignClient(value = "service-album", path = "/client/album/category", contextId = "categoryFeignClient")
public interface CategoryFeignClient {

    @GetMapping("/getBaseCategoryView/{category3Id}")
    public BaseCategoryView getBaseCategoryView(@PathVariable(value = "category3Id") Long category3Id);
}
```

```java [BaseCategoryClientController]
@RestController
@RequestMapping(value="/client/album/category")
public class BaseCategoryClientController {

    @Autowired
    private BaseCategoryViewMapper baseCategoryViewMapper;

    @GetMapping("/getBaseCategoryView/{category3Id}")
    public BaseCategoryView getBaseCategoryView(@PathVariable(value = "category3Id") Long category3Id) {
        return baseCategoryViewMapper.selectById(category3Id);
    }
}
```

:::

### 查询专辑统计信息

::: code-group

```java [AlbumInfoClientController]
@GetMapping("/getAlbumStatInfo/{albumId}")
public Map<String, Integer> getAlbumStatInfo(@PathVariable(value = "albumId") Long albumId) {
  return albumInfoService.getAlbumStatInfo(albumId);
}
```

```java [AlbumInfoServiceImpl]
@Override
public Map<String, Integer> getAlbumStatInfo(Long albumId) {
  List<AlbumStat> albumStats = albumStatMapper.selectList(new LambdaQueryWrapper<AlbumStat>().eq(AlbumStat::getAlbumId, albumId));
  return albumStats.stream().collect(Collectors.toMap(
    AlbumStat::getStatType,
    AlbumStat::getStatNum
  ));
}
```

:::

### 查询专辑标签信息

::: code-group

```java [AlbumInfoClientController]
@GetMapping("/getAlbumAttributeValue/{albumId}")
public List<AlbumAttributeValue> getAlbumAttributeValue(@PathVariable(value = "albumId") Long albumId) {
  return albumInfoService.getAlbumAttributeValue(albumId);
}
```

```java [AlbumInfoServiceImpl]
@Override
public List<AlbumAttributeValue> getAlbumAttributeValue(Long albumId) {
  return albumAttributeValueMapper.selectList(new LambdaQueryWrapper<AlbumAttributeValue>().eq(AlbumAttributeValue::getAlbumId, albumId));
}
```

:::

### 实现上下架

::: code-group

```java [ItemServiceImpl]
@Override
public void addAlbumFromDbToEs(Long albumId) {
  AlbumInfo albumInfo = albumInfoFeignClient.getAlbumInfo(albumId);
  if (albumInfo == null) {
    throw new GuiguException(201, "专辑不存在");
  }
  AlbumInfoIndex albumInfoIndex = new AlbumInfoIndex();
  albumInfoIndex.setId(albumInfo.getId());
  albumInfoIndex.setAlbumTitle(albumInfo.getAlbumTitle());
  albumInfoIndex.setAlbumIntro(albumInfo.getAlbumIntro());
  // 查询作者名字
  UserInfo userInfo = userInfoFeignClient.getUserInfo(albumInfo.getUserId());
  if (null == userInfo) {
    albumInfoIndex.setAnnouncerName(albumInfo.getUserId().toString());
  } else {
    albumInfoIndex.setAnnouncerName(userInfo.getNickname());
  }
  albumInfoIndex.setCoverUrl(albumInfo.getCoverUrl());
  albumInfoIndex.setIncludeTrackCount(albumInfo.getIncludeTrackCount());
  albumInfoIndex.setIsFinished(albumInfo.getIsFinished().toString());
  albumInfoIndex.setPayType(albumInfo.getPayType());
  albumInfoIndex.setCreateTime(new Date());
  // 查询分类信息
  BaseCategoryView baseCategoryView = categoryFeignClient.getBaseCategoryView(albumInfo.getCategory3Id());
  albumInfoIndex.setCategory1Id(baseCategoryView.getCategory1Id());
  albumInfoIndex.setCategory2Id(baseCategoryView.getCategory2Id());
  albumInfoIndex.setCategory3Id(albumInfo.getCategory3Id());
  // 查询专辑统计信息
  Map<String, Integer> albumStatInfo = albumInfoFeignClient.getAlbumStatInfo(albumId);
  albumInfoIndex.setPlayStatNum(albumStatInfo.get(SystemConstant.ALBUM_STAT_PLAY));
  albumInfoIndex.setSubscribeStatNum(albumStatInfo.get(SystemConstant.ALBUM_STAT_SUBSCRIBE));
  albumInfoIndex.setBuyStatNum(albumStatInfo.get(SystemConstant.ALBUM_STAT_BROWSE));
  albumInfoIndex.setCommentStatNum(albumStatInfo.get(SystemConstant.ALBUM_STAT_COMMENT));
  albumInfoIndex.setHotScore(0d);
  // 查询专辑标签
  List<AlbumAttributeValue> albumAttributeValues = albumInfoFeignClient.getAlbumAttributeValue(albumId);
  List<AttributeValueIndex> attributeValueIndexList = albumAttributeValues.stream().map(albumAttributeValue -> {
    AttributeValueIndex attributeValueIndex = new AttributeValueIndex();
    attributeValueIndex.setAttributeId(albumAttributeValue.getAttributeId());
    attributeValueIndex.setValueId(albumAttributeValue.getValueId());
    return attributeValueIndex;
  }).collect(Collectors.toList());
  albumInfoIndex.setAttributeValueIndexList(attributeValueIndexList);
  albumInfoIndexDao.save(albumInfoIndex);
}

@Override
public void removeAlbumFromEs(Long albumId) {
  albumInfoIndexDao.deleteById(albumId);
}
```

:::

## 查询一级分类下排序最靠前的 7 个分类

![image-20240720100115692](05-AlbumSearch.assets/image-20240720100115692.png)

在首页的轮播图下面，有当前一级分类下的排序最靠前的七个三级分类

::: code-group

```java [BaseCategoryApiController]
@GetMapping("/findTopBaseCategory3/{category1Id}")
public Result<List<BaseCategory3>> findTopBaseCategory3(@PathVariable("category1Id") Long category1Id) {
  return Result.ok(baseCategoryService.findTopBaseCategory3(category1Id));
}
```

```java [BaseCategoryServiceImpl]
@Override
public List<BaseCategory3> findTopBaseCategory3(Long category1Id) {
  List<BaseCategory2> category2List = baseCategory2Mapper.selectList(new LambdaQueryWrapper<BaseCategory2>().eq(BaseCategory2::getCategory1Id, category1Id));
  List<Long> category2IdList = category2List.stream().map(BaseEntity::getId).toList();
  return baseCategory3Mapper.selectPage(new Page<>(1, 7), new LambdaQueryWrapper<BaseCategory3>()
                                        .in(BaseCategory3::getCategory2Id, category2IdList)
                                        .orderByAsc(BaseCategory3::getOrderNum)
                                       ).getRecords();
}
```

:::

## 查询一级分类下所有三级分类

::: code-group

```java [BaseCategoryApiController]
@GetMapping("/getBaseCategoryList/{category1Id}")
public Result<List<BaseCategory3>> getBaseCategoryList(@PathVariable("category1Id") Long category1Id) {
  return Result.ok(baseCategoryService.getBaseCategoryListById(category1Id));
}
```

```java []
@Override
public List<BaseCategory3> getBaseCategoryListById(Long category1Id) {
  List<BaseCategory2> category2List = baseCategory2Mapper.selectList(new LambdaQueryWrapper<BaseCategory2>().eq(BaseCategory2::getCategory1Id, category1Id));
  List<Long> category2IdList = category2List.stream().map(BaseEntity::getId).toList();
  return baseCategory3Mapper.selectList(new LambdaQueryWrapper<BaseCategory3>()
                                        .in(BaseCategory3::getCategory2Id, category2IdList)
                                        .orderByAsc(BaseCategory3::getOrderNum)
                                       );
}
```

:::

## 查询首页分类和专辑数据

![](05-AlbumSearch.assets/tingshu056.png)

在首页的布局上，顶部是一个搜索框，往下是一排可左右滑动的一级分类，这里将其定义为“频道”。每个频道下有对应的数据，包括频道中最火的七个三级分类（上面已实现该接口）和这些三级分类对应的最火的专辑

### 功能设计

用户来到首页，点击不同频道，返回该频道下排序靠前的三级分类和该分类对应的专辑信息

### 表结构设计

理论上来说，我们需要先从 `base_category3` 中获取该一级分类对应的三级分类信息，然后在根据三级分类从 `album_info` 中获取对应的专辑信息。但在前面我们已经实现了把所有专辑数据存入 ES 的功能，那么我们就可以直接从 ES 中获取，而无需从数据库中查询，缓解数据库压力！

综上说述，我们只需要根据 `category1Id` 从 `base_category3` 中查询对应的三级分类即可！

### 代码实现

::: code-group

```java [SearchApiController]
@GetMapping("/channel/{category1Id}")
public Result channel(@PathVariable("category1Id") Long category1Id) {
  return Result.ok(searchService.channel(category1Id));
}
```

```java [SearchServiceImpl]
@SneakyThrows
@Override
public Object channel(Long category1Id) {
  // 根据一级分类获取前7个三级分类数据
  List<BaseCategory3> category3List = categoryFeignClient.getBaseCategory3(category1Id);
  Map<Long, BaseCategory3> category3Map = category3List.stream().collect(Collectors.toMap(
    BaseEntity::getId,
    value -> value
  ));
  List<FieldValue> termList = category3List.stream().map(
    baseCategory3 -> new FieldValue.Builder().longValue(baseCategory3.getId()).build()
  ).collect(Collectors.toList());
  // 拼接条件
  SearchRequest.Builder builder = new SearchRequest.Builder();
  builder.index("albuminfo");
  // 将这7个分类作为查询条件，类似MySQL的in
  // 将满足的结果分桶，类似group by（每个三级分类只取前六条数据）
  builder.aggregations("aggCategory3Id",
                       fn -> fn.terms(t -> t.field("category3Id"))
                       .aggregations("aggHotScore",
                                     subFn -> subFn.topHits(top -> top.sort(
                                       s -> s.field(f -> f.field("hotScore").order(SortOrder.Desc))
                                     )))
                      );
  builder.query(query -> query.terms(
    terms -> terms.field("category3Id").terms(fn -> fn.value(termList))
  ));
  // 查出结果
  SearchResponse<AlbumInfoIndex> response = elasticsearchClient.search(builder.build(), AlbumInfoIndex.class);
  Aggregate aggregate = response.aggregations().get("aggCategory3Id");
  return aggregate.lterms().buckets().array().stream().map(buck -> {
    JSONObject result = new JSONObject();
    long category3Id = buck.key();
    result.put("baseCategory3", category3Map.get(category3Id));
    List<AlbumInfoIndex> albumInfoIndexList = buck.aggregations().get("aggHotScore").topHits().hits().hits().stream().map(
      subBuk -> subBuk.source().to(AlbumInfoIndex.class))
      .toList();
    result.put("list", albumInfoIndexList);
    return result;
  });
}
```

:::

## 首页搜索

![](05-AlbumSearch.assets/检索-关键字搜索-17055730237394.gif)

### 基础搜索

至此，我们已经把首页搜索框以下部分完成了，现在来看搜索框功能的实现。前端传入一个 **AlbumIndexQuery** 对象，后端根据这个对象，构建 ES 查询条件，从 ES 中取出符合条件的数据构建成一个 **AlbumSearchResponseVo** 对象返回给前端

::: code-group

```java [SearchApiController]
@PostMapping
public Result search(@RequestBody AlbumIndexQuery albumIndexQuery) {
  return Result.ok(searchService.search(albumIndexQuery));
}
```

```java [SearchServiceImpl]
@SneakyThrows
@Override
public Object search(AlbumIndexQuery albumIndexQuery) {
  // 先构建查询参数
  SearchRequest request = buidQueryParams(albumIndexQuery);
  // ES查询
  SearchResponse<AlbumInfoIndex> response = elasticsearchClient.search(request, AlbumInfoIndex.class);
  // 提取AlbumSearchResponseVo对象
  AlbumSearchResponseVo searchResult = getSearchResult(response);
  // 设置页码相关属性
  searchResult.setPageNo(albumIndexQuery.getPageNo());
  Integer pageSize = albumIndexQuery.getPageSize();
  searchResult.setPageSize(pageSize);
  Long total = searchResult.getTotal();
  searchResult.setTotalPages(total % pageSize == 0 ? total / pageSize : total / pageSize + 1);
  return searchResult;
}

private SearchRequest buidQueryParams(AlbumIndexQuery albumIndexQuery) {
  SearchRequest.Builder builder = new SearchRequest.Builder();
  // 设置索引
  builder.index("albuminfo");

  BoolQuery.Builder boolQuery = new BoolQuery.Builder();
  // 获取关键词
  String keyword = albumIndexQuery.getKeyword();
  // 构建查询条件
  if (StringUtils.isNotBlank(keyword)) {
    boolQuery.should(s1 -> s1.match(m -> m.field("albumTitle").query(keyword)))
      .should(s2 -> s2.match(m -> m.field("albumIntro").query(keyword)));
  }
  Long category1Id = albumIndexQuery.getCategory1Id();
  if (category1Id != null) {
    boolQuery.filter(f -> f.term(t -> t.field("category1Id").value(category1Id)));
  }
  Long category2Id = albumIndexQuery.getCategory2Id();
  if (category2Id != null) {
    boolQuery.filter(f -> f.term(t -> t.field("category2Id").value(category2Id)));
  }
  Long category3Id = albumIndexQuery.getCategory3Id();
  if (category3Id != null) {
    boolQuery.filter(f -> f.term(t -> t.field("category3Id").value(category3Id)));
  }
  List<String> attributeList = albumIndexQuery.getAttributeList();
  if (attributeList != null && !attributeList.isEmpty()) {
    attributeList.forEach(attribute -> {
      String[] attrs = attribute.split(":");
      boolQuery.filter(f -> f.nested(nested -> nested
                                     .path("attributeValueIndexList")
                                     .query(query -> query.bool(bool -> bool
                                                                .must(m -> m.term(t -> t.field("attributeValueIndexList.attributeId").value(attrs[0])))
                                                                .must(m -> m.term(t -> t.field("attributeValueIndexList.valueId").value(attrs[1])))))
                                     .scoreMode(ChildScoreMode.None)
                                    ));
    });
  }

  builder.query(boolQuery.build()._toQuery());
  // 设置分页属性
  Integer pageNo = albumIndexQuery.getPageNo();
  Integer pageSize = albumIndexQuery.getPageSize();
  builder.from((pageNo - 1) * pageSize);
  builder.size(pageSize);
  // 设置排序
  String order = albumIndexQuery.getOrder();
  if (StringUtils.isNotEmpty(order)) {
    String[] orders = order.split(":");
    switch (orders[0]) {
      case "1" -> builder.sort(sort -> sort.field(f -> f.field("hotScore").order(getSort(orders[1]))));
      case "2" -> builder.sort(sort -> sort.field(f -> f.field("playStatNum").order(getSort(orders[1]))));
      case "3" -> builder.sort(sort -> sort.field(f -> f.field("subscribeStatNum").order(getSort(orders[1]))));
    }
  }
  // 高亮
  builder.highlight(high -> high.fields("albumTitle", fn -> fn.preTags("<font style=color:red>").postTags("</font>")));
  return builder.build();
}

private SortOrder getSort(String order) {
  String lowerCase = order.toLowerCase();
  if ("desc".equals(lowerCase)) {
    return SortOrder.Desc;
  } else if ("asc".equals(lowerCase)) {
    return SortOrder.Asc;
  } else {
    return null;
  }
}

private AlbumSearchResponseVo getSearchResult(SearchResponse<AlbumInfoIndex> response) {
  AlbumSearchResponseVo result = new AlbumSearchResponseVo();
  // 获取命中的数据
  List<AlbumInfoIndexVo> albumInfoIndexList = response.hits().hits().stream().map(albumInfoIndexHit -> {
    AlbumInfoIndexVo albumInfoIndexVo = new AlbumInfoIndexVo();
    AlbumInfoIndex albumInfoIndex = albumInfoIndexHit.source();
    Map<String, List<String>> highlight = albumInfoIndexHit.highlight();
    if (highlight != null && !highlight.isEmpty()) {
      List<String> albumTitleList = highlight.get("albumTitle");
      if (albumTitleList != null && !albumTitleList.isEmpty()) {
        String title = "";
        for (String albumTitle : albumTitleList) {
          title += albumTitle;
        }
        albumInfoIndex.setAlbumTitle(title);
      }
    }
    BeanUtils.copyProperties(albumInfoIndex, albumInfoIndexVo);
    return albumInfoIndexVo;
  }).toList();
  result.setList(albumInfoIndexList);
  result.setTotal(response.hits().total() != null ? response.hits().total().value() : 0);
  return result;
}
```

:::

### 自动补全

搜索的基本功能有了，接下来实现一个搜索的附加功能——自动补全：

![](05-AlbumSearch.assets/检索-关键字自动补全.gif)

这里的自动补全原理很简单：在将数据存入 ES 的时候，也存入一些附加的自动补全信息，比如拼音首字母、拼音、关键字。那么这里只针对专辑名称、作者姓名和专辑简介三个字段进行自动补全，首先要做的就是在添加专辑信息到 ES 时，将这个三个字段的附加的自动补全信息也添加进去：

::: code-group

```java [ItemServiceImpl]
@Override
public void addAlbumFromDbToEs(Long albumId) {
  AlbumInfo albumInfo = albumInfoFeignClient.getAlbumInfo(albumId);
  if (albumInfo == null) {
    throw new GuiguException(201, "专辑不存在");
  }
  ...
  albumInfoIndex.setAttributeValueIndexList(attributeValueIndexList);
  albumInfoIndexDao.save(albumInfoIndex);
  // 存储搜索提示词 // [!code ++]
  saveSuggestInfo(albumInfoIndex.getAlbumTitle()); // [!code ++]
  saveSuggestInfo(albumInfoIndex.getAlbumIntro()); // [!code ++]
  saveSuggestInfo(albumInfoIndex.getAnnouncerName()); // [!code ++]
}

private void saveSuggestInfo(String title) { // [!code ++]
  try { // [!code ++]
    SuggestIndex suggestIndex = new SuggestIndex(); // [!code ++]
    suggestIndex.setId(UUID.randomUUID().toString().replaceAll("-", "")); // [!code ++]
    suggestIndex.setTitle(title); // [!code ++]
    suggestIndex.setKeyword(new Completion(new String[]{title})); // [!code ++]
    suggestIndex.setKeywordPinyin(new Completion(new String[]{PinYinUtils.toHanyuPinyin(title)})); // [!code ++]
    suggestIndex.setKeywordSequence(new Completion(new String[]{PinYinUtils.getFirstLetter(title)})); // [!code ++]
    suggestIndexDao.save(suggestIndex); // [!code ++]
  } catch (Exception e) { // [!code ++]
    e.printStackTrace(); // [!code ++]
  } // [!code ++]
} // [!code ++]
```

```java [SearchApiController]
@GetMapping("/completeSuggest/{keywords}")
public Result completeSuggest(@PathVariable(value = "keywords") String keywords) {
  return Result.ok(searchService.completeSuggest(keywords));
}
```

```java [SearchServiceImpl]
@SneakyThrows
@Override
public Object completeSuggest(String keywords) {
  SearchRequest.Builder builder = new SearchRequest.Builder();
  builder.index("suggestinfo");
  builder.suggest(s1 -> s1
                  .suggesters("suggestKeyword", s2 -> s2
                              .prefix(keywords)
                              .completion(s3 -> s3.field("keyword")       // 指定匹配的域
                                          .size(10)                           // 指定匹配的数量
                                          .skipDuplicates(true)               // 是否去重
                                          .fuzzy(s4 -> s4.fuzziness("auto"))  // 设置偏移量：2个
                                         )
                             )
                  .suggesters("suggestKeywordPinyin", s2 -> s2
                              .prefix(keywords)
                              .completion(s3 -> s3.field("keywordPinyin")
                                          .size(10)
                                          .skipDuplicates(true)
                                          .fuzzy(s4 -> s4.fuzziness("auto"))
                                         )
                             )
                  .suggesters("suggestKeywordSequence", s2 -> s2
                              .prefix(keywords)
                              .completion(s3 -> s3.field("keywordSequence")
                                          .size(10)
                                          .skipDuplicates(true)
                                          .fuzzy(s4 -> s4.fuzziness("auto"))
                                         )
                             )
                 );
  SearchResponse<SuggestIndex> response = elasticsearchClient.search(builder.build(), SuggestIndex.class);
  List<String> suggestKeyword = getSuggestResult(response.suggest().get("suggestKeyword"));
  List<String> suggestKeywordPinyin = getSuggestResult(response.suggest().get("suggestKeywordPinyin"));
  List<String> suggestKeywordSequence = getSuggestResult(response.suggest().get("suggestKeywordSequence"));
  return Stream.of(suggestKeyword, suggestKeywordPinyin, suggestKeywordSequence)
    .filter(Objects::nonNull).flatMap(Collection::stream).collect(Collectors.toSet())
    .stream().limit(10).collect(Collectors.toList());
}

private List<String> getSuggestResult(List<Suggestion<SuggestIndex>> suggestKeyword) {
  return suggestKeyword.get(0).completion().options()
    .stream().map(s -> s.source().getTitle())
    .collect(Collectors.toList());
}
```

:::
