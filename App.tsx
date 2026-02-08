
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import NetWeightCalculator from './components/NetWeightCalculator';
import PriceSystemConverter from './components/PriceSystemConverter';
import GoldPurityAnalysis from './components/GoldPurityAnalysis';
import DiamondCalculator from './components/DiamondCalculator';
import GlobalPriceWidget from './components/GlobalPriceWidget';
import AboutApp from './components/AboutApp';
import { HistoryItem } from './types';
import { formatCurrency } from './utils/goldMath';
import { 
  Coins, 
  History as HistoryIcon, 
  LayoutDashboard, 
  Trash2, 
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Scale,
  Info,
  ArrowRightLeft,
  Droplets,
  Gem
} from 'lucide-react';

type TabType = 'calc' | 'history' | 'net' | 'price-conv' | 'purity' | 'diamond' | 'about';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calc');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('gold_calc_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gold_calc_history', JSON.stringify(history));
  }, [history]);

  const handleSaveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
    setActiveTab('history');
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const clearHistory = () => {
    if (confirm('အရောင်းမှတ်တမ်းအားလုံးကို ဖျက်ရန် သေချာပါသလား?')) setHistory([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const menuItems = [
    { id: 'calc', label: 'အရောင်းတွက်စက်', icon: LayoutDashboard },
    { id: 'net', label: 'အသားတင်အလေးချိန်တွက်စက်', icon: Scale },
    { id: 'purity', label: 'အခေါက်ချွတ်တွက်စက်', icon: Droplets },
    { id: 'diamond', label: 'စိန်ဈေးနှုန်းတွက်စက်', icon: Gem },
    { id: 'price-conv', label: 'ဈေးနှုန်းစနစ်ပြောင်းစက်', icon: ArrowRightLeft },
    { id: 'history', label: 'မှတ်တမ်း', icon: HistoryIcon },
  ];

  const navigateTo = (tab: TabType) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-amber-500/30 flex flex-col">
      {/* Side Menu Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
        <div 
          className={`absolute left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-slate-800 p-8 pt-12 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ paddingTop: 'calc(3rem + env(safe-area-inset-top))' }}
        >
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2.5 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
                <Coins size={22} />
              </div>
              <div>
                <h3 className="font-black text-white tracking-tight text-lg leading-tight">ရွှေတွက်စက်</h3>
                <p className="text-[10px] text-amber-500 font-black tracking-widest uppercase">ရွေးချယ်ရန်</p>
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as TabType)}
                className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] text-sm font-black transition-all ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/10 scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon size={22} className={activeTab === item.id ? 'stroke-[2.5px]' : ''} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800 space-y-5 mb-6">
            <button 
              onClick={() => navigateTo('about')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-xs font-black ${
                activeTab === 'about' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Info size={18} /> အက်ပ်အကြောင်း
            </button>
            <div className="pt-2 text-center pb-[env(safe-area-inset-bottom)]">
              <p className="text-[9px] text-slate-700 font-black tracking-widest uppercase">GoldPro Myanmar v2.2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 header-blur border-b border-slate-800/50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-amber-500 hover:bg-slate-800 transition-all active:scale-90"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-100 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                {menuItems.find(i => i.id === activeTab)?.label || (activeTab === 'about' ? 'အက်ပ်အကြောင်း' : 'ရွှေတွက်ချက်စက်')}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[9px] text-slate-500 font-black tracking-widest uppercase leading-none">
                  မြန်မာ့စံနှုန်း
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-8 pb-32">
        {activeTab === 'calc' && <Calculator onSave={handleSaveToHistory} />}
        {activeTab === 'net' && <NetWeightCalculator />}
        {activeTab === 'price-conv' && <PriceSystemConverter />}
        {activeTab === 'purity' && <GoldPurityAnalysis />}
        {activeTab === 'diamond' && <DiamondCalculator />}
        {activeTab === 'about' && <AboutApp />}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black flex items-center gap-2 tracking-tight">
                <HistoryIcon size={20} className="text-amber-500" />
                မှတ်တမ်း
              </h2>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-300 transition-colors"
                >
                  မှတ်တမ်းဖျက်မည်
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-slate-900/30 border-2 border-dashed border-slate-800/50 rounded-[3rem] p-20 text-center space-y-5">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-700">
                  <HistoryIcon size={32} />
                </div>
                <div className="text-slate-500 text-sm font-bold">မှတ်တမ်း မရှိသေးပါ။</div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleExpand(item.id)}
                      className={`bg-slate-900/50 border border-slate-800/50 rounded-[2rem] flex flex-col hover:border-slate-700 transition-all cursor-pointer group overflow-hidden ${isExpanded ? 'ring-2 ring-amber-500/20 border-slate-700' : ''}`}
                    >
                      <div className="p-5 flex items-center gap-5">
                        <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                          <Coins size={22} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs font-black text-slate-300">
                              {item.weight.kyat} ကျပ် {item.weight.pae} ပဲ {item.weight.yway} ရွေး
                            </h4>
                            <span className="text-base font-black text-amber-500">{formatCurrency(item.totalPrice)}</span>
                          </div>
                          <div className="flex items-center gap-4 opacity-60">
                            <span className="text-[10px] text-slate-500 font-black flex items-center gap-1.5 uppercase tracking-tighter">
                              <Clock size={12} />
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                              စျေးနှုန်း: {formatCurrency(item.pricePerKyat)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="p-2.5 text-slate-700 hover:text-red-400 transition-all hover:bg-red-500/10 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="text-slate-600">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-800 bg-slate-900/80 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 gap-3 text-xs font-bold text-slate-400">
                            <div className="flex justify-between items-center py-1">
                              <span>ရွှေစျေးနှုန်း:</span>
                              <span className="text-white">{formatCurrency(item.pricePerKyat)} / ကျပ်</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span>အလေးချိန်:</span>
                              <span className="text-white font-mono">{item.weight.kyat}K {item.weight.pae}P {item.weight.yway}Y</span>
                            </div>
                            <div className="h-px bg-slate-800 my-2" />
                            <div className="flex justify-between items-center">
                              <span className="uppercase tracking-widest text-[10px] text-slate-500 font-black">စုစုပေါင်းသင့်ငွေ</span>
                              <span className="text-amber-500 text-lg font-black">{formatCurrency(item.totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Global Price Tracker */}
      <GlobalPriceWidget />
    </div>
  );
};

export default App;
