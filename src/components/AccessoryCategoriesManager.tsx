import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { SupabaseAccessoryCategoryService } from '../services/supabaseAccessoryCategoryService';
import './ProductForm.css';

interface Props {
  onClose: () => void;
  onCategoriesChange?: () => void;
}

const AccessoryCategoriesManager: React.FC<Props> = ({ onClose, onCategoriesChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const cats = await SupabaseAccessoryCategoryService.getAllCategories();
      setCategories(cats);
      setError(null);
    } catch (err) {
      console.error('Failed to load accessory categories', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await SupabaseAccessoryCategoryService.addCategory(newCategory.trim());
      setNewCategory('');
      await loadCategories();
      onCategoriesChange?.();
      setError(null);
    } catch (err: any) {
      console.error('Failed to add category', err);
      setError(err?.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Delete category "${name}"? This will not change existing products.`)) return;
    setLoading(true);
    try {
      // Need to find id by name; the service currently returns only names, so delete by querying the table directly
      const { data, error } = await (await import('../config/supabase')).supabase
        .from('accessory_categories')
        .select('id')
        .eq('name', name)
        .single();

      if (error) throw error;
      const id = (data as any).id;
      await SupabaseAccessoryCategoryService.deleteCategory(id);
      await loadCategories();
      onCategoriesChange?.();
      setError(null);
    } catch (err: any) {
      console.error('Failed to delete category', err);
      setError(err?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="product-form-modal">
        <div className="form-header">
          <h2>Manage Accessory Categories</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
            />
            <button className="save-btn" onClick={handleAdd} disabled={loading || !newCategory.trim()}>
              <Plus size={14} /> Add
            </button>
            <button className="cancel-btn" onClick={onClose} disabled={loading}>
              Close
            </button>
          </div>

          {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}

          <div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map(cat => (
                  <li key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span>{cat}</span>
                    <button className="remove-btn" onClick={() => handleDelete(cat)} title={`Delete ${cat}`}>
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoryCategoriesManager; 