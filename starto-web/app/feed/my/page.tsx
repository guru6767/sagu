"use client"

import Sidebar from '@/components/feed/Sidebar'
import { Plus, Search, Filter, Edit3, Trash2, ArrowUpRight } from 'lucide-react'
import { useSignalStore } from '@/store/useSignalStore'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import RaiseSignalModal from '@/components/feed/RaiseSignalModal'
import { useState } from 'react'

export default function MySignals() {
    const { signals, deleteSignal } = useSignalStore()
    const { username } = useOnboardingStore()
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)
    const [editingSignal, setEditingSignal] = useState<any>(null)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    
    const categories = ['Talent', 'Founder', 'Mentor', 'Instant Help']
    
    // Filter signals by logged in user and active category filter
    const mySignals = signals.filter(s => {
        const isUserMatch = s.username === (username || 'krish_startup')
        const isCategoryMatch = activeFilter ? s.category === activeFilter : true
        return isUserMatch && isCategoryMatch
    })

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-display">My Signals</h1>
                            <p className="text-xs text-text-secondary mt-1">Manage and track your active requests.</p>
                        </div>
                        <button onClick={() => setIsRaiseModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90">
                            <Plus className="w-5 h-5" /> New Signal
                        </button>
                    </div>

                    <div className="flex gap-2 mb-8 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input type="text" placeholder="Search my signals..." className="w-full bg-white border border-border pl-10 pr-4 py-2 rounded-md text-sm outline-none focus:border-text-muted" />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setActiveFilter(null)}
                                className={`px-4 py-2 border rounded-md text-sm font-medium flex items-center gap-2 transition-all ${!activeFilter ? 'bg-primary text-white border-primary' : 'bg-white border-border text-text-secondary hover:bg-surface-2'}`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${activeFilter === cat ? 'bg-primary text-white border-primary' : 'bg-white border-border text-text-secondary hover:bg-surface-2'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {mySignals.map(signal => (
                            <div key={signal.title} className="bg-white border border-border p-5 rounded-xl transition-all hover:shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${signal.status === 'Active' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-blue/10 text-accent-blue'
                                        }`}>
                                        {signal.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEditingSignal(signal)}
                                            className="p-1.5 text-text-muted hover:text-primary transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => deleteSignal(signal.id)}
                                            className="p-1.5 text-text-muted hover:text-accent-red transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-medium text-lg mb-4">{signal.title}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-[10px] text-text-muted uppercase">Responses</p>
                                            <p className="font-mono text-sm">{signal.stats.responses}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-muted uppercase">Views</p>
                                            <p className="font-mono text-sm">{signal.stats.views}</p>
                                        </div>
                                    </div>
                                    <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                                        View Detail <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="hidden lg:block w-[320px] p-8">
                    <div className="bg-primary text-white p-6 rounded-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-display text-lg mb-2">Signal Insights</h3>
                            <p className="text-white/60 text-xs mb-6">Your signals are outperforming 85% of users in Bangalore.</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs uppercase tracking-widest text-white/40">Efficiency</span>
                                    <span className="text-2xl font-mono">92%</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="bg-accent-green h-full w-[92%]" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                    </div>
                </aside>
            </div>
            
            <RaiseSignalModal 
                isOpen={isRaiseModalOpen || !!editingSignal} 
                onClose={() => {
                    setIsRaiseModalOpen(false)
                    setEditingSignal(null)
                }} 
                editSignal={editingSignal}
            />
        </div>
    )
}
