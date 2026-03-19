"use client"

import Sidebar from '@/components/feed/Sidebar'
import { Check, Shield, Zap, Star, Rocket, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useRouter } from 'next/navigation'

const plans = [
    {
        name: 'Free',
        price: '0',
        description: 'For individuals exploring the ecosystem.',
        features: [
            '3 signals per day',
            'Basic network access',
            'Standard AI insights',
            'Community support'
        ],
        buttonText: 'Current Plan',
        highlight: false,
        icon: Rocket
    },
    {
        name: 'Pro',
        price: '29',
        description: 'For active founders and builders.',
        features: [
            '50 signals per day',
            'Verified Badge (Black Check)',
            'Advanced AI Market Reports',
            'Priority Network Discovery',
            'Direct Messaging'
        ],
        buttonText: 'Upgrade to Pro',
        highlight: true,
        icon: Zap
    },
    {
        name: 'Founder',
        price: '99',
        description: 'For high-growth scaleups and VCs.',
        features: [
            'Unlimited signals',
            'Founder Status Badge',
            'Custom AI Intelligence Reports',
            'Private Network Access',
            'Dedicated Account Manager'
        ],
        buttonText: 'Get Founder Access',
        highlight: false,
        icon: Star
    }
]

export default function SubscriptionPage() {
    const { subscription, setSubscription } = useOnboardingStore()
    const router = useRouter()

    const handleUpgrade = (planName: string) => {
        if (planName === subscription) return

        // Simulate checkout process
        const confirm = window.confirm(`Confirm upgrade to ${planName} plan?`)
        if (confirm) {
            setSubscription(planName as 'Free' | 'Pro' | 'Founder')
            alert(`Welcome to ${planName}! Your verified badge is now active.`)
            router.push('/profile')
        }
    }

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <header className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 rounded-full border border-border mb-4"
                            >
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Starto Intelligence Premium</span>
                            </motion.div>
                            <h1 className="text-4xl lg:text-5xl font-display mb-4">Scale with Intelligence</h1>
                            <p className="text-text-secondary max-w-xl mx-auto">
                                Choose the plan that fits your growth stage. Unlock real-time signals,
                                verified status, and AI-powered market intelligence.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => {
                                const Icon = plan.icon
                                const isActive = subscription === plan.name

                                return (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative bg-white border ${plan.highlight ? 'border-primary shadow-2xl scale-105 z-10' : 'border-border'} p-8 rounded-2xl flex flex-col`}
                                    >
                                        {plan.highlight && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="mb-8 text-center md:text-left">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? 'bg-primary text-white' : 'bg-surface-2 text-primary'}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-2xl font-display mb-2">{plan.name}</h2>
                                            <div className="flex items-baseline gap-1 mb-2">
                                                <span className="text-4xl font-mono font-bold">${plan.price}</span>
                                                <span className="text-text-muted text-sm">/month</span>
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                {plan.description}
                                            </p>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-10">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-3">
                                                    <Check className="w-4 h-4 text-accent-green mt-0.5 shrink-0" />
                                                    <span className="text-sm text-text-secondary">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleUpgrade(plan.name)}
                                            disabled={isActive}
                                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${isActive
                                                    ? 'bg-surface-2 text-text-muted cursor-default'
                                                    : plan.highlight
                                                        ? 'bg-primary text-white hover:opacity-90 shadow-lg shadow-black/10'
                                                        : 'border border-border hover:bg-surface-2'
                                                }`}
                                        >
                                            {isActive ? 'Current Plan' : plan.buttonText}
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <footer className="mt-20 pt-10 border-t border-border text-center">
                            <div className="inline-flex items-center gap-6 grayscale opacity-50">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Trusted by</span>
                                <div className="flex gap-8">
                                    <span className="font-display font-bold text-lg">HYPER</span>
                                    <span className="font-display font-bold text-lg">QUARTZ</span>
                                    <span className="font-display font-bold text-lg">NEON</span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    )
}
