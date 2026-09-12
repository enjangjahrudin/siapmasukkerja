import { TargetRole } from '../types';

export interface UserTestRecord {
  id: string;
  testType: 'math' | 'multiplication' | 'kraepelin' | 'qc' | 'psychotest' | 'mechanical' | 'spatial' | 'arithmetic' | 'wartegg' | 'tryout' | 'interview';
  testName: string;
  score: number; // 0 - 100
  totalQuestions?: number;
  correctAnswers?: number;
  completedAt: string;
  details?: Record<string, any>;
}

export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  school: string;
  npsn?: string; // Nomor Pokok Sekolah Nasional (dari Dapodik)
  major: string;
  height?: number; // Tinggi Badan (cm)
  weight?: number; // Berat Badan (kg)
  gender?: 'Laki-laki' | 'Perempuan'; // Jenis Kelamin
  avatarUrl?: string; // URL atau Base64 Foto Profil
  address?: string; // Alamat Lengkap
  password?: string;
  targetRole: TargetRole;
  targetCompany: string;
  createdAt: string;
  kraepelinScore?: { panker: number; janker: number; grade: string };
  qcAccuracy?: number;
  mathScore?: number;
  multiplicationScore?: { completed: number; correct: number; accuracy: number };
  psychotestScore?: number;
  mechanicalScore?: number;
  spatialScore?: number;
  arithmeticScore?: number;
  interviewScore?: number;
  interviewRubric?: { starScore?: number; vocalScore?: number; ethicsScore?: number; jobFitScore?: number; [key: string]: any };
  interviewTokens?: number; // Saldo Kredit / Token Simulasi AI Interview
  averageAccuracy?: number;
  passingPrediction?: number;
  overallStatus: 'Lolos Unggul' | 'Lolos Standar' | 'Perlu Latihan';
  completedTestsCount: number;
  testHistory?: UserTestRecord[];
  lastActive: string;
  isAdmin?: boolean;
}

const STORAGE_USERS_KEY = 'siapkerja_users_database';
const STORAGE_CURRENT_USER_KEY = 'siapkerja_active_session';
const STORAGE_PENDING_REGISTRATION_KEY = 'siapkerja_pending_registration_otp';
const STORAGE_PENDING_RESET_KEY = 'siapkerja_pending_reset_otp';
const API_BASE_URL = '/api';

export const initialDefaultUsers: RegisteredUser[] = [
  {
    id: 'SMK-2026-0891',
    name: 'Ahmad Fauzi',
    phone: '081234567891',
    email: 'ahmad.fauzi@smk.id',
    school: 'SMKN 1 Karawang',
    major: 'Teknik Mesin',
    password: 'password123',
    targetRole: 'operator',
    targetCompany: 'PT Astra Daihatsu Motor',
    createdAt: '2026-08-28T10:00:00.000Z',
    kraepelinScore: { panker: 17.2, janker: 96.5, grade: 'Sangat Baik' },
    qcAccuracy: 94,
    mathScore: 88,
    multiplicationScore: { completed: 62, correct: 60, accuracy: 97 },
    interviewScore: 88,
    overallStatus: 'Lolos Unggul',
    completedTestsCount: 14,
    lastActive: '5 menit lalu',
    isAdmin: false
  },
  {
    id: 'SMK-2026-0892',
    name: 'Siti Nurhaliza',
    phone: '081234567892',
    email: 'siti.nurhaliza@smk.id',
    school: 'SMKN 2 Cikarang',
    major: 'Elektronika Industri',
    password: 'password123',
    targetRole: 'qc',
    targetCompany: 'PT Epson Indonesia',
    createdAt: '2026-08-29T11:30:00.000Z',
    kraepelinScore: { panker: 15.8, janker: 98.0, grade: 'Sangat Baik' },
    qcAccuracy: 98,
    mathScore: 92,
    multiplicationScore: { completed: 70, correct: 68, accuracy: 97 },
    interviewScore: 91,
    overallStatus: 'Lolos Unggul',
    completedTestsCount: 18,
    lastActive: '12 menit lalu',
    isAdmin: false
  },
  {
    id: 'SMK-2026-0893',
    name: 'Rian Pratama',
    phone: '081234567893',
    email: 'rian.pratama@smk.id',
    school: 'SMK Taruna Karya 1',
    major: 'Teknik Otomotif',
    password: 'password123',
    targetRole: 'maintenance',
    targetCompany: 'PT Yamaha Motor Mfg',
    createdAt: '2026-08-29T14:15:00.000Z',
    kraepelinScore: { panker: 13.4, janker: 89.2, grade: 'Baik' },
    qcAccuracy: 86,
    mathScore: 78,
    multiplicationScore: { completed: 48, correct: 44, accuracy: 92 },
    interviewScore: 79,
    overallStatus: 'Lolos Standar',
    completedTestsCount: 9,
    lastActive: '28 menit lalu',
    isAdmin: false
  },
  {
    id: 'SMK-ADMIN-001',
    name: 'Super Administrator',
    phone: 'admin',
    email: 'admin@buatdigital.id',
    school: 'Management Pusat',
    major: 'Sistem Operasional',
    password: 'admin',
    targetRole: 'operator',
    targetCompany: 'HQ Siap Masuk Kerja',
    createdAt: '2026-08-01T00:00:00.000Z',
    overallStatus: 'Lolos Unggul',
    completedTestsCount: 0,
    lastActive: 'Sekarang',
    isAdmin: true
  }
];

