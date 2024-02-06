export default{
  title: "Kuber's World",
  description: 'kuber的文章',
  
  themeConfig: {
    siteTitle: "Kuber's World",
    logo: "/logo.png",
    nav: [
      { text: "博客", link: "/articles/生成https证书" },
      { text: "GuideTest", link: "/guide/test" },
      { text: "gitee", link: "https://gitee.com/geeksdidi" },
      {
        text: "Drop Menu",
        items: [
          {
            items: [
              { text: "Item A1", link: "/item-A1" },
              { text: "Item A2", link: "/item-A2" },
            ],
          },
          {
            items: [
              { text: "Item B1", link: "/item-B1" },
              { text: "Item B2", link: "/item-B2" },
            ],
          },

        ]
      }
    ],
    sidebar: {
      "/articles/": [
        {
          text: "组件库源码实现",
          collapsible: true,
          collapsed:true,
          items: [
            {
              text: "组件库环境搭建",
              link: "/articles/组件库环境搭建",
            },
            { text: "gulp的使用", link: "/articles/gulp的使用" },
          ],
        },
        {
          text: "vue教程",
          collapsible: true,
          collapsed:true,
          items: [
            {
              text: "生成https证书",
              link: "/articles/生成https证书",
            },
          ],
        },
      ],
    },


    socialLinks: [
      { icon: "github", link: "https://github.com/rancho9360" },
      { icon: "twitter", link: "https://twitter.com/rancho_smith" },
      // You can also add custom icons by passing SVG as string:
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>',
        },
        link: "...",
      },
    ],
  },
  
}