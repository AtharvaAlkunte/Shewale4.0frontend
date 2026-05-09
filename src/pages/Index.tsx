import { useState } from "react";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/clinic/TopBar";
import MainHeader from "@/components/clinic/MainHeader";
import Navbar from "@/components/clinic/Navbar";
import HeroBanner from "@/components/clinic/HeroBanner";
import AboutSection from "@/components/clinic/AboutSection";
import TreatmentsSection from "@/components/clinic/TreatmentsSection";
import AppointmentBanner from "@/components/clinic/AppointmentBanner";
import FacilitiesSection from "@/components/clinic/FacilitiesSection";
import StatsBanner from "@/components/clinic/StatsBanner";
import TestimonialsFAQ from "@/components/clinic/TestimonialsFAQ";
import ClinicFooter from "@/components/clinic/ClinicFooter";
import AppointmentModal from "@/components/clinic/AppointmentModal";
import EnquiryModal from "@/components/clinic/EnquiryModal";

const Index = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* <TopBar /> */}
      <MainHeader />
      <Navbar onAppointmentClick={() => setAppointmentOpen(true)} />
      <HeroBanner
        onAppointmentClick={() => setAppointmentOpen(true)}
        onContactClick={() => setEnquiryOpen(true)}
      />
      <AboutSection />
      <TreatmentsSection />
      <AppointmentBanner onBookClick={() => setAppointmentOpen(true)} />
      <FacilitiesSection />
      <StatsBanner />
      <TestimonialsFAQ />
      <ClinicFooter onContactClick={() => setEnquiryOpen(true)} />

      <AppointmentModal isOpen={appointmentOpen} onClose={() => setAppointmentOpen(false)} />
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
};

export default Index;
