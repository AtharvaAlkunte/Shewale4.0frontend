import { useTranslation } from "react-i18next";
import doctorPortrait from "@/assets/Dr.Sunil Shewale.jpg";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-padding bg-public-light">
      <div className="container-clinic grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Doctor Image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <img
              src={doctorPortrait}
              alt="Dr. Sunil Shewale - Cardiologist"
              className="w-full h-[400px] lg:h-[500px] object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-public-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-3xl">❤</span>
          </div>
        </div>

        {/* Text Content */}
        <div>
          <p className="text-public-accent font-semibold text-sm uppercase tracking-widest mb-2">
            {t('about.title')}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-public-secondary leading-tight mb-6">
            {t('about.subtitle')}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t('about.description1')}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {t('about.description2')}
          </p>
          <Button variant="outlineNavy" size="lg">
            {t('common.read_more')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
