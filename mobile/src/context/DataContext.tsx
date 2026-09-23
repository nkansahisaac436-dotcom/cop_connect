import React, { createContext, useContext, useState } from 'react';
import { Project, Area, District, ProjectCategory, ProjectStatus, User } from '../types';
import { INITIAL_PROJECTS, INITIAL_AREAS, INITIAL_DISTRICTS } from '../services/mockData';

interface DataContextType {
  projects: Project[];
  areas: Area[];
  districts: District[];
  addProject: (
    data: {
      title: string;
      category: ProjectCategory;
      description: string;
      status: ProjectStatus;
      photos: string[];
      targetBudget?: number;
      location?: string;
    },
    author: User
  ) => Project;
  toggleLike: (projectId: string, userId: string) => void;
  addComment: (projectId: string, content: string, type: 'comment' | 'encouragement', user: User) => void;
  updateStatus: (projectId: string, status: ProjectStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);

  const addProject = (
    data: {
      title: string;
      category: ProjectCategory;
      description: string;
      status: ProjectStatus;
      photos: string[];
      targetBudget?: number;
      location?: string;
    },
    author: User
  ): Project => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: data.title,
      category: data.category,
      description: data.description,
      status: data.status,
      photos: data.photos.length > 0 ? data.photos : [
        'https://images.unsplash.com/photo-1548625361-195fe614b749?w=1000&auto=format&fit=crop&q=80'
      ],
      fundingProgress: data.status === 'Completed' ? 100 : 40,
      targetBudget: data.targetBudget,
      raisedBudget: data.targetBudget ? Math.round(data.targetBudget * 0.4) : undefined,
      currency: 'GHS',
      areaId: author.areaId || 'area_kaneshie',
      areaName: author.areaName || 'Kaneshie Area',
      districtId: author.districtId,
      districtName: author.districtName,
      postedByUserId: author.id,
      postedByName: `${author.titlePrefix ? author.titlePrefix + ' ' : ''}${author.fullName}`,
      postedByRole: author.role,
      postedByTitle: author.titlePrefix,
      location: data.location || author.districtName || author.areaName,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const toggleLike = (projectId: string, userId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const exists = p.likes.includes(userId);
          return {
            ...p,
            likes: exists ? p.likes.filter((id) => id !== userId) : [...p.likes, userId],
          };
        }
        return p;
      })
    );
  };

  const addComment = (projectId: string, content: string, type: 'comment' | 'encouragement', user: User) => {
    const comment = {
      id: `c_${Date.now()}`,
      projectId,
      userId: user.id,
      userName: `${user.titlePrefix ? user.titlePrefix + ' ' : ''}${user.fullName}`,
      userRole: user.role,
      userAreaName: user.areaName,
      content,
      type,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, comments: [...p.comments, comment] } : p))
    );
  };

  const updateStatus = (projectId: string, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status, fundingProgress: status === 'Completed' ? 100 : p.fundingProgress } : p))
    );
  };

  return (
    <DataContext.Provider value={{ projects, areas, districts, addProject, toggleLike, addComment, updateStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
