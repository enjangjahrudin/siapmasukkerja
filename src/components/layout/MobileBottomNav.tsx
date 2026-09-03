import React from 'react';
import { 
  Home, 
  Layers, 
  Mic, 
  BookOpen, 
  User, 
  Award,
  Sparkles
} from 'lucide-react';

export type MainNavTab = 'home' | 'tests' | 'interview' | 'tips' | 'profile';

interface MobileBottomNavProps {
  activeNavTab: MainNavTab;
  setActiveNavTab: (tab: MainNavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeNavTab,
  setActiveNavTab
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Beranda', icon: Home },
    { id: 'tests' as const, label: 'Modul Tes', icon: Layers },
    { id: 'interview' as const, label: 'AI Interview', icon: Mic, isAi: true },
    { id: 'tips' as const, label: 'Tips & Trik', icon: BookOpen },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-brand-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {tab.isAi && (
                <span className="absolute -top-1.5 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-xs">
                  AI
                </span>
              )}
              
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-brand-50 text-brand-600 scale-110' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
