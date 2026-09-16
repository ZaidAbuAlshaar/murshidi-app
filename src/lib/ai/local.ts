// Rule-based offline advisor — the last link in the fallback chain.
//
// When every remote model fails (the free Gemma pool returns HTTP 429 often
// enough that this is a normal path, not an edge case) the chat still has to
// answer. These answers are deterministic and read every figure out of
// src/data/majors.ts by field name, so nothing here can drift away from the
// dataset the rest of the app renders. No figure is typed into this file.

import { majorsData } from '../../data/majors';
import type { Major } from '../../data/majors';
import { categoryLabel, majorName } from './grounding';
import type { AiProfileContext } from './types';

type Lang = 'ar' | 'en';

/** Strips Arabic diacritics and folds the letter variants students actually type. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(normalize(needle)));
}

/** Pulls a plausible Tawjihi average (55–100) out of free text. */
function extractGrade(text: string): number | null {
  const matches = text.match(/\d{2,3}(?:[.,]\d)?/g);
  if (!matches) return null;
  for (const raw of matches) {
    const value = Number(raw.replace(',', '.'));
    if (Number.isFinite(value) && value >= 55 && value <= 100) return value;
  }
  return null;
}

function matchMajors(text: string): Major[] {
  return majorsData.filter((major) => {
    const ar = normalize(major.nameAr);
    const en = normalize(major.nameEn);
    return (ar.length > 3 && text.includes(ar)) || (en.length > 3 && text.includes(en));
  });
}

function byAcceptance(a: Major, b: Major): number {
  return b.averageAcceptance - a.averageAcceptance;
}

const SOURCE_NOTE: Record<Lang, string> = {
  ar: 'المصدر: قاعدة بيانات تطبيق مُرشِدي. معدّلات القبول المذكورة استرشاديّة وليست الحدود التنافسيّة الرسميّة للقبول الموحّد 2026/2027.',
  en: 'Source: the Murshidi app dataset. The acceptance averages quoted are indicative, not the official 2026/2027 unified-admission minimums.',
};

function compose(lang: Lang, lines: string[], tool: string): string {
  return [...lines, '', tool, SOURCE_NOTE[lang]].join('\n');
}

const TOOL: Record<Lang, Record<'roi' | 'compare' | 'market' | 'interests' | 'alternatives', string>> = {
  ar: {
    roi: 'الخطوة التالية: افتح «حاسبة عائد التعليم» لتقارن الكلفة والعائد رقميّاً.',
    compare: 'الخطوة التالية: افتح «مقارنة التخصّصات» وضع هذه الخيارات جنباً إلى جنب.',
    market: 'الخطوة التالية: افتح صفحة «سوق العمل» — كلّ رقم فيها مرفق بمصدره أو بشارة «مثال توضيحي».',
    interests: 'الخطوة التالية: ابدأ بـ«اختبار الميول» فهو يضيّق الخيارات قبل أن تقارن الأرقام.',
    alternatives: 'الخطوة التالية: راجع «المسارات البديلة» (دبلوم مهني و BTEC) قبل استبعاد أيّ خيار.',
  },
  en: {
    roi: 'Next step: open the Education ROI Calculator to compare cost against return.',
    compare: 'Next step: open Compare Majors and put these options side by side.',
    market: 'Next step: open the Job Market page — every figure there carries its source or an "illustrative" badge.',
    interests: 'Next step: start with the Interests Test; it narrows the field before you compare numbers.',
    alternatives: 'Next step: review Alternative Paths (vocational diplomas and BTEC) before ruling anything out.',
  },
};

