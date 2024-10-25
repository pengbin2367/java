import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Java",
  base: "/java/",
  description: "A VitePress Site",
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "Java基础",
        items: [
          {
            text: "JavaSE",
            link: "/basic/collection/CollectionInterviewQuestions",
          },
          {
            text: "JVM",
            link: "/jvm/01-ByteCode",
          },
        ],
      },
      {
        text: "计算机基础",
        items: [
          {
            text: "数据结构与算法",
            link: "/algorithm/001-GettingStart",
          },
          {
            text: "设计模式",
            link: "/design-patterns/01-dp/01-introduction-to-design-patterns",
          },
        ],
      },
      {
        text: "数据库",
        items: [
          {
            text: "MySQL",
            link: "/mysql/MySQLInterviewQuestions",
          },
          {
            text: "Redis",
            link: "/redis/RedisInterviewQuestions",
          },
        ],
      },
      {
        text: "Spring",
        items: [
          {
            text: "Spring注解驱动开发",
            link: "/spring/annotation/01-ComponentRegist",
          },
        ],
      },
      {
        text: "中间件",
        items: [
          {
            text: "RabbitMQ",
            link: "/rabbitmq/01-GettingStart",
          },
        ],
      },
      {
        text: "并发编程",
        items: [
          {
            text: "JUC",
            link: "/juc/JUCInterviewQuestions",
          },
        ],
      },
      {
        text: "项目实战",
        items: [
          {
            text: "听书项目(仿喜马拉雅)",
            link: "/projects/tingshu/01-GettingStart",
          },
        ],
      },
    ],

    sidebar: {
      "/basic/": [
        {
          text: "集合",
          items: [
            {
              text: "Java集合概述",
              link: "/basic/collection/CollectionIntro",
            },
            {
              text: "Map接口继承树",
              link: "/basic/collection/CollectionOfMap",
            },
            {
              text: "深入Java集合系列之ArrayList",
              link: "/basic/collection/CollectionOfArrayList",
            },
            {
              text: "深入Java集合系列之HashMap",
              link: "/basic/collection/CollectionOfHashMap",
            },
            {
              text: "集合面试题",
              link: "/basic/collection/CollectionInterviewQuestions",
            },
            {
              text: "JavaSE面试题",
              link: "/basic/javase/JavaSEInterviewQuestions",
            },
          ],
        },
        {
          text: "新特性",
          items: [
            {
              text: "Java8新特性",
              link: "/basic/Java8NewFeatures",
            },
          ],
        },
      ],
      "/jvm/": [
        {
          text: "JVM",
          items: [
            {
              text: "字节码",
              link: "/jvm/01-ByteCode",
            },
            {
              text: "类的加载器",
              link: "/jvm/02-ClassLoader",
            },
            {
              text: "运行时内存",
              link: "/jvm/03-RuntimeMemory",
            },
            {
              text: "对象内存布局",
              link: "/jvm/04-ObjectMemoryLayout",
            },
            {
              text: "执行引擎",
              link: "/jvm/05-ExecutionEngine",
            },
            {
              text: "垃圾回收器",
              link: "/jvm/06-GarbageCollection",
            },
            {
              text: "JVM性能监控",
              link: "/jvm/07-JVMPerformanceMonitoring",
            },
            {
              text: "JVM性能调优案例",
              link: "/jvm/08-JVMPerformanceTuningCase",
            },
          ],
        },
      ],
      "/algorithm/": [
        {
          text: "汇总",
          items: [
            {
              text: "算法模板",
              link: "/algorithm/000-AlgorithmTemplates",
            },
            {
              text: "题目链接",
              link: "/algorithm/000-QuestionsLink",
            },
          ],
        },
        {
          text: "入门",
          items: [
            {
              text: "GettingStart",
              link: "/algorithm/001-GettingStart",
            },
            {
              text: "从社会实验到入门提醒",
              link: "/algorithm/002-FromSocialExperimentToEntryReminder",
            },
            {
              text: "二进制和位运算",
              link: "/algorithm/003-BinaryAndBitwiseOperations",
            },
            {
              text: "选择、冒泡、插入排序",
              link: "/algorithm/004-SelectionBubbleInsertionSort",
            },
            {
              text: "对数器-验证的重要手段",
              link: "/algorithm/005-Logarithm",
            },
            {
              text: "二分搜索",
              link: "/algorithm/006-BinarySearch",
            },
            {
              text: "时间复杂度和空间复杂度",
              link: "/algorithm/007-TimeAndSpaceComplexity",
            },
            {
              text: "算法和数据结构简介",
              link: "/algorithm/008-IntroductionToAlgorithmsAndDataStructures",
            },
            {
              text: "单链表及其反转——堆栈解释",
              link: "/algorithm/009-SinglyLinkedListReversalAndStackExplained",
            },
            {
              text: "合并两个有序链表",
              link: "/algorithm/010-MergeTwoLists",
            },
            {
              text: "两个链表相加",
              link: "/algorithm/011-AddTwoNumbers",
            },
            {
              text: "划分链表",
              link: "/algorithm/012-PartitionList",
            },
            {
              text: "队列和栈——链表和数组实现",
              link: "/algorithm/013-QueueStackAndCircularQueue",
            },
            {
              text: "栈和队列相互实现",
              link: "/algorithm/014-ConvertQueueAndStack",
            },
            {
              text: "最小栈",
              link: "/algorithm/015-GetMinStack",
            },
            {
              text: "双端队列——双链表和固定数组实现",
              link: "/algorithm/016-CirCularDeque",
            },
            {
              text: "二叉树及其三种序的递归实现",
              link: "/algorithm/017-BinaryTreeTraversalRecursion",
            },
            {
              text: "二叉树遍历的非递归实现及其复杂度分析",
              link: "/algorithm/018-BinaryTreeTraversalIteration",
            },
          ],
        },
        {
          text: "必备",
          items: [
            {
              text: "算法笔试中处理输入和输出",
              link: "/algorithm/019-ProcessingInputAndOutputInAlgorithm",
            },
            {
              text: "递归和master公式",
              link: "/algorithm/020-RecursionAndTheMasterFormula",
            },
            {
              text: "归并排序",
              link: "/algorithm/021-MergeSort",
            },
            {
              text: "归并分治",
              link: "/algorithm/022-MergeDivideAndConquer",
            },
            {
              text: "随机快排",
              link: "/algorithm/023-RandomQuickSort",
            },
            {
              text: "随机选择算法",
              link: "/algorithm/024-RandomizedSelect",
            },
            {
              text: "堆结构和堆排序",
              link: "/algorithm/025-HeapSort",
            },
            {
              text: "哈希表、有序表和比较器的用法",
              link: "/algorithm/026-UsageOfHashTableOrderedTableAndComparator",
            },
            {
              text: "堆结构常见题",
              link: "/algorithm/027-CommonQuestionsAboutHeapStructure",
            },
          ],
        },
      ],
      "/design-patterns/": [
        {
          text: "总览设计模式",
          items: [
            {
              text: "设计模式导论",
              link: "/design-patterns/01-dp/01-introduction-to-design-patterns",
            },
            {
              text: "创建型模式",
              link: "/design-patterns/01-dp/02-creational-patterns",
            },
            {
              text: "结构型模式",
              link: "/design-patterns/01-dp/03-StructuralPatterns",
            },
            {
              text: "行为型模式",
              link: "/design-patterns/01-dp/04-BehavioralPatterns",
            },
          ],
        },
      ],
      "/mysql/": [
        {
          text: "MySQL",
          items: [
            {
              text: "MySQL面试题",
              link: "/mysql/MySQLInterviewQuestions",
            },
          ],
        },
      ],
      "/redis/": [
        {
          text: "Redis",
          items: [
            {
              text: "Redis面试题",
              link: "/redis/RedisInterviewQuestions",
            },
          ],
        },
      ],
      "/spring/annotation/": [
        {
          text: "注解开发",
          items: [
            {
              text: "组件注册",
              link: "/spring/annotation/01-ComponentRegist",
            },
            {
              text: "Bean生命周期",
              link: "/spring/annotation/02-BeanLifeCycle",
            },
            {
              text: "属性赋值&自动装配",
              link: "/spring/annotation/03-PropertyAndAutowiring",
            },
            {
              text: "AOP",
              link: "/spring/annotation/04-AOP",
            },
            {
              text: "多环境配置",
              link: "/spring/annotation/05-MultiEnvConfig",
            },
          ],
        },
        {
          text: "AOP源码分析",
          items: [
            {
              text: "@EnableAspectJAutoProxy",
              link: "/spring/annotation/10-@EnableAspectJAutoProxy",
            },
            {
              text: "AnnotationAwareAspectJAutoProxyCreator",
              link: "/spring/annotation/11-AnnotationAwareAspectJAutoProxyCreator",
            },
            {
              text: "创建AOP代理",
              link: "/spring/annotation/12-CreatAOP",
            },
            {
              text: "获取拦截器链",
              link: "/spring/annotation/13-GetInterceptChain",
            },
            {
              text: "链式调用通知方法",
              link: "/spring/annotation/14-ChainingNotificationMethods",
            },
            {
              text: "AOP原理总结",
              link: "/spring/annotation/15-SummaryOfAOP",
            },
          ],
        },
        {
          text: "扩展原理",
          items: [
            {
              text: "声明式事务",
              link: "/spring/annotation/20-@EnableTransactionManagement",
            },
            {
              text: "BeanFactoryPostProcessor",
              link: "/spring/annotation/21-BeanFactoryPostProcessor",
            },
            {
              text: "BeanDefinitionRegistryPostProcessor",
              link: "/spring/annotation/22-BeanDefinitionRegistryPostProcessor",
            },
            {
              text: "ApplicationListener用法&原理",
              link: "/spring/annotation/23-ApplicationListener",
            },
            {
              text: "@EventListener&SmartInitializingSingleton",
              link: "/spring/annotation/24-@EventListenerAndSmartInitializingSingleton",
            },
          ],
        },
      ],
      "/rabbitmq/": [
        {
          text: "RabbitMQ",
          items: [
            {
              text: "RabbitMQ",
              link: "/rabbitmq/01-GettingStart",
            },
          ],
        },
      ],
      "/juc/": [
        {
          text: "并发编程",
          items: [
            {
              text: "JUC面试题",
              link: "/juc/JUCInterviewQuestions",
            },
            {
              text: "多线程锁",
              link: "/juc/02-Lock",
            },
          ],
        },
      ],
      "/projects/tingshu/": [
        {
          text: "听书项目",
          items: [
            { text: "准备工作", link: "/projects/tingshu/01-GettingStart" },
            { text: "专辑管理", link: "/projects/tingshu/02-AlbumManagement" },
            { text: "声音管理", link: "/projects/tingshu/03-TrackManagement" },
            { text: "用户登录", link: "/projects/tingshu/04-UserLogin" },
            { text: "专辑搜索", link: "/projects/tingshu/05-AlbumSearch" },
            { text: "专辑详情", link: "/projects/tingshu/06-AlbumDetails" },
            { text: "缓存切面", link: "/projects/tingshu/07-CacheConfig" },
            { text: "订单管理", link: "/projects/tingshu/08-OrderManagement" },
            {
              text: "账户管理",
              link: "/projects/tingshu/09-AccountManagement",
            },
            { text: "微信支付", link: "/projects/tingshu/10-WxPayment" },
            { text: "定时任务", link: "/projects/tingshu/11-ScheduleTask" },
            { text: "RabbitMQ", link: "/projects/tingshu/12-RabbitMQJob" },
            { text: "kafka", link: "/projects/tingshu/13-KafkaJob" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/pengbin2367/java" },
    ],
  },
});
