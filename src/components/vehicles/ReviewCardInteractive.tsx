import { useState, useMemo } from "react";
import { Star, ThumbsUp, ThumbsDown, User, MessageCircle, Trash2, ChevronDown, ChevronUp, CheckCircle2, Calendar, ExternalLink, Crown, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatabaseReview } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

// Helper to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

interface ReviewCardInteractiveProps {
  review: DatabaseReview;
  onLike: (reviewId: string) => void;
  onReply: (data: { title: string; content: string; rating: number; pros: string[]; cons: string[]; parentId: string }) => Promise<boolean>;
  onDelete?: (reviewId: string) => void;
  currentUserId?: string;
  isReply?: boolean;
}

export function ReviewCardInteractive({ 
  review, 
  onLike, 
  onReply, 
  onDelete, 
  currentUserId,
  isReply = false 
}: ReviewCardInteractiveProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if link is a YouTube URL
  const youtubeVideoId = useMemo(() => {
    return review.link_url ? getYouTubeVideoId(review.link_url) : null;
  }, [review.link_url]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    const success = await onReply({
      title: `Re: ${review.title}`,
      content: replyContent,
      rating: review.rating,
      pros: [],
      cons: [],
      parentId: review.id,
    });

    if (success) {
      setReplyContent("");
      setShowReplyForm(false);
      setShowReplies(true);
    }
    setIsSubmitting(false);
  };

  const isOwnReview = currentUserId === review.user_id;
  const hasReplies = review.replies && review.replies.length > 0;

  const formattedDate = new Date(review.created_at).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={cn(
      "bg-card rounded-xl border border-border p-5 space-y-4",
      isReply && "ml-8 border-l-2 border-l-primary/30"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
            {review.user_avatar ? (
              <img
                src={review.user_avatar}
                alt={review.user_name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{review.user_name || "Anonim Kullanıcı"}</p>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs font-medium px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Doğrulanmış
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Rating */}
        {!isReply && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
            <span className="font-semibold ml-1">{review.rating}/5</span>
          </div>
        )}
      </div>

      {/* Title & Content */}
      <div>
        {!isReply && <h4 className="font-bold text-lg mb-2">{review.title}</h4>}
        <p className="text-foreground leading-relaxed">{review.content}</p>
        
        {/* YouTube Video Embed */}
        {youtubeVideoId && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-muted-foreground">Video İnceleme</span>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}
        
        {/* Non-YouTube Link (fallback for other links) */}
        {review.link_url && !youtubeVideoId && (
          <a 
            href={review.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium">Satış / Tanıtım Linki</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Pros & Cons */}
      {!isReply && (review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {review.pros.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-emerald-600">Artıları:</p>
              <ul className="space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 font-medium">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-red-600">Eksileri:</p>
              <ul className="space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 font-medium">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Bu yorum yararlı mı?</span>
          <div className="flex items-center gap-3">
            <button 
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                review.user_has_liked ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onLike(review.id)}
            >
              <ThumbsUp className={cn("w-4 h-4", review.user_has_liked && "fill-current")} />
              <span>{review.like_count || 0}</span>
            </button>
            <button 
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>0</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isReply && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-muted-foreground h-8"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="w-4 h-4" />
              Yanıtla
            </Button>
          )}
          
          {isOwnReview && onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-destructive hover:text-destructive h-8"
              onClick={() => onDelete(review.id)}
            >
              <Trash2 className="w-4 h-4" />
              Sil
            </Button>
          )}

          {hasReplies && !isReply && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 h-8"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {review.replies?.length} Yanıt
            </Button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="pt-4 space-y-3 border-t border-border">
          <Textarea
            placeholder="Yanıtınızı yazın..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent("");
              }}
            >
              İptal
            </Button>
            <Button 
              size="sm"
              onClick={handleSubmitReply}
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isSubmitting ? "Gönderiliyor..." : "Yanıtla"}
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {showReplies && hasReplies && (
        <div className="space-y-4 pt-4">
          {review.replies?.map((reply) => (
            <ReviewCardInteractive
              key={reply.id}
              review={reply}
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              currentUserId={currentUserId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
