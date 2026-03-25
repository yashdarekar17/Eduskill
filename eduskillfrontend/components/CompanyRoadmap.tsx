'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Briefcase, Building2, Rocket, Star, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, duration: 0.5, bounce: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// ===== COURSE DEFINITIONS =====
const COURSES = [
  { id: 'webdev', label: 'Web Development' },
  { id: 'appdev', label: 'App Development' },
  { id: 'datascience', label: 'Data Science' },
  { id: 'ml', label: 'Machine Learning' },
];

const COMPANY_TABS = [
  { id: 'startup', label: 'Initial Startups', icon: Rocket },
  { id: 'service', label: 'Service Based', icon: Building2 },
  { id: 'product', label: 'Product Based', icon: Briefcase },
  { id: 'faang', label: 'FAANG Companies', icon: Star },
  { id: 'ai_personalized', label: 'AI Personalized', icon: Sparkles },
];

interface SubTopic {
  name: string;
}

interface Topic {
  name: string;
  subtopics: SubTopic[];
  note?: string;
}

// ===== ROADMAP DATA =====
const roadmapData: Record<string, Record<string, Topic[]>> = {
  // ========== WEB DEVELOPMENT ==========
  webdev: {
    startup: [
      { name: 'HTML', subtopics: [{ name: 'Semantic Elements' }, { name: 'Forms & Inputs' }, { name: 'Tables & Lists' }, { name: 'Media Tags' }, { name: 'Accessibility Basics' }, { name: 'SEO Meta Tags' }] },
      { name: 'CSS', subtopics: [{ name: 'Selectors & Specificity' }, { name: 'Box Model' }, { name: 'Flexbox' }, { name: 'Grid Layout' }, { name: 'Responsive Design' }] },
      { name: 'JavaScript', subtopics: [{ name: 'Variables & Data Types' }, { name: 'Functions & Scope' }, { name: 'DOM Manipulation' }, { name: 'Event Handling' }, { name: 'ES6+ Features' }, { name: 'Async/Await & Promises' }, { name: 'Error Handling' }] },
      { name: 'React', subtopics: [{ name: 'Components & JSX' }, { name: 'State & Props' }, { name: 'Hooks (useState, useEffect)' }, { name: 'Routing Basics' }] },
      { name: 'Git/GitHub', subtopics: [{ name: 'Init, Add, Commit' }, { name: 'Branching & Merging' }, { name: 'Pull Requests' }, { name: 'Resolving Conflicts' }, { name: 'GitHub Actions Intro' }, { name: 'Collaborative Workflows' }] },
      { name: 'Basic SEO Principles', subtopics: [{ name: 'Title & Meta Tags' }, { name: 'Heading Hierarchy' }, { name: 'Image Optimization' }, { name: 'Sitemap & Robots.txt' }, { name: 'Core Web Vitals' }] },
      { name: 'Backend Essentials', subtopics: [{ name: 'Node.js Basics' }, { name: 'Express.js Setup' }, { name: 'REST API Design' }, { name: 'MongoDB/PostgreSQL Basics' }, { name: 'Authentication Basics' }] },
    ],
    service: [
      { name: 'HTML', subtopics: [{ name: 'Semantic Elements' }, { name: 'Forms & Inputs' }, { name: 'Tables & Lists' }, { name: 'Media Tags' }, { name: 'Accessibility Basics' }, { name: 'SEO Meta Tags' }] },
      { name: 'CSS', subtopics: [{ name: 'Selectors & Specificity' }, { name: 'Box Model' }, { name: 'Flexbox' }, { name: 'Grid Layout' }, { name: 'Responsive Design' }, { name: 'CSS Preprocessors (SASS)' }] },
      { name: 'JavaScript', subtopics: [{ name: 'Variables & Data Types' }, { name: 'Functions & Scope' }, { name: 'DOM Manipulation' }, { name: 'Event Handling' }, { name: 'ES6+ Features' }, { name: 'Async/Await & Promises' }, { name: 'Error Handling' }] },
      { name: 'TypeScript', subtopics: [{ name: 'Types & Interfaces' }, { name: 'Generics' }, { name: 'Type Guards' }, { name: 'Module System' }, { name: 'tsconfig Setup' }] },
      { name: 'React', subtopics: [{ name: 'Components & JSX' }, { name: 'State & Props' }, { name: 'Hooks (useState, useEffect)' }, { name: 'Context API' }, { name: 'React Router' }] },
      { name: 'REST APIs', subtopics: [{ name: 'HTTP Methods' }, { name: 'Status Codes' }, { name: 'Request/Response Cycle' }, { name: 'Authentication Headers' }] },
      { name: 'SQL & Databases', subtopics: [{ name: 'SELECT/INSERT/UPDATE/DELETE' }, { name: 'JOINs' }, { name: 'Indexes' }, { name: 'Normalization' }, { name: 'ORM Basics (Sequelize/Prisma)' }] },
      { name: 'Testing', subtopics: [{ name: 'Unit Testing (Jest)' }, { name: 'Integration Tests' }, { name: 'E2E Testing Basics' }, { name: 'Test Coverage' }] },
      { name: 'Agile & Scrum', subtopics: [{ name: 'Sprint Planning' }, { name: 'Daily Standups' }, { name: 'Retrospectives' }] },
    ],
    product: [
      { name: 'HTML & CSS Mastery', subtopics: [{ name: 'Advanced Layouts' }, { name: 'CSS Animations & Transitions' }, { name: 'BEM Methodology' }, { name: 'Responsive + Adaptive Design' }, { name: 'Accessibility (WCAG)' }] },
      { name: 'JavaScript Advanced', subtopics: [{ name: 'Closures & Prototypes' }, { name: 'Event Loop & Concurrency' }, { name: 'Design Patterns' }, { name: 'Memory Management' }, { name: 'Web Workers' }, { name: 'Service Workers' }] },
      { name: 'TypeScript', subtopics: [{ name: 'Types & Interfaces' }, { name: 'Generics' }, { name: 'Utility Types' }, { name: 'Decorators' }, { name: 'Advanced Patterns' }] },
      { name: 'React Advanced', subtopics: [{ name: 'Performance Optimization' }, { name: 'Custom Hooks' }, { name: 'State Management (Redux/Zustand)' }, { name: 'Server Components' }, { name: 'Suspense & Error Boundaries' }, { name: 'Testing React Components' }] },
      { name: 'System Design Basics', subtopics: [{ name: 'Client-Server Architecture' }, { name: 'Load Balancing' }, { name: 'Caching Strategies' }, { name: 'CDN & Edge' }, { name: 'Database Scaling' }, { name: 'Microservices Intro' }] },
      { name: 'Performance Optimization', subtopics: [{ name: 'Lighthouse Audits' }, { name: 'Code Splitting' }, { name: 'Lazy Loading' }, { name: 'Image Optimization' }, { name: 'Bundle Analysis' }] },
      { name: 'CI/CD & DevOps', subtopics: [{ name: 'GitHub Actions' }, { name: 'Docker Basics' }, { name: 'Deployment Pipelines' }, { name: 'Monitoring & Logging' }] },
      { name: 'Security', subtopics: [{ name: 'XSS Prevention' }, { name: 'CSRF Protection' }, { name: 'CORS' }, { name: 'Content Security Policy' }] },
      { name: 'DSA Fundamentals', subtopics: [{ name: 'Arrays & Strings' }, { name: 'Linked Lists' }, { name: 'Stacks & Queues' }, { name: 'Trees & Graphs' }, { name: 'Hash Maps' }, { name: 'Sorting Algorithms' }, { name: 'Searching Algorithms' }, { name: 'Time/Space Complexity' }] },
    ],
    faang: [
      { name: 'Advanced DSA', subtopics: [{ name: 'Dynamic Programming' }, { name: 'Greedy Algorithms' }, { name: 'Graph Algorithms (BFS/DFS)' }, { name: 'Backtracking' }, { name: 'Sliding Window' }, { name: 'Two Pointers' }, { name: 'Trie & Segment Trees' }, { name: 'Topological Sort' }, { name: 'Bit Manipulation' }, { name: 'Competitive Problem Solving' }] },
      { name: 'System Design', subtopics: [{ name: 'URL Shortener Design' }, { name: 'Chat System Design' }, { name: 'News Feed Design' }, { name: 'Rate Limiter' }, { name: 'Distributed Cache' }, { name: 'Database Sharding' }] },
      { name: 'Low-Level Design', subtopics: [{ name: 'SOLID Principles' }, { name: 'Design Patterns (Factory, Observer, etc.)' }, { name: 'Class Diagrams' }, { name: 'Code Modularity' }, { name: 'API Design Best Practices' }] },
      { name: 'High-Level Design', subtopics: [{ name: 'Scalable Architecture' }, { name: 'Event-Driven Systems' }, { name: 'Message Queues (Kafka, RabbitMQ)' }, { name: 'Microservices Patterns' }, { name: 'CAP Theorem & Trade-offs' }] },
      { name: 'Frontend Architecture', subtopics: [{ name: 'Micro-Frontend Architecture' }, { name: 'Module Federation' }, { name: 'Build System Optimization' }, { name: 'State Machine (XState)' }, { name: 'Rendering Strategies (SSR, ISR, SSG)' }] },
      { name: 'Behavioral & Communication', subtopics: [{ name: 'STAR Method' }, { name: 'Leadership Principles' }, { name: 'Conflict Resolution' }, { name: 'Project Impact Storytelling' }] },
    ],
  },
  // ========== APP DEVELOPMENT ==========
  appdev: {
    startup: [
      { name: 'React Native Basics', subtopics: [{ name: 'Components (View, Text, Image)' }, { name: 'StyleSheet & Flexbox' }, { name: 'Expo Setup' }, { name: 'Hot Reloading' }, { name: 'Platform-Specific Code' }] },
      { name: 'Navigation', subtopics: [{ name: 'Stack Navigator' }, { name: 'Tab Navigator' }, { name: 'Drawer Navigator' }, { name: 'Passing Params' }] },
      { name: 'State & Data', subtopics: [{ name: 'useState & useEffect' }, { name: 'AsyncStorage' }, { name: 'Fetching APIs' }, { name: 'Form Handling' }] },
      { name: 'UI/UX Basics', subtopics: [{ name: 'Custom Components' }, { name: 'Icons & Fonts' }, { name: 'Animations (Animated API)' }, { name: 'Responsive Layouts' }, { name: 'Dark Mode' }] },
      { name: 'Publishing', subtopics: [{ name: 'EAS Build' }, { name: 'App Icons & Splash Screen' }, { name: 'Play Store Upload' }, { name: 'App Store Upload' }] },
    ],
    service: [
      { name: 'React Native Core', subtopics: [{ name: 'Components & Lifecycle' }, { name: 'StyleSheet & Flexbox' }, { name: 'Platform APIs' }, { name: 'Native Modules Basics' }, { name: 'Debugging Tools' }] },
      { name: 'Navigation Advanced', subtopics: [{ name: 'Deep Linking' }, { name: 'Auth Flow Patterns' }, { name: 'Nested Navigators' }, { name: 'Custom Transitions' }] },
      { name: 'State Management', subtopics: [{ name: 'Context API' }, { name: 'Redux Toolkit' }, { name: 'React Query' }, { name: 'Zustand' }] },
      { name: 'API Integration', subtopics: [{ name: 'REST APIs with Axios' }, { name: 'Error Handling' }, { name: 'Token Management' }, { name: 'Offline Support' }] },
      { name: 'Native Features', subtopics: [{ name: 'Camera & Image Picker' }, { name: 'Location Services' }, { name: 'Push Notifications' }, { name: 'Biometric Auth' }] },
      { name: 'Testing', subtopics: [{ name: 'Jest for RN' }, { name: 'Component Testing' }, { name: 'E2E with Detox' }] },
    ],
    product: [
      { name: 'Architecture Patterns', subtopics: [{ name: 'MVVM Pattern' }, { name: 'Clean Architecture' }, { name: 'Modular App Structure' }, { name: 'Feature-Based Organization' }, { name: 'Dependency Injection' }] },
      { name: 'Performance', subtopics: [{ name: 'FlatList Optimization' }, { name: 'Memoization (memo, useMemo)' }, { name: 'Image Caching' }, { name: 'Bundle Size Reduction' }, { name: 'Hermes Engine' }] },
      { name: 'Advanced UI', subtopics: [{ name: 'Reanimated Library' }, { name: 'Gesture Handler' }, { name: 'Custom Animations' }, { name: 'Shared Element Transitions' }, { name: 'Skia Graphics' }] },
      { name: 'CI/CD for Mobile', subtopics: [{ name: 'Fastlane Setup' }, { name: 'EAS Build Pipelines' }, { name: 'OTA Updates' }, { name: 'Beta Distribution' }] },
      { name: 'Security', subtopics: [{ name: 'Secure Storage' }, { name: 'Certificate Pinning' }, { name: 'Code Obfuscation' }, { name: 'API Key Protection' }] },
      { name: 'DSA for Interviews', subtopics: [{ name: 'Arrays & Strings' }, { name: 'Linked Lists' }, { name: 'Trees & Graphs' }, { name: 'Dynamic Programming Basics' }, { name: 'Time Complexity' }] },
    ],
    faang: [
      { name: 'Advanced DSA', subtopics: [{ name: 'Dynamic Programming' }, { name: 'Graph Algorithms' }, { name: 'Backtracking' }, { name: 'Sliding Window' }, { name: 'Trie & Advanced Trees' }, { name: 'Topological Sort' }, { name: 'Competitive Solving' }, { name: 'System Design Questions' }] },
      { name: 'System Design (Mobile)', subtopics: [{ name: 'Offline-First Architecture' }, { name: 'Real-Time Sync' }, { name: 'Push Architecture' }, { name: 'Media Streaming' }, { name: 'Chat System Mobile' }] },
      { name: 'Native Deep Dive', subtopics: [{ name: 'Bridge Architecture' }, { name: 'JSI & TurboModules' }, { name: 'Fabric Renderer' }, { name: 'Native Module Development' }] },
      { name: 'Cross-Platform Strategy', subtopics: [{ name: 'RN vs Flutter Decision' }, { name: 'KMP (Kotlin Multiplatform)' }, { name: 'Web + Mobile Code Sharing' }, { name: 'Design System Unification' }] },
      { name: 'Behavioral', subtopics: [{ name: 'STAR Method' }, { name: 'Leadership Principles' }, { name: 'Impact Storytelling' }, { name: 'Conflict Resolution' }] },
    ],
  },
  // ========== DATA SCIENCE ==========
  datascience: {
    startup: [
      { name: 'Python Programming', subtopics: [{ name: 'Variables & Data Types' }, { name: 'Control Flow' }, { name: 'Functions' }, { name: 'File I/O' }, { name: 'List Comprehensions' }] },
      { name: 'NumPy', subtopics: [{ name: 'Arrays & Operations' }, { name: 'Broadcasting' }, { name: 'Linear Algebra' }, { name: 'Random Module' }] },
      { name: 'Pandas', subtopics: [{ name: 'DataFrames & Series' }, { name: 'Reading CSV/Excel' }, { name: 'Filtering & Grouping' }, { name: 'Merge & Join' }, { name: 'Missing Data' }] },
      { name: 'Data Visualization', subtopics: [{ name: 'Matplotlib Basics' }, { name: 'Seaborn Plots' }, { name: 'Bar/Line/Scatter Charts' }, { name: 'Heatmaps' }] },
      { name: 'SQL Basics', subtopics: [{ name: 'SELECT & WHERE' }, { name: 'JOINs' }, { name: 'GROUP BY' }, { name: 'Subqueries' }, { name: 'Window Functions' }] },
      { name: 'Excel & Google Sheets', subtopics: [{ name: 'VLOOKUP/XLOOKUP' }, { name: 'Pivot Tables' }, { name: 'Charts & Dashboards' }] },
    ],
    service: [
      { name: 'Python Advanced', subtopics: [{ name: 'OOP in Python' }, { name: 'Decorators & Generators' }, { name: 'Error Handling' }, { name: 'Virtual Environments' }, { name: 'Package Management' }] },
      { name: 'Statistics', subtopics: [{ name: 'Descriptive Stats' }, { name: 'Probability Distributions' }, { name: 'Hypothesis Testing' }, { name: 'Confidence Intervals' }, { name: 'A/B Testing' }] },
      { name: 'Data Cleaning', subtopics: [{ name: 'Handling Missing Values' }, { name: 'Outlier Detection' }, { name: 'Data Type Conversion' }, { name: 'String Cleaning (Regex)' }] },
      { name: 'EDA Techniques', subtopics: [{ name: 'Univariate Analysis' }, { name: 'Bivariate Analysis' }, { name: 'Correlation Analysis' }, { name: 'Feature Distributions' }, { name: 'Automated EDA Tools' }] },
      { name: 'ML Basics', subtopics: [{ name: 'Linear Regression' }, { name: 'Logistic Regression' }, { name: 'Decision Trees' }, { name: 'Model Evaluation Metrics' }] },
      { name: 'BI Tools', subtopics: [{ name: 'Power BI Basics' }, { name: 'Tableau Basics' }, { name: 'Dashboard Design' }] },
    ],
    product: [
      { name: 'Advanced ML', subtopics: [{ name: 'Random Forest & Boosting' }, { name: 'SVM' }, { name: 'Clustering (K-Means, DBSCAN)' }, { name: 'Dimensionality Reduction (PCA)' }, { name: 'Feature Engineering' }, { name: 'Cross-Validation' }] },
      { name: 'Deep Learning Basics', subtopics: [{ name: 'Neural Network Architecture' }, { name: 'Activation Functions' }, { name: 'Backpropagation' }, { name: 'TensorFlow/Keras Intro' }, { name: 'CNNs for Images' }] },
      { name: 'NLP Foundations', subtopics: [{ name: 'Text Preprocessing' }, { name: 'TF-IDF' }, { name: 'Word Embeddings' }, { name: 'Sentiment Analysis' }] },
      { name: 'Big Data Tools', subtopics: [{ name: 'PySpark' }, { name: 'Hadoop Concepts' }, { name: 'Data Warehousing' }, { name: 'ETL Pipelines' }] },
      { name: 'DSA for Interviews', subtopics: [{ name: 'Arrays & Strings' }, { name: 'Hash Maps' }, { name: 'Sorting & Searching' }, { name: 'Trees' }, { name: 'Dynamic Programming Basics' }] },
    ],
    faang: [
      { name: 'Advanced DSA', subtopics: [{ name: 'Dynamic Programming' }, { name: 'Graph Algorithms' }, { name: 'Greedy Algorithms' }, { name: 'Backtracking' }, { name: 'Advanced Trees' }, { name: 'Competitive Problem Solving' }] },
      { name: 'ML System Design', subtopics: [{ name: 'Recommendation Systems' }, { name: 'Search Ranking' }, { name: 'Fraud Detection Pipeline' }, { name: 'A/B Testing at Scale' }, { name: 'Feature Store Design' }] },
      { name: 'Advanced Deep Learning', subtopics: [{ name: 'Transformers & Attention' }, { name: 'GANs' }, { name: 'Reinforcement Learning' }, { name: 'Transfer Learning' }, { name: 'Model Optimization' }] },
      { name: 'MLOps', subtopics: [{ name: 'Model Versioning (MLflow)' }, { name: 'Model Monitoring' }, { name: 'CI/CD for ML' }, { name: 'Containerized Deployment' }, { name: 'Cloud ML Services (AWS/GCP)' }] },
      { name: 'Behavioral', subtopics: [{ name: 'STAR Method' }, { name: 'Impact Quantification' }, { name: 'Cross-Team Collaboration' }, { name: 'Technical Communication' }] },
    ],
  },
  // ========== MACHINE LEARNING ==========
  ml: {
    startup: [
      { name: 'Python for ML', subtopics: [{ name: 'NumPy & Pandas' }, { name: 'Matplotlib & Seaborn' }, { name: 'Scikit-learn Basics' }, { name: 'Jupyter Environment' }] },
      { name: 'Math Foundations', subtopics: [{ name: 'Linear Algebra' }, { name: 'Calculus (Gradients)' }, { name: 'Probability & Statistics' }, { name: 'Optimization Basics' }] },
      { name: 'Supervised Learning', subtopics: [{ name: 'Linear Regression' }, { name: 'Logistic Regression' }, { name: 'Decision Trees' }, { name: 'KNN' }, { name: 'Model Evaluation' }] },
      { name: 'Unsupervised Learning', subtopics: [{ name: 'K-Means Clustering' }, { name: 'Hierarchical Clustering' }, { name: 'PCA' }, { name: 'Anomaly Detection' }] },
      { name: 'Projects', subtopics: [{ name: 'House Price Prediction' }, { name: 'Customer Segmentation' }, { name: 'Spam Classifier' }] },
    ],
    service: [
      { name: 'Advanced Supervised', subtopics: [{ name: 'Random Forest' }, { name: 'Gradient Boosting (XGBoost)' }, { name: 'SVM' }, { name: 'Naive Bayes' }, { name: 'Ensemble Methods' }] },
      { name: 'Feature Engineering', subtopics: [{ name: 'Feature Scaling' }, { name: 'Encoding Categorical Data' }, { name: 'Feature Selection' }, { name: 'Handling Imbalanced Data' }] },
      { name: 'Model Optimization', subtopics: [{ name: 'Hyperparameter Tuning' }, { name: 'Grid/Random Search' }, { name: 'Cross-Validation' }, { name: 'Pipeline Construction' }] },
      { name: 'Deep Learning Intro', subtopics: [{ name: 'Neural Network Architecture' }, { name: 'Activation Functions' }, { name: 'Loss Functions' }, { name: 'Optimizers (SGD, Adam)' }, { name: 'TensorFlow/Keras' }] },
      { name: 'NLP Basics', subtopics: [{ name: 'Text Preprocessing' }, { name: 'Bag of Words / TF-IDF' }, { name: 'Word Embeddings (Word2Vec)' }, { name: 'Sentiment Analysis' }] },
      { name: 'Deployment', subtopics: [{ name: 'Flask/FastAPI for ML' }, { name: 'Model Serialization (Pickle)' }, { name: 'Docker Basics' }] },
    ],
    product: [
      { name: 'Advanced Deep Learning', subtopics: [{ name: 'CNNs for Computer Vision' }, { name: 'RNNs & LSTMs' }, { name: 'Transfer Learning' }, { name: 'Image Classification' }, { name: 'Object Detection (YOLO)' }] },
      { name: 'NLP Advanced', subtopics: [{ name: 'Seq2Seq Models' }, { name: 'Attention Mechanism' }, { name: 'BERT & Transformers' }, { name: 'Text Generation' }, { name: 'Named Entity Recognition' }] },
      { name: 'Recommendation Systems', subtopics: [{ name: 'Collaborative Filtering' }, { name: 'Content-Based Filtering' }, { name: 'Matrix Factorization' }, { name: 'Hybrid Approaches' }] },
      { name: 'MLOps Basics', subtopics: [{ name: 'Experiment Tracking (MLflow)' }, { name: 'Model Registry' }, { name: 'Automated Pipelines' }, { name: 'A/B Testing Models' }] },
      { name: 'DSA for Interviews', subtopics: [{ name: 'Arrays & Hash Maps' }, { name: 'Trees & Graphs' }, { name: 'Dynamic Programming' }, { name: 'Sorting Algorithms' }, { name: 'Time Complexity' }] },
    ],
    faang: [
      { name: 'Advanced DSA', subtopics: [{ name: 'Dynamic Programming Mastery' }, { name: 'Graph Algorithms (Dijkstra, A*)' }, { name: 'Advanced Trees (Red-Black, AVL)' }, { name: 'Trie & Suffix Trees' }, { name: 'Bit Manipulation' }, { name: 'Competitive Problem Solving' }] },
      { name: 'ML System Design', subtopics: [{ name: 'Recommendation Engine at Scale' }, { name: 'Search Ranking System' }, { name: 'Ads Click Prediction' }, { name: 'Real-Time Fraud Detection' }, { name: 'Self-Driving Perception Pipeline' }] },
      { name: 'Research-Level ML', subtopics: [{ name: 'GANs & VAEs' }, { name: 'Reinforcement Learning' }, { name: 'Graph Neural Networks' }, { name: 'Self-Supervised Learning' }, { name: 'Diffusion Models' }] },
      { name: 'Production ML', subtopics: [{ name: 'Model Serving (TFServing, TorchServe)' }, { name: 'Feature Store Design' }, { name: 'Model Monitoring & Drift' }, { name: 'Distributed Training (Horovod)' }, { name: 'Cloud ML (SageMaker, Vertex AI)' }] },
      { name: 'Behavioral', subtopics: [{ name: 'STAR Method' }, { name: 'Research Impact Communication' }, { name: 'Cross-Functional Leadership' }, { name: 'Technical Mentorship' }] },
    ],
  },
};

