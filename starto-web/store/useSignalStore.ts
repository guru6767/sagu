import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Comment {
    id: string;
    username: string;
    text: string;
    timestamp: number;
}

export interface Signal {
    id: string;
    title: string;
    username: string;
    timeAgo: string;
    category: string;
    description: string;
    strength: string;
    status: 'Active' | 'Solved';
    type?: 'need' | 'help';
    stats: {
        responses: number;
        offers: number;
        views: number;
    };
    comments?: Comment[];
    createdAt?: number;
}

interface SignalState {
    signals: Signal[];
    addSignal: (signal: Omit<Signal, 'id' | 'status' | 'stats'>) => void;
    deleteSignal: (id: string) => void;
    updateSignal: (id: string, signal: Partial<Omit<Signal, 'id' | 'status' | 'stats'>>) => void;
    incrementOffer: (id: string) => void;
    addComment: (signalId: string, text: string, username: string) => void;
}

export const useSignalStore = create<SignalState>()(
    persist(
        (set, get) => ({
            signals: [],
            addSignal: (newSignal) => set((state) => {
                const signal: Signal = {
                    ...newSignal,
                    id: Math.random().toString(36).substring(7),
                    status: 'Active',
                    stats: { responses: 0, offers: 0, views: 0 },
                    createdAt: Date.now()
                };
                return { signals: [signal, ...state.signals] };
            }),
            deleteSignal: (id) => set((state) => ({
                signals: state.signals.filter(s => s.id !== id)
            })),
            updateSignal: (id, updatedSignal) => set((state) => ({
                signals: state.signals.map(s => 
                    s.id === id ? { ...s, ...updatedSignal } : s
                )
            })),
            incrementOffer: (id) => set((state) => ({
                signals: state.signals.map(s => 
                    s.id === id ? { ...s, stats: { ...s.stats, offers: (s.stats?.offers || 0) + 1 } } : s
                )
            })),
            addComment: (signalId, text, username) => set((state) => ({
                signals: state.signals.map(s => 
                    s.id === signalId ? {
                        ...s,
                        stats: { ...s.stats, responses: s.stats.responses + 1 },
                        comments: [...(s.comments || []), { id: Date.now().toString(), username, text, timestamp: Date.now() }]
                    } : s
                )
            })),
        }),
        {
            name: 'starto-signal-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
