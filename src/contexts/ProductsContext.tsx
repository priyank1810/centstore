import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseProductService, Product } from '../services/supabaseProductService';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: React.ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from Supabase on component mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupRealtimeListener = () => {
      setLoading(true);
      setError(null);

      // Set up real-time listener
      unsubscribe = SupabaseProductService.subscribeToProducts(
        (productsData: Product[]) => {
          setProducts(productsData);
          setLoading(false);
          setError(null);
        },
        (err: Error) => {
          console.error('Products subscription error:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    };

    setupRealtimeListener();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setError(null);
      const productId = await SupabaseProductService.addProduct(productData);
      
      // Manually refresh products if real-time doesn't work
      setTimeout(async () => {
        try {
          const updatedProducts = await SupabaseProductService.getAllProducts();
          setProducts(updatedProducts);
        } catch (error) {
          console.warn('Failed to refresh products after add:', error);
        }
      }, 1000);
      
      return productId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    try {
      setError(null);
      await SupabaseProductService.updateProduct(id, updates);
      
      // Manually refresh products if real-time doesn't work
      setTimeout(async () => {
        try {
          const updatedProducts = await SupabaseProductService.getAllProducts();
          setProducts(updatedProducts);
        } catch (error) {
          console.warn('Failed to refresh products after update:', error);
        }
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setError(null);
      await SupabaseProductService.deleteProduct(id);
      
      // Manually refresh products if real-time doesn't work
      setTimeout(async () => {
        try {
          const updatedProducts = await SupabaseProductService.getAllProducts();
          setProducts(updatedProducts);
        } catch (error) {
          console.warn('Failed to refresh products after delete:', error);
        }
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getFeaturedProducts = (): Product[] => {
    // Return products marked as featured, fallback to first 6 if none are marked
    const featuredProducts = products.filter(product => product.featured);
    if (featuredProducts.length > 0) {
      return featuredProducts.slice(0, 6);
    }
    // Fallback to first 6 products if no products are marked as featured
    return products.slice(0, 6);
  };

  const refreshProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await SupabaseProductService.getAllProducts();
      setProducts(productsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh products';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: ProductsContextType = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts,
    refreshProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// Re-export the Product type for convenience
export type { Product }; 