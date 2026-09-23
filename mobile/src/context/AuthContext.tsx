import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loginAs: (userId: string) => void;
  loginWithEmail: (email: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  registerAreaHead: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    titlePrefix: string;
    areaName: string;
    region: string;
    country: string;
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
  }) => User;
  approveUser: (userId: string, approver: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string | null>('usr_pastor_kaneshie_central');

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const loginAs = (userId: string) => {
    setCurrentUserId(userId);
  };

  const loginWithEmail = (email: string, password?: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) {
      return { success: false, message: 'No account found with this email.' };
    }
    if (password && found.password && found.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }
    setCurrentUserId(found.id);
    return { success: true };
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
    areaName: string;
    region: string;
    country: string;
  }): User => {
    const newUser: User = {
      id: `usr_ah_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password || 'password123',
      titlePrefix: data.titlePrefix || 'Apostle',
      role: 'area_head',
      status: 'pending',
      areaId: `area_${Date.now()}`,
      areaName: data.areaName,
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
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
  }): User => {
    const newUser: User = {
      id: `usr_p_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password || 'password123',
      titlePrefix: data.titlePrefix || 'Pastor',
      role: 'pastor',
      status: 'pending',
      areaId: data.areaId,
      areaName: data.areaName,
      districtId: `dist_${Date.now()}`,
      districtName: data.districtName,
      profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const approveUser = (userId: string, approver: User) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'approved',
            approvedBy: approver.id,
            approvedByName: approver.fullName,
            approvedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        loginAs,
        loginWithEmail,
        logout,
        registerAreaHead,
        registerPastor,
        approveUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
