import { useNavigate } from 'react-router-dom';
import {
  Calculator, BarChart3, Sparkles, Brain, Users, MessageCircle,
  TrendingUp, GraduationCap, Wallet, ChevronLeft, ChevronRight, FileText,
} from 'lucide-react';
import OfficialHeader from '../components/OfficialHeader';
import { jobMarketTrends, majorsData, nationalStats } from '../data/majors';
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

      {/* Hero hook */}
      <div className="p-4">
        <div className="gov-card overflow-hidden">
          <div className="h-[3px] bg-gov-gold" />
          <div className="p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gov-navy">
              <span className="w-1.5 h-1.5 bg-gov-gold shrink-0" />
              {lang === 'ar' ? 'دليلك لاختيار التخصّص الجامعي' : 'Your guide to choosing a major'}
            </p>
            <h2 className="text-[22px] font-bold text-gov-ink leading-snug mt-2">
              {lang === 'ar' ? 'تخصّصك الغلط بيكلّفك 10 سنين' : 'A wrong major costs you 10 years'}
            </h2>
            <p className="text-[13px] text-gov-body leading-relaxed mt-1.5">
              {lang === 'ar'
                ? 'قارن التخصّصات بأرقام البطالة والرواتب الحقيقيّة قبل ما تختار — القرار بالأرقام مش بالتخمين.'
                : 'Compare majors by real unemployment and salary figures before you choose — decide by data, not guessing.'}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <HeroStat
                value={String(majorsData.length)}
                label={lang === 'ar' ? 'تخصّصًا بالأرقام' : 'majors in numbers'}
              />
              <HeroStat
                value={nationalStats.jobsScraped.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                label={lang === 'ar' ? 'إعلان وظيفي محلّل' : 'job ads analysed'}
              />
              <HeroStat
                value={`+${jobMarketTrends.topHiring[0].change}%`}
                label={jobMarketTrends.topHiring[0].name}
              />
            </div>

            <button
              onClick={() => navigate('/roi')}
              className="btn-primary w-full mt-4"
            >
              <Calculator size={17} strokeWidth={2.4} />
              {t('btn.openCalculator')}
            </button>
            <button
              onClick={() => navigate('/personality')}
              className="w-full mt-2 py-2 text-[13px] font-semibold text-gov-navy hover:underline"
            >
              {lang === 'ar' ? 'أو اختبر ميولك أولاً' : 'Or test your interests first'}
            </button>

            <p className="text-[10px] text-gov-muted mt-2 pt-2 border-t border-gov-line leading-relaxed">
              {lang === 'ar'
                ? 'المصادر: DOS Q1 2026 · معدّلات القبول الموحّدة 2025'
                : 'Sources: DOS Q1 2026 · Unified admission rates 2025'}
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

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gov-bg-soft border border-gov-line rounded-lg px-2 py-2.5 text-center">
      <p className="text-base font-bold tabular text-gov-navy leading-none">{value}</p>
      <p className="text-[10px] text-gov-muted mt-1.5 leading-tight">{label}</p>
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
