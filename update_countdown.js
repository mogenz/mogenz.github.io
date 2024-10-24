import fs from 'fs';
import path from 'path';

const countdownEndTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

const countdownData = {
    endTime: countdownEndTime
};

fs.writeFileSync(path.join('countdown.json'), JSON.stringify(countdownData, null, 4));

console.log('Countdown timer reset to:', countdownEndTime);
