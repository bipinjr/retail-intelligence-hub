const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/ProductHealthScores.tsx',
  'src/pages/PersonalizedLabels.tsx',
  'src/pages/MultilingualOverview.tsx',
  'src/pages/AnomalyAlerts.tsx',
  'src/pages/AffiliateCommunity.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('stagger.') && !content.includes('stagger } from "@/components/sellezy/PageWrapper"')) {
    // Inject import immediately after the first import or at top
    content = 'import { stagger } from "@/components/sellezy/PageWrapper";\n' + content;
    fs.writeFileSync(filePath, content);
    console.log('Fixed stagger import in ' + file);
  }
}
