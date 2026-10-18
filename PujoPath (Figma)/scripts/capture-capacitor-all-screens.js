const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const adb = 'C:\\Users\\soumi\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const CAP_DIR = path.resolve(__dirname, '../validation/capacitor_references');
if (!fs.existsSync(CAP_DIR)) fs.mkdirSync(CAP_DIR, { recursive: true });

function sh(cmd) {
  return execSync(`"${adb}" ${cmd}`, { encoding: 'utf8' });
}

function tap(x, y) {
  sh(`shell input tap ${x} ${y}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function capture(name) {
  const remotePath = `/sdcard/${name}`;
  sh(`shell screencap -p ${remotePath}`);
  const localPath = path.join(CAP_DIR, name);
  sh(`pull ${remotePath} "${localPath}"`);
  sh(`shell rm ${remotePath}`);
  console.log(`Captured ${name} (${(fs.statSync(localPath).size / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('=== CAPTURING CAPACITOR ANDROID APP SCREENS ===');
  // Ensure app is in foreground
  sh('shell am start -n app.pujopath.mobile/app.pujopath.mobile.MainActivity');
  await sleep(1500);

  // 1. Home Screen (Tab 1)
  console.log('Capturing Home screen...');
  tap(108, 2230);
  await sleep(1000);
  capture('actual_cap_home_top.png');

  // Scroll down on Home
  sh('shell input swipe 540 1600 540 600 300');
  await sleep(1000);
  capture('actual_cap_home_scrolled.png');

  sh('shell input swipe 540 1600 540 600 300');
  await sleep(1000);
  capture('actual_cap_home_bottom.png');

  // Scroll back to top
  sh('shell input swipe 540 600 540 1800 200');
  sh('shell input swipe 540 600 540 1800 200');
  await sleep(800);

  // 2. Explore Screen (Tab 2)
  console.log('Capturing Explore screen...');
  tap(324, 2230);
  await sleep(1500);
  capture('actual_cap_explore_top.png');

  sh('shell input swipe 540 1600 540 600 300');
  await sleep(1000);
  capture('actual_cap_explore_scrolled.png');

  // 3. Map Screen (Tab 3)
  console.log('Capturing Map screen...');
  tap(540, 2230);
  await sleep(2500);
  capture('actual_cap_map.png');

  // 4. Planner Screen (Tab 4)
  console.log('Capturing Planner screen...');
  tap(756, 2230);
  await sleep(1500);
  capture('actual_cap_planner.png');

  // 5. More Drawer (Tab 5)
  console.log('Capturing More drawer...');
  tap(972, 2230);
  await sleep(1500);
  capture('actual_cap_more_drawer.png');

  // 6. Navigate to Developer Screen from Drawer or URL
  // Tap Developer in drawer: In the 8-grid, let's see where Developers is located
  // Or navigate via WebView if needed, or tap on Developers
  console.log('Capturing Developer screen...');
  // Tap Developers item (approx x=800, y=1700 or let's test)
  // Let's tap Developer
  tap(810, 1720);
  await sleep(1500);
  capture('actual_cap_developer.png');

  // Return to More and open Calendar
  tap(972, 2230); // open more drawer again
  await sleep(1000);
  // Tap Calendar (top-left tile, approx x=270, y=1450)
  tap(270, 1450);
  await sleep(1500);
  capture('actual_cap_calendar.png');

  // Return to More and open Music
  tap(972, 2230);
  await sleep(1000);
  // Tap Music (approx x=270, y=1590)
  tap(270, 1590);
  await sleep(1500);
  capture('actual_cap_music.png');

  console.log('\nAll Capacitor Android reference captures completed!');
}

main().catch(console.error);
