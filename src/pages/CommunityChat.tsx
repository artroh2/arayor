import { useState, useEffect, useRef } from "react";
import { messageSchema } from "@/lib/validations";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Community, CommunityMember, CommunityMessage } from "@/types/community";
import { User } from "@supabase/supabase-js";
import { 
  ArrowLeft, 
  Send, 
  Users, 
  Globe, 
  Lock, 
  Image as ImageIcon,
  Crown,
  UserMinus,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommunityChat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (id) {
      fetchCommunity();
      fetchMembers();
      fetchMessages();
    }
  }, [id]);

  useEffect(() => {
    if (user && members.length > 0) {
      setIsMember(members.some(m => m.user_id === user.id));
    }
  }, [user, members]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Realtime subscription for messages
  useEffect(() => {
    if (!id || !isMember) return;

    const channel = supabase
      .channel(`community-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_messages",
          filter: `community_id=eq.${id}`
        },
        (payload) => {
          console.log("New message received:", payload);
          setMessages(prev => [...prev, payload.new as CommunityMessage]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "community_messages",
          filter: `community_id=eq.${id}`
        },
        (payload) => {
          console.log("Message deleted:", payload);
          setMessages(prev => prev.filter(msg => msg.id !== (payload.old as CommunityMessage).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, isMember]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCommunity = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from("communities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching community:", error);
      navigate("/komunite");
    } else {
      setCommunity(data);
    }
    setLoading(false);
  };

  const fetchMembers = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("community_members")
      .select("*")
      .eq("community_id", id)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
    } else {
      setMembers((data || []) as CommunityMember[]);
    }
  };

  const fetchMessages = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .eq("community_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages((data || []) as CommunityMessage[]);
    }
  };

  const getUserInfo = () => {
    if (!user) return { email: "", name: "", avatar: null };
    return {
      email: user.email || "",
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "",
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    };
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || (!newMessage.trim() && !imageFile)) return;

    const msgContent = newMessage.trim() || "📷 Resim";
    const validated = messageSchema.safeParse({ content: msgContent });
    if (!validated.success) {
      toast({ title: "Hata", description: validated.error.errors[0]?.message || "Geçersiz mesaj", variant: "destructive" });
      return;
    }

    setSending(true);
    const userInfo = getUserInfo();
    let imageUrl: string | null = null;

    // Upload image if exists
    if (imageFile) {
      const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("community-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast({ title: "Hata", description: "Resim yüklenemedi.", variant: "destructive" });
        setSending(false);
        return;
      }

      const { data: signed, error: signErr } = await supabase.storage
        .from("community-images")
        .createSignedUrl(uploadData.path, 60 * 60 * 24 * 365);

      if (signErr || !signed) {
        toast({ title: "Hata", description: "Resim bağlantısı oluşturulamadı.", variant: "destructive" });
        setSending(false);
        return;
      }
      imageUrl = signed.signedUrl;
    }

    const { error } = await supabase
      .from("community_messages")
      .insert({
        community_id: id,
        user_id: user.id,
        user_email: userInfo.email,
        user_name: userInfo.name,
        user_avatar: userInfo.avatar,
        content: newMessage.trim() || "📷 Resim",
        image_url: imageUrl
      });

    if (error) {
      console.error("Error sending message:", error);
      toast({ title: "Hata", description: "Mesaj gönderilemedi.", variant: "destructive" });
    } else {
      setNewMessage("");
      clearImage();
    }
    setSending(false);
  };

  const handleLeave = async () => {
    if (!user || !id) return;

    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error leaving community:", error);
      toast({ title: "Hata", description: "Topluluktan ayrılınamadı.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Topluluktan ayrıldınız." });
      navigate("/komunite");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Şimdi";
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    return `${Math.floor(days / 30)} ay önce`;
  };

  const isOwner = community?.owner_id === user?.id;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  if (!community) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Topluluk bulunamadı.</p>
            <Link to="/komunite">
              <Button>Topluluklara Dön</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isMember && !loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Bu topluluğun üyesi değilsiniz.</p>
            <Link to="/komunite">
              <Button>Topluluklara Dön</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/komunite">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Tüm Topluluklar
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <h1 className="font-display font-bold text-lg">{community.name}</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                {community.is_public ? (
                  <>
                    <Globe className="w-3 h-3" />
                    Herkese Açık
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    Özel
                  </>
                )}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {community.member_count} üye
            </div>
            
            {!isOwner && (
              <Button variant="outline" size="sm" className="gap-2" onClick={handleLeave}>
                <UserMinus className="w-4 h-4" />
                Ayrıl
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p>Henüz mesaj yok. İlk mesajı gönderin!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.user_id === user?.id;
                  return (
                    <div 
                      key={message.id} 
                      className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={message.user_avatar || undefined} />
                        <AvatarFallback>
                          {(message.user_name || "AK").substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[70%] ${isOwnMessage ? "text-right" : ""}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                          <span className="font-medium text-sm">
                            {message.user_name || "Anonim Kullanıcı"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        
                        <div className={`rounded-2xl p-3 ${
                          isOwnMessage 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary"
                        }`}>
                          {message.image_url && (
                            <img 
                              src={message.image_url} 
                              alt="Shared" 
                              className="rounded-lg mb-2 max-w-full max-h-64 object-cover"
                            />
                          )}
                          {message.content !== "📷 Resim" && (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4 bg-card">
              {imagePreview && (
                <div className="relative inline-block mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-20 rounded-lg object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  placeholder="Mesajınızı yazın..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  disabled={sending}
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                
                <Button type="submit" size="icon" disabled={sending || (!newMessage.trim() && !imageFile)}>
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="w-64 border-l border-border bg-card p-4 hidden lg:block overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Üyeler</h3>
            </div>
            
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user_avatar || undefined} />
                    <AvatarFallback>
                      {(member.user_name || "AK").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {member.user_name || "Anonim Kullanıcı"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {member.role === "owner" && <Crown className="w-3 h-3" />}
                      {member.role === "owner" ? "Kurucu" : "Üye"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityChat;
