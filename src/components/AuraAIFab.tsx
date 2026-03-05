import { useState, useEffect } from 'react';
import { Wand2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LeadModal } from './LeadModal';

export function AuraAIFab() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const location = useLocation();

    // Hide FAB if on the dedicated Aura AI page
    if (location.pathname === '/aura-ai') return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 lg:right-10 z-50 w-[300px] bg-white rounded-2xl shadow-2xl border border-secondary p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-playfair font-bold text-lg text-primary flex items-center gap-2">
                                <Wand2 className="text-secondary" size={20} /> Aura AI ✨
                            </h4>
                            <button onClick={() => setIsOpen(false)} className="text-darkGray hover:text-primary">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm font-inter text-darkGray/70 mb-6">
                            See your dream home before it's built. Get a 30-second AI render.
                        </p>
                        <div className="space-y-3">
                            <Link
                                to="/aura-ai"
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-secondary text-primary font-space font-bold uppercase tracking-widest text-[10px] py-3 rounded text-center block hover:bg-primary hover:text-white transition-colors"
                            >
                                Upload Sketch
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsLeadModalOpen(true);
                                }}
                                className="w-full border border-primary/20 text-primary font-space font-bold uppercase tracking-widest text-[10px] py-3 rounded text-center block hover:bg-primary/5 transition-colors"
                            >
                                Chat with Designer
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-[#B8960C] text-primary flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] transition-shadow"
            >
                <Wand2 size={28} className={isOpen ? 'text-primary' : 'text-primary'} />
                {/* Sparkle animation */}
                {!isOpen && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                )}
            </motion.button>
            <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
        </>
    );
}
