import { 
  PRODUCT_HEALTH, 
  ANOMALY_ALERTS, 
  SENTIMENT_FEATURE_DATA, 
  STATE_INTENSITY 
} from "./mockData";

export type ProducerModule = 
  | "dashboard" 
  | "sentiment" 
  | "reports" 
  | "multilingual" 
  | "health" 
  | "category" 
  | "anomaly" 
  | "heatmap" 
  | "community";

export interface AIContext {
  title: Record<string, string>;
  insights: Record<string, string[]>;
  prompts: Record<string, string[]>;
}

export const PRODUCER_AI_KNOWLEDGE: Record<ProducerModule, AIContext> = {
  dashboard: {
    title: { EN: "Business Overview", HI: "व्याಪಾರ ಅವಲೋಕನ", KA: "ವ್ಯಾಪಾರ ಅವಲೋಕನ", TA: "வணிக மேலோட்டம்", HINGLISH: "Business Overview" },
    insights: { 
      EN: ["High sentiment in Electronics", "Action needed in Apparel"], 
      KA: ["ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್‌ನಲ್ಲಿ ಉತ್ತಮ ಸೆಂಟಿಮೆಂಟ್", "ಅಪ್ಯಾರಲ್‌ನಲ್ಲಿ ಕ್ರಮ ಅಗತ್ಯವಿದೆ"] 
    },
    prompts: {
      EN: ["State of my business?", "What needs action today?", "Top category issues?"],
      KA: ["ನನ್ನ ವ್ಯವಹಾರದ ಸ್ಥಿತಿ?", "ಇಂದು ಏನು ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕು?", "ಪ್ರಮುಖ ವಿಭಾಗದ ಸಮಸ್ಯೆಗಳು?"],
      HI: ["मेरे व्यवसाय की स्थिति?", "आज क्या कार्रवाई की आवश्यकता है?", "शीर्ष श्रेणी के मुद्दे?"],
      HINGLISH: ["Business ka status?", "Aaj kya action lena hai?", "Top category issues kya hain?"]
    }
  },
  sentiment: {
    title: { EN: "Deep Sentiment Analysis", KA: "ಸೆಂಟಿಮೆಂಟ್ ವಿಶ್ಲೇಷಣೆ" },
    insights: { EN: ["Pipeline processing 500+ reviews/hr", "Spike in technical complaints detected"] },
    prompts: {
      EN: ["Summarize negative reviews", "Who are our top promoters?", "Trend in product defects?"],
      KA: ["ನಕಾರಾತ್ಮಕ ವಿಮರ್ಶೆಗಳ ಸಾರಾಂಶ", "ನಮ್ಮ ಪ್ರಮುಖ ಪ್ರಚಾರಕರು ಯಾರು?", "ದೋಷಗಳ ಟ್ರೆಂಡ್?"]
    }
  },
  reports: {
    title: { EN: "Reporting Assistant", KA: "ವರದಿ ಸಹಾಯಕ" },
    insights: { EN: ["Monthly report ready for export", "FMCG data expanded"] },
    prompts: {
      EN: ["Generate Electronics report", "Export anomaly summary", "Compare last month data"],
      KA: ["ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ವರದಿ ತಯಾರಿಸಿ", "ಅಸಂಗತತೆ ಸಾರಾಂಶ ರಫ್ತು ಮಾಡಿ", "ಕಳೆದ ತಿಂಗಳ ಡೇಟಾ ಹೋಲಿಕೆ"]
    }
  },
  multilingual: {
    title: { EN: "Language Insights", KA: "ಭಾಷಾ ಒಳನೋಟಗಳು" },
    insights: { EN: ["Hindi sentiment is 12% higher", "Tamil translation quality stable"] },
    prompts: {
      EN: ["Top issues in Hindi reviews", "Translation accuracy report", "Sentiment across languages"],
      KA: ["ಹಿಂದಿ ವಿಮರ್ಶೆಗಳ ಪ್ರಮುಖ ಸಮಸ್ಯೆಗಳು", "ಅನುವಾದ ನಿಖರತೆ ವರದಿ", "ಭಾಷಾವಾರು ಸೆಂಟಿಮೆಂಟ್"]
    }
  },
  health: {
    title: { EN: "Product Health Specialist", KA: "ಉತ್ಪನ್ನ ಆರೋಗ್ಯ ತಜ್ಞ" },
    insights: { EN: ["iPhone 15 score dropping (battery issue)", "Realme Narzo improving"] },
    prompts: {
      EN: ["Why is iPhone 15 score low?", "Products with improving health?", "Predict future health scores"],
      KA: ["ಐಫೋನ್ 15 ಸ್ಕೋರ್ ಏಕೆ ಕಡಿಮೆ ಇದೆ?", "ಆರೋಗ್ಯ ಸುಧಾರಿಸುತ್ತಿರುವ ಉತ್ಪನ್ನಗಳು?", "ಭವಿಷ್ಯದ ಸ್ಕೋರ್ ಊಹಿಸಿ"]
    }
  },
  category: {
    title: { EN: "Marketplace Analyst", KA: "ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಕ" },
    insights: { EN: ["Electronics leading category score", "FMCG showing consistent growth"] },
    prompts: {
      EN: ["Compare Electronics vs FMCG", "Best performing category?", "Worst category trends?"],
      KA: ["ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಎಫ್‌ಎಂಸಿಜಿ ಹೋಲಿಕೆ", "ಅತ್ಯುತ್ತಮ ಪ್ರದರ್ಶನದ ವಿಭಾಗ?", "ಖಳ ವಿಭಾಗದ ಟ್ರೆಂಡ್‌ಗಳು?"]
    }
  },
  anomaly: {
    title: { EN: "Risk Inspector", KA: "ಅಪಾಯ ನಿರೀಕ್ಷಕ" },
    insights: { EN: ["3 Critical spikes in Mumbai", "Sudden drop in TATA Sampann sentiment"] },
    prompts: {
      EN: ["Show all critical anomalies", "Why the drop in TATA Sampann?", "Predict next alert"],
      KA: ["ಎಲ್ಲಾ ಗಂಭೀರ ಅಸಂಗತತೆ ತೋರಿಸಿ", "ಟಾಟಾ ಸಂಪನ್ನ ಸೆಂಟಿಮೆಂಟ್ ಏಕೆ ಕುಸಿದಿದೆ?", "ಮುಂದಿನ ಎಚ್ಚರಿಕೆ ಊಹಿಸಿ"]
    }
  },
  heatmap: {
    title: { EN: "Geo-Spatial Expert", KA: "ಜಿಯೋ-ಸ್ಪೇಷಿಯಲ್ ತಜ್ಞ" },
    insights: { EN: ["Sales spike in Bangalore south", "Complaints intense in Delhi NCR"] },
    prompts: {
      EN: ["Show complaint hotspots", "Best sales regions in Karnataka", "Summarize location trends"],
      KA: ["ದೂರುಗಳ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ತೋರಿಸಿ", "ಕರ್ನಾಟಕದ ಉತ್ತಮ ಮಾರಾಟ ವಲಯಗಳು", "ಸ್ಥಳೀಯ ಟ್ರೆಂಡ್‌ಗಳ ಸಾರಾಂಶ"]
    }
  },
  community: {
    title: { EN: "Opportunities Guide", KA: "ಅವಕಾಶಗಳ ಮಾರ್ಗದರ್ಶಿ" },
    insights: { EN: ["New affiliate trend in young entrepreneurs", "Expert tip: focus on local SEO"] },
    prompts: {
      EN: ["Top community concerns?", "New business opportunities?", "Show expert insights"],
      KA: ["ಸಮುದಾಯದ ಪ್ರಮುಖ ಕಳಕಳಿಗಳು?", "ಹೊಸ ವ್ಯವಹಾರ ಅವಕಾಶಗಳು?", "ತಜ್ಞರ ಒಳನೋಟ ತೋರಿಸಿ"]
    }
  }
};

