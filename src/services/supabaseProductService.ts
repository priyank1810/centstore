import { supabase, ProductRow, ProductInsert, ProductUpdate } from '../config/supabase';

export interface Product {
  id?: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Convert database row to Product interface
const mapRowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  price: row.price, // Use the single price column
  images: row.images || [],
  category: row.category,
  description: row.description || undefined,
  inStock: row.in_stock,
  featured: row.featured,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Convert Product interface to database insert
const mapProductToInsert = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): ProductInsert => ({
  name: product.name,
  price: product.price, // Use the single price column
  images: product.images,
  category: product.category,
  description: product.description || null,
  in_stock: product.inStock ?? true,
  featured: product.featured ?? false,
});

// Convert Product interface to database update
const mapProductToUpdate = (product: Partial<Product>): ProductUpdate => ({
  ...(product.name && { name: product.name }),
  ...(product.price && { price: product.price }),
  ...(product.images && { images: product.images }),
  ...(product.category && { category: product.category }),
  ...(product.description !== undefined && { description: product.description || null }),
  ...(product.inStock !== undefined && { in_stock: product.inStock }),
  ...(product.featured !== undefined && { featured: product.featured }),
  updated_at: new Date().toISOString(),
});

export class SupabaseProductService {
  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      return data?.map(mapRowToProduct) || [];
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products by category:', error);
        throw new Error(`Failed to fetch products by category: ${error.message}`);
      }

      return data?.map(mapRowToProduct) || [];
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error;
    }
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        console.error('Error fetching product:', error);
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      return data ? mapRowToProduct(data) : null;
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  }

  // Add new product
  static async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const insertData = mapProductToInsert(productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([insertData])
        .select('id')
        .single();

      if (error) {
        console.error('Error adding product:', error);
        throw new Error(`Failed to add product: ${error.message}`);
      }

      console.log('Product added with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error in addProduct:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const updateData = mapProductToUpdate(updates);

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        throw new Error(`Failed to update product: ${error.message}`);
      }

      console.log('Product updated:', id);
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }

      console.log('Product deleted:', id);
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }

  // Real-time subscription to products
  static subscribeToProducts(
    callback: (products: Product[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    // Initial fetch
    this.getAllProducts()
      .then(callback)
      .catch(error => errorCallback?.(error));

    // Set up real-time subscription
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Real-time change detected:', payload);
          // Refetch all products when any change occurs
          this.getAllProducts()
            .then(callback)
            .catch(error => {
              console.error('Error in products subscription:', error);
              errorCallback?.(new Error('Failed to subscribe to products'));
            });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to products changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error');
          errorCallback?.(new Error('Real-time subscription failed'));
        }
      });

    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from products changes');
      subscription.unsubscribe();
    };
  }

  // Real-time subscription to products by category
  static subscribeToProductsByCategory(
    category: string,
    callback: (products: Product[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    // Initial fetch
    this.getProductsByCategory(category)
      .then(callback)
      .catch(error => errorCallback?.(error));

    // Set up real-time subscription
    const subscription = supabase
      .channel(`products-${category}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `category=eq.${category}`
        },
        () => {
          // Refetch category products when any change occurs
          this.getProductsByCategory(category)
            .then(callback)
            .catch(error => {
              console.error('Error in category products subscription:', error);
              errorCallback?.(new Error('Failed to subscribe to category products'));
            });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  }

  // Get featured products (first 6 products)
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured products:', error);
        throw new Error(`Failed to fetch featured products: ${error.message}`);
      }

      return data?.map(mapRowToProduct) || [];
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching products:', error);
        throw new Error(`Failed to search products: ${error.message}`);
      }

      return data?.map(mapRowToProduct) || [];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error;
    }
  }

  // Get products with pagination
  static async getProductsPaginated(
    page: number = 0,
    pageSize: number = 10
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching paginated products:', error);
        throw new Error(`Failed to fetch paginated products: ${error.message}`);
      }

      return {
        products: data?.map(mapRowToProduct) || [],
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Error in getProductsPaginated:', error);
      throw error;
    }
  }
} 