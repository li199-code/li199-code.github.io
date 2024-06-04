hexo.extend.injector.register('body_end', `
  <script src="/js/custom.js"></script>
  <link rel="stylesheet" href="/css/custom.css">
`)

hexo.extend.filter.register('after_render:html', function (data) {
  // 定义要插入的 sitemap header 信息
  const sitemapHeaderContent = `
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
  `;

  const opengraphHeaderContent = `
    <meta property="og:title" content="小 Lee 说">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/images/avatar-removebg-preview.png">
    <meta property="og:url" content="https://blog.jasonleehere.com">
    <meta property="og:description" content="快乐在于折腾，快乐是自己给的！">
  `;

  // 将 sitemap header 内容插入到 <head> 标签内的最开始
  data = data.replace(/<head>/, `<head>${sitemapHeaderContent}${opengraphHeaderContent}`);
  
  return data;
});