# STYLE AI - Personal AI Fashion Stylist & Digital Wardrobe

A comprehensive, full-stack AI-powered fashion platform built with React, TypeScript, Express, Tailwind CSS, PostgreSQL schema architecture, and Google Gemini 3.8.

STYLE AI empowers users to coordinate colors, catalog digital wardrobes, receive constructive photo-based outfit critiques, schedule weekly looks, generate looks for 12 distinct aesthetics, and consult a dedicated AI fashion concierge.

---

## Key Features

1. **AI Style Advisor**
   - In-depth 8-point consultation: gender/style preference, age cohort, favorite colors, clothing preferences, budget mode, climate/weather, occasion, and aesthetics.
   - Generates complete coordinated looks with styling tips, layering rationale, color harmony advice, and weather adjustments.

2. **Photo-Based Outfit Analysis**
   - High-precision computer-vision analysis of garment photographs.
   - Extracts silhouettes, colors (with hex codes), patterns/textures, tailoring fit, and identifies matching opportunities with existing wardrobe items.
   - **Strict AI Safety Guarantee**: Safe, encouraging, constructive fashion feedback without body-shaming, medical judgments, or sensitive personal inferences.

3. **Virtual Outfit Builder**
   - Interactive styling atelier canvas with dedicated slots for Outerwear, Top, Bottom, Footwear, Bag, and Watch/Accessories.
   - Real-time chromatic harmony engine calculating live compatibility scores (e.g. 96% Complementary Contrast).
   - Direct integration with cataloged wardrobe items.

4. **12 Distinct Fashion Aesthetics**
   - Classic, Smart Casual, Business, Streetwear, Minimalist, Luxury, Casual, Sporty, Vintage, African-inspired (Ankara/Kente prints), Formal, and Creative.

5. **Occasion Matrix**
   - University, Work, Business Meeting, Interview, Wedding, Date, Party, Travel, Casual Day, Sports, Formal Event, and Traditional/African Fashion.

6. **Chromatic Color Matching Engine**
   - Select any base item or color swatch (e.g. Navy Trousers, Camel Wool Coat, African Gold Blazer).
   - Generates 4 distinct harmony schemes: Classic Contrast, Monochromatic Depth, Warm Earth & Spice, and Contemporary Minimalist Pop with exact garment color assignments.

7. **Generative Outfit Engine**
   - Instant "GENERATE MY OUTFIT" button.
   - Yields Top, Bottom, Outerwear, Footwear, Accessories, color palette, style explanation, and budget estimation. Unlimited regeneration.

8. **Digital Wardrobe Manager**
   - Add, edit, delete, and categorize garments (Tops, Shirts, T-shirts, Jackets, Trousers, Jeans, Dresses, Shoes, Bags, Watches, Accessories, Traditional).
   - Filter by color swatch, category, budget tier, and full-text search.
   - Wear frequency tracker and favorites.

9. **Budget Modes**
   - Low, Medium, and Premium tiers.
   - Prioritizes garments already in the user's wardrobe before recommending purchases.

10. **Curated Shopping Integration**
    - Verified partner catalog (COS, Arket, Nordstrom, Morjas, Farfetch, Studio 189, Zara) with real external purchase links, live stock confirmation, and one-click "Add to Wardrobe".

11. **Outfit Calendar**
    - Monday-through-Sunday weekly planner.
    - Assign saved looks, mark items as worn, track weather forecasts, and log daily agendas.

12. **Personal Style Profile**
    - Archetype badge ("Elevated Sartorialist"), wardrobe metrics, valuation calculations, favorite colors editor, and style history.

13. **Ask Style AI Concierge**
    - Conversational styling chat with contextual knowledge of the user's specific wardrobe items and preferred aesthetics.

14. **STYLE AI PRO Subscription**
    - Transparent pricing ($9.99/mo or $89/yr) with user confirmation step and advanced haute-couture reasoning privileges.

15. **Relational Database (11 Tables)**
    - PostgreSQL DDL provided in `src/db/schema.sql` covering `users`, `style_profiles`, `wardrobe_items`, `outfits`, `outfit_items`, `favorites`, `style_preferences`, `outfit_calendar`, `recommendations`, `shopping_items`, and `chat_history`.

16. **Pre-Loaded Realistic Demo Data**
    - Immediate test drive right out of the box with high-resolution fashion photography and pre-seeded ensembles.

---

## Technical Architecture

- **Frontend**: React 19 SPA, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Express server running on port 3000 with Vite middlewares in dev mode.
- **AI Integration**: `@google/genai` TypeScript SDK using `gemini-3.8-flash` initialized strictly server-side with telemetry `User-Agent: aistudio-build`.
- **Database**: Relational PostgreSQL schema with UUID primary keys, foreign key cascades, and JSONB document storage.
- **Client Persistence**: LocalStorage with automatic state synchronization.

---

## Setup & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file (copied from `.env.example`):
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   PORT=3000
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```
