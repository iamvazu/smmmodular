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
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/factory/img(10).jpg" className="w-full h-full object-cover" alt="Factory Overview" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white">
                    <div className="max-w-4xl">
                        <h4 className="font-space text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6">Italian Precision</h4>
                        <h1 className="text-5xl md:text-8xl font-playfair font-bold mb-8 leading-tight">
                            Where <span className="text-secondary italic">Technology</span> <br />Meets Artistry.
                        </h1>
                        <p className="text-xl text-white/60 font-inter leading-relaxed max-w-2xl">
                            SMM Modular Furniture operates a state-of-the-art manufacturing facility in Bangalore equipped with Italian BIESSE machinery.
                        </p>
                    </div>
                </div>
            </section>

            {/* Machinery Showcase */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">The Arsenal</h4>
                            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight">
                                Our Advanced Machine Park.
                            </h2>
                        </div>
                        <p className="text-darkGray/60 max-w-sm font-inter">
                            We invest in the best technology to ensure that your furniture is built to last for generations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {machines.map((machine, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-black/5 group overflow-hidden"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img src={machine.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={machine.title} />
                                </div>
                                <div className="p-10">
                                    <h3 className="text-3xl font-playfair font-bold mb-4">{machine.title}</h3>
                                    <p className="text-darkGray/60 font-inter text-sm mb-8">{machine.desc}</p>
                                    <div className="h-0.5 w-0 bg-secondary group-hover:w-full transition-all duration-500"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QC Process */}
            <section className="section-padding overflow-hidden">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="max-w-md">
                                <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">Quality Control</h4>
                                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary leading-tight">Zero Compromise from Design to Delivery.</h2>
                            </div>

                            <div className="space-y-10">
                                {process.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-8"
                                    >
                                        <div className="w-16 h-16 shrink-0 bg-tertiary flex items-center justify-center text-secondary rounded-full">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-playfair font-bold mb-2 text-primary">{item.title}</h3>
                                            <p className="text-darkGray/60 font-inter text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <img src="images/factory/img(10).jpg" className="w-full aspect-[4/5] object-cover shadow-2xl" alt="Workmanship" />
                            <div className="absolute -bottom-10 -left-10 bg-primary p-12 text-white max-w-xs shadow-2xl">
                                <p className="text-4xl font-playfair font-bold mb-4 leading-tight italic">Handcrafted with Industrial Speed.</p>
                                <p className="text-white/50 text-xs font-space uppercase tracking-widest">SMM Promise</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-secondary p-12 md:p-24 text-primary text-center">
                <div className="container-custom">
                    <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-8 italic">See our quality in person.</h2>
                    <p className="text-xl max-w-2xl mx-auto mb-12 opacity-80">Book a factory visit and witness the making of your future home.</p>
                    <button className="btn-primary bg-primary text-white border-none py-6 px-12 text-sm">Schedule Factory Tour</button>
                </div>
            </section>
        </div>
    );
};

export default OurFactory;
