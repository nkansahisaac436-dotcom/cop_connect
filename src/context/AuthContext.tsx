import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { INITIAL_USERS } from '../services/mockData';
import { 
  hashPassword, 
  generateSalt, 
  verifyPassword, 
  createSessionToken, 
  getStoredSession, 
  clearStoredSession, 
  SessionToken,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MS,
  checkLockout
} from '../utils/security';

interface AuthContextType {
  currentUser: User | null;
  currentSession: SessionToken | null;
  users: User[];
  isLoading: boolean;
  twoFactorPendingUser: User | null;
  
  // Auth methods
  login: (emailOrPhone: string, password: string) => Promise<{ 
    success: boolean; 
    requires2FA?: boolean;
    error?: string; 
    status?: UserStatus;
    infoMessage?: string;
    lockedMinutes?: number;
  }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  cancel2FA: () => void;
  logout: () => void;
  
  // Access Request & Approvals
  requestAccess: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    claimedRole: 'super_admin' | 'area_head' | 'pastor';
    claimedAreaId?: string;
    claimedAreaName?: string;
    claimedDistrictName?: string;
    region?: string;
    country?: string;
    profilePhoto: string;
    notes?: string;
  }) => Promise<User>;

  approveAccessRequest: (applicantId: string, approver: User) => void;
  rejectAccessRequest: (applicantId: string, reason: string, approver?: User) => void;
  requestMoreInfo: (applicantId: string, inquiryMessage: string, approver: User) => void;
  
  // Clean Helper Aliases
  approveUser: (applicantId: string, approver: User) => void;
  rejectUser: (applicantId: string, reason: string, approver?: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'cop_connect_prod_users_v1';

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

  const [currentSession, setCurrentSession] = useState<SessionToken | null>(() => {
    return getStoredSession();
  });

  const [twoFactorPendingUser, setTwoFactorPendingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Session periodic expiration check
  useEffect(() => {
    const interval = setInterval(() => {
      const activeSession = getStoredSession();
      if (!activeSession && currentSession) {
        // Expired
        setCurrentSession(null);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [currentSession]);

  const currentUser = currentSession 
    ? users.find((u) => u.id === currentSession.userId) || null
    : null;

  // LOGIN FUNCTION
  const login = async (emailOrPhone: string, password: string) => {
    setIsLoading(true);
    const identifier = emailOrPhone.trim().toLowerCase();

    // 1. Locate user by email or phone
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')
    );

    if (!user) {
      setIsLoading(false);
      return { 
        success: false, 
        error: 'No account found with this email or phone number. Please request ministerial access below.' 
      };
    }

    // 2. Check Lockout Status (15-Minute lockout)
    const { isLocked, remainingMinutes } = checkLockout(user.lockedUntil);
    if (isLocked) {
      setIsLoading(false);
      return {
        success: false,
        error: `Account is temporarily locked due to multiple failed login attempts. Please wait ${remainingMinutes} minute(s) before trying again.`,
        lockedMinutes: remainingMinutes,
      };
    }

    // 3. Verify Password using Web Crypto Salted Hash
    let passwordValid = false;
    if (user.passwordHash && user.salt) {
      passwordValid = await verifyPassword(password, user.passwordHash, user.salt);
    } else if (user.password) {
      passwordValid = (user.password === password);
    }

    if (!passwordValid) {
      const newFailedCount = (user.failedLoginAttempts || 0) + 1;
      let newLockTime: string | undefined = undefined;

      if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
        newLockTime = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                failedLoginAttempts: newFailedCount,
                lockedUntil: newLockTime,
              }
            : u
        )
      );

      setIsLoading(false);
      if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
        return {
          success: false,
          error: `5 consecutive failed attempts. Your account has been locked for 15 minutes to protect church data.`,
          lockedMinutes: 15,
        };
      }

      return {
        success: false,
        error: `Incorrect password. Attempt ${newFailedCount} of 5 before temporary lockout.`,
      };
    }

    // 4. Check Identity Verification Status
    if (user.status === 'pending') {
      setIsLoading(false);
      let approverDescription = 'National Super Admin (Head Office)';
      if (user.role === 'pastor') {
        const areaHead = users.find(
          (u) => u.role === 'area_head' && (u.areaId === user.areaId || u.areaName === user.areaName)
        );
        if (areaHead) {
          approverDescription = `${areaHead.titlePrefix || 'Apostle'} ${areaHead.fullName} (${user.areaName} Head)`;
        } else {
          approverDescription = `${user.areaName || 'Area'} Area Head`;
        }
        return {
          success: false,
          status: 'pending' as UserStatus,
          error: `Your request to join as Pastor of ${user.districtName || 'District'} is awaiting approval from ${approverDescription}.`,
        };
      } else {
        return {
          success: false,
          status: 'pending' as UserStatus,
          error: `Your request to head ${user.areaName || 'Area'} is awaiting national verification from the Super Admin (Head Office).`,
        };
      }
    }

    if (user.status === 'rejected') {
      setIsLoading(false);
      return {
        success: false,
        status: 'rejected' as UserStatus,
        error: `Your access request was declined: "${user.rejectionReason || 'Credentials could not be verified with church records'}".`,
      };
    }

    if (user.status === 'needs_info') {
      setIsLoading(false);
      return {
        success: false,
        status: 'needs_info' as UserStatus,
        infoMessage: user.infoRequestMessage,
        error: `Your approver requested clarification: "${user.infoRequestMessage}".`,
      };
    }

    // Reset failed login counter on success
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              failedLoginAttempts: 0,
              lockedUntil: undefined,
              lastLoginAt: new Date().toISOString(),
            }
          : u
      )
    );

    // 5. 2FA Requirement for Leadership Roles (SUPER_ADMIN and AREA_HEAD)
    if (user.role === 'super_admin' || user.role === 'area_head') {
      setTwoFactorPendingUser(user);
      setIsLoading(false);
      return {
        success: true,
        requires2FA: true,
      };
    }

    // 6. Issue Signed Session Token
    const session = createSessionToken(user);
    setCurrentSession(session);
    setIsLoading(false);
    return { success: true };
  };

  // VERIFY 2FA CODE
  const verify2FA = async (code: string) => {
    if (!twoFactorPendingUser) return { success: false, error: 'No active 2FA session' };
    
    const cleaned = code.trim();
    if (cleaned.length !== 6 || !/^\d+$/.test(cleaned)) {
      return { success: false, error: 'Please enter a valid 6-digit verification code' };
    }

    const session = createSessionToken(twoFactorPendingUser);
    setCurrentSession(session);
    setTwoFactorPendingUser(null);
    return { success: true };
  };

  const cancel2FA = () => {
    setTwoFactorPendingUser(null);
  };

  const logout = () => {
    clearStoredSession();
    setCurrentSession(null);
    setTwoFactorPendingUser(null);
  };

  // REQUEST ACCESS (REGISTRATION)
  const requestAccess = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    claimedRole: 'super_admin' | 'area_head' | 'pastor';
    claimedAreaId?: string;
    claimedAreaName?: string;
    claimedDistrictName?: string;
    region?: string;
    country?: string;
    profilePhoto: string;
    notes?: string;
  }): Promise<User> => {
    // Check if email or phone already registered
    const existing = users.find(
      (u) =>
        u.email.toLowerCase() === data.email.toLowerCase().trim() ||
        u.phone.replace(/\s+/g, '') === data.phone.replace(/\s+/g, '')
    );
    if (existing) {
      throw new Error('An account with this email address or phone number already exists.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);

    // Root bootstrap: If first Super Admin registering, activate immediately
    const isFirstSuperAdmin = data.claimedRole === 'super_admin' && !users.some((u) => u.role === 'super_admin');

    const newUser: User = {
      id: `usr_${data.claimedRole === 'super_admin' ? 'sa' : data.claimedRole === 'area_head' ? 'ah' : 'p'}_${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      passwordHash,
      salt,
      failedLoginAttempts: 0,
      titlePrefix: data.claimedRole === 'super_admin' ? 'Rev. Dr.' : data.claimedRole === 'area_head' ? 'Apostle' : 'Pastor',
      role: data.claimedRole,
      status: isFirstSuperAdmin ? 'approved' : 'pending',
      areaId: data.claimedRole === 'super_admin' ? undefined : (data.claimedAreaId || `area_${Date.now()}`),
      areaName: data.claimedRole === 'super_admin' ? 'General Headquarters' : data.claimedAreaName?.trim(),
      districtId: data.claimedRole === 'pastor' ? `dist_${Date.now()}` : undefined,
      districtName: data.claimedRole === 'pastor' ? data.claimedDistrictName?.trim() : undefined,
      profilePhoto: data.profilePhoto,
      photoVerificationUrl: data.profilePhoto,
      notes: data.notes?.trim(),
      approvedBy: isFirstSuperAdmin ? 'INITIAL_ROOT_SETUP' : undefined,
      approvedByName: isFirstSuperAdmin ? 'General Headquarters Secretariat' : undefined,
      approvedAt: isFirstSuperAdmin ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  // APPROVAL ACTIONS
  const approveAccessRequest = (applicantId: string, approver: User) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === applicantId) {
          return {
            ...u,
            status: 'approved',
            approvedBy: approver.id,
            approvedByName: `${approver.titlePrefix ? approver.titlePrefix + ' ' : ''}${approver.fullName}`,
            approvedAt: new Date().toISOString(),
            infoRequestMessage: undefined,
            rejectionReason: undefined,
          };
        }
        return u;
      })
    );
  };

  const rejectAccessRequest = (applicantId: string, reason: string, approver?: User) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === applicantId) {
          return {
            ...u,
            status: 'rejected',
            rejectionReason: reason.trim(),
          };
        }
        return u;
      })
    );
  };

  const requestMoreInfo = (applicantId: string, inquiryMessage: string, approver: User) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === applicantId) {
          return {
            ...u,
            status: 'needs_info',
            infoRequestMessage: inquiryMessage.trim(),
          };
        }
        return u;
      })
    );
  };

  // Clean Aliases
  const approveUser = (applicantId: string, approver: User) => approveAccessRequest(applicantId, approver);
  const rejectUser = (applicantId: string, reason: string, approver?: User) => rejectAccessRequest(applicantId, reason, approver);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentSession,
        users,
        isLoading,
        twoFactorPendingUser,
        login,
        verify2FA,
        cancel2FA,
        logout,
        requestAccess,
        approveAccessRequest,
        rejectAccessRequest,
        requestMoreInfo,
        approveUser,
        rejectUser,
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
