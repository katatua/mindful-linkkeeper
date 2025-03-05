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
      ani_funding_applications: {
        Row: {
          application_date: string
          approved_amount: number | null
          created_at: string | null
          decision_date: string | null
          id: string
          organization: string | null
          program_id: string | null
          region: string | null
          requested_amount: number | null
          sector: string | null
          status: string
          updated_at: string | null
          year: number
        }
        Insert: {
          application_date: string
          approved_amount?: number | null
          created_at?: string | null
          decision_date?: string | null
          id?: string
          organization?: string | null
          program_id?: string | null
          region?: string | null
          requested_amount?: number | null
          sector?: string | null
          status: string
          updated_at?: string | null
          year: number
        }
        Update: {
          application_date?: string
          approved_amount?: number | null
          created_at?: string | null
          decision_date?: string | null
          id?: string
          organization?: string | null
          program_id?: string | null
          region?: string | null
          requested_amount?: number | null
          sector?: string | null
          status?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "ani_funding_applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ani_funding_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      ani_funding_programs: {
        Row: {
          application_deadline: string | null
          application_process: string | null
          created_at: string
          description: string | null
          eligibility_criteria: string | null
          end_date: string | null
          funding_type: string | null
          id: string
          name: string
          next_call_date: string | null
          review_time_days: number | null
          sector_focus: string[] | null
          start_date: string | null
          success_rate: number | null
          total_budget: number | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          application_process?: string | null
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          end_date?: string | null
          funding_type?: string | null
          id?: string
          name: string
          next_call_date?: string | null
          review_time_days?: number | null
          sector_focus?: string[] | null
          start_date?: string | null
          success_rate?: number | null
          total_budget?: number | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          application_process?: string | null
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          end_date?: string | null
          funding_type?: string | null
          id?: string
          name?: string
          next_call_date?: string | null
          review_time_days?: number | null
          sector_focus?: string[] | null
          start_date?: string | null
          success_rate?: number | null
          total_budget?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ani_international_collaborations: {
        Row: {
          country: string
          created_at: string | null
          end_date: string | null
          focus_areas: string[] | null
          id: string
          partnership_type: string | null
          portuguese_contribution: number | null
          program_name: string
          start_date: string | null
          total_budget: number | null
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          end_date?: string | null
          focus_areas?: string[] | null
          id?: string
          partnership_type?: string | null
          portuguese_contribution?: number | null
          program_name: string
          start_date?: string | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          end_date?: string | null
          focus_areas?: string[] | null
          id?: string
          partnership_type?: string | null
          portuguese_contribution?: number | null
          program_name?: string
          start_date?: string | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ani_metrics: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          measurement_date: string | null
          name: string
          region: string | null
          sector: string | null
          source: string | null
          unit: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          measurement_date?: string | null
          name: string
          region?: string | null
          sector?: string | null
          source?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          measurement_date?: string | null
          name?: string
          region?: string | null
          sector?: string | null
          source?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      ani_policy_frameworks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          implementation_date: string | null
          key_objectives: string[] | null
          related_legislation: string | null
          scope: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          implementation_date?: string | null
          key_objectives?: string[] | null
          related_legislation?: string | null
          scope?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          implementation_date?: string | null
          key_objectives?: string[] | null
          related_legislation?: string | null
          scope?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ani_projects: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          end_date: string | null
          funding_amount: number | null
          id: string
          organization: string | null
          region: string | null
          sector: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          funding_amount?: number | null
          id?: string
          organization?: string | null
          region?: string | null
          sector?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          funding_amount?: number | null
          id?: string
          organization?: string | null
          region?: string | null
          sector?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          link_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          link_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          link_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_notes_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          category: string | null
          classification: string | null
          created_at: string | null
          embedding: string | null
          file_metadata: Json | null
          id: string
          processing_status: string | null
          search_terms: unknown | null
          search_vector: unknown | null
          source: string | null
          summary: string | null
          title: string | null
          url: string
          user_id: string
        }
        Insert: {
          category?: string | null
          classification?: string | null
          created_at?: string | null
          embedding?: string | null
          file_metadata?: Json | null
          id?: string
          processing_status?: string | null
          search_terms?: unknown | null
          search_vector?: unknown | null
          source?: string | null
          summary?: string | null
          title?: string | null
          url: string
          user_id: string
        }
        Update: {
          category?: string | null
          classification?: string | null
          created_at?: string | null
          embedding?: string | null
          file_metadata?: Json | null
          id?: string
          processing_status?: string | null
          search_terms?: unknown | null
          search_vector?: unknown | null
          source?: string | null
          summary?: string | null
          title?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          link_id: string | null
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          link_id?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          link_id?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      concat_search_fields: {
        Args: {
          title: string
          summary: string
          category: string
        }
        Returns: string
      }
      enhance_search_text: {
        Args: {
          text_to_enhance: string
        }
        Returns: string
      }
      execute_sql_query: {
        Args: {
          sql_query: string
        }
        Returns: Json
      }
      generate_search_terms: {
        Args: {
          title: string
          summary: string
          category: string
          source: string
          file_metadata: Json
        }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_links: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          similarity: number
        }[]
      }
      normalize_search_text: {
        Args: {
          text_to_normalize: string
        }
        Returns: string
      }
      normalize_text: {
        Args: {
          text_to_normalize: string
        }
        Returns: string
      }
      process_filename: {
        Args: {
          filename: string
        }
        Returns: string
      }
      search_links: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          rank: number
        }[]
      }
      search_links_hybrid: {
        Args: {
          search_query: string
          similarity_threshold?: number
        }
        Returns: {
          id: string
          rank: number
        }[]
      }
      search_links_improved: {
        Args: {
          search_query: string
          similarity_threshold?: number
        }
        Returns: {
          id: string
          rank: number
        }[]
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
