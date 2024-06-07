const bloginfoPath = '/bloginfo.json';

// 使用 fetch API 读取 JSON 文件
const blogInfo = { 'pages': [] };

fetch(bloginfoPath)
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
    })
    .then(data => {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        blogInfo.pages = data;

        createHeatmap();
        const totalCount = getPostAndWordCount();
        const totalCountDiv = document.querySelector('.total_count');
        totalCountDiv.innerHTML = `文章数量：${totalCount.postCount}篇  |  累计字数：${totalCount.wordCount}万字`;
    })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
    });

// 添加heatmap dom
const archieveDiv = document.querySelector('.content-container');
const heatmapDiv = document.createElement('div');
heatmapDiv.id = 'heatmap_wrapper';
heatmapDiv.innerHTML = `
<div class="heatmap_container" data-theme="dark"> <!-- 全部用 Flex 排版 -->
    <div class="heatmap_content">
        <div class="heatmap_week">
            <span>Mon</span>
            <span>&nbsp;</span> <!-- 不需要显示的星期用空格表示 -->
            <span>Wed</span>
            <span>&nbsp;</span>
            <span>Fri</span>
            <span>&nbsp;</span>
            <span>Sun</span>
        </div>
        <div class="heatmap_main">
            <div class="month heatmap_month">
                <!-- js 检测屏幕宽度动态生成月份 -->
            </div>
            <div id="heatmap" class="heatmap">
                <!-- js 检测屏幕宽度动态生成年度日历小方块 -->
            </div>
        </div>
    </div>
    <div class="heatmap_footer">
        <div class="heatmap_less">Less</div>
        <div class="heatmap_level">
            <span class="heatmap_level_item heatmap_level_0"></span>
            <span class="heatmap_level_item heatmap_level_1"></span>
            <span class="heatmap_level_item heatmap_level_2"></span>
            <span class="heatmap_level_item heatmap_level_3"></span>
            <span class="heatmap_level_item heatmap_level_4"></span>
        </div>
        <div class="heatmap_more">More</div>
    </div>
</div>
<div class='total_count'></div>
`
archieveDiv.insertBefore(heatmapDiv, archieveDiv.firstChild);

// 将日期数据运用到dom中

let currentDate = new Date();
currentDate.setFullYear(currentDate.getFullYear() - 1);

let startDate;

let monthDiv = document.querySelector('.month');
let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

if (window.innerWidth < 768) {
    numMonths = 6;
} else {
    numMonths = 12;
}

let startMonthIndex = (currentDate.getMonth() - (numMonths - 1) + 12) % 12;
for (let i = startMonthIndex; i < startMonthIndex + numMonths; i++) {
    let monthSpan = document.createElement('span');
    let monthIndex = i % 12;
    monthSpan.textContent = monthNames[monthIndex];
    monthDiv.appendChild(monthSpan);
}

function getStartDate() {
    const today = new Date();

    if (window.innerWidth < 768) {
        numMonths = 6;
    } else {
        numMonths = 12;
    }

    const startDate = new Date(today.getFullYear(), today.getMonth() - numMonths + 1, 1, today.getHours(), today.getMinutes(), today.getSeconds());

    while (startDate.getDay() !== 1) {
        startDate.setDate(startDate.getDate() + 1);
    }

    return startDate;
}

function getWeekDay(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}

function createDay(date, title, count, post) {
    const day = document.createElement("div");

    day.className = "heatmap_day";

    day.setAttribute("data-title", title);
    day.setAttribute("data-count", count);
    day.setAttribute("data-post", post);
    day.setAttribute("data-date", date);

    day.addEventListener("mouseenter", function () {
        const tooltip = document.createElement("div");
        tooltip.className = "heatmap_tooltip";

        let tooltipContent = "";

        if (post && parseInt(post, 10) !== 0) {
            tooltipContent += '<span class="heatmap_tooltip_post">' + '共 ' + post + ' 篇' + '</span>';
        }

        if (count && parseInt(count, 10) !== 0) {
            tooltipContent += '<span class="heatmap_tooltip_count">' + ' ' + count + ' 字；' + '</span>';
        }

        if (title && parseInt(title, 10) !== 0) {
            tooltipContent += '<span class="heatmap_tooltip_title">' + title + '</span>';
        }

        if (date) {
            tooltipContent += '<span class="heatmap_tooltip_date">' + date + '</span>';
        }

        tooltip.innerHTML = tooltipContent;
        day.appendChild(tooltip);
    });

    day.addEventListener("mouseleave", function () {
        const tooltip = day.querySelector(".heatmap_tooltip");
        if (tooltip) {
            day.removeChild(tooltip);
        }
    });

    if (count == 0 ) {
        day.classList.add("heatmap_day_level_0");
    } else if (count > 0 && count < 1000) {
        day.classList.add("heatmap_day_level_1");
    } else if (count >= 1000 && count < 2000) {
        day.classList.add("heatmap_day_level_2");
    } else if (count >= 2000 && count < 3000) {
        day.classList.add("heatmap_day_level_3");
    } else {
        day.classList.add("heatmap_day_level_4");
    }

    return day;
}

function createWeek() {
    const week = document.createElement('div');
    week.className = 'heatmap_week';
    return week;
}

function createHeatmap() {
    const container = document.getElementById('heatmap');
    const startDate = getStartDate();
    const endDate = new Date();
    const weekDay = getWeekDay(startDate);

    let currentWeek = createWeek();
    container.appendChild(currentWeek);

    let currentDate = startDate;
    let i = 0;

    while (currentDate <= endDate) {
        if (i % 7 === 0 && i !== 0) {
            currentWeek = createWeek();
            container.appendChild(currentWeek);
        }

        const dateString = `${currentDate.getFullYear()}-${("0" + (currentDate.getMonth()+1)).slice(-2)}-${("0" + (currentDate.getDate())).slice(-2)}`;
        const articleDataList = blogInfo.pages.filter(page => page.date === dateString);

        if (articleDataList.length > 0) {
            const titles = articleDataList.map(data => data.title);
            const title = titles.map(t => `《${t}》`).join('<br />');

            let count = 0;
            let post = articleDataList.length;

            articleDataList.forEach(data => {
                count += parseInt(data.word_count, 10);
            });

            const formattedDate = formatDate(currentDate);
            const day = createDay(formattedDate, title, count, post);
            currentWeek.appendChild(day);
        } else {
            const formattedDate = formatDate(currentDate);
            const day = createDay(formattedDate, '', '0', '0');
            currentWeek.appendChild(day);
        }

        i++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function formatDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getPostAndWordCount() {
    let postCount=0;
    let wordCount=0;
    
    const pagearray = blogInfo.pages;
    // console.log('blogInfo', pagearray)
    pagearray.forEach(page => {
        console.log('page', page)
        postCount += 1;
        wordCount += page.word_count;
    })
    wordCount = (wordCount / 10000).toFixed(1);
    return {postCount, wordCount}
}

