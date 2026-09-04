import { TargetRole } from '../types';

export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  school: string;
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
  interviewScore?: number;
  overallStatus: 'Lolos Unggul' | 'Lolos Standar' | 'Perlu Latihan';
  completedTestsCount: number;
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

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Gagal mengirim kode verifikasi.');
    }

    // Save temporary local payload
    localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify({
      ...data,
      otp: resData.simulatedOtp || '123456',
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: resData.message,
      simulatedOtp: resData.simulatedOtp
    };
  } catch (err: any) {
    // Offline / Local fallback simulation
    const localOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(STORAGE_PENDING_REGISTRATION_KEY, JSON.stringify({
      ...data,
      otp: localOtp,
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: `[Simulasi Mode] Kode verifikasi: ${localOtp} (dikirimkan ke email ${data.email})`,
      simulatedOtp: localOtp
    };
  }
};

/**
 * Step 2: Verify Registration OTP and Create User
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

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Kode verifikasi tidak valid.');
    }

    if (resData.user) {
      saveUser(resData.user);
      setActiveSession(resData.user);
      localStorage.removeItem(STORAGE_PENDING_REGISTRATION_KEY);
      return { success: true, user: resData.user, message: resData.message };
    }
  } catch (err: any) {
    // Offline fallback verification
    const pending = localStorage.getItem(STORAGE_PENDING_REGISTRATION_KEY);
    if (pending) {
      const pData = JSON.parse(pending);
      if (pData.email === email.trim().toLowerCase() && pData.otp === otp.trim()) {
        const targetCompanies: Record<TargetRole, string> = {
          operator: 'Manufaktur Otomotif & Assembling (Toyota, Astra Group, Yamaha, Honda)',
          qc: 'Industri Elektronika & Presisi (Epson, Omron, Panasonic, Denso)',
          maintenance: 'Teknik Otomasi & Alat Berat (Astra Otoparts, Komatsu, Denso)',
          logistics: 'Logistik & Pergudangan FMCG (Mayora, Indofood, Unilever)'
        };

        const users = getStoredUsers();
        const idSuffix = String(users.length + 1).padStart(4, '0');
        const newUser: RegisteredUser = {
          id: `SMK-2026-${idSuffix}`,
          name: pData.name,
          phone: pData.phone,
          email: pData.email,
          school: pData.school || 'SMK Buat Digital',
          major: pData.major || 'Teknik Mesin',
          password: pData.password || '123456',
          targetRole: pData.targetRole,
          targetCompany: targetCompanies[pData.targetRole as TargetRole],
          createdAt: new Date().toISOString(),
          overallStatus: 'Perlu Latihan',
          completedTestsCount: 0,
          lastActive: 'Baru saja mendaftar',
          isAdmin: false
        };

        saveUser(newUser);
        setActiveSession(newUser);
        localStorage.removeItem(STORAGE_PENDING_REGISTRATION_KEY);
        return { success: true, user: newUser };
      }
    }
    return { success: false, message: err.message || 'Kode verifikasi salah atau kadaluarsa.' };
  }
  return { success: false, message: 'Gagal memverifikasi OTP.' };
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
 * Login user by Phone, Email, or Admin ID
 */
export const loginUser = (phoneOrEmail: string, password?: string): { success: boolean; user?: RegisteredUser; message?: string } => {
  const cleanInput = phoneOrEmail.trim().toLowerCase();
  const users = getStoredUsers();

  // Super Admin Login
  if (cleanInput === 'admin' || cleanInput === '080000000000' || cleanInput === 'admin@buatdigital.id') {
    const adminUser = users.find(u => u.isAdmin) || initialDefaultUsers.find(u => u.isAdmin)!;
    if (password && password !== 'admin' && password !== 'admin123' && password !== adminUser.password) {
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

  // Background login sync to MySQL API
  fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: cleanInput, password })
  }).catch(() => {});

  return { success: true, user: found };
};

export const updateActiveUserScore = (update: Partial<RegisteredUser>): void => {
  const current = getActiveSession();
  if (!current) return;

  const updated: RegisteredUser = { ...current, ...update };
  setActiveSession(updated);
  saveUser(updated);

  if (update.kraepelinScore) {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: current.id,
        testType: 'kraepelin',
        scoreSummary: `Panker ${update.kraepelinScore.panker} | Akurasi ${update.kraepelinScore.janker}%`,
        scoreDetails: update.kraepelinScore
      })
    }).catch(() => {});
  }
};

/**
 * Update complete User Profile (School, Major, Height, Weight, Gender, Avatar, Address)
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<RegisteredUser>
): Promise<{ success: boolean; user?: RegisteredUser; message: string }> => {
  try {
    // 1. Update in local storage
    const current = getActiveSession();
    const updated: RegisteredUser = { ...(current || ({} as RegisteredUser)), ...profileData, id: userId };
    saveUser(updated);
    if (current && current.id === userId) {
      setActiveSession(updated);
    }

    // 2. Sync to API backend
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...profileData })
    });

    if (response.ok) {
      const resData = await response.json();
      return { success: true, user: resData.user || updated, message: 'Profil berhasil disimpan!' };
    }

    return { success: true, user: updated, message: 'Profil berhasil disimpan secara lokal.' };
  } catch (err: any) {
    const current = getActiveSession();
    const updated: RegisteredUser = { ...(current || ({} as RegisteredUser)), ...profileData, id: userId };
    saveUser(updated);
    if (current && current.id === userId) {
      setActiveSession(updated);
    }
    return { success: true, user: updated, message: 'Profil berhasil disimpan.' };
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

