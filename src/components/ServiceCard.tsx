import { type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverables: string[];
}

const ServiceCard = ({ icon: Icon, title, description, deliverables }: ServiceCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-foreground/20 transition-all duration-300 group">
      <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={18} className="text-primary-foreground" />
      </div>
      <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
      <ul className="space-y-1.5">
        {deliverables.map((item) => (
          <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-foreground mt-0.5">→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;
