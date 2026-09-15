import { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { X, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { majorsData, type Major } from '../data/majors';

const COLORS = ['#003F7D', '#007A4D', '#A88631'];

export default function Compare() {
  const [selected, setSelected] = useState<Major[]>([
    majorsData.find((m) => m.id === 'cs')!,
    majorsData.find((m) => m.id === 'medicine')!,
    majorsData.find((m) => m.id === 'media')!,
  ]);
  const [picker, setPicker] = useState<number | null>(null);

  const radarData = [
    'الراتب الأوّل',
    'النموّ المستقبلي',
    'فرص التوظيف',
    'الرضا الوظيفي',
    'سرعة التخرّج',
    'انخفاض الكلفة',
  ].map((category, i) => {
    const obj: any = { category };
    selected.forEach((m) => {
      const value = [
        (m.firstSalary / 800) * 100,
        m.futureGrowth + 30,
        100 - m.unemploymentRate,
        m.satisfactionScore,
        100 - m.duration * 15,
        100 - m.yearlyTuitionGov / 100,
      ][i];
      obj[m.nameAr] = Math.max(0, Math.min(100, value));
    });
    return obj;
  });

  const salaryData = [
    { year: 'السنة 1', ...selected.reduce((a, m) => ({ ...a, [m.nameAr]: m.firstSalary }), {}) },
    { year: 'السنة 5', ...selected.reduce((a, m) => ({ ...a, [m.nameAr]: m.fiveYearSalary }), {}) },
    { year: 'السنة 10', ...selected.reduce((a, m) => ({ ...a, [m.nameAr]: m.tenYearSalary }), {}) },
  ];

  const replace = (idx: number, m: Major) => {
    const next = [...selected];
    next[idx] = m;
    setSelected(next);
    setPicker(null);
  };

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader title="مقارنة التخصّصات" subtitle="مقارنة تحليليّة لثلاثة تخصّصات" />

      {/* Selected majors */}
      <div className="bg-white border-b border-gov-line p-4">
        <p className="gov-section-title mb-2">التخصّصات المحدّدة</p>
        <div className="grid grid-cols-3 gap-2">
          {selected.map((m, i) => (
            <button
              key={i}
              onClick={() => setPicker(i)}
              className="border border-gov-line rounded-gov p-2.5 text-right hover:bg-gov-bg-soft transition-colors"
              style={{ borderTopColor: COLORS[i], borderTopWidth: 2 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold tabular" style={{ color: COLORS[i] }}>
                  #{i + 1}
                </span>
                <span className="text-[10px] text-gov-muted">تغيير</span>
              </div>
              <p className="text-xs font-bold text-gov-ink leading-tight">{m.nameAr}</p>
              <p className="text-[10px] text-gov-muted mt-1">بطالة {m.unemploymentRate}%</p>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="p-4">
        <div className="gov-card overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>المعيار</th>
                {selected.map((m) => (
                  <th key={m.id} className="text-center">{m.nameAr}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="حدّ القبول الأدنى" values={selected.map((m) => m.averageAcceptance.toString())} />
              <Row label="مدّة الدراسة" values={selected.map((m) => `${m.duration} سنوات`)} />
              <Row
                label="الرسوم السنويّة (حكومي)"
                values={selected.map((m) => `${m.yearlyTuitionGov.toLocaleString()} د.أ`)}
              />
              <Row
                label="الرسوم السنويّة (خاصّ)"
                values={selected.map((m) => `${m.yearlyTuitionPrivate.toLocaleString()} د.أ`)}
              />
              <Row
                label="نسبة البطالة (DOS 2024)"
                values={selected.map((m) => `${m.unemploymentRate}%`)}
                colorFn={(v) => {
                  const n = parseFloat(v);
                  if (n < 15) return 'text-gov-ok';
                  if (n < 30) return 'text-gov-warn';
                  return 'text-gov-danger';
                }}
              />
              <Row label="الراتب الأوّل" values={selected.map((m) => `${m.firstSalary} د.أ`)} />
              <Row label="الراتب بعد 5 سنوات" values={selected.map((m) => `${m.fiveYearSalary} د.أ`)} />
              <Row label="الراتب بعد 10 سنوات" values={selected.map((m) => `${m.tenYearSalary} د.أ`)} />
              <Row
                label="نموّ الطلب 2030"
                values={selected.map((m) => `${m.futureGrowth > 0 ? '+' : ''}${m.futureGrowth}%`)}
                colorFn={(v) => {
                  const n = parseInt(v);
                  if (n >= 30) return 'text-gov-ok';
                  if (n >= 0) return 'text-gov-navy';
                  return 'text-gov-danger';
                }}
              />
              <Row label="الإعلانات الحاليّة (30 يوم)" values={selected.map((m) => m.jobOpeningsLast30Days.toLocaleString())} />
              <Row label="مؤشّر الرضا" values={selected.map((m) => `${m.satisfactionScore}/100`)} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar chart */}
      <div className="px-4">
        <div className="gov-card p-4">
          <h3 className="gov-section-title mb-1">تحليل متعدّد الأبعاد</h3>
          <p className="text-[11px] text-gov-muted mb-3">مقارنة على ستّة معايير أساسيّة (0–100)</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#374151', fontSize: 10 }} />
              {selected.map((m, i) => (
                <Radar
                  key={i}
                  name={m.nameAr}
                  dataKey={m.nameAr}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.15}
                  strokeWidth={1.8}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salary growth */}
      <div className="px-4 mt-4">
        <div className="gov-card p-4">
          <h3 className="gov-section-title mb-1">منحنى تطوّر الراتب</h3>
          <p className="text-[11px] text-gov-muted mb-3">دينار أردني / شهرياً</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="year" tick={{ fill: '#374151', fontSize: 11 }} />
              <YAxis tick={{ fill: '#374151', fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {selected.map((m, i) => (
                <Bar key={i} dataKey={m.nameAr} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Source footer */}
      <div className="px-4 mt-4">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <div className="flex items-start gap-2">
            <FileText size={14} className="text-gov-muted shrink-0 mt-0.5" />
            <p className="text-[11px] text-gov-muted leading-relaxed">
              المصادر: وزارة التعليم العالي (معدّلات القبول 2025)، DOS Q1 2026 (نسب البطالة)، مسح القوى العاملة 2024.
            </p>
          </div>
        </div>
      </div>

      {/* Picker modal */}
      {picker !== null && (
        <div
          className="fixed inset-0 z-50 bg-gov-ink/40 flex items-end animate-fade-in"
          onClick={() => setPicker(null)}
        >
          <div
            className="w-full max-w-md mx-auto bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gov-line">
              <h3 className="text-base font-bold text-gov-ink">اختيار التخصّص</h3>
              <button
                onClick={() => setPicker(null)}
                className="w-8 h-8 rounded-md border border-gov-line flex items-center justify-center text-gov-body"
              >
                <X size={14} />
              </button>
            </div>
            <div className="divide-y divide-gov-line">
              {majorsData.map((m) => (
                <button
                  key={m.id}
                  onClick={() => replace(picker, m)}
                  className="w-full px-2 py-3 text-right hover:bg-gov-bg-soft"
                >
                  <p className="text-sm font-semibold text-gov-ink">{m.nameAr}</p>
                  <p className="text-[11px] text-gov-muted mt-0.5">
                    قبول {m.averageAcceptance} · بطالة {m.unemploymentRate}%
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  values,
  colorFn,
}: {
  label: string;
  values: string[];
  colorFn?: (v: string) => string;
}) {
  return (
    <tr>
      <td className="text-gov-muted">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`text-center font-semibold tabular ${colorFn ? colorFn(v) : 'text-gov-ink'}`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
