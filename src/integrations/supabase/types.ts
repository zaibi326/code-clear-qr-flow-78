export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          language: string | null
          last_login_at: string | null
          name: string
          phone: string | null
          plan: string | null
          preferences: Json | null
          subscription_status: string | null
          timezone: string | null
          trial_ends_at: string | null
          updated_at: string | null
          usage_stats: Json | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id: string
          language?: string | null
          last_login_at?: string | null
          name: string
          phone?: string | null
          plan?: string | null
          preferences?: Json | null
          subscription_status?: string | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage_stats?: Json | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          language?: string | null
          last_login_at?: string | null
          name?: string
          phone?: string | null
          plan?: string | null
          preferences?: Json | null
          subscription_status?: string | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage_stats?: Json | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          custom_data: Json | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          password_hash: string | null
          password_protected: boolean | null
          qr_image_url: string | null
          short_url: string | null
          stats: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          custom_data?: Json | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          password_hash?: string | null
          password_protected?: boolean | null
          qr_image_url?: string | null
          short_url?: string | null
          stats?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          custom_data?: Json | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          password_hash?: string | null
          password_protected?: boolean | null
          qr_image_url?: string | null
          short_url?: string | null
          stats?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_events: {
        Row: {
          conversion: Json | null
          device: Json
          id: string
          ip_address: unknown | null
          location: Json | null
          qr_code_id: string
          referrer: string | null
          session: Json
          timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          conversion?: Json | null
          device?: Json
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          qr_code_id: string
          referrer?: string | null
          session?: Json
          timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          conversion?: Json | null
          device?: Json
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          qr_code_id?: string
          referrer?: string | null
          session?: Json
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_events_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          dimensions: Json
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_public: boolean
          name: string
          preview_url: string
          qr_position: Json | null
          tags: string[] | null
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dimensions?: Json
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_public?: boolean
          name: string
          preview_url: string
          qr_position?: Json | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dimensions?: Json
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_public?: boolean
          name?: string
          preview_url?: string
          qr_position?: Json | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_qr_scan: {
        Args: { qr_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
