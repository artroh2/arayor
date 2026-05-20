import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PendingImage {
  id: string;
  review_id: string;
  user_id: string;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  // Joined data
  review?: {
    title: string;
    vehicle_id: string;
    user_name: string | null;
    user_email: string;
  };
}

export function useAdminImages() {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [allImages, setAllImages] = useState<PendingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check if current user is admin
  const checkAdminStatus = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    const { data, error } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      return false;
    }

    setIsAdmin(data);
    return data;
  }, []);

  const fetchPendingImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("review_images")
        .select(`
          *,
          review:reviews(title, vehicle_id, user_name, user_email)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setPendingImages((data || []) as PendingImage[]);
    } catch (error) {
      console.error("Error fetching pending images:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllImages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("review_images")
        .select(`
          *,
          review:reviews(title, vehicle_id, user_name, user_email)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setAllImages((data || []) as PendingImage[]);
    } catch (error) {
      console.error("Error fetching all images:", error);
    }
  }, []);

  const approveImage = async (imageId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("review_images")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Onaylandı",
        description: "Fotoğraf başarıyla onaylandı.",
      });

      fetchPendingImages();
      fetchAllImages();
    } catch (error) {
      console.error("Error approving image:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf onaylanırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const rejectImage = async (imageId: string, reason?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("review_images")
        .update({
          status: "rejected",
          rejection_reason: reason || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Reddedildi",
        description: "Fotoğraf reddedildi.",
      });

      fetchPendingImages();
      fetchAllImages();
    } catch (error) {
      console.error("Error rejecting image:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf reddedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      const admin = await checkAdminStatus();
      if (admin) {
        fetchPendingImages();
        fetchAllImages();
      }
    };
    init();
  }, [checkAdminStatus, fetchPendingImages, fetchAllImages]);

  // Realtime subscription for new pending images
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("admin-review-images")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "review_images",
        },
        () => {
          fetchPendingImages();
          fetchAllImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, fetchPendingImages, fetchAllImages]);

  return {
    pendingImages,
    allImages,
    loading,
    isAdmin,
    approveImage,
    rejectImage,
    refresh: () => {
      fetchPendingImages();
      fetchAllImages();
    },
  };
}
