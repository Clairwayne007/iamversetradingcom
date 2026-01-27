import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "investor" | "admin";
  balance: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - replace with backend API calls
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@iamverse.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    balance: 0,
    createdAt: "2022-01-01",
  },
  {
    id: "2",
    email: "investor@iamverse.com",
    password: "investor123",
    name: "John Investor",
    role: "investor",
    balance: 5000,
    createdAt: "2024-01-15",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("iamverse-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // TODO: Replace with backend API call
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("iamverse-user", JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    
    return { success: false, error: "Invalid email or password" };
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // TODO: Replace with backend API call
    const exists = mockUsers.some((u) => u.email === email);
    
    if (exists) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "investor",
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("iamverse-user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("iamverse-user");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("iamverse-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
