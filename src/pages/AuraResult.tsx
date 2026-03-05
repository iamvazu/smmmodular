import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertTriangle, Download, Share2, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { trackAuraEvent } from '../lib/analytics';
import Navbar from '../components/Navbar';

export default function AuraResult() {
    const { sessionId } = useParams();
    const [loading, setLoading] = useState(true);

    // Mock detailed report state
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        // Track that the user viewed the detailed report
        trackAuraEvent('Detailed Report Viewed', { session_id: sessionId });

        // In a real integration, we'd fetch `/api/v1/session/${sessionId}` here.
        // For the UI demonstration, we simulate fetching the detailed report from the database:
        setTimeout(() => {
            setReport({
                original_plan: "/images/services/commercial-projects/img(1).webp", // mock floorplan
                vastu: {
                    score: 85,
                    violations: [
                        { issue: "Kitchen orientation is sub-optimal.", suggestion: "Relocate stove to South-East corner (Agni)." }
                    ],
                    positive: [
                        "Master bedroom is perfectly located in South-West.",
                        "Main entrance faces East, promoting prosperity."
                    ],
                    direction: "East-facing"
                },
                rooms: [
                    { name: "Living Room", dimensions: "15' x 20'", render_url: "/images/services/residential-projects/img(18).webp", style: "Modern Luxury" },
                    { name: "Master Bedroom", dimensions: "14' x 16'", render_url: "/images/services/residential-projects/img(22).webp", style: "Scandinavian" }
                ],
                estimate: 650000
            });
            setLoading(false);
        }, 1500);

    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
                <div className="w-16 h-16 border-t-2 border-secondary rounded-full animate-spin mb-6"></div>
                <h2 className="font-playfair text-3xl mb-2">Compiling Comprehensive Report</h2>
                <p className="font-inter text-white/50 text-sm">Our AI is mapping dimensions and generating room-by-room renders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-warmWhite pb-24">
            <SEO title="Aura AI Detailed Analysis | SMM Modular" description="Detailed AI-generated Vastu report and 3D architectural renders." />
            <div className="bg-primary text-white">
                <Navbar />
                <div className="container-custom py-12 pt-32">
                    <Link to="/aura-ai" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors text-sm font-space uppercase tracking-widest mb-8">
                        <ArrowLeft size={16} /> Back to Aura AI
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4">Complete Home Analysis</h1>
                    <p className="text-white/60 font-inter max-w-2xl text-lg">AI-generated Vastu report and 3D architectural renders based on your floor plan.</p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Vastu & Details */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                            <h3 className="font-playfair text-2xl font-bold mb-6 text-primary border-b pb-4 border-black/5">Vastu Shastra Report</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-5xl font-bold text-secondary">{report.vastu.score}</div>
                                <div className="text-xs uppercase font-space tracking-widest text-darkGray/50 font-bold">Overall<br />Compliance</div>
                            </div>

                            <div className="space-y-4">
                                {report.vastu.positive.map((pos: string, idx: number) => (
                                    <div key={idx} className="flex gap-3 text-sm font-inter text-darkGray">
                                        <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                        <p>{pos}</p>
                                    </div>
                                ))}
                                {report.vastu.violations.map((viol: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 text-sm font-inter text-darkGray bg-red-50 p-4 rounded-xl">
                                        <AlertTriangle className="text-red-500 shrink-0" size={20} />
                                        <div>
                                            <p className="font-bold mb-1 text-red-900">{viol.issue}</p>
                                            <p className="text-red-700/80 text-xs">Correction: {viol.suggestion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-primary text-white p-8 rounded-3xl shadow-xl">
                            <h3 className="font-playfair text-xl font-bold mb-2">Estimate Summary</h3>
                            <p className="text-xs uppercase font-space tracking-widest text-white/50 mb-6">Based on AI dimension mapping</p>
                            <div className="text-4xl font-bold text-secondary mb-8">₹{report.estimate.toLocaleString('en-IN')}</div>
                            <div className="space-y-3">
                                <button onClick={() => trackAuraEvent('Report Downloaded')} className="btn-secondary w-full flex items-center justify-center gap-2 py-3 bg-white text-primary">
                                    <Download size={18} /> Download Full PDF
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 py-3 text-white border border-white/20 hover:bg-white/10 rounded-full font-space text-xs uppercase tracking-widest transition-colors">
                                    <Phone size={18} /> Call Designer
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Floor Plan & Renders */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Renders */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h2 className="font-playfair text-3xl font-bold mb-6 text-primary">3D Room Visualizations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {report.rooms.map((room: any, i: number) => (
                                    <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/3] shadow-md border border-black/5">
                                        <img src={room.render_url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h4 className="text-2xl font-playfair font-bold text-white mb-1">{room.name}</h4>
                                            <div className="flex justify-between text-xs text-secondary font-space uppercase tracking-widest">
                                                <span>{room.style}</span>
                                                <span>{room.dimensions}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
