import { GitBranch } from "lucide-react";
import PixelLogo from "./PixelLogo";
import { useTheme } from "next-themes";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <PixelLogo size={24} />
            <span className="font-heading text-sm text-muted-foreground">
              © 2026 ysurf.dev
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Ye-Thihaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GitBranch size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
