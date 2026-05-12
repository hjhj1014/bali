// Creates minimal placeholder PNG assets required by Expo
const fs = require('fs');
const path = require('path');

// Minimal 1x1 beige PNG (base64)
// This is a 1x1 pixel PNG with color #F5ECD7
const MINIMAL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'].forEach((name) => {
  const p = path.join(assetsDir, name);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, MINIMAL_PNG);
    console.log('Created:', name);
  } else {
    console.log('Exists:', name);
  }
});

console.log('Assets ready!');
