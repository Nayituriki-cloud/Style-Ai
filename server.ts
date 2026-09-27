import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Server-side Google GenAI initialization with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Style Advisor Endpoint
app.post('/api/gemini/advisor', async (req, res) => {
  try {
    const {
      gender,
      ageRange,
      favoriteColors,
      clothingPreferences,
      budget,
      climate,
      occasion,
      aesthetic,
      wardrobeSummary,
    } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        recommendation: generateFallbackAdvisorRecommendation({
          gender,
          ageRange,
          favoriteColors,
          clothingPreferences,
          budget,
          climate,
          occasion,
          aesthetic,
        }),
      });
    }

    const prompt = `
You are STYLE AI, a world-class personal fashion stylist and image consultant.
Create a thoughtful, personalized, stylish outfit recommendation based on the user's profile:
- Gender / Style Preference: ${gender || 'Versatile / Any'}
- Age Range: ${ageRange || 'Adult'}
- Favorite Colors: ${Array.isArray(favoriteColors) ? favoriteColors.join(', ') : favoriteColors || 'Neutral'}
- Clothing Preferences: ${clothingPreferences || 'Modern & Comfortable'}
- Budget Tier: ${budget || 'Medium'}
- Climate / Weather: ${climate || 'Temperate'}
- Occasion: ${occasion || 'Smart Casual'}
- Fashion Aesthetic: ${aesthetic || 'Minimalist'}
- Available Wardrobe Items: ${wardrobeSummary || 'General wardrobe'}

AI Safety Rules:
1. Provide respectful, constructive fashion advice.
2. Strictly DO NOT make sensitive, medical, or unverifiable judgments about the user's body, health, ethnicity, or identity.
3. Never body-shame. Focus strictly on garment silhouettes, color theory, tailoring, fabric weights, layering, and occasion etiquette.

Respond strictly in valid JSON matching this schema:
{
  "outfitTitle": "string",
  "vibe": "string",
  "stylingRationale": "string",
  "occasionSuitability": "string",
  "palette": [
    {"name": "string", "hex": "#rrggbb", "role": "Primary / Accent / Neutral"}
  ],
  "items": [
    {"category": "Top", "name": "string", "description": "string", "stylingTip": "string"},
    {"category": "Bottom", "name": "string", "description": "string", "stylingTip": "string"},
    {"category": "Outerwear", "name": "string", "description": "string", "stylingTip": "string"},
    {"category": "Footwear", "name": "string", "description": "string", "stylingTip": "string"},
    {"category": "Accessories", "name": "string", "description": "string", "stylingTip": "string"}
  ],
  "colorHarmonyAdvice": "string",
  "climateAdjustments": "string",
  "budgetTip": "string"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, recommendation: parsed });
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    // Graceful fallback response
    const fallback = generateFallbackAdvisorRecommendation(req.body);
    return res.json({ success: true, fallback: true, recommendation: fallback });
  }
});

// 2. Photo-Based Outfit Analysis Endpoint
app.post('/api/gemini/analyze-outfit', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', question } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        analysis: generateFallbackPhotoAnalysis(),
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const promptText = `
You are STYLE AI's high-precision Computer Vision Fashion Analyst.
Analyze the clothing item or outfit shown in this image.

Focus strictly on:
1. Clothing Type & Silhouette (e.g. relaxed blazer, tailored pleated trousers, trench coat)
2. Dominant & Accent Colors with hex code estimates
3. Patterns, Textures & Fabric Finish (e.g., houndstooth, linen weave, ribbed knit)
4. Fit & Tailoring observations (e.g., oversized drape, structured shoulders, cropped hem)
5. Style Combination & Aesthetic archetype (e.g., Smart Casual, Scandinavian Minimalist, Streetwear)
6. Matching Opportunities (what specific garments and accessories would elevate or complement this)
7. 3 Constructive Fashion Suggestions

CRITICAL AI SAFETY GUIDELINES:
- Provide respectful, encouraging, constructive fashion advice only.
- DO NOT make any sensitive or unverifiable judgments about the person's body, body type, weight, health, ethnicity, age, or identity.
- Analyze the CLOTHING AND ACCESSORIES only.

