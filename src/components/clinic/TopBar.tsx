import { MapPin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-public-secondary border-b border-public-secondary/20">
      <div className="container-clinic flex flex-col md:flex-row items-center justify-between py-2 text-sm gap-2">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="flex items-center gap-1.5 text-public-light/90 hover:text-white transition-colors">
            <MapPin className="w-3.5 h-3.5 text-public-accent" />
            {t('topbar.address')}
          </span>
          <span className="flex items-center gap-1.5 text-public-light/90 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-public-accent" />
            demo@gmail.com
          </span>
        </div>
        <div className="bg-public-primary text-white px-4 py-1.5 rounded-sm text-xs md:text-sm font-medium text-center">
          {t('topbar.clinic_title')}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
