import { User, Settings, Bell, Globe, Heart, Award, Share2, LogOut, ChevronLeft, ChevronRight, FileText, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import HashemiteEmblem from '../components/HashemiteEmblem';
import { useLang } from '../i18n/LangContext';

export default function Profile() {
  const { t, lang, toggleLang, dir } = useLang();
  const ChevronEnd = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const sections = [
    {
      titleKey: 'profile.section.personal',
      items: [
        { icon: User, labelKey: 'profile.item.profile', subKey: 'profile.item.profileSub' },
        { icon: Bell, labelKey: 'profile.item.notifications', subKey: 'profile.item.notificationsSub' },
      ],
    },
    {
      titleKey: 'profile.section.records',
      items: [
        { icon: Heart, labelKey: 'profile.item.savedMajors', subKey: 'profile.item.savedMajorsSub', count: '4' },
        { icon: Award, labelKey: 'profile.item.reports', subKey: 'profile.item.reportsSub' },
        { icon: FileText, labelKey: 'profile.item.download', subKey: 'profile.item.downloadSub' },
      ],
    },
    {
      titleKey: 'profile.section.support',
      items: [
        { icon: Settings, labelKey: 'profile.item.settings', subKey: 'profile.item.settingsSub' },
        { icon: ShieldCheck, labelKey: 'profile.item.privacy', subKey: 'profile.item.privacySub' },
        { icon: Share2, labelKey: 'profile.item.share', subKey: 'profile.item.shareSub' },
      ],
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gov-bg pb-28">
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} back={false} />

      {/* User card */}
      <div className="bg-white border-b border-gov-line p-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-md bg-gov-navy text-white flex items-center justify-center text-base font-bold">
            {lang === 'ar' ? 'ع.ح' : 'AH'}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-gov-ink">
              {lang === 'ar' ? 'عبد الرحمن الحيموني' : 'Abdulrahman Alhaymouni'}
            </p>
            <p className="text-[11px] text-gov-muted mt-0.5">
              {t('pages.home.studentLabel')} · {lang === 'ar' ? 'عمّان' : 'Amman'}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="gov-badge gov-badge-info">{t('profile.gradeLabel')}: 87</span>
              <span className="gov-badge gov-badge-neutral">{t('profile.memberSince')} 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity stats */}
      <div className="bg-white border-b border-gov-line px-4 py-3">
        <p className="gov-section-title mb-2">{t('profile.activity')}</p>
        <div className="grid grid-cols-3 gap-2">
          <ActivityCard label={t('profile.calculations')} value="12" />
          <ActivityCard label={t('profile.scholarships')} value="5" />
          <ActivityCard label={t('profile.savedReports')} value="3" />
        </div>
      </div>

      {/* Language toggle — TOP LEVEL, very visible */}
      <div className="p-4">
        <div className="gov-card overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gov-navy/10 flex items-center justify-center text-gov-navy shrink-0">
              <Globe size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gov-ink">{t('profile.item.language')}</p>
              <p className="text-[11px] text-gov-muted mt-0.5">
                {lang === 'ar' ? 'العربيّة' : 'English'} · {lang === 'ar' ? 'اضغط للتبديل' : 'Tap to switch'}
              </p>
            </div>
            {/* Pill toggle */}
            <div className="bg-gov-bg p-0.5 rounded-md border border-gov-line flex items-center">
              <button
                type="button"
                onClick={() => lang !== 'ar' && toggleLang()}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  lang === 'ar' ? 'bg-gov-navy text-white' : 'text-gov-muted'
                }`}
              >
                AR
              </button>
              <button
                type="button"
                onClick={() => lang !== 'en' && toggleLang()}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  lang === 'en' ? 'bg-gov-navy text-white' : 'text-gov-muted'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-4">
        {sections.map((section) => (
          <div key={section.titleKey}>
            <h3 className="gov-section-title mb-2">{t(section.titleKey)}</h3>
            <div className="gov-card divide-y divide-gov-line">
              {section.items.map((item) => (
                <button
                  key={item.labelKey}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gov-bg-soft text-start transition-colors"
                >
                  <div className="w-9 h-9 rounded-md bg-gov-bg flex items-center justify-center text-gov-navy shrink-0">
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gov-ink">{t(item.labelKey as any)}</p>
                    <p className="text-[11px] text-gov-muted mt-0.5">
                      {('count' in item ? `${item.count} ` : '') + t(item.subKey as any)}
                    </p>
                  </div>
                  <ChevronEnd size={16} className="text-gov-muted shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 mt-5">
        <button className="w-full py-2.5 rounded-gov border border-gov-danger/30 bg-white text-gov-danger text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50">
          <LogOut size={14} />
          {t('profile.logout')}
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 mt-6">
        <div className="bg-white border border-gov-line rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HashemiteEmblem size={24} />
          </div>
          <p className="text-[11px] font-semibold text-gov-body">{t('app.kingdom')}</p>
          <p className="text-[11px] text-gov-muted">{t('app.ministry')}</p>
          <div className="my-2 h-px bg-gov-line" />
          <p className="text-[10px] text-gov-muted">{t('app.name')} · {t('app.version')}</p>
          <p className="text-[10px] text-gov-muted">{lang === 'ar' ? 'جميع الحقوق محفوظة 2026' : 'All rights reserved 2026'}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gov-line rounded-gov p-3 text-center">
      <p className="text-lg font-bold tabular text-gov-ink">{value}</p>
      <p className="text-[10px] text-gov-muted mt-0.5 leading-tight">{label}</p>
    </div>
  );
}
