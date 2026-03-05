import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { SEO } from '../components/SEO';
import { AuraAIWidget } from '../components/AuraAIWidget';
import { Link } from 'react-router-dom';

const AuraAI = () => {
    return (
        <div className="bg-primary text-white min-h-screen">
            <SEO
                title="Aura AI ✨ - Instant AI Interior Design | SMM Modular"
                description="Upload a sketch, photo, or floor plan and get a photorealistic 3D render in 30 seconds with SMM's Aura AI."
                canonical="/aura-ai"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/images/services/residential-projects/img(18).webp')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-primary/95 z-0"></div>

                <div className="container-custom relative z-10">
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-5xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-12 text-center"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] md:text-sm font-space uppercase tracking-widest font-bold mb-6">
                                    <Sparkles size={16} /> Aura AI Design Engine
                                </div>
                                <h1 className="text-4xl md:text-6xl font-playfair font-bold leading-tight mb-4 text-center">
                                    Aura AI <span className="text-secondary italic">Studio</span>
                                </h1>
                                <p className="text-white/60 font-inter text-lg max-w-2xl mx-auto">
                                    Upload your sketch or photo below to begin your transformation.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <AuraAIWidget variant="fullscreen" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white text-primary">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4">The Magic Process</h4>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold">From Sketch to Reality</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-primary/10 -translate-y-1/2 z-0"></div>

                        {[
                            { step: "01", title: "Upload", desc: "Snap a photo of your empty room or draw a quick sketch of your floor plan." },
                            { step: "02", title: "AI Magic", desc: "Aura AI analyzes dimensions, natural light, and checks Vastu compliance." },
                            { step: "03", title: "Your Design", desc: "Get highly detailed 3D renders with SMM's actual furniture catalog applied to your space." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-warmWhite p-8 rounded-2xl relative z-10 border border-primary/5 text-center shadow-lg"
                            >
                                <div className="w-16 h-16 bg-primary text-secondary rounded-full flex items-center justify-center font-playfair font-bold text-2xl mx-auto mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold font-playfair mb-3">{item.title}</h3>
                                <p className="text-darkGray/70 font-inter leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vastu Feature Showcase */}
            <section className="py-24 bg-primary relative overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 relative">
                            <div className="aspect-square bg-white/5 rounded-full absolute -top-10 -left-10 w-full h-full border border-secondary/20"></div>
                            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm relative z-10 border border-secondary/30">
                                <h3 className="text-2xl font-playfair font-bold mb-6 text-white text-center border-b border-white/10 pb-4">AI Vastu Engine</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-green-400/10 rounded-lg text-green-400">
                                        <ShieldCheck size={24} />
                                        <span>Master Bedroom located in South-West (+20 pts)</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-yellow-400/10 rounded-lg text-yellow-400">
                                        <Sparkles size={24} />
                                        <span>Suggestion: Rotate bed to face East for better sleep</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4 mt-6 lg:mt-0">Pre-Configured Knowledge</h4>
                            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">Built for Indian Homes</h2>
                            <p className="text-white/60 font-inter text-lg leading-relaxed mb-8">
                                Aura AI doesn't just generate pretty pictures. It comes pre-trained with core Vastu Shastra principles, analyzing cardinal directions and providing actionable insights for prosperity and peace.
                            </p>
                            <Link to="/services" className="btn-primary inline-flex">
                                Speak to an Expert <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 bg-warmWhite text-primary">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4">Real Results</h4>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold">Community Gallery</h2>
                        <p className="font-inter text-darkGray/70 mt-4 max-w-xl mx-auto">Explore spaces transformed by Indian homeowners using Aura AI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder gallery cards */}
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                                <img src={`/images/services/residential-projects/img(${20 + idx}).webp`} alt="Rendered space" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-6">
                                    <div className="w-full relative z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <h4 className="text-white font-playfair font-bold text-lg">Living Room Renovation</h4>
                                        <p className="text-white/70 text-sm font-inter">Bangalore, IN</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-white text-primary">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4">Transparent Cost</h4>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold">Aura AI Pricing</h2>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border border-primary/10 rounded-3xl p-8 bg-warmWhite">
                            <h3 className="font-playfair font-bold text-3xl mb-2">Basic AI Render</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold font-space">₹0</span>
                                <span className="text-darkGray/60 font-inter">/ forever</span>
                            </div>
                            <ul className="space-y-4 font-inter text-darkGray/80 mb-8">
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> Up to 3 renders per day</li>
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> Standard 1080p resolution</li>
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> Basic Vastu checks</li>
                            </ul>
                            <button onClick={() => window.scrollTo(0, 0)} className="w-full py-4 text-center font-space uppercase tracking-widest font-bold border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Start Free</button>
                        </div>
                        <div className="border-2 border-secondary rounded-3xl p-8 bg-primary text-white relative shadow-2xl">
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-secondary text-primary text-[10px] font-space uppercase font-bold tracking-widest px-4 py-1 rounded-full">Most Popular</div>
                            <h3 className="font-playfair font-bold text-3xl mb-2">Consultation Bundle</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold font-space text-secondary">₹499</span>
                                <span className="text-white/60 font-inter">/ session</span>
                            </div>
                            <ul className="space-y-4 font-inter text-white/80 mb-8">
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> Unlimited 4K AI renders</li>
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> Deep Vastu & spatial analysis</li>
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> 1-hr session with Senior Designer</li>
                                <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-secondary" /> Fee adjusted in final project</li>
                            </ul>
                            <Link to="/services" className="w-full py-4 text-center block bg-secondary text-primary font-space uppercase tracking-widest font-bold hover:bg-white transition-colors">Book Now</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-primary text-white">
                <div className="container-custom max-w-3xl">
                    <div className="text-center mb-16">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary mb-4">Questions Answered</h4>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold">Aura AI FAQ</h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            { q: "How accurate is the estimated budget generated by the AI?", a: "The AI calculates costs based on our real-time factory catalog using precise material constraints extracted from your scan. It is typically accurate within ±10%." },
                            { q: "Is my floor plan and data secure?", a: "Yes. All uploaded images are processed instantly and deleted upon session closure. They are never used to train global models." },
                            { q: "Do I need technical skills to use this?", a: "Not at all. Just upload a quick photo with your phone or draw a rough sketch on paper. Aura does the heavy lifting." }
                        ].map((faq, idx) => (
                            <div key={idx} className="border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
                                <h4 className="font-inter font-bold text-lg mb-2 text-secondary">{faq.q}</h4>
                                <p className="font-inter text-white/70 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-secondary text-primary text-center">
                <div className="container-custom">
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-6 italic">Ready to see the future of your home?</h2>
                    <p className="max-w-2xl mx-auto mb-10 text-lg opacity-80 font-inter">No apps to download. No confusing tools. Just upload and let the magic happen.</p>
                    <button onClick={() => window.scrollTo(0, 0)} className="btn-primary bg-primary text-white border-none shadow-xl hover:bg-black uppercase tracking-widest text-xs px-12 py-5">
                        Start Designing Free
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AuraAI;
