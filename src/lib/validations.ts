import { z } from "zod";

export const reviewSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı").max(200, "Başlık en fazla 200 karakter olabilir"),
  content: z.string().min(10, "Yorum en az 10 karakter olmalı").max(5000, "Yorum en fazla 5000 karakter olabilir"),
  rating: z.number().min(1, "Puan seçmelisiniz").max(5),
  pros: z.array(z.string().max(100)).max(10).default([]),
  cons: z.array(z.string().max(100)).max(10).default([]),
  linkUrl: z.string().url("Geçerli bir URL girin").max(500).optional().or(z.literal("")),
});

export const communitySchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı").max(100, "İsim en fazla 100 karakter olabilir"),
  description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir").optional().or(z.literal("")),
  is_public: z.boolean(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Mesaj boş olamaz").max(2000, "Mesaj en fazla 2000 karakter olabilir"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type CommunityInput = z.infer<typeof communitySchema>;
export type MessageInput = z.infer<typeof messageSchema>;
