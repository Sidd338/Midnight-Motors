import React, { useState } from 'react';
import { Gauge, ArrowRight, Check, Shield, Flame, Car, Bike, Sparkles } from 'lucide-react';
import { BlogArticle } from '../types/blog';

interface FooterProps {
  articles: BlogArticle[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#04060b] border-t border-blue-900/40 text-slate-400 text-xs font-light pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Manifesto Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 border-b border-blue-950">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-900 border border-blue-400/30 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-white uppercase">
                MIDNIGHT <span className="text-blue-500">MOTORS</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              An independent automotive publication and digital sanctuary celebrating the apex of internal combustion, aerodynamic physics, analog driving heritage, and high-performance engineering across cars and motorcycles.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono-spec text-blue-400">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" /> Hypercars & Classics
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" /> Superbikes & Track
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Unbiased Engineering Analysis
              </span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center bg-[#070b14] p-6 rounded-2xl border border-blue-900/30">
            <div className="flex items-center gap-2 text-xs font-mono-spec text-blue-400 uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              The Midnight Dispatch
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2">
              Receive Curated Technical Editorials & Rarity Alerts
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Weekly deep-dives into engine teardowns, Nürburgring telemetry, and private collector acquisitions. Zero spam.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You have been added to the Midnight Motors VIP Dispatch. Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your private email address..."
                  required
                  className="flex-1 bg-[#090e1a] border border-blue-900/50 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-950 flex items-center gap-1 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Directory Links Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-blue-950">
          {/* Column 1: Core Topics */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5">
              Flagship Editorials
            </h5>
            <ul className="space-y-2 text-xs">
              {articles.slice(0, 5).map(art => (
                <li key={art.id}>
                  <button
                    onClick={() => onSelectArticle(art.slug)}
                    className="hover:text-blue-300 transition-colors text-left line-clamp-1"
                  >
                    {art.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Historical & Battle Editorials */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5">
              Engineering & Battles
            </h5>
            <ul className="space-y-2 text-xs">
              {articles.slice(5, 10).map(art => (
                <li key={art.id}>
                  <button
                    onClick={() => onSelectArticle(art.slug)}
                    className="hover:text-blue-300 transition-colors text-left line-clamp-1"
                  >
                    {art.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5">
              Automotive Sectors
            </h5>
            <ul className="space-y-2 text-xs">
              {[
                'Hypercars',
                'Supercars',
                'Classics & Heritage',
                'Engineering & Tech',
                'Track & Performance',
                'German Performance',
                'JDM Legends',
                'Collections & Lifestyle'
              ].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-blue-300 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: SEO Index & Credibility */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5">
              Search Index & Keywords
            </h5>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono-spec text-slate-500">
              <span className="hover:text-slate-300 cursor-default">fastest hypercars</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">classic supercars</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">Ferrari 250 GTO price</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">Ferrari vs Lamborghini</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">Koenigsegg Jesko</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">McLaren F1 history</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">road car vs track car</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">BMW M vs AMG vs Audi RS</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">best JDM cars</span>
              <span>·</span>
              <span className="hover:text-slate-300 cursor-default">dream car garage</span>
            </div>
            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed">
              Every editorial is written by veteran automotive engineers and motorsport historians, backed by verified telemetry and factory specifications.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Zero-Slop Standard */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-spec text-slate-600">
          <div>
            © {new Date().getFullYear()} MIDNIGHT MOTORS. All rights reserved. Curated for automotive purists.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-400/80">Clean URL Slugs · Schema.org Validated</span>
            <span>·</span>
            <span>Zero AI-Slop Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
