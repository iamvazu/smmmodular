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
        <div className="min-h-screen font-inter">
            {/* Hero */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/Corporate-Office.jpg" className="w-full h-full object-cover" alt="Corporate Interiors" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[1px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white">
                    <div className="max-w-4xl">
                        <h4 className="font-space text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6 italic">Corporate Interiors</h4>
                        <h1 className="text-5xl md:text-8xl font-playfair font-bold mb-8 leading-tight">
                            Workspaces <br />That <span className="text-secondary italic">Inspire.</span>
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed max-w-xl">
                            Elevating Bangalore's corporate landscape with high-performance office designs. From sleek startups to multinational headquarters.
                        </p>
                        <div className="flex gap-4 mt-12">
                            <button className="btn-primary">View Case Studies</button>
                            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary">Our Experts</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Features */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 border border-black/5 hover:border-secondary transition-all group"
                            >
                                <div className="w-12 h-12 text-secondary mb-8 group-hover:scale-110 transition-transform">{section.icon}</div>
                                <h3 className="text-2xl font-playfair font-bold mb-4 text-primary group-hover:text-secondary">{section.title}</h3>
                                <p className="text-darkGray/60 font-inter text-sm leading-relaxed">{section.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Expertise Segment */}
            <section className="bg-primary py-32 text-white overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-8">
                                <img src="images/services/Corporate-Office.jpg" className="aspect-square object-cover shadow-xl" alt="Office 1" />
                                <img src="images/services/services.jpg" className="aspect-square object-cover shadow-xl mt-12" alt="Office 2" />
                                <img src="images/services/Luxury-Residential-Interior.jpg" className="aspect-square object-cover shadow-xl -mt-12" alt="Office 3" />
                                <img src="images/services/Wallpaper-Paint.jpg" className="aspect-square object-cover shadow-xl" alt="Office 4" />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 space-y-10 order-1 lg:order-2">
                            <h2 className="text-4xl md:text-6xl font-playfair font-bold italic leading-tight">Optimizing Productivity through Design.</h2>
                            <p className="text-lg text-white/50 font-inter leading-relaxed">
                                At SMM Modular, we understand that a workspace is more than just desks and chairs. It's an engine for productivity and a reflection of your corporate culture.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Ergonomic excellence for employee health", icon: <CheckCircle2 /> },
                                    { title: "Acoustic solutions for focused work", icon: <Zap /> },
                                    { title: "High-speed tech integration", icon: <Layout /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-white/80">
                                        <div className="text-secondary">{item.icon}</div>
                                        <span className="font-space uppercase tracking-widest text-xs font-bold">{item.title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8">
                                <button className="btn-primary flex items-center gap-3">
                                    Consult Our Workplace Expert <ArrowRight size={18} />
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
