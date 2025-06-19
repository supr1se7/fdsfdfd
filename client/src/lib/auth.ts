import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  name: string;
  planType?: "tickets" | "sales" | "moderation" | null;
  planActive?: boolean;
}

export interface AuthResponse {
  user: User;
  sessionId: string;
}

export const authStorage = {
  setToken: (token: string) => {
    localStorage.setItem("authToken", token);
  },
  getToken: () => {
    return localStorage.getItem("authToken");
  },
  removeToken: () => {
    localStorage.removeItem("authToken");
  },
  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => {
    localStorage.removeItem("user");
  },
  clear: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await response.json();
    authStorage.setToken(data.sessionId);
    authStorage.setUser(data.user);
    return data;
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/register", { email, password, name });
    const data = await response.json();
    authStorage.setToken(data.sessionId);
    authStorage.setUser(data.user);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      authStorage.clear();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiRequest("GET", "/api/auth/me");
    const data = await response.json();
    return data.user;
  }
};
