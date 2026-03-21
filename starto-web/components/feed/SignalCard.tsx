"use client"

import { MessageSquare, Zap, UserPlus, MoreHorizontal, Edit3, Trash2, CheckCheck, BarChart2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useSignalStore, Signal } from '@/store/useSignalStore'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useNetworkStore } from '@/store/useNetworkStore'
import { useResponseStore } from '@/store/useResponseStore'
import RaiseSignalModal from './RaiseSignalModal'
import InsightsModal from './InsightsModal'
import HelpModal from './HelpModal'

interface SignalCardProps {
    id: string
    title: string
    username: string
    timeAgo: string
    category: string
    description: string
    strength: string
    stats: {
        responses: number
        offers: number
        views: number
    }
}

export default function SignalCard({ id, title, username, timeAgo, category, description, strength, stats }: SignalCardProps) {
    const { username: currentUser } = useOnboardingStore()
    const { deleteSignal, signals } = useSignalStore()
    const { isConnected, sendRequest, hasPendingRequest } = useNetworkStore()
    const { addResponse, hasResponded } = useResponseStore()
    const [showDropdown, setShowDropdown] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false)
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [addedToNetwork, setAddedToNetwork] = useState(false)
    const [justResponded, setJustResponded] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const alreadyConnected = isConnected(username)
    const alreadyPending = hasPendingRequest(username)
    const alreadyResponded = hasResponded(id)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])
    const isOwner = currentUser === username
    const currentSignal = signals.find(s => s.id === id)

    // Days left calculation
    const totalDuration = parseInt(strength) || 7;
    // Determine creation time, defaulting to 1 day ago if legacy signal created before this feature
    const safeCreatedAt = currentSignal?.createdAt || (Date.now() - (1000 * 60 * 60 * 24));
    const daysElapsed = Math.floor((Date.now() - safeCreatedAt) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, totalDuration - daysElapsed);
    const strengthColor: Record<string, string> = {
        Normal: 'bg-accent-blue',
        High: 'bg-accent-yellow',
        Critical: 'bg-accent-red',
        Low: 'bg-text-muted'
    }
    const colorClass = strengthColor[strength] || 'bg-text-muted'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-border p-5 rounded-xl mb-4 hover:border-text-muted transition-all group shadow-sm hover:shadow-md"
        >
            <div className="flex justify-between items-start mb-4">
                <Link href={`/profile/${username}`} className="flex items-center gap-3 group/profile hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-surface-2 rounded-full border border-border relative overflow-hidden">
                        <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt={username} fill className="object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm group-hover/profile:text-primary transition-colors">@{username}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                            <span className="text-xs text-text-muted">{strength}</span>
                        </div>
                        <p className="text-xs text-text-muted">{timeAgo}</p>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                        {category}
                    </span>
                    {isOwner ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setShowDropdown(!showDropdown)} className={`text-text-muted hover:text-primary p-1 rounded-md transition-all ${showDropdown ? 'bg-surface-2 text-primary' : 'hover:bg-surface-2'}`}>
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-20 py-1 flex flex-col overflow-hidden"
                                    >
                                        <button 
                                            onClick={() => { setIsInsightsModalOpen(true); setShowDropdown(false); }}
                                            className="px-4 py-2.5 text-sm text-left hover:bg-surface-2 transition-colors w-full flex items-center gap-2 text-text-secondary hover:text-black font-medium"
                                        >
                                            <BarChart2 className="w-4 h-4" /> Insights
                                        </button>
                                        <button 
                                            onClick={() => { setIsEditModalOpen(true); setShowDropdown(false); }}
                                            className="px-4 py-2.5 text-sm text-left hover:bg-surface-2 transition-colors w-full flex items-center gap-2 text-text-secondary hover:text-black font-medium"
                                        >
                                            <Edit3 className="w-4 h-4" /> Modify Signal
                                        </button>
                                        <button 
                                            onClick={() => { deleteSignal(id); setShowDropdown(false); }}
                                            className="px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors w-full flex items-center gap-2 text-accent-red font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete Signal
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button className="text-text-muted hover:text-primary p-1 rounded-md hover:bg-surface-2 transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-medium mb-2 group-hover:underline cursor-pointer">{title}</h3>
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">{description}</p>

            <div className="flex items-center gap-6 mb-5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase">Responses</span>
                    <span className="font-mono text-sm">{stats.responses}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase">Offers</span>
                    <span className="font-mono text-sm">{stats.offers}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase">Views</span>
                    <span className="font-mono text-sm">{stats.views}</span>
                </div>
            </div>
            
            {/* Urgency Progress Bar */}
            <div className="mb-5 relative">
                <div className="w-full h-1.5 bg-surface-2 overflow-hidden mb-1 flex">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, (daysLeft / totalDuration) * 100))}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className={`h-full rounded-r-md transition-colors ${
                            daysLeft <= 3 ? "bg-red-500" :
                            daysLeft >= totalDuration - 2 ? "bg-green-500" :
                            "bg-gradient-to-r from-yellow-400 to-orange-500"
                        }`}
                    />
                </div>
                <div className={`text-[10px] uppercase tracking-widest font-bold float-right ${
                    daysLeft <= 3 ? "text-red-500" :
                    daysLeft >= totalDuration - 2 ? "text-green-600" :
                    "text-orange-500"
                }`}>
                    {daysLeft} Days Left
                </div>
                <div className="clear-both" />
            </div>

            {/* Actions */}

            <div className="flex gap-2">
                <button onClick={() => setIsHelpModalOpen(true)} className="flex-1 bg-primary text-white py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                    <Zap className="w-4 h-4 fill-white" /> Help
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex-1 border py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                        showComments
                            ? 'border-black bg-black text-white'
                            : 'border-border hover:bg-surface-2'
                    }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Respond
                </button>
                <button
                    onClick={() => {
                        if (!isOwner && !alreadyConnected && !alreadyPending && !addedToNetwork) {
                            sendRequest({ username, category, timeAdded: Date.now() });
                            setAddedToNetwork(true);
                            setTimeout(() => setAddedToNetwork(false), 2000);
                        }
                    }}
                    disabled={isOwner}
                    className={`px-3 border rounded-md transition-all duration-300 ${
                        isOwner
                            ? 'border-border opacity-30 cursor-not-allowed'
                            : alreadyConnected
                                ? 'border-green-500 bg-green-50'
                                : alreadyPending || addedToNetwork
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-border hover:bg-surface-2'
                    }`}
                    title={isOwner ? 'Your own signal' : alreadyConnected ? 'Connected' : alreadyPending ? 'Request sent — pending' : 'Send connection request'}
                >
                    {alreadyConnected ? (
                        <CheckCheck className="w-4 h-4 text-green-600" />
                    ) : alreadyPending || addedToNetwork ? (
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <CheckCheck className="w-4 h-4 text-green-500" />
                        </motion.div>
                    ) : (
                        <UserPlus className="w-4 h-4" />
                    )}
                </button>
            </div>
            
            {/* Instagram Style Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                    >
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                            {(currentSignal?.comments || []).length === 0 ? (
                                <p className="text-center text-xs text-text-muted py-4">No responses yet. Be the first to respond!</p>
                            ) : (
                                (currentSignal?.comments || []).map(comment => (
                                    <div key={comment.id} className="flex gap-3 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-surface-2 overflow-hidden shrink-0 mt-0.5 relative">
                                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} alt={comment.username} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p>
                                                <span className="font-bold mr-2 text-black cursor-pointer hover:underline">@{comment.username}</span>
                                                <span className="text-text-secondary">{comment.text}</span>
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-0.5">
                                                {new Date(comment.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="mt-4 flex gap-2 items-center border-t border-border pt-3">
                            <div className="w-8 h-8 rounded-full bg-surface-2 overflow-hidden shrink-0 relative">
                                <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser || 'krish'}`} alt="me" fill className="object-cover" />
                            </div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-text-muted ml-2"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && commentText.trim()) {
                                        useSignalStore.getState().addComment(id, commentText.trim(), currentUser || 'krish_startup')
                                        setCommentText('')
                                        if (!alreadyResponded && !isOwner) {
                                            addResponse({ signalId: id, signalTitle: title, signalUsername: username, signalCategory: category })
                                        }
                                    }
                                }}
                            />
                            <button 
                                disabled={!commentText.trim()}
                                onClick={() => {
                                    if (commentText.trim()) {
                                        useSignalStore.getState().addComment(id, commentText.trim(), currentUser || 'krish_startup')
                                        setCommentText('')
                                        if (!alreadyResponded && !isOwner) {
                                            addResponse({ signalId: id, signalTitle: title, signalUsername: username, signalCategory: category })
                                        }
                                    }
                                }}
                                className="text-primary font-bold text-sm disabled:opacity-50 transition-opacity"
                            >
                                Post
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {currentSignal && (
                <RaiseSignalModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    editSignal={currentSignal} 
                />
            )}
            {currentSignal && (
                <InsightsModal 
                    isOpen={isInsightsModalOpen} 
                    onClose={() => setIsInsightsModalOpen(false)} 
                    stats={stats}
                    signalTitle={title}
                />
            )}
            <HelpModal 
                isOpen={isHelpModalOpen} 
                onClose={() => setIsHelpModalOpen(false)} 
                signalId={id} 
                signalTitle={title} 
            />
        </motion.div>
    )
}
