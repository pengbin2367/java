# 集合面试题

## Java 集合框架是什么？说出集合框架的一些优点

每种编程语言中都有集合，最初的 Java 版本包含的集合类有：Vector、Stack、HashTable 和 Arrays。随着集合的广泛使用，Java2 提出了攘括所有集合接口和实现类、算法的集合框架。

在保证线程安全的情况下使用泛型和并发集合类，Java 已经经历了很久。集合框架的部分优点如下：

1. 使用核心集合类降低开发成本，而非实现我们自己的集合类
2. 使用经过严格测试的集合框架类，代码质量会得到提高
3. 通过使用 JDK 自带的集合类，可以降低代码维护成本
4. 服用型和可操作性

详情参考 [Java 集合框架概述](/basic/collection/CollectionIntro)

## 集合接口的常见实现类

### List 接口的实现类

List 接口常用的实现类有 ArrayList、LinkedList 和 Vector：

- ArrayList 实现了可变的数组，可以根据索引位置对集合进行快速的随机访问
- LinkedList 采用链表保存结构对象，便于向集合中插入和删除对象，但如果将元素插入到集合的尾部，其实 ArrayList 远比 LinkedList 快
- Vector 也是 List 一个常见实现类，但是该类中大多数方法都加了 synchronized 关键字，因此相比 ArrayList 和 LinkedList，它在多线程访问时是线程安全的

### Set 接口的实现类

Set 接口的实现类常用的有 HashSet、TreeSet 而 LinkedHashSet，它们的特点是元素都不可重复：

- HashSet 底层是哈希表，遍历元素和添加顺序、大小顺序无关
- TreeSet 底层是红黑树，元素按照大小顺序存储和遍历
- LinkedHashSet 底层是哈希表+红黑树，遍历元素可以体现添加时顺序，顺序性是体现和 HashSet 不同之处

### Map 接口的实现类

Map 接口常用的实现类有 HashMap、TreeMap 和 LinkedHashMap，它们的 key 都不可重复（指的是容器中对于同一个 key 只会存在一个）：

- HashMap 也就是哈希表，底层是数组+链表+红黑树，遍历元素和添加顺序、大小顺序无关
- TreeMap 底层是红黑树，元素按照 key 大小顺序存储和遍历
- LinkedHashMap 底层是哈希表+双链表，遍历元素可以体现添加顺序

## List 和 Map 区别

在数据结构方面，List 存储的是单列数据的集合，而 Map 存储的是 key、value 类型的键值对数据集合。在数据存储方面，List 存储的数据是有序且可以重复的，而 Map 中存储的数据是无序（不用的子类也可以保证有序）且 key 值不会重复（value 值可以重复）

## List、Map、Set 三个接口，存取元素时，各有什么特点

List 和 Set 具有相似性，它们都是单列元素的集合，所以，它们有一个共同的父接口，叫 Collection.

Set 是无序且不可重复的，Set 取元素时，不能通过索引访问元素，只能通过 for 循环或者迭代器逐一遍历各个元素。

List 表示有先后顺序的集合，注意，不是那种按年龄、按大小、按价格之类的排序。当我们多次调用 add(Object e)方法时，每次加入的对象就像火车站买票有排队顺序一样，按先来后到的顺序排序。有时候，也可以插队，即调用 add(int index, Object e)方法，就可以指定当前对象在集合中的存放位置。一个对象可以被反复存储进 List 中，每调用一次 add 方法，这个对象就被插入进集合中一次，其实，并不是把这个对象本身存储进了集合，而是在集合中用一个索引变量指向这个对象，当这个对象被 add 多次时，即相当于集合中有多个索引指向了这个对象。List 除了通过迭代器逐一遍历各个元素，还可以调用 get(index x)来明确说明取第几个。

Map 和 List、Set 不同，它是双列的集合，用 put 方法存储一对 key/value，不能存储重复的 key。取则可以根据 key 获得相应的 value，即 get(Object key)返回值为 key 所对应的 value.另外，也可以获得所有的 key 的集合（map.keySet()），还可以获得所有的 value 的集合（map.values()），还可以获得 key 和 value 组合成的 Map.Entry 对象的集合（map.entrySet()）。

## 为什么 Map 接口不继承 Collection 接口

首先，Map 提供的是键值对映射，而 Collection 提供的是一组数据，并不是键值对映射。

其次，如果 Map 继承了 Collection 接口，那么所有实现了 Map 接口的类到底是用 Map 的键值对映射数据还是用 Collection 的一组数据呢，而且 Map 如果继承了 Collection 接口的话还违反了面向对象的接口分离原则。

