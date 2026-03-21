"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Link as LinkIcon, Building2 } from 'lucide-react'
import { useSignalStore } from '@/store/useSignalStore'
import { useNetworkStore } from '@/store/useNetworkStore'
import { useOnboardingStore } from '@/store/useOnboardingStore'

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
    signalId: string
    signalTitle: string
}

export default function HelpModal({ isOpen, onClose, signalId, signalTitle }: HelpModalProps) {
    const { incrementOffer } = useSignalStore()
    const addOffer = useNetworkStore(state => state.addOffer)
    const currentUser = useOnboardingStore(state => state.username)
    
    const [name, setName] = useState('')
    const [projectLink, setProjectLink] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = () => {
        if (!name || !projectLink) return
        incrementOffer(signalId)
        addOffer({
            signalId,
            name,
            projectLink,
            fromUsername: currentUser || 'krish_startup'
        })
        
        setIsSubmitted(true)
        setTimeout(() => {
            setIsSubmitted(false)
            setName('')
            setProjectLink('')
            onClose()
        }, 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-border flex justify-between items-center bg-white relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-blue" />
                            <div>
                                <h2 className="text-xl font-bold font-display">Offer Help</h2>
                                <p className="text-xs text-text-muted mt-1 truncate max-w-[300px]">For: {signalTitle}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-full transition-all text-text-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {isSubmitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <Zap className="w-8 h-8 text-green-600 fill-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-900 mb-2">Offer Sent!</h3>
                                    <p className="text-sm text-green-700">Thank you for stepping up to help.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <section>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">Your Name / Organization</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="John Doe / TechCorp"
                                                className="w-full bg-surface-1 border border-border p-3 pl-10 rounded-xl outline-none focus:border-black text-sm transition-colors"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </section>

                                    <section>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">Most Recent Project Link</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="url"
                                                placeholder="https://github.com/johndoe/project"
                                                className="w-full bg-surface-1 border border-border p-3 pl-10 rounded-xl outline-none focus:border-black text-sm transition-colors"
                                                value={projectLink}
                                                onChange={(e) => setProjectLink(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-[10px] text-text-muted mt-2">Provides context and credibility to your offer.</p>
                                    </section>

                                    <button 
                                        onClick={handleSubmit}
                                        disabled={!name || !projectLink}
                                        className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-auto"
                                    >
                                        <Zap className="w-4 h-4 fill-white text-white" /> Send Offer
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
