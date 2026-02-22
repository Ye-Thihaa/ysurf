import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FadeInSection from "@/components/FadeInSection";
import ScrollProgress from "@/components/ScrollProgress";
import { animate, stagger } from "animejs";

// ── Theme hook ────────────────────────────────────────────────────────────────
const useIsDark = () => {
  const [isDark, setIsDark] = useState(
    () => typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
};

// ── Floating orb / blob 3D-ish canvas decoration ──────────────────────────────
const WebOrb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const RINGS = 12;
    const SEGS = 24;
    const R = Math.min(W, H) * 0.38;
    let rotX = 0;
    let rotY = 0;
    let rafId: number;
    let mouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W - 0.5) * 0.6;
      mouse.y = ((e.clientY - rect.top) / H - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMouseMove);

    const project = (x: number, y: number, z: number) => {
      const fov = 600;
      const scale = fov / (fov + z);
      return { x: W / 2 + x * scale, y: H / 2 + y * scale, scale };
    };

    const rotate = (x: number, y: number, z: number, rx: number, ry: number) => {
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      let nx = x * cosY + z * sinY;
      let nz = -x * sinY + z * cosY;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      let ny = y * cosX - nz * sinX;
      nz = y * sinX + nz * cosX;
      return { x: nx, y: ny, z: nz };
    };

    // Use dark/light-aware color
    // isDark → white lines; light → dark lines
    const lineColor = isDark ? "180,180,200" : "40,40,60";

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      rotY += 0.004 + mouse.x * 0.01;
      rotX += 0.001 + mouse.y * 0.005;

      for (let ri = 1; ri < RINGS; ri++) {
        const phi = (ri / RINGS) * Math.PI;
        const ringR = R * Math.sin(phi);
        const ringY = -R * Math.cos(phi);
        ctx.beginPath();
        for (let si = 0; si <= SEGS; si++) {
          const theta = (si / SEGS) * Math.PI * 2;
          const rx3 = ringR * Math.cos(theta);
          const rz3 = ringR * Math.sin(theta);
          const r = rotate(rx3, ringY, rz3, rotX, rotY);
          const p = project(r.x, r.y, r.z);
          if (si === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(${lineColor},${0.06 + 0.12 * ((ri % 3 === 0) ? 1 : 0.4)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      for (let si = 0; si < SEGS; si++) {
        const theta = (si / SEGS) * Math.PI * 2;
        ctx.beginPath();
        for (let ri = 0; ri <= RINGS; ri++) {
          const phi = (ri / RINGS) * Math.PI;
          const x3 = R * Math.sin(phi) * Math.cos(theta);
          const y3 = -R * Math.cos(phi);
          const z3 = R * Math.sin(phi) * Math.sin(theta);
          const r = rotate(x3, y3, z3, rotX, rotY);
          const p = project(r.x, r.y, r.z);
          if (ri === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(${lineColor},${si % 4 === 0 ? 0.18 : 0.06})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, R * 0.5);
      grad.addColorStop(0, isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(W/2, H/2, R * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, [isDark]); // re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  );
};

// ── Animated service card ──────────────────────────────────────────────────────
interface ServiceItemProps {
  index: number;
  title: string;
  description: string;
  deliverables: string[];
}

const ServiceItem = ({ index, title, description, deliverables }: ServiceItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const animatedIn = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animatedIn.current) {
        animatedIn.current = true;
        animate(el, {
          opacity: [0, 1],
          translateY: [32, 0],
          duration: 600,
          delay: index * 80,
          ease: "spring(1, 70, 12, 0)",
        });

        const items = el.querySelectorAll(".deliverable-item");
        animate(Array.from(items), {
          opacity: [0, 1],
          translateX: [-12, 0],
          duration: 400,
          delay: stagger(60, { start: index * 80 + 300 }),
          ease: "outQuad",
        });

        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    animate(el, { rotateY: x * 5, rotateX: -y * 5, scale: 1.015, duration: 200, ease: "outQuad" });
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    animate(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 500, ease: "spring(1, 60, 10, 0)" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform, opacity", transformStyle: "preserve-3d" }}
      className="bg-card border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors duration-300"
    >
      <span className="text-xs font-mono text-muted-foreground/50 mb-3 block">
        0{index + 1}
      </span>
      <h3 className="font-heading font-semibold text-foreground text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {deliverables.map((d) => (
          <li key={d} className="deliverable-item flex items-start gap-2 text-sm text-foreground/70" style={{ opacity: 0 }}>
            <span className="text-muted-foreground mt-0.5">→</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── Services data ─────────────────────────────────────────────────────────────
const services = [
  {
    title: "UI / UX Design",
    description:
      "Pixel-perfect interfaces designed with purpose. From wireframes to high-fidelity mockups with a focus on usability and visual clarity.",
    deliverables: [
      "Wireframes & prototypes",
      "Component design systems",
      "Responsive layouts for all screen sizes",
      "Accessibility-first design",
    ],
  },
  {
    title: "Frontend Development",
    description:
      "Modern, performant frontends built with React and Next.js. Clean code, smooth animations, and fast load times.",
    deliverables: [
      "React / Next.js applications",
      "Interactive animations with anime.js & Three.js",
      "Performance optimization & Core Web Vitals",
      "Cross-browser compatibility",
    ],
  },
  {
    title: "Responsive Web Development",
    description:
      "Websites that look great and work flawlessly on every device — from mobile to ultrawide desktop.",
    deliverables: [
      "Mobile-first development",
      "Tailwind CSS styling systems",
      "Fluid typography & spacing",
      "Touch-friendly interactions",
    ],
  },
  {
    title: "Web Deployment & Optimization",
    description:
      "Get your site live and running fast. From CI/CD setup to hosting, domain, and performance tuning.",
    deliverables: [
      "Vercel / Netlify deployment",
      "Custom domain & SSL setup",
      "Image & asset optimization",
      "Lighthouse score improvement",
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
const Services = () => {
  return (
    <Layout>
      <ScrollProgress />

      {/* ── Hero with 3D orb ───────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{ minHeight: 420 }}>
        <WebOrb />
        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
              What I do
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Web Design &<br />Development
            </h1>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              End-to-end web experiences — from concept and design through to a
              polished, deployed product. Every pixel intentional, every interaction smooth.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── Service cards ──────────────────────────────────────────────────── */}
      <section className="section-alt py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <ServiceItem key={service.title} index={i} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Ready to start a project?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Let's discuss your requirements and find the right approach for your goals.
            </p>
            <Button size="lg" asChild>
              <Link to="/appointment">Book a Consultation</Link>
            </Button>
          </FadeInSection>
        </div>
      </section>
    </Layout>
  );
};

export default Services;