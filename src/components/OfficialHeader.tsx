import HashemiteEmblem from './HashemiteEmblem';
import MizanLogo from './MizanLogo';
import { UserRound } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { useAuth } from '../context/AuthContext';

export default function OfficialHeader() {
  const { t } = useLang();
  const { isGuest } = useAuth();
  return (
    <div className="bg-white border-b border-gov-line safe-top">
      <div className="gov-strip" />

      {/* Ministry strip */}
      <div className="bg-gov-navy text-white px-4 py-1.5 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <HashemiteEmblem size={14} color="#FFFFFF" />
          <span className="font-medium">{t('app.kingdom')}</span>
        </div>
        <span className="opacity-80">{t('app.ministry')}</span>
      </div>

      {/* App identification */}
      <div className="px-4 py-3 flex items-center justify-between">
        <MizanLogo size={40} showText variant="wordmark" />
        {/* Same guest marker PageHeader shows, so Home is not the one screen
            where guest mode is invisible. There is no notification system in
            this build, so no bell and no unread dot. */}
        {isGuest && (
          <span className="gov-badge gov-badge-neutral shrink-0" title={t('auth.guest.badgeTitle')}>
            <UserRound size={12} />
            {t('auth.guest.badge')}
          </span>
        )}
      </div>
    </div>
  );
}