Respond strictly in valid JSON matching this schema:
{
  "detectedItems": [
    {"name": "string", "category": "string", "fit": "string", "material": "string"}
  ],
  "colors": [
    {"name": "string", "hex": "#rrggbb", "proportion": "string"}
  ],
  "patternsAndTextures": "string",
  "aestheticArchetype": "string",
  "fitAppraisal": "string",
  "matchingOpportunities": [
    {"pairedWith": "string", "whyItWorks": "string", "idealOccasion": "string"}
  ],
  "constructiveTips": [
    "string",
    "string",
    "string"
  ],
  "versatilityScore": 88
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: question ? `${promptText}\nUser Context Question: ${question}` : promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Analyze Outfit API Error:', error);
    const fallback = generateFallbackPhotoAnalysis();
    return res.json({ success: true, fallback: true, analysis: fallback });
  }
});

// 3. AI Outfit Generator Endpoint
app.post('/api/gemini/generate-outfit', async (req, res) => {
  try {
    const { occasion, styleCategory, budgetLevel, season, userWardrobe } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        outfit: generateFallbackOutfit(occasion, styleCategory, budgetLevel),
      });
    }

    const prompt = `
You are STYLE AI. Generate a complete, impeccably coordinated fashion outfit for:
- Occasion: ${occasion || 'Smart Casual'}
- Style Category: ${styleCategory || 'Classic'}
- Budget Level: ${budgetLevel || 'Medium'}
- Season / Weather: ${season || 'Spring / Mild'}
- User Wardrobe Items Available: ${userWardrobe ? JSON.stringify(userWardrobe).slice(0, 1000) : 'None provided'}

Respond strictly in valid JSON matching this schema:
{
  "title": "string",
  "occasion": "string",
  "styleCategory": "string",
  "estimatedBudget": "string",
  "budgetTier": "${budgetLevel || 'Medium'}",
  "styleExplanation": "string",
  "colorPalette": [
    {"name": "string", "hex": "#rrggbb"}
  ],
  "top": {
    "name": "string",
    "color": "string",
    "details": "string"
  },
  "bottom": {
    "name": "string",
    "color": "string",
    "details": "string"
  },
  "outerwear": {
    "name": "string",
    "color": "string",
    "details": "string"
  },
  "shoes": {
    "name": "string",
    "color": "string",
    "details": "string"
  },
  "accessories": [
    {"name": "string", "type": "string", "details": "string"}
  ],
  "stylingTip": "string"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, outfit: parsed });
  } catch (error: any) {
    console.error('Generate Outfit Error:', error);
    const fallback = generateFallbackOutfit(req.body.occasion, req.body.styleCategory, req.body.budgetLevel);
    return res.json({ success: true, fallback: true, outfit: fallback });
  }
});

// 4. Color Matching Engine Endpoint
app.post('/api/gemini/color-match', async (req, res) => {
  try {
    const { baseItem, baseColor, occasion } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        result: generateFallbackColorMatch(baseItem, baseColor),
      });
    }

    const prompt = `
You are the STYLE AI Color Coordination Engine.
The user has a base garment or color: "${baseItem || 'Navy Trousers'}" (Color: "${baseColor || 'Navy Blue'}").
Target Occasion: "${occasion || 'Business Casual'}".

Provide four distinct color coordination schemes:
1. Classic Contrast (Timeless, foolproof)
2. Monochromatic / Tonal (Modern, sophisticated)
3. Complementary / Harmonic (Rich, stylish)
4. Contemporary Accent (Elevated with an intentional pop)

For each scheme, specify:
- Top garment color & name
- Outerwear/Jacket color & name
- Shoe color & leather/fabric type
- Accessory/Belt/Watch color & finish
- Color swatches with hex codes
- Why this combination works according to color theory.

