# Redis面试题

## Redis是AP的还是CP的

Redis是一个支持多种数据结构的内存数据库，它可以根据配置和使用方式在AP和CP之间做出选择。具体来说，Redis可以在不同场景下提供不同的一致性级别：

- 在默认情况下，Redis追求更高的性能和可用性，更倾向于AP模型（即可用性优先）。它使用主从复制和哨兵机制来实现高可用性，但在出现网络分区或节点故障时，可能会导致数据的不一致性