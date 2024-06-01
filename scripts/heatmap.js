const fs = require('fs');
const path = require('path');

hexo.extend.injector.register('body_end', `
  <script src="/js/heatmap.js"></script>
  <link rel="stylesheet" href="/css/heatmap.css">
`, 'archive')

hexo.extend.generator.register('bloginfo-json', function (locals) {
  const posts = locals.posts.map(post => {
    let postDate = new Date(post.date);
    return {
      title: post.title,
      date: post.date.format('YYYY-MM-DD'),
      year: postDate.getFullYear(),
      month: postDate.getMonth() + 1,
      day: postDate.getDate(), 
      word_count: post.word_count,
    };
  });

  if (!fs.existsSync(hexo.public_dir)) {
    fs.mkdirSync(hexo.public_dir, { recursive: true });
    console.log(`Directory created: ${hexo.public_dir}`);
  }

  const bloginfoPath = path.join(hexo.public_dir, 'bloginfo.json');
  fs.writeFileSync(bloginfoPath, JSON.stringify(posts, null, 2));
  console.log(`Blog info JSON generated: ${bloginfoPath}`);
});



