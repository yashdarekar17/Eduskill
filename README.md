# Eduskill 🚀

Eduskill is a cutting-edge, AI-powered e-learning and career-acceleration platform designed to bridge the gap between academic education and industry requirements. By combining personalized AI learning paths, interactive curriculum checkpoint quizzes with smart weakness analysis, automated PDF certification, and interactive AI mentoring, Eduskill provides a highly customized learning experience.

---

## 🌟 Core Features

### 🤖 1. AI Personalized Roadmaps
* **Engine**: Powered by `meta/llama-3.1-70b-instruct` via the **NVIDIA NIM API**.
* **Personalization**: Takes user questionnaire inputs—such as target dream job, current skill gaps, weekly time commitments, projects, and specific improvement areas—and builds a custom learning syllabus.
* **4-Tier Quest Log**: Generates structured Milestones, Monthly Goals, Weekly Focuses, and Daily Tasks (interactive checkboxes) stored persistently in the database.

### 📝 2. Intelligent Checkpoints & Weakness Detection
* **Diagnostic Quizzes**: Test knowledge at the end of curriculum modules.
* **Smart Performance Review**: Automatically maps quiz answers back to specific subtopics.
* **Dynamic Weakness Reports**: Evaluates user answers and categorizes skills into **Strong** ($>80\%$), **Moderate** ($60\% - 80\%$), or **Weak** ($<60\%$), allowing students to target precisely what to study next.

### 🎓 3. Headless PDF Certificate Generator
* **Automation**: Generates official course certificates on-the-fly upon course completion.
* **Engine**: Launches a headless **Puppeteer** browser instance on the backend, renders an styled HTML template, and compiles it into an A4 print-ready PDF buffer delivered to the user for download.

### 💳 4. Secure Course Payments
* **Integration**: Fully integrated with **Razorpay**.
* **Checkout Flow**: Backend communicates with Razorpay APIs to generate unique order parameters and verifies payment signatures locally using SHA256 HMAC for absolute security.

### 💬 5. AI Mentor Chatbots
* **Helper**: Integration with **Botpress** chatbots customized for specific courses (Web Dev, App Dev, Data Science, Machine Learning) to provide inline, context-aware mentoring 24/7.

### ⚡ 6. High-Performance Caching
* **Engine**: Connected to **Upstash Redis** to cache courses, module contents, user progress, and personalized roadmaps.
* **Reliability**: Uses a non-blocking connection logic; if Redis is down, the system gracefully falls back to direct database queries without crashing the user session.

---

## 📂 Repository Architecture

The Eduskill project is organized as a monorepo containing a modern Next.js client application and a robust TypeScript Node.js backend.

```
Eduskill/
├── .github/
│   └── workflows/
│       └── main.yml           # GitHub Actions CI (Lints & builds frontend/backend)
│
├── backend-ts/                # Express & TypeScript Backend
│   ├── src/
│   │   ├── config/            # DB (PostgreSQL) and Redis setup
│   │   ├── controllers/       # Business logic (Auth, Payments, roadmaps, etc.)
│   │   ├── middleware/        # JWT validator & session security
│   │   ├── models/            # PostgreSQL query models
│   │   ├── routes/            # Express router endpoints
│   │   ├── services/          # External services (NVIDIA NIM AI, Quiz analysis)
│   │   ├── templates/         # HTML Certificate templates
│   │   └── index.ts           # Server initialization
│   ├── tsconfig.json          # TypeScript compilation options
│   └── package.json           # Backend package configuration
│
└── eduskillfrontend/          # Next.js 16 Client App
    ├── app/                   # App Router pages (Home, Login, Progress, Details)
    ├── components/            # Reusable UI components (Quiz section, AI roadmaps, chat)
    ├── lib/                   # API client configuration
    ├── public/                # Static assets (images, logos)
    ├── tsconfig.json          # TypeScript client options
    └── package.json           # Frontend package configuration
```

---

## 🛠️ Technology Stack

### Frontend
* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
* **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Iconography**: [Lucide React](https://lucide.dev/)

### Backend
* **Runtime & Framework**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) with `ts-node` / `typescript`
* **Primary Database**: [PostgreSQL](https://www.postgresql.org/) (via `pg` connection pooling)
* **Caching & Session Storage**: [Upstash Redis](https://upstash.com/)
* **PDF Compilation**: [Puppeteer](https://pptr.dev/) (headless Chrome engine)
* **AI Model Pipeline**: Meta Llama-3.1-70b via [NVIDIA Integrated API](https://build.nvidia.com/)
* **Payment Gateway**: [Razorpay Node SDK](https://razorpay.com/docs/payments/server-integration/nodejs/)

---

## 🗄️ Database Schema & Entities

The platform uses a PostgreSQL schema. Key tables and relationships include:

* **`profiles`**: Holds user records (credentials, name, email, branch, and optional `google_id` for OAuth).
* **`courses`**, **`phases`**, **`modules`**: Hierarchical content tables mapping phases to courses, and educational modules to phases.
* **`user_courses`**: Junction table tracking purchased/unlocked courses per user.
* **`quizzes`** & **`quiz_questions`**: Contains diagnostic test items linked to specific module topics.
* **`quiz_attempts`** & **`question_attempts`**: Stores details of student quiz attempts, answers selected, accuracy, time taken, and calculated weak topics.
* **`personalized_roadmaps`**: Stores the raw JSON outputs and daily logs returned by the NVIDIA NIM AI for individual users.
* **`roadmap_progress`**: Tracks custom subtopics toggled as completed.
* **`certificates`**: Logs generated certificates, mapping them to users, courses, and unique verification IDs.

---

## 🚀 Installation & Local Setup

### Prerequisites
* **Node.js**: v18+ is required.
* **PostgreSQL**: An active local or cloud PostgreSQL instance.
* **Upstash Redis**: An active Redis REST endpoint.
* **NVIDIA API Key**: A developer key from NVIDIA Build.
* **Razorpay Key**: Test/Live credentials from Razorpay dashboard.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/yashdarekar17/Eduskill.git
cd Eduskill
```

---

### Step 2: Configure and Run Backend

1. Navigate to the backend directory:
   ```bash
   cd backend-ts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

4. Populate `.env` with your backend configurations (Database, JWT, Upstash Redis, NVIDIA API Key, and Razorpay keys).

5. Run database migrations:
   ```bash
   npm run build
   # run migrations
   node dist/scripts/migrate.js
   ```

6. Start the development server (runs with hot reload on port `5000`):
   ```bash
   npm run dev
   ```

---

### Step 3: Configure and Run Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd eduskillfrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add the required frontend environment configuration (backend URL and Google Client ID).

4. Start the Next.js development server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Import the repository in your Vercel Dashboard.
2. Select `eduskillfrontend` as the root directory.
3. Configure the environment variables.
4. Vercel automatically detects Next.js settings and deploys.

### Backend (Render / Railway)
1. Connect your repository to Render or Railway.
2. Set the build command to `npm run build` and start command to `npm start`.
3. Provide the required environment variables (PostgreSQL, Upstash Redis, Nvidia NIM API, Razorpay, etc.).
4. Ensure your Puppeteer cache directories are configured correctly if deployment fails (handled automatically via the package postinstall script: `npx puppeteer browsers install chrome`).

---

## 📄 License

This project is licensed under the **ISC License**. See the `backend-ts/package.json` for details.
