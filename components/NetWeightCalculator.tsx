
import React, { useState, useMemo } from 'react';
import { GoldWeight } from '../types';
import { SYSTEM_GRAMS } from '../constants';
import { 
  subtractWeights, 
  convertToDecimalKyat,
  normalizeWeight 
} from '../utils/goldMath';
import { 
  Scale, 
  MinusCircle, 
  PlusCircle, 
  RefreshCw,
  ArrowDown
} from 'lucide-react';

const NetWeightCalculator: React.FC = () => {
  const [gross, setGross] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 });
  const [deduct, setDeduct] = useState<GoldWeight>({ kyat: 0, pae: 0, yway: 0 });

  const netWeight = useMemo(() => subtractWeights(gross, deduct), [gross, deduct]);
  const netGrams = useMemo(() => {
    const decimal = convertToDecimalKyat(netWeight.kyat, netWeight.pae, netWeight.yway);
    return decimal * SYSTEM_GRAMS.OLD;
  }, [netWeight]);

  const handleReset = () => {
    setGross({ kyat: 0, pae: 0, yway: 0 });
    setDeduct({ kyat: 0, pae: 0, yway: 0 });
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-1 mb-8">
        <h2 className="text-xl font-black text-amber-500">အသားတင် အလေးချိန် တွက်ချက်ခြင်း</h2>
        <p className="text-[10px] text-slate-500 font-bold">အလေးချိန်များ နှုတ်ရန်</p>
      </div>

      {/* Gross Weight Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 shadow-2xl">
        <div className="flex items-center gap-3 text-amber-500 mb-6">
          <PlusCircle size={20} />
          <h3 className="text-xs font-black">မူလ အလေးချိန်</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['kyat', 'pae', 'yway'].map((unit) => (
            <div key={`gross-${unit}`} className="space-y-3 text-center">
              <label className="text-[10px] text-slate-500 font-black">
                {unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={gross[unit as keyof GoldWeight] || ''}
                placeholder="0"
                onChange={(e) => setGross(prev => normalizeWeight({ ...prev, [unit]: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 text-white text-center font-black text-2xl focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-slate-800 p-2 rounded-full text-slate-500">
          <ArrowDown size={20} />
        </div>
      </div>

      {/* Deduction Weight Input */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-7 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-slate-500 mb-6">
          <MinusCircle size={20} />
          <h3 className="text-xs font-black">နှုတ်ရန် အလေးချိန်</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['kyat', 'pae', 'yway'].map((unit) => (
            <div key={`deduct-${unit}`} className="space-y-3 text-center">
              <input
                type="number"
                inputMode="decimal"
                value={deduct[unit as keyof GoldWeight] || ''}
                placeholder="0"
                onChange={(e) => setDeduct(prev => normalizeWeight({ ...prev, [unit]: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl py-4 text-white text-center font-black text-xl focus:ring-2 focus:ring-red-500/10 outline-none"
              />
              <span className="text-[8px] text-slate-600 font-black">{unit === 'kyat' ? 'ကျပ်' : unit === 'pae' ? 'ပဲ' : 'ရွေး'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-8 text-slate-950 shadow-2xl shadow-amber-500/20">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">အသားတင် အလေးချိန် (ရလဒ်)</span>
          <div className="text-4xl font-black">
            {netWeight.kyat} ကျပ် {netWeight.pae} ပဲ {netWeight.yway} ရွေး
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-950/10 py-2 px-4 rounded-full w-fit mx-auto">
            <Scale size={16} />
            <span className="font-mono font-black">{netGrams.toFixed(3)}g</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleReset}
        className="w-full py-4 text-slate-500 hover:text-red-400 font-black text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <RefreshCw size={14} /> အသစ်ပြန်တွက်မည်
      </button>
    </div>
  );
};

export default NetWeightCalculator;
