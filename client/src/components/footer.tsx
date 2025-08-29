import { motion } from "framer-motion";
import { Truck, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const quickLinks = [
  { name: "Menu", href: "#menu" },
  { name: "Find Truck", href: "#locator" },
  { name: "Loyalty Program", href: "#loyalty" },
  { name: "Nutrition Info", href: "#nutrition" },
];

const supportLinks = [
  { name: "Help Center", href: "#help" },
  { name: "Contact Us", href: "#contact" },
  { name: "Privacy Policy", href: "#privacy" },
  { name: "Terms of Service", href: "#terms" },
];

const socialLinks = [
  { 
    name: "Instagram", 
    icon: Instagram, 
    href: "https://instagram.com/hamshark",
    color: "hover:text-pink-400" 
  },
  { 
    name: "Facebook", 
    icon: Facebook, 
    href: "https://facebook.com/hamshark",
    color: "hover:text-blue-400" 
  },
  { 
    name: "Twitter", 
    icon: Twitter, 
    href: "https://twitter.com/hamshark",
    color: "hover:text-sky-400" 
  },
  { 
    name: "YouTube", 
    icon: Youtube, 
    href: "https://youtube.com/hamshark",
    color: "hover:text-red-400" 
  },
];

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-card py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} data-testid="footer-brand">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="text-primary text-2xl" />
              <h3 className="text-2xl font-bold gradient-text">Hamshark</h3>
            </div>
            <p className="text-muted-foreground mb-4" data-testid="footer-tagline">
              Clean, homely food delivered fast from our mobile kitchens.
            </p>
            <div className="flex space-x-4" data-testid="footer-social-links">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-primary text-xl transition-all duration-300 ${social.color} hover:scale-110`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`social-link-${index}`}
                  >
                    <IconComponent />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} data-testid="footer-quick-links">
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`quick-link-${index}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants} data-testid="footer-support-links">
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`support-link-${index}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} data-testid="footer-contact">
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                <span data-testid="footer-phone">+91 9876543210</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                <span data-testid="footer-email">hello@hamshark.com</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span data-testid="footer-address">Mumbai, India</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border"
          data-testid="footer-newsletter"
        >
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold mb-2">Stay Updated</h4>
            <p className="text-muted-foreground mb-4">
              Get the latest updates on new dishes, truck locations, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="newsletter-email-input"
              />
              <button
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all ripple"
                data-testid="newsletter-subscribe-button"
              >
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-border mt-8 pt-8 text-center text-muted-foreground"
          data-testid="footer-copyright"
        >
          <p>&copy; 2024 Hamshark. All rights reserved. Made with ❤️ for food lovers.</p>
          <div className="flex items-center justify-center mt-2 text-sm">
            <span>Powered by clean energy</span>
            <span className="mx-2">•</span>
            <span>Committed to sustainability</span>
            <span className="mx-2">•</span>
            <span>Supporting local communities</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
