import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Java",
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
            text: "集合相关",
            link: "/basic/collection/CollectionInterviewQuestions",
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
          text: "Java基础",
          items: [
            {
              text: "Java集合概述",
              link: "/basic/collection/CollectionIntro",
            },
            {
              text: "深入Java集合系列之——HashMap",
              link: "/basic/collection/CollectionOfHashMap",
            },
            {
              text: "集合面试题",
              link: "/basic/collection/CollectionInterviewQuestions",
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
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/pengbin2367/java" },
    ],
  },
});
