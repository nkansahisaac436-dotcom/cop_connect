import { User, Area, District, Project } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_super_admin',
    fullName: 'Rev. Dr. Samuel Kwadwo Boakye',
    email: 'admin@thecophq.org',
    phone: '+233 24 412 3456',
    role: 'super_admin',
    status: 'approved',
    titlePrefix: 'Rev. Dr.',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'usr_area_kaneshie',
    fullName: 'Apostle Emmanuel Yaw Gyasi',
    email: 'kaneshie.area@thecophq.org',
    phone: '+233 20 811 2233',
    role: 'area_head',
    status: 'approved',
    titlePrefix: 'Apostle',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'usr_pastor_kaneshie_central',
    fullName: 'Pastor Daniel Mensah-Bonsu',
    email: 'pastor.kaneshie@copconnect.org',
    phone: '+233 24 555 4321',
    role: 'pastor',
    status: 'approved',
    titlePrefix: 'Pastor',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    districtId: 'dist_kaneshie_central',
    districtName: 'Kaneshie Central District',
    profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-01-11T12:00:00Z',
  },
  {
    id: 'usr_pending_area_head',
    fullName: 'Apostle Isaac K. Ayani',
    email: 'capecoast.applicant@thecophq.org',
    phone: '+233 24 777 6655',
    role: 'area_head',
    status: 'pending',
    titlePrefix: 'Apostle',
    areaId: 'area_cape_coast',
    areaName: 'Cape Coast Area',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-02-28T14:25:00Z',
  },
  {
    id: 'usr_pending_pastor',
    fullName: 'Pastor Gabriel Antwi Boasiako',
    email: 'darkuman.pastor@copconnect.org',
    phone: '+233 20 444 8899',
    role: 'pastor',
    status: 'pending',
    titlePrefix: 'Pastor',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    districtId: 'dist_darkuman',
    districtName: 'Darkuman District',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    createdAt: '2026-02-29T10:15:00Z',
  }
];

export const INITIAL_AREAS: Area[] = [
  {
    id: 'area_kaneshie',
    name: 'Kaneshie Area',
    region: 'Greater Accra',
    country: 'Ghana',
    areaHeadUserId: 'usr_area_kaneshie',
    areaHeadName: 'Apostle Emmanuel Yaw Gyasi',
    districtCount: 14,
    totalProjectsCount: 1,
  },
  {
    id: 'area_kumasi',
    name: 'Kumasi Area',
    region: 'Ashanti',
    country: 'Ghana',
    areaHeadName: 'Apostle Dr. Michael Agyemang Prempeh',
    districtCount: 22,
    totalProjectsCount: 1,
  },
  {
    id: 'area_takoradi',
    name: 'Takoradi Area',
    region: 'Western',
    country: 'Ghana',
    areaHeadName: 'Apostle Samuel Otu Appiah',
    districtCount: 16,
    totalProjectsCount: 1,
  },
  {
    id: 'area_tamale',
    name: 'Tamale Area',
    region: 'Northern',
    country: 'Ghana',
    areaHeadName: 'Apostle Joseph Mensah',
    districtCount: 12,
    totalProjectsCount: 1,
  },
  {
    id: 'area_london',
    name: 'London Area',
    region: 'United Kingdom',
    country: 'United Kingdom',
    areaHeadName: 'Apostle John Kingsley Arthur',
    districtCount: 8,
    totalProjectsCount: 1,
  }
];

