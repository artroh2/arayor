import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { reviewSchema } from "@/lib/validations";

export interface DatabaseReview {
  id: string;
  vehicle_id: string;
  user_id: string;
  user_name: string | null;
  user_email?: string;
  user_avatar: string | null;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  parent_id: string | null;
  link_url: string | null;
  created_at: string;
  updated_at: string;
  like_count?: number;
  user_has_liked?: boolean;
  replies?: DatabaseReview[];
}

export function useReviews(vehicleId: string) {
  const [reviews, setReviews] = useState<DatabaseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      // Fetch all reviews for this vehicle
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews_public" as any)
        .select("id, vehicle_id, user_id, user_name, user_avatar, rating, title, content, pros, cons, parent_id, link_url, created_at, updated_at")
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch all likes
      const { data: likesData, error: likesError } = await supabase
        .from("review_likes")
        .select("review_id, user_id");

      if (likesError) throw likesError;

      // Process reviews with like counts and user_has_liked
      const processedReviews = ((reviewsData as any[]) || []).map((review: any) => {
        const reviewLikes = (likesData || []).filter(like => like.review_id === review.id);
        return {
          ...review,
          like_count: reviewLikes.length,
          user_has_liked: user ? reviewLikes.some(like => like.user_id === user.id) : false,
        };
      });

      // Organize into parent reviews and replies
      const parentReviews = processedReviews.filter(r => !r.parent_id);
      const replies = processedReviews.filter(r => r.parent_id);

      const reviewsWithReplies = parentReviews.map(review => ({
        ...review,
        replies: replies.filter(r => r.parent_id === review.id),
      }));

      setReviews(reviewsWithReplies);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, user]);

  // Initial fetch
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Realtime subscription for reviews
  useEffect(() => {
    if (!vehicleId) return;

    const channel = supabase
      .channel(`reviews-${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `vehicle_id=eq.${vehicleId}`
        },
        (payload) => {
          console.log('Realtime review update:', payload);
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vehicleId, fetchReviews]);

  // Realtime subscription for likes
  useEffect(() => {
    if (!vehicleId) return;

    const channel = supabase
      .channel(`review-likes-${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_likes'
        },
        (payload) => {
          console.log('Realtime like update:', payload);
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vehicleId, fetchReviews]);

  const addReview = async (reviewData: {
    title: string;
    content: string;
    rating: number;
    pros: string[];
    cons: string[];
    parentId?: string;
    linkUrl?: string;
  }) => {
    if (!user) {
      toast({
        title: "Giriş yapmalısınız",
        description: "Yorum yapmak için giriş yapın.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Validate input
      const validated = reviewSchema.safeParse(reviewData);
      if (!validated.success) {
        toast({
          title: "Doğrulama Hatası",
          description: validated.error.errors[0]?.message || "Geçersiz veri",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase.from("reviews").insert({
        vehicle_id: vehicleId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split("@")[0],
        user_email: user.email,
        user_avatar: user.user_metadata?.avatar_url,
        title: validated.data.title,
        content: validated.data.content,
        rating: validated.data.rating,
        pros: validated.data.pros,
        cons: validated.data.cons,
        parent_id: reviewData.parentId || null,
        link_url: validated.data.linkUrl || null,
      });

      if (error) throw error;

      toast({
        title: "Başarılı!",
        description: reviewData.parentId ? "Yanıtınız eklendi." : "Yorumunuz eklendi.",
      });

      fetchReviews();
      return true;
    } catch (error) {
      console.error("Error adding review:", error);
      toast({
        title: "Hata",
        description: "Yorum eklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleLike = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Giriş yapmalısınız",
        description: "Beğenmek için giriş yapın.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("review_likes")
        .select("id")
        .eq("review_id", reviewId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from("review_likes")
          .delete()
          .eq("id", existingLike.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase.from("review_likes").insert({
          review_id: reviewId,
          user_id: user.id,
        });

        if (error) throw error;
      }

      fetchReviews();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Silindi",
        description: "Yorumunuz silindi.",
      });

      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Hata",
        description: "Yorum silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return {
    reviews,
    loading,
    user,
    addReview,
    toggleLike,
    deleteReview,
    refetch: fetchReviews,
  };
}
