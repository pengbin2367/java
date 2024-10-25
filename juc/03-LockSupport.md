# LockSupport与线程中断

[TOC]

## 什么是中断机制

首先，一个线程不应该由其他线程来强制中断或停止，而是`应该由自己自行停止`，自己来决定自己的命运。所以，Thread.stop/Thread.suspend/Thread.resume都已被废弃

其次，在Java中没有办法立即停止一条线程，然后停止线程却又非常重要。因此，Java提供了一种用于停止线程的协商机制——中断，即中断标识协商机制

> 中断只是一种协作协商机制，Java没有给中断增加任何语法，中断的过程完全需要程序员自己实现
>
> 如果需要中断一个线程，你需要手动调用该线程的interrupt方法，该方法也仅仅是将线程对象的中断标识设为true。接着你需要自己写代码不断地检测当前线程的标识位，如果为true,表示别的线程请求这条线程中断，此时究竟该做什么需要你自己写代码实现

## 中断机制三大方法

- public void interrupt()
  - 仅仅是设置线程的中断状态为true,发起一个协商而不会立刻停止线程
- public static boolean interrupted()
  - 判断线程是否被中断并清楚当前中断状态（如果连续两次调用此方法，则第二次返回false,也就是连续两次调用结果可能不一样）
- public boolean isInterrupted()
  - 通过检查中断标识位，判断当前线程是否被中断

 :::code-group

```java [volatile]
private static volatile boolean flag = false;
private static void interruptWithVolatile() {
    new Thread(() -> {
        while (true) {
            if (flag) {
                System.out.println("flag updated true");
                break;
            }
            System.out.println("a hello volatile");
        }
    }, "a").start();

    try {
        TimeUnit.MILLISECONDS.sleep(20);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }

    new Thread(() -> {
        flag = true;
    }, "b").start();
}
```

```java [AtomicBoolean]
private static final AtomicBoolean atomicBoolean = new AtomicBoolean(false);
private static void interruptWithAtomicBoolean() {
    new Thread(() -> {
        while (true) {
            if (atomicBoolean.get()) {
                System.out.println("atomicBoolean updated true");
                break;
            }
            System.out.println("a hello atomicBoolean");
        }
    }, "a").start();

    try {
        TimeUnit.MILLISECONDS.sleep(20);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }

    new Thread(() -> {
        atomicBoolean.set(true);
    }, "b").start();
}
```

```java [interruptApi]
private static void interruptApi() {
    Thread a = new Thread(() -> {
        while (true) {
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("isInterrupted updated true");
                break;
            }
            System.out.println("a hello isInterrupted");
        }
    }, "a");
    a.start();

    try {
        TimeUnit.MILLISECONDS.sleep(20);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }

    new Thread(a::interrupt, "b").start();
}
```

:::