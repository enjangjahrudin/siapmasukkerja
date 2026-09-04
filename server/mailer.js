const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport or Ethereal/Console fallback
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
  }

  // Fallback console transporter if SMTP is not yet configured
  return null;
}

const defaultSender = process.env.SMTP_FROM || process.env.SMTP_USER || '"SMK — Siap Masuk Kerja" <noreply@buatdigital.id>';

/**
 * Send 6-digit OTP email for Registration verification
 */
async function sendRegistrationOtpEmail(toEmail, toName, otpCode) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0369a1, #0284c7); padding: 30px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 32px 24px; text-align: center; }
        .otp-box { background: #f0f9ff; border: 2px dashed #38bdf8; border-radius: 16px; padding: 20px; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0369a1; font-family: monospace; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SMK — Siap Masuk Kerja</h1>
          <p>Simulasikan Seleksi. Tingkatkan Kesiapan Kerja.</p>
        </div>
        <div class="content">
          <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Halo, ${toName || 'Calon Pekerja'}! 👋</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            Terima kasih telah mendaftar di platform persiapan tes masuk industri <strong>SMK — Siap Masuk Kerja</strong>. 
            Gunakan kode verifikasi berikut untuk menyelesaikan pendaftaran akun Anda:
          </p>
          <div class="otp-box">
            <span style="font-size: 11px; font-weight: bold; color: #0284c7; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">KODE VERIFIKASI (OTP)</span>
            <span class="otp-code">${otpCode}</span>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            ⏱️ Kode ini berlaku selama <strong>10 menit</strong>. Jangan berikan kode ini kepada siapapun demi keamanan akun Anda.
          </p>
        </div>
        <div class="footer">
          &copy; 2026 SMK — Siap Masuk Kerja &bull; Powered by <a href="https://buatdigital.id" style="color: #0284c7; text-decoration: none; font-weight: bold;">BuatDigital.id</a>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: defaultSender,
        to: toEmail,
        subject: `[${otpCode}] Kode Verifikasi Pendaftaran Akun - SMK Siap Masuk Kerja`,
        html: htmlContent
      });
      console.log(`[Mailer] OTP sent to ${toEmail}`);
      return { success: true, method: 'smtp' };
    } catch (err) {
      console.error(`[Mailer Error] Failed to send email to ${toEmail}:`, err.message);
      // Fallback: log to console
      console.log(`[Mailer Fallback] OTP for ${toEmail}: ${otpCode}`);
      return { success: true, method: 'console_fallback', error: err.message };
    }
  } else {
    console.log(`\n========================================`);
    console.log(`[SMTP NOT CONFIGURED] SIMULATED EMAIL OTP`);
    console.log(`TO: ${toEmail} (${toName})`);
    console.log(`OTP CODE: ${otpCode}`);
    console.log(`========================================\n`);
    return { success: true, method: 'simulated', otp: otpCode };
  }
}

/**
 * Send Password Reset OTP Email
 */
async function sendPasswordResetOtpEmail(toEmail, toName, otpCode) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #e11d48, #be123c); padding: 30px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 32px 24px; text-align: center; }
        .otp-box { background: #fff1f2; border: 2px dashed #fda4af; border-radius: 16px; padding: 20px; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #be123c; font-family: monospace; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SMK — Siap Masuk Kerja</h1>
          <p>Permintaan Reset Kata Sandi Akun</p>
        </div>
        <div class="content">
          <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Halo, ${toName || 'Pengguna'}! 🔒</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            Kami menerima permintaan untuk mereset kata sandi akun Anda. Gunakan kode verifikasi di bawah ini untuk membuat kata sandi baru:
          </p>
          <div class="otp-box">
            <span style="font-size: 11px; font-weight: bold; color: #e11d48; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">KODE RESET KATA SANDI</span>
            <span class="otp-code">${otpCode}</span>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            ⏱️ Kode berlaku selama <strong>10 menit</strong>. Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini.
          </p>
        </div>
        <div class="footer">
          &copy; 2026 SMK — Siap Masuk Kerja &bull; Powered by <a href="https://buatdigital.id" style="color: #0284c7; text-decoration: none; font-weight: bold;">BuatDigital.id</a>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: defaultSender,
        to: toEmail,
        subject: `[${otpCode}] Kode Reset Kata Sandi - SMK Siap Masuk Kerja`,
        html: htmlContent
      });
      return { success: true, method: 'smtp' };
    } catch (err) {
      console.error(`[Mailer Error] Failed to send reset email:`, err.message);
      return { success: true, method: 'console_fallback', error: err.message };
    }
  } else {
    console.log(`\n========================================`);
    console.log(`[SMTP NOT CONFIGURED] SIMULATED RESET OTP`);
    console.log(`TO: ${toEmail}`);
    console.log(`RESET OTP CODE: ${otpCode}`);
    console.log(`========================================\n`);
    return { success: true, method: 'simulated', otp: otpCode };
  }
}

/**
 * Send Welcome Email after successful registration
 */
async function sendWelcomeEmail(toEmail, toName, targetRole, targetCompany) {
  const transporter = createTransporter();
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0284c7, #0369a1); padding: 30px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
        .content { padding: 32px 24px; }
        .role-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 6px 14px; border-radius: 12px; font-weight: bold; font-size: 12px; margin: 10px 0; }
        .btn { display: block; width: 100%; box-sizing: border-box; background: #0284c7; color: #ffffff; text-align: center; padding: 14px 20px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Selamat Datang di SMK Siap Masuk Kerja! 🎉</h1>
        </div>
        <div class="content">
          <p style="font-size: 14px; color: #334155;">Halo <strong>${toName}</strong>,</p>
          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            Akun Anda telah <strong>berhasil diverifikasi dan terdaftar</strong>. Mulai sekarang Anda dapat mengakses seluruh materi persiapan tes kerja industri:
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin: 15px 0;">
            <div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Target Posisi:</div>
            <div class="role-badge">${targetRole}</div>
            <div style="font-size: 12px; color: #475569; margin-top: 4px;">Sektor Sasaran: <strong>${targetCompany}</strong></div>
          </div>
          <ul style="font-size: 12px; color: #475569; line-height: 1.8; padding-left: 20px;">
            <li>Simulasi Psikotes Koran Kraepelin & Pauli (Tempo 15s)</li>
            <li>Tes Mekanika Bennett (Bank 1.000+ Soal & Diagram)</li>
            <li>Ketelitian Kode QC & Barcode</li>
            <li>Matematika Dasar & Aritmatika Deret</li>
            <li>Simulasi AI Voice Mock Interview HRD</li>
          </ul>
          <a href="https://siapkerja.buatdigital.id" class="btn">Mulai Latihan Sekarang &rarr;</a>
        </div>
        <div class="footer">
          &copy; 2026 SMK — Siap Masuk Kerja &bull; Powered by <a href="https://buatdigital.id" style="color: #0284c7; text-decoration: none; font-weight: bold;">BuatDigital.id</a>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: defaultSender,
        to: toEmail,
        subject: `🎉 Pendaftaran Berhasil! Selamat Datang di SMK Siap Masuk Kerja`,
        html: htmlContent
      });
      console.log(`[Mailer] Welcome email sent to ${toEmail}`);
    } catch (err) {}
  }
}

module.exports = {
  sendRegistrationOtpEmail,
  sendPasswordResetOtpEmail,
  sendWelcomeEmail
};
