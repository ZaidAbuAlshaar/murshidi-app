// i18n namespace: data
// Owner: see docs/BUILD_SPEC.md. Add keys as `'data.someKey': '…'` in BOTH objects.
// Keys must exist in ar and en with identical key sets.
//
// The block at the end redefines a handful of keys that live in core.ts.
// Namespaces are spread AFTER core in translations.ts, so these win. They are
// all labels that made a source claim the data cannot support; every one of
// them is rendered only by the pages in this work package.

export const dataAr = {
  // Shared chrome
  'data.sourceLabel': 'المصدر',
  'data.illustrative.short': 'مثال توضيحي',
  'data.dos.period': 'الربع الثاني 2026',
  'data.dos.periodPrev': 'الربع الثاني 2025',

  // Notes — one per data block, placed beside the numbers it covers
  'data.note.acceptance':
    'معدّلات القبول المعروضة استرشاديّة للمقارنة، وليست الحدود الدنيا التنافسيّة لعام 2026/2027 — لم تُعلنها وحدة تنسيق القبول الموحّد بعد.',
  'data.note.majorFigures':
    'الرواتب ونسب البطالة وأعداد الإعلانات ونسب النموّ ومؤشّر الرضا لكلّ تخصّص أرقام توضيحيّة تُظهر آليّة الأداة، ولم تُستخرج من نشرة رسميّة.',
  'data.note.postings':
    'أعداد الإعلانات توضيحيّة تُظهر شكل المرصد، وليست حصراً فعليّاً من مواقع التوظيف.',
  'data.note.projections':
    'منحنيات التوقّع ونسب النموّ لعام 2030 توضيحيّة، ولا تمثّل تنبّؤاً منشوراً لأيّ جهة.',
  'data.note.stories':
    'تجارب مكتوبة لعرض شكل الشهادات في النسخة الكاملة — ليست شهادات خرّيجين حقيقيّين.',
  'data.note.scholarships':
    'القيم والمواعيد وشروط الأهليّة هنا توضيحيّة. تحقّق من الجهة المانحة قبل التقديم.',
  'data.note.simulation':
    'السيناريوهات تُبنى بمعاملات ثابتة على الراتب التوضيحي للتخصّص، وليست نموذجاً إحصائيّاً ولا تنبّؤاً.',
  'data.note.alternatives':
    'الكلف ورواتب البداية ونسب البطالة لهذه المسارات توضيحيّة — راجع الجهة المقدّمة للبرنامج.',
  'data.note.impact':
    'المنصّة في مرحلة العرض، وهذه الأرقام توضيحيّة لشكل لوحة الأثر ولا تمثّل استخداماً فعليّاً.',
  'data.note.roi':
    'الحساب يستخدم الأرقام التوضيحيّة للتخصّص، والمعادلة معروضة كاملةً ليتمكّن أيّ قارئ من مراجعتها.',

  // Labels that carry their own honesty
  'data.acceptance.label': 'معدّل القبول (استرشادي)',
  'data.unemployment.label': 'نسبة البطالة (توضيحيّة)',

  // Home
  'data.home.officialTitle': 'مؤشّر رسمي منشور',
  'data.home.impactTitle': 'أثر المنصّة — أرقام توضيحيّة',
  'data.home.dosTotal': 'إجمالي السكّان',
  'data.home.dosJordanians': 'الأردنيّون',
  'data.home.dosVsLastYear': 'مقابل',

  // Market
  'data.market.subtitle': 'عرض توضيحي لشكل المرصد',
  'data.market.notice':
    'كلّ الأرقام في هذه الصفحة توضيحيّة. ربط المرصد بمصادر الإعلانات الفعليّة هو الخطوة التالية في خارطة الطريق.',

  // Future
  'data.future.subtitle': 'تقرير منشور + أمثلة توضيحيّة',
  'data.future.wefTitle': 'المنتدى الاقتصادي العالمي — تقرير مستقبل الوظائف 2025',
  'data.future.wefBody':
    'يقدّر التقرير أنّ التغيّر الهيكلي سيطال 22% من الوظائف حتى عام 2030: استحداث 170 مليون وظيفة (14% من التشغيل الحالي) مقابل زوال 92 مليون وظيفة (8%)، بصافي نموّ 78 مليون وظيفة.',
  'data.future.wefCite': 'المنتدى الاقتصادي العالمي، تقرير مستقبل الوظائف 2025 (نُشر 8 كانون الثاني 2025)',
  'data.future.caution':
    'الأرقام في الجداول والمنحنيات في هذه الصفحة توضيحيّة لعرض شكل التحليل. الرقم الوحيد المنسوب إلى مصدر منشور هنا هو عنوان تقرير مستقبل الوظائف 2025 أعلاه.',

  // Stories
  'data.stories.subtitle': 'تجارب توضيحيّة لمسارات الخرّيجين',

  // Scholarships
  'data.scholarships.subtitle': 'أمثلة توضيحيّة لأنواع المنح المتاحة',
  'data.scholarships.matchLabel': 'انسجام توضيحي',
  'data.scholarships.verify': 'القيم والمواعيد النهائيّة تُعتمد من الجهة المانحة نفسها عبر منصّتها الرسميّة.',

  // Simulate
  'data.simulate.intro':
    'تعرض المحاكاة ثلاثة مسارات لكلّ تخصّص (الأكثر احتمالاً، الأفضل، الأسوأ) بتطبيق معاملات ثابتة على الراتب التوضيحي للتخصّص.',
  'data.simulate.probabilityNote': 'نسب المسارات الثلاثة توضيحيّة',

  // Alternatives
  'data.alternatives.message':
    'الجامعة ليست المسار الوحيد. الدبلوم أو الشهادة المهنيّة قد تكون أقصر وأقلّ كلفة وأقرب إلى حاجة السوق من بكالوريوس لا يخدم صاحبه.',
  'data.alternatives.context': 'البطالة بين الأردنيّين',
} as const;

