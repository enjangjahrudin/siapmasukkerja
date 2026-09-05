const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const { 
  sendRegistrationOtpEmail, 
  sendPasswordResetOtpEmail, 
  sendWelcomeEmail 
} = require('./mailer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static uploads directory
const uploadsVideoDir = path.join(__dirname, 'uploads', 'videos');
if (!fs.existsSync(uploadsVideoDir)) {
  fs.mkdirSync(uploadsVideoDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Database Connection Pool
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'siapkerja_user',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'siapkerja_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0
};

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log(`[MySQL] Pool initialized connecting to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  
  // Auto-create/migrate tables if not exists
  (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) NOT NULL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(191) NULL UNIQUE,
          school VARCHAR(255) DEFAULT 'SMK Buat Digital',
          major VARCHAR(255) DEFAULT 'Teknik Mesin',
          password VARCHAR(255) NOT NULL DEFAULT '123456',
          target_role ENUM('operator', 'qc', 'maintenance', 'logistics') NOT NULL DEFAULT 'operator',
          target_company VARCHAR(255) DEFAULT 'PT Astra Daihatsu / PT Yamaha Motor',
          overall_status VARCHAR(50) DEFAULT 'Perlu Latihan',
          is_admin BOOLEAN DEFAULT FALSE,
          is_verified BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_active DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS otp_verifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(191) NOT NULL,
          otp VARCHAR(10) NOT NULL,
          type ENUM('register', 'forgot_password') NOT NULL,
          payload JSON NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (email),
          INDEX (otp)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS test_scores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          test_type VARCHAR(50) NOT NULL,
          score_summary VARCHAR(100) NULL,
          score_details JSON NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS education_videos (
          id VARCHAR(64) NOT NULL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NULL,
          category VARCHAR(50) NOT NULL DEFAULT 'kraepelin',
          duration VARCHAR(20) NOT NULL DEFAULT '10:00',
          youtube_id VARCHAR(50) NOT NULL,
          thumbnail_url VARCHAR(500) NULL,
          speaker VARCHAR(150) NOT NULL,
          speaker_role VARCHAR(150) NULL,
          views_count VARCHAR(50) DEFAULT '1.2 rb',
          badge VARCHAR(50) NULL,
          is_featured BOOLEAN DEFAULT FALSE,
          key_takeaways JSON NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Add email column to users if table already existed without email
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN email VARCHAR(191) NULL UNIQUE AFTER phone`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT TRUE AFTER is_admin`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN gender VARCHAR(20) DEFAULT 'Laki-laki' AFTER major`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN height DECIMAL(5,1) NULL AFTER gender`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN weight DECIMAL(5,1) NULL AFTER height`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN avatar_url LONGTEXT NULL AFTER weight`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN address TEXT NULL AFTER avatar_url`);
      } catch (e) {}

      // Migrations for education_videos (upload & orientation support)
      try {
        await pool.query(`ALTER TABLE education_videos ADD COLUMN video_source VARCHAR(50) DEFAULT 'youtube' AFTER duration`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE education_videos ADD COLUMN video_url TEXT NULL AFTER video_source`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE education_videos ADD COLUMN orientation VARCHAR(20) DEFAULT 'landscape' AFTER video_url`);
      } catch (e) {}
      try {
        await pool.query(`ALTER TABLE education_videos MODIFY COLUMN youtube_id VARCHAR(100) NULL`);
      } catch (e) {}

      // Auto-seed default Super Admin if not present
      try {
        await pool.query(`
          INSERT IGNORE INTO users 
            (id, name, phone, email, school, major, password, target_role, target_company, is_admin, is_verified, created_at, last_active)
          VALUES 
            ('SMK-ADMIN-001', 'Super Administrator', 'admin', 'admin@buatdigital.id', 'Management Pusat', 'Sistem Operasional', 'admin', 'operator', 'HQ Siap Masuk Kerja', TRUE, TRUE, NOW(), NOW())
        `);
      } catch (e) {}

      console.log('[MySQL] Tables & Schemas verified successfully');
    } catch (e) {
      console.warn('[MySQL Schema Warning]:', e.message);
    }
  })();
} catch (err) {
  console.error('[MySQL] Pool initialization failed:', err.message);
}

// ----------------------------------------------------------------------------
// 1. HEALTH CHECK ENDPOINT
// ----------------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as isAlive, NOW() as serverTime');
    res.json({
      status: 'OK',
      message: 'SMK Siap Masuk Kerja Backend & MySQL Connected!',
      database: 'Connected',
      serverTime: rows[0].serverTime
    });
  } catch (err) {
    res.status(500).json({
      status: 'Degraded',
      message: 'Server running but MySQL connection failed: ' + err.message,
      database: 'Disconnected'
    });
  }
});

