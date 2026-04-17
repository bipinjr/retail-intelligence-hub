const fs = require('fs');
const path = require('path');
const fp = path.join(__dirname, 'src/pages/GeoSalesHeatmap.tsx');
let c = fs.readFileSync(fp, 'utf8');

c = c.replace(/className=\{\\\`/g, "className={`");
c = c.replace(/\\`\}/g, "`}");
c = c.replace(/\\\$\{/g, "${");

fs.writeFileSync(fp, c);
console.log('Fixed JSX syntax literals!');
