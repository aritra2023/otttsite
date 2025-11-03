import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";
import { Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I want to know more about your OTT subscriptions.");
    window.open(`https://wa.me/919433419022?text=${message}`, "_blank");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          <div className="lg:col-span-1">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              <span className="text-primary dark:text-white">SUB</span>
              <span className="text-white">FLIX</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Your trusted partner for premium OTT subscriptions at unbeatable prices. Join 5000+ happy customers across India.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>100% Genuine Subscriptions</span>
            </div>
            <div className="flex gap-3 mt-6">
              <a 
                href="https://wa.me/919433419022" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-primary hover:scale-110 p-3 rounded-full transition-all duration-300"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 hover:bg-primary hover:scale-110 p-3 rounded-full transition-all duration-300"
                data-testid="link-instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 hover:bg-primary hover:scale-110 p-3 rounded-full transition-all duration-300"
                data-testid="link-facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm">Call or WhatsApp</p>
                  <a href="tel:+919433419022" className="text-white font-semibold hover:text-primary transition-colors" data-testid="text-phone">
                    +91 94334 19022
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm">Email Us</p>
                  <a href="mailto:info@subflix.com" className="text-white font-semibold hover:text-primary transition-colors break-all" data-testid="text-email">
                    info@subflix.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm">Working Hours</p>
                  <p className="text-white font-semibold">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} <span className="text-primary font-semibold">SubFlix</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <button onClick={() => setLocation("/terms")} className="hover:text-primary transition-colors" data-testid="link-privacy">
                Privacy Policy
              </button>
              <span className="text-slate-600">|</span>
              <button onClick={() => setLocation("/terms")} className="hover:text-primary transition-colors" data-testid="link-refund">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
