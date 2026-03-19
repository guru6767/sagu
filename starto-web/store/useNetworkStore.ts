import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface NetworkNode {
    username: string;
    category: string;
    timeAdded: number;
}

interface NetworkState {
    connections: NetworkNode[];       // accepted connections
    pendingRequests: NetworkNode[];   // sent, awaiting acceptance
    sendRequest: (node: NetworkNode) => void;
    acceptRequest: (username: string) => void;
    rejectRequest: (username: string) => void;
    removeConnection: (username: string) => void;
    isConnected: (username: string) => boolean;
    hasPendingRequest: (username: string) => boolean;
}

export const useNetworkStore = create<NetworkState>()(
    persist(
        (set, get) => ({
            connections: [],
            pendingRequests: [],
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
            isConnected: (username) => get().connections.some(c => c.username === username),
            hasPendingRequest: (username) => get().pendingRequests.some(r => r.username === username),
        }),
        {
            name: 'starto-network-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