function factsheet(major: Major, lang: Lang, grade: number | null): string[] {
  const name = majorName(major, lang);
  const lines =
    lang === 'ar'
      ? [
          `${name}:`,
          `1) معدّل القبول الاسترشادي: ${major.averageAcceptance}`,
          `2) مدّة الدراسة: ${major.duration} سنوات`,
          `3) الرسوم الحكوميّة التقديريّة: ${major.yearlyTuitionGov} د.أ للسنة`,
          `4) المجال: ${categoryLabel(major.category, lang)}`,
        ]
      : [
          `${name}:`,
          `1) Indicative acceptance average: ${major.averageAcceptance}`,
          `2) Duration: ${major.duration} years`,
          `3) Estimated public tuition: ${major.yearlyTuitionGov} JOD per year`,
          `4) Field: ${categoryLabel(major.category, lang)}`,
        ];

  if (grade !== null) {
    const gap = Number((major.averageAcceptance - grade).toFixed(1));
    if (gap <= 0) {
      lines.push(
        lang === 'ar'
          ? `5) بمعدّلك ${grade} أنت ضمن المعدّل الاسترشادي لهذا التخصّص.`
          : `5) With your ${grade} average you are within this major's indicative range.`,
      );
    } else if (gap <= 3) {
      lines.push(
        lang === 'ar'
          ? `5) معدّلك ${grade} أقلّ بـ${gap} نقطة من المعدّل الاسترشادي — الفرصة قائمة وتعتمد على تنافس هذا العام.`
          : `5) Your ${grade} is ${gap} points below the indicative average — still possible, depending on this year's competition.`,
      );
    } else {
      lines.push(
        lang === 'ar'
          ? `5) معدّلك ${grade} أقلّ بـ${gap} نقطة من المعدّل الاسترشادي، لذلك ادرس البدائل أدناه بجدّيّة.`
          : `5) Your ${grade} is ${gap} points below the indicative average, so weigh the alternatives below seriously.`,
      );
    }
  }
  return lines;
}

function nearestAlternatives(major: Major, grade: number | null, limit = 4): Major[] {
  const ceiling = grade ?? major.averageAcceptance - 5;
  return majorsData
    .filter((m) => m.id !== major.id && m.averageAcceptance <= ceiling)
    .sort((a, b) => {
      const sameField = Number(b.category === major.category) - Number(a.category === major.category);
      return sameField !== 0 ? sameField : byAcceptance(a, b);
    })
    .slice(0, limit);
}

function alternativesBlock(items: Major[], lang: Lang): string[] {
  if (items.length === 0) return [];
  return [
    '',
    lang === 'ar' ? 'خيارات ضمن المتناول حسب بيانات التطبيق:' : 'Options within reach per the app dataset:',
    ...items.map(
      (m) =>
        `- ${majorName(m, lang)} — ${
          lang === 'ar'
            ? `معدّل استرشادي ${m.averageAcceptance}، ${m.duration} سنوات`
            : `indicative ${m.averageAcceptance}, ${m.duration} years`
        }`,
    ),
  ];
}

function eligibilityAnswer(grade: number, lang: Lang): string {
  const within = majorsData.filter((m) => m.averageAcceptance <= grade).sort(byAcceptance).slice(0, 6);
  const borderline = majorsData
    .filter((m) => m.averageAcceptance > grade && m.averageAcceptance - grade <= 3)
    .sort(byAcceptance)
    .slice(0, 3);

  const lines: string[] =
    lang === 'ar'
      ? [`بمعدّل ${grade}، وبالاعتماد على المعدّلات الاسترشاديّة في قاعدة بيانات التطبيق:`]
      : [`With an average of ${grade}, based on the indicative averages in the app dataset:`];

  if (within.length > 0) {
    lines.push('', lang === 'ar' ? 'ضمن المتناول:' : 'Within reach:');
    within.forEach((m, i) =>
      lines.push(
        `${i + 1}) ${majorName(m, lang)} — ${
          lang === 'ar'
            ? `معدّل استرشادي ${m.averageAcceptance}، ${m.duration} سنوات، ${m.yearlyTuitionGov} د.أ/سنة حكومي`
            : `indicative ${m.averageAcceptance}, ${m.duration} years, ${m.yearlyTuitionGov} JOD/year public`
        }`,
      ),
    );
  } else {
    lines.push(
      '',
      lang === 'ar'
        ? 'لا يوجد تخصّص في قاعدة البيانات ضمن هذا المعدّل — راجع «المسارات البديلة» فهي مصمّمة لهذه الحالة.'
        : 'No major in the dataset sits at that average — check Alternative Paths, which exist for exactly this case.',
    );
  }

  if (borderline.length > 0) {
    lines.push(
      '',
      lang === 'ar' ? 'على الحدّ (فرق ثلاث نقاط أو أقلّ):' : 'Borderline (within three points):',
      ...borderline.map(
        (m) => `- ${majorName(m, lang)} — ${lang === 'ar' ? `معدّل استرشادي ${m.averageAcceptance}` : `indicative ${m.averageAcceptance}`}`,
      ),
    );
  }

  return compose(lang, lines, TOOL[lang].roi);
}

