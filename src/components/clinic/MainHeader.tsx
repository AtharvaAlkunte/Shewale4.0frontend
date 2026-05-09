import React from "react";
import { Clock, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import clinicLogo from "../../assets/Dr.Sunil Shewale logo.jpeg";
import facebookIcon from "../../assets/facebook.png.jpg";
import instagramIcon from "../../assets/instagram.png.jpg";
import qrCode from "../../assets/qr-code.png.png";
import qrCode2 from "../../assets/qr-code2.png.png";

const MainHeader: React.FC = () => {
  const { t } = useTranslation();

  // Updated Links as per your requirement
  const googleMapsLink = "https://maps.app.goo.gl/H5ms83GuxARS1YWg6";
  const googleReviewLink = "https://www.google.com/search?sca_esv=df25ec6ca4037ad0&sxsrf=ANbL-n55CKKZgPxnw-BVl9TiiyveL4zfCQ:1775033933579&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qORE9vJlCHojPZZozkvgwp1qL6c4fdhtrp9cxitJJ_fzPAizSyXtdve8Oz9RX6jfUyYCRF7z9lkHS5AGibmQFE5aLN6fcsWMJ_TszY6d-GoQLOR_vEg6pqgTT9wHWaJU6QQbvzi4%3D&q=Dr+Shewale%5C%27s+Sai+Heart+%26+Maternity+Care+Reviews&sa=X&ved=2ahUKEwjo4MzYpMyTAxVsUGwGHT5EBBcQ0bkNegQILhAF&biw=1440&bih=778&dpr=2#lrd=0x3bc5da77cd8ed7d3:0xf42da816260d47f4,3,,,,";

  return (
    <>
      <style>
        {`
            @keyframes scan-line {
                0%, 100% { top: 4px; opacity: 1; }
                50% { top: calc(100% - 4px); opacity: 1; }
            }
            @keyframes blink-dot {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
            }
            @keyframes emergency-glow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
                50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
            }
            .emergency-badge { animation: emergency-glow 1.8s ease-in-out infinite; }
            .live-dot { animation: blink-dot 1.2s ease-in-out infinite; }
            .qr-scan-line {
                position: absolute;
                left: 4px;
                right: 4px;
                height: 2px;
                background: linear-gradient(90deg, transparent, currentColor, transparent);
                animation: scan-line 2s linear infinite;
            }
            .social-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            }
            .social-btn:hover { transform: scale(1.1); }
            .social-btn img {
                width: 36px;
                height: 36px;
                object-fit: contain;
                border-radius: 8px;
            }
            @media (min-width: 1024px) {
                .social-btn img { width: 42px; height: 42px; }
            }
        `}
      </style>

      <div className="w-full bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-3 lg:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* ── ROW 1: Logo & Name ── */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 bg-white">
                <img className="w-full h-full object-cover" src={clinicLogo} alt="Care Logo" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-extrabold text-slate-800 leading-tight">
                  {t("header.clinic_name")}{" "}
                  <span className="text-blue-600">{t("header.clinic_subname")}</span>
                </h1>
                <p className="text-[11px] lg:text-sm text-slate-600 font-medium uppercase tracking-wide">
                  {t("header.clinic_location")}
                </p>
              </div>
            </div>

            {/* ── ROW 2: Hours & Emergency (Side-by-side on mobile) ── */}
            <div className="grid grid-cols-2 lg:flex items-center gap-2 sm:gap-4 lg:gap-8">
              {/* Visiting Hours */}
              <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-blue-100 lg:bg-transparent lg:border-none overflow-hidden">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase font-bold text-slate-500 truncate">{t("header.visiting_hours")}</p>
                  <p className="text-[10px] sm:text-sm font-bold text-slate-700 truncate">{t("header.hours_value")}</p>
                </div>
              </div>

              {/* Emergency / Appointment */}
              <div className="emergency-badge flex items-center gap-2 bg-white border border-red-200 rounded-lg px-2 py-2 lg:bg-red-50 overflow-hidden">
                <span className="live-dot w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-red-500 uppercase tracking-tight truncate">Emergency</p>
                  <p className="text-[10px] sm:text-sm font-black text-red-600 truncate">+91 7447445121</p>
                </div>
              </div>
            </div>

            {/* ── ROW 3: Social Media & Clickable QRs ── */}
            <div className="flex items-center justify-between lg:justify-end gap-2 pt-2 lg:pt-0 border-t border-blue-100 lg:border-none">
              
              {/* Social Media Group */}
              <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/p/Dr-Shewales-Sai-Heart-Maternity-Care-100064275300587/" 
                   target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook">
                  <img src={facebookIcon} alt="Facebook" />
                </a>
                <a href="https://www.instagram.com/saiheartcaresolapur/" 
                   target="_blank" rel="noopener noreferrer" className="social-btn" title="Instagram">
                  <img src={instagramIcon} alt="Instagram" />
                </a>
              </div>

              {/* Clickable QR Codes Group */}
              <div className="flex items-center gap-3">
                {/* Find Us QR */}
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 border border-dashed border-blue-400 rounded bg-white p-1 transition-all group-hover:border-blue-600 group-hover:shadow-md">
                    <img src={qrCode} alt="Location" className="w-full h-full object-contain" />
                    <div className="qr-scan-line text-blue-500" />
                  </div>
                  <span className="text-[8px] font-bold text-blue-700 uppercase mt-1">Find Us</span>
                </a>

                {/* Rate Us QR */}
                <a href={googleReviewLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 border border-dashed border-green-400 rounded bg-white p-1 transition-all group-hover:border-green-600 group-hover:shadow-md">
                    <img src={qrCode2} alt="Rate" className="w-full h-full object-contain" />
                    <div className="qr-scan-line text-green-500" />
                  </div>
                  <span className="text-[8px] font-bold text-green-700 uppercase mt-1">Rate Us</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainHeader;