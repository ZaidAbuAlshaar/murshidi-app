import { GraduationCap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SourceNote from '../components/SourceNote';
import { dosUnemployment } from '../data/majors';
import { useLang } from '../i18n/LangContext';

interface Alternative {
  id: number;
  name: string;
  type: 'دبلوم' | 'شهادة' | 'تدريب' | 'BTEC';
  duration: string;
  cost: number;
  startSalary: number;
  unemployment: number;
  description: string;
}

const alternatives: Alternative[] = [
  { id: 1, name: 'دبلوم التصميم الداخلي', type: 'دبلوم', duration: 'سنتان',
    cost: 4500, startSalary: 380, unemployment: 22,
    description: 'بديل عملي للهندسة المعماريّة. الدخول إلى السوق أسرع، والكلفة أقلّ من البكالوريوس.' },
  { id: 2, name: 'شهادات AutoCAD و Revit و 3D', type: 'شهادة', duration: '6 أشهر',
    cost: 1800, startSalary: 450, unemployment: 18,
    description: 'مسار قصير سريع الدخل لمن يهتمّ بالتصميم الإنشائي والمعماري.' },
  { id: 3, name: 'تدريب Full-Stack Web Development', type: 'تدريب', duration: '9 أشهر',
    cost: 2500, startSalary: 650, unemployment: 8,
    description: 'بديل قوي لعلوم الحاسوب عبر منصّات مثل Edraak و Udacity. الأهمّ بناء ملف أعمال فعلي.' },
  { id: 4, name: 'دبلوم BTEC في الأمن السيبراني', type: 'BTEC', duration: 'سنتان',
    cost: 3800, startSalary: 580, unemployment: 6,
    description: 'مسار مهني قصير في مجال يتوسّع محلّيّاً. تحقّق من اعتماد البرنامج لدى الجهة المقدّمة قبل التسجيل.' },
  { id: 5, name: 'دبلوم التمريض', type: 'دبلوم', duration: '3 سنوات',
    cost: 5400, startSalary: 380, unemployment: 11,
    description: 'فرص عمل ممتازة في الخليج وأوروبا. أقصر بسنة من البكالوريوس.' },
  { id: 6, name: 'شهادات Google Career', type: 'شهادة', duration: '4-6 أشهر',
    cost: 600, startSalary: 480, unemployment: 15,
    description: 'تخصّصات: تحليل البيانات، إدارة المشاريع، تجربة المستخدم. كلفتها منخفضة ومسارها ذاتي التعلّم.' },
];

export default function Alternatives() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader title="المسارات البديلة" subtitle="ليست الجامعة الطريق الوحيد" />

      {/* Intro */}
      <div className="bg-white border-b border-gov-line p-4">
        <div className="bg-gov-bg-soft border-r-4 border-r-gov-green rounded-gov p-3">
          <div className="flex items-start gap-2">
            <GraduationCap size={16} className="text-gov-green shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-gov-green mb-1">رسالة مهمّة</p>
              <p className="text-xs text-gov-body leading-relaxed">{t('data.alternatives.message')}</p>
              <p className="text-xs text-gov-ink font-semibold mt-2">
                {t('data.alternatives.context')}: <span className="tabular">{dosUnemployment.jordanians.toFixed(1)}%</span>
                {' '}<span className="font-normal text-gov-muted">({t('data.dos.period')})</span>
              </p>
              <SourceNote className="mt-1.5" source={dosUnemployment.source} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick comparison */}
      <div className="p-4">
        <h3 className="gov-section-title mb-2 flex items-center gap-2">
          مقارنة سريعة
          <SourceNote source="illustrative" compact className="ms-auto" />
        </h3>
        <div className="gov-card overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>المسار</th>
                <th className="text-end">المدّة</th>
                <th className="text-end">الكلفة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-gov-ink">بكالوريوس جامعي تقليدي</td>
                <td className="text-end tabular text-gov-danger">4-6 سنوات</td>
                <td className="text-end tabular font-semibold">25,000 د.أ</td>
              </tr>
              <tr>
                <td className="font-medium text-gov-ink">دبلوم BTEC مهني</td>
                <td className="text-end tabular text-gov-ok">سنتان</td>
                <td className="text-end tabular font-semibold">5,000 د.أ</td>
              </tr>
              <tr>
                <td className="font-medium text-gov-ink">شهادات تخصّصيّة قصيرة</td>
                <td className="text-end tabular text-gov-ok">6-9 أشهر</td>
                <td className="text-end tabular font-semibold">1,500 د.أ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Alternatives list */}
      <div className="px-4">
        <h3 className="gov-section-title mb-2">المسارات المتاحة</h3>
        <div className="space-y-3">
          {alternatives.map((a) => (
            <div key={a.id} className="gov-card overflow-hidden">
              <div className="px-4 py-3 border-b border-gov-line flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-gov-ink leading-tight flex-1">{a.name}</h4>
                <SourceNote source="illustrative" compact />
                <span className="gov-badge gov-badge-info shrink-0">{a.type}</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-gov-body leading-relaxed mb-3">{a.description}</p>
                <table className="gov-table">
                  <tbody>
                    <tr>
                      <td className="text-gov-muted">المدّة الزمنيّة</td>
                      <td className="text-end font-semibold">{a.duration}</td>
                    </tr>
                    <tr>
                      <td className="text-gov-muted">الكلفة الإجماليّة</td>
                      <td className="text-end font-semibold tabular">{a.cost.toLocaleString()} د.أ</td>
                    </tr>
                    <tr>
                      <td className="text-gov-muted">راتب البداية</td>
                      <td className="text-end font-semibold tabular">{a.startSalary} د.أ</td>
                    </tr>
                    <tr>
                      <td className="text-gov-muted">نسبة البطالة في المجال</td>
                      <td className={`text-end font-semibold tabular ${a.unemployment < 15 ? 'text-gov-ok' : 'text-gov-warn'}`}>
                        {a.unemployment}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="px-4 mt-4">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <SourceNote source="illustrative" note={t('data.note.alternatives')} />
        </div>
      </div>
    </div>
  );
}
