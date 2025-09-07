import { supabase } from '../config/supabase';
import { EnvConfig } from '../config/env';

export interface UploadProgress {
  progress: number;
  isComplete: boolean;
  downloadURL?: string;
  error?: string;
}

export class SupabaseStorageService {
  private static readonly BUCKET_NAME = 'products';
  private static readonly MAX_FILE_SIZE = EnvConfig.MAX_FILE_SIZE;

  // Initialize storage bucket (call this once during setup)
  static async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true, // Make images publicly accessible
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: this.MAX_FILE_SIZE
        });

        if (error) {
          console.error('Error creating bucket:', error);
          throw new Error(`Failed to create storage bucket: ${error.message}`);
        }

        console.log(`Storage bucket '${this.BUCKET_NAME}' created successfully`);
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
      throw error;
    }
  }

  // Generate unique filename
  private static generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    return `${timestamp}_${randomString}.${extension}`;
  }

  // Upload single image
  static async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Validate file
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Compress image if needed
      const processedFile = await this.compressImage(file);
      const fileName = this.generateFileName(processedFile);
      const filePath = fileName;

      // Start upload
      if (onProgress) {
        onProgress({ progress: 0, isComplete: false });
      }

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        if (onProgress) {
          onProgress({ progress: 0, isComplete: true, error: 'Upload failed' });
        }
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      if (onProgress) {
        onProgress({
          progress: 100,
          isComplete: true,
          downloadURL: publicUrl
        });
      }

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      if (onProgress) {
        onProgress({
          progress: 0,
          isComplete: true,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
      throw error;
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: File[],
    onProgress?: (index: number, progress: UploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      })
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload one or more images');
    }
  }

  // Delete image by URL
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/products\/(.+)$/);
      
      if (!pathMatch) {
        throw new Error('Invalid image URL format');
      }
      
      const filePath = decodeURIComponent(pathMatch[1]);

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }

      console.log('Image deleted successfully:', filePath);
    } catch (error) {
      console.error('Error in deleteImage:', error);
      throw error;
    }
  }

  // Delete multiple images
  static async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    
    try {
      await Promise.all(deletePromises);
      console.log('All images deleted successfully');
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      throw new Error('Failed to delete one or more images');
    }
  }

  // Validate image file
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'File must be an image' };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'Image size must be less than 10MB' };
    }

    // Check supported formats
    const supportedFormats = EnvConfig.SUPPORTED_IMAGE_FORMATS;
    if (!supportedFormats.includes(file.type)) {
      return { isValid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
    }

    return { isValid: true };
  }

  // Compress image before upload
  static compressImage(file: File, quality?: number): Promise<File> {
    const defaultQuality = EnvConfig.IMAGE_QUALITY;
    const imageQuality = quality !== undefined ? quality : defaultQuality;
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (configurable max size)
        const maxSize = EnvConfig.MAX_IMAGE_DIMENSION;
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

                  canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            imageQuality
          );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // List all images in bucket
  static async listImages(
    folder: string = '',
    limit: number = 100
  ): Promise<{ name: string; url: string; size: number; lastModified: string }[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder, {
          limit,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error listing images:', error);
        throw new Error(`Failed to list images: ${error.message}`);
      }

      return data?.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);

        return {
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          lastModified: file.created_at || file.updated_at || ''
        };
      }) || [];
    } catch (error) {
      console.error('Error in listImages:', error);
      throw error;
    }
  }

  // Get storage usage statistics
  static async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    formattedSize: string;
  }> {
    try {
      const images = await this.listImages('', 1000); // Get up to 1000 files
      const totalFiles = images.length;
      const totalSize = images.reduce((sum, img) => sum + img.size, 0);

      return {
        totalFiles,
        totalSize,
        formattedSize: this.formatFileSize(totalSize)
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw error;
    }
  }

  // Format file size in human readable format
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get optimized image URL with transformations
  static getOptimizedImageUrl(
    originalUrl: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png';
    } = {}
  ): string {
    // Supabase doesn't have built-in image transformations like Cloudinary
    // You would need to use a service like Supabase Image Transformations (beta)
    // or integrate with a service like Cloudinary, ImageKit, or similar
    // For now, return the original URL
    return originalUrl;
  }
} 