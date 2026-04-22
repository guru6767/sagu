import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { connectionsApi, offersApi } from '@/lib/apiClient'
import { useAuthStore } from './useAuthStore'

export interface Connection {
    id: string;
    status: string;
    message?: string;
    createdAt: string;
    requesterId: string;
    requesterName: string;
    requesterUsername: string;
    requesterAvatarUrl?: string;
    requesterRole: string;
    receiverId: string;
    receiverName: string;
    receiverUsername: string;
    receiverAvatarUrl?: string;
    receiverRole: string;
    signalId?: string;
}

export interface Offer {
    id: string;
    signalId: string;
    requesterId: string;
    receiverId: string;
    requesterUsername: string;
    receiverUsername: string;
    requesterName: string;
    receiverName: string;
    organizationName: string;
    portfolioLink: string;
    message: string;
    status: string;
    createdAt: string;
}

interface NetworkState {
    connections: Connection[];       // accepted connections
    pendingRequests: Connection[];   // incoming requests
    sentRequests: Connection[];      // outgoing requests
    offers: Offer[];
    
    sendRequest: (signalId: string, message: string, targetUsername?: string) => Promise<void>;
    fetchRequests: () => Promise<void>;
    acceptRequest: (connectionId: string) => Promise<void>;
    rejectRequest: (connectionId: string) => Promise<void>;
    
    addOffer: (offer: Omit<Offer, 'id' | 'timestamp'>) => void;
    deleteOffer: (id: string) => void;
    clearAll: () => void;
}

export const useNetworkStore = create<NetworkState>()(
    persist(
        (set, get) => ({
            connections: [],
            pendingRequests: [],
            sentRequests: [],
            offers: [],

    sendRequest: async (signalId, message, targetUsername) => {
        try {
            const { error } = await connectionsApi.sendRequest(signalId, message, targetUsername);
            if (!error) {
                await get().fetchRequests();
                return;
            }
            console.error('Backend sendRequest error:', error);
        } catch (e) {
            console.error('Failed to send request:', e);
        }
        
        // Fallback to local only on error or if no backend
        set(state => ({
            sentRequests: [
                ...state.sentRequests.filter(r => r.username !== targetUsername), // replace if exists
                {
                    id: Date.now().toString(),
                    username: targetUsername || 'unknown',
                    category: 'General',
                    timeAdded: Date.now(),
                    status: 'pending'
                }
            ]
        }));
    },

    fetchRequests: async () => {
        const [pendingRes, sentRes, acceptedRes] = await Promise.all([
            connectionsApi.getPending(),
            connectionsApi.getSent(),
            connectionsApi.getAccepted()
        ]);

        if (pendingRes.data) {
            set({ pendingRequests: pendingRes.data.map(r => ({
                id: r.id,
                username: (r as any).requesterUsername || 'unknown',
                category: r.category || 'General',
                timeAdded: new Date(r.createdAt).getTime(),
                status: r.status,
                message: r.message
            }))});
        }

        if (sentRes.data) {
            set({ sentRequests: sentRes.data.map(r => ({
                id: r.id,
                username: (r as any).receiverUsername || 'unknown',
                category: r.category || 'General',
                timeAdded: new Date(r.createdAt).getTime(),
                status: r.status,
                message: r.message
            }))});
        }

        if (acceptedRes.data) {
            const currentUser = useAuthStore.getState().user?.username;
            set({ connections: acceptedRes.data.map(r => ({
                id: r.id,
                username: (r as any).requesterUsername === currentUser 
                    ? (r as any).receiverUsername 
                    : (r as any).requesterUsername,
                category: r.category || 'General',
                timeAdded: new Date(r.createdAt).getTime(),
                status: r.status,
            }))});
        }
    },

    fetchOffers: async () => {
        try {
            const { data } = await offersApi.getInbox();
            if (data) set({ offers: data });
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        }
    },

    addOffer: async (offer: { signalId: string; organizationName: string; portfolioLink: string; message: string }) => {
        try {
            const { data } = await offersApi.create(offer);
            if (data) {
                set((state) => ({ 
                    offers: [...state.offers, data] 
                }));
            }
            return data;
        } catch (error) {
            console.error('Failed to send offer:', error);
            throw error;
        }
    },

    fetchAccepted: async () => {
        const currentUser = useAuthStore.getState().user?.username;
        if (!currentUser) return;
        try {
            const { data } = await connectionsApi.getAccepted();
            if (data) {
                set({ connections: data.map((r: any) => ({
                    id: r.id,
                    username: r.requesterUsername === currentUser 
                        ? r.receiverUsername 
                        : r.requesterUsername,
                    category: r.category || 'General',
                    timeAdded: new Date(r.createdAt).getTime(),
                    status: r.status,
                }))});
            }
        } catch (error) {
            console.error('Failed to fetch connections:', error);
        }
    },

    acceptRequest: async (requestId) => {
        try {
            const { error } = await connectionsApi.accept(requestId);
            if (!error) {
                await get().fetchRequests();
                return;
            }
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
        
        // Fallback / local mode
        set(state => {
            const req = state.pendingRequests.find(r => r.id === requestId || r.username === requestId);
            if (!req) return state;
            return {
                pendingRequests: state.pendingRequests.filter(r => r !== req),
                connections: [...state.connections, { ...req, status: 'ACCEPTED' }]
            };
        });
    },

    rejectRequest: async (requestId) => {
        try {
            const { error } = await connectionsApi.reject(requestId);
            if (!error) {
                await get().fetchRequests();
                return;
            }
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
        
        // Fallback / local mode
        set(state => {
            const req = state.pendingRequests.find(r => r.id === requestId || r.username === requestId);
            if (!req) return state;
            return {
                pendingRequests: state.pendingRequests.filter(r => r !== req)
            };
        });
    },
            
            clearAll: () => set({ connections: [], pendingRequests: [], sentRequests: [], offers: [] }),
        }),
        {
            name: 'starto-network-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
