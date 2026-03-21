"use client"

import { useState } from 'react'
import Sidebar from '@/components/feed/Sidebar'
import SignalCard from '@/components/feed/SignalCard'
import { Plus, Search } from 'lucide-react'
import RaiseSignalModal from '@/components/feed/RaiseSignalModal'
import { useSignalStore } from '@/store/useSignalStore'

export default function HomeFeed() {
    const { signals } = useSignalStore()
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)
    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-display">Feed</h1>
                        <div className="flex gap-2">
                            <button className="p-2 border border-border rounded-md hover:bg-surface-2">
                                <Search className="w-5 h-5" />
                            </button>
                            <button onClick={() => setIsRaiseModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-all">
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">Raise Signal</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {signals.map(signal => (
                            <SignalCard
                                key={signal.id}
                                id={signal.id}
                                title={signal.title}
                                username={signal.username}
                                timeAgo={signal.timeAgo}
                                category={signal.category}
                                description={signal.description}
                                strength={signal.strength}
                                stats={signal.stats}
                            />
                        ))}
                    </div>
                </main>

                <aside className="hidden lg:block w-[320px] p-8 space-y-8">
                    <div className="bg-white border border-border p-6 rounded-xl">
                        <h3 className="font-display text-lg mb-2">Need Market Analysis?</h3>
                        <p className="text-text-secondary text-sm mb-6">Real World Data. No Hallucinations. Powered by Starto AI.</p>
                        <button className="w-full bg-primary text-white py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90">
                            Launch Explore →
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
