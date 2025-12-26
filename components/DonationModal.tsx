
import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, user }) => {
  const [amount, setAmount] = useState<number>(51);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDonate = () => {
    if (amount < 1) return;
    setIsProcessing(true);

    const options = {
      key: 'rzp_live_RpYul4QtLuUlWk',
      amount: amount * 100,
      currency: 'INR',
      name: 'NotesNation Support',
      description: 'Supporting Free Education',
      image: 'https://yt3.googleusercontent.com/2xTXlSO7Wo-5IuIWw3TfvrnbUjFtUrl8LuSn8YMg5J-3gJp7P8dfUqP8_Kesl58MiA3-zbHNJ0Y=s900-c-k-c0x00ffffff-no-rj',
      handler: function(response: any) {
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      },
      prefill: {
        name: user?.name || '',
        contact: user?.mobileNumber || '',
        email: user?.email || ''
      },
      theme: { color: '#2563eb' },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      setIsProcessing(false);
      alert("Payment gateway unavailable.");
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl animate-pop-in overflow-hidden p-8 md:p-10">
        {isSuccess ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-500 font-medium">Your contribution helps keep the nation learning.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Support Mission</h3>
                <p className="text-sm text-slate-500 font-medium">Keep NotesNation free forever</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[21, 51, 101, 201, 501, 1001].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all border-2 ${
                    amount === val 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600 shrink-0" />
              <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                Your support covers server costs for thousands of students in rural areas.
              </p>
            </div>

            <Button 
              fullWidth 
              size="lg" 
              onClick={handleDonate} 
              isLoading={isProcessing} 
              className="py-5 font-black rounded-2xl shadow-xl shadow-blue-100"
            >
              Pay ₹{amount}
            </Button>
            
            <div className="mt-6 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <ShieldCheck className="h-3 w-3 mr-2 text-emerald-500" /> Secure via Razorpay
            </div>
          </>
        )}
      </div>
    </div>
  );
};
