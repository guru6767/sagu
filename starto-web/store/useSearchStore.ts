import { create } from 'zustand'
import apiFetch from '@/lib/apiClient'
import { useAuthStore } from './useAuthStore'
import { useSignalStore } from './useSignalStore'

export interface SearchResultProfile {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
    role?: string;
}

export interface SearchResultSignal {
    id: string;
    title: string;
    description: string;
    username: string;
    timeAgo?: string;
    category?: string;
    strength?: string;
    stats?: any;
}

interface SearchResponse {
    profiles: SearchResultProfile[];
    signals: SearchResultSignal[];
}

interface SearchState {
    query: string;
    profiles: SearchResultProfile[];
    signals: SearchResultSignal[];
    isLoading: boolean;
    error: string | null;
    setQuery: (q: string) => void;
    performSearch: (q: string) => Promise<void>;
    clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    query: '',
    profiles: [],
    signals: [],
    isLoading: false,
    error: null,
    setQuery: (query) => set({ query }),
    performSearch: async (query) => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery || trimmedQuery.length < 2) {
            set({ profiles: [], signals: [], error: null });
            return;
        }

        set({ isLoading: true, error: null });
        
        // 1. Search Local Signals (Frontend only)
        const localSignals = useSignalStore.getState().signals;
        const matchedLocalSignals = localSignals.filter(s => 
            s.title.toLowerCase().includes(trimmedQuery) ||
            s.description.toLowerCase().includes(trimmedQuery) ||
            s.username.toLowerCase().includes(trimmedQuery)
        ).map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            username: s.username,
            category: s.category,
            timeAgo: s.timeAgo,
            strength: s.strength,
            stats: s.stats
        }));

        // 2. Search Backend
        const token = useAuthStore.getState().token;
        const { data, error } = await apiFetch<SearchResponse>(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {}, token);
        
        // Helper to keep only one signal per user (latest is first)
        const deduplicateByUser = (sigs: SearchResultSignal[]) => {
            const seen = new Set<string>();
            return sigs.filter(s => {
                if (!seen.has(s.username)) {
                    seen.add(s.username);
                    return true;
                }
                return false;
            });
        };

        if (error) {
            // Even if backend fails, show local results if any
            set({ error: `${error} (Showing local results)`, isLoading: false, signals: deduplicateByUser(matchedLocalSignals), profiles: [] });
        } else if (data) {
            // Merge backend results + local results, avoiding duplicates by ID
            const backendSignals = data.signals || [];
            const resultIds = new Set(backendSignals.map(s => s.id));
            const mergedSignals = [
                ...backendSignals,
                ...matchedLocalSignals.filter(ls => !resultIds.has(ls.id))
            ];

            set({ profiles: data.profiles || [], signals: deduplicateByUser(mergedSignals), isLoading: false, error: null });
        } else {
            set({ profiles: [], signals: deduplicateByUser(matchedLocalSignals), isLoading: false });
        }
    },
    clearSearch: () => set({ query: '', profiles: [], signals: [], error: null, isLoading: false })
}));
