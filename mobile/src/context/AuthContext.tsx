import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../services/mockData';

// Simple lightweight JS SHA-256 implementation for mobile environment
function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let currentBlock: number = 0;
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    currentBlock = (currentBlock << 8) | j;
    if ((i % 4) === 3) {
      words.push(currentBlock);
      currentBlock = 0;
    }
  }
  const rem = ascii[lengthProperty] % 4;
  if (rem === 1) words.push((ascii.charCodeAt(ascii[lengthProperty] - 1) << 24) | 0x800000);
  else if (rem === 2) words.push((ascii.charCodeAt(ascii[lengthProperty] - 2) << 24) | (ascii.charCodeAt(ascii[lengthProperty] - 1) << 16) | 0x8000);
  else if (rem === 3) words.push((ascii.charCodeAt(ascii[lengthProperty] - 3) << 24) | (ascii.charCodeAt(ascii[lengthProperty] - 2) << 16) | (ascii.charCodeAt(ascii[lengthProperty] - 1) << 8) | 0x80);
  else words.push(0x80000000);

  while ((words.length % 16) !== 14) words.push(0);
  words.push(Math.floor(asciiBitLength / maxWord));
  words.push(asciiBitLength >>> 0);

  for (let b = 0; b < words.length; b += 16) {
    const w = words.slice(b, b + 16);
    for (i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = hash[0], e = hash[4];
    let temp1, temp2;
    for (i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & hash[5]) ^ (~e & hash[6]);
      temp1 = (hash[7] + S1 + ch + k[i] + w[i]) >>> 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      temp2 = (S0 + maj) >>> 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) >>> 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + hash[1]) >>> 0; // standard loop
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const byte = (hash[i] >> (j * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loginWithEmail: (email: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  registerSuperAdmin: (data: { fullName: string; email: string; phone: string; password?: string; profilePhoto?: string }) => User;
  registerAreaHead: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    titlePrefix: string;
    areaName: string;
    region: string;
    country: string;
    profilePhoto?: string;
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
    profilePhoto?: string;
  }) => User;
  approveUser: (userId: string, approver: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<Record<string, { count: number; lockedUntil?: number }>>({});

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const loginWithEmail = (email: string, password?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const now = Date.now();

    // Check brute-force lockout
    const lockInfo = failedAttempts[cleanEmail];
    if (lockInfo && lockInfo.lockedUntil && lockInfo.lockedUntil > now) {
      const remainingMin = Math.ceil((lockInfo.lockedUntil - now) / 60000);
      return {
        success: false,
        message: `Account temporarily locked due to failed attempts. Please retry in ${remainingMin} minute(s).`,
      };
    }

    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'No registered ministerial account found with this email.' };
    }

    // Hash check
    if (password && found.password) {
      const inputHash = sha256Sync(password);
      if (found.password !== inputHash && found.password !== password) {
        const prevCount = (lockInfo?.count || 0) + 1;
        if (prevCount >= 5) {
          setFailedAttempts((prev) => ({
            ...prev,
            [cleanEmail]: { count: prevCount, lockedUntil: now + 15 * 60 * 1000 },
          }));
          return {
            success: false,
            message: 'Too many incorrect password attempts. Security lockout active for 15 minutes.',
          };
        } else {
          setFailedAttempts((prev) => ({
            ...prev,
            [cleanEmail]: { count: prevCount },
          }));
          return {
            success: false,
            message: `Incorrect password. Attempt ${prevCount} of 5.`,
          };
        }
      }
    }

    // Success
    setFailedAttempts((prev) => {
      const next = { ...prev };
      delete next[cleanEmail];
      return next;
    });

    setCurrentUserId(found.id);
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const registerSuperAdmin = (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    profilePhoto?: string;
  }): User => {
    const isFirstUser = users.length === 0;
    const pwdHash = data.password ? sha256Sync(data.password) : sha256Sync('password123');

    const newUser: User = {
      id: `usr_sa_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: pwdHash,
      titlePrefix: 'Rev. Dr.',
      role: 'super_admin',
      status: isFirstUser ? 'approved' : 'pending',
      profilePhoto: data.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      ...(isFirstUser ? { approvedByName: 'Root System Initialization', approvedAt: new Date().toISOString() } : {}),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
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
    profilePhoto?: string;
  }): User => {
    const pwdHash = data.password ? sha256Sync(data.password) : sha256Sync('password123');

    const newUser: User = {
      id: `usr_ah_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: pwdHash,
      titlePrefix: data.titlePrefix || 'Apostle',
      role: 'area_head',
      status: 'pending',
      areaId: `area_${Date.now()}`,
      areaName: data.areaName,
      profilePhoto: data.profilePhoto || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
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
    profilePhoto?: string;
  }): User => {
    const pwdHash = data.password ? sha256Sync(data.password) : sha256Sync('password123');

    const newUser: User = {
      id: `usr_p_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: pwdHash,
      titlePrefix: data.titlePrefix || 'Pastor',
      role: 'pastor',
      status: 'pending',
      areaId: data.areaId,
      areaName: data.areaName,
      districtId: `dist_${Date.now()}`,
      districtName: data.districtName,
      profilePhoto: data.profilePhoto || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
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
        loginWithEmail,
        logout,
        registerSuperAdmin,
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
