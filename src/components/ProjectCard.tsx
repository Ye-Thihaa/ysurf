import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  problem: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

const ProjectCard = ({
  title,
  description,
  problem,
  techStack,
  githubUrl,
  liveUrl,
  imageUrl,
}: ProjectCardProps) => {
  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all duration-300">
      {imageUrl && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div>
          <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1">Problem Solved</p>
          <p className="text-sm text-foreground/80">{problem}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono px-2 py-1 bg-secondary text-secondary-foreground rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          {githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={14} className="mr-1.5" /> Code
              </a>
            </Button>
          )}
          {liveUrl && (
            <Button size="sm" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} className="mr-1.5" /> Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
