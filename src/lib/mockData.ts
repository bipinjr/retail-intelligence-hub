// Centralized mock data for SELLEZY scaffold
export const LANGUAGES = [
  { code: "EN", label: "EN", name: "English" },
  { code: "HI", label: "हि", name: "हिन्दी" },
  { code: "TA", label: "தமி", name: "தமிழ்" },
  { code: "BN", label: "বাং", name: "বাংলা" },
  { code: "MR", label: "मरा", name: "मराठी" },
  { code: "HINGLISH", label: "Hinglish", name: "Hinglish" },
] as const;

export const LANG_LABELS: Record<string, { greeting: string; logout: string; explore: string }> = {
  EN: { greeting: "Welcome", logout: "Logout", explore: "Explore →" },
  HI: { greeting: "स्वागत है", logout: "लॉग आउट", explore: "एक्सप्लोर करें →" },
  TA: { greeting: "வரவேற்கிறோம்", logout: "வெளியேறு", explore: "ஆராயுங்கள் →" },
  BN: { greeting: "স্বাগতম", logout: "লগ আউট", explore: "অন্বেষণ করুন →" },
  MR: { greeting: "स्वागत आहे", logout: "लॉग आउट", explore: "एक्सप्लोर करा →" },
  HINGLISH: { greeting: "Welcome yaar", logout: "Logout karo", explore: "Dekho →" },
};

export const CATEGORY_MINI = [
  { name: "P1", v: 60 }, { name: "P2", v: 80 }, { name: "P3", v: 45 },
];

export const PIPELINE_LANG_BREAKDOWN = [
  { name: "EN", value: 45, fill: "hsl(174 62% 47%)" },
  { name: "हिन्दी", value: 22, fill: "hsl(169 100% 55%)" },
  { name: "தமிழ்", value: 13, fill: "hsl(195 70% 60%)" },
  { name: "বাংলা", value: 10, fill: "hsl(210 60% 55%)" },
  { name: "मराठी", value: 6, fill: "hsl(27 87% 67%)" },
  { name: "Hinglish", value: 4, fill: "hsl(280 50% 60%)" },
];

export const SENTIMENT_FEATURE_DATA: Record<string, Array<{ feature: string; positive: number; neutral: number; negative: number }>> = {
  Electronics: [
    { feature: "Packaging", positive: 72, neutral: 18, negative: 10 },
    { feature: "Delivery", positive: 80, neutral: 12, negative: 8 },
    { feature: "Quality", positive: 78, neutral: 15, negative: 7 },
    { feature: "Durability", positive: 70, neutral: 20, negative: 10 },
    { feature: "Support", positive: 65, neutral: 22, negative: 13 },
    { feature: "Value", positive: 74, neutral: 17, negative: 9 },
  ],
  FMCG: [
    { feature: "Packaging", positive: 58, neutral: 24, negative: 18 },
    { feature: "Delivery", positive: 79, neutral: 14, negative: 7 },
    { feature: "Quality", positive: 82, neutral: 12, negative: 6 },
    { feature: "Durability", positive: 68, neutral: 22, negative: 10 },
    { feature: "Support", positive: 70, neutral: 20, negative: 10 },
    { feature: "Value", positive: 85, neutral: 10, negative: 5 },
  ],
  Apparel: [
    { feature: "Packaging", positive: 76, neutral: 16, negative: 8 },
    { feature: "Delivery", positive: 73, neutral: 17, negative: 10 },
    { feature: "Quality", positive: 76, neutral: 16, negative: 8 },
    { feature: "Durability", positive: 76, neutral: 18, negative: 6 },
    { feature: "Support", positive: 68, neutral: 22, negative: 10 },
    { feature: "Value", positive: 80, neutral: 14, negative: 6 },
  ],
};

export const QUALITY_TIMESERIES = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  Electronics: 70 + Math.round(Math.sin(i / 2) * 6) + (i === 7 ? -8 : 0),
  FMCG: 75 + Math.round(Math.cos(i / 3) * 5) + (i === 4 ? -10 : 0),
  Apparel: 72 + Math.round(Math.sin(i / 4) * 4),
}));

export const STATE_INTENSITY: Record<string, number> = {
  Karnataka: 842, Maharashtra: 1204, "Tamil Nadu": 987, Delhi: 1456,
  "West Bengal": 623, Gujarat: 712, Rajasthan: 488, "Uttar Pradesh": 1102,
  Kerala: 540, Telangana: 690, Punjab: 410, Haryana: 520, "Madhya Pradesh": 480,
  Bihar: 340, Odisha: 290, Assam: 220, Jharkhand: 210, Chhattisgarh: 180,
  Uttarakhand: 160, "Himachal Pradesh": 130, Goa: 95, Tripura: 70, Manipur: 55,
  Meghalaya: 50, Nagaland: 40, Mizoram: 35, "Arunachal Pradesh": 30, Sikkim: 25,
  "Jammu and Kashmir": 180, "Andhra Pradesh": 760,
};

