import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface AppointmentBannerProps {
  onBookClick: () => void;
}

const AppointmentBanner = ({ onBookClick }: AppointmentBannerProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-public-secondary py-6">
      <div className="container-clinic flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex items-center gap-3 text-primary-foreground">
          <Phone className="w-6 h-6" />
          <span className="text-lg md:text-xl font-bold tracking-wide">
            {t("banner.call_text")}
          </span>
        </div>
        <Button variant="appointment" size="lg" onClick={onBookClick}>
          {t("common.book_appointment")}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBanner;
