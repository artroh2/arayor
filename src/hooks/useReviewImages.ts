import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ReviewImage {
  id: string;
  review_id: string;
  user_id: string;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export function useReviewImages(reviewId?: string) {
  const [images, setImages] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    if (!reviewId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("review_images")
        .select("*")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setImages((data || []) as ReviewImage[]);
    } catch (error) {
      console.error("Error fetching review images:", error);
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  const uploadImage = async (file: File, reviewId: string, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${reviewId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("review-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("review-images")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return null;
    }
  };

  const addImageToReview = async (reviewId: string, userId: string, imageUrl: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("review_images").insert({
        review_id: reviewId,
        user_id: userId,
        image_url: imageUrl,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Fotoğraf yüklendi",
        description: "Fotoğrafınız admin onayına gönderildi.",
      });

      return true;
    } catch (error) {
      console.error("Error adding image to review:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf eklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("review_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Silindi",
        description: "Fotoğraf silindi.",
      });

      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return {
    images,
    loading,
    fetchImages,
    uploadImage,
    addImageToReview,
    deleteImage,
  };
}
