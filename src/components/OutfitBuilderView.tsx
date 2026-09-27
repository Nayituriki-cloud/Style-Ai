import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  BookmarkPlus,
  Calendar,
  Check,
  RotateCcw,
  Palette,
  ShoppingBag,
  ArrowRight,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WardrobeItem, WardrobeCategory, OccasionType, StyleCategory } from '../types/database';
import { OCCASIONS, STYLE_CATEGORIES } from '../data/demoData';

interface SlotDefinition {
  id: string;
  name: string;
  allowedCategories: WardrobeCategory[];
  icon: string;
}

const BUILDER_SLOTS: SlotDefinition[] = [
  { id: 'outerwear', name: 'Outerwear / Jacket', allowedCategories: ['Jackets', 'Traditional'], icon: '🧥' },
  { id: 'top', name: 'Top Layer', allowedCategories: ['Shirts', 'T-shirts', 'Dresses', 'Traditional'], icon: '👔' },
  { id: 'bottom', name: 'Bottom', allowedCategories: ['Trousers', 'Jeans', 'Skirts'], icon: '👖' },
  { id: 'shoes', name: 'Footwear', allowedCategories: ['Shoes'], icon: '👞' },
  { id: 'bag', name: 'Bag', allowedCategories: ['Bags'], icon: '👜' },
  { id: 'accessories', name: 'Watch & Accents', allowedCategories: ['Watches', 'Accessories'], icon: '⌚' },
];

