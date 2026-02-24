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
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/residential-projects/img(18).webp" className="w-full h-full object-cover" alt="Luxury Residential" />
                    <div className="absolute inset-0 bg-primary/70 backdrop-blur-[1px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white">
                    <div className="max-w-4xl">
                        <h4 className="font-space text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6">Home Interiors</h4>
                        <h1 className="text-5xl md:text-8xl font-playfair font-bold mb-8 leading-tight">
                            Homes Designed <br />for <span className="italic text-secondary">Living.</span>
                        </h1>
                        <p className="text-xl text-white/60 font-inter leading-relaxed max-w-2xl">
                            Transforming Bangalore's apartments and villas into personalized sanctuaries. Our residential designs balance opulence with pure functionality.
                        </p>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">Portfolio</h4>
                            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight">
                                Luxury Homes in Bangalore.
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-2 border border-black/10 text-xs font-bold font-space uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">All</button>
                            <button className="px-6 py-2 border border-black/10 text-xs font-bold font-space uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">Villas</button>
                            <button className="px-6 py-2 border border-black/10 text-xs font-bold font-space uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">Apartments</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden mb-6">
                                    <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-500"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                                            <Maximize2 size={20} />
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                                            <Heart size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-playfair font-bold text-primary group-hover:text-secondary transition-colors">{project.title}</h3>
                                        <p className="text-darkGray/60 font-inter text-sm flex items-center gap-1 mt-1">
                                            <MapPin size={14} className="text-secondary" /> {project.loc}
                                        </p>
                                    </div>
                                    <div className="p-3 border border-black/5 group-hover:bg-secondary group-hover:border-secondary transition-all">
                                        <ArrowRight size={18} className="group-hover:text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PSEO Content Segments */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="prose prose-lg">
                                <h2 className="text-4xl font-playfair font-bold text-primary mb-6 italic">Best Interior Designers in Bangalore with Price Transparency.</h2>
                                <p className="text-darkGray/70 font-inter leading-relaxed">
                                    SMM Modular Furniture is recognized among the <b>top residential interior designers in Bangalore</b>. Our approach combines 20 years of expertise with a commitment to delivery excellence. Whether you own a 2BHK in Whitefield or a luxury villa in Koramangala, our team ensures that every square foot is optimized for beauty and utility.
                                </p>
                                <p className="text-darkGray/70 font-inter leading-relaxed">
                                    We specialize in <b>modular kitchens, custom wardrobes, and full-home interiors</b>. Our pricing model is fixed at the start, ensuring "No Hidden Costs" - a rare promise in the Bangalore interior design market.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-10 border border-black/5 bg-white">
                                    <h4 className="font-playfair font-bold text-2xl mb-4">Apartment Interiors</h4>
                                    <p className="text-darkGray/60 text-sm leading-relaxed">Sophisticated, space-saving designs for contemporary Bangalore apartments. We focus on maximizing horizontal and vertical space while maintaining an airy, luxurious feel.</p>
                                </div>
                                <div className="p-10 border border-black/5 bg-white">
                                    <h4 className="font-playfair font-bold text-2xl mb-4">Independent Villas</h4>
                                    <p className="text-darkGray/60 text-sm leading-relaxed">Large-scale designs that emphasize architectural flow and grand aesthetics. From double-height living areas to bespoke home theaters.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary text-white p-12">
                            <h3 className="text-2xl font-playfair font-bold text-secondary mb-8 underline">Serving All Of Bangalore</h3>
                            <ul className="grid grid-cols-2 gap-4">
                                {locations.map((loc, i) => (
                                    <li key={i} className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                                        <ChevronRight size={14} className="text-secondary" /> {loc}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-12 pt-12 border-t border-white/10 text-center">
                                <p className="mb-6 font-inter text-sm text-white/80 italic">"Design is not just what it looks like, it's how it works."</p>
                                <button className="w-full btn-primary bg-secondary text-primary font-bold">Free Quote</button>
                            </div>
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
