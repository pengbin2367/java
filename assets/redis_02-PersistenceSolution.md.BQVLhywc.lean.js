import{_ as n,D as t,c as l,j as s,a,I as p,w as d,a5 as e,o}from"./chunks/framework.BBnPlPAH.js";const C=JSON.parse('{"title":"Redis持久化解决方案","description":"","frontmatter":{},"headers":[],"relativePath":"redis/02-PersistenceSolution.md","filePath":"redis/02-PersistenceSolution.md","lastUpdated":1729870203000}'),r={name:"redis/02-PersistenceSolution.md"},h=e("",12),c=s("code",null,"save",-1),u=s("code",null,"bgsave",-1),k=e("",12);function _(b,m,f,g,v,F){const i=t("font");return o(),l("div",null,[h,s("p",null,[c,a("和"),u,a("命令都可以触发，但我们只能使用"),p(i,{style:{color:"red","font-weight":"bold","font-size":"24px"}},{default:d(()=>[a("bgsave")]),_:1}),a("（这是由于save指令在高并发情况下会阻塞当前Redis服务器，直到dump操作完成）")]),k])}const A=n(r,[["render",_]]);export{C as __pageData,A as default};