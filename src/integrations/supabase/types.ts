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
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          name: string
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          last_used_at: string | null
          name: string
          permissions: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          last_used_at?: string | null
          name: string
          permissions?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          last_used_at?: string | null
          name?: string
          permissions?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          expected_scans: number | null
          id: string
          name: string
          project_id: string | null
          settings: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          target_audience: string | null
          template_id: string | null
          type: Database["public"]["Enums"]["campaign_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          expected_scans?: number | null
          id?: string
          name: string
          project_id?: string | null
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          target_audience?: string | null
          template_id?: string | null
          type?: Database["public"]["Enums"]["campaign_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          expected_scans?: number | null
          id?: string
          name?: string
          project_id?: string | null
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          target_audience?: string | null
          template_id?: string | null
          type?: Database["public"]["Enums"]["campaign_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      launched_campaigns: {
        Row: {
          created_at: string
          description: string | null
          export_url: string | null
          id: string
          layout_json: Json
          qr_metadata: Json | null
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          export_url?: string | null
          id?: string
          layout_json: Json
          qr_metadata?: Json | null
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          export_url?: string | null
          id?: string
          layout_json?: Json
          qr_metadata?: Json | null
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "launched_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "launched_campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_lists: {
        Row: {
          created_at: string | null
          description: string | null
          file_type: string | null
          file_url: string | null
          id: string
          import_date: string | null
          name: string
          record_count: number | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          import_date?: string | null
          name: string
          record_count?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          import_date?: string | null
          name?: string
          record_count?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      lead_record_tags: {
        Row: {
          created_at: string
          id: string
          lead_record_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_record_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_record_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_record_tags_lead_record_id_fkey"
            columns: ["lead_record_id"]
            isOneToOne: false
            referencedRelation: "lead_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_record_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_records: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          list_id: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          list_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          list_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_records_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lead_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_logs: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          status: string
          subscription_id: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          status: string
          subscription_id?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
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
          plan: Database["public"]["Enums"]["subscription_plan"]
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
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
          plan?: Database["public"]["Enums"]["subscription_plan"]
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
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
          plan?: Database["public"]["Enums"]["subscription_plan"]
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage_stats?: Json | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_tags: {
        Row: {
          created_at: string
          id: string
          qr_code_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          qr_code_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          qr_code_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_tags_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_code_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          border_style: Json | null
          campaign_id: string | null
          content: string
          content_type: Database["public"]["Enums"]["qr_content_type"] | null
          created_at: string | null
          custom_data: Json | null
          expires_at: string | null
          generation_metadata: Json | null
          generation_source: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string | null
          password_hash: string | null
          password_protected: boolean | null
          performance_metrics: Json | null
          project_id: string | null
          qr_image_url: string | null
          qr_settings: Json | null
          scan_location_data: Json | null
          short_url: string | null
          stats: Json | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          variable_fields: Json | null
          visibility_status: string | null
        }
        Insert: {
          border_style?: Json | null
          campaign_id?: string | null
          content: string
          content_type?: Database["public"]["Enums"]["qr_content_type"] | null
          created_at?: string | null
          custom_data?: Json | null
          expires_at?: string | null
          generation_metadata?: Json | null
          generation_source?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string | null
          password_hash?: string | null
          password_protected?: boolean | null
          performance_metrics?: Json | null
          project_id?: string | null
          qr_image_url?: string | null
          qr_settings?: Json | null
          scan_location_data?: Json | null
          short_url?: string | null
          stats?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          variable_fields?: Json | null
          visibility_status?: string | null
        }
        Update: {
          border_style?: Json | null
          campaign_id?: string | null
          content?: string
          content_type?: Database["public"]["Enums"]["qr_content_type"] | null
          created_at?: string | null
          custom_data?: Json | null
          expires_at?: string | null
          generation_metadata?: Json | null
          generation_source?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string | null
          password_hash?: string | null
          password_protected?: boolean | null
          performance_metrics?: Json | null
          project_id?: string | null
          qr_image_url?: string | null
          qr_settings?: Json | null
          scan_location_data?: Json | null
          short_url?: string | null
          stats?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          variable_fields?: Json | null
          visibility_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_analytics: {
        Row: {
          campaign_id: string | null
          conversion_data: Json | null
          created_at: string | null
          device_info: Json | null
          id: string
          ip_address: unknown | null
          is_first_time_scan: boolean | null
          lead_source: string | null
          location_data: Json | null
          project_id: string | null
          qr_code_id: string | null
          referrer_source: string | null
          scan_timestamp: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          conversion_data?: Json | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_first_time_scan?: boolean | null
          lead_source?: string | null
          location_data?: Json | null
          project_id?: string | null
          qr_code_id?: string | null
          referrer_source?: string | null
          scan_timestamp?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          conversion_data?: Json | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_first_time_scan?: boolean | null
          lead_source?: string | null
          location_data?: Json | null
          project_id?: string | null
          qr_code_id?: string | null
          referrer_source?: string | null
          scan_timestamp?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_analytics_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
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
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          attachments: string[] | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: string[] | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          dimensions: Json
          editable_json: Json | null
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_builtin: boolean
          is_public: boolean
          name: string
          preview_url: string
          qr_position: Json | null
          tags: string[] | null
          template_url: string | null
          thumbnail_url: string | null
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json
          editable_json?: Json | null
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_builtin?: boolean
          is_public?: boolean
          name: string
          preview_url: string
          qr_position?: Json | null
          tags?: string[] | null
          template_url?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json
          editable_json?: Json | null
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_builtin?: boolean
          is_public?: boolean
          name?: string
          preview_url?: string
          qr_position?: Json | null
          tags?: string[] | null
          template_url?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_popular_tags: {
        Args: { p_user_id: string; p_limit?: number }
        Returns: {
          id: string
          name: string
          color: string
          category: string
          usage_count: number
        }[]
      }
      get_qr_analytics: {
        Args: {
          p_user_id: string
          p_time_range?: string
          p_campaign_id?: string
          p_project_id?: string
        }
        Returns: {
          total_qr_codes: number
          total_scans: number
          unique_scans: number
          avg_scans_per_qr: number
          top_performing_qr: Json
          recent_activity: Json
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_admin_role: {
        Args: { _user_id: string }
        Returns: boolean
      }
      increment_qr_scan: {
        Args: { qr_id: string }
        Returns: undefined
      }
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed" | "archived"
      campaign_type: "single" | "bulk"
      qr_content_type:
        | "url"
        | "text"
        | "email"
        | "phone"
        | "sms"
        | "wifi"
        | "vcard"
        | "location"
        | "social_media"
      subscription_plan: "free" | "pro" | "enterprise"
      subscription_status:
        | "active"
        | "inactive"
        | "cancelled"
        | "trial"
        | "past_due"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "user" | "admin" | "super_admin"
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
    Enums: {
      campaign_status: ["draft", "active", "paused", "completed", "archived"],
      campaign_type: ["single", "bulk"],
      qr_content_type: [
        "url",
        "text",
        "email",
        "phone",
        "sms",
        "wifi",
        "vcard",
        "location",
        "social_media",
      ],
      subscription_plan: ["free", "pro", "enterprise"],
      subscription_status: [
        "active",
        "inactive",
        "cancelled",
        "trial",
        "past_due",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["user", "admin", "super_admin"],
    },
  },
} as const
