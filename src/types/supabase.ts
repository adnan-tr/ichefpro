export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          last_login: string | null
          name: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_communications: {
        Row: {
          client_id: string | null
          communication_type: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          order_id: string | null
          quotation_id: string | null
          subject: string | null
        }
        Insert: {
          client_id?: string | null
          communication_type?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          order_id?: string | null
          quotation_id?: string | null
          subject?: string | null
        }
        Update: {
          client_id?: string | null
          communication_type?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          order_id?: string | null
          quotation_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_communications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_communications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_communications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_communications_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          priority: string | null
          usual_discount: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          usual_discount?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          usual_discount?: number | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          company: string | null
          country: string | null
          created_at: string | null
          email: string | null
          file_attachment: string | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          request_type: string | null
          sla_level: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          file_attachment?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          request_type?: string | null
          sla_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          file_attachment?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          request_type?: string | null
          sla_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery: string | null
          client_id: string | null
          created_at: string | null
          expected_delivery: string | null
          final_amount: number | null
          id: string
          notes: string | null
          order_date: string | null
          order_number: string
          order_status: string | null
          payment_status: string | null
          quotation_id: string | null
          shipment_status: string | null
          supplier_status: string | null
          title: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery?: string | null
          client_id?: string | null
          created_at?: string | null
          expected_delivery?: string | null
          final_amount?: number | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number: string
          order_status?: string | null
          payment_status?: string | null
          quotation_id?: string | null
          shipment_status?: string | null
          supplier_status?: string | null
          title?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery?: string | null
          client_id?: string | null
          created_at?: string | null
          expected_delivery?: string | null
          final_amount?: number | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string
          order_status?: string | null
          payment_status?: string | null
          quotation_id?: string | null
          shipment_status?: string | null
          supplier_status?: string | null
          title?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          description: string | null
          id: string
          language_code: string
          name: string | null
          page_reference: string | null
          product_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          language_code: string
          name?: string | null
          page_reference?: string | null
          product_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          language_code?: string
          name?: string | null
          page_reference?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          code: string | null
          created_at: string | null
          description: string | null
          discount: number | null
          id: string
          image_url: string | null
          name: string
          page_reference: string | null
          price: number | null
          subcategory: string | null
          supplier: string | null
          supplier_code: string | null
          supplier_cost: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          image_url?: string | null
          name: string
          page_reference?: string | null
          price?: number | null
          subcategory?: string | null
          supplier?: string | null
          supplier_code?: string | null
          supplier_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          image_url?: string | null
          name?: string
          page_reference?: string | null
          price?: number | null
          subcategory?: string | null
          supplier?: string | null
          supplier_code?: string | null
          supplier_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotation_items: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          id: string
          product_id: string | null
          quantity: number | null
          quotation_id: string | null
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          quotation_id?: string | null
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          quotation_id?: string | null
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_data: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          client_company: string | null
          client_email: string | null
          client_id: string
          client_name: string | null
          created_at: string | null
          customer_reference: string | null
          discount_percentage: number | null
          final_amount: number | null
          id: string
          notes: string | null
          order_id: string | null
          quotation_number: string | null
          status: string | null
          title: string | null
          total_amount: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          client_company?: string | null
          client_email?: string | null
          client_id: string
          client_name?: string | null
          created_at?: string | null
          customer_reference?: string | null
          discount_percentage?: number | null
          final_amount?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          quotation_number?: string | null
          status?: string | null
          title?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          client_company?: string | null
          client_email?: string | null
          client_id?: string
          client_name?: string | null
          created_at?: string | null
          customer_reference?: string | null
          discount_percentage?: number | null
          final_amount?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          quotation_number?: string | null
          status?: string | null
          title?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      request_types: {
        Row: {
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image: string | null
          included_services: string[]
          is_active: boolean
          service_id: string
          starting_price: number
          timeline: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          image?: string | null
          included_services?: string[]
          is_active?: boolean
          service_id: string
          starting_price: number
          timeline: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image?: string | null
          included_services?: string[]
          is_active?: boolean
          service_id?: string
          starting_price?: number
          timeline?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sla_levels: {
        Row: {
          description: string | null
          id: string
          name: string | null
          response_time: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name?: string | null
          response_time?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string | null
          response_time?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          ar: string | null
          en: string | null
          es: string | null
          id: string
          key: string
          ru: string | null
          tr: string | null
        }
        Insert: {
          ar?: string | null
          en?: string | null
          es?: string | null
          id?: string
          key: string
          ru?: string | null
          tr?: string | null
        }
        Update: {
          ar?: string | null
          en?: string | null
          es?: string | null
          id?: string
          key?: string
          ru?: string | null
          tr?: string | null
        }
        Relationships: []
      }
      ui_images: {
        Row: {
          alt_text: string | null
          category: string | null
          created_at: string | null
          dimensions: string | null
          id: string
          name: string | null
          size: string | null
          updated_at: string | null
          url: string | null
          usage: string | null
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          created_at?: string | null
          dimensions?: string | null
          id?: string
          name?: string | null
          size?: string | null
          updated_at?: string | null
          url?: string | null
          usage?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          created_at?: string | null
          dimensions?: string | null
          id?: string
          name?: string | null
          size?: string | null
          updated_at?: string | null
          url?: string | null
          usage?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      order_analytics: {
        Row: {
          avg_order_value: number | null
          cancelled_orders: number | null
          completed_orders: number | null
          month: string | null
          total_orders: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_product_unique_code: {
        Args: Record<PropertyKey, never>
        Returns: string
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
    Enums: {},
  },
} as const
