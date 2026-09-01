import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  loginAs: (userId: string) => void;
  loginWithEmail: (email: string, password?: string) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  registerAreaHead: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    titlePrefix: string;
    areaId?: string;
    areaName: string;
    region: string;
    country: string;
    appointmentYear?: string;
    notes?: string;
  }) => User;
  registerPastor: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    titlePrefix: string;
    areaId: string;
    areaName: string;
    districtName: string;
    appointmentYear?: string;
    notes?: string;
  }) => User;
  approveUser: (userId: string, approverUser: User) => void;
  rejectUser: (userId: string, reason: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'cop_connect_users_v2';
const CURRENT_USER_ID_KEY = 'cop_connect_current_user_id_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const savedId = localStorage.getItem(CURRENT_USER_ID_KEY);
    return savedId || 'usr_super_admin';
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Sync current user ID
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(CURRENT_USER_ID_KEY, currentUserId);
    } else {
      localStorage.removeItem(CURRENT_USER_ID_KEY);
    }
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const loginAs = (userId: string) => {
    setIsLoading(true);
    setCurrentUserId(userId);
    setTimeout(() => setIsLoading(false), 200);
  };

  const loginWithEmail = (email: string, password?: string): { success: boolean; message?: string; user?: User } => {
    const found = users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!found) {
      return { success: false, message: 'No account found with this email. Please check spelling or register below.' };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, message: 'Incorrect password for this account.' };
    }

    setCurrentUserId(found.id);
    return { success: true, user: found };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const registerAreaHead = (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    titlePrefix: string;
    areaId?: string;
    areaName: string;
    region: string;
    country: string;
    appointmentYear?: string;
    notes?: string;
  }): User => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const assignedAreaId = data.areaId || `area_${Date.now()}`;
    const newUser: User = {
      id: `usr_ah_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password || 'password123',
      titlePrefix: data.titlePrefix || 'Apostle',
      role: 'area_head',
      status: 'pending', // Pending National Super Admin verification
      areaId: assignedAreaId,
      areaName: data.areaName,
      appointmentYear: data.appointmentYear,
      notes: data.notes,
      profilePhoto: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const registerPastor = (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    titlePrefix: string;
    areaId: string;
    areaName: string;
    districtName: string;
    appointmentYear?: string;
    notes?: string;
  }): User => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const assignedDistrictId = `dist_${Date.now()}`;
    const newUser: User = {
      id: `usr_p_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password || 'password123',
      titlePrefix: data.titlePrefix || 'Pastor',
      role: 'pastor',
      status: 'pending', // Pending Area Head approval
      areaId: data.areaId,
      areaName: data.areaName,
      districtId: assignedDistrictId,
      districtName: data.districtName,
      appointmentYear: data.appointmentYear,
      notes: data.notes,
      profilePhoto: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const approveUser = (userId: string, approverUser: User) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'approved',
            approvedBy: approverUser.id,
            approvedByName: approverUser.fullName,
            approvedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );
  };

  const rejectUser = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'rejected',
            rejectionReason: reason,
          };
        }
        return u;
      })
    );
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...updates } : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        loginAs,
        loginWithEmail,
        logout,
        registerAreaHead,
        registerPastor,
        approveUser,
        rejectUser,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