export const OutfitBuilderView: React.FC = () => {
  const { wardrobe, addOutfit, setCurrentView, showToast } = useApp();

  const [selectedItems, setSelectedItems] = useState<{ [slotId: string]: WardrobeItem | null }>({
    outerwear: wardrobe.find((w) => w.category === 'Jackets') || null,
    top: wardrobe.find((w) => w.category === 'Shirts') || null,
    bottom: wardrobe.find((w) => w.category === 'Trousers') || null,
    shoes: wardrobe.find((w) => w.category === 'Shoes') || null,
    bag: wardrobe.find((w) => w.category === 'Bags') || null,
    accessories: wardrobe.find((w) => w.category === 'Watches') || null,
  });

  const [title, setTitle] = useState('Bespoke Architectural Ensemble');
  const [occasion, setOccasion] = useState<OccasionType>('Work');
  const [aesthetic, setAesthetic] = useState<StyleCategory>('Smart Casual');
  const [notes, setNotes] = useState('Layered for transitional weather with focus on clean vertical lines.');

  // Modal to select wardrobe item for a slot
  const [activeSlotModal, setActiveSlotModal] = useState<SlotDefinition | null>(null);

  const handleSelectItemForSlot = (slotId: string, item: WardrobeItem) => {
    setSelectedItems((prev) => ({ ...prev, [slotId]: item }));
    setActiveSlotModal(null);
  };

  const handleClearSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems((prev) => ({ ...prev, [slotId]: null }));
  };

  const handleClearAll = () => {
    setSelectedItems({
      outerwear: null,
      top: null,
      bottom: null,
      shoes: null,
      bag: null,
      accessories: null,
    });
  };

  const handleRandomize = () => {
    const getRandom = (cats: WardrobeCategory[]) => {
      const candidates = wardrobe.filter((w) => cats.includes(w.category));
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    setSelectedItems({
      outerwear: getRandom(['Jackets', 'Traditional']),
      top: getRandom(['Shirts', 'T-shirts']),
      bottom: getRandom(['Trousers', 'Jeans']),
      shoes: getRandom(['Shoes']),
      bag: getRandom(['Bags']),
      accessories: getRandom(['Watches', 'Accessories']),
    });
    showToast('Created random outfit combination from your wardrobe');
  };

  // Compile colors for live harmony checking
  const activeItems = Object.values(selectedItems).filter(Boolean) as WardrobeItem[];
  const colorPalette = activeItems.map((item) => ({
    name: item.colorName,
    hex: item.colorHex,
  }));

  // Harmony score calculation heuristic
  const calculateHarmony = () => {
    if (activeItems.length < 2) return { score: 70, feedback: 'Add more pieces to evaluate color dialogue.' };
    const hasWarm = activeItems.some((i) => ['#8B4513', '#C19A6B', '#C59B27', '#C85A32'].includes(i.colorHex));
    const hasCool = activeItems.some((i) => ['#1B263B', '#102A43', '#0D5C3A'].includes(i.colorHex));
    const hasNeutral = activeItems.some((i) => ['#D8CEBE', '#FFFFFF', '#F0ECE1', '#F8F9FA'].includes(i.colorHex));

    if (hasWarm && hasCool && hasNeutral) {
      return { score: 96, feedback: 'Exceptional high-contrast dialogue between cool base and warm leathers/accents.' };
    }
    if (hasNeutral && (hasWarm || hasCool)) {
      return { score: 92, feedback: 'Sophisticated tonal balance with calming neutral grounding.' };
    }
    return { score: 88, feedback: 'Balanced aesthetic with versatile styling potential.' };
  };

  const harmony = calculateHarmony();

  const handleSaveOutfit = () => {
    if (activeItems.length === 0) {
      showToast('Please add at least one garment to save the outfit', 'error');
      return;
    }

    addOutfit({
      title: title || 'Custom Wardrobe Look',
      description: `Composed of ${activeItems.map((i) => i.name).join(', ')}.`,
      occasion: occasion,
      styleCategory: aesthetic,
      colorPalette: colorPalette,
      isFavorite: true,
      budgetTier: 'Medium',
      stylingNotes: notes,
      aiGenerated: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
            <span>Styling Canvas</span>
            <span aria-hidden="true">·</span>
            <span>Digital Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
            Virtual Outfit Builder
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Mix and match garments directly from your wardrobe. Check color harmonies, layering proportions, and save complete ensembles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Shuffle Look</span>
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Canvas</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Garment Slots Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BUILDER_SLOTS.map((slot) => {
              const item = selectedItems[slot.id];
              return (
                <div
                  key={slot.id}
                  onClick={() => setActiveSlotModal(slot)}
                  className={`group cursor-pointer relative rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                    item
                      ? 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xs'
                      : 'border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 hover:border-stone-400 dark:hover:border-stone-600'
                  }`}
                >
                  {/* Slot Label Header */}
                  <div className="p-3 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <span>{slot.icon}</span>
                      <span>{slot.name}</span>
                    </span>
                    {item && (
                      <button
                        onClick={(e) => handleClearSlot(slot.id, e)}
                        title="Remove piece"
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Slot Visual Content */}
                  <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-950 overflow-hidden flex items-center justify-center">
                    {item ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          style={{ backgroundColor: item.colorHex }}
                          title={item.colorName}
                          className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full border border-white/80 shadow-xs"
                        />
                      </>
                    ) : (
                      <div className="text-center p-4 space-y-1 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                        <Plus className="w-6 h-6 mx-auto stroke-1" />
                        <p className="text-[11px] font-medium">Select {slot.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Slot Info Footer */}
                  <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 text-xs">
                    {item ? (
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{item.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{item.brand || item.colorName}</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic">Empty Slot</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Color Harmony & Metadata Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
            {/* Live Harmony Gauge */}
            <div className="space-y-3 pb-5 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-stone-500">
                  Color Coordination
                </span>
                <span className="font-serif font-bold text-amber-700 dark:text-amber-400 text-base tabular-nums">
                  {harmony.score}% Harmony
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${harmony.score}%` }}
                  className="bg-amber-600 h-full rounded-full transition-all duration-500"
                />
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {harmony.feedback}
              </p>

              {/* Active Color Swatches */}
              {colorPalette.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {colorPalette.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px]"
                    >
                      <span
                        style={{ backgroundColor: c.hex }}
                        className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                      />
                      <span className="text-stone-700 dark:text-stone-300 truncate max-w-[80px]">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outfit Details Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Outfit Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as OccasionType)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  >
                    {OCCASIONS.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Aesthetic
                  </label>
                  <select
                    value={aesthetic}
                    onChange={(e) => setAesthetic(e.target.value as StyleCategory)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  >
                    {STYLE_CATEGORIES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Styling Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSaveOutfit}
                className="w-full py-3 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save Complete Outfit</span>
              </button>

              <button
                onClick={() => setCurrentView('calendar')}
                className="w-full py-2.5 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-medium text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule on Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Select Item From Wardrobe Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                  Choose {activeSlotModal.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Select from pieces cataloged in your wardrobe
                </p>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {(() => {
                const matching = wardrobe.filter((w) =>
                  activeSlotModal.allowedCategories.includes(w.category)
                );

                if (matching.length === 0) {
                  return (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-xs text-stone-500">
                        No {activeSlotModal.name} items found in your wardrobe yet.
                      </p>
                      <button
                        onClick={() => {
                          setActiveSlotModal(null);
                          setCurrentView('wardrobe');
                        }}
                        className="px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-lg text-xs font-medium"
                      >
                        Add piece to Wardrobe
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {matching.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItemForSlot(activeSlotModal.id, item)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all bg-white dark:bg-stone-950 p-2 space-y-2"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div
                            style={{ backgroundColor: item.colorHex }}
                            className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">{item.colorName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
