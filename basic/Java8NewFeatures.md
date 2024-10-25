# Java8新特性

## **Lambda 表达式**

Lambda 表达式允许你以更简洁的方式传递代码块作为方法的参数或者定义内联的函数。

示例：

```java
// 传统方式
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello from a thread!");
    }
});

// 使用 Lambda 表达式
Thread thread = new Thread(() -> {
    System.out.println("Hello from a thread!");
});

thread.start();
```

## **Stream API**

Stream API 提供了一种流式处理集合数据的方式，可以进行过滤、映射、排序、归约等操作。

示例：

```java
List<String> names = Arrays.asList("John", "Doe", "Jane", "Smith");

// 使用 Stream 进行过滤和打印
names.stream()
     .filter(name -> name.startsWith("J"))
     .forEach(System.out::println);
```

## **函数式接口**

函数式接口是只有一个抽象方法的接口，通常与 Lambda 表达式一起使用。

示例：

:::code-group

```java [自定义]
// 定义一个函数式接口
@FunctionalInterface
interface MyFunction {
    void doSomething();
}

// 使用 Lambda 表达式实现接口
MyFunction func = () -> {
    System.out.println("Doing something...");
};

func.doSomething();
```

```java [有入参有出参]
Function<String, Integer> strLength = s -> s.length();
int length = strLength.apply("Hello"); // length = 5

Predicate<Integer> isPositive = n -> n > 0;
boolean result = isPositive.test(10); // result = true
```

```java [有入参无出参]
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hello"); // 输出：Hello
```

```java [无入参有出参]
Supplier<Double> randomValue = () -> Math.random();
double value = randomValue.get(); // 返回一个随机数
```

```java [无入参无出参]
Runnable task = () -> System.out.println("Task is running...");
task.run(); // 输出：Task is running...
```

:::

如何利用这些函数式接口串联一个程序呢？

:::code-group

```java [示例一]
// **************************示例一**************************
// 1. Supplier 生成数据
Supplier<Integer> randomSupplier = () -> (int) (Math.random() * 100);
int randomNumber = randomSupplier.get();
System.out.println("Generated number: " + randomNumber);

// 2. Predicate 验证数据
Predicate<Integer> isEvenPredicate = num -> num % 2 == 0;
boolean isEven = isEvenPredicate.test(randomNumber);
System.out.println(randomNumber + " is even: " + isEven);

// 3. Function 转换数据
Function<Integer, String> intToStringFunction = num -> "Number: " + num;
String numberString = intToStringFunction.apply(randomNumber);
System.out.println("Number as string: " + numberString);

// 4. Consumer 消费数据
Consumer<String> printConsumer = str -> System.out.println("Printing: " + str);
printConsumer.accept(numberString);

// ---------------------------输出---------------------------
Generated number: 66
66 is even: true
Number as string: Number: 66
Printing: Number: 66
```

```java [示例二]
// **************************示例二**************************
// 1. Supplier 生成数据
Supplier<Integer> randomSupplier = () -> (int) (Math.random() * 100);
int randomNumber = randomSupplier.get();
System.out.println("Generated number: " + randomNumber);

// 2. Predicate 验证数据
Predicate<Integer> isEvenPredicate = num -> num % 2 == 0;

// 3. Function 转换数据
Function<Integer, String> intToStringFunction = num -> "Number: " + num;

// 4. Consumer 消费数据并验证
Consumer<Integer> printAndValidateConsumer = num -> {
  // 验证数据
  boolean isValid = isEvenPredicate.test(num);
  System.out.println(num + " is even: " + isValid);

  // 消费数据
  String numberString = intToStringFunction.apply(num);
  System.out.println("Printing: " + numberString);
};

// 使用 Consumer 消费数据
printAndValidateConsumer.accept(randomNumber);

// ---------------------------输出---------------------------
Generated number: 66
66 is even: true
Printing: Number: 66
```

:::

## **方法引用**

方法引用提供了对现有方法的引用，可以简化 Lambda 表达式的使用。

示例：

```java
List<String> names = Arrays.asList("John", "Doe", "Jane", "Smith");

// 使用方法引用打印每个名字
names.forEach(System.out::println);
```

## **默认方法**

接口中可以包含默认方法的实现，这使得接口的扩展更加灵活，不会破坏现有实现。

示例：

```java
// 定义一个接口
interface MyInterface {
    default void hello() {
        System.out.println("Hello from MyInterface!");
    }
}

// 实现接口并调用默认方法
class MyClass implements MyInterface {
    public void myMethod() {
        hello(); // 调用默认方法
    }
}
```

## **Optional 类**

Optional 类可以包装可能为 null 的值，避免空指针异常，并提供了便捷的方法处理可能为空的情况。

示例：

```java
String name = null;
Optional<String> optionalName = Optional.ofNullable(name);

// 如果值存在，则打印长度，否则打印默认值
optionalName.ifPresentOrElse(
    n -> System.out.println("Length of name: " + n.length()),
    () -> System.out.println("Name is absent")
);
```

## **新的日期时间 API**

Java 8 引入了全新的日期时间 API，提供了更加丰富和易用的日期和时间处理功能。

示例：

```java
// 获取当前日期
LocalDate today = LocalDate.now();
System.out.println("Today's date: " + today);

// 日期加一天
LocalDate tomorrow = today.plusDays(1);
System.out.println("Tomorrow's date: " + tomorrow);
```

## **CompletableFuture 类**

CompletableFuture 类提供了一种简便的方式处理异步任务和回调。

示例：

```java
// 异步执行任务
CompletableFuture.supplyAsync(() -> "Hello")
                 .thenApplyAsync(result -> result + " World")
                 .thenAccept(System.out::println);
```

