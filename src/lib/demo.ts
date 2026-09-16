// A ready demo identity, seeded once on a device that has never been used.
//
// The app is shown to people in short live demos, where "create an account,
// answer twelve questions, run a calculation" is three minutes nobody has. So a
// first launch lands signed in, on a profile that already has history: saved
// majors, a finished interests report, past calculations, a conversation with
// the advisor. Every screen therefore has something real to render immediately.
//
// It is seeded ONLY when no account exists at all. Signing out, deleting the
// account, or creating a second one leaves it alone, and a real account behaves
// exactly as it always did — starting empty, which is correct for a real user.

import { REPORT_VERSION } from './riasec';
import {
  DEMO_ACCOUNT_ID,
  seedAccount,
  type Account,
  type StudyPath,
} from './account';

const ACTIVITY_PREFIX = 'murshidi.activity.';
const REPORT_PREFIX = 'murshidi.riasec.';
const CHAT_PREFIX = 'murshidi.chat.';
const SEEDED_FLAG = 'murshidi.demo.v1';

/** Academic track, science-and-technology field: the most instructive path to
 *  open on, because it opens computing and closes medicine — so the eligibility
 *  engine has something to say on the first screen a visitor sees. */
const DEMO_PATH: StudyPath = { track: 'academic', field: 'science-tech' };
const DEMO_GRADE = 85;

/** Days back from now, as an ISO string — so seeded history is never in the future. */
function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, (days * 7) % 60, 0, 0);
  return d.toISOString();
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage is optional; a demo that cannot seed still runs empty */
  }
}

function activityStore() {
  return {
    events: [
      { kind: 'visit', at: daysAgo(9), label: '/roi' },
      { kind: 'calculation', at: daysAgo(9, 11), label: 'cs' },
      { kind: 'visit', at: daysAgo(8), label: '/compare' },
      { kind: 'comparison', at: daysAgo(8, 12), label: 'cs · data-science · cyber' },
      { kind: 'visit', at: daysAgo(6), label: '/market' },
      { kind: 'visit', at: daysAgo(5), label: '/personality' },
      { kind: 'interestsTest', at: daysAgo(5, 13), label: 'RIASEC' },
      { kind: 'visit', at: daysAgo(4), label: '/chat' },
      { kind: 'aiQuestion', at: daysAgo(4, 15), label: 'الطب والمسار' },
      { kind: 'aiQuestion', at: daysAgo(4, 16), label: 'علوم الحاسوب' },
      { kind: 'visit', at: daysAgo(2), label: '/simulate' },
      { kind: 'simulation', at: daysAgo(2, 9), label: 'cs' },
      { kind: 'visit', at: daysAgo(1), label: '/scholarships' },
      { kind: 'calculation', at: daysAgo(1, 17), label: 'data-science' },
    ],
    savedMajors: ['cs', 'data-science', 'cyber'],
    reports: [
      { id: 'demo-interests', kind: 'interests', title: 'تقرير الميول', at: daysAgo(5, 13) },
      { id: 'demo-roi', kind: 'roi', title: 'عائد التعليم — علوم الحاسوب', at: daysAgo(9, 11) },
    ],
  };
}

