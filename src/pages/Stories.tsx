import { useState } from 'react';
import { ThumbsUp, Filter, Play, MessageCircle, FileText, Check, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface Story {
  id: number;
  name: string;
  major: string;
  university: string;
  graduationYear: number;
  currentSalary: number;
  helpful: number;
  wouldRedo: boolean;
  quote: string;
  advice: string;
  monthsToJob: number;
  tags: string[];
}

const stories: Story[] = [
  { id: 1, name: 'م. العزب', major: 'الإعلام', university: 'الجامعة الأردنيّة', graduationYear: 2018,
    currentSalary: 700, helpful: 247, wouldRedo: false, monthsToJob: 11,
    quote: 'لو رجعت بالزمن لاخترتُ تكنولوجيا المعلومات. عملتُ سنتين في إذاعة براتب 280 ديناراً، ثم انتقلتُ إلى التسويق الرقمي براتب 700.',
    advice: 'الإعلام التقليدي في تراجع، أمّا الإعلام الرقمي فهو المستقبل. من يختار الإعلام يُنصح بالتخصّص في الإعلام الرقمي مبكّراً.',
    tags: ['ندم', 'تحوّل وظيفي', 'مهارات إضافيّة'],
  },
  { id: 2, name: 'ل. الحوراني', major: 'علوم الحاسوب', university: 'الجامعة الأردنيّة', graduationYear: 2020,
    currentSalary: 1850, helpful: 432, wouldRedo: true, monthsToJob: 2,
    quote: 'بدأتُ براتب 580 ديناراً كمطوّرة junior، واليوم بعد خمس سنوات راتبي 1,850 د.أ عن بُعد لشركة أوروبيّة.',
    advice: 'إتقان الإنجليزيّة بجدّيّة وبدء المساهمة في المشاريع المفتوحة المصدر منذ السنة الثانية. ما يصنع الفرق هو ملف الأعمال الفعليّ.',
    tags: ['راضٍ', 'عمل عن بُعد', 'سفر'],
  },
  { id: 3, name: 'د. الكساسبة', major: 'الطبّ البشري', university: 'العلوم والتكنولوجيا', graduationYear: 2015,
    currentSalary: 1400, helpful: 521, wouldRedo: true, monthsToJob: 4,
    quote: 'دراسة الطبّ شاقّة: ستّ سنوات أوّليّة، خمس سنوات اختصاص، وامتحانات مستمرّة. العائد المعنويّ كبير عند إنقاذ المرضى.',
    advice: 'الطبّ ليس قراراً يُتّخذ تحت ضغط الأهل. ادخله لأنّك تحبّه، فهو طريق طويل ومرهق.',
    tags: ['راضٍ', 'مهنة نبيلة', 'دراسة طويلة'],
  },
  { id: 4, name: 'أ. الزعبي', major: 'الهندسة المدنيّة', university: 'العلوم والتكنولوجيا', graduationYear: 2017,
    currentSalary: 1100, helpful: 198, wouldRedo: true, monthsToJob: 8,
    quote: 'سوق العمل المحلّي ضيّق، لكنّي سافرتُ إلى السعوديّة بعد عام وراتبي 4,500 ر.س مع بدلات سكن.',
    advice: 'إتقان برامج AutoCAD وRevit وPlaxis قبل التخرّج. هذه البرامج تفتح أبواب الخليج.',
    tags: ['راضٍ', 'سفر', 'خليج'],
  },
  { id: 5, name: 'ه. المومني', major: 'الصيدلة', university: 'الجامعة الأردنيّة', graduationYear: 2019,
    currentSalary: 850, helpful: 312, wouldRedo: true, monthsToJob: 5,
    quote: 'الصيدلة تمنح استقراراً وظيفيّاً. عملتُ سنتين في صيدليّة، ثمّ انتقلتُ إلى شركة أدوية كمندوبة طبّيّة براتب 850 د.أ.',
    advice: 'الصناعة الدوائيّة أفضل من العمل في الصيدليّات. التركيز على الإنجليزيّة وإنشاء حساب LinkedIn احترافي.',
    tags: ['راضٍ', 'استقرار', 'صناعة دوائيّة'],
  },
  { id: 6, name: 'ي. قطيشات', major: 'علم البيانات', university: 'الأميرة سميّة', graduationYear: 2022,
    currentSalary: 2100, helpful: 678, wouldRedo: true, monthsToJob: 3,
    quote: 'تخرّجتُ بمعدّل 3.4، وحصلتُ بعد ثلاثة أشهر على وظيفة محلّل بيانات براتب 950 د.أ. اليوم بعد أربع سنوات راتبي 2,100 د.أ عن بُعد.',
    advice: 'تعلّم Python و SQL والإحصاء منذ السنة الأولى، والمشاركة في مسابقات Kaggle تعطي خبرة فعليّة أهمّ من المحاضرات.',
    tags: ['راضٍ', 'الأعلى أجراً', 'مستقبل واعد'],
  },
];

const filters = ['الكلّ', 'راضٍ', 'ندم', 'تحوّل وظيفي', 'سفر'];

export default function Stories() {
  const [filter, setFilter] = useState('الكلّ');

  const filtered = filter === 'الكلّ'
    ? stories
    : stories.filter((s) =>
        filter === 'ندم' ? !s.wouldRedo : s.tags.some((t) => t.includes(filter))
      );

  const stats = {
    total: stories.length,
    satisfied: stories.filter((s) => s.wouldRedo).length,
    avgMonths: Math.round(stories.reduce((a, s) => a + s.monthsToJob, 0) / stories.length),
    avgSalary: Math.round(stories.reduce((a, s) => a + s.currentSalary, 0) / stories.length),
  };

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader
        title="تجارب الخرّيجين"
        subtitle="قاعدة بيانات شهادات حقيقيّة"
        right={
          <button className="w-9 h-9 rounded-md border border-gov-line flex items-center justify-center text-gov-body">
            <Filter size={14} />
          </button>
        }
      />

      {/* Aggregate stats */}
      <div className="bg-white border-b border-gov-line px-4 py-3 grid grid-cols-4 gap-2">
        <Mini label="عيّنة" value={stats.total.toString()} />
        <Mini label="راضون" value={`${Math.round((stats.satisfied/stats.total)*100)}%`} tone="ok" />
        <Mini label="فترة التوظيف" value={`${stats.avgMonths} ش`} />
        <Mini label="متوسّط الراتب" value={`${stats.avgSalary} د`} />
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-gov-line px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap border transition-colors ${
                filter === f
                  ? 'bg-gov-navy text-white border-gov-navy'
                  : 'bg-white text-gov-body border-gov-line hover:bg-gov-bg-soft'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div className="p-4 space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="gov-card overflow-hidden">
            <div className="px-4 py-3 border-b border-gov-line flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gov-ink">{s.name}</p>
                  {s.wouldRedo ? (
                    <span className="gov-badge gov-badge-success"><Check size={10}/> راضٍ</span>
                  ) : (
                    <span className="gov-badge gov-badge-danger"><X size={10}/> غير راضٍ</span>
                  )}
                </div>
                <p className="text-[11px] text-gov-muted mt-0.5">
                  {s.major} · {s.university} · دفعة {s.graduationYear}
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="border-r-2 border-gov-navy/30 pr-3 mb-3">
                <p className="text-sm text-gov-body leading-relaxed">"{s.quote}"</p>
              </div>

              <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3 mb-3">
                <p className="text-[11px] font-semibold text-gov-navy mb-1">النصيحة</p>
                <p className="text-xs text-gov-body leading-relaxed">{s.advice}</p>
              </div>

              <table className="gov-table">
                <tbody>
                  <tr>
                    <td className="text-gov-muted">الراتب الحالي</td>
                    <td className="text-left font-semibold tabular">{s.currentSalary.toLocaleString()} د.أ</td>
                  </tr>
                  <tr>
                    <td className="text-gov-muted">فترة الحصول على وظيفة</td>
                    <td className="text-left font-semibold tabular">{s.monthsToJob} شهر</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gov-line">
                <button className="flex items-center gap-1.5 text-xs text-gov-muted hover:text-gov-navy">
                  <ThumbsUp size={13} />
                  مفيد ({s.helpful})
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gov-muted hover:text-gov-navy">
                  <MessageCircle size={13} />
                  تواصل
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gov-navy font-semibold">
                  <Play size={13} />
                  مشاهدة الفيديو
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4">
        <button className="btn-secondary w-full">عرض المزيد من الشهادات</button>
      </div>

      {/* Methodology */}
      <div className="px-4 mt-3">
        <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
          <div className="flex items-start gap-2">
            <FileText size={14} className="text-gov-muted shrink-0 mt-0.5" />
            <p className="text-[11px] text-gov-muted leading-relaxed">
              تُجمع الشهادات بالشراكة مع الجامعات الأردنيّة بعد موافقة خطّيّة من الخرّيج. الأسماء مختصرة لحماية الخصوصيّة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: 'ok' }) {
  return (
    <div className="text-center">
      <p className={`text-base font-bold tabular ${tone === 'ok' ? 'text-gov-ok' : 'text-gov-ink'}`}>{value}</p>
      <p className="text-[10px] text-gov-muted">{label}</p>
    </div>
  );
}
