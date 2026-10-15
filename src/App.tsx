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
  ChevronRight,
  Car,
  Bike,
  ExternalLink,
  Globe,
  ShieldCheck
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

import { KeywordResearchPage, KeywordResearchTable } from './components/KeywordResearchPage';

export default function App() {
  // Navigation State
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [isKeywordResearch, setIsKeywordResearch] = useState(false);
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

  // Handle URL parsing on mount and popstate for clean URLs: /, /keyword-research, /what-is-a-hypercar, /best-classic-cars-to-invest-in, /luxury-motorcycles
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
      if (!path) {
        setCurrentSlug(null);
        setIsKeywordResearch(false);
        return;
      }
      if (path === 'keyword-research') {
        setIsKeywordResearch(true);
        setCurrentSlug(null);
        return;
      }
      setIsKeywordResearch(false);
      // Support both direct clean URLs (e.g. /what-is-a-hypercar) and /blog/:slug aliases
      const cleanSlug = path.startsWith('blog/') ? path.replace('blog/', '') : path;
      const found = ARTICLES_DATA.find(a => a.slug === cleanSlug);
      if (found) {
        setCurrentSlug(found.slug);
        return;
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

  // Sync homepage SEO when on home and not on keyword research
  useEffect(() => {
    if (!currentSlug && !isKeywordResearch) {
      updateSEO();
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentSlug, isKeywordResearch]);

  // Navigate to Article with Clean URL Slug
  const handleSelectArticle = (slug: string) => {
    setIsKeywordResearch(false);
    setCurrentSlug(slug);
    const newPath = `/${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ slug }, '', newPath);
    }
  };

  // Navigate to Homepage
  const handleNavigateHome = () => {
    setIsKeywordResearch(false);
    setCurrentSlug(null);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Navigate to Keyword Research Slide Page
  const handleSelectKeywordResearch = () => {
    setIsKeywordResearch(true);
    setCurrentSlug(null);
    if (window.location.pathname !== '/keyword-research') {
      window.history.pushState(null, '', '/keyword-research');
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
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

  // Standalone Slide Page for /keyword-research
  if (isKeywordResearch) {
    return <KeywordResearchPage onNavigateHome={handleNavigateHome} />;
  }

  // Featured Article for the Hero Showcase
  const featuredArticle = ARTICLES_DATA[0];

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
        onOpenKeywordResearch={handleSelectKeywordResearch}
        savedCount={savedSlugs.length}
      />

      {/* Conditional View: Article Page OR Homepage */}
      {currentArticle ? (
        <ArticleView
          article={currentArticle}
          allArticles={ARTICLES_DATA}
          onNavigateHome={handleNavigateHome}
          onSelectArticle={handleSelectArticle}
          onOpenGarage={() => setIsGarageOpen(true)}
          onOpenKeywordResearch={handleSelectKeywordResearch}
          onSelectCategory={cat => {
            setSelectedCategory(cat as any);
            handleNavigateHome();
          }}
          isSaved={savedSlugs.includes(currentArticle.slug)}
          onToggleSave={handleToggleSave}
        />
      ) : (
        <main className="pt-20 sm:pt-24 pb-20">
          {/* HERO SECTION WITH CLEAN KEYWORD INTEGRATION & SINGLE H1 */}
          <section className="relative overflow-hidden pt-6 pb-16 sm:pb-20 border-b border-blue-900/30">
            {/* Ambient Background Gradient Grids */}
            <div className="absolute inset-0 bg-midnight-grid pointer-events-none opacity-90" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Top Editorial Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 mb-4 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>The Premier Hypercars Showroom & Motorcycle Sanctuary</span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="text-slate-400">Curated Automotive Intelligence</span>
              </div>

              {/* Hero Banner Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  {/* Single H1 per page containing main keyword naturally */}
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                    The Premier{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                      Hypercars Showroom
                    </span>{' '}
                    & Exotic Supercars Collection
                  </h1>

                  {/* First Paragraph naturally using main keyword and 2 related keywords */}
                  <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
                    Welcome to Midnight Motors, a private <strong className="text-white font-medium">hypercars showroom</strong> and premier <strong className="text-white font-medium">luxury car showroom</strong> dedicated to the acquisition, technical appraisal, and exhibition of the world's most coveted machinery. Our curated <strong className="text-white font-medium">exotic supercars collection</strong> spans 300-mph engineering monuments, investment-grade classic icons, and track-homologated superbikes.
                  </p>

                  {/* Hero Quick Search Input */}
                  <div className="pt-2 max-w-xl">
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-blue-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={homeSearchQuery}
                        onChange={e => setHomeSearchQuery(e.target.value)}
                        placeholder="Search hypercars showroom, Koenigsegg, Ferrari 250, superbikes..."
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

                  {/* Jump to Keyword Research Table Button */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        const el = document.getElementById('keyword-research');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>📊 Jump To Keyword Research Table</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleSelectKeywordResearch}
                      className="text-xs text-blue-400 hover:text-white font-mono-spec underline"
                    >
                      Open /keyword-research slide
                    </button>
                  </div>

                  {/* Quick Telemetry Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-950/80 max-w-lg text-left">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-spec text-blue-400">
                        304.77
                      </div>
                      <div className="text-[11px] font-mono-spec text-slate-400 uppercase">
                        MPH Verified Benchmark
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-spec text-white">
                        $70M+
                      </div>
                      <div className="text-[11px] font-mono-spec text-slate-400 uppercase">
                        Historic Provenance Record
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono-spec text-sky-400">
                        3 Core
                      </div>
                      <div className="text-[11px] font-mono-spec text-slate-400 uppercase">
                        Cornerstone Guides
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Featured Article Card Spotlight with Descriptive Keyword Anchor */}
                <div className="lg:col-span-5">
                  <div
                    onClick={() => handleSelectArticle(featuredArticle.slug)}
                    className="group cursor-pointer relative bg-gradient-to-b from-[#0b1426] to-[#070b14] border border-blue-600/40 hover:border-blue-400 rounded-2xl overflow-hidden shadow-2xl shadow-blue-950/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={featuredArticle.heroImage}
                        alt="Koenigsegg Jesko hypercar featured in our hypercars showroom collection"
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-90" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-mono-spec font-bold uppercase bg-blue-600 text-white rounded shadow-md">
                        CORNERSTONE EDITORIAL 1
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400">
                        <span>{featuredArticle.category}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400">{featuredArticle.readTime}</span>
                      </div>

                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>

                      <div className="pt-3 border-t border-blue-950/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={featuredArticle.author.avatar}
                            alt={featuredArticle.author.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover border border-blue-500/40"
                          />
                          <span className="text-xs text-slate-300 font-medium">
                            {featuredArticle.author.name}
                          </span>
                        </div>

                        {/* Keyword-Rich Descriptive Anchor Text */}
                        <span className="text-xs font-semibold text-blue-400 font-mono-spec flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read what makes a hypercar different <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2 KEYWORD RESEARCH TABLE SECTION - HIGHLY VISIBLE */}
          <section id="keyword-research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-blue-900/40">
            <div className="p-6 sm:p-8 bg-[#0a0f1c] border-2 border-blue-600/50 rounded-2xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-blue-900/40">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                  <div>
                    <span className="text-[11px] font-mono-spec uppercase tracking-widest text-amber-400 font-bold block">
                      Step 2: Keyword Research Table (Assignment Submission)
                    </span>
                    <span className="text-xs text-slate-400">
                      Primary keywords, related terms, search intent & volume data
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSelectKeywordResearch}
                  className="px-3.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded text-xs font-mono-spec transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Open Fullscreen Slide View (/keyword-research)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Render the actual table */}
              <KeywordResearchTable showTitle={true} />
            </div>
          </section>

          {/* AEO QUESTION-ANSWER SECTION 1: HYPERCARS SHOWROOM & EXOTIC SUPERCARS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-blue-950/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Q&A 1 */}
              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-2xl space-y-3">
                <span className="text-[11px] font-mono-spec text-blue-400 uppercase tracking-widest block font-bold">
                  Frequently Answered Question
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  Where Can Enthusiasts Experience an Authentic Hypercars Showroom?
                </h2>
                <div className="p-4 bg-blue-950/25 border-l-2 border-blue-500 rounded-r-lg space-y-2 text-sm text-slate-300 leading-relaxed">
                  <p className="font-semibold text-blue-200">
                    Where can collectors view the world's rarest hypercars and supercars in person?
                  </p>
                  <p>
                    Midnight Motors operates a private <strong className="text-white">hypercars showroom</strong> and bespoke <strong className="text-white">luxury car showroom</strong> housing an <strong className="text-white">exotic supercars collection</strong> of track-ready homologated machines. Our private viewing suites allow clients to inspect dyno-certified powertrains, autoclave carbon monocoques, and documented racing provenance in an appointment-only environment.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handleSelectArticle('what-is-a-hypercar')}
                    className="text-xs font-semibold text-blue-400 hover:text-white font-mono-spec flex items-center gap-1.5 transition-colors"
                  >
                    Read what makes a hypercar different →
                  </button>
                </div>
              </div>

              {/* Q&A 2 */}
              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-2xl space-y-3">
                <span className="text-[11px] font-mono-spec text-blue-400 uppercase tracking-widest block font-bold">
                  Collection Guide
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  What Vehicles Are Curated in Our Exotic Supercars Collection?
                </h2>
                <div className="p-4 bg-blue-950/25 border-l-2 border-blue-500 rounded-r-lg space-y-2 text-sm text-slate-300 leading-relaxed">
                  <p className="font-semibold text-blue-200">
                    What types of automobiles and motorcycles are curated inside Midnight Motors?
                  </p>
                  <p>
                    Our <strong className="text-white">luxury car showroom</strong> curates 1,000+ horsepower limited-production hypercars, hand-built analog classics like the Ferrari F40, and the world's fastest production superbikes. Every vehicle in our <strong className="text-white">exotic supercars collection</strong> undergoes comprehensive mechanical verification and historical title authentication.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handleSelectArticle('best-classic-cars-to-invest-in')}
                    className="text-xs font-semibold text-blue-400 hover:text-white font-mono-spec flex items-center gap-1.5 transition-colors"
                  >
                    Explore the best classic cars to invest in guide →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* DREAM GARAGE CALLOUT BANNER WITH DESCRIPTIVE KEYWORD ANCHORS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950/60 via-[#0a1224] to-[#070b14] border border-blue-700/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      Curate Your 5-Car & Superbike Collection
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-spec uppercase bg-blue-600 text-white rounded font-bold">
                      Interactive Tool
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    Select your everyday performance driver, JDM legend, classic Ferrari, track weapon, and halo hypercar from our private inventory.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsGarageOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-950 flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Launch Dream Garage Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSelectArticle('luxury-motorcycles')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                >
                  Discover our luxury motorcycles showcase
                </button>
              </div>
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
                    'Classics & Heritage',
                    'Superbikes'
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
                    {cat === 'All' ? 'All Curated Editorials' : cat}
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
                  Showing results matching "{homeSearchQuery}" ({filteredArticles.length} of {ARTICLES_DATA.length})
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

          {/* MAIN ARTICLES GRID WITH DESCRIPTIVE ANCHOR TEXTS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="mb-6">
              <span className="text-xs font-mono-spec text-blue-400 uppercase tracking-widest font-semibold block mb-1">
                Showroom Knowledge Hub
              </span>
              <h2 className="font-display text-2xl font-bold text-white">
                Featured Technical Analysis & Collector Guides
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSelect={handleSelectArticle}
                  isSaved={savedSlugs.includes(article.slug)}
                  onToggleSave={handleCardToggleSave}
                />
              ))}
            </div>
          </section>

          {/* COMPREHENSIVE LINK ARCHITECTURE: INWARD DEEP LINKS & OUTBOUND CITATIONS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-blue-900/40">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-widest font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Navigational Infrastructure & External Trust</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Inward Navigational Network & Outbound Authority Archive
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                Midnight Motors combines rigorous internal cross-linking for deep discovery with verified external primary citations across global governing bodies.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Internal Navigational Ecosystem (Inward Deep Links) */}
              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                    <h3 className="font-mono-spec text-xs uppercase tracking-wider text-white font-bold">
                      Inward Navigational Ecosystem (Internal Deep Links)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono-spec px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40 font-bold">
                    INTERNAL DOMAIN
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSelectArticle('what-is-a-hypercar')}
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group"
                  >
                    <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold block mb-1">
                      CORNERSTONE DOSSIER
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
                      What is a Hypercar?
                    </h4>
                    <span className="text-xs text-sky-400 font-mono-spec flex items-center gap-1">
                      Read what makes a hypercar different →
                    </span>
                  </button>

                  <button
                    onClick={() => handleSelectArticle('best-classic-cars-to-invest-in')}
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group"
                  >
                    <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold block mb-1">
                      INVESTMENT BENCHMARK
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
                      Best Classic Cars to Invest In
                    </h4>
                    <span className="text-xs text-sky-400 font-mono-spec flex items-center gap-1">
                      Explore the best classic cars to invest in guide →
                    </span>
                  </button>

                  <button
                    onClick={() => handleSelectArticle('luxury-motorcycles')}
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group"
                  >
                    <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold block mb-1">
                      TRACK & VELOCITY
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
                      Luxury Motorcycles Showcase
                    </h4>
                    <span className="text-xs text-sky-400 font-mono-spec flex items-center gap-1">
                      Discover our luxury motorcycles showcase →
                    </span>
                  </button>

                  <button
                    onClick={() => setIsGarageOpen(true)}
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-sky-500/50 rounded-xl text-left transition-colors group"
                  >
                    <span className="text-[10px] font-mono-spec text-sky-400 uppercase font-bold block mb-1">
                      INTERACTIVE BUILDER
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors mb-1">
                      6-Slot Dream Garage Vault
                    </h4>
                    <span className="text-xs text-sky-400 font-mono-spec flex items-center gap-1">
                      Launch interactive vault builder →
                    </span>
                  </button>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    All Showroom Stock
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Hypercars')}
                    className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Hypercars Collection
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Classics & Heritage')}
                    className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Vintage & Heritage
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Superbikes')}
                    className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Superbikes Sanctuary
                  </button>
                  <button
                    onClick={handleSelectKeywordResearch}
                    className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/40 rounded text-amber-300 hover:text-white transition-colors font-mono-spec"
                  >
                    AEO Keyword Matrix
                  </button>
                </div>
              </div>

              {/* Right Column: Outbound Authorities & Official Primary Sources */}
              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <h3 className="font-mono-spec text-xs uppercase tracking-wider text-white font-bold">
                      Verified Global Authorities (Outbound Primary Sources)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono-spec px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-bold">
                    OFFICIAL ARCHIVES
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://www.fia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group block"
                    title="Fédération Internationale de l'Automobile Technical Regulations"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold">
                        REGULATORY
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                      FIA World Endurance
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      LMH Hypercar technical rulebooks
                    </p>
                  </a>

                  <a
                    href="https://www.guinnessworldrecords.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group block"
                    title="Guinness World Records Production Car Speed Standards"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold">
                        TELEMETRY
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                      Guinness World Records
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      Production land speed certification
                    </p>
                  </a>

                  <a
                    href="https://www.hagerty.com/valuation-tools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group block"
                    title="Hagerty Classic Car Price Guide & Blue Chip Index"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold">
                        AUCTION INDEX
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                      Hagerty Valuation Tools
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      Blue-chip historic market data
                    </p>
                  </a>

                  <a
                    href="https://rmsothebys.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group block"
                    title="RM Sotheby's Historic Auction Provenance Archive"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold">
                        PROVENANCE
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                      RM Sotheby’s Archive
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      Verified historical chassis records
                    </p>
                  </a>

                  <a
                    href="https://www.bugatti.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group block"
                    title="Bugatti Molsheim Official 300+ MPH Engineering Whitepaper"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold">
                        MANUFACTURER
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                      Bugatti Molsheim Lab
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      W16 304.77 mph longtail telemetry
                    </p>
                  </a>

                  <a
                    href="https://www.fim-moto.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0a1122] hover:bg-blue-950/40 border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-left transition-colors group block"
                    title="FIM WorldSBK Regulations"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase font-bold">
                        MOTORSPORT
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                      FIM World Superbike
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      1,200 hp/ton homologation rules
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* AEO QUESTION-ANSWER SECTION 2: EDITORIAL CREED */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-blue-950">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono-spec text-blue-400 uppercase tracking-widest font-semibold block mb-2">
                AEO Standards
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Why Do Serious Collectors Choose Midnight Motors?
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Clear answers regarding our provenance auditing, dyno power validation, and telemetry standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  How Are Top Speed Claims Verified?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>We cross-reference every speed claim with GPS dual-band dataloggers and factory telemetry.</strong> No unverified estimates are accepted; only independent timing beacon records from Nardò, Ehra-Lessien, or Papenburg are published.
                </p>
                <button
                  onClick={() => handleSelectArticle('what-is-a-hypercar')}
                  className="text-xs text-blue-400 hover:text-white font-mono-spec flex items-center gap-1 transition-colors pt-1"
                >
                  Read what makes a hypercar different →
                </button>
              </div>

              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  How Do We Protect Classic Car Investment Value?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Our curators verify original matching-numbers chassis, engine blocks, and Scaglietti coachwork.</strong> We authenticate period competition entries and factory Classiche documentation to safeguard client capital.
                </p>
                <button
                  onClick={() => handleSelectArticle('best-classic-cars-to-invest-in')}
                  className="text-xs text-blue-400 hover:text-white font-mono-spec flex items-center gap-1 transition-colors pt-1"
                >
                  Explore the best classic cars to invest in guide →
                </button>
              </div>

              <div className="p-6 bg-[#080d1a] border border-blue-900/30 rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Bike className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Why Are Superbikes Integrated Alongside Hypercars?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Superbikes deliver power-to-weight ratios exceeding 1,200 hp per ton that surpass four-wheeled hypercars.</strong> Curating both disciplines provides collectors with the full sensory spectrum of modern velocity.
                </p>
                <button
                  onClick={() => handleSelectArticle('luxury-motorcycles')}
                  className="text-xs text-blue-400 hover:text-white font-mono-spec flex items-center gap-1 transition-colors pt-1"
                >
                  Discover our luxury motorcycles showcase →
                </button>
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

      {/* Dream Garage Modal */}
      <DreamGarageModal
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        onReadArticle10={() => handleSelectArticle('what-is-a-hypercar')}
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
