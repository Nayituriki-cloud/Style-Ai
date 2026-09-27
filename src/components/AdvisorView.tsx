import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  BookmarkPlus,
  Calendar,
  ShoppingBag,
  Palette,
  Layers,
  Thermometer,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OCCASIONS, STYLE_CATEGORIES } from '../data/demoData';
import { BudgetLevel, OccasionType, StyleCategory } from '../types/database';

export const AdvisorView: React.FC = () => {
  const { wardrobe, addOutfit, setCurrentView, showToast, user } = useApp();

  // Questionnaire State
  const [gender, setGender] = useState('Versatile / Contemporary');
  const [ageRange, setAgeRange] = useState('25-34');
  const [selectedColors, setSelectedColors] = useState<string[]>([
    '#1B263B', // Navy
    '#D8CEBE', // Oatmeal
    '#2B1E1A', // Espresso
  ]);
  const [clothingPref, setClothingPref] = useState('Tailored & Breathable');
  const [budget, setBudget] = useState<BudgetLevel>('Medium');
  const [climate, setClimate] = useState('Temperate / Mild');
  const [occasion, setOccasion] = useState<OccasionType>('Work');
  const [aesthetic, setAesthetic] = useState<StyleCategory>('Smart Casual');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const COLOR_OPTIONS = [
    { name: 'Navy Blue', hex: '#1B263B' },
    { name: 'Oatmeal / Ecru', hex: '#D8CEBE' },
    { name: 'Espresso Brown', hex: '#2B1E1A' },
    { name: 'Forest Green', hex: '#1C3124' },
    { name: 'African Gold', hex: '#C59B27' },
    { name: 'Optic White', hex: '#FFFFFF' },
    { name: 'Charcoal Black', hex: '#1A1A1A' },
    { name: 'Terracotta', hex: '#C85A32' },
    { name: 'Camel Tan', hex: '#C19A6B' },
    { name: 'Burgundy / Oxblood', hex: '#6A1A24' },
    { name: 'Sage Mist', hex: '#879883' },
    { name: 'Indigo Blue', hex: '#102A43' },
  ];

  const handleColorToggle = (hex: string) => {
    if (selectedColors.includes(hex)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c !== hex));
      }
    } else {
      if (selectedColors.length < 5) {
        setSelectedColors([...selectedColors, hex]);
      } else {
        showToast('You can select up to 5 favorite colors', 'info');
      }
    }
  };

  const handleConsultAI = async () => {
    setLoading(true);
    setError(null);

    try {
      const wardrobeSummary = wardrobe.map((w) => `${w.name} (${w.category}, ${w.colorName})`).join('; ');

      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          ageRange,
          favoriteColors: selectedColors.map((hex) => {
            const found = COLOR_OPTIONS.find((c) => c.hex === hex);
            return found ? found.name : hex;
          }),
          clothingPreferences: clothingPref,
          budget,
          climate,
          occasion,
          aesthetic,
          wardrobeSummary,
        }),
      });

      const data = await response.json();
      if (data.recommendation) {
        setResult(data.recommendation);
      } else {
        throw new Error('Failed to generate recommendation');
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to reach the styling advisor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToOutfits = () => {
    if (!result) return;
    addOutfit({
      title: result.outfitTitle,
      description: result.vibe,
      occasion: occasion,
      styleCategory: aesthetic,
      colorPalette: result.palette || [
        { name: 'Primary', hex: '#1B263B' },
        { name: 'Secondary', hex: '#D8CEBE' },
      ],
      isFavorite: true,
      budgetTier: budget,
      stylingNotes: result.stylingRationale,
      aiGenerated: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
          <span>Haute Consultation</span>
          <span aria-hidden="true">·</span>
          <span>Bespoke Styling</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
          AI Style Advisor
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-2xl leading-relaxed">
          Share your preferences, occasion context, and aesthetic inclinations. STYLE AI synthesizes color harmony, fabric weights, and tailoring etiquette into a masterfully coordinated outfit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Questionnaire */}
        <div className="lg:col-span-6 space-y-7 bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          {/* Step 1: Gender & Age */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              1. Gender / Style Preference & Age Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                >
                  <option value="Versatile / Contemporary">Versatile / Contemporary</option>
                  <option value="Menswear / Sartorial">Menswear / Sartorial</option>
                  <option value="Womenswear / Chic">Womenswear / Chic</option>
                  <option value="Androgynous / Fluid">Androgynous / Fluid</option>
                </select>
              </div>
              <div>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                >
                  <option value="18-24">Age 18 - 24 (Collegiate)</option>
                  <option value="25-34">Age 25 - 34 (Emerging Pro)</option>
                  <option value="35-44">Age 35 - 44 (Established)</option>
                  <option value="45-54">Age 45 - 54 (Executive)</option>
                  <option value="55+">Age 55+ (Distinguished)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Occasion */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              2. Target Occasion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {OCCASIONS.map((occ) => {
                const isSelected = occasion === occ.name;
                return (
                  <button
                    key={occ.name}
                    type="button"
                    onClick={() => setOccasion(occ.name)}
                    className={`px-3 py-2 text-xs text-left rounded-lg border transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="truncate">{occ.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Aesthetic Category */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              3. Preferred Fashion Aesthetic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {STYLE_CATEGORIES.map((cat) => {
                const isSelected = aesthetic === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setAesthetic(cat.name)}
                    className={`px-3 py-2 text-xs text-left rounded-lg border transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Favorite Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                4. Preferred Color Palette ({selectedColors.length}/5)
              </label>
              <span className="text-[11px] text-stone-500">Pick 1 to 5</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = selectedColors.includes(c.hex);
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => handleColorToggle(c.hex)}
                    title={c.name}
                    className={`group relative p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-100 ring-1 ring-stone-900 dark:ring-stone-100 bg-stone-100 dark:bg-stone-800'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: c.hex }}
                      className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-600 shadow-2xs flex items-center justify-center text-white"
                    >
                      {isSelected && <Check className="w-3 h-3 drop-shadow-sm text-amber-300" />}
                    </div>
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 truncate w-full">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Budget & Climate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                5. Budget Tier
              </label>
              <div className="flex rounded-lg p-1 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                {(['Low', 'Medium', 'Premium'] as BudgetLevel[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      budget === b
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                6. Climate / Location
              </label>
              <select
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
              >
                <option value="Temperate / Mild">Temperate / Mild (15 - 22°C)</option>
                <option value="Warm / Tropical">Warm / Tropical (23 - 35°C)</option>
                <option value="Cool / Autumn">Cool / Autumn (8 - 14°C)</option>
                <option value="Cold / Winter">Cold / Winter (below 7°C)</option>
              </select>
            </div>
          </div>

          {/* Submit Consultation Button */}
          <button
            onClick={handleConsultAI}
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs tracking-wider uppercase rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                <span>Synthesizing Tailored Outfit...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Consult Style AI Advisor</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Recommendation Results */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-amber-600 animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                Curating Your Silhouette
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Analyzing fabric drape, occasion etiquette for {occasion}, and harmonizing your selected colors...
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="p-10 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
              <Wand2 className="w-8 h-8 mx-auto text-stone-400" />
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Awaiting Consultation
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Customize your preferences on the left and click "Consult Style AI Advisor" to generate an impeccably coordinated look.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-in fade-in">
              {/* Result Header */}
              <div className="border-b border-stone-200 dark:border-stone-800 pb-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {result.vibe || 'Curated Ensemble'}
                  </span>
                  <span>{occasion}</span>
                </div>
                <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
                  {result.outfitTitle}
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {result.stylingRationale}
                </p>
              </div>

              {/* Color Palette */}
              {result.palette && result.palette.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Harmonic Color Palette
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {result.palette.map((c: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs"
                      >
                        <span
                          style={{ backgroundColor: c.hex }}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700 shrink-0"
                        />
                        <span className="font-medium text-stone-800 dark:text-stone-200">{c.name}</span>
                        {c.role && <span className="text-[10px] text-stone-400">({c.role})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Ensemble Components & Layering
                </p>
                <div className="space-y-2.5">
                  {result.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-amber-800 dark:text-amber-300">{item.category}</span>
                        <span className="text-stone-900 dark:text-stone-100">{item.name}</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400">{item.description}</p>
                      {item.stylingTip && (
                        <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                          Styling tip: {item.stylingTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Climate & Budget Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {result.climateAdjustments && (
                  <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800/60 space-y-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-stone-500" />
                      <span>Weather Adaptation</span>
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      {result.climateAdjustments}
                    </p>
                  </div>
                )}
                {result.budgetTip && (
                  <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800/60 space-y-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-stone-500" />
                      <span>Budget Guidance</span>
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      {result.budgetTip}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveToOutfits}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save to My Outfits</span>
                </button>

                <button
                  onClick={() => setCurrentView('calendar')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-medium text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule in Calendar</span>
                </button>

                <button
                  onClick={() => setCurrentView('shopping')}
                  className="flex items-center gap-1.5 px-3 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-xs font-medium"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Find Pieces in Store</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
