import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import profileRoutes from './routes/profileRoutes';
import paymentRoutes from './routes/paymentRoutes';
import courseRoutes from './routes/courseRoutes';
import progressRoutes from './routes/progressRoutes';
import quizRoutes from './routes/quizRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import certificateRoutes from './routes/certificate';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ===== Database Connection =====
connectDB();

// ===== CORS Configuration =====
const allowedOrigins = [
  'https://eduskill-w7nx.vercel.app',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===== Middleware =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ===== Routes =====
app.use('/Profile', profileRoutes);
app.use('/', paymentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/certificate', certificateRoutes);

// ===== Health Check =====
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Eduskill Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// ===== 404 Handler =====
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ===== Error Handler =====
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ===== Server Start =====
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║   Eduskill Backend Server Running    ║
║   Port: ${PORT.toString().padEnd(27)} ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(18)} ║
╚══════════════════════════════════════╝
  `);
});
