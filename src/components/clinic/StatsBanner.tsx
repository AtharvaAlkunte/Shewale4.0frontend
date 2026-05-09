import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Zap, Activity, Baby } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import statsBg from "@/assets/stats-bg.jpg";

interface Stat {
  icon: LucideIcon;
  count: number;
  suffix: string;
  label?: string;
  labelKey?: string;
}

const useCountUp = (target: number, shouldAnimate: boolean, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldAnimate) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, shouldAnimate, duration]);
  return count;
};

const StatItem = ({ stat, animate }: { stat: Stat; animate: boolean }) => {
  const count = useCountUp(stat.count, animate);
  const Icon = stat.icon;
  return (
    <div className="text-center">
      <Icon className="w-10 h-10 text-public-accent mx-auto mb-3" />
      <p className="text-3xl md:text-4xl font-black text-primary-foreground mb-1">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-primary-foreground/80 text-sm font-medium">{stat.label}</p>
    </div>
  );
};

const StatsBanner = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const stats: Stat[] = [
    { icon: Heart, count: 9000, suffix: "+", labelKey: "stats.angiographies" },
    { icon: Zap, count: 250, suffix: "+", labelKey: "stats.pacemakers" },
    { icon: Activity, count: 3000, suffix: "+", labelKey: "stats.angioplasties" },
    { icon: Baby, count: 250, suffix: "+", labelKey: "stats.pediatric" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 bg-public-primary"
      style={{
        backgroundImage: `url(${statsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-public-primary/95" />
      <div className="container-clinic relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <StatItem key={stat.labelKey} stat={{ ...stat, label: t(stat.labelKey!) }} animate={visible} />
        ))}
      </div>
    </section>
  );
};

export default StatsBanner;
