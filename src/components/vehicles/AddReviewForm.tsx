import { useState } from "react";
import { Star, Plus, X, Link as LinkIcon, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AddReviewFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    rating: number;
    pros: string[];
    cons: string[];
    linkUrl?: string;
  }) => Promise<boolean>;
  onCancel?: () => void;
  isEnterprise?: boolean;
}

export function AddReviewForm({ onSubmit, onCancel, isEnterprise = false }: AddReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPro = () => {
    if (newPro.trim() && pros.length < 5) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const handleAddCon = () => {
    if (newCon.trim() && cons.length < 5) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const handleSubmit = async () => {
    if (!rating || !title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      title,
      content,
      rating,
      pros,
      cons,
      linkUrl: isEnterprise && linkUrl.trim() ? linkUrl.trim() : undefined,
    });

    if (success) {
      setRating(0);
      setTitle("");
      setContent("");
      setPros([]);
      setCons([]);
      setLinkUrl("");
    }
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Yorum Yaz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        <div>
          <label className="text-sm font-medium mb-2 block">Puanınız</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i + 1)}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    (hoverRating || rating) > i
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-2 block">Başlık</label>
          <Input
            placeholder="Yorumunuz için kısa bir başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium mb-2 block">Yorumunuz</label>
          <Textarea
            placeholder="Araç hakkındaki deneyimlerinizi paylaşın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
            maxLength={2000}
          />
        </div>

        {/* Enterprise Link (Only for Enterprise users) */}
        {isEnterprise && (
          <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <label className="text-sm font-medium">Satış / Tanıtım Linki (Enterprise Özelliği)</label>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="pl-9"
                  type="url"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Yorumunuza kendi aracınızı veya satış ilanınızı gösteren bir link ekleyebilirsiniz.
            </p>
          </div>
        )}

        {/* Pros */}
        <div>
          <label className="text-sm font-medium mb-2 block">Artıları (Opsiyonel)</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Artı ekle"
              value={newPro}
              onChange={(e) => setNewPro(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPro())}
              maxLength={50}
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddPro}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {pros.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pros.map((pro, i) => (
                <Badge key={i} variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600">
                  + {pro}
                  <button onClick={() => setPros(pros.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Cons */}
        <div>
          <label className="text-sm font-medium mb-2 block">Eksileri (Opsiyonel)</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Eksi ekle"
              value={newCon}
              onChange={(e) => setNewCon(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCon())}
              maxLength={50}
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddCon}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {cons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cons.map((con, i) => (
                <Badge key={i} variant="outline" className="gap-1 border-destructive/30 text-destructive">
                  - {con}
                  <button onClick={() => setCons(cons.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              İptal
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !rating || !title.trim() || !content.trim()}
          >
            {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
