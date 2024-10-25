# JUC面试题

## 什么是线程池，线程池有哪些

线程池就是事先将多个线程对象放到一个容器中，当使用的时候就不用new线程而是直接从池中拿线程即可，节省了开辟子线程的时间，提高了代码的执行效率

在JDK的`java.util.concurrent.Executors`中提供了生成多种线程池的静态方法：

- newCachedThreadPool

  创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程。这种类型的线程池特点是：工作线程的创建数量几乎没有限制（其实也有限制，数目为Integer.MAX_VALUE），这样可灵活的往线程池中添加线程。如果长时间没有往线程池中提交任务，即如果工作线程空闲了指定的时间（默认1分钟），则该工作线程将自动终止。终止后，如果你又提交了新的任务，则线程池重新创建一个工作线程。在使用CachedThreadPool时，一定要注意控制任务的数量，否则，由于大量线程同时运行，很有可能造成系统瘫痪

- newFixedThreadPool

  创建一个指定工作线程数量的线程池。每当提交一个任务就创建一个工作线程，如果工作线程数量达到线程池初始的最大数，则将提交的任务存入当池队列中。FixedThreadPool是一个典型且优秀的线程池，它具有线程池提高程序效率和节省创建线程时所耗的开销的优点。但是，在线程池空闲时，即线程池中没有可运行的任务时，它不会释放工作线程，还会占用一定的系统资源

- newSingleThreadPool

  创建一个单线程化的Executor,即只创建唯一的工作者线程来执行任务，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序执行。如果这个线程异常结束，会有另一个取代它，保证顺序执行。单工作线程最大的特点是可保证顺序执行各个任务，并且在任意给定的时间不会有多个线程是活动的

- newScheduleThreadPool

  创建一个定长的线程池，而且支持定时的以及周期性的任务执行，例如延迟3秒执行

这四种线程池底层，全部是ThreadPoolExecutor对象的实现，阿里规范手册中规定线程池采用ThreadPoolExecutor自定义的，实际开发也是

## ThreadPoolExecutor对象有哪些参数，都有什么作用，怎么设定核心线程数和最大线程数，拒绝策略有哪些

共有7个参数：

### corePoolSize

核心线程数，在ThreadPoolExecutor中有一个与它相关的配置：allowCoreThreadTimeOut（默认false），当allowCoreThreadTimeOut为false时，核心线程会一直存活，哪怕是一直空闲着。而当其为true时，核心线程空闲时间超过keepAliveTime时会被回收

### maximumPoolSize

最大线程数，线程池能容纳的最大线程数，当线程池中的线程达到最大时，此时添加任务将会采用拒绝策略，默认的拒绝策略是抛出一个运行时错误（RejectedExecutionException）。值得一提的是，当初始化时用的工作队列为LinkedBlockingDeque时，这个值将无效

### keepAliveTime

存活时间，当非核心空闲超过这个时间将被回收，同时空闲核心线程是否回收受alloCoreThreadTimeOut影响

### unit

keepAliveTime的单位

### workQueue

任务队列，常用有三种：SynchronousQueue、LinkedBlockingDeque、ArrayBlockingQueue

### threadFactory

线程工厂，ThreadFactory是一个接口，用来创建worker。通过线程工厂可以对线程的一些属性进行定制，默认直接新建线程

### RejectedExecutionHandler

也是一个接口，只有一个方法，当线程池中的资源已经全部使用，添加新线程被拒绝时，会调用它的rejectedExecution方法，默认抛出一个运行时异常

### 线程池大小设置

1. 需要分析线程池执行的任务的特性：CPU密集型还是IO密集型
2. 每个任务执行的平均时长大概多少，这个任务的执行时长可能还跟任务处理逻辑是否设计到网络传输以及底层系统资源依赖有关系

如果是CPU密集型，主要是执行计算任务，响应时间很快，cpu一直在运行，这种任务cpu的利用率很高，那么线程数的配置应该根据cpu核心数来决定，cpu核心数=最大同时执行线程数，假如cpu核心数为4,那么服务器最多能同时执行4个线程。过多的线程会导致上下文切换反而使得效率降低。那线程池的最大线程数可以配置为cpu核心数+1

如果是IO密集型，主要是进行IO操作，执行IO操作的时间较长，这时cpu处于空闲状态，导致cpu利用率不高，这种情况下可以增加线程池的大小。可以结合线程的等待时长来做判断，等待时间越高，那么线程数也相对越多，一般可以配置为cpu核心数的两倍

