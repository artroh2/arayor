export interface Community {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  owner_id: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  user_avatar: string | null;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface CommunityMessage {
  id: string;
  community_id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
}
