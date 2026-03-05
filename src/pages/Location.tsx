import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Home, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getLocationBySlug, locations } from '../data/pseo/locations';

const Location = () => {
    const { locationSlug } = useParams<{ locationSlug: string }>();
    const navigate = useNavigate();
    const locationData = getLocationBySlug(locationSlug || '');

    useEffect(() => {
        if (!locationData) {
            navigate('/', { replace: true });
        }
    }, [locationData, navigate]);

    if (!locationData) return null;

    // AEO: FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": locationData.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    // AEO: Breadcrumbs Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://smmmodular-5ce23f85d0ee.herokuapp.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": `Interior Designers in ${locationData.city}`,
                "item": `https://smmmodular-5ce23f85d0ee.herokuapp.com/location/${locationData.slug}`
            }
        ]
    };

    // AEO: HowTo Schema
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to Plan Your Interior Design in ${locationData.city}`,
        "description": locationData.heroSubheadline,
        "step": locationData.steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.desc
        }))
    };

    // pSEO Related Locations
    const relatedLocations = locations
        .filter(loc => loc.slug !== locationData.slug)
        .slice(0, 3);

    return (
        <div className="bg-white">
            <SEO
                title={locationData.title}
                description={locationData.description}
                canonical={`/location/${locationData.slug}`}
                schema={[faqSchema, breadcrumbSchema, howToSchema]}
            />

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="bg-primary pt-24 pb-4 px-6 md:px-12 xl:px-20 text-white/50 text-xs font-space tracking-widest uppercase">
                <ol className="flex items-center space-x-2">
                    <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
                    <li><ChevronRight size={12} /></li>
                    <li className="text-white">Locations</li>
                    <li><ChevronRight size={12} /></li>
                    <li className="text-secondary font-bold">{locationData.city}</li>
                </ol>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-primary text-white py-20 px-6 md:px-12 xl:px-20">
                <div className="max-w-4xl">
                    <motion.h4
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-space text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-6"
                    >
                        SMM Modular Furniture in {locationData.city}
                    </motion.h4>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold leading-tight mb-8"
                    >
                        {locationData.heroHeadline}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-white/70 font-inter leading-relaxed max-w-2xl mb-10"
                    >
                        {locationData.heroSubheadline} {locationData.description}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button className="btn-primary" onClick={() => window.location.href = 'tel:+917624997792'}>
                            Consult an Expert in {locationData.city}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-8 border-b border-black/10 pb-4">
                                Overcoming Common Interior Challenges
                            </h2>
                            <ul className="space-y-6">
                                {locationData.painPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-4 text-darkGray/70 font-inter">
                                        <ShieldCheck className="text-primary shrink-0 mt-1" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 bg-white p-10 rounded-3xl shadow-lg border border-black/5">
                            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary mb-8 text-center">
                                The SMM Advantage in {locationData.city}
                            </h2>
                            <ul className="space-y-6">
                                {locationData.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-4 font-inter font-semibold text-primary">
                                        <CheckCircle2 className="text-secondary shrink-0 mt-1" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process / How To Schema Elements */}
            <section className="section-padding bg-primary text-white">
                <div className="container-custom max-w-5xl mx-auto text-center">
                    <h4 className="font-space text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-4">Our Streamlined Execution</h4>
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-16">How We Work in {locationData.city}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {locationData.steps.map((step, index) => (
                            <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 relative">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary text-primary font-bold flex items-center justify-center rounded-full text-xl font-playfair shadow-xl">
                                    {index + 1}
                                </span>
                                <h3 className="text-xl font-playfair font-bold mt-4 mb-3">{step.title}</h3>
                                <p className="text-white/60 text-sm font-inter leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed FAQs with Semantic Structure for AEO */}
            <section className="section-padding bg-warmWhite">
                <div className="container-custom max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-4">Frequently Asked Questions</h2>
                        <p className="text-darkGray/60 font-inter">Common queries about our modular furniture and interior services in {locationData.city}.</p>
                    </div>

                    <div className="space-y-8">
                        {locationData.faqs.map((faq, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-playfair font-bold text-primary mb-4 flex gap-4">
                                    <span className="text-secondary">Q.</span>
                                    {faq.question}
                                </h3>
                                <p className="text-darkGray/70 font-inter leading-relaxed pl-8 border-l-2 border-primary/5">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related pSEO Links */}
            <section className="section-padding bg-white border-t border-black/5">
                <div className="container-custom">
                    <h3 className="text-2xl font-playfair font-bold text-primary mb-10 text-center">
                        Serving Other Cities in South India
                    </h3>
                    <div className="flex flex-wrap justify-center gap-6">
                        {relatedLocations.map((loc, index) => (
                            <a
                                key={index}
                                href={`/location/${loc.slug}`}
                                className="group flex items-center gap-4 bg-warmWhite px-6 py-4 rounded-xl border border-black/5 hover:border-secondary transition-all"
                            >
                                <Home className="text-primary group-hover:text-secondary transition-colors" size={20} />
                                <span className="font-space font-bold text-xs uppercase tracking-wider text-primary">{loc.city}</span>
                                <ArrowRight size={16} className="text-darkGray/30 group-hover:translate-x-1 group-hover:text-secondary transition-all" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Location;
