import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  "Cardiac Consultation",
  "ECG",
  "2D Echo",
  "TMT",
  "Angiography",
  "Angioplasty",
  "Pacemaker Implantation",
  "Device Closure",
];

const AppointmentModal = ({ isOpen, onClose }: AppointmentModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    appointmentDate: "",
    timeSlot: "",
    serviceType: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.phone || !form.appointmentDate || !form.serviceType) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setForm({ patientName: "", phone: "", email: "", appointmentDate: "", timeSlot: "", serviceType: "" });
        onClose();
      } else {
        toast.error(typeof data.error === 'string' ? data.error : data.error[0]);
      }
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md relative">
        <div className="bg-public-primary p-5 rounded-t-lg flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{t('modal.book_title')}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName" className="text-public-dark font-medium">Patient Name *</Label>
              <Input
                id="patientName"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                placeholder="Enter patient name"
                maxLength={100}
                required
                className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-public-dark font-medium">Phone *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
                maxLength={15}
                required
                className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-public-dark font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@mail.com"
              maxLength={100}
              className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-public-dark font-medium">Preferred Date *</Label>
              <Input
                id="date"
                type="date"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                required
                className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-public-dark font-medium">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={form.timeSlot}
                onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
              />
            </div>
          </div>
          <div>
            <Label className="text-public-dark font-medium">Service Type *</Label>
            {/* ADDED value={form.serviceType} here */}
            <Select
              value={form.serviceType}
              onValueChange={(v) => setForm({ ...form, serviceType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="appointment" className="w-full" disabled={loading}>
            {loading ? "..." : t('common.book_appointment')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;