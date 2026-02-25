import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Maximize2, MapPin } from 'lucide-react';

const Residential = () => {
    const projects = [
        { title: "Azure Heights Penthouse", loc: "Whitefield, Bangalore", img: "images/services/residential-projects/img(18).webp" },
        { title: "The Heritage Villa", loc: "Koramangala, Bangalore", img: "images/services/residential-projects/img(25).webp" },
        { title: "Modern Minimalist Studio", loc: "Indiranagar, Bangalore", img: "images/services/residential-projects/img(2).webp" },
        { title: "Eco-Friendly 3BHK", loc: "Electronic City, Bangalore", img: "images/services/residential-projects/img(1).webp" },
    ];

    const locations = ["Whitefield", "Koramangala", "Indiranagar", "Jayanagar", "HSR Layout", "Electronic City", "Sarjapur Road", "Hebbal"];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/residential-projects/img(18).webp" className="w-full h-full object-cover" alt="Luxury Residential" />
                    <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white py-24 md:py-32">
                    <div className="max-w-4xl">
                        <motion.h4
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6"
                        >
                            Home Interiors
                        </motion.h4>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-8xl font-playfair font-bold mb-8 leading-[1.1]"
                        >
                            Homes Designed <br className="hidden sm:block" />for <span className="italic text-secondary">Living.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/60 font-inter leading-relaxed max-w-2xl"
                        >
                            Transforming Bangalore's apartments and villas into personalized sanctuaries. Our residential designs balance opulence with pure functionality.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 md:mb-24 gap-8">
                        <div className="max-w-2xl">
                            <motion.h4
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="font-space text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic"
                            >
                                Portfolio
                            </motion.h4>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight"
                            >
                                Luxury Homes in Bangalore.
                            </motion.h2>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-3 md:gap-4"
                        >
                            {["All", "Villas", "Apartments"].map((filter) => (
                                <button key={filter} className="px-6 py-2.5 border border-black/5 text-[10px] font-bold font-space uppercase tracking-widest hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all rounded-full">
                                    {filter}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-[2rem] shadow-lg group-hover:shadow-2xl transition-all duration-700">
                                    <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-500"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-4 scale-75 group-hover:scale-100">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all shadow-xl">
                                            <Maximize2 size={20} />
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all shadow-xl">
                                            <Heart size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start px-2">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-playfair font-bold text-primary group-hover:text-secondary transition-colors leading-[1.1]">{project.title}</h3>
                                        <p className="text-darkGray/60 font-inter text-sm md:text-base flex items-center gap-1.5 mt-2">
                                            <MapPin size={16} className="text-secondary" /> {project.loc}
                                        </p>
                                    </div>
                                    <div className="p-3 border border-black/5 rounded-2xl group-hover:bg-secondary group-hover:border-secondary transition-all">
                                        <ArrowRight size={20} className="group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Segments */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        <div className="w-full lg:w-[65%] space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary italic leading-tight">Best Interior Designers in Bangalore with Price Transparency.</h2>
                                <p className="text-darkGray/70 font-inter text-base md:text-lg leading-relaxed">
                                    SMM Modular Furniture is recognized among the <b>top residential interior designers in Bangalore</b>. Our approach combines 20 years of expertise with a commitment to delivery excellence. Whether you own a 2BHK in Whitefield or a luxury villa in Koramangala, our team ensures that every square foot is optimized for beauty and utility.
                                </p>
                                <p className="text-darkGray/70 font-inter text-base md:text-lg leading-relaxed">
                                    We specialize in <b>modular kitchens, custom wardrobes, and full-home interiors</b>. Our pricing model is fixed at the start, ensuring "No Hidden Costs" - a rare promise in the Bangalore interior design market.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                                <div className="p-8 md:p-12 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-black/5">
                                    <h4 className="font-playfair font-bold text-2xl mb-4 text-primary">Apartment Interiors</h4>
                                    <p className="text-darkGray/60 text-sm md:text-base leading-relaxed">Sophisticated, space-saving designs for contemporary Bangalore apartments. We focus on maximizing horizontal and vertical space while maintaining an airy, luxurious feel.</p>
                                </div>
                                <div className="p-8 md:p-12 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-black/5">
                                    <h4 className="font-playfair font-bold text-2xl mb-4 text-primary">Independent Villas</h4>
                                    <p className="text-darkGray/60 text-sm md:text-base leading-relaxed">Large-scale designs that emphasize architectural flow and grand aesthetics. From double-height living areas to bespoke home theaters.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-[35%] bg-primary text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-playfair font-bold text-secondary mb-10 border-b border-white/10 pb-6 italic">Serving All Of <span className="text-white">Bangalore</span></h3>
                                <ul className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                                    {locations.map((loc, i) => (
                                        <li key={i} className="text-sm md:text-base text-white/60 hover:text-white transition-all cursor-pointer flex items-center gap-3 font-space uppercase tracking-widest font-bold">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> {loc}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-16 pt-12 border-t border-white/10 text-center">
                                    <p className="mb-10 font-inter text-sm md:text-lg text-white/50 italic leading-relaxed">"Design is not just what it looks like, it's how it works."</p>
                                    <button className="w-full btn-primary bg-secondary text-primary font-bold py-5">Get Your Free Quote</button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export default Residential;
