import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin,
  Calendar,
  Edit,
  Camera,
  Star,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Sparkles,
  User,
  FileText,
  Save,
  X,
  Loader2,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { OraclesCircleWidget } from "@/components/prestige/OraclesCircleWidget";
import { PrestigeBadge } from "@/components/prestige/PrestigeBadge";

// User reviews
const userReviews = [
  {
    id: "1",
    vehicleName: "Toyota Corolla 2022",
    title: "Güvenilir ve ekonomik",
    content: "Uzun süredir kullanıyorum, hiç sorun yaşamadım...",
    rating: 4.5,
    likes: 24,
    date: "2024-01-15",
  },
  {
    id: "2",
    vehicleName: "Ford Focus 2021",
    title: "İyi bir alternatif",
    content: "Performans açısından tatmin edici...",
    rating: 4,
    likes: 18,
    date: "2024-01-10",
  },
  {
    id: "3",
    vehicleName: "BMW 320i 2023",
    title: "Premium deneyim",
    content: "Sürüş keyfi muhteşem, iç mekan kalitesi üst düzey...",
    rating: 5,
    likes: 32,
    date: "2023-12-28",
  },
  {
    id: "4",
    vehicleName: "Volkswagen Passat 2022",
    title: "Konforlu uzun yol aracı",
    content: "Aile için ideal bir seçim, bagaj hacmi yeterli...",
    rating: 4,
    likes: 15,
    date: "2023-12-15",
  },
];

