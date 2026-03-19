"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useSignalStore, Signal } from '@/store/useSignalStore'

interface RaiseSignalModalProps {
    isOpen: boolean;
    onClose: () => void;
    editSignal?: Signal;
}

export default function RaiseSignalModal({ isOpen, onClose, editSignal }: RaiseSignalModalProps) {
    const { username, name, role } = useOnboardingStore();
    const { addSignal } = useSignalStore();
    
    const [signalType, setSignalType] = useState<'need' | 'help'>('need');
    const [category, setCategory] = useState('Talent');
    const [headline, setHeadline] = useState('');
    const [details, setDetails] = useState('');
    const [urgency, setUrgency] = useState('Normal');

    useEffect(() => {
        if (isOpen && editSignal) {
            setSignalType(editSignal.type || 'need');
            setCategory(editSignal.category);
            setHeadline(editSignal.title);
            setDetails(editSignal.description);
            setUrgency(editSignal.strength);
        } else if (isOpen && !editSignal) {
            setHeadline('');
            setDetails('');
            setCategory('Talent');
            setUrgency('Normal');
            setSignalType('need');
        }
    }, [isOpen, editSignal]);

    if (!isOpen) return null

    const handleBroadcast = () => {
        if (!headline || !details) return;
        
        if (editSignal) {
            useSignalStore.getState().updateSignal(editSignal.id, {
                title: headline,
                category: category,
                description: details,
                strength: urgency,
                type: signalType
            });
        } else {
            const namePart = (name || 'user').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
            const rolePart = (role || 'member').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
            const expectedBase = `${namePart}_${rolePart}`;

            // Always regenerate from current name+role so profile changes are reflected
            const existingSignals = useSignalStore.getState().signals;
            let finalUsername = expectedBase;
            let counter = 1;
            
            // Ensure uniqueness — skip signals owned by the same user (they can have multiple signals)
            const usernamesByOthers = existingSignals.filter(s => s.username !== username);
            while (usernamesByOthers.some(s => s.username === finalUsername)) {
                finalUsername = `${namePart}${counter}_${rolePart}`;
                counter++;
            }
            
            // Save the freshly generated username to the store so ownership checks work
            useOnboardingStore.getState().setProfile({ username: finalUsername });

            addSignal({
                title: headline,
                username: finalUsername,
                timeAgo: 'Just now',
                category: category,
                description: details,
                strength: urgency,
                type: signalType
            });
        }
        
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-[540px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                >
                    <div className="p-6 border-b border-border flex justify-between items-center bg-white">
                        <h2 className="text-2xl font-bold font-display">{editSignal ? 'Modify Signal' : 'Raise a New Signal'}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-full transition-all text-text-muted">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Type Toggle */}
                        <div className="flex bg-surface-2 p-1 rounded-lg border border-border">
                            <button 
                                onClick={() => setSignalType('need')}
                                className={`flex-1 py-3 text-sm font-medium rounded-md transition-all ${signalType === 'need' ? 'bg-white shadow-sm filter drop-shadow-sm text-black' : 'text-text-secondary hover:text-black font-normal'}`}
                            >
                                I Need Something
                            </button>
                            <button 
                                onClick={() => setSignalType('help')}
                                className={`flex-1 py-3 text-sm font-medium rounded-md transition-all ${signalType === 'help' ? 'bg-white shadow-sm filter drop-shadow-sm text-black' : 'text-text-secondary hover:text-black font-normal'}`}
                            >
                                I Can Help
                            </button>
                        </div>

                        {/* Category */}
                        <section>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">Select Category</label>
                            <div className="flex flex-wrap gap-2">
                                {['Talent', 'Founder', 'Mentor', 'Instant Help'].map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full border text-sm transition-all ${category === cat ? 'bg-black text-white border-black font-medium text-sm' : 'border-border text-text-secondary hover:border-black text-sm hover:text-black'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Headline */}
                        <section>
                            <label className="text-sm font-medium text-black mb-2 block">What's the signal headline?</label>
                            <input
                                type="text"
                                placeholder="Type a catchy headline..."
                                className="w-full bg-white p-3 rounded-none border-b border-border outline-none focus:border-black text-base placeholder:text-text-muted/60 font-serif pb-2 placeholder:font-serif"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                            />
                        </section>

                        {/* Details */}
                        <section>
                            <label className="text-sm font-medium text-black mb-2 block">Details & Context</label>
                            <textarea
                                placeholder="Explain what you are looking for or offering in more detail..."
                                className="w-full bg-white p-4 rounded-xl border border-border outline-none focus:border-black text-sm gap-2 h-32 resize-none placeholder:text-text-muted/60 shadow-sm"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        </section>

                        {/* Urgency */}
                        <section>
                            <label className="text-sm font-medium text-black mb-2 block">Urgency Level</label>
                            <select 
                                className="w-full bg-white p-3 rounded-xl border border-border outline-none focus:border-black text-sm shadow-sm appearance-none cursor-pointer"
                                value={urgency}
                                onChange={(e) => setUrgency(e.target.value)}
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
                            >
                                <option value="High">High</option>
                                <option value="Normal">Normal</option>
                                <option value="Low">Low</option>
                            </select>
                            <div className="mt-4 flex gap-5 text-xs font-medium">
                                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span> <span className={`${urgency === 'High' ? 'text-[#FF5722]' : 'text-text-muted'}`}>High</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2196F3]"></span> <span className={`${urgency === 'Normal' ? 'text-[#2196F3]' : 'text-text-muted'}`}>Normal</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#9E9E9E]"></span> <span className={`${urgency === 'Low' ? 'text-[#9E9E9E]' : 'text-text-muted'}`}>Low</span></div>
                            </div>
                        </section>
                    </div>

                    <div className="p-6">
                        <button 
                            onClick={handleBroadcast}
                            disabled={!headline || !details}
                            className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                        >
                            <Zap className="w-4 h-4 fill-white text-white" /> Broadcast to Network
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
