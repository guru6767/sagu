import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface OnboardingState {
    role: string
    industry: string
    subIndustry: string
    city: string
    lat: number | null
    lng: number | null
    name: string
    username: string
    bio: string
    avatarUrl: string | null
    coverUrl: string | null
    linkedin: string
    twitter: string
    github: string
    website: string
    subscription: 'Free' | 'Pro' | 'Founder'
    isVerified: boolean

    setRole: (role: string) => void
    setIndustry: (industry: string, subIndustry?: string) => void
    setLocation: (city: string, lat: number, lng: number) => void
    setProfile: (profile: Partial<OnboardingState>) => void
    setSubscription: (plan: 'Free' | 'Pro' | 'Founder') => void
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            role: 'Founder',
            industry: '',
            subIndustry: '',
            city: 'Bangalore, IN',
            lat: null,
            lng: null,
            name: 'Krishna K.',
            username: 'krish_startup',
            bio: 'Building Starto V2 to democratize ecosystem intelligence for Indian founders. Focused on AI system orchestration and real-world signal exchange.',
            avatarUrl: '/profile_pic.png',
            coverUrl: '/logo.png',
            linkedin: 'linkedin.com/in/krishstartup',
            twitter: '@krish_dev',
            github: 'github.com/krish',
            website: 'krishnak.dev',
            subscription: 'Free',
            isVerified: false,

            setRole: (role) => set({ role }),
            setIndustry: (industry, subIndustry = '') => set({ industry, subIndustry }),
            setLocation: (city, lat, lng) => set({ city, lat, lng }),
            setProfile: (profile) => set((state) => ({ ...state, ...profile })),
            setSubscription: (plan) => set({ subscription: plan, isVerified: plan !== 'Free' }),
        }),
        {
            name: 'starto-onboarding-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
