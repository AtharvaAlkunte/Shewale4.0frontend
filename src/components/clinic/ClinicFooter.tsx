import { Phone, Mail, Clock, MapPin, Facebook, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ClinicFooterProps {
  onContactClick: () => void;
}

const ClinicFooter = ({ onContactClick }: ClinicFooterProps) => {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="bg-public-secondary">
      <div className="container-clinic py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Care Info */}
        <div>
          <p className="text-public-accent font-semibold text-sm uppercase tracking-widest mb-2">{t('footer.contact_us')}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('footer.get_in_touch')}</h3>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            {t('footer.description')}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 group">
            <Phone className="w-5 h-5 text-public-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-white/80 text-sm">+91 744-744-5121</span>
          </div>
          <div className="flex items-center gap-3 group">
            <Mail className="w-5 h-5 text-public-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-white/80 text-sm">demo@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 group">
            <Clock className="w-5 h-5 text-public-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-white/80 text-sm">{t('footer.visiting_hours')}</span>
          </div>
          <div className="flex items-start gap-3 group">
            <MapPin className="w-5 h-5 text-public-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-white/80 text-sm">{t('topbar.address')}</span>
          </div>
        </div>

        {/* Socials & Action */}
        <div>
          <div className="flex gap-2 mb-6">
            <button className="w-9 h-9 rounded-full bg-public-accent/20 text-public-accent flex items-center justify-center hover:bg-public-accent hover:text-white transition-all hover:scale-110" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-public-accent/20 text-public-accent flex items-center justify-center hover:bg-public-accent hover:text-white transition-all hover:scale-110" aria-label="Google Plus">
              <span className="text-xs font-bold">G+</span>
            </button>
            <button className="w-9 h-9 rounded-full bg-public-accent/20 text-public-accent flex items-center justify-center hover:bg-public-accent hover:text-white transition-all hover:scale-110" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </button>
          </div>

          <Button variant="contact" size="lg" onClick={onContactClick} className="w-full sm:w-auto">
            {t('nav.contact')}
          </Button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="container-clinic text-center">
          <p className="text-white/50 text-xs">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ClinicFooter;
