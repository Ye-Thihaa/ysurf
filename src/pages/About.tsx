import { Download, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FadeInSection from "@/components/FadeInSection";
import ScrollProgress from "@/components/ScrollProgress";

const journey = [
  {
    role: "Complete Beginner",
    place: "Junior Year of College",
    period: "April 2025",
    highlights: [
      "Joined with zero prior knowledge of UI development",
      "Started learning HTML and JavaScript fundamentals",
      "Followed guided tutorials and small practice exercises",
    ],
    tech: ["Next.js", "Ant Design", "Firebase"],
    color: "#e05c5c",
  },
  {
    role: "Portfolio Creator",
    place: "Personal Project",
    period: "May 2025",
    highlights: [
      "Discovered Astro JS and built first portfolio website",
      "Learned static-site generation and component-based structure",
      "Deployed to Vercel and shared with peers",
    ],
    tech: ["Astro", "Markdown", "Tailwind CSS", "Vercel"],
    color: "#e0a85c",
  },
  {
    role: "React UI Builder",
    place: "Personal Projects",
    period: "June 2025",
    highlights: [
      "Started writing UI components with React",
      "Built mini-projects to practice state and props",
      "Experimented with Vite and modern tooling",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Git"],
    color: "#5cb8e0",
  },
];

const About = () => {
  return (
    <Layout>
      <ScrollProgress />

      {/* ── About Me ──────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeInSection>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              About Me
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed mb-4">
              I'm a passionate frontend developer with expertise in React, Next.js,
              and modern web technologies. I love creating beautiful, functional,
              and user-friendly digital experiences.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── My Story ─────────────────────────────────────────────────────── */}
      <section className="section-alt py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeInSection>
            <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              My Story
            </h2>
            <p className="text-sm text-muted-foreground mb-12">
              How I went from zero to building UIs in 2025
            </p>
          </FadeInSection>

          {/* ── DESKTOP: branching tree (hidden on mobile) ── */}
          <div className="relative hidden md:block">
            {/* Center spine */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                width: "1px",
                background: "hsl(var(--border))",
              }}
            />

            {/* Top cap dot */}
            <div
              className="absolute"
              style={{
                left: "50%",
                top: 0,
                transform: "translate(-50%, -50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "hsl(var(--foreground))",
              }}
            />

            <div className="space-y-0">
              {journey.map((item, i) => {
                const isLeft = i % 2 !== 0;
                return (
                  <FadeInSection key={item.period} delay={i * 150}>
                    <div className="relative flex items-center" style={{ minHeight: 120 }}>
                      {/* Colored dot on spine */}
                      <div
                        className="absolute z-10 rounded-full border-2 border-background"
                        style={{
                          left: "50%",
                          transform: "translate(-50%, 0)",
                          width: 16,
                          height: 16,
                          background: item.color,
                          boxShadow: `0 0 0 3px ${item.color}33`,
                        }}
                      />

                      {isLeft ? (
                        <>
                          <div className="w-[calc(50%-32px)] pr-4 flex justify-end">
                            <TimelineCard item={item} />
                          </div>
                          <div
                            className="absolute"
                            style={{
                              right: "calc(50% + 8px)",
                              width: 24,
                              height: 1,
                              background: item.color,
                              opacity: 0.6,
                            }}
                          />
                          <div className="w-[calc(50%+32px)]" />
                        </>
                      ) : (
                        <>
                          <div className="w-[calc(50%+32px)]" />
                          <div
                            className="absolute"
                            style={{
                              left: "calc(50% + 8px)",
                              width: 24,
                              height: 1,
                              background: item.color,
                              opacity: 0.6,
                            }}
                          />
                          <div className="w-[calc(50%-32px)] pl-4 flex justify-start">
                            <TimelineCard item={item} />
                          </div>
                        </>
                      )}
                    </div>
                  </FadeInSection>
                );
              })}
            </div>

            {/* Bottom pulsing dot */}
            <FadeInSection delay={500}>
              <div className="relative flex flex-col items-center pt-4 pb-2">
                <div
                  className="rounded-full border-2 border-background animate-pulse"
                  style={{ width: 12, height: 12, background: "hsl(var(--foreground))" }}
                />
                <span className="text-xs font-mono text-muted-foreground mt-2">
                  Building · 2025
                </span>
              </div>
            </FadeInSection>
          </div>

          {/* ── MOBILE: plain prose paragraphs (hidden on md+) ── */}
          <div className="md:hidden space-y-6">
            {journey.map((item, i) => (
              <FadeInSection key={item.period} delay={i * 150}>
                <div>
                  <span className="text-xs font-mono" style={{ color: item.color }}>
                    {item.period}
                  </span>
                  <p className="text-sm text-foreground/80 leading-relaxed mt-1">
                    <span className="font-semibold text-foreground">{item.role}</span> —{" "}
                    {item.highlights.join(" ")}
                  </p>
                </div>
              </FadeInSection>
            ))}
            <FadeInSection delay={500}>
              <p className="text-xs font-mono text-muted-foreground">Building · 2025</p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Resume ────────────────────────────────────────────────────────── */}
      <section className="section-alt py-16">
        <div className="container mx-auto px-4 max-w-3xl flex justify-center">
          <FadeInSection>
            <Button size="lg" asChild>
              <a href="/resume.pdf" download="Ye-Thihaa-Resume.pdf">
                <Download size={16} className="mr-2" /> Download Resume
              </a>
            </Button>
          </FadeInSection>
        </div>
      </section>
    </Layout>
  );
};

/* ── Shared card component (used only in desktop layout) ── */
const TimelineCard = ({ item }: { item: (typeof journey)[0] }) => (
  <div className="bg-card border border-border rounded-lg p-4 max-w-[240px] w-full hover:border-foreground/20 transition-colors">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs font-mono" style={{ color: item.color }}>
        {item.period}
      </span>
    </div>
    <h3 className="font-heading font-semibold text-foreground text-sm mb-0.5">{item.role}</h3>
    <p className="text-xs text-muted-foreground mb-3">{item.place}</p>
    <ul className="space-y-1 mb-3">
      {item.highlights.map((h) => (
        <li key={h} className="text-xs text-foreground/70 flex items-start gap-1.5">
          <span className="mt-px" style={{ color: item.color }}>
            ·
          </span>
          {h}
        </li>
      ))}
    </ul>
    <div className="flex flex-wrap gap-1">
      {item.tech.map((t) => (
        <span
          key={t}
          className="text-xs font-mono px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-sm"
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

export default About;