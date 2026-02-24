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
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="images/services/commercial-projects/img(1).webp" className="w-full h-full object-cover" alt="Commercial Interiors" />
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-[1px]"></div>
                </div>

                <div className="container-custom relative z-10 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h4 className="font-space text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6 italic">Commercial Excellence</h4>
                            <h1 className="text-5xl md:text-8xl font-playfair font-bold mb-8 leading-tight">
                                Spaces That <br /><span className="text-secondary italic">Drive Business.</span>
                            </h1>
                            <p className="text-xl text-white/50 font-inter leading-relaxed max-w-xl">
                                Strategic interior designs for retail, hospitality, and public spaces in Bangalore. We don't just design; we create platforms for business growth.
                            </p>
                            <div className="flex gap-4 mt-12">
                                <button className="btn-primary">Request Portfolio</button>
                                <button className="btn-outline border-white text-white hover:bg-white hover:text-primary">Our Process</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI Stats */}
            <section className="py-20 bg-warmWhite border-b border-black/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 bg-white shadow-xl shadow-black/[0.02]">
                                <div className="w-16 h-16 bg-tertiary text-secondary flex items-center justify-center rounded-full mb-6">
                                    {stat.icon}
                                </div>
                                <h3 className="text-4xl font-playfair font-bold text-primary mb-2 italic">{stat.val}</h3>
                                <p className="text-xs font-space font-bold uppercase tracking-widest text-darkGray/40">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commercial Categories */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-8 underline decoration-secondary decoration-2 underline-offset-8">Versatile Commercial Solutions.</h2>
                        <p className="text-darkGray/60 font-inter leading-relaxed text-lg italic">We specialize in creating inviting environments that reflect your brand's unique identity.</p>
                    </div>

                    <div className="space-y-32">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden group">
                                    <img src={cat.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.title} />
                                </div>
                                <div className="w-full lg:w-1/2 space-y-8">
                                    <div className="w-16 h-1 bg-secondary"></div>
                                    <h3 className="text-4xl md:text-5xl font-playfair font-bold text-primary italic">{cat.title}</h3>
                                    <p className="text-darkGray/60 text-lg font-inter leading-relaxed">{cat.desc}</p>
                                    <ul className="space-y-4">
                                        {['Strategic Space Planning', 'Brand Identity Integration', 'Custom Fixtures & Lighting', 'High-Traffic Durability'].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm font-space font-bold uppercase tracking-wider text-primary">
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
