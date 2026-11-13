import { defineConfig } from 'vitepress'
export default defineConfig({
  lang: 'zh-CN',
  title: 'ROS 2 Navigation Notes',
  description: 'ROS 2 · SLAM · Nav2 · VLN 学习知识库',
  base: '/ros2-navigation-notes/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [{ text: '首页', link: '/' }, { text: '8 周计划', link: '/roadmap/8-week-plan' }, { text: '开源项目', link: '/projects/open-source' }],
    sidebar: [
      { text: '学习路线', items: [{ text: '8 周学习计划', link: '/roadmap/8-week-plan' }] },
      { text: 'ROS 2', items: [{ text: '基础', link: '/ros2/basics' }, { text: '环境', link: '/ros2/environment' }, { text: '常用命令', link: '/ros2/commands' }] },
      { text: '导航系统', items: [{ text: 'SLAM 与定位', link: '/navigation/slam' }, { text: 'Nav2', link: '/navigation/nav2' }, { text: '自定义规划', link: '/navigation/path-planning' }] },
      { text: '实践与进阶', items: [{ text: '真机导航', link: '/robot/real-robot' }, { text: '论文实验', link: '/robot/experiments' }, { text: 'VLN', link: '/vln/introduction' }, { text: '开源项目', link: '/projects/open-source' }] }
    ],
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/sks-curry/ros2-navigation-notes' }],
    outline: { label: '本页目录', level: [2,3] },
    editLink: { pattern: 'https://github.com/sks-curry/ros2-navigation-notes/edit/main/docs/:path', text: '在 GitHub 编辑' }
  }
})