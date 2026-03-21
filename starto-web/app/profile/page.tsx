"use client"

import Sidebar from '@/components/feed/Sidebar'
import { MapPin, Globe, Twitter, Linkedin, Github, Signal, Zap, Camera, Upload, Users, BadgeCheck, Star, Edit3, Check, X, Link as LinkIcon, Clock } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { useOnboardingStore } from '@/store/useOnboardingStore'
import { useSignalStore } from '@/store/useSignalStore'
import { useNetworkStore } from '@/store/useNetworkStore'
import { useRatingStore } from '@/store/useRatingStore'
import { useResponseStore } from '@/store/useResponseStore'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserProfile() {
    const formatURL = (url: string) => {
        if (!url) return '#'
        return url.startsWith('http') ? url : `https://${url}`
    }

    const extractHandle = (url: string, prefix = '@') => {
        if (!url) return ''
        const parts = url.split('/').filter(Boolean)
        const lastPart = parts[parts.length - 1] || ''
        return lastPart.startsWith('@') ? lastPart : `${prefix}${lastPart}`
    }

    const {
        isVerified,
        subscription,
        name,
        username,
        role,
        city,
        bio,
        website,
        linkedin,
        twitter,
        github,
        avatarUrl,
        coverUrl,
        setProfile
    } = useOnboardingStore()

    const { signals } = useSignalStore()
    const { connections } = useNetworkStore()
    const { getAverageRating, getRatingsFor } = useRatingStore()
    const { responses } = useResponseStore()

    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
    const mySignals = signals.filter(s => s.username === username)
    const activeSignals = mySignals.filter(s => s.status === 'Active' && (!s.createdAt || Date.now() - s.createdAt < SEVEN_DAYS))
    const pastSignals = mySignals.filter(s => s.status === 'Solved' || (s.createdAt && Date.now() - s.createdAt >= SEVEN_DAYS))
    const avgRating = getAverageRating(username)
    const myRatings = getRatingsFor(username)
    const [activeTab, setActiveTab] = useState<'active' | 'past' | 'responses'>('active')

    const [isEditing, setIsEditing] = useState(false)
    const [isEditingSocial, setIsEditingSocial] = useState(false)
    const [socialForm, setSocialForm] = useState({ linkedin, twitter, github })
    const [editForm, setEditForm] = useState({
        name,
        role,
        city,
        bio,
        website,
        linkedin,
        twitter,
        github,
        avatarUrl,
        coverUrl,
        handleBase: username ? username.split('_').slice(0, -1).join('_') : name.split(' ')[0].toLowerCase()
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const logoInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = (type: 'profile' | 'logo') => {
        if (type === 'profile') fileInputRef.current?.click()
        else logoInputRef.current?.click()
    }

    const handleRemove = (type: 'profile' | 'logo') => {
        if (type === 'profile') setEditForm(prev => ({ ...prev, avatarUrl: null }))
        else setEditForm(prev => ({ ...prev, coverUrl: null }))
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'logo') => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            if (type === 'profile') setEditForm(prev => ({ ...prev, avatarUrl: url }))
            else setEditForm(prev => ({ ...prev, coverUrl: url }))
        }
    }

    const handleSave = () => {
        const formattedRole = editForm.role.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        const formattedBase = editForm.handleBase.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]+/g, '');
        const newUsername = `${formattedBase}_${formattedRole}`;
        
        setProfile({
            ...editForm,
            username: newUsername
        });
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditForm({ name, role, city, bio, website, linkedin, twitter, github, avatarUrl, coverUrl, handleBase: username ? username.split('_').slice(0, -1).join('_') : name.split(' ')[0].toLowerCase() })
        setIsEditing(false)
    }

    const handleSaveSocial = () => {
        setProfile({ linkedin: socialForm.linkedin, twitter: socialForm.twitter, github: socialForm.github })
        setIsEditingSocial(false)
    }

    const handleCancelSocial = () => {
        setSocialForm({ linkedin, twitter, github })
        setIsEditingSocial(false)
    }

    return (
        <div className="min-h-screen bg-background flex justify-center">
            <div className="max-w-[1400px] w-full flex">
                <Sidebar />

                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => onFileChange(e, 'profile')} accept="image/*" />
                <input type="file" ref={logoInputRef} className="hidden" onChange={(e) => onFileChange(e, 'logo')} accept="image/*" />

                <main className="flex-1 max-w-[680px] border-r border-border min-h-screen p-0">
                    {/* Cover Section */}
                    <div className="h-48 bg-primary relative overflow-hidden group/banner">
                        {(isEditing ? editForm.coverUrl : coverUrl) ? (
                            <Image
                                src={isEditing ? editForm.coverUrl! : coverUrl!}
                                alt="Cover"
                                fill
                                className="object-cover opacity-20 invert"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-surface-2 flex items-center justify-center">
                                <Globe className="w-12 h-12 text-text-muted opacity-20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {isEditing && (
                            <div className="absolute bottom-4 right-4 flex gap-2 transition-all">
                                <button
                                    onClick={() => handleUpload('logo')}
                                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white backdrop-blur-md flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <Camera className="w-4 h-4" /> Change Cover
                                </button>
                                {(isEditing ? editForm.coverUrl : coverUrl) && (
                                    <button
                                        onClick={() => handleRemove('logo')}
                                        className="bg-accent-red/20 hover:bg-accent-red/40 p-2 rounded-lg text-white backdrop-blur-md flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Profile Picture Section */}
                    <div className="h-0 relative">
                        <div className="absolute -top-16 left-8">
                            <div className="w-32 h-32 bg-white rounded-3xl p-1.5 border-4 border-background shadow-2xl relative group overflow-hidden">
                                {(isEditing ? editForm.avatarUrl : avatarUrl) ? (
                                    <Image
                                        src={isEditing ? editForm.avatarUrl! : avatarUrl!}
                                        alt="Profile"
                                        fill
                                        className="object-cover rounded-2xl"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface-2 rounded-2xl flex items-center justify-center">
                                        <Users className="w-12 h-12 text-text-muted" />
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                                        <div className="flex flex-col items-center gap-2">
                                            <button onClick={() => handleUpload('profile')} className="flex flex-col items-center hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 mb-1" />
                                                <span className="text-[10px] font-bold uppercase">Update</span>
                                            </button>
                                            {(isEditing ? editForm.avatarUrl : avatarUrl) && (
                                                <button onClick={() => handleRemove('profile')} className="text-[10px] font-bold uppercase text-accent-red hover:underline mt-2">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Body */}
                    <div className="px-8 pt-20 pb-8 border-b border-border">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1 mr-4">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">Full Name</label>
                                                <input
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full bg-surface-1 border border-border p-2 rounded-md font-display text-xl focus:ring-1 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">Role</label>
                                                <input
                                                    value={editForm.role}
                                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                    className="w-full bg-surface-1 border border-border p-2 rounded-md font-medium text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">Custom User Handle</label>
                                                <input
                                                    value={editForm.handleBase}
                                                    onChange={(e) => setEditForm({ ...editForm, handleBase: e.target.value })}
                                                    placeholder="guru hugar"
                                                    className="w-full bg-surface-1 border border-primary/30 p-2 rounded-md font-mono text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">Bio</label>
                                            <textarea
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                rows={3}
                                                className="w-full bg-surface-1 border border-border p-2 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                    <input
                                                        value={editForm.city}
                                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                                        className="w-full bg-surface-1 border border-border p-2 pl-8 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">Website</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                    <input
                                                        value={editForm.website}
                                                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                                        className="w-full bg-surface-1 border border-border p-2 pl-8 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h1 className="text-3xl font-display">{name}</h1>
                                            {isVerified && <BadgeCheck className="w-6 h-6 fill-black text-white" />}
                                        </div>
                                        <p className="text-text-secondary font-medium mb-4 flex items-center gap-2">
                                            {role} • {city}
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                                            <span className="text-[10px] px-2 py-0.5 bg-surface-2 rounded-full uppercase tracking-tighter font-bold border border-border">
                                                {subscription} Account
                                            </span>
                                        </p>
                                        <div className="flex gap-4 mb-6">
                                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                <MapPin className="w-3.5 h-3.5" /> {city}
                                            </span>
                                            <Link href={formatURL(website)} target="_blank" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                                                <Globe className="w-3.5 h-3.5" /> {website.replace(/^https?:\/\//, '')}
                                            </Link>
                                        </div>
                                        <p className="text-sm text-text-secondary leading-relaxed max-w-lg mb-6">
                                            {bio}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
                                            <Check className="w-4 h-4" /> Save
                                        </button>
                                        <button onClick={handleCancel} className="px-6 py-2 border border-border rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-2">
                                            <X className="w-4 h-4" /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-black text-white rounded-md text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
                                            <Edit3 className="w-4 h-4" /> Edit Profile
                                        </button>
                                        <Link href="/subscription" className="px-6 py-2 border border-border rounded-md text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-2">
                                            <Star className="w-4 h-4" /> {subscription === 'Free' ? 'Upgrade' : 'My Plan'}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="flex gap-12 pt-6">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Signals</p>
                                <p className="text-2xl font-mono font-bold">{mySignals.length}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Connections</p>
                                <p className="text-2xl font-mono font-bold">{connections.length}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Rating</p>
                                <div className="flex items-center gap-1">
                                    <p className="text-2xl font-mono font-bold">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</p>
                                    {avgRating > 0 && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                                </div>
                                <p className="text-[10px] text-text-muted">{myRatings.length} {myRatings.length === 1 ? 'review' : 'reviews'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Signals Feed Section */}
                    <div className="p-8">
                        <div className="flex items-center gap-8 border-b border-border mb-8">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${
                                    activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'
                                }`}
                            >
                                Active Signals ({activeSignals.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${
                                    activeTab === 'past' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'
                                }`}
                            >
                                Past History ({pastSignals.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('responses')}
                                className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${
                                    activeTab === 'responses' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'
                                }`}
                            >
                                My Responses ({responses.length})
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* ACTIVE SIGNALS TAB */}
                            {activeTab === 'active' && (
                                activeSignals.length === 0 ? (
                                    <div className="flex flex-col items-center py-16 text-center text-text-muted">
                                        <Zap className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm">No active signals. Raise one from the Home Feed!</p>
                                    </div>
                                ) : (
                                    activeSignals.map(signal => (
                                        <div key={signal.id} className="p-6 bg-surface-2 rounded-2xl border border-border group hover:border-primary transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] px-2 py-0.5 bg-black text-white rounded-full uppercase font-bold tracking-widest">{signal.category}</span>
                                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">● Active</span>
                                            </div>
                                            <h3 className="text-xl font-display mb-2 group-hover:text-primary transition-colors">{signal.title}</h3>
                                            <p className="text-sm text-text-secondary line-clamp-2">{signal.description}</p>
                                            <div className="mt-4 pt-4 border-t border-border flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> {signal.stats.responses} Responses</span>
                                                <span className="text-text-muted">Expires in 7 days</span>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}

                            {/* PAST HISTORY TAB */}
                            {activeTab === 'past' && (
                                pastSignals.length === 0 ? (
                                    <div className="flex flex-col items-center py-16 text-center text-text-muted">
                                        <Clock className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm">No past signals yet.</p>
                                    </div>
                                ) : (
                                    pastSignals.map(signal => (
                                        <div key={signal.id} className="p-6 bg-surface-2 rounded-2xl border border-border group transition-all opacity-75">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] px-2 py-0.5 bg-text-muted text-white rounded-full uppercase font-bold tracking-widest">{signal.category}</span>
                                                {signal.status === 'Solved' ? (
                                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">✓ Completed</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Expired</span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-display mb-2">{signal.title}</h3>
                                            <p className="text-sm text-text-secondary line-clamp-2">{signal.description}</p>
                                        </div>
                                    ))
                                )
                            )}

                            {/* MY RESPONSES TAB */}
                            {activeTab === 'responses' && (
                                responses.length === 0 ? (
                                    <div className="flex flex-col items-center py-16 text-center text-text-muted">
                                        <Users className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm">You haven't responded to any signals yet.</p>
                                    </div>
                                ) : (
                                    responses.map(r => (
                                        <div key={r.id} className="p-6 bg-surface-2 rounded-2xl border border-border group hover:border-primary transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] px-2 py-0.5 bg-black text-white rounded-full uppercase font-bold tracking-widest">{r.signalCategory}</span>
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Responded</span>
                                            </div>
                                            <h3 className="text-xl font-display mb-2 group-hover:text-primary transition-colors">{r.signalTitle}</h3>
                                            <p className="text-xs text-text-muted">Signal by @{r.signalUsername}</p>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Social Links */}
                <aside className="hidden xl:block w-[320px] p-8 space-y-8">
                    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display text-xl">Social Nodes</h3>
                            {!isEditingSocial ? (
                                <button
                                    onClick={() => { setSocialForm({ linkedin, twitter, github }); setIsEditingSocial(true); }}
                                    className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-primary transition-all"
                                    title="Edit social links"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSaveSocial} className="p-1.5 rounded-lg bg-primary text-white hover:opacity-90 transition-all" title="Save">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleCancelSocial} className="p-1.5 rounded-lg border border-border hover:bg-surface-2 transition-all" title="Cancel">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditingSocial ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">LinkedIn URL</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            value={socialForm.linkedin}
                                            onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className="w-full bg-surface-1 border border-border p-2 pl-8 rounded-lg text-xs focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">Twitter (X) Handle</label>
                                    <div className="relative">
                                        <Twitter className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            value={socialForm.twitter}
                                            onChange={(e) => setSocialForm({ ...socialForm, twitter: e.target.value })}
                                            placeholder="@yourhandle"
                                            className="w-full bg-surface-1 border border-border p-2 pl-8 rounded-lg text-xs focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1 block">GitHub URL</label>
                                    <div className="relative">
                                        <Github className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            value={socialForm.github}
                                            onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                                            placeholder="https://github.com/yourusername"
                                            className="w-full bg-surface-1 border border-border p-2 pl-8 rounded-lg text-xs focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {linkedin ? (
                                    <Link href={formatURL(linkedin)} target="_blank" className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold uppercase text-text-muted">LinkedIn</p>
                                            <p className="text-sm font-medium truncate">{extractHandle(linkedin, '')}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4 opacity-40">
                                        <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center border border-border"><Linkedin className="w-5 h-5" /></div>
                                        <p className="text-xs text-text-muted italic">No LinkedIn added</p>
                                    </div>
                                )}
                                {twitter ? (
                                    <Link href={formatURL(`twitter.com/${twitter.replace('@', '')}`)} target="_blank" className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center border border-border group-hover:bg-black group-hover:text-white transition-all">
                                            <Twitter className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold uppercase text-text-muted">Twitter</p>
                                            <p className="text-sm font-medium truncate">{twitter.startsWith('@') ? twitter : `@${twitter}`}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4 opacity-40">
                                        <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center border border-border"><Twitter className="w-5 h-5" /></div>
                                        <p className="text-xs text-text-muted italic">No Twitter added</p>
                                    </div>
                                )}
                                {github ? (
                                    <Link href={formatURL(github)} target="_blank" className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center border border-border group-hover:bg-black group-hover:text-white transition-all">
                                            <Github className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold uppercase text-text-muted">GitHub</p>
                                            <p className="text-sm font-medium truncate">{extractHandle(github, '')}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4 opacity-40">
                                        <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center border border-border"><Github className="w-5 h-5" /></div>
                                        <p className="text-xs text-text-muted italic">No GitHub added</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-primary p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-display text-xl mb-2">Need Beta Testing?</h3>
                            <p className="text-white/70 text-sm mb-6 leading-relaxed">Connect with our QA nodes and launch your MVP without bugs.</p>
                            <button className="w-full bg-white text-black py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-surface-2 transition-colors">Start Hiring</button>
                        </div>
                        <Signal className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                    </div>
                </aside>
            </div>
        </div>
    )
}
