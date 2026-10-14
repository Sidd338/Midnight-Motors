import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bookmark,
  Compass,
  ArrowRight,
  Flame,
  Shield,
  Gauge,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Car,
  Bike
} from 'lucide-react';
import { ARTICLES_DATA } from './data/articles';
import { BlogArticle, ArticleCategory } from './types/blog';
import { Navbar } from './components/Navbar';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { SearchModal } from './components/SearchModal';
import { DreamGarageModal } from './components/DreamGarageModal';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { Footer } from './components/Footer';
import { updateSEO } from './utils/seo';

export default function App() {
  // Navigation State
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'All'>('All');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'cars' | 'bikes'>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'readTime'>('trending');
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Saved Slugs (LocalStorage)
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('midnight_motors_saved_slugs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('midnight_motors_saved_slugs', JSON.stringify(savedSlugs));
    } catch (e) {
      console.warn('LocalStorage access issue:', e);
    }
  }, [savedSlugs]);

  // Handle URL parsing on mount and popstate for clean URL slugs (/blog/:slug)
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').replace(/\/$/, '');
        const found = ARTICLES_DATA.find(a => a.slug === slug);
        if (found) {
          setCurrentSlug(slug);
          return;
        }
      }
      setCurrentSlug(null);
    };

    parseUrl();

    const handlePopState = () => {
      parseUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync homepage SEO when on home
  useEffect(() => {
    if (!currentSlug) {
      updateSEO();
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentSlug]);

  // Navigate to Article with Clean URL Slug
  const handleSelectArticle = (slug: string) => {
    setCurrentSlug(slug);
    const newPath = `/blog/${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ slug }, '', newPath);
    }
  };

  // Navigate to Homepage
  const handleNavigateHome = () => {
    setCurrentSlug(null);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = (slug: string) => {
    setSavedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleCardToggleSave = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    handleToggleSave(slug);
  };

  // Active Article Object if viewing an article
  const currentArticle = useMemo(() => {
    if (!currentSlug) return null;
    return ARTICLES_DATA.find(a => a.slug === currentSlug) || null;
  }, [currentSlug]);

  // Filtered Articles for Homepage
  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter(art => {
      // Category filter
      if (selectedCategory !== 'All' && art.category !== selectedCategory) {
        return false;
      }
      // Vehicle type filter
      if (vehicleFilter === 'cars' && art.vehicleType === 'bikes') {
        return false;
      }
      if (vehicleFilter === 'bikes' && art.vehicleType === 'cars') {
        return false;
      }
      // Search query filter
      if (homeSearchQuery.trim()) {
        const q = homeSearchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesExcerpt = art.excerpt.toLowerCase().includes(q);
        const matchesKeywords = art.seoKeywords.some(k => k.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExcerpt && !matchesKeywords) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') return b.trendingScore - a.trendingScore;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'readTime') return parseInt(b.readTime) - parseInt(a.readTime);
      return 0;
    });
  }, [selectedCategory, vehicleFilter, sortBy, homeSearchQuery]);

  // Featured Article for the Hero Showcase
  const featuredArticle = ARTICLES_DATA.find(a => a.featured) || ARTICLES_DATA[0];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-200 antialiased font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Global Navbar */}
      <Navbar
        onNavigateHome={handleNavigateHome}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          setHomeSearchQuery('');
        }}
        activeCategory={selectedCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenGarageBuilder={() => setIsGarageOpen(true)}
        savedCount={savedSlugs.length}
      />

      {/* Conditional View: Article Page OR Homepage */}
      {currentArticle ? (
        <ArticleView
          article={currentArticle}
          allArticles={ARTICLES_DATA}
          onNavigateHome={handleNavigateHome}
          onSelectArticle={handleSelectArticle}
          isSaved={savedSlugs.includes(currentArticle.slug)}
          onToggleSave={handleToggleSave}
        />
      ) : (
        <main className="pt-20 sm:pt-24 pb-20">
          {/* HERO FLAGSHIP SECTION */}
          <section className="relative overflow-hidden pt-6 pb-16 sm:pb-20 border-b border-blue-900/30">
            {/* Ambient Background Gradient Grids */}
            <div className="absolute inset-0 bg-midnight-grid pointer-events-none opacity-90" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Top Editorial Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 mb-4 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>The Premier Automobile & Motorcycle Journal</span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="text-slate-400">10 Curated Deep Dives</span>
              </div>

              {/* Hero Banner Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <h1 className="font-display text-4xl sm:text-6xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                    Where Speed Meets <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                      Pure Engineering.
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
                    Unfiltered technical insights into the world's most extreme hypercars, legendary 90s analog supercars, rare track superbikes, and blue-chip automotive investments.
                  </p>

                  {/* Hero Quick Search Input */}
                  <div className="pt-2 max-w-xl">
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-blue-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={homeSearchQuery}
                        onChange={e => setHomeSearchQuery(e.target.value)}
                        placeholder="Search hypercars, Ferrari vs Lamborghini, RB26, GT3 RS..."
                        className="w-full bg-[#0a1122]/90 border border-blue-900/50 hover:border-blue-500/70 focus:border-blue-400 rounded-xl py-3 pl-10 pr-24 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors shadow-lg shadow-black/60"
                      />
                      {homeSearchQuery ? (
                        <button
                          onClick={() => setHomeSearchQuery('')}
                          className="absolute right-3 text-xs text-slate-400 hover:text-white px-2 py-1 font-mono-spec"
                        >
                          CLEAR
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsSearchOpen(true)}
                          className="absolute right-2 px-2.5 py-1 text-[11px] bg-blue-950 text-blue-300 border border-blue-800 rounded font-mono-spec hover:bg-blue-900 transition-colors"
                        >
                          ADVANCED
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Telemetry Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-950/80 max-w-lg text-left">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-spec text-blue-400">
                        304.77
                      </div>
                      <div className="text-[11px] font-mono-spec text-slate-400 uppercase">
                        MPH Top Speed Record
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-spec text-white">
                        $70M+
                      </div>
                      <div className="text-[11px] font-mono-spec text-slate-400 uppercase">
                        250 GTO Valuation
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-spec text-sky-400">
                        10/10
                      </div>
                      <div className="text-[11px] font-mono-spec text-slate-400 uppercase">
                        In-Depth Editorials
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Featured Article Card Spotlight */}
                <div className="lg:col-span-5">
                  <div
                    onClick={() => handleSelectArticle(featuredArticle.slug)}
                    className="group cursor-pointer relative bg-gradient-to-b from-[#0b1426] to-[#070b14] border border-blue-600/40 hover:border-blue-400 rounded-2xl overflow-hidden shadow-2xl shadow-blue-950/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={featuredArticle.heroImage}
                        alt={featuredArticle.heroImageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-90" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-mono-spec font-bold uppercase bg-blue-600 text-white rounded shadow-md">
                        FEATURED DEEP DIVE
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400">
                        <span>{featuredArticle.category}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400">{featuredArticle.readTime}</span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {featuredArticle.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>

                      <div className="pt-3 border-t border-blue-950/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={featuredArticle.author.avatar}
                            alt={featuredArticle.author.name}
                            className="w-6 h-6 rounded-full object-cover border border-blue-500/40"
                          />
                          <span className="text-xs text-slate-300 font-medium">
                            {featuredArticle.author.name}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-blue-400 font-mono-spec flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          READ ARTICLE <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DREAM GARAGE INTERACTIVE CALLOUT BANNER */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950/60 via-[#0a1224] to-[#070b14] border border-blue-700/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      Curate Your 5-Car & Superbike Dream Garage
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-spec uppercase bg-blue-600 text-white rounded font-bold">
                      Interactive Tool
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    Inspired by Article 10: select your daily driver, JDM legend, classic Ferrari, track weapon, and halo hypercar. Calculate total horsepower and collection value!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGarageOpen(true)}
                className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-950 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Launch Garage Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* FILTER & CATEGORY NAVIGATION BAR */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-950">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {(
                  [
                    'All',
                    'Hypercars',
                    'Supercars',
                    'Classics & Heritage',
                    'Engineering & Tech',
                    'Track & Performance',
                    'German Performance',
                    'JDM Legends',
                    'Collections & Lifestyle'
                  ] as const
                ).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-950'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {cat === 'All' ? 'All 10 Topics' : cat}
                  </button>
                ))}
              </div>

              {/* Right Controls: Vehicle Type & Sort By */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Vehicle Type Toggle */}
                <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                  <button
                    onClick={() => setVehicleFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      vehicleFilter === 'all'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setVehicleFilter('cars')}
                    className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                      vehicleFilter === 'cars'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Car className="w-3 h-3" /> Cars
                  </button>
                  <button
                    onClick={() => setVehicleFilter('bikes')}
                    className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                      vehicleFilter === 'bikes'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bike className="w-3 h-3" /> Bikes
                  </button>
                </div>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="trending">Sort: Trending</option>
                  <option value="newest">Sort: Chronological</option>
                  <option value="readTime">Sort: Read Time</option>
                </select>
              </div>
            </div>

            {/* Active search filter feedback */}
            {homeSearchQuery && (
              <div className="mt-4 flex items-center justify-between text-xs text-blue-400 font-mono-spec">
                <span>
                  Showing results matching "{homeSearchQuery}" ({filteredArticles.length} of 10)
                </span>
                <button
                  onClick={() => setHomeSearchQuery('')}
                  className="text-slate-400 hover:text-white underline"
                >
                  Reset filter
                </button>
              </div>
            )}
          </section>

          {/* MAIN ARTICLES GRID */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {filteredArticles.length === 0 ? (
              <div className="py-24 text-center text-slate-400 bg-[#080d1a] border border-blue-900/30 rounded-2xl">
                <Gauge className="w-10 h-10 text-blue-500/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No articles matched your criteria</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Try clearing the search query or selecting "All 10 Topics" above.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setVehicleFilter('all');
                    setHomeSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-blue-500 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Highlight First Article as Wide Card if no active search */}
                {!homeSearchQuery && filteredArticles[0] && (
                  <ArticleCard
                    article={filteredArticles[0]}
                    onSelect={handleSelectArticle}
                    isSaved={savedSlugs.includes(filteredArticles[0].slug)}
                    onToggleSave={handleCardToggleSave}
                    layout="horizontal"
                  />
                )}

                {/* 3-Column Grid for Subsequent Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredArticles
                    .slice(!homeSearchQuery ? 1 : 0)
                    .map(article => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onSelect={handleSelectArticle}
                        isSaved={savedSlugs.includes(article.slug)}
                        onToggleSave={handleCardToggleSave}
                      />
                    ))}
                </div>
              </div>
            )}
          </section>

          {/* MIDNIGHT EDITORIAL STANDARDS / AUTHORITY SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-blue-950">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono-spec text-blue-400 uppercase tracking-widest font-semibold block mb-2">
                Our Editorial Creed
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Engineered for the Discerning Enthusiast
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                We believe automotive journalism should be as rigorous as the telemetry engineers who tune high-downforce prototypes at the Nürburgring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Telemetry-Backed Truth
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We don't repeat press releases. Every top speed, lateral G figure, and power curve is cross-referenced with verified GPS dataloggers and factory dynamometer runs.
                </p>
              </div>

              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Historic Provenance
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  From Scaglietti aluminum hammer marks to Gordon Murray’s gold foil heat deflectors, our historical pieces explore the human hands behind mechanical legends.
                </p>
              </div>

              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Bike className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Cars & Superbikes Unified
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Recognizing that true velocity connoisseurs cherish both 1,000 HP four-wheeled hypercars and 16,000 RPM track superbikes with zero artificial boundaries.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Global Footer */}
      <Footer
        articles={ARTICLES_DATA}
        onSelectArticle={handleSelectArticle}
        onSelectCategory={cat => {
          setSelectedCategory(cat as any);
          handleNavigateHome();
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={ARTICLES_DATA}
        onSelectArticle={handleSelectArticle}
      />

      {/* Dream Garage Modal (Article 10 Tool) */}
      <DreamGarageModal
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        onReadArticle10={() =>
          handleSelectArticle(
            'building-the-ultimate-dream-garage-five-cars-every-enthusiast-wants'
          )
        }
      />

      {/* Saved Articles Reading List Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedSlugs={savedSlugs}
        allArticles={ARTICLES_DATA}
        onSelectArticle={handleSelectArticle}
        onRemoveSlug={slug =>
          setSavedSlugs(prev => prev.filter(s => s !== slug))
        }
        onClearAll={() => setSavedSlugs([])}
      />
    </div>
  );
}
