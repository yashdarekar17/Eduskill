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
};
