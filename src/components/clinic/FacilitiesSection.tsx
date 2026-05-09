import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Clock, AlertTriangle, CheckCircle2, Activity, Stethoscope } from "lucide-react";

// ─── Utility Functions ────────────────────────────────────────────────────────

const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  }
  return `https://www.youtube.com/embed/${videoId}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FacilityDetail {
  overview: string;
  whatToExpect: string[];
  indications: string[];
  benefits: string[];
  videoUrl?: string;
}

interface Facility {
  id: string;
  title: string;
  description: string;
  media: string;
  type: "image" | "video";
  link: string;
  detail: FacilityDetail;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.25 },
  },
};

// ─── Facility Media Data ─────────────────────────────────────────────────────

const facilityVideoData: Record<string, { videoUrl?: string }> = {
  cardiac_consultation: {},
  ecg: { videoUrl: "https://youtu.be/GEcm6xbdNvc?si=QwpKqnqzZVtyzDoI" },
  echo: { videoUrl: "https://youtu.be/M4nfCEKuU90?si=psNya0V7vVopcW9p" },
  tmt: { videoUrl: "https://youtu.be/3kETSCOMGIE?si=eDAa2ZhZkrmbtfX_" },
  abpm: { videoUrl: "https://youtu.be/4auN-ZixQKY?si=6BpS_WxNaVj1MQHk" },
  holter: { videoUrl: "https://www.youtube.com/embed/6XKGmPQxRyg" },
  angioplasty: { videoUrl: "https://www.youtube.com/embed/KoHSFQnn_xI" },
  pacemaker: { videoUrl: "https://www.youtube.com/embed/3G_fHATRCqQ" },
};

// ─── MediaBlock ───────────────────────────────────────────────────────────────

interface MediaBlockProps {
  facility: Facility;
}

const MediaBlock = ({ facility }: MediaBlockProps) => {
  if (facility.type === "video") {
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-public-secondary/10">
        <video
          src={facility.media}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl aspect-video bg-public-secondary/10">
      <img
        src={facility.media}
        alt={facility.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/400x300/e2e8f0/1e293b?text=Image+Not+Found";
        }}
      />
    </div>
  );
};

// ─── FacilityModal ────────────────────────────────────────────────────────────

interface FacilityModalProps {
  facility: Facility;
  onClose: () => void;
}

const FacilityModal = ({ facility, onClose }: FacilityModalProps) => {
  const { detail } = facility;
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Media (Image or Video) */}
          <div className="w-full rounded-t-2xl overflow-hidden bg-gray-900 border-b border-gray-100">
            {detail.videoUrl ? (
                <iframe
                title={facility.title}
                src={getYouTubeEmbedUrl(detail.videoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video border-0"
                />
            ) : facility.type === "video" ? (
              <video
                src={facility.media}
                controls
                autoPlay
                className="w-full h-full object-cover aspect-video"
              />
            ) : (
              <img
                src={facility.media}
                alt={facility.title}
                className="w-full h-full object-cover aspect-video"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x300/e2e8f0/1e293b?text=Image+Not+Found";
                }}
              />
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-public-secondary leading-tight">
                  {facility.title}
                </h2>
                <div className="w-12 h-1 bg-public-accent mt-2 rounded-full" />
              </div>
            </div>

            {/* Overview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-public-secondary" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {t("common.overview") || "Overview"}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{detail.overview}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* What to Expect */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    {t("common.what_to_expect") || "What to Expect"}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {detail.whatToExpect.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Indications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    {t("common.indications") || "Indications"}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {detail.indications.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {t("common.benefits") || "Benefits"}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {detail.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-public-secondary text-white font-semibold text-sm hover:bg-public-secondary/85 transition-colors duration-200"
              >
                {t("common.book_this_service") || "Book This Service"} →
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── ServiceCard ──────────────────────────────────────────────────────────────

interface ServiceCardProps {
  facility: Facility;
}

const ServiceCard = ({ facility }: ServiceCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <motion.article
        variants={cardVariants}
        whileHover={{ scale: 1.025, transition: { duration: 0.25 } }}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border border-border"
      >
        {/* Media */}
        <div className="p-4 pb-0">
          <MediaBlock facility={facility} />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="text-base font-bold text-public-secondary leading-snug">
            {facility.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {facility.description}
          </p>

          {/* CTA — opens modal */}
          <button
            onClick={() => setShowModal(true)}
            aria-label={`Read more about ${facility.title}`}
            className="mt-1 self-start inline-flex items-center gap-1.5 rounded-full bg-public-secondary px-4 py-2 text-xs font-semibold text-white hover:bg-public-secondary/85 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-public-secondary focus-visible:ring-offset-2"
          >
            {t("common.read_more") || "Read More"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.article>

      {/* Modal */}
      {showModal && (
        <FacilityModal facility={facility} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

// ─── FacilitiesSection ────────────────────────────────────────────────────────

const FacilitiesSection = () => {
  const { t } = useTranslation();

  const getDetail = (key: string): FacilityDetail => ({
    overview: t(`facilities_details.${key}.overview`, { defaultValue: "" }),
    whatToExpect: t(`facilities_details.${key}.whatToExpect`, { returnObjects: true, defaultValue: [] }) as string[],
    indications: t(`facilities_details.${key}.indications`, { returnObjects: true, defaultValue: [] }) as string[],
    benefits: t(`facilities_details.${key}.benefits`, { returnObjects: true, defaultValue: [] }) as string[],
    ...facilityVideoData[key]
  });

  const facilitiesData: Facility[] = [
    {
      id: "cardiac_consultation",
      title: t("facilities_details.cardiac_consultation.title"),
      description: t("facilities_details.cardiac_consultation.desc"),
      media: "https://i.pinimg.com/736x/88/21/37/88213772c31b369d46c713a42ce664b5.jpg",
      type: "image",
      link: "/services/cardiac-consultation",
      detail: getDetail("cardiac_consultation"),
    },
    {
      id: "ecg",
      title: t("facilities_details.ecg.title"),
      description: t("facilities_details.ecg.desc"),
      media: "/assets/ECG.mov",
      type: "video",
      link: "/services/ecg",
      detail: getDetail("ecg"),
    },
    {
      id: "echo",
      title: t("facilities_details.echo.title"),
      description: t("facilities_details.echo.desc"),
      media: "/assets/2DEcho.mp4",
      type: "video",
      link: "/services/2d-echo",
      detail: getDetail("echo"),
    },
    {
      id: "tmt",
      title: t("facilities_details.tmt.title"),
      description: t("facilities_details.tmt.desc"),
      media: "/assets/TreadmillTest.mp4",
      type: "video",
      link: "/services/tmt",
      detail: getDetail("tmt"),
    },
    {
      id: "abpm",
      title: t("facilities_details.abpm.title"),
      description: t("facilities_details.abpm.desc"),
      media: "/assets/Ambulatory BP Monitoring.mp4",
      type: "video",
      link: "/services/abpm",
      detail: getDetail("abpm"),
    },
    {
      id: "holter",
      title: t("facilities_details.holter.title"),
      description: t("facilities_details.holter.desc"),
      media: "/assets/holter.mp4",
      type: "video",
      link: "/services/holter",
      detail: getDetail("holter"),
    },
    {
      id: "angioplasty",
      title: t("facilities_details.angioplasty.title"),
      description: t("facilities_details.angioplasty.desc"),
      media: "/assets/Angioplasty.mp4",
      type: "video",
      link: "/services/angioplasty",
      detail: getDetail("angioplasty"),
    },
    {
      id: "pacemaker",
      title: t("facilities_details.pacemaker.title"),
      description: t("facilities_details.pacemaker.desc"),
      media: "/assets/PacemakerImplantation.mp4",
      type: "video",
      link: "/services/pacemaker",
      detail: getDetail("pacemaker"),
    },
  ];

  return (
    <section id="facilities" className="section-padding bg-public-light">
      <div className="container-clinic">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-public-secondary">
            {t("nav.facilities") || t("facilities.title")}
          </h2>
          <div className="w-16 h-1 bg-public-accent mx-auto mt-4" />
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {facilitiesData.map((facility) => (
            <ServiceCard key={facility.id} facility={facility} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FacilitiesSection;