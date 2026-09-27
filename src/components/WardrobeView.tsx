import React, { useState } from 'react';
import {
  Shirt,
  Plus,
  Search,
  Filter,
  Heart,
  Trash2,
  Edit2,
  DollarSign,
  Layers,
  Sparkles,
  Camera,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WardrobeCategory, WardrobeItem, BudgetLevel } from '../types/database';

const CATEGORIES: WardrobeCategory[] = [
  'Jackets',
  'Shirts',
  'T-shirts',
  'Trousers',
  'Jeans',
  'Dresses',
  'Shoes',
  'Bags',
  'Watches',
  'Accessories',
  'Traditional',
];

export const WardrobeView: React.FC = () => {
  const {
    wardrobe,
    addWardrobeItem,
    updateWardrobeItem,
    deleteWardrobeItem,
    toggleFavoriteItem,
    budgetFilter,
    setBudgetFilter,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeColor, setActiveColor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<WardrobeCategory>('Jackets');
  const [formColorName, setFormColorName] = useState('Navy Blue');
  const [formColorHex, setFormColorHex] = useState('#1B263B');
  const [formBrand, setFormBrand] = useState('');
  const [formSize, setFormSize] = useState('M');
  const [formMaterial, setFormMaterial] = useState('');
  const [formBudgetTier, setFormBudgetTier] = useState<BudgetLevel>('Medium');
  const [formPrice, setFormPrice] = useState<number | ''>(120);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Extract unique colors from current wardrobe for color filter
  const uniqueColors = Array.from(
    new Set(wardrobe.map((item) => JSON.stringify({ name: item.colorName, hex: item.colorHex })))
  ).map((str) => JSON.parse(str));

  // Filter items
  const filteredItems = wardrobe.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (activeColor !== 'All' && item.colorHex !== activeColor) return false;
    if (budgetFilter !== 'All' && item.budgetTier !== budgetFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q);
      const matchColor = item.colorName.toLowerCase().includes(q);
      const matchMaterial = item.material?.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchColor && !matchMaterial) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Shirts');
    setFormColorName('Optic White');
    setFormColorHex('#FFFFFF');
    setFormBrand('');
    setFormSize('M');
    setFormMaterial('100% Cotton');
    setFormBudgetTier('Medium');
    setFormPrice(80);
    setFormImageUrl('https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?auto=format&fit=crop&w=800&q=80');
    setFormNotes('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: WardrobeItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormColorName(item.colorName);
    setFormColorHex(item.colorHex);
    setFormBrand(item.brand || '');
    setFormSize(item.size || 'M');
    setFormMaterial(item.material || '');
    setFormBudgetTier(item.budgetTier || 'Medium');
    setFormPrice(item.purchasePrice || '');
    setFormImageUrl(item.imageUrl);
    setFormNotes(item.notes || '');
    setModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Item name is required', 'error');
      return;
    }

    if (editingItem) {
      updateWardrobeItem(editingItem.id, {
        name: formName,
        category: formCategory,
        colorName: formColorName,
        colorHex: formColorHex,
        brand: formBrand || undefined,
        size: formSize || undefined,
        material: formMaterial || undefined,
        budgetTier: formBudgetTier,
        purchasePrice: typeof formPrice === 'number' ? formPrice : undefined,
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        notes: formNotes || undefined,
      });
    } else {
      addWardrobeItem({
        name: formName,
        category: formCategory,
        colorName: formColorName,
        colorHex: formColorHex,
        brand: formBrand || undefined,
        size: formSize || undefined,
        material: formMaterial || undefined,
        budgetTier: formBudgetTier,
        purchasePrice: typeof formPrice === 'number' ? formPrice : undefined,
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        notes: formNotes || undefined,
        isFavorite: false,
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
            <span>Inventory</span>
            <span aria-hidden="true">·</span>
            <span>Digital Closet</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
            My Wardrobe
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            {wardrobe.length} cataloged pieces. Filter by silhouette, color, or budget tier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Budget Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs">
            <span className="text-[11px] font-semibold text-stone-500 px-2 uppercase tracking-wider">
              Budget Mode:
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

          {/* Add Item Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-95 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by garment name, brand, fabric or color..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Color Filter Swatches */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              <button
                onClick={() => setActiveColor('All')}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  activeColor === 'All'
                    ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                All Colors
              </button>
              {uniqueColors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveColor(activeColor === c.hex ? 'All' : c.hex)}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    activeColor === c.hex
                      ? 'scale-110 ring-2 ring-stone-900 dark:ring-stone-100'
                      : 'border-stone-300 dark:border-stone-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category Pills/Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              activeCategory === 'All'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            All Pieces ({wardrobe.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = wardrobe.filter((w) => w.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat} {count > 0 && <span className="opacity-60 tabular-nums">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wardrobe Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
          <Shirt className="w-10 h-10 mx-auto text-stone-400 stroke-1" />
          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            No Garments Match Filter
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query, color swatch, or budget mode filter, or add a new piece.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-medium rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Garment</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200/90 dark:border-stone-800/90 hover:border-stone-400 dark:hover:border-stone-600 transition-all flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] bg-stone-100 dark:bg-stone-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Heart / Favorite */}
                <button
                  onClick={() => toggleFavoriteItem(item.id)}
                  title={item.isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs text-stone-700 dark:text-stone-200 hover:text-rose-600 transition-colors shadow-xs"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>

                {/* Color Swatch Dot */}
                <div
                  title={item.colorName}
                  style={{ backgroundColor: item.colorHex }}
                  className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full border border-white/80 shadow-xs"
                />

                {/* Budget Tier Tag */}
                {item.budgetTier && (
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-stone-900/70 text-stone-100 backdrop-blur-xs">
                    {item.budgetTier}
                  </span>
                )}
              </div>

              {/* Item Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <span>{item.category}</span>
                    {item.brand && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.brand}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                    <span>{item.colorName}</span>
                    {item.material && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.material}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('builder')}
                    className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Build Outfit</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      title="Edit Item"
                      className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteWardrobeItem(item.id)}
                      title="Delete Item"
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Garment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                {editingItem ? 'Edit Wardrobe Garment' : 'Add Garment to Wardrobe'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Garment Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Single-Pleat Wide Leg Trousers"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as WardrobeCategory)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Brand / Label
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. COS, Arket, Zara"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Color Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formColorName}
                    onChange={(e) => setFormColorName(e.target.value)}
                    placeholder="e.g. Midnight Navy"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Color Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formColorHex}
                      onChange={(e) => setFormColorHex(e.target.value)}
                      className="w-8 h-8 rounded-md cursor-pointer border border-stone-300 dark:border-stone-700 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={formColorHex}
                      onChange={(e) => setFormColorHex(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Budget Tier
                  </label>
                  <select
                    value={formBudgetTier}
                    onChange={(e) => setFormBudgetTier(e.target.value as BudgetLevel)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  >
                    <option value="Low">Low Budget</option>
                    <option value="Medium">Medium Budget</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="120"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Styling Notes / Tailoring Details
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Soft shoulder construction, hem breaks over loafers"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-95 transition-opacity"
                >
                  {editingItem ? 'Save Changes' : 'Add to Wardrobe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
