import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface LocalUserRecord {
    email: string
    // Simple hash so we're not storing plaintext - XOR + base64 encode
    passwordHash: string
    name: string
    role: string
    bio: string
    city: string
    phone: string
    username: string
    avatarSeed: string
    createdAt: number
}

interface LocalUserStore {
    users: LocalUserRecord[]
    registerUser: (data: Omit<LocalUserRecord, 'createdAt' | 'passwordHash'> & { password: string }) => { success: boolean; error?: string }
    loginUser: (email: string, password: string) => { success: boolean; user?: LocalUserRecord; error?: string }
    getUserByEmail: (email: string) => LocalUserRecord | undefined
    getAllUsernames: () => string[]
    updateUserRecord: (email: string, updates: Partial<Pick<LocalUserRecord, 'username'>>) => void
    deleteUser: (email: string) => void
}

// Simple reversible hash to avoid storing plaintext - not production security, but better than nothing
function hashPassword(password: string): string {
    let result = ''
    for (let i = 0; i < password.length; i++) {
        result += String.fromCharCode(password.charCodeAt(i) ^ 0x42)
    }
    return btoa(result)
}

function verifyPassword(password: string, hash: string): boolean {
    try {
        return hashPassword(password) === hash
    } catch {
        return false
    }
}

export const useLocalUserStore = create<LocalUserStore>()(
    persist(
        (set, get) => ({
            users: [],

            registerUser: ({ email, password, name, role, bio, city, phone, username, avatarSeed }) => {
                const existingEmail = get().users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (existingEmail) {
                    return { success: false, error: 'An account with this email already exists. Please login.' }
                }

                const existingPhone = get().users.find(u => u.phone === phone)
                if (existingPhone) {
                    return { success: false, error: 'Mobile number already registered.' }
                }

                const newUser: LocalUserRecord = {
                    email: email.toLowerCase(),
                    passwordHash: hashPassword(password),
                    name,
                    role,
                    bio,
                    city,
                    phone,
                    username,
                    avatarSeed,
                    createdAt: Date.now(),
                }
                set(state => ({ users: [...state.users, newUser] }))
                return { success: true }
            },

            loginUser: (email, password) => {
                const user = get().users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (!user) {
                    return { success: false, error: 'No account found with this email. Please sign up first.' }
                }
                if (!verifyPassword(password, user.passwordHash)) {
                    return { success: false, error: 'Invalid credentials. Please try again.' }
                }
                return { success: true, user }
            },

            getUserByEmail: (email) => {
                return get().users.find(u => u.email.toLowerCase() === email.toLowerCase())
            },

            getAllUsernames: () => get().users.map(u => u.username),

            updateUserRecord: (email, updates) => set(state => ({
                users: state.users.map(u =>
                    u.email.toLowerCase() === email.toLowerCase() ? { ...u, ...updates } : u
                )
            })),

            deleteUser: (email) => set(state => ({
                users: state.users.filter(u => u.email.toLowerCase() !== email.toLowerCase())
            })),
        }),
        {
            name: 'starto-local-users',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
