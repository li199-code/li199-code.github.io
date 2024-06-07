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
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://blog.jasonleehere.com/images/avatar-removebg-preview.png">
  `;

  const faviconHeaderContent = `  
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
  `;

  // 将 sitemap header 内容插入到 <head> 标签内的最开始
  data = data.replace(/<head>/, `<head>${sitemapHeaderContent}${opengraphHeaderContent}`);
  
  return data;
});