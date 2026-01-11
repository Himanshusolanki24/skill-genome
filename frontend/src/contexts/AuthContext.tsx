import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { User, Session, AuthError } from "@supabase/supabase-js";

// User profile from database
interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    provider: string;
    created_at: string;
    // Extended profile fields
    username: string | null;
    institute_name: string | null;
    whatsapp_number: string | null;
    academic_year: string | null;
    course: string | null;
    specialization: string | null;
    short_bio: string | null;
    skills: string[] | null;
    linkedin_url: string | null;
    github_username: string | null;
    profile_completed: boolean;
    profile_completed_at: string | null;
    // Dashboard metrics
    streak_count: number;
    total_xp: number;
    last_activity_date: string | null;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    isConfigured: boolean;
    isProfileComplete: boolean;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signInWithLinkedIn: () => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const isConfigured = isSupabaseConfigured();

    // Fetch user profile from database
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                return null;
            }
            return data as UserProfile;
        } catch (err) {
            console.error("Profile fetch error:", err);
            return null;
        }
    };

    // Refresh profile data
    const refreshProfile = async () => {
        if (user?.id) {
            const profileData = await fetchProfile(user.id);
            setProfile(profileData);
        }
    };

    useEffect(() => {
        if (!isConfigured) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            // Fetch profile if user exists
            if (session?.user?.id) {
                const profileData = await fetchProfile(session.user.id);
                setProfile(profileData);
            }

            setLoading(false);
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            // Fetch profile on auth change (login/signup)
            if (session?.user?.id) {
                // Small delay to allow trigger to create profile
                setTimeout(async () => {
                    const profileData = await fetchProfile(session.user.id);
                    setProfile(profileData);
                }, 500);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [isConfigured]);

    const signUp = async (email: string, password: string, fullName?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || "",
                },
            },
        });
        return { error };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signInWithLinkedIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "linkedin_oidc",
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
    };

    const value: AuthContextType = {
        user,
        profile,
        session,
        loading,
        isConfigured,
        isProfileComplete: profile?.profile_completed ?? false,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithLinkedIn,
        signOut,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
