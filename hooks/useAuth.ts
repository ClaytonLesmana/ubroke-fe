import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, UserProfile, OnboardingData } from "@/lib/supabase";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await loadUserProfile(session.user.id);
        else setLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
      }
    };

    getInitialSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("=== AUTH STATE CHANGE ===", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log("Loading profile...");
        loadUserProfile(session.user.id);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") ensureUserProfile(session.user);
      } else {
        console.log("No session, clearing profile");
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
      if (error) {
        console.error("Error loading user profile:", error);
        if (error.code === "PGRST116") console.log("User profile not found");
      } else setUserProfile(data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const ensureUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("id", user.id).single();
      if (!existingProfile) {
        const { error } = await supabase.from("user_profiles").insert({
          id: user.id, email: user.email!, first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "", total_points: 0, current_level: 1,
          daily_streak: 0, currency: "USD", onboarding_completed: false,
        });
        if (error) console.error("Error creating user profile:", error);
        else {
          console.log("User profile created");
          await loadUserProfile(user.id);
        }
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: metadata, emailRedirectTo: Platform.OS === "web" ? `${window.location.origin}/auth/callback` : "ubroke://auth/callback" },
    });
    console.log("signUpWithEmail", data, error);
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Platform.OS === "web" ? `${window.location.origin}/auth/reset-password` : "ubroke://auth/reset-password",
    });
    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  };

  const resendEmailVerification = async () => {
    if (!user?.email) return { data: null, error: { message: "No user email found" } };
    const { data, error } = await supabase.auth.resend({ type: "signup", email: user.email, options: { emailRedirectTo: Platform.OS === "web" ? `${window.location.origin}/auth/callback` : "ubroke://auth/callback" } });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    console.log("=== GOOGLE OAUTH STARTED ===");
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true, // Use Expo's proxy
        path: "auth/callback", // Consistent path
      });
      console.log("Redirect URI:", redirectUri); // Should log something like https://auth.expo.io/@layton/ubroke/auth/callback
  
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
          scopes: "email profile openid",
        },
      });
  
      if (error) {
        console.error("OAuth URL creation error:", error);
        return { data: null, error };
      }
  
      console.log("OAuth URL created successfully:", data.url);
  
      const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUri, {
        showInRecents: true,
      });
  
      console.log("OAuth browser result:", authResult);
  
      if (authResult.type === "success") {
        console.log("OAuth successful, URL:", authResult.url);
        // Parse tokens from URL fragment (implicit flow fallback)
        const url = authResult.url;
        const fragment = url.split('#')[1];
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          if (accessToken && refreshToken) {
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (session) {
              console.log("Session set manually:", session.user?.email);
              setSession(session);
              setUser(session.user);
              return { data: { session, user: session.user }, error: null };
            } else {
              console.error("Error setting session:", sessionError);
            }
          }
        }
        // Fallback to getSession
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (session) {
          console.log("Session found after OAuth:", session.user?.email);
          setSession(session);
          setUser(session.user);
          return { data: { session, user: session.user }, error: null };
        } else {
          console.error("No session after OAuth:", sessionError);
          return { data: null, error: { message: "No session after OAuth", code: "no_session" } };
        }
      } else {
        console.log("OAuth was cancelled or failed:", authResult.type);
        return { data: null, error: { message: "OAuth was cancelled or failed", code: "oauth_cancelled" } };
      }
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      return { data: null, error: { message: error.message || "OAuth failed", code: "oauth_error" } };
    }
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) setUserProfile(null);
    return { error };
  };

  const updateOnboardingData = async (data: OnboardingData) => {
    console.log("=== UPDATE ONBOARDING DATA STARTED ===", data, user, session);
    try {
      let currentUser = user || (session?.user ?? null);
      if (!currentUser) {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        currentUser = currentSession?.user ?? null;
      }
      if (!currentUser) throw new Error("User not authenticated - no session found");

      const updateData = {
        first_name: data.firstName || "", last_name: data.lastName || "",
        age: data.age || null, account_count: data.accountCount || null,
        assets: data.assets || null, liabilities: data.liabilities || null,
        salary: data.salary || null, salary_frequency: data.salaryFrequency || null,
        next_pay_date: data.nextPayDate || null, onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("user_profiles").update(updateData).eq("id", currentUser.id);
      if (error) throw error;
      await loadUserProfile(currentUser.id);
    } catch (error) {
      console.error("Error in updateOnboardingData:", error);
      throw error;
    }
  };

  return {
    session, user, userProfile, loading,
    signInWithEmail, signUpWithEmail, signInWithGoogle, signOut,
    resetPassword, updatePassword, resendEmailVerification, updateOnboardingData,
    isAuthenticated: !!session, isOnboardingCompleted: userProfile?.onboarding_completed ?? false,
    isEmailVerified: user?.email_confirmed_at != null,
  };
}