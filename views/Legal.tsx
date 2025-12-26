
import React, { useEffect } from 'react';
import { Shield, ScrollText, AlertTriangle, Cookie, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../components/Button';

interface LegalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | 'cookies';
  onNav: (view: any) => void;
}

export const Legal: React.FC<LegalProps> = ({ type, onNav }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          icon: <Shield className="h-10 w-10 text-emerald-500" />,
          title: "Privacy Policy",
          updated: "December 1, 2024",
          sections: [
            {
              h: "1. Information We Collect",
              p: "At NotesNation, we collect your name and mobile number during registration to verify your identity as a student. Email addresses are optional. We also track the notes you upload and download to manage our reward points system."
            },
            {
              h: "2. How We Use Data",
              p: "Your data is primarily used to provide access to study materials, moderate content, and communicate platform updates. Your mobile number is visible only to the Super Admin for security and account recovery purposes."
            },
            {
              h: "3. Third-Party Services & Ads",
              p: "We may use third-party services like Google AdSense to serve advertisements. These providers may use cookies or similar technologies to serve ads based on your visit to this site and other sites on the Internet."
            },
            {
              h: "4. Data Security",
              p: "We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure."
            }
          ]
        };
      case 'terms':
        return {
          icon: <ScrollText className="h-10 w-10 text-blue-500" />,
          title: "Terms & Conditions",
          updated: "December 1, 2024",
          sections: [
            {
              h: "1. User Responsibility",
              p: "By uploading notes to NotesNation, you certify that you have the right to share the content. You are solely responsible for the accuracy and legality of the materials you upload."
            },
            {
              h: "2. Content Ownership",
              p: "While you retain ownership of your original notes, by uploading them, you grant NotesNation a worldwide license to host, store, and share the material for educational purposes."
            },
            {
              h: "3. Prohibited Conduct",
              p: "Users must not upload copyrighted textbooks, offensive materials, or spam. Violation of these terms will result in account suspension and deletion of content."
            },
            {
              h: "4. Account Registration",
              p: "You must provide accurate mobile information. Each student is allowed one account. Points manipulation or fake uploads are strictly prohibited."
            }
          ]
        };
      case 'disclaimer':
        return {
          icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
          title: "Disclaimer",
          updated: "December 1, 2024",
          sections: [
            {
              h: "1. Academic Accuracy",
              p: "NotesNation is a peer-to-peer sharing platform. The study materials provided are for reference only. We do not guarantee 100% accuracy or syllabus alignment of student-uploaded notes."
            },
            {
              h: "2. Examination Results",
              p: "We are not responsible for your academic performance or exam results. Please cross-verify all study material with official university textbooks and teacher instructions."
            },
            {
              h: "3. External Links",
              p: "The site may contain links to external websites (like advertisements) which are not operated by us. We have no control over the content and practices of these sites."
            }
          ]
        };
      case 'cookies':
        return {
          icon: <Cookie className="h-10 w-10 text-purple-500" />,
          title: "Cookie Policy",
          updated: "December 1, 2024",
          sections: [
            {
              h: "1. What are Cookies?",
              p: "Cookies are small text files stored on your device that help us provide a better browsing experience. We use them for authentication and analytics."
            },
            {
              h: "2. Essential Cookies",
              p: "These are necessary for the platform to function, such as keeping you logged in as you navigate between pages."
            },
            {
              h: "3. Advertising Cookies",
              p: "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites."
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-slate-50 border-b border-slate-100 py-16 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto px-4">
           <div className="inline-flex p-5 bg-white rounded-[2rem] shadow-xl mb-8 animate-float">
             {content.icon}
           </div>
           <h1 className="text-5xl font-black text-slate-900 mb-4">{content.title}</h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Last Updated: {content.updated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-12">
          {content.sections.map((section, i) => (
            <section key={i} className="group">
              <h2 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                {section.h}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium opacity-90">
                {section.p}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <Button variant="outline" size="lg" onClick={() => onNav('home')} className="rounded-2xl">
             <ArrowLeft className="h-5 w-5 mr-3" /> Back to Home
           </Button>
           <div className="flex items-center text-slate-400 font-bold text-sm bg-slate-50 px-6 py-4 rounded-2xl">
             <Heart className="h-4 w-4 mr-3 text-red-500 fill-red-500" />
             Protecting the Nation's knowledge
           </div>
        </div>
      </div>
    </div>
  );
};
