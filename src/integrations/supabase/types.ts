export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      communities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          member_count: number
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          member_count?: number
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          member_count?: number
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_avatar: string | null
          user_email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role?: string
          user_avatar?: string | null
          user_email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_avatar?: string | null
          user_email?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_messages: {
        Row: {
          community_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          user_avatar: string | null
          user_email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          user_avatar?: string | null
          user_email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          user_avatar?: string | null
          user_email?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_quotes: {
        Row: {
          brand: string | null
          city: string | null
          created_at: string
          email: string | null
          fuel_type: string | null
          full_name: string
          id: string
          model: string | null
          notes: string | null
          phone: string
          plate: string | null
          quote_type: string
          status: string
          updated_at: string
          usage_type: string | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          fuel_type?: string | null
          full_name: string
          id?: string
          model?: string | null
          notes?: string | null
          phone: string
          plate?: string | null
          quote_type: string
          status?: string
          updated_at?: string
          usage_type?: string | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          fuel_type?: string | null
          full_name?: string
          id?: string
          model?: string | null
          notes?: string | null
          phone?: string
          plate?: string | null
          quote_type?: string
          status?: string
          updated_at?: string
          usage_type?: string | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          dealer_id: string
          id: string
          note: string | null
          offer_price: number
          status: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          id?: string
          note?: string | null
          offer_price: number
          status?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          id?: string
          note?: string | null
          offer_price?: number
          status?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      review_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          rejection_reason: string | null
          review_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["image_approval_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          rejection_reason?: string | null
          review_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["image_approval_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          rejection_reason?: string | null
          review_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["image_approval_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_public"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_public"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          cons: string[] | null
          content: string
          created_at: string
          id: string
          link_url: string | null
          parent_id: string | null
          pros: string[] | null
          rating: number
          title: string
          updated_at: string
          user_avatar: string | null
          user_email: string
          user_id: string
          user_name: string | null
          vehicle_id: string
        }
        Insert: {
          cons?: string[] | null
          content: string
          created_at?: string
          id?: string
          link_url?: string | null
          parent_id?: string | null
          pros?: string[] | null
          rating: number
          title: string
          updated_at?: string
          user_avatar?: string | null
          user_email: string
          user_id: string
          user_name?: string | null
          vehicle_id: string
        }
        Update: {
          cons?: string[] | null
          content?: string
          created_at?: string
          id?: string
          link_url?: string | null
          parent_id?: string | null
          pros?: string[] | null
          rating?: number
          title?: string
          updated_at?: string
          user_avatar?: string | null
          user_email?: string
          user_id?: string
          user_name?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "reviews_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_premium: boolean
          subscribed_at: string | null
          subscription_tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_premium?: boolean
          subscribed_at?: string | null
          subscription_tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_premium?: boolean
          subscribed_at?: string | null
          subscription_tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      reviews_public: {
        Row: {
          cons: string[] | null
          content: string | null
          created_at: string | null
          id: string | null
          link_url: string | null
          parent_id: string | null
          pros: string[] | null
          rating: number | null
          title: string | null
          updated_at: string | null
          user_avatar: string | null
          user_id: string | null
          user_name: string | null
          vehicle_id: string | null
        }
        Insert: {
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          link_url?: string | null
          parent_id?: string | null
          pros?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string | null
          vehicle_id?: string | null
        }
        Update: {
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          link_url?: string | null
          parent_id?: string | null
          pros?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "reviews_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_tier: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_community_member: {
        Args: { _community_id: string; _user_id: string }
        Returns: boolean
      }
      is_community_owner: {
        Args: { _community_id: string; _user_id: string }
        Returns: boolean
      }
      is_community_public: { Args: { _community_id: string }; Returns: boolean }
      is_premium_user: { Args: { _user_id: string }; Returns: boolean }
      is_user_premium: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      image_approval_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      image_approval_status: ["pending", "approved", "rejected"],
    },
  },
} as const
