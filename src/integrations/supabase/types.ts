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
      ai_generated_reports: {
        Row: {
          chart_data: Json | null
          content: string
          created_at: string
          file_url: string | null
          id: string
          language: string
          metadata: Json | null
          report_type: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          chart_data?: Json | null
          content: string
          created_at?: string
          file_url?: string | null
          id?: string
          language?: string
          metadata?: Json | null
          report_type?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          chart_data?: Json | null
          content?: string
          created_at?: string
          file_url?: string | null
          id?: string
          language?: string
          metadata?: Json | null
          report_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ani_database_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      ani_database_status: {
        Row: {
          created_at: string
          id: string
          last_populated: string | null
          record_count: number | null
          status: string | null
          table_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_populated?: string | null
          record_count?: number | null
          status?: string | null
          table_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_populated?: string | null
          record_count?: number | null
          status?: string | null
          table_name?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          {
            foreignKeyName: "fk_program_id"
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
      ani_institutions: {
        Row: {
          collaboration_count: number | null
          created_at: string
          founding_date: string | null
          id: string
          institution_name: string
          project_history: string[] | null
          region: string | null
          specialization_areas: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          collaboration_count?: number | null
          created_at?: string
          founding_date?: string | null
          id?: string
          institution_name: string
          project_history?: string[] | null
          region?: string | null
          specialization_areas?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          collaboration_count?: number | null
          created_at?: string
          founding_date?: string | null
          id?: string
          institution_name?: string
          project_history?: string[] | null
          region?: string | null
          specialization_areas?: string[] | null
          type?: string
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
      ani_patent_holders: {
        Row: {
          country: string | null
          created_at: string | null
          id: string
          innovation_index: number | null
          institution_id: string | null
          organization_name: string
          patent_count: number
          sector: string | null
          year: number
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: string
          innovation_index?: number | null
          institution_id?: string | null
          organization_name: string
          patent_count: number
          sector?: string | null
          year: number
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: string
          innovation_index?: number | null
          institution_id?: string | null
          organization_name?: string
          patent_count?: number
          sector?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "ani_patent_holders_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "ani_institutions"
            referencedColumns: ["id"]
          },
        ]
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
          institution_id: string | null
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
          institution_id?: string | null
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
          institution_id?: string | null
          organization?: string | null
          region?: string | null
          sector?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ani_projects_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "ani_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      ani_projects_researchers: {
        Row: {
          project_id: string
          researcher_id: string
          role: string | null
        }
        Insert: {
          project_id: string
          researcher_id: string
          role?: string | null
        }
        Update: {
          project_id?: string
          researcher_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ani_projects_researchers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "ani_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ani_projects_researchers_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "ani_researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      ani_researchers: {
        Row: {
          created_at: string
          email: string | null
          h_index: number | null
          id: string
          institution_id: string | null
          name: string
          patent_count: number | null
          publication_count: number | null
          specialization: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          h_index?: number | null
          id?: string
          institution_id?: string | null
          name: string
          patent_count?: number | null
          publication_count?: number | null
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          h_index?: number | null
          id?: string
          institution_id?: string | null
          name?: string
          patent_count?: number | null
          publication_count?: number | null
          specialization?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ani_researchers_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "ani_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_events: {
        Row: {
          campaign_id: string | null
          event_type: string
          id: string
          occurred_at: string | null
          subscriber_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          event_type: string
          id?: string
          occurred_at?: string | null
          subscriber_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          event_type?: string
          id?: string
          occurred_at?: string | null
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_simulations: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          created_at: string | null
          engagement_score: number | null
          id: string
          metadata: Json | null
          opened_at: string | null
          sent_at: string
          subscriber_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          subscriber_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_simulations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_simulations_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          newsletter_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          simulation_results: Json | null
          simulation_status: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          newsletter_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          simulation_results?: Json | null
          simulation_status?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          newsletter_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          simulation_results?: Json | null
          simulation_status?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      content_variations: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          segment_id: string | null
          template_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          segment_id?: string | null
          template_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          segment_id?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_variations_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "user_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_variations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      deployments: {
        Row: {
          deployed_at: string
          deployed_by: string
          endpoint_url: string | null
          environment: string
          id: string
          model_version_id: string
          performance_metrics: Json | null
          status: string
        }
        Insert: {
          deployed_at?: string
          deployed_by: string
          endpoint_url?: string | null
          environment: string
          id?: string
          model_version_id: string
          performance_metrics?: Json | null
          status?: string
        }
        Update: {
          deployed_at?: string
          deployed_by?: string
          endpoint_url?: string | null
          environment?: string
          id?: string
          model_version_id?: string
          performance_metrics?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployments_model_version_id_fkey"
            columns: ["model_version_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
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
      esp_providers: {
        Row: {
          api_key: string
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          metadata: Json | null
          template_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          metadata?: Json | null
          template_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          metadata?: Json | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          metadata: Json | null
          newsletter_id: string | null
          prompt: string
          template_id: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          prompt: string
          template_id?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          prompt?: string
          template_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_images_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          created_by: string
          id: string
          metadata: Json | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          metadata?: Json | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          metadata?: Json | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
      list_personalization_rules: {
        Row: {
          action: string
          condition: string
          created_at: string | null
          created_by: string
          id: string
          list_id: string | null
          priority: number
        }
        Insert: {
          action: string
          condition: string
          created_at?: string | null
          created_by: string
          id?: string
          list_id?: string | null
          priority?: number
        }
        Update: {
          action?: string
          condition?: string
          created_at?: string | null
          created_by?: string
          id?: string
          list_id?: string | null
          priority?: number
        }
        Relationships: [
          {
            foreignKeyName: "list_personalization_rules_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "subscriber_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      model_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          model_version_id: string
          timestamp: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          model_version_id: string
          timestamp?: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          model_version_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_metrics_model_version_id_fkey"
            columns: ["model_version_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_versions: {
        Row: {
          artifacts_path: string | null
          created_at: string
          created_by: string
          hyperparameters: Json
          id: string
          model_id: string
          status: string
          training_data_hash: string | null
          version_number: number
        }
        Insert: {
          artifacts_path?: string | null
          created_at?: string
          created_by: string
          hyperparameters?: Json
          id?: string
          model_id: string
          status?: string
          training_data_hash?: string | null
          version_number: number
        }
        Update: {
          artifacts_path?: string | null
          created_at?: string
          created_by?: string
          hyperparameters?: Json
          id?: string
          model_id?: string
          status?: string
          training_data_hash?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_versions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          framework: string
          id: string
          is_active: boolean
          metadata: Json | null
          model_type: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          framework: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          model_type: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          framework?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          model_type?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_templates: {
        Row: {
          ai_prompt: string
          content: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
        }
        Insert: {
          ai_prompt: string
          content?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
        }
        Update: {
          ai_prompt?: string
          content?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          metadata: Json | null
          subject: string
          template_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          metadata?: Json | null
          subject: string
          template_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          metadata?: Json | null
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
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
      pdf_extracted_elements: {
        Row: {
          created_at: string
          element_data: Json
          element_text: string | null
          element_type: string
          id: string
          pdf_extraction_id: string | null
          position_in_document: Json | null
        }
        Insert: {
          created_at?: string
          element_data: Json
          element_text?: string | null
          element_type: string
          id?: string
          pdf_extraction_id?: string | null
          position_in_document?: Json | null
        }
        Update: {
          created_at?: string
          element_data?: Json
          element_text?: string | null
          element_type?: string
          id?: string
          pdf_extraction_id?: string | null
          position_in_document?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_extracted_elements_pdf_extraction_id_fkey"
            columns: ["pdf_extraction_id"]
            isOneToOne: false
            referencedRelation: "pdf_extractions"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_extractions: {
        Row: {
          created_at: string
          extracted_images: Json | null
          extracted_numbers: Json | null
          extracted_text: string | null
          extraction_status: string | null
          file_name: string
          file_url: string
          id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          extracted_images?: Json | null
          extracted_numbers?: Json | null
          extracted_text?: string | null
          extraction_status?: string | null
          file_name: string
          file_url: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          extracted_images?: Json | null
          extracted_numbers?: Json | null
          extracted_text?: string | null
          extraction_status?: string | null
          file_name?: string
          file_url?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      pdf_reports: {
        Row: {
          created_at: string
          id: string
          pdf_extraction_id: string | null
          report_content: string
          report_data: Json | null
          report_status: string | null
          report_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_extraction_id?: string | null
          report_content: string
          report_data?: Json | null
          report_status?: string | null
          report_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pdf_extraction_id?: string | null
          report_content?: string
          report_data?: Json | null
          report_status?: string | null
          report_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_reports_pdf_extraction_id_fkey"
            columns: ["pdf_extraction_id"]
            isOneToOne: false
            referencedRelation: "pdf_extractions"
            referencedColumns: ["id"]
          },
        ]
      }
      personalization_rules: {
        Row: {
          action: string
          condition: string
          created_at: string | null
          id: string
          template_id: string | null
        }
        Insert: {
          action: string
          condition: string
          created_at?: string | null
          id?: string
          template_id?: string | null
        }
        Update: {
          action?: string
          condition?: string
          created_at?: string | null
          id?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personalization_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          institution: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          institution?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          institution?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      query_history: {
        Row: {
          analysis_result: Json | null
          created_tables: string[] | null
          error_message: string | null
          id: string
          language: string
          query_text: string
          timestamp: string
          user_id: string | null
          was_successful: boolean
        }
        Insert: {
          analysis_result?: Json | null
          created_tables?: string[] | null
          error_message?: string | null
          id?: string
          language?: string
          query_text: string
          timestamp?: string
          user_id?: string | null
          was_successful?: boolean
        }
        Update: {
          analysis_result?: Json | null
          created_tables?: string[] | null
          error_message?: string | null
          id?: string
          language?: string
          query_text?: string
          timestamp?: string
          user_id?: string | null
          was_successful?: boolean
        }
        Relationships: []
      }
      subscriber_list_members: {
        Row: {
          created_at: string | null
          list_id: string
          subscriber_id: string
        }
        Insert: {
          created_at?: string | null
          list_id: string
          subscriber_id: string
        }
        Update: {
          created_at?: string | null
          list_id?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriber_list_members_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "subscriber_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriber_list_members_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriber_lists: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscriber_segments: {
        Row: {
          created_at: string | null
          score: number
          segment_id: string
          subscriber_id: string
        }
        Insert: {
          created_at?: string | null
          score?: number
          segment_id: string
          subscriber_id: string
        }
        Update: {
          created_at?: string | null
          score?: number
          segment_id?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriber_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "user_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriber_segments_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriber_tags: {
        Row: {
          created_at: string | null
          subscriber_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          subscriber_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          subscriber_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriber_tags_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string | null
          created_by: string
          custom_fields: Json | null
          email: string
          id: string
          last_clicked: string | null
          last_opened: string | null
          name: string
          status: Database["public"]["Enums"]["subscriber_status"] | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          custom_fields?: Json | null
          email: string
          id?: string
          last_clicked?: string | null
          last_opened?: string | null
          name: string
          status?: Database["public"]["Enums"]["subscriber_status"] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          custom_fields?: Json | null
          email?: string
          id?: string
          last_clicked?: string | null
          last_opened?: string | null
          name?: string
          status?: Database["public"]["Enums"]["subscriber_status"] | null
        }
        Relationships: []
      }
      synthetic_datasets: {
        Row: {
          created_at: string
          created_by: string
          dataset_type: string
          description: string | null
          id: string
          name: string
          parameters: Json | null
          sample_count: number
          validation_metrics: Json | null
        }
        Insert: {
          created_at?: string
          created_by: string
          dataset_type: string
          description?: string | null
          id?: string
          name: string
          parameters?: Json | null
          sample_count?: number
          validation_metrics?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string
          dataset_type?: string
          description?: string | null
          id?: string
          name?: string
          parameters?: Json | null
          sample_count?: number
          validation_metrics?: Json | null
        }
        Relationships: []
      }
      synthetic_samples: {
        Row: {
          created_at: string
          dataset_id: string
          features: Json
          id: string
          labels: Json | null
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          dataset_id: string
          features: Json
          id?: string
          labels?: Json | null
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          dataset_id?: string
          features?: Json
          id?: string
          labels?: Json | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "synthetic_samples_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "synthetic_datasets"
            referencedColumns: ["id"]
          },
        ]
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
      template_lists: {
        Row: {
          list_id: string
          template_id: string
        }
        Insert: {
          list_id: string
          template_id: string
        }
        Update: {
          list_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_lists_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "subscriber_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_lists_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_segments: {
        Row: {
          created_at: string | null
          created_by: string
          criteria: Json
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          criteria?: Json
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          criteria?: Json
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
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
      execute_raw_query: {
        Args: {
          sql_query: string
        }
        Returns: Json
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
      get_database_setting: {
        Args: {
          setting_key: string
        }
        Returns: string
      }
      get_database_tables: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      subscriber_status: "active" | "inactive" | "unsubscribed"
      user_role: "admin" | "researcher" | "viewer"
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
