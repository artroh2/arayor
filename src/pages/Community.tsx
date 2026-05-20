import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { CommunityCard, CreateCommunityDialog } from "@/components/community";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Community, CommunityMember } from "@/types/community";
import { User } from "@supabase/supabase-js";
import { Search, Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommunityPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [memberships, setMemberships] = useState<CommunityMember[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchCommunities();
    if (user) {
      fetchMemberships();
    }
  }, [user]);

  const fetchCommunities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("communities")
      .select("*")
      .order("member_count", { ascending: false });

    if (error) {
      console.error("Error fetching communities:", error);
    } else {
      setCommunities(data || []);
    }
    setLoading(false);
  };

  const fetchMemberships = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("community_members")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching memberships:", error);
    } else {
      setMemberships((data || []) as CommunityMember[]);
    }
  };

  const getUserInfo = () => {
    if (!user) return { email: "", name: "", avatar: "" };
    return {
      email: user.email || "",
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "",
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    };
  };

  const handleCreateCommunity = async (data: { name: string; description: string; is_public: boolean }) => {
    if (!user) {
      toast({ title: "Hata", description: "Topluluk oluşturmak için giriş yapmalısınız.", variant: "destructive" });
      return;
    }

    setActionLoading("create");
    const userInfo = getUserInfo();

    // Create community
    const { data: community, error: communityError } = await supabase
      .from("communities")
      .insert({
        name: data.name,
        description: data.description || null,
        is_public: data.is_public,
        owner_id: user.id
      })
      .select()
      .single();

    if (communityError) {
      console.error("Error creating community:", communityError);
      toast({ title: "Hata", description: "Topluluk oluşturulamadı.", variant: "destructive" });
      setActionLoading(null);
      return;
    }

    // Add owner as member
    const { error: memberError } = await supabase
      .from("community_members")
      .insert({
        community_id: community.id,
        user_id: user.id,
        user_email: userInfo.email,
        user_name: userInfo.name,
        user_avatar: userInfo.avatar,
        role: "owner"
      });

    if (memberError) {
      console.error("Error adding owner as member:", memberError);
    }

    setCreateDialogOpen(false);
    setActionLoading(null);
    toast({ title: "Başarılı", description: "Topluluk oluşturuldu!" });
    fetchCommunities();
    fetchMemberships();
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      toast({ title: "Hata", description: "Katılmak için giriş yapmalısınız.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setActionLoading(communityId);
    const userInfo = getUserInfo();

    const { error } = await supabase
      .from("community_members")
      .insert({
        community_id: communityId,
        user_id: user.id,
        user_email: userInfo.email,
        user_name: userInfo.name,
        user_avatar: userInfo.avatar,
        role: "member"
      });

    if (error) {
      console.error("Error joining community:", error);
      toast({ title: "Hata", description: "Topluluğa katılınamadı.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Topluluğa katıldınız!" });
      fetchCommunities();
      fetchMemberships();
    }
    setActionLoading(null);
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;

    setActionLoading(communityId);

    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error leaving community:", error);
      toast({ title: "Hata", description: "Topluluktan ayrılınamadı.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Topluluktan ayrıldınız." });
      fetchCommunities();
      fetchMemberships();
    }
    setActionLoading(null);
  };

  const handleGoToChat = (communityId: string) => {
    navigate(`/komunite/${communityId}`);
  };

  const isMemberOf = (communityId: string) => {
    return memberships.some(m => m.community_id === communityId);
  };

  const isOwnerOf = (communityId: string) => {
    return communities.find(c => c.id === communityId)?.owner_id === user?.id;
  };

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-display font-bold">Topluluklar</h1>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Araç tutkunlarıyla bir araya gelin, deneyimlerinizi paylaşın ve sohbet edin.
          </p>

          {/* Search & Create */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Topluluk ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <Button 
              size="lg" 
              className="h-12 gap-2"
              onClick={() => user ? setCreateDialogOpen(true) : navigate("/auth")}
            >
              <Plus className="w-5 h-5" />
              Topluluk Oluştur
            </Button>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-secondary rounded w-1/2 mb-4" />
                  <div className="h-4 bg-secondary rounded w-3/4 mb-4" />
                  <div className="h-4 bg-secondary rounded w-1/4 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-secondary rounded flex-1" />
                    <div className="h-10 bg-secondary rounded flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Henüz topluluk yok</h2>
              <p className="text-muted-foreground mb-6">
                İlk topluluğu oluşturan siz olun!
              </p>
              <Button onClick={() => user ? setCreateDialogOpen(true) : navigate("/auth")}>
                <Plus className="w-4 h-4 mr-2" />
                Topluluk Oluştur
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isMember={isMemberOf(community.id)}
                  isOwner={isOwnerOf(community.id)}
                  onJoin={() => handleJoinCommunity(community.id)}
                  onLeave={() => handleLeaveCommunity(community.id)}
                  onChat={() => handleGoToChat(community.id)}
                  loading={actionLoading === community.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CreateCommunityDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCommunity}
        loading={actionLoading === "create"}
      />
    </Layout>
  );
};

export default CommunityPage;
