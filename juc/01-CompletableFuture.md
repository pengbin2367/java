# CompletableFuture

> ```java
> public class CompletableFuture<T> implements Future<T>, CompletionStage<T>
> ```

在Java8中，CompletableFuture提供了非常强大的Future的扩展功能，可以帮助我们简化异步编程，并提供了函数式编程的能力，可以通过回调的方式处理计算结果，也提供了转化和组合CompletableFuture的方法

它可能代表一个明确完成的Future,也可能代表一个完成阶段，它支持在计算完成以后触发一些函数或执行某些动作

## 四大静态方法

```java
public static CompletableFuture<Void> runAsync(Runnable runnable)
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

runAsync无返回值，适用于异步任务的一个单节点分支；而suppleAsync是有返回值的，适用于在一个异步任务的多节点分支上的起始节点。两者都还有一个接收线程池参数的重载方法，我们可以传入自定义的线程池。如果未指定Executor,默认使用Fork.JoinPool.commonPool

CompletableFuture优点：

- 异步任务结束时，会自动回调某个对象的方法
- 主线程设置好回调后，不再关心异步任务的执行，异步任务之间可以顺序执行
- 异步任务出错时，会自动回调某个对象的方法

