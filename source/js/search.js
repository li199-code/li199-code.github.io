document.addEventListener("DOMContentLoaded", function() {
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