export const getStoredUsers = (): RegisteredUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialDefaultUsers));
      return initialDefaultUsers;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialDefaultUsers;
  }
};

export const fetchRemoteUsers = async (): Promise<RegisteredUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/candidates`);
    if (response.ok) {
      const data = await response.json();
      if (data.candidates && Array.isArray(data.candidates)) {
        return data.candidates;
      }
    }
  } catch (err) {
    // Graceful fallback to local cache
  }
  return getStoredUsers();
};

export const saveUser = (user: RegisteredUser): void => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === user.id || u.phone === user.phone || (user.email && u.email === user.email));
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.unshift(user);
  }
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

export const getActiveSession = (): RegisteredUser | null => {
  try {
    const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const setActiveSession = (user: RegisteredUser): void => {
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
};

export const logoutSession = (): void => {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
};

// ----------------------------------------------------------------------------
// EMAIL VERIFICATION & OTP API SERVICES
// ----------------------------------------------------------------------------

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  school: string;
  npsn?: string; // Nomor Pokok Sekolah Nasional (Dapodik)
  major: string;
  password?: string;
  targetRole: TargetRole;
}

/**
 * Step 1: Send 6-digit OTP code to email for Registration
 */
export const requestRegistrationOtp = async (data: RegistrationData): Promise<{ 
  success: boolean; 
  message: string; 
  simulatedOtp?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-registration-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    let resData: any = {};
    try {
      resData = await response.json();
    } catch (_) {}

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || `Gagal mengirim kode verifikasi (HTTP ${response.status}).`
      };
    }

    // Save temporary local payload
    localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify({
      ...data,
      otp: resData.simulatedOtp || '123456',
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: resData.message || 'Kode verifikasi telah dikirim.',
      simulatedOtp: resData.simulatedOtp
    };
  } catch (err: any) {
    console.error('[Request Registration OTP Error]', err);
    return {
      success: false,
      message: `Tidak dapat terhubung ke server: ${err.message || 'Periksa koneksi internet Anda.'}`
    };
  }
};

/**
 * Step 2: Verify Registration OTP and Create User in Database
 */
export const verifyRegistrationOtp = async (email: string, otp: string): Promise<{ 
  success: boolean; 
  user?: RegisteredUser; 
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-registration-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() })
    });

    let resData: any = {};
    try {
      resData = await response.json();
    } catch (_) {}

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || 'Kode verifikasi salah atau sudah kadaluarsa (lebih dari 10 menit).'
      };
    }

    if (resData.user) {
      saveUser(resData.user);
      setActiveSession(resData.user);
      localStorage.removeItem(STORAGE_PENDING_REGISTRATION_KEY);
      return { success: true, user: resData.user, message: resData.message };
    }

    return { success: false, message: 'Data user tidak diterima dari server.' };
  } catch (err: any) {
    console.error('[Verify Registration OTP Error]', err);
    return {
      success: false,
      message: `Gagal terhubung ke server verifikasi: ${err.message || 'Koneksi terputus.'}`
    };
  }
};

/**
 * Step 3: Request Forgot Password OTP
 */
export const requestForgotPasswordOtp = async (identifier: string): Promise<{
  success: boolean;
  message: string;
  email?: string;
  maskedEmail?: string;
  simulatedOtp?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: identifier.trim() })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Akun tidak ditemukan.');
    }

    localStorage.setItem(STORAGE_PENDING_RESET_KEY, JSON.stringify({
      email: resData.email,
      otp: resData.simulatedOtp || '123456',
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: resData.message,
      email: resData.email,
      maskedEmail: resData.maskedEmail,
      simulatedOtp: resData.simulatedOtp
    };
  } catch (err: any) {
    // Local fallback
    const users = getStoredUsers();
    const clean = identifier.trim().toLowerCase();
    const found = users.find(u => u.phone === clean || u.email?.toLowerCase() === clean);

    if (!found || !found.email) {
      return { success: false, message: 'Nomor WhatsApp atau Email belum terdaftar di sistem.' };
    }

    const localOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const [uPart, dPart] = found.email.split('@');
    const masked = `${uPart.substring(0, 2)}***@${dPart}`;

    localStorage.setItem(STORAGE_PENDING_RESET_KEY, JSON.stringify({
      email: found.email,
      otp: localOtp,
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: `[Simulasi Mode] Kode reset kata sandi: ${localOtp} (dikirimkan ke email ${masked})`,
      email: found.email,
      maskedEmail: masked,
      simulatedOtp: localOtp
    };
  }
};

/**
 * Step 4: Confirm Password Reset with OTP & New Password
 */
export const confirmPasswordReset = async (email: string, otp: string, newPassword: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), newPassword })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Gagal mereset kata sandi.');
    }

    localStorage.removeItem(STORAGE_PENDING_RESET_KEY);
    return { success: true, message: resData.message };
  } catch (err: any) {
    // Local fallback
    const pending = localStorage.getItem(STORAGE_PENDING_RESET_KEY);
    if (pending) {
      const pData = JSON.parse(pending);
      if (pData.email.toLowerCase() === email.trim().toLowerCase() && pData.otp === otp.trim()) {
        const users = getStoredUsers();
        const user = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());
        if (user) {
          user.password = newPassword;
          saveUser(user);
          localStorage.removeItem(STORAGE_PENDING_RESET_KEY);
          return { success: true, message: 'Kata sandi berhasil diperbarui! Silakan login.' };
        }
      }
    }
    return { success: false, message: err.message || 'Kode verifikasi salah atau kadaluarsa.' };
  }
};

/**
 * Login user by Phone, Email, or Admin ID (API-first with offline fallback)
 */
export const loginUser = async (
  phoneOrEmail: string, 
  password?: string
): Promise<{ success: boolean; user?: RegisteredUser; message?: string }> => {
  const cleanInput = phoneOrEmail.trim().toLowerCase();

  // 1. Try Live Server Login (MySQL Database)
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanInput, password })
    });

    const resData = await response.json();
    if (response.ok && resData.user) {
      saveUser(resData.user);
      setActiveSession(resData.user);
      return { success: true, user: resData.user, message: resData.message };
    } else if (response.status === 401 || response.status === 404 || response.status === 400) {
      // If server returned specific message (e.g. wrong password or not found), respect it unless local has it
      if (response.status === 401) {
        return { success: false, message: resData.message || 'Kata sandi tidak sesuai.' };
      }
    }
  } catch (err) {
    // Offline / network failure -> fallback to local storage
  }

  // 2. Local Storage Cache Fallback
  const users = getStoredUsers();

  // Super Admin Login
  if (cleanInput === 'admin' || cleanInput === '080000000000' || cleanInput === 'admin@buatdigital.id') {
    const adminUser = users.find(u => u.isAdmin) || initialDefaultUsers.find(u => u.isAdmin)!;
    const expectedPassword = adminUser.password || 'admin';
    if (!password || password !== expectedPassword) {
      return { success: false, message: 'Kata sandi Admin salah. Silakan periksa kembali.' };
    }
    setActiveSession(adminUser);
    return { success: true, user: adminUser };
  }

  const found = users.find(u => u.phone === cleanInput || u.email?.toLowerCase() === cleanInput);
  if (!found) {
    return { success: false, message: 'Nomor WhatsApp atau Email belum terdaftar. Silakan registrasi terlebih dahulu.' };
  }

  if (password && found.password && found.password !== password) {
    return { success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali atau gunakan fitur Lupa Kata Sandi.' };
  }

  found.lastActive = 'Baru saja aktif';
  saveUser(found);
  setActiveSession(found);

  return { success: true, user: found };
};

export const updateActiveUserScore = (update: Partial<RegisteredUser>): void => {
  const current = getActiveSession();
  if (!current) return;

  const updated: RegisteredUser = { ...current, ...update };
  setActiveSession(updated);
  saveUser(updated);

  // Sync to server scores
  if (update.kraepelinScore) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'kraepelin',
        scoreSummary: `Tes Kraepelin (Panker ${update.kraepelinScore.panker} • Akurasi ${update.kraepelinScore.janker}%)`,
        scoreDetails: {
          score: Math.round(update.kraepelinScore.janker),
          accuracy: update.kraepelinScore.janker,
          panker: update.kraepelinScore.panker,
          janker: update.kraepelinScore.janker,
          grade: update.kraepelinScore.grade
        }
      })
    }).catch(() => {});
  }
  if (update.qcAccuracy !== undefined) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'qc',
        scoreSummary: `Akurasi QC ${update.qcAccuracy}%`,
        scoreDetails: { accuracy: update.qcAccuracy, score: update.qcAccuracy }
      })
    }).catch(() => {});
  }
  if (update.mathScore !== undefined) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'math',
        scoreSummary: `Matematika Dasar ${update.mathScore}/100`,
        scoreDetails: { score: update.mathScore }
      })
    }).catch(() => {});
  }
  if (update.multiplicationScore) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'multiplication',
        scoreSummary: `Perkalian Kilat ${update.multiplicationScore.accuracy}%`,
        scoreDetails: update.multiplicationScore
      })
    }).catch(() => {});
  }
  if (update.psychotestScore !== undefined) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'psychotest',
        scoreSummary: `Psikotes & Penalaran ${update.psychotestScore}/100`,
        scoreDetails: { score: update.psychotestScore }
      })
    }).catch(() => {});
  }
  if (update.mechanicalScore !== undefined) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'mechanical',
        scoreSummary: `Mekanika Bennett ${update.mechanicalScore}/100`,
        scoreDetails: { score: update.mechanicalScore }
      })
    }).catch(() => {});
  }
};

/**
 * Helper to deduplicate test history records
 */
export const deduplicateTestHistory = (records?: UserTestRecord[]): UserTestRecord[] => {
  if (!Array.isArray(records) || records.length === 0) return [];
  const seen = new Set<string>();
  const clean: UserTestRecord[] = [];

  for (const r of records) {
    if (!r) continue;
    // Normalized key based on testType, testName, score, and approximate time
    const timeKey = r.completedAt ? r.completedAt.substring(0, 16) : ''; // Minute resolution
    const key = `${r.testType}___${r.testName}___${r.score}___${timeKey}`;

    if (!seen.has(key)) {
      seen.add(key);
      clean.push(r);
    }
  }
  return clean;
};

/**
 * Synchronize only un-synced local test history records to the server database
 */
export const syncLocalTestScoresToServer = async (targetUser?: RegisteredUser): Promise<void> => {
  const user = targetUser || getActiveSession();
  if (!user || !user.id || user.isAdmin) return;

  if (Array.isArray(user.testHistory) && user.testHistory.length > 0) {
    const localOnlyRecords = user.testHistory.filter(r => r && r.id && !r.id.startsWith('score-'));
    for (const record of localOnlyRecords) {
      try {
        await fetch(`${API_BASE_URL}/user/record-test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            record,
            stats: {
              completedTestsCount: user.completedTestsCount,
              averageAccuracy: user.averageAccuracy,
              overallStatus: user.overallStatus
            }
          })
        });
      } catch (_) {}
    }
  }
};

