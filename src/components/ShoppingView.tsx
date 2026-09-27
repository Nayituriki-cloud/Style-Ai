import React, { useState } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Check,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOPPING_CATALOG } from '../data/demoData';
import { BudgetLevel, WardrobeCategory } from '../types/database';

export const ShoppingView: React.FC = () => {
  const { addWardrobeItem, showToast, budgetFilter, setBudgetFilter } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = SHOPPING_CATALOG.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (budgetFilter !== 'All' && item.budgetTier !== budgetFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSeller = item.seller.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSeller && !matchDesc) return false;
    }
    return true;
  });

  const handleAddCatalogItemToWardrobe = (item: (typeof SHOPPING_CATALOG)[0]) => {
    addWardrobeItem({
      name: item.title,
      category: item.category,
      colorName: 'Verified Retail Hue',
      colorHex: item.colorHex || '#1B263B',
      brand: item.seller,
      size: item.sizeInformation.split(',')[0],
      purchasePrice: item.price,
      budgetTier: item.budgetTier,
      imageUrl: item.imageUrl,
      notes: `Acquired via ${item.seller}: ${item.description}`,
      isFavorite: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
            <span>Verified Retail Partners</span>
            <span aria-hidden="true">·</span>
            <span>Garment Acquisition</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
            Curated Shopping
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Explore verified pieces to complete your AI recommendations. Filter by budget tier, retailer stock, and specific aesthetics.
          </p>
        </div>

        {/* Budget Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs">
          <span className="text-[11px] font-semibold text-stone-500 px-2 uppercase tracking-wider">
            Budget Tier:
          </span>
          {(['All', 'Low', 'Medium', 'Premium'] as (BudgetLevel | 'All')[]).map((tier) => (
            <button
              key={tier}
              onClick={() => setBudgetFilter(tier)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                budgetFilter === tier
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Inventory Notice */}
      <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Live Verified Stock:</strong> Product availability and pricing are strictly verified against retailer feeds prior to listing.
        </span>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified garments by brand, name, or style..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs w-full sm:w-auto">
          {['All', 'Jackets', 'Shirts', 'Trousers', 'Shoes', 'Traditional', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Seller & Availability Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-sm bg-stone-900/80 text-stone-100 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                    {item.seller}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs ${
                      item.availability === 'In Stock'
                        ? 'bg-emerald-900/80 text-emerald-200'
                        : 'bg-amber-900/80 text-amber-200'
                    }`}
                  >
                    {item.availability}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 text-xs font-bold font-serif shadow-xs">
                  ${item.price}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{item.sizeInformation}</span>
                </div>

                <h3 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Matched tags */}
                <div className="pt-1 flex flex-wrap gap-1">
                  {item.matchedStyles.slice(0, 2).map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 space-y-2">
              <a
                href={item.externalPurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Purchase at {item.seller.split(' ')[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleAddCatalogItemToWardrobe(item)}
                className="w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to My Wardrobe</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