## Iterator 和 ListIterator 之间有什么区别

1. 我们可以使用 Iterator 来遍历 Set 和 List 集合，而 ListIterator 只能遍历 List
2. Iterator 只可以向前遍历，而 ListIterator 可以双向遍历
3. ListIterator 从 Iterator 接口继承，然后添加了一些额外的功能，比如添加一个元素、替换一个元素、获取前面或后面元素的索引位置

## 集合框架中的泛型有什么优点

- 类型安全

  通过使用泛型定义的变量的类型限制，编译器可以在非常高的层次上验证类型假设。没有泛型，这些假设就只能在程序员编码时候去考虑了

- 消除强制类型转换

  消除源代码中的许多强制类型转换，这使得代码更加可读，并且减少了出错机会

- 更高的效率

  在非泛型编程中，将简单类型作为引用类型传递时会引起 `装箱` 和 `拆箱` 操作，这两个过程都是具有很大开销的。引入泛型后，就不必进行装箱和拆箱操作了，所以运行效率相对较高

## Map 接口提供了哪些不同的集合视图

Map 接口提供了三个集合视图：

1. Set keySet()

   返回 map 中包含的所有 key 的一个 Set 视图。此 Set 集合是受 Map 支持的，Map 的变化会在集合中反应出来，反之亦然。当一个迭代器正在遍历一个此 Set 集合时，若 Map 被修改了（除迭代器自身的移除操作以外），迭代器的结果会变为不确定。此 Set 集合支持元素查找和删除，从此 Set 中删除元素会从 Map 中移除对应的映射，它不支持 add 和 addAll 添加操作

2. Collection values()

   返回一个 Map 中包含的所有 value 的一个 Collection 视图。这个 Collection 受 Map 支持，Map 的变化会在 Collection 中反应出来，反之亦然。当一个迭代器正在遍历此 Collection 时，若 Map 被修改了（除迭代器自身的移除操作以外），迭代器的结果会变为不确定。此 Collection 集合支持元素查找和删除，从此 Collection 中删除元素会从 Map 中移除对应的映射，它不支持 add 和 addAll 添加操作

3. Set entrySet()

   返回一个 Map 中包含的所有映射的一个 Set 集合视图。这个 Set 集合受 Map 支持，Map 的变化会在 Collection 中反应出来，反之亦然。当一个迭代器正在遍历一个此 Set 集合时，若 Map 被修改了（除迭代器自身的移除操作以外，以及对迭代器返回的 entry 进行 setValue 外），迭代器的结果会变为未定义。此 Set 集合支持元素查找和删除，从此 Set 中删除元素会从 Map 中移除对应的映射，它不支持 add 和 addAll 添加操作

## JDK7 HashMap

详情参考 [深入 Java 集合系列之——HashMap](/basic/collection/CollectionOfHashMap)

## JDK8 HashMap

详情参考 [深入 Java 集合系列之——HashMap](/basic/collection/CollectionOfHashMap)

## JDK8 中的 HashMap 为什么要使用红黑树

当元素个数小于阈值（8）时，链表整体的插入查询效率要高于红黑树，但当元素个数大于此阈值时，链表整体的插入查询效率要低于红黑树。

## JDK8 中的 HashMap 什么时候将链表转化为红黑树

当发现链表中的元素个数大于 8 之后，还会判断当前数组的长度，如果数组长度小于 64 时，此时不会转化为红黑树，而是进行扩容。只有当链表中的元素个数大于 8，并且数组的长度大于等于 64 时才会将链表转为红黑树。

上面扩容的原因是，如果数组长度还比较小，就先利用扩容来缩小链表的长度。

## JDK7 与 JDK8 中的 HashMap 的不同点

- JDK8 中使用来红黑树

- JDK7 中链表的插入使用的是头插法，而 JDK8 使用的尾插法

  头插法速度更快，无需遍历链表，但是在多线程扩容的情况下使用头插法会出现循环链表的问题，导致 CPU 飙升。而在 JDK8 中，反正要去计算链表当前节点的个数，需要遍历链表，因此直接使用尾插法

- JDK7 的 Hash 算法比 JDK8 更复杂

  Hash 算法越复杂，生成的 hashcode 则越散列，那么 HashMap 中的元素则更散列，更散列则 HashMap 的查询性能更好，JDK7 中没有红黑树，所以只能优化 Hash 算法使得元素更散列，而 JDK8 中增加了红黑树，查询性能得到了保障，所以可以简化一下 Hash 算法，毕竟 Hash 算法越复杂就越消耗 CPU