export const COMMUNITY_POSTS = [
  { id: 1, name: "Riya M.", city: "Bengaluru", initials: "RM", color: "from-pink-500 to-rose-400", text: "Found this Boat earphones deal — 91% positive reviews on durability. Check it out!", category: "Electronics", affiliate: true, lang: "EN" },
  { id: 2, name: "Arjun K.", city: "Chennai", initials: "AK", color: "from-amber-500 to-orange-400", text: "MTR Foods packaging improved a lot this quarter based on recent reviews!", original: "MTR உணவு பேக்கேஜிங் இந்த காலாண்டில் மிகவும் மேம்பட்டது!", category: "FMCG", affiliate: false, lang: "TA" },
  { id: 3, name: "Priya S.", city: "Mumbai", initials: "PS", color: "from-teal-500 to-cyan-400", text: "Running a small D2C brand? SELLEZY showed me my negative review clusters — fixed packaging in 2 weeks!", category: "Apparel", affiliate: false, lang: "EN" },
  { id: 4, name: "Rohit D.", city: "Delhi", initials: "RD", color: "from-indigo-500 to-blue-400", text: "Which is the best budget smartphone right now? Let me know in comments!", category: "Electronics", affiliate: false, lang: "EN" },
  { id: 5, name: "Deepa N.", city: "Kolkata", initials: "DN", color: "from-purple-500 to-fuchsia-400", text: "Apparel quality scores are rising — good time for small sellers to enter the market.", original: "পোশাকের মানের স্কোর বাড়ছে — ছোট বিক্রেতাদের বাজারে প্রবেশের ভাল সময়।", category: "Apparel", affiliate: false, lang: "BN" },
];

export const AFFILIATE_PRODUCTS = [
  { name: "Boat Airdopes 141", category: "Electronics", score: 91, persona: "Best for Students", store: "Amazon" },
  { name: "Amul Pure Ghee 1L", category: "FMCG", score: 94, persona: "Good for Family Use", store: "Flipkart" },
  { name: "Allen Solly Polo Tee", category: "Apparel", score: 86, persona: "Best for Office", store: "Amazon" },
  { name: "Mi Smart Band 7", category: "Electronics", score: 83, persona: "Heavy Users Only", store: "Flipkart" },
  { name: "Tata Sampann Dal", category: "FMCG", score: 88, persona: "Good for Family Use", store: "Amazon" },
];

export type ReviewMock = {
  id: string;
  text: string;
  highlights: string[];
  badges: ("verified" | "detailed" | "photo" | "flagged")[];
  lang: string;
  langOriginal?: string;
  personas: string[];
  rating: number;
  features: { name: string; score: number }[];
  before: number;
  after: number;
  helpful: number;
  date: string;
  category: string;
};

