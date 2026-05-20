import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    try {
      const { data, error } = await (supabase as any)
        .from("arayor_favorites")
        .select("car_id")
        .eq("user_id", user.id);
      if (!error && data) {
        setFavorites(new Set(data.map((d: any) => d.car_id)));
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (carId: string): Promise<{ success: boolean; needsLogin: boolean }> => {
      if (!user) return { success: false, needsLogin: true };

      setLoading(true);
      const isFav = favorites.has(carId);
      try {
        if (isFav) {
          const { error } = await (supabase as any)
            .from("arayor_favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("car_id", carId);
          if (!error) {
            setFavorites((prev) => {
              const next = new Set(prev);
              next.delete(carId);
              return next;
            });
            return { success: true, needsLogin: false };
          }
        } else {
          const { error } = await (supabase as any)
            .from("arayor_favorites")
            .insert({ user_id: user.id, car_id: carId });
          if (!error) {
            setFavorites((prev) => new Set([...prev, carId]));
            return { success: true, needsLogin: false };
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
      return { success: false, needsLogin: false };
    },
    [user, favorites]
  );

  return { favorites, toggleFavorite, loading, isFavorite: (id: string) => favorites.has(id) };
}
