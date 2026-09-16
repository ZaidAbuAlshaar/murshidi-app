import { useState } from 'react';
import { RotateCcw, Lightbulb, Star, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SourceNote from '../components/SourceNote';
import { majorsData, DATASET_SOURCES, type Major } from '../data/majors';
import { useLang } from '../i18n/LangContext';

type ScenarioType = 'likely' | 'best' | 'worst';

interface Event {
  year: number;
  title: string;
  description: string;
  category: 'study' | 'job' | 'life' | 'milestone';
}

function buildScenario(major: Major, type: ScenarioType): Event[] {
  const isTech = major.category === 'tech';
  const isMed = major.category === 'medical';
  const baseSalary = type === 'best' ? major.firstSalary * 1.4 : type === 'worst' ? major.firstSalary * 0.6 : major.firstSalary;

  return [
    { year: 2026, title: 'بدء الدراسة الجامعيّة', category: 'study',
      description: `القبول في تخصّص ${major.nameAr} في الجامعة الأردنيّة. تبدأ السنة التحضيريّة بالموادّ الأساسيّة.` },
    { year: 2026 + Math.floor(major.duration / 2), category: 'study',
      title: type === 'best' ? 'تدريب صيفي مدفوع' : type === 'worst' ? 'تأجيل سنة دراسيّة' : 'حصول على منحة جزئيّة',
      description: type === 'best'
        ? 'الحصول على فرصة تدريب مدفوع في إحدى الشركات الكبرى يفتح بوّابة الانتقال السلس إلى السوق.'
        : type === 'worst'
        ? 'بسبب الإخفاق في موادّ متطلّبة، يتأخّر التخرّج عاماً واحداً.'
        : 'منحة جزئيّة من صندوق دعم الطالب الجامعي بناءً على المعدّل التراكمي.' },
    { year: 2026 + major.duration, title: 'التخرّج', category: 'milestone',
      description: `معدّل التخرّج المتوقّع: ${type === 'best' ? '3.6/4 (جيّد جدّاً)' : type === 'worst' ? '2.4/4 (مقبول)' : '3.0/4 (جيّد)'}.` },
    { year: 2026 + major.duration, title: 'الوظيفة الأولى', category: 'job',
      description: `بعد ${type === 'best' ? 'شهر' : type === 'worst' ? '14 شهراً' : '4 أشهر'} من التخرّج، الحصول على وظيفة في ${
        isTech ? 'شركة برمجيّات' : isMed ? 'مستشفى خاصّ' : 'شركة متوسّطة الحجم'
      } براتب ${Math.round(baseSalary).toLocaleString()} د.أ.` },
    { year: 2026 + major.duration + 3, category: 'job',
      title: type === 'best' ? 'ترقية إلى منصب أعلى' : type === 'worst' ? 'تغيير جهة العمل' : 'الترقية الطبيعيّة',
      description: type === 'best'
        ? `الترقية إلى Senior براتب ${Math.round(baseSalary * 2.2).toLocaleString()} د.أ.`
        : type === 'worst'
        ? `الانتقال إلى شركة جديدة براتب ${Math.round(baseSalary * 1.1).toLocaleString()} د.أ.`
        : `ترقية إلى Mid-Level براتب ${Math.round(baseSalary * 1.6).toLocaleString()} د.أ.` },
    { year: 2026 + major.duration + 5, category: 'life',
      title: type === 'best' ? 'فرصة عمل خارج الأردن' : 'استقرار شخصي',
      description: type === 'best'
        ? isTech
          ? 'عرض عمل عن بُعد من شركة أوروبيّة براتب يعادل 2,800 يورو شهريّاً.'
          : 'عرض عمل في السعوديّة براتب 1,800 ر.س مع بدلات سكن.'
        : 'مرحلة الاستقرار: التخطيط للزواج وشراء عقار.' },
    { year: 2036, title: 'بعد عشر سنوات', category: 'milestone',
      description: `الراتب المتوقّع: ${Math.round(baseSalary * (type === 'best' ? 4.5 : type === 'worst' ? 2.2 : 3.2)).toLocaleString()} د.أ شهريّاً. ${
        type === 'best' ? 'مستوى عالٍ من الاستقلال المالي.' : type === 'worst' ? 'استقرار متوسّط، يُنصح بتطوير المهارات.' : 'استقرار ونموّ طبيعي.'
      }` },
  ];
}

const scenarios = [
  { type: 'likely' as ScenarioType, label: 'الأكثر احتمالاً', percent: 60, icon: Lightbulb, tone: 'navy' },
  { type: 'best' as ScenarioType, label: 'الأفضل', percent: 20, icon: Star, tone: 'green' },
  { type: 'worst' as ScenarioType, label: 'الأسوأ', percent: 20, icon: AlertTriangle, tone: 'red' },
];

export default function Simulate() {
  const { t } = useLang();
  const illustrative = DATASET_SOURCES.majors;
  const [selected, setSelected] = useState<Major | null>(null);
  const [scenario, setScenario] = useState<ScenarioType>('likely');

  if (!selected) {
    return (
      <div className="min-h-screen bg-gov-bg pb-24">
        <PageHeader title="محاكاة المسار المهني" subtitle="اختر تخصّصاً لعرض السيناريوهات" />

        <div className="p-4">
          <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3 mb-3">
            <p className="text-xs text-gov-body leading-relaxed">{t('data.simulate.intro')}</p>
            <SourceNote className="mt-2" source={illustrative} note={t('data.note.simulation')} />
          </div>

          <p className="gov-section-title mb-2">اختيار التخصّص</p>
          <div className="gov-card divide-y divide-gov-line">
            {majorsData.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="w-full px-4 py-3 text-start hover:bg-gov-bg-soft"
              >
                <p className="text-sm font-semibold text-gov-ink">{m.nameAr}</p>
                <p className="text-[11px] text-gov-muted mt-0.5">{m.nameEn}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const events = buildScenario(selected, scenario);

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader
        title={`محاكاة: ${selected.nameAr}`}
        subtitle="السيناريوهات المتوقّعة على عشر سنوات"
        right={
          <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-md border border-gov-line flex items-center justify-center text-gov-body">
            <RotateCcw size={14} />
          </button>
        }
      />

      {/* Scenario tabs */}
      <div className="bg-white border-b border-gov-line p-3">
        <div className="grid grid-cols-3 gap-2">
        {scenarios.map((s) => {
          const active = scenario === s.type;
          const accent =
            s.tone === 'green' ? 'border-gov-green text-gov-green'
            : s.tone === 'red' ? 'border-gov-danger text-gov-danger'
            : 'border-gov-navy text-gov-navy';
          return (
            <button
              key={s.type}
              onClick={() => setScenario(s.type)}
              className={`p-2.5 rounded-gov border text-center transition-colors ${
                active ? `bg-white ${accent} border-2` : 'border-gov-line text-gov-muted bg-white'
              }`}
            >
              <s.icon size={16} className="mx-auto mb-1" />
              <p className="text-[11px] font-semibold">{s.label}</p>
              <p className="text-[10px] mt-0.5 opacity-80">احتمال {s.percent}%</p>
            </button>
          );
        })}
        </div>
        <SourceNote className="mt-2.5" source={illustrative} note={t('data.simulate.probabilityNote')} />
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="gov-section-title">جدول الأحداث الزمني</p>
          <SourceNote source={illustrative} compact />
        </div>
        <div className="gov-card">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-16">السنة</th>
                <th>الحدث</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={i}>
                  <td className="text-gov-navy font-bold tabular align-top">{e.year}</td>
                  <td>
                    <p className="font-semibold text-gov-ink">{e.title}</p>
                    <p className="text-[12px] text-gov-body leading-relaxed mt-1">{e.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verdict */}
      <div className="px-4">
        <div className="gov-card p-4 border-r-4 border-r-gov-navy">
          <p className="text-[11px] font-semibold text-gov-navy mb-1">خلاصة المحاكاة</p>
          <p className="text-sm text-gov-ink leading-relaxed">
            {scenario === 'best'
              ? `هذا السيناريو يعطي ${selected.nameAr} استقلالاً مالياً مبكّراً وفرصاً قويّة، لكنّه يمثّل 20% من الحالات.`
              : scenario === 'worst'
              ? `حتى في السيناريو الأسوأ، يبقى ${selected.nameAr} مهارة قابلة للتسويق. يُنصح بتخصيص 10% من الوقت لتعلّم مهارات إضافيّة.`
              : `السيناريو الأكثر واقعيّة لـ${selected.nameAr}. الالتزام والمهارات الإضافيّة هما عاملا الفرق.`}
          </p>
        </div>
      </div>

      {/* Source */}
      <div className="px-4 mt-3">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <p className="text-[11px] text-gov-body leading-relaxed mb-2 text-start">{t('data.simulate.intro')}</p>
          <SourceNote source={illustrative} note={t('data.note.simulation')} />
        </div>
      </div>
    </div>
  );
}
