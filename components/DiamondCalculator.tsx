
import React, { useState, useMemo } from 'react';
import { Gem, RefreshCw, Scale, Calculator, Info, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/goldMath';

type PriceType = 'carat' | 'ratti';

const DiamondCalculator: React.FC = () => {
  const [priceType, setPriceType] = useState<PriceType>('carat');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  
  // Weight States
  const [carat, setCarat] = useState<string>('');
  const [ratti, setRatti] = useState<string>('');
  const [bee, setBee] = useState<string>('');
  const [point, setPoint] = useState<string>('');

  /**
   * FORMULA LOGIC:
   * 1 Ct (ကာရက်) = 1.1 R (ရတီ)
   * 1 R (ရတီ) = 20 B (ဘီ)
   * 1 B (ဘီ) = 8 Points (ပိုင်း)
   * Total Points in 1 Ratti = 20 * 8 = 160
   */
  const CARAT_TO_RATTI = 1.1;
  const RATTI_TO_CARAT = 1 / 1.1;
  const BEE_IN_RATTI = 20;
  const POINT_IN_BEE = 8;
  const POINT_IN_RATTI = BEE_IN_RATTI * POINT_IN_BEE; // 160

  const equivPrice = useMemo(() => {
    const val = parseFloat(pricePerUnit) || 0;
    if (val <= 0) return null;
    if (priceType === 'carat') {
      // If 1 Ct = X, then 1 Ratti = X / 1.1
      const perRatti = val * RATTI_TO_CARAT;
      return `၁ ရတီ ဈေးနှုန်း: ${formatCurrency(Math.round(perRatti))}`;
    } else {
      // If 1 Ratti = X, then 1 Ct = X * 1.1
      const perCarat = val * CARAT_TO_RATTI;
      return `၁ ကာရက် ဈေးနှုန်း: ${formatCurrency(Math.round(perCarat))}`;
    }
  }, [pricePerUnit, priceType, RATTI_TO_CARAT]);

  const syncWeights = (source: 'ct' | 'unit', value: string, field?: string) => {
    if (source === 'ct') {
      setCarat(value);
      const ctVal = parseFloat(value) || 0;
      const totalRatti = ctVal * CARAT_TO_RATTI;
      
      const rVal = Math.floor(totalRatti);
      const remainingPoints = (totalRatti - rVal) * POINT_IN_RATTI;
      const bVal = Math.floor(remainingPoints / POINT_IN_BEE);
      const pVal = Math.round(remainingPoints % POINT_IN_BEE);

      setRatti(rVal > 0 ? rVal.toString() : '');
      setBee(bVal > 0 ? bVal.toString() : '');
      setPoint(pVal > 0 ? pVal.toString() : '');
    } else {
      // Logic for unit sync (R, B, P)
      let rNum = parseFloat(field === 'r' ? value : ratti) || 0;
      let bNum = parseFloat(field === 'b' ? value : bee) || 0;
      let pNum = parseFloat(field === 'p' ? value : point) || 0;

      if (field === 'r') setRatti(value);
      if (field === 'b') setBee(value);
      if (field === 'p') setPoint(value);

      // Total Ratti = R + (B/20) + (P/160)
      const totalRatti = rNum + (bNum / BEE_IN_RATTI) + (pNum / POINT_IN_RATTI);
      const calculatedCt = totalRatti / CARAT_TO_RATTI;
      setCarat(calculatedCt > 0 ? calculatedCt.toFixed(4) : '');
    }
  };

  const totalPrice = useMemo(() => {
    const p = parseFloat(pricePerUnit) || 0;
    const ct = parseFloat(carat) || 0;
    const r = parseFloat(ratti) || 0;
    const b = parseFloat(bee) || 0;
    const pp = parseFloat(point) || 0;

    if (p <= 0) return 0;

    if (priceType === 'carat') {
      return p * ct;
    } else {
      // If price is per Ratti, we use the total ratti units
      const totalR = r + (b / BEE_IN_RATTI) + (pp / POINT_IN_RATTI);
      return p * totalR;
    }
  }, [pricePerUnit, carat, ratti, bee, point, priceType, BEE_IN_RATTI, POINT_IN_RATTI]);

  const handleReset = () => {
    setPricePerUnit('');
    setCarat('');
    setRatti('');
    setBee('');
    setPoint('');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-black text-cyan-400">စိန်ဈေးနှုန်းတွက်စက်</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-slate-800"></span>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Diamond Pricing Pro</p>
          <span className="h-px w-8 bg-slate-800"></span>
        </div>
      </div>

      {/* Price Setting Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 shadow-2xl space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Gem size={80} className="text-cyan-400" />
        </div>
        
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2">
            <ChevronRight size={14} className="text-cyan-400" /> ဈေးနှုန်းသတ်မှတ်ချက်
          </label>
          <select 
            value={priceType}
            onChange={(e) => setPriceType(e.target.value as PriceType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm font-black focus:ring-2 focus:ring-cyan-500/20 outline-none appearance-none cursor-pointer"
          >
            <option value="carat">၁ ကာရက် ဈေးနှုန်း (Per Carat)</option>
            <option value="ratti">၁ ရတီ ဈေးနှုန်း (Per Ratti)</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2">
            ဈေးနှုန်း (ကျပ်)
          </label>
          <div className="relative">
            <input 
              type="number" 
              inputMode="numeric"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              placeholder="ဈေးနှုန်းထည့်ပါ..."
              className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-6 px-8 text-cyan-400 text-3xl font-black outline-none focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-800"
            />
          </div>
          {equivPrice && (
            <div className="text-[10px] font-black text-cyan-600 italic px-4 animate-in fade-in duration-300">
              {equivPrice}
            </div>
          )}
        </div>
      </div>

      {/* Weight Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 text-cyan-400">
           <Scale size={18} />
           <h3 className="text-xs font-black uppercase">စိန်အလေးချိန်</h3>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-500 uppercase">ကာရက် (Carat)</label>
          <input 
            type="number" 
            step="0.0001"
            inputMode="decimal"
            value={carat}
            onChange={(e) => syncWeights('ct', e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-white text-2xl font-black outline-none focus:ring-2 focus:ring-cyan-500/10"
          />
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-1 h-px bg-slate-800"></div>
          <span className="px-4 text-[9px] text-slate-600 font-black uppercase tracking-widest italic">Auto-Sync</span>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-500 uppercase">ရတီ / ဘီ / ပိုင်း (Myanmar Units)</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-cyan-500/10">
                <input 
                  type="number"
                  inputMode="decimal"
                  value={ratti}
                  onChange={(e) => syncWeights('unit', e.target.value, 'r')}
                  className="w-full bg-transparent text-white text-center font-black text-xl outline-none"
                  placeholder="0"
                />
                <div className="text-[9px] text-slate-600 font-black text-center uppercase mt-1">ရတီ (R)</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-cyan-500/10">
                <input 
                  type="number"
                  inputMode="decimal"
                  value={bee}
                  onChange={(e) => syncWeights('unit', e.target.value, 'b')}
                  className="w-full bg-transparent text-white text-center font-black text-xl outline-none"
                  placeholder="0"
                />
                <div className="text-[9px] text-slate-600 font-black text-center uppercase mt-1">ဘီ (B)</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-cyan-500/10">
                <input 
                  type="number"
                  inputMode="decimal"
                  value={point}
                  onChange={(e) => syncWeights('unit', e.target.value, 'p')}
                  className="w-full bg-transparent text-white text-center font-black text-xl outline-none"
                  placeholder="0"
                />
                <div className="text-[9px] text-slate-600 font-black text-center uppercase mt-1">ပိုင်း (P)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-cyan-500/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 text-center space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">စုစုပေါင်း ကျသင့်ငွေ</span>
          <div className="text-5xl font-black tracking-tighter drop-shadow-md">
            {formatCurrency(Math.round(totalPrice))}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="bg-slate-950/20 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Calculator size={14} className="opacity-60" />
              <span className="text-[11px] font-black">
                {priceType === 'carat' ? `${carat || '0'} Ct` : `${(parseFloat(ratti)||0) + ((parseFloat(bee)||0)/20) + ((parseFloat(point)||0)/160)} R`} x {formatCurrency(parseFloat(pricePerUnit) || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center pb-12">
        <button 
          onClick={handleReset}
          className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-500 hover:border-red-500/30 font-black text-xs transition-all active:scale-95 shadow-xl"
        >
          <RefreshCw size={16} /> အချက်အလက်များ အသစ်ပြန်တွက်မည်
        </button>
      </div>

      {/* Reference Footer */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-start gap-4">
        <Info className="text-cyan-500 mt-1 flex-shrink-0" size={18} />
        <div className="text-[10px] text-slate-400 font-bold leading-relaxed">
          ၁ ကာရက်သည် မြန်မာ့စံနှုန်းအရ ၁.၁ ရတီ (Ratti) နှင့် ညီမျှပါသည်။ <br/>
          စံနှုန်း: ၁ ရတီ = ၂၀ ဘီ (B), ၁ ဘီ = ၈ ပိုင်း (Points)။<br/>
          ရတီမှ ကာရက်ဖွဲ့လိုပါက ၁.၁ နှင့် စား၍ တွက်ချက်နိုင်ပါသည်။
        </div>
      </div>
    </div>
  );
};

export default DiamondCalculator;