/**
 * Fetch fresh User Profile directly from server MySQL database
 */
export const fetchUserProfile = async (userId: string): Promise<RegisteredUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile/${encodeURIComponent(userId)}`);
    if (response.ok) {
      const resData = await response.json();
      if (resData.user) {
        const current = getActiveSession();
        const incomingHistory = (resData.user.testHistory && resData.user.testHistory.length > 0)
          ? resData.user.testHistory
          : (current?.testHistory || []);

        const cleanHistory = deduplicateTestHistory(incomingHistory);

        // Merge server data with any existing local test history
        const merged: RegisteredUser = {
          ...resData.user,
          testHistory: cleanHistory,
          completedTestsCount: cleanHistory.length > 0 ? cleanHistory.length : (resData.user.completedTestsCount || 0),
          // Preserve local scores if server doesn't have them yet
          kraepelinScore: resData.user.kraepelinScore || current?.kraepelinScore,
          qcAccuracy: resData.user.qcAccuracy !== null && resData.user.qcAccuracy !== undefined ? resData.user.qcAccuracy : current?.qcAccuracy,
          mathScore: resData.user.mathScore !== null && resData.user.mathScore !== undefined ? resData.user.mathScore : current?.mathScore,
          multiplicationScore: resData.user.multiplicationScore || current?.multiplicationScore,
          psychotestScore: resData.user.psychotestScore !== null && resData.user.psychotestScore !== undefined ? resData.user.psychotestScore : current?.psychotestScore,
          mechanicalScore: resData.user.mechanicalScore !== null && resData.user.mechanicalScore !== undefined ? resData.user.mechanicalScore : current?.mechanicalScore,
          interviewScore: resData.user.interviewScore !== null && resData.user.interviewScore !== undefined ? resData.user.interviewScore : current?.interviewScore
        };

        saveUser(merged);
        if (current && current.id === userId) {
          setActiveSession(merged);
        }

        // NOTE: syncLocalTestScoresToServer is intentionally NOT called here to prevent duplicate runaway loops

        return merged;
      }
    }
  } catch (e) {
    // offline fallback
  }
  return getActiveSession();
};

/**
 * Update complete User Profile (School, Major, Height, Weight, Gender, Avatar, Address)
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<RegisteredUser>
): Promise<{ success: boolean; user?: RegisteredUser; message: string }> => {
  try {
    // 1. Optimistic update in local storage
    const current = getActiveSession();
    const updated: RegisteredUser = { ...(current || ({} as RegisteredUser)), ...profileData, id: userId };
    saveUser(updated);
    if (current && current.id === userId) {
      setActiveSession(updated);
    }

    // 2. Sync to API backend (MySQL)
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...profileData })
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.user) {
        saveUser(resData.user);
        setActiveSession(resData.user);
        return { success: true, user: resData.user, message: resData.message || 'Profil berhasil disimpan!' };
      }
    }

    return { success: true, user: updated, message: 'Profil berhasil disimpan.' };
  } catch (err: any) {
    const current = getActiveSession();
    const updated: RegisteredUser = { ...(current || ({} as RegisteredUser)), ...profileData, id: userId };
    saveUser(updated);
    if (current && current.id === userId) {
      setActiveSession(updated);
    }
    return { success: true, user: updated, message: 'Profil berhasil disimpan secara lokal.' };
  }
};

/**
 * Change password from profile tab (requires verification of current password)
 */
export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Gagal mengganti kata sandi.');
    }

    // Update local storage
    const users = getStoredUsers();
    const uIndex = users.findIndex(u => u.id === userId);
    if (uIndex >= 0) {
      users[uIndex].password = newPassword;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
    const current = getActiveSession();
    if (current && current.id === userId) {
      current.password = newPassword;
      setActiveSession(current);
    }

    return { success: true, message: resData.message || 'Kata sandi berhasil diperbarui!' };
  } catch (err: any) {
    // Local fallback check
    const current = getActiveSession();
    if (current && current.id === userId) {
      if (current.password && current.password !== currentPassword) {
        return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
      }
      current.password = newPassword;
      setActiveSession(current);
      saveUser(current);
      return { success: true, message: 'Kata sandi berhasil diperbarui!' };
    }
    return { success: false, message: err.message || 'Gagal mengubah kata sandi.' };
  }
};

/**
 * Calculate Realtime Statistics (Tests Completed, True Average Accuracy, Dynamic Passing Probability)
 */
export const calculateUserRealtimeStats = (user: RegisteredUser): {
  completedTestsCount: number;
  averageAccuracy: number;
  passingPrediction: number;
  overallStatus: 'Lolos Unggul' | 'Lolos Standar' | 'Perlu Latihan';
} => {
  const history = user.testHistory || [];

  // Calculate based on saved individual scores
  const availableScores: number[] = [];
  if (user.kraepelinScore?.janker !== undefined && user.kraepelinScore?.janker !== null) availableScores.push(Math.round(user.kraepelinScore.janker));
  if (user.qcAccuracy !== undefined && user.qcAccuracy !== null) availableScores.push(user.qcAccuracy);
  if (user.mathScore !== undefined && user.mathScore !== null) availableScores.push(user.mathScore);
  if (user.multiplicationScore?.accuracy !== undefined && user.multiplicationScore?.accuracy !== null) availableScores.push(user.multiplicationScore.accuracy);
  if (user.psychotestScore !== undefined && user.psychotestScore !== null) availableScores.push(user.psychotestScore);
  if (user.mechanicalScore !== undefined && user.mechanicalScore !== null) availableScores.push(user.mechanicalScore);
  if (user.interviewScore !== undefined && user.interviewScore !== null) availableScores.push(user.interviewScore);

  const testCount = history.length > 0 ? history.length : Math.max(availableScores.length, user.completedTestsCount || 0);

  if (testCount === 0 && availableScores.length === 0) {
    return {
      completedTestsCount: 0,
      averageAccuracy: 0,
      passingPrediction: 0,
      overallStatus: 'Perlu Latihan'
    };
  }

  // 1. Calculate weighted composite score across 6 industrial modules + interview
  const parts: { score: number; weight: number }[] = [];
  if (user.kraepelinScore?.janker !== undefined && user.kraepelinScore?.janker !== null) {
    parts.push({ score: Number(user.kraepelinScore.janker), weight: 0.20 });
  }
  if (user.qcAccuracy !== undefined && user.qcAccuracy !== null) {
    parts.push({ score: Number(user.qcAccuracy), weight: 0.20 });
  }
  if (user.mathScore !== undefined && user.mathScore !== null) {
    parts.push({ score: Number(user.mathScore), weight: 0.15 });
  }
  if (user.multiplicationScore?.accuracy !== undefined && user.multiplicationScore?.accuracy !== null) {
    parts.push({ score: Number(user.multiplicationScore.accuracy), weight: 0.15 });
  }
  if (user.psychotestScore !== undefined && user.psychotestScore !== null) {
    parts.push({ score: Number(user.psychotestScore), weight: 0.15 });
  }
  if (user.mechanicalScore !== undefined && user.mechanicalScore !== null) {
    parts.push({ score: Number(user.mechanicalScore), weight: 0.15 });
  }
  if (user.interviewScore !== undefined && user.interviewScore !== null) {
    parts.push({ score: Number(user.interviewScore), weight: 0.15 });
  }

  let composite = 0;
  if (parts.length > 0) {
    const totalWeight = parts.reduce((acc, p) => acc + p.weight, 0);
    const weightedSum = parts.reduce((acc, p) => acc + (p.score * p.weight), 0);
    composite = Math.round((weightedSum / totalWeight) * 10) / 10;
  } else if (history.length > 0) {
    const validScores = history.map(h => h.score).filter(s => typeof s === 'number' && !isNaN(s));
    if (validScores.length > 0) {
      composite = Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10;
    }
  }

  // 2. Dynamic Industrial Recruitment Passing Prediction (%)
  // Based on score benchmarks:
  // >= 80%: 88% - 98% prediction (Lolos Unggul)
  // 65% - 79%: 70% - 87% prediction (Lolos Standar)
  // < 65%: < 65% prediction (Perlu Latihan)
  let passingPred = 0;
  if (composite > 0) {
    if (composite >= 80) {
      passingPred = Math.min(99, Math.round(composite * 1.05));
    } else if (composite >= 65) {
      passingPred = Math.round(composite * 0.95);
    } else {
      passingPred = Math.round(composite * 0.80);
    }
  }

  // 3. Strict Industrial Benchmark Status
  // >= 80: Lolos Unggul (Grade A)
  // >= 65: Lolos Standar (Grade B)
  // < 65: Perlu Latihan (Grade C)
  let status: 'Lolos Unggul' | 'Lolos Standar' | 'Perlu Latihan' = 'Perlu Latihan';
  if (parts.length > 0 || history.length > 0) {
    if (composite >= 80) {
      status = 'Lolos Unggul';
    } else if (composite >= 65) {
      status = 'Lolos Standar';
    } else {
      status = 'Perlu Latihan';
    }
  }

  return {
    completedTestsCount: testCount,
    averageAccuracy: Math.round(composite),
    passingPrediction: passingPred,
    overallStatus: status
  };
};

/**
 * Centralized Real-time Test Result Recorder across all test modules
 */
export const recordUserTestResult = async (
  record: Omit<UserTestRecord, 'id' | 'completedAt'>
): Promise<RegisteredUser | null> => {
  const current = getActiveSession();
  if (!current) return null;

  const newRecord: UserTestRecord = {
    ...record,
    id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    completedAt: new Date().toISOString()
  };

  const existingHistory = Array.isArray(current.testHistory) ? current.testHistory : [];
  const cleanExisting = deduplicateTestHistory(existingHistory);
  const updatedHistory = [newRecord, ...cleanExisting].slice(0, 50); // Keep last 50 records

  // Update specific scores
  const updatedUser: RegisteredUser = {
    ...current,
    testHistory: updatedHistory,
    completedTestsCount: updatedHistory.length,
    lastActive: 'Baru saja'
  };

  if (record.testType === 'math') updatedUser.mathScore = record.score;
  if (record.testType === 'qc') updatedUser.qcAccuracy = record.score;
  if (record.testType === 'psychotest') updatedUser.psychotestScore = record.score;
  if (record.testType === 'mechanical') updatedUser.mechanicalScore = record.score;
  if (record.testType === 'spatial') updatedUser.spatialScore = record.score;
  if (record.testType === 'arithmetic') updatedUser.arithmeticScore = record.score;
  if (record.testType === 'kraepelin' && record.details) updatedUser.kraepelinScore = record.details as any;
  if (record.testType === 'multiplication' && record.details) updatedUser.multiplicationScore = record.details as any;

  // Recalculate stats
  const stats = calculateUserRealtimeStats(updatedUser);
  updatedUser.averageAccuracy = stats.averageAccuracy;
  updatedUser.passingPrediction = stats.passingPrediction;
  updatedUser.overallStatus = stats.overallStatus;

  // Persist locally
  setActiveSession(updatedUser);
  saveUser(updatedUser);

  // Dispatch custom window event for instant UI re-render
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('siapkerja_user_updated', { detail: updatedUser }));
  }

  // Sync to API backend (fire and forget / optimistic)
  try {
    fetch(`${API_BASE_URL}/user/record-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: current.id, record: newRecord, stats })
    }).catch(() => {});
  } catch (e) {
    // offline
  }

  return updatedUser;
};

