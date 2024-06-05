/**
 * 自定义脚本，会注入到每个页面的底部
 */

// new feature: 搜索功能
document.addEventListener("DOMContentLoaded", function () {
    fetch('/search.xml')
        .then(response => response.text())
        .then(data => {
            const parentElement = document.querySelector('.menu-list');
            var newElement = document.createElement('div');
            newElement.id = 'searchContainer';
            newElement.innerHTML = '<input type="text" id="searchInput" placeholder="Search..."><div id="searchResults"></div>';
            parentElement.appendChild(newElement);

            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");
            let entries = xml.querySelectorAll('entry');
            let posts = Array.from(entries).map(entry => ({
                title: entry.querySelector('title').textContent,
                url: entry.querySelector('url').textContent,
                content: entry.querySelector('content').textContent
            }));

            document.getElementById('searchInput').addEventListener('input', function(e) {
                let query = e.target.value.toLowerCase();
                let results = posts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
                displayResults(results);
            });

            function displayResults(results) {
                let resultContainer = document.getElementById('searchResults');
                resultContainer.innerHTML = '';
                results.forEach(result => {
                    let item = document.createElement('div');
                    item.innerHTML = `<a href="${result.url}">${result.title}</a>`;
                    resultContainer.appendChild(item);
                });
            }
        })
        .catch(error => console.error('Error fetching the search.xml file:', error));
});

// new feature: 给正文结尾添加分割线
const contentDiv = document.querySelector('.post-content'); 
const hr = document.createElement('hr');
if (contentDiv) contentDiv.appendChild(hr);

// new feature: og:url header
var currentUrl = window.location.href;

// 查找是否已经存在og:url元标签
var ogUrlMetaTag = document.querySelector('meta[property="og:url"]');

if (ogUrlMetaTag) {
    // 如果存在，更新其内容
    ogUrlMetaTag.setAttribute('content', currentUrl);
} else {
    // 如果不存在，创建一个新的meta标签
    ogUrlMetaTag = document.createElement('meta');
    ogUrlMetaTag.setAttribute('property', 'og:url');
    ogUrlMetaTag.setAttribute('content', currentUrl);
    
    // 将新创建的meta标签插入到head中
    document.head.appendChild(ogUrlMetaTag);
}

