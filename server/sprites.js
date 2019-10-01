const fs = require('fs');
const spritesPath = require.resolve('@design/jw-design-library/dist/sprites/sprites-dashboard.svg');
const dashboardSprites = fs.readFileSync(spritesPath);

module.exports = dashboardSprites;
