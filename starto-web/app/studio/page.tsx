"use client"

import Sidebar from '@/components/feed/Sidebar'
import { BarChart3, TrendingUp, Users, Target, Zap, ArrowUpRight, Calendar } from 'lucide-react'

export default function StudioDashboard() {
    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 p-8 overflow-y-auto">
                    <header className="mb-12 flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                Studio Plan
                            </div>
                            <h1 className="text-4xl font-display">Studio Dashboard</h1>
                            <p className="text-text-secondary mt-2">Advanced ecosystem intelligence & performance tracking.</p>
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-surface-2 transition-all">
                            <Calendar className="w-4 h-4" /> Mar 2026
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Signal Reach', value: '12.4k', growth: '+15%', icon: Target },
                            { label: 'Help Factor', value: '4.2', growth: '+0.8', icon: Zap },
                            { label: 'Network Value', value: '₹2.4Cr', growth: '+₹12L', icon: TrendingUp },
                            { label: 'Conversion', value: '18%', growth: '+2%', icon: BarChart3 },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-surface-2 rounded-lg text-primary">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded">{stat.growth}</span>
                                </div>
                                <p className="text-xs text-text-muted uppercase tracking-widest font-bold">{stat.label}</p>
                                <p className="text-2xl font-mono mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <section className="bg-white border border-border p-8 rounded-2xl">
                            <h3 className="text-xl font-display mb-8">Ecosystem Heatmap</h3>
                            <div className="h-64 bg-surface-2 rounded-xl flex items-center justify-center border-2 border-dashed border-border opacity-40">
                                <p className="text-xs font-mono uppercase tracking-widest">Geospatial Distribution Utility</p>
                            </div>
                        </section>

                        <section className="bg-white border border-border p-8 rounded-2xl">
                            <h3 className="text-xl font-display mb-8">Performance Leaderboard</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-surface-2 rounded-full border border-border" />
                                            <div>
                                                <h4 className="text-sm font-medium">Top Node {i}</h4>
                                                <p className="text-[10px] text-text-muted uppercase tracking-widest">FinTech • Pune</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-all" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}