export const getModuleFromPath = (path: string): ProducerModule => {
  if (path.includes("/producer/sentiment")) return "sentiment";
  if (path.includes("/producer/reports")) return "reports";
  if (path.includes("/producer/multilingual")) return "multilingual";
  if (path.includes("/producer/health")) return "health";
  if (path.includes("/producer/category")) return "category";
  if (path.includes("/producer/anomaly")) return "anomaly";
  if (path.includes("/producer/heatmap")) return "heatmap";
  if (path.includes("/producer/community")) return "community";
  return "dashboard";
};

export const getModuleContextSummary = (module: ProducerModule): string => {
  switch (module) {
    case "health":
      const electronics = PRODUCT_HEALTH.Electronics.slice(0, 3).map(p => `${p.name}: ${p.score}`).join(", ");
      const failing = PRODUCT_HEALTH.Electronics.filter(p => p.trend === "down").map(p => p.name).join(", ");
      return `Top Products Health: ${electronics}. Declining Trends detected in: ${failing}.`;
    
    case "anomaly":
      const critical = ANOMALY_ALERTS.filter(a => a.severity === "critical" && !a.resolved).length;
      const recent = ANOMALY_ALERTS.slice(0, 2).map(a => a.title).join("; ");
      return `Critical Unresolved Anomalies: ${critical}. Recent Alerts: ${recent}.`;
    
    case "sentiment":
      const features = SENTIMENT_FEATURE_DATA.Electronics.slice(0, 3).map(f => `${f.feature} (+${f.positive}%)`).join(", ");
      return `Sentiment Drivers (Electronics): ${features}.`;
    
    case "heatmap":
      const topStates = Object.entries(STATE_INTENSITY)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, val]) => `${name} (${val})`)
        .join(", ");
      return `High Activity Regions: ${topStates}. Focus on Delhi NCR and Maharashtra.`;
    
    case "dashboard":
      return "General Business Dashboard: Electronics is leading with 78% sentiment. FMCG is stable. Apparel needs attention due to quality complaints.";
    
    default:
      return "General Producer Analytics Context.";
  }
};
