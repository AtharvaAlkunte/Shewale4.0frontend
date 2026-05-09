import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./admin/pages/Dashboard";
import Appointments from "./admin/pages/Appointments";
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import PatientReports from "./admin/pages/PatientReports";
import Reports from "./pages/Reports";
import ManageTestimonials from "./admin/pages/ManageTestimonials";
import ManageFAQs from "./admin/pages/ManageFAQs";
import Patients from "./admin/pages/Patients";
import PatientDetails from "./admin/pages/PatientDetails";
import Prescriptions from "./admin/pages/Prescriptions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/:appointmentId"
            element={
              <ProtectedRoute>
                <PatientReports />
              </ProtectedRoute>
            }
          />
          <Route path="/reports/:appointmentId" element={<Reports />} />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <ManageTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <ProtectedRoute>
                <ManageFAQs />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/admin/patients/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
          <Route path="/admin/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
