import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type SubscriptionTier = "basic" | "premium" | "enterprise";

interface SubscriptionStatus {
  tier: SubscriptionTier;
  isEnterprise: boolean;
  isPremium: boolean;
  loading: boolean;
  user: User | null;
  subscribedAt: string | null;
  expiresAt: string | null;
}

export function useSubscriptionTier(): SubscriptionStatus {
  const [tier, setTier] = useState<SubscriptionTier>("basic");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subscribedAt, setSubscribedAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async (userId: string) => {
      try {
        // Use SECURITY DEFINER function for tamper-proof server-side validation
        const { data, error } = await supabase.rpc("get_user_tier", { _user_id: userId });

        if (error) {
          console.error("Error checking subscription status:", error);
          setTier("basic");
        } else {
          const tierValue = (data as string) || "free";
          if (tierValue === "enterprise") setTier("enterprise");
          else if (tierValue === "premium" || tierValue === "oracle") setTier("premium");
          else setTier("basic");
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setTier("basic");
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscriptionStatus(session.user.id);
      } else {
        setTier("basic");
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscriptionStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { 
    tier, 
    isEnterprise: tier === "enterprise",
    isPremium: tier === "premium" || tier === "enterprise",
    loading, 
    user, 
    subscribedAt, 
    expiresAt 
  };
}
