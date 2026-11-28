import { defineSolitudeConfig } from './lib/config';

export default defineSolitudeConfig({
  site: 'https://example.org',
  title: "STEP 跬步·Nick's Blog",
  description: '立志于远方的一抹斜杠\n无论是工作 还是生活\n热情都来自于汲取新的养分\n最终又归于一些小小的创作',
  locale: 'zh-CN',
  timeZone: 'Asia/Shanghai',
  hasCJKLanguage: true,
  author: { name: 'STEP 跬步' },
  menus: [
    {
      name: '文章',
      children: [
        { name: '素笺拾墨', url: '/archives/', icon: 'icon-file-description' },
        { name: '墨痕分卷', url: '/categories/', icon: 'icon-list-details' },
        { name: '卷列寻章', url: '/tags/', icon: 'icon-tag' },
      ],
    },
    {
      name: '探索',
      children: [
        { name: '浮光拾瞬', url: '/gallery/', icon: 'icon-filters' },
        { name: '步履鸿迹', url: '/footprints/', icon: 'icon-map-pin' },
        { name: '阅序拾遗', url: '/reading/', icon: 'icon-book' },
      ],
    },
    {
      name: '我的',
      children: [
        { name: '一隅片言', url: '/about/', icon: 'icon-user' },
        { name: '器以载光', url: '/equipment/', icon: 'icon-apps' },
        { name: '微言琐记', url: '/brevity/', icon: 'icon-messages' },
      ],
    },
    { name: '友链', url: '/links/' },
  ],
  theme: {
    site: {
      name: { class: 'text', custom: 'STEP 跬步' },
      icon: '/img/logo-favicon.png',
    },
    lightbox: 'fancybox',
    nav: {
      group: {
        项目: [
          {
            name: '跬步博客',
            url: 'https://github.com/IMKINGDOM/Personal-blog-astro-solitude',
            icon: '/img/logo.svg',
          },
          {
            name: '主站Galaxy',
            url: '/galaxy/',
            icon: '/img/logo-favicon.png',
          },
          {
            name: 'Blog更新日志',
            url: '/changelog/',
            icon: '/img/icons/menu-file-description.svg',
          },
        ],
      },
    },
    hometop: {
      banner: {
        title: '以文字记录，以跬步前行',
        desc: '一个基于 Astro 的博客，收录指南、示例与内容组件。',
      },
    },
    aside: {
      home: { noSticky: 'about,date', Sticky: 'allInfo,heatmap' },
      post: { noSticky: 'about,date', Sticky: 'newestPost,allInfo,heatmap' },
      page: { noSticky: 'about,date', Sticky: 'newestPost,allInfo,heatmap' },
      my_card: {
        description: '一抹斜杠 直指星辰',
        content: '立志于远方的一抹斜杠\n无论是工作 还是生活\n热情都来自于汲取新的养分\n最终又归于一些小小的创作\n立于此方小天地\n执笔万里饮长风\n若问有何可取处\n尽在文字山海中',
        state: {
          morning: '早上好，愿你今日顺遂',
          noon: '中午好，记得稍作休息',
          afternoon: '下午好，继续保持热爱',
          night: '晚上好，静享文字时光',
          goodnight: '夜深了，早点休息',
        },
        witty_words: [
          '一抹斜杠，直指星辰',
          '笔墨为刃，此地为驿',
          '山不来见我，我自去见山',
          '读万卷书，行万里路',
          '执笔万里饮长风',
        ],
        information: [
          {
            name: 'GitHub',
            url: 'https://github.com/IMKINGDOM/Personal-blog-astro-solitude',
            icon: 'fab fa-github',
          },
        ],
      },
    },
    footer: {
      information: {
        left: [
          {
            name: 'GitHub',
            url: 'https://github.com/IMKINGDOM/Personal-blog-astro-solitude',
            icon: 'fab fa-github',
          },
        ],
        right: [{ name: 'RSS', url: '/index.xml', icon: 'fas fa-rss' }],
      },
      links: [
        { name: '订阅', url: '/rss/' },
        { name: '留言', url: '#' },
        { name: '反馈', url: '#' },
        { name: '声明', url: '/statement/' },
      ],
      group: {
        探索: [
          { name: '文章', url: '/archives/' },
          { name: '分类', url: '/categories/' },
        ],
        关于: [
          { name: 'STEP 跬步', url: '/about/' },
          { name: '友链', url: '/links/' },
        ],
        协议: [
          { name: '隐私协议', url: '/privacy/' },
          { name: '版权协议', url: '/copyright/' },
        ],
        星驰: [{ name: '博客社群', url: '#' }],
      },
    },
    capsule: { enable: false, id: '7298728834454061071', type: 'playlist', server: 'qishui' },
    // See docs/integrations.md to configure a playlist or enable comments.
    post: {
      meta: { locate: false },
      covercolor: { enable: true, mode: 'local' },
    },
    brevity: { enable: true },
    keyboard: {
      enable: true,
      list: [
        { modifier: 'shift', key: 'D', action: 'toggleTheme' },
        { modifier: 'mod', key: 'F', action: 'openSearch' },
        { modifier: 'shift', key: 'K', action: 'toggleKeyboard' },
      ],
    },
    search: { tags: ['Astro', '跬步', 'MDX'], local: { preload: true } },
    pwa: { enable: true },
  },
});
