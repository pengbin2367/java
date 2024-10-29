import{_ as a,c as e,o as t,a5 as r}from"./chunks/framework.BAO6c_AF.js";const u=JSON.parse('{"title":"递归和master公式","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/020-RecursionAndTheMasterFormula.md","filePath":"algorithm/020-RecursionAndTheMasterFormula.md","lastUpdated":1729870203000}'),o={name:"algorithm/020-RecursionAndTheMasterFormula.md"},n=r('<h1 id="递归和master公式" tabindex="-1">递归和master公式 <a class="header-anchor" href="#递归和master公式" aria-label="Permalink to &quot;递归和master公式&quot;">​</a></h1><p>1）从思想上理解递归：对于新手来说，递归去画调用图是非常重要的，有利于分析递归</p><p>2）从实际上理解递归：递归不是玄学，底层是利用系统栈来实现的</p><p>3）任何递归函数都一定可以改成非递归，不用系统帮你压栈（系统栈空间），自己压栈呗（内存空间）</p><p>4）递归改成非递归的必要性：</p><p>​ a. 工程上几乎一定要改，除非确定数据量再大递归也一定不深，归并排序、快速排序、线段树、很多的平衡树等，后面都讲</p><p>​ b. 算法笔试或者比赛中（能通过就不改）</p><p>5）master公式</p><p>​ a. 所有子问题规模相同的递归才能用master公式，T(n) = a * T(n/b) + O(n^c)，a、b、c都是常数</p><p>​ b. 如果log(b,a) &lt; c，复杂度为：O(n^c)</p><p>​ c. 如果log(b,a) &gt; c，复杂度为：O(n^log(b,a))</p><p>​ d. 如果log(b,a) == c，复杂度为：O(n^c * logn)</p><p>6）一个补充</p><p>​ T(n) = 2*T(n/2) + O(n*logn)，时间复杂度是O(n * ((logn)的平方))，证明过程比较复杂，记住即可</p>',14),s=[n];function p(c,l,_,i,m,d){return t(),e("div",null,s)}const T=a(o,[["render",p]]);export{u as __pageData,T as default};