
import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Send, 
  Phone, 
  BookOpen, 
  ArrowRight, 
  ArrowUp,
  Heart,
  ShieldCheck,
  FileLock
} from 'lucide-react';

interface FooterProps {
  onNav: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNav }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-900/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">NotesNation</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India's premier student-led platform for verified academic notes. Empowering students across all states with quality resources.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Browse', 'Requests', 'Leaderboard', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => onNav(item.toLowerCase() as any)}
                    className="flex items-center hover:text-blue-500 transition-colors group text-left"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-sm flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> Legal & Policy
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Privacy Policy', view: 'privacy' },
                { label: 'Terms of Service', view: 'terms' },
                { label: 'Disclaimer', view: 'disclaimer' },
                { label: 'Cookie Policy', view: 'cookies' }
              ].map((item) => (
                <li key={item.view}>
                  <button 
                    onClick={() => onNav(item.view as any)}
                    className="flex items-center hover:text-blue-500 transition-colors group text-left"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-sm">Connect With Us</h4>
            <div className="space-y-4">
              <a href="tel:9494102348" className="flex items-center group hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-600 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Call Support</p>
                  <p className="font-bold">+91 94941 02348</p>
                </div>
              </a>
              <div className="flex space-x-3 pt-2">
                <SocialIcon href="https://www.facebook.com/learnnewthings25" icon={<Facebook />} color="hover:bg-blue-600" />
                <SocialIcon href="https://www.instagram.com/learnnewthings_25" icon={<Instagram />} color="hover:bg-pink-600" />
                <SocialIcon href="https://www.youtube.com/@rukeshbabugantla" icon={<Youtube />} color="hover:bg-red-600" />
                <SocialIcon href="https://t.me/learnnewthingsofficial" icon={<Send />} color="hover:bg-sky-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left flex items-center">
            <FileLock className="h-3 w-3 mr-2" />
            © 2026 NotesNation. Ad-ready legal compliance enabled. Managed by <span className="text-slate-300 font-bold ml-1">Learn New Things</span>.
          </p>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[60] bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-blue-700 active:scale-90 ${
          isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to Top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </footer>
  );
};

const SocialIcon = ({ href, icon, color }: { href: string; icon: React.ReactNode; color: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 transition-all hover:text-white hover:-translate-y-1 ${color}`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' } as any)}
  </a>
);