import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Rating {
    id: string;
    fromUsername: string;   // who gave the rating
    toUsername: string;     // who received the rating
    stars: number;          // 1-5
    comment?: string;
    signalId?: string;
    createdAt: number;
}

interface RatingState {
    ratings: Rating[];
    addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
    getRatingsFor: (username: string) => Rating[];
    getAverageRating: (username: string) => number;
    hasRated: (fromUsername: string, toUsername: string) => boolean;
}

export const useRatingStore = create<RatingState>()(
    persist(
        (set, get) => ({
            ratings: [],
            addRating: (rating) => set((state) => ({
                ratings: [{
                    ...rating,
                    id: Date.now().toString(),
                    createdAt: Date.now(),
                }, ...state.ratings]
            })),
            getRatingsFor: (username) => get().ratings.filter(r => r.toUsername === username),
            getAverageRating: (username) => {
                const userRatings = get().ratings.filter(r => r.toUsername === username);
                if (userRatings.length === 0) return 0;
                const total = userRatings.reduce((sum, r) => sum + r.stars, 0);
                return Math.round((total / userRatings.length) * 10) / 10;
            },
            hasRated: (fromUsername, toUsername) =>
                get().ratings.some(r => r.fromUsername === fromUsername && r.toUsername === toUsername),
        }),
        {
            name: 'starto-rating-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