/**
 * Get current user's AI Interview tokens balance
 */
export const getUserInterviewTokens = (userId?: string): number => {
  const user = getActiveSession();
  if (user && user.interviewTokens !== undefined) {
    return user.interviewTokens;
  }
  const uid = userId || user?.id || 'guest';
  const saved = localStorage.getItem('siapkerja_interview_tokens_' + uid);
  if (saved !== null) {
    return parseInt(saved, 10) || 0;
  }
  // Default 1 free trial token for all users
  return 1;
};

/**
 * Deduct 1 AI Interview token from user balance
 */
export const deductUserInterviewToken = (userId?: string): boolean => {
  const currentTokens = getUserInterviewTokens(userId);
  if (currentTokens <= 0) return false;
  const newTokens = currentTokens - 1;

  const user = getActiveSession();
  if (user) {
    user.interviewTokens = newTokens;
    saveUser(user);
    setActiveSession(user);
  }
  const uid = userId || user?.id || 'guest';
  localStorage.setItem('siapkerja_interview_tokens_' + uid, String(newTokens));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('siapkerja_tokens_updated', { detail: newTokens }));
  }
  return true;
};

/**
 * Top up AI Interview tokens
 */
export const topUpUserInterviewTokens = (amount: number, userId?: string): number => {
  const currentTokens = getUserInterviewTokens(userId);
  const newTokens = currentTokens + amount;

  const user = getActiveSession();
  if (user) {
    user.interviewTokens = newTokens;
    saveUser(user);
    setActiveSession(user);
  }
  const uid = userId || user?.id || 'guest';
  localStorage.setItem('siapkerja_interview_tokens_' + uid, String(newTokens));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('siapkerja_tokens_updated', { detail: newTokens }));
  }
  return newTokens;
};

