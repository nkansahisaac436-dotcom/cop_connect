export type UserRole = 'super_admin' | 'area_head' | 'pastor';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';

export type ProjectCategory = 
  | 'Church Building'
  | 'Outreach/Evangelism'
  | 'Conference/Event'
  | 'Community Project'
  | 'Mission House'
  | 'Other';

export type ProjectStatus = 'Planned' | 'Ongoing' | 'Completed';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string; // Plaintext fallback for mock/demo test accounts
  passwordHash?: string; // Hashed password
  salt?: string;
  failedLoginAttempts?: number;
  lockedUntil?: string; // ISO date string if account locked
  twoFactorEnabled?: boolean;
  role: UserRole;
  status: UserStatus;
  titlePrefix?: string; // e.g. "Apostle", "Pastor", "Elder", "Rev."
  areaId?: string;
  areaName?: string;
  districtId?: string;
  districtName?: string;
  profilePhoto?: string;
  photoVerificationUrl?: string; // Required clear face/ID photo
  approvedBy?: string; // User ID of Super Admin or Area Head
  approvedByName?: string;
  approvedAt?: string; // ISO date string
  rejectionReason?: string;
  infoRequestMessage?: string; // Note from approver asking for clarification
  appointmentYear?: string;
  notes?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Area {
  id: string;
  name: string; // e.g. "Kaneshie Area", "Kumasi Area", "London Area"
  region: string; // e.g. "Greater Accra", "Ashanti", "United Kingdom"
  country: string; // e.g. "Ghana", "United Kingdom", "USA"
  areaHeadUserId?: string;
  areaHeadName?: string;
  areaHeadPhone?: string;
  areaHeadEmail?: string;
  districtCount: number;
  totalProjectsCount: number;
  totalCompletedProjects: number;
  imageUrl?: string;
  createdAt: string;
}

export interface District {
  id: string;
  name: string; // e.g. "Kaneshie Central", "Bubuashie District", "Darkuman"
  areaId: string;
  areaName: string;
  pastorUserId?: string;
  pastorName?: string;
  pastorPhone?: string;
  pastorEmail?: string;
  assemblyCount: number;
  projectCount: number;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAreaName?: string;
  userDistrictName?: string;
  content: string;
  type: 'comment' | 'encouragement';
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  status: ProjectStatus;
  photos: string[]; // URLs or base64
  fundingProgress?: number; // 0 - 100%
  targetBudget?: number; // In currency
  currency?: string; // 'GHS' | 'USD' | 'GBP' | 'EUR'
  raisedBudget?: number;
  
  // Hierarchy Links
  areaId: string;
  areaName: string;
  districtId?: string;
  districtName?: string;
  
  // Author
  postedByUserId: string;
  postedByName: string;
  postedByRole: UserRole;
  postedByTitle?: string;
  
  location?: string;
  startDate?: string;
  targetCompletionDate?: string;
  completedDate?: string;
  
  likes: string[]; // User IDs who reacted/liked
  comments: ProjectComment[];
  milestones?: ProjectMilestone[];
  
  statusUpdates?: {
    id: string;
    previousStatus: ProjectStatus;
    newStatus: ProjectStatus;
    note: string;
    updatedBy: string;
    updatedAt: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 
    | 'ACCESS_REQUEST_SUBMITTED'
    | 'AREA_HEAD_APPROVED'
    | 'AREA_HEAD_REJECTED'
    | 'AREA_HEAD_INFO_REQUESTED'
    | 'PASTOR_APPROVED'
    | 'PASTOR_REJECTED'
    | 'PASTOR_INFO_REQUESTED'
    | 'FAILED_LOGIN_ATTEMPT'
    | 'ACCOUNT_LOCKED'
    | 'TWO_FACTOR_VERIFIED'
    | 'LOGIN_SUCCESSFUL'
    | 'LOGOUT'
    | 'PROJECT_CREATED'
    | 'PROJECT_UPDATED'
    | 'PROJECT_STATUS_CHANGED'
    | 'AREA_CREATED';
  targetId: string;
  targetName: string;
  targetRole?: UserRole;
  targetAreaName?: string;
  targetDistrictName?: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'project' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface FeedFilterState {
  searchQuery: string;
  areaId: string; // 'all' or specific area ID
  districtId: string; // 'all' or specific district ID
  category: string; // 'all' or specific category
  status: string; // 'all' | 'Planned' | 'Ongoing' | 'Completed'
  sortBy: 'newest' | 'oldest' | 'most_funded' | 'most_photos';
}
