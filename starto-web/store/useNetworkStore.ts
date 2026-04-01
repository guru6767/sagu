import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Connection {
    username: string;
    category: string;
    timeAdded: number;
}

export interface Offer {
    id: string;
    signalId: string;
    name: string;
    projectLink: string;
    fromUsername: string;
    timestamp: number;
}

interface NetworkState {
    connections: Connection[];       // accepted connections
    pendingRequests: Connection[];   // sent, awaiting acceptance
    offers: Offer[];
    sendRequest: (node: Connection) => void;
    acceptRequest: (username: string) => void;
    rejectRequest: (username: string) => void;
    removeConnection: (username: string) => void;
    addOffer: (offer: Omit<Offer, 'id' | 'timestamp'>) => void;
    deleteOffer: (id: string) => void;
    isConnected: (username: string) => boolean;
    hasPendingRequest: (username: string) => boolean;
    clearAll: () => void;
}

export const useNetworkStore = create<NetworkState>()(
    persist(
        (set, get) => ({
            connections: [],
            pendingRequests: [],
            offers: [],
            sendRequest: (node) => set((state) => {
                if (state.connections.some(c => c.username === node.username)) return state;
                if (state.pendingRequests.some(r => r.username === node.username)) return state;
                return { pendingRequests: [node, ...state.pendingRequests] };
            }),
            acceptRequest: (username) => set((state) => {
                const node = state.pendingRequests.find(r => r.username === username);
                if (!node) return state;
                return {
                    pendingRequests: state.pendingRequests.filter(r => r.username !== username),
                    connections: [{ ...node, timeAdded: Date.now() }, ...state.connections],
                };
            }),
            rejectRequest: (username) => set((state) => ({
                pendingRequests: state.pendingRequests.filter(r => r.username !== username),
            })),
            removeConnection: (username) => set((state) => ({
                connections: state.connections.filter(c => c.username !== username)
            })),
            addOffer: (offer) => set((state) => ({
                offers: [{
                    ...offer,
                    id: Math.random().toString(36).substring(7),
                    timestamp: Date.now(),
                }, ...(state.offers || [])]
            })),
            deleteOffer: (id) => set((state) => ({
                offers: (state.offers || []).filter(o => o.id !== id)
            })),
            isConnected: (username) => get().connections.some(c => c.username === username),
            hasPendingRequest: (username) => get().pendingRequests.some(r => r.username === username),
            clearAll: () => set({ connections: [], pendingRequests: [], offers: [] }),
        }),
        {
            name: 'starto-network-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