/**
 * Admin Update Candidate Information (School, NPSN, Major, Contacts, Target Role, etc.)
 */
export const adminUpdateCandidate = async (
  candidateId: string,
  data: Partial<RegisteredUser>
): Promise<{ success: boolean; user?: RegisteredUser; message: string }> => {
  try {
    // 1. Optimistically update local storage
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === candidateId);
    let optimisticUser: RegisteredUser | undefined;
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data, id: candidateId };
      optimisticUser = users[idx];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }

    // 2. Call backend MySQL API
    const response = await fetch(`${API_BASE_URL}/admin/candidates/${candidateId}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const resJson = await response.json();
    if (!response.ok) {
      throw new Error(resJson.message || `Gagal memperbarui data peserta (HTTP ${response.status}).`);
    }

    if (resJson.user) {
      saveUser(resJson.user);
      return { success: true, user: resJson.user, message: resJson.message || 'Data peserta berhasil diperbarui!' };
    }

    return { success: true, user: optimisticUser, message: resJson.message || 'Data peserta berhasil diperbarui!' };
  } catch (err: any) {
    console.error('[adminUpdateCandidate error]', err);
    return { success: false, message: err.message || 'Gagal memperbarui data peserta.' };
  }
};

/**
 * Admin Reset Candidate Password
 */
export const adminResetCandidatePassword = async (
  candidateId: string,
  newPassword?: string
): Promise<{ success: boolean; newPassword?: string; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/candidates/${candidateId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });

    const resJson = await response.json();
    if (!response.ok) {
      throw new Error(resJson.message || `Gagal mereset kata sandi (HTTP ${response.status}).`);
    }

    // Also update locally if exists
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === candidateId);
    if (idx >= 0) {
      users[idx].password = resJson.newPassword || newPassword || 'password123';
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }

    return {
      success: true,
      newPassword: resJson.newPassword || newPassword || 'password123',
      message: resJson.message || 'Kata sandi berhasil direset!'
    };
  } catch (err: any) {
    console.error('[adminResetCandidatePassword error]', err);
    return { success: false, message: err.message || 'Gagal mereset kata sandi peserta.' };
  }
};

