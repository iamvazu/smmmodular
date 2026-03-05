import { useState, useCallback, useEffect } from 'react';
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
}

export function AuraAIWidget({ variant = 'hero' }: AuraAIWidgetProps) {
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
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const samplePhotos = [
        { id: 1, type: 'living_room', url: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=300', label: 'Empty Living' },
        { id: 2, type: 'bedroom', url: 'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?auto=format&fit=crop&q=80&w=300', label: 'Bare Bedroom' },
        { id: 3, type: 'kitchen', url: 'https://images.unsplash.com/photo-1556912177-c54030639a03?auto=format&fit=crop&q=80&w=300', label: 'Old Kitchen' },
        { id: 4, type: 'entire_home', url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=300', label: '2D Floorplan' },
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

            // Strip the data URL prefix
            const rawBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

            // 1. Spatial + Vastu Analysis
            trackAuraEvent('Sketch Uploaded', { room_type: selectedRoomType, file_size: file.size, file_type: file.type });
            const analysisResult = await analyzeSketch(rawBase64, selectedRoomType);
            setAnalysis(analysisResult);
            setStep('vastu');
            trackAuraEvent('Vastu Analysis Viewed', { score: analysisResult.vastu_score, violations_count: analysisResult.violations?.length || 0 });

            // Brief pause for user to see the Vastu score
            await new Promise(r => setTimeout(r, 4000));

            // 2. Generate Render Variations
            setStep('rendering');
            setStatusMessage('Synthesizing Architectural Variations...');
            const renderResults = await generateRenders(rawBase64, analysisResult);
            setRenders(renderResults);
            setStep('result');
            trackAuraEvent('Render Generated', { variations_count: renderResults.length });

        } catch (err: any) {
            console.error("AI processing error:", err);
            setError(err?.message || "Something went wrong. Please try again.");
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

    const handleSampleClick = (sample: any) => {
        setUploadedImage(sample.url);
        setUploadedBase64(sample.url); // Note: For real prod, this should fetch as base64
        setRoomType(sample.type);

        if (variant === 'hero') {
            sessionStorage.setItem('aura_pending_image', sample.url);
            sessionStorage.setItem('aura_pending_room', sample.type);
            navigate('/aura-ai');
            return;
        }

        // Mock a file for samples
        const file = new File([], "sample.png", { type: "image/png" });
        startAIProcess(file, sample.url, sample.type);
    };

    const BoundingBoxes = ({ objects, visible }: { objects: any[], visible: boolean }) => (
        <AnimatePresence>
            {visible && objects.map((obj, i) => {
                const [ymin, xmin, ymax, xmax] = obj.bbox;
                return (
                    <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute border-2 border-secondary bg-secondary/10 flex items-center justify-center"
                        style={{
                            top: `${ymin / 10}%`,
                            left: `${xmin / 10}%`,
                            width: `${(xmax - xmin) / 10}%`,
                            height: `${(ymax - ymin) / 10}%`,
                        }}>
                        <div className="bg-secondary text-primary text-[6px] font-bold px-1 uppercase whitespace-nowrap -top-3 absolute">
                            {obj.object}
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );

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
        <div className={`aura-widget bg-zinc-950/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/10 w-full transition-all duration-700 ${step !== 'upload' ? 'max-w-6xl mx-auto shadow-[0_64px_128px_-32px_rgba(0,0,0,1)]' : 'max-w-xl mx-auto'
            } ${variant === 'floating' ? 'shadow-2xl' : ''}`}>
            <Lightbox />
            <BookingModal />
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-white flex items-center gap-2">
                    <Wand2 className="text-secondary" /> Aura AI <span className="text-secondary">✨</span>
                </h3>
                {step !== 'upload' && (
                    <button onClick={resetProcess} className="text-xs text-secondary font-space uppercase tracking-widest hover:text-white transition-colors">Start Over</button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {/* === STEP 1: UPLOAD === */}
                {step === 'upload' && (
                    <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-white/70 font-space uppercase tracking-widest">Select Room Type</label>
                            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                                className="bg-primary/50 text-white border border-secondary/30 rounded-lg p-3 outline-none focus:border-secondary transition-colors"
                                style={{ appearance: 'none' }}>
                                <option value="living_room">Living Room</option>
                                <option value="bedroom">Master Bedroom</option>
                                <option value="kitchen">Modular Kitchen</option>
                                <option value="office">Home Office</option>
                                <option value="entire_home">2D Floor Plan (Entire Home)</option>
                            </select>
                        </div>

                        <div {...getRootProps()}
                            className={`border-2 border-dashed ${isDragActive ? 'border-secondary bg-secondary/10' : 'border-secondary/50 bg-primary/30 hover:border-secondary hover:bg-primary/50'} rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4`}>
                            <input {...getInputProps()} />
                            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <Upload size={32} />
                            </div>
                            <div>
                                <p className="text-white font-inter text-lg">Drop your sketch or floor plan</p>
                                <p className="text-white/50 text-sm mt-1">or click to browse (JPG, PNG, WebP)</p>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-white/40 uppercase font-space tracking-widest">SMM Modular Furniture Design Engine</p>

                        <div className="pt-4 border-t border-white/5">
                            <label className="text-[10px] text-white/40 font-space uppercase tracking-[0.2em] mb-4 block text-center">Or Try a Sample Space</label>
                            <div className="grid grid-cols-4 gap-3">
                                {samplePhotos.map(sample => (
                                    <button
                                        key={sample.id}
                                        onClick={() => handleSampleClick(sample)}
                                        className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-secondary transition-all"
                                    >
                                        <img src={sample.url} alt={sample.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center space-y-4">
                                <AlertTriangle className="text-red-500 mx-auto" size={32} />
                                <div>
                                    <h4 className="text-white font-bold mb-1">Service Temporarily Unavailable</h4>
                                    <p className="text-white/60 text-xs font-inter leading-relaxed">
                                        {error.includes("API key") || error.includes("403") || error.includes("400")
                                            ? "Our AI engine is currently undergoing maintenance. Please try again in 5 minutes."
                                            : error}
                                    </p>
                                </div>
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
                        className="py-4 space-y-5">
                        {/* Uploaded Image Small */}
                        {uploadedImage && (
                            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in" onClick={() => setLightboxImage(uploadedImage)}>
                                <img src={uploadedImage} alt="Your upload" className="w-full h-full object-contain bg-black/50" />
                                <BoundingBoxes objects={analysis.objects} visible={true} />
                                <div className="absolute top-3 left-3 bg-secondary/90 text-primary text-[10px] font-space uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                                    Sketch Mapping
                                </div>
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="text-white" size={24} />
                                </div>
                            </div>
                        )}

                        {/* Vastu Flow Down for Step 3 if Fullscreen */}
                        {variant === 'fullscreen' ? (
                            <VastuAnalysisFlow analysis={analysis} />
                        ) : (
                            <div
                                onClick={() => setShowVastuDetails(true)}
                                className="text-center space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
                            >
                                <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto relative group-hover:scale-110 transition-transform">
                                    <Compass className="text-secondary" size={48} />
                                    <motion.div className="absolute inset-0 rounded-full border border-secondary/30"
                                        initial={{ rotate: 0 }} animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                                </div>
                                <div>
                                    <h4 className="text-2xl text-white font-playfair font-bold">Vastu Compliance Score</h4>
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        <div className="flex items-end gap-1 text-secondary">
                                            <span className="text-5xl font-bold">{analysis.vastu_score}</span>
                                            <span className="text-xl pb-1.5 opacity-60">/100</span>
                                        </div>
                                        <span className={`text-[10px] font-space uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${analysis.status === 'Auspicious' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                            analysis.status === 'Neutral' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                                'border-red-500/50 text-red-400 bg-red-500/10'
                                            }`}>{analysis.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-secondary text-[10px] font-space uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Remedial Path <ArrowRight size={12} />
                                </div>
                            </div>
                        )}

                        <p className="text-white/40 text-xs text-center font-inter px-4">{analysis.summary}</p>
                        <p className="text-secondary text-[10px] text-center font-space uppercase tracking-[0.4em] font-bold animate-pulse">Scanning Designs...</p>
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
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in" onClick={() => setLightboxImage(uploadedImage)}>
                                <img src={uploadedImage || ''} alt="Original" className="w-full h-full object-contain bg-black/50" />
                                <BoundingBoxes objects={analysis.objects} visible={true} />
                                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-space uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                                    Sketch Mapping
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="text-white" size={24} />
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
