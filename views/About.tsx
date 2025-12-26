
import React from 'react';
import { 
  Info, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  Target, 
  Compass, 
  Users, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap,
  Quote,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';
import { Button } from '../components/Button';

interface AboutProps {
  onNav: (view: any) => void;
}

export const About: React.FC<AboutProps> = ({ onNav }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60 -ml-20 -mb-20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
            A Learn New Things Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Empowering Students Through <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shared Knowledge
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            NotesNation is a centralized platform designed to solve the scattered notes crisis for students in Andhra Pradesh and Telangana.
          </p>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-black text-slate-900 mb-6">Why NotesNation?</h2>
              <div className="space-y-6">
                {[
                  { title: "No More Scattered Notes", desc: "Say goodbye to notes lost in endless WhatsApp and Telegram threads.", icon: <HelpCircle className="text-amber-500" /> },
                  { title: "Verified Quality", desc: "We ensure content is relevant and of high quality through student-led reporting and admin checks.", icon: <ShieldCheck className="text-green-500" /> },
                  { title: "Easy Discovery", desc: "Find exactly what you need with course-wise and subject-wise categorization.", icon: <Compass className="text-blue-500" /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
              <Lightbulb className="h-20 w-20 text-blue-300 mb-6 opacity-50" />
              <h3 className="text-2xl font-bold mb-4">The Student Problem</h3>
              <p className="text-blue-100 leading-relaxed mb-6 italic">
                "Many students face problems like notes scattered across social media, no verification of content quality, and extreme difficulty in finding course-specific materials."
              </p>
              <div className="h-1 w-20 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What Students Can Do */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">What You Can Do</h2>
            <p className="text-slate-500">A community built by students, for students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Upload & Share", desc: "Give back to the community by sharing your own handwritten or digital notes.", icon: <Users /> },
              { title: "Access Quality Content", desc: "Download materials uploaded by top-performing seniors and peers.", icon: <CheckCircle2 /> },
              { title: "Save Time", desc: "Spend less time searching and more time understanding core concepts.", icon: <Heart /> }
            ].map((item, i) => (
              <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-200 hover:shadow-xl transition-all text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Covered */}
      <section className="py-20 bg-slate-900 text-white rounded-[4rem] mx-4 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-black mb-8">Courses Covered</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Engineering', 'Degree', 'Diploma', 'Medical'].map((course) => (
                <div key={course} className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-bold">{course}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-slate-400 text-sm italic">Covering all major branches like CSE, ECE, EEE, Mechanical, Civil, IT, and Allied Health.</p>
          </div>
          <div className="flex-1 flex justify-center">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse"></div>
                <GraduationCap className="h-48 w-48 text-white relative z-10" />
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100">
            <Target className="h-10 w-10 text-blue-600 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To create a trusted, student-driven notes ecosystem where knowledge is shared freely and learning becomes easier for everyone.
            </p>
          </div>
          <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100">
            <Compass className="h-10 w-10 text-indigo-600 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              To make NotesNation the go-to notes-sharing platform for AP & TS students, completely supported and guided by Learn New Things.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-40 -ml-32"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-end relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-2xl opacity-10 animate-pulse"></div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-8 border-white group">
                  <img 
                    src="https://res.cloudinary.com/dejcpd56d/image/upload/v1766515436/rukesh_babu_gantla_pic_lhn4rm.jpg" 
                    alt="Rukesh Babu Gantla - Founder of NotesNation" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block animate-bounce-in z-20">
                   <div className="flex items-center space-x-2 text-blue-600 font-black italic text-xs">
                     <Quote className="h-3 w-3 fill-current" />
                     <span>Knowledge is for everyone.</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 animate-fade-in text-center lg:text-left">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">Meet Our Founder</h2>
                <div className="h-1.5 w-20 bg-blue-600 rounded-full mb-6 mx-auto lg:mx-0"></div>
                <h3 className="text-2xl font-black text-blue-600 mb-4">Rukesh Babu Gantla</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  Rukesh Babu Gantla is the visionary behind NotesNation and the founder of <span className="text-blue-600 font-bold">Learn New Things</span>. 
                  Driven by the belief that high-quality education should be accessible to every student, regardless of their location or college, 
                  he established NotesNation to bridge the gap in academic resource availability across Andhra Pradesh and Telangana.
                </p>
                <p className="text-slate-500 text-lg leading-relaxed font-medium mt-4">
                  His mission extends beyond just a platform; it's about building a sustainable ecosystem where senior students mentor juniors through their shared materials, creating a culture of collective growth.
                </p>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <a href="https://www.youtube.com/@rukeshbabugantla" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                  <Youtube className="h-6 w-6" />
                </a>
                <Button variant="primary" className="rounded-2xl" onClick={() => onNav('contact')}>
                  Connect with Rukesh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Branding Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Powered by Learn New Things</h2>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed">
            NotesNation is proudly developed and managed under the Learn New Things ecosystem, ensuring quality-focused content and a student-friendly experience.
          </p>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 inline-block shadow-xl">
             <p className="text-slate-900 font-bold text-xl italic leading-relaxed">
               "When students help students, learning becomes powerful. <br />
               <span className="text-blue-600">That is the idea behind NotesNation.</span>"
             </p>
          </div>
        </div>
      </section>
    </div>
  );
};