export const INITIAL_DISTRICTS: District[] = [
  {
    id: 'dist_kaneshie_central',
    name: 'Kaneshie Central District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    pastorUserId: 'usr_pastor_kaneshie_central',
    pastorName: 'Pastor Daniel Mensah-Bonsu',
    assemblyCount: 7,
  },
  {
    id: 'dist_bubuashie',
    name: 'Bubuashie District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    pastorName: 'Pastor Joseph Kwesi Amoah',
    assemblyCount: 6,
  },
  {
    id: 'dist_darkuman',
    name: 'Darkuman District',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    pastorName: 'Pastor Gabriel Antwi Boasiako (Pending)',
    assemblyCount: 5,
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_kaneshie_cathedral',
    title: '5,000-Seater Central Cathedral & Ministry Complex',
    category: 'Church Building',
    description: 'Construction of the new state-of-the-art multi-tier auditorium for Kaneshie Central. Includes 5,000-capacity main auditorium, children ministry suites, and underground parking.',
    status: 'Ongoing',
    photos: [
      'https://images.unsplash.com/photo-1548625361-195fe614b749?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1000&auto=format&fit=crop&q=80'
    ],
    fundingProgress: 68,
    targetBudget: 4500000,
    raisedBudget: 3060000,
    currency: 'GHS',
    areaId: 'area_kaneshie',
    areaName: 'Kaneshie Area',
    districtId: 'dist_kaneshie_central',
    districtName: 'Kaneshie Central District',
    postedByUserId: 'usr_pastor_kaneshie_central',
    postedByName: 'Pastor Daniel Mensah-Bonsu',
    postedByRole: 'pastor',
    postedByTitle: 'Pastor',
    location: 'Kaneshie Highway Junction, Accra',
    likes: ['usr_super_admin', 'usr_area_kaneshie'],
    comments: [
      {
        id: 'c1',
        projectId: 'proj_kaneshie_cathedral',
        userId: 'usr_area_kaneshie',
        userName: 'Apostle Emmanuel Yaw Gyasi',
        userRole: 'area_head',
        content: 'Glory to God! A massive and inspiring edifice for the kingdom.',
        type: 'encouragement',
        createdAt: '2026-02-10T14:30:00Z'
      }
    ],
    milestones: [
      { id: 'm1', title: 'Foundation & Pillars', completed: true },
      { id: 'm2', title: 'Roof Truss & Covering', completed: false }
    ],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-20T16:45:00Z'
  },
  {
    id: 'proj_afram_outreach',
    title: 'National Mega Rural Evangelism (Afram Plains)',
    category: 'Outreach/Evangelism',
    description: '5-day intensive gospel crusade across 18 island villages. Resulted in 1,420 souls won and 4 new Local Assemblies inaugurated.',
    status: 'Completed',
    photos: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&auto=format&fit=crop&q=80'
    ],
    fundingProgress: 100,
    targetBudget: 280000,
    raisedBudget: 280000,
    currency: 'GHS',
    areaId: 'area_takoradi',
    areaName: 'Takoradi Area',
    postedByUserId: 'usr_super_admin',
    postedByName: 'Apostle Samuel Otu Appiah',
    postedByRole: 'area_head',
    postedByTitle: 'Apostle',
    location: 'Afram Plains Riverine Basin',
    likes: ['usr_pastor_kaneshie_central'],
    comments: [],
    createdAt: '2026-01-26T12:00:00Z',
    updatedAt: '2026-01-26T12:00:00Z'
  },
  {
    id: 'proj_boreholes',
    title: 'Clean Water Boreholes (10 Rural Assemblies)',
    category: 'Community Project',
    description: 'Drilling and mechanization of 10 solar-powered potable water boreholes in arid rural communities in the Northern Region.',
    status: 'Completed',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1000&auto=format&fit=crop&q=80'
    ],
    fundingProgress: 100,
    targetBudget: 350000,
    raisedBudget: 350000,
    currency: 'GHS',
    areaId: 'area_tamale',
    areaName: 'Tamale Area',
    postedByUserId: 'usr_super_admin',
    postedByName: 'Apostle Joseph Mensah',
    postedByRole: 'area_head',
    location: 'Savelugu, Northern Region',
    likes: ['usr_super_admin'],
    comments: [],
    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-01-18T09:00:00Z'
  }
];
