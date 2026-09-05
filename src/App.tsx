import React, { useState, useEffect } from 'react';
import { TargetRole, TestCategory } from './types';
import { LandingPage } from './components/auth/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { MobileTopBar } from './components/layout/MobileTopBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileHomeDashboard } from './components/dashboard/MobileHomeDashboard';
import { MobileModulesTab } from './components/modules/MobileModulesTab';
import { MobileProfileTab } from './components/profile/MobileProfileTab';
import { KraepelinSimulator } from './components/kraepelin/KraepelinSimulator';
import { QcAccuracyTest } from './components/qc-test/QcAccuracyTest';
import { MechanicalTest } from './components/mechanical/MechanicalTest';
import { ArithmeticTest } from './components/arithmetic/ArithmeticTest';
import { BasicMathTest } from './components/math/BasicMathTest';
import { MultiplicationBlitzTest } from './components/multiplication/MultiplicationBlitzTest';
import { PsychotestHub } from './components/psychotest/PsychotestHub';
import { WarteggCanvas } from './components/wartegg/WarteggCanvas';
import { TipsHub } from './components/tips/TipsHub';
import { AiInterviewSimulator } from './components/interview/AiInterviewSimulator';
import { FullTryoutModal } from './components/tryout/FullTryoutModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { sounds } from './utils/sound-effects';
import { 
  getActiveSession, 
  setActiveSession, 
  logoutSession, 
  updateActiveUserScore, 
  RegisteredUser 
} from './utils/auth-storage';

import { useTheme } from './utils/theme-context';

