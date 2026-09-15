import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLang } from '../i18n/LangContext';
import { signIn, signUp, getSessionUser } from '../lib/account';

const CITIES_AR = ['عمّان', 'إربد', 'الزرقاء', 'البلقاء', 'الكرك', 'معان', 'المفرق', 'جرش', 'عجلون', 'مادبا', 'الطفيلة', 'العقبة'];
const CITIES_EN = ['Amman', 'Irbid', 'Zarqa', 'Balqa', 'Karak', 'Maan', 'Mafraq', 'Jerash', 'Ajloun', 'Madaba', 'Tafilah', 'Aqaba'];

const STR = {
  ar: {
    title: 'تسجيل الدخول', subtitle: 'حسابك محفوظ على هذا الجهاز فقط',
    tabIn: 'دخول', tabUp: 'حساب جديد',
    name: 'الاسم الكامل', namePh: 'مثال: عبد الرحمن الهيموني',
    grade: 'المعدّل (اختياري)', city: 'المحافظة', password: 'كلمة السر', passwordPh: '4 أحرف على الأقل',
    inBtn: 'دخول', upBtn: 'إنشاء الحساب',
    eTaken: 'هذا الاسم مسجّل مسبقاً — سجّل الدخول.',
    eNotFound: 'لا يوجد حساب بهذا الاسم — أنشئ حساباً جديداً.',
    eWrong: 'كلمة السر غير صحيحة.',
    eInvalid: 'تحقّق من الاسم وكلمة السر (4 أحرف على الأقل).',
    eStorage: 'تعذّر الحفظ على هذا الجهاز.',
    note: 'لا نطلب رقماً وطنياً. بياناتك تبقى في متصفّح هذا الجهاز ولا تُرسل لأيّ خادم.',
    loggedIn: 'أنت مسجّل الدخول مسبقاً.', goHome: 'الذهاب للرئيسيّة',
  },
  en: {
    title: 'Sign in', subtitle: 'Your account stays on this device only',
    tabIn: 'Sign in', tabUp: 'New account',
    name: 'Full name', namePh: 'e.g. Abdulrahman Alhaimouni',
    grade: 'GPA (optional)', city: 'Governorate', password: 'Password', passwordPh: 'At least 4 characters',
    inBtn: 'Sign in', upBtn: 'Create account',
    eTaken: 'This name is already registered — sign in.',
    eNotFound: 'No account with this name — create a new one.',
    eWrong: 'Wrong password.',
    eInvalid: 'Check your name and password (4+ characters).',
    eStorage: 'Could not save on this device.',
    note: 'No national ID required. Your data stays in this device browser and is never sent to any server.',
    loggedIn: 'You are already signed in.', goHome: 'Go home',
  },
} as const;

export default function Auth() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const s = STR[lang === 'ar' ? 'ar' : 'en'];
  const cities = lang === 'ar' ? CITIES_AR : CITIES_EN;
  const [tab, setTab] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (getSessionUser()) {
    return (
      <div className="min-h-screen bg-gov-bg pb-28">
        <PageHeader title={s.title} subtitle={s.subtitle} />
        <main className="max-w-3xl mx-auto p-4">
          <div className="gov-card p-5 text-center">
            <p className="text-sm text-gov-body">{s.loggedIn}</p>
            <button onClick={() => navigate('/home')} className="btn-primary w-full mt-4">{s.goHome}</button>
          </div>
        </main>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const g = grade.trim() === '' ? null : Number(grade);
    const gradeOk = g === null || (Number.isFinite(g) && g >= 0 && g <= 100);
    if (!gradeOk) {
      setError(s.eInvalid);
      setBusy(false);
      return;
    }
    const res = tab === 'in' ? await signIn(name, password) : await signUp(name, g, city, password);
    setBusy(false);
    if (res.ok) {
      navigate('/home');
      return;
    }
    setError(
      res.error === 'name-taken' ? s.eTaken
      : res.error === 'not-found' ? s.eNotFound
      : res.error === 'wrong-password' ? s.eWrong
      : res.error === 'storage' ? s.eStorage
      : s.eInvalid,
    );
  };

  return (
    <div className="min-h-screen bg-gov-bg pb-28">
      <PageHeader title={s.title} subtitle={s.subtitle} />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="gov-card p-1.5 grid grid-cols-2 gap-1.5">
          {(['in', 'up'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => { setTab(k); setError(null); }}
              aria-pressed={tab === k}
              className={`min-h-[44px] rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
                tab === k ? 'bg-gov-navy text-white' : 'text-gov-muted'
              }`}
            >
              {k === 'in' ? <LogIn size={15} /> : <UserPlus size={15} />}
              {k === 'in' ? s.tabIn : s.tabUp}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="gov-card p-5 space-y-4">
          <div>
            <label className="gov-label" htmlFor="auth-name">{s.name}</label>
            <input id="auth-name" className="gov-input" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={s.namePh} maxLength={60} autoComplete="name" />
          </div>
          {tab === 'up' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="gov-label" htmlFor="auth-grade">{s.grade}</label>
                  <input id="auth-grade" className="gov-input tabular" value={grade}
                    onChange={(e) => setGrade(e.target.value.replace(/[^\d.]/g, ''))}
                    placeholder="87" inputMode="decimal" maxLength={5} />
                </div>
                <div>
                  <label className="gov-label" htmlFor="auth-city">{s.city}</label>
                  <select id="auth-city" className="gov-input" value={city} onChange={(e) => setCity(e.target.value)}>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}
          <div>
            <label className="gov-label" htmlFor="auth-pw">{s.password}</label>
            <div className="relative">
              <input id="auth-pw" type={showPw ? 'text' : 'password'} dir="ltr" className="gov-input text-left pe-11"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={s.passwordPh} autoComplete={tab === 'in' ? 'current-password' : 'new-password'} />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'hide' : 'show'}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-gov-muted p-1.5">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-gov-danger leading-relaxed">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? '…' : tab === 'in' ? s.inBtn : s.upBtn}
          </button>
        </form>

        <div className="bg-gov-bg-soft border border-gov-line rounded-lg p-3 flex items-start gap-2">
          <ShieldCheck size={14} className="text-gov-green shrink-0 mt-0.5" />
          <p className="text-[11px] text-gov-muted leading-relaxed">{s.note}</p>
        </div>
      </main>
    </div>
  );
}
