const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
} catch (err) {
  console.error('[MySQL] Pool initialization failed:', err.message);
}

// 1. HEALTH CHECK ENDPOINT
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

// 2. REGISTER NEW CANDIDATE
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, school, major, password, targetRole } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Nama lengkap dan nomor WhatsApp wajib diisi.' });
    }

    const cleanPhone = phone.trim();

    // Check if phone already registered
    const [existing] = await pool.query('SELECT id FROM users WHERE phone = ?', [cleanPhone]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp ini sudah terdaftar. Silakan gunakan menu Masuk / Login.' });
    }

    const [[countRow]] = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_admin = FALSE');
    const idSuffix = String(countRow.total + 1).padStart(4, '0');
    const userId = `SMK-2026-${idSuffix}`;

    const targetCompanies = {
      operator: 'Manufaktur Otomotif & Assembling (Toyota, Astra Group, Yamaha, Honda)',
      qc: 'Industri Elektronika & Presisi (Epson, Omron, Panasonic, Denso)',
      maintenance: 'Teknik Otomasi & Alat Berat (Astra Otoparts, Komatsu, Denso)',
      logistics: 'Logistik & Pergudangan FMCG (Mayora, Indofood, Unilever)'
    };

    const role = targetRole || 'operator';
    const company = targetCompanies[role] || 'PT Astra Daihatsu Motor';
    const schoolVal = school?.trim() || 'SMKN 1';
    const majorVal = major?.trim() || 'Teknik Mesin';
    const passVal = password || '123456';

    await pool.query(
      `INSERT INTO users (id, name, phone, school, major, password, target_role, target_company, overall_status, is_admin, created_at, last_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Perlu Latihan', FALSE, NOW(), NOW())`,
      [userId, name.trim(), cleanPhone, schoolVal, majorVal, passVal, role, company]
    );

    const newUser = {
      id: userId,
      name: name.trim(),
      phone: cleanPhone,
      school: schoolVal,
      major: majorVal,
      targetRole: role,
      targetCompany: company,
      overallStatus: 'Perlu Latihan',
      completedTestsCount: 0,
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    res.json({
      success: true,
      message: 'Registrasi berhasil! Selamat datang di SMK — Siap Masuk Kerja.',
      user: newUser
    });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ success: false, message: 'Gagal melakukan registrasi: ' + err.message });
  }
});

// 3. LOGIN ENDPOINT (STUDENT OR ADMIN)
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const cleanPhone = phone?.trim();

    if (!cleanPhone) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp atau ID Pengguna wajib diisi.' });
    }

    // Super Admin Authentication
    if (cleanPhone === 'admin' || cleanPhone === '080000000000') {
      const [admins] = await pool.query('SELECT * FROM users WHERE is_admin = TRUE LIMIT 1');
      const admin = admins[0] || {
        id: 'SMK-ADMIN-001',
        name: 'Super Administrator',
        phone: 'admin',
        school: 'Management Pusat',
        major: 'Sistem Operasional',
        password: 'admin',
        target_role: 'operator',
        target_company: 'HQ Siap Masuk Kerja',
        is_admin: 1
      };

      if (password && password !== 'admin' && password !== 'admin123' && password !== admin.password) {
        return res.status(401).json({ success: false, message: 'Kata sandi Admin salah. Silakan periksa kembali.' });
      }

      return res.json({
        success: true,
        message: 'Login Super Admin berhasil.',
        user: {
          id: admin.id,
          name: admin.name,
          phone: admin.phone,
          school: admin.school,
          major: admin.major,
          targetRole: admin.target_role,
          targetCompany: admin.target_company,
          isAdmin: true
        }
      });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [cleanPhone]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nomor WhatsApp belum terdaftar. Silakan registrasi terlebih dahulu.' });
    }

    const user = rows[0];

    // Password validation (if provided)
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali.' });
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
      if (sr.test_type === 'qc' && qcAccuracy === undefined) qcAccuracy = details?.accuracy;
      if (sr.test_type === 'math' && mathScore === undefined) mathScore = details?.score;
      if (sr.test_type === 'interview' && interviewScore === undefined) interviewScore = details?.probability;
    });

    res.json({
      success: true,
      message: 'Login berhasil!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        school: user.school,
        major: user.major,
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
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login: ' + err.message });
  }
});

