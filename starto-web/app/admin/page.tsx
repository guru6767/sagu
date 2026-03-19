import Sidebar from '@/components/feed/Sidebar'
import { ShieldCheck, Activity, Users, MessageSquare, AlertCircle, Terminal } from 'lucide-react'

export default function AdminPanel() {
    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <header className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-accent-red text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                            Admin Access
                        </div>
                        <h1 className="text-4xl font-display">System Control</h1>
                        <p className="text-text-secondary mt-2">Core platform management & security orchestration.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white border border-border p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold uppercase text-text-muted">Users</span>
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-mono">14,248</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-accent-green" />
                                <span className="text-[10px] font-bold text-accent-green">1,248 Online</span>
                            </div>
                        </div>
                        <div className="bg-white border border-border p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold uppercase text-text-muted">Active Signals</span>
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-mono">824</p>
                            <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-text-muted">
                                +42 Today
                            </div>
                        </div>
                        <div className="bg-white border border-border p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold uppercase text-text-muted">Revenue</span>
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-mono">₹4.8L</p>
                            <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-accent-green">
                                +12 Studio Upgrades
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-border bg-surface-2 flex justify-between items-center">
                                <h3 className="font-display">Recent Activity Log</h3>
                                <Terminal className="w-4 h-4 text-text-muted" />
                            </div>
                            <div className="divide-y divide-border">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-2 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-accent-blue' : 'bg-accent-green'}`} />
                                            <p className="text-sm font-medium">Node {i * 142} raised a new signal in Pune</p>
                                        </div>
                                        <span className="text-[10px] font-mono text-text-muted">14:2{i} GMT</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white border border-border p-8 rounded-2xl">
                            <h3 className="font-display mb-6">Security Alerts</h3>
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="p-4 border border-accent-red/20 bg-accent-red/5 rounded-xl flex gap-4">
                                        <AlertCircle className="w-5 h-5 text-accent-red shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold uppercase text-accent-red mb-1">High Urgency</p>
                                            <p className="text-xs text-text-primary mb-2">Multiple failed login attempts from IP 192.168.1.{i}</p>
                                            <button className="text-[10px] font-bold uppercase tracking-widest bg-accent-red text-white px-3 py-1 rounded">Moderate Node</button>
                                        </div>
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
