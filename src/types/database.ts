export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          changes_json: Json | null
          created_at: string
          id: string
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          changes_json?: Json | null
          created_at?: string
          id?: string
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          changes_json?: Json | null
          created_at?: string
          id?: string
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          assigned_at: string | null
          assignee_id: string | null
          author_id: string | null
          blockquote: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          image_alt: string | null
          image_webp_url: string | null
          is_featured: boolean
          meta_keyword: string | null
          published_at: string | null
          scheduled_at: string | null
          seo_description: string | null
          seo_json: Json
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tags: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          assigned_at?: string | null
          assignee_id?: string | null
          author_id?: string | null
          blockquote?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          image_alt?: string | null
          image_webp_url?: string | null
          is_featured?: boolean
          meta_keyword?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          assigned_at?: string | null
          assignee_id?: string | null
          author_id?: string | null
          blockquote?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          image_alt?: string | null
          image_webp_url?: string | null
          is_featured?: boolean
          meta_keyword?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          country: string
          created_at: string
          description_html: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          description_html?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          description_html?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_address: unknown
          location_id: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string
          service_id: string | null
          service_name: string | null
          source_page_slug: string | null
          source_url: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          user_agent: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: unknown
          location_id?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          service_id?: string | null
          service_name?: string | null
          source_page_slug?: string | null
          source_url: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_agent?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: unknown
          location_id?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          service_id?: string | null
          service_name?: string | null
          source_page_slug?: string | null
          source_url?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_agent?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          challenges_json: Json
          content_json: Json
          created_at: string
          deliverables_json: Json
          faq_json: Json
          headline: string | null
          hero_badge: string | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          og_image_url: string | null
          overview: string | null
          recommended_services: string[]
          seo_description: string | null
          seo_json: Json
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          strategy_json: Json
          subheadline: string | null
          updated_at: string
        }
        Insert: {
          challenges_json?: Json
          content_json?: Json
          created_at?: string
          deliverables_json?: Json
          faq_json?: Json
          headline?: string | null
          hero_badge?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          og_image_url?: string | null
          overview?: string | null
          recommended_services?: string[]
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          strategy_json?: Json
          subheadline?: string | null
          updated_at?: string
        }
        Update: {
          challenges_json?: Json
          content_json?: Json
          created_at?: string
          deliverables_json?: Json
          faq_json?: Json
          headline?: string | null
          hero_badge?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          og_image_url?: string | null
          overview?: string | null
          recommended_services?: string[]
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          strategy_json?: Json
          subheadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      language_keys: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_published: boolean
          key_name: string
          slug: string
          updated_at: string
          value_en: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          key_name: string
          slug: string
          updated_at?: string
          value_en?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          key_name?: string
          slug?: string
          updated_at?: string
          value_en?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          content_json: Json
          country_code: string
          created_at: string
          deliverables_json: Json
          description: string | null
          faq_json: Json
          headline: string | null
          hero_badge: string | null
          id: string
          lat: number | null
          lng: number | null
          local_factors_json: Json
          maps_embed_url: string | null
          name: string
          overview: string | null
          region: string
          seo_description: string | null
          seo_json: Json
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          subheadline: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          content_json?: Json
          country_code?: string
          created_at?: string
          deliverables_json?: Json
          description?: string | null
          faq_json?: Json
          headline?: string | null
          hero_badge?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          local_factors_json?: Json
          maps_embed_url?: string | null
          name: string
          overview?: string | null
          region?: string
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subheadline?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          content_json?: Json
          country_code?: string
          created_at?: string
          deliverables_json?: Json
          description?: string | null
          faq_json?: Json
          headline?: string | null
          hero_badge?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          local_factors_json?: Json
          maps_embed_url?: string | null
          name?: string
          overview?: string | null
          region?: string
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subheadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          folder: string
          height: number | null
          id: string
          mime_type: string
          original_name: string
          size_bytes: number
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          folder?: string
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          size_bytes: number
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          size_bytes?: number
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          challenge: string | null
          client: string | null
          content_json: Json
          created_at: string
          deliverables_json: Json
          gallery_json: Json
          id: string
          image_url: string | null
          implementation_json: Json
          industry: string | null
          og_image_url: string | null
          results_json: Json
          seo_description: string | null
          seo_json: Json
          seo_title: string | null
          services: string[]
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          strategy: string | null
          summary: string | null
          timeline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          challenge?: string | null
          client?: string | null
          content_json?: Json
          created_at?: string
          deliverables_json?: Json
          gallery_json?: Json
          id?: string
          image_url?: string | null
          implementation_json?: Json
          industry?: string | null
          og_image_url?: string | null
          results_json?: Json
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          services?: string[]
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          strategy?: string | null
          summary?: string | null
          timeline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          challenge?: string | null
          client?: string | null
          content_json?: Json
          created_at?: string
          deliverables_json?: Json
          gallery_json?: Json
          id?: string
          image_url?: string | null
          implementation_json?: Json
          industry?: string | null
          og_image_url?: string | null
          results_json?: Json
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          services?: string[]
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          strategy?: string | null
          summary?: string | null
          timeline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      search_content: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          keywords: string[]
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          keywords?: string[]
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          keywords?: string[]
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      // Manually added ahead of `supabase gen types` — see
      // supabase/migrations/006_packages.sql. Regenerating types once that
      // migration is applied should produce an equivalent block; this one
      // exists so the app builds and type-checks against it in the meantime.
      packages: {
        Row: {
          billing_period: string
          cta_label: string | null
          description: string | null
          features_json: Json
          id: string
          is_popular: boolean
          name: string
          price: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          billing_period?: string
          cta_label?: string | null
          description?: string | null
          features_json?: Json
          id?: string
          is_popular?: boolean
          name: string
          price: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tier: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          billing_period?: string
          cta_label?: string | null
          description?: string | null
          features_json?: Json
          id?: string
          is_popular?: boolean
          name?: string
          price?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tier?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          created_at: string
          created_by: string | null
          faq_json: Json
          headline: string | null
          id: string
          location_id: string
          meta_keyword: string | null
          og_image_url: string | null
          overview: string | null
          seo_description: string | null
          sections_json: Json
          seo_json: Json
          seo_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          subheadline: string | null
          updated_at: string
          why_choose_us_heading: string | null
          why_choose_us_json: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          faq_json?: Json
          headline?: string | null
          id?: string
          location_id: string
          meta_keyword?: string | null
          og_image_url?: string | null
          overview?: string | null
          sections_json?: Json
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subheadline?: string | null
          updated_at?: string
          why_choose_us_heading?: string | null
          why_choose_us_json?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          faq_json?: Json
          headline?: string | null
          id?: string
          location_id?: string
          meta_keyword?: string | null
          og_image_url?: string | null
          overview?: string | null
          sections_json?: Json
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subheadline?: string | null
          updated_at?: string
          why_choose_us_heading?: string | null
          why_choose_us_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "seo_pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_pages_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          benefits_json: Json
          content: string | null
          content_json: Json
          created_at: string
          deliverables_json: Json
          faq_json: Json
          headline: string | null
          hero_badge: string | null
          icon: string | null
          icon_url: string | null
          id: string
          image_url: string | null
          includes_json: Json
          name: string
          og_image_url: string | null
          overview: string | null
          problems_json: Json
          process_json: Json
          schema_type: string | null
          seo_description: string | null
          seo_json: Json
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          starting_price: number | null
          starting_price_label: string | null
          status: Database["public"]["Enums"]["content_status"]
          subheadline: string | null
          updated_at: string
        }
        Insert: {
          benefits_json?: Json
          content?: string | null
          content_json?: Json
          created_at?: string
          deliverables_json?: Json
          faq_json?: Json
          headline?: string | null
          hero_badge?: string | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          includes_json?: Json
          name: string
          og_image_url?: string | null
          overview?: string | null
          problems_json?: Json
          process_json?: Json
          schema_type?: string | null
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          starting_price?: number | null
          starting_price_label?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subheadline?: string | null
          updated_at?: string
        }
        Update: {
          benefits_json?: Json
          content?: string | null
          content_json?: Json
          created_at?: string
          deliverables_json?: Json
          faq_json?: Json
          headline?: string | null
          hero_badge?: string | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          includes_json?: Json
          name?: string
          og_image_url?: string | null
          overview?: string | null
          problems_json?: Json
          process_json?: Json
          schema_type?: string | null
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          starting_price?: number | null
          starting_price_label?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subheadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      static_pages: {
        Row: {
          content_json: Json
          created_at: string
          h3_text: string | null
          id: string
          meta_keyword: string | null
          og_image_url: string | null
          sections_json: Json
          seo_description: string | null
          seo_json: Json
          seo_title: string | null
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          sub_title: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content_json?: Json
          created_at?: string
          h3_text?: string | null
          id?: string
          meta_keyword?: string | null
          og_image_url?: string | null
          sections_json?: Json
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          sub_title?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content_json?: Json
          created_at?: string
          h3_text?: string | null
          id?: string
          meta_keyword?: string | null
          og_image_url?: string | null
          sections_json?: Json
          seo_description?: string | null
          seo_json?: Json
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          sub_title?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "website_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff: { Args: { roles: string[] }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      approval_status:
        | "pending"
        | "approved"
        | "resubmission_required"
        | "rejected"
      audit_action:
        | "create"
        | "update"
        | "delete"
        | "publish"
        | "unpublish"
        | "generate"
      content_status: "draft" | "published" | "archived"
      lead_status: "new" | "contacted" | "in_progress" | "converted" | "closed"
      user_role:
        | "super_admin"
        | "admin"
        | "editor"
        | "content_writer"
        | "support_staff"
        | "seo_editor"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      approval_status: [
        "pending",
        "approved",
        "resubmission_required",
        "rejected",
      ],
      audit_action: [
        "create",
        "update",
        "delete",
        "publish",
        "unpublish",
        "generate",
      ],
      content_status: ["draft", "published", "archived"],
      lead_status: ["new", "contacted", "in_progress", "converted", "closed"],
      user_role: [
        "super_admin",
        "admin",
        "editor",
        "content_writer",
        "support_staff",
        "seo_editor",
      ],
    },
  },
} as const

