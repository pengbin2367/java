---
title: Spring注解驱动开发——@Profile实现多环境配置
date: 2022-01-29 18:13:03
tags:
---

之前说过，使用@Conditional实现不同环境注册不同bean。那么，我们也可以通过@Profile注解来实现多环境配置。在这里，我们以多数据源为例，并结合了@Value、@PropertySource和EmbeddedValueResolverAware的使用。

首先，我们有三个业务环境：开发、测试、生产，它们分别需要的数据源是A、B、C。

我们将公共的数据源配置抽取到我们的dbConfig.properties中

```properties
db.user=root
db.password=123456
db.driverClass=com.mysql.jdbc.Driver
```

然后，就可以在我们的配置类中对这三个环境进行配置了，我们假设，开发环境连向dev数据库、测试环境连向test数据库、生产环境连向product数据库。

```java
package com.atqingke.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.EmbeddedValueResolverAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.StringValueResolver;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;

@PropertySource("classpath:/dbConfig.properties")
@Configuration
public class MainConfigOfProfile implements EmbeddedValueResolverAware {

    @Value("${db.user}")
    private String user;

    private StringValueResolver stringValueResolver;
    private String driverClass;

    @Profile("dev")
    @Bean("devDataSource")
    public DataSource dataSourceDev(@Value("${db.password}") String password) throws PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(password);
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/dev");
        dataSource.setDriverClass(driverClass);
        return dataSource;
    }

    @Profile("test")
    @Bean("testDataSource")
    public DataSource dataSourceTest(@Value("${db.password}") String password) throws PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(password);
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setDriverClass(driverClass);
        return dataSource;
    }

    @Profile("pro")
    @Bean("proDataSource")
    public DataSource dataSourcePro(@Value("${db.password}") String password) throws PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(password);
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/product");
        dataSource.setDriverClass(driverClass);
        return dataSource;
    }

    @Override
    public void setEmbeddedValueResolver(StringValueResolver resolver) {
        this.stringValueResolver = resolver;
        driverClass = stringValueResolver.resolveStringValue("${db.driverClass}");
    }
}
```

通过上面的例子，我们简单总结一下@Profile的作用以及使用：

* @Profile：指定组件在哪个环境的情况下才能被注册到容器中，不指定，任何环境下都能注册这个组件。
* 加了环境标识的bean，只有这个环境被激活的时候才能注册到容器中。默认是default环境。
* 除了写在bean上，还可以写在类上，只有指定环境，整个配置类的所有配置才生效。
* 没有标注环境标识的bean，在任何环境都生效。



