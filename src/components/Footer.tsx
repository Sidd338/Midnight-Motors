import React, { useState } from 'react';
import { Gauge, ArrowRight, Check, Shield, Car, Bike, Sparkles, ExternalLink } from 'lucide-react';
import { BlogArticle } from '../types/blog';

interface FooterProps {
  articles: BlogArticle[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
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
              An independent private hypercars showroom and digital sanctuary celebrating the apex of internal combustion, aerodynamic physics, analog driving heritage, and high-performance engineering across exotic supercars and luxury motorcycles.
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

        {/* Directory Links Matrix with Inward & Outbound Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-blue-950">
          {/* Column 1: Core Articles with Exact Descriptive Anchor Text (Inward Links) */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5 flex items-center gap-1.5">
              <span>Cornerstone Guides</span>
              <span className="text-[10px] text-slate-500 font-normal">INWARD</span>
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/what-is-a-hypercar"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      onSelectArticle('what-is-a-hypercar');
                    }
                  }}
                  className="hover:text-blue-300 transition-colors text-left flex items-center justify-between group"
                  title="Clean URL: /what-is-a-hypercar"
                >
                  <span>Read what makes a hypercar different</span>
                  <span className="font-mono-spec text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">/what-is-a-hypercar</span>
                </a>
              </li>
              <li>
                <a
                  href="/best-classic-cars-to-invest-in"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      onSelectArticle('best-classic-cars-to-invest-in');
                    }
                  }}
                  className="hover:text-blue-300 transition-colors text-left flex items-center justify-between group"
                  title="Clean URL: /best-classic-cars-to-invest-in"
                >
                  <span>Explore the best classic cars to invest in guide</span>
                  <span className="font-mono-spec text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">/best-classic-cars-to-invest-in</span>
                </a>
              </li>
              <li>
                <a
                  href="/luxury-motorcycles"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      onSelectArticle('luxury-motorcycles');
                    }
                  }}
                  className="hover:text-blue-300 transition-colors text-left flex items-center justify-between group"
                  title="Clean URL: /luxury-motorcycles"
                >
                  <span>Discover our luxury motorcycles showcase</span>
                  <span className="font-mono-spec text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">/luxury-motorcycles</span>
                </a>
              </li>
              <li>
                <a
                  href="/keyword-research"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-1 pt-1"
                >
                  <span>📊 AEO Keyword Table (/keyword-research)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Showroom & Vault Tools (Inward Links) */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5 flex items-center gap-1.5">
              <span>Showroom & Tools</span>
              <span className="text-[10px] text-slate-500 font-normal">INWARD</span>
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('All')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  Explore our hypercars showroom collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Hypercars')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  Browse our exotic supercars collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Superbikes')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  View the ultimate superbikes collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Classics & Heritage')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  Examine our vintage car collection
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Outbound Authorities & Official Archives (Outbound Links) */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5 flex items-center gap-1.5">
              <span>Primary Authorities</span>
              <span className="text-[10px] text-emerald-400 font-normal">OUTBOUND</span>
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://www.fia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Fédération Internationale de l'Automobile Technical Regulations"
                >
                  <span>FIA Hypercar Regulations</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.guinnessworldrecords.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Guinness World Records Production Car Speed Standards"
                >
                  <span>Guinness Speed Records</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.hagerty.com/valuation-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Hagerty Classic Car Price Guide & Blue Chip Index"
                >
                  <span>Hagerty Valuation Tools</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://rmsothebys.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="RM Sotheby's Historic Auction Provenance Archive"
                >
                  <span>RM Sotheby's Provenance</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.fim-moto.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="FIM World Superbike Championship Technical Regulations"
                >
                  <span>FIM WorldSBK Regulations</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iomttraces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Isle of Man TT Official Timing & Telemetry Archive"
                >
                  <span>Isle of Man TT Telemetry</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Factory Engineering Archives (Outbound Links) */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5 flex items-center gap-1.5">
              <span>Factory Archives</span>
              <span className="text-[10px] text-emerald-400 font-normal">OUTBOUND</span>
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://www.bugatti.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Bugatti Molsheim Official 300+ MPH Engineering Whitepaper"
                >
                  <span>Bugatti Molsheim Archive</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.koenigsegg.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Koenigsegg Innovation Lab Jesko Absolut CFD Data"
                >
                  <span>Koenigsegg Innovation Lab</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ducati.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Ducati Corse Racing Division Desmosedici Stradale"
                >
                  <span>Ducati Corse Racing</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://fiva.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Fédération Internationale des Véhicules Anciens"
                >
                  <span>FIVA Preservation Charter</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.goodwood.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors text-left inline-flex items-center gap-1 group"
                  title="Goodwood Festival of Speed Official Hillclimb Shootout"
                >
                  <span>Goodwood Speed Archive</span>
                  <ExternalLink className="w-3 h-3 text-blue-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: SEO Target Keywords & Credibility */}
          <div>
            <h5 className="font-mono-spec text-xs uppercase tracking-widest text-blue-400 font-bold mb-3.5">
              Target SEO Keywords
            </h5>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono-spec text-slate-500">
              <span className="text-blue-300">hypercars showroom</span>
              <span>·</span>
              <span className="text-blue-300">exotic supercars collection</span>
              <span>·</span>
              <span className="text-blue-300">luxury car showroom</span>
              <span>·</span>
              <span className="text-blue-300">what is a hypercar</span>
              <span>·</span>
              <span className="text-blue-300">hypercar vs supercar</span>
              <span>·</span>
              <span className="text-blue-300">fastest hypercars in the world</span>
              <span>·</span>
              <span className="text-blue-300">best classic cars to invest in</span>
              <span>·</span>
              <span className="text-blue-300">exotic classic cars</span>
              <span>·</span>
              <span className="text-blue-300">vintage car collection</span>
              <span>·</span>
              <span className="text-blue-300">luxury motorcycles</span>
              <span>·</span>
              <span className="text-blue-300">superbikes collection</span>
              <span>·</span>
              <span className="text-blue-300">best luxury bikes in the world</span>
            </div>
            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed">
              Every editorial is written by veteran automotive engineers and motorsport historians, backed by verified telemetry and factory specifications.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Compliance Standard */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-spec text-slate-600">
          <div>
            © {new Date().getFullYear()} MIDNIGHT MOTORS. All rights reserved. Curated for automotive purists.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-400/80">Clean Canonical URLs · Schema.org Validated · AEO Ready</span>
            <span>·</span>
            <span>Zero AI-Slop Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
