function uptime() {
    const currentTime = new Date().getTime();
    const thisYear = new Date().getFullYear();
    const startDate = new Date('2022-07-26 18:00:00').getTime();
    const timeDifference = currentTime - startDate;
    const daysRunning = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return thisYear;
}

let y = document.querySelector('#year-copy')
let thisYear = uptime()
y.innerHTML = `© 2022-${thisYear} Jason Lee. All Rights Reserved.`