Respond strictly in valid JSON format:
{
  "baseItem": "${baseItem || 'Navy Trousers'}",
  "baseColor": "${baseColor || 'Navy Blue'}",
  "schemes": [
    {
      "name": "string",
      "concept": "string",
      "top": "string",
      "outerwear": "string",
      "shoes": "string",
      "accessories": "string",
      "rationale": "string",
      "palette": [
        {"name": "string", "hex": "#rrggbb"}
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Color Match Error:', error);
    const fallback = generateFallbackColorMatch(req.body.baseItem, req.body.baseColor);
    return res.json({ success: true, fallback: true, result: fallback });
  }
});

// 5. AI Chat Assistant Endpoint ("Ask Style AI")
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile, wardrobeItems } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        reply: generateFallbackChatReply(message),
      });
    }

    const systemInstruction = `
You are "Ask Style AI", an empathetic, highly cultured, and encouraging personal fashion advisor.
You help users with dress codes, color matching, outfit pairing, interview prep, wardrobe curation, and style advice.

Guidelines:
1. Always be polite, modern, and practical.
2. If the user mentions their wardrobe, consider the items: ${JSON.stringify(wardrobeItems || []).slice(0, 800)}.
3. User profile aesthetic: ${userProfile?.aesthetic || 'Smart Casual'}, preferred colors: ${userProfile?.favoriteColors?.join(', ') || 'Neutrals'}.
4. STRICT SAFETY: Never shame the user's body, health, appearance, or identity. Fashion is about self-expression, confidence, and comfort.
5. Provide actionable, concise advice with specific garment recommendations and color combinations.
`;

    const formattedContents = [
      ...history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I'd love to help style that look! Could you tell me more about the occasion or your favorite color?";
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.json({
      success: true,
      fallback: true,
      reply: generateFallbackChatReply(req.body.message),
    });
  }
});

// Fallback logic generators for resilient UX
function generateFallbackAdvisorRecommendation(params: any) {
  return {
    outfitTitle: 'The Tailored Architectural Neutral Look',
    vibe: 'Refined, effortless, and versatile across day-to-night transitions',
    stylingRationale: `Curated for a ${params?.aesthetic || 'Modern Minimalist'} sensibility tailored for ${params?.occasion || 'Smart Casual'} wear in a ${params?.climate || 'temperate'} climate. High-quality textures in muted neutrals create an understated luxury aesthetic without excessive branding.`,
    occasionSuitability: `Ideal for ${params?.occasion || 'Work & Casual Dinners'} - structured enough to command respect, relaxed enough for effortless comfort.`,
    palette: [
      { name: 'Oatmeal Wool', hex: '#D8CEBE', role: 'Primary' },
      { name: 'Deep Espresso', hex: '#2B1E1A', role: 'Accent' },
      { name: 'Crisp Cotton White', hex: '#F9F8F6', role: 'Base' },
      { name: 'Brushed Brass', hex: '#B89758', role: 'Hardware' },
    ],
    items: [
      { category: 'Top', name: 'Relaxed Silk-Cotton Overshirt', description: 'Fluid silhouette in crisp ecru with mother-of-pearl buttons', stylingTip: 'Leave bottom two buttons undone for natural drape' },
      { category: 'Bottom', name: 'Single-Pleat Wide Leg Trousers', description: 'Tailored drape in lightweight tropical wool or linen-blend', stylingTip: 'Hem should gently break over the vamp of your footwear' },
      { category: 'Outerwear', name: 'Deconstructed Unlined Blazer', description: 'Soft-shoulder silhouette in breathable taupe hopsack', stylingTip: 'Push sleeves up slightly past mid-forearm' },
      { category: 'Footwear', name: 'Almond-Toe Leather Penny Loafers', description: 'Deep burnished oxblood or chocolate suede', stylingTip: 'Wear sockless or with fine mercerized cotton ribbed socks' },
      { category: 'Accessories', name: 'Minimalist Tank Watch & Cognac Belt', description: 'Slim leather strap with rectangular gold-tone case', stylingTip: 'Match leather tone cleanly to shoes' },
    ],
    colorHarmonyAdvice: 'Ground light neutral tops with deep earthen bottoms or footwear to keep the eye moving vertically.',
    climateAdjustments: 'Layer an ultra-fine merino crewneck underneath if temperatures dip below 15°C.',
    budgetTip: 'Invest in the footwear and outerwear; tops can be versatile basics from high-street collections.',
  };
}

