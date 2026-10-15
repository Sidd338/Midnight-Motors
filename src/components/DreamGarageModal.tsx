import React, { useState } from 'react';
import { X, Check, Compass, Car, Bike, Sparkles, Share2, Shield, Flame } from 'lucide-react';

interface DreamGarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadArticle10: () => void;
}

interface GarageSlot {
  slotId: string;
  slotName: string;
  category: string;
  options: {
    id: string;
    name: string;
    specs: string;
    hp: number;
    valueEstimate: number;
    image: string;
    type: 'car' | 'bike';
  }[];
}

const GARAGE_SLOTS: GarageSlot[] = [
  {
    slotId: 'daily',
    slotName: 'Slot 1: The Everyday Performance Weapon',
    category: 'Daily Driver',
    options: [
      {
        id: 'gt3-touring',
        name: 'Porsche 911 GT3 Touring (992)',
        specs: '4.0L Flat-6 · 502 HP · 6-Speed Manual',
        hp: 502,
        valueEstimate: 185000,
        image: '/cars/gt3-touring.jpg',
        type: 'car'
      },
      {
        id: 'rs6-avant',
        name: 'Audi RS6 Avant Performance',
        specs: '4.0L Twin-Turbo V8 · 621 HP · Quattro AWD',
        hp: 621,
        valueEstimate: 130000,
        image: '/cars/rs6-avant.jpg',
        type: 'car'
      },
      {
        id: 'bmw-m3-cs',
        name: 'BMW M3 CS (G80)',
        specs: '3.0L Twin-Turbo S58 · 543 HP · M xDrive',
        hp: 543,
        valueEstimate: 119000,
        image: '/cars/bmw-m3-cs.jpg',
        type: 'car'
      }
    ]
  },
  {
    slotId: 'jdm',
    slotName: 'Slot 2: The JDM Golden Era Icon',
    category: 'JDM Legend',
    options: [
      {
        id: 'skyline-r34',
        name: 'Nissan Skyline GT-R R34 V-Spec II Nür',
        specs: '2.6L RB26DETT N1 · 330 HP (Actual) · ATTESA AWD',
        hp: 330,
        valueEstimate: 380000,
        image: '/cars/skyline-r34.jpg',
        type: 'car'
      },
      {
        id: 'supra-mk4',
        name: 'Toyota Supra Turbo MK4 (A80)',
        specs: '3.0L 2JZ-GTE · 320 HP · Getrag 6-Speed',
        hp: 320,
        valueEstimate: 150000,
        image: '/cars/supra-mk4.jpg',
        type: 'car'
      },
      {
        id: 'rx7-spirit-r',
        name: 'Mazda RX-7 Spirit R Type-A (FD3S)',
        specs: '1.3L 13B-REW Twin-Rotor · 276 HP · 50:50 Balance',
        hp: 276,
        valueEstimate: 140000,
        image: '/cars/rx7-spirit-r.jpg',
        type: 'car'
      }
    ]
  },
  {
    slotId: 'classic',
    slotName: 'Slot 3: The Blue-Chip Historic Sculpture',
    category: 'Vintage Classic',
    options: [
      {
        id: 'ferrari-250-gto',
        name: '1962 Ferrari 250 GTO (Homologato)',
        specs: '3.0L Colombo V12 · 296 HP · Scaglietti Aluminum',
        hp: 296,
        valueEstimate: 70000000,
        image: '/cars/ferrari-250-gto.jpg',
        type: 'car'
      },
      {
        id: 'ferrari-f40',
        name: '1989 Ferrari F40 (Non-Cat Purist)',
        specs: '2.9L Twin-Turbo V8 · 471 HP · Kevlar Body',
        hp: 471,
        valueEstimate: 3200000,
        image: '/cars/ferrari-f40.jpg',
        type: 'car'
      },
      {
        id: 'porsche-959',
        name: '1987 Porsche 959 Komfort',
        specs: '2.85L Sequential Biturbo · 444 HP · PSK AWD',
        hp: 444,
        valueEstimate: 2100000,
        image: '/cars/porsche-959.jpg',
        type: 'car'
      }
    ]
  },
  {
    slotId: 'track',
    slotName: 'Slot 4: The Circuit Apex Scythe',
    category: 'Track Special',
    options: [
      {
        id: 'gt3-rs',
        name: 'Porsche 911 GT3 RS Weissach (992)',
        specs: '4.0L Flat-6 · 518 HP · 860 kg Downforce',
        hp: 518,
        valueEstimate: 320000,
        image: '/cars/gt3-rs.jpg',
        type: 'car'
      },
      {
        id: 'ferrari-296-fiorano',
        name: 'Ferrari 296 GTB Assetto Fiorano',
        specs: '3.0L Twin-Turbo V6 Hybrid · 819 HP · Multimatic Dampers',
        hp: 819,
        valueEstimate: 380000,
        image: '/cars/ferrari-296.jpg',
        type: 'car'
      }
    ]
  },
  {
    slotId: 'hypercar',
    slotName: 'Slot 5: The Halo Hypercar Sovereign',
    category: 'Halo Hypercar',
    options: [
      {
        id: 'mclaren-f1',
        name: '1995 McLaren F1 Road Car (Chassis #044)',
        specs: '6.1L BMW S70/2 V12 · 618 HP · 240.1 MPH Record',
        hp: 618,
        valueEstimate: 22000000,
        image: '/cars/mclaren-f1.jpg',
        type: 'car'
      },
      {
        id: 'koenigsegg-jesko',
        name: 'Koenigsegg Jesko Absolut',
        specs: '5.0L Twin-Turbo V8 · 1,600 HP on E85 · 9-Speed LST',
        hp: 1600,
        valueEstimate: 3600000,
        image: '/cars/koenigsegg-jesko.jpg',
        type: 'car'
      },
      {
        id: 'bugatti-chiron-ss',
        name: 'Bugatti Chiron Super Sport 300+',
        specs: '8.0L Quad-Turbo W16 · 1,578 HP · 304.77 MPH',
        hp: 1578,
        valueEstimate: 4200000,
        image: '/cars/bugatti-chiron.jpg',
        type: 'car'
      }
    ]
  },
  {
    slotId: 'bike',
    slotName: 'Slot 6: The Two-Wheel Track Missile (Superbike)',
    category: 'Superbike Bay',
    options: [
      {
        id: 'ducati-v4-sp2',
        name: 'Ducati Panigale V4 SP2',
        specs: '1,103cc Desmosedici Stradale V4 · 215.5 HP · Carbon Rims',
        hp: 215,
        valueEstimate: 40500,
        image: '/cars/ducati-v4-sp2.jpg',
        type: 'bike'
      },
      {
        id: 'kawasaki-h2r',
        name: 'Kawasaki Ninja H2R Supercharged',
        specs: '998cc Supercharged Inline-4 · 310 HP · Carbon Winglets',
        hp: 310,
        valueEstimate: 57000,
        image: '/cars/kawasaki-h2r.jpg',
        type: 'bike'
      }
    ]
  }
];

