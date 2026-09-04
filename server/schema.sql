-- =========================================================
-- DATABASE SCHEMA: SMK - SIAP MASUK KERJA
-- Database Engine: MySQL / MariaDB (aaPanel)
-- =========================================================

CREATE DATABASE IF NOT EXISTS `siapkerja_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `siapkerja_db`;

-- 1. TABEL USERS (Peserta & Administrator)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(191) NULL UNIQUE,
  `school` VARCHAR(255) DEFAULT 'SMK Buat Digital',
  `major` VARCHAR(255) DEFAULT 'Teknik Mesin',
  `gender` VARCHAR(20) DEFAULT 'Laki-laki',
  `height` DECIMAL(5,1) NULL,
  `weight` DECIMAL(5,1) NULL,
  `avatar_url` LONGTEXT NULL,
  `address` TEXT NULL,
  `password` VARCHAR(255) NOT NULL DEFAULT '123456',
  `target_role` ENUM('operator', 'qc', 'maintenance', 'logistics') NOT NULL DEFAULT 'operator',
  `target_company` VARCHAR(255) DEFAULT 'PT Astra Daihatsu / PT Yamaha Motor',
  `overall_status` VARCHAR(50) DEFAULT 'Perlu Latihan',
  `is_admin` BOOLEAN DEFAULT FALSE,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_active` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL OTP_VERIFICATIONS (Verifikasi Pendaftaran & Lupa Kata Sandi)
CREATE TABLE IF NOT EXISTS `otp_verifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `type` ENUM('register', 'forgot_password') NOT NULL,
  `payload` JSON NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (`email`),
  INDEX (`otp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL TEST_SCORES (Riwayat Rapor & Hasil Latihan Peserta)
CREATE TABLE IF NOT EXISTS `test_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `test_type` VARCHAR(50) NOT NULL, -- kraepelin, qc, math, multiplication, interview, tryout
  `score_summary` VARCHAR(100) NULL,
  `score_details` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. DATA AWAL (SEED DEFAULT USERS & SUPER ADMIN)
INSERT INTO `users` (`id`, `name`, `phone`, `email`, `school`, `major`, `password`, `target_role`, `target_company`, `overall_status`, `is_admin`, `is_verified`, `created_at`, `last_active`)
VALUES 
('SMK-ADMIN-001', 'Super Administrator', 'admin', 'admin@buatdigital.id', 'Management Pusat', 'Sistem Operasional', 'admin123', 'operator', 'HQ Siap Masuk Kerja', 'Lolos Unggul', TRUE, TRUE, NOW(), NOW()),
('SMK-2026-0891', 'Ahmad Fauzi', '081234567891', 'ahmad.fauzi@smk.id', 'SMKN 1 Karawang', 'Teknik Mesin', 'password123', 'operator', 'PT Astra Daihatsu Motor', 'Lolos Unggul', FALSE, TRUE, NOW(), NOW()),
('SMK-2026-0892', 'Siti Nurhaliza', '081234567892', 'siti.nurhaliza@smk.id', 'SMKN 2 Cikarang', 'Elektronika Industri', 'password123', 'qc', 'PT Epson Indonesia', 'Lolos Unggul', FALSE, TRUE, NOW(), NOW()),
('SMK-2026-0893', 'Rian Pratama', '081234567893', 'rian.pratama@smk.id', 'SMK Taruna Karya 1', 'Teknik Otomotif', 'password123', 'maintenance', 'PT Yamaha Motor Mfg', 'Lolos Standar', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `email` = VALUES(`email`);
