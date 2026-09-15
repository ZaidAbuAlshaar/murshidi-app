import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight,
  Calculator, ShieldCheck, Sparkles, BookOpen,
} from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import type { TranslationKey } from '../i18n/translations';

interface Stat { value: string; labelKey: TranslationKey; }
interface Slide {
  icon: typeof Calculator;
  iconBg: string;
  iconColor: string;
  badgeKey: TranslationKey;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  stats?: Stat[];
}

const slides: Slide[] = [
  {
    icon: BookOpen,
    iconBg: 'bg-gov-navy/8',
    iconColor: 'text-gov-navy',
    badgeKey: 'splash.slide1.badge',
    titleKey: 'splash.slide1.title',
    descKey: 'splash.slide1.desc',
    stats: [
      { value: '100K', labelKey: 'splash.slide1.stat1' },
      { value: '26.4%', labelKey: 'splash.slide1.stat2' },
    ],
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-gov-green/10',
    iconColor: 'text-gov-green',
    badgeKey: 'splash.slide2.badge',
    titleKey: 'splash.slide2.title',
    descKey: 'splash.slide2.desc',
    stats: [
      { value: '4', labelKey: 'splash.slide2.stat1' },
      { value: '50K+', labelKey: 'splash.slide2.stat2' },
    ],
  },
  {
    icon: Calculator,
    iconBg: 'bg-gov-gold/10',
    iconColor: 'text-gov-gold',
    badgeKey: 'splash.slide3.badge',
    titleKey: 'splash.slide3.title',
    descKey: 'splash.slide3.desc',
    stats: [
      { value: '12', labelKey: 'splash.slide3.stat1' },
      { value: '10', labelKey: 'splash.slide3.stat2' },
    ],
  },
  {
    icon: Sparkles,
    iconBg: 'bg-gov-navy/8',
    iconColor: 'text-gov-navy',
    badgeKey: 'splash.slide4.badge',
    titleKey: 'splash.slide4.title',
    descKey: 'splash.slide4.desc',
    stats: [
      { value: '24/7', labelKey: 'splash.slide4.stat1' },
      { value: '0', labelKey: 'splash.slide4.stat2' },
    ],
  },
];

export default function Splash() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { t, dir } = useLang();
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;

  // ─── Onboarding slides ───
  const slide = slides[step];
  const isLast = step === slides.length - 1;
  const Icon = slide.icon;

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="gov-strip" />

      {/* Top bar */}
      <div className="safe-top">
        <div className="px-4 h-12 flex items-center justify-between">
          <img src="/favicon.svg" alt={t('app.name')} width={28} height={28} className="rounded-md" />
          <button
            onClick={() => navigate('/home')}
            className="h-8 px-3 text-xs font-semibold text-gov-muted hover:text-gov-navy hover:bg-gov-bg-soft rounded-md transition-colors"
          >
            {t('btn.skip')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-6">
        <div className="flex justify-center mb-8 mt-4">
          <div className={`w-28 h-28 rounded-3xl ${slide.iconBg} flex items-center justify-center`}>
            <Icon size={48} className={slide.iconColor} strokeWidth={1.6} />
          </div>
        </div>

        <div className="text-center mb-3">
          <span className="inline-block text-[11px] font-bold text-gov-navy tracking-wider uppercase">
            {t(slide.badgeKey)}
          </span>
        </div>

        <h2 className="text-[24px] font-bold text-gov-ink text-center mb-4 leading-snug">
          {t(slide.titleKey)}
        </h2>

        <p className="text-[15px] text-gov-body text-center leading-loose px-2 mb-7">
          {t(slide.descKey)}
        </p>

        {slide.stats && (
          <div className="grid grid-cols-2 gap-3 mt-auto">
            {slide.stats.map((s, i) => (
              <div
                key={i}
                className="bg-gov-bg-soft border border-gov-line rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-gov-navy tabular leading-none">{s.value}</p>
                <p className="text-[11px] text-gov-muted mt-1.5 leading-tight">{t(s.labelKey)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indicator pills */}
      <div className="flex justify-center gap-1.5 pb-4">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-gov-navy' : 'w-1.5 bg-gov-line'
            }`}
          />
        ))}
      </div>

      {/* Action bar */}
      <div className="border-t border-gov-line bg-white safe-bottom">
        <div className="px-5 py-3 flex items-center gap-2">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="btn-secondary px-4 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t('btn.back')}
          >
            <PrevIcon size={18} />
          </button>
          <button
            onClick={() => {
              if (isLast) navigate('/home');
              else setStep(step + 1);
            }}
            className="btn-primary flex-1"
          >
            <span>{isLast ? t('btn.enterPlatform') : t('btn.next')}</span>
            <NextIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
