import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { captureLead } from '../lib/apiClient';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    source?: string;
}

export function LeadModal({ isOpen, onClose, title = "Book Free Consult", subtitle = "Speak with our design experts today", source = "Web Lead" }: LeadModalProps) {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', time: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await captureLead({
                session_id: `lead-${Date.now()}`,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                city: 'Online',
                room_type: 'General Inquiry',
                preferred_date: formData.date,
                preferred_time: formData.time
            });
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: '', phone: '', email: '', date: '', time: '' });
            }, 3000);
        } catch (err) {
            console.error("Lead submission error:", err);
            alert("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-xl w-full shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-playfair font-bold text-primary">{title}</h3>
                                <p className="text-darkGray/60 text-xs font-space uppercase tracking-widest mt-2">{subtitle}</p>
                            </div>
                            <button onClick={onClose} className="text-darkGray/40 hover:text-primary transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="text-secondary" size={40} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-playfair font-bold text-primary mb-2">Request Received!</h4>
                                    <p className="text-darkGray/60 font-inter">An SMM Modular designer will contact you shortly.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-darkGray/50 font-space uppercase tracking-widest ml-1">Full Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-warmWhite border border-black/5 rounded-2xl p-4 text-primary outline-none focus:border-secondary transition-colors" placeholder="John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-darkGray/50 font-space uppercase tracking-widest ml-1">Phone Number</label>
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-warmWhite border border-black/5 rounded-2xl p-4 text-primary outline-none focus:border-secondary transition-colors" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-darkGray/50 font-space uppercase tracking-widest ml-1">Email Address</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-warmWhite border border-black/5 rounded-2xl p-4 text-primary outline-none focus:border-secondary transition-colors" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-darkGray/50 font-space uppercase tracking-widest ml-1">Preferred Date</label>
                                        <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-warmWhite border border-black/5 rounded-2xl p-4 text-primary outline-none focus:border-secondary transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-darkGray/50 font-space uppercase tracking-widest ml-1">Preferred Time</label>
                                        <input required type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full bg-warmWhite border border-black/5 rounded-2xl p-4 text-primary outline-none focus:border-secondary transition-colors" />
                                    </div>
                                </div>

                                <button type="submit" disabled={isSubmitting}
                                    className="w-full btn-primary py-5 mt-4 group">
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin mx-auto" size={20} />
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Schedule Consultation <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
