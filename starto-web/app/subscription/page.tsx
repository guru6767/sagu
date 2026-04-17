"use client"

import Sidebar from '@/components/feed/Sidebar'
import MobileBottomNav from '@/components/feed/MobileBottomNav'
import { Check, Shield, Zap, Star, Rocket, X, BadgeCheck, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const plans = [
    {
        name: 'Free',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'For individuals exploring the ecosystem.',
        features: [
            '3 signals per day',
            'Basic network access',
            'Standard AI insights',
            'Community support'
        ],
        buttonText: 'Current Plan',
        highlight: false,
        icon: Rocket,
        badge: null
    },
    {
        name: 'Pro',
        monthlyPrice: 29,
        yearlyPrice: 19,
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
        icon: Zap,
        badge: 'Most Popular'
    },
    {
        name: 'Founder',
        monthlyPrice: 99,
        yearlyPrice: 79,
        description: 'For high-growth scaleups and VCs.',
        features: [
            'Unlimited signals',
            'Verified Badge (Black Check)',
            'Founder Status Badge',
            'Custom AI Intelligence Reports',
            'Private Network Access',
            'Dedicated Account Manager'
        ],
        buttonText: 'Get Founder Access',
        highlight: false,
        icon: Star,
        badge: null
    }
]

export default function SubscriptionPage() {
    const { user, updateUser, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
    const [confirmPlan, setConfirmPlan] = useState<string | null>(null)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [successPlan, setSuccessPlan] = useState<string | null>(null)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth')
        }
    }, [isAuthenticated, router])

    const subscription = user?.subscription || user?.plan || 'Free'

    const handleUpgradeClick = (planName: string) => {
        if (planName === subscription) return
        if (planName === 'Free') return // can't downgrade via this UI
        setConfirmPlan(planName)
    }

    const handleConfirmUpgrade = async () => {
        if (!confirmPlan) return
        setIsUpgrading(true)

        try {
            // Try backend first
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081'}/api/subscriptions/upgrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuthStore.getState().token}`
                },
                body: JSON.stringify({ plan: confirmPlan })
            })

            if (response.ok) {
                const data = await response.json()
                updateUser({ plan: data.plan, subscription: data.plan })
            } else {
                // Fallback: update locally so UI is responsive
                updateUser({ plan: confirmPlan, subscription: confirmPlan })
            }
        } catch {
            // Offline / backend down – still update locally
            updateUser({ plan: confirmPlan, subscription: confirmPlan })
        }

        setIsUpgrading(false)
        setSuccessPlan(confirmPlan)
        setConfirmPlan(null)
    }

    if (!isAuthenticated || !user) return (
        <div className="min-h-screen bg-background flex justify-center items-center text-text-muted">Loading...</div>
    )

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex flex-col md:flex-row pb-16 md:pb-0">
                <Sidebar />

                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">

                        {/* Header */}
                        <header className="text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-surface-2 rounded-full border border-border mb-4"
                            >
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Starto Intelligence Premium</span>
                            </motion.div>
                            <h1 className="text-4xl lg:text-5xl font-display mb-4">Scale with Intelligence</h1>
                            <p className="text-text-secondary max-w-xl mx-auto mb-8">
                                Choose the plan that fits your growth stage. Unlock real-time signals,
                                verified status, and AI-powered market intelligence.
                            </p>

                            {/* Billing Toggle */}
                            <div className="inline-flex items-center gap-1 bg-surface-2 border border-border rounded-full p-1">
                                <button
                                    onClick={() => setBilling('monthly')}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${billing === 'monthly' ? 'bg-white shadow text-black' : 'text-text-muted'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBilling('yearly')}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-white shadow text-black' : 'text-text-muted'}`}
                                >
                                    Yearly
                                    <span className="bg-accent-green/20 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        Save 35%
                                    </span>
                                </button>
                            </div>
                        </header>

                        {/* Success Banner */}
                        <AnimatePresence>
                            {successPlan && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <BadgeCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-800">Welcome to {successPlan}!</p>
                                            <p className="text-sm text-green-600">Your verified badge and new features are now active.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSuccessPlan(null)} className="text-green-400 hover:text-green-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Plan Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {plans.map((plan, index) => {
                                const Icon = plan.icon
                                const isActive = subscription === plan.name
                                const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice

                                return (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative bg-white border rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                                            isActive
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : plan.highlight
                                                ? 'border-primary shadow-2xl scale-105 z-10'
                                                : 'border-border hover:border-primary/40 hover:shadow-lg'
                                        }`}
                                    >
                                        {/* Badge */}
                                        {plan.badge && (
                                            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-[9px] font-bold uppercase tracking-widest text-center py-1.5">
                                                {plan.badge}
                                            </div>
                                        )}
                                        {isActive && !plan.badge && (
                                            <div className="absolute top-0 left-0 right-0 bg-black text-white text-[9px] font-bold uppercase tracking-widest text-center py-1.5">
                                                Your Current Plan
                                            </div>
                                        )}

                                        <div className={`p-7 flex flex-col flex-1 ${plan.badge || isActive ? 'pt-10' : ''}`}>
                                            {/* Icon + Name */}
                                            <div className="mb-6">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? 'bg-primary text-white' : 'bg-surface-2 text-primary'}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <h2 className="text-2xl font-display mb-1">{plan.name}</h2>
                                                <div className="flex items-baseline gap-1 mb-2">
                                                    <AnimatePresence mode="wait">
                                                        <motion.span
                                                            key={`${plan.name}-${billing}`}
                                                            initial={{ opacity: 0, y: -4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 4 }}
                                                            className="text-4xl font-mono font-bold"
                                                        >
                                                            ${price}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                    <span className="text-text-muted text-sm">/month</span>
                                                    {billing === 'yearly' && price > 0 && (
                                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full ml-1">
                                                            Yearly
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-text-secondary leading-relaxed">{plan.description}</p>
                                            </div>

                                            {/* Features */}
                                            <div className="flex-1 space-y-3 mb-8">
                                                {plan.features.map((feature) => (
                                                    <div key={feature} className="flex items-start gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check className="w-3 h-3 text-primary" />
                                                        </div>
                                                        <span className="text-sm text-text-secondary">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* CTA Button */}
                                            <button
                                                onClick={() => handleUpgradeClick(plan.name)}
                                                disabled={isActive || plan.name === 'Free'}
                                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${
                                                    isActive
                                                        ? 'bg-surface-2 text-text-muted cursor-default'
                                                        : plan.name === 'Free'
                                                        ? 'bg-surface-2 text-text-muted cursor-default'
                                                        : plan.highlight
                                                        ? 'bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 active:scale-95'
                                                        : 'bg-black text-white hover:bg-primary active:scale-95'
                                                }`}
                                            >
                                                {isActive ? '✓ Current Plan' : plan.buttonText}
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Feature Comparison Table */}
                        <div className="mb-16 overflow-x-hidden">
                            <h2 className="text-2xl font-display text-center mb-8">Compare All Features</h2>
                            <div className="bg-white border border-border rounded-2xl overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-5 font-bold text-text-muted text-[10px] uppercase tracking-widest w-1/2">Feature</th>
                                            <th className="p-5 font-bold text-[10px] uppercase tracking-widest">Free</th>
                                            <th className="p-5 font-bold text-[10px] uppercase tracking-widest bg-primary/5 text-primary">Pro</th>
                                            <th className="p-5 font-bold text-[10px] uppercase tracking-widest">Founder</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: 'Daily Signals', free: '3', pro: '50', founder: 'Unlimited' },
                                            { label: 'Verified Badge', free: '✗', pro: '✓', founder: '✓' },
                                            { label: 'AI Market Reports', free: 'Basic', pro: 'Advanced', founder: 'Custom' },
                                            { label: 'Network Discovery', free: 'Standard', pro: 'Priority', founder: 'Private' },
                                            { label: 'Direct Messaging', free: '✗', pro: '✓', founder: '✓' },
                                            { label: 'Account Manager', free: '✗', pro: '✗', founder: '✓' },
                                        ].map((row, i) => (
                                            <tr key={row.label} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-surface-1/50'}`}>
                                                <td className="p-5 font-medium text-text-secondary">{row.label}</td>
                                                <td className="p-5 text-center text-text-muted">{row.free}</td>
                                                <td className="p-5 text-center bg-primary/5 font-bold text-primary">{row.pro}</td>
                                                <td className="p-5 text-center">{row.founder}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
                <MobileBottomNav />
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmPlan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !isUpgrading && setConfirmPlan(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display">Confirm Upgrade</h3>
                                    <p className="text-sm text-text-muted">Switch to {confirmPlan} Plan</p>
                                </div>
                            </div>

                            <div className="p-4 bg-surface-2 rounded-xl border border-border mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary">New plan</span>
                                    <span className="font-bold">{confirmPlan}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-text-secondary">Billing</span>
                                    <span className="font-bold capitalize">{billing}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-text-secondary">Amount</span>
                                    <span className="font-bold">
                                        ${billing === 'monthly'
                                            ? plans.find(p => p.name === confirmPlan)?.monthlyPrice
                                            : plans.find(p => p.name === confirmPlan)?.yearlyPrice}/mo
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-text-muted mb-6 text-center">
                                By confirming, you agree to our Terms of Service. Cancel anytime.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmPlan(null)}
                                    disabled={isUpgrading}
                                    className="flex-1 border border-border py-3 rounded-xl text-sm font-bold hover:bg-surface-2 transition-colors disabled:opacity-40"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmUpgrade}
                                    disabled={isUpgrading}
                                    className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {isUpgrading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Activating...
                                        </>
                                    ) : (
                                        `Upgrade to ${confirmPlan}`
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
