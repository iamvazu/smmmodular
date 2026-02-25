import { motion } from 'framer-motion';
import { Monitor, Briefcase, Coffee, ArrowRight, CheckCircle2, Layout, Zap } from 'lucide-react';

const Corporate = () => {
    const sections = [
        { title: "Office Space Planning", desc: "Optimizing flow and collaboration through intelligent floor plans.", icon: <Layout /> },
        { title: "Executive Suites", desc: "Sophisticated designs reflecting leadership and brand prestige.", icon: <Briefcase /> },
        { title: "Smart Workstations", desc: "Ergonomic and tech-integrated solutions for modern employees.", icon: <Monitor /> },
        { title: "Breakout Zones", desc: "Recreational spaces designed to foster creative thinking and relaxation.", icon: <Coffee /> },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/Corporate-Office.jpg" className="w-full h-full object-cover" alt="Corporate Interiors" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white py-24 md:py-32">
                    <div className="max-w-4xl">
                        <motion.h4
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6 italic"
                        >
                            Corporate Interiors
                        </motion.h4>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-8xl font-playfair font-bold mb-8 leading-[1.1]"
                        >
                            Workspaces <br className="hidden sm:block" />That <span className="text-secondary italic">Inspire.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/70 font-inter leading-relaxed max-w-xl"
                        >
                            Elevating Bangalore's corporate landscape with high-performance office designs. From sleek startups to multinational headquarters.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 mt-12"
                        >
                            <button className="btn-primary w-full sm:w-auto">View Case Studies</button>
                            <button className="btn-outline w-full sm:w-auto">Our Experts</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Corporate Features */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 md:p-10 border border-black/5 hover:border-secondary transition-all group rounded-[2rem] hover:shadow-2xl hover:bg-white"
                            >
                                <div className="w-12 h-12 text-secondary mb-8 group-hover:scale-110 transition-transform duration-500">{section.icon}</div>
                                <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4 text-primary group-hover:text-secondary transition-colors">{section.title}</h3>
                                <p className="text-darkGray/60 font-inter text-sm md:text-base leading-relaxed">{section.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Expertise Segment */}
            <section className="bg-primary py-24 md:py-32 text-white overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                        <div className="w-full lg:w-1/2 order-2 lg:order-1 px-4 md:px-0">
                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} src="images/services/Corporate-Office.jpg" className="aspect-square object-cover shadow-2xl rounded-3xl" alt="Office 1" />
                                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} src="images/services/services.jpg" className="aspect-square object-cover shadow-2xl mt-8 md:mt-12 rounded-3xl" alt="Office 2" />
                                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} src="images/services/Luxury-Residential-Interior.jpg" className="aspect-square object-cover shadow-2xl -mt-8 md:-mt-12 rounded-3xl" alt="Office 3" />
                                <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} src="images/services/Wallpaper-Paint.jpg" className="aspect-square object-cover shadow-2xl rounded-3xl" alt="Office 4" />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 space-y-8 md:space-y-10 order-1 lg:order-2 px-4 md:px-0">
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold italic leading-tight">Optimizing Productivity through Design.</h2>
                            <p className="text-base md:text-lg text-white/50 font-inter leading-relaxed">
                                At SMM Modular, we understand that a workspace is more than just desks and chairs. It's an engine for productivity and a reflection of your corporate culture.
                            </p>

                            <div className="space-y-4 md:space-y-6">
                                {[
                                    { title: "Ergonomic excellence for employee health", icon: <CheckCircle2 /> },
                                    { title: "Acoustic solutions for focused work", icon: <Zap /> },
                                    { title: "High-speed tech integration", icon: <Layout /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-white/80">
                                        <div className="text-secondary">{item.icon}</div>
                                        <span className="font-space uppercase tracking-widest text-[10px] md:text-xs font-bold">{item.title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8">
                                <button className="btn-primary w-full sm:w-auto flex items-center gap-3">
                                    Consult Workplace Expert <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Corporate;
