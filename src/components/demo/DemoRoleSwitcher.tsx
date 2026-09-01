import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, UserCheck, Users, Clock, Sparkles, ChevronDown, Check, UserPlus } from 'lucide-react';

interface DemoRoleSwitcherProps {
  onOpenAuthModal: (mode: 'login' | 'signup_area' | 'signup_pastor') => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onOpenAuthModal }) => {
  const { currentUser, loginAs } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const demoAccounts = [
    {
      id: 'usr_super_admin',
      role: 'Super Admin',
      name: 'Rev. Dr. Boakye',
      position: 'National Head Office',
      icon: Shield,
      badgeColor: 'bg-red-500 text-white',
      desc: 'Approves Area Heads, views all Areas & national analytics',
    },
    {
      id: 'usr_area_kaneshie',
      role: 'Area Head',
      name: 'Apostle Gyasi',
      position: 'Kaneshie Area (Accra)',
      icon: UserCheck,
      badgeColor: 'bg-cop-blue-700 text-white',
      desc: 'Manages 14 Districts, approves applicant pastors, posts area updates',
    },
    {
      id: 'usr_pastor_kaneshie_central',
      role: 'District Pastor',
      name: 'Pastor Mensah-Bonsu',
      position: 'Kaneshie Central District',
      icon: Users,
      badgeColor: 'bg-cop-gold-600 text-white',
      desc: 'Posts Cathedral building updates, manages district projects',
    },
    {
      id: 'usr_pending_area_head',
      role: 'Pending Area Head',
      name: 'Apostle Ayani',
      position: 'Cape Coast Area (Pending)',
      icon: Clock,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Awaiting National Super Admin verification',
    },
    {
      id: 'usr_pending_pastor',
      role: 'Pending Pastor',
      name: 'Pastor Gabriel Antwi',
      position: 'Darkuman District (Pending)',
      icon: Clock,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Awaiting Apostle Gyasi (Kaneshie Area Head) approval',
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-cop-blue-900 text-white shadow-cop-lg hover:bg-cop-blue-800 transition-all border border-cop-gold-500/50 group"
          title="Switch Demo Persona"
        >
          <Sparkles className="w-4 h-4 text-cop-gold-400 animate-pulse" />
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-cop-gold-300 uppercase font-bold tracking-wider leading-none">
              Persona Switcher
            </div>
            <div className="text-xs font-semibold truncate max-w-[140px] text-slate-100">
              {currentUser ? currentUser.fullName.split(' ')[0] + ' (' + currentUser.role.replace('_', ' ') + ')' : 'Select Role'}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute bottom-12 right-0 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-gradient-to-r from-cop-blue-900 to-cop-blue-800 p-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cop-gold-400" />
                <span className="font-heading font-bold text-sm">Interactive Persona Switcher</span>
              </div>
              <span className="text-[10px] bg-cop-gold-500/20 text-cop-gold-300 px-2 py-0.5 rounded-full font-medium">
                Live Trust Chain Demo
              </span>
            </div>

            <div className="p-2 divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = currentUser?.id === acc.id;

                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      loginAs(acc.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cop-blue-50/80 border border-cop-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-cop-blue-900 flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${acc.badgeColor}`}>
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-cop-blue-800 font-medium truncate">
                        {acc.position}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {acc.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-cop-blue-700 flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Registration Actions */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenAuthModal('signup_pastor');
                  setIsOpen(false);
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:border-cop-blue-700 text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 text-cop-blue-700" />
                Sign Up as Pastor
              </button>
              <button
                onClick={() => {
                  onOpenAuthModal('signup_area');
                  setIsOpen(false);
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:border-cop-blue-700 text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-cop-gold-600" />
                Sign Up Area Head
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
