import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface PremiumStatus {
  isPremium: boolean;
  loading: boolean;
  user: User | null;
  subscribedAt: string | null;
  expiresAt: string | null;
}

export function usePremium(): PremiumStatus {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subscribedAt, setSubscribedAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const checkPremiumStatus = async (userId: string) => {
      try {
        // Use SECURITY DEFINER function for tamper-proof server-side validation
        const { data, error } = await supabase.rpc("is_premium_user", { _user_id: userId });

        if (error) {
          console.error("Error checking premium status:", error);
          setIsPremium(false);
        } else {
          setIsPremium(!!data);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
        setLoading(false);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isPremium, loading, user, subscribedAt, expiresAt };
}
