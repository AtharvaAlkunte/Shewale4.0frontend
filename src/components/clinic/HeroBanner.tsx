import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './HeroBanner.css';

// Import images
import heroHeart from '@/assets/hero-heart.jpg';
import doctorPortrait from '@/assets/doctor-portrait.jpg';
import heroPatient from '@/assets/hero-patient.jpg';
import avoidFood from '@/assets/ThingsToAvoid.png';
import healthyFood from '@/assets/HealthyEating.png';
import basicBanner from '@/assets/banner1.png';
import basicBanner2 from '@/assets/banner2.png';
import basicBanner3 from '@/assets/banner3.png';
import basicBanner4 from '@/assets/banner4.png';



interface Slide {
    id: number;
    image: string;
    heading: string;
    subheading: string;
    buttonText: string;
}

interface HeroBannerProps {
    onAppointmentClick: () => void;
    onContactClick: () => void;
}

const HeroBanner = ({ onAppointmentClick, onContactClick }: HeroBannerProps) => {
    const { t } = useTranslation();
    const [showPhone, setShowPhone] = React.useState(false);

    const slides: Slide[] = [
        {
            id: 1,
            image: basicBanner,
            heading: "",
            subheading: "",
            buttonText: "",
        },
        // {
        //     id: 2,
        //     image: basicBanner2,
        //     heading: "",
        //     subheading: "",
        //     buttonText: "",
        // },
        {
            id: 2,
            image: basicBanner3,
            heading: "",
            subheading: "",
            buttonText: "",
        },
        {
            id: 3,
            image: basicBanner4,
            heading: "",
            subheading: "",
            buttonText: "",
        },

        {
            id: 4,
            image: healthyFood,
            heading: "",
            subheading: "",
            buttonText: "",
        },
        {
            id: 5,
            image: avoidFood,
            heading: "",
            subheading: "",
            buttonText: "",
        },

    ];

    const handleButtonClick = (slideId: number) => {
        if (slideId === 3) {
            if (showPhone) {
                window.location.href = "tel:+919876543210";
            } else {
                setShowPhone(true);
            }
        } else {
            onAppointmentClick();
        }
    };

    return (
        <section id="home" className="hero-section">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                speed={1000}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={true}
                navigation={true}
                pagination={{ clickable: true }}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="slide-content"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="slide-overlay">
                                <div className="slide-text-container">
                                    {slide.heading && (
                                        <h2 className="slide-heading">{slide.heading}</h2>
                                    )}
                                    {slide.subheading && (
                                        <p className="slide-subheading">{slide.subheading}</p>
                                    )}
                                    {slide.buttonText && (
                                        <button
                                            className="slide-cta-button"
                                            onClick={() => handleButtonClick(slide.id)}
                                        >
                                            {slide.buttonText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default HeroBanner;
