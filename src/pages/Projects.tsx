import Layout from "@/components/Layout";
import AnimatedProjectCard from "@/components/AnimatedProjectCard";
import FadeInSection from "@/components/FadeInSection";
import ScrollProgress from "@/components/ScrollProgress";
import { Helmet } from "react-helmet-async";

const projects = [
  {
    title: "KeyBurm",
    description:
      "Typing practice website supporting Myanmar & English language modes, with multiple test modes including time-based and word-based challenges.",
    tech: ["React", "TypeScript", "TailwindCSS"],
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
    tech: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/Ye-Thihaa/Exam-Rooms.git",
    demo: "https://exam-rooms.vercel.app/",
  },
];

const Projects = () => {
  return (
    <Layout>
      <Helmet>
  <title>Projects | Ysurf</title>
  <meta name="description" content="Projects by Ysurf — KeyBurm, Fusion 11, Exam Room Generator, and more built with React, TypeScript, and Node.js." />
  <link rel="canonical" href="https://ysurf.online/projects" />
</Helmet>
      <ScrollProgress />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Projects
            </h1>
            <p className="text-muted-foreground mb-12 max-w-lg">
              A selection of projects I've built — each solving a real problem with
              thoughtful design and clean code.
            </p>
          </FadeInSection>

          {/* Equal-height grid — AnimatedProjectCard uses flex-col + flex-1 internally */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {projects.map((project, i) => (
              <AnimatedProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tech={project.tech}
                github={project.github}
                demo={project.demo}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;