const COURSE_ID_MAP: Record<number, string> = {
  5: 'webdev',
  6: 'appdev',
  7: 'datascience',
  8: 'ml',
};

interface CompanyRoadmapProps {
  courseId?: number;
}

// ===== STUCK MODAL =====
interface StuckModalProps {
  topicName: string;
  subtopicName: string;
  onClose: () => void;
  onGenerate: (reason: string) => void;
  isGenerating: boolean;
}

function StuckModal({ topicName, subtopicName, onClose, onGenerate, isGenerating }: StuckModalProps) {
  const [reason, setReason] = useState('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6643] to-orange-400 rounded-xl flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">I&apos;m Stuck 🤔</h3>
            <p className="text-xs text-gray-500">AI will build a personalized roadmap for you</p>
          </div>
        </div>

        {/* Stuck at */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500 mb-0.5">Stuck at</p>
          <p className="font-bold text-gray-800 text-sm">{topicName} <span className="text-[#FF6643]">›</span> {subtopicName}</p>
        </div>

        {/* Reason */}
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What exactly are you confused about?
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. I understand what closures are but I don't understand why we need them or when to use them in real code..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6643]/30 focus:border-[#FF6643] transition-all resize-none"
        />

        {/* Generate button */}
        <button
          onClick={() => onGenerate(reason)}
          disabled={isGenerating || reason.trim().length < 10}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#FF6643] to-orange-400 text-white font-bold rounded-xl hover:from-[#e65c00] hover:to-[#FF6643] transition-all shadow-lg shadow-[#FF6643]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Loader2 size={18} className="animate-spin" /> Generating your roadmap...</>
          ) : (
            <><Sparkles size={18} /> Generate My Roadmap</>
          )}
        </button>
        {reason.trim().length < 10 && reason.length > 0 && (
          <p className="text-xs text-orange-500 mt-2 text-center">Please describe your confusion in a bit more detail</p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ===== MAIN COMPONENT =====
export default function CompanyRoadmap({ courseId }: CompanyRoadmapProps) {
  const router = useRouter();
  const fixedCourse = courseId ? COURSE_ID_MAP[courseId] : undefined;
  const [activeCourse, setActiveCourse] = useState(fixedCourse || 'webdev');
  const [activeTab, setActiveTab] = useState('startup');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [togglingKeys, setTogglingKeys] = useState<Set<string>>(new Set());

  // AI Roadmap state
  const [aiTopics, setAiTopics] = useState<Topic[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [aiExists, setAiExists] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  // Stuck modal state
  const [stuckModal, setStuckModal] = useState<{ topicName: string; subtopicName: string } | null>(null);
  // Track which subtopic row is hovered
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Fetch regular progress
  const fetchProgress = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || activeTab === 'ai_personalized') return;
    try {
      const res = await api.getRoadmapProgress(activeCourse, activeTab, token);
      if (res.success) setCompletedSet(new Set(res.completedKeys));
    } catch { /* not logged in */ }
  }, [activeCourse, activeTab]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  // Fetch AI roadmap on mount or course change
  const fetchAiRoadmap = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoadingAi(true);
    try {
      const res = await api.getAiRoadmap(activeCourse, token);
      if (res.success && res.exists) {
        setAiTopics(res.topics);
        setAiMessage(res.aiMessage);
        setAiExists(true);
      } else {
        setAiExists(false);
        setAiTopics([]);
        setAiMessage('');
      }
    } catch { /* not logged in or no roadmap yet */ }
    finally { setLoadingAi(false); }
  }, [activeCourse]);

  useEffect(() => { fetchAiRoadmap(); }, [fetchAiRoadmap]);

  // Fetch AI progress when on personalized tab
  const fetchAiProgress = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || activeTab !== 'ai_personalized') return;
    try {
      const res = await api.getRoadmapProgress(activeCourse, 'ai_personalized', token);
      if (res.success) setCompletedSet(new Set(res.completedKeys));
    } catch { /* ok */ }
  }, [activeCourse, activeTab]);

  useEffect(() => { fetchAiProgress(); }, [fetchAiProgress]);

  const toggleTopic = (topicName: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicName)) { next.delete(topicName); } else { next.add(topicName); }
      return next;
    });
  };

  const handleSubtopicClick = async (topicName: string, subtopicName: string) => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const key = `${topicName}::${subtopicName}`;
    if (togglingKeys.has(key)) return;
    setTogglingKeys(prev => new Set(prev).add(key));

    setCompletedSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });

    try {
      await api.toggleRoadmapSubtopic({
        course_key: activeCourse,
        company_type: activeTab === 'ai_personalized' ? 'ai_personalized' : activeTab,
        topic_name: topicName,
        subtopic_name: subtopicName,
      }, token);
    } catch (error: any) {
      alert(`Failed to save progress: ${error.message || 'Server error'}`);
      setCompletedSet(prev => {
        const next = new Set(prev);
        if (next.has(key)) { next.delete(key); } else { next.add(key); }
        return next;
      });
    } finally {
      setTogglingKeys(prev => { const n = new Set(prev); n.delete(key); return n; });
    }
  };

  const getTopicProgress = (topic: Topic) => {
    let done = 0;
    for (const sub of topic.subtopics) {
      if (completedSet.has(`${topic.name}::${sub.name}`)) done++;
    }
    return done;
  };

  const handleStuckClick = (topicName: string, subtopicName: string) => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setStuckModal({ topicName, subtopicName });
    setGenerateError('');
  };

  const handleGenerate = async (reason: string) => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    if (!stuckModal) return;

    setIsGenerating(true);
    setGenerateError('');

    const currentTopics = roadmapData[activeCourse]?.[activeTab] || [];

    try {
      const res = await api.generateAiRoadmap({
        course_key: activeCourse,
        company_type: activeTab,
        stuck_on_topic: stuckModal.topicName,
        stuck_on_subtopic: stuckModal.subtopicName,
        stuck_reason: reason,
        base_topics: currentTopics,
      }, token);

      if (res.success) {
        setAiTopics(res.topics);
        setAiMessage(res.aiMessage);
        setAiExists(true);
        setStuckModal(null);
        setActiveTab('ai_personalized');
        setExpandedTopics(new Set());
      }
    } catch (err: any) {
      setGenerateError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const topics = activeTab === 'ai_personalized' ? aiTopics : (roadmapData[activeCourse]?.[activeTab] || []);

  return (
    <div className="w-full">
      {/* Stuck Modal */}
      <AnimatePresence>
        {stuckModal && (
          <StuckModal
            key="stuck-modal"
            topicName={stuckModal.topicName}
            subtopicName={stuckModal.subtopicName}
            onClose={() => setStuckModal(null)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}
      </AnimatePresence>

      {/* Header — only show if no courseId (standalone mode) */}
      {!fixedCourse && (
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-5xl md:text-6xl font-extrabold">Roadmaps</h2>
          <p className="font-semibold text-gray-600 text-lg">
            Structured learning paths tailored for different company types
          </p>
        </div>
      )}

      {/* Course Selector Pills — only show if no courseId */}
      {!fixedCourse && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {COURSES.map(course => (
            <button
              key={course.id}
              onClick={() => { setActiveCourse(course.id); setExpandedTopics(new Set()); }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                activeCourse === course.id
                  ? 'bg-[#FF6643] text-white shadow-lg shadow-[#FF6643]/30 scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#FF6643]/50 hover:text-[#FF6643]'
              }`}
            >
              {course.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="">
        {/* Company Type Tabs */}
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex min-w-max">
            {COMPANY_TABS.map(tab => {
              const Icon = tab.icon;
              const isAI = tab.id === 'ai_personalized';
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setExpandedTopics(new Set()); }}
                  className={`flex items-center gap-2 px-5 md:px-8 py-4 font-semibold text-sm md:text-base transition-all border-b-3 whitespace-nowrap ${
                    activeTab === tab.id
                      ? isAI
                        ? 'text-purple-600 border-b-[3px] border-purple-500 bg-purple-50/50'
                        : 'text-[#FF6643] border-b-[3px] border-[#FF6643] bg-orange-50/50'
                      : 'text-gray-500 border-b-[3px] border-transparent hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
                >
                  <Icon size={18} className={isAI && activeTab !== 'ai_personalized' ? 'text-purple-400' : ''} />
                  {tab.label}
                  {isAI && aiExists && (
                    <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full">AI</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Personalized Tab Content */}
        {activeTab === 'ai_personalized' && (
          <>
            {loadingAi ? (
              <div className="p-10 text-center">
                <Loader2 size={32} className="animate-spin text-purple-400 mx-auto mb-3" />
                <p className="text-gray-500">Loading your personalized roadmap...</p>
              </div>
            ) : !aiExists ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={30} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-2">No AI Roadmap Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                  Get stuck on any subtopic in the Startup, Service, Product, or FAANG tabs and click the{' '}
                  <span className="font-bold text-[#FF6643]">I&apos;m Stuck 🤔</span> button to generate your personalized roadmap.
                </p>
              </div>
            ) : (
              <div className="p-4 md:p-6">
                {/* AI Message Banner */}
                {aiMessage && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl flex items-start gap-3">
                    <Sparkles size={18} className="text-purple-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-purple-800 font-medium leading-relaxed">{aiMessage}</p>
                  </div>
                )}
                {/* Regenerate hint */}
                <p className="text-xs text-gray-400 mb-4 text-right">
                  Click &quot;I&apos;m Stuck&quot; on any subtopic in other tabs to regenerate
                </p>
                {/* AI Topics */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                  {aiTopics.map((topic, idx) => {
                    const isExpanded = expandedTopics.has(topic.name);
                    const count = topic.subtopics.length;
                    const done = getTopicProgress(topic);
                    const pct = count > 0 ? Math.round((done / count) * 100) : 0;
                    return (
                      <motion.div variants={itemVariants} key={idx} className="rounded-2xl border border-purple-100 overflow-hidden transition-all hover:border-purple-200">
                        <button
                          onClick={() => toggleTopic(topic.name)}
                          className="w-full flex items-center justify-between px-5 md:px-6 py-4 bg-gradient-to-r from-purple-50/50 to-white hover:from-purple-50 hover:to-white transition-all"
                        >
                          <div className="text-left">
                            <span className="font-bold text-gray-800 text-base md:text-lg">{topic.name}</span>
                            {topic.note && <p className="text-xs text-purple-600 mt-0.5">{topic.note}</p>}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${done === count && count > 0 ? 'text-green-500' : 'text-gray-400'}`}>{done}/{count}</span>
                              <div className="w-24 md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${done === count && count > 0 ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <ChevronDown size={20} className="text-gray-400" />
                            </div>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-5 md:px-6 pb-4 bg-white border-t border-gray-50">
                            <div className="grid gap-2 pt-3">
                              {topic.subtopics.map((sub, sIdx) => {
                                const subKey = `${topic.name}::${sub.name}`;
                                const isCompleted = completedSet.has(subKey);
                                const isToggling = togglingKeys.has(subKey);
                                return (
                                  <button
                                    key={sIdx}
                                    onClick={() => handleSubtopicClick(topic.name, sub.name)}
                                    disabled={isToggling}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left ${isCompleted ? 'bg-green-50 hover:bg-green-100/70' : 'bg-gray-50 hover:bg-purple-50/50'} ${isToggling ? 'opacity-60' : ''}`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-purple-400'}`}>
                                      {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-sm md:text-base font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>{sub.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Regular Topics List (Startup / Service / Product / FAANG) */}
        {activeTab !== 'ai_personalized' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:p-6 space-y-3">
            {topics.map((topic, idx) => {
              const isExpanded = expandedTopics.has(topic.name);
              const count = topic.subtopics.length;
              const done = getTopicProgress(topic);
              const pct = count > 0 ? Math.round((done / count) * 100) : 0;

              return (
                <motion.div
                  variants={itemVariants}
                  key={`${activeTab}-${topic.name}`}
                  className="rounded-2xl border border-gray-100 overflow-hidden transition-all hover:border-orange-200"
                >
                  {/* Topic Header Row */}
                  <button
                    onClick={() => toggleTopic(topic.name)}
                    className="w-full flex items-center justify-between px-5 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-orange-50/30 hover:to-white transition-all"
                  >
                    <span className="font-bold text-gray-800 text-base md:text-lg text-left">{topic.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${done === count && count > 0 ? 'text-green-500' : 'text-gray-400'}`}>{done}/{count}</span>
                        <div className="w-24 md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${done === count && count > 0 ? 'bg-green-500' : 'bg-[#FF6643]'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </button>

                  {/* Subtopics (Expandable) */}
                  {isExpanded && (
                    <div className="px-5 md:px-6 pb-4 bg-white border-t border-gray-50">
                      <div className="grid gap-2 pt-3">
                        {topic.subtopics.map((sub, sIdx) => {
                          const subKey = `${topic.name}::${sub.name}`;
                          const isCompleted = completedSet.has(subKey);
                          const isToggling = togglingKeys.has(subKey);
                          const isHovered = hoveredKey === subKey;

                          return (
                            <div
                              key={sIdx}
                              className="relative"
                              onMouseEnter={() => setHoveredKey(subKey)}
                              onMouseLeave={() => setHoveredKey(null)}
                            >
                              <button
                                onClick={() => handleSubtopicClick(topic.name, sub.name)}
                                disabled={isToggling}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left ${
                                  isCompleted ? 'bg-green-50 hover:bg-green-100/70' : 'bg-gray-50 hover:bg-orange-50/50'
                                } ${isToggling ? 'opacity-60' : ''}`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-[#FF6643]'
                                }`}>
                                  {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                                </div>
                                <span className={`text-sm md:text-base font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                                  {sub.name}
                                </span>

                                {/* I'm Stuck button — appears on hover */}
                                {isHovered && !isToggling && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStuckClick(topic.name, sub.name); }}
                                    className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#FF6643] to-orange-400 text-white text-xs font-bold rounded-full hover:from-[#e65c00] hover:to-[#FF6643] transition-all shadow-sm shadow-[#FF6643]/20 shrink-0"
                                  >
                                    <AlertCircle size={12} />
                                    I&apos;m Stuck
                                  </button>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Error message for generate */}
        {generateError && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {generateError}
          </div>
        )}
      </div>
    </div>
  );
}