/** A finished interests report, so Profile and the test both open with a result. */
function interestsReport() {
  return {
    version: REPORT_VERSION,
    at: daysAgo(5, 13),
    lang: 'ar',
    coreScores: { R: 6, I: 18, A: 7, S: 5, E: 8, C: 11 },
    adaptiveScores: { R: 0, I: 6, A: 0, S: 0, E: 3, C: 3 },
    adaptiveAnswers: [],
    adaptiveUsed: false,
    top: ['I', 'C', 'E'],
    shortlist: [
      { id: 'cs', fit: 92 },
      { id: 'data-science', fit: 88 },
      { id: 'cyber', fit: 84 },
      { id: 'accounting', fit: 71 },
      { id: 'business', fit: 66 },
    ],
    blocked: [{ id: 'medicine', fit: 74 }],
    grade: DEMO_GRADE,
    path: DEMO_PATH,
    narrative:
      'نمطك الغالب تحليليّ ومنظّم: تميل إلى تفكيك المسألة قبل حلّها، وتفضّل العمل الذي تُقاس نتيجته. ' +
      'بمعدّل 85 في الحقل الأكاديمي — العلوم والتكنولوجيا، أنت فوق الحدّ الأدنى المنشور لتخصّصات كليّة ' +
      'تكنولوجيا المعلومات والذكاء الاصطناعي (75%)، وهذه أقرب مجموعة إلى نمطك.\n\n' +
      'انتبه إلى أمرين: الحدّ الأدنى للالتحاق ليس الحدّ التنافسي — وهذا الأخير لم يُنشر بعد لعام 2026/2027 ' +
      'وهو عادةً أعلى. والطبّ البشري، وإن ظهر كتطابق قويّ مع ميولك، ليس ضمن قوائم حقلك بحسب جدول مجلس ' +
      'التعليم العالي؛ فهو متاح من الحقل الصحّي.\n\n' +
      'هذا التحليل إرشاديّ وليس تقييماً نفسيّاً معتمداً.',
    narrativeModel: 'demo',
  };
}

/** One exchange with the advisor, so the chat screen is not an empty box. */
function chatHistory() {
  const base = new Date(daysAgo(4, 15)).getTime();
  return [
    {
      id: 'demo-q1',
      role: 'user',
      text: 'معدّلي 85 وحقلي العلوم والتكنولوجيا. بقدر أدرس طب؟',
      at: base,
    },
    {
      id: 'demo-a1',
      role: 'assistant',
      text:
        'القيد عندك ليس المعدّل — بل الحقل.\n\n' +
        '1) الطبّ البشري مدرج في جدول مجلس التعليم العالي تحت **الحقل الصحّي** فقط، ولا يظهر ضمن قوائم ' +
        'حقل العلوم والتكنولوجيا. فمعدّل 85 لا يغيّر هذا، ولا حتى معدّل أعلى.\n' +
        '2) ما يفتحه حقلك فعلاً: العلوم، تكنولوجيا المعلومات، علوم الحاسوب، الذكاء الاصطناعي، الزراعة، ' +
        'تخصّصات التغذية وعلم الغذاء.\n' +
        '3) الحدّ الأدنى المنشور للالتحاق بتخصّصات تكنولوجيا المعلومات والذكاء الاصطناعي هو 75%، ومعدّلك فوقه.\n' +
        '4) لو الطبّ هو الهدف فعلاً، فالقرار يعود لتغيير الحقل، لا لرفع المعدّل — راجع مدرستك في ذلك.\n\n' +
        'افتح «حقلي وكليّاتي» لتقرأ القائمة كما نشرتها الوزارة، والحاسبة لمقارنة الكلفة والعائد.',
      at: base + 4000,
      model: 'demo',
      source: 'local',
    },
  ];
}

/**
 * Seeds the demo identity if — and only if — this device has no account yet.
 * Returns the account when it seeds one, null when it leaves things alone.
 */
export async function seedDemoIdentity(): Promise<Account | null> {
  try {
    if (localStorage.getItem(SEEDED_FLAG) === '1') return null;
  } catch {
    return null;
  }

  const account = await seedAccount({
    id: DEMO_ACCOUNT_ID,
    name: 'سارة العمري',
    grade: DEMO_GRADE,
    city: 'عمّان',
    path: DEMO_PATH,
    createdAt: daysAgo(12, 9),
  });
  if (!account) return null;

  write(`${ACTIVITY_PREFIX}${account.id}`, activityStore());
  write(`${REPORT_PREFIX}${account.id}`, interestsReport());
  write(`${CHAT_PREFIX}${account.id}`, chatHistory());
  try {
    localStorage.setItem(SEEDED_FLAG, '1');
  } catch {
    /* the flag is best-effort; worst case it seeds again on a device that cannot store */
  }
  return account;
}

/** True when this profile is the seeded demo rather than one a person created. */
export function isDemoAccount(id: string | null | undefined): boolean {
  return id === DEMO_ACCOUNT_ID;
}
