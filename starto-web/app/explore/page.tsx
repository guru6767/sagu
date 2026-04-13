"use client"

import Sidebar from '@/components/feed/Sidebar'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, BarChart4, TrendingUp, AlertTriangle, Briefcase, FileText, CheckCircle2 } from 'lucide-react'

export default function StartoAIExplore() {
    const [analyzing, setAnalyzing] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const handleAnalyze = () => {
        setAnalyzing(true)
        setTimeout(() => {
            setAnalyzing(false)
            setShowResults(true)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                    <header className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                            Powered by GPT-4o + Gemini
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display mb-4">Starto AI Explore</h1>
                        <p className="text-text-secondary text-lg max-w-2xl">Real Market Intelligence. No Assumptions. No Hallucinations. Only Verified Data.</p>
                    </header>

                    {!showResults ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-border rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-8 space-y-6 border-r border-border">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Where are you launching?</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input type="text" placeholder="e.g. Pune, Maharashtra" className="w-full bg-surface-2 p-3 pl-10 rounded-md border border-border outline-none focus:border-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">What sector are you in?</label>
                                        <input type="text" placeholder="e.g. AgriTech, FinTech" className="w-full bg-surface-2 p-3 rounded-md border border-border outline-none focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">What is your initial budget?</label>
                                        <input type="text" placeholder="e.g. ₹10L - ₹50L" className="w-full bg-surface-2 p-3 rounded-md border border-border outline-none focus:border-primary" />
                                    </div>
                                </div>

                                <div className="p-8 bg-surface-2 flex flex-col justify-center">
                                    <div className="space-y-4 mb-10">
                                        <div className="flex gap-4">
                                            <div className="bg-primary text-white p-2 rounded-md h-fit">
                                                <Search className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm">Real-time Data Sourcing</h4>
                                                <p className="text-xs text-text-secondary">We scan active signals and verified market reports.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="bg-primary text-white p-2 rounded-md h-fit">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm">Competitive Intelligence</h4>
                                                <p className="text-xs text-text-secondary">Direct mapping of competitors in your region.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                        className="w-full bg-primary text-white py-4 rounded-md font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {analyzing ? 'Analyzing Market...' : 'Analyze My Market →'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 space-y-6">
                                <div className="bg-white border border-border p-8 rounded-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-display flex items-center gap-3">
                                            <BarChart4 className="w-6 h-6" /> Market Demand
                                        </h3>
                                        <div className="text-4xl font-mono text-accent-green">8.4</div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm text-text-secondary border-l-2 border-primary pl-4">The AgriTech sector in Pune shows strong growth indicators due to its proximity to Nashik and Ahmednagar supply chains.</p>
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="bg-surface-2 p-4 rounded-md">
                                                <span className="text-[10px] uppercase text-text-muted font-bold block mb-1">Growth Index</span>
                                                <span className="text-lg font-mono">+12.4% MoM</span>
                                            </div>
                                            <div className="bg-surface-2 p-4 rounded-md">
                                                <span className="text-[10px] uppercase text-text-muted font-bold block mb-1">Market Saturation</span>
                                                <span className="text-lg font-mono">Low (22%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-border p-8 rounded-2xl">
                                    <h3 className="text-2xl font-display mb-8 flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6" /> Risk Analysis
                                    </h3>
                                    <div className="space-y-4">
                                        {['Supply chain fragmentation', 'Low digital literacy in T3 cities', 'Regulatory uncertainty'].map(risk => (
                                            <div key={risk} className="p-4 border border-border rounded-lg flex justify-between items-center group hover:border-text-muted transition-all">
                                                <span className="text-sm font-medium">{risk}</span>
                                                <span className="text-[10px] font-bold uppercase bg-accent-yellow/10 text-accent-yellow px-2 py-0.5 rounded">Medium</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white border border-border p-8 rounded-2xl">
                                    <h3 className="text-2xl font-display mb-8 flex items-center gap-3">
                                        <Briefcase className="w-6 h-6" /> Competitive Landscape
                                    </h3>
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-widest">
                                                <th className="pb-4">Company</th>
                                                <th className="pb-4">Location</th>
                                                <th className="pb-4">Threat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {['AgriKart', 'FarmerLink', 'SoilSense'].map(c => (
                                                <tr key={c} className="group hover:bg-surface-2">
                                                    <td className="py-4 font-medium">{c}</td>
                                                    <td className="py-4 text-text-secondary">Nashik</td>
                                                    <td className="py-4">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue">LOW</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.section>

                            <aside className="space-y-6">
                                <div className="bg-primary text-white p-8 rounded-2xl overflow-hidden relative">
                                    <FileText className="w-12 h-12 text-white/10 absolute -top-2 -right-2" />
                                    <h4 className="text-lg font-display mb-4">90-Day Plan</h4>
                                    <div className="space-y-6 relative">
                                        <div className="border-l border-white/20 pl-4 relative">
                                            <CheckCircle2 className="w-4 h-4 text-accent-green absolute -left-2 top-0 bg-primary" />
                                            <span className="text-[10px] uppercase text-white/40 block">Week 1-2</span>
                                            <p className="text-xs mt-1">Setup supply partnerships Nashik region.</p>
                                        </div>
                                        <div className="border-l border-white/20 pl-4 relative">
                                            <div className="w-3 h-3 border border-white/20 rounded-full absolute -left-[6.5px] top-1 bg-primary" />
                                            <span className="text-[10px] uppercase text-white/40 block">Week 3-6</span>
                                            <p className="text-xs mt-1">Hire 2 field operations managers.</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-10 border border-white/20 py-3 rounded-md text-sm font-medium hover:bg-white/10 transition-all">
                                        Download Report
                                    </button>
                                </div>

                                <div className="bg-surface-2 border border-border p-6 rounded-2xl">
                                    <h4 className="font-display mb-4">Need More Detail?</h4>
                                    <p className="text-xs text-text-secondary mb-6">Upgrade to Studio to unlock team access and unlimited real-time market data exports.</p>
                                    <button className="w-full py-3 bg-white border border-border rounded-md text-sm font-bold hover:bg-white/50 transition-all">
                                        Upgrade Plan
                                    </button>
                                </div>
                            </aside>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
