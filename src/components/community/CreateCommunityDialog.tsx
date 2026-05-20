import { useState } from "react";
import { communitySchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Globe, Lock } from "lucide-react";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string; is_public: boolean }) => void;
  loading?: boolean;
}

export function CreateCommunityDialog({
  open,
  onOpenChange,
  onSubmit,
  loading
}: CreateCommunityDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validated = communitySchema.safeParse({ name: name.trim(), description: description.trim(), is_public: isPublic });
    if (!validated.success) return;
    onSubmit({ name: validated.data.name, description: validated.data.description || "", is_public: validated.data.is_public });
    setName("");
    setDescription("");
    setIsPublic(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Topluluk Oluştur</DialogTitle>
            <DialogDescription>
              Yeni bir topluluk oluşturun ve diğer araç tutkunlarıyla bağlantı kurun.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Topluluk Adı</Label>
              <Input
                id="name"
                placeholder="Örn: Mercedes Tutkunları"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="Bu topluluk hakkında kısa bir açıklama..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <Globe className="w-5 h-5 text-primary" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">
                    {isPublic ? "Herkese Açık" : "Özel Topluluk"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPublic 
                      ? "Herkes bu topluluğu görebilir ve katılabilir" 
                      : "Sadece davet edilenler katılabilir"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
