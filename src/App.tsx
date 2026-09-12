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
import { AiInterviewComingSoon } from './components/interview/AiInterviewComingSoon';
import { StudentRaporModal } from './components/rapor/StudentRaporModal';
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

  // Student official rapor modal state
  const [isStudentRaporOpen, setIsStudentRaporOpen] = useState<boolean>(false);

  // Main scroll viewport ref
  const mainScrollRef = React.useRef<HTMLElement | null>(null);

  // Reset scroll position to top whenever tab or subview changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeNavTab, activeSubView]);

  // Exit Toast state for double-back on root
  const [showExitToast, setShowExitToast] = useState<boolean>(false);
  const exitToastTimerRef = React.useRef<any>(null);
  const lastBackPressTimeRef = React.useRef<number>(0);

  // Sync refs for popstate event listener
  const appScreenRef = React.useRef(appScreen);
  appScreenRef.current = appScreen;

  const activeNavTabRef = React.useRef(activeNavTab);
  activeNavTabRef.current = activeNavTab;

  const activeSubViewRef = React.useRef(activeSubView);
  activeSubViewRef.current = activeSubView;

  const isTryoutOpenRef = React.useRef(isTryoutOpen);
  isTryoutOpenRef.current = isTryoutOpen;

  const isStudentRaporOpenRef = React.useRef(isStudentRaporOpen);
  isStudentRaporOpenRef.current = isStudentRaporOpen;

  // Intercept Mobile Hardware / Browser Back Button
  useEffect(() => {
    // Push an initial history entry to establish the trap
    window.history.pushState({ siapkerja_nav: true }, '');

    const handlePopState = () => {
      // Re-push immediately so subsequent back presses can still be trapped
      window.history.pushState({ siapkerja_nav: true }, '');

      // 1. Dispatch custom event for child modals (e.g. video player in TipsHub, modals in Admin)
      const customEvent = new CustomEvent('app_hardware_back', { cancelable: true });
      window.dispatchEvent(customEvent);

      if (customEvent.defaultPrevented) {
        return;
      }

      // 2. Check top-level modals in App.tsx
      if (isTryoutOpenRef.current) {
        setIsTryoutOpen(false);
        return;
      }

      if (isStudentRaporOpenRef.current) {
        setIsStudentRaporOpen(false);
        return;
      }

      // 3. Check active test sub-view (Kraepelin, QC, Math, etc.)
      if (activeSubViewRef.current !== null) {
        sounds.playClick();
        setActiveSubView(null);
        return;
      }

      // 4. Check active navigation tab (if on 'tests', 'interview', 'tips', or 'profile' -> return to 'home' dashboard)
      if (appScreenRef.current === 'main' && activeNavTabRef.current !== 'home') {
        sounds.playClick();
        setActiveNavTab('home');
        return;
      }

      // 5. Check auth screens (if on 'login' or 'register' -> return to 'landing')
      if (appScreenRef.current === 'login' || appScreenRef.current === 'register') {
        sounds.playClick();
        setAppScreen('landing');
        return;
      }

      // 6. If on Admin dashboard, let AdminDashboard handle it
      if (appScreenRef.current === 'admin') {
        return;
      }

      // 7. Root reached (on 'home' dashboard or 'landing' with no modals/subviews): double back to exit app
      const now = Date.now();
      if (now - lastBackPressTimeRef.current < 2000) {
        // Double back pressed within 2 seconds: allow exit!
        window.history.go(-2);
      } else {
        lastBackPressTimeRef.current = now;
        setShowExitToast(true);
        if (exitToastTimerRef.current) {
          clearTimeout(exitToastTimerRef.current);
        }
        exitToastTimerRef.current = setTimeout(() => {
          setShowExitToast(false);
        }, 2000);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (exitToastTimerRef.current) {
        clearTimeout(exitToastTimerRef.current);
      }
    };
  }, []);

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

  const handleFinishKraepelin = (_analysis: any) => {
    if (currentUser) {
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

  const userTargetRole: TargetRole = currentUser?.targetRole || 'operator';
  const userNameString: string = currentUser?.name || 'Peserta SMK';

  const renderScreen = () => {
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
                    onOpenRapor={() => {
                      sounds.playClick();
                      setIsStudentRaporOpen(true);
                    }}
                  />
                )}

                {activeNavTab === 'tests' && (
                  <MobileModulesTab
                    onSelectTest={handleSelectModule}
                    isAdmin={Boolean(currentUser?.isAdmin)}
                  />
                )}

                {activeNavTab === 'interview' && (
                  <div className="w-full px-1 sm:px-3 pt-1 pb-24">
                    {currentUser?.isAdmin ? (
                      <AiInterviewSimulator 
                        targetRole={userTargetRole} 
                        isAdmin={true}
                        setTargetRole={(r) => {
                          if (currentUser) {
                            updateActiveUserScore({ targetRole: r });
                            setCurrentUser(getActiveSession());
                          }
                        }}
                      />
                    ) : (
                      <AiInterviewComingSoon
                        onExploreTests={() => {
                          sounds.playClick();
                          setActiveNavTab('tests');
                        }}
                        onExploreTips={() => {
                          sounds.playClick();
                          setActiveNavTab('tips');
                        }}
                      />
                    )}
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
                    onOpenRapor={() => {
                      sounds.playClick();
                      setIsStudentRaporOpen(true);
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
              isAdmin={Boolean(currentUser?.isAdmin)}
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

          {/* Global Student Official Rapor & PDF Modal */}
          <StudentRaporModal
            isOpen={isStudentRaporOpen}
            onClose={() => setIsStudentRaporOpen(false)}
            student={currentUser}
          />

        </div>

      </div>
    );
  };

  return (
    <>
      {renderScreen()}

      {/* Floating Double-Back Exit Toast */}
      {showExitToast && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-slate-900/95 text-white border border-slate-700 text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Tekan sekali lagi untuk keluar dari aplikasi</span>
        </div>
      )}
    </>
  );
};

export default App;
