import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Image as ImageIcon, 
  Loader2,
  Eye,
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAdminImages, PendingImage } from "@/hooks/useAdminImages";
import { vehicles } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminImageApproval() {
  const { pendingImages, allImages, loading, isAdmin, approveImage, rejectImage } = useAdminImages();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingImageId, setRejectingImageId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : vehicleId;
  };

  const handleReject = async () => {
    if (rejectingImageId) {
      await rejectImage(rejectingImageId, rejectReason);
      setRejectDialogOpen(false);
      setRejectingImageId(null);
      setRejectReason("");
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h1 className="text-2xl font-bold mb-2">Erişim Reddedildi</h1>
          <p className="text-muted-foreground mb-6">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <Button asChild>
            <Link to="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Fotoğraf Onay Paneli</h1>
            <p className="text-muted-foreground">
              Kullanıcıların yüklediği fotoğrafları onaylayın veya reddedin
            </p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Bekleyenler
              {pendingImages.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingImages.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Tüm Fotoğraflar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : pendingImages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-semibold mb-2">Bekleyen Fotoğraf Yok</h3>
                  <p className="text-muted-foreground">
                    Tüm fotoğraflar değerlendirildi.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    getVehicleName={getVehicleName}
                    onView={() => setSelectedImage(image.image_url)}
                    onApprove={() => approveImage(image.id)}
                    onReject={() => {
                      setRejectingImageId(image.id);
                      setRejectDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {allImages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Fotoğraf Bulunamadı</h3>
                  <p className="text-muted-foreground">
                    Henüz hiç fotoğraf yüklenmemiş.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    getVehicleName={getVehicleName}
                    onView={() => setSelectedImage(image.image_url)}
                    showActions={image.status === "pending"}
                    onApprove={() => approveImage(image.id)}
                    onReject={() => {
                      setRejectingImageId(image.id);
                      setRejectDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Fotoğraf Önizleme</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fotoğrafı Reddet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Bu fotoğrafı reddetmek istediğinize emin misiniz?
              </p>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Red Sebebi (Opsiyonel)
                </label>
                <Textarea
                  placeholder="Kullanıcıya bildirilecek red sebebini yazın..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reddet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

function ImageCard({
  image,
  getVehicleName,
  onView,
  onApprove,
  onReject,
  showActions = true,
}: {
  image: PendingImage;
  getVehicleName: (id: string) => string;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {image.review?.title || "Yorum Başlığı"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {image.review?.vehicle_id && getVehicleName(image.review.vehicle_id)}
            </p>
          </div>
          <StatusBadge status={image.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="relative aspect-video rounded-lg overflow-hidden bg-secondary cursor-pointer group"
          onClick={onView}
        >
          <img
            src={image.image_url}
            alt="Review image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Kullanıcı:</span>{" "}
            {image.review?.user_name || image.review?.user_email}
          </p>
          <p>
            <span className="font-medium">Tarih:</span>{" "}
            {formatDistanceToNow(new Date(image.created_at), {
              addSuffix: true,
              locale: tr,
            })}
          </p>
        </div>

        {showActions && image.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
              onClick={onApprove}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Onayla
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-500/30 hover:bg-red-500/10"
              onClick={onReject}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reddet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="gap-1 bg-amber-500/20 text-amber-700">
          <Clock className="w-3 h-3" />
          Bekliyor
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="secondary" className="gap-1 bg-emerald-500/20 text-emerald-700">
          <CheckCircle className="w-3 h-3" />
          Onaylı
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="secondary" className="gap-1 bg-red-500/20 text-red-700">
          <XCircle className="w-3 h-3" />
          Reddedildi
        </Badge>
      );
  }
}
