import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useKeyboardOpen } from '../hooks/useKeyboardOpen';

interface Msg { role: 'user' | 'ai'; text: string; time: string; }

const suggestions = [
  'معدّلي 78 وأرغب بدراسة الطبّ، ما الخيارات المتاحة؟',
  'يضغط عليّ الأهل لاختيار الهندسة، ما النصيحة؟',
  'ما أفضل التخصّصات للعمل في دول الخليج؟',
  'هل يُنصح بدراسة الإعلام رغم نسبة البطالة العالية؟',
  'كم تبلغ كلفة دراسة الطبّ في الجامعات الأردنيّة؟',
  'كيف أقارن بين علوم الحاسوب وعلم البيانات؟',
];

const aiResponses: Record<string, string> = {
  default:
    'استناداً إلى بيانات DOS الأردني وتحليل سوق العمل، نوصي بالخطوات التالية:\n\n1) إجراء اختبار الميول الأكاديمي داخل المنصّة لتحديد التوجّه النفسي المهني.\n2) استخدام حاسبة عائد التعليم لمقارنة 3–5 تخصّصات مرشّحة.\n3) مراجعة شهادات الخرّيجين في كلّ تخصّص.\n4) حجز جلسة استشاريّة مجّانيّة مع مرشد مهني معتمد.',
  'طبيب':
    'بمعدّل 78، يكون القبول في تخصّص الطبّ البشري في الجامعات الحكوميّة بعيد المنال (الحدّ الأدنى 96 تقريباً). البدائل المتاحة في القطاع الصحّي:\n\n- التمريض (حدّ القبول 75) – راتب البداية 420 د.أ، طلب مرتفع في دول الخليج.\n- العلاج الطبيعي (حدّ القبول 78) – راتب البداية 480 د.أ.\n- التغذية والحمية (حدّ القبول 76) – مجال متنامٍ.\n- علم النفس السريري (حدّ القبول 75).\n\nيُنصح بتحديد سبب الرغبة في دراسة الطبّ (المساعدة، الاستقرار المالي، القيمة الاجتماعيّة) لاختيار البديل الأنسب.',
  'هندسة':
    'بحسب نشرة DOS الأخيرة:\n\n- الهندسة المدنيّة: نسبة بطالة 24%.\n- الهندسة المعماريّة: 32%.\n- هندسة البرمجيّات: 9% فقط.\n\nيُنصح بمناقشة الأهل بأسلوب موضوعي بعرض الأرقام عبر حاسبة عائد التعليم. هندسة البرمجيّات والهندسة الطبّيّة الحيويّة تحتفظان بمستقبل قوي حتى عام 2030.',
  'سفر':
    'أفضل التخصّصات للعمل في دول الخليج بحسب نشرات وزارة العمل:\n\n1) التمريض – طلب مرتفع جدّاً (راتب 4,500–6,000 ر.س).\n2) الهندسة المدنيّة – مشاريع البنية التحتيّة الكبرى.\n3) علوم الحاسوب – شركات التقنية المتنامية.\n4) الصيدلة – بعد المعادلة.\n5) التعليم (رياضيّات، فيزياء، عربي).\n\nملاحظات:\n- معظم الفرص تتطلّب خبرة لا تقلّ عن سنتين في الأردن.\n- بعض المهن تتطلّب شهادات تخصّصيّة (HAAD للتمريض).',
  'إعلام':
    'بحسب DOS Q1 2026، تبلغ نسبة البطالة في الإعلام 41%. التحليل التفصيلي:\n\n- الإعلام التقليدي (صحافة، إذاعة، تلفزيون): في تراجع مستمرّ.\n- الإعلام الرقمي: ينمو بنسبة 47% سنويّاً.\n\nالتوصية: اختيار مسار مختلط:\n- إعلام + برمجة → صناعة المحتوى التفاعلي.\n- إعلام + تسويق → التسويق الرقمي.\n- إعلام + تحليل بيانات → الصحافة المبنيّة على البيانات.',
};

function findResponse(text: string): string {
  const t = text.toLowerCase();
  for (const key of Object.keys(aiResponses)) {
    if (t.includes(key)) return aiResponses[key];
  }
  return aiResponses.default;
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'ai',
      text: 'مرحباً بك في خدمة الاستشارة الأكاديميّة.\n\nهذه الخدمة مدعومة ببيانات وزارة التعليم العالي ودائرة الإحصاءات العامّة، وتقدّم إجابات إرشاديّة لمساعدتك في اتخاذ قرار اختيار التخصّص الجامعي.\n\nما هو سؤالك؟',
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const keyboardOpen = useKeyboardOpen();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string = input) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text, time: now() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: findResponse(text), time: now() }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col">
      <PageHeader
        title="الاستشارة الأكاديميّة"
        subtitle="مرشد ذكي ببيانات وزارة التعليم العالي"
        right={<span className="gov-badge gov-badge-success"><span className="w-1.5 h-1.5 rounded-full bg-gov-ok" />متاح</span>}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-32 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'order-1'}`}>
              <div
                className={`p-3 ${
                  msg.role === 'user'
                    ? 'bg-gov-navy text-white rounded-tl-none rounded-lg'
                    : 'bg-white border border-gov-line text-gov-ink rounded-tr-none rounded-lg'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
              <p className={`text-[10px] mt-1 text-gov-muted ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? 'أنت' : 'المرشد الذكي'} · {msg.time}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-end">
            <div className="bg-white border border-gov-line rounded-lg p-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gov-muted"
                  style={{ animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="mt-6">
            <p className="text-[11px] text-gov-muted mb-2 font-semibold">أمثلة على الأسئلة الشائعة</p>
            <div className="space-y-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-right p-3 bg-white border border-gov-line rounded-gov text-xs text-gov-body hover:bg-gov-bg-soft hover:border-gov-navy transition-colors flex items-start gap-2"
                >
                  <MessageSquare size={13} className="text-gov-navy shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{q}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 bg-gov-bg-soft border border-gov-line rounded-gov p-3">
              <div className="flex items-start gap-2">
                <FileText size={14} className="text-gov-muted shrink-0 mt-0.5" />
                <p className="text-[11px] text-gov-muted leading-relaxed">
                  الإجابات إرشاديّة، ولا تحلّ محلّ الاستشارة المهنيّة الفرديّة من المرشدين الأكاديميّين المعتمدين.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input — sits above bottom nav, slides to bottom when keyboard opens */}
      <div
        className="fixed left-0 right-0 bg-white border-t border-gov-line p-3 z-30 transition-all"
        style={{ bottom: keyboardOpen ? 0 : '64px' }}
      >
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="اكتب سؤالك هنا..."
            className="gov-input flex-1"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="btn-primary px-3"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function now() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}