export const DreamGarageModal: React.FC<DreamGarageModalProps> = ({
  isOpen,
  onClose,
  onReadArticle10
}) => {
  const [selections, setSelections] = useState<Record<string, string>>({
    daily: 'gt3-touring',
    jdm: 'skyline-r34',
    classic: 'ferrari-250-gto',
    track: 'gt3-rs',
    hypercar: 'koenigsegg-jesko',
    bike: 'ducati-v4-sp2'
  });

  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  // Calculate totals
  let totalHp = 0;
  let totalValue = 0;

  GARAGE_SLOTS.forEach(slot => {
    const selectedOpt = slot.options.find(o => o.id === selections[slot.slotId]);
    if (selectedOpt) {
      totalHp += selectedOpt.hp;
      totalValue += selectedOpt.valueEstimate;
    }
  });

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M USD`;
    }
    return `$${(val / 1000).toFixed(0)}k USD`;
  };

  const handleShareGarage = () => {
    const summary = `My Midnight Motors Dream Garage: Total ${totalHp} Horsepower, Valuation ${formatCurrency(
      totalValue
    )}! Built inspired by Article 10.`;
    navigator.clipboard.writeText(summary);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#090e1a] border border-blue-800/40 rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-blue-900/40 bg-[#070b14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                  The Midnight Vault Garage Builder
                </span>
                <span className="text-[10px] font-mono-spec font-semibold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Article 10 Companion Tool
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Curate your 5 essential cars plus 1 track superbike. Calculate combined horsepower and valuation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 bg-[#05080f] border-b border-blue-950 text-xs font-mono-spec">
          <div className="p-2.5 bg-blue-950/30 border border-blue-900/30 rounded-lg">
            <span className="text-slate-500 text-[10px] uppercase block">Total Stable Power</span>
            <span className="text-base sm:text-lg font-bold text-blue-400">
              {totalHp.toLocaleString()} HP
            </span>
          </div>

          <div className="p-2.5 bg-blue-950/30 border border-blue-900/30 rounded-lg">
            <span className="text-slate-500 text-[10px] uppercase block">Estimated Valuation</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">
              {formatCurrency(totalValue)}
            </span>
          </div>

          <div className="p-2.5 bg-blue-950/30 border border-blue-900/30 rounded-lg">
            <span className="text-slate-500 text-[10px] uppercase block">Vehicle Balance</span>
            <span className="text-base sm:text-lg font-bold text-slate-200">5 Cars · 1 Bike</span>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleShareGarage}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-950"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Spec Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Garage</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Garage Slots Selection List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {GARAGE_SLOTS.map(slot => (
            <div key={slot.slotId} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono-spec">
                <span className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {slot.slotId === 'bike' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                  {slot.slotName}
                </span>
                <span className="text-slate-500">{slot.category}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {slot.options.map(opt => {
                  const isSelected = selections[slot.slotId] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() =>
                        setSelections(prev => ({ ...prev, [slot.slotId]: opt.id }))
                      }
                      className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/50 shadow-md shadow-blue-950'
                          : 'bg-[#080d1a] border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-2.5">
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 p-1 bg-blue-600 rounded-full text-white shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-display text-xs sm:text-sm font-bold text-white line-clamp-1 mb-1">
                          {opt.name}
                        </h5>
                        <p className="text-[11px] font-mono-spec text-slate-400 mb-2">
                          {opt.specs}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono-spec">
                        <span className="text-blue-300 font-semibold">{opt.hp} HP</span>
                        <span className="text-emerald-400 font-medium">
                          {formatCurrency(opt.valueEstimate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer with link to read Article 10 */}
        <div className="p-4 bg-[#070b14] border-t border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Based on our viral technical editorial:{' '}
            <button
              onClick={() => {
                onClose();
                onReadArticle10();
              }}
              className="text-blue-400 hover:underline font-semibold"
            >
              "Building the Ultimate Dream Garage: Five Cars Every Enthusiast Yearns For" →
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
          >
            Close Vault Builder
          </button>
        </div>
      </div>
    </div>
  );
};
