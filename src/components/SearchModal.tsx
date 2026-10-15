import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Clock, FileText } from 'lucide-react';
import { BlogArticle } from '../types/blog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: BlogArticle[];
  onSelectArticle: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cars' | 'bikes' | 'hypercars'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open if controlled externally
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredArticles = articles.filter(art => {
    // Type filter
    if (filterType === 'cars' && art.vehicleType === 'bikes') return false;
    if (filterType === 'bikes' && art.vehicleType === 'cars') return false;
    if (filterType === 'hypercars' && art.category !== 'Hypercars') return false;

    if (!normalizedQuery) return true;

    const inTitle = art.title.toLowerCase().includes(normalizedQuery);
    const inExcerpt = art.excerpt.toLowerCase().includes(normalizedQuery);
    const inKeywords = art.seoKeywords.some(k => k.toLowerCase().includes(normalizedQuery));
    const inCategory = art.category.toLowerCase().includes(normalizedQuery);
    const inAuthor = art.author.name.toLowerCase().includes(normalizedQuery);
    const inSections = art.contentSections.some(sec =>
      sec.heading.toLowerCase().includes(normalizedQuery) ||
      sec.body.some(p => p.toLowerCase().includes(normalizedQuery))
    );

    return inTitle || inExcerpt || inKeywords || inCategory || inAuthor || inSections;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#090e1a] border border-blue-800/40 rounded-xl shadow-2xl shadow-blue-950/60 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-blue-900/30 bg-[#070b14]">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search hypercars, V12 engines, JDM legends, GT3 RS, Koenigsegg..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono-spec border border-slate-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#060a12] border-b border-blue-950 text-xs overflow-x-auto">
          <span className="text-slate-500 text-[11px] font-mono-spec uppercase mr-1">Filter:</span>
          {(['all', 'cars', 'bikes', 'hypercars'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type === 'all' ? 'All Editorial' : type}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-500 font-mono-spec">
            {filteredArticles.length} results
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-blue-950/40 p-2">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-8 h-8 text-blue-500/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No articles matched "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for "Koenigsegg", "McLaren", "Ferrari", "RB26", or "Track Car".
              </p>
            </div>
          ) : (
            filteredArticles.map(art => (
              <a
                key={art.id}
                href={`/${art.slug}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    onSelectArticle(art.slug);
                    onClose();
                  }
                }}
                className="group flex items-start gap-3.5 p-3 rounded-lg hover:bg-blue-950/40 cursor-pointer transition-all border border-transparent hover:border-blue-800/30"
                title={`Visit clean URL: /${art.slug}`}
              >
                <img
                  src={art.heroImage}
                  alt={art.heroImageAlt}
                  width={96}
                  height={64}
                  className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded shrink-0 border border-slate-800 group-hover:border-blue-500/50 transition-colors"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 font-mono-spec mb-0.5">
                    <div className="flex items-center gap-2">
                      <span>{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {art.readTime}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      /{art.slug}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 line-clamp-1 transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {art.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </a>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#05080e] border-t border-blue-900/30 flex items-center justify-between text-[11px] text-slate-500 font-mono-spec">
          <span>Navigate with mouse or keyboard</span>
          <span className="text-blue-400">10 in-depth articles indexed</span>
        </div>
      </div>
    </div>
  );
};
