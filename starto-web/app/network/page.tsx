"use client"

import Sidebar from '@/components/feed/Sidebar'
import MobileBottomNav from '@/components/feed/MobileBottomNav'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNetworkStore } from '@/store/useNetworkStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useRatingStore } from '@/store/useRatingStore'
import { Check, X, Users, UserCheck, MessageSquare, Zap, Link as LinkIcon, UserPlus, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import VerifiedAvatar from '@/components/feed/VerifiedAvatar'

export default function NetworkPage() {
    const router = useRouter()
    const { user, token } = useAuthStore()
    const { connections, pendingRequests, sentRequests, offers, acceptRequest, rejectRequest, fetchRequests, fetchOffers, deleteOffer, sendRequest } = useNetworkStore()
    const { getAverageRating } = useRatingStore()
    const [tab, setTab] = useState<'connections' | 'requests' | 'offers'>('connections')
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (isAuthenticated) {
            fetchRequests();
            fetchOffers();
        }
    }, [isAuthenticated, fetchRequests, fetchOffers]);

    const connectionsArray = Array.isArray(connections) ? connections : []
    const pendingArray = Array.isArray(pendingRequests) ? pendingRequests : []
    const sentArray = Array.isArray(sentRequests) ? sentRequests : []
    const offersArray = Array.isArray(offers) ? offers : []

    const filteredConnections = connectionsArray.filter(c => {
        const otherUsername = c.requesterId === user?.id ? c.receiverName : c.requesterName;
        return otherUsername?.toLowerCase().includes(search.toLowerCase());
    })

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex flex-col md:flex-row pb-16 md:pb-0">
                <Sidebar />

                <main className="flex-1 w-full max-w-[680px] md:border-r border-border min-h-screen">
                    {/* Header */}
                    <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border z-10 px-6 py-4">
                        <h1 className="font-display text-2xl mb-3">My Network</h1>
                        <div className="flex gap-4 sm:gap-6 border-b border-border -mx-6 px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <button
                                onClick={() => setTab('connections')}
                                className={`pb-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-all ${tab === 'connections' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}
                            >
                                Connections ({connectionsArray.length})
                            </button>
                            <button
                                onClick={() => setTab('requests')}
                                className={`pb-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${tab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}
                            >
                                Requests
                                {pendingArray.length > 0 && (
                                    <span className="bg-primary text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                                        {pendingArray.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setTab('offers')}
                                className={`pb-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${tab === 'offers' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}
                            >
                                Offers
                                {offersArray.length > 0 && (
                                    <span className="bg-yellow-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                                        {offersArray.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* ── CONNECTIONS TAB ── */}
                        {tab === 'connections' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Search connections..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary mb-6"
                                />

                                {filteredConnections.length === 0 ? (
                                    <div className="flex flex-col items-center py-20 text-text-muted">
                                        <Users className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm font-medium">No connections yet</p>
                                        <p className="text-xs mt-1">Accept requests from the Requests tab to grow your network</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {filteredConnections.map(c => {
                                                const rating = getAverageRating(c.username)
                                                return (
                                                    <motion.div
                                                        key={c.username}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="flex items-center gap-4 p-4 bg-white border border-border rounded-2xl hover:border-primary transition-all"
                                                    >
                                                        <Link href={`/profile/${c.username}`}>
                                                            <VerifiedAvatar
                                                                username={c.username}
                                                                plan={c.plan}
                                                                size="w-12 h-12"
                                                                badgeSize="w-4 h-4"
                                                            />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link href={`/profile/${c.username}`} className="font-medium text-sm hover:text-primary transition-colors">
                                                                @{c.username}
                                                            </Link>
                                                            <p className="text-[10px] text-text-muted uppercase font-bold">{c.category}</p>
                                                            {rating > 0 && (
                                                                <p className="text-[10px] text-yellow-500 font-bold">★ {rating.toFixed(1)}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                title="Message (coming soon)"
                                                                className="p-2 rounded-lg border border-border hover:bg-surface-2 transition-all text-text-muted"
                                                            >
                                                                <MessageSquare className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeConnection(c.username)}
                                                                title="Remove connection"
                                                                className="p-2 rounded-lg border border-border hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-all text-text-muted"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── REQUESTS TAB ── */}
                        {tab === 'requests' && (
                            pendingArray.length === 0 ? (
                                <div className="flex flex-col items-center py-20 text-text-muted">
                                    <UserCheck className="w-10 h-10 mb-3 opacity-30" />
                                    <p className="text-sm font-medium">No pending requests</p>
                                    <p className="text-xs mt-1">Click the + icon on someone's signal card to send a request</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-xs text-text-muted mb-4">Accept a request to connect and enable chat.</p>
                                    <AnimatePresence>
                                        {pendingRequests.map(r => (
                                            <motion.div
                                                key={r.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center gap-4 p-4 bg-white border border-border rounded-2xl"
                                            >
                                                <Link href={`/profile/${r.requesterUsername}`}>
                                                    <VerifiedAvatar
                                                        username={r.requesterUsername}
                                                        avatarUrl={r.requesterAvatarUrl}
                                                        size="w-12 h-12"
                                                        badgeSize="w-4 h-4"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/profile/${r.requesterUsername}`} className="font-medium text-sm hover:text-primary">
                                                        {r.requesterName} <span className="text-text-muted text-xs font-normal">(@{r.requesterUsername})</span>
                                                    </Link>
                                                    <p className="text-[10px] text-text-muted uppercase font-bold">{r.requesterRole}</p>
                                                    <p className="text-[10px] text-yellow-600 font-bold mt-0.5">⏳ Pending</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {/* Accept */}
                                                    <button
                                                        onClick={() => acceptRequest(r.id)}
                                                        title="Accept connection"
                                                        className="p-2.5 rounded-xl border border-green-300 bg-green-50 text-green-600 hover:bg-green-100 transition-all active:scale-95"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    {/* Reject */}
                                                    <button
                                                        onClick={() => rejectRequest(r.id)}
                                                        title="Reject request"
                                                        className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 transition-all active:scale-95"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )
                        )}

                        {/* ── OFFERS TAB ── */}
                        {tab === 'offers' && (
                            offersArray.length === 0 ? (
                                <div className="flex flex-col items-center py-20 text-text-muted">
                                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-3">
                                        <Zap className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <p className="text-sm font-medium">No offers yet</p>
                                    <p className="text-xs mt-1">Offers received on your signals will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-xs text-text-muted mb-4">People who have generously offered to help with your signals.</p>
                                    <AnimatePresence>
                                        {offersArray.map(o => (
                                            <motion.div
                                                key={o.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex flex-col gap-3 p-5 bg-white border border-border rounded-2xl hover:border-text-muted transition-all shadow-sm group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <Link href={`/profile/${o.requesterUsername}`}>
                                                            <VerifiedAvatar
                                                                username={o.requesterUsername}
                                                                size="w-10 h-10"
                                                                badgeSize="w-3.5 h-3.5"
                                                            />
                                                        </Link>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <Link href={`/profile/${o.requesterUsername}`} className="font-medium text-sm hover:text-primary transition-colors hover:underline">
                                                                    {o.requesterName} <span className="text-text-muted text-xs font-normal">(@{o.requesterUsername})</span>
                                                                </Link>
                                                                {/* Connect icon */}
                                                                {connectionsArray.some(c => c.requesterUsername === o.requesterUsername || c.receiverUsername === o.requesterUsername) ? (
                                                                    <span title="Already connected" className="text-green-500"><CheckCheck className="w-4 h-4" /></span>
                                                                ) : sentArray.some(r => r.receiverUsername === o.requesterUsername && r.status === 'pending') ? (
                                                                    <span title="Request sent" className="text-yellow-500"><CheckCheck className="w-4 h-4" /></span>
                                                                ) : (
                                                                    <button
                                                                        title="Send connection request"
                                                                        onClick={() => {
                                                                            sendRequest(o.signalId, 'Connecting via offer!');
                                                                        }}
                                                                        className="text-text-muted hover:text-primary transition-colors p-0.5 rounded"
                                                                    >
                                                                        <UserPlus className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-text-muted mt-0.5">
                                                                {new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteOffer(o.id)} className="text-text-muted hover:text-red-500 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 bg-surface-1">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="pt-3 border-t border-border mt-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Portfolio/Project Link</p>
                                                    <a href={o.portfolioLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1.5 font-medium bg-surface-1 hover:bg-surface-2 transition-colors py-2 px-3 rounded-lg border border-border/50 inline-flex max-w-full">
                                                        <LinkIcon className="w-3.5 h-3.5" />
                                                        <span className="truncate">{o.portfolioLink}</span>
                                                    </a>
                                                    <p className="text-xs text-text-secondary mt-3 leading-relaxed italic">"{o.message}"</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )
                        )}
                    </div>
                </main>

                {/* Right sidebar */}
                <aside className="hidden xl:block w-[320px] p-8">
                    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                        <h3 className="font-display text-lg mb-4">Network Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Connections</span>
                                <span className="font-mono font-bold">{(connections || []).length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Pending Requests</span>
                                <span className="font-mono font-bold text-yellow-600">{(pendingRequests || []).length}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                                <span className="text-sm text-text-secondary">Help Offers Received</span>
                                <span className="font-mono font-bold font-primary text-black bg-yellow-100 px-2 rounded-md">{(offers || []).length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sponsored Card */}
                    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Sponsored</p>
                        <h3 className="font-display text-lg mb-2 leading-snug">Want to run ads here?</h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-5">Reach 1000s of founders, investors &amp; mentors in our ecosystem.</p>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-colors"
                        >
                            Get started →
                        </button>
                    </div>
                </aside>
                <MobileBottomNav />
            </div>
        </div>
    )
}
