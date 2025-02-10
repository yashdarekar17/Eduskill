const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
      tls: true,  // Ensure TLS is enabled
      tlsAllowInvalidCertificates: true,  // Allow invalid certificates (for testing)
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();
