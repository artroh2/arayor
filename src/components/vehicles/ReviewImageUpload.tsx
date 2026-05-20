import { useState, useRef } from "react";
import { ImagePlus, X, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReviewImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ReviewImageUpload({
  images,
  onImagesChange,
  maxImages = 3,
  disabled = false,
}: ReviewImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    addFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const remaining = maxImages - images.length;
    const filesToAdd = newFiles.slice(0, remaining);
    onImagesChange([...images, ...filesToAdd]);
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Preview images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((file, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-secondary"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-4 text-center transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-2">
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="text-primary hover:underline font-medium"
              >
                Fotoğraf seç
              </button>{" "}
              veya sürükle bırak
            </div>
            <p className="text-xs text-muted-foreground">
              Maks. {maxImages} fotoğraf (JPG, PNG)
            </p>
          </div>
        </div>
      )}

      {/* Info badge */}
      <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Yüklenen fotoğraflar admin onayından sonra görünür olacaktır.
        </p>
      </div>
    </div>
  );
}

interface ReviewImageDisplayProps {
  images: Array<{
    id: string;
    image_url: string;
    status: "pending" | "approved" | "rejected";
  }>;
  showStatus?: boolean;
}

export function ReviewImageDisplay({ images, showStatus = false }: ReviewImageDisplayProps) {
  const approvedImages = images.filter((img) => img.status === "approved");
  const displayImages = showStatus ? images : approvedImages;

  if (displayImages.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {displayImages.map((image) => (
        <div
          key={image.id}
          className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-secondary"
        >
          <img
            src={image.image_url}
            alt="Review image"
            className="w-full h-full object-cover"
          />
          {showStatus && (
            <div className="absolute bottom-1 left-1">
              {image.status === "pending" && (
                <Badge variant="secondary" className="text-xs gap-1 bg-amber-500/20 text-amber-700">
                  <Clock className="w-3 h-3" />
                  Bekliyor
                </Badge>
              )}
              {image.status === "approved" && (
                <Badge variant="secondary" className="text-xs gap-1 bg-emerald-500/20 text-emerald-700">
                  <CheckCircle className="w-3 h-3" />
                  Onaylı
                </Badge>
              )}
              {image.status === "rejected" && (
                <Badge variant="secondary" className="text-xs gap-1 bg-red-500/20 text-red-700">
                  <XCircle className="w-3 h-3" />
                  Reddedildi
                </Badge>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