// ----------------------------------------------------------------------------
// 2. SEND REGISTRATION OTP TO EMAIL
// ----------------------------------------------------------------------------
app.post('/api/auth/send-registration-otp', async (req, res) => {
  try {
    const { name, email, phone, school, major, password, targetRole } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Alamat email tidak valid.' });
    }
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Nama lengkap dan nomor WhatsApp wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check if phone or email is already registered
    const [existing] = await pool.query(
      'SELECT id, phone, email FROM users WHERE phone = ? OR email = ?',
      [cleanPhone, cleanEmail]
    );

    if (existing.length > 0) {
      if (existing.some(u => u.phone === cleanPhone)) {
        return res.status(400).json({ success: false, message: 'Nomor WhatsApp ini sudah terdaftar. Silakan login.' });
      }
      if (existing.some(u => u.email === cleanEmail)) {
        return res.status(400).json({ success: false, message: 'Alamat email ini sudah terdaftar. Silakan login.' });
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in otp_verifications with 10 minutes expiry
    const payloadData = JSON.stringify({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      school: school?.trim() || 'SMK Buat Digital',
      major: major?.trim() || 'Teknik Mesin',
      password: password || '123456',
      targetRole: targetRole || 'operator'
    });

    await pool.query(
      `DELETE FROM otp_verifications WHERE email = ? AND type = 'register'`,
      [cleanEmail]
    );

    await pool.query(
      `INSERT INTO otp_verifications (email, otp, type, payload, expires_at)
       VALUES (?, ?, 'register', ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [cleanEmail, otpCode, payloadData]
    );

    // Send email via mailer
    const mailResult = await sendRegistrationOtpEmail(cleanEmail, name.trim(), otpCode);

    res.json({
      success: true,
      message: `Kode verifikasi 6-digit telah dikirimkan ke email ${cleanEmail}. Silakan periksa kotak masuk (atau folder spam) Anda.`,
      email: cleanEmail,
      deliveryMethod: mailResult.method,
      // For development simulation convenience
      simulatedOtp: mailResult.method === 'simulated' ? otpCode : undefined
    });

  } catch (err) {
    console.error('[Send OTP Error]', err);
    res.status(500).json({ success: false, message: 'Gagal mengirim kode verifikasi: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 3. VERIFY REGISTRATION OTP & FINALIZE ACCOUNT
// ----------------------------------------------------------------------------
app.post('/api/auth/verify-registration-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email dan kode verifikasi wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const [rows] = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE email = ? AND otp = ? AND type = 'register' AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [cleanEmail, cleanOtp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kode verifikasi salah atau sudah kadaluarsa (lebih dari 10 menit). Silakan minta kode baru.' 
      });
    }

    const otpRecord = rows[0];
    const data = typeof otpRecord.payload === 'string' ? JSON.parse(otpRecord.payload) : otpRecord.payload;

    // Generate User ID
    const [[countRow]] = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_admin = FALSE');
    const idSuffix = String(countRow.total + 1).padStart(4, '0');
    const userId = `SMK-2026-${idSuffix}`;

    const targetCompanies = {
      operator: 'Manufaktur Otomotif & Assembling (Toyota, Astra Group, Yamaha, Honda)',
      qc: 'Industri Elektronika & Presisi (Epson, Omron, Panasonic, Denso)',
      maintenance: 'Teknik Otomasi & Alat Berat (Astra Otoparts, Komatsu, Denso)',
      logistics: 'Logistik & Pergudangan FMCG (Mayora, Indofood, Unilever)'
    };

    const role = data.targetRole || 'operator';
    const company = targetCompanies[role] || 'PT Astra Daihatsu Motor';

    await pool.query(
      `INSERT INTO users (id, name, phone, email, school, major, password, target_role, target_company, overall_status, is_admin, is_verified, created_at, last_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Perlu Latihan', FALSE, TRUE, NOW(), NOW())`,
      [userId, data.name, data.phone, cleanEmail, data.school, data.major, data.password, role, company]
    );

    // Delete verified OTP record
    await pool.query('DELETE FROM otp_verifications WHERE email = ? AND type = "register"', [cleanEmail]);

    const newUser = {
      id: userId,
      name: data.name,
      phone: data.phone,
      email: cleanEmail,
      school: data.school,
      major: data.major,
      targetRole: role,
      targetCompany: company,
      overallStatus: 'Perlu Latihan',
      completedTestsCount: 0,
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    // Send Welcome Email asynchronously
    sendWelcomeEmail(cleanEmail, data.name, role.toUpperCase(), company).catch(() => {});

    res.json({
      success: true,
      message: 'Pendaftaran & verifikasi email berhasil! Selamat datang di SMK Siap Masuk Kerja.',
      user: newUser
    });

  } catch (err) {
    console.error('[Verify Registration OTP Error]', err);
    res.status(500).json({ success: false, message: 'Gagal memverifikasi pendaftaran: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 4. FORGOT PASSWORD - REQUEST OTP
// ----------------------------------------------------------------------------
app.post('/api/auth/forgot-password-request', async (req, res) => {
  try {
    const { identifier } = req.body; // Can be email or phone

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Masukkan alamat email atau nomor WhatsApp terdaftar.' });
    }

    const cleanInput = identifier.trim().toLowerCase();

    const [rows] = await pool.query(
      'SELECT id, name, email, phone FROM users WHERE email = ? OR phone = ? LIMIT 1',
      [cleanInput, cleanInput]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Akun dengan email atau nomor WhatsApp tersebut tidak ditemukan.' });
    }

    const user = rows[0];
    if (!user.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Akun Anda belum memiliki email terdaftar. Silakan hubungi Administrator untuk reset kata sandi.' 
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(`DELETE FROM otp_verifications WHERE email = ? AND type = 'forgot_password'`, [user.email]);

    await pool.query(
      `INSERT INTO otp_verifications (email, otp, type, payload, expires_at)
       VALUES (?, ?, 'forgot_password', ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [user.email, otpCode, JSON.stringify({ userId: user.id })]
    );

    // Send reset OTP email
    const mailResult = await sendPasswordResetOtpEmail(user.email, user.name, otpCode);

    // Mask email for privacy (e.g., ah***@gmail.com)
    const [userPart, domainPart] = user.email.split('@');
    const maskedEmail = userPart.length > 2 
      ? `${userPart.substring(0, 2)}***@${domainPart}`
      : `${userPart}***@${domainPart}`;

    res.json({
      success: true,
      message: `Kode reset kata sandi telah dikirim ke email ${maskedEmail}.`,
      maskedEmail,
      email: user.email,
      deliveryMethod: mailResult.method,
      simulatedOtp: mailResult.method === 'simulated' ? otpCode : undefined
    });

  } catch (err) {
    console.error('[Forgot Password Error]', err);
    res.status(500).json({ success: false, message: 'Gagal memproses permintaan reset: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 5. RESET PASSWORD - VERIFY OTP & UPDATE PASSWORD
// ----------------------------------------------------------------------------
app.post('/api/auth/reset-password-confirm', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, kode verifikasi, dan kata sandi baru wajib diisi.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 6 karakter.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const [rows] = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE email = ? AND otp = ? AND type = 'forgot_password' AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [cleanEmail, cleanOtp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kode verifikasi salah atau sudah kadaluarsa (lebih dari 10 menit).' 
      });
    }

    // Update password in users table
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, cleanEmail]);

    // Delete used OTP
    await pool.query('DELETE FROM otp_verifications WHERE email = ? AND type = "forgot_password"', [cleanEmail]);

    res.json({
      success: true,
      message: 'Kata sandi Anda berhasil diperbarui! Silakan masuk menggunakan kata sandi baru.'
    });

  } catch (err) {
    console.error('[Reset Password Confirm Error]', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui kata sandi: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 6. LOGIN ENDPOINT (STUDENT BY PHONE/EMAIL OR SUPER ADMIN)
// ----------------------------------------------------------------------------
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const cleanInput = phone?.trim();

    if (!cleanInput) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp, Email, atau ID Pengguna wajib diisi.' });
    }

    // Super Admin Authentication
    if (cleanInput === 'admin' || cleanInput === '080000000000' || cleanInput === 'admin@buatdigital.id') {
      const [admins] = await pool.query('SELECT * FROM users WHERE is_admin = TRUE LIMIT 1');
      const admin = admins[0] || {
        id: 'SMK-ADMIN-001',
        name: 'Super Administrator',
        phone: 'admin',
        email: 'admin@buatdigital.id',
        school: 'Management Pusat',
        major: 'Sistem Operasional',
        password: 'admin',
        target_role: 'operator',
        target_company: 'HQ Siap Masuk Kerja',
        is_admin: 1
      };

      const expectedPassword = admin.password || 'admin';
      if (!password || password !== expectedPassword) {
        return res.status(401).json({ success: false, message: 'Kata sandi Admin salah. Silakan periksa kembali.' });
      }

      return res.json({
        success: true,
        message: 'Login Super Admin berhasil.',
        user: {
          id: admin.id,
          name: admin.name,
          phone: admin.phone,
          email: admin.email || 'admin@buatdigital.id',
          school: admin.school,
          major: admin.major,
          targetRole: admin.target_role,
          targetCompany: admin.target_company,
          isAdmin: true
        }
      });
    }

    // Regular Candidate login by phone OR email
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ? OR email = ?', [cleanInput, cleanInput.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nomor WhatsApp atau Email belum terdaftar. Silakan registrasi terlebih dahulu.' });
    }

    const user = rows[0];

    // Password validation
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali atau gunakan Lupa Kata Sandi.' });
    }

    // Update last_active
    await pool.query('UPDATE users SET last_active = NOW() WHERE id = ?', [user.id]);

    // Fetch latest scores
    const [scoreRows] = await pool.query(
      'SELECT test_type, score_details FROM test_scores WHERE user_id = ? ORDER BY id DESC',
      [user.id]
    );

    let kraepelinScore, qcAccuracy, mathScore, interviewScore;
    scoreRows.forEach(sr => {
      const details = typeof sr.score_details === 'string' ? JSON.parse(sr.score_details) : sr.score_details;
      if (sr.test_type === 'kraepelin' && !kraepelinScore) kraepelinScore = details;
      if (sr.test_type === 'qc' && !qcAccuracy) qcAccuracy = details?.accuracy || 90;
      if (sr.test_type === 'math' && !mathScore) mathScore = details?.score || 85;
      if (sr.test_type === 'interview' && !interviewScore) interviewScore = details?.probability || 88;
    });

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        school: user.school,
        major: user.major,
        gender: user.gender || 'Laki-laki',
        height: user.height ? parseFloat(user.height) : undefined,
        weight: user.weight ? parseFloat(user.weight) : undefined,
        avatarUrl: user.avatar_url,
        address: user.address,
        targetRole: user.target_role,
        targetCompany: user.target_company,
        overallStatus: user.overall_status,
        completedTestsCount: scoreRows.length,
        kraepelinScore,
        qcAccuracy,
        mathScore,
        interviewScore,
        createdAt: user.created_at,
        isAdmin: Boolean(user.is_admin)
      }
    });

  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ success: false, message: 'Gagal melakukan login: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 7. GET ALL REGISTERED CANDIDATES (ADMIN DASHBOARD)
// ----------------------------------------------------------------------------
app.get('/api/admin/candidates', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.id, u.name, u.phone, u.email, u.school, u.major, u.gender, u.height, u.weight, u.avatar_url, u.address,
        u.target_role, u.target_company, u.overall_status, u.is_admin, u.created_at, u.last_active,
        COUNT(ts.id) as completed_tests_count
      FROM users u
      LEFT JOIN test_scores ts ON u.id = ts.user_id
      WHERE u.is_admin = FALSE
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    // Fetch score details for each user
    const [allScores] = await pool.query('SELECT user_id, test_type, score_summary, score_details FROM test_scores ORDER BY id DESC');

    const formattedUsers = users.map(u => {
      const userScores = allScores.filter(s => s.user_id === u.id);
      let kraepelinScore, qcAccuracy, mathScore, interviewScore;

      userScores.forEach(sr => {
        const details = typeof sr.score_details === 'string' ? JSON.parse(sr.score_details) : sr.score_details;
        if (sr.test_type === 'kraepelin' && !kraepelinScore) kraepelinScore = details;
        if (sr.test_type === 'qc' && !qcAccuracy) qcAccuracy = details?.accuracy || 90;
        if (sr.test_type === 'math' && !mathScore) mathScore = details?.score || 85;
        if (sr.test_type === 'interview' && !interviewScore) interviewScore = details?.probability || 88;
      });

      return {
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        school: u.school,
        major: u.major,
        gender: u.gender || 'Laki-laki',
        height: u.height ? parseFloat(u.height) : undefined,
        weight: u.weight ? parseFloat(u.weight) : undefined,
        avatarUrl: u.avatar_url,
        address: u.address,
        targetRole: u.target_role,
        targetCompany: u.target_company,
        overallStatus: u.overall_status,
        completedTestsCount: parseInt(u.completed_tests_count || 0, 10),
        kraepelinScore,
        qcAccuracy,
        mathScore,
        interviewScore,
        createdAt: u.created_at,
        lastActive: u.last_active ? new Date(u.last_active).toLocaleString('id-ID') : 'Baru saja',
        isAdmin: Boolean(u.is_admin)
      };
    });

    res.json({
      success: true,
      totalCandidates: formattedUsers.length,
      candidates: formattedUsers
    });
  } catch (err) {
    console.error('[Admin Candidates Error]', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data kandidat: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 8. USER PROFILE (GET & UPDATE)
// ----------------------------------------------------------------------------
app.get('/api/user/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const u = rows[0];

    // Fetch test counts and latest scores
    const [scoreRows] = await pool.query(
      'SELECT test_type, score_details FROM test_scores WHERE user_id = ? ORDER BY id DESC',
      [u.id]
    );

    let kraepelinScore, qcAccuracy, mathScore, interviewScore;
    scoreRows.forEach(sr => {
      const details = typeof sr.score_details === 'string' ? JSON.parse(sr.score_details) : sr.score_details;
      if (sr.test_type === 'kraepelin' && !kraepelinScore) kraepelinScore = details;
      if (sr.test_type === 'qc' && !qcAccuracy) qcAccuracy = details?.accuracy || 90;
      if (sr.test_type === 'math' && !mathScore) mathScore = details?.score || 85;
      if (sr.test_type === 'interview' && !interviewScore) interviewScore = details?.probability || 88;
    });

    res.json({
      success: true,
      user: {
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        school: u.school,
        major: u.major,
        gender: u.gender || 'Laki-laki',
        height: u.height !== null && u.height !== undefined ? parseFloat(u.height) : undefined,
        weight: u.weight !== null && u.weight !== undefined ? parseFloat(u.weight) : undefined,
        avatarUrl: u.avatar_url,
        address: u.address,
        targetRole: u.target_role,
        targetCompany: u.target_company,
        overallStatus: u.overall_status,
        completedTestsCount: scoreRows.length,
        kraepelinScore,
        qcAccuracy,
        mathScore,
        interviewScore,
        createdAt: u.created_at,
        isAdmin: Boolean(u.is_admin)
      }
    });
  } catch (err) {
    console.error('[Get Profile Error]', err);
    res.status(500).json({ success: false, message: 'Gagal memuat profil: ' + err.message });
  }
});

const handleUpdateProfile = async (req, res) => {
  try {
    const { userId, name, school, major, gender, height, weight, avatarUrl, address, targetRole } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId wajib disertakan.' });
    }

    const hVal = height !== undefined && height !== '' && height !== null ? parseFloat(height) : null;
    const wVal = weight !== undefined && weight !== '' && weight !== null ? parseFloat(weight) : null;

    await pool.query(
      `UPDATE users SET 
        name = COALESCE(?, name),
        school = COALESCE(?, school),
        major = COALESCE(?, major),
        gender = COALESCE(?, gender),
        height = ?,
        weight = ?,
        avatar_url = COALESCE(?, avatar_url),
        address = COALESCE(?, address),
        target_role = COALESCE(?, target_role),
        last_active = NOW()
       WHERE id = ?`,
      [
        name || null, 
        school || null, 
        major || null, 
        gender || null, 
        hVal, 
        wVal, 
        avatarUrl !== undefined ? avatarUrl : null, 
        address !== undefined ? address : null, 
        targetRole || null,
        userId
      ]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const u = rows[0];
    res.json({
      success: true,
      message: 'Profil berhasil diperbarui dan tersimpan di database!',
      user: {
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        school: u.school,
        major: u.major,
        gender: u.gender || 'Laki-laki',
        height: u.height !== null && u.height !== undefined ? parseFloat(u.height) : undefined,
        weight: u.weight !== null && u.weight !== undefined ? parseFloat(u.weight) : undefined,
        avatarUrl: u.avatar_url,
        address: u.address,
        targetRole: u.target_role,
        targetCompany: u.target_company,
        overallStatus: u.overall_status,
        createdAt: u.created_at,
        isAdmin: Boolean(u.is_admin)
      }
    });
  } catch (err) {
    console.error('[Update Profile Error]', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + err.message });
  }
};

app.put('/api/user/profile', handleUpdateProfile);
app.post('/api/user/profile', handleUpdateProfile);

// ----------------------------------------------------------------------------
// 9. CHANGE PASSWORD (FROM PROFILE TAB)
// ----------------------------------------------------------------------------
app.post('/api/user/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Data kata sandi tidak lengkap.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 6 karakter.' });
    }

    let [rows] = await pool.query('SELECT id, password, is_admin FROM users WHERE id = ? LIMIT 1', [userId]);
    
    // If not found by ID and userId is admin
    if (rows.length === 0 && (userId === 'SMK-ADMIN-001' || userId === 'admin')) {
      [rows] = await pool.query('SELECT id, password, is_admin FROM users WHERE is_admin = TRUE OR phone = "admin" LIMIT 1');
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    const targetUser = rows[0];
    if (targetUser.password && targetUser.password !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Kata sandi saat ini tidak sesuai.' });
    }

    await pool.query('UPDATE users SET password = ?, last_active = NOW() WHERE id = ?', [newPassword, targetUser.id]);

    res.json({
      success: true,
      message: 'Kata sandi berhasil diubah! Gunakan kata sandi baru untuk login selanjutnya.'
    });

  } catch (err) {
    console.error('[Change Password Error]', err);
    res.status(500).json({ success: false, message: 'Gagal mengubah kata sandi: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 10. SAVE TEST SCORE RESULTS
// ----------------------------------------------------------------------------
app.post('/api/scores', async (req, res) => {
  try {
    const { userId, testType, scoreSummary, scoreDetails } = req.body;

    if (!userId || !testType) {
      return res.status(400).json({ success: false, message: 'userId dan testType wajib dikirim.' });
    }

    await pool.query(
      `INSERT INTO test_scores (user_id, test_type, score_summary, score_details, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, testType, scoreSummary || 'Hasil Tes', JSON.stringify(scoreDetails || {})]
    );

    await pool.query('UPDATE users SET last_active = NOW() WHERE id = ?', [userId]);

    res.json({ success: true, message: 'Nilai tes berhasil disimpan ke MySQL.' });
  } catch (err) {
    console.error('[Save Score Error]', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan skor: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// 11. EDUCATION VIDEOS CRUD & FILE UPLOADS (ADMIN CMS & APP SYNC)
// ----------------------------------------------------------------------------
app.post('/api/upload/video', async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, message: 'Tidak ada data file video yang dikirim.' });
    }

    const base64Data = fileData.replace(/^data:video\/\w+;base64,/, '').replace(/^data:application\/octet-stream;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = fileName ? path.extname(fileName) : '.mp4';
    const uniqueName = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext || '.mp4'}`;
    const filePath = path.join(uploadsVideoDir, uniqueName);

    fs.writeFileSync(filePath, buffer);
    const videoUrl = `/uploads/videos/${uniqueName}`;

    res.json({
      success: true,
      message: 'Video berhasil diupload ke server!',
      videoUrl,
      fileName: uniqueName
    });
  } catch (err) {
    console.error('[Upload Video Error]', err);
    res.status(500).json({ success: false, message: 'Gagal mengunggah video: ' + err.message });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM education_videos ORDER BY is_featured DESC, created_at DESC');
    const formatted = rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description || '',
      category: r.category,
      duration: r.duration,
      sourceType: r.video_source || (r.youtube_id ? 'youtube' : 'upload'),
      youtubeId: r.youtube_id || '',
      videoUrl: r.video_url || '',
      orientation: r.orientation || 'landscape',
      thumbnailUrl: r.thumbnail_url || (r.youtube_id ? `https://img.youtube.com/vi/${r.youtube_id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'),
      speaker: r.speaker,
      speakerRole: r.speaker_role || '',
      viewsCount: r.views_count || '1.2 rb',
      badge: r.badge || '',
      isFeatured: Boolean(r.is_featured),
      keyTakeaways: typeof r.key_takeaways === 'string' ? JSON.parse(r.key_takeaways || '[]') : (r.key_takeaways || [])
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('[Get Videos Error]', err);
    res.status(500).json({ success: false, message: 'Gagal memuat video: ' + err.message });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const { 
      id, 
      title, 
      description, 
      category, 
      duration, 
      sourceType, 
      youtubeId, 
      videoUrl, 
      orientation, 
      thumbnailUrl, 
      speaker, 
      speakerRole, 
      viewsCount, 
      badge, 
      isFeatured, 
      keyTakeaways 
    } = req.body;
    
    if (!title || !speaker) {
      return res.status(400).json({ success: false, message: 'Judul dan Pemateri wajib diisi.' });
    }

    const src = sourceType || (videoUrl ? 'upload' : 'youtube');
    if (src === 'youtube' && !youtubeId) {
      return res.status(400).json({ success: false, message: 'Link YouTube atau Video ID wajib diisi.' });
    }
    if (src === 'upload' && !videoUrl) {
      return res.status(400).json({ success: false, message: 'File video belum dipilih atau diunggah.' });
    }

    const videoId = id || `vid-${Date.now()}`;
    const orient = orientation === 'portrait' ? 'portrait' : 'landscape';
    const thumb = thumbnailUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');

    await pool.query(
      `INSERT INTO education_videos 
        (id, title, description, category, duration, video_source, video_url, orientation, youtube_id, thumbnail_url, speaker, speaker_role, views_count, badge, is_featured, key_takeaways, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        category = VALUES(category),
        duration = VALUES(duration),
        video_source = VALUES(video_source),
        video_url = VALUES(video_url),
        orientation = VALUES(orientation),
        youtube_id = VALUES(youtube_id),
        thumbnail_url = VALUES(thumbnail_url),
        speaker = VALUES(speaker),
        speaker_role = VALUES(speaker_role),
        views_count = VALUES(views_count),
        badge = VALUES(badge),
        is_featured = VALUES(is_featured),
        key_takeaways = VALUES(key_takeaways),
        updated_at = NOW()`,
      [
        videoId,
        title,
        description || '',
        category || 'kraepelin',
        duration || '10:00',
        src,
        videoUrl || null,
        orient,
        youtubeId || null,
        thumb,
        speaker,
        speakerRole || '',
        viewsCount || 'Baru',
        badge || '',
        isFeatured ? 1 : 0,
        JSON.stringify(keyTakeaways || [])
      ]
    );

    res.json({ success: true, message: 'Video edukasi berhasil disimpan ke database.', videoId });
  } catch (err) {
    console.error('[Save Video Error]', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan video: ' + err.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM education_videos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Video berhasil dihapus dari database.' });
  } catch (err) {
    console.error('[Delete Video Error]', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus video: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// AI INTERVIEW DYNAMIC CONVERSATION & EVALUATION (GEMINI / LLM INTEGRATION)
// ----------------------------------------------------------------------------

app.post('/api/interview/generate-followup', async (req, res) => {
  try {
    const { 
      targetRole = 'operator', 
      interviewerPersona = 'Bapak Hendra (Senior HRD Otomotif)', 
      userAnswer = '', 
      questionIndex = 1,
      conversationHistory = []
    } = req.body;

    const sumopodKey = process.env.SUMOPOD_API_KEY || process.env.OPENAI_API_KEY;
    const sumopodBaseUrl = (process.env.SUMOPOD_BASE_URL || 'https://api.sumopod.com/v1').replace(/\/+$/, '');
    const sumopodModel = process.env.SUMOPOD_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // 1. Prioritize Sumopod.com / OpenAI-compatible API Gateway
    if (sumopodKey) {
      const systemPrompt = `Anda adalah pewawancara AI HRD & User industri profesional: "${interviewerPersona}".
Target posisi yang dilamar kandidat: "${targetRole.toUpperCase()} (Pabrik / Manufaktur Industri)".
Karakter Anda: Profesional, ramah, tegas, mengutamakan keselamatan kerja (K3), kedisiplinan, ketelitian, dan kesiapan fisik/mental pabrik.

Instruksi Tugas:
1. Dengarkan dan respon jawaban kandidat untuk pertanyaan ke-${questionIndex} secara natural (acknowledgement 1 kalimat singkat yang mengapresiasi atau mengomentari poin spesifik jawaban kandidat).
2. Sambungkan dengan pertanyaan lanjutan berikutnya (tahap ${questionIndex + 1}) yang mendalam, relevan dengan jawaban kandidat dan posisi ${targetRole}.
3. Bahasa Indonesia lisan yang sangat alami, formal namun luwes seperti wawancara tatap muka asli (panjang total ucapan sekitar 40-55 kata agar pas untuk disuarakan text-to-speech).

Kembalikan HANYA format JSON valid tanpa tanda markdown (tanpa \`\`\`json):
{
  "acknowledgement": "Tanggapan verbal alami terhadap jawaban kandidat",
  "nextQuestion": "Pertanyaan lanjutan yang tersambung logis",
  "fullSpoken": "Gabungan tanggapan dan pertanyaan lanjutan untuk diucapkan secara langsung"
}`;

      try {
        const aiRes = await fetch(`${sumopodBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sumopodKey}`
          },
          body: JSON.stringify({
            model: sumopodModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Jawaban kandidat pada pertanyaan ke-${questionIndex}: "${userAnswer || 'Saya siap dan memiliki komitmen tinggi.'}"` }
            ],
            temperature: 0.7,
            max_tokens: 300
          })
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const rawContent = aiData?.choices?.[0]?.message?.content || '';
          const cleanJsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJsonStr);
          if (parsed.fullSpoken || parsed.nextQuestion) {
            return res.json({
              success: true,
              isAiGenerated: true,
              provider: 'sumopod',
              model: sumopodModel,
              acknowledgement: parsed.acknowledgement || 'Baik, terima kasih atas penjelasannya.',
              nextQuestion: parsed.nextQuestion || 'Bisa jelaskan lebih lanjut mengenai kesiapan kerja Anda?',
              fullSpoken: parsed.fullSpoken || `${parsed.acknowledgement} ${parsed.nextQuestion}`
            });
          }
        } else {
          const errText = await aiRes.text();
          console.warn('[Sumopod API Error]', aiRes.status, errText);
        }
      } catch (sumoErr) {
        console.warn('[Sumopod Call Exception]', sumoErr.message);
      }
    }

    // 2. Direct Gemini Fallback if SUMOPOD_API_KEY is not set but GEMINI_API_KEY is available
    if (geminiKey) {
      const systemPrompt = `Anda adalah pewawancara AI profesional: "${interviewerPersona}".
Target posisi yang dilamar: "${targetRole.toUpperCase()} (Pabrik / Manufaktur Industri)".
Kandidat baru saja menjawab pertanyaan ke-${questionIndex} dengan jawaban suara: "${userAnswer}".

Tugas Anda sebagai HRD pabrik profesional:
1. Berikan tanggapan verbal alami singkat (1 kalimat) yang langsung merespons apa yang diceritakan kandidat.
2. Sambungkan dengan pertanyaan lanjutan berikutnya (tahap ${questionIndex + 1}) yang mendalam, realistis, dan menguji kesiapan nyata kandidat untuk posisi ${targetRole}.
3. Bahasa Indonesia yang digunakan harus profesional, tegas, ramah, dan mengalir seperti percakapan lisan tatap muka asli (total 40-55 kata).

Kembalikan respon HANYA dalam format JSON murni tanpa markdown:
{
  "acknowledgement": "Tanggapan singkat terhadap jawaban kandidat",
  "nextQuestion": "Pertanyaan lanjutan yang tersambung",
  "fullSpoken": "Gabungan tanggapan dan pertanyaan lanjutan untuk dibacakan suara"
}`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedText);
          return res.json({ success: true, isAiGenerated: true, provider: 'gemini', ...parsed });
        }
      } catch (aiErr) {
        console.warn('[Gemini API Call Notice]', aiErr.message);
      }
    }

    // Heuristic Fallback if AI key is not configured or offline
    res.json({
      success: true,
      isAiGenerated: false,
      message: 'Using heuristic contextual engine'
    });
  } catch (err) {
    console.error('[Interview Gen Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------------------------
// AI INTERVIEW API CONNECTION DIAGNOSTIC / TEST ENDPOINT
// ----------------------------------------------------------------------------
app.get('/api/interview/test-connection', async (req, res) => {
  const startTime = Date.now();
  const sumopodKey = process.env.SUMOPOD_API_KEY || process.env.OPENAI_API_KEY;
  const sumopodBaseUrl = (process.env.SUMOPOD_BASE_URL || 'https://api.sumopod.com/v1').replace(/\/+$/, '');
  const sumopodModel = process.env.SUMOPOD_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (sumopodKey) {
    try {
      const aiRes = await fetch(`${sumopodBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sumopodKey}`
        },
        body: JSON.stringify({
          model: sumopodModel,
          messages: [
            { role: 'system', content: 'Kamu adalah asisten HRD AI. Jawab singkat maksimal 1 kalimat.' },
            { role: 'user', content: 'Tes koneksi API Sumopod. Balas dengan kalimat konfirmasi singkat.' }
          ],
          max_tokens: 60
        })
      });

      const latencyMs = Date.now() - startTime;

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const reply = aiData?.choices?.[0]?.message?.content || '';
        return res.json({
          status: 'SUCCESS',
          connected: true,
          provider: 'sumopod.com',
          model: sumopodModel,
          baseUrl: sumopodBaseUrl,
          latency: `${latencyMs}ms`,
          aiResponse: reply.trim(),
          message: 'Koneksi ke Sumopod.com API Key berhasil dan aktif 100%!'
        });
      } else {
        const errBody = await aiRes.text();
        return res.status(aiRes.status).json({
          status: 'ERROR',
          connected: false,
          provider: 'sumopod.com',
          model: sumopodModel,
          baseUrl: sumopodBaseUrl,
          statusCode: aiRes.status,
          errorDetails: errBody,
          message: 'Gagal terhubung ke Sumopod API. Periksa kembali validitas API Key atau nama model di file .env.'
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'EXCEPTION',
        connected: false,
        provider: 'sumopod.com',
        latency: `${Date.now() - startTime}ms`,
        error: err.message,
        message: 'Koneksi jaringan ke server Sumopod mengalami kendala.'
      });
    }
  }

  if (geminiKey) {
    return res.json({
      status: 'CONFIGURED',
      connected: true,
      provider: 'Google Gemini (Direct)',
      message: 'SUMOPOD_API_KEY tidak terdeteksi, namun GEMINI_API_KEY aktif sebagai fallback.'
    });
  }

  return res.json({
    status: 'NOT_CONFIGURED',
    connected: false,
    provider: 'Heuristic Internal Engine (Offline Fallback)',
    message: 'SUMOPOD_API_KEY belum terpasang di file .env. Sistem menggunakan Heuristic Engine internal.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Express] SMK Siap Masuk Kerja API listening on http://0.0.0.0:${PORT}`);
});
