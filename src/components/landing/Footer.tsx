import { Logo } from "@/components/ui/Logo";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <div className="mt-4 flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">team@iamverse.com</span>
            </div>
            <div className="mt-6 flex gap-4">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Youtube} />
            </div>
          </div>

          <FooterColumn
            title="LINKS"
            links={["Courses", "Events"]}
          />

          <FooterColumn
            title="SUPPORT"
            links={["FAQs", "Contact Us"]}
          />

          <FooterColumn
            title="COMPANY"
            links={["About Us", "Our Team", "Contact Us"]}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2022 Copyright | Iamverse
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) => (
  <a
    href="#"
    className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
  >
    <Icon className="h-4 w-4" />
  </a>
);

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
