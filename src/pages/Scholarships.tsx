import { Check, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SourceNote from '../components/SourceNote';
import { useLang } from '../i18n/LangContext';

interface Scholarship {
  id: number;
  name: string;
  source: string;
  amount: string;
  type: 'كاملة' | 'جزئيّة' | 'سنويّة';
  eligibility: string[];
  deadline: string;
  match: number;
}

const scholarships: Scholarship[] = [
  { id: 1, name: 'منحة الأوقاف لطلبة القرى والبادية', source: 'وزارة الأوقاف والشؤون والمقدّسات الإسلاميّة',
    amount: '2,400 د.أ سنويّاً', type: 'سنويّة',
    eligibility: ['الإقامة في القرى أو البادية', 'معدّل 80 فأعلى', 'ملف خدمة اجتماعيّة معتمد'],
    deadline: '15 تشرين الأول 2026', match: 92 },
  { id: 2, name: 'صندوق دعم الطالب الجامعي', source: 'وزارة التعليم العالي والبحث العلمي',
    amount: '50% من الرسوم الجامعيّة', type: 'سنويّة',
    eligibility: ['الدخل الأسري أقلّ من 500 دينار', 'معدّل 75 فأعلى', 'متفرّغ للدراسة'],
    deadline: '30 تشرين الأول 2026', match: 87 },
  { id: 3, name: 'منحة التميّز التقني', source: 'مجموعة زين الأردن',
    amount: '3,000 د.أ سنويّاً', type: 'كاملة',
    eligibility: ['التخصّصات التقنيّة', 'معدّل 88 فأعلى', 'مشروع تقني خلال المقابلة'],
    deadline: '15 تشرين الثاني 2026', match: 78 },
  { id: 4, name: 'منحة شومان للطلبة المتميّزين', source: 'مؤسّسة عبد الحميد شومان',
    amount: 'كاملة + بدل شهري', type: 'كاملة',
    eligibility: ['معدّل 95 فأعلى', 'إنجازات لا منهجيّة موثّقة', 'مقابلة شخصيّة'],
    deadline: '30 تشرين الثاني 2026', match: 45 },
  { id: 5, name: 'منحة البنك العربي للتميّز', source: 'البنك العربي',
    amount: '2,500 د.أ سنويّاً', type: 'سنويّة',
    eligibility: ['التخصّصات الماليّة والإداريّة', 'معدّل 85 فأعلى', 'تدريب صيفي إلزامي'],
    deadline: '15 كانون الأول 2026', match: 71 },
];

export default function Scholarships() {
  const { t } = useLang();
  const eligible = scholarships.filter((s) => s.match >= 70);
  const others = scholarships.filter((s) => s.match < 70);
  const totalAmount = eligible.reduce((sum, s) => {
    const num = parseInt(s.amount.replace(/[^\d]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader title="المنح الدراسيّة المتاحة" subtitle={t('data.scholarships.subtitle')} />

      {/* Summary */}
      <div className="bg-white border-b border-gov-line p-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="المنح المؤهّل لها" value={eligible.length.toString()} />
          <Stat label="إجمالي القيمة" value={`${totalAmount.toLocaleString()} د.أ`} tone="ok" />
          <Stat label="إجمالي المنح" value={scholarships.length.toString()} />
        </div>
        <SourceNote className="mt-3" source="illustrative" note={t('data.note.scholarships')} />
      </div>

      {/* Eligible */}
      <div className="p-4">
        <h3 className="gov-section-title mb-2 flex items-center gap-2">
          <Check size={14} className="text-gov-ok" />
          منح مؤهّل للتقدّم إليها
        </h3>
        <div className="space-y-3">
          {eligible.map((s) => (
            <Card key={s.id} s={s} />
          ))}
        </div>
      </div>

      {/* Others */}
      <div className="p-4">
        <h3 className="gov-section-title mb-2">منح أخرى متاحة</h3>
        <div className="space-y-3 opacity-75">
          {others.map((s) => (
            <Card key={s.id} s={s} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <SourceNote source="illustrative" note={t('data.scholarships.verify')} />
        </div>
      </div>
    </div>
  );
}

function Card({ s }: { s: Scholarship }) {
  const { t } = useLang();
  return (
    <div className="gov-card overflow-hidden">
      <div className="px-4 py-3 border-b border-gov-line">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-bold text-gov-ink leading-tight flex-1">{s.name}</h4>
          <span className="gov-badge gov-badge-neutral shrink-0">{t('data.scholarships.matchLabel')} {s.match}%</span>
        </div>
        <p className="text-[11px] text-gov-muted">{s.source}</p>
      </div>
      <div className="p-4">
        <table className="gov-table mb-3">
          <tbody>
            <tr>
              <td className="text-gov-muted">القيمة الماليّة</td>
              <td className="text-end font-bold tabular text-gov-ink">{s.amount}</td>
            </tr>
            <tr>
              <td className="text-gov-muted">نوع المنحة</td>
              <td className="text-end font-semibold">{s.type}</td>
            </tr>
            <tr>
              <td className="text-gov-muted">آخر موعد للتقديم</td>
              <td className="text-end font-semibold text-gov-warn">{s.deadline}</td>
            </tr>
          </tbody>
        </table>

        <SourceNote className="mb-3" source="illustrative" note={t('data.scholarships.verify')} />

        <p className="text-[11px] font-semibold text-gov-body mb-1.5">شروط الأهليّة:</p>
        <ul className="space-y-1 mb-3">
          {s.eligibility.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gov-body">
              <Check size={12} className="text-gov-ok shrink-0 mt-0.5" />
              <span>{e}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <button className="btn-primary flex-1 text-xs py-2">
            <ExternalLink size={12} />
            تقديم الطلب
          </button>
          <button className="btn-ghost text-xs py-2">التفاصيل</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'ok' }) {
  return (
    <div>
      <p className="text-[10px] text-gov-muted">{label}</p>
      <p className={`text-base font-bold tabular mt-0.5 ${tone === 'ok' ? 'text-gov-ok' : 'text-gov-ink'}`}>{value}</p>
    </div>
  );
}
