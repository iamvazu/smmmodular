import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Youtube, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-20 pb-10 border-t border-secondary/10">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
                    <div className="space-y-6 lg:col-span-2">
                        <Link to="/" className="inline-block">
                            <img src="images/SMM-Logo.png" alt="SMM Modular Furniture" className="h-16 w-auto object-contain" />
                        </Link>
                        <p className="text-white/60 font-inter text-sm leading-relaxed max-w-sm">
                            SMM Modular Furniture has been redefining interior design in Bangalore since 2004. We combine traditional craftsmanship with modern technology.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://youtube.com/@smmmodular" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all">
                                <Youtube size={18} />
                            </a>
                            <a href="https://facebook.com/share/1Bftq6fAyt/" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="https://instagram.com/smm_modular" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-secondary hover:text-secondary transition-all">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6 lg:col-span-1">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'Services', 'Our Factory', 'Portfolio', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-white/70 hover:text-white hover:pl-2 transition-all duration-300 text-sm font-inter">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-6 lg:col-span-1">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary">Our Expertise</h4>
                        <ul className="space-y-4">
                            {['Residential', 'Commercial', 'Corporate', 'Modular Kitchens', 'Bespoke Wardrobes'].map((item) => (
                                <li key={item}>
                                    <span className="text-white/70 hover:text-white transition-all duration-300 text-sm font-inter cursor-pointer">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Locations */}
                    <div className="space-y-6 lg:col-span-1">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary">Locations</h4>
                        <ul className="space-y-4">
                            {['Bangalore', 'Mysore', 'Coimbatore', 'Hyderabad', 'Chennai', 'Kochi', 'Mangalore'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Bangalore' ? '/' : `/location/${item.toLowerCase()}`} className="text-white/70 hover:text-white hover:pl-2 transition-all duration-300 text-sm font-inter">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6 lg:col-span-1">
                        <h4 className="font-space text-xs font-bold uppercase tracking-widest text-secondary">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm text-white/70">
                                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                                <span>No.692/5/5/1, Agrahara,<br />Sampigehalli, Bangalore<br />Karnataka 560064</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-white/70 mt-4">
                                <Phone size={18} className="text-secondary shrink-0" />
                                <span>+91 76249 97792</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-white/70 mt-4">
                                <Mail size={18} className="text-secondary shrink-0" />
                                <span className="truncate" title="smmmodularfurniture@gmail.com">smmmodular...</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-white/40 text-[10px] uppercase tracking-widest font-space">
                    <p>© 2026 SMM Modular Furniture. All Rights Reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-secondary transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
