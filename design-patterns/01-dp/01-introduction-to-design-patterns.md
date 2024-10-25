# 设计模式导论

## 什么是 GOF

在 1994 年，由 Erich Gamma、Richard Helm、Ralph Johnson 和 John Vlissides 
四人合著出版了一本名为 Design Patterns - Elements of Reusable Object-Oriented Software（中文译名：设计模式 - 可复用的面向对象软件元素） 的书，
该书首次提到了软件开发中设计模式的概念。

::: tip
设计模式的思想总结出来就是一句话： `对接口编程而不是对实现编程，优先使用对象组合而不是继承`
:::

## 设计模式总览
::: details 5+7+10
- 创建型模式（Creational Patterns）
  - 单例（Singleton）模式
  - 原型（Prototype）模式
  - 工厂方法（FactoryMethod）模式
  - 抽象工厂（AbstractFactory）模式
  - 建造者（Builder）模式
- 结构型模式（Structural Patterns）
  - 代理（Proxy）模式
  - 适配器（Adapter）模式
  - 桥接（Bridge）模式
  - 装饰（Decorator）模式
  - 外观（Facade）模式
  - 享元（Flyweight）模式
  - 组合（Composite）模式
  - 过滤器模式（Filter Pattern）
- 行为型模式（Behavioral Patterns）
  - 模板方法（Template Method）模式
  - 策略（Strategy）模式
  - 命令（Command）模式
  - 职责链（Chain of Responsibility）模式
  - 状态（State）模式
  - 观察者（Observer）模式
  - 中介者（Mediator）模式
  - 迭代器（Iterator）模式
  - 访问者（Visitor）模式
  - 备忘录（Memento）模式
  - 解释器（Interpreter）模式
  :::
  

我们可以通过一张组件的生命周期图来理解一下这三种分类：

![img](01-introduction-to-design-patterns.assets/img.png)

## 设计的 7 大原则

::: details 开闭原则-扩展新类而不是修改旧类
Open Closed Principle，OCP
- 软件实体应当对 `扩展开放`，对 `修改关闭`（Software entities should be open for extension，but closed for modification）
- 合成复用原则、里氏替换原则相辅相成，都是开闭原则的具体实现规范
:::

::: details 里氏替换原则-继承父类而不去改变父类
Liskov Substitution Principle，LSP
- 继承必须确保超类所拥有的性质在子类中仍然成立（Inheritance should ensure that any property proved about supertype objects also holds for subtype objects）
:::

::: details 依赖倒置原则-面向接口编程，而不是面向实现类
Dependence Inversion Principle，DIP
- 高层模块不应该依赖低层模块，两者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象（High level modules shouldnot depend upon low level modules.Both should depend upon abstractions.Abstractions should not depend upon details. Details should depend upon abstractions）
:::

::: details 单一职责原则-每个类只负责自己的事情，而不是变成万能
Single Responsibility Principle，SRP
- 一个类应该有且仅有一个引起它变化的原因，否则类应该被拆分（There should never be more than one reason for a class to change）
:::

::: details 接口隔离原则-各个类建立自己的专用接口，而不是建立万能接口
Interface Segregation Principle，ISP
- 一个类对另一个类的依赖应该建立在最小的接口上（The dependency of one class to another one should depend on the smallest possible interface）
:::

::: details 迪米特法则-无需直接交互的两个类，如果需要交互，使用中间者
Law of Demeter，LoD
- 最少知识原则（Least Knowledge Principle，LKP)
- 只与你的直接朋友交谈，不跟“陌生人”说话（Talk only to your immediate friends and not to strangers）

::: danger
过度使用迪米特法则会使系统产生大量的中介类，从而增加系统的复杂性，使模块之间的通信效率降低
:::

::: details 合成复用原则-优先组合，其次继承
Composite Reuse Principle，CRP
- 又叫组合/聚合复用原则（Composition/Aggregate Reuse Principle，CARP）
- 软件复用时，要尽量先使用组合或者聚合等关联关系来实现，其次才考虑使用继承关系来实现
:::