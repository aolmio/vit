
import React, { useState } from 'react';
import { SYSTEM_GRAMS } from '../constants';
import { RefreshCw, ArrowRightLeft, TrendingUp } from 'lucide-react';

const PriceSystemConverter: React.FC = () => {
  const [oldPrice, setOldPrice] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');

  const handleOldPriceChange = (value: string) => {
    setOldPrice(value);
    if (!value || isNaN(parseFloat(value))) {
      setNewPrice('');
      return;
    }
    const val = parseFloat(value);
    // Logic: (Price / 16.606) * 16.329
    const converted = (val / SYSTEM_GRAMS.OLD) * SYSTEM_GRAMS.NEW;
    setNewPrice(Math.round(converted).toString());
  };

  const handleNewPriceChange = (value: string) => {
    setNewPrice(value);
    if (!value || isNaN(parseFloat(value))) {
      setOldPrice('');
      return;
    }
    const val = parseFloat(value);
    // Logic: (Price / 16.329) * 16.606
    const converted = (val / SYSTEM_GRAMS.NEW) * SYSTEM_GRAMS.OLD;
    setOldPrice(Math.round(converted).toString());
  };

  const handleReset = () => {
    setOldPrice('');
    setNewPrice('');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-xl font-black text-amber-500">ဈေးနှုန်းစနစ် ပြောင်းလဲခြင်း</h2>
        <p className="text-[11px] text-slate-500 font-bold leading-relaxed px-4">
          * စနစ်တစ်ခုခုတွင် ဈေးနှုန်းရိုက်ထည့်ပါက ကျန်တစ်ခုကို အလိုအလျောက်တွက်ပေးပါမည်။
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp size={120} />
        </div>

        <div className="space-y-8 relative z-10">
          {/* စနစ်ဟောင်း Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-amber-500 font-black tracking-widest uppercase">
                စနစ်ဟောင်း ဈေးနှုန်း (၁၆.၆၀၆ ဂရမ်)
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={oldPrice}
                onChange={(e) => handleOldPriceChange(e.target.value)}
                placeholder="၀"
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-6 px-8 text-white text-3xl font-black focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-800"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">ကျပ်</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-slate-800/50 p-3 rounded-full border border-slate-700">
              <ArrowRightLeft className="text-amber-500 rotate-90" size={20} />
            </div>
          </div>

          {/* စနစ်သစ် Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-emerald-500 font-black tracking-widest uppercase">
                စနစ်သစ် ဈေးနှုန်း (၁၆.၃၂၉ ဂရမ်)
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={newPrice}
                onChange={(e) => handleNewPriceChange(e.target.value)}
                placeholder="၀"
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-6 px-8 text-white text-3xl font-black focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-800"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">ကျပ်</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6">
        <h4 className="text-[10px] text-slate-500 font-black uppercase mb-3 text-center">တွက်ချက်မှု အခြေခံ</h4>
        <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-center">
            <div className="text-slate-500 mb-1">စနစ်ဟောင်း</div>
            <div className="text-white">၁ ကျပ် = ၁၆.၆၀၆ ဂရမ်</div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-center">
            <div className="text-slate-500 mb-1">စနစ်သစ်</div>
            <div className="text-white">၁ ကျပ် = ၁၆.၃၂၉ ဂရမ်</div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleReset}
        className="w-full py-4 text-slate-600 hover:text-red-500 font-black text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <RefreshCw size={14} /> အသစ်ပြန်တွက်မည်
      </button>
    </div>
  );
};

export default PriceSystemConverter;
