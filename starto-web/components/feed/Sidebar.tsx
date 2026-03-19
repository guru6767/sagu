"use client"

import { Home, Zap, BarChart3, Users, MapPin, Settings, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useSignalStore } from '@/store/useSignalStore'
import { useNetworkStore } from '@/store/useNetworkStore'

const navItems = [
    { icon: Home, label: 'Home Feed', href: '/feed' },
    { icon: Zap, label: 'My Signals', href: '/feed/my' },
    { icon: BarChart3, label: 'Starto AI', href: '/explore' },
    { icon: Users, label: 'My Network', href: '/network' },
    { icon: MapPin, label: 'Nearby', href: '/nearby' },
    { icon: Settings, label: 'Settings', href: '/profile' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { isVerified, name, role, city, avatarUrl, username } = useOnboardingStore()
    const { signals } = useSignalStore()
    const { connections } = useNetworkStore()
    const [imageError, setImageError] = useState(false)

    const mySignalCount = signals.filter(s => s.username === username).length
    const myNetworkCount = connections.length

    return (
        <aside className="w-[240px] sticky top-0 h-screen flex flex-col border-r border-border bg-background p-4 pt-8 shrink-0">
            <Link href="/profile" className="flex items-center gap-3 mb-10 px-2 group hover:bg-surface-2 p-2 rounded-xl transition-all">
                <div className="w-10 h-10 bg-surface-2 rounded-full overflow-hidden border border-border relative flex items-center justify-center">
                    {avatarUrl && !imageError ? (
                        <Image
                            src={avatarUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Users className="w-6 h-6 text-text-muted" />
                    )}
                </div>
                <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{name}</h3>
                        {isVerified && <BadgeCheck className="w-3.5 h-3.5 fill-black text-white" />}
                    </div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{role} • {city.split(',')[0]}</p>
                </div>
            </Link>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== '/feed' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-black/10'
                                : 'text-text-secondary hover:bg-surface-2 hover:text-primary'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="pt-6 border-t border-border mt-auto">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Signals</p>
                        <p className="text-lg font-mono font-bold">{mySignalCount}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Network</p>
                        <p className="text-lg font-mono font-bold">{myNetworkCount}</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                    <Image src="/logo.png" alt="Starto Logo" width={20} height={20} className="invert" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Starto V2</span>
                </div>
            </div>
        </aside>
    )
}
