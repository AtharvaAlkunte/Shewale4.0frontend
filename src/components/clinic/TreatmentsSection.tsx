import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Clock, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

// ─── Utility Functions ────────────────────────────────────────────────────────

const getYouTubeEmbedUrl = (url: string): string => {
  // Extract video ID from various YouTube URL formats
  let videoId = "";
  
  if (url.includes("youtu.be/")) {
    // Handle short URL: https://youtu.be/dQw4w9WgXcQ?si=...
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("youtube.com/watch?v=")) {
    // Handle long URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtube.com/embed/")) {
    // Already an embed URL
    return url;
  }
  
  return `https://www.youtube.com/embed/${videoId}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface TreatmentDetail {
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  videoUrl: string;
  videoType: "youtube" | "direct";
  // stats: { label: string; value: string }[];
}

interface Treatment {
  id: string;
  title: string;
  description: string;
  media: string;
  type: "image" | "video";
  link: string;
  detail: TreatmentDetail;
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

// ─── Disease Detail Data ──────────────────────────────────────────────────────

const diseaseVideoData: Record<string, { videoUrl: string; videoType: "youtube" | "direct" }> = {
  cad: {
    videoUrl: "https://youtu.be/SBUh8NcXus8?si=V5XOOV_Xfd-gw01i",
    videoType: "youtube",
  },
  heart_failure: {
    videoUrl: "https://youtu.be/qohTMDh3vdA?si=YJIypJPAyEwHYEeR",
    videoType: "youtube",
  },
  congenital: {
    videoUrl: "https://youtu.be/qQx9NoB1YZ0?si=sbrpfjZTfNmJUbo6",
    videoType: "youtube",
  },
  arrhythmias: {
    videoUrl: "https://youtu.be/_plReSBMrHU?si=QL0KOgHmwNRY5l08",
    videoType: "youtube",
  },
  cardiomyopathy: {
    videoUrl: "https://youtu.be/gDjMVrRowtc?si=NYEXD-M5aalZxTc4",
    videoType: "youtube",
  },
  pad: {
    videoUrl: "https://youtu.be/3B6jt4nHHmg?si=s4VmhoS7ncuHMKkn",
    videoType: "youtube",
  },
  hypertension: {
    videoUrl: "https://youtu.be/Vt5pImKNzEk?si=e_vUwxIbV1-QJ5Sx",
    videoType: "youtube",
  },
  diabetes: {
    videoUrl: "https://youtu.be/bPFTCFEGikE?si=fapw04uJszWobGvh",
    videoType: "youtube",
  },
  tavi: {
    videoUrl: "https://www.youtube.com/watch?v=X1Uk9Jvbut0",
    videoType: "youtube",
  },
};

const detailKeys = [
  "cad",
  "heart_failure",
  "congenital",
  "arrhythmias",
  "cardiomyopathy",
  "pad",
  "hypertension",
  "diabetes",
  "tavi",
];

// ─── MediaBlock ───────────────────────────────────────────────────────────────

interface MediaBlockProps {
  treatment: Treatment;
}

const MediaBlock = ({ treatment }: MediaBlockProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.play();
  };

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  if (treatment.type === "video") {
    return (
      <div
        className="relative overflow-hidden rounded-xl aspect-video bg-public-secondary/10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={treatment.media}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-public-secondary/20 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
          <span className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow">
            <svg className="w-4 h-4 text-public-secondary ml-0.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 2.5v11l10-5.5L3 2.5z" />
            </svg>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl aspect-video bg-public-secondary/10">
      <img
        src={treatment.media}
        alt={treatment.title}
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

// ─── TreatmentModal ───────────────────────────────────────────────────────────

interface TreatmentModalProps {
  treatment: Treatment;
  onClose: () => void;
}

const TreatmentModal = ({ treatment, onClose }: TreatmentModalProps) => {
  const { detail } = treatment;
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
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

          {/* Video */}
          <div className="w-full aspect-video rounded-t-2xl overflow-hidden bg-gray-900">
            <iframe
              src={getYouTubeEmbedUrl(detail.videoUrl)}
              title={treatment.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-public-secondary leading-tight">
                {treatment.title}
              </h2>
              <div className="w-12 h-1 bg-public-accent mt-2 rounded-full" />
            </div>

            {/* Overview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-public-secondary" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{t("common.overview") || "Overview"}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{detail.overview}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Symptoms */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{t("common.symptoms") || "Symptoms"}</h3>
                </div>
                <ul className="space-y-1.5">
                  {detail.symptoms.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{t("common.causes") || "Causes"}</h3>
                </div>
                <ul className="space-y-1.5">
                  {detail.causes.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Treatments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{t("common.treatment_options") || "Treatment Options"}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {detail.treatments.map((t) => (
                  <div
                    key={t}
                    className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {t}
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
                {t("common.book_consultation") || "Book a Consultation"} →
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── TreatmentCard ────────────────────────────────────────────────────────────

interface TreatmentCardProps {
  treatment: Treatment;
}

const TreatmentCard = ({ treatment }: TreatmentCardProps) => {
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
          <MediaBlock treatment={treatment} />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="text-base font-bold text-public-secondary leading-snug">
            {treatment.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {treatment.description}
          </p>

          {/* CTA — opens modal */}
          <button
            onClick={() => setShowModal(true)}
            aria-label={`Read more about ${treatment.title}`}
            className="mt-1 self-start inline-flex items-center gap-1.5 rounded-full bg-public-secondary px-4 py-2 text-xs font-semibold text-white hover:bg-public-secondary/85 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-public-secondary focus-visible:ring-offset-2"
          >
            {t("common.read_more") || "Read More"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.article>

      {/* Modal */}
      {showModal && (
        <TreatmentModal treatment={treatment} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

// ─── TreatmentsSection ────────────────────────────────────────────────────────

const TreatmentsSection = () => {
  const { t } = useTranslation();

  const getDetail = (key: string): TreatmentDetail => ({
    overview: t(`treatments.${key}_details.overview`, { defaultValue: "" }),
    symptoms: t(`treatments.${key}_details.symptoms`, { returnObjects: true, defaultValue: [] }) as string[],
    causes: t(`treatments.${key}_details.causes`, { returnObjects: true, defaultValue: [] }) as string[],
    treatments: t(`treatments.${key}_details.treatments`, { returnObjects: true, defaultValue: [] }) as string[],
    ...diseaseVideoData[key]
  });

  const treatments: Treatment[] = [
    {
      id: "cad",
      title: t("treatments.cad"),
      description: t("treatments.cad_desc"),
      media: "https://my.clevelandclinic.org/-/scassets/images/org/health/articles/16898-coronary-artery-disease",
      type: "image",
      link: "#contact",
      detail: getDetail("cad"),
    },
    {
      id: "heart_failure",
      title: t("treatments.heart_failure"),
      description: t("treatments.hf_desc"),
      media: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAJYu1eBrNlVdSq8jPOFYtQGXnPFB30bsFqA&s",
      type: "image",
      link: "#contact",
      detail: getDetail("heart_failure"),
    },
    {
      id: "congenital",
      title: t("treatments.congenital"),
      description: t("treatments.congenital_desc"),
      media: "https://img.freepik.com/free-vector/ventricular-septal-defect-congenital-heart-disease_1308-180371.jpg?semt=ais_user_personalization&w=740&q=80",
      type: "image",
      link: "#contact",
      detail: getDetail("congenital"),
    },
    {
      id: "arrhythmias",
      title: t("treatments.arrhythmias"),
      description: t("treatments.arrhythmias_desc"),
      media: "https://www.fasttalklabs.com/wp-content/uploads/2018/03/Screen-Shot-2021-04-15-at-12.45.03-PM-1192x960.png",
      type: "image",
      link: "#contact",
      detail: getDetail("arrhythmias"),
    },
    {
      id: "cardiomyopathy",
      title: t("treatments.cardiomyopathy"),
      description: t("treatments.cardiomyopathy_desc"),
      media: "https://stgaccinwbsdevlrs01.blob.core.windows.net/newcorporatewbsite/blogs/october2023/detail-main-Hypertrophic-Cardiomyopathy.jpeg",
      type: "image",
      link: "#contact",
      detail: getDetail("cardiomyopathy"),
    },
    {
      id: "pad",
      title: t("treatments.pad"),
      description: t("treatments.pad_desc"),
      media: "https://drabhilash.com/wp-content/uploads/2016/12/63de21f3-peripheral-arterial-disease-people-diabetes.jpg",
      type: "image",
      link: "#contact",
      detail: getDetail("pad"),
    },
    {
      id: "hypertension",
      title: t("treatments.hypertension"),
      description: t("treatments.hypertension_desc"),
      media: "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/8_ways_improving_odds_reduce_risk_heart_failure_slideshow/1800x1200_8_ways_improving_odds_reduce_risk_heart_failure_slideshow.jpg?resize=750px:*&output-quality=75",
      type: "image",
      link: "#contact",
      detail: getDetail("hypertension"),
    },
    {
      id: "diabetes",
      title: t("treatments.diabetes"),
      description: t("treatments.diabetes_desc"),
      media: "https://diabetesandwellnessclinic.com/wp-content/uploads/elementor/thumbs/dr-10-r014h9ihul3bas6xel1k5jnwgtme6c0me5q8a8dngg.jpg",
      type: "image",
      link: "#contact",
      detail: getDetail("diabetes"),
    },
    {
      id: "tavi",
      title: t("treatments.tavi"),
      description: t("treatments.tavi_desc"),
      media: "https://i.pinimg.com/1200x/91/24/97/9124974606739f428f2b3ffabc19b1e3.jpg",
      type: "image",
      link: "#contact",
      detail: getDetail("tavi"),
    }
  ];

  return (
    <section id="services" className="section-padding bg-public-neutral pb-16 pt-12">
      <div className="container-clinic mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white bg-public-secondary inline-block px-8 py-3 mb-2">
            {t("treatments.title")}
          </h2>
          <div className="w-16 h-1 bg-public-accent mx-auto mt-4" />
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {treatments.map((treatment) => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TreatmentsSection;