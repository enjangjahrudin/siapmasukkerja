import { TargetRole } from '../types';

export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  school: string;
  major: string;
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
const API_BASE_URL = '/api';

export const initialDefaultUsers: RegisteredUser[] = [
  {
    id: 'SMK-2026-0891',
    name: 'Ahmad Fauzi',
    phone: '081234567891',
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
    const res = await fetch(`${API_BASE_URL}/users`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    // Graceful fallback to local cache
  }
  return getStoredUsers();
};

export const saveUser = (user: RegisteredUser): void => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === user.id || u.phone === user.phone);
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.unshift(user);
  }
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

export const registerNewCandidate = (data: {
  name: string;
  phone: string;
  school: string;
  major: string;
  password?: string;
  targetRole: TargetRole;
}): RegisteredUser => {
  const users = getStoredUsers();
  const targetCompanies: Record<TargetRole, string> = {
    operator: 'Manufaktur Otomotif & Assembling (Toyota, Astra Group, Yamaha, Honda)',
    qc: 'Industri Elektronika & Presisi (Epson, Omron, Panasonic, Denso)',
    maintenance: 'Teknik Otomasi & Alat Berat (Astra Otoparts, Komatsu, Denso)',
    logistics: 'Logistik & Pergudangan FMCG (Mayora, Indofood, Unilever)'
  };

  const idSuffix = String(users.length + 1).padStart(4, '0');
  const newUser: RegisteredUser = {
    id: `SMK-2026-${idSuffix}`,
    name: data.name,
    phone: data.phone.trim(),
    school: data.school.trim() || 'SMK Negeri 1',
    major: data.major.trim() || 'Teknik',
    password: data.password || '123456',
    targetRole: data.targetRole,
    targetCompany: targetCompanies[data.targetRole],
    createdAt: new Date().toISOString(),
    overallStatus: 'Perlu Latihan',
    completedTestsCount: 0,
    lastActive: 'Baru saja mendaftar',
    isAdmin: false
  };

  saveUser(newUser);
  setActiveSession(newUser);

  // Background sync to MySQL API
  fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});

  return newUser;
};

export const loginUser = (phone: string, password?: string): { success: boolean; user?: RegisteredUser; message?: string } => {
  const cleanPhone = phone.trim();
  const users = getStoredUsers();

  // Special Admin Shortcut
  if (cleanPhone === 'admin' || cleanPhone === '080000000000') {
    const adminUser = users.find(u => u.isAdmin) || initialDefaultUsers.find(u => u.isAdmin)!;
    setActiveSession(adminUser);
    return { success: true, user: adminUser };
  }

  const found = users.find(u => u.phone === cleanPhone);
  if (!found) {
    return { success: false, message: 'Nomor WhatsApp / ID belum terdaftar. Silakan registrasi terlebih dahulu.' };
  }

  if (password && found.password && found.password !== password) {
    return { success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
  }

  found.lastActive = 'Baru saja aktif';
  saveUser(found);
  setActiveSession(found);

  // Background login sync to MySQL API
  fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: cleanPhone, password })
  }).catch(() => {});

  return { success: true, user: found };
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

export const setActiveSession = (user: RegisteredUser | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  }
};

export const logoutSession = (): void => {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
};

export const updateActiveUserScore = (update: Partial<RegisteredUser>): void => {
  const current = getActiveSession();
  if (!current) return;

  const updated: RegisteredUser = {
    ...current,
    ...update,
    completedTestsCount: current.completedTestsCount + 1,
    lastActive: 'Baru saja'
  };

  // Recalculate status
  const kraepelinPass = (updated.kraepelinScore?.panker || 0) >= 14;
  const qcPass = (updated.qcAccuracy || 0) >= 90;
  const mathPass = (updated.mathScore || 0) >= 75;

  if (kraepelinPass && qcPass && mathPass) {
    updated.overallStatus = 'Lolos Unggul';
  } else if (kraepelinPass || qcPass || mathPass) {
    updated.overallStatus = 'Lolos Standar';
  }

  saveUser(updated);
  setActiveSession(updated);

  // Background score sync to MySQL API
  fetch(`${API_BASE_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: updated.id,
      testType: 'training',
      scoreSummary: updated.overallStatus,
      scoreDetails: update
    })
  }).catch(() => {});
};
