# 起步

如何使用`策略模式`实现多平台文件上传，并将其封装成一个`starter`

:::tip

- [阿里云OSS官网](https://help.aliyun.com/zh/oss/developer-reference/java-installation)
- [腾讯云COS官网](https://cloud.tencent.com/document/product/436/10199)
- [Minio官网](https://min.io/docs/minio/linux/developers/java/minio-java.html#minio-java-quickstart)

:::

## 配置分析

我们先去各个官网查阅，要实现文件上传需要哪些步骤

### 阿里云OSS

OSS的简单上传大致分为以下几步：

1. 引入SDK依赖
2. 配置访问凭证
3. 新建和配置OSSClient
4. 创建存储空间，执行上传

其中，在配置访问凭证是需要`accessKeyId`和`accessKeySecrect`；在配置OSSClient时，需要`endpoint`；最后第四步，需要`bucketName`和`objectName`。那么我们要实现的就是提供这些配置以及要上传的文件，返回一个文件的访问地址给我们

### 腾讯云COS

COS的简单上传和OSS类似，分为以下几步：

1. 引入SDK依赖
2. 初始化COSClient
3. 创建存储桶，执行上传

整个过程需要配置：`secretId`、`secretKey`、`region`、`bucket`和`key`

### Minio

类似操作，不再赘述，需要配置：`access key`、`secret key`、`endpoint`、`bucket`和`object`

### 配置小结

总的来说，都需要有五个配置，其中两个是访问凭证，一个服务器地址和两个文件存储位置，我们将其封装到配置类中。另外，由于有多种上传方式，因此还需要在配置类中指定各个配置实例对应的服务。这样，我们就可以得到下面的配置类：

```java
```



## 基本框架



## 平台配置



## 项目初始化

新建SpringBoot项目：qingke-upload，坐标：com.atqingke.upload

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.atqingke.upload</groupId>
    <artifactId>qingke-upload</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>qingke-upload</name>
    <description>qingke-upload</description>
    <url/>
    <licenses>
        <license/>
    </licenses>
    <developers>
        <developer/>
    </developers>
    <scm>
        <connection/>
        <developerConnection/>
        <tag/>
        <url/>
    </scm>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```







