import { Community } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Lock, MessageSquare, Crown, UserPlus, UserMinus } from "lucide-react";

interface CommunityCardProps {
  community: Community;
  isMember: boolean;
  isOwner: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onChat: () => void;
  loading?: boolean;
}

export function CommunityCard({
  community,
  isMember,
  isOwner,
  onJoin,
  onLeave,
  onChat,
  loading
}: CommunityCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display font-bold text-lg">{community.name}</h3>
        <Badge variant={community.is_public ? "secondary" : "outline"} className="flex items-center gap-1">
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
      
      {community.description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {community.description}
        </p>
      )}
      
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
        <Users className="w-4 h-4" />
        <span>{community.member_count} üye</span>
      </div>
      
      <div className="flex gap-2">
        {isOwner ? (
          <Button variant="outline" className="flex-1 gap-2" disabled>
            <Crown className="w-4 h-4" />
            Sahipsin
          </Button>
        ) : isMember ? (
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={onLeave}
            disabled={loading}
          >
            <UserMinus className="w-4 h-4" />
            Ayrıl
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={onJoin}
            disabled={loading}
          >
            <UserPlus className="w-4 h-4" />
            Katıl
          </Button>
        )}
        
        {isMember && (
          <Button className="flex-1 gap-2" onClick={onChat}>
            <MessageSquare className="w-4 h-4" />
            Sohbete Git
          </Button>
        )}
      </div>
    </div>
  );
}
