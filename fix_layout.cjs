const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/SentimentPipeline.tsx',
  'src/pages/DownloadableReports.tsx',
  'src/pages/MultilingualOverview.tsx',
  'src/pages/ProductHealthScores.tsx',
  'src/pages/CategoryComparison.tsx',
  'src/pages/AnomalyAlerts.tsx',
  'src/pages/GeoSalesHeatmap.tsx',
  'src/pages/AffiliateCommunity.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. imports
  content = content.replace(/import \{ AppHeader \} from "@\/components\/sellezy\/AppHeader";\s*/g, '');
  content = content.replace(/import \{ PageWrapper(?:,\s*stagger)? \} from "@\/components\/sellezy\/PageWrapper";/g, 'import { ProducerLayout } from "@/components/sellezy/ProducerLayout";');
  
  // 2. start tag replacement
  content = content.replace(/<>\s*<AppHeader \/>\s*<PageWrapper>/g, '<ProducerLayout>');
  
  // 3. end tag replacement
  content = content.replace(/<\/PageWrapper>\s*<\/>/g, '</ProducerLayout>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
}
