# RabbitMQ任务

本项目中所有与RabbitMQ有关的具体任务都是在这里实现的！

## 初始化一个账户

初始化一个账户是在新用户微信登录注册时由`service-user`服务发送的一条消息，再由`service-account`服务进行消费，即`service-user`作为生产者，`service-account`作为消费者。

首先配置生产者的可靠性投递，也就是实现`RabbitTemplate.ReturnsCallback`接口（PS：项目中所有的生产者都开启了可靠性投递，但仅作为消息投递失败的日志打印，因此逻辑都类似）

然后再来配置生产者的交换机和队列，从`rabbitTemplate.convertAndSend("user_exchange", "user.account", userInfo.getId() + "");`可以知道：这条消息使用的交换机是`user_exchange`，l路由为`user.account`，消息内容发生的是字符串类型的`用户id`

那么生产者就配置完成了，接下来就是消费者消费这条消息了！

:::code-group

```yaml [service-user-dev]
spring:
  rabbitmq:
    virtual-host: /tingshu
    username: tingshu
    password: tingshu
    host: localhost
    port: 5672
    publisher-returns: true # 开启可靠性投递（消息没有到达队列时触发）
```

```java [UserRabbitReturnCallbackConfig]
@Slf4j
@Configuration
public class UserRabbitReturnCallbackConfig implements RabbitTemplate.ReturnsCallback {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init() {
        rabbitTemplate.setReturnsCallback(this);
    }

    @Override
    public void returnedMessage(ReturnedMessage returnedMessage) {
        Message message = returnedMessage.getMessage();
        String s = new String(message.getBody());
        log.info("消息没有抵达消息队列中，交换机为：{}，routingKey为：{}，内容为：{}，错误码为：{}，错误的原因是：{}",
                returnedMessage.getExchange(), returnedMessage.getRoutingKey(), s, returnedMessage.getReplyCode(), returnedMessage.getReplyText());
    }
}
```

```java [UserRabbitConfig]
@Configuration
public class UserRabbitConfig {

    @Bean("userExchange")
    public Exchange userExchange() {
        return ExchangeBuilder.directExchange("user_exchange").build();
    }

    @Bean("userQueue")
    public Queue userQueue() {
        return QueueBuilder.durable("user_queue").build();
    }

    @Bean
    public Binding userBinding(@Qualifier("userExchange") Exchange exchange, @Qualifier("userQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("user.account").noargs();
    }
}
```

:::

消费者要做的就是从`user_exchange`中的`user_queue`中取出这条消息，进行账户初始化操作，这里需要注意的有以下几点：

1. 配置文件中`spring.listener.simple.acknowledge-mode=manual`来开启手动确认消息
2. 在`RabbitListener`中通过`channel.basicAck(deliveryTag, false);`来手动确认消息，并且配置了首次消费失败放回队列进行二次消费，当二次消费失败才提交失败
3. 在这里，将账户初始化的具体实现放在了RabbitListener监听的方法中，实际你应该把它放在对应的Service中

:::code-group

```yaml [service-account-dev]
spring:
  rabbitmq:
    virtual-host: /tingshu
    username: tingshu
    password: tingshu
    host: localhost
    port: 5672
    listener:
      simple:
        acknowledge-mode: manual
```

