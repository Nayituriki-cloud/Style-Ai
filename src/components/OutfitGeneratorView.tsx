import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  BookmarkPlus,
  Calendar,
  ShoppingBag,
  DollarSign,
  Palette,
  Check,
  AlertCircle,
  Shirt,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OCCASIONS, STYLE_CATEGORIES } from '../data/demoData';
import { BudgetLevel, OccasionType, StyleCategory } from '../types/database';

export const OutfitGeneratorView: React.FC = () => {
  const { wardrobe, addOutfit, setCurrentView, showToast, budgetFilter } = useApp();

  const [occasion, setOccasion] = useState<OccasionType>('Work');
  const [styleCategory, setStyleCategory] = useState<StyleCategory>('Minimalist');
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('Medium');
  const [season, setSeason] = useState('Spring / Mild');
  const [useWardrobe, setUseWardrobe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutfit = async () => {
    setLoading(true);
    setError(null);

    try {
      const userWardrobeItems = useWardrobe
        ? wardrobe.map((w) => ({ name: w.name, category: w.category, color: w.colorName }))
        : undefined;

      const response = await fetch('/api/gemini/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          styleCategory,
          budgetLevel,
          season,
          userWardrobe: userWardrobeItems,
        }),
      });

      const data = await response.json();
      if (data.outfit) {
        setOutfit(data.outfit);
      } else {
        throw new Error('Failed to generate outfit');
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to reach the outfit generator. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToOutfits = () => {
    if (!outfit) return;
    addOutfit({
      title: outfit.title,
      description: outfit.styleExplanation,
      occasion: occasion,
      styleCategory: styleCategory,
      colorPalette: outfit.colorPalette || [
        { name: 'Base', hex: '#1B263B' },
        { name: 'Neutral', hex: '#D8CEBE' },
      ],
      isFavorite: true,
      budgetTier: budgetLevel,
      stylingNotes: outfit.stylingTip,
      aiGenerated: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Generative Style Engine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
          AI Outfit Generator
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Generate complete, tailored fashion ensembles on demand. Fine-tune your occasion and aesthetic, or let the AI assemble looks from your existing wardrobe.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Occasion */}
          <div className="space-y-1.5">
            <label className="block font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as OccasionType)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
            >
              {OCCASIONS.map((o) => (
                <option key={o.name} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Aesthetic */}
          <div className="space-y-1.5">
            <label className="block font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Aesthetic
            </label>
            <select
              value={styleCategory}
              onChange={(e) => setStyleCategory(e.target.value as StyleCategory)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
            >
              {STYLE_CATEGORIES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <label className="block font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Budget Level
            </label>
            <select
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
            >
              <option value="Low">Low Budget</option>
              <option value="Medium">Medium Budget</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Climate */}
          <div className="space-y-1.5">
            <label className="block font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
            >
              <option value="Spring / Mild">Spring / Mild</option>
              <option value="Summer / Warm">Summer / Warm</option>
              <option value="Autumn / Crisp">Autumn / Crisp</option>
              <option value="Winter / Cold">Winter / Cold</option>
            </select>
          </div>
        </div>

        {/* Prioritize Wardrobe Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={useWardrobe}
              onChange={(e) => setUseWardrobe(e.target.checked)}
              className="w-4 h-4 rounded text-stone-900 border-stone-300 dark:border-stone-700 focus:ring-0"
            />
            <span>Prioritize matching garments already in my Wardrobe ({wardrobe.length} items)</span>
          </label>
        </div>

        {/* Big Action Button */}
        <button
          onClick={handleGenerateOutfit}
          disabled={loading}
          className="w-full py-4 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs tracking-widest uppercase rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>Generating Tailored Look...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>GENERATE MY OUTFIT</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Look Output */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {outfit && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="border-b border-stone-200 dark:border-stone-800 pb-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {outfit.styleCategory} · {outfit.occasion}
              </span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                Est. {outfit.estimatedBudget}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100">
              {outfit.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {outfit.styleExplanation}
            </p>
          </div>

          {/* Color Palette */}
          {outfit.colorPalette && outfit.colorPalette.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Harmonic Palette
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {outfit.colorPalette.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs"
                  >
                    <span
                      style={{ backgroundColor: c.hex }}
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700"
                    />
                    <span className="font-medium text-stone-800 dark:text-stone-200">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Component Pieces Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {outfit.top && (
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Top Layer
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{outfit.top.name}</p>
                <p className="text-[11px] text-stone-500">{outfit.top.color} · {outfit.top.details}</p>
              </div>
            )}

            {outfit.bottom && (
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Bottom
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{outfit.bottom.name}</p>
                <p className="text-[11px] text-stone-500">{outfit.bottom.color} · {outfit.bottom.details}</p>
              </div>
            )}

            {outfit.outerwear && (
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Outerwear / Layer
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{outfit.outerwear.name}</p>
                <p className="text-[11px] text-stone-500">{outfit.outerwear.color} · {outfit.outerwear.details}</p>
              </div>
            )}

            {outfit.shoes && (
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Footwear
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{outfit.shoes.name}</p>
                <p className="text-[11px] text-stone-500">{outfit.shoes.color} · {outfit.shoes.details}</p>
              </div>
            )}
          </div>

          {/* Accessories */}
          {outfit.accessories && outfit.accessories.length > 0 && (
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Accessories & Timepiece
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {outfit.accessories.map((acc: any, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-2.5 py-1 rounded-md text-stone-700 dark:text-stone-300"
                  >
                    {acc.name} ({acc.details})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Styling Tip */}
          {outfit.stylingTip && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200">
              <strong>Stylist's Pro Tip:</strong> {outfit.stylingTip}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveToOutfits}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-90 transition-opacity"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save this Look</span>
            </button>

            <button
              onClick={handleGenerateOutfit}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-medium text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Another</span>
            </button>

            <button
              onClick={() => setCurrentView('calendar')}
              className="flex items-center gap-1.5 px-3 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-xs font-medium"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule in Calendar</span>
            </button>

            <button
              onClick={() => setCurrentView('shopping')}
              className="flex items-center gap-1.5 px-3 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-xs font-medium"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Search Store Items</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
