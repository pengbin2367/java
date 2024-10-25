---
title: Spring注解驱动开发【源码】——AOP原理总结
date: 2022-02-07 21:26:32
tags:
---

```java
/**
 * AOP【动态代理】
 *      指在程序运行期间动态将某段代码切入到指定方法指定位置进行运行的编程方式
 *
 * 1、导入aop模块
 * 2、定义一个业务逻辑类
 * 3、定义一个日志切面类
 *      前置通知
 *      后置通知
 *      返回通知
 *      异常通知
 *      环绕通知
 * 4、给切面类的目标方法标注何时何地运行
 * 5、将切面类和业务逻辑类加入到容器中
 * 6、告诉Spring哪个是切面类@Aspect
 * 7、开启基于注解的aop模式
 *
 * 原理：【看给容器中注册了什么组件，这个组件什么时候工作，这个组件的功能是什么】
 *  /@EnableAspectJAutoProxy
 *      /@Import(AspectJAutoProxyRegistrar.class)，给容器中导入AspectJAutoProxyRegistrar
 *      class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {
 *          利用AspectJAutoProxyRegistrar自定义给容器中注册bean
 *          internalAutoProxyCreator = AnnotationAwareAspectJAutoProxyCreator
 *
 *      给容器中注册一个AnnotationAwareAspectJAutoProxyCreator
 *
 * AnnotationAwareAspectJAutoProxyCreator
 *      AspectJAwareAdvisorAutoProxyCreator
 *          AbstractAdvisorAutoProxyCreator
 *              AbstractAutoProxyCreator
 *                  implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware
 *                  关注后置处理器（在bean初始化完成前后做的事情）、自动装配BeanFactory
 *
 * 流程：
 *      1、 传入配置类，创建IOC容器
 *      2、 注册配置类，调用refresh()刷新容器
 *      3、 registerBeanPostProcessors(beanFactory); 注册bean的后置处理器来方便拦截bean的创建
 *          ① 先获取IOC容器中已经定义了的需要创建对象的所有BeanPostProcessor
 *          ② 给容器中加别的BeanPostProcessor
 *          ③ 优先注册实现了PriorityOrdered接口的BeanPostProcessor
 *          ④ 再给容器中注册实现了Ordered接口的BeanPostProcessor
 *          ⑤ 注册没实现优先级接口的BeanPostProcessor
 *          ⑥ 注册BeanPostProcessor，实际上就是创建BeanPostProcessor对象，保存在容器中
 *              创建internalAutoProxyCreator的BeanPostProcessor【AnnotationAwareAspectJAutoProxyCreator】
 *              1、创建bean的实例
 *              2、populateBean 给bean的各种属性赋值
 *              3、initializeBean 初始化bean
 *                  ① invokeAwareMethods() 处理Aware接口的方法回调
 *                  ② applyBeanPostProcessorsBeforeInitialization() 应用后置处理器的postProcessorBeforeInitialization
 *                  ③ invokeInitMethods 执行自定义的初始化方法
 *                  ④ applyBeanPostProcessorsAfterInitialization 执行后置处理器的postProcessorsAfterInitialization
 *              4、BeanPostProcessor【AnnotationAwareAspectJAutoProxyCreator】创建成功
 *          ⑦ 把BeanPostProcessor注册到BeanFactory中
 *              beanFactory.addBeanPostProcessor(postProcessor);
 *
 * =======================================以上是创建和注册AnnotationAwareAspectJAutoProxyCreator的过程===============================================
 *
 *      4、finishBeanFactoryInitialization(beanFactory); 完成BeanFactory初始化工作，创建剩下的单实例bean
 *          Ⅰ 遍历获取容器中所有的Bean，依次创建对象getBean(beanName)
 *              getBean->doGetBean->getSingleton
 *          Ⅱ 创建bean
 *              【AnnotationAwareAspectJAutoProxyCreator再所有bean创建之前会有一个拦截，InstantiationAwareBeanPostProcessor，会调用postProcessBeforeInstantiation】
 *              ①先从缓存中获取当前bean，如果能获取到，说明bean是之前被创建过的，直接使用；否则再创建。
 *                  只要创建好的bean都会被缓存起来
 *              ② createBean(); 创建bean AnnotationAwareAspectJAutoProxyCreator会在任何bean创建之前先尝试返回bean实例
 *                  【BeanPostProcessor是在Bean对象创建完成初始化前后调用的】
 *                  【InstantiationAwareBeanPostProcessor是在创建Bean实例之前先尝试用后置处理器返回对象的】
 *                  1、resolveBeforeInstantiation(beanName, mbdToUse); 解析BeforeInstantiation
 *                      希望后置处理器在此能返回一个代理对象，如果能返回代理对象就是用；如果不能就继续
 *                      Ⅰ后置处理器先尝试返回对象
 *                      bean = applyBeanPostProcessorsBeforeInstantiation(targetType, beanName);
 *                          拿到所有后置处理器，如果是InstantiationAwareBeanPostProcessor
 *                          就执行postProcessBeforeInstantiation
 *                      if (bean != null) {
 *                        bean = applyBeanPostProcessorsAfterInitialization(bean, beanName);
 *                      }
 *                  2、doCreateBean(beanName, mbdToUse, args); 真正的去创建一个bean实例，和3.6流程一样
 *
 * AnnotationAwareAspectJAutoProxyCreator【InstantiationAwareBeanPostProcessor】的作用
 * 1、每一个bean创建之前，调用postProcessBeforeInstantiation()
 *      关心MathCalculator和LogAspects的创建
 *      Ⅰ 判断当前bean是否在advisedBeans中（保存了所有需要增强的bean）
 *      Ⅱ 判断当前bean是否是基础类型的Advice、Pointcut、Advisor、AopInfrastructureBean、或者是否切面（@Aspect）
 *      Ⅲ 是否需要跳过
 *          ① 获取候选的增强器（切面里面的通知方法）
 *              每一个封装的通知方法的增强器是InstantiationModelAwarePointcutAdvisor
 *              判断每一个增强器是否是AspectJPointcutAdvisor类型的 返回true
 *          ② 永远返回false
 * 2、创建对象
 *  postProcessAfterInitialization
 *      return wrapIfNecessary(bean, beanName, cacheKey); 包装如果需要的情况下
 *      Ⅰ 获取当前bean所有增强器（通知方法）Object[] specificInterceptors
 *          1、找到候选的所有的增强器（找哪些通知方法是需要切入当前bean方法的）
 *          2、获取到能在当前bean使用的增强器
 *          3、给增强器排序
 *      Ⅱ 保存当前bean在advisedBeans中
 *      Ⅲ 如果当前bean需要增强，创建当前bean的代理对象
 *          ① 获取所有增强器（通知方法）
 *          ② 保存到proxyFactory中
 *          ③ 创建代理对象，Spring自动决定
 *              JdkDynamicAopProxy(config); JDK动态代理
 *              ObjenesisCglibAopProxy(config); cglib的动态代理
 *      Ⅳ 给容器中返回当前组件使用cglib增强了的代理对象
 *      Ⅴ 以后容器中获取到的就是这个组件的代理对象，执行目标方法的时候，代理对象就会执行通知方法的流程
 *
 * 3、目标方法执行
 *  容器中保存了组件的代理对象（cglib增强后的对象），这个对象里面保存了详细信息（比如增强器、目标对象，、、、）
 *      Ⅰ CglibAopProxy.DynamicAdvisedInterceptor#intercept(); 拦截目标方法的执行
 *      Ⅱ 根据ProxyFactory对象获取将要执行的目标方法的拦截器链this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
 *          1、List<Object> interceptorList = new ArrayList<Object>(config.getAdvisors().length);保存所有拦截器
 *              5个：一个默认的ExposeInvocationInterceptor和四个增强器
 *          2、遍历所有增强器，将其转为Interceptor registry.getInterceptors(advisor);
 *          3、将增强器转为List<MethodInterceptor>
 *              如果是MethodInterceptor，直接加入到集合中
 *              如果不是，使用AdvisorAdapter将增强器转为MethodInterceptor
 *              转化完成返回MethodInterceptor数组
 *      Ⅲ 如果没有拦截器链，直接执行目标方法
 *          拦截器链：每一个通知方法又被包装为方法拦截器，利用MethodInterceptor机制
 *      Ⅳ 如果有拦截器链，把需要执行的目标对象，目标方法，拦截器链等所有信息传入创建一个CglibMethodInvocation对象，并调用proceed()返回一个retVal
 *      Ⅴ 拦截器链的触发过程
 *          1、如果没有拦截器或者拦截器的索引和 拦截器数组 - 1 大小一样（指定到了最后一个拦截器）直接执行目标方法
 *          2、链式获取每一个拦截器，拦截器执行invoke方法，每一个拦截器等待下一个拦截器执行完成返回以后再来执行。拦截器链的机制，保证通知方法于目标方法的执行顺序
 *
 * 总结：
 *  1、@EnableAspectJAutoProxy 开启AOP功能
 *  2、@EnableAspectJAutoProxy会给容器中注册一个组件AnnotationAwareAspectJAutoProxyCreator
 *  3、AnnotationAwareAspectJAutoProxyCreator是一个后置处理器
 *  4、容器的创建流程
 *      1、registerBeanPostProcessors(beanFactory); 注册后置处理器，创建AnnotationAwareAspectJAutoProxyCreator
 *      2、finishBeanFactoryInitialization(beanFactory); 初始化剩下的单实例bean
 *          1、创建业务逻辑组件和切面组件
 *          2、AnnotationAwareAspectJAutoProxyCreator拦截组件的创建过程
 *          3、组件创建完成后，判断组件是否需要增强
 *              是：切面的通知方法，包装成增强器（Advisor）；给业务逻辑组件创建一个代理对象
 *  5、执行目标方法
 *      1、代理对象执行目标方法
 *      2、CglibAopProxy.DynamicAdvisedInterceptor#intercept();
 *          1、得到目标方法的拦截器链（增强器包装成拦截器MethodInterceptor）
 *          2、利用拦截器的链式机制，依次进入每一个拦截器进行执行
 *          3、效果
 *              正常执行：前置通知-》目标方法-》后置通知-》返回通知
 *              出现异常：前置通知-》目标方法-》后置通知-》异常通知
 *
 *
 * @Author pengbin007
 * @Date 2022/1/29 20:21
 */
```