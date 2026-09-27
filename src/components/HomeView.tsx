import React from 'react';
import {
  Wand2,
  Camera,
  Shirt,
  Palette,
  Calendar,
  Sparkles,
  ArrowRight,
  Compass,
  Check,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STYLE_CATEGORIES } from '../data/demoData';

export const HomeView: React.FC = () => {
  const { setCurrentView, wardrobe, outfits, user, setProModalOpen } = useApp();

  const featuredOutfit = outfits[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500">
                <span>Personal AI Stylist</span>
                <span aria-hidden="true">·</span>
                <span>Haute Intelligence</span>
                <span aria-hidden="true">·</span>
                <span>Digital Wardrobe</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 dark:text-stone-50 leading-[1.08] text-balance">
                The art of intentional dressing, elevated by AI.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-xl font-normal leading-relaxed">
                STYLE AI acts as your private couture consultant. Effortlessly coordinate colors, curate complete outfits for every occasion, analyze garment photos, and unlock the latent elegance of your existing wardrobe.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setCurrentView('advisor')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-sm rounded-lg hover:opacity-95 transition-opacity shadow-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Start AI Style Consultation</span>
                </button>

                <button
                  onClick={() => setCurrentView('analysis')}
                  className="flex items-center gap-2 px-5 py-3.5 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-medium text-sm rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Camera className="w-4 h-4 text-stone-500" />
                  <span>Analyze Outfit Photo</span>
                </button>

                <button
                  onClick={() => setCurrentView('generator')}
                  className="flex items-center gap-2 px-4 py-3.5 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium text-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Quick Generate</span>
                </button>
              </div>

              {/* Quiet Micro Stats */}
              <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 dark:text-stone-400">
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-200 tabular-nums">
                    {wardrobe.length}
                  </span>{' '}
                  Wardrobe Pieces
                </div>
                <div aria-hidden="true" className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></div>
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-200 tabular-nums">
                    {outfits.length}
                  </span>{' '}
                  Saved Ensembles
                </div>
                <div aria-hidden="true" className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></div>
                <div>
                  <span>12 Fashion Aesthetics</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Lookbook Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 aspect-[4/5] bg-stone-100 dark:bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
                  alt="Editorial styling lookbook"
                  className="w-full h-full object-cover"
                />

                {/* Overlay Card for Today's Curated Look */}
                <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-stone-950/85 backdrop-blur-md text-stone-100 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 tracking-wider uppercase font-medium">
                    <span>Curated Look of the Day</span>
                    <span>{featuredOutfit ? featuredOutfit.occasion : 'Smart Casual'}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-white truncate">
                    {featuredOutfit ? featuredOutfit.title : 'The Architectural Neutral'}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {featuredOutfit
                      ? featuredOutfit.description
                      : 'Understated wool blazer layered over crisp poplin, with relaxed pleated trousers and burnished leather accents.'}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {featuredOutfit?.colorPalette.map((c, i) => (
                        <span
                          key={i}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentView('builder')}
                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                    >
                      <span>Open in Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Studio Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
              Capabilities
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100">
              The Comprehensive Fashion Suite
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-md">
            Seamlessly navigate from digital wardrobe cataloging to computer-vision outfit analysis and tailored occasion dressing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Stylist */}
          <div
            onClick={() => setCurrentView('advisor')}
            className="group cursor-pointer p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Personal Style Consultation
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Adaptive questionnaire analyzing climate, budget tier, age range, preferred aesthetics, and occasion codes into complete looks.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
              <span>Begin Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Photo Analysis */}
          <div
            onClick={() => setCurrentView('analysis')}
            className="group cursor-pointer p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Photo-Based Outfit Analysis
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Upload photos of your clothes. Gemini inspects silhouettes, patterns, tailoring, color proportions, and opportunities with high safety standards.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
              <span>Scan Garment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Digital Wardrobe */}
          <div
            onClick={() => setCurrentView('wardrobe')}
            className="group cursor-pointer p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Digital Wardrobe Manager
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Photograph and catalog shirts, trousers, outerwear, footwear, and cultural pieces. Filter by color, category, wear frequency, and budget tier.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
              <span>Explore Wardrobe ({wardrobe.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Color Matching Engine */}
          <div
            onClick={() => setCurrentView('colors')}
            className="group cursor-pointer p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Color Matching Engine
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Color-theory coordination for navy trousers, camel coats, or ankara prints. Explore monochromatic, complementary, and tonal palettes.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
              <span>Harmonize Colors</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Virtual Outfit Builder */}
          <div
            onClick={() => setCurrentView('builder')}
            className="group cursor-pointer p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Virtual Outfit Builder
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Assemble tops, bottoms, shoes, bags, and timepieces onto an interactive styling canvas with live harmony scores.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
              <span>Open Studio Canvas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Weekly Outfit Calendar */}
          <div
            onClick={() => setCurrentView('calendar')}
            className="group cursor-pointer p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Weekly Outfit Calendar
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Schedule your looks Monday to Sunday. Avoid repetition, prepare for high-stakes meetings, and mark worn outfits.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
              <span>Plan the Week</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Style Aesthetics Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-stone-500">
                Aesthetic Spectrum
              </p>
              <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
                Explore 12 Curated Aesthetics
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('generator')}
              className="self-start md:self-auto text-xs font-semibold text-stone-900 dark:text-stone-100 hover:underline flex items-center gap-1"
            >
              <span>Generate looks across all styles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {STYLE_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setCurrentView('generator')}
                className="cursor-pointer p-3.5 rounded-lg bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors text-center space-y-1"
              >
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{cat.name}</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 text-stone-100 border border-stone-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Crown className="w-4 h-4" />
              <span>STYLE AI PRO</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-white">
              Upgrade to the full private styling suite
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Unlock unlimited AI outfit generation, seasonal wardrobe audits, bespoke color analysis reports, and priority AI stylist chat.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-stone-400">Starting from</p>
              <p className="font-serif text-2xl font-bold text-amber-300">$9.99<span className="text-xs font-normal text-stone-400">/mo</span></p>
            </div>
            <button
              onClick={() => setProModalOpen(true)}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wide uppercase rounded-lg transition-colors shadow-md"
            >
              {user?.isPro ? 'Manage Membership' : 'Explore Pro Privileges'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
