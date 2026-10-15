import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
  Clock,
  Calendar,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Compass,
  ArrowRight,
  ExternalLink,
  Globe,
  ShieldCheck,
  BookOpen,
  Copy
} from 'lucide-react';
import { BlogArticle, ArticleCategory } from '../types/blog';
import { updateSEO } from '../utils/seo';

interface ArticleViewProps {
  article: BlogArticle;
  allArticles: BlogArticle[];
  onNavigateHome: () => void;
  onSelectArticle: (slug: string) => void;
  onOpenGarage?: () => void;
  onOpenKeywordResearch?: () => void;
  onSelectCategory?: (category: ArticleCategory | 'All') => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  onNavigateHome,
  onSelectArticle,
  onOpenGarage,
  onOpenKeywordResearch,
  onSelectCategory,
  isSaved,
  onToggleSave
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTocId, setActiveTocId] = useState<string>('');

  // Synchronize SEO tags and JSON-LD schema
  useEffect(() => {
    updateSEO(article);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [article]);

  // Reading progress and TOC spy
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // Track active TOC header
      const headings = article.tableOfContents
        .map(item => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      for (let i = headings.length - 1; i >= 0; i--) {
        const rect = headings[i].getBoundingClientRect();
        if (rect.top <= 160) {
          setActiveTocId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/${article.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const fullUrl = encodeURIComponent(`${window.location.origin}/${article.slug}`);
    const text = encodeURIComponent(`${article.title} | Midnight Motors`);

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${fullUrl}&text=${text}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const relatedArticles = allArticles.filter(a =>
    article.relatedSlugs.includes(a.slug)
  );

  // Parser for rich inline inward and outbound links in body copy
  const renderRichText = (text: string) => {
    const regex = /\[(.*?)\]\((.*?)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const anchorText = match[1];
      const url = match[2];
      const key = `link-${match.index}-${url}`;

      if (url.startsWith('http://') || url.startsWith('https://')) {
        parts.push(
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`External Authority: ${anchorText} (${url})`}
            className="inline-flex items-center gap-1 font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-400 transition-colors group/link cursor-pointer"
          >
            <span>{anchorText}</span>
            <ExternalLink className="w-3 h-3 text-blue-400/90 inline group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
          </a>
        );
      } else if (url === '#dream-garage') {
        parts.push(
          <button
            key={key}
            type="button"
            onClick={onOpenGarage}
            title="Open interactive 6-Slot Dream Garage Vault builder"
            className="inline-flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 underline underline-offset-4 decoration-sky-500/50 hover:decoration-sky-300 transition-colors cursor-pointer"
          >
            <span>{anchorText}</span>
            <Sparkles className="w-3 h-3 text-sky-400 inline shrink-0" />
          </button>
        );
      } else if (url === '#showroom' || url.startsWith('#showroom-')) {
        parts.push(
          <button
            key={key}
            type="button"
            onClick={() => {
              if (url === '#showroom-classics' && onSelectCategory) {
                onSelectCategory('Classics & Heritage');
              } else if (url === '#showroom-superbikes' && onSelectCategory) {
                onSelectCategory('Superbikes');
              } else if (onSelectCategory) {
                onSelectCategory('All');
              } else {
                onNavigateHome();
              }
            }}
            title="Explore the Midnight Motors showroom collection"
            className="inline-flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 underline underline-offset-4 decoration-sky-500/50 hover:decoration-sky-300 transition-colors cursor-pointer"
          >
            <span>{anchorText}</span>
            <ArrowRight className="w-3 h-3 text-sky-400 inline shrink-0" />
          </button>
        );
      } else if (url === '/keyword-research') {
        parts.push(
          <button
            key={key}
            type="button"
            onClick={onOpenKeywordResearch || (() => window.location.assign('/keyword-research'))}
            title="View AEO Keyword Research & Intent Matrix"
            className="inline-flex items-center gap-1 font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-500/50 hover:decoration-amber-300 transition-colors cursor-pointer"
          >
            <span>{anchorText}</span>
            <ArrowRight className="w-3 h-3 text-amber-400 inline shrink-0" />
          </button>
        );
      } else if (url.startsWith('/')) {
        const targetSlug = url.replace(/^\//, '');
        parts.push(
          <button
            key={key}
            type="button"
            onClick={() => onSelectArticle(targetSlug)}
            title={`Read cornerstone editorial: ${anchorText}`}
            className="inline-flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 underline underline-offset-4 decoration-sky-500/50 hover:decoration-sky-300 transition-colors cursor-pointer text-left"
          >
            <span>{anchorText}</span>
            <ArrowRight className="w-3 h-3 text-sky-400 inline shrink-0" />
          </button>
        );
      } else {
        parts.push(anchorText);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-200 pt-20 pb-24">
      {/* Top Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-blue-950/60 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation with Defined Clean URLs and Keyword-Rich Anchor Text */}
        <nav aria-label="Breadcrumb" className="pt-4 pb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-mono-spec text-slate-400">
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome();
                }}
                className="hover:text-blue-400 transition-colors flex items-center gap-1 text-slate-300"
                title="Return to hypercars showroom homepage"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
                <span>Showroom</span>
              </a>
            </li>
            <li aria-hidden="true" className="text-slate-600">/</li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory?.(article.category)}
                className="hover:text-blue-300 text-blue-400 transition-colors"
                title={`Filter showroom by ${article.category}`}
              >
                {article.category}
              </button>
            </li>
            <li aria-hidden="true" className="text-slate-600">/</li>
            <li>
              <a
                href={`/${article.slug}`}
                onClick={(e) => e.preventDefault()}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40"
                title={`Clean Defined URL: /${article.slug}`}
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>/{article.slug}</span>
              </a>
            </li>
            <li aria-hidden="true" className="text-slate-600 hidden sm:inline">/</li>
            <li className="text-slate-400 truncate max-w-xs sm:max-w-md hidden sm:inline">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Defined Clean URL & Canonical Permalink Bar */}
        <div className="mb-6 p-3 sm:p-3.5 bg-[#080d19]/90 border border-blue-900/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-inner shadow-black/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono-spec text-[10px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1">
                  <span>CLEAN DEFINED URL</span>
                  <span className="text-slate-600">·</span>
                  <span>CANONICAL PERMALINK</span>
                </span>
                <span className="text-[10px] font-mono-spec px-1.5 py-0.2 bg-blue-950/80 text-blue-300 border border-blue-800/40 rounded hidden sm:inline">
                  HTTP 200
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono-spec text-slate-300 text-xs sm:text-sm truncate">
                <span className="text-slate-500 hidden sm:inline">{window.location.origin}</span>
                <span className="text-emerald-300 font-bold">/{article.slug}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-mono-spec">
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                copiedLink
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white'
              }`}
              title={`Copy defined clean URL: ${window.location.origin}/${article.slug}`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>Copy Clean URL</span>
                </>
              )}
            </button>

            <a
              href={`/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
              title="Open clean defined URL in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Open</span>
            </a>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          {/* Metadata unboxed text line per Zero-Pill rule */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-spec text-blue-400 mb-4">
            <span className="uppercase tracking-widest font-semibold">{article.category}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedDate}
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTime}
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href={`/${article.slug}`}
              onClick={(e) => {
                e.preventDefault();
                handleCopyLink();
              }}
              title="Click to copy clean defined canonical URL"
              className="text-emerald-400 hover:text-emerald-300 font-mono-spec flex items-center gap-1 uppercase transition-colors"
            >
              <Link2 className="w-3 h-3" />
              <span>Clean URL: /{article.slug}</span>
            </a>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-4xl font-light mb-8">
            {article.excerpt}
          </p>

          {/* Author Byline & Social Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-blue-900/30">
            <div className="flex items-center gap-3.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50 shadow-md shadow-blue-950"
              />
              <div>
                <div className="font-medium text-sm text-white">{article.author.name}</div>
                <div className="text-xs text-blue-400 font-mono-spec">{article.author.role}</div>
                <div className="text-[11px] text-slate-400 hidden sm:block max-w-md">
                  {article.author.credentials}
                </div>
              </div>
            </div>

            {/* Actions: Save & Social Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(article.slug)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                  isSaved
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-blue-500'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-400 text-blue-400' : ''}`} />
                <span>{isSaved ? 'Saved to Garage' : 'Save Article'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy share link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-800">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-900 rounded transition-colors"
                  aria-label="Share on X"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-900 rounded transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-900 rounded transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image Showcase with Explicit Dimensions and Descriptive Alt */}
        <figure className="mb-14 overflow-hidden rounded-2xl border border-blue-900/40 bg-slate-950 shadow-2xl shadow-blue-950/40">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt}
            width={1200}
            height={675}
            className="w-full max-h-[580px] object-cover"
          />
          <figcaption className="p-3.5 text-xs text-slate-400 font-mono-spec bg-[#070b14] border-t border-blue-950/80 flex items-center justify-between">
            <span>{article.heroImageCaption}</span>
            <span className="text-blue-400/80">MIDNIGHT MOTORS ARCHIVE</span>
          </figcaption>
        </figure>

        {/* Main Content Layout (Grid with Sticky TOC Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-5 bg-[#090e1a] border border-blue-900/30 rounded-xl shadow-lg shadow-black/40">
                <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-widest mb-3 font-semibold">
                  <Compass className="w-4 h-4" />
                  Table of Contents
                </div>
                <nav className="space-y-1.5 text-xs">
                  {[
                    ...article.tableOfContents,
                    { id: 'clean-defined-url-and-citations', title: 'Clean Defined URL & Citations' },
                    { id: 'verified-sources-and-links', title: 'Verified Sources & Links' }
                  ].map((toc, index) => {
                    const isActive = activeTocId === toc.id;
                    return (
                      <a
                        key={toc.id}
                        href={`#${toc.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(toc.id);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            setActiveTocId(toc.id);
                          }
                        }}
                        className={`block py-1.5 px-2.5 rounded transition-all leading-snug ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500 pl-3'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        <span className="text-slate-500 mr-1.5 font-mono-spec">
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        {toc.title}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Author Highlight Card */}
              <div className="p-5 bg-[#090e1a]/80 border border-blue-900/20 rounded-xl">
                <div className="text-[11px] font-mono-spec uppercase tracking-wider text-slate-500 mb-2">
                  Editorial Columnist
                </div>
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{article.author.name}</h4>
                    <p className="text-xs text-blue-400">{article.author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {article.author.credentials}
                </p>
              </div>

              {/* Cross-Link Callout to Showroom */}
              <div className="p-4 bg-gradient-to-br from-blue-950/40 to-slate-950 border border-blue-800/30 rounded-xl text-center">
                <span className="text-xs text-slate-300 font-medium block mb-2">
                  Visit the physical collection:
                </span>
                <button
                  onClick={onNavigateHome}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shadow-blue-950 flex items-center justify-center gap-1.5"
                >
                  <span>Explore our hypercars showroom</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Defined Clean URL Sidebar Card */}
              <div className="p-4 bg-[#090e1a]/90 border border-blue-900/30 rounded-xl space-y-3 font-mono-spec">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <Globe className="w-3.5 h-3.5" /> Defined Clean URL
                  </span>
                  <span className="text-[10px] text-slate-500">CANONICAL</span>
                </div>

                <div className="p-2.5 bg-[#060a14] rounded border border-blue-950/70 text-xs text-slate-300 break-all space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Permalink URI:</div>
                  <div className="text-emerald-300 font-bold select-all">/{article.slug}</div>
                  <div className="text-[10px] text-slate-500 truncate pt-0.5">{window.location.origin}/{article.slug}</div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Index Status:</span>
                    <span className="text-emerald-400 font-semibold">Indexed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Clean Routing:</span>
                    <span className="text-blue-400">RESTful Slug</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`w-full py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 border font-sans font-semibold ${
                    copiedLink
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Clean URL Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copy Defined URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Inward & Outbound Link Intelligence Quick Summary */}
              <div className="p-4 bg-[#090e1a]/90 border border-blue-900/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-spec">
                  <span className="text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Link Architecture
                  </span>
                  <span className="text-slate-500 text-[10px]">AEO INDEX</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-blue-950/30 border border-blue-900/20">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-sky-400" /> Inward Links
                    </span>
                    <span className="font-mono-spec font-bold text-sky-400">
                      {article.inwardLinks?.length || 5} Direct
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-blue-950/30 border border-blue-900/20">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-blue-400" /> Outbound Sources
                    </span>
                    <span className="font-mono-spec font-bold text-blue-400">
                      {article.outboundLinks?.length || 5} Verified
                    </span>
                  </div>
                </div>

                <a
                  href="#verified-sources-and-links"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('verified-sources-and-links')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block text-center py-1.5 text-[11px] font-mono-spec text-blue-400 hover:text-white transition-colors border-t border-blue-950/60 pt-2"
                >
                  Explore link directory ↓
                </a>
              </div>
            </div>
          </aside>

          {/* Article Main Text Body */}
          <main className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            {article.contentSections.map((section, idx) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                {/* H2 Question Heading per AEO Guidelines */}
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  {section.heading}
                </h2>
                {section.subheading && (
                  <h3 className="text-sm sm:text-base font-semibold text-blue-400 font-mono-spec uppercase tracking-wider mb-5">
                    {section.subheading}
                  </h3>
                )}

                <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                  {section.body.map((para, pIdx) => {
                    // Check if paragraph is in Q&A format (starts with question)
                    const isQuestionStyle =
                      para.startsWith('What ') ||
                      para.startsWith('Which ') ||
                      para.startsWith('How ') ||
                      para.startsWith('Where ') ||
                      para.includes('?');

                    return (
                      <div
                        key={pIdx}
                        className={
                          isQuestionStyle && pIdx === 0 && idx < 3
                            ? 'p-4 bg-blue-950/20 border-l-2 border-blue-400/80 rounded-r-lg'
                            : ''
                        }
                      >
                        <p>
                          {idx === 0 && pIdx === 0 && !isQuestionStyle && !para.startsWith('[') ? (
                            <span className="float-left text-4xl sm:text-5xl font-display font-extrabold text-blue-400 mr-3 leading-none mt-1">
                              {para.charAt(0)}
                            </span>
                          ) : null}
                          {renderRichText(
                            idx === 0 && pIdx === 0 && !isQuestionStyle && !para.startsWith('[')
                              ? para.slice(1)
                              : para
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Callout / Editorial Quote */}
                {section.callout && (
                  <div className="my-7 p-5 sm:p-6 bg-[#0c1424] border-l-4 border-blue-500 rounded-r-xl shadow-lg shadow-black/50">
                    <blockquote className="text-base sm:text-lg italic text-blue-100 mb-3">
                      "{section.callout.quote}"
                    </blockquote>
                    <div className="text-xs text-blue-400 font-mono-spec font-medium">
                      — {section.callout.speaker},{' '}
                      <span className="text-slate-400">{section.callout.context}</span>
                    </div>
                  </div>
                )}

                {/* Optional Spec Table */}
                {section.specTable && (
                  <div className="my-7 overflow-x-auto rounded-xl border border-blue-900/40 bg-[#080d1a]">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#0b1324] text-blue-400 uppercase font-mono-spec tracking-wider border-b border-blue-900/40">
                        <tr>
                          <th className="py-3 px-4">Technical Parameter</th>
                          <th className="py-3 px-4">Verified Benchmark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-950/60">
                        {section.specTable.map((spec, sIdx) => (
                          <tr key={sIdx} className="hover:bg-blue-950/30 transition-colors">
                            <td className="py-2.5 px-4 font-medium text-slate-300">
                              {spec.label}
                            </td>
                            <td className="py-2.5 px-4 font-mono-spec text-blue-300 font-semibold">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}

            {/* PRODUCT RECOMMENDATIONS SECTION */}
            <section
              id="product-recommendations"
              className="pt-8 border-t border-blue-900/40 scroll-mt-28"
            >
              <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-widest mb-2 font-semibold">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Curated Recommendations
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Midnight Motors Spec Picks & Collector Recommendations
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Hand-vetted acquisitions, vehicle specifications, and equipment recommended by our engineering and vintage curation desk.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {article.productRecommendations.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="flex flex-col bg-[#090e1a] border border-blue-900/30 rounded-xl overflow-hidden shadow-lg shadow-black/50 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={rec.image}
                        alt={`${rec.name} recommended in our ${article.category.toLowerCase()} portfolio`}
                        width={800}
                        height={500}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono-spec font-bold uppercase bg-blue-600 text-white rounded">
                        {rec.badge}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-mono-spec text-blue-400 uppercase mb-1">
                          {rec.category}
                        </div>
                        <h4 className="font-display text-base font-bold text-white mb-1">
                          {rec.name}
                        </h4>
                        <div className="text-xs font-mono-spec text-slate-300 mb-2">
                          {rec.specs}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {rec.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-blue-950/60">
                        <div className="text-[11px] text-slate-500 font-mono-spec uppercase">
                          Estimated Valuation
                        </div>
                        <div className="text-sm font-bold text-blue-300 font-mono-spec">
                          {rec.priceEstimate}
                        </div>
                        <div className="mt-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded p-1.5 font-medium">
                          ✦ {rec.highlight}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROS AND CONS SECTION */}
            <section id="pros-cons" className="pt-8 border-t border-blue-900/40 scroll-mt-28">
              <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-widest mb-2 font-semibold">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Comprehensive Evaluation
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">
                Pros, Cons & The Midnight Motors Verdict
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Pros Column */}
                <div className="p-5 bg-[#08121f] border border-blue-800/40 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-300 uppercase tracking-wider mb-4 font-mono-spec">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" /> Key Advantages & Strengths
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                    {article.prosAndCons.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons Column */}
                <div className="p-5 bg-[#120e18] border border-red-900/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 font-mono-spec">
                    <ThumbsDown className="w-4 h-4 text-red-400" /> Considerations & Drawbacks
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                    {article.prosAndCons.cons.map((con, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-red-900/80 text-red-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✕
                        </span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editorial Verdict Box */}
              <div className="p-5 bg-gradient-to-r from-blue-950/60 via-[#0a1224] to-[#070b14] border border-blue-700/40 rounded-xl">
                <div className="text-xs font-mono-spec text-blue-400 uppercase tracking-wider font-bold mb-1">
                  Editorial Verdict
                </div>
                <p className="text-sm sm:text-base text-blue-100 font-light leading-relaxed">
                  {article.prosAndCons.verdict}
                </p>
              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS (FAQS) ACCORDION */}
            <section id="faqs" className="pt-8 border-t border-blue-900/40 scroll-mt-28">
              <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-widest mb-2 font-semibold">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Knowledge Base & AEO
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Direct answers to the most common questions our showroom curators receive from collectors and enthusiasts.
              </p>

              <div className="space-y-3">
                {article.faqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-blue-900/30 rounded-xl overflow-hidden bg-[#090e1a]/80"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-white hover:text-blue-300 transition-colors"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-blue-950/60 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CLEAN DEFINED URL & CITATION PERMALINK SECTION */}
            <section
              id="clean-defined-url-and-citations"
              className="pt-10 border-t border-blue-900/40 scroll-mt-28 space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-spec text-emerald-400 uppercase tracking-widest mb-2 font-semibold">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Canonical Architecture & Permanent Web Identifier
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  Clean Defined URL & Permalink Citation
                </h2>
                <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                  Every editorial on Midnight Motors adheres to immutable, search-engine-optimized, human-readable clean URLs. Use these defined permalinks for canonical citations, research syndication, and bookmarking.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#090e1a] border border-blue-900/40 rounded-xl space-y-5">
                {/* Clean URL Row */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-spec text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" /> Canonical Web Address (Clean URL)
                    </span>
                    <span className="text-emerald-400 font-medium">HTTP 200 · REL="CANONICAL"</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-[#060a14] border border-blue-900/40 rounded-lg text-xs font-mono-spec">
                    <span className="text-emerald-400 font-bold shrink-0">GET</span>
                    <span className="text-slate-300 truncate flex-1 select-all font-mono">
                      {window.location.origin}/{article.slug}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
                      title="Copy full clean URL"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Clean URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Defined Formats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono-spec">
                  <div className="p-3 bg-[#060a14] border border-blue-900/20 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Defined Primary Path</span>
                    <div className="text-white font-bold select-all">/{article.slug}</div>
                    <span className="text-[11px] text-slate-400 block">Direct root slug routing</span>
                  </div>

                  <div className="p-3 bg-[#060a14] border border-blue-900/20 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Defined Blog Alias</span>
                    <div className="text-white font-bold select-all">/blog/{article.slug}</div>
                    <span className="text-[11px] text-slate-400 block">Standard RSS / blog taxonomy</span>
                  </div>

                  <div className="p-3 bg-[#060a14] border border-blue-900/20 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Structured Citation</span>
                    <button
                      onClick={() => {
                        const citation = `Sterling, J. (2026). "${article.title}". Midnight Motors. ${window.location.origin}/${article.slug}`;
                        navigator.clipboard.writeText(citation);
                        setCopiedCitation(true);
                        setTimeout(() => setCopiedCitation(false), 2000);
                      }}
                      className="text-sky-400 hover:text-white transition-colors flex items-center gap-1 text-left"
                    >
                      <span>{copiedCitation ? 'Citation Copied!' : 'Copy APA Citation'}</span>
                      {copiedCitation ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span className="text-[11px] text-slate-400 block">Press to copy citation format</span>
                  </div>
                </div>
              </div>
            </section>

            {/* VERIFIED PRIMARY AUTHORITIES (OUTBOUND LINKS) & ARCHITECTURAL INWARD LINKS SECTION */}
            <section
              id="verified-sources-and-links"
              className="pt-10 border-t border-blue-900/40 scroll-mt-28 space-y-8"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-widest mb-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Documentation & Citations Index
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  Verified Outbound Authorities & Inward Link Architecture
                </h2>
                <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                  Every technical assertion and historical benchmark in this dossier is corroborated by recognized regulatory governing bodies and official factory archives (outbound links), integrated seamlessly with our interactive showroom network and collector tooling (inward links).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Outbound Authoritative Sources Column */}
                <div className="p-5 bg-[#090e1a] border border-blue-900/40 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                      <h3 className="font-mono-spec text-xs uppercase tracking-wider text-white font-bold">
                        Verified Primary Sources (Outbound)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono-spec px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                      EXTERNAL ARCHIVES
                    </span>
                  </div>

                  <div className="space-y-3">
                    {article.outboundLinks?.map((source, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 bg-[#060a14] border border-blue-900/20 hover:border-blue-500/40 rounded-lg transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono-spec font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-950/80 text-blue-400 border border-blue-900/40 rounded">
                            {source.type}
                          </span>
                          <span className="text-[11px] font-mono-spec text-slate-500">
                            {source.publisher}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
                          {source.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {source.description}
                        </p>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Access ${source.title} at ${source.url}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono-spec text-blue-400 hover:text-white transition-colors"
                        >
                          <span>Visit verified authority archive</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inward Link Architecture Column */}
                <div className="p-5 bg-[#090e1a] border border-blue-900/40 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-sky-400" />
                      <h3 className="font-mono-spec text-xs uppercase tracking-wider text-white font-bold">
                        Internal Navigation Network (Inward)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono-spec px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                      MIDNIGHT MOTORS
                    </span>
                  </div>

                  <div className="space-y-3">
                    {article.inwardLinks?.map((inLink, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-3.5 bg-[#060a14] border border-blue-900/20 hover:border-sky-500/40 rounded-lg transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono-spec font-bold uppercase tracking-wider px-1.5 py-0.5 bg-sky-950/80 text-sky-400 border border-sky-900/40 rounded">
                            {inLink.badge}
                          </span>
                          <span className="text-[11px] font-mono-spec text-slate-500">
                            Deep Path: {inLink.path}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors mb-1">
                          {inLink.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {inLink.context}
                        </p>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-blue-950/60">
                          {inLink.path.startsWith('/') ? (
                            <a
                              href={inLink.path}
                              onClick={(e) => {
                                if (!e.metaKey && !e.ctrlKey) {
                                  e.preventDefault();
                                  if (inLink.path === '/keyword-research') {
                                    if (onOpenKeywordResearch) {
                                      onOpenKeywordResearch();
                                    } else {
                                      window.location.assign('/keyword-research');
                                    }
                                  } else {
                                    onSelectArticle(inLink.path.replace(/^\//, ''));
                                  }
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-mono-spec text-sky-400 hover:text-white transition-colors"
                              title={`Visit clean URL: ${inLink.path}`}
                            >
                              <span>"{inLink.anchorText}"</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (inLink.path === '#dream-garage') {
                                  onOpenGarage?.();
                                } else if (inLink.path === '#showroom') {
                                  if (onSelectCategory) {
                                    onSelectCategory('All');
                                  } else {
                                    onNavigateHome();
                                  }
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-mono-spec text-sky-400 hover:text-white transition-colors"
                            >
                              <span>"{inLink.anchorText}"</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="text-[10px] font-mono-spec text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            {inLink.path}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* RELATED POSTS SECTION WITH KEYWORD-RICH ANCHORS & CLEAN DEFINED URLS */}
            {relatedArticles.length > 0 && (
              <section className="pt-12 border-t border-blue-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <span className="text-xs font-mono-spec text-blue-400 uppercase tracking-widest font-semibold block mb-1">
                      Continue Reading · Clean Permalinks
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Related Automotive Editorials
                    </h3>
                  </div>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateHome();
                    }}
                    className="text-xs text-blue-400 hover:text-white font-mono-spec uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    Explore our hypercars showroom and collections →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {relatedArticles.map(rel => {
                    const descriptiveLinkText =
                      rel.slug === 'what-is-a-hypercar'
                        ? 'Read what makes a hypercar different'
                        : rel.slug === 'best-classic-cars-to-invest-in'
                        ? 'Explore the best classic cars to invest in guide'
                        : 'Discover our luxury motorcycles showcase';

                    return (
                      <a
                        key={rel.id}
                        href={`/${rel.slug}`}
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey) {
                            e.preventDefault();
                            onSelectArticle(rel.slug);
                          }
                        }}
                        className="group block bg-[#090e1a] border border-blue-900/30 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all duration-300 shadow-md shadow-black/40 hover:-translate-y-1"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                          <img
                            src={rel.heroImage}
                            alt={rel.heroImageAlt}
                            width={800}
                            height={500}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-mono-spec text-blue-400 uppercase">
                              {rel.category}
                            </span>
                            <span className="text-[10px] font-mono-spec px-1.5 py-0.5 rounded bg-blue-950/80 text-emerald-400 border border-emerald-800/40">
                              /{rel.slug}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-3">
                            {rel.title}
                          </h4>
                          <span className="text-xs font-semibold text-blue-400 font-mono-spec flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            {descriptiveLinkText} <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
