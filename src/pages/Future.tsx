import { TrendingUp, TrendingDown, AlertTriangle, FileText } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import SourceNote from '../components/SourceNote';
import { futureJobs, DATASET_SOURCES } from '../data/majors';
import { useLang } from '../i18n/LangContext';

const WEF_REPORT_URL = 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/';

const projections = [
  { year: 2024, ai: 100, traditional: 100, design: 100, security: 100 },
  { year: 2026, ai: 145, traditional: 92, design: 118, security: 138 },
  { year: 2028, ai: 178, traditional: 78, design: 132, security: 158 },
  { year: 2030, ai: 195, traditional: 62, design: 148, security: 178 },
  { year: 2032, ai: 215, traditional: 50, design: 158, security: 195 },
  { year: 2035, ai: 245, traditional: 38, design: 172, security: 215 },
];

const newJobs2030 = [
  { name: 'مهندس Prompt', category: 'الذكاء الاصطناعي' },
  { name: 'مسؤول أخلاقيّات الذكاء', category: 'الذكاء الاصطناعي' },
  { name: 'صانع محتوى الواقع الافتراضي', category: 'تقنيّة' },
  { name: 'مستشار الاستدامة', category: 'البيئة' },
  { name: 'محلّل المخاطر المناخيّة', category: 'البيئة' },
  { name: 'مسؤول حماية البيانات الشخصيّة', category: 'الأمن السيبراني' },
  { name: 'مهندس الروبوتيّات', category: 'تقنيّة' },
  { name: 'مستشار الجينوم', category: 'صحّة' },
];

export default function Future() {
  const { t } = useLang();
  const illustrative = DATASET_SOURCES.futureJobs;

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader title="مستقبل الوظائف 2030–2035" subtitle={t('data.future.subtitle')} />

      {/* Headline — quoted from a published report, with the citation attached */}
      <div className="bg-white border-b border-gov-line p-4">
        <div className="bg-gov-bg-soft border-r-4 border-r-gov-navy p-3 rounded-gov">
          <p className="text-[11px] font-semibold text-gov-navy mb-1">{t('data.future.wefTitle')}</p>
          <p className="text-sm text-gov-ink leading-relaxed">{t('data.future.wefBody')}</p>
          <p className="flex items-start gap-1.5 mt-2 text-start">
            <FileText size={12} className="text-gov-muted shrink-0 mt-[2px]" />
            <span className="text-[10.5px] leading-relaxed text-gov-muted">
              {t('data.sourceLabel')}:{' '}
              <a
                href={WEF_REPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gov-navy font-semibold underline underline-offset-2 decoration-gov-navy/30 hover:decoration-gov-navy"
              >
                {t('data.future.wefCite')}
              </a>
            </span>
          </p>
        </div>
      </div>

      {/* Projection chart */}
      <div className="p-4">
        <div className="gov-card p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="gov-section-title">المنحنى التنبّؤي للطلب على الوظائف</h3>
            <SourceNote source={illustrative} compact />
          </div>
          <p className="text-[11px] text-gov-muted mb-3">2024 = 100 (مؤشّر أساس)</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="year" tick={{ fill: '#374151', fontSize: 10 }} />
              <YAxis tick={{ fill: '#374151', fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="ai" stroke="#003F7D" strokeWidth={2} name="الذكاء الاصطناعي" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="security" stroke="#007A4D" strokeWidth={2} name="الأمن السيبراني" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="design" stroke="#A88631" strokeWidth={2} name="تصميم تجربة المستخدم" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="traditional" stroke="#DC2626" strokeWidth={2} name="المحاسبة التقليديّة" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growing */}
      <div className="px-4">
        <h3 className="gov-section-title mb-2 flex items-center gap-2">
          <TrendingUp size={14} className="text-gov-ok" />
          المهن في نموّ مستمرّ
          <SourceNote source={illustrative} compact className="ms-auto" />
        </h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>المهنة</th>
                <th className="text-end w-32">نسبة النموّ</th>
              </tr>
            </thead>
            <tbody>
              {futureJobs.growing.map((j) => (
                <tr key={j.name}>
                  <td className="font-medium text-gov-ink">{j.name}</td>
                  <td className="text-end">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gov-bg rounded-full overflow-hidden">
                        <div className="h-full bg-gov-ok rounded-full" style={{ width: `${j.growth}%` }} />
                      </div>
                      <span className="font-bold tabular text-gov-ok w-12">+{j.growth}%</span>
                    </div>
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
          <SourceNote source={illustrative} compact className="ms-auto" />
        </h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>المهنة</th>
                <th className="text-end w-32">نسبة التراجع</th>
              </tr>
            </thead>
            <tbody>
              {futureJobs.declining.map((j) => (
                <tr key={j.name}>
                  <td className="font-medium text-gov-ink">{j.name}</td>
                  <td className="text-end">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gov-bg rounded-full overflow-hidden">
                        <div className="h-full bg-gov-danger rounded-full" style={{ width: `${Math.abs(j.growth)}%` }} />
                      </div>
                      <span className="font-bold tabular text-gov-danger w-12">{j.growth}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New jobs */}
      <div className="px-4 mt-4">
        <h3 className="gov-section-title mb-2">وظائف نشأت بعد 2020</h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>المهنة</th>
                <th className="text-end w-40">القطاع</th>
              </tr>
            </thead>
            <tbody>
              {newJobs2030.map((j) => (
                <tr key={j.name}>
                  <td className="font-medium text-gov-ink">{j.name}</td>
                  <td className="text-end">
                    <span className="gov-badge gov-badge-info">{j.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 mt-4">
        <div className="bg-gov-bg-soft border-r-4 border-r-gov-warn rounded-gov p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-gov-warn shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-gov-warn mb-1">تنبيه</p>
              <p className="text-[11px] text-gov-body leading-relaxed">{t('data.future.caution')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="px-4 mt-3">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <SourceNote source={illustrative} note={t('data.note.projections')} />
        </div>
      </div>
    </div>
  );
}
