/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_SUPABASE_URL: string;
    REACT_APP_SUPABASE_ANON_KEY: string;
    REACT_APP_ADMIN_EMAIL: string;
    REACT_APP_ADMIN_PASSWORD: string;
    REACT_APP_ADMIN_USERNAME: string;
    REACT_APP_MAX_FILE_SIZE: string;
    REACT_APP_SUPPORTED_IMAGE_FORMATS: string;
    REACT_APP_IMAGE_QUALITY: string;
    REACT_APP_MAX_IMAGE_DIMENSION: string;
  }
}
