import React from 'react';
import { X, Bookmark, ArrowRight, Trash2, Clock } from 'lucide-react';
import { BlogArticle } from '../types/blog';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSlugs: string[];
  allArticles: BlogArticle[];
  onSelectArticle: (slug: string) => void;
  onRemoveSlug: (slug: string) => void;
  onClearAll: () => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedSlugs,
  allArticles,
  onSelectArticle,
  onRemoveSlug,
  onClearAll
}) => {
  if (!isOpen) return null;

  const savedArticles = allArticles.filter(art => savedSlugs.includes(art.slug));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#080d1a] border-l border-blue-900/40 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-blue-900/30 bg-[#060a14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-blue-400 fill-blue-500/20" />
            <div>
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Saved Reading List
              </h3>
              <p className="text-xs text-slate-400 font-mono-spec">
                {savedArticles.length} {savedArticles.length === 1 ? 'editorial' : 'editorials'} bookmarked
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedArticles.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-2 text-slate-400 hover:text-red-400 text-xs transition-colors"
                title="Clear all saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedArticles.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">Your reading list is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Bookmark deep-dive technical articles or supercar comparisons to read later.
              </p>
            </div>
          ) : (
            savedArticles.map(art => (
              <div
                key={art.id}
                className="group relative flex gap-3 p-3 bg-[#0a1122] hover:bg-[#0c162d] border border-blue-900/20 hover:border-blue-500/40 rounded-xl transition-all"
              >
                <img
                  src={art.heroImage}
                  alt={art.heroImageAlt}
                  className="w-20 h-20 object-cover rounded-lg shrink-0 border border-slate-800"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-mono-spec text-blue-400 uppercase tracking-wider block">
                        {art.category}
                      </span>
                      <span className="text-[9px] font-mono-spec text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-800/40">
                        /{art.slug}
                      </span>
                    </div>
                    <a
                      href={`/${art.slug}`}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          onSelectArticle(art.slug);
                          onClose();
                        }
                      }}
                      className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 cursor-pointer mt-0.5 block"
                    >
                      {art.title}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-blue-950/60 font-mono-spec">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                    <button
                      onClick={() => onRemoveSlug(art.slug)}
                      className="text-[11px] text-slate-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 bg-[#060a14] border-t border-blue-900/30">
            <button
              onClick={() => {
                onSelectArticle(savedArticles[0].slug);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-blue-950 flex items-center justify-center gap-1.5"
            >
              <span>Read Next Article</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
