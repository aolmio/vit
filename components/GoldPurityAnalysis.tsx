
import React, { useState, useMemo } from 'react';
import { GoldWeight } from '../types';
import { convertToDecimalKyat, decimalToWeight, normalizeWeight, formatCurrency } from '../utils/goldMath';
import { SYSTEM_GRAMS } from '../constants';
import { 
  Info, 
  RefreshCw, 
  FlaskConical,
  Beaker,
  Scale,
  ArrowRightLeft,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';

const PURITY_TABLE = [
  { label: '၁၆ ပဲရည် (အခေါက်)', density: '19.25 - 19.30', percentage: '99.9% - 100%', minD: 19.25 },
  { label: '၁၅ ပဲ ၂ ရွေး (အကယ်ဒမီ)', density: '18.50 - 18.70', percentage: '95.3%', minD: 18.50 },
  { label: '၁၅ ပဲရည်', density: '17.80 - 18.00', percentage: '93.75%', minD: 17.80 },
  { label: '၁၄ ပဲရည်', density: '16.50 - 16.80', percentage: '87.5%', minD: 16.50 },
  { label: '၁၃ ပဲရည်', density: '15.40 - 15.70', percentage: '81.25%', minD: 15.40 },
  { label: '၁၂ ပဲရည် (၇၅% ရွှေ)', density: '14.50 - 14.80', percentage: '75.0%', minD: 14.50 },
  { label: '၁၁ ပဲရည်', density: '13.60 - 13.90', percentage: '68.75%', minD: 13.60 },
  { label: '၁၀ ပဲရည်', density: '12.80 - 13.10', percentage: '62.5%', minD: 12.80 },
];

type SubTab = 'purity' | 'yield';

const GoldPurityAnalysis: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('purity');
  const [system, setSystem] = useState<'OLD' | 'NEW'>('OLD');
  
  // Purity Tab State
  const [p1, setP1] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 }); // မူလအထည်ပျက်
  const [p2, setP2] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 }); // ချွတ်ပြီးရရှိသော အခေါက်ရွှေ

  // Yield Tab State
  const [y1, setY1] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 }); // အထည်ပျက်
  const [densityInput, setDensityInput] = useState<string>('');
  const [paeInput, setPaeInput] = useState<string>('');

  // Purity & Density Calculation
  const purityAndDensity = useMemo(() => {
    const scrapDec = convertToDecimalKyat(p1.kyat, p1.pae, p1.yway);
    const pureDec = convertToDecimalKyat(p2.kyat, p2.pae, p2.yway);
    
    if (scrapDec <= 0) return { pae: 0, density: 0, label: '-' };

    // Formula 1: Purity = (Pure / Scrap) * 16
    const paeResult = (pureDec / scrapDec) * 16;
    
    // Formula 2: Density = (Pure / Scrap) * 19.25
    const densityResult = (pureDec / scrapDec) * 19.25;

    // Find nearest label from table
    const matched = PURITY_TABLE.find(item => densityResult >= item.minD);

    return {
      pae: paeResult,
      density: densityResult,
      label: matched ? matched.label : 'အရည်အသွေးနိမ့်'
    };
  }, [p1, p2]);

  // Yield Calculation
  const yieldResult = useMemo(() => {
    const scrapDec = convertToDecimalKyat(y1.kyat, y1.pae, y1.yway);
    let pureDec = 0;
    let method = '';

    if (paeInput && !densityInput) {
      // Formula 3(a): (Pae / 16) * Scrap Weight
      const p = parseFloat(paeInput) || 0;
      pureDec = (p / 16) * scrapDec;
      method = 'ပဲရည်ဖြင့်တွက်ချက်မှု';
    } else if (densityInput) {
      // Formula 3(b): (Density / 19.25) * Scrap Weight
      const d = parseFloat(densityInput) || 0;
      pureDec = (d / 19.25) * scrapDec;
      method = 'Density ဖြင့်တွက်ချက်မှု';
    }

    const resultWeight = decimalToWeight(pureDec);
    const grams = pureDec * SYSTEM_GRAMS[system];

    return {
      weight: resultWeight,
      grams: grams,
      method: method
    };
  }, [y1, densityInput, paeInput, system]);

  const handleReset = () => {
    setP1({ kyat: 0, pae: 0, yway: 0 });
    setP2({ kyat: 0, pae: 0, yway: 0 });
    setY1({ kyat: 0, pae: 0, yway: 0 });
    setDensityInput('');
    setPaeInput('');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-black text-amber-500">အခေါက်ချွတ်တွက်စက်</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-slate-800"></span>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Purity & Yield Analysis</p>
          <span className="h-px w-8 bg-slate-800"></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 p-1.5 rounded-3xl border border-slate-800 flex gap-1 shadow-inner ring-1 ring-slate-800/50">
        <button 
          onClick={() => setActiveSubTab('purity')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black transition-all ${activeSubTab === 'purity' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:bg-slate-800'}`}
        >
          <FlaskConical size={16} /> အရည်အသွေးတွက်
        </button>
        <button 
          onClick={() => setActiveSubTab('yield')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black transition-all ${activeSubTab === 'yield' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:bg-slate-800'}`}
        >
          <Beaker size={16} /> အသားတင်ထွက်နှုန်း
        </button>
      </div>

      {/* Logic Reference Box */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Zap size={80} className="text-amber-500" />
        </div>
        <div className="flex items-center gap-3 text-amber-500 relative z-10">
          <Info size={18} />
          <span className="text-[11px] font-black uppercase tracking-wider">💡 Density အညွှန်းကိန်းများ</span>
        </div>
        <div className="text-[11px] text-slate-400 font-bold leading-relaxed relative z-10">
          ၁၆ပဲရည် ရွှေတစ်ကျပ်သားတွင် <b className="text-amber-400 font-black">19.25</b> Density ရှိပြီး ၁၅ပဲရည်သည် <b className="text-amber-400 font-black">17.80</b> Density ဖြစ်ပါသည်။
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px] font-black relative z-10">
          {PURITY_TABLE.slice(3, 7).map((pt, idx) => (
            <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">{pt.label.split(' ')[0]} ပဲရည်</span>
              <span className="text-white">≈ {pt.density.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {activeSubTab === 'purity' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 shadow-2xl space-y-6">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2">
                <ChevronRight size={14} className="text-amber-500" /> အထည်ပျက် အလေးချိန်
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['kyat', 'pae', 'yway'].map((unit) => (
                  <div key={`p1-${unit}`} className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={p1[unit as keyof GoldWeight] || ''}
                      placeholder="0"
                      onChange={(e) => setP1(prev => normalizeWeight({ ...prev, [unit]: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-transparent text-white text-center font-black text-xl outline-none"
                    />
                    <div className="text-[8px] text-slate-700 font-black text-center uppercase mt-1">{unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-amber-500 uppercase flex items-center gap-2">
                <ChevronRight size={14} className="text-amber-500" /> ချွတ်ပြီးရရှိသော အခေါက်ရွှေ
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['kyat', 'pae', 'yway'].map((unit) => (
                  <div key={`p2-${unit}`} className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={p2[unit as keyof GoldWeight] || ''}
                      placeholder="0"
                      onChange={(e) => setP2(prev => normalizeWeight({ ...prev, [unit]: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-transparent text-white text-center font-black text-xl outline-none"
                    />
                    <div className="text-[8px] text-slate-700 font-black text-center uppercase mt-1">{unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purity Results Card */}
          <div className="bg-amber-500 rounded-[2.5rem] p-8 text-slate-950 shadow-2xl relative overflow-hidden group">
            <FlaskConical className="absolute -right-6 -bottom-6 text-slate-950/10 group-hover:scale-110 transition-transform duration-700" size={160} />
            <div className="relative z-10 space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">တွက်ချက်ရရှိသော ပဲရည်</span>
                <div className="text-6xl font-black tracking-tighter my-2">
                  {purityAndDensity.pae.toFixed(2)} <span className="text-2xl">ပဲ</span>
                </div>
                <div className="inline-block bg-slate-950/10 px-4 py-1.5 rounded-full text-[11px] font-black">
                  {purityAndDensity.label}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-950/15 flex justify-between items-center">
                <div className="flex flex-col items-center flex-1 border-r border-slate-950/10">
                  <span className="text-[9px] font-black uppercase opacity-60">Density (g/cm³)</span>
                  <span className="text-xl font-black font-mono">{purityAndDensity.density.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[9px] font-black uppercase opacity-60">ရွှေပါဝင်မှု</span>
                  <span className="text-xl font-black font-mono">{((purityAndDensity.pae / 16) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-500">
           {/* System Toggle for Yield Results */}
           <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-xl text-amber-500"><ArrowRightLeft size={16} /></div>
              <div>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter block">တွက်ချက်မှုစံနှုန်း</span>
                <span className="text-xs text-white font-black">{system === 'OLD' ? 'စနစ်ဟောင်း' : 'စနစ်သစ်'} ({SYSTEM_GRAMS[system]}g)</span>
              </div>
            </div>
            <button 
              onClick={() => setSystem(s => s === 'OLD' ? 'NEW' : 'OLD')}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-[10px] font-black"
            >
              စနစ်ပြောင်းရန်
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 shadow-2xl space-y-6">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase">အထည်ပျက် အလေးချိန်</label>
              <div className="grid grid-cols-3 gap-3">
                {['kyat', 'pae', 'yway'].map((unit) => (
                  <div key={`y1-${unit}`} className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={y1[unit as keyof GoldWeight] || ''}
                      placeholder="0"
                      onChange={(e) => setY1(prev => normalizeWeight({ ...prev, [unit]: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-transparent text-white text-center font-black text-xl outline-none"
                    />
                    <div className="text-[8px] text-slate-700 font-black text-center uppercase mt-1">{unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase">Density (စက်ပွိုင့်)</label>
                <input
                  type="number"
                  step="0.01"
                  value={densityInput}
                  onChange={(e) => {
                    setDensityInput(e.target.value);
                    setPaeInput('');
                  }}
                  placeholder="ဥပမာ- 17.51"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white text-xl font-black outline-none placeholder:text-slate-800"
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="px-4 text-[9px] text-slate-600 font-black uppercase italic">သို့မဟုတ်</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase">ပဲရည် သိလျှင်ရိုက်ထည့်ပါ</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={paeInput}
                    onChange={(e) => {
                      setPaeInput(e.target.value);
                      setDensityInput('');
                    }}
                    placeholder="ဥပမာ- 14.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-amber-500 text-xl font-black outline-none placeholder:text-slate-800"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 font-black text-sm">ပဲ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Yield Results Card */}
          <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-slate-950 shadow-2xl relative overflow-hidden group">
            <Beaker className="absolute -right-6 -bottom-6 text-slate-950/10 group-hover:scale-110 transition-transform duration-700" size={160} />
            <div className="relative z-10 text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">မျှော်မှန်းထွက်ရှိနိုင်သော အခေါက်ရွှေ (၂၄K)</span>
              
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight leading-none">
                  {yieldResult.weight.kyat}K {yieldResult.weight.pae}P {yieldResult.weight.yway}Y
                </div>
                <div className="flex items-center justify-center gap-2 text-3xl font-black font-mono">
                  <Scale size={24} className="opacity-60" />
                  <span>{yieldResult.grams.toFixed(4)}g</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-950/15 flex flex-wrap justify-center gap-2">
                <div className="bg-slate-950/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Activity size={12} />
                  <span className="text-[9px] font-black uppercase">{yieldResult.method || 'တွက်ချက်မှုနည်းလမ်း'}</span>
                </div>
                <div className="bg-slate-950/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase">စံနှုန်း: {system === 'OLD' ? '၁၆.၆၀၆' : '၁၆.၃၂၉'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 text-center">
        <button 
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-500 font-black text-xs transition-colors shadow-lg"
        >
          <RefreshCw size={14} /> အချက်အလက်များ အသစ်ပြန်တွက်မည်
        </button>
      </div>
    </div>
  );
};

export default GoldPurityAnalysis;
