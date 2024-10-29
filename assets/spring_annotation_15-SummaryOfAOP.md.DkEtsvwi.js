import{_ as s,c as a,o as n,a5 as i}from"./chunks/framework.BAO6c_AF.js";const d=JSON.parse('{"title":"Spring注解驱动开发【源码】——AOP原理总结","description":"","frontmatter":{"title":"Spring注解驱动开发【源码】——AOP原理总结","date":"2022-02-07T21:26:32.000Z","tags":null},"headers":[],"relativePath":"spring/annotation/15-SummaryOfAOP.md","filePath":"spring/annotation/15-SummaryOfAOP.md","lastUpdated":1729870203000}'),p={name:"spring/annotation/15-SummaryOfAOP.md"},e=i(`<div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * AOP【动态代理】</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      指在程序运行期间动态将某段代码切入到指定方法指定位置进行运行的编程方式</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 1、导入aop模块</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 2、定义一个业务逻辑类</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 3、定义一个日志切面类</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      前置通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      后置通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      返回通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      异常通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      环绕通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 4、给切面类的目标方法标注何时何地运行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 5、将切面类和业务逻辑类加入到容器中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 6、告诉Spring哪个是切面类@Aspect</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 7、开启基于注解的aop模式</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 原理：【看给容器中注册了什么组件，这个组件什么时候工作，这个组件的功能是什么】</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  /@EnableAspectJAutoProxy</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      /@Import(AspectJAutoProxyRegistrar.class)，给容器中导入AspectJAutoProxyRegistrar</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          利用AspectJAutoProxyRegistrar自定义给容器中注册bean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          internalAutoProxyCreator = AnnotationAwareAspectJAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      给容器中注册一个AnnotationAwareAspectJAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * AnnotationAwareAspectJAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      AspectJAwareAdvisorAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          AbstractAdvisorAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              AbstractAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  关注后置处理器（在bean初始化完成前后做的事情）、自动装配BeanFactory</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 流程：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      1、 传入配置类，创建IOC容器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      2、 注册配置类，调用refresh()刷新容器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      3、 registerBeanPostProcessors(beanFactory); 注册bean的后置处理器来方便拦截bean的创建</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ① 先获取IOC容器中已经定义了的需要创建对象的所有BeanPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ② 给容器中加别的BeanPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ③ 优先注册实现了PriorityOrdered接口的BeanPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ④ 再给容器中注册实现了Ordered接口的BeanPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ⑤ 注册没实现优先级接口的BeanPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ⑥ 注册BeanPostProcessor，实际上就是创建BeanPostProcessor对象，保存在容器中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              创建internalAutoProxyCreator的BeanPostProcessor【AnnotationAwareAspectJAutoProxyCreator】</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              1、创建bean的实例</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              2、populateBean 给bean的各种属性赋值</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              3、initializeBean 初始化bean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  ① invokeAwareMethods() 处理Aware接口的方法回调</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  ② applyBeanPostProcessorsBeforeInitialization() 应用后置处理器的postProcessorBeforeInitialization</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  ③ invokeInitMethods 执行自定义的初始化方法</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  ④ applyBeanPostProcessorsAfterInitialization 执行后置处理器的postProcessorsAfterInitialization</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              4、BeanPostProcessor【AnnotationAwareAspectJAutoProxyCreator】创建成功</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ⑦ 把BeanPostProcessor注册到BeanFactory中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              beanFactory.addBeanPostProcessor(postProcessor);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * =======================================以上是创建和注册AnnotationAwareAspectJAutoProxyCreator的过程===============================================</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      4、finishBeanFactoryInitialization(beanFactory); 完成BeanFactory初始化工作，创建剩下的单实例bean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          Ⅰ 遍历获取容器中所有的Bean，依次创建对象getBean(beanName)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              getBean-&gt;doGetBean-&gt;getSingleton</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          Ⅱ 创建bean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              【AnnotationAwareAspectJAutoProxyCreator再所有bean创建之前会有一个拦截，InstantiationAwareBeanPostProcessor，会调用postProcessBeforeInstantiation】</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              ①先从缓存中获取当前bean，如果能获取到，说明bean是之前被创建过的，直接使用；否则再创建。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  只要创建好的bean都会被缓存起来</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              ② createBean(); 创建bean AnnotationAwareAspectJAutoProxyCreator会在任何bean创建之前先尝试返回bean实例</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  【BeanPostProcessor是在Bean对象创建完成初始化前后调用的】</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  【InstantiationAwareBeanPostProcessor是在创建Bean实例之前先尝试用后置处理器返回对象的】</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  1、resolveBeforeInstantiation(beanName, mbdToUse); 解析BeforeInstantiation</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                      希望后置处理器在此能返回一个代理对象，如果能返回代理对象就是用；如果不能就继续</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                      Ⅰ后置处理器先尝试返回对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                      bean = applyBeanPostProcessorsBeforeInstantiation(targetType, beanName);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                          拿到所有后置处理器，如果是InstantiationAwareBeanPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                          就执行postProcessBeforeInstantiation</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                      if (bean != null) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                        bean = applyBeanPostProcessorsAfterInitialization(bean, beanName);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                      }</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *                  2、doCreateBean(beanName, mbdToUse, args); 真正的去创建一个bean实例，和3.6流程一样</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * AnnotationAwareAspectJAutoProxyCreator【InstantiationAwareBeanPostProcessor】的作用</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 1、每一个bean创建之前，调用postProcessBeforeInstantiation()</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      关心MathCalculator和LogAspects的创建</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅰ 判断当前bean是否在advisedBeans中（保存了所有需要增强的bean）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅱ 判断当前bean是否是基础类型的Advice、Pointcut、Advisor、AopInfrastructureBean、或者是否切面（@Aspect）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅲ 是否需要跳过</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ① 获取候选的增强器（切面里面的通知方法）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              每一个封装的通知方法的增强器是InstantiationModelAwarePointcutAdvisor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              判断每一个增强器是否是AspectJPointcutAdvisor类型的 返回true</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ② 永远返回false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 2、创建对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  postProcessAfterInitialization</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      return wrapIfNecessary(bean, beanName, cacheKey); 包装如果需要的情况下</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅰ 获取当前bean所有增强器（通知方法）Object[] specificInterceptors</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          1、找到候选的所有的增强器（找哪些通知方法是需要切入当前bean方法的）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          2、获取到能在当前bean使用的增强器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          3、给增强器排序</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅱ 保存当前bean在advisedBeans中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅲ 如果当前bean需要增强，创建当前bean的代理对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ① 获取所有增强器（通知方法）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ② 保存到proxyFactory中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          ③ 创建代理对象，Spring自动决定</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              JdkDynamicAopProxy(config); JDK动态代理</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              ObjenesisCglibAopProxy(config); cglib的动态代理</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅳ 给容器中返回当前组件使用cglib增强了的代理对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅴ 以后容器中获取到的就是这个组件的代理对象，执行目标方法的时候，代理对象就会执行通知方法的流程</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 3、目标方法执行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  容器中保存了组件的代理对象（cglib增强后的对象），这个对象里面保存了详细信息（比如增强器、目标对象，、、、）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅰ CglibAopProxy.DynamicAdvisedInterceptor#intercept(); 拦截目标方法的执行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅱ 根据ProxyFactory对象获取将要执行的目标方法的拦截器链this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          1、List&lt;Object&gt; interceptorList = new ArrayList&lt;Object&gt;(config.getAdvisors().length);保存所有拦截器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              5个：一个默认的ExposeInvocationInterceptor和四个增强器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          2、遍历所有增强器，将其转为Interceptor registry.getInterceptors(advisor);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          3、将增强器转为List&lt;MethodInterceptor&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              如果是MethodInterceptor，直接加入到集合中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              如果不是，使用AdvisorAdapter将增强器转为MethodInterceptor</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              转化完成返回MethodInterceptor数组</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅲ 如果没有拦截器链，直接执行目标方法</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          拦截器链：每一个通知方法又被包装为方法拦截器，利用MethodInterceptor机制</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅳ 如果有拦截器链，把需要执行的目标对象，目标方法，拦截器链等所有信息传入创建一个CglibMethodInvocation对象，并调用proceed()返回一个retVal</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      Ⅴ 拦截器链的触发过程</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          1、如果没有拦截器或者拦截器的索引和 拦截器数组 - 1 大小一样（指定到了最后一个拦截器）直接执行目标方法</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          2、链式获取每一个拦截器，拦截器执行invoke方法，每一个拦截器等待下一个拦截器执行完成返回以后再来执行。拦截器链的机制，保证通知方法于目标方法的执行顺序</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 总结：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  1、@EnableAspectJAutoProxy 开启AOP功能</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  2、@EnableAspectJAutoProxy会给容器中注册一个组件AnnotationAwareAspectJAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  3、AnnotationAwareAspectJAutoProxyCreator是一个后置处理器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  4、容器的创建流程</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      1、registerBeanPostProcessors(beanFactory); 注册后置处理器，创建AnnotationAwareAspectJAutoProxyCreator</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      2、finishBeanFactoryInitialization(beanFactory); 初始化剩下的单实例bean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          1、创建业务逻辑组件和切面组件</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          2、AnnotationAwareAspectJAutoProxyCreator拦截组件的创建过程</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          3、组件创建完成后，判断组件是否需要增强</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              是：切面的通知方法，包装成增强器（Advisor）；给业务逻辑组件创建一个代理对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *  5、执行目标方法</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      1、代理对象执行目标方法</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *      2、CglibAopProxy.DynamicAdvisedInterceptor#intercept();</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          1、得到目标方法的拦截器链（增强器包装成拦截器MethodInterceptor）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          2、利用拦截器的链式机制，依次进入每一个拦截器进行执行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *          3、效果</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              正常执行：前置通知-》目标方法-》后置通知-》返回通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *              出现异常：前置通知-》目标方法-》后置通知-》异常通知</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * @Author pengbin007</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * @Date 2022/1/29 20:21</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span></code></pre></div>`,1),t=[e];function l(h,k,r,A,o,D){return n(),a("div",null,t)}const y=s(p,[["render",l]]);export{d as __pageData,y as default};
