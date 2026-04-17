const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/PersonalizedLabels.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `{products.map((p) => {
              const open = openCard === p.name;`;

const replacementStr = `{products.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed border-primary/20 rounded-xl bg-bg-card/40 min-h-[200px]">
                <Sparkles className="w-8 h-8 mb-3 opacity-30 text-primary-glow" />
                <p className="font-mono text-sm">No personalized labels available yet for this persona.</p>
              </div>
            ) : products.map((p) => {
              if (!p) return null;
              const open = openCard === p?.name;`;

content = content.replace(targetStr, replacementStr);

// Null safety replacements
content = content.replace(/p\.name/g, '(p?.name || "Unknown")');
content = content.replace(/p\.category/g, '(p?.category || "General")');
content = content.replace(/p\.score/g, '(p?.score || 0)');
content = content.replace(/p\.price/g, '(p?.price || "Price unavailable")');
content = content.replace(/p\.highlights\.slice/g, '(p?.highlights || []).slice');
content = content.replace(/p\.highlights\.map/g, '(p?.highlights || []).map');
content = content.replace(/p\.store/g, '(p?.store || "Partner")');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed PersonalizedLabels mapping safety');