// Favorite vehicles
const favoriteVehicles = [
  { id: "1", name: "BMW M4 Competition", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop" },
  { id: "2", name: "Porsche 911 GT3", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=300&h=200&fit=crop" },
  { id: "3", name: "Mercedes AMG GT", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop" },
];

// Detailed statistics
const detailedStats = {
  totalReviews: 12,
  monthlyGrowth: 3,
  averageRating: 4.2,
  totalLikes: 89,
  likesGrowth: 12,
  brandsExperienced: 7,
};

// Achievements data
const achievements = [
  {
    id: "1",
    name: "İlk Yorum",
    description: "İlk yorumunuzu yazdınız",
    icon: "🎉",
    earned: true,
    earnedDate: "15 Ocak 2024",
  },
  {
    id: "2",
    name: "Popüler Yazar",
    description: "10+ beğeni alan yorum",
    icon: "⭐",
    earned: true,
    earnedDate: "22 Ocak 2024",
  },
  {
    id: "3",
    name: "Aktif Kullanıcı",
    description: "10+ yorum yazdı",
    icon: "🔥",
    earned: true,
    earnedDate: "28 Ocak 2024",
  },
  {
    id: "4",
    name: "Uzman Yorumcu",
    description: "25+ yorum yazdı",
    icon: "💎",
    earned: false,
    progress: { current: 12, target: 25 },
  },
  {
    id: "5",
    name: "Marka Uzmanı",
    description: "10+ farklı marka deneyimi",
    icon: "🚗",
    earned: false,
    progress: { current: 7, target: 10 },
  },
  {
    id: "6",
    name: "Topluluk Lideri",
    description: "100+ beğeni topladı",
    icon: "👑",
    earned: false,
    progress: { current: 89, target: 100 },
  },
];

// Brand distribution
const brandDistribution = [
  { brand: "Toyota", count: 4 },
  { brand: "Ford", count: 3 },
  { brand: "BMW", count: 2 },
  { brand: "Mercedes", count: 2 },
  { brand: "Diğer", count: 1 },
];

// Rating distribution
const ratingDistribution = [
  { rating: 5, count: 3 },
  { rating: 4, count: 6 },
  { rating: 3, count: 2 },
  { rating: 2, count: 1 },
  { rating: 1, count: 0 },
];

// Recent interactions
const recentInteractions = [
  {
    id: "1",
    type: "like",
    icon: "👍",
    message: "BMW 320i yorumunuz 5 yeni beğeni aldı",
    time: "2 saat önce",
  },
  {
    id: "2",
    type: "comment",
    icon: "💬",
    message: "Toyota Corolla yorumunuza yeni yanıt",
    time: "1 gün önce",
  },
  {
    id: "3",
    type: "follower",
    icon: "👥",
    message: "3 yeni kullanıcı sizi takip etmeye başladı",
    time: "2 gün önce",
  },
  {
    id: "4",
    type: "achievement",
    icon: "🏆",
    message: '"Aktif Kullanıcı" rozetini kazandınız',
    time: "3 gün önce",
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    } else {
      stars.push(
        <Star key={i} className="w-4 h-4 text-muted-foreground/30" />
      );
    }
  }
  return stars;
};

export const ProfileSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("reviews");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setProfileForm({
          displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || "",
          bio: user.user_metadata?.bio || "",
          location: user.user_metadata?.location || "",
          website: user.user_metadata?.website || "",
        });
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("profile.fileTypeError"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile.fileSizeError"));
      return;
    }

    setUploadingAvatar(true);

    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add timestamp to bust cache
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlWithTimestamp }
      });

      if (updateError) throw updateError;

      setAvatarUrl(urlWithTimestamp);
      toast.success(t("profile.avatarSuccess"));

      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(t("profile.avatarError") + ": " + error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profileForm.displayName,
          bio: profileForm.bio,
          location: profileForm.location,
          website: profileForm.website,
        }
      });

      if (error) throw error;

      toast.success(t("profile.profileSuccess"));
      setIsEditDialogOpen(false);
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
    } catch (error: any) {
      toast.error(t("profile.profileError") + ": " + error.message);
    }
  };

  const maxBrandCount = Math.max(...brandDistribution.map(b => b.count));
  const maxRatingCount = Math.max(...ratingDistribution.map(r => r.count));

  // Get user display info
  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Kullanıcı";
  const userEmail = user?.email || "";
  const userBio = user?.user_metadata?.bio || "Otomobil tutkunu. Araç deneyimlerimi paylaşmayı seviyorum.";
  const userLocation = user?.user_metadata?.location || "Türkiye";
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : "";
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">{t("profile.loading")}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">{t("profile.loginRequired")}</p>
            <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
              {t("auth.login")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />

          {/* Profile Header Card */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-28 h-28 border-4 border-card shadow-xl">
                    <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 bg-primary rounded-full p-2 border-2 border-card hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-primary-foreground" />
                    )}
                  </button>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="w-4 h-4" />
                  {t("profile.editProfile")}
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  {t("profile.logout")}
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-foreground">{displayName}</h1>
                    <p className="text-primary font-medium">{t("profile.vehicleEnthusiast")}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground gap-1 self-start">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {joinDate} {t("profile.memberSince")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {userLocation}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-foreground mb-6">{userBio}</p>

                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">{t("profile.reviews")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">89</p>
                    <p className="text-sm text-muted-foreground">{t("profile.likes")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">24</p>
                    <p className="text-sm text-muted-foreground">{t("profile.followers")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  {t("profile.editTitle")}
                </DialogTitle>
                <DialogDescription>
                  {t("profile.editDesc")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {t("profile.displayName")}
                  </Label>
                  <Input
                    id="displayName"
                    placeholder={t("profile.displayNamePlaceholder")}
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{t("profile.displayNameHint")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {t("profile.about")}
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder={t("profile.aboutPlaceholder")}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{t("profile.aboutHint")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {t("profile.location")}
                  </Label>
                  <Input
                    id="location"
                    placeholder={t("profile.locationPlaceholder")}
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{t("profile.locationHint")}</p>
                </div>

              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  {t("profile.cancel")}
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  {t("profile.save")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-card border border-border rounded-xl p-1">
              <TabsTrigger value="prestige" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                🏆 Oracle's Circle
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("profile.myReviews")}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("profile.favorites")}
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t("profile.activity")}
              </TabsTrigger>
            </TabsList>

            {/* Oracle's Circle Tab */}
            <TabsContent value="prestige" className="mt-6">
              <OraclesCircleWidget
                currentTier="honest_broker"
                trustScore={94}
                completedSales={7}
                cleanSales={5}
              />
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6 space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{review.vehicleName}</h3>
                      <p className="text-primary font-medium">{review.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 font-semibold text-foreground">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{review.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {review.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {t("profile.replies")}
                      </span>
                    </div>
                    <Badge variant="secondary">{review.date}</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors">
                    <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6 space-y-4">
              {recentInteractions.slice(0, 4).map((interaction) => (
                <div key={interaction.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{interaction.icon}</span>
                    <div>
                      <p className="text-foreground">{interaction.message}</p>
                      <p className="text-sm text-muted-foreground">{interaction.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {t("profile.view")}
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t("profile.detailedStats")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <p className="text-3xl font-bold text-primary">{detailedStats.totalReviews}</p>
                <p className="text-muted-foreground mb-2">{t("profile.totalReviews")}</p>
                <Badge variant="secondary">{t("profile.thisMonth")} +{detailedStats.monthlyGrowth}</Badge>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <p className="text-3xl font-bold text-primary">{detailedStats.averageRating}</p>
                <p className="text-muted-foreground mb-2">{t("profile.averageRating")}</p>
                <div className="flex justify-center gap-0.5">
                  {renderStars(detailedStats.averageRating)}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <p className="text-3xl font-bold text-primary">{detailedStats.totalLikes}</p>
                <p className="text-muted-foreground mb-2">{t("profile.totalLikes")}</p>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{detailedStats.likesGrowth}%
                </Badge>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <p className="text-3xl font-bold text-primary">{detailedStats.brandsExperienced}</p>
                <p className="text-muted-foreground mb-2">{t("profile.brandsExperienced")}</p>
                <Badge variant="secondary">{t("profile.diversity")}</Badge>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t("profile.achievements")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`rounded-xl border p-6 text-center transition-colors ${
                    achievement.earned 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-card border-border'
                  }`}
                >
                  <span className="text-4xl mb-3 block">{achievement.icon}</span>
                  <h3 className={`font-semibold mb-1 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  {achievement.earned ? (
                    <>
                      <Badge className="bg-primary/20 text-primary border-0 mb-1">{t("profile.earned")}</Badge>
                      <p className="text-xs text-muted-foreground">{achievement.earnedDate}</p>
                    </>
                  ) : (
                    <Badge variant="outline">
                      {t("profile.progress")}: {achievement.progress?.current}/{achievement.progress?.target}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t("profile.reviewCategories")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">{t("profile.brandDistribution")}</h3>
                <div className="space-y-3">
                  {brandDistribution.map((item) => (
                    <div key={item.brand} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-muted-foreground">{item.brand === "Diğer" ? t("profile.other") : item.brand}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(item.count / maxBrandCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm font-medium text-foreground text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">{t("profile.ratingDistribution")}</h3>
                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-3">
                      <span className="w-12 flex items-center gap-1 text-sm">
                        {item.rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: maxRatingCount > 0 ? `${(item.count / maxRatingCount) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="w-8 text-sm font-medium text-foreground text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t("profile.recentInteractions")}</h2>
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {recentInteractions.map((interaction) => (
                <div key={interaction.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{interaction.icon}</span>
                    <div>
                      <p className="text-foreground">{interaction.message}</p>
                      <p className="text-sm text-muted-foreground">{interaction.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {t("profile.view")}
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
