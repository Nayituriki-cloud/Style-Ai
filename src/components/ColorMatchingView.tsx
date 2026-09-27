import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  ArrowRight,
  Layers,
  Check,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRESET_GARMENTS = [
  { name: 'Navy Trousers', color: 'Navy Blue', hex: '#1B263B', defaultOccasion: 'Business Casual' },
  { name: 'Camel Wool Coat', color: 'Camel Tan', hex: '#C19A6B', defaultOccasion: 'Autumn / Winter Work' },
  { name: 'Emerald Silk Dress', color: 'Emerald Forest', hex: '#0D5C3A', defaultOccasion: 'Cocktail / Wedding' },
  { name: 'Black Raw Denim', color: 'Washed Charcoal Black', hex: '#222222', defaultOccasion: 'Casual Weekend' },
  { name: 'African Gold Ankara Blazer', color: 'African Gold', hex: '#C59B27', defaultOccasion: 'Cultural Gala' },
  { name: 'Terracotta Waffle Knit', color: 'Terracotta Rust', hex: '#C85A32', defaultOccasion: 'Smart Casual' },
];

export const ColorMatchingView: React.FC = () => {
  const { setCurrentView } = useApp();

  const [selectedPreset, setSelectedPreset] = useState(PRESET_GARMENTS[0]);
  const [customItem, setCustomItem] = useState(PRESET_GARMENTS[0].name);
  const [customColor, setCustomColor] = useState(PRESET_GARMENTS[0].color);
  const [customHex, setCustomHex] = useState(PRESET_GARMENTS[0].hex);
  const [occasion, setOccasion] = useState(PRESET_GARMENTS[0].defaultOccasion);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelectPreset = (preset: (typeof PRESET_GARMENTS)[0]) => {
    setSelectedPreset(preset);
    setCustomItem(preset.name);
    setCustomColor(preset.color);
    setCustomHex(preset.hex);
    setOccasion(preset.defaultOccasion);
  };

  const handleRunColorEngine = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/color-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseItem: customItem,
          baseColor: customColor,
          occasion: occasion,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount with default
  React.useEffect(() => {
    handleRunColorEngine();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
          <span>Chromatic Harmony</span>
          <span aria-hidden="true">·</span>
          <span>Color Theory</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
          AI Color Matching Engine
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-2xl leading-relaxed">
          Ground your outfit in any garment or hue. STYLE AI calculates contrast temperatures, complementary accents, and harmonious footwear and accessory mappings.
        </p>
      </div>

      {/* Preset Garments Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
          Select Anchor Garment:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {PRESET_GARMENTS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all space-y-2 ${
                customHex === preset.hex
                  ? 'border-stone-900 dark:border-stone-100 bg-white dark:bg-stone-900 shadow-xs ring-1 ring-stone-900 dark:ring-stone-100'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div
                style={{ backgroundColor: preset.hex }}
                className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700 shadow-2xs"
              />
              <div>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                  {preset.name}
                </p>
                <p className="text-[10px] text-stone-500 truncate">{preset.color}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Inputs and Trigger */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Garment Name
          </label>
          <input
            type="text"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Color Hue & Hex
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border border-stone-300 dark:border-stone-700 bg-transparent p-0"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <button
          onClick={handleRunColorEngine}
          disabled={loading}
          className="py-2.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Palette className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span>Calculate Schemes</span>
        </button>
      </div>

      {/* Schemes Results Grid */}
      {result && result.schemes && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              Coordinated Palettes for "{result.baseItem}"
            </h2>
            <span className="text-xs text-stone-500">4 distinct color dialogues</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.schemes.map((scheme: any, idx: number) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Scheme Header */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Scheme 0{idx + 1}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {scheme.concept}
                    </p>
                  </div>

                  {/* Visual Color Swatches */}
                  <div className="flex items-center gap-2 py-1">
                    {scheme.palette?.map((swatch: any, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="flex flex-col items-center gap-1 flex-1"
                      >
                        <div
                          style={{ backgroundColor: swatch.hex }}
                          title={`${swatch.name} (${swatch.hex})`}
                          className="w-full h-8 rounded-md border border-stone-300 dark:border-stone-700 shadow-2xs"
                        />
                        <span className="text-[10px] text-stone-600 dark:text-stone-400 text-center truncate w-full">
                          {swatch.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Garment Pairings List */}
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Top Garment:</span>
                      <span className="font-medium text-stone-900 dark:text-stone-100 text-right">{scheme.top}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Outerwear:</span>
                      <span className="font-medium text-stone-900 dark:text-stone-100 text-right">{scheme.outerwear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Footwear:</span>
                      <span className="font-medium text-stone-900 dark:text-stone-100 text-right">{scheme.shoes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Accessories:</span>
                      <span className="font-medium text-stone-900 dark:text-stone-100 text-right">{scheme.accessories}</span>
                    </div>
                  </div>

                  {/* Theory Rationale */}
                  <p className="text-[11px] text-stone-500 italic leading-relaxed">
                    <strong>Color Theory:</strong> {scheme.rationale}
                  </p>
                </div>

                {/* Open in Builder Button */}
                <button
                  onClick={() => setCurrentView('builder')}
                  className="w-full py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Build This Look in Atelier</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