```java [AccountInitConsumer]
@Slf4j
@Component
public class AccountInitConsumer {

    @Autowired
    private UserAccountService userAccountService;

    @RabbitListener(queues = "user_queue")
    public void accountInitConsumer(Channel channel, Message message) {
        MessageProperties messageProperties = message.getMessageProperties();
        // 消息编号
        long deliveryTag = messageProperties.getDeliveryTag();
        String msg = new String(message.getBody());
        log.info("account收到消息编号为：{}的消息内容：{}", deliveryTag, msg);
        try {
            // 确认消息，false=只确认当前的消息
            channel.basicAck(deliveryTag, false);
        } catch (IOException e) {
            log.error("消息【{}】消费失败", deliveryTag);
            try {
                if (messageProperties.getRedelivered()) {
                    log.error("消息【{}】两次消费失败，不再放回队列", deliveryTag);
                    channel.basicReject(deliveryTag, false);
                } else {
                    log.error("消息【{}】第一次消费失败，放回队列，进行重试", deliveryTag);
                    channel.basicReject(deliveryTag, true);
                }
            } catch (IOException ex) {
                log.error("请查看RabbitMQ服务器是否出问题");
            }
        }
        Long userId = Long.valueOf(msg);
        UserAccount account = userAccountService.getOne(new LambdaQueryWrapper<UserAccount>().eq(UserAccount::getUserId, userId));
        if (account != null) {
            return ;
        }
        UserAccount userAccount = new UserAccount();
        userAccount.setUserId(userId);
        BigDecimal init = new BigDecimal(0);
        userAccount.setTotalAmount(init);
        userAccount.setLockAmount(init);
        userAccount.setAvailableAmount(init);
        userAccount.setTotalIncomeAmount(init);
        userAccount.setTotalPayAmount(init);
        userAccountService.save(userAccount);
    }
}
```

:::

## 余额扣款

由`service-order`发送给`service-account`

`service-order`配置生产者可靠性投递、配置交换机和队列，从`rabbitTemplate.convertAndSend("order_pay_change", "order.pay", JSONObject.toJSONString(orderInfo));`可以知道：这条消息使用的交换机是`order_pay_change`，路由为`order.pay`，消息内容发生的是JSON类型的`订单信息`

:::code-group

```java [OrderRabbitReturnConfig]
@Slf4j
@Configuration
public class OrderRabbitReturnConfig implements RabbitTemplate.ReturnsCallback {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init() {
        rabbitTemplate.setReturnsCallback(this);
    }

    @Override
    public void returnedMessage(ReturnedMessage returnedMessage) {
        Message message = returnedMessage.getMessage();
        String s = new String(message.getBody());
        log.info("消息没有抵达消息队列中，交换机为：{}，routingKey为：{}，内容为：{}，错误码为：{}，错误的原因是：{}",
                returnedMessage.getExchange(), returnedMessage.getRoutingKey(), s, returnedMessage.getReplyCode(), returnedMessage.getReplyText());
    }
}
```

```java [OrderPayRabbitConfig]
@Configuration
public class OrderPayRabbitConfig {

    @Bean("orderPayExchange")
    public Exchange orderPayExchange() {
        return ExchangeBuilder.directExchange("order_pay_change").build();
    }

    @Bean("orderPayQueue")
    public Queue orderPayQueue() {
        return QueueBuilder.durable("order_pay_queue").build();
    }

    @Bean
    public Binding orderPayBinding(
            @Qualifier("orderPayExchange") Exchange exchange,
            @Qualifier("orderPayQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("order.pay").noargs();
    }
}
```

:::

`service-account`进行余额扣款操作：

