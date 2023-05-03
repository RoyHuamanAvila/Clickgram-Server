import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.DATABASE_CLOUD_NAME,
      api_key: process.env.DATABASE_API_KEY,
      api_secret: process.env.DATABASE_API_SECRET,
    });
  },
};
