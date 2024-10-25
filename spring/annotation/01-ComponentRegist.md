---
title: Spring注解驱动开发——组件注册
date: 2022-01-20 21:17:15
tags:
---

> - @Configuration：声明这是Spring的配置类
> - @Bean：给容器中注册组件
> - @ComponentScan：自动扫描配置
> - @Scope：设置组件作用域
> - @Lazy：bean懒加载
> - @Conditional：按照条件注册组件
> - @Import：给容器快速导入组件

## @Configuration

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration { ...... }
```

这是注解只能标在类上，通过这个注解告诉Spring这是一个配置类，我们以前在XML配置文件中配置的东西，都可以在这标了这个注解的类里面进行相对应的配置。

## @Bean

```xml
<bean id="person" class="com.atqingke.bean.Person">
	<property name="name" value="张三"/>
    <property name="age" value="23"/>
</bean>
```

这是我们之前在XML中要给容器中注册一个bean需要的配置，现在我们在配置类中通过@Bean注解也可以做到同样的效果：

```java
@Bean
public Person person() {
    return new Person("张三", 23);
}
```

我们通过在一个返回值类型为要注册的组件类型的方法上标注@Bean，给容器中注册一个id为方法名，即”person“的组件。当然，我们也可以为@Bean的value属性赋值，显式的赋予一个bean的id。

我们要测试效果也很简单，以前我们通过ClassPathXmlApplicationContext方法来给容器中注册所有组件，现在我们是使用注解驱动开发，因此我们使用AnnotationConfigApplicationContext方法。

```java
@Test
public void test() {
    ApplicationContext context = new AnnotationConfigApplicationContext(MainConfig.class);
    Person bean = context.getBean(Person.class);
    System.out.println(bean);
}
```

控制台输出信息：

```shell
Person{name='张三', age=23}
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

## @ComponentScan

我们可以通过ApplicationContext的getBeanDefinitionNames方法来查看所有在容器中注册的组件：

```java
@Test
public void test01() {
    ApplicationContext context = new AnnotationConfigApplicationContext(MainConfig.class);
    String[] definitionNames = context.getBeanDefinitionNames();
    for (String name : definitionNames) {
    	System.out.println(name);
    }
}
```

```shell
一月 21, 2022 4:19:50 下午 org.springframework.context.annotation.AnnotationConfigApplicationContext prepareRefresh
信息: Refreshing org.springframework.context.annotation.AnnotationConfigApplicationContext@6a38e57f: startup date [Fri Jan 21 16:19:50 CST 2022]; root of context hierarchy
一月 21, 2022 4:19:50 下午 org.springframework.context.annotation.AnnotationConfigApplicationContext prepareRefresh
信息: Refreshing org.springframework.context.annotation.AnnotationConfigApplicationContext@78b1cc93: startup date [Fri Jan 21 16:19:50 CST 2022]; root of context hierarchy
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalRequiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
mainConfig
person

Process finished with exit code 0
```

可以看到，除了我们在配置类中注册的person还有其它组件，甚至包括我们的配置类。那我们要通过怎样的配置来指定它的扫描规则呢？我们知道，以前通过XML是通过开启component-scan来指定扫描的包的：

```xml
<context:component-scan base-package="com.atqingke"/>
```

那么，我们的@ComponentScan注解就是来解决这个问题的。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Repeatable(ComponentScans.class)
public @interface ComponentScan { ...... }
```

这个注解可以看到，也是只能标在类上。它有一些属性，其中value属性来配置要扫描的包配置、excludeFilters指定不扫描的包配置以及includeFilters指定要扫描的包配置

```java
@Configuration
@ComponentScan(value = {"com.atqingke"},
        excludeFilters = {
            // 不扫描带有@Controller和@Service注解的类
            @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = {Controller.class, Service.class}),
            // 不扫描BookService这个类
            @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes ={BookService.class}),
            // 不扫描符合MyTypeFilter中配置的自定义规则的类
            @ComponentScan.Filter(type = FilterType.CUSTOM, classes ={MyTypeFilter.class}) },
        includeFilters = {
            // 要扫描带有@Repository注解的类
            @ComponentScan.Filter(type=FilterType.ANNOTATION, classes = {Repository.class})
        }
)
public class MainConfig { ...... }
```

excludeFilters和includeFilters都是需要传入一些Filter过滤规则，一共有五种规则，分别是ANNOTATION（按注解）、ASSIGNABLE_TYPE（按类型）、ASPECTJ（按aspectj）、REGEX（按正则）、CUSTOM（按自定义）。

我们通过自己写一个类MyTypeFilter去实现TypeFilter中的match方法来自定义我们的过滤规则：

```java
package com.atqingke.filter;

import org.springframework.core.io.Resource;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.core.type.ClassMetadata;
import org.springframework.core.type.classreading.MetadataReader;
import org.springframework.core.type.classreading.MetadataReaderFactory;
import org.springframework.core.type.filter.TypeFilter;

import java.io.IOException;

/**
 * @Author pengbin007
 * @Date 2022/1/18 23:04
 */
public class MyTypeFilter implements TypeFilter {

    /**
     *
     * @param metadataReader 读取到的当前正在扫描的类的信息
     * @param metadataReaderFactory 可以获取到其它任何类信息
     */
    @Override
    public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {
        // 获取当前类注解的信息
        AnnotationMetadata annotationMetadata = metadataReader.getAnnotationMetadata();
        // 获取当前正在扫描的类的信息
        ClassMetadata classMetadata = metadataReader.getClassMetadata();
        // 获取当前类资源（类的路径）
        Resource resource = metadataReader.getResource();
        String className = classMetadata.getClassName();
        System.out.println(className);

        return className.contains("er");
    }
}
```

```shell
com.atqingke.test.IOCTest
com.atqingke.bean.Person
com.atqingke.dao.BookDao	// 标了@Repository
com.atqingke.filter.MyTypeFilter	// 包含er
com.atqingke.service.BookService	// BookService
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalRequiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
mainConfig
bookDao
person
```

## @Scope

我们通过@Bean注解配置的bean默认都是单实例的，我们可以通过@Scope注解来改变组件的作用域：

```java
/*
    @see ConfigurableBeanFactory#SCOPE_PROTOTYPE
    @see ConfigurableBeanFactory#SCOPE_SINGLETON
    @see org.springframework.web.context.WebApplicationContext#SCOPE_REQUEST
    @see org.springframework.web.context.WebApplicationContext#SCOPE_SESSION
    prototype：多实例的
          IOC容器启动并不会去调用方法创建对象放到容器中，而是每次获取的时候才会调用方法创建对象
    singleton：单实例的
          IOC容器启动回调用方法创建对象放到IOC容器中，以后每次获取就是直接从容器(map.get())中拿
    request：同一次请求创建一个实例
	session：同一个session创建一个实例
*/
@Scope("prototype")
@Bean("person")
public Person person() {
    return new Person("liSi", 24);
}
```

## @Lazy

默认配置的bean都是单实例的，因此在容器已启动就会创建对象，我们可以通过@Lazy注解来实现懒加载效果。即容器启动的时候不创建对象，第一次使用（获取）的时候创建并初始化。

```java
@Lazy
@Bean("person")
public Person person() {
    return new Person("liSi", 24);
}
```

## @Conditional

考虑这样一个业务场景，有些组件我们需要在Linux操作系统下注册到容器中，而在Windows操作系统下不需要；反之，有些需要Windows环境而不需要Linux环境。那么要如何才能做到呢？

@Conditional注解就可以解决这个问题，它会按照一定的条件进行判断，满足条件的就给容器中注册bean。例如，我们现在有下面两个bean：

```java
@Bean("bill")
public Person person01() {
    return new Person("Bill Gates", 23);
}

@Bean("linus")
public Person person02() {
    return new Person("linus", 32);
}
```

bill需要Windows环境、linus需要Linux环境，那么我们就可以分配在两个bean上加上各自的条件判断

```java
@Conditional({WindowsCondition.class})
@Bean("bill")
public Person person01() {
    return new Person("Bill Gates", 23);
}

@Conditional({LinuxCondition.class})
@Bean("linus")
public Person person02() {
    return new Person("linus", 32);
}
```

```java
package com.atqingke.condition;

import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;

/**
 * @Author pengbin007
 * @Date 2022/1/20 14:13
 */
public class LinuxCondition implements Condition {

    /**
     * @param context 判断条件能使用的上下文（环境）
     * @param metadata 注释信息
     */
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
//        // 能获取到IOC使用的beanFactory
//        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
//        // 获取类加载器
//        ClassLoader classLoader = context.getClassLoader();
        // 获取当前环境信息
        Environment environment = context.getEnvironment();
//        // 获取到bean定义的注册类
//        BeanDefinitionRegistry registry = context.getRegistry();

        // 获取当前操作系统环境
        String property = environment.getProperty("os.name");

        return property.contains("Linux");
    }
}
```

```java
package com.atqingke.condition;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;

/**
 * @Author pengbin007
 * @Date 2022/1/20 14:13
 */
public class WindowsCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        Environment environment = context.getEnvironment();
        String property = environment.getProperty("os.name");
        return !"Windows".contains(property);
    }
}
```

> ps：@Conditional也可以标注在类上，这样就对整个配置类都生效。

## @Import

现在，我们要给容器中注册组件有两种方式：

- 包扫描 + 组件注解（局限于我们自己写的类）
- @Bean（导入第三方包里面的组件）

我们还可以通过@Import注解快速给容器中导入一个组件！

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Import { ...... }
```