1. 根据`orderNo`和`userId`在`user_account_detail`中找不到这笔订单的记录，表示这笔订单未处理，现在进行处理
2. 更新`user_account`中用户可用金额`available_amount`
3. 更新成功，在`user_account_detail`中新增这笔订单记录
4. 到这里，就已经扣款成功了，接下来就是通知其他服务进行对应操作了（参见[余额扣款成功](./12-RabbitMQJob#余额扣款成功)）

:::code-group

```java [OrderPayConsumer]
@Slf4j
@Component
public class OrderPayConsumer {

    @Autowired
    private UserAccountService userAccountService;

    @RabbitListener(queues = "order_pay_queue")
    public void orderPayConsumer(Channel channel, Message message) {
        MessageProperties messageProperties = message.getMessageProperties();
        // 消息编号
        long deliveryTag = messageProperties.getDeliveryTag();
        String msg = new String(message.getBody());
        log.info("account收到消息编号为：{}的消息内容：{}", deliveryTag, msg);
        try {
            userAccountService.decountUserAccount(msg);
            // 确认消息，false=只确认当前的消息
            channel.basicAck(deliveryTag, false);
        } catch (IOException e) {
            log.error("消息【{}】消费失败", deliveryTag);
            try {
                if (messageProperties.getRedelivered()) {
                    log.error("消息【{}】两次消费失败，不再放回队列", deliveryTag);
                    channel.basicReject(deliveryTag, false);
                } else {
                    log.error("消息【{}】第一次消费失败，放回队列，进行重试", deliveryTag);
                    channel.basicReject(deliveryTag, true);
                }
            } catch (IOException ex) {
                log.error("请查看RabbitMQ服务器是否出问题");
            }
        }
    }
}
```

```java [UserAccountServiceImpl]
@Override
public void decountUserAccount(String msg) {
  OrderInfo orderInfo = JSONObject.parseObject(msg, OrderInfo.class);
  String orderNo = orderInfo.getOrderNo();
  RLock lock = redissonClient.getLock("Order_User_Account_Lock_" + orderNo);
  lock.lock();
  try {
    Long userId = orderInfo.getUserId();
    UserAccountDetail userAccountDetail = userAccountDetailMapper.selectOne(new LambdaQueryWrapper<UserAccountDetail>()
                                                                            .eq(UserAccountDetail::getOrderNo, orderNo)
                                                                            .eq(UserAccountDetail::getUserId, userId));
    if (userAccountDetail != null) {
      return ;
    }
    BigDecimal orderAmount = orderInfo.getOrderAmount();
    int i = userAccountMapper.updateAvailableAmount(userId, orderAmount);
    if (i <= 0) {
      throw new GuiguException(201, "余额不足");
    }
    userAccountDetail = new UserAccountDetail();
    userAccountDetail.setUserId(userId);
    userAccountDetail.setTitle(orderInfo.getOrderTitle());
    userAccountDetail.setTradeType(SystemConstant.ACCOUNT_TRADE_TYPE_MINUS);
    userAccountDetail.setAmount(orderAmount);
    userAccountDetail.setOrderNo(orderNo);
    int insert = userAccountDetailMapper.insert(userAccountDetail);
    if (insert <= 0) {
      throw new GuiguException(201, "保存支付明细失败");
    }
    // 发通知
    //  1. service-order 	修改订单状态
    //  2. service-album 	增加购买次数
    //  3. service-search 	增加购买次数和热度值
    //  4. service-user 	记录用户的购买流水
    rabbitTemplate.convertAndSend("account_change", "", orderNo);
  } catch (Exception e) {
    throw e;
  } finally {
    lock.unlock();
  }
}
```

```java [UserAccountMapper]
@Update("update tingshu_account.user_account set available_amount = available_amount - #{money} where user_id = #{userId} and available_amount >= #{money} and is_deleted = 0")
int updateAvailableAmount(@Param("userId") Long userId, @Param("money") BigDecimal money);
```

:::

## 自动取消订单

由`service-order`发送给`service-order`，也就是order既是生产者又是消费者

作为生产者，这里需要使用延迟队列，因此请先确保你已经按照[准备工作](./01-GettingStart#RabbitMQ)安装了该插件

:::code-group

```java [OrderInfoDelayRabbitConfig]
@Configuration
public class OrderInfoDelayRabbitConfig {

    @Bean("orderNormalExchange")
    public Exchange orderNormalExchange() {
        return ExchangeBuilder.directExchange("order_normal_change").build();
    }

    @Bean("orderDeadQueue")
    public Queue orderDeadQueue() {
        return QueueBuilder.durable("order_dead_queue")
                .withArgument("x-dead-letter-exchange", "order_dead_change")
                .withArgument("x-dead-letter-routing-key", "order.normal")
                .build();
    }

    @Bean
    public Binding orderNormalBinding(
            @Qualifier("orderNormalExchange") Exchange exchange,
            @Qualifier("orderDeadQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("order.dead").noargs();
    }

    @Bean("orderDeadExchange")
    public Exchange orderDeadExchange() {
        return ExchangeBuilder.directExchange("order_dead_change").build();
    }

    @Bean("orderNormalQueue")
    public Queue orderNormalQueue() {
        return QueueBuilder.durable("order_normal_queue").build();
    }

    @Bean
    public Binding orderDeadBinding(
            @Qualifier("orderDeadExchange") Exchange exchange,
            @Qualifier("orderNormalQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("order.normal").noargs();
    }
}
```

```java [CancelOrderConsumer]
@Slf4j
@Component
public class CancelOrderConsumer {

    @Autowired
    private OrderInfoService orderInfoService;

    @RabbitListener(queues = "order_normal_queue")
    public void cancelOrderConsumer(Channel channel, Message message) {
        MessageProperties messageProperties = message.getMessageProperties();
        // 消息编号
        long deliveryTag = messageProperties.getDeliveryTag();
        String[] msg = new String(message.getBody()).split(":");
        try {
            // 确认消息，false=只确认当前的消息
            orderInfoService.cancelOrder(Long.valueOf(msg[0]), msg[1]);
            channel.basicAck(deliveryTag, false);
        } catch (IOException e) {
            log.error("消息【{}】消费失败", deliveryTag);
            try {
                if (messageProperties.getRedelivered()) {
                    log.error("消息【{}】两次消费失败，不再放回队列", deliveryTag);
                    channel.basicReject(deliveryTag, false);
                } else {
                    log.error("消息【{}】第一次消费失败，放回队列，进行重试", deliveryTag);
                    channel.basicReject(deliveryTag, true);
                }
            } catch (IOException ex) {
                log.error("请查看RabbitMQ服务器是否出问题");
            }
        }
    }
}
```

:::

## 余额扣款成功

在余额扣款成功之后，需要进行以下操作：

- service-order      修改订单状态	

- service-album 	增加购买次数

- service-search 	增加购买次数和热度值

- service-user 	    记录用户的购买流水

由`service-account`发送给`service-order`、`service-album`、`service-search`和`service-user`，一个生产者多个消费者，在这里就可以使用广播模式：

:::code-group

```java [AccountRabbitConfig]
@Configuration
public class AccountRabbitConfig {

    @Bean("accountExchange")
    public Exchange accountExchange() {
        return ExchangeBuilder.fanoutExchange("account_change").build();
    }

    @Bean("orderFanoutQueue")
    public Queue orderFanoutQueue() {
        return QueueBuilder.durable("order_fanout_queue").build();
    }

    @Bean
    public Binding orderFanoutBinding(@Qualifier("accountExchange") Exchange exchange, @Qualifier("orderFanoutQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("").noargs();
    }

    @Bean("albumFanoutQueue")
    public Queue albumFanoutQueue() {
        return QueueBuilder.durable("album_fanout_queue").build();
    }

    @Bean
    public Binding albumFanoutBinding(@Qualifier("accountExchange") Exchange exchange, @Qualifier("albumFanoutQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("").noargs();
    }

    @Bean("searchFanoutQueue")
    public Queue searchFanoutQueue() {
        return QueueBuilder.durable("search_fanout_queue").build();
    }

    @Bean
    public Binding searchFanoutBinding(@Qualifier("accountExchange") Exchange exchange, @Qualifier("searchFanoutQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("").noargs();
    }

    @Bean("userFanoutQueue")
    public Queue userFanoutQueue() {
        return QueueBuilder.durable("user_fanout_queue").build();
    }

    @Bean
    public Binding userFanoutBinding(@Qualifier("accountExchange") Exchange exchange, @Qualifier("userFanoutQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(exchange).with("").noargs();
    }
}
```

:::

### 修改订单状态

:::code-group

```java [OrderPaidConsumer]
@Slf4j
@Component
public class OrderPaidConsumer {

    @Autowired
    private OrderInfoService orderInfoService;

    @RabbitListener(queues = "order_fanout_queue")
    public void cancelOrderConsumer(Channel channel, Message message) {
        MessageProperties messageProperties = message.getMessageProperties();
        // 消息编号
        long deliveryTag = messageProperties.getDeliveryTag();
        String orderNo = new String(message.getBody());
        try {
            // 确认消息，false=只确认当前的消息
            orderInfoService.updateOrderInfo(orderNo);
            channel.basicAck(deliveryTag, false);
        } catch (IOException e) {
            log.error("消息【{}】消费失败", deliveryTag);
            try {
                if (messageProperties.getRedelivered()) {
                    log.error("消息【{}】两次消费失败，不再放回队列", deliveryTag);
                    channel.basicReject(deliveryTag, false);
                } else {
                    log.error("消息【{}】第一次消费失败，放回队列，进行重试", deliveryTag);
                    channel.basicReject(deliveryTag, true);
                }
            } catch (IOException ex) {
                log.error("请查看RabbitMQ服务器是否出问题");
            }
        }
    }
}
```

```java [OrderInfoServiceImpl]
@Override
public void updateOrderInfo(String orderNo) {
  OrderInfo orderInfo = getOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
  if (orderInfo == null) return ;
  Long userId = orderInfo.getUserId();
  RLock lock = redissonClient.getLock("Cancel_OrderInfo_UserId_" + userId + "_" + orderNo);
  lock.lock();
  try {
    if (orderInfo.getOrderStatus().equals(SystemConstant.ORDER_STATUS_PAID)) {
      // TODO 已支付，此时出现重复消费（同渠道消费两次，不同渠道分别消费一次）
    } else {
      // 已取消/未支付，将支付状态修改为已支付即可
      orderInfo.setOrderStatus(SystemConstant.ORDER_STATUS_PAID);
    }
    updateById(orderInfo);
  } catch (Exception e) {
    throw e;
  } finally {
    lock.unlock();
  }
}
```

:::

### 增加购买次数

:::code-group

```java [AlbumFanoutConsumer]
@Slf4j
@Component
public class AlbumFanoutConsumer {

    @Autowired
    private AlbumInfoService albumInfoService;

    @RabbitListener(queues = "album_fanout_queue")
    public void albumFanoutConsumer(Channel channel, Message message) {
        MessageProperties messageProperties = message.getMessageProperties();
        // 消息编号
        long deliveryTag = messageProperties.getDeliveryTag();
        String orderNo = new String(message.getBody());
        try {
            // 确认消息，false=只确认当前的消息
            albumInfoService.updateAlbumStat(orderNo);
            channel.basicAck(deliveryTag, false);
        } catch (IOException e) {
            log.error("消息【{}】消费失败", deliveryTag);
            try {
                if (messageProperties.getRedelivered()) {
                    log.error("消息【{}】两次消费失败，不再放回队列", deliveryTag);
                    channel.basicReject(deliveryTag, false);
                } else {
                    log.error("消息【{}】第一次消费失败，放回队列，进行重试", deliveryTag);
                    channel.basicReject(deliveryTag, true);
                }
            } catch (IOException ex) {
                log.error("请查看RabbitMQ服务器是否出问题");
            }
        }
    }
}
```

```java [AlbumInfoServiceImpl]
@Override
public void updateAlbumStat(String orderNo) {
  OrderInfo orderInfo = orderInfoFeignClient.getOrderInfo(orderNo);
  if (orderInfo == null) return ;
  String itemType = orderInfo.getItemType();
  if (SystemConstant.ORDER_ITEM_TYPE_ALBUM.equals(itemType)) {
    Long albumId = orderInfo.getOrderDetailList().get(0).getItemId();
    albumStatMapper.updateByOrder(albumId, 1, SystemConstant.ALBUM_STAT_BROWSE);
  } else if (SystemConstant.ORDER_ITEM_TYPE_TRACK.equals(itemType)) {
    Long trackId = orderInfo.getOrderDetailList().get(0).getItemId();
    int size = orderInfo.getOrderDetailList().size();
    TrackInfo trackInfo = trackInfoMapper.selectById(trackId);
    if (trackInfo == null) return ;
    albumStatMapper.updateByOrder(trackInfo.getAlbumId(), size, SystemConstant.ALBUM_STAT_BROWSE);
  }
}
```

```java [OrderInfoClientController]
@RestController
@RequestMapping("/client/order/orderInfo")
public class OrderInfoClientController {

    @Autowired
    private OrderInfoService orderInfoService;

    @GetMapping("/getOrderInfo/{orderNo}")
    public OrderInfo getOrderInfo(@PathVariable(value = "orderNo") String orderNo) {
        return orderInfoService.getOrderInfo(orderNo);
    }
}
```

```java [OrderInfoServiceImpl]
@Override
public OrderInfo getOrderInfo(String orderNo) {
  OrderInfo orderInfo = getOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
  if (orderInfo == null) return null;
  List<OrderDetail> orderDetail = orderDetailMapper.selectList(new LambdaQueryWrapper<OrderDetail>().eq(OrderDetail::getOrderId, orderInfo.getId()));
  orderInfo.setOrderDetailList(orderDetail);
  return orderInfo;
}
```

```java [AlbumStatMapper]
@Update("update tingshu_album.album_stat set stat_num = stat_num + #{num} where album_id = #{albumId} and stat_type = #{type} and is_deleted = 0")
void updateByOrder(@Param("albumId") Long albumId, @Param("num") int num, @Param("type") String type);
```

:::

### 增加购买次数和热度值

:::code-group

```java [SearchFanoutConsumer]
@Slf4j
@Component
public class SearchFanoutConsumer {

    @Autowired
    private ItemService itemService;

    @RabbitListener(queues = "search_fanout_queue")
    public void searchFanoutConsumer(Channel channel, Message message) {
        MessageProperties messageProperties = message.getMessageProperties();
        // 消息编号
        long deliveryTag = messageProperties.getDeliveryTag();
        String orderNo = new String(message.getBody());
        try {
            // 确认消息，false=只确认当前的消息
            itemService.updateAlbumBuyAndHotScore(orderNo);
            channel.basicAck(deliveryTag, false);
        } catch (IOException e) {
            log.error("消息【{}】消费失败", deliveryTag);
            try {
                if (messageProperties.getRedelivered()) {
                    log.error("消息【{}】两次消费失败，不再放回队列", deliveryTag);
                    channel.basicReject(deliveryTag, false);
                } else {
                    log.error("消息【{}】第一次消费失败，放回队列，进行重试", deliveryTag);
                    channel.basicReject(deliveryTag, true);
                }
            } catch (IOException ex) {
                log.error("请查看RabbitMQ服务器是否出问题");
            }
        }
    }
}
```

```java [ItemServiceImpl]
@Override
public void updateAlbumBuyAndHotScore(String orderNo) {
  OrderInfo orderInfo = orderInfoFeignClient.getOrderInfo(orderNo);
  if (orderInfo == null) return ;
  String itemType = orderInfo.getItemType();
  if (SystemConstant.ORDER_ITEM_TYPE_ALBUM.equals(itemType)) {
    Long albumId = orderInfo.getOrderDetailList().get(0).getItemId();
    Optional<AlbumInfoIndex> optional = albumInfoIndexDao.findById(albumId);
    if (optional.isPresent()) {
      AlbumInfoIndex albumInfoIndex = optional.get();
      albumInfoIndex.setHotScore(albumInfoIndex.getHotScore() + 10);
      albumInfoIndex.setBuyStatNum(albumInfoIndex.getBuyStatNum() + 1);
      albumInfoIndexDao.save(albumInfoIndex);
    }
  } else if (SystemConstant.ORDER_ITEM_TYPE_TRACK.equals(itemType)) {
    Long trackId = orderInfo.getOrderDetailList().get(0).getItemId();
    int size = orderInfo.getOrderDetailList().size();
    AlbumInfo albumInfo = albumInfoFeignClient.getAlbumInfoByTrackId(trackId);
    Long albumId = albumInfo.getId();
    Optional<AlbumInfoIndex> optional = albumInfoIndexDao.findById(albumId);
    if (optional.isPresent()) {
      AlbumInfoIndex albumInfoIndex = optional.get();
      albumInfoIndex.setHotScore(albumInfoIndex.getHotScore() + 10 * size);
      albumInfoIndex.setBuyStatNum(albumInfoIndex.getBuyStatNum() + size);
      albumInfoIndexDao.save(albumInfoIndex);
    }
  }
}
```

```java [AlbumInfoClientController]
@GetMapping("/getAlbumInfoByTrackId/{trackId}")
public AlbumInfo getAlbumInfoByTrackId(@PathVariable(value = "trackId") Long trackId) {
  TrackInfo trackInfo = trackInfoService.getById(trackId);
  return albumInfoService.getById(trackInfo.getAlbumId());
}
```

:::

### 记录用户的购买流水

:::code-group

```java []
```

```java []
```

:::

