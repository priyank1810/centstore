import { supabase } from '../config/supabase';

export interface AccessoryCategory {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export class SupabaseAccessoryCategoryService {
  static async getAllCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('accessory_categories')
        .select('name')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching accessory categories:', error);
        throw new Error(error.message);
      }

      return (data || []).map((row: any) => row.name);
    } catch (err) {
      console.error('Error in getAllCategories:', err);
      throw err;
    }
  }

  static async addCategory(name: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('accessory_categories')
        .insert([{ name }])
        .select('id')
        .single();

      if (error) {
        console.error('Error adding accessory category:', error);
        throw new Error(error.message);
      }

      return data.id;
    } catch (err) {
      console.error('Error in addCategory:', err);
      throw err;
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('accessory_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting accessory category:', error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Error in deleteCategory:', err);
      throw err;
    }
  }
}

export default SupabaseAccessoryCategoryService; 