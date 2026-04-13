import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { connectionsApi, offersApi } from '@/lib/apiClient'
import { useAuthStore } from './useAuthStore'

export interface Connection {
    id?: string;
    username: string;
    category: string;
    timeAdded: number;
    status?: string;
    message?: string;
}

export interface Offer {
    id: string;
    signalId: string;
    organizationName: string;
    portfolioLink: string;
    message: string;
    fromUsername: string;
    timestamp: number;
}

interface NetworkState {
    connections: Connection[];       // accepted connections
    pendingRequests: Connection[];   // incoming requests
    sentRequests: Connection[];      // outgoing requests
    offers: Offer[];
    
    sendRequest: (signalId: string, message: string, token: string) => Promise<void>;
    fetchRequests: (token: string) => Promise<void>;
    acceptRequest: (connectionId: string, token: string) => Promise<void>;
    rejectRequest: (connectionId: string, token: string) => Promise<void>;
    
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

            sendRequest: async (signalId, message, token) => {
                const { error } = await connectionsApi.sendRequest(signalId, message, token);
                if (!error) {
                    await get().fetchRequests(token);
                } else {
                    console.error('Failed to send request:', error);
                    throw new Error(error);
                }
            },

            fetchRequests: async (token) => {
                const [pendingRes, sentRes, acceptedRes] = await Promise.all([
                    connectionsApi.getPending(token),
                    connectionsApi.getSent(token),
                    connectionsApi.getAccepted(token)
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
                const token = useAuthStore.getState().token;
                if (!token) return;
                try {
                    const { data } = await offersApi.getInbox(token);
                    if (data) set({ offers: data });
                } catch (error) {
                    console.error('Failed to fetch offers:', error);
                }
            },

            addOffer: async (offer: { signalId: string; organizationName: string; portfolioLink: string; message: string }) => {
                const token = useAuthStore.getState().token;
                if (!token) return;
                try {
                    const { data } = await offersApi.create(offer, token);
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
                const token = useAuthStore.getState().token;
                const currentUser = useAuthStore.getState().user?.username;
                if (!token || !currentUser) return;
                try {
                    const { data } = await connectionsApi.getAccepted(token);
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

            acceptRequest: async (requestId, token) => {
                if (!token) return;
                try {
                    await connectionsApi.accept(requestId, token);
                    await get().fetchRequests(token);
                } catch (error) {
                    console.error('Failed to accept request:', error);
                }
            },

            rejectRequest: async (requestId, token) => {
                if (!token) return;
                try {
                    await connectionsApi.reject(requestId, token);
                    await get().fetchRequests(token);
                } catch (error) {
                    console.error('Failed to reject request:', error);
                }
            },
            
            clearAll: () => set({ connections: [], pendingRequests: [], sentRequests: [], offers: [] }),
        }),
        {
            name: 'starto-network-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
