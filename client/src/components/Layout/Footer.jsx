import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Github, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/shrashti-yadav-53b86627a/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/Shrashti-yadav/MarketHub", label: "GitHub" },
  ];

  return (
    <footer className="glass border-t border-[hsla(var(--glass-border))] mt-16">
      <div className="container mx-auto px-4 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Brand & Contact */}
          <div>
            <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
              MarketHub
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your trusted partner for online shopping. Discover amazing products with exceptional quality and service.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">support@markethub.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">India</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div className="flex flex-col justify-between gap-6">
            {/* All 3 links in one row */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="flex items-center gap-6">
                {footerLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 glass-card hover:glow-on-hover animate-smooth flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-primary" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[hsla(var(--glass-border))] text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 MarketHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
