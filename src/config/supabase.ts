import { createClient } from '@supabase/supabase-js';
import { EnvConfig } from './env';

// Debug environment variables in development
if (process.env.NODE_ENV === 'development') {
  EnvConfig.debugEnvironmentVariables();
  EnvConfig.logEnvironmentInfo();
}

// Create Supabase client using environment configuration
export const supabase = createClient(EnvConfig.SUPABASE_URL, EnvConfig.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          description: string | null;
          images: string[] | null;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          price: number;
          description?: string | null;
          images?: string[] | null;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          price?: number;
          description?: string | null;
          images?: string[] | null;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update']; 