import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
    createdAt?: number;
}

interface SignalState {
    signals: Signal[];
    addSignal: (signal: Omit<Signal, 'id' | 'status' | 'stats'>) => void;
    deleteSignal: (id: string) => void;
    updateSignal: (id: string, signal: Partial<Omit<Signal, 'id' | 'status' | 'stats'>>) => void;
}

export const useSignalStore = create<SignalState>()(
    persist(
        (set, get) => ({
            signals: [],
            addSignal: (signal) => set((state) => ({ 
                signals: [{
                    ...signal,
                    id: Date.now().toString(),
                    status: 'Active' as const,
                    createdAt: Date.now(),
                    stats: { responses: 0, offers: 0, views: 0 }
                }, ...state.signals]
            })),
            deleteSignal: (id) => set((state) => ({
                signals: state.signals.filter(s => s.id !== id)
            })),
            updateSignal: (id, updatedSignal) => set((state) => ({
                signals: state.signals.map(s => 
                    s.id === id ? { ...s, ...updatedSignal } : s
                )
            })),
        }),
        {
            name: 'starto-signal-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
