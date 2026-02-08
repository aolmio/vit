
import React from 'react';
import { 
  Info, 
  LayoutDashboard, 
  Scale, 
  Droplets, 
  Gem, 
  ArrowRightLeft, 
  History as HistoryIcon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const AboutApp: React.FC = () => {
  const features = [
    {
      title: 'အရောင်းတွက်စက်',
      desc: 'ကျပ်၊ ပဲ၊ ရွေး စနစ်ဖြင့် အရောင်းအဝယ်များကို တိကျစွာ တွက်ချက်နိုင်ပါသည်။ လျော့တွက်၊ လက်ခ နှင့် ကျောက်ဖိုးများကိုပါ ထည့်သွင်းတွက်ချက်နိုင်ပါသည်။',
      icon: LayoutDashboard,
      color: 'text-amber-500'
    },
    {
      title: 'အသားတင်အလေးချိန်',
      desc: 'ရွှေထည်များမှ လျော့တွက်နှင့် ကျောက်ဖိုးများကို နှုတ်၍ အသားတင်ရွှေအလေးချိန်ကို ကျပ်၊ ပဲ၊ ရွေး နှင့် ဂရမ် စနစ်များဖြင့် ရှာဖွေနိုင်ပါသည်။',
      icon: Scale,
      color: 'text-blue-500'
    },
    {
      title: 'အခေါက်ချွတ်တွက်စက်',
      desc: 'Density (စက်ပွိုင့်) သို့မဟုတ် ပဲရည်အလိုက် အသားတင် အခေါက်ရွှေထွက်နှုန်းနှင့် အရည်အသွေးကို တွက်ချက်နိုင်ပါသည်။',
      icon: Droplets,
      color: 'text-amber-400'
    },
    {
      title: 'စိန်ဈေးနှုန်းတွက်စက်',
      desc: 'ကာရက် (Carat) နှင့် ရတီ (Ratti) စနစ်များအပြင် ဘီ၊ ပိုင်း အခွဲများဖြင့်ပါ စိန်ဈေးနှုန်းကို တိကျစွာ တွက်ချက်နိုင်ပါသည်။',
      icon: Gem,
      color: 'text-cyan-400'
    },
    {
      title: 'ဈေးနှုန်းစနစ်ပြောင်းစက်',
      desc: 'စနစ်ဟောင်း (၁၆.၆၀၆ ဂရမ်) နှင့် စနစ်သစ် (၁၆.၃၂၉ ဂရမ်) ကြား ဈေးနှုန်းကွာခြားချက်များကို အလွယ်တကူ ပြောင်းလဲကြည့်ရှုနိုင်ပါသည်။',
      icon: ArrowRightLeft,
      color: 'text-emerald-500'
    },
    {
      title: 'တွက်ချက်မှုမှတ်တမ်း',
      desc: 'ယခင်တွက်ချက်ခဲ့သော အရောင်းမှတ်တမ်းများကို အချိန်နှင့်တပြေးညီ ပြန်လည်ကြည့်ရှုနိုင်ရန် သိမ်းဆည်းပေးထားပါသည်။',
      icon: HistoryIcon,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 pt-4">
        <div className="bg-amber-500/10 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl shadow-amber-500/10">
          <Info size={40} className="text-amber-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">အက်ပ်အကြောင်း</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">GoldPro Myanmar v2.2</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center gap-3 text-amber-500">
          <ShieldCheck size={20} />
          <h3 className="text-sm font-black uppercase">Professional Gold Tool</h3>
        </div>
        <p className="text-sm text-slate-300 font-medium leading-relaxed">
          GoldPro Myanmar သည် မြန်မာ့ရွှေစျေးကွက်အတွက် အထူးရည်ရွယ်ထုတ်လုပ်ထားသော ပရော်ဖက်ရှင်နယ် ရွှေတွက်ချက်စက်ဖြစ်ပါသည်။ ဆိုင်ရှင်များ၊ ပန်းထိမ်ဆရာများနှင့် ရွှေဝယ်ယူသူများအတွက် တိကျမြန်ဆန်သော တွက်ချက်မှုများကို ပံ့ပိုးပေးနိုင်ရန် ဖန်တီးထားပါသည်။
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="px-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">အက်ပ်၏ လုပ်ဆောင်ချက်များ</h4>
        <div className="grid gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 flex gap-5 hover:border-slate-700 transition-all">
              <div className={`mt-1 ${f.color} flex-shrink-0`}>
                <f.icon size={22} />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-black text-white">{f.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex items-start gap-4">
        <CheckCircle2 className="text-amber-500 mt-1 flex-shrink-0" size={18} />
        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
          ဤအက်ပ်တွင် အသုံးပြုထားသော တွက်ချက်မှုပုံသေနည်းများသည် မြန်မာ့ရွှေစျေးကွက်တွင် လက်ရှိအသုံးပြုနေသော စံနှုန်းများအတိုင်း တည်ဆောက်ထားခြင်း ဖြစ်ပါသည်။
        </p>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Developed for Myanmar Gold Market</p>
      </div>
    </div>
  );
};

export default AboutApp;
