"use client"

import Sidebar from '@/components/feed/Sidebar'
import { Map as MapIcon, Filter, Layers, Navigation, Search } from 'lucide-react'
import Image from 'next/image'

export default function NearbyEcosystem() {
    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 flex flex-col min-h-screen">
                    <header className="p-6 border-b border-border bg-white flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-display">Nearby Ecosystem</h1>
                            <p className="text-xs text-text-secondary">Discover nodes within your 25km radius.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-border rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-2 transition-all">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                            <button className="bg-primary text-white p-2 rounded-md hover:opacity-90 transition-all">
                                <Navigation className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 relative bg-surface-2 overflow-hidden group">
                        <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center">
                            <div className="text-center opacity-40">
                                <MapIcon className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-display text-xl px-2">Interactive Map Layer Sourced from Google Maps</p>
                                <p className="text-xs uppercase tracking-widest mt-2">Custom Styled: Black & White Premium</p>
                            </div>

                            {/* Mock Markers */}
                            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse" />
                            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent-green rounded-full ring-4 ring-accent-green/20" />
                            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-accent-blue rounded-full ring-4 bg-accent-blue/20" />
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-white border border-border p-4 rounded-xl shadow-lg flex gap-4 overflow-x-auto">
                                {['Founders', 'Mentors', 'Investors', 'Talent', 'Co-working', 'Incubators'].map(f => (
                                    <button key={f} className="px-4 py-2 rounded-full border border-border text-[10px] uppercase font-bold tracking-widest whitespace-nowrap hover:bg-primary hover:text-white transition-all">
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <section className="h-[300px] bg-white border-t border-border p-6 overflow-y-auto">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Nearby Nodes (42)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-text-muted cursor-pointer transition-all group">
                                    <div className="w-12 h-12 bg-surface-2 rounded-full border border-border group-hover:scale-110 transition-transform relative overflow-hidden">
                                        <Image src={`https://api.dicebear.com/9.x/avataaars/svg?seed=Node${i}`} alt="Node" fill />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">Node {i}</h4>
                                        <p className="text-xs text-text-secondary">Founder • 1.2km away</p>
                                        <div className="flex gap-1 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                                            <span className="text-[10px] text-accent-green font-medium">Online</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