这个注解也只能标在类上，例如：

```java
@Configuration
@Import({Color.class, Red.class})
public class MainConfig2 { ...... }
```

这样，我们就给容器中快速导入了Color和Red两个组件

```shell
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalRequiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
mainConfig2
com.atqingke.bean.Color
com.atqingke.bean.Red
```

可以看到，注册的组件的id默认就是全类名。

我们也可以通过实现ImportSelector接口来自定义逻辑返回需要导入的组件：

```java
package com.atqingke.condition;

import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

/**
 * 自定义逻辑返回需要导入的组件
 * @Author pengbin007
 * @Date 2022/1/20 19:49
 */
public class MyImportSelector implements ImportSelector {

    /**
     *
     * @param importingClassMetadata 当前标注@Import注解的类的所有注解信息
     * @return 要导入到容器中的组件全类名，可以返回空数组，但是不能返回null（高版本有优化，可以返回null）
     */
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[] {"com.atqingke.bean.Blue"};
    }
}

@Configuration
@Import({Color.class, Red.class, MyImportSelector.class})
public class MainConfig2 { ...... }
```

还可以通过实现ImportBeanDefinitionRegistrar，手动注册bean到容器中：

```java
package com.atqingke.condition;

import com.atqingke.bean.RainBow;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;

/**
 * @Author pengbin007
 * @Date 2022/1/20 19:56
 */
public class MyImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {

    /**
     *
     * @param importingClassMetadata 当前类的注解信息
     * @param registry BeanDefinition注册类
     *                 把所有需要添加到容器中的bean，调用BeanDefinitionRegistry.registerBeanDefinition手动注册进来
     */
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        boolean red = registry.containsBeanDefinition("com.atqingke.bean.Red");
        boolean blue = registry.containsBeanDefinition("com.atqingke.bean.Blue");
        if (red && blue) {
            // 指定Bean定义信息（Bean类型、Bean作用域......）
            RootBeanDefinition beanDefinition = new RootBeanDefinition(RainBow.class);
            // 注册一个Bean，指定名称
            registry.registerBeanDefinition("rainBow", beanDefinition);
        }
    }
}

@Configuration
@Import({Color.class, Red.class, MyImportSelector.class, MyImportBeanDefinitionRegistrar.class})
public class MainConfig2 { ...... }
```

这是第三种方法使用@Import注解，还有第四种方法——使用Spring提供的FactoryBean（工厂bean）。我们创建一个自定义的FactoryBean，它实现了FactoryBean，泛型就是要注册的组件类型。

```java
package com.atqingke.bean;

import org.springframework.beans.factory.FactoryBean;

/**
 * 创建一个Spring定义的FactoryBean
 * @Author pengbin007
 * @Date 2022/1/20 20:08
 */
public class ColorFactoryBean implements FactoryBean<Color> {

    /**
     * @return Color对象，这个对象会添加到容器中
     */
    @Override
    public Color getObject() throws Exception {
        return new Color();
    }

    /**
     * @return 对象类型
     */
    @Override
    public Class<?> getObjectType() {
        return Color.class;
    }

    /**
     * @return true，这个bean是单实例，在容器中保存一份；false，多实例
     */
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

我们再给配置类中注册上这个ColorFactoryBean：

```java
@Bean
public ColorFactoryBean colorFactoryBean() {
    return new ColorFactoryBean();
}
```

再测试：

```java
@Test
public void test03() {
    ApplicationContext bean = new AnnotationConfigApplicationContext(MainConfig2.class);
    Object colorFactoryBean = bean.getBean("colorFactoryBean");
    System.out.println(colorFactoryBean);
}
```

控制台结果：

```shell
com.atqingke.bean.Color@5ef60048

Process finished with exit code 0
```

可以看到默认获取到的是工厂bean调用getObject创建的对象，而如果我们要获取工厂bean本身，我们需要给id前面加一个&

```java
@Test
public void test03() {
    ApplicationContext bean = new AnnotationConfigApplicationContext(MainConfig2.class);
    // 获取的是工厂bean帮我们创建的bean
    Object colorFactoryBean = bean.getBean("colorFactoryBean");
    System.out.println(colorFactoryBean);

    // 获取工厂bean本身
    Object factoryBean = this.bean.getBean("&colorFactoryBean");
    System.out.println(factoryBean);
}
```

```shell
com.atqingke.bean.Color@5ef60048
com.atqingke.bean.ColorFactoryBean@1d548a08

Process finished with exit code 0
```



