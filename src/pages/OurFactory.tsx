import { motion } from 'framer-motion';
import { Settings, Cpu, ShieldCheck, Recycle } from 'lucide-react';

const OurFactory = () => {
    const machines = [
        { title: "BIESSE Blaze 120", desc: "Precision edge banding with diamond tools.", image: "images/factory/img(1).jpg" },
        { title: "BIESSE Rover Gold G", desc: "CNC processing center for complex designs.", image: "images/factory/img(2).jpg" },
        { title: "BIESSE Jade 240", desc: "High-speed automatic single-sided edge bander.", image: "images/factory/img(3).jpg" },
        { title: "BIESSE Jade 340", desc: "Advanced compact edgebanding machine.", image: "images/factory/img(4).jpg" },
    ];

    const process = [
        { title: "Sourcing", desc: "Premium materials sourced from global partners like Hettich & Rehau.", icon: <Recycle /> },
        { title: "Precision Cutting", desc: "Automated Italian machinery ensuring 0.1mm accuracy.", icon: <Cpu /> },
        { title: "Expert Assembly", desc: "Skilled craftsmen overseeing final modular construction.", icon: <Settings /> },
        { title: "Quality Audit", desc: "Multi-stage inspection before final dispatch.", icon: <ShieldCheck /> },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/factory/img(10).jpg" className="w-full h-full object-cover" alt="Factory Overview" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white py-24 md:py-32">
                    <div className="max-w-4xl">
                        <motion.h4
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6"
                        >
                            Italian Precision
                        </motion.h4>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-8xl font-playfair font-bold mb-8 leading-[1.1]"
                        >
                            Where <span className="text-secondary italic">Technology</span> <br className="hidden sm:block" />Meets Artistry.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/60 font-inter leading-relaxed max-w-2xl"
                        >
                            SMM Modular Furniture operates a state-of-the-art manufacturing facility in Bangalore equipped with Italian BIESSE machinery.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Machinery Showcase */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 md:mb-24 gap-8">
                        <div className="max-w-2xl">
                            <motion.h4
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="font-space text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic"
                            >
                                The Arsenal
                            </motion.h4>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight"
                            >
                                Our Advanced Machine Park.
                            </motion.h2>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-darkGray/60 max-w-sm font-inter text-base md:text-lg leading-relaxed"
                        >
                            We invest in the best technology to ensure that your furniture is built to last for generations.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                        {machines.map((machine, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-black/5 group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-700"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img src={machine.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={machine.title} />
                                </div>
                                <div className="p-8 md:p-12">
                                    <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-4 group-hover:text-secondary transition-colors">{machine.title}</h3>
                                    <p className="text-darkGray/60 font-inter text-sm md:text-base leading-relaxed mb-8">{machine.desc}</p>
                                    <div className="h-1 w-12 bg-black/5 group-hover:w-full group-hover:bg-secondary transition-all duration-700 rounded-full"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QC Process */}
            <section className="section-padding overflow-hidden bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-12 order-2 lg:order-1">
                            <div className="max-w-md">
                                <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">Quality Control</h4>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-primary leading-tight">Zero Compromise from Design to Delivery.</h2>
                            </div>

                            <div className="space-y-8 md:space-y-10">
                                {process.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 md:gap-8 bg-warmWhite/30 p-6 md:p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-500"
                                    >
                                        <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-white shadow-sm flex items-center justify-center text-secondary rounded-2xl group-hover:bg-secondary group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-2 text-primary">{item.title}</h3>
                                            <p className="text-darkGray/60 font-inter text-sm md:text-base leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-2">
                            <img src="images/factory/img(10).jpg" className="w-full aspect-[4/5] object-cover rounded-[3rem] shadow-2xl" alt="Workmanship" />
                            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-primary p-8 md:p-12 text-white max-w-xs shadow-2xl rounded-[2rem]">
                                <p className="text-2xl md:text-4xl font-playfair font-bold mb-4 leading-tight italic">Handcrafted with Industrial Speed.</p>
                                <p className="text-white/50 text-[10px] md:text-xs font-space uppercase tracking-widest font-bold">The SMM Promise</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-secondary p-8 sm:p-16 md:p-32 text-center relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-7xl font-playfair font-bold text-primary mb-8 italic tracking-tighter">See our quality in person.</h2>
                    <p className="text-base md:text-2xl font-inter text-primary/80 max-w-2xl mx-auto mb-12 leading-relaxed">Book a factory visit and witness the making of your future home.</p>
                    <button className="btn-primary bg-primary text-white border-none py-5 md:py-7 px-10 md:px-16 text-[10px] md:text-sm">Schedule Factory Tour</button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            </section>
        </div>
    );
};

export default OurFactory;
