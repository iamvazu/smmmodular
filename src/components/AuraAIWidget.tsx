import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Wand2, Compass, Download, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackAuraEvent } from '../lib/analytics';

interface AuraAIWidgetProps {
    variant?: 'hero' | 'floating' | 'fullscreen';
}

export function AuraAIWidget({ variant = 'hero' }: AuraAIWidgetProps) {
    const [step, setStep] = useState<'upload' | 'analyzing' | 'vastu' | 'render' | 'result'>('upload');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [roomType, setRoomType] = useState('living_room');
    const [vastuScore, setVastuScore] = useState(0);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);

                // Track Upload Event
                trackAuraEvent('Sketch Uploaded', {
                    room_type: roomType,
                    file_size: file.size,
                    file_type: file.type
                });

                startMockProcess();
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        maxFiles: 1,
    });

    const startMockProcess = () => {
        setStep('analyzing');
        setTimeout(() => {
            setStep('vastu');
            setVastuScore(85);
            trackAuraEvent('Vastu Analysis Viewed', { score: 85, violations_count: 0 });

            setTimeout(() => {
                setStep('render');
                setTimeout(() => {
                    setGeneratedImage('/images/services/residential-projects/img(18).webp'); // mock render using existing image
                    setStep('result');
                    trackAuraEvent('Render Generated', { style: 'Modern', time_of_day: 'Morning', generation_time: 5000 });
                }, 2500);
            }, 2500);
        }, 2500);
    };

    const resetProcess = () => {
        setUploadedImage(null);
        setGeneratedImage(null);
        setStep('upload');
    };

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
                {step === 'upload' && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-white/70 font-space uppercase tracking-widest">Select Room Type</label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="bg-primary/50 text-white border border-secondary/30 rounded-lg p-3 outline-none focus:border-secondary transition-colors"
                                style={{ appearance: 'none' }}
                            >
                                <option value="living_room">Living Room</option>
                                <option value="bedroom">Master Bedroom</option>
                                <option value="kitchen">Modular Kitchen</option>
                                <option value="office">Home Office</option>
                            </select>
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed ${isDragActive ? 'border-secondary bg-secondary/10' : 'border-secondary/50 bg-primary/30 hover:border-secondary hover:bg-primary/50'} rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4`}
                        >
                            <input {...getInputProps()} />
                            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <Upload size={32} />
                            </div>
                            <div>
                                <p className="text-white font-inter text-lg">Drop your sketch or photo</p>
                                <p className="text-white/50 text-sm mt-1">or click to browse (JPG, PNG)</p>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-white/40 uppercase font-space tracking-widest">Powered by Gemini 1.5 Pro</p>
                    </motion.div>
                )}

                {step === 'analyzing' && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-t-2 border-secondary animate-spin"></div>
                            <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary" size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl text-white font-playfair font-bold">Analyzing Space...</h4>
                            <p className="text-white/60 font-inter mt-2">SMM's AI is studying your layout & dimensions</p>
                        </div>
                    </motion.div>
                )}

                {step === 'vastu' && (
                    <motion.div
                        key="vastu"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-8 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center relative">
                            <Compass className="text-secondary" size={48} />
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-secondary"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        <div>
                            <h4 className="text-2xl text-white font-playfair font-bold">Vastu Compliance Score</h4>
                            <div className="flex items-end justify-center gap-2 mt-4 text-secondary">
                                <span className="text-5xl font-bold">{vastuScore}</span>
                                <span className="text-xl pb-1">/ 100</span>
                            </div>
                            <p className="text-green-400 font-inter mt-4 text-sm bg-green-400/10 px-4 py-2 rounded-full inline-block">
                                Excellent! Recommended layout aligns with Vastu principles.
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === 'render' && (
                    <motion.div
                        key="render"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <Loader2 className="animate-spin text-secondary" size={48} />
                        <div>
                            <h4 className="text-xl text-white font-playfair font-bold">Generating Photorealistic Render...</h4>
                            <p className="text-white/60 font-inter mt-2">Applying SMM modular furniture catalog and modern aesthetics</p>
                        </div>
                    </motion.div>
                )}

                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="relative aspect-video rounded-xl overflow-hidden rounded-t-xl group">
                            <img src={generatedImage || ''} alt="AI Generated Render" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-white text-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-secondary transition-colors text-sm"
                                    onClick={() => trackAuraEvent('Design Downloaded')}
                                >
                                    <Download size={18} /> Download 4K
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { trackAuraEvent('WhatsApp Share Clicked'); window.location.href = '/services'; }} className="btn-outline w-full text-xs md:text-sm py-3 flex items-center justify-center gap-2">
                                Share on WhatsApp
                            </button>
                            <button onClick={() => { trackAuraEvent('Consultation Booked', { from_ai: true }); window.location.href = '/services'; }} className="btn-primary w-full text-xs md:text-sm py-3 flex items-center justify-center gap-2">
                                Book Consult <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