function tuitionAnswer(targets: Major[], lang: Lang): string {
  const items = targets.length > 0 ? targets : [...majorsData].sort(byAcceptance).slice(0, 5);
  const lines = [
    lang === 'ar'
      ? 'الرسوم التقديريّة لسنة دراسيّة واحدة كما هي مسجّلة في قاعدة بيانات التطبيق:'
      : 'Estimated tuition for one academic year as recorded in the app dataset:',
    '',
    ...items.map(
      (m, i) =>
        `${i + 1}) ${majorName(m, lang)} — ${
          lang === 'ar'
            ? `حكومي ${m.yearlyTuitionGov} د.أ، خاصّ ${m.yearlyTuitionPrivate} د.أ، لمدّة ${m.duration} سنوات`
            : `public ${m.yearlyTuitionGov} JOD, private ${m.yearlyTuitionPrivate} JOD, over ${m.duration} years`
        }`,
    ),
    '',
    lang === 'ar'
      ? 'اضرب الرسوم في عدد سنوات الدراسة وأضف النقل والسكن للحصول على الكلفة الحقيقيّة.'
      : 'Multiply by the number of years and add transport and housing for the real cost.',
  ];
  return compose(lang, lines, TOOL[lang].roi);
}

function marketAnswer(targets: Major[], lang: Lang): string {
  const items = targets.length > 0 ? targets : [];
  const lines =
    lang === 'ar'
      ? [
          'أرقام التشغيل والبطالة والرواتب لا تُعرض في المحادثة بلا مصدر.',
          '',
          '1) صفحة «سوق العمل» تعرض هذه المؤشّرات، وكلّ رقم فيها إمّا منسوب إلى جهة مُسمّاة أو يحمل شارة «مثال توضيحي • ليست بيانات رسميّة».',
          '2) اقرأ الشارة قبل أن تبني قرارك على الرقم.',
          '3) للأرقام الرسميّة الأحدث: دائرة الإحصاءات العامّة ووزارة التعليم العالي والبحث العلمي.',
        ]
      : [
          'Employment, unemployment and salary figures are not quoted in chat without a source.',
          '',
          '1) The Job Market page shows these indicators, and each figure is either attributed to a named body or badged "Illustrative example • not official data".',
          '2) Read the badge before you build a decision on the number.',
          '3) For the latest official figures: the Department of Statistics and the Ministry of Higher Education.',
        ];

  if (items.length > 0) {
    lines.push(
      '',
      lang === 'ar' ? 'ما يمكنني تأكيده من بيانات التطبيق:' : 'What I can confirm from the app dataset:',
      ...items.map(
        (m) =>
          `- ${majorName(m, lang)} — ${
            lang === 'ar'
              ? `معدّل قبول استرشادي ${m.averageAcceptance}، ${m.duration} سنوات`
              : `indicative acceptance ${m.averageAcceptance}, ${m.duration} years`
          }`,
      ),
    );
  }
  return compose(lang, lines, TOOL[lang].market);
}

