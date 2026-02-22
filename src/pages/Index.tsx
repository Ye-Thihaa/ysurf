import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FadeInSection from "@/components/FadeInSection";
import heroBg from "@/assets/hero-bg.jpg";
import AnimatedHeroTitle from "@/components/AnimatedHeroTitle";
import AnimatedTechPill from "@/components/AnimatedTechPill";
import AnimatedProjectCard from "@/components/AnimatedProjectCard";
import TypewriterText from "@/components/TypeWriterText";
import ShimmerText from "@/components/ShimmerText";
import ScrollProgress from "@/components/ScrollProgress";

const techStack = [
  "React", "TypeScript", "Node.js", "Laravel",
  "PostgreSQL", "Supabase", "TailwindCSS", "Docker", "AWS", "GraphQL",
];

const featuredProjects = [
  {
    title: "KeyBurm",
    description:
      "Typing practice website supporting Myanmar & English language modes, with multiple test modes including time-based and word-based challenges.",
    tech: ["React", "TypeScript", "TailwindCSS", "Node.js"],
    github: "https://github.com/Ye-Thihaa/KeyBurm.git",
    demo: "https://key-burm.vercel.app/",
  },
  {
    title: "Fusion 11",
    description:
      "Myanmar's Next Energy Step — explains SNPP with an interactive Myanmar map, energy usage calculator, and an integrated AI chatbot.",
    tech: ["React", "TypeScript", "AI / LLM"],
    github: "https://github.com/Ye-Thihaa/fusion-11.git",
    demo: "https://fusion-11.vercel.app/",
  },
  {
    title: "Exam Room Generator",
    description:
      "University admin dashboard for automated exam room assignment, seating plan generation, and teacher scheduling.",
    tech: ["React", "Shadcn UI", "Supabase"],
    github: "https://github.com/Ye-Thihaa/Exam-Rooms.git",
    demo: "https://exam-rooms.vercel.app/",
  },
];

const Index = () => {
  return (
    <Layout>
      <ScrollProgress />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedHeroTitle text="Ysurf" />
          <p className="font-mono text-sm md:text-base text-muted-foreground mt-3">
            <TypewriterText text="Software Engineer · Full Stack Developer" delay={700} speed={42} />
          </p>
          <FadeInSection delay={300}>
            <p className="text-base md:text-lg text-foreground/70 mt-6 max-w-xl leading-relaxed">
              I architect scalable systems and craft precise software solutions.
              From database design to pixel-perfect interfaces — I solve problems that matter.
            </p>
          </FadeInSection>
          <FadeInSection delay={400}>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" asChild>
                <Link to="/projects">View Projects <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/appointment">Hire Me</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section className="section-alt py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="flex items-center gap-2 mb-8">
              <Code2 size={18} className="text-muted-foreground" />
              <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Tech Stack
              </h2>
            </div>
          </FadeInSection>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, i) => (
              <FadeInSection key={tech} delay={i * 50}>
                <AnimatedTechPill label={tech} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              Featured Work
            </h2>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <AnimatedProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tech={project.tech}
                github={project.github}
                demo={project.demo}
                delay={i * 120}
              />
            ))}
          </div>
          <FadeInSection delay={300}>
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link to="/projects">View All Projects <ArrowRight size={14} className="ml-2" /></Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <ShimmerText
              text="Let's build something exceptional."
              tag="h2"
              className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4"
            />
            <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">
              Looking for a software engineer who writes clean code and delivers results?
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/appointment">Book a Consultation</Link>
            </Button>
          </FadeInSection>
        </div>
      </section>
    </Layout>
  );
};

export default Index;