function generateFallbackPhotoAnalysis() {
  return {
    detectedItems: [
      { name: 'Structured Double-Breasted Tailored Jacket', category: 'Outerwear', fit: 'Tailored regular silhouette', material: 'Worsted wool blend' },
      { name: 'Crisp Poplin Collar Shirt', category: 'Top', fit: 'Fitted', material: '100% Egyptian Cotton' },
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#1B263B', proportion: '60%' },
      { name: 'Optic White', hex: '#F8F9FA', proportion: '25%' },
      { name: 'Cognac Brown', hex: '#8B4513', proportion: '15%' },
    ],
    patternsAndTextures: 'Subtle micro-twill weave with natural matte luster and crisp cotton contrast.',
    aestheticArchetype: 'Contemporary Sartorial / Smart Executive',
    fitAppraisal: 'Shoulder seams align precisely with the acromion bone. Clean lapel roll and proportional sleeve length revealing 1cm of cuff.',
    matchingOpportunities: [
      { pairedWith: 'Sand / Oatmeal pleated chinos', whyItWorks: 'Softens formal structure into high-taste smart casual', idealOccasion: 'Creative meetings & dinner dates' },
      { pairedWith: 'Dark selvedge raw denim', whyItWorks: 'Provides architectural grounding with high-low styling contrast', idealOccasion: 'Weekend gallery visits & travel' },
      { pairedWith: 'Suede Chelsea boots in snuff brown', whyItWorks: 'Adds tactile warmth to crisp worsted wool', idealOccasion: 'Autumn evening events' },
    ],
    constructiveTips: [
      'Pair with contrasting light-colored trousers (cream or light stone) to avoid looking like an incomplete suit.',
      'Unbutton the lowest jacket button to allow effortless natural drape when standing.',
      'Add a textured silk or linen pocket square with an accent color like terracotta or sage green.',
    ],
    versatilityScore: 92,
  };
}

function generateFallbackOutfit(occasion: string = 'Work', styleCategory: string = 'Smart Casual', budgetLevel: string = 'Medium') {
  return {
    title: `${styleCategory} ${occasion} Ensemble`,
    occasion: occasion,
    styleCategory: styleCategory,
    estimatedBudget: budgetLevel === 'Premium' ? '$650 - $1,200' : budgetLevel === 'Low' ? '$95 - $160' : '$220 - $380',
    budgetTier: budgetLevel,
    styleExplanation: `An elevated take on modern ${styleCategory} dressing, specifically optimized for ${occasion}. Balancing tailored structure with all-day comfort.`,
    colorPalette: [
      { name: 'Deep Forest', hex: '#1C3124' },
      { name: 'Warm Ecru', hex: '#F0ECE1' },
      { name: 'Charcoal Slub', hex: '#333533' },
      { name: 'Natural Tan', hex: '#C29B74' },
    ],
    top: {
      name: 'Waffle-Knit Merino Mockneck',
      color: 'Warm Ecru',
      details: 'Breathable medium gauge knit with clean ribbed cuffs',
    },
    bottom: {
      name: 'Relaxed Tapered Chinos',
      color: 'Deep Forest',
      details: 'Garment-dyed stretch cotton with hidden interior drawstring',
    },
    outerwear: {
      name: 'Minimalist Harrington Jacket',
      color: 'Charcoal Slub',
      details: 'Water-resistant twill shell with two-way silver zipper',
    },
    shoes: {
      name: 'Handcrafted Minimalist Leather Low-Tops',
      color: 'White / Gum Sole',
      details: 'Supple Italian calfskin with comfortable cushioned insole',
    },
    accessories: [
      { name: 'Matte Leather Cardholder', type: 'Small Leather Goods', details: 'Streamlined pocket profile' },
      { name: 'Chronograph Watch with Saddle Leather Band', type: 'Timepiece', details: 'Bauhaus inspired dial with 38mm case' },
    ],
    stylingTip: 'Tuck the front hem of the knit slightly for balanced waistline proportion.',
  };
}