export const App: React.FC = () => {
  const { isDark } = useTheme();
  // Check persisted session on startup
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => getActiveSession());
  
  // App navigation state: 'landing' | 'login' | 'register' | 'main' | 'admin'
  const [appScreen, setAppScreen] = useState<'landing' | 'login' | 'register' | 'main' | 'admin'>(() => {
    const session = getActiveSession();
    if (!session) return 'landing';
    return session.isAdmin ? 'admin' : 'main';
  });

  const [activeNavTab, setActiveNavTab] = useState<'home' | 'tests' | 'interview' | 'tips' | 'profile'>('home');
  const [activeSubView, setActiveSubView] = useState<TestCategory | null>(null);
  
  // Tryout modal state
  const [isTryoutOpen, setIsTryoutOpen] = useState<boolean>(false);

  // Main scroll viewport ref
  const mainScrollRef = React.useRef<HTMLElement | null>(null);

  // Reset scroll position to top whenever tab or subview changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeNavTab, activeSubView]);

  const handleSuccessAuth = (user: RegisteredUser) => {
    setCurrentUser(user);
    if (user.isAdmin) {
      setAppScreen('admin');
    } else {
      setAppScreen('main');
      setActiveNavTab('home');
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    logoutSession();
    setCurrentUser(null);
    setActiveSubView(null);
    setAppScreen('landing');
  };

  const handleSelectModule = (test: TestCategory | 'tips' | 'tryout-full') => {
    sounds.playClick();
    if (test === 'tryout-full') {
      setIsTryoutOpen(true);
    } else if (test === 'interview') {
      setActiveNavTab('interview');
      setActiveSubView(null);
    } else if (test === 'tips') {
      setActiveNavTab('tips');
      setActiveSubView(null);
    } else {
      setActiveSubView(test);
    }
  };

  const handleFinishKraepelin = (analysis: any) => {
    if (currentUser) {
      updateActiveUserScore({
        kraepelinScore: {
          panker: analysis.panker,
          janker: analysis.janker,
          grade: analysis.statusGrade
        }
      });
      setCurrentUser(getActiveSession());
    }
  };

  const getSubViewTitle = (sub: TestCategory | null) => {
    switch (sub) {
      case 'kraepelin': return 'Tes Kraepelin & Pauli';
      case 'qc-accuracy': return 'Ketelitian Kode QC';
      case 'math-basic': return 'Matematika Dasar';
      case 'multiplication-table': return 'Tabel Perkalian 2 Menit';
      case 'psychotest': return 'Psikotes & Penalaran';
      case 'mechanical': return 'Mekanika Bennett';
      case 'arithmetic': return 'Aritmatika & Deret';
      case 'wartegg': return 'Kanvas Tes Wartegg';
      case 'interview': return 'AI Voice Interview';
      default: return 'SMK — Siap Masuk Kerja';
    }
  };

  // 1. ADMIN COMMAND CENTER VIEW (Laptop / Desktop View)
  if (appScreen === 'admin') {
    return (
      <AdminDashboard
        onSwitchToMobileApp={() => {
          sounds.playClick();
          setAppScreen('main');
        }}
        onLogoutAdmin={handleLogout}
      />
    );
  }

  // 2. LANDING / SALES PAGE (Strict Entry Point)
  if (appScreen === 'landing') {
    return (
      <div className={`min-h-screen flex justify-center transition-colors duration-200 ${
        isDark ? 'bg-slate-950' : 'bg-slate-200'
      }`}>
        <div className={`w-full max-w-md min-h-screen shadow-2xl flex flex-col justify-between transition-colors duration-200 ${
          isDark ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
          <LandingPage
            onGoToRegister={() => {
              sounds.playClick();
              setAppScreen('register');
            }}
            onGoToLogin={() => {
              sounds.playClick();
              setAppScreen('login');
            }}
          />
        </div>
      </div>
    );
  }

  // 3. REGISTRATION & LOGIN SCREENS
  if (appScreen === 'login' || appScreen === 'register') {
    return (
      <div className={`min-h-screen flex justify-center transition-colors duration-200 ${
        isDark ? 'bg-slate-950' : 'bg-slate-200'
      }`}>
        <div className={`w-full max-w-md min-h-screen shadow-2xl flex flex-col justify-between transition-colors duration-200 ${
          isDark ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
          <AuthPage
            initialMode={appScreen}
            onSuccessLogin={handleSuccessAuth}
            onBackToLanding={() => {
              sounds.playClick();
              setAppScreen('landing');
            }}
          />
        </div>
      </div>
    );
  }

  // 4. MAIN SMARTPHONE APP SHELL (Requires Valid User Session)
  const userTargetRole: TargetRole = currentUser?.targetRole || 'operator';
  const userNameString: string = currentUser?.name || 'Peserta SMK';

  return (
    <div className={`min-h-screen flex justify-center items-center sm:py-4 transition-colors duration-200 ${
      isDark ? 'bg-slate-950' : 'bg-slate-200'
    }`}>
      
      {/* Smartphone Frame Container */}
      <div className={`w-full max-w-md h-screen sm:h-[90vh] sm:max-h-[860px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col justify-between relative border transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-300'
      }`}>
        
        {/* Mobile Top Header Bar */}
        <MobileTopBar
          title={activeSubView ? getSubViewTitle(activeSubView) : undefined}
          showBack={activeSubView !== null}
          onBack={() => {
            sounds.playClick();
            setActiveSubView(null);
          }}
          targetRole={userTargetRole}
          setTargetRole={(r) => {
            if (currentUser) {
              updateActiveUserScore({ targetRole: r });
              setCurrentUser(getActiveSession());
            }
          }}
          userName={userNameString}
          onOpenTryout={() => setIsTryoutOpen(true)}
        />

        {/* Scrollable / Flexible Mobile Viewport */}
        <main 
          ref={mainScrollRef}
          className={`flex-1 overflow-y-auto relative flex flex-col transition-colors duration-200 ${
            isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
          }`}
        >
          
          {/* Sub Views (Running tests) */}
          {activeSubView === 'kraepelin' && (
            <KraepelinSimulator onFinishTest={handleFinishKraepelin} />
          )}

          {activeSubView === 'qc-accuracy' && (
            <QcAccuracyTest />
          )}

          {activeSubView === 'math-basic' && (
            <BasicMathTest />
          )}

          {activeSubView === 'multiplication-table' && (
            <MultiplicationBlitzTest />
          )}

          {activeSubView === 'psychotest' && (
            <PsychotestHub />
          )}

          {activeSubView === 'mechanical' && (
            <MechanicalTest />
          )}

          {activeSubView === 'arithmetic' && (
            <ArithmeticTest />
          )}

          {activeSubView === 'wartegg' && (
            <WarteggCanvas />
          )}

          {/* Main 5 Navigation Tabs (Shown only when not in a test subview) */}
          {!activeSubView && (
            <>
              {activeNavTab === 'home' && (
                <MobileHomeDashboard
                  onSelectTest={handleSelectModule}
                  targetRole={userTargetRole}
                  userName={userNameString}
                />
              )}

              {activeNavTab === 'tests' && (
                <MobileModulesTab
                  onSelectTest={handleSelectModule}
                />
              )}

              {activeNavTab === 'interview' && (
                <div className="p-4 pb-20">
                  <AiInterviewSimulator 
                    targetRole={userTargetRole} 
                    setTargetRole={(r) => {
                      if (currentUser) {
                        updateActiveUserScore({ targetRole: r });
                        setCurrentUser(getActiveSession());
                      }
                    }}
                  />
                </div>
              )}

              {activeNavTab === 'tips' && (
                <div className="px-1 sm:px-3 pt-1 pb-24 w-full">
                  <TipsHub />
                </div>
              )}

              {activeNavTab === 'profile' && (
                <MobileProfileTab
                  userName={userNameString}
                  targetRole={userTargetRole}
                  setTargetRole={(r) => {
                    if (currentUser) {
                      updateActiveUserScore({ targetRole: r });
                      setCurrentUser(getActiveSession());
                    }
                  }}
                  onLogout={handleLogout}
                  onUpdateUser={(updatedUser) => {
                    setCurrentUser(updatedUser);
                  }}
                />
              )}
            </>
          )}

        </main>

        {/* Sticky Mobile Bottom Tab Navigation - Hidden during test subviews */}
        {!activeSubView && (
          <MobileBottomNav
            activeNavTab={activeNavTab}
            setActiveNavTab={(tab: 'home' | 'tests' | 'interview' | 'tips' | 'profile') => {
              sounds.playClick();
              setActiveNavTab(tab);
              setActiveSubView(null);
            }}
          />
        )}

        {/* Global CAT Tryout Modal */}
        <FullTryoutModal
          isOpen={isTryoutOpen}
          onClose={() => setIsTryoutOpen(false)}
        />

      </div>

    </div>
  );
};

export default App;
