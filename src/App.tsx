import React, { useState } from 'react';
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

export const App: React.FC = () => {
  // App navigation state: 'landing' | 'login' | 'register' | 'main' | 'admin'
  const [appScreen, setAppScreen] = useState<'landing' | 'login' | 'register' | 'main' | 'admin'>('landing');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'tests' | 'interview' | 'tips' | 'profile'>('home');
  const [activeSubView, setActiveSubView] = useState<TestCategory | null>(null);
  
  // User profile
  const [userName, setUserName] = useState<string>('Ahmad Fauzi');
  const [targetRole, setTargetRole] = useState<TargetRole>('operator');

  // Tryout modal state
  const [isTryoutOpen, setIsTryoutOpen] = useState<boolean>(false);

  const handleStartFromLanding = () => {
    sounds.playClick();
    setAppScreen('main');
    setActiveNavTab('home');
  };

  const handleLoginFromLanding = () => {
    sounds.playClick();
    setAppScreen('login');
  };

  const handleSuccessLogin = (user: { name: string; targetRole: TargetRole }) => {
    setUserName(user.name);
    setTargetRole(user.targetRole);
    setAppScreen('main');
    setActiveNavTab('home');
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
      />
    );
  }

  // 2. LANDING / SALES PAGE (App Opening Experience)
  if (appScreen === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-slate-900 shadow-2xl flex flex-col justify-between">
          <LandingPage
            onStart={handleStartFromLanding}
            onLogin={handleLoginFromLanding}
          />
        </div>
      </div>
    );
  }

  // 3. LOGIN & REGISTER SCREENS
  if (appScreen === 'login' || appScreen === 'register') {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-slate-900 shadow-2xl flex flex-col justify-between">
          <AuthPage
            initialMode={appScreen}
            onSuccessLogin={handleSuccessLogin}
            onBackToLanding={() => {
              sounds.playClick();
              setAppScreen('landing');
            }}
          />
        </div>
      </div>
    );
  }

  // 4. MAIN SMARTPHONE APP SHELL (Native Mobile Experience)
  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center sm:py-4">
      
      {/* Smartphone Frame Container */}
      <div className="w-full max-w-md h-screen sm:h-[90vh] sm:max-h-[860px] bg-slate-50 sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col justify-between relative border border-slate-800/20">
        
        {/* Mobile Top Header Bar */}
        <MobileTopBar
          title={activeSubView ? getSubViewTitle(activeSubView) : undefined}
          showBack={activeSubView !== null}
          onBack={() => {
            sounds.playClick();
            setActiveSubView(null);
          }}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          userName={userName}
          onOpenTryout={() => setIsTryoutOpen(true)}
        />

        {/* Scrollable / Flexible Mobile Viewport */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50 flex flex-col">
          
          {/* Sub Views (Running tests) */}
          {activeSubView === 'kraepelin' && (
            <KraepelinSimulator />
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
                  targetRole={targetRole}
                  userName={userName}
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
                    targetRole={targetRole} 
                    setTargetRole={setTargetRole}
                  />
                </div>
              )}

              {activeNavTab === 'tips' && (
                <div className="p-4 pb-20">
                  <TipsHub />
                </div>
              )}

              {activeNavTab === 'profile' && (
                <MobileProfileTab
                  userName={userName}
                  targetRole={targetRole}
                  setTargetRole={setTargetRole}
                  onLogout={() => {
                    sounds.playClick();
                    setAppScreen('landing');
                  }}
                  onOpenAdmin={() => {
                    sounds.playClick();
                    setAppScreen('admin');
                  }}
                />
              )}
            </>
          )}

        </main>

        {/* Sticky Mobile Bottom Tab Navigation - Hidden automatically during test subviews for full-screen keyboard immersion */}
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
