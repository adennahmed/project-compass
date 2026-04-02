import { useState } from "react";
import LinkText from "./LinkText";

const roles = ["Founder", "Executive", "Partner", "Other"];

const ContactSection = () => {
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    company: "",
    industry: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-32 md:py-40 px-6 md:px-12 max-w-[1200px] mx-auto">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        {/* Left */}
        <div>
          <div
            className="text-[11px] uppercase tracking-[0.18em] mb-6"
            style={{ color: "#444444" }}
          >
            GET IN TOUCH
          </div>
          <h2 className="text-[36px] md:text-[48px] font-light leading-[1.1] mb-6">
            Ready to Build Something Strong?
          </h2>
          <p
            className="text-[15px] leading-[1.75] mb-10"
            style={{ color: "#888888" }}
          >
            Tell us about your business and what you're looking to achieve.
            We'll respond within one business day.
          </p>
          <ul className="space-y-3">
            {[
              "No commitment required",
              "Response within 24 hours",
              "Engagements from SMB to enterprise",
            ].map((item, i) => (
              <li
                key={i}
                className="text-[14px] flex items-center gap-3"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <span style={{ color: "#C8A96E" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-8"
        >
          {/* Role */}
          <div className="field-wrap relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-transparent border-b py-3 text-[15px] outline-none appearance-none"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                borderWidth: "0 0 0.5px 0",
                color: formData.role ? "#ffffff" : "#444444",
              }}
            >
              <option value="" disabled>
                I am a *
              </option>
              {roles.map((r) => (
                <option key={r} value={r} style={{ background: "#080808" }}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: "firstName", label: "First name *" },
              { name: "lastName", label: "Last name *" },
            ].map((field) => (
              <div key={field.name} className="field-wrap relative">
                <input
                  type="text"
                  name={field.name}
                  placeholder=" "
                  value={formData[field.name as keyof typeof formData] as string}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b py-3 text-[15px] text-white outline-none peer"
                  style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    borderWidth: "0 0 0.5px 0",
                  }}
                />
                <label
                  className="absolute top-3 left-0 text-[15px] pointer-events-none transition-all duration-200 peer-focus:top-[-14px] peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.12em] peer-[:not(:placeholder-shown)]:top-[-14px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.12em]"
                  style={{ color: "#444444" }}
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>

          {/* Company & Industry */}
          {[
            { name: "company", label: "Company *" },
            { name: "industry", label: "Industry *" },
            { name: "email", label: "Email *", type: "email" },
            { name: "phone", label: "Phone" },
          ].map((field) => (
            <div key={field.name} className="field-wrap relative">
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder=" "
                value={formData[field.name as keyof typeof formData] as string}
                onChange={handleChange}
                className="w-full bg-transparent border-b py-3 text-[15px] text-white outline-none peer"
                style={{
                  borderColor: "rgba(255,255,255,0.15)",
                  borderWidth: "0 0 0.5px 0",
                }}
              />
              <label
                className="absolute top-3 left-0 text-[15px] pointer-events-none transition-all duration-200 peer-focus:top-[-14px] peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.12em] peer-[:not(:placeholder-shown)]:top-[-14px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.12em]"
                style={{ color: "#444444" }}
              >
                {field.label}
              </label>
            </div>
          ))}

          {/* Message */}
          <div className="field-wrap relative">
            <textarea
              name="message"
              placeholder=" "
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-transparent border-b py-3 text-[15px] text-white outline-none resize-none peer"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                borderWidth: "0 0 0.5px 0",
              }}
            />
            <label
              className="absolute top-3 left-0 text-[15px] pointer-events-none transition-all duration-200 peer-focus:top-[-14px] peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.12em] peer-[:not(:placeholder-shown)]:top-[-14px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.12em]"
              style={{ color: "#444444" }}
            >
              Message
            </label>
          </div>

          {/* Agree */}
          <label className="flex items-start gap-3 text-[13px]" style={{ color: "#888888" }}>
            <input
              type="checkbox"
              checked={formData.agree}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, agree: e.target.checked }))
              }
              className="mt-0.5"
              style={{ accentColor: "#C8A96E" }}
            />
            I agree to the privacy policy.
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="text-[14px] px-8 py-3 hover-target"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff",
              borderRadius: "2px",
              background: "transparent",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8A96E";
              e.currentTarget.style.background = "rgba(200,169,110,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LinkText>Send Message</LinkText>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