function compareAnswer(targets: Major[], lang: Lang, grade: number | null): string {
  const items = targets.slice(0, 3);
  const lines = [
    lang === 'ar' ? 'مقارنة سريعة من بيانات التطبيق:' : 'Quick comparison from the app dataset:',
    '',
    ...items.flatMap((m, i) => [
      `${i + 1}) ${majorName(m, lang)} — ${
        lang === 'ar'
          ? `معدّل استرشادي ${m.averageAcceptance}، ${m.duration} سنوات، ${m.yearlyTuitionGov} د.أ/سنة حكومي`
          : `indicative ${m.averageAcceptance}, ${m.duration} years, ${m.yearlyTuitionGov} JOD/year public`
      }`,
    ]),
  ];
  if (grade !== null) {
    const reachable = items.filter((m) => m.averageAcceptance <= grade).map((m) => majorName(m, lang));
    lines.push(
      '',
      reachable.length > 0
        ? lang === 'ar'
          ? `بمعدّلك ${grade}، ما يقع ضمن المعدّل الاسترشادي: ${reachable.join('، ')}.`
          : `With your ${grade}, within the indicative range: ${reachable.join(', ')}.`
        : lang === 'ar'
          ? `بمعدّلك ${grade}، جميع الخيارات أعلاه فوق المعدّل الاسترشادي — وسّع القائمة قبل أن تقرّر.`
          : `With your ${grade}, all of the above sit above the indicative average — widen the list before deciding.`,
    );
  }
  return compose(lang, lines, TOOL[lang].compare);
}

function abroadAnswer(lang: Lang): string {
  const lines =
    lang === 'ar'
      ? [
          'لا أملك بيانات موثّقة عن رواتب أو شروط التوظيف خارج الأردن، ولن أذكر رقماً لا أستطيع نسبته إلى مصدر.',
          '',
          '1) تحقّق من شروط الترخيص المهني في الدولة المقصودة قبل اختيار التخصّص — كثير من المهن الصحّيّة والهندسيّة تشترط امتحان معادلة.',
          '2) معظم الإعلانات في دول الخليج تطلب خبرة عمليّة، فخطّط لسنوات العمل الأولى داخل الأردن.',
          '3) اختر تخصّصاً يصلح محلّيّاً أوّلاً؛ خطّة مبنيّة على السفر وحده خطّة هشّة.',
        ]
      : [
          'I have no verified data on salaries or hiring conditions outside Jordan, and I will not quote a figure I cannot attribute.',
          '',
          '1) Check professional licensing rules in the destination country first — many health and engineering roles require an equivalency exam.',
          '2) Most Gulf postings ask for prior experience, so plan your first working years inside Jordan.',
          '3) Pick a major that works locally first; a plan that depends on emigration alone is fragile.',
        ];
  return compose(lang, lines, TOOL[lang].compare);
}

function pressureAnswer(lang: Lang, grade: number | null): string {
  const lines =
    lang === 'ar'
      ? [
          'الخلاف مع الأهل حول التخصّص يُحلّ بالأرقام أكثر ممّا يُحلّ بالجدال:',
          '',
          '1) اعرض عليهم صفحة المقارنة داخل التطبيق بدل النقاش الشفوي — الأرقام المكتوبة تخفّض حدّة النقاش.',
          '2) اسأل نفسك أوّلاً: ما الذي يقلقهم فعلاً؟ الدخل، أم الاستقرار الوظيفي، أم رأي المحيط؟ لكلّ قلق ردّ مختلف.',
          '3) اعرض خيار وسط: تخصّص يجمع ميولك بمجال يطمئنهم، أو مسار دبلوم قصير يثبت جدّيّتك.',
          '4) اطلب مهلة قرار محدّدة بأسبوع بدل الرفض الفوري من الطرفين.',
        ]
      : [
          'Disagreement with family over a major is settled with figures more often than with argument:',
          '',
          '1) Show them the comparison page instead of debating verbally — written numbers lower the temperature.',
          '2) Ask yourself what actually worries them: income, job security, or what relatives will say. Each needs a different answer.',
          '3) Offer a middle option: a major that joins your interest to a field that reassures them, or a short diploma that proves you are serious.',
          '4) Ask for a one-week decision window instead of an immediate no from either side.',
        ];
  if (grade !== null) {
    lines.push(
      '',
      lang === 'ar'
        ? `معدّلك ${grade} — استخدم قائمة «ضمن المتناول» في الحاسبة كأرضيّة موضوعيّة للنقاش.`
        : `Your average is ${grade} — use the calculator's "within reach" list as the objective basis for the conversation.`,
    );
  }
  return compose(lang, lines, TOOL[lang].compare);
}