- 扩容的过程中 JDK7 中有可能会重新对 key 进行哈希（重新 Hash 跟哈希种子有关系），而 JDK8 中没有这部分逻辑

- JDK8 中扩容的条件和 JDK7 中不一样，除开判断 size 是否大于阈值之外，JDK7 中还判断了 table [i] 是否为空，不为空的时候才会进行扩容，而 JDK8 中则没有该条件了

- JDK8 中还多了一个 API：putIfAbsent(key, value)

- JDK7 和 JDK8 扩容过程中转移元素的逻辑不一样，JDK7 是每次转移一个元素，JDK8 是先算出来当前位置上哪些元素在新数组的低位上，哪些在新数组的高位上，然后再一次性转移

## JDK7 ConcurrentHashMap

JDK7 ConcurrentHashMap 底层是由两层嵌套数组来实现的：

1. ConcurrentHashMap 对象中有一个属性 segments，类型为 Segment []
2. Segment 对象中有一个属性 table，类型为 HashEntry []

### put 流程

1. 当调用 ConcurrentHashMap 的 put 方法时，先根据 key 计算出对应的 Segment 的数组下标 j, 确定好当前 key, value 应该插入到哪个 Segment 对象中，如果 segment [j] 为空，则利用自旋锁的方式在 j 位置生成一个 Segment 对象
2. 然后调用 Segment 对象的 put 方法
   1. Segment 对象的 put 方法会先加锁，然后也根据 key 计算出对应的 HashEntry 数据下标 i, 然后将 key, value 封装为 HashEntry 对象放入该位置，此过程和 JDK7 的 HashMap 的 put 方法一样，然后解锁 🔓
   2. 在加锁过程中逻辑比较复杂，先通过自旋加锁，如果超过一定次数就会直接阻塞


## JDK8 ConcurrentHashMap

### put 流程

1. 当向 ConcurrentHashMap 中 put 一个 key, value 时，首先根据 key 计算对应的数组下标 i, 如果该位置没有元素，则通过自旋的方法去向该位置赋值。如果该位置有元素，则 synchronized 会加锁

2. 加锁成功之后，再判断该元素类型
   1. 如果是链表节点则进行添加节点到链表中
   2. 如果是红黑树则添加节点到红黑树中
3. 添加成功后，判断是否需要进行树化
4. addCount, 这个方法的意思是 ConcurrentHashMap 的元素个数加 1, 但是这个操作也是需要并发安全的，并且元素个数加 1 成功后，会继续判断是否要进行扩容。如果需要，则会进行扩容，所以这个方法很重要
5. 同时一个线程在 put 时如果发现当前 ConcurrentHashMap 正在进行扩容则会去帮组扩容

## JDK7 ConcurrentHashMap 如何保证并发

主要利用 Unsafe 操作 + ReentrantLock + 分段思想

主要使用了 Unsafe 操作中的：

- compareAndSwapObject：通过 CAS 的方式修改对象的属性
- putOrderedObject：并发安全的给数组某个位置赋值
- getObjectVolatile：并发安全的扩区数组某个位置元素

分段思想是为了提高 ConcurrentHashMap 的并发量，分段属越高则支持的最大并发量越高，程序员可以通过 concurrencyLevel 参数来指定并发量。ConcurrentHashMap 的内部类 Segment 就是用来表示某一个段的。

每个 Segment 就是一个小型的 HashMap, 当调用 ConcurrentHashMap 的 put 方法时，最终会调用到 Segment 的 put 方法，而 Segment 类继承了 ReentrantLock, 所以 Segment 自带可重入锁，当调用到 Segment 的 put 方法时，会先利用可重入锁加锁，加锁成功后再将待插入的 key, value 插入到小型 HashMap 中，插入完成后解锁。

## JDK8 ConcurrentHashMap 如何保证并发

主要利用 Unsafe 操作 + synchronized 关键字

Unsafe 操作的使用仍然和 JDk7 中类似，主要负责并发安全的修改对象属性或数组某个位置的值。

synchronized 主要负责在需要操作某个位置时进行加锁（该位置不为空），比如向某个位置的链表进行插入节点，向某个位置的红黑树插入节点

JDK8 中其实仍然有分段锁的思想，只不过 JDK7 中段数是可控制的，而 JDK8 中数组的每一个位置都有一把锁。