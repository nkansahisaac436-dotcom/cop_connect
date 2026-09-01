import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation & Brand
  app_name: {
    en: 'COP Connect',
    fr: 'COP Connect',
  },
  tagline: {
    en: 'Church of Pentecost Leadership & Project Portal',
    fr: 'Portail des Projets et du Leadership de l\'Église de Pentecôte',
  },
  national_feed: {
    en: 'National Feed',
    fr: 'Fil National',
  },
  pastor_dashboard: {
    en: 'Pastor Dashboard',
    fr: 'Tableau de Bord Pasteur',
  },
  area_head_dashboard: {
    en: 'Area Head Dashboard',
    fr: 'Tableau de Bord Chef de Région',
  },
  super_admin_dashboard: {
    en: 'Super Admin Portal',
    fr: 'Portail Super Admin',
  },
  upload_project: {
    en: 'Upload Project',
    fr: 'Publier un Projet',
  },
  login: {
    en: 'Sign In',
    fr: 'Se Connecter',
  },
  logout: {
    en: 'Sign Out',
    fr: 'Déconnexion',
  },
  register: {
    en: 'Register Account',
    fr: 'Créer un Compte',
  },

  // Roles & Status
  super_admin: {
    en: 'National Super Admin',
    fr: 'Super Admin National',
  },
  area_head: {
    en: 'Area Head (Apostle)',
    fr: 'Chef de Région (Apôtre)',
  },
  pastor: {
    en: 'District Pastor',
    fr: 'Pasteur de District',
  },
  pending_status: {
    en: 'Pending Verification',
    fr: 'En Attente de Vérification',
  },
  approved_status: {
    en: 'Verified & Approved',
    fr: 'Vérifié et Approuvé',
  },

  // Feed & Filters
  all_areas: {
    en: 'All Areas',
    fr: 'Toutes les Régions',
  },
  all_categories: {
    en: 'All Categories',
    fr: 'Toutes Catégories',
  },
  all_statuses: {
    en: 'All Statuses',
    fr: 'Tous les Statuts',
  },
  search_placeholder: {
    en: 'Search projects, church buildings, outreaches...',
    fr: 'Rechercher des projets, temples, évangélisations...',
  },
  planned: {
    en: 'Planned',
    fr: 'Planifié',
  },
  ongoing: {
    en: 'Ongoing',
    fr: 'En Cours',
  },
  completed: {
    en: 'Completed',
    fr: 'Achevé',
  },
  funding_progress: {
    en: 'Funding Progress',
    fr: 'Progression du Financement',
  },
  reactions: {
    en: 'Encouragements',
    fr: 'Encouragements',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('cop_connect_lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('cop_connect_lang', language);
  }, [language]);

  const t = (key: string): string => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language] || TRANSLATIONS[key].en || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