function defaultAnswer(lang: Lang): string {
  const lines =
    lang === 'ar'
      ? [
          'لأساعدك بشكل مفيد، هذا ترتيب الخطوات الذي ننصح به:',
          '',
          '1) ابدأ بـ«اختبار الميول» لتضييق المجالات المحتملة.',
          '2) اختر ثلاثة تخصّصات وقارنها في «مقارنة التخصّصات».',
          '3) مرّرها على «حاسبة عائد التعليم» لترى الكلفة مقابل العائد.',
          '4) راجع «سوق العمل» و«المنح الدراسيّة» قبل الحسم.',
          '',
          'واذكر لي معدّلك أو اسم التخصّص الذي تفكّر به لأعطيك إجابة أدقّ.',
        ]
      : [
          'To help you usefully, this is the order we recommend:',
          '',
          '1) Start with the Interests Test to narrow the possible fields.',
          '2) Pick three majors and put them through Compare Majors.',
          '3) Run them through the Education ROI Calculator to see cost against return.',
          '4) Review the Job Market page and Scholarships before committing.',
          '',
          'Tell me your average or the major you are considering and I can be more specific.',
        ];
  return compose(lang, lines, TOOL[lang].interests);
}

/**
 * Deterministic answer used when every remote model attempt has failed.
 * Pure function of (prompt, language, profile, majorsData) — no network, no clock.
 */
export function localAnswer(prompt: string, lang: Lang, profile?: AiProfileContext): string {
  const text = normalize(prompt);
  const grade = extractGrade(text) ?? (typeof profile?.grade === 'number' ? profile.grade : null);
  const named = matchMajors(text);

  if (hasAny(text, ['قارن', 'مقارنه', 'الفرق بين', 'compare', ' vs ', 'versus', 'difference between']) && named.length >= 2) {
    return compareAnswer(named, lang, grade);
  }

  if (hasAny(text, ['كلفه', 'تكلفه', 'رسوم', 'اقساط', 'سعر', 'cost', 'tuition', 'fees', 'price', 'how much'])) {
    return tuitionAnswer(named, lang);
  }

  if (hasAny(text, ['الخليج', 'خليج', 'سفر', 'اسافر', 'الهجره', 'الخارج', 'برا', 'gulf', 'abroad', 'emigrat', 'overseas', 'saudi', 'emirates', 'qatar'])) {
    return abroadAnswer(lang);
  }

  if (hasAny(text, ['بطاله', 'وظايف', 'وظائف', 'شواغر', 'راتب', 'رواتب', 'سوق العمل', 'unemploy', 'salary', 'salaries', 'wage', 'vacanc', 'job market', 'hiring'])) {
    return marketAnswer(named, lang);
  }

  if (hasAny(text, ['اهلي', 'الاهل', 'ابوي', 'امي', 'ضغط', 'يجبرو', 'يرفضو', 'family', 'parents', 'pressure', 'force me', 'against my'])) {
    return pressureAnswer(lang, grade);
  }

  if (named.length >= 2) return compareAnswer(named, lang, grade);

  if (named.length === 1) {
    const major = named[0];
    const lines = [...factsheet(major, lang, grade)];
    if (grade !== null && grade < major.averageAcceptance) {
      lines.push(...alternativesBlock(nearestAlternatives(major, grade), lang));
    }
    return compose(lang, lines, TOOL[lang].compare);
  }

  if (grade !== null) return eligibilityAnswer(grade, lang);

  return defaultAnswer(lang);
}
