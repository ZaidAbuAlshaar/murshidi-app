import { useState } from 'react';
import { RefreshCcw, ChevronLeft, FileText } from 'lucide-react';
import { PolarGrid, PolarAngleAxis, RadarChart, Radar, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/PageHeader';
import { majorsData } from '../data/majors';

type Trait = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface Question { q: string; options: { text: string; trait: Trait; weight: number }[]; }

const questions: Question[] = [
  { q: 'في المرحلة المدرسيّة، أيّ حصّة كنت ترتاح فيها أكثر؟', options: [
    { text: 'الرياضيّات والفيزياء', trait: 'I', weight: 3 },
    { text: 'الرسم والفنون', trait: 'A', weight: 3 },
    { text: 'الورشات اليدويّة', trait: 'R', weight: 3 },
    { text: 'النقاش والمناظرة', trait: 'E', weight: 3 },
  ]},
  { q: 'أيّ نوع من المحتوى تتابع أكثر؟', options: [
    { text: 'تعلّم البرمجة والتقنية', trait: 'I', weight: 3 },
    { text: 'تصميم وفنون رقميّة', trait: 'A', weight: 3 },
    { text: 'ريادة أعمال ونصائح ماليّة', trait: 'E', weight: 3 },
    { text: 'مساعدة الناس وتدريبهم', trait: 'S', weight: 3 },
  ]},
  { q: 'في فريق عمل، أيّ دور تختاره طبيعيّاً؟', options: [
    { text: 'القائد وصاحب القرار', trait: 'E', weight: 3 },
    { text: 'المنظّم والمحاسب', trait: 'C', weight: 3 },
    { text: 'المصمّم الإبداعي', trait: 'A', weight: 3 },
    { text: 'حلّال المشاكل التقنيّة', trait: 'I', weight: 3 },
  ]},
  { q: 'في المكتبة، أيّ قسم تتجه إليه أوّلاً؟', options: [
    { text: 'العلوم والتكنولوجيا', trait: 'I', weight: 3 },
    { text: 'الأدب والشعر', trait: 'A', weight: 3 },
    { text: 'علم النفس والتنمية', trait: 'S', weight: 3 },
    { text: 'الإدارة والاقتصاد', trait: 'E', weight: 3 },
  ]},
  { q: 'لو حصلت على مبلغ ماليّ، أوّل ما تفكّر فيه؟', options: [
    { text: 'شراء أداة عمل', trait: 'R', weight: 2 },
    { text: 'الاستثمار في كتاب أو دورة', trait: 'I', weight: 2 },
    { text: 'بدء مشروع تجريبي', trait: 'E', weight: 3 },
    { text: 'الادّخار وتنظيم خطّة', trait: 'C', weight: 2 },
  ]},
  { q: 'أيّ بيئة عمل تجدها مريحة؟', options: [
    { text: 'مختبر هادئ مع تجارب', trait: 'I', weight: 3 },
    { text: 'استوديو إبداعي مفتوح', trait: 'A', weight: 3 },
    { text: 'مكتب مرتّب وروتيني', trait: 'C', weight: 3 },
    { text: 'بيئة ميدانيّة خارجيّة', trait: 'R', weight: 3 },
  ]},
  { q: 'في تجمّع اجتماعي، أين تجد نفسك عادة؟', options: [
    { text: 'في مركز الانتباه أتحدّث', trait: 'E', weight: 3 },
    { text: 'مع مجموعة صغيرة في نقاش عميق', trait: 'I', weight: 2 },
    { text: 'أساعد المنظّمين بالخدمة', trait: 'S', weight: 2 },
    { text: 'أراقب وأرسم الأجواء', trait: 'A', weight: 2 },
  ]},
  { q: 'أيّ نوع من المهامّ يصعب عليك أكثر؟', options: [
    { text: 'العمل الروتيني الممل', trait: 'A', weight: 2 },
    { text: 'الجلوس والقراءة الطويلة', trait: 'R', weight: 2 },
    { text: 'تقديم العروض أمام الجمهور', trait: 'I', weight: 2 },
    { text: 'العمل الفردي بدون فريق', trait: 'S', weight: 2 },
  ]},
  { q: 'ما الذي يحفّزك أكثر في العمل؟', options: [
    { text: 'حلّ مشكلة معقّدة', trait: 'I', weight: 3 },
    { text: 'مساعدة شخص محتاج', trait: 'S', weight: 3 },
    { text: 'تحقيق أرباح وإنجازات', trait: 'E', weight: 3 },
    { text: 'إبداع شيء جميل', trait: 'A', weight: 3 },
  ]},
  { q: 'في وقت الفراغ، أيّ نشاط تفضّل؟', options: [
    { text: 'إصلاح أو بناء شيء يدويّاً', trait: 'R', weight: 3 },
    { text: 'القراءة والبحث في موضوع', trait: 'I', weight: 3 },
    { text: 'الرسم أو الكتابة أو التصوير', trait: 'A', weight: 3 },
    { text: 'زيارة الأهل والأصدقاء', trait: 'S', weight: 3 },
  ]},
  { q: 'أيّ نوع من المشاكل تستمتع بحلّها؟', options: [
    { text: 'تقنيّة ومنطقيّة', trait: 'I', weight: 3 },
    { text: 'إنسانيّة ونفسيّة', trait: 'S', weight: 3 },
    { text: 'تنظيميّة وماليّة', trait: 'C', weight: 3 },
    { text: 'إبداعيّة وتصميميّة', trait: 'A', weight: 3 },
  ]},
  { q: 'أيّ صفة تصفك أكثر؟', options: [
    { text: 'منظّم ودقيق', trait: 'C', weight: 3 },
    { text: 'فضولي ومحلّل', trait: 'I', weight: 3 },
    { text: 'مبدع وحالم', trait: 'A', weight: 3 },
    { text: 'قياديّ وطموح', trait: 'E', weight: 3 },
  ]},
];

const traitNames: Record<Trait, string> = {
  R: 'العملي', I: 'التحليلي', A: 'الإبداعي', S: 'الاجتماعي', E: 'الرياديّ', C: 'المنظّم',
};

export default function Personality() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Trait, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [done, setDone] = useState(false);

  const answer = (trait: Trait, weight: number) => {
    const next = { ...scores, [trait]: scores[trait] + weight };
    setScores(next);
    if (step + 1 === questions.length) setDone(true);
    else setStep(step + 1);
  };

  const reset = () => { setStep(0); setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }); setDone(false); };

  if (done) {
    const ranked = (Object.entries(scores) as [Trait, number][]).sort((a, b) => b[1] - a[1]);
    const top = ranked.slice(0, 3).map(([t]) => t);
    const matched = majorsData
      .map((m) => ({
        m,
        score: m.matchedPersonality.reduce((s, p) => {
          const t = p.charAt(0).toUpperCase() as Trait;
          return s + (top.includes(t) ? scores[t] : 0);
        }, 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const radarData = (Object.keys(scores) as Trait[]).map((t) => ({
      trait: traitNames[t],
      value: scores[t],
    }));

    return (
      <div className="min-h-screen bg-gov-bg pb-24">
        <PageHeader
          title="نتيجة اختبار الميول"
          subtitle="تقرير الشخصيّة المهنيّة"
          right={
            <button onClick={reset} className="w-9 h-9 rounded-md border border-gov-line flex items-center justify-center text-gov-body">
              <RefreshCcw size={14} />
            </button>
          }
        />

        <div className="p-4 space-y-3">
          {/* Report header */}
          <div className="gov-card p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gov-line">
              <div>
                <p className="text-[10px] text-gov-muted">رقم التقرير</p>
                <p className="text-xs font-bold tabular text-gov-ink">PSY-{Math.floor(Date.now()/1000)}</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gov-muted">تاريخ الإصدار</p>
                <p className="text-xs font-bold tabular text-gov-ink">{new Date().toLocaleDateString('ar-JO')}</p>
              </div>
            </div>

            <p className="text-[11px] text-gov-muted mb-2">نمط الشخصيّة المهنيّة (RIASEC)</p>
            <div className="flex gap-2 flex-wrap">
              {top.map((t) => (
                <span key={t} className="gov-badge gov-badge-info">{traitNames[t]}</span>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div className="gov-card p-4">
            <p className="gov-section-title mb-3">الخريطة النفسيّة</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#374151', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#003F7D" fill="#003F7D" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Matched majors */}
          <div className="gov-card overflow-hidden">
            <div className="px-4 py-2 bg-gov-bg-soft border-b border-gov-line">
              <p className="gov-section-title">التخصّصات الأكثر انسجاماً مع شخصيّتك</p>
            </div>
            <table className="gov-table">
              <thead>
                <tr>
                  <th className="w-8">#</th>
                  <th>التخصّص</th>
                  <th className="text-left">نسبة الانسجام</th>
                </tr>
              </thead>
              <tbody>
                {matched.map(({ m }, i) => (
                  <tr key={m.id}>
                    <td className="tabular text-gov-muted">{i + 1}</td>
                    <td>
                      <p className="font-semibold text-gov-ink">{m.nameAr}</p>
                      <p className="text-[10px] text-gov-muted mt-0.5">{m.matchedPersonality.join(' + ')}</p>
                    </td>
                    <td className="text-left">
                      <span className="gov-badge gov-badge-success">عالٍ</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Methodology */}
          <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
            <div className="flex items-start gap-2">
              <FileText size={14} className="text-gov-muted shrink-0 mt-0.5" />
              <p className="text-[11px] text-gov-muted leading-relaxed">
                المنهجيّة: نموذج RIASEC المُكيَّف للسياق العربي (Holland Code)، مع تطابق ذكي لأنماط شخصيّات الخرّيجين
                الناجحين في التخصّصات الأردنيّة.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cur = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader title="اختبار الميول الأكاديمي" subtitle={`السؤال ${step + 1} من ${questions.length}`} />

      {/* Progress */}
      <div className="bg-white border-b border-gov-line p-3">
        <div className="flex items-center justify-between text-[11px] text-gov-muted mb-1.5">
          <span>التقدّم</span>
          <span className="tabular font-semibold text-gov-ink">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gov-bg rounded-full overflow-hidden">
          <div className="h-full bg-gov-navy rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-4">
        <div className="gov-card p-4">
          <p className="text-[11px] font-semibold text-gov-navy mb-2">السؤال {step + 1}</p>
          <h2 className="text-base font-bold text-gov-ink mb-4 leading-snug">{cur.q}</h2>

          <div className="space-y-2">
            {cur.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(opt.trait, opt.weight)}
                className="w-full text-right px-4 py-3 border border-gov-line rounded-gov hover:bg-gov-bg-soft hover:border-gov-navy transition-colors flex items-center justify-between group"
              >
                <span className="text-sm text-gov-ink">{opt.text}</span>
                <ChevronLeft size={16} className="text-gov-muted group-hover:text-gov-navy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
