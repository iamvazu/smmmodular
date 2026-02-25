import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, Factory, Palette, Clock, ShieldCheck, Star, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const heroTextOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const stats = [
        { label: "Years of Excellence", value: "20+", icon: <Star className="text-secondary" /> },
        { label: "Projects Delivered", value: "5000+", icon: <CheckCircle2 className="text-secondary" /> },
        { label: "Cities Across India", value: "10+", icon: <MapPin className="text-secondary" /> },
        { label: "Warranty Promise", value: "15-Yrs", icon: <ShieldCheck className="text-secondary" /> },
    ];

    const features = [
        { title: "No Hidden Costs", desc: "Transparent pricing model with zero surprise expenses.", icon: <Palette /> },
        { title: "Personalized Design", desc: "3D visualizations tailored to your specific lifestyle.", icon: <Users /> },
        { title: "On-Time Delivery", desc: "Committed 45-day handover for every project.", icon: <Clock /> },
        { title: "Own Factory", desc: "In-house manufacturing for superior quality control.", icon: <Factory /> },
    ];

    const processSteps = [
        { num: "01", title: "Consultation", desc: "Share your vision with our expert designers" },
        { num: "02", title: "3D Design", desc: "Experience your space in photorealistic 3D" },
        { num: "03", title: "Production", desc: "Watch your furniture come alive in our factory" },
        { num: "04", title: "Execution", desc: "Professional installation with precision" },
        { num: "05", title: "Handover", desc: "Move into your dream home in 45 days" },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col lg:flex-row overflow-hidden bg-primary">
                {/* Visual Area (Image) */}
                <div className="relative w-full lg:w-7/12 h-[45vh] lg:h-auto min-h-[350px] overflow-hidden order-1 lg:order-1 lg:clip-path-slant">
                    <motion.div style={{ y: heroImageY }} className="absolute inset-0">
                        <img
                            src="images/services/residential-projects/img(18).webp"
                            alt="Luxury Living Room"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 lg:bg-transparent"></div>
                    </motion.div>
                </div>

                {/* Content Area */}
                <div className="w-full lg:w-5/12 min-h-[55vh] lg:min-h-screen bg-primary flex items-center p-6 sm:p-12 xl:p-20 relative z-10 order-2 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="space-y-6 md:space-y-10 w-full"
                    >
                        <div className="w-16 h-1 bg-secondary mb-6 md:mb-10"></div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-playfair font-bold text-white leading-[1.15]">
                            Crafting Timeless Spaces, <span className="text-secondary italic font-normal">One Module</span> at a Time.
                        </h1>
                        <p className="text-white/60 font-inter text-sm md:text-lg max-w-xl leading-relaxed">
                            Bangalore's Premier Modular Furniture & Interior Design Studio. 20+ years of transforming aspirations into exquisite living realities.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="btn-primary w-full sm:w-auto">
                                Book Free Consultation
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="btn-outline w-full sm:w-auto">Explore Our Work</button>
                        </div>

                        <div className="pt-8 md:pt-12 flex flex-wrap gap-8 md:gap-12 border-t border-white/5">
                            <div>
                                <p className="text-2xl md:text-3xl font-bold text-secondary font-playfair tracking-tighter">5000+</p>
                                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-space text-white/40 font-bold">Happy Homes</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-bold text-secondary font-playfair tracking-tighter">15-Year</p>
                                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-space text-white/40 font-bold">Warranty</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-warmWhite py-10 md:py-16 border-b border-black/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center space-x-5"
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-secondary">
                                    {stat.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-playfair font-bold text-primary tabular-nums">{stat.value}</h3>
                                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-darkGray/50 font-space font-bold">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The SMM Difference */}
            <section className="section-padding overflow-hidden bg-white">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-10">
                        <div className="max-w-3xl">
                            <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">The SMM Advantage</h4>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary leading-[1.1]">
                                Why Bangalore's Elite <br className="hidden md:block" /> Trust SMM Modular Furniture.
                            </h2>
                        </div>
                        <p className="text-darkGray/60 max-w-sm font-inter text-base md:text-lg leading-relaxed">
                            We don't just design offices and homes; we build the foundations for your future growth and comfort.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 md:p-10 bg-warmWhite/50 border border-black/5 hover:bg-white hover:shadow-2xl hover:shadow-black/[0.05] group transition-all duration-500 rounded-3xl"
                            >
                                <div className="w-14 h-14 bg-white shadow-sm text-secondary flex items-center justify-center mb-8 rounded-2xl group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4 group-hover:text-secondary transition-colors duration-500">{feature.title}</h3>
                                <p className="text-darkGray/60 font-inter text-sm md:text-base leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="bg-primary py-20 md:py-32 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 text-[15vw] font-playfair font-bold text-white/[0.02] leading-none select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
                    REDESIGN
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-6">Execution Method</h4>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white mb-8">
                            Precision Engineering <br className="hidden sm:block" /> in Every Module.
                        </h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0 lg:border-t lg:border-white/10">
                        {processSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 lg:p-10 lg:border-r lg:border-white/10 last:border-r-0 relative group bg-white/5 lg:bg-transparent rounded-2xl lg:rounded-none"
                            >
                                <span className="block text-4xl md:text-5xl font-playfair font-bold text-white/10 group-hover:text-secondary/20 transition-colors duration-500 mb-8">{step.num}</span>
                                <h3 className="text-lg md:text-xl font-playfair font-bold mb-4 text-white tracking-tight">{step.title}</h3>
                                <p className="text-white/40 text-xs md:text-sm font-inter leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Segments Preview */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-12 md:mb-20 gap-6">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary">Design Segments.</h2>
                        <Link to="/services" className="text-secondary font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                            Explore All Services <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                        {/* Segments Cards */}
                        {[
                            { title: "Residential", path: "/residential", img: "/images/services/residential-projects/img(25).webp", desc: "Luxury homes for modern Bangalore." },
                            { title: "Commercial", path: "/commercial", img: "/images/services/commercial-projects/img(1).webp", desc: "High-traffic retail & dining spaces." },
                            { title: "Corporate", path: "/corporate", img: "/images/services/Corporate-Office.jpg", desc: "Workspaces optimized for growth." },
                        ].map((segment, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -12 }}
                                className="relative aspect-[4/5] overflow-hidden group rounded-[2.5rem] shadow-2xl shadow-black/10"
                            >
                                <img src={segment.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={segment.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
                                    <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-3">{segment.title}</h3>
                                    <p className="text-white/50 text-sm md:text-base mb-8 max-w-[240px] leading-relaxed">{segment.desc}</p>
                                    <Link to={segment.path} className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-white/20 hover:bg-secondary hover:border-secondary transition-all">
                                        <ArrowRight size={24} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* In-House Production / Factory Preview */}
            <section className="bg-white py-20 md:py-32 overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
                        <div className="w-full lg:w-1/2 space-y-8 md:space-y-12 order-2 lg:order-1">
                            <h4 className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary">Advanced Production</h4>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight">Italian BIESSE Machinery <br className="hidden md:block" /> for Unrivaled Precision.</h2>
                            <p className="text-darkGray/60 font-inter text-base md:text-xl leading-relaxed">
                                We own every stage of the process. Our 10,000 sqft facility eliminates middle-men, ensuring your furniture is built to global standards under our rigorous oversight.
                            </p>
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-2xl md:text-4xl font-bold font-playfair text-secondary tracking-tighter tabular-nums">10,000+</p>
                                    <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-darkGray/40 font-bold font-space">Sqft Factory Space</p>
                                </div>
                                <div>
                                    <p className="text-2xl md:text-4xl font-bold font-playfair text-secondary tracking-tighter">ISO 9001</p>
                                    <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-darkGray/40 font-bold font-space">Certified Quality</p>
                                </div>
                            </div>
                            <Link to="/our-factory" className="btn-primary inline-flex lg:px-12">
                                Visit Our Factory <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                                <img src="/images/factory/img(1).jpg" className="w-full h-full object-cover" alt="SMM Factory" />
                            </div>
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/5 rounded-full -z-0"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-secondary/10 rounded-[4rem] translate-x-10 translate-y-10 -z-0"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">Client Stories</h4>
                        <h2 className="text-4xl font-playfair font-bold text-primary">Voices of Satisfaction</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="p-10 border border-black/5 bg-warmWhite/30 relative">
                                <Star className="text-secondary absolute top-10 right-10 opacity-20" size={40} />
                                <p className="text-darkGray text-lg italic font-inter mb-8 leading-relaxed">
                                    "The attention to detail and the 45-day delivery promise were what made us choose SMM. They didn't just meet our expectations; they exceeded them."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-full"></div>
                                    <div>
                                        <h4 className="font-playfair font-bold text-primary">Anjali Sharma</h4>
                                        <p className="text-[10px] uppercase tracking-widest text-darkGray/50 font-space">Bangalore, Whitefield</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-secondary py-16 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5 opacity-50"></div>
                <div className="container-custom relative z-10">
                    <div className="max-w-5xl mx-auto text-primary text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-7xl font-playfair font-bold mb-8 italic tracking-tighter">Start your transformational design journey today.</h2>
                        <p className="text-base md:text-2xl font-inter opacity-80 leading-relaxed max-w-2xl mx-auto mb-12">
                            Expert consultation, photorealistic 3D visualization, and a 15-year warranty guarantee.
                        </p>
                        <button className="bg-primary text-white px-10 md:px-16 py-5 md:py-7 font-space font-bold uppercase tracking-[0.2em] transform transition-all hover:scale-105 hover:bg-black active:scale-95 shadow-3xl text-[10px] md:text-sm">
                            Book Free Consult
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
