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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadUserProfile(session.user.id);

        // Create user profile if it doesn't exist (for new signups)
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await ensureUserProfile(session.user);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading user profile:", error);
        // If profile doesn't exist, user might be newly created
        if (error.code === "PGRST116") {
          console.log("User profile not found, user may be newly created");
        }
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        // Create new profile
        const { error } = await supabase.from("user_profiles").insert({
          id: user.id,
          email: user.email!,
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          total_points: 0,
          current_level: 1,
          daily_streak: 0,
          currency: "USD",
          onboarding_completed: false,
        });

        if (error) {
          console.error("Error creating user profile:", error);
        } else {
          console.log("User profile created successfully");
          // Reload profile
          await loadUserProfile(user.id);
        }
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: any
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo:
          Platform.OS === "web"
            ? `${window.location.origin}/auth/callback`
            : "ubroke://auth/callback",
      },
    });
    console.log("signUpWithEmail", data, error);
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        Platform.OS === "web"
          ? `${window.location.origin}/auth/reset-password`
          : "ubroke://auth/reset-password",
    });
    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  const resendEmailVerification = async () => {
    if (!user?.email) {
      return { data: null, error: { message: "No user email found" } };
    }

    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
      options: {
        emailRedirectTo:
          Platform.OS === "web"
            ? `${window.location.origin}/auth/callback`
            : "ubroke://auth/callback",
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === "web") {
        // Web OAuth (your current approach works)
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
        return { data, error };
      } else {
        // Mobile OAuth flow
        const redirectUri = AuthSession.makeRedirectUri({
          scheme: "ubroke",
          path: "auth/callback",
        });

        console.log("Redirect URI:", redirectUri);

        // Create the OAuth URL
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true, // ← Important for mobile
          },
        });

        if (error) {
          return { data: null, error };
        }

        // Open the OAuth URL in browser
        const authResult = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );

        if (authResult.type === "success") {
          // The auth session will be handled by the auth state listener
          // Wait a moment for the session to be established
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check if we now have a session
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            return { data: null, error: sessionError };
          }

          return { data: { session, user: session?.user }, error: null };
        } else {
          return {
            data: null,
            error: {
              message: "OAuth was cancelled or failed",
              code: "oauth_cancelled",
            },
          };
        }
      }
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      return {
        data: null,
        error: {
          message: error.message || "OAuth failed",
          code: "oauth_error",
        },
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUserProfile(null);
    }
    return { error };
  };

  const updateOnboardingData = async (data: OnboardingData) => {
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("user_profiles")
      .update({
        ...data,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    // Reload profile
    await loadUserProfile(user.id);
  };

  return {
    session,
    user,
    userProfile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    resendEmailVerification,
    updateOnboardingData,
    isAuthenticated: !!session,
    isOnboardingCompleted: userProfile?.onboarding_completed ?? false,
    isEmailVerified: user?.email_confirmed_at != null,
  };
}
