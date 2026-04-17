const fs = require('fs');
const path = require('path');

const producerFiles = [
  'src/pages/SentimentPipeline.tsx',
  'src/pages/DownloadableReports.tsx',
  'src/pages/MultilingualOverview.tsx',
  'src/pages/ProductHealthScores.tsx',
  'src/pages/CategoryComparison.tsx',
  'src/pages/AnomalyAlerts.tsx',
  'src/pages/GeoSalesHeatmap.tsx',
  'src/pages/AffiliateCommunity.tsx'
];

const consumerFiles = [
  'src/pages/ConsumerChatbot.tsx',
  'src/pages/ReviewExplorer.tsx',
  'src/pages/PersonalizedLabels.tsx',
  'src/pages/SentimentTrends.tsx'
];

for (const file of [...producerFiles, ...consumerFiles]) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Strip import
  content = content.replace(/import \{ ProducerLayout \} from "@\/components\/sellezy\/ProducerLayout";\n?/g, '');
  content = content.replace(/import \{ ConsumerLayout \} from "@\/components\/sellezy\/ConsumerLayout";\n?/g, '');
  
  // Replace <ProducerLayout> and <ConsumerLayout> wrappers with Fragments
  content = content.replace(/<ProducerLayout>/g, '<>');
  content = content.replace(/<\/ProducerLayout>/g, '</>');
  
  content = content.replace(/<ConsumerLayout>/g, '<>');
  content = content.replace(/<\/ConsumerLayout>/g, '</>');
  
  fs.writeFileSync(filePath, content);
  console.log('Stripped', file);
}
