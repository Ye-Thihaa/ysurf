import { useState, useRef, useEffect, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  Globe,
  Mail,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import FadeInSection from "@/components/FadeInSection";
import ScrollProgress from "@/components/ScrollProgress";

const serviceOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "ui-ux-design", label: "UI / UX Design" },
  { value: "frontend-development", label: "Frontend Development" },
  { value: "web-deployment", label: "Web Deployment & Optimization" },
  { value: "other", label: "Other" },
];

const infos = [
  { icon: Mail, label: "Email", value: "yethihaahtun@gmail.com" },
  { icon: Clock, label: "Response Time", value: "Within 24 hours" },
  { icon: Globe, label: "Availability", value: "Open for projects" },
  { icon: Calendar, label: "Booking", value: "Flexible scheduling" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Custom Dropdown ──────────────────────────────────────────────────────────
function ServiceDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = serviceOptions.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
          error ? "border-destructive" : open ? "border-ring ring-2 ring-ring" : "border-input"
        }`}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label ?? "Select a service"}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1.5 w-full rounded-lg border border-border bg-card shadow-lg overflow-hidden"
          >
            {serviceOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-muted ${
                  value === opt.value
                    ? "text-primary font-medium bg-primary/5"
                    : "text-foreground"
                }`}
              >
                {opt.label}
                {value === opt.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Custom Date Picker ───────────────────────────────────────────────────────
function DatePicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const parsed = value ? new Date(value + "T00:00:00") : null;

  const [view, setView] = useState({
    month: parsed?.getMonth() ?? today.getMonth(),
    year: parsed?.getFullYear() ?? today.getFullYear(),
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const prevMonth = () =>
    setView((v) =>
      v.month === 0 ? { month: 11, year: v.year - 1 } : { ...v, month: v.month - 1 }
    );
  const nextMonth = () =>
    setView((v) =>
      v.month === 11 ? { month: 0, year: v.year + 1 } : { ...v, month: v.month + 1 }
    );

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const selectDay = (day: number) => {
    const d = new Date(view.year, view.month, day);
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    setOpen(false);
  };

  const isSelected = (day: number) => {
    if (!parsed) return false;
    return (
      parsed.getFullYear() === view.year &&
      parsed.getMonth() === view.month &&
      parsed.getDate() === day
    );
  };

  const isPast = (day: number) => {
    const d = new Date(view.year, view.month, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const displayValue = parsed
    ? parsed.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
          error ? "border-destructive" : open ? "border-ring ring-2 ring-ring" : "border-input"
        }`}
      >
        <span className={displayValue ? "text-foreground" : "text-muted-foreground"}>
          {displayValue ?? "Pick a date"}
        </span>
        <Calendar size={16} className="text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1.5 w-56 rounded-lg border border-border bg-card shadow-lg p-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={prevMonth}
                className="p-0.5 rounded hover:bg-muted transition-colors"
              >
                <ChevronLeft size={13} className="text-muted-foreground" />
              </button>
              <span className="text-xs font-medium text-foreground">
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-0.5 rounded hover:bg-muted transition-colors"
              >
                <ChevronRight size={13} className="text-muted-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-0.5">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] text-muted-foreground font-medium py-0.5"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                const sel = isSelected(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={past}
                    onClick={() => selectDay(day)}
                    className={`h-6 w-full flex items-center justify-center text-[10px] rounded transition-colors ${
                      sel
                        ? "bg-primary text-primary-foreground font-medium"
                        : past
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-foreground hover:bg-muted cursor-pointer"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const Appointment = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
    message: "",
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.date) errs.date = "Preferred date is required";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSendError("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          service: form.service,
          date: form.date,
          message: form.message,
          to_email: "yethihaahtun@gmail.com",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (err) {
      setSendError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollProgress />  
      <section className="py-20">
        <div className="container mx-auto px-4">

          {/* Page Heading */}
          <FadeInSection>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book an Appointment
            </h1>
            <p className="text-muted-foreground mb-12 max-w-lg">
              Have a project in mind? Fill out the form and I'll get back to you
              within 24 hours to confirm the details.
            </p>
          </FadeInSection>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">

            {/* Left: Info Cards */}
            <FadeInSection delay={80}>
              <div className="space-y-4">
                {infos.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={info.label}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        <p className="text-sm font-medium text-foreground">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeInSection>

            {/* Right: Form / Success */}
            <FadeInSection delay={160}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center gap-4 py-16 px-8 rounded-2xl border border-border bg-card"
                  >
                    <CheckCircle2 size={48} className="text-primary" />
                    <h2 className="font-heading text-xl font-bold text-foreground">
                      Request Received!
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Thanks for reaching out. I'll review your request and confirm
                      the appointment soon.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", service: "", date: "", message: "" });
                      }}
                      className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium border border-input rounded-lg hover:bg-muted transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5 p-8 rounded-2xl border border-border bg-card"
                  >
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 text-sm rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                          errors.name ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 text-sm rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                          errors.email ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Service — Custom Dropdown */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Service Type
                      </label>
                      <ServiceDropdown
                        value={form.service}
                        onChange={(val) => handleChange("service", val)}
                        error={errors.service}
                      />
                      {errors.service && (
                        <p className="text-xs text-destructive mt-1">{errors.service}</p>
                      )}
                    </div>

                    {/* Date — Custom Picker */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Preferred Date
                      </label>
                      <DatePicker
                        value={form.date}
                        onChange={(val) => handleChange("date", val)}
                        error={errors.date}
                      />
                      {errors.date && (
                        <p className="text-xs text-destructive mt-1">{errors.date}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell me about your project or what you'd like to discuss..."
                        className={`w-full px-4 py-3 text-sm rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                          errors.message ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive mt-1">{errors.message}</p>
                      )}
                    </div>

                    {sendError && (
                      <p className="text-xs text-destructive text-center">{sendError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Request"}
                      {!loading && <Send size={16} />}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </FadeInSection>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Appointment;