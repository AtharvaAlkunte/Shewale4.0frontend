import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onAppointmentClick: () => void;
}

const Navbar = ({ onAppointmentClick }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'मराठी' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
  ];

  const currentLanguageName = languages.find(l => l.code === i18n.language)?.name || 'English';

  const navLinks = [
    { label: t("nav.home"), key: "HOME" },
    { label: t("nav.about"), key: "ABOUT" },
    { label: t("nav.services"), key: "SERVICES" },
    { label: t("nav.facilities"), key: "FACILITIES" },
    { label: t("nav.gallery"), key: "GALLERY" },
    { label: t("nav.faq"), key: "FAQ" },
    { label: t("nav.enquiry"), key: "ENQUIRY" },
    { label: t("nav.contact"), key: "CONTACT" },
  ];

  return (
    <nav className="w-full bg-public-primary sticky top-0 z-50 shadow-md transition-all duration-300">
      <div className="container-clinic flex items-center justify-between">
        {/* Mobile toggle */}
        <button
          className="lg:hidden p-3 text-white hover:text-white/80 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Links */}
        <ul className={`
          ${mobileOpen ? "flex" : "hidden"} lg:flex
          flex-col lg:flex-row
          absolute lg:relative top-full left-0 w-full lg:w-auto
          bg-public-primary lg:bg-transparent
          shadow-md lg:shadow-none
          z-40
        `}>
          {navLinks.map((link) => (
            <li key={link.key}>
              <a
                href={`#${link.key.toLowerCase()}`}
                className="block px-4 py-3 lg:py-4 text-sm font-semibold text-white/90 hover:text-white transition-colors tracking-wide relative group"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                <span className="absolute bottom-[2px] lg:bottom-1.5 left-4 right-4 h-0.5 bg-white scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Right side Actions */}
        <div className="flex items-center gap-3 pr-4 lg:pr-0">
          <Button
            className="px-5 py-2 lg:px-7 lg:py-5 rounded-full text-xs md:text-sm bg-white text-public-primary hover:bg-white/90 font-bold border-none transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
            onClick={onAppointmentClick}
          >
            {t("common.get_appointment")}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10 rounded-full h-10 px-3 flex items-center gap-1.5 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs md:text-sm font-semibold hidden sm:inline">{currentLanguageName}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[101]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={`cursor-pointer text-sm font-medium ${i18n.language === lang.code ? 'bg-muted' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
