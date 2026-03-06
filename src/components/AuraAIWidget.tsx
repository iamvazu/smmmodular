import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Wand2, Compass, Download, Loader2, ArrowRight, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Eye, Calendar, Clock, X, Send, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackAuraEvent } from '../lib/analytics';
import { analyzeSketch, generateRenders } from '../lib/geminiService';
import { captureLead } from '../lib/apiClient';
import { generateAuraPDF } from '../lib/pdfService';
import type { AnalysisResult, RenderVariation } from '../types/aura';

interface AuraAIWidgetProps {
    variant?: 'hero' | 'floating' | 'fullscreen';
    showHeroText?: boolean;
}

export function AuraAIWidget({ variant = 'hero', showHeroText = true }: AuraAIWidgetProps) {
    const navigate = useNavigate();
    const [step, setStep] = useState<'upload' | 'analyzing' | 'vastu' | 'rendering' | 'result'>('upload');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedBase64, setUploadedBase64] = useState<string>('');
    const [roomType, setRoomType] = useState('living_room');
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');

    // AI Results
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [renders, setRenders] = useState<RenderVariation[]>([]);
    const [activeRenderIndex, setActiveRenderIndex] = useState(0);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [showVastuDetails, setShowVastuDetails] = useState(false);
    const [vastuLock, setVastuLock] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState('modern');
    const [selectedLighting, setSelectedLighting] = useState('morning');
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const samplePhotos = [
        { id: 1, type: 'entire_home', url: '/images/samples/detailed_plan.png', label: 'Detailed Floor Plan' },
        { id: 2, type: 'living_room', url: '/images/samples/raw_room.jpg', label: 'Construction Room' },
        { id: 3, type: 'entire_home', url: '/images/samples/colored_plan.jpg', label: 'Colored Layout' },
        { id: 4, type: 'entire_home', url: '/images/samples/arch_plan.jpg', label: 'Architectural Plan' },
    ];

    // Booking State
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingData, setBookingData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Only trigger auto-start if we are in fullscreen mode (the dedicated page)
        if (variant === 'fullscreen') {
            const pendingImage = sessionStorage.getItem('aura_pending_image');
            const pendingRoom = sessionStorage.getItem('aura_pending_room');
            if (pendingImage) {
                sessionStorage.removeItem('aura_pending_image');
                sessionStorage.removeItem('aura_pending_room');
                setUploadedImage(pendingImage);
                setUploadedBase64(pendingImage);
                if (pendingRoom) setRoomType(pendingRoom);

                // Construct a fake File object for the process
                const file = new File([], "sketch.png", { type: "image/png" });
                startAIProcess(file, pendingImage, pendingRoom || roomType);
            }
        }
    }, [variant]);

    const startAIProcess = async (file: File, base64Data: string, selectedRoomType: string) => {
        try {
            setError(null);
            setStep('analyzing');
            setStatusMessage('Scanning Spatial Topology...');

            const rawBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

            // 1. Spatial + Vastu Analysis
            trackAuraEvent('Sketch Uploaded', {
                room_type: selectedRoomType,
                style: selectedStyle,
                vastu_lock: vastuLock
            });

            // Pass Vastu Lock logic in user prompt
            const extraPrompt = `${vastuLock ? "PRESERVE VASTU STRUCTURE: Do not move walls or doors." : ""} Theme: ${selectedStyle}. Lighting: ${selectedLighting}.`;
            const analysisResult = await analyzeSketch(rawBase64, selectedRoomType, extraPrompt);
            setAnalysis(analysisResult);

            setStep('vastu');
            trackAuraEvent('Vastu Analysis Viewed', { score: analysisResult.vastu_score });

            // Pause for analysis read
            await new Promise(r => setTimeout(r, 4000));

            // 2. Generate Render Variations
            setStep('rendering');
            setStatusMessage('Synthesizing Architectural Variations...');
            const renderResults = await generateRenders(rawBase64, analysisResult, extraPrompt);
            setRenders(renderResults);
            setStep('result');
        } catch (err: any) {
            console.error("AI processing error:", err);
            setError(err?.message || "Service Temporarily Unavailable");
            setStep('upload');
        }
    };

    const handleRefinement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refinementPrompt.trim() || !uploadedBase64 || isRefining) return;

        try {
            setIsRefining(true);
            trackAuraEvent('Refinement Requested', { prompt: refinementPrompt });

            // Re-run generation with the refinement context
            const rawBase64 = uploadedBase64.replace(/^data:image\/\w+;base64,/, '');
            const refinedResults = await generateRenders(rawBase64, analysis!, refinementPrompt);

            setRenders(prev => [...refinedResults, ...prev]); // Add new ones to top
            setActiveRenderIndex(0);
            setRefinementPrompt('');
        } catch (err: any) {
            console.error("Refinement error:", err);
            alert("Failed to refine image. Please try a different instruction.");
        } finally {
            setIsRefining(false);
        }
    };

    const fetchAsBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleSampleClick = async (sample: any) => {
        try {
            setError(null);
            setStep('analyzing');
            setStatusMessage('Loading Sample Asset...');

            const b64 = await fetchAsBase64(sample.url);

            setUploadedImage(b64);
            setUploadedBase64(b64);
            setRoomType(sample.type);

            if (variant === 'hero') {
                sessionStorage.setItem('aura_pending_image', b64);
                sessionStorage.setItem('aura_pending_room', sample.type);
                navigate('/aura-ai');
                return;
            }

            const file = new File([], "sample.png", { type: "image/png" });
            startAIProcess(file, b64, sample.type);
        } catch (err) {
            console.error("Sample load error:", err);
            setError("Failed to load sample image. Please check your connection.");
            setStep('upload');
        }
    };

    const MappingView = ({ image, objects }: { image: string, objects: any[] }) => {
        const [imageBounds, setImageBounds] = useState({ top: 0, left: 0, width: 100, height: 100 });
        const imgRef = useRef<HTMLImageElement>(null);

        const updateBounds = () => {
            if (!imgRef.current) return;
            const { clientWidth, clientHeight, naturalWidth, naturalHeight } = imgRef.current;
            if (!naturalWidth || !naturalHeight) return;

            const imageAspect = naturalWidth / naturalHeight;
            const containerAspect = clientWidth / clientHeight;

            let renderWidth, renderHeight, renderLeft, renderTop;

            if (imageAspect > containerAspect) {
                renderWidth = clientWidth;
                renderHeight = clientWidth / imageAspect;
                renderLeft = 0;
                renderTop = (clientHeight - renderHeight) / 2;
            } else {
                renderHeight = clientHeight;
                renderWidth = clientHeight * imageAspect;
                renderTop = 0;
                renderLeft = (clientWidth - renderWidth) / 2;
            }

            setImageBounds({
                top: (renderTop / clientHeight) * 100,
                left: (renderLeft / clientWidth) * 100,
                width: (renderWidth / clientWidth) * 100,
                height: (renderHeight / clientHeight) * 100
            });
        };

        useEffect(() => {
            updateBounds();
            window.addEventListener('resize', updateBounds);
            return () => window.removeEventListener('resize', updateBounds);
        }, [image]);

        return (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                    ref={imgRef}
                    src={image}
                    alt="Mapping Source"
                    className="w-full h-full object-contain"
                    onLoad={updateBounds}
                />

                <div className="absolute inset-0 pointer-events-none">
                    <AnimatePresence>
                        {objects.map((obj, i) => {
                            const [ymin, xmin, ymax, xmax] = obj.bbox;

                            const boxTop = imageBounds.top + (ymin / 1000) * imageBounds.height;
                            const boxLeft = imageBounds.left + (xmin / 1000) * imageBounds.width;
                            const boxWidth = ((xmax - xmin) / 1000) * imageBounds.width;
                            const boxHeight = ((ymax - ymin) / 1000) * imageBounds.height;

                            return (
                                <motion.div key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute border-2 border-secondary bg-secondary/10 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] backdrop-blur-[1px]"
                                    style={{
                                        top: `${boxTop}%`,
                                        left: `${boxLeft}%`,
                                        width: `${boxWidth}%`,
                                        height: `${boxHeight}%`,
                                    }}>
                                    <div className="bg-secondary text-primary text-[8px] font-bold px-2 py-0.5 uppercase whitespace-nowrap -top-5 absolute rounded shadow-xl border border-white/20">
                                        {obj.object}
                                    </div>
                                    {obj.dimensions && (
                                        <div className="bg-black/90 text-secondary text-[7px] font-space px-1.5 py-0.5 rounded-sm border border-secondary/30 mt-1 shadow-lg">
                                            {obj.dimensions}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;

                if (variant === 'hero') {
                    // Store and Redirect
                    sessionStorage.setItem('aura_pending_image', dataUrl);
                    sessionStorage.setItem('aura_pending_room', roomType);
                    navigate('/aura-ai');
                    return;
                }

                setUploadedImage(dataUrl);
                setUploadedBase64(dataUrl);
                startAIProcess(file, dataUrl, roomType);
            };
            reader.readAsDataURL(file);
        }
    }, [roomType]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxFiles: 1,
    });

    const resetProcess = () => {
        setUploadedImage(null);
        setUploadedBase64('');
        setAnalysis(null);
        setRenders([]);
        setActiveRenderIndex(0);
        setStep('upload');
        setError(null);
        setIsSuccess(false);
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!analysis) return;

        setIsSubmitting(true);
        try {
            await captureLead({
                session_id: `aura-${Date.now()}`,
                name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email,
                city: 'Online (Aura AI)',
                room_type: analysis.roomType,
                vastu_score: analysis.vastu_score,
                user_sketch: uploadedBase64,
                generated_render: renders[activeRenderIndex]?.url,
                preferred_date: bookingData.date,
                preferred_time: bookingData.time
            });

            trackAuraEvent('Consultation Booked', {
                name: bookingData.name,
                room_type: analysis.roomType
            });

            // Trigger PDF Generation
            await generateAuraPDF(
                { name: bookingData.name, phone: bookingData.phone, email: bookingData.email },
                uploadedBase64,
                renders,
                analysis
            );

            setIsSuccess(true);
            setTimeout(() => {
                setIsBookingModalOpen(false);
                setIsSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Booking error:", err);
            alert("Failed to schedule consultation. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const BookingModal = () => (
        <AnimatePresence>
            {isBookingModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-zinc-900 border border-secondary/30 rounded-[2.5rem] p-8 md:p-12 max-w-xl w-full shadow-[0_0_100px_-20px_rgba(212,175,55,0.2)]"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-playfair font-bold text-white">Project Design Report</h3>
                                <p className="text-secondary text-xs font-space uppercase tracking-[0.2em] mt-2">Unlock 4K Renders & Vastu Audit PDF</p>
                            </div>
                            <button onClick={() => setIsBookingModalOpen(false)} className="text-white/40 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="text-secondary" size={40} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-playfair font-bold text-white mb-2">Report Generated!</h4>
                                    <p className="text-white/60 font-inter leading-relaxed">Your high-resolution project portfolio is downloading. Our design team will contact you for a technical review.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleBookingSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-white/50 font-space uppercase tracking-widest ml-1">Full Name</label>
                                        <input required type="text" value={bookingData.name} onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-secondary transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-white/50 font-space uppercase tracking-widest ml-1">Phone Number</label>
                                        <input required type="tel" value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-secondary transition-colors" placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-white/50 font-space uppercase tracking-widest ml-1">Email Address</label>
                                    <input required type="email" value={bookingData.email} onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-secondary transition-colors" placeholder="john@example.com" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[10px] text-white/50 font-space uppercase tracking-widest ml-1">Preferred Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" size={18} />
                                            <input required type="date" value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-secondary transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[10px] text-white/50 font-space uppercase tracking-widest ml-1">Preferred Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" size={18} />
                                            <input required type="time" value={bookingData.time} onChange={e => setBookingData({ ...bookingData, time: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-secondary transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 mt-2">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                        <img src={renders[activeRenderIndex]?.url || uploadedBase64} className="w-full h-full object-cover" alt="Packaged Render" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white/40 font-space uppercase tracking-widest">Aura Portfolio v1.0</p>
                                        <p className="text-white font-bold text-xs">{isSubmitting ? 'Compiling PDF...' : 'Instant Download Included'}</p>
                                    </div>
                                    {isSubmitting ? <Loader2 className="animate-spin text-secondary" size={20} /> : <CheckCircle2 className="text-secondary" size={20} />}
                                </div>

                                <button disabled={isSubmitting} type="submit" className="w-full bg-secondary text-primary font-space font-bold uppercase tracking-[0.2em] py-6 rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 mt-4">
                                    {isSubmitting ? "Processing Lead..." : "Download & Book Consult"} <ArrowRight size={18} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const nextRender = () => setActiveRenderIndex(prev => (prev + 1) % renders.length);
    const prevRender = () => setActiveRenderIndex(prev => (prev - 1 + renders.length) % renders.length);

    const Lightbox = () => (
        <AnimatePresence>
            {lightboxImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-7xl max-h-[90vh] w-full"
                    >
                        <img src={lightboxImage} alt="Fullscreen Preview" className="w-full h-full object-contain" />
                        <button
                            className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 font-space uppercase tracking-widest text-xs"
                            onClick={() => setLightboxImage(null)}
                        >
                            Close Preview <CheckCircle2 size={16} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const VastuAnalysisFlow = ({ analysis }: { analysis: AnalysisResult }) => (
        <div className="space-y-10 pt-10 border-t border-white/10">
            <div className="text-center">
                <h4 className="text-2xl font-playfair font-bold text-white mb-2">Vastu Audit & Remedial Path</h4>
                <p className="text-secondary text-[10px] font-space uppercase tracking-[0.2em]">Full Expert Analysis</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Detailed Violations */}
                <section>
                    <h5 className="text-white font-bold mb-4 flex items-center gap-2 border-l-2 border-red-500 pl-3 uppercase text-xs tracking-widest">
                        Identified Discrepancies
                    </h5>
                    <div className="grid gap-4">
                        {analysis.violations.map((v, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-red-400 font-bold text-[10px] uppercase tracking-wider">{v.item}</span>
                                    <span className="bg-red-500/10 text-red-400 text-[8px] px-2 py-0.5 rounded font-space uppercase">Correction Required</span>
                                </div>
                                <p className="text-white text-sm mb-3 leading-relaxed">{v.issue}</p>
                                <div className="flex items-center gap-2 text-[10px] text-white/40 italic">
                                    <AlertTriangle size={12} className="text-red-400/40" />
                                    Impact: {v.impact}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Detailed Remedies */}
                <section>
                    <h5 className="text-white font-bold mb-4 flex items-center gap-2 border-l-2 border-green-500 pl-3 uppercase text-xs tracking-widest">
                        SMM Remedial Solutions
                    </h5>
                    <div className="grid gap-4">
                        {analysis.remedies.map((r, i) => (
                            <div key={i} className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-secondary font-bold text-[10px] uppercase tracking-wider">Solution {i + 1}</span>
                                    <span className="bg-secondary/10 text-secondary text-[8px] px-2 py-0.5 rounded font-space uppercase tracking-widest">Recommended</span>
                                </div>
                                <p className="text-white text-sm mb-1 leading-relaxed">{r.action}</p>
                                <p className="text-white/50 text-xs mb-4 font-inter leading-relaxed">{r.reason}</p>
                                {r.smm_product_boost && (
                                    <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-secondary/10">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 size={14} className="text-secondary" />
                                            <span className="text-white text-[10px] font-bold">{r.smm_product_boost}</span>
                                        </div>
                                        <button className="text-[9px] text-secondary font-bold uppercase tracking-widest hover:underline">View Product</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );

    return (
        <div className={`aura-widget bg-zinc-950/80 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 border border-white/10 w-full transition-all duration-700 ${step !== 'upload' ? 'max-w-6xl mx-auto shadow-[0_64px_128px_-32px_rgba(0,0,0,1)]' : 'max-w-md mx-auto'
            } ${variant === 'floating' ? 'shadow-2xl' : ''}`}>
            <Lightbox />
            <BookingModal />
            <div className={`flex items-center ${variant === 'hero' ? 'justify-end' : 'justify-between'} mb-6`}>
                {variant !== 'hero' && (
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-white flex items-center gap-2">
                        <Wand2 className="text-secondary" /> Aura AI <span className="text-secondary">✨</span>
                    </h3>
                )}
                {step !== 'upload' && (
                    <button onClick={resetProcess} className="text-xs text-secondary font-space uppercase tracking-widest hover:text-white transition-colors">Start Over</button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {/* === STEP 1: UPLOAD === */}
                {step === 'upload' && (
                    <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                        {showHeroText && (
                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white">See Your Dream Home in 30 Seconds</h2>
                                <p className="text-secondary/60 font-space uppercase tracking-[0.2em] text-[10px]">Instant AI Design • Vastu Audit • SMM Catalog Integration</p>
                            </div>
                        )}

                        {/* Drop Zone */}
                        <div {...getRootProps()}
                            className={`border-2 border-dashed ${isDragActive ? 'border-secondary bg-secondary/10' : 'border-white/10 bg-white/5 hover:border-secondary/50 hover:bg-white/10'} rounded-2xl p-6 md:p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group shadow-xl`}>
                            <input {...getInputProps()} />
                            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                <Upload size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-playfair text-xl font-bold">Upload sketch, photo, or plan</p>
                                <p className="text-white/40 text-[10px] font-inter uppercase tracking-widest">JPG • PNG • WebP</p>
                            </div>
                        </div>

                        {/* Pre-Processing Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-[9px] text-white/40 font-space uppercase tracking-widest ml-1">Room Type</label>
                                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                                    className="w-full bg-white/5 text-white text-xs border border-white/10 rounded-xl p-3 outline-none focus:border-secondary transition-all cursor-pointer">
                                    <option value="living_room">Living Room</option>
                                    <option value="bedroom">Master Bedroom</option>
                                    <option value="kitchen">Modular Kitchen</option>
                                    <option value="entire_home">Full Floor Plan</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-white/40 font-space uppercase tracking-widest ml-1">Design Style</label>
                                <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}
                                    className="w-full bg-white/5 text-white text-xs border border-white/10 rounded-xl p-3 outline-none focus:border-secondary transition-all cursor-pointer">
                                    <option value="modern">Modern Luxury</option>
                                    <option value="indian">Contemporary Indian</option>
                                    <option value="scandi">Scandinavian</option>
                                    <option value="minimal">Minimalist</option>
                                </select>
                            </div>
                            <div className="space-y-1 sm:col-span-2 md:col-span-1">
                                <label className="text-[9px] text-white/40 font-space uppercase tracking-widest ml-1">Vastu Mode</label>
                                <button
                                    onClick={() => setVastuLock(!vastuLock)}
                                    className={`w-full flex items-center justify-between border rounded-xl p-3 text-xs transition-all ${vastuLock ? 'border-secondary/50 bg-secondary/10 text-secondary' : 'border-white/10 bg-white/5 text-white/50'}`}
                                >
                                    <span className="font-space font-bold uppercase tracking-widest">Vastu Lock</span>
                                    <CheckCircle2 size={14} className={vastuLock ? 'opacity-100' : 'opacity-0'} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-white">2,500+</p>
                                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Designs Sent</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-xl font-bold text-white">15 Min</p>
                                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Expert Delivery</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-secondary font-bold font-space uppercase tracking-widest">First 3 Designs Free</p>
                                <p className="text-[9px] text-white/40">No credit card required</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <label className="text-[10px] text-white/40 font-space uppercase tracking-[0.2em] mb-4 block text-center">Or Try a Sample Asset</label>
                            <div className="grid grid-cols-5 gap-3">
                                {samplePhotos.map(sample => (
                                    <button key={sample.id} onClick={() => handleSampleClick(sample)}
                                        className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-secondary transition-all">
                                        <img src={sample.url} alt={sample.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center space-y-4">
                                <AlertTriangle className="text-red-500 mx-auto" size={32} />
                                <p className="text-red-400 text-sm">{error}</p>
                                <button onClick={resetProcess} className="btn-primary py-3 px-8 text-[10px]">Try Again</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* === STEP 2: ANALYZING === */}
                {step === 'analyzing' && (
                    <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="py-8 space-y-6">
                        {/* Show uploaded image */}
                        {uploadedImage && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in" onClick={() => setLightboxImage(uploadedImage)}>
                                <img src={uploadedImage} alt="Your upload" className="w-full h-full object-contain bg-black/50" />
                                <div className="absolute top-4 left-4 bg-secondary/90 text-primary text-[10px] font-space uppercase tracking-[0.2em] px-4 py-1.5 rounded-full font-bold">
                                    Your Input
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="text-white" size={32} />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="relative">
                                <motion.div
                                    className="w-20 h-20 rounded-full border-t-2 border-secondary"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary" size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl text-white font-playfair font-bold tracking-tight">Synthesizing Topology</h4>
                                <p className="text-white/40 font-space uppercase tracking-widest mt-2 text-xs">{statusMessage}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === STEP 3: VASTU RESULTS === */}
                {step === 'vastu' && analysis && (
                    <motion.div key="vastu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="py-4 space-y-8">

                        {/* Intelligence Flags */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {analysis.flags?.map((flag, idx) => (
                                <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-space uppercase tracking-widest font-bold ${flag.status === 'Good' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                                    flag.status === 'Warning' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' :
                                        'border-blue-500/30 bg-blue-500/10 text-blue-400'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${flag.status === 'Good' ? 'bg-green-500' : flag.status === 'Warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                    {flag.category}: {flag.text}
                                </div>
                            ))}
                        </div>

                        {/* Uploaded Image Small */}
                        {uploadedImage && (
                            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 group bg-black/50" onClick={() => setLightboxImage(uploadedImage)}>
                                <MappingView image={uploadedImage} objects={analysis.objects} />
                                <div className="absolute top-4 left-4 bg-secondary/90 text-primary text-[10px] font-space uppercase tracking-widest px-4 py-1.5 rounded-full font-bold shadow-2xl z-20">
                                    Spatial Analysis Mapping
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            <div
                                onClick={() => setShowVastuDetails(true)}
                                className="text-center space-y-4 bg-white/5 p-8 rounded-[2rem] border border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
                            >
                                <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto relative group-hover:scale-110 transition-transform">
                                    <Compass className="text-secondary" size={48} />
                                </div>
                                <div>
                                    <h4 className="text-2xl text-white font-playfair font-bold">Vastu Compliance</h4>
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        <div className="flex items-end gap-1 text-secondary">
                                            <span className="text-5xl font-bold">{analysis.vastu_score}</span>
                                            <span className="text-xl pb-1.5 opacity-60">/100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center text-center space-y-4">
                                <p className="text-secondary text-[10px] font-space uppercase tracking-[0.2em]">Estimate Budget</p>
                                <div className="space-y-1">
                                    <h5 className="text-4xl text-white font-bold">₹{analysis.estimated_price?.toLocaleString('en-IN')}</h5>
                                    <p className="text-white/40 text-[10px] uppercase font-space tracking-widest">EMI Starts at ₹{analysis.emi_estimate?.toLocaleString('en-IN')}/mo</p>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-green-400 text-[10px] font-space font-bold uppercase tracking-widest bg-green-500/10 py-2 rounded-full border border-green-500/20">
                                    <CheckCircle2 size={12} /> Within Selected Budget
                                </div>
                            </div>
                        </div>

                        <p className="text-white/40 text-xs text-center font-inter px-4 italic leading-relaxed">{analysis.summary}</p>
                        <p className="text-secondary text-[10px] text-center font-space uppercase tracking-[0.4em] font-bold animate-pulse">Generating Decision-Ready Designs...</p>
                    </motion.div>
                )}

                {/* === STEP 4: RENDERING === */}
                {step === 'rendering' && (
                    <motion.div key="rendering" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 space-y-10">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center relative shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)]">
                                <Loader2 className="animate-spin text-secondary" size={32} />
                                <div className="absolute inset-0 rounded-2xl border border-secondary/20 animate-pulse" />
                            </div>
                            <div className="max-w-md mx-auto">
                                <h4 className="text-2xl text-white font-playfair font-bold">Synthesizing Architectural Variations</h4>
                                <p className="text-white/40 font-inter mt-3 text-sm leading-relaxed">{statusMessage}</p>
                                <div className="mt-8 flex gap-2 justify-center">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-secondary/30"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === STEP 5: FINAL RESULTS === */}
                {step === 'result' && analysis && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-5">

                        {/* Before / After Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Original Upload */}
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group bg-black/50" onClick={() => setLightboxImage(uploadedImage)}>
                                <MappingView image={uploadedImage || ''} objects={analysis.objects} />
                                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-space uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 z-20">
                                    Original Input
                                </div>
                            </div>

                            {/* AI Render */}
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-secondary/30 group cursor-zoom-in"
                                onClick={() => setLightboxImage(renders[activeRenderIndex]?.url)}>
                                {renders.length > 0 ? (
                                    <img src={renders[activeRenderIndex]?.url || ''} alt="AI Render" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/50 flex items-center justify-center text-white/40 text-xs italic">
                                        Synthesizing...
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-secondary/90 text-primary text-[10px] font-space uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
                                    After
                                </div>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="text-white" size={32} />
                                </div>
                            </div>
                        </div>

                        {/* Render Variation Selector */}
                        {renders.length > 1 && (
                            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                                <button onClick={prevRender} className="text-white/60 hover:text-secondary transition-colors"><ChevronLeft size={20} /></button>
                                <div className="text-center">
                                    <p className="text-white text-sm font-inter font-bold">{renders[activeRenderIndex]?.name}</p>
                                    <p className="text-white/40 text-[10px] font-space uppercase tracking-widest">
                                        {activeRenderIndex + 1} of {renders.length} variations
                                    </p>
                                </div>
                                <button onClick={nextRender} className="text-white/60 hover:text-secondary transition-colors"><ChevronRight size={20} /></button>
                            </div>
                        )}

                        {/* Iterative Refinement Bar (ReimagineHome Style) */}
                        <div className="py-8 space-y-4">
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-space uppercase tracking-widest px-1">
                                <ImageIcon size={12} />
                                <span>Refine with SMM Design Assistant</span>
                            </div>
                            <form onSubmit={handleRefinement} className="relative group">
                                <input
                                    type="text"
                                    value={refinementPrompt}
                                    onChange={(e) => setRefinementPrompt(e.target.value)}
                                    placeholder="Try: 'Make the cabinets darker' or 'Add more indirect lighting'..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pr-16 text-white text-sm outline-none focus:border-secondary/50 focus:bg-white/10 transition-all shadow-lg"
                                />
                                <button
                                    type="submit"
                                    disabled={isRefining || !refinementPrompt.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all font-bold"
                                >
                                    {isRefining ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                            <p className="text-[10px] text-white/30 italic text-center">Structure stays fixed: walls, windows, and ceiling lines are preserved.</p>
                        </div>

                        {/* Vastu Flow Down */}
                        {(variant === 'fullscreen' || showVastuDetails) && (
                            <VastuAnalysisFlow analysis={analysis} />
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/10">
                            <button onClick={() => setIsBookingModalOpen(true)} className="flex items-center justify-center gap-3 bg-secondary text-primary font-space font-bold uppercase tracking-[0.2em] text-[10px] py-6 rounded-2xl hover:bg-white transition-all shadow-xl">
                                <FileText size={16} /> Generate PDF Report
                            </button>
                            <button onClick={() => {
                                trackAuraEvent('WhatsApp Share Clicked');
                                const text = `Check out my AI-designed ${analysis.roomType} by SMM Modular Furniture! Vastu Score: ${analysis.vastu_score}/100`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }} className="flex items-center justify-center gap-2 border border-white/20 text-white font-space font-bold uppercase tracking-widest text-[10px] py-6 rounded-2xl hover:bg-white/5 transition-all">
                                Share on WhatsApp
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
