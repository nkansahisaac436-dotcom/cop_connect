import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Area, 
  District, 
  AuditLog, 
  NotificationItem, 
  ProjectStatus, 
  ProjectCategory,
  ProjectMilestone,
  User
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_AREAS, 
  INITIAL_DISTRICTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../services/mockData';

interface DataContextType {
  projects: Project[];
  areas: Area[];
  districts: District[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  
  // Project Actions
  addProject: (projectData: {
    title: string;
    category: ProjectCategory;
    description: string;
    status: ProjectStatus;
    photos: string[];
    fundingProgress?: number;
    targetBudget?: number;
    currency?: string;
    location?: string;
    startDate?: string;
    targetCompletionDate?: string;
    milestones?: { title: string }[];
  }, author: User) => Project;
  
  editProject: (
    projectId: string,
    updates: Partial<Project>,
    user: User
  ) => void;

  deleteProject: (
    projectId: string,
    user: User
  ) => void;

  updateProjectStatus: (
    projectId: string, 
    newStatus: ProjectStatus, 
    note: string, 
    user: User
  ) => void;
  
  toggleLike: (projectId: string, userId: string) => void;
  
  addComment: (
    projectId: string, 
    content: string, 
    type: 'comment' | 'encouragement', 
    user: User
  ) => void;

  toggleMilestone: (projectId: string, milestoneId: string) => void;

  // Area & District Actions
  addArea: (areaData: {
    name: string;
    region: string;
    country: string;
    areaHeadName?: string;
  }, actor: User) => Area;

  addDistrict: (districtData: {
    name: string;
    areaId: string;
    areaName: string;
    pastorName?: string;
  }, actor: User) => District;

  // Approval Handlers
  recordApprovalLog: (
    action: 'AREA_HEAD_APPROVED' | 'AREA_HEAD_REJECTED' | 'PASTOR_APPROVED' | 'PASTOR_REJECTED',
    actor: User,
    targetUser: User,
    details: string
  ) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;

  // Clean Slate / Reset
  clearAllProjects: (actor: User) => void;
  restoreDefaultData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PROJECTS_KEY = 'cop_connect_projects_v2';
const AREAS_KEY = 'cop_connect_areas_v2';
const DISTRICTS_KEY = 'cop_connect_districts_v2';
const AUDIT_LOGS_KEY = 'cop_connect_audit_logs_v2';
const NOTIFICATIONS_KEY = 'cop_connect_notifications_v2';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(PROJECTS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Areas
  const [areas, setAreas] = useState<Area[]>(() => {
    const saved = localStorage.getItem(AREAS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_AREAS;
  });

  // Districts
  const [districts, setDistricts] = useState<District[]>(() => {
    const saved = localStorage.getItem(DISTRICTS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DISTRICTS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(AUDIT_LOGS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Persist state to LocalStorage
  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(AREAS_KEY, JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem(DISTRICTS_KEY, JSON.stringify(districts));
  }, [districts]);

  useEffect(() => {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Project Creation
  const addProject = (
    projectData: {
      title: string;
      category: ProjectCategory;
      description: string;
      status: ProjectStatus;
      photos: string[];
      fundingProgress?: number;
      targetBudget?: number;
      currency?: string;
      location?: string;
      startDate?: string;
      targetCompletionDate?: string;
      milestones?: { title: string }[];
    },
    author: User
  ): Project => {
    const newMilestones: ProjectMilestone[] = (projectData.milestones || []).map((m, idx) => ({
      id: `m_${Date.now()}_${idx}`,
      title: m.title,
      completed: false,
    }));

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: projectData.title,
      category: projectData.category,
      description: projectData.description,
      status: projectData.status,
      photos: projectData.photos.length > 0 ? projectData.photos : [
        'https://images.unsplash.com/photo-1548625361-195fe614b749?w=1000&auto=format&fit=crop&q=80'
      ],
      fundingProgress: projectData.fundingProgress || 0,
      targetBudget: projectData.targetBudget,
      raisedBudget: projectData.targetBudget && projectData.fundingProgress 
        ? Math.round((projectData.targetBudget * projectData.fundingProgress) / 100)
        : undefined,
      currency: projectData.currency || 'GHS',
      areaId: author.areaId || 'area_general',
      areaName: author.areaName || 'National General',
      districtId: author.districtId,
      districtName: author.districtName,
      postedByUserId: author.id,
      postedByName: `${author.titlePrefix ? author.titlePrefix + ' ' : ''}${author.fullName}`,
      postedByRole: author.role,
      postedByTitle: author.titlePrefix,
      location: projectData.location || `${author.districtName || author.areaName}`,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      targetCompletionDate: projectData.targetCompletionDate,
      likes: [],
      comments: [],
      milestones: newMilestones,
      statusUpdates: [
        {
          id: `su_${Date.now()}`,
          previousStatus: projectData.status,
          newStatus: projectData.status,
          note: 'Initial project upload to COP Connect.',
          updatedBy: author.fullName,
          updatedAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    // Update Area Project Count
    if (author.areaId) {
      setAreas((prev) =>
        prev.map((a) =>
          a.id === author.areaId
            ? { ...a, totalProjectsCount: (a.totalProjectsCount || 0) + 1 }
            : a
        )
      );
    }

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: author.id,
      actorName: author.fullName,
      actorRole: author.role,
      action: 'PROJECT_CREATED',
      targetId: newProject.id,
      targetName: newProject.title,
      details: `Created new project in category: ${newProject.category} with status: ${newProject.status}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Send Notification to Area Head if posted by Pastor
    if (author.role === 'pastor' && author.areaId) {
      const area = areas.find((a) => a.id === author.areaId);
      if (area?.areaHeadUserId) {
        const notif: NotificationItem = {
          id: `notif_${Date.now()}`,
          userId: area.areaHeadUserId,
          title: 'New District Project Uploaded',
          message: `${author.fullName} posted "${newProject.title}" for ${author.districtName}.`,
          type: 'project',
          read: false,
          link: `/feed?project=${newProject.id}`,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    }

    return newProject;
  };

  // Edit Project
  const editProject = (
    projectId: string,
    updates: Partial<Project>,
    user: User
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'PROJECT_UPDATED',
      targetId: projectId,
      targetName: updates.title || `Project ${projectId}`,
      details: `Updated project fields: ${Object.keys(updates).join(', ')}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Delete Project
  const deleteProject = (projectId: string, user: User) => {
    const target = projects.find((p) => p.id === projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));

    if (target?.areaId) {
      setAreas((prev) =>
        prev.map((a) =>
          a.id === target.areaId
            ? { ...a, totalProjectsCount: Math.max(0, (a.totalProjectsCount || 1) - 1) }
            : a
        )
      );
    }

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'PROJECT_STATUS_CHANGED',
      targetId: projectId,
      targetName: target?.title || projectId,
      details: `Deleted project from COP Connect`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Update Status
  const updateProjectStatus = (
    projectId: string,
    newStatus: ProjectStatus,
    note: string,
    user: User
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const oldStatus = p.status;
          const statusUpdate = {
            id: `su_${Date.now()}`,
            previousStatus: oldStatus,
            newStatus,
            note: note || `Status updated from ${oldStatus} to ${newStatus}`,
            updatedBy: user.fullName,
            updatedAt: new Date().toISOString(),
          };

          return {
            ...p,
            status: newStatus,
            completedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : p.completedDate,
            fundingProgress: newStatus === 'Completed' ? 100 : p.fundingProgress,
            updatedAt: new Date().toISOString(),
            statusUpdates: [statusUpdate, ...(p.statusUpdates || [])],
          };
        }
        return p;
      })
    );

    // Audit log
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'PROJECT_STATUS_CHANGED',
      targetId: projectId,
      targetName: `Project ${projectId}`,
      details: `Changed status to ${newStatus}. Note: ${note}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Toggle Like / Reaction
  const toggleLike = (projectId: string, userId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const alreadyLiked = p.likes.includes(userId);
          const newLikes = alreadyLiked
            ? p.likes.filter((id) => id !== userId)
            : [...p.likes, userId];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );
  };

  // Add Comment / Encouragement
  const addComment = (
    projectId: string,
    content: string,
    type: 'comment' | 'encouragement',
    user: User
  ) => {
    const newComment = {
      id: `c_${Date.now()}`,
      projectId,
      userId: user.id,
      userName: `${user.titlePrefix ? user.titlePrefix + ' ' : ''}${user.fullName}`,
      userRole: user.role,
      userAreaName: user.areaName,
      userDistrictName: user.districtName,
      content,
      type,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    // Notify the project owner
    const targetProject = projects.find((p) => p.id === projectId);
    if (targetProject && targetProject.postedByUserId !== user.id) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: targetProject.postedByUserId,
        title: type === 'encouragement' ? 'New Encouragement Received!' : 'New Comment on Project',
        message: `${user.fullName} (${user.areaName || 'COP'}) responded to your project "${targetProject.title}".`,
        type: 'project',
        read: false,
        link: `/feed?project=${projectId}`,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Toggle Milestone
  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = (p.milestones || []).map((m) => {
            if (m.id === milestoneId) {
              const completed = !m.completed;
              return {
                ...m,
                completed,
                completedAt: completed ? new Date().toISOString().split('T')[0] : undefined,
              };
            }
            return m;
          });
          return { ...p, milestones: updatedMilestones };
        }
        return p;
      })
    );
  };

  // Add Area
  const addArea = (
    areaData: {
      name: string;
      region: string;
      country: string;
      areaHeadName?: string;
    },
    actor: User
  ): Area => {
    const newArea: Area = {
      id: `area_${Date.now()}`,
      name: areaData.name,
      region: areaData.region,
      country: areaData.country,
      areaHeadName: areaData.areaHeadName,
      districtCount: 0,
      totalProjectsCount: 0,
      totalCompletedProjects: 0,
      createdAt: new Date().toISOString(),
    };

    setAreas((prev) => [...prev, newArea]);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'AREA_CREATED',
      targetId: newArea.id,
      targetName: newArea.name,
      details: `Created new Area in ${newArea.region}, ${newArea.country}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    return newArea;
  };

  // Add District
  const addDistrict = (
    districtData: {
      name: string;
      areaId: string;
      areaName: string;
      pastorName?: string;
    },
    actor: User
  ): District => {
    const newDistrict: District = {
      id: `dist_${Date.now()}`,
      name: districtData.name,
      areaId: districtData.areaId,
      areaName: districtData.areaName,
      pastorName: districtData.pastorName,
      assemblyCount: 1,
      projectCount: 0,
      createdAt: new Date().toISOString(),
    };

    setDistricts((prev) => [...prev, newDistrict]);

    // Update Area districtCount
    setAreas((prev) =>
      prev.map((a) =>
        a.id === districtData.areaId
          ? { ...a, districtCount: a.districtCount + 1 }
          : a
      )
    );

    return newDistrict;
  };

  // Record Approval Log
  const recordApprovalLog = (
    action: 'AREA_HEAD_APPROVED' | 'AREA_HEAD_REJECTED' | 'PASTOR_APPROVED' | 'PASTOR_REJECTED',
    actor: User,
    targetUser: User,
    details: string
  ) => {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      action,
      targetId: targetUser.id,
      targetName: `${targetUser.fullName} (${targetUser.areaName || ''})`,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    // Create notification for target user
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: targetUser.id,
      title: action.includes('APPROVED') ? 'Account Approved!' : 'Account Registration Update',
      message: details,
      type: action.includes('APPROVED') ? 'approval' : 'rejection',
      read: false,
      link: '/feed',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Clean Slate actions
  const clearAllProjects = (actor: User) => {
    setProjects([]);
    setAreas((prev) =>
      prev.map((a) => ({ ...a, totalProjectsCount: 0, totalCompletedProjects: 0 }))
    );

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'PROJECT_STATUS_CHANGED',
      targetId: 'all',
      targetName: 'Clean Slate Reset',
      details: 'Cleared all projects to start fresh with real user-created content.',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const restoreDefaultData = () => {
    setProjects(INITIAL_PROJECTS);
    setAreas(INITIAL_AREAS);
    setDistricts(INITIAL_DISTRICTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(AREAS_KEY);
    localStorage.removeItem(DISTRICTS_KEY);
  };

  // Notifications Handlers
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        areas,
        districts,
        auditLogs,
        notifications,
        addProject,
        editProject,
        deleteProject,
        updateProjectStatus,
        toggleLike,
        addComment,
        toggleMilestone,
        addArea,
        addDistrict,
        recordApprovalLog,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllProjects,
        restoreDefaultData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
