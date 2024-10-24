const fs = require('fs');
const path = require('path');

const countdownEndTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

const countdownData = {
    endTime: countdownEndTime
};

fs.writeFileSync(path.join(__dirname, 'countdown.json'), JSON.stringify(countdownData, null, 4));

console.log('Countdown timer reset to:', countdownEndTime);
