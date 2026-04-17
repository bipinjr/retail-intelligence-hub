const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/ConsumerChatbot.tsx',
  'src/pages/ReviewExplorer.tsx',
  'src/pages/PersonalizedLabels.tsx',
  'src/pages/SentimentTrends.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. imports
  content = content.replace(/import \{ AppHeader \} from "@\/components\/sellezy\/AppHeader";\s*/g, '');
  content = content.replace(/import \{ PageWrapper(?:,\s*stagger)? \} from "@\/components\/sellezy\/PageWrapper";/g, 'import { ConsumerLayout } from "@/components/sellezy/ConsumerLayout";');
  
  // 2. start tag replacement
  content = content.replace(/<>\s*<AppHeader \/>\s*<PageWrapper>/g, '<ConsumerLayout>');
  content = content.replace(/<AppHeader \/>\s*<PageWrapper>/g, '<ConsumerLayout>');
  
  // 3. end tag replacement
  content = content.replace(/<\/PageWrapper>\s*<\/>/g, '</ConsumerLayout>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
}
