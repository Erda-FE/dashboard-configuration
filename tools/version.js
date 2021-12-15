const fs = require('fs');
const path = require('path');

const { version } = require('../package.json');

fs.writeFileSync(path.join(__dirname, '..', 'src/utils', 'version.tsx'),
`export const DashboardVersion = '${version}'`, 'utf8');
