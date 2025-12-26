
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

interface ContactProps {
  onNav: (view: any) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNav }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', subject: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Mock API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '', subject: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-slate-50 border-b border-slate-100 py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center animate-fade-in">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
             Get In Touch
           </div>
           <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
             We're Here to <br />
             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Support You</span>
           </h1>
           <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
             Have questions about uploading, downloading, or account issues? Our team is available 24/7 to assist the student community.
           </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side: Info & Map */}
          <div className="space-y-10 animate-fade-in">
             <div className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900">Contact Information</h2>
                <p className="text-slate-500 font-medium">Reach out through any of these channels for quick support.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContactInfoCard 
                    icon={<Phone className="h-6 w-6 text-blue-600" />}
                    title="Call Support"
                    detail="+91 94941 02348"
                    link="tel:+919494102348"
                  />
                  <ContactInfoCard 
                    icon={<Mail className="h-6 w-6 text-indigo-600" />}
                    title="Email Us"
                    detail="info@learnnewthings.fun"
                    link="mailto:info@learnnewthings.fun"
                  />
                  <ContactInfoCard 
                    icon={<MapPin className="h-6 w-6 text-emerald-600" />}
                    title="Headquarters"
                    detail="Guntur, Andhra Pradesh, India"
                  />
                  <ContactInfoCard 
                    icon={<Clock className="h-6 w-6 text-amber-600" />}
                    title="Office Hours"
                    detail="10:00 AM - 06:00 PM (IST)"
                  />
                </div>
             </div>

             {/* Map Embed */}
             <div className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl h-[350px] relative group">
                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122432.32743813898!2d80.34789856519213!3d16.30656096531818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755cb1787785%3A0x9f7999dd90f87584!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1715850000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NotesNation Location - Guntur"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 z-20 shadow-lg animate-float">
                   <div className="flex items-center">
                      <div className="p-2 bg-blue-600 rounded-xl mr-3">
                         <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-black text-slate-800 tracking-tight">Visit us in Guntur, AP</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
             <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-2xl relative z-10">
                <div className="mb-10">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-50">
                     <MessageSquare className="h-8 w-8" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 mb-2">Send a Message</h3>
                   <p className="text-slate-500 font-medium">We usually respond within 2-4 business hours.</p>
                </div>

                {formStatus === 'success' ? (
                  <div className="py-12 text-center animate-pop-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h4>
                    <p className="text-slate-500 mb-8 font-medium">Thank you for reaching out. Our support team will contact you shortly.</p>
                    <Button variant="outline" onClick={() => setFormStatus('idle')}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                            required
                            type="email" 
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                       <input 
                         required
                         type="text" 
                         placeholder="How can we help?"
                         value={formData.subject}
                         onChange={e => setFormData({...formData, subject: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                       <textarea 
                         required
                         rows={4}
                         placeholder="Tell us about your concern..."
                         value={formData.message}
                         onChange={e => setFormData({...formData, message: e.target.value})}
                         className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                       ></textarea>
                    </div>

                    <Button fullWidth size="lg" type="submit" isLoading={formStatus === 'submitting'} className="py-5 text-lg font-black tracking-wide shadow-xl shadow-blue-200 group">
                      Send Message <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </form>
                )}
             </div>

             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Social Support Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h3 className="text-3xl font-black text-slate-900 mb-12">Connect via Social Media</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <SocialContactCard 
                name="Instagram" 
                detail="@learnnewthings_25" 
                href="https://www.instagram.com/learnnewthings_25"
                color="hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200"
              />
              <SocialContactCard 
                name="Telegram" 
                detail="Community Channel" 
                href="https://t.me/learnnewthingsofficial"
                color="hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200"
              />
              <SocialContactCard 
                name="YouTube" 
                detail="Learn New Things" 
                href="https://www.youtube.com/@rukeshbabugantla"
                color="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              />
              <SocialContactCard 
                name="WhatsApp" 
                detail="Instant Support" 
                href="https://wa.me/919494102348"
                color="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
              />
           </div>
        </div>
      </section>
    </div>
  );
};

const ContactInfoCard = ({ icon, title, detail, link }: { icon: React.ReactNode, title: string, detail: string, link?: string }) => {
  const content = (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:border-blue-100 group">
       <div className="p-3 bg-slate-50 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform">{icon}</div>
       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
       <p className="text-slate-800 font-bold tracking-tight">{detail}</p>
    </div>
  );

  return link ? <a href={link} className="block">{content}</a> : content;
};

const SocialContactCard = ({ name, detail, href, color }: { name: string, detail: string, href: string, color: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`p-8 bg-white border border-slate-100 rounded-[2.5rem] transition-all flex flex-col items-center group ${color}`}
  >
     <h4 className="font-black text-slate-900 mb-1 group-hover:text-inherit">{name}</h4>
     <p className="text-xs text-slate-400 font-medium">{detail}</p>
     <Zap className="h-4 w-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);
