import { useState, useEffect } from 'react';

// Global reference for BeforeInstallPromptEvent
let deferredPrompt: any = null;

// Listen for beforeinstallprompt event as early as possible
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent standard mini-infobar on mobile Chrome
    e.preventDefault();
    deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa_prompt_available'));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa_installed'));
    console.log('[PWA] Application successfully installed on device!');
  });
}

/**
 * Register Service Worker for PWA
 */
export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }
};

/**
 * Check if running in standalone PWA mode (already installed)
 */
export const isRunningStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Check if device is iOS (iPhone, iPad, iPod)
 */
export const isIosDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
};

/**
 * Trigger PWA installation prompt
 */
export const promptInstallApp = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
  if (!deferredPrompt) {
    return 'unsupported';
  }

  try {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choiceResult.outcome; // 'accepted' | 'dismissed'
  } catch (err) {
    console.warn('[PWA] Prompt error:', err);
    return 'unsupported';
  }
};

/**
 * React Hook for PWA installation state & actions
 */
export const usePwaInstall = () => {
  const [isStandalone, setIsStandalone] = useState<boolean>(() => isRunningStandalone());
  const [hasPrompt, setHasPrompt] = useState<boolean>(() => Boolean(deferredPrompt));
  const [isIos, setIsIos] = useState<boolean>(() => isIosDevice());

  useEffect(() => {
    const handlePromptAvailable = () => {
      setHasPrompt(true);
    };

    const handleInstalled = () => {
      setIsStandalone(true);
      setHasPrompt(false);
    };

    window.addEventListener('pwa_prompt_available', handlePromptAvailable);
    window.addEventListener('pwa_installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa_prompt_available', handlePromptAvailable);
      window.removeEventListener('pwa_installed', handleInstalled);
    };
  }, []);

  const install = async () => {
    return await promptInstallApp();
  };

  return {
    isStandalone,
    canInstall: hasPrompt || (!isStandalone && isIos),
    hasNativePrompt: hasPrompt,
    isIos,
    install
  };
};
