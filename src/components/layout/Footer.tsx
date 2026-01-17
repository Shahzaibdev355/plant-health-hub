import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              PlantGuard
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#mission"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Mission
            </a>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} PlantGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
