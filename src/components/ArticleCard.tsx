import React from 'react';
import { Bookmark, Clock, ArrowUpRight, Flame } from 'lucide-react';
import { BlogArticle } from '../types/blog';

interface ArticleCardProps {
  article: BlogArticle;
  onSelect: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, slug: string) => void;
  layout?: 'standard' | 'horizontal';
}

function getDescriptiveAnchorText(slug: string): string {
  if (slug === 'what-is-a-hypercar') {
    return 'Read what makes a hypercar different';
  }
  if (slug === 'best-classic-cars-to-invest-in') {
    return 'Explore the best classic cars to invest in guide';
  }
  if (slug === 'luxury-motorcycles') {
    return 'Discover our luxury motorcycles and superbikes collection';
  }
  return 'Read the comprehensive engineering guide';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isSaved,
  onToggleSave,
  layout = 'standard'
}) => {
  const descriptiveCta = getDescriptiveAnchorText(article.slug);

  if (layout === 'horizontal') {
    return (
      <article
        className="group relative flex flex-col md:flex-row gap-5 p-4 sm:p-5 bg-[#090e1a]/80 hover:bg-[#0b1222] border border-blue-900/30 hover:border-blue-500/50 rounded-xl transition-all duration-300 shadow-lg shadow-black/40"
      >
        {/* Semantic clean URL anchor for entire card */}
        <a
          href={`/${article.slug}`}
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
              e.preventDefault();
              onSelect(article.slug);
            }
          }}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={article.title}
        />

        <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden rounded-lg shrink-0 border border-slate-800 pointer-events-none">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt}
            width={1200}
            height={675}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="flex-1 flex flex-col justify-between pointer-events-none">
          <div>
            {/* Clean unboxed metadata with clean defined URL badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-spec text-blue-400 mb-2">
              <span className="uppercase tracking-wider font-semibold">{article.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{article.readTime}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{article.publishedDate}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40 text-[10px]">
                /{article.slug}
              </span>
              {article.trendingScore > 95 && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-amber-400 flex items-center gap-1 font-sans">
                    <Flame className="w-3 h-3 inline" /> Trending
                  </span>
                </>
              )}
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors leading-tight mb-2.5">
              {article.title}
            </h3>

            <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-blue-950/60">
            <div className="flex items-center gap-2.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
              />
              <span className="text-xs text-slate-300 font-medium">{article.author.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onToggleSave(e, article.slug)}
                className={`relative z-10 pointer-events-auto p-2 rounded hover:bg-blue-950 transition-colors ${
                  isSaved ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                title={isSaved ? 'Remove from reading list' : 'Save to reading list'}
                aria-label="Save article"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
              </button>

              <span className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-mono-spec">
                {descriptiveCta} <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative flex flex-col bg-[#090e1a]/80 hover:bg-[#0c1426] border border-blue-900/30 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-blue-950/30 hover:-translate-y-1"
    >
      {/* Semantic clean URL anchor for entire card */}
      <a
        href={`/${article.slug}`}
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            onSelect(article.slug);
          }
        }}
        className="absolute inset-0 z-0"
        aria-label={article.title}
      />

      {/* Article Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-blue-950/60 pointer-events-none">
        <img
          src={article.heroImage}
          alt={article.heroImageAlt}
          width={1200}
          height={675}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-transparent opacity-80" />
      </div>

      {/* Bookmark quick button */}
      <button
        onClick={(e) => onToggleSave(e, article.slug)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-slate-700/60 transition-colors ${
          isSaved ? 'text-blue-400 border-blue-500/60' : 'text-slate-300 hover:text-white hover:border-slate-500'
        }`}
        title={isSaved ? 'Remove from reading list' : 'Save to reading list'}
        aria-label="Save article"
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
      </button>

      {/* Card Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between pointer-events-none">
        <div>
          {/* Metadata unboxed text with clean defined URL badge */}
          <div className="flex items-center justify-between text-xs font-mono-spec text-blue-400 mb-2">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider font-semibold">{article.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
            <span className="text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40 text-[10px]">
              /{article.slug}
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug mb-2 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer with Keyword-Rich Descriptive Anchor Text */}
        <div className="pt-3 border-t border-blue-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover border border-blue-500/30"
            />
            <span className="text-xs text-slate-300">{article.author.name}</span>
          </div>

          <span className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-mono-spec text-right">
            {descriptiveCta} <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </span>
        </div>
      </div>
    </article>
  );
};