// 4. GET ALL CANDIDATES (FOR ADMIN COMMAND CENTER)
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, phone, school, major, target_role, target_company, overall_status, is_admin, created_at, last_active FROM users ORDER BY created_at DESC'
    );

    const [allScores] = await pool.query(
      'SELECT user_id, test_type, score_details FROM test_scores ORDER BY id DESC'
    );

    const enriched = users.map(u => {
      const userScores = allScores.filter(s => s.user_id === u.id);
      let kraepelinScore, qcAccuracy, mathScore, interviewScore;

      userScores.forEach(sr => {
        const details = typeof sr.score_details === 'string' ? JSON.parse(sr.score_details) : sr.score_details;
        if (sr.test_type === 'kraepelin' && !kraepelinScore) kraepelinScore = details;
        if (sr.test_type === 'qc' && qcAccuracy === undefined) qcAccuracy = details?.accuracy;
        if (sr.test_type === 'math' && mathScore === undefined) mathScore = details?.score;
        if (sr.test_type === 'interview' && interviewScore === undefined) interviewScore = details?.probability;
      });

      return {
        id: u.id,
        name: u.name,
        phone: u.phone,
        school: u.school,
        major: u.major,
        targetRole: u.target_role,
        targetCompany: u.target_company,
        overallStatus: u.overall_status,
        isAdmin: Boolean(u.is_admin),
        completedTestsCount: userScores.length,
        createdAt: u.created_at,
        lastActive: u.last_active,
        kraepelinScore,
        qcAccuracy,
        mathScore,
        interviewScore
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    console.error('[Get Users Error]', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data peserta: ' + err.message });
  }
});

// 5. SAVE TEST SCORE
app.post('/api/scores', async (req, res) => {
  try {
    const { userId, testType, scoreSummary, scoreDetails } = req.body;

    if (!userId || !testType) {
      return res.status(400).json({ success: false, message: 'userId dan testType wajib diisi.' });
    }

    await pool.query(
      `INSERT INTO test_scores (user_id, test_type, score_summary, score_details, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, testType, scoreSummary || '', JSON.stringify(scoreDetails || {})]
    );

    // Update overall_status
    if (scoreDetails?.accuracy && scoreDetails.accuracy >= 90) {
      await pool.query("UPDATE users SET overall_status = 'Lolos Unggul', last_active = NOW() WHERE id = ?", [userId]);
    } else {
      await pool.query("UPDATE users SET last_active = NOW() WHERE id = ?", [userId]);
    }

    res.json({ success: true, message: 'Nilai latihan berhasil disimpan ke MySQL!' });
  } catch (err) {
    console.error('[Save Score Error]', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan skor: ' + err.message });
  }
});

// 6. DELETE USER (ADMIN ACTION)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'Data peserta berhasil dihapus dari database.' });
  } catch (err) {
    console.error('[Delete User Error]', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus data: ' + err.message });
  }
});

// 7. DASHBOARD SUMMARY STATS
app.get('/api/stats', async (req, res) => {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_admin = FALSE');
    const [[scoreCount]] = await pool.query('SELECT COUNT(*) as total FROM test_scores');
    const [[passCount]] = await pool.query("SELECT COUNT(*) as total FROM users WHERE overall_status = 'Lolos Unggul'");

    res.json({
      success: true,
      data: {
        totalCandidates: userCount.total,
        totalTestSessions: scoreCount.total,
        passingRate: userCount.total > 0 ? Math.round((passCount.total / userCount.total) * 100) : 75
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [SiapKerja Backend API] Server running on http://localhost:${PORT}`);
});
