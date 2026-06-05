import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, Save, X, CheckCircle2, Trophy, Target } from 'lucide-react';

export default function SmartPlanner() {
  const { language, t } = useAuth();
  const lang = language || 'uz';
  const [plans, setPlans] = useState(() => { const s = localStorage.getItem('flowly-smart-plans'); return s ? JSON.parse(s) : []; });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', icon: '📚', totalAmount: '', unit: '', days: '', category: 'education', note: '' });
  useEffect(() => { localStorage.setItem('flowly-smart-plans', JSON.stringify(plans)); }, [plans]);
  const icons = ['📚','💻','🏋️','🇺🇸','💰','📝','🎨','🎵','🏃','🧘','📈','🎯','✍️','🔬','📐','🗣️'];
  const catLabels = lang === 'ru' ? ['Учёба','Спорт','Финансы','Язык','Работа','Личное','Здоровье','Другое'] : lang === 'en' ? ['Education','Sport','Finance','Language','Work','Personal','Health','Other'] : ["Ta'lim",'Sport','Moliya','Til','Ish','Shaxsiy',"Sog'liq",'Boshqa'];
  const catKeys = ['education','sport','finance','language','work','personal','health','other'];
  const today = new Date().toISOString().split('T')[0];
  const L = { title: lang==='ru'?'Умный планировщик':lang==='en'?'Smart Planner':'Aqlli rejalashtiruvchi', desc: lang==='ru'?'Разбейте большие цели на шаги':lang==='en'?'Break big goals into daily steps':'Katta maqsadlarni kunlik qadamlarga bo\'ling', add: lang==='ru'?'Новый план':lang==='en'?'New plan':'Yangi reja', name: lang==='ru'?'Название':lang==='en'?'Plan name':'Reja nomi', total: lang==='ru'?'Объём':lang==='en'?'Total':' Jami', unitH: lang==='ru'?'стр, уроков, $...':lang==='en'?'pages, lessons, $...':'bet, dars, $...', daysL: lang==='ru'?'Дней':lang==='en'?'Days':'Kun', note: lang==='ru'?'Заметка':lang==='en'?'Note':'Izoh', todayT: lang==='ru'?'Сегодня':lang==='en'?'Today':'Bugun', daily: lang==='ru'?'/день':lang==='en'?'/day':'/kun', done: lang==='ru'?'Выполнено!':lang==='en'?'Completed!':'Tugallandi!', day: lang==='ru'?'День':lang==='en'?'Day':'Kun', empty: lang==='ru'?'Нет планов':lang==='en'?'No plans yet':'Reja yo\'q' };
  const handleSubmit = () => { if(!form.title||!form.totalAmount||!form.days) return; const total=parseInt(form.totalAmount),days=parseInt(form.days),dailyAmount=Math.ceil(total/days); if(editId){setPlans(plans.map(p=>p.id===editId?{...p,...form,totalAmount:total,days,dailyAmount}:p));setEditId(null);}else{setPlans([...plans,{id:Date.now(),...form,totalAmount:total,days,dailyAmount,startDate:today,completedDays:[],createdAt:today}]);} setForm({title:'',icon:'📚',totalAmount:'',unit:'',days:'',category:'education',note:''});setShowForm(false); };
  const handleEdit = (p) => { setForm({title:p.title,icon:p.icon,totalAmount:p.totalAmount.toString(),unit:p.unit,days:p.days.toString(),category:p.category,note:p.note||''}); setEditId(p.id); setShowForm(true); };
  const toggleDay = (planId, dayNum) => { setPlans(plans.map(p=>p.id===planId?{...p,completedDays:p.completedDays.includes(dayNum)?p.completedDays.filter(d=>d!==dayNum):[...p.completedDays,dayNum]}:p)); };
  const getPlanDay = (p) => { const diff=Math.floor((new Date(today)-new Date(p.startDate))/(86400000))+1; return Math.min(Math.max(diff,1),p.days); };
  const getProgress = (p) => Math.round((p.completedDays.length/p.days)*100);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold" style={{color:'var(--text-primary)'}}>{L.title}</h1><p className="text-sm" style={{color:'var(--text-secondary)'}}>{L.desc}</p></div>
        <button className="btn-primary flex items-center gap-2" onClick={()=>{setShowForm(!showForm);setEditId(null);setForm({title:'',icon:'📚',totalAmount:'',unit:'',days:'',category:'education',note:''});}}><Plus size={18}/>{L.add}</button>
      </div>
      {showForm&&(<div className="card animate-in" style={{borderColor:'var(--accent)'}}>
        <h3 className="font-semibold mb-3" style={{color:'var(--text-primary)'}}>{editId?t('edit'):L.add}</h3>
        <div className="flex flex-wrap gap-2 mb-3">{icons.map(ic=>(<button key={ic} onClick={()=>setForm({...form,icon:ic})} className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${form.icon===ic?'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-110':''}`} style={{background:form.icon!==ic?'var(--bg-secondary)':undefined}}>{ic}</button>))}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" placeholder={L.name} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}}/>
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}}>{catKeys.map((k,i)=><option key={k} value={k}>{catLabels[i]}</option>)}</select>
          <input type="number" placeholder={L.total} value={form.totalAmount} onChange={e=>setForm({...form,totalAmount:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}}/>
          <input type="text" placeholder={L.unitH} value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}}/>
          <input type="number" placeholder={L.daysL} value={form.days} onChange={e=>setForm({...form,days:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}}/>
          <input type="text" placeholder={L.note} value={form.note} onChange={e=>setForm({...form,note:e.target.value})} className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500" style={{background:'var(--bg-secondary)',borderColor:'var(--border)',color:'var(--text-primary)'}}/>
        </div>
        {form.totalAmount&&form.days&&<div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800"><p className="text-sm font-medium text-blue-700 dark:text-blue-300">📊 {Math.ceil(parseInt(form.totalAmount)/parseInt(form.days))} {form.unit||'dona'} {L.daily}</p></div>}
        <div className="flex gap-2 mt-3"><button className="btn-primary" onClick={handleSubmit}>{editId?t('save'):t('add')}</button><button className="px-4 py-2 rounded-xl border" style={{borderColor:'var(--border)',color:'var(--text-secondary)'}} onClick={()=>{setShowForm(false);setEditId(null);}}>{t('cancel')}</button></div>
      </div>)}
      {plans.length===0&&!showForm&&<div className="card text-center py-12"><Target size={48} className="text-blue-300 mx-auto mb-4"/><p style={{color:'var(--text-secondary)'}}>{L.empty}</p></div>}
      <div className="space-y-4">{plans.map((plan,idx)=>{const progress=getProgress(plan);const currentDay=getPlanDay(plan);const daily=plan.dailyAmount;const start=(currentDay-1)*daily+1;const end=Math.min(currentDay*daily,plan.totalAmount);const isComplete=progress>=100;const todayDone=plan.completedDays.includes(currentDay);
        return(<div key={plan.id} className={`card animate-in ${isComplete?'ring-2 ring-green-500 bg-green-50/30 dark:bg-green-900/5':''}`} style={{animationDelay:`${idx*50}ms`}}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isComplete?'bg-green-100 dark:bg-green-900/30':'bg-blue-50 dark:bg-blue-900/20'}`}>{isComplete?'🏆':plan.icon}</div>
            <div className="flex-1"><h3 className="font-bold" style={{color:'var(--text-primary)'}}>{plan.title}</h3><p className="text-xs" style={{color:'var(--text-secondary)'}}>{plan.totalAmount} {plan.unit} • {plan.days} {L.day} • {daily} {plan.unit}{L.daily}</p>{plan.note&&<p className="text-xs italic mt-0.5" style={{color:'var(--text-secondary)'}}>{plan.note}</p>}</div>
            <div className="flex gap-1"><button onClick={()=>handleEdit(plan)} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><Edit2 size={15} className="text-blue-500"/></button><button onClick={()=>setPlans(plans.filter(p=>p.id!==plan.id))} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={15} className="text-red-400"/></button></div>
          </div>
          <div className="mt-4"><div className="flex justify-between mb-1"><span className="text-xs" style={{color:'var(--text-secondary)'}}>{L.day} {currentDay}/{plan.days}</span><span className={`text-xs font-bold ${isComplete?'text-green-500':''}`} style={!isComplete?{color:'var(--accent)'}:{}}>{progress}%</span></div><div className="w-full h-3 rounded-full" style={{background:'var(--bg-secondary)'}}><div className={`h-3 rounded-full transition-all ${isComplete?'bg-green-500':'bg-gradient-to-r from-blue-500 to-purple-500'}`} style={{width:`${progress}%`}}/></div></div>
          {!isComplete&&<div className="mt-4 p-3 rounded-xl flex items-center justify-between" style={{background:'var(--bg-secondary)'}}>
            <div className="flex items-center gap-3"><button onClick={()=>toggleDay(plan.id,currentDay)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${todayDone?'bg-green-500 border-green-500':'border-gray-300 hover:border-blue-500'}`}>{todayDone&&<CheckCircle2 size={14} className="text-white"/>}</button><div><p className={`text-sm font-medium ${todayDone?'line-through opacity-50':''}`} style={{color:'var(--text-primary)'}}>{L.todayT}: {start}–{end} {plan.unit}</p><p className="text-[10px]" style={{color:'var(--text-secondary)'}}>{daily} {plan.unit}{L.daily}</p></div></div>
            {todayDone&&<span className="text-xs text-green-500 font-bold">✓</span>}
          </div>}
          {isComplete&&<div className="mt-4 p-3 rounded-xl text-center bg-green-50 dark:bg-green-900/10"><Trophy size={24} className="text-green-500 mx-auto mb-1"/><p className="text-sm font-bold text-green-600 dark:text-green-400">{L.done} 🎉</p></div>}
          <div className="mt-3 flex flex-wrap gap-1">{Array.from({length:plan.days},(_,i)=>{const d=i+1;const done=plan.completedDays.includes(d);const cur=d===currentDay;const past=d<currentDay&&!done;return(<button key={d} onClick={()=>toggleDay(plan.id,d)} className={`w-6 h-6 rounded text-[9px] font-medium flex items-center justify-center transition-all ${done?'bg-green-500 text-white':cur?'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20':past?'bg-red-100 dark:bg-red-900/20 text-red-500':''}`} style={!done&&!cur&&!past?{background:'var(--bg-secondary)',color:'var(--text-secondary)'}:{}} title={`${L.day} ${d}`}>{done?'✓':d}</button>);})}</div>
        </div>);})}</div>
    </div>
  );
}
