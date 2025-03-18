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
      activities: {
        Row: {
          completed: boolean | null
          contact_id: string | null
          created_at: string
          date: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          contact_id?: string | null
          created_at?: string
          date?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          contact_id?: string | null
          created_at?: string
          date?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          audience: string | null
          click_rate: number | null
          completed_at: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          open_rate: number | null
          scheduled_at: string | null
          sent_count: number | null
          status: Database["public"]["Enums"]["campaign_status"]
          type: Database["public"]["Enums"]["campaign_type"]
        }
        Insert: {
          audience?: string | null
          click_rate?: number | null
          completed_at?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          open_rate?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"]
          type?: Database["public"]["Enums"]["campaign_type"]
        }
        Update: {
          audience?: string | null
          click_rate?: number | null
          completed_at?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          open_rate?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"]
          type?: Database["public"]["Enums"]["campaign_type"]
        }
        Relationships: []
      }
      contacts: {
        Row: {
          avatar: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          last_contact: string | null
          name: string
          phone: string | null
          position: string | null
          status: Database["public"]["Enums"]["contact_status"]
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          last_contact?: string | null
          name: string
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contact?: string | null
          name?: string
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          closed_at: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          id: string
          probability: number | null
          stage: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          campaign_id: string | null
          company: string | null
          contacted_at: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          company?: string | null
          contacted_at?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          company?: string | null
          contacted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      webforms: {
        Row: {
          conversion_rate: number | null
          created_at: string
          fields: string[]
          id: string
          name: string
          status: string
          submissions: number | null
          updated_at: string
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string
          fields: string[]
          id?: string
          name: string
          status?: string
          submissions?: number | null
          updated_at?: string
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string
          fields?: string[]
          id?: string
          name?: string
          status?: string
          submissions?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: "email" | "call" | "meeting" | "task" | "note"
      campaign_status: "draft" | "scheduled" | "active" | "completed"
      campaign_type: "email" | "social" | "ads"
      contact_status: "lead" | "prospect" | "customer" | "churned"
      deal_stage: "lead" | "contact" | "proposal" | "negotiation" | "closed"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "unqualified"
        | "in_pipeline"
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
