"use client"

import Sidebar from '@/components/feed/Sidebar'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useNetworkStore } from '@/store/useNetworkStore'
import { useRatingStore } from '@/store/useRatingStore'
import { Check, X, Users, UserCheck, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NetworkPage() {
    const { connections, pendingRequests, acceptRequest, rejectRequest, removeConnection } = useNetworkStore()
    const { getAverageRating } = useRatingStore()
    const [tab, setTab] = useState<'connections' | 'requests'>('connections')
    const [search, setSearch] = useState('')

    const filteredConnections = connections.filter(c =>
        c.username.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen">
                    {/* Header */}
                    <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border z-10 px-6 py-4">
                        <h1 className="font-display text-2xl mb-3">My Network</h1>
                        <div className="flex gap-6 border-b border-border -mx-6 px-6">
                            <button
                                onClick={() => setTab('connections')}
                                className={`pb-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-all ${tab === 'connections' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}
                            >
                                Connections ({connections.length})
                            </button>
                            <button
                                onClick={() => setTab('requests')}
                                className={`pb-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${tab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}
                            >
                                Requests
                                {pendingRequests.length > 0 && (
                                    <span className="bg-primary text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                                        {pendingRequests.length}
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
                                                            <div className="w-12 h-12 rounded-full bg-surface-2 relative overflow-hidden border border-border flex-shrink-0">
                                                                <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`} alt={c.username} fill className="object-cover" />
                                                            </div>
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
                            pendingRequests.length === 0 ? (
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
                                                key={r.username}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center gap-4 p-4 bg-white border border-border rounded-2xl"
                                            >
                                                <Link href={`/profile/${r.username}`}>
                                                    <div className="w-12 h-12 rounded-full bg-surface-2 relative overflow-hidden border border-border flex-shrink-0">
                                                        <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.username}`} alt={r.username} fill className="object-cover" />
                                                    </div>
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/profile/${r.username}`} className="font-medium text-sm hover:text-primary">
                                                        @{r.username}
                                                    </Link>
                                                    <p className="text-[10px] text-text-muted uppercase font-bold">{r.category}</p>
                                                    <p className="text-[10px] text-yellow-600 font-bold mt-0.5">⏳ Pending</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {/* Accept */}
                                                    <button
                                                        onClick={() => acceptRequest(r.username)}
                                                        title="Accept connection"
                                                        className="p-2.5 rounded-xl border border-green-300 bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    {/* Reject */}
                                                    <button
                                                        onClick={() => rejectRequest(r.username)}
                                                        title="Reject request"
                                                        className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 transition-all"
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
                    </div>
                </main>

                {/* Right sidebar */}
                <aside className="hidden xl:block w-[320px] p-8">
                    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                        <h3 className="font-display text-lg mb-4">Network Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Connections</span>
                                <span className="font-mono font-bold">{connections.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary">Pending Requests</span>
                                <span className="font-mono font-bold text-yellow-600">{pendingRequests.length}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
