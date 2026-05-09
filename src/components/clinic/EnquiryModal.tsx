import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryModal = ({ isOpen, onClose }: EnquiryModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setForm({ name: "", email: "", phone: "", message: "" });
        onClose();
      } else {
        toast.error(typeof data.error === 'string' ? data.error : data.error[0]);
      }
    } catch (error) {
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md relative">
        <div className="bg-public-primary p-5 rounded-t-lg flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{t('footer.contact_us')}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="enquiryName" className="text-public-dark font-medium">Your Name *</Label>
            <Input
              id="enquiryName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
              maxLength={100}
              className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
            />
          </div>
          <div>
            <Label htmlFor="enquiryEmail" className="text-public-dark font-medium">Email *</Label>
            <Input
              id="enquiryEmail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              maxLength={255}
              className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
            />
          </div>
          <div>
            <Label htmlFor="enquiryPhone" className="text-public-dark font-medium">Phone</Label>
            <Input
              id="enquiryPhone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
              maxLength={15}
              className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
            />
          </div>
          <div>
            <Label htmlFor="enquiryMessage" className="text-public-dark font-medium">Message *</Label>
            <Textarea
              id="enquiryMessage"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help you?"
              maxLength={1000}
              rows={4}
              className="focus-visible:ring-public-accent focus-visible:border-public-primary border-public-muted"
            />
          </div>
          <Button type="submit" variant="contact" className="w-full" disabled={loading}>
            {loading ? "..." : t('modal.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
