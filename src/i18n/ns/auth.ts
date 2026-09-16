// i18n namespace: auth, session and profile.
// Owner: A3 (see docs/BUILD_SPEC.md §7). Keys must exist in ar and en alike.
//
// Privacy copy rule: this app has no backend, and the copy below says exactly
// what that means — no national ID, local storage only, a SHA-256 digest that
// is not device-level protection, and the one case where text does leave the
// device (the AI advisor). Do not upgrade these claims.

import type { BranchId } from '../../lib/account';

/** Tawjihi stream → translation key, so screens never build keys from strings. */
export const branchLabelKeys = {
  scientific: 'auth.branch.scientific',
  literary: 'auth.branch.literary',
  health: 'auth.branch.health',
  industrial: 'auth.branch.industrial',
  commercial: 'auth.branch.commercial',
  shariah: 'auth.branch.shariah',
  informatics: 'auth.branch.informatics',
  hotel: 'auth.branch.hotel',
  agricultural: 'auth.branch.agricultural',
} as const satisfies Record<BranchId, string>;

export const authAr = {
  // ── Auth screen ──
  'auth.title': 'حسابك في مُرشِدي',
  'auth.subtitle': 'اختر كيف تريد الدخول',
  'auth.doors.hint': 'ثلاثة خيارات: تسجيل دخول، حساب جديد، أو تصفّح كضيف.',
  'auth.tab.signIn': 'تسجيل الدخول',
  'auth.tab.signUp': 'حساب جديد',

  'auth.field.name': 'الاسم الكامل',
  'auth.field.namePh': 'مثال: عبد الرحمن الهيموني',
  'auth.field.nameHint': 'الاسم هو معرّفك على هذا الجهاز — لا نطلب بريداً ولا رقم هاتف.',
  'auth.field.grade': 'معدّل التوجيهي (اختياري)',
  'auth.field.gradePh': 'من 0 إلى 100',
  'auth.field.gradeHint': 'اتركه فارغاً إن لم تصدر نتيجتك بعد؛ تقدر تضيفه لاحقاً.',
  'auth.field.city': 'المحافظة',
  'auth.field.branch': 'فرع التوجيهي',
  'auth.field.branchPh': 'اختر الفرع',
  'auth.field.branchHint': 'نسألك مرّة واحدة هنا، فيستخدمه المستشار الذكيّ واختبار الميول بدل سؤالك في كلّ صفحة.',
  'auth.field.password': 'كلمة السرّ',
  'auth.field.passwordPh': '4 أحرف على الأقلّ',
  'auth.showPassword': 'إظهار كلمة السرّ',
  'auth.hidePassword': 'إخفاء كلمة السرّ',

  'auth.submit.signIn': 'دخول',
  'auth.submit.signUp': 'إنشاء الحساب',
  'auth.submit.busy': 'جارٍ…',

  'auth.error.nameTaken': 'هذا الاسم مسجّل على هذا الجهاز — سجّل الدخول بدل إنشاء حساب.',
  'auth.error.notFound': 'لا يوجد حساب بهذا الاسم على هذا الجهاز — أنشئ حساباً جديداً.',
  'auth.error.wrongPassword': 'كلمة السرّ غير صحيحة.',
  'auth.error.invalid': 'تأكّد من الاسم (حرفان فأكثر) وكلمة السرّ (4 أحرف فأكثر).',
  'auth.error.storage': 'تعذّر الحفظ على هذا الجهاز — قد يكون تخزين المتصفّح ممتلئاً أو محجوباً.',
  'auth.error.grade': 'المعدّل لازم يكون رقماً بين 0 و100.',
  'auth.error.branch': 'اختر فرع التوجيهي من القائمة.',

  'auth.guest.title': 'تصفّح كضيف',
  'auth.guest.desc': 'كلّ الأدوات مفتوحة، بس ما بينحفظ شي لحسابك: لا تقارير ولا تخصّصات محفوظة.',
  'auth.guest.cta': 'متابعة كضيف',
  'auth.guest.badge': 'ضيف',
  'auth.guest.badgeTitle': 'تتصفّح كضيف — سجّل الدخول لحفظ تقاريرك',
  'auth.guest.upgrade': 'إنشاء حساب لحفظ بياناتي',

  'auth.gate.signInNeeded': 'اختر طريقة الدخول للمتابعة.',
  'auth.gate.accountNeeded': 'هذه الصفحة تحتاج حساباً لأنّها تحفظ بيانات — وضع الضيف ما بيحفظ.',

  'auth.already.title': 'أنت مسجّل الدخول بالفعل',
  'auth.already.continue': 'المتابعة إلى المنصّة',
  'auth.already.switch': 'الخروج وتسجيل دخول بحساب آخر',

  'auth.privacy.title': 'خصوصيّتك بوضوح',
  'auth.privacy.noId': 'لا نطلب رقماً وطنيّاً ولا بريداً إلكترونيّاً ولا رقم هاتف.',
  'auth.privacy.local': 'الحساب والمعدّل والفرع تُحفظ في تخزين متصفّح هذا الجهاز فقط — ما في خادم عنا تُرفع إليه.',
  'auth.privacy.hash': 'كلمة السرّ تُحفظ كبصمة SHA-256 لا كنصّ صريح. هذا يمنع قراءتها بالعين من تخزين المتصفّح، لكنّه ليس حمايةً ممّن يمسك الجهاز نفسه — فلا تستخدم كلمة سرّ تستعملها في خدمة أخرى.',
  'auth.privacy.ai': 'الاستثناء الوحيد: لمّا تستخدم المستشار الذكيّ، يُرسَل نصّ سؤالك إلى مزوّد النموذج ليُجيب عنه.',
  'auth.privacy.wipe': 'مسح بيانات المتصفّح يمسح الحساب معه — ما في نسخة احتياطيّة عنا.',

  // ── Tawjihi branches ──
  'auth.branch.scientific': 'العلمي',
  'auth.branch.literary': 'الأدبي',
  'auth.branch.health': 'الصحّي',
  'auth.branch.industrial': 'الصناعي',
  'auth.branch.commercial': 'التجاري',
  'auth.branch.shariah': 'الشرعي',
  'auth.branch.informatics': 'إدارة المعلوماتيّة',
  'auth.branch.hotel': 'الفندقي والسياحي',
  'auth.branch.agricultural': 'الزراعي',
  'auth.branch.none': 'غير محدّد',

  // ── Profile ──
  'profile.guest.title': 'أنت في وضع الضيف',
  'profile.guest.desc': 'تقدر تستخدم كلّ الأدوات. الحساب بيخلّي تقاريرك وتخصّصاتك المحفوظة ترجع معك في المرّة الجاية على هذا الجهاز.',
  'profile.guest.cta': 'تسجيل الدخول أو إنشاء حساب',
  'profile.branchLabel': 'الفرع',
  'profile.noGrade': 'المعدّل غير مُدخَل',
  'profile.activity.toolsUsed': 'أدوات استخدمتها',
  'profile.activity.savedMajors': 'تخصّصات محفوظة',
  'profile.activity.savedReports': 'تقارير محفوظة',
  'profile.activity.empty': 'ما في نشاط بعد. الأرقام بتبدأ من صفر وبتزيد لمّا تستخدم الأدوات.',
  'profile.activity.note': 'هذه الأرقام محسوبة من استخدامك الفعليّ على هذا الجهاز.',

  'profile.section.account': 'الحساب',
  'profile.section.data': 'بياناتي',
  'profile.section.danger': 'إجراءات حسّاسة',

  'profile.edit.open': 'تعديل بياناتي',
  'profile.edit.openSub': 'الاسم، المعدّل، المحافظة، الفرع',
  'profile.edit.title': 'تعديل البيانات',
  'profile.edit.subtitle': 'تُحفظ على هذا الجهاز فقط',
  'profile.edit.save': 'حفظ التعديلات',
  'profile.edit.saved': 'تمّ حفظ التعديلات.',
  'profile.edit.cancel': 'إلغاء',
  'profile.edit.error': 'تعذّر الحفظ: تأكّد من الاسم (حرفان فأكثر) وأنّه غير مستخدم لحساب آخر على هذا الجهاز.',

  'profile.reports.title': 'تقاريري',
  'profile.reports.none': 'ما في تقارير محفوظة بعد.',
  'profile.reports.interests': 'تقرير اختبار الميول',
  'profile.reports.roi': 'تقرير حاسبة العائد',
  'profile.reports.compare': 'تقرير مقارنة تخصّصات',
  'profile.reports.open': 'فتح',
  'profile.savedMajors.none': 'ما حفظت أيّ تخصّص بعد.',
  'profile.savedMajors.count': 'تخصّص محفوظ',

  'profile.export.title': 'تنزيل بياناتي',
  'profile.export.sub': 'ملفّ JSON فيه ملفّك ونشاطك — من دون كلمة السرّ.',
  'profile.export.done': 'تمّ تنزيل الملفّ.',
  'profile.export.failed': 'تعذّر إنشاء الملفّ على هذا المتصفّح.',

  'profile.privacy.title': 'كيف تُحفظ بياناتك',
  'profile.share.title': 'مشاركة التطبيق',
  'profile.share.copied': 'تمّ نسخ الرابط.',
  'profile.share.failed': 'تعذّرت المشاركة من هذا المتصفّح.',

  'profile.signOut.title': 'تسجيل الخروج',
  'profile.signOut.guest': 'إنهاء وضع الضيف',
  'profile.delete.title': 'حذف الحساب',
  'profile.delete.sub': 'يمسح الحساب وكلّ نشاطه من هذا الجهاز.',
  'profile.delete.confirmTitle': 'تأكيد حذف الحساب',
  'profile.delete.confirmBody': 'رح يُمسح اسمك ومعدّلك وفرعك وكلّ تقاريرك المحفوظة من هذا الجهاز. ما في نسخة احتياطيّة، والخطوة ما بترجع.',
  'profile.delete.confirmCta': 'احذف الحساب نهائيّاً',
  'profile.delete.cancel': 'تراجع',
  'profile.delete.done': 'تمّ حذف الحساب من هذا الجهاز.',
} as const;

