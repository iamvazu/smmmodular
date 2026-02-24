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
            <section ref={heroRef} className="relative h-screen overflow-hidden flex flex-col md:flex-row">
                {/* Left: Image */}
                <div className="relative w-full md:w-3/5 h-[60vh] md:h-full overflow-hidden">
                    <motion.div style={{ y: heroImageY }} className="absolute inset-0">
                        <img
                            src="images/services/residential-projects/img(18).webp"
                            alt="Luxury Living Room"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </motion.div>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-2/5 h-[40vh] md:h-full bg-primary flex items-center p-8 md:p-16 lg:p-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="w-20 h-1 bg-secondary mb-8"></div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold text-white leading-tight">
                            Crafting Timeless Spaces, <span className="text-secondary">One Module</span> at a Time.
                        </h1>
                        <p className="text-white/60 font-inter text-lg md:text-xl max-w-lg leading-relaxed">
                            Bangalore's Premier Modular Furniture & Interior Design Studio | 20+ Years of Transforming Houses into Homes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="btn-primary flex items-center justify-center gap-2 group">
                                Book Free Consultation
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="btn-outline">Explore Our Work</button>
                        </div>

                        <div className="pt-10 flex gap-8">
                            <div className="text-white/80">
                                <p className="text-2xl font-bold text-secondary font-playfair">5000+</p>
                                <p className="text-[10px] uppercase tracking-widest font-space">Happy Homes</p>
                            </div>
                            <div className="text-white/80">
                                <p className="text-2xl font-bold text-secondary font-playfair">15-Year</p>
                                <p className="text-[10px] uppercase tracking-widest font-space">Warranty</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-warmWhite py-12 border-b border-black/5">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center space-x-4"
                            >
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    {stat.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-playfair font-bold text-primary">{stat.value}</h3>
                                    <p className="text-xs uppercase tracking-wider text-darkGray/60 font-space font-medium">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The SMM Difference */}
            <section className="section-padding overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 italic">The SMM Edge</h4>
                            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight">
                                Why Discerning Clients Choose SMM Modular.
                            </h2>
                        </div>
                        <p className="text-darkGray/60 max-w-sm font-inter">
                            SMM Modular Furniture stands apart as Bangalore's most trusted interior design partner. Our transparent pricing model eliminates surprise costs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="p-10 bg-white border border-black/5 shadow-xl shadow-black/[0.02] group transition-all duration-500 hover:border-secondary/30"
                            >
                                <div className="w-12 h-12 bg-tertiary text-secondary flex items-center justify-center mb-8 rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-playfair font-bold mb-4 group-hover:text-secondary transition-colors duration-500">{feature.title}</h3>
                                <p className="text-darkGray/60 font-inter text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="bg-primary py-24 text-white overflow-hidden relative">
                {/* Background Text */}
                <div className="absolute top-0 right-0 text-[20vw] font-playfair font-bold text-white/[0.03] leading-none select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
                    PROCESS
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4">Our Method</h4>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
                            From Blueprint to Reality in 45 Days.
                        </h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0 border-t border-white/10">
                        {processSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-10 border-r border-white/10 last:border-r-0 relative group"
                            >
                                <span className="block text-5xl font-playfair font-bold text-white/10 group-hover:text-secondary/20 transition-colors duration-500 mb-8">{step.num}</span>
                                <h3 className="text-xl font-playfair font-bold mb-4 text-white">{step.title}</h3>
                                <p className="text-white/50 text-sm font-inter leading-relaxed">{step.desc}</p>

                                {/* Connector for desktop */}
                                {i < processSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 -right-4 text-secondary z-20">
                                        <ArrowRight size={32} strokeWidth={1} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary">Our Design Segments</h2>
                        <Link to="/services" className="text-secondary font-space text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all mt-4 md:mt-0">
                            View All Services <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Residential */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
                        >
                            <img src="/images/services/residential-projects/img(25).webp" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Residential" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-10 text-white">
                                <h3 className="text-3xl font-playfair font-bold mb-2">Residential</h3>
                                <p className="text-white/60 text-sm mb-6 max-w-[200px]">Luxury homes designed for modern living.</p>
                                <Link to="/residential" className="inline-block p-4 border border-white/20 hover:bg-secondary hover:border-secondary transition-all">
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Commercial */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
                        >
                            <img src="/images/services/commercial-projects/img(1).webp" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Commercial" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-10 text-white">
                                <h3 className="text-3xl font-playfair font-bold mb-2">Commercial</h3>
                                <p className="text-white/60 text-sm mb-6 max-w-[200px]">Strategic designs for retail & hospitality.</p>
                                <Link to="/commercial" className="inline-block p-4 border border-white/20 hover:bg-secondary hover:border-secondary transition-all">
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Corporate */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
                        >
                            <img src="/images/services/Corporate-Office.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Corporate" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-10 text-white">
                                <h3 className="text-3xl font-playfair font-bold mb-2">Corporate</h3>
                                <p className="text-white/60 text-sm mb-6 max-w-[200px]">Productive workspaces for high performance.</p>
                                <Link to="/corporate" className="inline-block p-4 border border-white/20 hover:bg-secondary hover:border-secondary transition-all">
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Factory Preview */}
            <section className="bg-primary py-24 overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 space-y-8">
                            <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary italic">In-House Production</h4>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white">The Precision of Italian BIESSE Machinery.</h2>
                            <p className="text-white/60 font-inter text-lg leading-relaxed">
                                Our state-of-the-art manufacturing facility in Bangalore ensures that every piece of furniture meets international quality standards. No outsourcing, just pure craftsmanship.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold font-playfair text-secondary">10,000+</p>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-space">Sqft Factory Space</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold font-playfair text-secondary">ISO 9001</p>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-space">Certified Quality</p>
                                </div>
                            </div>
                            <Link to="/our-factory" className="btn-primary inline-flex items-center gap-2">
                                Tour Our Factory <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="w-full lg:w-1/2 relative">
                            <div className="aspect-video bg-darkGray overflow-hidden shadow-2xl">
                                <img src="/images/factory/img(1).jpg" className="w-full h-full object-cover" alt="SMM Factory" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 -z-10"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/5 -z-10"></div>
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
            <section className="bg-secondary p-12 md:p-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/footer_bg.png')] opacity-10 mix-blend-overlay"></div>
                <div className="container-custom relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="max-w-2xl text-primary">
                        <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-6 italic">Ready to transform your space?</h2>
                        <p className="text-xl font-inter opacity-80 leading-relaxed">
                            Join 5000+ happy homeowners in Bangalore. Book a free design consultation today and get a personalized 3D visualization.
                        </p>
                    </div>
                    <button className="bg-primary text-white px-12 py-6 font-space font-bold uppercase tracking-[0.2em] transform transition-all hover:scale-105 active:scale-95 shadow-2xl">
                        Get Started Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
