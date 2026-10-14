import React, { useState, useEffect } from 'react';
import { Search, Bookmark, Menu, X, Compass, ChevronRight, Gauge } from 'lucide-react';
import { ArticleCategory } from '../types/blog';

interface NavbarProps {
  onNavigateHome: () => void;
  onSelectCategory: (category: ArticleCategory | 'All') => void;
  activeCategory: ArticleCategory | 'All';
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onOpenGarageBuilder: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onSelectCategory,
  activeCategory,
  onOpenSearch,
  onOpenSaved,
  onOpenGarageBuilder,
  savedCount
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories: { label: string; value: ArticleCategory | 'All' }[] = [
    { label: 'All Articles', value: 'All' },
    { label: 'Hypercars', value: 'Hypercars' },
    { label: 'Supercars', value: 'Supercars' },
    { label: 'Classics', value: 'Classics & Heritage' },
    { label: 'Engineering', value: 'Engineering & Tech' },
    { label: 'Track Weapons', value: 'Track & Performance' },
    { label: 'German Battle', value: 'German Performance' },
    { label: 'JDM Legends', value: 'JDM Legends' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060911]/90 backdrop-blur-md border-b border-blue-900/30 shadow-lg shadow-black/50 py-3.5'
          : 'bg-gradient-to-b from-[#060911]/90 via-[#060911]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Mark */}
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
          >
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:border-blue-400 transition-colors">
              <Gauge className="w-5 h-5 text-blue-100 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-white block uppercase group-hover:text-blue-200 transition-colors">
                MIDNIGHT <span className="text-blue-500 font-extrabold">MOTORS</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 block -mt-1 font-mono-spec">
                Hypercars · Supercars · Superbikes
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {categories.slice(0, 7).map(cat => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  onNavigateHome();
                }}
                className={`px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors rounded-sm ${
                  activeCategory === cat.value
                    ? 'text-blue-400 border-b-2 border-blue-500 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-blue-950/30'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* Dream Garage Shortcut */}
            <button
              onClick={onOpenGarageBuilder}
              className="ml-2 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-blue-300 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 hover:border-blue-500 rounded transition-all duration-200 flex items-center gap-1.5 shadow-sm shadow-blue-950"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Dream Garage</span>
            </button>
          </nav>

          {/* Right Action Icons: Search & Saved Articles */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/60 rounded text-slate-300 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Search articles (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline text-slate-400">Search articles...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono-spec">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onOpenSaved}
              className="relative p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/60 rounded text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Saved reading list"
            >
              <Bookmark className="w-4 h-4 text-blue-400" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-blue-900">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/60 rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b14]/98 border-b border-blue-900/40 px-4 pt-4 pb-6 mt-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono-spec tracking-widest uppercase text-slate-500 px-3 py-1">
              Automotive Categories
            </span>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded transition-colors text-left ${
                  activeCategory === cat.value
                    ? 'bg-blue-900/40 text-blue-400 border-l-2 border-blue-500 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>{cat.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onOpenGarageBuilder();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors shadow-lg shadow-blue-900/40"
              >
                <Compass className="w-4 h-4" />
                <span>Build Dream Garage (Article 10 Tool)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
