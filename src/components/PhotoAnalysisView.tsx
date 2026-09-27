import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Palette,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const SAMPLE_PHOTOS = [
  {
    title: 'Tailored Navy Blazer',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    type: 'Jackets',
  },
  {
    title: 'Ankara Wax Kimono',
    url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
    type: 'Traditional',
  },
  {
    title: 'Minimalist Relaxed Look',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    type: 'T-shirts',
  },
  {
    title: 'Raw Selvedge Denim',
    url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    type: 'Jeans',
  },
];

export const PhotoAnalysisView: React.FC = () => {
  const { addWardrobeItem, showToast, setCurrentView } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_PHOTOS[0].url);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert image URL to base64 for sample photos
  const convertUrlToBase64 = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setImagePreview(b64);
      setImageBase64(b64);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: (typeof SAMPLE_PHOTOS)[0]) => {
    setImagePreview(sample.url);
    setImageBase64(null);
    setAnalysis(null);
  };

  const handleAnalyzePhoto = async () => {
    if (!imagePreview) {
      showToast('Please upload or select an outfit photo first', 'info');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let b64ToSend = imageBase64;
      if (!b64ToSend && imagePreview) {
        b64ToSend = await convertUrlToBase64(imagePreview);
      }

      if (!b64ToSend) {
        // Fallback placeholder data if CORS restricts direct client fetch
        b64ToSend = 'data:image/jpeg;base64,sample';
      }

      const response = await fetch('/api/gemini/analyze-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: b64ToSend,
          question: customQuestion.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error('Analysis payload missing');
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not complete photo analysis. Please try another photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetectedToWardrobe = () => {
    if (!analysis || !analysis.detectedItems || analysis.detectedItems.length === 0) return;
    const first = analysis.detectedItems[0];
    const firstColor = analysis.colors?.[0] || { name: 'Neutral', hex: '#333333' };

    addWardrobeItem({
      name: first.name || 'Analyzed Garment',
      category: (first.category as any) || 'Tops',
      colorName: firstColor.name,
      colorHex: firstColor.hex,
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      material: first.material,
      isFavorite: true,
      budgetTier: 'Medium',
      notes: `Analyzed with STYLE AI: ${analysis.fitAppraisal || ''}`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
          <span>Computer Vision</span>
          <span aria-hidden="true">·</span>
          <span>Drape & Silhouette Audit</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
          Photo-Based Outfit Analysis
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-2xl leading-relaxed">
          Upload any photograph of a clothing piece or full ensemble. STYLE AI scans the garment silhouette, color harmony, fabric textures, and suggests elevated pairings—strictly without personal or appearance judgments.
        </p>

        {/* AI Safety Guarantee Note */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>AI Safety Standard:</strong> Ethical, respectful advice focusing solely on garment tailoring and styling. No body shaming or sensitive inferences.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
            {/* Image Preview Box */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Outfit scan preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2 text-stone-400">
                  <Camera className="w-10 h-10 mx-auto stroke-1" />
                  <p className="text-xs">No image selected</p>
                </div>
              )}

              {/* Upload Overlay Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/80 hover:bg-stone-900 text-stone-50 backdrop-blur-md rounded-lg text-xs font-medium transition-colors shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Sample Images Quick Pick */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Or Test with Demo Garments:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_PHOTOS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                      imagePreview === s.url
                        ? 'border-stone-900 dark:border-stone-100 ring-1 ring-stone-900 dark:ring-stone-100'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Specific Question */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Ask Specific Question (Optional)
              </label>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. What shoes match this? Is this good for an interview?"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={handleAnalyzePhoto}
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs tracking-wider uppercase rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Scanning Silhouette & Fabric...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Analyze Outfit with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="lg:col-span-7 space-y-6">
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
                Evaluating Garment Silhouette
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Extracting color tones, inspecting tailoring structure, weave textures, and identifying pairing opportunities...
              </p>
            </div>
          )}

          {!loading && !analysis && (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
              <Camera className="w-9 h-9 mx-auto text-stone-400 stroke-1" />
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Ready for Garment Inspection
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Click <strong>"Analyze Outfit with AI"</strong> to unlock detailed color extraction, tailoring appraisal, and smart wardrobe pairing opportunities.
              </p>
            </div>
          )}

          {!loading && analysis && (
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-in fade-in">
              {/* Archetype & Versatility Header */}
              <div className="border-b border-stone-200 dark:border-stone-800 pb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {analysis.aestheticArchetype || 'Smart Contemporary'}
                  </span>
                  <span className="text-stone-500">
                    Versatility: <strong className="text-stone-900 dark:text-stone-100">{analysis.versatilityScore || 90}%</strong>
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
                  Fashion Silhouette Appraisal
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {analysis.fitAppraisal}
                </p>
              </div>

              {/* Detected Items */}
              {analysis.detectedItems && analysis.detectedItems.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Identified Garments
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {analysis.detectedItems.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1"
                      >
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{item.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.fit}</span>
                          {item.material && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{item.material}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Proportions */}
              {analysis.colors && analysis.colors.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Detected Palette & Proportions
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {analysis.colors.map((c: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs"
                      >
                        <span
                          style={{ backgroundColor: c.hex }}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700"
                        />
                        <span className="font-medium text-stone-800 dark:text-stone-200">{c.name}</span>
                        {c.proportion && (
                          <span className="text-[10px] text-stone-400">({c.proportion})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Textures and Weave */}
              {analysis.patternsAndTextures && (
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1">
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Fabric & Pattern Notes</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">{analysis.patternsAndTextures}</p>
                </div>
              )}

              {/* Matching Opportunities */}
              {analysis.matchingOpportunities && analysis.matchingOpportunities.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    High-Potential Pairings
                  </p>
                  <div className="space-y-2">
                    {analysis.matchingOpportunities.map((m: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-amber-800 dark:text-amber-400">Pair with: {m.pairedWith}</span>
                          <span className="text-stone-500 font-normal text-[11px]">{m.idealOccasion}</span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400">{m.whyItWorks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constructive Styling Suggestions */}
              {analysis.constructiveTips && analysis.constructiveTips.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Constructive Fashion Suggestions
                  </p>
                  <ul className="space-y-2">
                    {analysis.constructiveTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddDetectedToWardrobe}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add this Piece to My Wardrobe</span>
                </button>

                <button
                  onClick={() => setCurrentView('colors')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-medium text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Run Color Engine</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
