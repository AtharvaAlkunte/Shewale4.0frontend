import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Play, Pause, Plus, Minus, Star } from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoTestimonial {
  _id?: string;
  id?: string | number;
  name: string;
  designation: string;
  video: string;
  thumbnail?: string;
  rating: number;
  quote: string;
}

interface FAQType {
  _id?: string;
  question: string;
  answer: string;
}

// Data will be fetched dynamically via API

// ─── VideoCard ────────────────────────────────────────────────────────────────

interface VideoCardProps {
  testimonial: VideoTestimonial;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const VideoCard = ({ testimonial, isHovered, onHover, onLeave, onClick }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play / pause driven by parent hover state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered) {
      v.play().then(() => setIsPlaying(true)).catch(() => { });
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [isHovered]);

  const rawSrc = testimonial.video.startsWith('/uploads/') ? `${API_BASE_URL}${testimonial.video}` : testimonial.video.startsWith('/assets/') ? `/videos/${testimonial.video.split('/').pop()}` : testimonial.video;
  // Append #t=0.001 to force browser to load the first frame as a poster/thumbnail securely
  const videoSrc = rawSrc.includes('#') ? rawSrc : `${rawSrc}#t=0.001`;

  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        width: "clamp(150px, 20vw, 210px)",
        aspectRatio: "9 / 16",
        boxShadow: isHovered
          ? "0 24px 64px rgba(0,0,0,0.38), 0 0 0 2.5px #06b6d4"
          : "0 6px 28px rgba(0,0,0,0.16)",
        transform: isHovered ? "scale(1.055) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.45s cubic-bezier(.22,1,.36,1)",
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={testimonial.thumbnail}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isHovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(.22,1,.36,1)",
        }}
      />

      {/* Deep cinematic gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Care-red top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "#06b6d4" }}
      />

      {/* Play / Pause button — visible on hover */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{
            background: "rgba(6, 182, 212, 0.72)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            boxShadow: "0 4px 20px rgba(6, 182, 212, 0.45)",
          }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
          )}
        </div>
      </div>

      {/* Subtle play hint when idle */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Live indicator */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#06b6d4" }}
          />
          <span
            className="text-white font-semibold"
            style={{ fontSize: "10px", letterSpacing: "0.12em" }}
          >
            LIVE
          </span>
        </div>
      )}

      {/* Bottom patient info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Stars */}
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" />
          ))}
        </div>
        <p className="text-white font-bold leading-tight" style={{ fontSize: "13px" }}>
          {testimonial.name}
        </p>
        <p className="text-white/60 mt-0.5" style={{ fontSize: "11px" }}>
          {testimonial.designation}
        </p>
        {/* Quote — visible on hover */}
        <div
          style={{
            maxHeight: isHovered ? "60px" : "0",
            opacity: isHovered ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s ease, opacity 0.35s ease",
            marginTop: isHovered ? "8px" : "0",
          }}
        >
          <p
            className="text-white/80 italic leading-snug"
            style={{ fontSize: "11px" }}
          >
            "{testimonial.quote}"
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TestimonialsFAQ = () => {
  const { t } = useTranslation();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setTestimonials(data.data);
      })
      .catch(console.error);

    fetch(`${API_BASE_URL}/api/faqs`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFaqs(data.data);
      })
      .catch(console.error);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section id="faq" className="section-padding bg-public-light overflow-hidden">

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <div className="container-clinic mb-20">

        {/* Section label + heading */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-public-accent font-bold uppercase mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.28em" }}
          >
            {t("testimonials_faq.patient_stories")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-public-secondary mb-3 leading-tight">
            {t("testimonials_faq.voices_of_recovery")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            {t("testimonials_faq.real_patients_outcomes")}
          </p>
          {/* Accent rule */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-public-accent/25" />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#06b6d4" }}
            />
            <div className="h-px w-12 bg-public-accent/25" />
          </div>
        </div>

        {/* Scroll container */}
        <div className="relative">
          {/* Fade edges (desktop) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none hidden sm:block"
            style={{
              background:
                "linear-gradient(to right, var(--background, white) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none hidden sm:block"
            style={{
              background:
                "linear-gradient(to left, var(--background, white) 0%, transparent 100%)",
            }}
          />

          {/* Arrow buttons */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 hidden sm:flex"
            style={{ background: "#0f172a" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 hidden sm:flex"
            style={{ background: "#2563eb" }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards track */}
          <div
            ref={scrollRef}
            className="flex gap-5 px-4 py-8 overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
              alignItems: "flex-end",          // cards "sit" on a baseline — lifted card feels taller
            }}
            onMouseLeave={() => setHoveredId(null)}
          >
            <style>{`
              .cards-track > *::-webkit-scrollbar { display: none; }
              .scroll-track::-webkit-scrollbar { display: none; }
            `}</style>

            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div
                  key={t._id || t.id}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <VideoCard
                    testimonial={t}
                    isHovered={hoveredId === (t._id || t.id)}
                    onHover={() => setHoveredId(t._id || t.id!)}
                    onLeave={() => setHoveredId(null)}
                    onClick={() => setActiveVideo(t)}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-10">
                <p className="text-muted-foreground">{t("testimonials_faq.no_testimonials")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust stats strip */}
        {/* <div className="mt-8 flex justify-center gap-10 flex-wrap">
          {[
            { value: "5,000+", label: "Surgeries Performed" },
            { value: "98%", label: "Success Rate" },
            { value: "15+ yrs", label: "Experience" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-public-secondary">{stat.value}</p>
              <p
                className="text-muted-foreground uppercase mt-0.5"
                style={{ fontSize: "10px", letterSpacing: "0.18em" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div> */}
      </div>

      {/* Divider */}
      <div className="container-clinic">
        <div
          className="mb-20"
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, var(--border, #e5e7eb), transparent)",
          }}
        />
      </div>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <div className="container-clinic" style={{ maxWidth: "720px" }}>

        <div className="text-center mb-10">
          <span
            className="inline-block text-public-accent font-bold uppercase mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.28em" }}
          >
            {t("testimonials_faq.got_questions")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-public-secondary mb-3">
            {t("nav.faq") || "FAQ"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            {t("testimonials_faq.everything_you_need_to_know")}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden"
                  style={{
                    boxShadow: isOpen
                      ? "0 4px 24px rgba(37,99,235,0.13)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.35s ease",
                  }}
                >
                  {/* Question button */}
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm transition-colors duration-300 ${isOpen
                      ? "bg-public-primary text-white"
                      : "bg-public-light text-foreground hover:bg-muted"
                      }`}
                  >
                    <span className="pr-4 leading-snug">{faq.question}</span>
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.07)",
                      }}
                    >
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>

                  {/* Answer — animated slide */}
                  <div
                    style={{
                      maxHeight: isOpen ? "300px" : "0",
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition:
                        "max-height 0.42s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
                    }}
                  >
                    <div className="px-5 py-4 bg-card border border-border border-t-0 rounded-b-xl">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("testimonials_faq.no_faqs")}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            {t("testimonials_faq.still_have_questions")}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-7 py-3 rounded-full transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "#1a2a4a" }}
          >
            {t("testimonials_faq.talk_to_our_team")}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-[10000] text-white bg-black/50 hover:bg-white/20 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              ✕
            </button>
            <video
              src={(() => {
                const rawSrc = activeVideo.video.startsWith('/uploads/') ? `${API_BASE_URL}${activeVideo.video}` : activeVideo.video.startsWith('/assets/') ? `/videos/${activeVideo.video.split('/').pop()}` : activeVideo.video;
                return rawSrc;
              })()}
              className="w-full max-h-[85vh] object-contain"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsFAQ;