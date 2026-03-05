import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatCounterProps {
    value: number;
    label: string;
    suffix?: string;
    icon: React.ReactNode;
    duration?: number;
    isNew?: boolean;
}

export function StatCounter({ value, label, suffix = '', icon, duration = 2, isNew = false }: StatCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            if (start === end) return;

            const incrementTime = (duration * 1000) / end;
            // for large numbers, step appropriately
            const stepTime = Math.max(incrementTime, 20);
            const stepValue = Math.ceil(end / ((duration * 1000) / stepTime));

            const timer = setInterval(() => {
                start += stepValue;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, stepTime);

            return () => clearInterval(timer);
        }
    }, [value, duration, isInView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-6 bg-white border border-primary/5 shadow-lg relative group transition-transform hover:-translate-y-2"
        >
            {isNew && (
                <span className="absolute -top-3 right-4 bg-secondary text-primary text-[9px] font-space font-bold uppercase tracking-widest px-2 py-1 shadow-md">
                    New
                </span>
            )}
            <div className="w-16 h-16 rounded-full bg-warmWhite flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl md:text-5xl font-playfair font-bold text-primary tabular-nums">
                    {count}
                </span>
                <span className="text-xl md:text-2xl font-playfair font-bold text-secondary">
                    {suffix}
                </span>
            </div>
            <span className="text-xs md:text-sm font-space uppercase tracking-widest text-darkGray/60 font-bold text-center">
                {label}
            </span>
        </motion.div>
    );
}
