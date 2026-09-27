import React, { useState } from 'react';
import {
  User,
  Heart,
  Palette,
  Shirt,
  Layers,
  Sparkles,
  Calendar,
  Crown,
  Check,
  Download,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STYLE_CATEGORIES } from '../data/demoData';
import { StyleCategory } from '../types/database';

export const StyleProfileView: React.FC = () => {
  const {
    user,
    styleProfile,
    updateStyleProfile,
    wardrobe,
    outfits,
    calendar,
    setCurrentView,
    setProModalOpen,
    showToast,
  } = useApp();

  const [archetype, setArchetype] = useState(styleProfile.archetypeTitle);
  const [editingArchetype, setEditingArchetype] = useState(false);

  const favoriteOutfits = outfits.filter((o) => o.isFavorite);
  const totalValue = wardrobe.reduce((acc, item) => acc + (item.purchasePrice || 0), 0);
  const mostWornItem = [...wardrobe].sort((a, b) => b.timesWorn - a.timesWorn)[0];

  const handleToggleAesthetic = (cat: StyleCategory) => {
    let current = styleProfile.secondaryAesthetics || [];
    if (current.includes(cat)) {
      current = current.filter((c) => c !== cat);
    } else {
      current = [...current, cat];
    }
    updateStyleProfile({ secondaryAesthetics: current });
  };

  const handleSaveArchetype = () => {
    updateStyleProfile({ archetypeTitle: archetype });
    setEditingArchetype(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Header */}
      <div className="relative rounded-3xl p-8 bg-stone-900 text-stone-100 border border-stone-800 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'User'}
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-400/80 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                  {user?.name || 'Style Enthusiast'}
                </h1>
                {user?.isPro && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                    <Crown className="w-3 h-3" />
                    <span>PRO</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">{user?.email}</p>

              {/* Archetype Badge */}
              <div className="pt-1 flex items-center gap-2">
                {editingArchetype ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={archetype}
                      onChange={(e) => setArchetype(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-stone-800 border border-stone-700 rounded-md text-stone-100"
                    />
                    <button
                      onClick={handleSaveArchetype}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingArchetype(true)}
                    className="text-xs text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1.5"
                  >
                    <span>Style Archetype: <strong>{styleProfile.archetypeTitle}</strong></span>
                    <span className="text-[10px] text-stone-400">(edit)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setProModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Style Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe Vital Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Wardrobe Size
          </p>
          <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {wardrobe.length}
          </p>
          <p className="text-[11px] text-stone-400">Total cataloged pieces</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Estimated Wardrobe Value
          </p>
          <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-400">Inventory valuation</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Saved Ensembles
          </p>
          <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {outfits.length}
          </p>
          <p className="text-[11px] text-stone-400">{favoriteOutfits.length} marked favorite</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Most Worn Pillar
          </p>
          <p className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 truncate">
            {mostWornItem ? mostWornItem.name.split(' ')[0] : 'None'}
          </p>
          <p className="text-[11px] text-stone-400">{mostWornItem ? `${mostWornItem.timesWorn} outings` : '0 outings'}</p>
        </div>
      </div>

      {/* Aesthetic Preferences Section */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-5">
        <div>
          <h2 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
            Preferred Style Aesthetics
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Toggle aesthetics to weight your AI generation algorithms
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {STYLE_CATEGORIES.map((cat) => {
            const isSelected =
              styleProfile.primaryAesthetic === cat.name ||
              styleProfile.secondaryAesthetics?.includes(cat.name);

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleToggleAesthetic(cat.name)}
                className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-between text-xs ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                    : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Favorite Outfits Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
            Favorite Saved Ensembles ({favoriteOutfits.length})
          </h2>
          <button
            onClick={() => setCurrentView('builder')}
            className="text-xs font-semibold text-stone-900 dark:text-stone-100 hover:underline"
          >
            Open Outfit Builder
          </button>
        </div>

        {favoriteOutfits.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 text-xs text-stone-500">
            No favorite outfits saved yet. Build or generate looks and click the bookmark icon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {favoriteOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {outfit.occasion}
                    </span>
                    <span>{outfit.styleCategory}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                    {outfit.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {outfit.description}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {outfit.colorPalette.map((c, i) => (
                      <span
                        key={i}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700"
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setCurrentView('calendar')}
                    className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('builder')}
                    className="font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    View in Atelier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
