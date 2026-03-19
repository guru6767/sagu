"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, User } from 'lucide-react'

export default function OnboardingStep5() {
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-md border border-border max-w-lg w-full"
            >
                <h2 className="text-3xl mb-8 text-center">Set up your identity.</h2>

                <div className="flex flex-col items-center mb-10">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 bg-surface-2 rounded-full flex items-center justify-center border-2 border-dashed border-border group-hover:border-text-muted transition-all">
                            <User className="w-10 h-10 text-text-muted" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white border-2 border-white">
                            <Camera className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-sm text-text-muted mt-4">Upload profile photo</p>
                </div>

                <div className="space-y-6 mb-10">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="yourname"
                                className="w-full bg-surface-2 p-3 pl-8 rounded-md outline-none border border-border focus:border-text-muted transition-all"
                            />
                            {username.length > 3 && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-green" />
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-sm font-medium block">Bio</label>
                            <span className="text-xs text-text-muted">{bio.length}/300</span>
                        </div>
                        <textarea
                            maxLength={300}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the network who you are..."
                            className="w-full bg-surface-2 p-3 rounded-md outline-none border border-border focus:border-text-muted transition-all h-24 resize-none"
                        />
                    </div>
                </div>

                <button
                    disabled={!username}
                    className={`w-full py-4 rounded-md font-medium transition-all ${username ? 'bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/10' : 'bg-surface-2 text-text-muted cursor-not-allowed'
                        }`}
                >
                    Enter Starto
                </button>
            </motion.div>
        </div>
    )
}
