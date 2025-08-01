import dotenv from 'dotenv';
dotenv.config();

export const config = {
  appSecret: process.env.APP_SECRET,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
  },
  momo: {
    apiUser: process.env.MOMO_API_USER,
    apiKey: process.env.MOMO_API_KEY,
    callbackUrl: process.env.MOMO_CALLBACK_URL
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY
  },
  collection: {
    primaryKey: process.env.COLLECTION_PRIMARY_KEY,
    secondaryKey: process.env.COLLECTION_SECONDARY_KEY
  },
  remittance: {
    primaryKey: process.env.REMITTANCE_PRIMARY_KEY
  }
};