import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { LoginScreen } from './components/auth/LoginScreen';
import { RequestAccessScreen } from './components/auth/RequestAccessScreen';
import { NationalFeedPage } from './pages/NationalFeedPage';
import { PastorDashboardPage } from './pages/PastorDashboardPage';
import { AreaHeadDashboardPage } from './pages/AreaHeadDashboardPage';
import { SuperAdminDashboardPage } from './pages/SuperAdminDashboardPage';
import { AccessLogPage } from './pages/AccessLogPage';
import { AreaProfilePage } from './pages/AreaProfilePage';
import { DistrictProfilePage } from './pages/DistrictProfilePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { PendingApprovalView } from './components/auth/PendingApprovalView';
import { ProjectDetailModal } from './components/feed/ProjectDetailModal';
import { UploadProjectModal } from './components/forms/UploadProjectModal';
import { EditProjectModal } from './components/forms/EditProjectModal';
import { StatusUpdateModal } from './components/forms/StatusUpdateModal';
import { AuthModal } from './components/auth/AuthModal';
import { Project } from './types';
import { CopLogo } from './assets/CopLogo';

function AppContent() {
  const { currentUser, currentSession } = useAuth();
  const { projects } = useData();

  // Authentication Gateway View: 'login' | 'request_access'
  const [authView, setAuthView] = useState<'login' | 'request_access'>('login');

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('feed');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('area_kaneshie');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist_kaneshie_central');

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusModalProject, setStatusModalProject] = useState<Project | null>(null);
  const [editModalProject, setEditModalProject] = useState<Project | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup_area' | 'signup_pastor'>('login');

  // Automatically route to Role Dashboard on login
  useEffect(() => {
    if (currentUser && currentSession) {
      if (currentUser.status === 'pending') {
        setCurrentPage('pending');
      } else if (currentUser.role === 'super_admin') {
        setCurrentPage('admin');
      } else if (currentUser.role === 'area_head') {
        setCurrentPage('area_head');
      } else if (currentUser.role === 'pastor') {
        setCurrentPage('pastor');
      }
    }
  }, [currentUser?.id, currentSession?.token]);

  const handleNavigate = (page: string, params?: Record<string, string>) => {
    if (params?.areaId) {
      setSelectedAreaId(params.areaId);
    }
    if (params?.districtId) {
      setSelectedDistrictId(params.districtId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup_area' | 'signup_pastor') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleOpenStatusModal = (project: Project) => {
    setStatusModalProject(project);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditModalProject(project);
  };

  const handleProjectSelect = (project: Project) => {
    const fresh = projects.find((p) => p.id === project.id) || project;
    setSelectedProject(fresh);
  };

  // 1. GATEWAY: If no verified session exists, render the Login / Request Access screen
  if (!currentSession || !currentUser) {
    if (authView === 'request_access') {
      return <RequestAccessScreen onBackToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginScreen
        onRequestAccess={() => setAuthView('request_access')}
        onLoginSuccess={(role) => {
          if (role === 'super_admin') setCurrentPage('admin');
          else if (role === 'area_head') setCurrentPage('area_head');
          else setCurrentPage('pastor');
        }}
      />
    );
  }

  // 2. AUTHENTICATED APP: Session is active
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenUploadModal={() => setShowUploadModal(true)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* If user is in pending status and tries to access their dashboard, show pending view */}
        {currentUser.status === 'pending' && currentPage !== 'feed' && currentPage !== 'directory' && (
          <PendingApprovalView onNavigate={handleNavigate} />
        )}

        {/* Regular Pages */}
        {(currentUser.status === 'approved' || currentPage === 'feed' || currentPage === 'directory') && (
          <>
            {currentPage === 'feed' && (
              <NationalFeedPage
                onSelectProject={handleProjectSelect}
                onOpenStatusModal={handleOpenStatusModal}
                onOpenUploadModal={() => setShowUploadModal(true)}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {currentPage === 'pastor' && (
              <PastorDashboardPage
                onSelectProject={handleProjectSelect}
                onOpenStatusModal={handleOpenStatusModal}
                onOpenUploadModal={() => setShowUploadModal(true)}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'area_head' && (
              <AreaHeadDashboardPage
                onSelectProject={handleProjectSelect}
                onOpenStatusModal={handleOpenStatusModal}
                onOpenUploadModal={() => setShowUploadModal(true)}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'admin' && (
              <SuperAdminDashboardPage
                onSelectProject={handleProjectSelect}
                onOpenStatusModal={handleOpenStatusModal}
                onOpenUploadModal={() => setShowUploadModal(true)}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'access_log' && (
              <AccessLogPage onBack={() => handleNavigate('admin')} />
            )}

            {currentPage === 'area_profile' && (
              <AreaProfilePage
                areaId={selectedAreaId}
                onBack={() => handleNavigate('feed')}
                onSelectProject={handleProjectSelect}
                onOpenStatusModal={handleOpenStatusModal}
                onNavigateDistrict={(dId) => {
                  setSelectedDistrictId(dId);
                  handleNavigate('district_profile');
                }}
              />
            )}

            {currentPage === 'district_profile' && (
              <DistrictProfilePage
                districtId={selectedDistrictId}
                onBack={() => handleNavigate('area_profile', { areaId: selectedAreaId })}
                onSelectProject={handleProjectSelect}
                onOpenStatusModal={handleOpenStatusModal}
              />
            )}

            {currentPage === 'directory' && (
              <DirectoryPage
                onNavigateArea={(aId) => {
                  setSelectedAreaId(aId);
                  handleNavigate('area_profile');
                }}
                onNavigateDistrict={(dId) => {
                  setSelectedDistrictId(dId);
                  handleNavigate('district_profile');
                }}
              />
            )}

            {currentPage === 'pending' && (
              <PendingApprovalView onNavigate={handleNavigate} />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenStatusModal={(proj) => {
          setSelectedProject(null);
          setStatusModalProject(proj);
        }}
        onOpenEditModal={(proj) => {
          setSelectedProject(null);
          setEditModalProject(proj);
        }}
      />

      <UploadProjectModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={(projectId) => {
          const fresh = projects.find((p) => p.id === projectId);
          if (fresh) setSelectedProject(fresh);
        }}
      />

      <EditProjectModal
        project={editModalProject}
        onClose={() => setEditModalProject(null)}
        onSuccess={() => {
          if (selectedProject && editModalProject && selectedProject.id === editModalProject.id) {
            const fresh = projects.find((p) => p.id === editModalProject.id);
            if (fresh) setSelectedProject(fresh);
          }
        }}
      />

      <StatusUpdateModal
        project={statusModalProject}
        onClose={() => setStatusModalProject(null)}
      />

      <AuthModal
        isOpen={showAuthModal}
        initialMode={authModalMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(targetPage) => handleNavigate(targetPage)}
      />

      {/* Corporate Church Footer */}
      <footer className="bg-cop-blue-950 text-white border-t border-cop-gold-500/20 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10 text-xs">
            {/* Col 1: Emblem & Bio */}
            <div className="md:col-span-2 space-y-3">
              <CopLogo size="md" showText={true} textColor="white" />
              <p className="text-slate-300 max-w-md leading-relaxed">
                COP Connect is the verified internal collaboration and project monitoring network for
                The Church of Pentecost worldwide. Connecting Areas, Districts, and Ministers to
                turn local progress into a shared, visible national picture.
              </p>
              <div className="text-cop-gold-400 font-bold tracking-wide">
                Vision 2028: Possessing the Nations (Equipping the Church to Transform Society)
              </div>
            </div>

            {/* Col 2: Hierarchy */}
            <div className="space-y-2.5">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Hierarchy Links
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>General Headquarters (Super Admin)</li>
                <li>Areas Directorate (Apostles)</li>
                <li>Districts Directorate (Pastors)</li>
                <li>Local Assemblies & Ministries</li>
              </ul>
            </div>

            {/* Col 3: Principles & Brand */}
            <div className="space-y-2.5">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Official Emblem
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Emblem colors strictly adhere to church tenets: Ultramarine Blue (Heavenly peace &
                order), Golden Yellow (Glorious church), White (Righteousness), and Red Fire
                (Blood of Christ & Holy Ghost power).
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} The Church of Pentecost &bull; COP Connect Platform.
              All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-cop-gold-400 font-semibold">
              <span>Verified Ministerial Network</span>
              <span>•</span>
              <span>Internal Church Intranet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
