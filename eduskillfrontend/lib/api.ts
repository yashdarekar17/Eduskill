const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://eduskill-1.onrender.com";

export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  name: string;
  Branch: string;
  Email: string;
  password: string;
}

export const api = {
  async login(data: LoginFormData) {
    const response = await fetch(`${API_BASE_URL}/Profile/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  async googleAuth(token: string, intent?: string) {
    const response = await fetch(`${API_BASE_URL}/Profile/google-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, intent }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Google authentication failed");
    }

    return response.json();
  },

  async googleSignupComplete(data: any) {
    const response = await fetch(`${API_BASE_URL}/Profile/google-signup-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup completion failed");
    }

    return response.json();
  },

  async signup(data: SignupFormData) {
    const response = await fetch(`${API_BASE_URL}/Profile/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return response.json();
  },

  async createOrder(data: { name: string; amount: number; description?: string }) {
    const response = await fetch(`${API_BASE_URL}/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  },

  // ===== Courses =====
  async getCourses() {
    const response = await fetch(`${API_BASE_URL}/api/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  async getCourse(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/courses/${id}`);
    if (!response.ok) throw new Error("Failed to fetch course");
    return response.json();
  },

  async getModule(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/courses/modules/${id}`);
    if (!response.ok) throw new Error("Failed to fetch module");
    return response.json();
  },

  // ===== Progress (Auth required) =====
  async markModuleComplete(moduleId: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/progress/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ module_id: moduleId }),
    });
    if (!response.ok) throw new Error("Failed to mark module complete");
    return response.json();
  },

  async submitQuiz(data: { module_id: number; score: number; total: number; weak_topics?: string[] }, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/progress/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to submit quiz");
    return response.json();
  },

  async getUserProgress(courseId: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/progress/${courseId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch progress");
    return response.json();
  },

  // ===== Course Purchase =====
  async purchaseCourse(courseId: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/courses/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ course_id: courseId }),
    });
    if (!response.ok) throw new Error("Failed to purchase course");
    return response.json();
  },

  async getPurchasedCourses(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/courses/purchased`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch purchased courses");
    return response.json();
  },

  // ===== Manual Quizzes =====
  async getQuizzesByCourse(courseId: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/course/${courseId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return response.json();
  },

  async getQuizQuestions(quizId: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/questions`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch quiz questions");
    return response.json();
  },

  async submitQuizAttempt(quizId: number, answers: any[], token: string) {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error("Failed to submit quiz attempt");
    return response.json();
  },

  async getModuleWeakness(moduleId: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/weakness/${moduleId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch weakness report");
    return response.json();
  },

  // ===== Roadmap Progress =====
  async toggleRoadmapSubtopic(data: {
    course_key: string;
    company_type: string;
    topic_name: string;
    subtopic_name: string;
  }, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/roadmap/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to toggle roadmap subtopic");
    return response.json();
  },

  async getRoadmapProgress(courseKey: string, companyType: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/roadmap/${courseKey}/${companyType}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch roadmap progress");
    return response.json();
  },

  async getStartedRoadmaps(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/roadmap/started`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch started roadmaps");
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/Profile/profile`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  // ===== AI Personalized Roadmap =====
  async generateAiRoadmap(
    data: {
      course_key: string;
      company_type: string;
      answers: { dream_job?: string; skill_gap?: string; hours_per_week?: string; current_project?: string; improvement_area?: string };
    },
    token: string
  ) {
    const response = await fetch(`${API_BASE_URL}/api/roadmap/personalized/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to generate AI roadmap");
    }
    return response.json();
  },

  async toggleAiTask(
    data: { course_key: string; task_id: string; },
    token: string
  ) {
    const response = await fetch(`${API_BASE_URL}/api/roadmap/personalized/toggle-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to toggle task");
    }
    return response.json();
  },


  async getAiRoadmap(courseKey: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/roadmap/personalized/${courseKey}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch AI roadmap");
    return response.json();
  },
  // ===== Certificate =====
  async generateCertificate(data: { userId: number; courseId: number; name: string; course: string }, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/certificate/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate certificate");
    }

    const contentType = res.headers.get("Content-Type");
    if (contentType !== "application/pdf") {
      const text = await res.text();
      console.error("Expected PDF but got:", text);
      throw new Error("Server did not return a valid PDF");
    }

    return res.blob();
  },
};
