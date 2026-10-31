import { CapacitorHttp } from '@capacitor/core';

/**
 * Global API Base URL Configuration.
 * 
 * - In local Web Browser (Dev): defaults to '/api' (proxied via Vite).
 * - In Production (Web & Native Android APK): points to the production backend server,
 *   defaulting to 'https://siapkerja.buatdigital.id/api'.
 */
const DEFAULT_PROD_API = 'https://siapkerja.buatdigital.id/api';

export const isNativePlatform = (): boolean => {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  if (typeof win.Capacitor !== 'undefined') {
    if (typeof win.Capacitor.isNativePlatform === 'function') {
      return win.Capacitor.isNativePlatform();
    }
    if (typeof win.Capacitor.getPlatform === 'function') {
      return win.Capacitor.getPlatform() !== 'web';
    }
    return true;
  }
  if (win.location?.protocol === 'capacitor:' || win.location?.protocol === 'ionic:') {
    return true;
  }
  return false;
};

export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // In local development server, use Vite proxy /api
  if ((import.meta as any).env?.DEV) {
    return '/api';
  }
  // In production (both web deployment and Android APK), use the production API server
  return DEFAULT_PROD_API;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Native-Aware HTTP Requester.
 * When running inside a mobile WebView (Capacitor Android), standard browser fetch
 * sends Origin: https://localhost which triggers CORS blocks on remote servers.
 * Calling CapacitorHttp.request routes the HTTP request directly through native Android
 * Java networking (HttpURLConnection), completely bypassing browser CORS restrictions.
 */
export const universalFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;

  if (isNativePlatform() && (url.startsWith('http://') || url.startsWith('https://'))) {
    if (!(init?.body instanceof FormData)) {
      try {
        let data: any = undefined;
        if (init?.body) {
          if (typeof init.body === 'string') {
            try {
              data = JSON.parse(init.body);
            } catch {
              data = init.body;
            }
          } else {
            data = init.body;
          }
        }

        const headers: Record<string, string> = {
          'Origin': 'https://siapkerja.buatdigital.id'
        };

        if (init?.headers) {
          if (init.headers instanceof Headers) {
            init.headers.forEach((v, k) => { headers[k] = v; });
          } else if (Array.isArray(init.headers)) {
            init.headers.forEach(([k, v]) => { headers[k] = v; });
          } else {
            Object.assign(headers, init.headers);
          }
        }

        const res = await CapacitorHttp.request({
          url,
          method: (init?.method || 'GET').toUpperCase(),
          headers,
          data,
        });

        const isJson = typeof res.data === 'object' && res.data !== null;
        const responseBody = isJson ? JSON.stringify(res.data) : (typeof res.data === 'string' ? res.data : '');

        return {
          ok: res.status >= 200 && res.status < 300,
          status: res.status,
          statusText: String(res.status),
          headers: new Headers(res.headers as any),
          json: async () => isJson ? res.data : JSON.parse(responseBody || '{}'),
          text: async () => responseBody,
        } as Response;
      } catch (err) {
        console.warn('[universalFetch Native Exception, fallback to browser fetch]', err);
      }
    }
  }

  return window.fetch(input, init);
};

// Automatically intercept global window.fetch on native devices
if (typeof window !== 'undefined' && !(window as any).__fetch_intercepted__) {
  (window as any).__fetch_intercepted__ = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
    if (isNativePlatform() && (url.startsWith('http://') || url.startsWith('https://'))) {
      if (!(init?.body instanceof FormData)) {
        return universalFetch(input, init);
      }
    }
    return originalFetch(input, init);
  };
}
