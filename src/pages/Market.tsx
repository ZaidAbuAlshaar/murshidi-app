import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { jobMarketTrends } from '../data/majors';

const monthlyTrend = [
  { month: 'كانون ثاني', tech: 1100, business: 850, medical: 540, engineering: 480 },
  { month: 'شباط', tech: 1180, business: 870, medical: 580, engineering: 510 },
  { month: 'آذار', tech: 1220, business: 890, medical: 620, engineering: 540 },
  { month: 'نيسان', tech: 1247, business: 893, medical: 672, engineering: 544 },
];

const sectorPie = [
  { name: 'تقنيّة', value: 1247, color: '#003F7D' },
  { name: 'صحّة', value: 672, color: '#007A4D' },
  { name: 'إدارة', value: 893, color: '#A88631' },
  { name: 'هندسة', value: 544, color: '#1B5594' },
  { name: 'أخرى', value: 487, color: '#94A3B8' },
];

const cities = [
  { name: 'عمّان', percent: 67 },
  { name: 'إربد', percent: 11 },
  { name: 'الزرقاء', percent: 7 },
  { name: 'العقبة', percent: 4 },
  { name: 'الكرك', percent: 3 },
  { name: 'باقي المحافظات', percent: 8 },
];

export default function Market() {
  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader
        title="مرصد سوق العمل الأردني"
        subtitle="بيانات محدّثة آلياً يوميّاً"
        right={
          <span className="gov-badge gov-badge-success">
            <span className="w-1.5 h-1.5 rounded-full bg-gov-ok animate-pulse" />
            مباشر
          </span>
        }
      />

      {/* Header indicators */}
      <div className="bg-white border-b border-gov-line px-4 py-3 grid grid-cols-3 gap-3">
        <Indicator label="إعلانات نشطة" value="4,247" sub="آخر 30 يوماً" />
        <Indicator label="نموّ شهري" value="+8.4%" sub="مقارنة بآذار" tone="ok" />
        <Indicator label="مهارات صاعدة" value="23" sub="جديدة شهرياً" />
      </div>

      {/* Monthly trend */}
      <div className="p-4">
        <div className="gov-card p-4">
          <h3 className="gov-section-title mb-1">تطوّر الإعلانات حسب القطاع</h3>
          <p className="text-[11px] text-gov-muted mb-3">عدد الإعلانات الشهريّة — Q1 2026</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="gNavy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003F7D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#003F7D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#007A4D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#007A4D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#374151', fontSize: 10 }} />
              <YAxis tick={{ fill: '#374151', fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="tech" name="تقنيّة" stroke="#003F7D" fill="url(#gNavy)" strokeWidth={2} />
              <Area type="monotone" dataKey="medical" name="صحّة" stroke="#007A4D" fill="url(#gGreen)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top hiring */}
      <div className="px-4">
        <h3 className="gov-section-title mb-2 flex items-center gap-2">
          <TrendingUp size={14} className="text-gov-ok" />
          المهن الأكثر طلباً
        </h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-8">#</th>
                <th>المهنة</th>
                <th className="text-left">عدد الإعلانات</th>
                <th className="text-left w-16">التغيّر</th>
              </tr>
            </thead>
            <tbody>
              {jobMarketTrends.topHiring.map((job, i) => (
                <tr key={job.name}>
                  <td className="text-gov-muted tabular">{i + 1}</td>
                  <td className="font-medium text-gov-ink">{job.name}</td>
                  <td className="text-left tabular">{job.count.toLocaleString()}</td>
                  <td className={`text-left tabular font-semibold ${job.change >= 0 ? 'text-gov-ok' : 'text-gov-danger'}`}>
                    {job.change > 0 ? '+' : ''}{job.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declining */}
      <div className="px-4 mt-4">
        <h3 className="gov-section-title mb-2 flex items-center gap-2">
          <TrendingDown size={14} className="text-gov-danger" />
          المهن في تراجع
        </h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>المهنة</th>
                <th className="text-left">عدد الإعلانات</th>
                <th className="text-left w-16">التغيّر</th>
              </tr>
            </thead>
            <tbody>
              {jobMarketTrends.declining.map((job) => (
                <tr key={job.name}>
                  <td className="font-medium text-gov-ink">{job.name}</td>
                  <td className="text-left tabular">{job.count.toLocaleString()}</td>
                  <td className="text-left tabular font-semibold text-gov-danger">{job.change}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top paying skills */}
      <div className="px-4 mt-4">
        <h3 className="gov-section-title mb-2">المهارات الأعلى أجراً</h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-8">#</th>
                <th>المهارة</th>
                <th className="text-left">متوسّط الأجر</th>
              </tr>
            </thead>
            <tbody>
              {jobMarketTrends.topPaying.map((s, i) => (
                <tr key={s.name}>
                  <td className="text-gov-muted tabular">{i + 1}</td>
                  <td className="font-medium text-gov-ink">{s.name}</td>
                  <td className="text-left tabular font-semibold">{s.salary.toLocaleString()} د.أ / شهر</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two column charts */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="gov-card p-3">
          <h4 className="text-xs font-bold text-gov-ink mb-2">التوزيع حسب القطاع</h4>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={sectorPie} cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={2} dataKey="value">
                {sectorPie.map((s) => (
                  <Cell key={s.name} fill={s.color} stroke="#FFFFFF" strokeWidth={1.5} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {sectorPie.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                <span className="text-gov-body flex-1">{s.name}</span>
                <span className="text-gov-ink font-semibold tabular">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gov-card p-3">
          <h4 className="text-xs font-bold text-gov-ink mb-2">التوزيع الجغرافي</h4>
          <div className="space-y-2">
            {cities.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-gov-body">{c.name}</span>
                  <span className="font-semibold text-gov-ink tabular">{c.percent}%</span>
                </div>
                <div className="h-1.5 bg-gov-bg rounded-sm overflow-hidden">
                  <div className="h-full bg-gov-navy rounded-sm" style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source */}
      <div className="px-4 mt-4">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <div className="flex items-start gap-2">
            <FileText size={14} className="text-gov-muted shrink-0 mt-0.5" />
            <p className="text-[11px] text-gov-muted leading-relaxed">
              مصادر البيانات: تجميع آلي من Akhtaboot, Bayt, LinkedIn Jordan, WuzzufJO. تُحدَّث يوميّاً.
              التحقّق المستقلّ بالتعاون مع كلّيّة الاقتصاد — الجامعة الأردنيّة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Indicator({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'ok' }) {
  return (
    <div>
      <p className="text-[10px] text-gov-muted">{label}</p>
      <p className={`text-base font-bold tabular mt-0.5 ${tone === 'ok' ? 'text-gov-ok' : 'text-gov-ink'}`}>{value}</p>
      <p className="text-[10px] text-gov-muted">{sub}</p>
    </div>
  );
}