一个公式：线程池设定最佳线程数目 = ( (线程池设定的线程等待时间 + 线程cpu时间) / 线程cpu时间  ) * cpu数目

这个公式的线程cpu时间是预估的程序单个线程在cpu上运行的时间（通常使用loadRunner测试大量运行次数求出平均值）

### 拒绝策略

#### AbortPolicy

直接抛出异常，默认策略

#### CallerRunsPolicy

用调用者所在的线程来执行任务

#### DiscardOldestPolicy

丢弃阻塞队列中最靠前的任务，并执行当前任务

#### DiscardPolicy

直接丢弃任务

当然也可以根据应用场景实现RejectedExecutionHandler接口，自定义饱和策略，如记录日志或持久化存储不能处理的任务

## 常见线程安全的并发容器有哪些

CopyOnWriteArrayList、CopyOnWriteArraySet采用写时复制实现线程安全

ConcurrentHashMap采用分段锁的方式实现线程安全

## Atomic原子类了解多少，原理是什么

Java中的java.util.concurrent.atomic包提供了一组原子类，用于在多线程环境中执行原子操作，而无需使用显式的锁。这些原子类使用特殊的cpu指令来确保操作的原子性，从而避免了使用锁带来的性能开销

这些原子类的实现依赖于底层硬件架构提供的原子操作指令。通常，这些指令在现代处理器上是硬件级别的支持，确保对内存的读写是原子的。这使得在不使用锁的情况下，可以在多线程环境中执行某些操作，而不会导致竞态条件（race conditions）

以下是一些常见的原子类以及它们的一些实现原理：

- AtomicInteger、AtomicLong、AtomicReference

  这些类使用compareAndSet（CAS）操作实现原子性。CAS是一种乐观锁定机制，它尝试原子的将一个值更新为新值，但只有在当前值等于预期值时才成功。否则，它会重新尝试。CAS操作是由处理器提供的原子性操作指令支持的

- AtomicBoolean

  也是使用CAS

- AtomicIntegerArray、AtomicLongArray、AtomicReferenceArray

  CAS too,但是应用于数组的特定位置

- AtomicIntegerFieldUpdater、AtomicLongFieldUpdater、AtomicReferenceFieldUpdater

  反射 + CAS

## synchronized底层实现是什么，lock底层是什么，有什么区别

### synchronized原理

方法级的同步是隐式，即无需通过字节码指令来控制的，它实现在方法调用和返回操作之中。JVM可以从方法常量池中的方法表结构（method_info Structure）中的ACC_SYNCHRONIZED访问标志区分一个方法是否同步方法。当方法调用时，调用指令将会检查方法的ACC_SYNCHRONIZED访问标志是否被设置，如果设置了，执行线程将先持有monitor（虚拟机规范中用的是管程一词），然后再执行方法，最后在方法完成（无论与否正常完成）时释放monitor

代码块的同步是利用monitorenter和monitorexit这两个字节码指令。它们分别位于同步代码块的开始和结束位置。当JVM执行到monitorenter指令时，当前线程试图获取monitor对象的所有权，如果未加锁或者已经被当前线程所持有，就把锁的计数器加1；当执行monitorexit指令时，锁计数器减1；当锁计数器为0时，该锁就被释放了。如果获取monitor对象失败，该线程则会进入阻塞状态，直到其他线程释放锁

### lock原理

Lock的存储结构：一个int类型状态值（用于锁的状态变更）、一个双向链表（用于存储等待中的线程）

Lock获取锁的过程：本质上是通过CAS来获取状态值修改，如果当场没获取到，会将该线程放在线程等待链表中

Lock释放锁的过程：修改状态值，调整等待链表

Lock大量使用CAS + 自旋，因此根据CAS特性，lock建议使用在低锁冲突的情况下

### 两者区别

1. Lock的加锁和解锁都是由Java代码配合native方法实现的，而synchronized都是由JVM管理的
2. 当一个线程使用synchronized获取锁时，若锁被其他线程占用着，那么当前只能被阻塞，直到成功获取锁。而Lock则提供超时锁和可中断等更加灵活的方式，在未能获取锁的条件下提供给一种退出的机制
3. 一个锁内部可以有多个Condition实例，即有多路条件队列，而synchronized只有一路条件队列；同样Condition也提供灵活的阻塞方式，在未获得通知之前可以通过中断线程以及设置等待时限等方式退出条件队列
4. synchronized对线程的同步仅提供独占模式，而lock既可以提供独占模式，也可以提供共享模式