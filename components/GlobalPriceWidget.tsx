
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Globe, AlertCircle, X, Clock } from 'lucide-react';

const CACHE_KEY = 'world_gold_cache_gp_v4';
const GOLD_PRICE_ORG_ENDPOINT = 'https://data-asg.goldprice.org/dbXRates/USD';

interface PriceState {
  price: number;
  change: number;
  pct: number;
  lastUpdatedText: string;
  isRealData: boolean;
}

const GlobalPriceWidget: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceState>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const c = JSON.parse(cached);
        return {
          price: c.price || 2720.50,
          change: c.change || 0,
          pct: c.pct || 0,
          lastUpdatedText: c.lastUpdatedText || '--:--',
          isRealData: true
        };
      } catch (e) {
        return { price: 2720.50, change: 0, pct: 0, lastUpdatedText: '--:--', isRealData: false };
      }
    }
    return { price: 2720.50, change: 0, pct: 0, lastUpdatedText: '--:--', isRealData: false };
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);

  const fetchGoldPrice = useCallback(async (isAuto = false) => {
    const lastFetch = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}').savedAt || 0;
    if (isAuto && Date.now() - lastFetch < 60000) return;

    setIsRefreshing(true);
    setErrorStatus(false);

    try {
      const response = await fetch(GOLD_PRICE_ORG_ENDPOINT, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json();
      const item = data?.items?.[0];

      if (item && typeof item.xauPrice === 'number') {
        const newData: PriceState = {
          price: item.xauPrice,
          change: Number(item.chgXau ?? 0),
          pct: Number(item.pcXau ?? 0),
          lastUpdatedText: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRealData: true
        };

        setPriceData(newData);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          ...newData,
          savedAt: Date.now()
        }));
      } else {
        throw new Error("Invalid data");
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setErrorStatus(true);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGoldPrice();
    const interval = setInterval(() => fetchGoldPrice(true), 120000); 
    return () => clearInterval(interval);
  }, [fetchGoldPrice]);

  if (!isVisible) return (
    <button 
      onClick={() => setIsVisible(true)}
      className="fixed bottom-[calc(1.5rem + env(safe-area-inset-bottom))] right-6 bg-amber-500/90 backdrop-blur-md text-slate-950 p-3 rounded-full shadow-lg z-[60] animate-in fade-in zoom-in duration-300 active:scale-90 transition-all border border-white/10"
      aria-label="Show world gold price"
    >
      <Globe size={20} strokeWidth={2.5} />
    </button>
  );

  const isUp = priceData.change > 0;
  const isDown = priceData.change < 0;
  const changeColor = isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-slate-500';
  const changeBg = isUp ? 'bg-emerald-400/5' : isDown ? 'bg-rose-400/5' : 'bg-slate-500/5';

  return (
    <div className="fixed bottom-[calc(1.2rem + env(safe-area-inset-bottom))] left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-[60] animate-in slide-in-from-bottom-2 duration-300">
      <div className={`bg-slate-950/85 backdrop-blur-2xl border border-slate-800/60 rounded-[2rem] shadow-2xl p-1.5 pl-4 flex items-center justify-between gap-4 ring-1 ring-white/5 transition-all`}>
        
        {/* Main Price & Trend */}
        <div className="flex items-center gap-4 py-1.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tighter font-mono">
                ${priceData.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg ${changeBg} ${changeColor} text-[10px] font-black border border-white/5`}>
                {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : null}
                <span>{isUp ? '+' : ''}{priceData.change.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider ${changeColor} opacity-70`}>
                {Math.abs(priceData.pct).toFixed(2)}%
              </span>
              <span className="text-slate-700 text-[8px]">•</span>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                <Clock size={10} className="opacity-50" />
                {priceData.lastUpdatedText}
              </div>
            </div>
          </div>
          
          <div className="h-6 w-px bg-slate-800/60 hidden sm:block mx-1"></div>
          
          <div className="hidden sm:flex flex-col pr-2">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Global</span>
            <span className="text-[9px] font-black text-amber-500/40 uppercase tracking-tighter">GoldPrice.org</span>
          </div>
        </div>

        {/* Discreet Controls */}
        <div className="flex items-center gap-0.5 bg-white/5 rounded-2xl p-0.5">
          <button 
            onClick={() => fetchGoldPrice(false)}
            disabled={isRefreshing}
            className={`p-2.5 rounded-[1.25rem] text-slate-400 hover:text-white hover:bg-white/5 transition-all ${isRefreshing ? 'animate-spin' : 'active:scale-90'}`}
          >
            <RefreshCw size={13} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2.5 rounded-[1.25rem] text-slate-600 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        {errorStatus && (
          <div className="absolute -top-1 right-12 translate-y-[-100%] animate-bounce">
            <AlertCircle size={12} className="text-rose-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalPriceWidget;
