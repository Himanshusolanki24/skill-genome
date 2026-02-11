import { Link } from "react-router-dom";
import { Dna, Github, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Interview", href: "/interview" },
    { label: "Build Genome", href: "/build" },
    { label: "Growth Roadmap", href: "/growth-roadmap" },
    { label: "Skill Genome Report", href: "/skill-genome-report" },
    { label: "Analytics", href: "/analytics" },
  ],
  resources: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Daily Tasks", href: "/tasks" },
  ],
  company: [
    { label: "About", href: "/about" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/mayurk-prog/skill-genome", label: "GitHub" },
  { icon: Mail, href: "mailto:contact@skillgenome.dev", label: "Email" },
];

export const Footer = () => {
  return (
    <footer className="bg-genome-darker border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <Dna className="w-8 h-8 text-primary" />
              <span className="font-display font-bold text-xl text-foreground">
                Skill<span className="text-primary">Genome</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Visualize your skills, identify weaknesses, and evolve daily with
              AI-powered micro-tasks designed for continuous growth.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} GyaniX. All rights reserved.
          </p>
          {/* <p className="text-muted-foreground text-sm">
            Built with 💗 for continuous learners
          </p> */}
        </div>
      </div>
    </footer>
  );
};
