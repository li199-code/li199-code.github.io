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

// new feature 自定义分页组件

document.addEventListener('DOMContentLoaded', function () {


    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return;

    const prevButtom = document.querySelector('.pagination-container .prev');
    const nextButtom = document.querySelector('.pagination-container .next');
    if (prevButtom) prevButtom.innerHTML = '<i class="icon icon-arrow-ios-back-outline"></i>';
    if (nextButtom) nextButtom.innerHTML = '<i class="icon icon-arrow-ios-forward-outline"></i>';

    const pageNumbersContainer = document.createElement('div');
    pageNumbersContainer.className = 'page-numbers';

    const currentPage = extractPageNumber(window.location.href);  // 你可以通过一些方式动态获取当前页码

    function extractPageNumber(url) {
        const regex = /(?:\/page\/(\d+))?\/?$/;
        const match = url.match(regex);
        return match[1] ? parseInt(match[1], 10) : 1;
    }

    const createPageLink = (pageNumber) => {
        const pageLink = document.createElement('a');
        if (pageNumber === 1) {
            pageLink.href = `/`;
        } else {
            pageLink.href = `/page/${pageNumber}/`;
        }
        pageLink.className = 'page-number';
        pageLink.textContent = pageNumber;
        if (pageNumber === currentPage) {
            pageLink.classList.add('active');
        }
        return pageLink;
    };

    const addEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
    };

    fetch('/bloginfo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => { 
            const postsPerPage = 10; //每页文章数量
            const totalPages = Math.ceil(data.length / postsPerPage); 
            if (totalPages <= 3) {
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbersContainer.appendChild(createPageLink(i));
                }
            } else if (totalPages > 3) {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 3; i++) {
                        pageNumbersContainer.appendChild(createPageLink(i));
                    }
                    addEllipsis();
                    pageNumbersContainer.appendChild(createPageLink(totalPages));
                } else if (currentPage > 3 && currentPage < totalPages - 1) {
                    pageNumbersContainer.appendChild(createPageLink(1));
                    addEllipsis();
                    pageNumbersContainer.appendChild(createPageLink(currentPage));
                    addEllipsis();
                    pageNumbersContainer.appendChild(createPageLink(totalPages));
                } else if (currentPage === totalPages - 1) {
                    pageNumbersContainer.appendChild(createPageLink(1));
                    addEllipsis();
                    pageNumbersContainer.appendChild(createPageLink(currentPage));
                    pageNumbersContainer.appendChild(createPageLink(totalPages));
                } else if (currentPage === totalPages) {
                    pageNumbersContainer.appendChild(createPageLink(1));
                    addEllipsis();
                    pageNumbersContainer.appendChild(createPageLink(currentPage - 1));
                    pageNumbersContainer.appendChild(createPageLink(currentPage));
                }

            } else {
                console.log('Error: Unknown total pages number');
            }

            paginationContainer.insertBefore(pageNumbersContainer, paginationContainer.querySelector('.next'));

        })
        .catch(error => console.error('Error fetching the bloginfo.json file:', error))


});



