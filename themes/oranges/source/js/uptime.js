function uptime() {
    const currentTime = new Date().getTime();
    const startDate = new Date('2022-07-26 18:00:00').getTime();
    const timeDifference = currentTime - startDate;
    const daysRunning = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysRunning;
}