import { useNavigate } from 'react-router-dom';
import {
  Calculator, BarChart3, Sparkles, Brain, Users, MessageCircle,
  TrendingUp, GraduationCap, Wallet, ChevronLeft, ChevronRight, FileText, CheckCircle2,
} from 'lucide-react';
import OfficialHeader from '../components/OfficialHeader';
import { jobMarketTrends, nationalStats } from '../data/majors';
import { useLang } from '../i18n/LangContext';
import type { TranslationKey } from '../i18n/translations';
import { getSessionUser } from '../lib/account';

interface Service {
  to: string;
  icon: typeof Calculator;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

const services: Service[] = [
  { to: '/roi',           icon: Calculator,    titleKey: 'service.calculator.title',    descKey: 'service.calculator.desc' },
  { to: '/compare',       icon: BarChart3,     titleKey: 'service.compare.title',       descKey: 'service.compare.desc' },
  { to: '/simulate',      icon: Sparkles,      titleKey: 'service.simulate.title',      descKey: 'service.simulate.desc' },
  { to: '/personality',   icon: Brain,         titleKey: 'service.personality.title',   descKey: 'service.personality.desc' },
  { to: '/stories',       icon: Users,         titleKey: 'service.stories.title',       descKey: 'service.stories.desc' },
  { to: '/future',        icon: TrendingUp,    titleKey: 'service.future.title',        descKey: 'service.future.desc' },
  { to: '/scholarships',  icon: Wallet,        titleKey: 'service.scholarships.title',  descKey: 'service.scholarships.desc' },
  { to: '/alternatives',  icon: GraduationCap, titleKey: 'service.alternatives.title',  descKey: 'service.alternatives.desc' },
];

export default function Home() {
  const navigate = useNavigate();
  const { t, lang, dir } = useLang();
  const ChevronEnd = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const sessionUser = getSessionUser();
  const heroName = sessionUser?.name || (lang === 'ar' ? 'عبد الرحمن الهيموني' : 'Abdulrahman Alhaimouni');
  const heroCity = sessionUser?.city || (lang === 'ar' ? 'عمّان' : 'Amman');
  const heroGrade = sessionUser?.grade ?? 87;

  return (
    <div className="min-h-screen bg-gov-bg pb-28">
      <OfficialHeader />

      {/* Welcome bar */}
      <div className="bg-white border-b border-gov-line px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] text-gov-muted">{t('pages.home.welcome')}</p>
          <span className="text-[10px] text-gov-muted tabular">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-US', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </span>
        </div>
        <p className="text-base font-bold text-gov-ink leading-tight">
          {heroName}
        </p>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="gov-badge gov-badge-info">{t('pages.home.studentLabel')}</span>
          <span className="gov-badge gov-badge-neutral">{heroCity}</span>
          <span className="gov-badge gov-badge-neutral">{t('profile.gradeLabel')}: {heroGrade}</span>
        </div>
      </div>

      {/* Hook */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-3xl bg-gov-navy text-white shadow-[0_16px_40px_-16px_rgba(1,48,112,0.6)]">
          <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full border-[22px] border-white/5" />
          <div className="pointer-events-none absolute -top-12 -left-12 w-40 h-40 rounded-full border-[14px] border-white/5" />
          <div className="relative p-5">
            <p className="text-[12px] font-semibold text-gov-gold">
              {lang === 'ar' ? 'مُرشِدي • من الحيرة إلى قرار' : 'Murshidi • From confusion to decision'}
            </p>
            <h2 className="text-[27px] font-bold leading-[1.5] mt-2">
              {lang === 'ar' ? 'تخصص يناسب طموحك.' : 'A major that fits your ambition.'}
              <br />
              <span className="text-gov-gold">
                {lang === 'ar' ? 'وكلفة تناسب واقعك.' : 'A cost that fits your reality.'}
              </span>
            </h2>
            <p className="text-[13.5px] text-white/85 leading-loose mt-3">
              {lang === 'ar'
                ? 'قارن البرامج والرسوم، افهم شروط التقديم، وخذ قرارك على معلومة واضحة.'
                : 'Compare programs and fees, understand admission requirements, and decide on clear information.'}
            </p>
            <button
              onClick={() => navigate('/compare')}
              className="w-full min-h-[52px] mt-5 rounded-xl bg-white text-gov-navy text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
              <Calculator size={19} strokeWidth={2.2} />
              {lang === 'ar' ? 'ابدأ مقارنة خياراتك' : 'Start comparing your options'}
              <ChevronEnd size={17} />
            </button>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/70 mt-3.5">
              <CheckCircle2 size={13} className="text-gov-gold shrink-0" />
              {lang === 'ar'
                ? 'المصدر والفترة ظاهران • افتراضاتك قابلة للتعديل'
                : 'Source & period shown • Your assumptions are adjustable'}
            </p>
          </div>
        </div>
      </div>

      {/* Services list */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="gov-section-title">{t('pages.home.servicesTitle')}</h3>
          <span className="text-[11px] text-gov-muted tabular">{services.length}</span>
        </div>

        <div className="gov-card divide-y divide-gov-line overflow-hidden">
          {services.map((s) => (
            <button
              key={s.to}
              onClick={() => navigate(s.to)}
              className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gov-bg-soft active:bg-gov-bg text-start transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gov-bg flex items-center justify-center text-gov-navy shrink-0">
                <s.icon size={17} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gov-ink leading-tight">{t(s.titleKey)}</p>
                <p className="text-[11px] text-gov-muted mt-0.5 leading-snug">{t(s.descKey)}</p>
              </div>
              <ChevronEnd size={16} className="text-gov-muted shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Live market */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="gov-section-title">{t('pages.home.topJobsTitle')}</h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-gov-ok/10 text-[9px] font-bold text-gov-ok">
              <span className="w-1 h-1 rounded-full bg-gov-ok" />
              {t('pages.home.live')}
            </span>
          </div>
          <button onClick={() => navigate('/market')} className="text-[11px] text-gov-navy font-semibold hover:underline">
            {t('btn.viewAll')}
          </button>
        </div>

        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-8">#</th>
                <th>{lang === 'ar' ? 'المهنة' : 'Occupation'}</th>
                <th className="text-end">{lang === 'ar' ? 'الإعلانات' : 'Postings'}</th>
                <th className="text-end w-16">{lang === 'ar' ? 'التغيّر' : 'Change'}</th>
              </tr>
            </thead>
            <tbody>
              {jobMarketTrends.topHiring.slice(0, 5).map((job, i) => (
                <tr key={job.name}>
                  <td className="text-gov-muted tabular">{i + 1}</td>
                  <td className="font-medium text-gov-ink">{job.name}</td>
                  <td className="text-end tabular">{job.count.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                  <td className={`text-end tabular font-semibold ${job.change >= 0 ? 'text-gov-ok' : 'text-gov-danger'}`}>
                    {job.change > 0 ? '+' : ''}{job.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-gov-bg-soft border-t border-gov-line text-[10px] text-gov-muted leading-relaxed">
            {lang === 'ar'
              ? `المصدر: تجميع آلي من Akhtaboot, Bayt, LinkedIn Jordan — ${new Date().toLocaleDateString('ar-JO')}`
              : `Source: Auto-aggregated from Akhtaboot, Bayt, LinkedIn Jordan — ${new Date().toLocaleDateString('en-US')}`}
          </div>
        </div>
      </div>

      {/* National impact */}
      <div className="px-4 mt-5">
        <h3 className="gov-section-title mb-2">{t('pages.home.nationalIndicators')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <Stat label={t('stat.studentsHelped')} value={nationalStats.studentsHelped.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} />
          <Stat label={t('stat.jobsAnalyzed')} value={nationalStats.jobsScraped.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} />
          <Stat label={t('stat.unemployment')} value={`${nationalStats.graduateUnemployment}%`} hint="DOS Q1 2026" warn />
          <Stat label={t('stat.nationalCost')} value={lang === 'ar' ? '280 م.د' : '280M JOD'} hint={lang === 'ar' ? 'تحليل مرشدي' : 'Murshidi analysis'} />
        </div>
      </div>

      {/* Counsellor CTA */}
      <div className="px-4 mt-5">
        <button
          onClick={() => navigate('/chat')}
          className="w-full gov-card-interactive p-4 text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gov-green/10 flex items-center justify-center text-gov-green shrink-0">
              <MessageCircle size={20} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gov-ink">{t('pages.home.consultation')}</p>
              <p className="text-[11px] text-gov-muted mt-0.5">{t('pages.home.consultationDesc')}</p>
            </div>
            <ChevronEnd size={16} className="text-gov-muted" />
          </div>
        </button>
      </div>

      {/* Disclaimer */}
      <div className="px-4 mt-5">
        <div className="bg-gov-bg-soft border border-gov-line rounded-lg p-3 flex items-start gap-2">
          <FileText size={14} className="text-gov-muted shrink-0 mt-0.5" />
          <p className="text-[11px] text-gov-muted leading-relaxed">{t('pages.home.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, warn }: { label: string; value: string; hint?: string; warn?: boolean }) {
  return (
    <div className="gov-card p-3">
      <p className="text-[11px] text-gov-muted leading-tight">{label}</p>
      <p className={`text-lg font-bold tabular mt-1 leading-none ${warn ? 'text-gov-danger' : 'text-gov-ink'}`}>
        {value}
      </p>
      {hint && <p className="text-[10px] text-gov-muted mt-1.5">{hint}</p>}
    </div>
  );
}
