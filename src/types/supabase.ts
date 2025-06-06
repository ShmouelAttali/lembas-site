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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          id: string
          low_stock_threshold: number
          name: string | null
          price_per_100g: number
        }
        Insert: {
          id?: string
          low_stock_threshold?: number
          name?: string | null
          price_per_100g?: number
        }
        Update: {
          id?: string
          low_stock_threshold?: number
          name?: string | null
          price_per_100g?: number
        }
        Relationships: []
      }
      ingredients_inventory: {
        Row: {
          amount: number
          ingredient_id: string
        }
        Insert: {
          amount: number
          ingredient_id: string
        }
        Update: {
          amount?: number
          ingredient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_inventory_ingredients_id_fk"
            columns: ["ingredient_id"]
            isOneToOne: true
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      name_suffixes: {
        Row: {
          id: string
          suffix: string
        }
        Insert: {
          id?: string
          suffix: string
        }
        Update: {
          id?: string
          suffix?: string
        }
        Relationships: []
      }
      oauth_accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          provider_account_id: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_account_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      order_dates: {
        Row: {
          date: string
        }
        Insert: {
          date: string
        }
        Update: {
          date?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          is_sliced: boolean
          order_id: number | null
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_sliced?: boolean
          order_id?: number | null
          product_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          is_sliced?: boolean
          order_id?: number | null
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_orders_id_fk"
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
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_buy_counts"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          created_at: string
          customer_name: string
          email: string | null
          fulfillment: string
          id: number
          is_payed: boolean | null
          is_ready: boolean | null
          items_price: number
          notes: string | null
          order_date: string
          payment_method: string | null
          phone: string
          shipping_fee: number
          status: string
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_name: string
          email?: string | null
          fulfillment: string
          id?: number
          is_payed?: boolean | null
          is_ready?: boolean | null
          items_price: number
          notes?: string | null
          order_date?: string
          payment_method?: string | null
          phone: string
          shipping_fee: number
          status?: string
          total_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_name?: string
          email?: string | null
          fulfillment?: string
          id?: number
          is_payed?: boolean | null
          is_ready?: boolean | null
          items_price?: number
          notes?: string | null
          order_date?: string
          payment_method?: string | null
          phone?: string
          shipping_fee?: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_ingredients: {
        Row: {
          id: string
          ingredient_id: string
          product_id: string
          weight: number
        }
        Insert: {
          id?: string
          ingredient_id: string
          product_id: string
          weight: number
        }
        Update: {
          id?: string
          ingredient_id?: string
          product_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredients_id_fk"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_buy_counts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url1: string | null
          image_url2: string | null
          in_stock: boolean
          is_new: boolean | null
          is_soon: boolean | null
          price: number
          slug: string
          stock: number
          title: string
          updated_at: string
          visible: boolean
          weight: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url1?: string | null
          image_url2?: string | null
          in_stock?: boolean
          is_new?: boolean | null
          is_soon?: boolean | null
          price: number
          slug: string
          stock?: number
          title: string
          updated_at?: string
          visible?: boolean
          weight?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url1?: string | null
          image_url2?: string | null
          in_stock?: boolean
          is_new?: boolean | null
          is_soon?: boolean | null
          price?: number
          slug?: string
          stock?: number
          title?: string
          updated_at?: string
          visible?: boolean
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash?: string | null
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      products_with_buy_counts: {
        Row: {
          buy_count: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url1: string | null
          image_url2: string | null
          in_stock: boolean | null
          is_new: boolean | null
          is_soon: boolean | null
          price: number | null
          slug: string | null
          stock: number | null
          title: string | null
          updated_at: string | null
          visible: boolean | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      get_random_suffix: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          suffix: string
        }[]
      }
      get_required_ingredients: {
        Args: { date_input: string }
        Returns: {
          ingredient_id: string
          required: number
        }[]
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
