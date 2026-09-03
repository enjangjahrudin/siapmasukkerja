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
  `school` VARCHAR(255) DEFAULT 'SMKN 1',
  `major` VARCHAR(255) DEFAULT 'Teknik Mesin',
  `password` VARCHAR(255) NOT NULL DEFAULT '123456',
  `target_role` ENUM('operator', 'qc', 'maintenance', 'logistics') NOT NULL DEFAULT 'operator',
  `target_company` VARCHAR(255) DEFAULT 'PT Astra Daihatsu / PT Yamaha Motor',
  `overall_status` VARCHAR(50) DEFAULT 'Perlu Latihan',
  `is_admin` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_active` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL TEST_SCORES (Riwayat Rapor & Hasil Latihan Peserta)
CREATE TABLE IF NOT EXISTS `test_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `test_type` VARCHAR(50) NOT NULL, -- kraepelin, qc, math, multiplication, interview, tryout
  `score_summary` VARCHAR(100) NULL,
  `score_details` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. DATA AWAL (SEED DEFAULT USERS & SUPER ADMIN)
INSERT INTO `users` (`id`, `name`, `phone`, `school`, `major`, `password`, `target_role`, `target_company`, `overall_status`, `is_admin`, `created_at`, `last_active`)
VALUES 
('SMK-ADMIN-001', 'Super Administrator', 'admin', 'Management Pusat', 'Sistem Operasional', 'admin123', 'operator', 'HQ Siap Masuk Kerja', 'Lolos Unggul', TRUE, NOW(), NOW()),
('SMK-2026-0891', 'Ahmad Fauzi', '081234567891', 'SMKN 1 Karawang', 'Teknik Mesin', 'password123', 'operator', 'PT Astra Daihatsu Motor', 'Lolos Unggul', FALSE, NOW(), NOW()),
('SMK-2026-0892', 'Siti Nurhaliza', '081234567892', 'SMKN 2 Cikarang', 'Elektronika Industri', 'password123', 'qc', 'PT Epson Indonesia', 'Lolos Unggul', FALSE, NOW(), NOW()),
('SMK-2026-0893', 'Rian Pratama', '081234567893', 'SMK Taruna Karya 1', 'Teknik Otomotif', 'password123', 'maintenance', 'PT Yamaha Motor Mfg', 'Lolos Standar', FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- SEED NILAI DEFAULT PESERTA
INSERT INTO `test_scores` (`user_id`, `test_type`, `score_summary`, `score_details`)
VALUES
('SMK-2026-0891', 'kraepelin', 'Panker 17.2 | Akurasi 96.5%', '{"panker": 17.2, "janker": 96.5, "grade": "Sangat Baik"}'),
('SMK-2026-0891', 'qc', 'Akurasi 94%', '{"accuracy": 94, "score": 180}'),
('SMK-2026-0891', 'interview', 'Prediksi Lolos 88%', '{"starScore": 90, "probability": 88}'),
('SMK-2026-0892', 'kraepelin', 'Panker 15.8 | Akurasi 98.0%', '{"panker": 15.8, "janker": 98.0, "grade": "Sangat Baik"}'),
('SMK-2026-0892', 'qc', 'Akurasi 98%', '{"accuracy": 98, "score": 210}'),
('SMK-2026-0892', 'interview', 'Prediksi Lolos 91%', '{"starScore": 95, "probability": 91}')
ON DUPLICATE KEY UPDATE `score_summary` = VALUES(`score_summary`);
