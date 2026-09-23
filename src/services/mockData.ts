import { User, Area, District, Project, AuditLog, NotificationItem } from '../types';

/**
 * Production Initial State:
 * All accounts must be created organically via the Request Access -> Superior Verification workflow.
 * No hardcoded, seeded, or demo user accounts exist.
 */
export const INITIAL_USERS: User[] = [];

export const INITIAL_AREAS: Area[] = [
  // Greater Accra Region Areas
  {
    id: 'area_kaneshie',
    name: 'Kaneshie Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 14,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_odorkor',
    name: 'Odorkor Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 16,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_madina',
    name: 'Madina Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 18,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_achimota',
    name: 'Achimota Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 15,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_dansoman',
    name: 'Dansoman Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 12,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_tema',
    name: 'Tema Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 20,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // Ashanti Region Areas
  {
    id: 'area_kumasi',
    name: 'Kumasi Area',
    region: 'Ashanti',
    country: 'Ghana',
    districtCount: 22,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_asokwa',
    name: 'Asokwa Area',
    region: 'Ashanti',
    country: 'Ghana',
    districtCount: 14,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_kwadaso',
    name: 'Kwadaso Area',
    region: 'Ashanti',
    country: 'Ghana',
    districtCount: 15,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // Central & Western Region Areas
  {
    id: 'area_cape_coast',
    name: 'Cape Coast Area',
    region: 'Central',
    country: 'Ghana',
    districtCount: 12,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_takoradi',
    name: 'Takoradi Area',
    region: 'Western',
    country: 'Ghana',
    districtCount: 16,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // Eastern & Volta Region Areas
  {
    id: 'area_koforidua',
    name: 'Koforidua Area',
    region: 'Eastern',
    country: 'Ghana',
    districtCount: 14,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_ho',
    name: 'Ho Area',
    region: 'Volta',
    country: 'Ghana',
    districtCount: 11,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // Northern & Upper Regions
  {
    id: 'area_tamale',
    name: 'Tamale Area',
    region: 'Northern',
    country: 'Ghana',
    districtCount: 10,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_sunyani',
    name: 'Sunyani Area',
    region: 'Bono',
    country: 'Ghana',
    districtCount: 13,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // International Diaspora Areas
  {
    id: 'area_london',
    name: 'London Area',
    region: 'United Kingdom',
    country: 'United Kingdom',
    districtCount: 8,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'area_usa_east',
    name: 'USA East Coast Area',
    region: 'North America',
    country: 'USA',
    districtCount: 10,
    totalProjectsCount: 0,
    totalCompletedProjects: 0,
    createdAt: '2026-01-01T00:00:00Z',
  }
];

export const INITIAL_DISTRICTS: District[] = [
  // Kaneshie Area Districts
  {
    id: 'dist_kaneshie_central',
    name: 'Kaneshie Central District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 6,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dist_bubuashie',
    name: 'Bubuashie District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 5,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dist_darkuman',
    name: 'Darkuman District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 4,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dist_abossey_okai',
    name: 'Abossey Okai District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 5,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // Kumasi Area Districts
  {
    id: 'dist_asokwa',
    name: 'Asokwa Central District',
    areaId: 'area_kumasi',
    areaName: 'Kumasi Area',
    assemblyCount: 7,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dist_bompata',
    name: 'Bompata District',
    areaId: 'area_kumasi',
    areaName: 'Kumasi Area',
    assemblyCount: 6,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },

  // London Area Districts
  {
    id: 'dist_london_central',
    name: 'London Central (Walthamstow)',
    areaId: 'area_london',
    areaName: 'London Area',
    assemblyCount: 4,
    projectCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  }
];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
