export type UserRole = 'super_admin' | 'area_head' | 'pastor';

export type UserStatus = 'pending' | 'approved' | 'rejected';

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
  password?: string;
  role: UserRole;
  status: UserStatus;
  titlePrefix?: string;
  areaId?: string;
  areaName?: string;
  districtId?: string;
  districtName?: string;
  profilePhoto?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Area {
  id: string;
  name: string;
  region: string;
  country: string;
  areaHeadUserId?: string;
  areaHeadName?: string;
  districtCount: number;
  totalProjectsCount: number;
}

export interface District {
  id: string;
  name: string;
  areaId: string;
  areaName: string;
  pastorUserId?: string;
  pastorName?: string;
  assemblyCount: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAreaName?: string;
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
  photos: string[];
  fundingProgress?: number;
  targetBudget?: number;
  raisedBudget?: number;
  currency?: string;
  areaId: string;
  areaName: string;
  districtId?: string;
  districtName?: string;
  postedByUserId: string;
  postedByName: string;
  postedByRole: UserRole;
  postedByTitle?: string;
  location?: string;
  likes: string[];
  comments: ProjectComment[];
  milestones?: ProjectMilestone[];
  createdAt: string;
  updatedAt: string;
}