export const REVIEWS_BY_CATEGORY: Record<string, ReviewMock[]> = {
  electronics: [
    { id: "e1", text: "The delivery was super fast but packaging was damaged. The phone itself works great though.", highlights: ["delivery", "packaging"], badges: ["verified", "detailed"], lang: "EN", personas: ["Best for Students"], rating: 4, features: [{ name: "Delivery", score: 80 }, { name: "Packaging", score: 40 }], before: 42, after: 78, helpful: 24, date: "March 2025", category: "Electronics" },
    { id: "e2", text: "बहुत अच्छा फोन है, बैटरी लाइफ बहुत बढ़िया है और कैमरा भी क्लियर है।", highlights: ["बैटरी", "कैमरा"], badges: ["verified", "photo"], lang: "HI", langOriginal: "हिन्दी", personas: ["Heavy Users Only"], rating: 5, features: [{ name: "Battery", score: 92 }, { name: "Camera", score: 88 }], before: 60, after: 88, helpful: 41, date: "Feb 2025", category: "Electronics" },
    { id: "e3", text: "Good value for money. Quality is decent for the price range.", highlights: ["value", "quality"], badges: ["verified"], lang: "EN", personas: ["Best for Students"], rating: 4, features: [{ name: "Value", score: 85 }, { name: "Quality", score: 70 }], before: 55, after: 80, helpful: 18, date: "Mar 2025", category: "Electronics" },
    { id: "e4", text: "மிகவும் நல்ல தயாரிப்பு, விரைவான டெலிவரி.", highlights: ["டெலிவரி"], badges: ["verified", "detailed"], lang: "TA", langOriginal: "தமிழ்", personas: ["Good for Family Use"], rating: 5, features: [{ name: "Delivery", score: 90 }, { name: "Quality", score: 82 }], before: 50, after: 85, helpful: 33, date: "Jan 2025", category: "Electronics" },
    { id: "e5", text: "Same review copy pasted multiple times — looks suspicious.", highlights: [], badges: ["flagged"], lang: "EN", personas: [], rating: 5, features: [{ name: "Quality", score: 100 }], before: 0, after: 0, helpful: 2, date: "Mar 2025", category: "Electronics" },
    { id: "e6", text: "Decent product but support team was slow to respond. Quality is okay.", highlights: ["support", "quality"], badges: ["verified", "detailed"], lang: "EN", personas: ["Heavy Users Only"], rating: 3, features: [{ name: "Support", score: 45 }, { name: "Quality", score: 68 }], before: 38, after: 55, helpful: 27, date: "Feb 2025", category: "Electronics" },
    { id: "e7", text: "Bahut accha hai bhai, paisa vasool deal hai ye toh.", highlights: ["value"], badges: ["verified"], lang: "HINGLISH", langOriginal: "Hinglish", personas: ["Best for Students"], rating: 4, features: [{ name: "Value", score: 88 }], before: 60, after: 80, helpful: 15, date: "Mar 2025", category: "Electronics" },
    { id: "e8", text: "ভাল পণ্য, ব্যাটারি অনেকক্ষণ চলে।", highlights: ["ব্যাটারি"], badges: ["verified", "photo"], lang: "BN", langOriginal: "বাংলা", personas: ["Heavy Users Only"], rating: 5, features: [{ name: "Battery", score: 90 }, { name: "Quality", score: 80 }], before: 55, after: 85, helpful: 22, date: "Jan 2025", category: "Electronics" },
  ],
  fmcg: [
    { id: "f1", text: "Taste is excellent, packaging needs improvement though. Delivery was on time.", highlights: ["taste", "packaging", "delivery"], badges: ["verified", "detailed"], lang: "EN", personas: ["Good for Family Use"], rating: 4, features: [{ name: "Taste", score: 92 }, { name: "Packaging", score: 50 }, { name: "Delivery", score: 78 }], before: 50, after: 75, helpful: 31, date: "Mar 2025", category: "FMCG" },
    { id: "f2", text: "स्वाद बहुत अच्छा है, पूरे परिवार को पसंद आया।", highlights: ["स्वाद"], badges: ["verified"], lang: "HI", langOriginal: "हिन्दी", personas: ["Good for Family Use"], rating: 5, features: [{ name: "Taste", score: 95 }], before: 70, after: 90, helpful: 45, date: "Feb 2025", category: "FMCG" },
    { id: "f3", text: "Quality is consistent. Good value for daily use.", highlights: ["quality", "value"], badges: ["verified", "detailed"], lang: "EN", personas: ["Good for Family Use"], rating: 5, features: [{ name: "Quality", score: 88 }, { name: "Value", score: 90 }], before: 65, after: 85, helpful: 28, date: "Jan 2025", category: "FMCG" },
    { id: "f4", text: "சுவை அருமை, விலை மலிவு.", highlights: ["சுவை"], badges: ["verified", "photo"], lang: "TA", langOriginal: "தமிழ்", personas: ["Best for Students"], rating: 5, features: [{ name: "Taste", score: 90 }, { name: "Value", score: 85 }], before: 60, after: 88, helpful: 19, date: "Mar 2025", category: "FMCG" },
    { id: "f5", text: "Packaging arrived torn, product was fine but messy. Improve packaging please.", highlights: ["packaging"], badges: ["verified", "photo"], lang: "EN", personas: [], rating: 2, features: [{ name: "Packaging", score: 25 }, { name: "Quality", score: 70 }], before: 30, after: 40, helpful: 38, date: "Feb 2025", category: "FMCG" },
    { id: "f6", text: "Yaar ye toh top class hai, ghar ke sab log khush hain.", highlights: ["quality"], badges: ["verified"], lang: "HINGLISH", langOriginal: "Hinglish", personas: ["Good for Family Use"], rating: 5, features: [{ name: "Quality", score: 90 }], before: 65, after: 88, helpful: 24, date: "Mar 2025", category: "FMCG" },
    { id: "f7", text: "मराठी कुटुंबासाठी उत्तम — चव खूप छान आहे.", highlights: ["चव"], badges: ["verified", "detailed"], lang: "MR", langOriginal: "मराठी", personas: ["Good for Family Use"], rating: 5, features: [{ name: "Taste", score: 92 }], before: 70, after: 90, helpful: 16, date: "Jan 2025", category: "FMCG" },
    { id: "f8", text: "ভাল মান, প্যাকেজিং উন্নত হয়েছে।", highlights: ["মান", "প্যাকেজিং"], badges: ["verified"], lang: "BN", langOriginal: "বাংলা", personas: ["Good for Family Use"], rating: 4, features: [{ name: "Quality", score: 85 }, { name: "Packaging", score: 78 }], before: 55, after: 82, helpful: 21, date: "Feb 2025", category: "FMCG" },
  ],
  apparel: [
    { id: "a1", text: "Fabric quality is great, fits perfectly. Durability seems good after 2 washes.", highlights: ["quality", "durability"], badges: ["verified", "detailed", "photo"], lang: "EN", personas: ["Best for Office"], rating: 5, features: [{ name: "Quality", score: 88 }, { name: "Durability", score: 82 }], before: 60, after: 86, helpful: 36, date: "Mar 2025", category: "Apparel" },
    { id: "a2", text: "कपड़ा अच्छा है लेकिन साइज़ थोड़ा छोटा निकला।", highlights: ["कपड़ा"], badges: ["verified"], lang: "HI", langOriginal: "हिन्दी", personas: [], rating: 3, features: [{ name: "Quality", score: 75 }, { name: "Fit", score: 50 }], before: 50, after: 65, helpful: 19, date: "Feb 2025", category: "Apparel" },
    { id: "a3", text: "Delivery was quick. Packaging was neat. Overall happy.", highlights: ["delivery", "packaging"], badges: ["verified"], lang: "EN", personas: ["Good for Family Use"], rating: 4, features: [{ name: "Delivery", score: 85 }, { name: "Packaging", score: 80 }], before: 55, after: 78, helpful: 22, date: "Jan 2025", category: "Apparel" },
    { id: "a4", text: "துணி தரம் மிகவும் நன்றாக உள்ளது.", highlights: ["துணி"], badges: ["verified", "photo"], lang: "TA", langOriginal: "தமிழ்", personas: ["Best for Office"], rating: 5, features: [{ name: "Quality", score: 90 }], before: 60, after: 86, helpful: 27, date: "Mar 2025", category: "Apparel" },
    { id: "a5", text: "Color faded after first wash. Disappointing durability.", highlights: ["durability"], badges: ["verified", "detailed"], lang: "EN", personas: [], rating: 2, features: [{ name: "Durability", score: 30 }, { name: "Quality", score: 45 }], before: 50, after: 32, helpful: 41, date: "Feb 2025", category: "Apparel" },
    { id: "a6", text: "Bhai paisa vasool, fitting bhi ekdum perfect hai.", highlights: ["value"], badges: ["verified"], lang: "HINGLISH", langOriginal: "Hinglish", personas: ["Best for Students"], rating: 4, features: [{ name: "Value", score: 86 }, { name: "Fit", score: 88 }], before: 60, after: 82, helpful: 17, date: "Mar 2025", category: "Apparel" },
    { id: "a7", text: "ভাল মানের কাপড়, রঙ নষ্ট হয় না।", highlights: ["মান"], badges: ["verified", "detailed"], lang: "BN", langOriginal: "বাংলা", personas: ["Best for Office"], rating: 5, features: [{ name: "Quality", score: 87 }, { name: "Durability", score: 84 }], before: 55, after: 84, helpful: 23, date: "Jan 2025", category: "Apparel" },
    { id: "a8", text: "Same product reviewed by likely bot account.", highlights: [], badges: ["flagged"], lang: "EN", personas: [], rating: 5, features: [], before: 0, after: 0, helpful: 1, date: "Mar 2025", category: "Apparel" },
  ],
};

export const PRODUCER_TICKER = [
  "⚠ FMCG Batch #A204: Packaging complaints up 18% this week",
  "✅ Electronics: Battery sentiment stable at 82%",
  "🔔 Apparel durability score climbed to 76% — flag for marketing",
  "📉 Tamil Nadu delivery SLA dipping — monitor closely",
];

export const CONSUMER_TICKER = [
  "🔥 iPhone 15 — trending positive in Bengaluru",
  "💡 Best time to buy: festive season deals detected",
  "✨ Boat earphones now 91% positive — students' top pick",
  "🛒 Amul Ghee leads FMCG with 94% quality sentiment",
];
