import { defineSolitudeConfig } from './lib/config';

export default defineSolitudeConfig({
  site: 'https://example.org',
  title: 'STEP 跬步',
  description: '用 Astro 书写与创作，为你的故事安一个家。',
  locale: 'zh-CN',
  timeZone: 'Asia/Shanghai',
  author: { name: 'STEP 跬步' },
  menus: [
    {
      name: '文章',
      children: [
        { name: '全部文章', url: '/archives/', icon: 'icon-doc-custom' },
        { name: '所有分类', url: '/categories/', icon: 'fas fa-clone' },
        { name: '标签列表', url: '/tags/', icon: 'fas fa-tags' },
      ],
    },
    {
      name: '探索',
      children: [
        { name: 'STEP 跬步', url: '/about/', icon: 'icon-news-custom' },
        { name: '我的装备', url: '/equipment/' },
        { name: '微动态', url: '/brevity/' },
      ],
    },
    { name: '友链', url: '/links/' },
  ],
  theme: {
    site: {
      name: { class: 'text', custom: 'STEP 跬步' },
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
      home: { noSticky: 'about', Sticky: 'allInfo' },
      post: { noSticky: 'about', Sticky: 'newestPost,allInfo' },
      page: { noSticky: 'about', Sticky: 'newestPost,allInfo' },
      my_card: {
        description: '一个为个人博客打造的 Astro 主题。',
        content: '让内容成为主角。',
        state: {
          morning: '一抹斜杠，直指星辰',
          noon: '一抹斜杠，直指星辰',
          afternoon: '一抹斜杠，直指星辰',
          night: '一抹斜杠，直指星辰',
          goodnight: '一抹斜杠，直指星辰',
        },
        witty_words: ['一抹斜杠，直指星辰'],
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
      group: {
        探索: [
          { name: '文章', url: '/archives/' },
          { name: '分类', url: '/categories/' },
        ],
        关于: [
          { name: 'STEP 跬步', url: '/about/' },
          { name: '友链', url: '/links/' },
        ],
      },
    },
    capsule: { enable: true, id: '7298728834454061071', type: 'playlist', server: 'qishui' },
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