function generateFallbackColorMatch(baseItem: string = 'Navy Trousers', baseColor: string = 'Navy Blue') {
  return {
    baseItem: baseItem,
    baseColor: baseColor,
    schemes: [
      {
        name: 'Classic Continental Harmony',
        concept: 'High-contrast timeless elegance that commands confidence effortlessly.',
        top: 'Crisp Oxford White Button-Down',
        outerwear: 'Camel Hair or Snuff Suede Overshirt',
        shoes: 'Cognac Brown Oxford or Monk Straps',
        accessories: 'Matching burnished cognac belt and gold accents',
        rationale: 'Navy and warm camel/cognac sit across from each other on the color wheel in a rich complementary dialogue.',
        palette: [
          { name: 'Navy Ground', hex: '#1B2A47' },
          { name: 'Pure White', hex: '#FFFFFF' },
          { name: 'Warm Camel', hex: '#C19A6B' },
          { name: 'Burnished Cognac', hex: '#7E3F12' },
        ],
      },
      {
        name: 'Monochromatic Tonal Depth',
        concept: 'Layered shades of the same color family for an ultra-modern, elongated silhouette.',
        top: 'Sky Blue Poplin or Slate Merino Knit',
        outerwear: 'Midnight Navy Chesterfield Coat or Chore Jacket',
        shoes: 'Dark Navy Suede Loafers or Black Leather Chelsea Boots',
        accessories: 'Silver hardware with deep indigo woven watch strap',
        rationale: 'Varying the brightness and saturation of blue prevents flatness while creating a sleek, height-elongating impression.',
        palette: [
          { name: 'Midnight', hex: '#0F172A' },
          { name: 'Navy Trousers', hex: '#1E3A8A' },
          { name: 'Sky Mist', hex: '#93C5FD' },
          { name: 'Slate Blue', hex: '#3B82F6' },
        ],
      },
      {
        name: 'Warm Earth & Spice',
        concept: 'Rich, grounded autumn hues that feel organic, approachable, and elevated.',
        top: 'Terracotta / Rust Brushed Flannel or Knit',
        outerwear: 'Olive Drab Waxed Field Jacket',
        shoes: 'Dark Chocolate Roughout Boots',
        accessories: 'Antiqued brass buckle belt and canvas tote',
        rationale: 'Navy provides a neutral oceanic anchor against warm rust and olive earth tones, creating grounded harmony.',
        palette: [
          { name: 'Navy Ground', hex: '#1B2A47' },
          { name: 'Terracotta', hex: '#C85A32' },
          { name: 'Olive Drab', hex: '#4B5320' },
          { name: 'Espresso', hex: '#2A1810' },
        ],
      },
      {
        name: 'Contemporary Minimalist Pop',
        concept: 'Clean neutral foundation with an intentional, artistic secondary accent.',
        top: 'Melange Heather Grey French Terry or Fine Knit',
        outerwear: 'Off-White Denim Jacket or Trench',
        shoes: 'Chalk White Clean Leather Sneakers',
        accessories: 'Burnt Ochre or Emerald Green wool scarf/beanie',
        rationale: 'Grey and off-white soften the navy base, allowing a singular accent color to sing with restraint.',
        palette: [
          { name: 'Navy Ground', hex: '#1B2A47' },
          { name: 'Heather Grey', hex: '#9CA3AF' },
          { name: 'Chalk White', hex: '#F3F4F6' },
          { name: 'Burnt Ochre', hex: '#CC7722' },
        ],
      },
    ],
  };
}

function generateFallbackChatReply(msg: string = '') {
  const m = msg.toLowerCase();
  if (m.includes('interview')) {
    return 'For a job interview, dress one notch above the company culture standard! For corporate or finance roles: a tailored navy or charcoal suit with a crisp white shirt, conservative silk tie, and polished oxfords. For tech or creative roles: a tailored unlined navy blazer, fine gauge merino knit in charcoal or ecru, tapered wool trousers, and minimalist leather loafers. Keep accessories minimal and make sure your clothes are freshly pressed!';
  }
  if (m.includes('black jeans')) {
    return "Black jeans are the ultimate wardrobe chameleon! Here are three foolproof combinations:\n1. Casual Elevated: Crisp white heavyweight tee, camel overcoat or overshirt, and clean white leather sneakers.\n2. Edgy Minimalist: Charcoal knit sweater, black leather biker jacket, and black Chelsea boots.\n3. Smart Casual: Light blue oxford button-down, charcoal wool blazer, and dark brown suede loafers with a matching belt!";
  }
  if (m.includes('shoes')) {
    return 'Shoe coordination depends on formality and trouser color: With navy trousers, choose rich cognac or oxblood brown for warmth, or black for formal settings. With grey trousers, black, burgundy, and dark brown all look exceptional. Always make sure your belt matches your leather footwear tone!';
  }
  return "That's a fantastic style consideration! When building outfits, start with one statement or anchor piece (like your favorite trousers or jacket), then build neutral layers around it. Pay close attention to proportion—pair relaxed tops with tapered bottoms or vice versa, and ensure your color palette contains at least one unifying neutral!";
}

// Development and production Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`STYLE AI server running on port ${PORT}`);
  });
}

startServer();
