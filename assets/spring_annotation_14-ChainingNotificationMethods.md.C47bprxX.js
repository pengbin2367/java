import{_ as s,c as i,o as a,a5 as n}from"./chunks/framework.BAO6c_AF.js";const t="/java/assets/image-20220207213847384.BNk1c6hP.png",e="/java/assets/image-20220207214010529.DSlKUN7T.png",p="/java/assets/image-20220207214706280.D10P7TuN.png",h="/java/assets/image-20220207214904487.DDyrUbDU.png",l="/java/assets/image-20220207214940867.dyE2LJlj.png",k="/java/assets/image-20220207215259049.D4bWnI3b.png",r="/java/assets/image-20220207220925290.Dr6tTlpC.png",C=JSON.parse('{"title":"Spring注解驱动开发【源码】——AOP原理——链式调用通知方法","description":"","frontmatter":{"title":"Spring注解驱动开发【源码】——AOP原理——链式调用通知方法","date":"2022-02-06T11:43:59.000Z","tags":null},"headers":[],"relativePath":"spring/annotation/14-ChainingNotificationMethods.md","filePath":"spring/annotation/14-ChainingNotificationMethods.md","lastUpdated":1729870203000}'),d={name:"spring/annotation/14-ChainingNotificationMethods.md"},E=n('<p>前面已经知道了：</p><ul><li>registerBeanPostProcessors(beanFactory); 注册bean的后置处理器来方便拦截bean的创建。</li><li>finishBeanFactoryInitialization(beanFactory); 完成BeanFactory初始化工作，创建剩下的单实例bean。</li><li>后置处理器会创建cglib的动态代理。</li><li>this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass); 获取拦截器链。</li></ul><p>下面来看一下，这个拦截器链是如何执行的！我们进入我们的proceed方法：</p><p><img src="'+t+`" alt="image-20220207213847384"></p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">proceed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() throws Throwable {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // We start with an index of -1 and increment early.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.currentInterceptorIndex </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.interceptorsAndDynamicMethodMatchers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> invokeJoinpoint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Object interceptorOrInterceptionAdvice </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">         this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.interceptorsAndDynamicMethodMatchers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.currentInterceptorIndex);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (interceptorOrInterceptionAdvice </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">instanceof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> InterceptorAndDynamicMethodMatcher) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // Evaluate dynamic method matcher here: static part will already have</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // been evaluated and found to match.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InterceptorAndDynamicMethodMatcher dm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            (InterceptorAndDynamicMethodMatcher) interceptorOrInterceptionAdvice;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (dm.methodMatcher.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">matches</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.method, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.targetClass, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.arguments)) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">         return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dm.interceptor.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">invoke</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         // Dynamic matching failed.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         // Skip this interceptor and invoke the next in the chain.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">         return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> proceed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // It&#39;s an interceptor, so we just invoke it: The pointcut will have</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // been evaluated statically before this object was constructed.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ((MethodInterceptor) interceptorOrInterceptionAdvice).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">invoke</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>在这里面，首先会判断：当前的索引是不是跟拦截器链的大小减一是一样的。而这个索引我们跳转到它的定义处可以看到，默认是-1的。所以在这里，需要用拦截器链的大小减一。那么，如果没有拦截器或者指定到来最后一个拦截器，就会直接执行目标方法。</p><p><img src="`+e+'" alt="image-20220207214010529"></p><p>接着，它会获取到当前的拦截器，第一个是默认的拦截器，不执行操作：</p><p><img src="'+p+'" alt="image-20220207214706280"></p><p>需要注意的是，这里使用了前加加，来让索引自增，是拦截器链能往下走。</p><p>接着来到我们的返回通知：</p><p><img src="'+h+'" alt="image-20220207214904487"></p><p>然后执行invoke方法：</p><p><img src="'+l+'" alt="image-20220207214940867"></p><p>接着是我们的后置通知，然后执行invoke方法；</p><p>然后是前置通知，然后执行invoke方法；</p><p>然后会执行目标方法：</p><p><img src="'+k+'" alt="image-20220207215259049"></p><p>目标方法执行完后，又会按照拦截器链相反的顺序一层层进行回调。</p><p><img src="'+r+'" alt="image-20220207220925290"></p><p>总的来说，就是<strong>链式获取每一个拦截器，拦截器执行invoke方法，每一个拦截器等待下一个拦截器执行完成返回以后再来执行。拦截器链的机制，保证通知方法于目标方法的执行顺序</strong>.</p><ul><li>正常执行：前置通知-》目标方法-》后置通知-》返回通知</li><li>出现异常：前置通知-》目标方法-》后置通知-》异常通知</li></ul>',22),c=[E];function g(o,y,m,F,A,D){return a(),i("div",null,c)}const v=s(d,[["render",g]]);export{C as __pageData,v as default};
