"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/feed/Sidebar'
import SignalCard from '@/components/feed/SignalCard'
import { Plus, Search, LogIn } from 'lucide-react'
import RaiseSignalModal from '@/components/feed/RaiseSignalModal'
import { useSignalStore } from '@/store/useSignalStore'
import { useAuthStore } from '@/store/useAuthStore'

export default function HomeFeed() {
    const router = useRouter()
    const { isAuthenticated, user, clearAuth } = useAuthStore()
    const { signals } = useSignalStore()
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)

    const requireAuth = (action: () => void) => {
        if (!isAuthenticated) {
            router.push('/auth')
        } else {
            action()
        }
    }

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-display">Feed</h1>
                        <div className="flex gap-2 items-center">
                            <button onClick={() => requireAuth(() => console.log('Search clicked'))} className="p-2 border border-border rounded-md hover:bg-surface-2 transition-all">
                                <Search className="w-5 h-5" />
                            </button>
                            <button onClick={() => requireAuth(() => setIsRaiseModalOpen(true))} className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-all">
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">Raise Signal</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {signals.map(signal => (
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
                    onClose={() => setIsRaiseModalOpen(false)} 
                />
            </div>
        </div>
    )
}
