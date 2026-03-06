import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Aura AI ✨', path: '/aura-ai', isAura: true },
        { name: 'Services', path: '/services' },
        { name: 'Our Factory', path: '/our-factory' },
        { name: 'Residential', path: '/residential' },
        { name: 'Commercial', path: '/commercial' },
        { name: 'Corporate', path: '/corporate' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-primary/95 backdrop-blur-lg py-3 md:py-4 shadow-xl' : 'bg-transparent py-4 md:py-6'}`}>
            <div className="container-custom flex justify-between items-center text-white">
                {/* Logo */}
                <Link to="/" className="relative group shrink-0">
                    <img
                        src="images/SMM-Logo.png"
                        alt="SMM Modular Furniture"
                        className="h-10 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden 2xl:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`font-space text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group shrink-0 ${location.pathname === link.path ? 'text-secondary' : (link.isAura ? 'text-secondary animate-pulse hover:text-white' : 'text-white/70 hover:text-white')}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-2 left-0 h-[1px] bg-secondary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>
                    ))}
                    <a
                        href="tel:+917624997792"
                        className="flex items-center space-x-2 bg-secondary text-primary px-5 py-3 font-space text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-500 shrink-0 shadow-lg shadow-secondary/10"
                    >
                        <Phone size={12} className="fill-primary" />
                        <span className="hidden mb:inline">Consult Now</span>
                    </a>
                </div>

                {/* Tablet Navigation (Intermediate screen sizes) */}
                <div className="hidden lg:flex 2xl:hidden items-center space-x-4">
                    {navLinks.filter(l => !l.path.includes('factory') && !l.path.includes('corporate')).map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`font-space text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 relative group shrink-0 ${location.pathname === link.path ? 'text-secondary' : (link.isAura ? 'text-secondary animate-pulse hover:text-white' : 'text-white/70 hover:text-white')}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/aura-ai" className="text-secondary font-bold text-[10px] uppercase">Aura AI ✨</Link>
                    <a href="tel:+917624997792" className="bg-secondary text-primary px-3 py-2 rounded-lg text-[9px] font-bold">CONTACT</a>
                </div>

                {/* Mobile & Tablet Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    <a
                        href="tel:+917624997792"
                        className="flex items-center justify-center w-10 h-10 bg-secondary text-primary rounded-full hover:bg-white transition-all"
                    >
                        <Phone size={16} className="fill-primary" />
                    </a>
                    <button
                        className="text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-primary z-40 flex flex-col items-center justify-center space-y-8 lg:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`font-playfair text-3xl ${location.pathname === link.path ? 'text-secondary' : (link.isAura ? 'text-secondary animate-pulse' : 'text-white')}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="tel:+917624997792"
                            className="bg-secondary text-primary px-8 py-4 font-space font-bold uppercase tracking-widest"
                        >
                            Consult Now
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
