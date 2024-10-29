import fs from 'fs';
import path from 'path';

// Set countdown to 72 hours from now
const countdownEndTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
const countdownData = { endTime: countdownEndTime };

// Ensure the countdown file is written to the root or necessary directory
fs.writeFileSync(path.join('countdown.json'), JSON.stringify(countdownData, null, 4));

console.log('Countdown timer reset to:', countdownEndTime);
