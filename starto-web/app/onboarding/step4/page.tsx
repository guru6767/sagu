"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

export default function OnboardingStep4() {
    const [city, setCity] = useState('')

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-xl shadow-md border border-border max-w-lg w-full"
            >
                <h2 className="text-3xl mb-2">Where are you based?</h2>
                <p className="text-text-secondary mb-8">This helps us show you nearby ecosystem nodes.</p>

                <div className="relative mb-6">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Type your city name..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-surface-2 p-4 pl-12 rounded-md outline-none border border-border focus:border-text-muted transition-all"
                    />
                </div>

                <button className="flex items-center gap-2 text-primary font-medium mb-12 hover:underline">
                    <Navigation className="w-4 h-4" />
                    Use my current location
                </button>

                <div className="bg-surface-2 p-4 rounded-md mb-8 border border-border text-sm text-text-secondary">
                    <p>Starto uses your location to connect you with founders, investors, and resources in your immediate vicinity.</p>
                </div>

                <button
                    disabled={!city}
                    className={`w-full py-4 rounded-md font-medium transition-all ${city ? 'bg-primary text-white hover:opacity-90' : 'bg-surface-2 text-text-muted cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>
            </motion.div>
        </div>
    )
}
