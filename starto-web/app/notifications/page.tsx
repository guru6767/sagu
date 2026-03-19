import Sidebar from '@/components/feed/Sidebar'
import { Bell, Zap, UserPlus, MessageSquare, ArrowRight } from 'lucide-react'

export default function NotificationsPage() {
    const notifications = [
        { type: 'signal', icon: Zap, color: 'text-accent-yellow', text: 'Arjun Sharma responded to your signal: "Need Full-stack Developer..."', time: '10m ago' },
        { type: 'connection', icon: UserPlus, color: 'text-accent-blue', text: 'Rahul M. sent you a connection request.', time: '2h ago' },
        { type: 'message', icon: MessageSquare, color: 'text-primary', text: 'You have a new message from Node Connection 1.', time: '4h ago' },
    ]

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen p-6">
                    <header className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-display">Notifications</h1>
                            <p className="text-xs text-text-secondary">Stay updated with your ecosystem activity.</p>
                        </div>
                        <button className="text-xs font-bold uppercase text-text-muted hover:text-primary transition-all underline underline-offset-4">Mark all as read</button>
                    </header>

                    <div className="space-y-4">
                        {notifications.map((notif, i) => (
                            <div key={i} className="bg-white border border-border p-5 rounded-xl flex items-center gap-6 group hover:border-text-muted transition-all cursor-pointer">
                                <div className={`w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center ${notif.color} border border-border`}>
                                    <notif.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-relaxed mb-1">{notif.text}</p>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">{notif.time}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-all">
                                    <ArrowRight className="w-5 h-5 text-text-muted" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 border-2 border-dashed border-border rounded-xl text-center opacity-40">
                        <Bell className="w-10 h-10 mx-auto mb-4 text-text-muted" />
                        <p className="text-sm">No more notifications for today.</p>
                    </div>
                </main>
            </div>
        </div>
    )
}
