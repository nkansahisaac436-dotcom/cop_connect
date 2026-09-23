import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { CopLogo } from '../../assets/CopLogo';
import { 
  PlusCircle, 
  Bell, 
  Globe, 
  LogOut, 
  Shield, 
  UserCheck, 
  Users, 
  Layers, 
  ExternalLink,
  ChevronDown,
  CheckCircle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenUploadModal,
}) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const { language, setLanguage, t } = useLanguage();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // User-specific notifications
  const userNotifications = notifications.filter(
    (n) => !currentUser || n.userId === currentUser.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getRoleBadge = () => {
    if (!currentUser) return null;
    if (currentUser.role === 'super_admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          <Shield className="w-3 h-3" />
          Super Admin
        </span>
      );
    }
    if (currentUser.role === 'area_head') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cop-blue-100 text-cop-blue-800 border border-cop-blue-200">
          <UserCheck className="w-3 h-3" />
          Area Head
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cop-gold-100 text-cop-gold-900 border border-cop-gold-300">
        <Users className="w-3 h-3" />
        District Pastor
      </span>
    );
  };

  const getDashboardPage = () => {
    if (!currentUser) return 'feed';
    if (currentUser.role === 'super_admin') return 'admin';
    if (currentUser.role === 'area_head') return 'area_head';
    return 'pastor';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner for COP Identification */}
      <div className="bg-gradient-to-r from-cop-blue-900 via-cop-blue-800 to-cop-blue-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cop-gold-400 animate-pulse"></span>
          <span className="font-medium tracking-wide">
            THE CHURCH OF PENTECOST &bull; NATIONAL & INTERNATIONAL COLLABORATION NETWORK
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-cop-gold-300 font-medium">
          <span>Vision 2028: Possessing the Nations</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-cop-gold-400" />
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="hover:underline font-bold text-white uppercase text-[11px]"
            >
              {language === 'en' ? 'Français' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <CopLogo size="md" showText={true} textColor="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('feed')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentPage === 'feed'
                  ? 'bg-cop-blue-50 text-cop-blue-800 font-bold border border-cop-blue-200'
                  : 'text-slate-600 hover:text-cop-blue-800 hover:bg-slate-50'
              }`}
            >
              {t('national_feed')}
            </button>

            {currentUser && currentUser.status === 'approved' && (
              <button
                onClick={() => onNavigate(getDashboardPage())}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  ['pastor', 'area_head', 'admin'].includes(currentPage)
                    ? 'bg-cop-blue-50 text-cop-blue-800 font-bold border border-cop-blue-200'
                    : 'text-slate-600 hover:text-cop-blue-800 hover:bg-slate-50'
                }`}
              >
                {currentUser.role === 'super_admin'
                  ? t('super_admin_dashboard')
                  : currentUser.role === 'area_head'
                  ? t('area_head_dashboard')
                  : t('pastor_dashboard')}
              </button>
            )}

            {currentUser && currentUser.status === 'pending' && (
              <button
                onClick={() => onNavigate('pending')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === 'pending'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  {t('pending_status')}
                </span>
              </button>
            )}

            <button
              onClick={() => onNavigate('directory')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentPage === 'directory'
                  ? 'bg-cop-blue-50 text-cop-blue-800 font-bold border border-cop-blue-200'
                  : 'text-slate-600 hover:text-cop-blue-800 hover:bg-slate-50'
              }`}
            >
              Areas Directory
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Upload Project Button */}
            {currentUser && currentUser.status === 'approved' && (
              <button
                onClick={onOpenUploadModal}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cop-blue-800 to-cop-blue-700 hover:from-cop-blue-900 hover:to-cop-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-cop transition-all border border-cop-gold-500/40"
              >
                <PlusCircle className="w-4 h-4 text-cop-gold-400" />
                <span>{t('upload_project')}</span>
              </button>
            )}

            {/* Notifications Popover */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifs(!showNotifs);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-cop-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-slate-900">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-cop-red-50 text-cop-red-600 font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsAsRead(currentUser.id)}
                          className="text-xs font-semibold text-cop-blue-700 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No notifications yet.
                        </div>
                      ) : (
                        userNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.link) {
                                const page = notif.link.split('?')[0].replace('/', '');
                                onNavigate(page || 'feed');
                              }
                              setShowNotifs(false);
                            }}
                            className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                              !notif.read ? 'bg-cop-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-xs text-slate-900">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {formatRelativeTime(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifs(false);
                  }}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                >
                  <img
                    src={
                      currentUser.profilePhoto ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                    }
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-cop-gold-500"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]">
                      {currentUser.districtName || currentUser.areaName || 'Headquarters'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 bg-gradient-to-br from-cop-blue-900 to-cop-blue-800 text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            currentUser.profilePhoto ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                          }
                          alt={currentUser.fullName}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-cop-gold-400"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-heading font-bold text-sm truncate">
                            {currentUser.fullName}
                          </div>
                          <div className="text-xs text-cop-gold-300 font-medium truncate">
                            {currentUser.email}
                          </div>
                          <div className="mt-1">{getRoleBadge()}</div>
                        </div>
                      </div>

                      {/* Hierarchy assignment info */}
                      <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-slate-200">
                        {currentUser.areaName && (
                          <div>
                            <span className="text-cop-gold-300 font-semibold">Area:</span>{' '}
                            {currentUser.areaName}
                          </div>
                        )}
                        {currentUser.districtName && (
                          <div>
                            <span className="text-cop-gold-300 font-semibold">District:</span>{' '}
                            {currentUser.districtName}
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-slate-300">
                          {currentUser.status === 'approved' ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>Verified Member</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Pending Verification</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate(getDashboardPage());
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
                        >
                          <span>My Leadership Dashboard</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {currentUser.areaId && (
                          <button
                            onClick={() => {
                              onNavigate('area_profile', { areaId: currentUser.areaId! });
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
                          >
                            <span>View Area Profile</span>
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-cop-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {showMobileNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileNav && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1 animate-in fade-in">
            <button
              onClick={() => {
                onNavigate('feed');
                setShowMobileNav(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('national_feed')}
            </button>

            {currentUser && currentUser.status === 'approved' && (
              <button
                onClick={() => {
                  onNavigate(getDashboardPage());
                  setShowMobileNav(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                {currentUser.role === 'super_admin'
                  ? t('super_admin_dashboard')
                  : currentUser.role === 'area_head'
                  ? t('area_head_dashboard')
                  : t('pastor_dashboard')}
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('directory');
                setShowMobileNav(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Areas Directory
            </button>

            {currentUser && currentUser.status === 'approved' && (
              <button
                onClick={() => {
                  onOpenUploadModal();
                  setShowMobileNav(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-cop-blue-700 bg-cop-blue-50 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {t('upload_project')}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