export const authEn = {
  // ── Auth screen ──
  'auth.title': 'Your Murshidi account',
  'auth.subtitle': 'Choose how you want to continue',
  'auth.doors.hint': 'Three ways in: sign in, create an account, or browse as a guest.',
  'auth.tab.signIn': 'Sign in',
  'auth.tab.signUp': 'New account',

  'auth.field.name': 'Full name',
  'auth.field.namePh': 'e.g. Abdulrahman Alhaimouni',
  'auth.field.nameHint': 'Your name is your identifier on this device — no email, no phone number.',
  'auth.field.grade': 'Tawjihi average (optional)',
  'auth.field.gradePh': '0 to 100',
  'auth.field.gradeHint': 'Leave it empty if your result is not out yet; you can add it later.',
  'auth.field.city': 'Governorate',
  'auth.field.branch': 'Tawjihi branch',
  'auth.field.branchPh': 'Select your branch',
  'auth.field.branchHint': 'Asked once here, so the AI advisor and the interests test do not ask you on every page.',
  'auth.field.password': 'Password',
  'auth.field.passwordPh': 'At least 4 characters',
  'auth.showPassword': 'Show password',
  'auth.hidePassword': 'Hide password',

  'auth.submit.signIn': 'Sign in',
  'auth.submit.signUp': 'Create account',
  'auth.submit.busy': 'Working…',

  'auth.error.nameTaken': 'That name already exists on this device — sign in instead.',
  'auth.error.notFound': 'No account with that name on this device — create one.',
  'auth.error.wrongPassword': 'Wrong password.',
  'auth.error.invalid': 'Check the name (2+ characters) and password (4+ characters).',
  'auth.error.storage': 'Could not save on this device — browser storage may be full or blocked.',
  'auth.error.grade': 'The average must be a number between 0 and 100.',
  'auth.error.branch': 'Pick your Tawjihi branch from the list.',

  'auth.guest.title': 'Browse as a guest',
  'auth.guest.desc': 'Every tool is open, but nothing is kept for you: no saved reports, no saved majors.',
  'auth.guest.cta': 'Continue as guest',
  'auth.guest.badge': 'Guest',
  'auth.guest.badgeTitle': 'Browsing as a guest — sign in to keep your reports',
  'auth.guest.upgrade': 'Create an account to save my data',

  'auth.gate.signInNeeded': 'Choose how to continue.',
  'auth.gate.accountNeeded': 'This page needs an account because it saves data — guest mode does not save.',

  'auth.already.title': 'You are already signed in',
  'auth.already.continue': 'Continue to the platform',
  'auth.already.switch': 'Sign out and use another account',

  'auth.privacy.title': 'Your privacy, plainly',
  'auth.privacy.noId': 'We ask for no national ID, no email address and no phone number.',
  'auth.privacy.local': 'Your account, average and branch are kept in this device browser storage only — we run no server for them to be uploaded to.',
  'auth.privacy.hash': 'Your password is stored as a SHA-256 digest, not as plain text. That stops it being read by eye out of browser storage, but it is not protection against someone holding this device — so do not reuse a password from another service.',
  'auth.privacy.ai': 'The one exception: when you use the AI advisor, the text of your question is sent to the model provider so it can answer.',
  'auth.privacy.wipe': 'Clearing your browser data deletes the account with it — we hold no backup.',

  // ── Tawjihi branches ──
  'auth.branch.scientific': 'Scientific',
  'auth.branch.literary': 'Literary',
  'auth.branch.health': 'Health',
  'auth.branch.industrial': 'Industrial',
  'auth.branch.commercial': 'Commercial',
  'auth.branch.shariah': 'Shari‘a',
  'auth.branch.informatics': 'Informatics management',
  'auth.branch.hotel': 'Hospitality & tourism',
  'auth.branch.agricultural': 'Agricultural',
  'auth.branch.none': 'Not set',

  // ── Profile ──
  'profile.guest.title': 'You are in guest mode',
  'profile.guest.desc': 'You can use every tool. An account is what brings your reports and saved majors back next time on this device.',
  'profile.guest.cta': 'Sign in or create an account',
  'profile.branchLabel': 'Branch',
  'profile.noGrade': 'No average entered',
  'profile.activity.toolsUsed': 'Tools you used',
  'profile.activity.savedMajors': 'Saved majors',
  'profile.activity.savedReports': 'Saved reports',
  'profile.activity.empty': 'No activity yet. These start at zero and grow as you use the tools.',
  'profile.activity.note': 'These numbers are counted from what you actually did on this device.',

  'profile.section.account': 'Account',
  'profile.section.data': 'My data',
  'profile.section.danger': 'Sensitive actions',

  'profile.edit.open': 'Edit my details',
  'profile.edit.openSub': 'Name, average, governorate, branch',
  'profile.edit.title': 'Edit details',
  'profile.edit.subtitle': 'Saved on this device only',
  'profile.edit.save': 'Save changes',
  'profile.edit.saved': 'Changes saved.',
  'profile.edit.cancel': 'Cancel',
  'profile.edit.error': 'Could not save: check the name (2+ characters) and that no other account on this device uses it.',

  'profile.reports.title': 'My reports',
  'profile.reports.none': 'No saved reports yet.',
  'profile.reports.interests': 'Interests test report',
  'profile.reports.roi': 'Return calculator report',
  'profile.reports.compare': 'Major comparison report',
  'profile.reports.open': 'Open',
  'profile.savedMajors.none': 'You have not saved a major yet.',
  'profile.savedMajors.count': 'saved majors',

  'profile.export.title': 'Download my data',
  'profile.export.sub': 'A JSON file with your profile and activity — without the password.',
  'profile.export.done': 'File downloaded.',
  'profile.export.failed': 'This browser could not create the file.',

  'profile.privacy.title': 'How your data is stored',
  'profile.share.title': 'Share the app',
  'profile.share.copied': 'Link copied.',
  'profile.share.failed': 'Sharing is not available in this browser.',

  'profile.signOut.title': 'Sign out',
  'profile.signOut.guest': 'Leave guest mode',
  'profile.delete.title': 'Delete account',
  'profile.delete.sub': 'Erases the account and all of its activity from this device.',
  'profile.delete.confirmTitle': 'Confirm account deletion',
  'profile.delete.confirmBody': 'Your name, average, branch and every saved report will be erased from this device. There is no backup and the step cannot be undone.',
  'profile.delete.confirmCta': 'Delete the account permanently',
  'profile.delete.cancel': 'Go back',
  'profile.delete.done': 'The account was deleted from this device.',
} as const;
