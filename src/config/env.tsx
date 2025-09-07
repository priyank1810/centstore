
// Safe environment variable getter - throws error if required env var is missing
const getEnv = (key: string): string => {
  // In Create React App, environment variables are injected at build time
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const ENV = {
  SUPABASE_URL: getEnv('REACT_APP_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('REACT_APP_SUPABASE_ANON_KEY'),
  ADMIN_EMAIL: getEnv('REACT_APP_ADMIN_EMAIL'),
  ADMIN_PASSWORD: getEnv('REACT_APP_ADMIN_PASSWORD'),
  ADMIN_USERNAME: getEnv('REACT_APP_ADMIN_USERNAME'),
  MAX_FILE_SIZE: getEnv('REACT_APP_MAX_FILE_SIZE'),
  SUPPORTED_IMAGE_FORMATS: getEnv('REACT_APP_SUPPORTED_IMAGE_FORMATS'),
  IMAGE_QUALITY: getEnv('REACT_APP_IMAGE_QUALITY'),
  MAX_IMAGE_DIMENSION: getEnv('REACT_APP_MAX_IMAGE_DIMENSION'),
};

export class EnvConfig {
  // Supabase Configuration
  static get SUPABASE_URL(): string {
    return ENV.SUPABASE_URL;
  }

  static get SUPABASE_ANON_KEY(): string {
    return ENV.SUPABASE_ANON_KEY;
  }

  // Admin Configuration
  static get ADMIN_EMAIL(): string {
    return ENV.ADMIN_EMAIL;
  }

  static get ADMIN_PASSWORD(): string {
    return ENV.ADMIN_PASSWORD;
  }

  static get ADMIN_USERNAME(): string {
    return ENV.ADMIN_USERNAME;
  }

  // Application Settings
  static get MAX_FILE_SIZE(): number {
    return parseInt(ENV.MAX_FILE_SIZE);
  }

  static get SUPPORTED_IMAGE_FORMATS(): string[] {
    return ENV.SUPPORTED_IMAGE_FORMATS.split(',').map((format: string) => format.trim());
  }

  static get IMAGE_QUALITY(): number {
    const parsed = parseFloat(ENV.IMAGE_QUALITY);
    if (isNaN(parsed) || parsed < 0.1 || parsed > 1.0) {
      throw new Error('Invalid REACT_APP_IMAGE_QUALITY value. Must be between 0.1 and 1.0');
    }
    return parsed;
  }

  static get MAX_IMAGE_DIMENSION(): number {
    const parsed = parseInt(ENV.MAX_IMAGE_DIMENSION);
    if (isNaN(parsed) || parsed < 100) {
      throw new Error('Invalid REACT_APP_MAX_IMAGE_DIMENSION value. Must be a number >= 100');
    }
    return parsed;
  }

  // Utility method to validate all required environment variables at startup
  static validateAll(): void {
    try {
      // Test all getters to ensure they work by accessing their values
      const validationChecks = [
        this.SUPABASE_URL,
        this.SUPABASE_ANON_KEY,
        this.ADMIN_EMAIL,
        this.ADMIN_PASSWORD,
        this.ADMIN_USERNAME,
        this.MAX_FILE_SIZE,
        this.SUPPORTED_IMAGE_FORMATS,
        this.IMAGE_QUALITY,
        this.MAX_IMAGE_DIMENSION,
      ];
      
      // Ensure all values are truthy
      validationChecks.forEach((value, index) => {
        if (!value) {
          throw new Error(`Environment validation failed at index ${index}`);
        }
      });
      
      console.log('✅ All environment variables validated successfully');
    } catch (error) {
      console.error('❌ Environment validation failed:', error);
      throw error;
    }
  }

  // Development helper to log non-sensitive environment info
  static logEnvironmentInfo(): void {
    console.log('🔧 Environment Configuration:');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('- Raw ENV object:', ENV);
    console.log('- Supabase URL:', this.SUPABASE_URL);
    console.log('- Admin Username:', this.ADMIN_USERNAME);
    console.log('- Max File Size:', `${(this.MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`);
    console.log('- Image Quality:', `${(this.IMAGE_QUALITY * 100)}%`);
    console.log('- Max Image Dimension:', `${this.MAX_IMAGE_DIMENSION}px`);
    console.log('- Supported Formats:', this.SUPPORTED_IMAGE_FORMATS.join(', '));
  }

  // Debug helper to check if environment variables are being loaded
  static debugEnvironmentVariables(): void {
    console.log('🐛 Environment Variables Debug:');
    console.log('- REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('- REACT_APP_SUPABASE_ANON_KEY length:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length || 'undefined');
    console.log('- REACT_APP_ADMIN_USERNAME:', process.env.REACT_APP_ADMIN_USERNAME);
    console.log('- Environment variables loaded from .env file');
  }
} 