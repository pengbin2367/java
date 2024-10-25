# Redis持久化解决方案

## RDB

在指定的时间间隔内，将内存中的数据集快照写入磁盘的`dump.rdb`文件

:::code-groups

```redis [Redis6]
# 15min 1
# 5min 	100
# 1min 	10000
```

```redis [Redis7]
# 60min 1
# 5min 	100
# 1min 	10000
```

:::

### Redis.conf

```shell
# 将时间间隔修改为5秒内修改两次
save 5 2
# 将dump文件位置修改为/myredis/dumpfiles 【文件夹需要提前创建好】
dir /myredis/dumpfiles
# 指定dump文件名为dump6379.rdb 【主要服务于集群模式】
dbfilename dump6379.rdb
```

### 自动触发

按照配置文件中的save、dir和dbfilename生成dump文件

### 被动触发

`save`和`bgsave`命令都可以触发，但我们只能使用<font style="color: red; font-weight: bold; font-size: 24px">bgsave</font>（这是由于save指令在高并发情况下会阻塞当前Redis服务器，直到dump操作完成）

总的来说，有以下五种情况会触发RDB快照：

1. 配置文件中的快照配置
2. save/bgsave指令
3. flushall/flushdb（这种情况产生的只是一个空白的快照）
4. shutdown指令&未开启AOF
5. 主从复制时，主节点自动触发

## AOF

通过记录服务器更改命令的操作日志，来实现持久化（以追加的形式记录）

### 写回策略

Always：每次；精准

Everysec：每秒；丢失一秒数据

No：操作系统控制；可能丢失大量数据

## RDB + AOF

rdb文件是紧凑的二进制表示，相比于aof，在恢复时速度更快，并且可以进行文件压缩，占用磁盘空间小。但是实时性比较差，并且由于fork是在主进程进程，会降低Redis性能

aof具有更好的持久性，数据也更准确，并且文件是可阅读的Redis操作指令，可以人为修补。但是文件体积非常大，每次写指令都要追加，并且恢复速度相对较慢

因此可以采用RDB + AOF的方式，RDB进行全量备份，AOF进行增量备份

