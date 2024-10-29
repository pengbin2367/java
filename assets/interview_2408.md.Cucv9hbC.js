import{_ as a,c as e,o as i,a5 as l}from"./chunks/framework.BAO6c_AF.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"interview/2408.md","filePath":"interview/2408.md","lastUpdated":1729870203000}'),r={name:"interview/2408.md"},t=l('<h2 id="首页热门专辑所有实现步骤" tabindex="-1">首页热门专辑所有实现步骤 <a class="header-anchor" href="#首页热门专辑所有实现步骤" aria-label="Permalink to &quot;首页热门专辑所有实现步骤&quot;">​</a></h2><p>在首页是每个一级分类对应一个页面，页面会展示这个一级分类下排序最靠前的7个三级分类以及这七个三级分类下排序最靠前的六个专辑。从代码实现层面上来说，前端会传一个一级分类id给我们，然后我们根据这个一级分类id找到他对应的所有二级分类id，再根据查出来的二级分类id去三级分类表中找出所有的三级分类，并且排好序得到七个三级分类</p><p>最后根据这些三级分类id去ES中构建搜索条件，找出每个三级分类排序最靠前的六条专辑数据。然后将结果封装成一个map返回给前端，map中key就是三级分类，value就是这六条专辑数据组成的list</p><h2 id="关键词自动补全步骤" tabindex="-1">关键词自动补全步骤 <a class="header-anchor" href="#关键词自动补全步骤" aria-label="Permalink to &quot;关键词自动补全步骤&quot;">​</a></h2><p>关键词自动补全是指在用户搜索的时候，系统会根据输入的内容及其拼音和拼音首字母三者去进行匹配查找，在搜索框下面显示十条相关数据，这里主要是使用ES来实现的。首先在专辑上架的时候，会将数据同步一份到ES的一个索引albuminfo中，除此之外还会将专辑的名字、作者名字和专辑简介这三个字段的内容、全拼和拼音首字母也存入到ES的一个索引suggestinfo中。自动补全就是从suggestinfo索引中进行匹配，它根据我们输入的内容、全拼和拼音首字母去suggestinfo中进行匹配</p><h2 id="java集合体系结构-有哪些线程安全的集合实现类型" tabindex="-1">Java集合体系结构，有哪些线程安全的集合实现类型 <a class="header-anchor" href="#java集合体系结构-有哪些线程安全的集合实现类型" aria-label="Permalink to &quot;Java集合体系结构，有哪些线程安全的集合实现类型&quot;">​</a></h2><p>Java的集合体系它指的是List、Set和Map,其中List和Set是单列集合，而Map是kv键值对的双列集合。在List集合体系下，主要有ArrayList和LinkedList，可以存储重复的元素，可以按下标进行访问；而Set集合则不可以存储重复的元素，主要是HashSet、LinkedHashSet和TreeSet，其中TreeSet会按照自然顺序或者自定义的排序规则进行排序。对于Map集合主要有HashMap、LinkedHashMap和TreeMap，其中Map的键是不可重复的，而值是可重复的</p><h2 id="hashset如何去重-如何存储数据" tabindex="-1">HashSet如何去重，如何存储数据 <a class="header-anchor" href="#hashset如何去重-如何存储数据" aria-label="Permalink to &quot;HashSet如何去重，如何存储数据&quot;">​</a></h2><p>HashSet内部是使用的HashMap存储数据，这个Map的key就是HashSet的值，而value是一个固定的PERSENT对象。而Map的key是不可重复的，当添加数据时，会先根据hashCode方法返回的哈希码来确定存储的桶位置，在根据equals方法确定是否与该位置的元素重复，如果重复，则添加失败</p><h2 id="什么是线程安全问题-高并发可以选择哪些map集合存储数据-各有什么特点" tabindex="-1">什么是线程安全问题，高并发可以选择哪些map集合存储数据，各有什么特点 <a class="header-anchor" href="#什么是线程安全问题-高并发可以选择哪些map集合存储数据-各有什么特点" aria-label="Permalink to &quot;什么是线程安全问题，高并发可以选择哪些map集合存储数据，各有什么特点&quot;">​</a></h2><p>线程安全是指在多线程环境下，多个请求访问同一个对象，可能出现得到的数据不一致问题。在高并发下可以选择的map集合主要有以下三种：</p><ol><li>Hashtable,它是Java早期提供的线程安全的map集合，主要是通过synchronized关键字实现的同步，会对整个hash表加锁，效率较低</li><li>Collections.synchronizedMap,它可以将线程不安全的map转换成线程安全的map，但同样的加锁粒度大，性能较低</li><li>ConcurrentHashMap,通过CAS操作和synchronized的细粒度锁，拥有较高的并发性能，是处理大量并发数据读写的理想选择</li></ol><h2 id="专辑详情功能中专辑信息部分的实现思路" tabindex="-1">专辑详情功能中专辑信息部分的实现思路 <a class="header-anchor" href="#专辑详情功能中专辑信息部分的实现思路" aria-label="Permalink to &quot;专辑详情功能中专辑信息部分的实现思路&quot;">​</a></h2><p>专辑详情中的专辑信息主要包括专辑名称、分类、作者名称、购买量、收藏量等等，这个功能我们是放在搜索模块去实现的，因此就需要去专辑模块和用户模块远程调用获取数据，这里主要分为四个远程调用。从专辑模块的专辑中获取专辑基础信息，从专辑模块的分类中获取专辑分类信息，从专辑模块的统计信息中获取专辑的购买量、收藏量等，从用户模块获取作者名称，其中分类信息和作者名称需要先从专辑基础信息中获取。这里为了提高性能，使用了CompletableFuture异步编排来优化。先通过supplyAsync、runAsync和thenAcceptAsync方法进行链式调用获取结果，在通过allOf方法来组合结果。这些方法需要传入一个线程池参数，它默认是使用ForkJoinPool的公共线程池，为非阻塞的cpu密集型任务设计的。我们使用了自定义的线程池，它需要指定一些参数，比如核心线程数、最大线程数、空闲线程存活时间、时间单位和工作队列等，那么对于核心线程数的设置，一般分为cpu密集型和io密集型任务，对于cpu密集型，一般设置为cpu数量+1；对于io密集型一般设置为（线程等待时间+线程cpu时间）/线程cpu时间再乘以cpu数量。而最大线程数这需要根据服务器的负载能力来设置。对于需要保证有序的任务，使用有界队列，而对于可以容忍无序或丢失的任务，使用无界队列</p><h2 id="专辑详情功能中声音部分付费标识处理情况" tabindex="-1">专辑详情功能中声音部分付费标识处理情况 <a class="header-anchor" href="#专辑详情功能中声音部分付费标识处理情况" aria-label="Permalink to &quot;专辑详情功能中声音部分付费标识处理情况&quot;">​</a></h2><p>在专辑详情页面有该专辑的所有声音列表，对于专辑来说，有免费专辑、vip免费和整专付费和声音按集付费。同时，对于需要付费的专辑，可能存在免费的集数，也就是所谓的试看集数。那么当我们访问专辑详情页，并且发起获取声音详情的请求时，会传递给我们后端一个专辑id,以及分页用到的参数。那么根据这个专辑id,就可以去专辑表中获取这个专辑的类型是付费、免费还是vip免费，同时获取免费的集数。对于免费的专辑，直接从声音表中根据专辑id获取所有声音返回即可。对于vip免费的专辑，我们先要去用户服务获取当前用户身份，如果是vip,直接返回刚才查得所有声音列表即可。而非vip用户，就需要遍历查出的声音列表，判断声音的排序是否大于免费的集数。如果大于，说明需要开通vip才能观看，那么我们就设置返回的对象的showMark属性为true,也就是让前端显示付费表示。那么对于专辑付费的声音来说，先判断是整专付费还是按集购买。如果是整专付费，去用户服务从用户购买专辑表中获取该用户是否购买该专辑，从而对声音的showMark属性进行处理。如果是按集购买，则去用户服务从用户购买声音表中获取该用户购买了该专辑那些声音（用户购买声音表中除了有声音id外还有专辑id,这方便我们这时候去查找用户购买了该专辑下哪些声音）</p><h2 id="如何生成声音套餐选择页面" tabindex="-1">如何生成声音套餐选择页面 <a class="header-anchor" href="#如何生成声音套餐选择页面" aria-label="Permalink to &quot;如何生成声音套餐选择页面&quot;">​</a></h2><p>首先，不管是专辑、Vip还是声音，在生成订单之前，需要先进行重复性校验，看当前系统中当前用户是否已经购买过。那么对于声音套餐的选择，是用户在专辑详情也点击某个声音的付费标识后，会弹出一个选择框。在这里，最多有五种选择，一个是本集，另外是10集、20、30集这样，如果后面还有更多，则是以全部来显示。在后端处理层面，首先会根据传入的声音信息去声音表中查询对应的专辑id,再根据这个专辑id获取后面所有用户可购买的声音集合，根据查出来的集合，去构造最多五个选择套餐返回给前端</p><h2 id="mongodb特点和使用场景" tabindex="-1">MongoDB特点和使用场景 <a class="header-anchor" href="#mongodb特点和使用场景" aria-label="Permalink to &quot;MongoDB特点和使用场景&quot;">​</a></h2><p>MongoDB它是一种以二进制的json格式来存储数据的，以文档为中心，提供了高可用、高性能和易扩展的体验，并且自动添加索引，支持事务、内置聚合框架。主要应用场景有内容管理系统，比如博客系统中的文章内容、用户评论等，以及个性化推荐系统，通过存储用户行为，使用聚合框架，为用户提供个性化选择</p><h2 id="nignx是什么-有哪些作用-负载均衡实现流程" tabindex="-1">Nignx是什么，有哪些作用，负载均衡实现流程 <a class="header-anchor" href="#nignx是什么-有哪些作用-负载均衡实现流程" aria-label="Permalink to &quot;Nignx是什么，有哪些作用，负载均衡实现流程&quot;">​</a></h2><p>nginx是一个高性能的http和反向代理服务器，目前广泛应用与各种网站与服务中。它主要的主用有作为Web服务器，比如用作静态文件服务器，直接服务于html、css和javascript等静态资源；第二点是作为反向代理服务器，将来自后端的请求转发到服务器上，可以实现负载均衡，也就是第三点，将请求分发到多个服务器，提高系统的可用性和性能；第四一个是作为缓存，它支持http缓存，可以减少后端服务器的压力；另外，它也可以处理ssl和tls加密，以及限制访问频率等安全措施</p><p>它的负载均衡实现有以下步骤：</p><ol><li>在配置文件中定义一个upstream块，该块包含一组服务器名称和地址</li><li>接着在server块中指定一个location块，指定请求应该被转发到哪个upstream块中</li><li>配置好转发块后，还可以配置健康检查，比如在upstream中添加check指令</li><li>配置完成后，重启nginx使其生效后进行测试</li></ol><p>关于它实现的原理涉及多个方面，包括请求的接收、负载均衡算法的选择、健康检查机制以及后端服务器的动态管理等。首先客户端发送请求，nginx作为反向代理服务器接收到请求，这些请求可能是http或者https协议发送，也可能包含各种类型的请求，比如html页面、图片、css资源等。nginx根据配置文件中的配置规则来决定如何处理请求，这些规则定义在server和location块中，通过匹配请求的url、http方法和请求头等信息来确定转发到哪个后端服务器或者upstream。接着就是选择负载均衡算法了，这可以在upstream块中进行配置，比如轮询、最少连接数、IP哈希等。然后根据健康检查规则检查服务器状态，如果出现故障，nginx可以将其暂时从负载均衡池中移出，等待其恢复正常再加入。另外，也可以在nginx运行时，通过修改配置文件，动态添加服务器后通过reload指令重新加载配置。一旦确定好转发的服务器地址后，nginx就会通过proxy_pass指令转发给该服务器，这是也可以配置一些额外行为，比如修改请求头、添加认证信息等。最后就是响应处理，比如缓存响应、修改响应头等，然后将响应返回给原客户端</p><h2 id="tcp三次握手-四次挥手" tabindex="-1">TCP三次握手，四次挥手 <a class="header-anchor" href="#tcp三次握手-四次挥手" aria-label="Permalink to &quot;TCP三次握手，四次挥手&quot;">​</a></h2><p>tcp它是面向连接的、可靠的、基于字节流的传输层协议，它通过三次握手建立连接、四次挥手断开连接</p><p>三次握手的过程：客户端发起带有SYN标识的tcp请求，服务器收到请求后，响应一个带有ACK标识的tcp请求，客户端接收到服务器的响应请求后，再发送一个带有SYN标识的tcp请求，至此，连接成功建立</p><p>四次挥手的过程：客户端发起一个带有FIN标识的tcp请求，服务器收到请求后，响应一个ACK请求，此时，服务器将剩余未传输完的数据传输完成后，发送一个FIN标识的请求给客户端，客户端收到后，返回一个ACK请求给服务器</p><h2 id="专辑检索流程" tabindex="-1">专辑检索流程 <a class="header-anchor" href="#专辑检索流程" aria-label="Permalink to &quot;专辑检索流程&quot;">​</a></h2><p>用户在首页顶部搜索栏，输入想要搜索的内容，后端根据传过来的内容，去ES中进行关键字搜索。实现这一功能的前提是在添加专辑时，将专辑名称、作者名称和专辑简介作为一个suggestindex存储到了ES中，suggestindex包含关键字、关键字全拼、关键字首拼。最后，将ES的查询结果进行高亮处理后返回给前端展示</p><h2 id="线程池7大参数-核心线程数如何定义" tabindex="-1">线程池7大参数，核心线程数如何定义 <a class="header-anchor" href="#线程池7大参数-核心线程数如何定义" aria-label="Permalink to &quot;线程池7大参数，核心线程数如何定义&quot;">​</a></h2><ol><li>核心线程数</li><li>最大线程数</li><li>线程空闲时间</li><li>时间单位</li><li>任务队列</li><li>线程工厂</li><li>拒绝策略</li></ol><p>如果是cpu密集型任务，一般将核心线程数设置和cpu核数相同</p><p>如果是io密集型任务，核心线程数可以适当增加</p><h2 id="线程池工作过程" tabindex="-1">线程池工作过程 <a class="header-anchor" href="#线程池工作过程" aria-label="Permalink to &quot;线程池工作过程&quot;">​</a></h2><p>线程池工作过程主要分为以下四个阶段：</p><ol><li><p>初始化阶段</p><p>根据线程池的配置进行线程池的初始化</p></li><li><p>任务提交阶段</p><p>当一个任务提交给线程池后，它会决定如何处理这个任务，如果</p><ul><li>当前运行线程数 &lt; 核心线程数 创建新线程</li><li>当前运行线程数 = 核心线程数 &amp;&amp; 工作队列未满 加入工作队列</li><li>工作队列已满 &amp;&amp; 当前运行线程数 &lt; 最大线程数 创建新线程</li><li>工作队列已满 &amp;&amp; 当前运行线程数 = 最大线程数 拒绝策略</li></ul></li><li><p>任务执行阶段</p><p>当一个线程从工作队列取出一个任务执行，过程中发生异常，并不会立即停止线程，而是标记不可用，并使用其他线程替换</p></li><li><p>线程回收阶段</p><p>当一个非核心线程空闲时间超过指定时间，线程会立即终止</p></li></ol><p>拒绝策略有四种：默认的抛出异常、默默丢弃、丢弃队列中最旧的任务，并尝试重新提交任务、由调用execute方法的线程来执行任务</p><h2 id="bean生命周期" tabindex="-1">Bean生命周期 <a class="header-anchor" href="#bean生命周期" aria-label="Permalink to &quot;Bean生命周期&quot;">​</a></h2><p>创建</p><p>注入</p><p>初始化</p><p>活跃</p><p>销毁</p><h2 id="oop三要素-多态使用场景" tabindex="-1">OOP三要素，多态使用场景 <a class="header-anchor" href="#oop三要素-多态使用场景" aria-label="Permalink to &quot;OOP三要素，多态使用场景&quot;">​</a></h2><p>封装、继承、多态</p><p>接口实现、方法重写、向上转型、抽象类与继承、回调机制、模板方法模式</p><h2 id="es查询方式-关键字" tabindex="-1">ES查询方式，关键字 <a class="header-anchor" href="#es查询方式-关键字" aria-label="Permalink to &quot;ES查询方式，关键字&quot;">​</a></h2><p>ES使用json作为数据交换格式，在我的项目主要用到的查询方式有match、term、fuzzy和bool，在匹配分类的时候，需要精确匹配，需要term,同时查询的结果后面的判断条件，需要在外面嵌套一个bool，同时对于专辑名使用match和fuzzy，同时还用到了聚合功能</p><h2 id="专辑上下架流程" tabindex="-1">专辑上下架流程 <a class="header-anchor" href="#专辑上下架流程" aria-label="Permalink to &quot;专辑上下架流程&quot;">​</a></h2><p>专辑上下架实际上就是将专辑信息添加到ES中，方便后面搜索使用。在添加专辑时，专辑信息插入MySQL后，发送一条带有专辑id的消息到RabbitMQ。在搜索模块监听到这条消息后，会执行上架操作，首先根据这个专辑id获取到专辑信息，在根据专辑信息获取到作者信息、分类信息、统计信息、标签信息。然后再将这些信息添加到ES的专辑索引中。同时，还会将专辑名称、作者名称和专辑简介信息这三者的内容、全拼以及首字母拼音存到提示索引中，方便后面实现关键词搜索、自动补全。</p><p>下架流程相对就简单了，根据专辑id,将ES中对应的专辑索引和关键词索引</p><h2 id="redis持久化方案-触发时间-区别" tabindex="-1">Redis持久化方案，触发时间，区别 <a class="header-anchor" href="#redis持久化方案-触发时间-区别" aria-label="Permalink to &quot;Redis持久化方案，触发时间，区别&quot;">​</a></h2><p>rdb生成一个数据快照，将某一时刻的数据保存到硬盘上，他的触发可以是定时、手动和自动。他的优点是使用二进制格式的文件存储，恢复速度快，占用磁盘空间少。但是，可能会丢失最后一次快照后的数据，并且在生成快照时，会占用主进程，影响效率</p><p>aof会以追加的形式将每一次写操作记录下来，触发机制有实时写入和定时写入以及从不同步（仅在系统关闭时同步，性能最好，但最不安全）。优点是几乎不会丢失数据，并且文件内容可阅读，可以人为修复。但是恢复速度慢，文件体积大</p><p>rdb+aof，结合两者优点，rdb做全量备份、aof做增量备份。缺点是增加了系统复杂度，需要更多的磁盘空间</p><h2 id="vue生命周期" tabindex="-1">Vue生命周期 <a class="header-anchor" href="#vue生命周期" aria-label="Permalink to &quot;Vue生命周期&quot;">​</a></h2><p>创建前后、挂载前后、更新前后、销毁前后</p><h2 id="mysql索引失效" tabindex="-1">MySQL索引失效 <a class="header-anchor" href="#mysql索引失效" aria-label="Permalink to &quot;MySQL索引失效&quot;">​</a></h2><ul><li>使用or,左右两边字段需在同一索引中</li><li>使用like,以通配符开头</li><li>索引列参与计算</li><li>索引列类型转换</li><li>使用not in或！=</li><li>索引列顺序不当</li></ul><h2 id="全文搜索引擎-倒排索引" tabindex="-1">全文搜索引擎，倒排索引 <a class="header-anchor" href="#全文搜索引擎-倒排索引" aria-label="Permalink to &quot;全文搜索引擎，倒排索引&quot;">​</a></h2><p>全文搜索引擎是对文档内容进行索引并基于文档内容实现搜索的技术，核心之一就是倒排索引，它是一种高效的数据结构，可以加速对文档内容的搜索</p><p>倒排索引包含两个组成部分：词汇表和倒排列表。词汇表包含文档中所有单词，每个单词都是唯一的，并且每个词条指向一个倒排列表</p><p>倒排索引的构建过程：</p><ul><li>预处理：包括数据清洗，比如去除标点符号，将文本分割成单词或词组，对单词进行标准化处理（比如小写化，去除停用词，词干提取等）</li><li>建立索引：对于每个文档，遍历处理好后的单词，如果他还没有在词汇表，则添加，并为其创建一个新的倒排列表</li></ul><h2 id="单点登录思想-为什么选择" tabindex="-1">单点登录思想，为什么选择 <a class="header-anchor" href="#单点登录思想-为什么选择" aria-label="Permalink to &quot;单点登录思想，为什么选择&quot;">​</a></h2><p>sso核心思想就是通过一个认证服务中心来管理用户登录状态，用户访问一个sso系统时，首先重定向到这个认证中心进行认证。一旦通过，会生成一个令牌或会话，凭借这个就可以在这个sso系统中无缝访问</p><p>选择单点登录原因：</p><ul><li>用户体验更好，一次登录，系统互联，并且这样也更安全</li><li>管理也更便捷，集中</li></ul><p>实现sso：</p><ul><li>基于cookie</li><li>基于token</li><li>基于saml</li><li>基于oauth</li></ul><h2 id="cap定理-为什么无法ca" tabindex="-1">CAP定理，为什么无法CA <a class="header-anchor" href="#cap定理-为什么无法ca" aria-label="Permalink to &quot;CAP定理，为什么无法CA&quot;">​</a></h2><p>c一致性、a可用性、p分区容错性</p><p>没有ca是因为在系统中，网络问题总是无法避免的，因此就必须要保证分区容错性</p><h2 id="异步编排是什么-有哪些技术实现" tabindex="-1">异步编排是什么，有哪些技术实现 <a class="header-anchor" href="#异步编排是什么-有哪些技术实现" aria-label="Permalink to &quot;异步编排是什么，有哪些技术实现&quot;">​</a></h2><p>是指在分布式系统中，通过异步的方式使各个服务或组件之间进行通信和数据流通。在异步编排中，服务之间的通信通常是无阻塞的，即一个服务发起请求后无需等待即可继续处理其他任务</p><p>实现技术：</p><ul><li>消息队列</li><li>发布/订阅模式</li><li>事件驱动架构（SpringClouldStream）</li><li>异步编排模型（CompletableFuture）</li><li>服务网格（Service Mesh）</li></ul><h2 id="mysql优化" tabindex="-1">MySQL优化 <a class="header-anchor" href="#mysql优化" aria-label="Permalink to &quot;MySQL优化&quot;">​</a></h2><h2 id="jwt是什么-包含那几个部分" tabindex="-1">JWT是什么，包含那几个部分 <a class="header-anchor" href="#jwt是什么-包含那几个部分" aria-label="Permalink to &quot;JWT是什么，包含那几个部分&quot;">​</a></h2><p>json web toke，头部、载荷、签名</p><h2 id="gateway在项目做了哪些工作-路由如何确定转发" tabindex="-1">Gateway在项目做了哪些工作，路由如何确定转发 <a class="header-anchor" href="#gateway在项目做了哪些工作-路由如何确定转发" aria-label="Permalink to &quot;Gateway在项目做了哪些工作，路由如何确定转发&quot;">​</a></h2><p>认证、路由转发、配置文件</p><h2 id="springcloud组件" tabindex="-1">SpringCloud组件 <a class="header-anchor" href="#springcloud组件" aria-label="Permalink to &quot;SpringCloud组件&quot;">​</a></h2><h2 id="left-join和inner-join" tabindex="-1">left join和inner join <a class="header-anchor" href="#left-join和inner-join" aria-label="Permalink to &quot;left join和inner join&quot;">​</a></h2><h2 id="mysql引擎-innodb区别" tabindex="-1">MySQL引擎，innodb区别 <a class="header-anchor" href="#mysql引擎-innodb区别" aria-label="Permalink to &quot;MySQL引擎，innodb区别&quot;">​</a></h2><h2 id="sql语句执行流程" tabindex="-1">sql语句执行流程 <a class="header-anchor" href="#sql语句执行流程" aria-label="Permalink to &quot;sql语句执行流程&quot;">​</a></h2><h2 id="git冲突处理流程和处理命令" tabindex="-1">git冲突处理流程和处理命令 <a class="header-anchor" href="#git冲突处理流程和处理命令" aria-label="Permalink to &quot;git冲突处理流程和处理命令&quot;">​</a></h2><h2 id="redis和mysql" tabindex="-1">Redis和MySQL <a class="header-anchor" href="#redis和mysql" aria-label="Permalink to &quot;Redis和MySQL&quot;">​</a></h2><h2 id="redis单线程为什么快" tabindex="-1">Redis单线程为什么快 <a class="header-anchor" href="#redis单线程为什么快" aria-label="Permalink to &quot;Redis单线程为什么快&quot;">​</a></h2><h2 id="redis常用数据类型和应用场景" tabindex="-1">Redis常用数据类型和应用场景 <a class="header-anchor" href="#redis常用数据类型和应用场景" aria-label="Permalink to &quot;Redis常用数据类型和应用场景&quot;">​</a></h2><h2 id="数据库做过哪方面优化" tabindex="-1">数据库做过哪方面优化 <a class="header-anchor" href="#数据库做过哪方面优化" aria-label="Permalink to &quot;数据库做过哪方面优化&quot;">​</a></h2><h2 id="创建线程的方式" tabindex="-1">创建线程的方式 <a class="header-anchor" href="#创建线程的方式" aria-label="Permalink to &quot;创建线程的方式&quot;">​</a></h2><hr><h2 id="华为od" tabindex="-1">华为od <a class="header-anchor" href="#华为od" aria-label="Permalink to &quot;华为od&quot;">​</a></h2><h3 id="自我介绍" tabindex="-1">自我介绍 <a class="header-anchor" href="#自我介绍" aria-label="Permalink to &quot;自我介绍&quot;">​</a></h3><p>尊敬的面试官，您好！</p><p>我是彭钟诚，2023年毕业于南昌大学计算机科学与技术专业。在大学期间，我不仅系统地学习了计算机科学的基础理论，还积极参与了多个实践项目，积累了扎实的专业基础。毕业后，我选择了继续深造，参加了2023年的研究生入学考试，虽然未能如愿考上，但这段时间的经历让我更加坚定了投身于IT行业的决心。</p><p>我一直对华为的技术实力和企业文化充满了敬佩，华为在全球通信和信息技术领域的领先地位，以及不断创新的精神深深吸引了我。我希望能够在华为这样的大平台工作，不仅是因为这里汇聚了一大批优秀的技术人才，更是因为我相信在这里能够获得更多的学习和成长机会，实现自我价值。</p><p>在准备考研的同时，我也不断加强自己的技术能力，特别是对Java编程语言进行了深入的学习。通过自学和实践，我已经掌握了Java的核心技术栈，并且独立完成了一个分布式微服务项目。虽然该项目尚未上线，但它让我在微服务架构设计、Spring Boot框架的应用以及Docker容器化等方面积累了宝贵的经验。</p><p>我非常希望能够加入华为，成为一名Java开发工程师。我相信，通过在华为的工作，我不仅可以进一步提升自己的技术能力，还能在实践中不断成长，为公司的发展贡献自己的力量。我渴望成为华为的一员，与优秀的同事们一起携手前行，共同推动技术创新。</p><p>感谢您花时间听我介绍。</p><h3 id="为什么选择考研" tabindex="-1">为什么选择考研 <a class="header-anchor" href="#为什么选择考研" aria-label="Permalink to &quot;为什么选择考研&quot;">​</a></h3><p>我选择考研主要是出于对计算机科学的热爱和对未来职业发展的考虑。首先，我在本科期间对计算机科学产生了浓厚的兴趣，特别是在软件开发和系统架构方面。我希望通过研究生的学习，能够更加深入地研究这些领域，进一步提升自己的专业水平。</p><p>其次，我认为考研可以为我的职业生涯打下更坚实的基础。随着技术的飞速发展，市场上对高级技术人才的需求越来越大。我希望通过研究生阶段的学习，能够掌握更多的前沿技术，提高自己的竞争力，为将来的工作奠定更好的基础。</p><p>此外，考研也是我个人成长的一部分。研究生阶段不仅能够让我在学术上有所进步，还能培养我的研究能力和解决问题的能力。这些都是我在未来的职业生涯中所需要的素质。</p><p>虽然最终我没有成功考取研究生，但这段经历让我更加珍惜每一次学习和实践的机会。我坚信，通过不断的努力和积累，我依然能够在技术领域取得成就。这也是我选择加入华为的原因之一，因为在这里我可以与优秀的同事一起工作，共同成长，实现自己的职业目标。</p><h3 id="为什么选择华为" tabindex="-1">为什么选择华为 <a class="header-anchor" href="#为什么选择华为" aria-label="Permalink to &quot;为什么选择华为&quot;">​</a></h3><p>我选择华为的原因有很多，首先是华为在全球通信和信息技术领域的领导地位。华为不仅是中国的骄傲，也是全球范围内备受尊敬的高科技企业。我非常钦佩华为在5G、云计算、人工智能等多个前沿技术领域的成就，这些技术正在改变世界，推动社会的进步和发展。</p><p>其次，华为在技术研发方面的投入和成果令人印象深刻。华为每年都会投入大量的资金和人力进行研发，致力于技术创新和产品升级。作为一名技术爱好者，我深知技术创新的重要性，也非常希望能够加入到这样一家重视研发的企业中，与一群优秀的同事一起推动技术的发展。</p><p>另外，华为的企业文化和发展前景也深深地吸引了我。华为强调‘以客户为中心’的理念，始终把客户需求放在第一位，这种客户至上的态度让我深受启发。同时，华为也注重员工的成长和发展，提供了丰富的培训机会和广阔的职业发展空间。我相信在华为工作，不仅能够提升我的技术能力，还能让我在职业道路上走得更远。</p><p>最后，我个人的职业规划与华为的发展方向高度契合。我希望能够在一家有远见卓识、勇于创新的企业中工作，华为正是这样一个理想的平台。在这里，我能够接触到最前沿的技术，参与有意义的项目，并且与优秀的团队一起成长。我相信，通过在华为的工作，我不仅能够实现个人的价值，还能为公司的发展贡献自己的力量。</p><h3 id="毕业一年在干吗" tabindex="-1">毕业一年在干吗 <a class="header-anchor" href="#毕业一年在干吗" aria-label="Permalink to &quot;毕业一年在干吗&quot;">​</a></h3><p>过去一年对我来说是一个充满学习和成长的过程，在去年下半年的备考期间，我系统地复习了计算机科学的基础知识。虽然考研未能成功，但我认为这段经历让我更加成熟，也让我更加明确了自己的职业方向。</p><p>在得知考研结果后，我没有气馁，而是迅速调整了心态，决定将这段时间用来提升自己的技术能力。我通过自学和实践，深入学习了Java编程语言及其相关的技术栈，包括Spring Boot、Spring Cloud、Docker等。此外，我还通过在线课程和书籍系统地学习了微服务架构的设计与实现。</p><p>为了将所学知识应用到实践中，我独立完成了一个分布式微服务项目。虽然这个项目尚未上线，但通过这个项目，我不仅巩固了所学的知识，还学会了如何解决实际开发中遇到的各种问题，并且对微服务架构有了深入的理解。</p><p>通过这段时间的学习和实践，我更加坚定了成为一名Java开发工程师的决心。我希望能够在华为这样的优秀平台上，与一群志同道合的同事一起工作，共同推动技术创新。我相信，通过不断的努力和学习，我能够在技术领域取得更大的成就。</p><p>总的来说，过去的一年对我来说是充实而富有意义的。虽然考研未能成功，但我通过这段时间的努力，不仅提升了技术能力，还积累了宝贵的实践经验。我希望能够在华为找到一份Java开发工程师的工作，为公司的发展贡献自己的力量。</p><h3 id="你的优势" tabindex="-1">你的优势 <a class="header-anchor" href="#你的优势" aria-label="Permalink to &quot;你的优势&quot;">​</a></h3><ul><li><strong>快速学习新技术</strong>：我对新技术保持着极大的热情，能够快速学习并掌握新的技术和工具。例如，我最近自学了Kubernetes，并将其应用于我的项目中，提高了系统的可维护性和扩展性。</li><li><strong>持续自我提升</strong>：即使在考研失利后，我也从未停止学习。通过在线课程和实战项目，我不断强化自己的技术能力，并且始终保持对技术前沿的关注。</li></ul><h3 id="校园经历" tabindex="-1">校园经历 <a class="header-anchor" href="#校园经历" aria-label="Permalink to &quot;校园经历&quot;">​</a></h3><h3 id="工作内容" tabindex="-1">工作内容 <a class="header-anchor" href="#工作内容" aria-label="Permalink to &quot;工作内容&quot;">​</a></h3>',123),o=[t];function h(n,p,s,d,c,u){return i(),e("div",null,o)}const m=a(r,[["render",h]]);export{q as __pageData,m as default};