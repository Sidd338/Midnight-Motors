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
  Car,
  Compass
} from 'lucide-react';
import { BlogArticle } from '../types/blog';
import { updateSEO } from '../utils/seo';

interface ArticleViewProps {
  article: BlogArticle;
  allArticles: BlogArticle[];
  onNavigateHome: () => void;
  onSelectArticle: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  onNavigateHome,
  onSelectArticle,
  isSaved,
  onToggleSave
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
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
    const fullUrl = window.location.origin + `/blog/${article.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const fullUrl = encodeURIComponent(window.location.origin + `/blog/${article.slug}`);
    const text = encodeURIComponent(`${article.title} via @MidnightMotors`);

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
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="pt-4 pb-6">
          <ol className="flex items-center gap-2 text-xs font-mono-spec text-slate-400">
            <li>
              <button
                onClick={onNavigateHome}
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </button>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-blue-400">{article.category}</span>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-500 truncate max-w-xs sm:max-w-md">
              {article.title}
            </li>
          </ol>
        </nav>

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
            <span className="text-slate-400 uppercase">Slug: /blog/{article.slug}</span>
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

        {/* Hero Image Showcase */}
        <figure className="mb-14 overflow-hidden rounded-2xl border border-blue-900/40 bg-slate-950 shadow-2xl shadow-blue-950/40">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt}
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
                  {article.tableOfContents.map((toc, index) => {
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

              {/* Quick Share Widget */}
              <div className="p-4 bg-gradient-to-br from-blue-950/40 to-slate-950 border border-blue-800/30 rounded-xl text-center">
                <span className="text-xs text-slate-300 font-medium block mb-2">
                  Enjoying this technical analysis?
                </span>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shadow-blue-950 flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share with Enthusiasts</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Article Main Text Body */}
          <main className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            {article.contentSections.map((section, idx) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  {section.heading}
                </h2>
                {section.subheading && (
                  <h3 className="text-sm sm:text-base font-semibold text-blue-400 font-mono-spec uppercase tracking-wider mb-5">
                    {section.subheading}
                  </h3>
                )}

                <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                  {section.body.map((para, pIdx) => (
                    <p key={pIdx}>
                      {idx === 0 && pIdx === 0 ? (
                        <span className="float-left text-4xl sm:text-5xl font-display font-extrabold text-blue-400 mr-3 leading-none mt-1">
                          {para.charAt(0)}
                        </span>
                      ) : null}
                      {idx === 0 && pIdx === 0 ? para.slice(1) : para}
                    </p>
                  ))}
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
                        alt={rec.name}
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
                Knowledge Base
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Technical inquiries answered by our editors and automotive engineering consultants.
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

            {/* RELATED POSTS SECTION */}
            {relatedArticles.length > 0 && (
              <section className="pt-12 border-t border-blue-900/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-mono-spec text-blue-400 uppercase tracking-widest font-semibold block mb-1">
                      Continue Reading
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Related Automotive Editorials
                    </h3>
                  </div>
                  <button
                    onClick={onNavigateHome}
                    className="text-xs text-blue-400 hover:text-white font-mono-spec uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    View All Articles →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedArticles.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectArticle(rel.slug)}
                      className="group cursor-pointer bg-[#090e1a] border border-blue-900/30 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all duration-300 shadow-md shadow-black/40 hover:-translate-y-1"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                        <img
                          src={rel.heroImage}
                          alt={rel.heroImageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-[11px] font-mono-spec text-blue-400 uppercase block mb-1">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h4>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rel.readTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
