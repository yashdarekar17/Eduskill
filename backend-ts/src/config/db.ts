import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URI;

export const connectDB = async (): Promise<void> => {
  try {
    if (!mongoUrl) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUrl, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
