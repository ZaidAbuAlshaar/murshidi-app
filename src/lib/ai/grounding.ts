// Grounding for the Murshidi advisor.
//
// The advisor must never quote a figure it remembered from pre-training. Every
// number it is allowed to state is handed to it here, straight out of the app's
// own dataset, with the caveat that belongs to those numbers attached.
//
// Deliberately NOT in this block: unemployment rates, salaries, job-opening
// counts and growth percentages. Those fields exist in src/data/majors.ts but
// are not traceable to a published source, so the model is not given them and
// is told to refuse rather than guess.

import { majorsData } from '../../data/majors';

type Lang = 'ar' | 'en';

const CATEGORY_AR: Record<string, string> = {
  tech: 'تقنية',
  medical: 'صحّي',
  engineering: 'هندسة',
  business: 'أعمال',
  arts: 'إنسانيّات وفنون',
  education: 'تعليم',
  science: 'علوم',
};

const CATEGORY_EN: Record<string, string> = {
  tech: 'Technology',
  medical: 'Health',
  engineering: 'Engineering',
  business: 'Business',
  arts: 'Arts & humanities',
  education: 'Education',
  science: 'Science',
};

export function categoryLabel(category: string, lang: Lang): string {
  const table = lang === 'ar' ? CATEGORY_AR : CATEGORY_EN;
  return table[category] ?? category;
}

export function majorName(
  major: { nameAr: string; nameEn: string },
  lang: Lang,
): string {
  return lang === 'ar' ? major.nameAr : major.nameEn;
}

/**
 * A compact, machine-readable snapshot of the majors table: name, indicative
 * acceptance average, public-university yearly tuition, duration, field.
 * This is the only source of figures the model is permitted to use.
 */
export function buildGroundingBlock(lang: 'ar' | 'en'): string {
  const rows = majorsData.map((major) =>
    [
      majorName(major, lang),
      major.averageAcceptance,
      major.yearlyTuitionGov,
      major.duration,
      categoryLabel(major.category, lang),
    ].join(' | '),
  );

  if (lang === 'ar') {
    return [
      'بيانات تطبيق مُرشِدي — هذه هي المصدر الوحيد المسموح لك باقتباس الأرقام منه:',
      'تنبيه مهمّ: «معدّل القبول» أدناه معدّل استرشادي من قاعدة بيانات التطبيق، وليس الحدّ التنافسي',
      'الرسمي للقبول الموحّد 2026/2027 (لم يُنشر بعد وقت كتابة هذه البيانات). اذكر هذا التحفّظ',
      'كلّما استشهدت بمعدّل قبول.',
      'الرسوم بالدينار الأردني لسنة دراسيّة واحدة في الجامعات الحكوميّة، والمدّة بالسنوات.',
      '',
      'التخصّص | معدّل القبول الاسترشادي | الرسوم الحكوميّة للسنة (د.أ) | المدّة (سنوات) | المجال',
      ...rows,
      '',
      'لا تملك أرقاماً عن الرواتب أو نسب البطالة أو عدد الشواغر — إذا سُئلت عنها قل إنّ التطبيق',
      'يعرضها في صفحة «سوق العمل» مع بيان مصدر كلّ رقم، ولا تذكر رقماً من عندك.',
    ].join('\n');
  }

  return [
    'Murshidi app data — this is the only source you may quote figures from:',
    'Important caveat: the "acceptance average" below is an indicative average from the app',
    'dataset, not the official 2026/2027 unified-admission competitive minimum (not published',
    'at the time this data was compiled). Repeat this caveat whenever you cite an average.',
    'Tuition is in Jordanian dinars for one academic year at public universities; duration in years.',
    '',
    'Major | Indicative acceptance average | Public tuition per year (JOD) | Duration (years) | Field',
    ...rows,
    '',
    'You have no salary, unemployment or vacancy figures. If asked for one, say the app shows',
    'those on the Job Market page with each figure\'s source stated, and do not invent a number.',
  ].join('\n');
}

const TOOLS_AR = [
  '«حاسبة عائد التعليم» لمقارنة الكلفة والعائد',
  '«مقارنة التخصّصات» لمقارنة حتى ثلاثة تخصّصات',
  '«اختبار الميول» لتحديد التوجّه',
  '«سوق العمل» لمؤشّرات التشغيل ومصادرها',
  '«المنح الدراسيّة» و«المسارات البديلة» (دبلوم/BTEC)',
].join('، ');

const TOOLS_EN = [
  'the Education ROI Calculator',
  'Compare Majors',
  'the Interests Test',
  'the Job Market page',
  'Scholarships and Alternative Paths',
].join(', ');

/**
 * The advisor system prompt. Written in Arabic on purpose — the app is
 * Arabic-first and the instruction to mirror the student's language is explicit.
 * It contains no figures of its own; everything numeric comes from the
 * grounding block appended after it.
 */
export function buildSystemPrompt(lang: 'ar' | 'en'): string {
  return [
    'أنت «المرشد الأكاديمي» داخل تطبيق مُرشِدي الأردني، تساعد طلبة الثانويّة العامّة (التوجيهي)',
    'وأولياء أمورهم على اختيار التخصّص الجامعي.',
    '',
    'قواعد ملزمة:',
    '1. أجب بلغة الطالب: إن سأل بالعربيّة فأجب بعربيّة فصيحة مبسّطة، وإن سأل بالإنجليزيّة فأجب بالإنجليزيّة.',
    `   (لغة واجهة التطبيق الحاليّة: ${lang === 'ar' ? 'العربيّة' : 'الإنجليزيّة'}.)`,
    '2. كلّ رقم تذكره يجب أن يكون منقولاً حرفيّاً من كتلة بيانات التطبيق المرفقة أدناه. ممنوع منعاً',
    '   باتّاً أن تخترع رقماً أو تستدعيه من ذاكرتك: لا رواتب، ولا نسب بطالة، ولا أعداد وظائف،',
    '   ولا نسب نموّ، ولا معدّلات قبول غير الموجودة في الكتلة.',
    '3. إن لم يكن الرقم في الكتلة فقل صراحةً «لا أعرف» أو «هذا الرقم غير متوفّر لديّ»، ووجّه الطالب',
    '   إلى الصفحة التي تعرضه مع مصدره. الاعتراف بعدم المعرفة أفضل من التخمين.',
    '4. عند ذكر معدّل قبول، أضف دائماً أنّه معدّل استرشادي وليس الحدّ التنافسي الرسمي لهذا العام.',
    '5. اجعل الإجابة قصيرة وعمليّة: نقاط مرقّمة، من ثلاث إلى ستّ نقاط، وجملة واحدة لكلّ نقطة.',
    `6. أنهِ كلّ إجابة بسطر واحد يوجّه الطالب إلى أداة محدّدة داخل التطبيق: ${lang === 'ar' ? TOOLS_AR : TOOLS_EN}.`,
    '7. أنت أداة إرشاديّة ولست مرشداً نفسيّاً أو أكاديميّاً معتمداً، ولا تمثّل وزارة التعليم العالي',
    '   ولا أيّ جهة رسميّة. لا تدّعِ اعتماداً أو شراكة رسميّة، ولا تُصدر تشخيصاً نفسيّاً.',
    '8. لا تحكم على الطالب ولا تثبّط عزيمته؛ اعرض البدائل الواقعيّة بلغة محترمة.',
    '',
    buildGroundingBlock(lang),
  ].join('\n');
}
