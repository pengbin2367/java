# Kafka 任务

Kafka 在本项目中实际上只有专辑的上下架使用了（等于只是为了用而用），但是每个服务都配置了 kafka 相关配置，你也可以把 RabbitMQ 相关任务根据两者特性转换为使用 Kafka 实现

## 专辑上下架

::: code-group

```yaml [service-album-dev]
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      retries: 3  #设置大于0的值，则客户端会将发送失败的记录重新发送
      acks: 1
      batch-size: 16384
      buffer-memory: 33554432
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: service-album
      enable-auto-commit: true
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
```

```yaml [service-search-dev]
 spring:
 	kafka:
    bootstrap-servers: localhost:9092
    producer:
      #设置大于0的值，则客户端会将发送失败的记录重新发送
      retries: 3
      # ack应答机制，默认1，即只需要确认leader收到消息
      acks: 1
      # 同一批次内存大小（默认16K）
      batch-size: 16384
      # 生产者内存缓存区大小(32M)
      buffer-memory: 33554432
      # key和value的序列化（默认，可以不设置）
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: service-search
      enable-auto-commit: true
      # earliest：从头开始消费   latest：从最新的开始消费   默认latest
      auto-offset-reset: earliest
      # key和value反序列化（默认，可以不设置）
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
```

```java [AlbumUpOrDownConsumer]
@Component
@Slf4j
public class AlbumUpOrDownConsumer {

    @Autowired
    private ItemService itemService;

    @KafkaListener(topics = KafkaConstant.QUEUE_ALBUM_UPPER)
    public void albumUpConsumer(ConsumerRecord<String, String> consumerRecord) {
        log.info("kafka收到消息：{}", consumerRecord.key());
        itemService.addAlbumFromDbToEs(Long.valueOf(consumerRecord.value()));
    }

    @KafkaListener(topics = KafkaConstant.QUEUE_ALBUM_LOWER)
    public void albumDownConsumer(ConsumerRecord<String, String> consumerRecord) {
        log.info("kafka收到消息：{}", consumerRecord.key());
        itemService.removeAlbumFromEs(Long.valueOf(consumerRecord.value()));
    }
}
```

:::

关于 `addAlbumFromDbToEs` 和 `removeAlbumFromEs` 的具体实现参考 `service-search` 模块的 [专辑数据从 DB 写入写出 ES](./05-AlbumSearch#专辑数据从DB写入写出ES)