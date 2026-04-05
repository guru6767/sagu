"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/feed/Sidebar'
import SignalCard from '@/components/feed/SignalCard'
import { Plus, Search, Loader2, WifiOff, RefreshCw } from 'lucide-react'
import RaiseSignalModal from '@/components/feed/RaiseSignalModal'
import { useSignalStore } from '@/store/useSignalStore'
import { useAuthStore } from '@/store/useAuthStore'
import { signalsApi, ApiSignal } from '@/lib/apiClient'

// Map backend ApiSignal → the shape SignalCard expects
function mapApiSignalToCard(s: ApiSignal) {
    const createdAt = s.createdAt ? new Date(s.createdAt) : new Date()
    const diffMs = Date.now() - createdAt.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const timeAgo =
        diffMin < 1 ? 'Just now'
        : diffMin < 60 ? `${diffMin}m ago`
        : diffMin < 1440 ? `${Math.floor(diffMin / 60)}h ago`
        : `${Math.floor(diffMin / 1440)}d ago`

    return {
        id: s.id,
        title: s.title || '(Untitled)',
        username: s.username || 'unknown',
        timeAgo,
        category: s.category || 'General',
        description: s.description || '',
        strength: s.signalStrength || '7 Days',
        stats: {
            responses: s.responseCount ?? 0,
            offers: s.offerCount ?? 0,
            views: s.viewCount ?? 0,
        },
    }
}

export default function HomeFeed() {
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()
    const { signals: localSignals } = useSignalStore()

    // ── Backend signal state ──────────────────────────────────────────────────
    const [apiSignals, setApiSignals] = useState<ApiSignal[]>([])
    const [loading, setLoading] = useState(true)
    const [backendError, setBackendError] = useState<string | null>(null)
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setBackendError(null)

        signalsApi.getAll().then(({ data, error }) => {
            if (cancelled) return
            if (error || data === null) {
                setBackendError(error || 'Could not reach backend')
            } else {
                setApiSignals(data)
            }
            setLoading(false)
        })

        return () => { cancelled = true }
    }, [refreshKey])

    const requireAuth = (action: () => void) => {
        if (!isAuthenticated) {
            router.push('/auth')
        } else {
            action()
        }
    }

    // Merge backend signals + any local-only signals (created while offline)
    const backendIds = new Set(apiSignals.map(s => s.id))
    const localOnly = localSignals.filter(s => !backendIds.has(s.id))

    const displaySignals = [
        ...apiSignals.map(mapApiSignalToCard),
        ...localOnly.map(s => ({
            id: s.id,
            title: s.title,
            username: s.username,
            timeAgo: s.timeAgo,
            category: s.category,
            description: s.description,
            strength: s.strength,
            stats: s.stats,
        })),
    ]

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-display">Feed</h1>
                            {/* Backend status badge */}
                            {!loading && (
                                backendError ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-500 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded-full">
                                        <WifiOff className="w-3 h-3" /> Local Mode
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Live — {apiSignals.length} signals
                                    </span>
                                )
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setRefreshKey(k => k + 1)}
                                title="Refresh from backend"
                                className="p-2 border border-border rounded-md hover:bg-surface-2 transition-all"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={() => requireAuth(() => setIsRaiseModalOpen(true))}
                                className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">Raise Signal</span>
                            </button>
                        </div>
                    </div>

                    {/* Backend error notice */}
                    {backendError && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-700 flex items-start gap-2">
                            <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                                <strong>Backend unreachable:</strong> {backendError}. Showing local signals only.
                                Make sure the Spring Boot server is running at <code className="font-mono bg-orange-100 px-1 rounded">localhost:8081</code>.
                            </span>
                        </div>
                    )}

                    {/* Signal list */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="text-sm">Loading signals from backend…</p>
                        </div>
                    ) : displaySignals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
                            <Search className="w-10 h-10 opacity-30" />
                            <p className="text-sm">No signals yet. Be the first to raise one!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displaySignals.map(signal => (
                                <div key={signal.id} onClick={() => requireAuth(() => {})}>
                                    <SignalCard
                                        id={signal.id}
                                        title={signal.title}
                                        username={signal.username}
                                        timeAgo={signal.timeAgo}
                                        category={signal.category}
                                        description={signal.description}
                                        strength={signal.strength}
                                        stats={signal.stats}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <aside className="hidden lg:block w-[320px] p-8 space-y-4">
                    <div className="bg-white/[0.02] border border-border p-6 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="font-display text-lg mb-2 relative z-10">Need Market Analysis?</h3>
                        <p className="text-text-secondary text-sm mb-6 relative z-10">Real World Data. No Hallucinations. Powered by Starto AI.</p>
                        <button onClick={() => requireAuth(() => console.log('Launch Explore clicked'))} className="w-full bg-primary text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 relative z-10">
                            Launch Explore →
                        </button>
                    </div>

                    <div
                        onClick={() => router.push('/subscription')}
                        className="bg-white border border-border p-6 rounded-xl cursor-pointer hover:border-primary hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 relative z-10">Sponsored</p>
                        <h3 className="font-display text-base mb-1 relative z-10">Want to run ads here?</h3>
                        <p className="text-text-secondary text-xs mb-4 relative z-10 leading-relaxed">Reach 1000s of founders, investors &amp; mentors in our ecosystem.</p>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="w-full bg-black text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:opacity-80 relative z-10 transition-opacity"
                        >
                            Get started →
                        </button>
                    </div>
                </aside>
                
                <RaiseSignalModal 
                    isOpen={isRaiseModalOpen} 
                    onClose={() => {
                        setIsRaiseModalOpen(false)
                        // Refresh feed after signal creation attempt
                        setRefreshKey(k => k + 1)
                    }} 
                />
            </div>
        </div>
    )
}
