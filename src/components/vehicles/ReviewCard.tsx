import { useState } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
import { Review } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper function to get a reliable avatar URL
const getAvatarUrl = (originalUrl: string, userName: string) => {
  // If pravatar.cc URL, convert to ui-avatars.com
  if (originalUrl && originalUrl.includes("pravatar.cc")) {
    const colors = ["0D8ABC", "6366F1", "8B5CF6", "EC4899", "F59E0B", "10B981", "EF4444"];
    const colorIndex = userName.charCodeAt(0) % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=${colors[colorIndex]}&color=fff&size=150&bold=true`;
  }
  return originalUrl;
};

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t, language } = useLanguage();
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setHelpfulCount(helpfulCount - 1);
      setHasLiked(false);
    } else {
      setHelpfulCount(helpfulCount + 1);
      setHasLiked(true);
    }
  };

  // Format date based on language
  const getLocale = () => {
    const localeMap: Record<string, string> = {
      tr: "tr-TR", en: "en-US", zh: "zh-CN", hi: "hi-IN", es: "es-ES",
      ar: "ar-SA", bn: "bn-BD", pt: "pt-BR", ru: "ru-RU", ja: "ja-JP",
      de: "de-DE", fr: "fr-FR", ko: "ko-KR", it: "it-IT", vi: "vi-VN"
    };
    return localeMap[language] || "en-US";
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
            {review.userAvatar ? (
              <img
                src={getAvatarUrl(review.userAvatar, review.userName)}
                alt={review.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{review.userName}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(review.date).toLocaleDateString(getLocale(), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "fill-accent text-accent"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <h4 className="font-semibold mb-2">{review.title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {review.pros.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-emerald-600">{t("review.pros")}</p>
            <div className="flex flex-wrap gap-1">
              {review.pros.map((pro, i) => (
                <Badge key={i} variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
                  + {pro}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {review.cons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive">{t("review.cons")}</p>
            <div className="flex flex-wrap gap-1">
              {review.cons.map((con, i) => (
                <Badge key={i} variant="outline" className="text-xs border-destructive/30 text-destructive">
                  - {con}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-2",
            hasLiked ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("w-4 h-4", hasLiked && "fill-current")} />
          {t("review.helpful")} ({helpfulCount})
        </Button>
      </div>
    </div>
  );
}
