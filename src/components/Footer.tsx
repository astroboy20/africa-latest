import { Link } from "react-router-dom";
import { Mail, Youtube, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">
              Africa <span className="text-gold">Retold</span>
            </h3>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-6">
              Reclaiming the Story. Rewriting the Future.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://x.com/AfricaRetoldHQ" },
                { icon: Instagram, href: "https://www.instagram.com/africaretoldhq?utm_source=qr&igsh=OHhqaHFldm9vcnZx" },
                { icon: TikTokIcon, href: "https://www.tiktok.com/@africaretoldhq?_r=1&_t=ZS-9474Yk8MrRd" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "Our Approach", path: "/approach" },
                { label: "Programs", path: "/programs" },
                { label: "Learn", path: "/learn" },
                { label: "Quiz", path: "/quiz" },
                { label: "Media", path: "/media" },
                { label: "Get Involved", path: "/get-involved" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-secondary-foreground/70 hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
            <a
              href="mailto:hello@africaretold.com"
              className="flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-gold transition-colors"
            >
              <Mail size={16} />
              hello@africaretold.com
            </a>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-secondary-foreground/70 text-sm mb-4">
              Join our newsletter for updates on programs, events, and resources.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Input
                type="email"
                placeholder="Your email"
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40"
              />
              <Button variant="gold" size="sm">
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-secondary-foreground/10 text-center">
          <p className="text-secondary-foreground/50 text-sm">
            © {new Date().getFullYear()} Africa Retold. Reclaiming the Story. Rewriting the Future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
