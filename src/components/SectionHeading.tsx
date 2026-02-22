import AnimatedSection from "./AnimatedSection";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeading = ({ label, title, description, align = "left" }: SectionHeadingProps) => (
  <AnimatedSection className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
    {label && (
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3 block">
        {label}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
      {title}
    </h2>
    {description && (
      <p className={`mt-4 text-muted-foreground text-lg leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
        {description}
      </p>
    )}
  </AnimatedSection>
);

export default SectionHeading;
