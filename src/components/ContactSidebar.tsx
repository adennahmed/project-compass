import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LinkText from "./LinkText";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const roles = ["FOUNDER", "EXECUTIVE", "PARTNER", "OTHER"];

interface ContactSidebarProps {
  open: boolean;
  onClose: () => void;
}

const ContactSidebar = ({ open, onClose }: ContactSidebarProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    message: "",
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(panelRef.current, { x: "-100%" }, { x: "0%", duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(panelRef.current, { x: "-100%", duration: 0.4, ease: "power3.in" });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });
    }
  }, [open]);

  if (!open && !panelRef.current) return null;

  return (
    <div
      className="fixed inset-0 z-[2000]"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)", opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute top-0 left-0 h-full w-full max-w-[440px] overflow-y-auto"
        style={{
          background: "#f5f2ed",
          transform: "translateX(-100%)",
        }}
      >
        <div className="p-8 md:p-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[24px] hover-target transition-transform duration-300 hover:rotate-90"
            style={{ color: "#1a1a1a" }}
          >
            ✕
          </button>

          {/* Title */}
          <h2
            className="text-[28px] md:text-[36px] font-bold uppercase leading-[1.1] mb-8 max-w-[320px]"
            style={{ color: "#1a1a1a" }}
          >
            Talk to the Kozai Team.
          </h2>

          {/* Role selector */}
          <div className="mb-8">
            <div
              className="text-[11px] uppercase tracking-[0.14em] mb-4"
              style={{ color: "rgba(30,30,30,0.5)" }}
            >
              I'm a <span style={{ color: "rgba(30,30,30,0.3)" }}>[SELECT ONE]</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className="px-4 py-2 text-[12px] uppercase tracking-[0.08em] transition-all duration-200 hover-target"
                  style={{
                    border: selectedRole === role
                      ? "1.5px solid #C8A96E"
                      : "1px solid rgba(30,30,30,0.15)",
                    borderRadius: "4px",
                    background: selectedRole === role ? "rgba(200,169,110,0.08)" : "transparent",
                    color: selectedRole === role ? "#C8A96E" : "rgba(30,30,30,0.55)",
                  }}
                >
                  {selectedRole === role && <span className="mr-1">■</span>}
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* About You */}
          <div
            className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-4"
            style={{ color: "#1a1a1a" }}
          >
            About You
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-transparent border-b py-3 text-[14px] outline-none"
              style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-transparent border-b py-3 text-[14px] outline-none"
              style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b py-3 text-[14px] outline-none"
              style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent border-b py-3 text-[14px] outline-none"
              style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
            />
          </div>

          {/* Your Business */}
          <div
            className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-4"
            style={{ color: "#1a1a1a" }}
          >
            Your Business
          </div>

          <input
            type="text"
            name="businessName"
            placeholder="Business name"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full bg-transparent border-b py-3 text-[14px] outline-none mb-4"
            style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
          />
          <input
            type="text"
            name="businessType"
            placeholder="Type of business"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full bg-transparent border-b py-3 text-[14px] outline-none mb-4"
            style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
          />
          <textarea
            name="message"
            placeholder="Message (Optional)"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-transparent border-b py-3 text-[14px] outline-none resize-none mb-6"
            style={{ borderColor: "rgba(30,30,30,0.15)", color: "#1a1a1a" }}
          />

          {/* Agree */}
          <label className="flex items-start gap-3 text-[12px] mb-8 cursor-pointer" style={{ color: "rgba(30,30,30,0.55)" }}>
            <input
              type="checkbox"
              checked={formData.agree}
              onChange={(e) => setFormData((prev) => ({ ...prev, agree: e.target.checked }))}
              className="mt-0.5"
              style={{ accentColor: "#C8A96E" }}
            />
            <span>
              By checking this box I agree to the{" "}
              <a href="#" className="underline" style={{ color: "#1a1a1a" }}>
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="button"
            className="relative inline-block px-6 py-3 hover-target group"
            disabled={submitting}
            onClick={async () => {
              if (!formData.firstName || !formData.lastName || !formData.email) {
                toast.error("Please fill in your name and email.");
                return;
              }
              if (!formData.agree) {
                toast.error("Please agree to the Privacy Policy.");
                return;
              }
              setSubmitting(true);
              try {
                const { error } = await supabase.functions.invoke("send-contact-email", {
                  body: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    businessName: formData.businessName,
                    businessType: formData.businessType,
                    role: selectedRole,
                    message: formData.message,
                  },
                });
                if (error) throw error;
                toast.success("Inquiry sent successfully. We'll be in touch.");
                setFormData({ firstName: "", lastName: "", email: "", phone: "", businessName: "", businessType: "", message: "", agree: false });
                setSelectedRole(null);
                onClose();
              } catch (err) {
                console.error(err);
                toast.error("Something went wrong. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.25)" }} />
            <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: submitting ? "rgba(30,30,30,0.35)" : "rgba(30,30,30,0.75)" }}>
              <LinkText>{submitting ? "Sending..." : "Send Message"}</LinkText>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSidebar;
