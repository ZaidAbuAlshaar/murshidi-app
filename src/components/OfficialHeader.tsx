import HashemiteEmblem from './HashemiteEmblem';
import MizanLogo from './MizanLogo';
import { Bell } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

export default function OfficialHeader() {
  const { t } = useLang();
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
        <button className="relative w-9 h-9 rounded-md border border-gov-line flex items-center justify-center text-gov-body" aria-label="notifications">
          <Bell size={16} />
          <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-gov-red" />
        </button>
      </div>
    </div>
  );
}
