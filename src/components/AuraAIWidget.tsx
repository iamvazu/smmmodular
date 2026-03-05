import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Wand2, Compass, Download, Loader2, ArrowRight, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackAuraEvent } from '../lib/analytics';
import { analyzeSketch, generateRenders } from '../lib/geminiService';
import type { AnalysisResult, RenderVariation } from '../types/aura';

interface AuraAIWidgetProps {
    variant?: 'hero' | 'floating' | 'fullscreen';
}

export function AuraAIWidget({ variant = 'hero' }: AuraAIWidgetProps) {
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

    const startAIProcess = async (file: File, base64Data: string, selectedRoomType: string) => {
        try {
            setError(null);
            setStep('analyzing');
            setStatusMessage('Gemini 1.5 Pro is analyzing your layout...');

            // Strip the data URL prefix to get raw base64
            const rawBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

            // 1. Spatial + Vastu Analysis
            trackAuraEvent('Sketch Uploaded', { room_type: selectedRoomType, file_size: file.size, file_type: file.type });
            const analysisResult = await analyzeSketch(rawBase64, selectedRoomType);
            setAnalysis(analysisResult);
            setStep('vastu');
            trackAuraEvent('Vastu Analysis Viewed', { score: analysisResult.vastu_score, violations_count: analysisResult.violations?.length || 0 });

            // Brief pause for user to see the Vastu score
            await new Promise(r => setTimeout(r, 3000));

            // 2. Generate Render Variations
            setStep('rendering');
            setStatusMessage('Generating photorealistic renders (this may take 1-2 minutes)...');
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
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
    };

    const nextRender = () => setActiveRenderIndex(prev => (prev + 1) % renders.length);
    const prevRender = () => setActiveRenderIndex(prev => (prev - 1 + renders.length) % renders.length);

    return (
        <div className={`aura-widget bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-secondary/30 w-full ${variant === 'floating' ? 'shadow-2xl' : ''}`}>
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
                        <p className="text-center text-[10px] text-white/40 uppercase font-space tracking-widest">Powered by Gemini AI</p>

                        {error && (
                            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-xs font-inter text-center mt-4 border border-red-500/30">
                                {error}
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
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-secondary/30">
                                <img src={uploadedImage} alt="Your upload" className="w-full h-full object-contain bg-black/50" />
                                <div className="absolute top-3 left-3 bg-secondary/90 text-primary text-xs font-space uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                                    Your Upload
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-t-2 border-secondary animate-spin"></div>
                                <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary" size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg text-white font-playfair font-bold">Analyzing Space...</h4>
                                <p className="text-white/60 font-inter mt-1 text-sm">{statusMessage}</p>
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
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-secondary/30">
                                <img src={uploadedImage} alt="Your upload" className="w-full h-full object-contain bg-black/50" />
                            </div>
                        )}

                        {/* Vastu Score */}
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto relative">
                                <Compass className="text-secondary" size={40} />
                                <motion.div className="absolute inset-0 rounded-full border-2 border-secondary"
                                    initial={{ rotate: 0 }} animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                            </div>
                            <h4 className="text-xl text-white font-playfair font-bold">Vastu Compliance</h4>
                            <div className="flex items-end justify-center gap-2 text-secondary">
                                <span className="text-4xl font-bold">{analysis.vastu_score}</span>
                                <span className="text-lg pb-1">/ 100</span>
                            </div>
                            <span className={`inline-block text-xs font-space uppercase tracking-widest px-4 py-1.5 rounded-full ${analysis.status === 'Auspicious' ? 'bg-green-400/20 text-green-400' :
                                    analysis.status === 'Neutral' ? 'bg-yellow-400/20 text-yellow-400' :
                                        'bg-red-400/20 text-red-400'
                                }`}>{analysis.status}</span>
                        </div>

                        {/* Violations */}
                        {analysis.violations?.length > 0 && (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {analysis.violations.slice(0, 3).map((v, i) => (
                                    <div key={i} className="flex gap-2 text-xs font-inter text-white/80 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                                        <AlertTriangle className="text-red-400 shrink-0" size={14} />
                                        <div><strong>{v.item}:</strong> {v.issue}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Remedies */}
                        {analysis.remedies?.length > 0 && (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {analysis.remedies.slice(0, 3).map((r, i) => (
                                    <div key={i} className="flex gap-2 text-xs font-inter text-white/80 bg-green-500/10 p-2.5 rounded-lg border border-green-500/20">
                                        <CheckCircle2 className="text-green-400 shrink-0" size={14} />
                                        <div><strong>{r.action}</strong> {r.smm_product_boost && <span className="text-secondary"> → {r.smm_product_boost}</span>}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-white/50 text-xs text-center font-inter">{analysis.summary}</p>
                        <p className="text-white/40 text-[10px] text-center font-space uppercase tracking-widest">Generating 3D renders next...</p>
                    </motion.div>
                )}

                {/* === STEP 4: RENDERING === */}
                {step === 'rendering' && (
                    <motion.div key="rendering" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="py-8 space-y-6">
                        {uploadedImage && (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-secondary/30">
                                <img src={uploadedImage} alt="Your upload" className="w-full h-full object-contain bg-black/50" />
                            </div>
                        )}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Loader2 className="animate-spin text-secondary" size={40} />
                            <div>
                                <h4 className="text-lg text-white font-playfair font-bold">Generating Photorealistic Renders</h4>
                                <p className="text-white/60 font-inter mt-1 text-sm">{statusMessage}</p>
                                <p className="text-white/40 text-[10px] mt-2 font-space uppercase tracking-widest">
                                    Creating 3 lighting variations with SMM Modular furniture
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === STEP 5: FINAL RESULTS === */}
                {step === 'result' && analysis && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-5">

                        {/* Before / After Comparison */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Original Upload */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                                <img src={uploadedImage || ''} alt="Original" className="w-full h-full object-contain bg-black/50" />
                                <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-[10px] font-space uppercase tracking-widest px-2 py-1 rounded-full">
                                    Before
                                </div>
                            </div>

                            {/* AI Render */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-secondary/30 group">
                                {renders.length > 0 ? (
                                    <img src={renders[activeRenderIndex]?.url || ''} alt="AI Render" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/50 flex items-center justify-center text-white/40 text-xs">
                                        No renders yet
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-secondary/90 text-primary text-[10px] font-space uppercase tracking-widest px-2 py-1 rounded-full font-bold">
                                    After
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

                        {/* Mini Vastu Summary */}
                        <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl font-bold text-secondary">{analysis.vastu_score}</div>
                                <div>
                                    <p className="text-white text-xs font-bold">Vastu Score</p>
                                    <p className={`text-[10px] font-space uppercase ${analysis.status === 'Auspicious' ? 'text-green-400' :
                                            analysis.status === 'Neutral' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>{analysis.status}</p>
                                </div>
                            </div>
                            <div className="text-right text-white/50 text-[10px] font-space uppercase tracking-widest">
                                {analysis.violations?.length || 0} corrections
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => {
                                trackAuraEvent('WhatsApp Share Clicked');
                                const text = `Check out my AI-designed ${analysis.roomType} by SMM Modular Furniture! Vastu Score: ${analysis.vastu_score}/100`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }} className="btn-outline w-full text-xs py-3 flex items-center justify-center gap-2">
                                Share on WhatsApp
                            </button>
                            <button onClick={() => { trackAuraEvent('Consultation Booked', { from_ai: true }); window.location.href = '/services'; }}
                                className="btn-primary w-full text-xs py-3 flex items-center justify-center gap-2">
                                Book Consult <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
