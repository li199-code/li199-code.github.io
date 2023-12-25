function uptime() {
    const currentTime = new Date().getTime();
    const thisYear = new Date().getFullYear();
    const startDate = new Date('2022-07-26 18:00:00').getTime();
    const timeDifference = currentTime - startDate;
    const daysRunning = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return {daysRunning, thisYear};
}

let e = document.querySelector('#stats-days')
let y = document.querySelector('#year-copy')
let x = uptime()
e.innerHTML = `This site has been running for ${x.daysRunning} days.`
y.innerHTML = `© ${x.thisYear} Jason Lee. All Rights Reserved.`