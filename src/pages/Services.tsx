import { motion } from 'framer-motion';
import { ArrowRight, Hammer, Layers, Ruler, Home, Building2, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    const categories = [
        {
            title: "Modular Kitchens",
            desc: "Custom modular kitchens tailored to your cooking style and space constraints. From L-shaped to island kitchens, we design for functionality and aesthetics.",
            icon: <Layers size={32} />,
            image: "images/services/Modular-Furniture-Kitchen.jpg"
        },
        {
            title: "Bespoke Wardrobes",
            desc: "Maximize storage with bespoke wardrobes, walk-in closets, and innovative storage systems designed for modern living.",
            icon: <Hammer size={32} />,
            image: "images/services/services.jpg"
        },
        {
            title: "Living Room Interiors",
            desc: "Create inviting living spaces with custom TV units, sofa designs, and complete living room makeovers.",
            icon: <Home size={32} />,
            image: "images/services/Luxury-Residential-Interior.jpg"
        },
        {
            title: "Corporate Workspaces",
            desc: "We create comfortable and efficient workspaces with tailored interior design solutions, enhancing both functionality and aesthetics.",
            icon: <Briefcase size={32} />,
            image: "images/services/Corporate-Office.jpg"
        },
        {
            title: "False Ceiling & Lighting",
            desc: "Elegant and functional false ceilings that enhance aesthetics and offer practical benefits like improved acoustics and lighting.",
            icon: <Layers size={32} />,
            image: "images/services/False-Cailing.jpg"
        },
        {
            title: "2D/3D Vastu Layouts",
            desc: "Luxurious 2D and 3D Vastu-compliant designs that blend Vastu principles with modern aesthetics.",
            icon: <Ruler size={32} />,
            image: "images/services/2D3D-designlayout.jpg"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/services.jpg" className="w-full h-full object-cover" alt="SMM Services" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white py-20 md:py-32">
                    <div className="max-w-4xl">
                        <motion.h4
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6"
                        >
                            Our Expertise
                        </motion.h4>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-playfair font-bold mb-8 leading-[1.1]"
                        >
                            Comprehensive Interior <br className="hidden sm:block" /><span className="italic text-secondary">Solutions.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/60 font-inter leading-relaxed max-w-2xl"
                        >
                            From concept to completion, we bring your vision to life with custom designs, quality materials, and expert installation for any space.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {categories.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                                    <div className="absolute bottom-6 left-6 w-14 h-14 bg-white flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-xl rounded-2xl">
                                        {service.icon}
                                    </div>
                                </div>
                                <div className="p-8 md:p-10">
                                    <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-4 group-hover:text-secondary transition-colors">{service.title}</h3>
                                    <p className="text-darkGray/60 font-inter text-sm md:text-base leading-relaxed mb-8">{service.desc}</p>
                                    <button className="flex items-center gap-2 text-primary font-space font-bold text-[10px] md:text-xs uppercase tracking-widest group-hover:text-secondary group-hover:gap-4 transition-all">
                                        Learn More <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Segments Section */}
            <section className="section-padding overflow-hidden bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary italic">Tailored for Every Segment.</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 border lg:border-black/5 rounded-[2rem] overflow-hidden lg:rounded-none lg:border-none">
                        {[
                            { title: "Residential", path: "/residential", icon: <Home /> },
                            { title: "Commercial", path: "/commercial", icon: <Building2 /> },
                            { title: "Corporate", path: "/corporate", icon: <Briefcase /> }
                        ].map((segment, i) => (
                            <Link
                                key={i}
                                to={segment.path}
                                className="group relative p-10 md:p-16 lg:border-r last:border-r-0 border-black/5 hover:bg-primary transition-all duration-500 bg-warmWhite lg:bg-transparent"
                            >
                                <div className="relative z-10">
                                    <div className="text-secondary mb-8 transition-transform duration-500 group-hover:-translate-y-2">
                                        {segment.icon}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-4 group-hover:text-white transition-colors">{segment.title}</h3>
                                    <p className="text-darkGray/60 group-hover:text-white/40 mb-8 transition-colors text-sm md:text-base">Bespoke solutions designed for {segment.title.toLowerCase()} excellence.</p>
                                    <div className="text-secondary opacity-0 lg:group-hover:opacity-100 transition-all duration-500 flex items-center gap-2 font-space text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                        View Segment <ArrowRight size={14} />
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full lg:group-hover:scale-[3] transition-transform duration-700"></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary py-20 md:py-32">
                <div className="container-custom text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-white mb-10 leading-tight">Ready to bring your <br className="hidden sm:block" /> vision to life?</h2>
                    <button className="btn-primary mx-auto md:px-16">Get A Free Quote Today</button>
                </div>
            </section>
        </div>
    );
};

export default Services;