export const dataEn = {
  // Shared chrome
  'data.sourceLabel': 'Source',
  'data.illustrative.short': 'Illustrative',
  'data.dos.period': 'Q2 2026',
  'data.dos.periodPrev': 'Q2 2025',

  // Notes — one per data block, placed beside the numbers it covers
  'data.note.acceptance':
    'The acceptance averages shown are indicative, for comparison. They are not the 2026/2027 competitive minimums, which the Unified Admission Coordination Unit has not yet announced.',
  'data.note.majorFigures':
    'Per-major salaries, unemployment rates, posting counts, growth rates and satisfaction scores are illustrative figures that show how the tool works. They are not taken from an official release.',
  'data.note.postings':
    'Posting counts are illustrative and show the shape of the observatory. They are not an actual count from job boards.',
  'data.note.projections':
    'Projection curves and 2030 growth rates are illustrative. They do not represent a published forecast by any body.',
  'data.note.stories':
    'Written to show how testimonials will appear in the full version — these are not real graduates.',
  'data.note.scholarships':
    'Amounts, deadlines and eligibility rules here are illustrative. Check with the granting body before applying.',
  'data.note.simulation':
    'Scenarios are built by applying fixed multipliers to the illustrative salary of the major. This is not a statistical model and not a forecast.',
  'data.note.alternatives':
    'Costs, starting salaries and unemployment rates for these tracks are illustrative — check with the training provider.',
  'data.note.impact':
    'The platform is at demo stage. These figures illustrate the impact panel and do not represent actual usage.',
  'data.note.roi':
    'The calculation uses the illustrative figures of each major, and the full formula is shown so any reader can check it.',

  // Labels that carry their own honesty
  'data.acceptance.label': 'Acceptance average (indicative)',
  'data.unemployment.label': 'Unemployment rate (illustrative)',

  // Home
  'data.home.officialTitle': 'Published official indicator',
  'data.home.impactTitle': 'Platform impact — illustrative figures',
  'data.home.dosTotal': 'Total population',
  'data.home.dosJordanians': 'Jordanians',
  'data.home.dosVsLastYear': 'vs',

  // Market
  'data.market.subtitle': 'A demonstration of how the observatory looks',
  'data.market.notice':
    'Every figure on this page is illustrative. Connecting the observatory to live posting sources is the next step on the roadmap.',

  // Future
  'data.future.subtitle': 'One published report + illustrative examples',
  'data.future.wefTitle': 'World Economic Forum — Future of Jobs Report 2025',
  'data.future.wefBody':
    'The report estimates that structural change will affect 22% of jobs by 2030: 170 million jobs created (14% of current employment) against 92 million displaced (8%), a net gain of 78 million jobs.',
  'data.future.wefCite': 'World Economic Forum, Future of Jobs Report 2025 (published 8 Jan 2025)',
  'data.future.caution':
    'The figures in the tables and curves on this page are illustrative and show the shape of the analysis. The only figure here attributed to a published source is the Future of Jobs Report 2025 headline above.',

  // Stories
  'data.stories.subtitle': 'Illustrative graduate journeys',

  // Scholarships
  'data.scholarships.subtitle': 'Illustrative examples of the kinds of scholarship available',
  'data.scholarships.matchLabel': 'Illustrative match',
  'data.scholarships.verify': 'Amounts and final deadlines are set by the granting body on its own official platform.',

  // Simulate
  'data.simulate.intro':
    'The simulation shows three paths for each major (most likely, best, worst) by applying fixed multipliers to the illustrative salary of that major.',
  'data.simulate.probabilityNote': 'The three path shares are illustrative',

  // Alternatives
  'data.alternatives.message':
    'University is not the only path. A diploma or a professional certificate can be shorter, cheaper and closer to what the market needs than a bachelor degree that does not serve its holder.',
  'data.alternatives.context': 'Unemployment among Jordanians',
} as const;
