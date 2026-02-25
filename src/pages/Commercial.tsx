import { motion } from 'framer-motion';
import { ShoppingBag, Utensils, Hotel, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

const Commercial = () => {
    const categories = [
        { title: "Retail Stores", desc: "Dynamic environments designed to maximize footfall and brand engagement.", icon: <ShoppingBag />, img: "images/services/commercial-projects/img(1).webp" },
        { title: "Restaurants & Cafes", desc: "Atmospheric spaces crafted for unforgettable culinary experiences.", icon: <Utensils />, img: "images/services/commercial-projects/img(18).webp" },
        { title: "Hospitality & Clinics", desc: "Functional yet welcoming interiors for high-traffic public spaces.", icon: <Hotel />, img: "images/services/commercial-projects/img(26).webp" },
    ];

    const stats = [
        { label: "ROI Focused Design", val: "100%", icon: <TrendingUp /> },
        { label: "Engagement Growth", val: "+40%", icon: <Target /> },
        { label: "Execution Speed", val: "Fast", icon: <Zap /> },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/commercial-projects/img(1).webp" className="w-full h-full object-cover" alt="Commercial Interiors" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white py-24 md:py-32">
                    <div className="max-w-4xl">
                        <motion.h4
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6 italic"
                        >
                            Commercial Excellence
                        </motion.h4>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-8xl font-playfair font-bold mb-8 leading-[1.1]"
                        >
                            Spaces That <br className="hidden sm:block" /><span className="text-secondary italic">Drive Business.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/50 font-inter leading-relaxed max-w-2xl"
                        >
                            Strategic interior designs for retail, hospitality, and public spaces in Bangalore. We don't just design; we create platforms for business growth.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 mt-12"
                        >
                            <button className="btn-primary w-full sm:w-auto">Request Portfolio</button>
                            <button className="btn-outline w-full sm:w-auto">View Process</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ROI Stats */}
            <section className="py-12 md:py-24 bg-warmWhite border-b border-black/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center p-8 md:p-12 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem]"
                            >
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary/10 text-secondary flex items-center justify-center rounded-2xl mb-6">
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-2 italic tracking-tighter tabular-nums">{stat.val}</h3>
                                <p className="text-[10px] md:text-xs font-space font-bold uppercase tracking-[0.2em] text-darkGray/40">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commercial Categories */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary mb-8"
                        >
                            Versatile Commercial Solutions.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-darkGray/60 font-inter leading-relaxed text-base md:text-xl italic px-4"
                        >
                            We specialize in creating inviting environments that reflect your brand's unique identity.
                        </motion.p>
                    </div>

                    <div className="space-y-24 md:space-y-32">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row gap-10 md:gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden group rounded-[2.5rem] shadow-2xl">
                                    <img src={cat.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.title} />
                                </div>
                                <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 px-2 md:px-0">
                                    <div className="w-16 h-1 bg-secondary"></div>
                                    <h3 className="text-3xl md:text-5xl font-playfair font-bold text-primary italic leading-tight">{cat.title}</h3>
                                    <p className="text-darkGray/60 text-base md:text-lg font-inter leading-relaxed">{cat.desc}</p>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
                                        {['Strategic Space Planning', 'Brand Identity Integration', 'Custom Fixtures', 'High-Traffic Durability'].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-[10px] md:text-xs font-space font-bold uppercase tracking-widest text-primary">
                                                <div className="w-2 h-2 bg-secondary rounded-full"></div> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Commercial;
