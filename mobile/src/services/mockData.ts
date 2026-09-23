import { User, Area, District, Project } from '../types';

export const INITIAL_USERS: User[] = [];

export const INITIAL_AREAS: Area[] = [
  {
    id: 'area_kaneshie',
    name: 'Kaneshie Area',
    region: 'Greater Accra',
    country: 'Ghana',
    districtCount: 14,
    totalProjectsCount: 0,
  },
  {
    id: 'area_kumasi',
    name: 'Kumasi Area',
    region: 'Ashanti',
    country: 'Ghana',
    districtCount: 22,
    totalProjectsCount: 0,
  },
  {
    id: 'area_takoradi',
    name: 'Takoradi Area',
    region: 'Western',
    country: 'Ghana',
    districtCount: 16,
    totalProjectsCount: 0,
  },
  {
    id: 'area_tamale',
    name: 'Tamale Area',
    region: 'Northern',
    country: 'Ghana',
    districtCount: 12,
    totalProjectsCount: 0,
  },
  {
    id: 'area_koforidua',
    name: 'Koforidua Area',
    region: 'Eastern',
    country: 'Ghana',
    districtCount: 18,
    totalProjectsCount: 0,
  },
  {
    id: 'area_cape_coast',
    name: 'Cape Coast Area',
    region: 'Central',
    country: 'Ghana',
    districtCount: 15,
    totalProjectsCount: 0,
  },
  {
    id: 'area_ho',
    name: 'Ho Area',
    region: 'Volta',
    country: 'Ghana',
    districtCount: 11,
    totalProjectsCount: 0,
  },
  {
    id: 'area_london',
    name: 'London Area',
    region: 'United Kingdom',
    country: 'United Kingdom',
    districtCount: 8,
    totalProjectsCount: 0,
  }
];

export const INITIAL_DISTRICTS: District[] = [
  {
    id: 'dist_kaneshie_central',
    name: 'Kaneshie Central District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 7,
  },
  {
    id: 'dist_bubuashie',
    name: 'Bubuashie District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 6,
  },
  {
    id: 'dist_darkuman',
    name: 'Darkuman District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    assemblyCount: 5,
  },
  {
    id: 'dist_asokwa',
    name: 'Asokwa Central District',
    areaId: 'area_kumasi',
    areaName: 'Kumasi Area',
    assemblyCount: 8,
  },
  {
    id: 'dist_bantama',
    name: 'Bantama District',
    areaId: 'area_kumasi',
    areaName: 'Kumasi Area',
    assemblyCount: 6,
  },
  {
    id: 'dist_london_central',
    name: 'London Central (Walthamstow)',
    areaId: 'area_london',
    areaName: 'London Area',
    assemblyCount: 4,
  }
];

export const INITIAL_PROJECTS: Project[] = [];
