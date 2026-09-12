import { RegisteredUser } from './auth-storage';
import html2pdf from 'html2pdf.js';

/**
 * Format date to Indonesian formal standard (e.g., 11 September 2026)
 */
function formatIndonesianDate(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Calculate composite weighted score for candidate
 */
export function calculateCompositeScore(user: RegisteredUser): number {
  const parts: { score: number; weight: number }[] = [];

  // 1. Tes Kraepelin & Pauli (Ritme & Ketelitian Fisik)
  if (user.kraepelinScore?.janker !== undefined && user.kraepelinScore?.janker !== null) {
    parts.push({ score: Number(user.kraepelinScore.janker), weight: 0.20 });
  }
  // 2. Ketelitian Kode QC (Speed Match & NG Reject)
  if (user.qcAccuracy !== undefined && user.qcAccuracy !== null) {
    parts.push({ score: Number(user.qcAccuracy), weight: 0.20 });
  }
  // 3. Matematika Dasar (Kabataku, Persen & Aljabar)
  if (user.mathScore !== undefined && user.mathScore !== null) {
    parts.push({ score: Number(user.mathScore), weight: 0.15 });
  }
  // 4. Tabel Perkalian Kilat (Matriks 120 Detik)
  if (user.multiplicationScore?.accuracy !== undefined && user.multiplicationScore?.accuracy !== null) {
    parts.push({ score: Number(user.multiplicationScore.accuracy), weight: 0.15 });
  }
  // 5. Psikotes & Penalaran (Logika, Analogi & Silogisme)
  if (user.psychotestScore !== undefined && user.psychotestScore !== null) {
    parts.push({ score: Number(user.psychotestScore), weight: 0.15 });
  }
  // 6. Mekanika Bennett (Roda Gigi, Katrol & Tuas)
  if (user.mechanicalScore !== undefined && user.mechanicalScore !== null) {
    parts.push({ score: Number(user.mechanicalScore), weight: 0.15 });
  }
  // 7. Interview AI HRD (Opsional/Bonus)
  if (user.interviewScore !== undefined && user.interviewScore !== null) {
    parts.push({ score: Number(user.interviewScore), weight: 0.15 });
  }

  if (parts.length === 0) {
    return 0;
  }

  const totalWeight = parts.reduce((acc, p) => acc + p.weight, 0);
  const weightedSum = parts.reduce((acc, p) => acc + (p.score * p.weight), 0);
  const composite = weightedSum / totalWeight;
  return Math.round(composite * 10) / 10;
}

export interface SchoolSignerInfo {
  name?: string;
  title?: string;
  nip?: string;
}

/**
 * High-fidelity native vector print & Save-as-PDF runner
 */
function triggerPrint(htmlContent: string, title: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    // Fallback: Open in dedicated window
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.document.title = title;
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 500);
    }
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();
  doc.title = title;

  iframe.contentWindow?.focus();
  setTimeout(() => {
    try {
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print error, falling back to popup window', e);
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.open();
        printWin.document.write(htmlContent);
        printWin.document.close();
        printWin.document.title = title;
        printWin.focus();
        setTimeout(() => {
          printWin.print();
        }, 500);
      }
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 400);
}


/**
 * GENERATE OFFICIAL INDIVIDUAL STUDENT REPORT HTML CONTENT (STRICTLY SINGLE-PAGE A4)
 */
export function generateIndividualStudentReportHtml(student: RegisteredUser, signer?: SchoolSignerInfo): string {
  const hasCompletedTests = Boolean(
    (student.completedTestsCount && student.completedTestsCount > 0) ||
    student.kraepelinScore ||
    (student.qcAccuracy !== undefined && student.qcAccuracy !== null) ||
    (student.mathScore !== undefined && student.mathScore !== null) ||
    (student.multiplicationScore?.accuracy !== undefined && student.multiplicationScore?.accuracy !== null) ||
    (student.psychotestScore !== undefined && student.psychotestScore !== null) ||
    (student.mechanicalScore !== undefined && student.mechanicalScore !== null) ||
    (student.interviewScore !== undefined && student.interviewScore !== null)
  );

  const compositeScore = calculateCompositeScore(student);
  const printDate = formatIndonesianDate();
  const documentId = `RAPOR-BKK/${student.id}/${new Date().getFullYear()}`;

  // 1. Kraepelin & Pauli
  const kraepelinPanker = student.kraepelinScore?.panker ? `${student.kraepelinScore.panker} angka/menit` : '-';
  const kraepelinJanker = student.kraepelinScore?.janker ? `${student.kraepelinScore.janker}%` : '-';
  const kraepelinGrade = student.kraepelinScore?.grade || (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  // 2. Ketelitian Kode QC
  const qcAccuracy = student.qcAccuracy !== undefined && student.qcAccuracy !== null ? `${student.qcAccuracy}%` : '-';
  const qcStatus = student.qcAccuracy !== undefined && student.qcAccuracy !== null ? (student.qcAccuracy >= 85 ? 'Memenuhi Standar Inspeksi' : 'Perlu Peningkatan Akurasi') : (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  // 3. Matematika Dasar
  const mathScore = student.mathScore !== undefined && student.mathScore !== null ? `${student.mathScore} / 100` : '-';
  const mathStatus = student.mathScore !== undefined && student.mathScore !== null ? (student.mathScore >= 70 ? 'Logika Hitung Baik' : 'Perlu Latihan Hitung') : (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  // 4. Tabel Perkalian Kilat
  const multAcc = student.multiplicationScore?.accuracy !== undefined && student.multiplicationScore?.accuracy !== null ? `${student.multiplicationScore.accuracy}%` : '-';
  const multDetail = student.multiplicationScore?.completed ? `${student.multiplicationScore.correct || 0}/${student.multiplicationScore.completed} benar` : '';
  const multStatus = student.multiplicationScore?.accuracy !== undefined && student.multiplicationScore?.accuracy !== null ? (student.multiplicationScore.accuracy >= 80 ? 'Hitung Kilat Prima' : 'Perlu Pembiasaan') : (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  // 5. Psikotes & Penalaran
  const psychotestScore = student.psychotestScore !== undefined && student.psychotestScore !== null ? `${student.psychotestScore} / 100` : '-';
  const psychotestStatus = student.psychotestScore !== undefined && student.psychotestScore !== null ? (student.psychotestScore >= 70 ? 'Kepatuhan SOP Prima' : 'Perlu Pembinaan SOP') : (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  // 6. Mekanika Bennett
  const mechanicalScore = student.mechanicalScore !== undefined && student.mechanicalScore !== null ? `${student.mechanicalScore} / 100` : '-';
  const mechanicalStatus = student.mechanicalScore !== undefined && student.mechanicalScore !== null ? (student.mechanicalScore >= 70 ? 'Pemahaman Mekanik Siap' : 'Perlu Pemahaman Tuas/Katrol') : (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  // 7. Interview (Opsional)
  const interviewScore = student.interviewScore !== undefined && student.interviewScore !== null ? `${student.interviewScore}%` : '-';
  const interviewStatus = student.interviewScore !== undefined && student.interviewScore !== null ? (student.interviewScore >= 70 ? 'Siap Interview HRD' : 'Perlu Latihan Wawancara') : (hasCompletedTests ? 'Belum Diuji' : 'Belum Mengikuti Tes');

  const displayStatus = hasCompletedTests ? student.overallStatus : 'Belum Ada Data Tes';
  const isLolosUnggul = displayStatus === 'Lolos Unggul';
  const isLolosStandar = displayStatus === 'Lolos Standar';
  const statusColor = !hasCompletedTests ? '#64748b' : isLolosUnggul ? '#059669' : isLolosStandar ? '#0284c7' : '#d97706';
  const statusBg = !hasCompletedTests ? '#f8fafc' : isLolosUnggul ? '#ecfdf5' : isLolosStandar ? '#f0f9ff' : '#fffbeb';

  return `
    <div style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #0f172a; font-size: 8pt; width: 794px; height: 1122px; box-sizing: border-box; background: #ffffff; padding: 18px 22px 50px 22px; position: relative; overflow: hidden;">
      
      <!-- KOP RESMI -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px double #0f172a; padding-bottom: 4px; margin-bottom: 6px;">
        <svg style="width: 44px; height: 44px; flex-shrink: 0;" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#090d16"/>
          <path d="M10 34 L16 34 L16 25 L10 27 Z" fill="#38bdf8"/>
          <path d="M19 34 L25 34 L25 18 L19 21 Z" fill="#0ea5e9"/>
          <path d="M28 34 L34 34 L40 12 L34 12 L28 27 Z" fill="#10b981"/>
          <polygon points="40,8 43,11 40,14 37,11" fill="#34d399"/>
        </svg>
        <div style="flex: 1; text-align: center; padding: 0 10px;">
          <div style="font-size: 7.2pt; font-weight: 800; letter-spacing: 1px; color: #0284c7; text-transform: uppercase;">
            PLATFORM ASESMEN KESIAPAN KERJA &amp; SELEKSI INDUSTRI • BUATDIGITAL.ID
          </div>
          <div style="font-size: 11.5pt; font-weight: 900; color: #0f172a; margin: 1px 0; letter-spacing: 0.3px;">
            SIAP MASUK KERJA • PUSAT ASESMEN PSIKOMETRIK
          </div>
          <p style="font-size: 6.8pt; color: #475569; margin: 0; line-height: 1.2;">
            Platform Uji Kompetensi Kesiapan Kerja, Psikometrik &amp; Simulasi Interview Standar PT Toyota, PT Astra, PT Epson, PT Yamaha Motor Mfg<br/>
            Website: siapkerja.buatdigital.id dan www.buatdigital.id • Email: info@buatdigital.id
          </p>
        </div>
        <div style="text-align: right; font-size: 6.5pt; color: #64748b; font-weight: 600; min-width: 80px; flex-shrink: 0;">
          <strong style="color: #0f172a;">KODE DOKUMEN:</strong><br/>
          ${documentId}
        </div>
      </div>

      <!-- JUDUL DOKUMEN -->
      <div style="text-align: center; margin-bottom: 5px;">
        <h1 style="font-size: 10.5pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin: 0;">
          RAPOR HASIL SELEKSI PSIKOMETRIK &amp; KESIAPAN KERJA
        </h1>
        <div style="font-size: 7pt; color: #64748b; margin-top: 1px; font-weight: 600;">
          Nomor Registrasi Asesmen: ${student.id} • Diterbitkan: ${printDate}
        </div>
      </div>

      <!-- BIODATA SISWA -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px;">
        <tr>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600; width: 18%;">Nama Lengkap</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b; width: 2%;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800; width: 30%;">${student.name}</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600; width: 18%;">Asal Sekolah</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b; width: 2%;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800; width: 30%;">${student.school}</td>
        </tr>
        <tr>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600;">NIS / ID Peserta</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800;">${student.id}</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600;">Kompetensi Keahlian</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800;">${student.major}</td>
        </tr>
        <tr>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600;">No. WhatsApp</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800;">${student.phone}</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600;">Target Posisi</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800; text-transform: capitalize;">${student.targetRole}</td>
        </tr>
        <tr>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600;">Perusahaan Sasaran</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800;">${student.targetCompany || 'Industri Manufaktur Otomotif / Elektronika'}</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #475569; font-weight: 600;">Tinggi / Berat Badan</td>
          <td style="padding: 2.5px 2px; font-size: 7.5pt; color: #64748b;">:</td>
          <td style="padding: 2.5px 5px; font-size: 7.5pt; color: #0f172a; font-weight: 800;">${student.height ? `${student.height} cm` : '-'} / ${student.weight ? `${student.weight} kg` : '-'}</td>
        </tr>
      </table>

      <!-- STATUS KELAYAKAN HASIL AKHIR -->
      <div style="border: 1.5px solid ${statusColor}; background-color: ${statusBg}; padding: 4px 8px; border-radius: 5px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
        <div>
          <span style="font-size: 6.5pt; font-weight: 800; color: #64748b; text-transform: uppercase; display: block;">Hasil Keputusan Asesmen:</span>
          <span style="display: inline-block; font-weight: 900; font-size: 9.5pt; color: ${statusColor}; text-transform: uppercase; letter-spacing: 0.5px;">${displayStatus}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 6.5pt; font-weight: 800; color: #64748b; text-transform: uppercase; display: block;">Skor Komposit Terbobot:</span>
          <span style="font-size: 13pt; font-weight: 900; color: ${statusColor};">${hasCompletedTests ? compositeScore : '-'} <span style="font-size: 7pt; color: #64748b;">${hasCompletedTests ? '/ 100' : ''}</span></span>
        </div>
      </div>

      <!-- TABEL NILAI 6 ASPEK UJIAN SELEKSI INDUSTRI -->
      <div style="font-size: 7.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-left: 3.5px solid #0284c7; padding-left: 6px; margin: 5px 0 3px 0;">
        Rekapitulasi Nilai 6 Modul Ujian Seleksi Kesiapan Kerja Industri
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="width: 4%; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 7pt; font-weight: 800; text-align: center;">No</th>
            <th style="width: 38%; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 7pt; font-weight: 800; text-align: left;">Aspek Uji / Modul Tes</th>
            <th style="width: 18%; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 7pt; font-weight: 800; text-align: center;">Hasil &amp; Capaian</th>
            <th style="width: 17%; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 7pt; font-weight: 800; text-align: center;">Standar Industri</th>
            <th style="width: 23%; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 7pt; font-weight: 800; text-align: left;">Status Kelayakan</th>
          </tr>
        </thead>
        <tbody>
          <!-- 1. Kraepelin -->
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 700;">1</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;">
              <strong style="color: #0f172a;">Tes Kraepelin &amp; Pauli</strong><br/>
              <span style="font-size: 6.2pt; color: #64748b;">Kecepatan, Ritme &amp; Daya Tahan Kerja Shift</span>
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 800; color: #0284c7;">
              ${student.kraepelinScore ? `${kraepelinPanker}<br/><span style="font-size: 6.2pt; font-weight: 600;">Akurasi: ${kraepelinJanker}</span>` : '<span style="color:#94a3b8; font-weight:600;">Belum Tes</span>'}
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 6.5pt; text-align: center; color: #475569;">≥ 14.0 angk/mnt<br/>Akurasi ≥ 90%</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;"><strong style="color: ${student.kraepelinScore ? '#059669' : '#94a3b8'};">${kraepelinGrade}</strong></td>
          </tr>

          <!-- 2. QC -->
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 700;">2</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;">
              <strong style="color: #0f172a;">Ketelitian Kode QC</strong><br/>
              <span style="font-size: 6.2pt; color: #64748b;">Speed Match 45s &amp; Deteksi Cacat Produk (NG)</span>
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 800; color: #059669;">
              ${student.qcAccuracy !== undefined && student.qcAccuracy !== null ? qcAccuracy : '<span style="color:#94a3b8; font-weight:600;">Belum Tes</span>'}
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 6.5pt; text-align: center; color: #475569;">Akurasi ≥ 85%</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;"><strong style="color: ${student.qcAccuracy !== undefined && student.qcAccuracy !== null ? '#059669' : '#94a3b8'};">${qcStatus}</strong></td>
          </tr>

          <!-- 3. Matematika Dasar -->
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 700;">3</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;">
              <strong style="color: #0f172a;">Matematika Dasar</strong><br/>
              <span style="font-size: 6.2pt; color: #64748b;">Kabataku, Persentase, Aljabar &amp; Soal Cerita Line</span>
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 800; color: #0284c7;">
              ${student.mathScore !== undefined && student.mathScore !== null ? mathScore : '<span style="color:#94a3b8; font-weight:600;">Belum Tes</span>'}
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 6.5pt; text-align: center; color: #475569;">Nilai ≥ 70 / 100</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;"><strong style="color: ${student.mathScore !== undefined && student.mathScore !== null ? '#059669' : '#94a3b8'};">${mathStatus}</strong></td>
          </tr>

          <!-- 4. Perkalian Kilat -->
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 700;">4</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;">
              <strong style="color: #0f172a;">Tabel Perkalian Kilat</strong><br/>
              <span style="font-size: 6.2pt; color: #64748b;">Refleks &amp; Ketepatan Hitung Matriks 120 Detik</span>
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 800; color: #d97706;">
              ${student.multiplicationScore?.accuracy !== undefined && student.multiplicationScore?.accuracy !== null ? `${multAcc}<br/><span style="font-size: 6.2pt; font-weight: 600;">${multDetail}</span>` : '<span style="color:#94a3b8; font-weight:600;">Belum Tes</span>'}
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 6.5pt; text-align: center; color: #475569;">Akurasi ≥ 80%</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;"><strong style="color: ${student.multiplicationScore?.accuracy !== undefined && student.multiplicationScore?.accuracy !== null ? '#059669' : '#94a3b8'};">${multStatus}</strong></td>
          </tr>

          <!-- 5. Psikotes & Penalaran -->
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 700;">5</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;">
              <strong style="color: #0f172a;">Psikotes &amp; Penalaran</strong><br/>
              <span style="font-size: 6.2pt; color: #64748b;">Sinonim, Antonim, Analogi &amp; Silogisme K3/SOP</span>
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 800; color: #7c3aed;">
              ${student.psychotestScore !== undefined && student.psychotestScore !== null ? psychotestScore : '<span style="color:#94a3b8; font-weight:600;">Belum Tes</span>'}
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 6.5pt; text-align: center; color: #475569;">Nilai ≥ 70 / 100</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;"><strong style="color: ${student.psychotestScore !== undefined && student.psychotestScore !== null ? '#059669' : '#94a3b8'};">${psychotestStatus}</strong></td>
          </tr>

          <!-- 6. Mekanika Bennett -->
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 700;">6</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;">
              <strong style="color: #0f172a;">Mekanika Bennett</strong><br/>
              <span style="font-size: 6.2pt; color: #64748b;">Prinsip Mekanik: Roda Gigi, Katrol, Tuas &amp; Fluida</span>
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt; text-align: center; font-weight: 800; color: #0284c7;">
              ${student.mechanicalScore !== undefined && student.mechanicalScore !== null ? mechanicalScore : '<span style="color:#94a3b8; font-weight:600;">Belum Tes</span>'}
            </td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 6.5pt; text-align: center; color: #475569;">Nilai ≥ 70 / 100</td>
            <td style="border: 1px solid #cbd5e1; padding: 2.5px 5px; font-size: 7.2pt;"><strong style="color: ${student.mechanicalScore !== undefined && student.mechanicalScore !== null ? '#059669' : '#94a3b8'};">${mechanicalStatus}</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- CATATAN ASESOR -->
      <div style="font-size: 8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-left: 3.5px solid #0284c7; padding-left: 6px; margin: 6px 0 4px 0;">
        Catatan Asesor & Rekomendasi Penempatan Kerja
      </div>
      <div style="border: 1px solid #e2e8f0; background: #fafafa; padding: 5px 8px; border-radius: 4px; font-size: 7.2pt; color: #334155; margin-bottom: 7px; line-height: 1.3;">
        ${hasCompletedTests ? `
          <strong>Analisis Kompetensi Siswa:</strong> Kandidat telah menyelesaikan serangkaian modul uji kesiapan kerja industri. Tingkat kestabilan kerja, kepatuhan SOP, dan daya tanggap instruksi telah terekam dalam asesmen sistem.<br/>
          <strong>Rekomendasi Penempatan:</strong> Prioritas Penempatan pada Divisi <em>${student.targetRole === 'qc' ? 'Quality Control & Final Inspector' : student.targetRole === 'maintenance' ? 'Preventive Maintenance & Utility Line' : 'Operator Line Assembly & Stamping Presisi'}</em> (${student.targetCompany || 'Industri Otomotif / Elektronik'}).
        ` : `
          <strong>Analisis Kompetensi Siswa:</strong> Kandidat baru terdaftar di platform dan belum menyelesaikan modul tes seleksi psikometrik/kompetensi industri.<br/>
          <strong>Rekomendasi Penempatan:</strong> Siswa disarankan untuk menyelesaikan modul tes (Kraepelin, QC, Matematika Dasar, Psikotes SOP, dan Simulasi Wawancara AI) agar rekomendasi penempatan kerja industri otomatis terbit.
        `}
      </div>

      <!-- LEMBAR PENGESAHAN -->
      <div style="display: flex; justify-content: space-between; margin-top: 6px; page-break-inside: avoid;">
        <div style="width: 44%; text-align: center; font-size: 7.8pt;">
          <div>Mengetahui & Memvalidasi,</div>
          <div style="font-weight: 700; color: #475569;">${signer?.title || 'Koordinator BKK / Hubinmas'}</div>
          <div style="height: 44px; display: flex; align-items: center; justify-content: center; margin: 2px 0;">
            <svg style="width: 44px; height: 44px; opacity: 0.85;" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#0284c7" stroke-width="3" stroke-dasharray="6 3"/>
              <circle cx="50" cy="50" r="38" stroke="#0284c7" stroke-width="1.5"/>
              <text x="50" y="38" font-size="7" font-weight="900" fill="#0284c7" text-anchor="middle">BURSA KERJA KHUSUS</text>
              <text x="50" y="52" font-size="10" font-weight="900" fill="#0284c7" text-anchor="middle">★ VALID ★</text>
              <text x="50" y="66" font-size="7" font-weight="900" fill="#0284c7" text-anchor="middle">SMK SIAP KERJA</text>
            </svg>
          </div>
          <div style="font-weight: 800; font-size: 8pt; text-decoration: underline; color: #0f172a;">${signer?.name ? signer.name : '( .................................................. )'}</div>
          <div style="font-size: 6.8pt; color: #64748b; margin-top: 1px;">${signer?.nip ? `NIP. ${signer.nip}` : signer?.name ? `${signer.title || 'Koordinator BKK'} • ${student.school}` : `NIP. ..................................................`}</div>
          <div style="font-size: 6.8pt; color: #64748b;">${student.school}</div>
        </div>

        <div style="width: 44%; text-align: center; font-size: 7.8pt;">
          <div>Diterbitkan di Karawang, ${printDate}</div>
          <div style="font-weight: 700; color: #475569;">Platform Owner & Tim Asesor</div>
          <div style="height: 44px; display: flex; align-items: center; justify-content: center; margin: 2px 0;">
            <svg style="width: 44px; height: 44px; opacity: 0.9;" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#059669" stroke-width="3"/>
              <circle cx="50" cy="50" r="38" stroke="#059669" stroke-width="1.5"/>
              <text x="50" y="38" font-size="7.5" font-weight="900" fill="#059669" text-anchor="middle">BUATDIGITAL.ID</text>
              <text x="50" y="52" font-size="8.5" font-weight="900" fill="#059669" text-anchor="middle">★ TERVERIFIKASI ★</text>
              <text x="50" y="66" font-size="7" font-weight="900" fill="#059669" text-anchor="middle">SIAP MASUK KERJA</text>
            </svg>
          </div>
          <div style="font-weight: 800; font-size: 8pt; text-decoration: underline; color: #0f172a;">Enjang Jahrudin, S.M.</div>
          <div style="font-size: 6.8pt; color: #64748b; margin-top: 1px;">Founder & CEO BuatDigital.id</div>
        </div>
      </div>

      <!-- FOOTER STATIS — position:absolute agar selalu di bawah halaman A4 -->
      <div style="position: absolute; bottom: 20px; left: 24px; right: 24px; border-top: 1px dashed #cbd5e1; padding-top: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 6.5pt; color: #64748b;">
        <span>Dokumen resmi hasil evaluasi otomatis platform <strong>SMK Siap Masuk Kerja</strong> • Powered by <strong>BuatDigital.id</strong> (www.buatdigital.id).</span>
        <span>Rapor Hasil Seleksi • <strong>Halaman 1 dari 1 (1/1)</strong> • Diterbitkan: ${new Date().toLocaleString('id-ID')}</span>
      </div>

    </div>
  `;
}

/**
 * DIRECT DOWNLOAD INDIVIDUAL STUDENT REPORT AS PDF (NO PRINT DIALOG)
 */
export async function downloadIndividualStudentReportPdf(student: RegisteredUser, signer?: SchoolSignerInfo): Promise<void> {
  const fileName = `Rapor_${student.id || 'Peserta'}_${(student.name || 'Siswa').replace(/\s+/g, '_')}.pdf`;
  const htmlContent = generateIndividualStudentReportHtml(student, signer);

  const opt = {
    margin: [0, 0, 0, 0],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: 794,
      windowHeight: 1122
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
      compress: true
    }
  };

  try {
    // Pass HTML content string directly — DO NOT wrap in <!DOCTYPE html> (causes blank pages)
    // html2pdf creates its own internal container div with the content as innerHTML
    // @ts-ignore
    await html2pdf().set(opt).from(htmlContent, 'string').save();
  } catch (err) {
    console.warn('html2pdf failed, falling back to print dialog', err);
    triggerPrint(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}</style></head><body>${htmlContent}</body></html>`, fileName.replace('.pdf', ''));
  }
}

/**
 * Backward compatibility: Calling printIndividualStudentReport now triggers direct PDF download
 */
export async function printIndividualStudentReport(student: RegisteredUser, signer?: SchoolSignerInfo): Promise<void> {
  return downloadIndividualStudentReportPdf(student, signer);
}

/**
 * GENERATE OFFICIAL COLLECTIVE SCHOOL SELECTION REPORT HTML CONTENT
 */
export function generateCollectiveSchoolReportHtml(schoolName: string, students: RegisteredUser[], signer?: SchoolSignerInfo): string {
  const printDate = formatIndonesianDate();
  const targetSchoolLabel = schoolName === 'all' ? 'SELURUH SEKOLAH MITRA BKK' : schoolName.toUpperCase();
  const documentId = `LAP-SELEKSI/${new Date().getFullYear()}/${Date.now().toString().slice(-6)}`;

  const total = students.length;
  const lolosUnggul = students.filter(s => s.overallStatus === 'Lolos Unggul').length;
  const lolosStandar = students.filter(s => s.overallStatus === 'Lolos Standar').length;
  const perluLatihan = students.filter(s => s.overallStatus === 'Perlu Latihan').length;

  const pctUnggul = total > 0 ? Math.round((lolosUnggul / total) * 100) : 0;
  const pctStandar = total > 0 ? Math.round((lolosStandar / total) * 100) : 0;
  const pctLatihan = total > 0 ? Math.round((perluLatihan / total) * 100) : 0;

  const avgComposite = total > 0 
    ? (students.reduce((acc, s) => acc + calculateCompositeScore(s), 0) / total).toFixed(1)
    : '0.0';

  const totalPages = total <= 10 ? 1 : Math.ceil((total - 10) / 18) + 1;

  return `
    <div style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #0f172a; line-height: 1.35; font-size: 8pt; width: 100%; box-sizing: border-box; background: #ffffff; padding: 18px 24px;">
      
      <!-- KOP RESMI LAPORAN KOLEKTIF -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px double #0f172a; padding-bottom: 6px; margin-bottom: 8px;">
        <svg style="width: 48px; height: 48px; flex-shrink: 0;" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="10" fill="#090d16"/>
          <path d="M10 34 L16 34 L16 25 L10 27 Z" fill="#38bdf8"/>
          <path d="M19 34 L25 34 L25 18 L19 21 Z" fill="#0ea5e9"/>
          <path d="M28 34 L34 34 L40 12 L34 12 L28 27 Z" fill="#10b981"/>
          <polygon points="40,8 43,11 40,14 37,11" fill="#34d399"/>
        </svg>
        <div style="flex: 1; text-align: center; padding: 0 15px;">
          <div style="font-size: 8pt; font-weight: 800; letter-spacing: 1px; color: #0284c7; text-transform: uppercase;">
            PUSAT DATA ASESMEN KESIAPAN KERJA & SELEKSI INDUSTRI • BUATDIGITAL.ID
          </div>
          <div style="font-size: 13pt; font-weight: 900; color: #0f172a; margin: 1px 0;">
            LAPORAN REKAPITULASI HASIL SELEKSI SISWA BKK MITRA
          </div>
          <p style="font-size: 7pt; color: #475569; margin: 0; line-height: 1.25;">
            Standar Pengujian: PT Toyota Motor Mfg, PT Astra Daihatsu, PT Epson, PT Yamaha Motor Mfg & Standar BKK SMK<br/>
            Website: siapkerja.buatdigital.id dan www.buatdigital.id • Email: info@buatdigital.id
          </p>
        </div>
        <div style="text-align: right; font-size: 6.8pt; color: #64748b; font-weight: 600; min-width: 90px; flex-shrink: 0;">
          <strong style="color: #0f172a;">NO. DOKUMEN:</strong><br/>
          ${documentId}
        </div>
      </div>

      <!-- JUDUL LAPORAN -->
      <div style="text-align: center; margin-bottom: 8px;">
        <h1 style="font-size: 11pt; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0;">
          REKAPITULASI KELAYAKAN KERJA: ${targetSchoolLabel}
        </h1>
        <div style="font-size: 7.5pt; color: #64748b; margin-top: 1px; font-weight: 600;">
          Tanggal Penarikan Data: ${printDate} • Sumber Basis Data: Server Terpusat SiapKerja
        </div>
      </div>

      <!-- RINGKASAN METRIK SELEKSI -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
          <td style="width: 20%; padding: 4px 6px;">
            <div style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 6px; border-radius: 4px; text-align: center;">
              <span style="font-size: 6.8pt; color: #64748b; font-weight: 700; text-transform: uppercase; display: block;">Total Peserta</span>
              <strong style="font-size: 13pt; color: #0f172a;">${total}</strong> <span style="font-size: 7pt; color: #64748b;">Siswa</span>
            </div>
          </td>
          <td style="width: 20%; padding: 4px 6px;">
            <div style="border: 1px solid #86efac; background: #ecfdf5; padding: 6px; border-radius: 4px; text-align: center;">
              <span style="font-size: 6.8pt; color: #059669; font-weight: 700; text-transform: uppercase; display: block;">Lolos Unggul (A)</span>
              <strong style="font-size: 13pt; color: #059669;">${lolosUnggul}</strong> <span style="font-size: 7pt; color: #059669;">(${pctUnggul}%)</span>
            </div>
          </td>
          <td style="width: 20%; padding: 4px 6px;">
            <div style="border: 1px solid #7dd3fc; background: #f0f9ff; padding: 6px; border-radius: 4px; text-align: center;">
              <span style="font-size: 6.8pt; color: #0284c7; font-weight: 700; text-transform: uppercase; display: block;">Lolos Standar (B)</span>
              <strong style="font-size: 13pt; color: #0284c7;">${lolosStandar}</strong> <span style="font-size: 7pt; color: #0284c7;">(${pctStandar}%)</span>
            </div>
          </td>
          <td style="width: 20%; padding: 4px 6px;">
            <div style="border: 1px solid #fcd34d; background: #fffbeb; padding: 6px; border-radius: 4px; text-align: center;">
              <span style="font-size: 6.8pt; color: #d97706; font-weight: 700; text-transform: uppercase; display: block;">Perlu Latihan</span>
              <strong style="font-size: 13pt; color: #d97706;">${perluLatihan}</strong> <span style="font-size: 7pt; color: #d97706;">(${pctLatihan}%)</span>
            </div>
          </td>
          <td style="width: 20%; padding: 4px 6px;">
            <div style="border: 1px solid #e2e8f0; background: #f1f5f9; padding: 6px; border-radius: 4px; text-align: center;">
              <span style="font-size: 6.8pt; color: #334155; font-weight: 700; text-transform: uppercase; display: block;">Rata-rata Skor</span>
              <strong style="font-size: 13pt; color: #0f172a;">${avgComposite}</strong> <span style="font-size: 7pt; color: #64748b;">/ 100</span>
            </div>
          </td>
        </tr>
      </table>

      <!-- TABEL DAFTAR KANDIDAT -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="width: 3%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">No</th>
            <th style="width: 9%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: left;">NIS / ID</th>
            <th style="width: 15%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: left;">Nama Siswa</th>
            <th style="width: 11%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: left;">Jurusan</th>
            <th style="width: 10%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Kraepelin</th>
            <th style="width: 7%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">QC</th>
            <th style="width: 7%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Mat. Dasar</th>
            <th style="width: 7%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Perkalian</th>
            <th style="width: 7%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Psikotes</th>
            <th style="width: 7%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Mekanika</th>
            <th style="width: 7%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Interview</th>
            <th style="width: 10%; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 6.8pt; font-weight: 800; text-align: center;">Keputusan</th>
          </tr>
        </thead>
        <tbody>
          ${students.length === 0 ? `
            <tr>
              <td colspan="12" style="text-align: center; padding: 15px; color: #64748b; font-size: 8pt; border: 1px solid #cbd5e1;">
                Belum ada data siswa terdaftar untuk kriteria sekolah ini.
              </td>
            </tr>
          ` : students.map((s, idx) => {
            const comp = calculateCompositeScore(s);
            const isUnggul = s.overallStatus === 'Lolos Unggul';
            const isStandar = s.overallStatus === 'Lolos Standar';
            const color = isUnggul ? '#059669' : isStandar ? '#0284c7' : '#d97706';
            const bg = isUnggul ? '#ecfdf5' : isStandar ? '#f0f9ff' : '#fffbeb';

            return `
            <tr style="background-color: ${idx % 2 === 1 ? '#f8fafc' : '#ffffff'};">
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center;">${idx + 1}</td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; font-weight: 700; color: #0284c7;">${s.id}</td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 7.2pt; font-weight: 700; color: #0f172a;">${s.name}</td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.5pt; color: #475569;">${s.major || '-'}</td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #0284c7;">
                ${s.kraepelinScore?.panker ? `${s.kraepelinScore.panker} a/m (${s.kraepelinScore.janker}%)` : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #059669;">
                ${s.qcAccuracy !== undefined && s.qcAccuracy !== null ? `${s.qcAccuracy}%` : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #0284c7;">
                ${s.mathScore !== undefined && s.mathScore !== null ? s.mathScore : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #d97706;">
                ${s.multiplicationScore?.accuracy !== undefined && s.multiplicationScore?.accuracy !== null ? `${s.multiplicationScore.accuracy}%` : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #7c3aed;">
                ${s.psychotestScore !== undefined && s.psychotestScore !== null ? s.psychotestScore : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #0284c7;">
                ${s.mechanicalScore !== undefined && s.mechanicalScore !== null ? s.mechanicalScore : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center; font-weight: 700; color: #059669;">
                ${s.interviewScore !== undefined && s.interviewScore !== null ? `${s.interviewScore}%` : '-'}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 2.5px 4px; font-size: 6.8pt; text-align: center;">
                <span style="display: inline-block; padding: 1.5px 4px; border-radius: 3px; font-size: 6.5pt; font-weight: 800; background-color: ${bg}; color: ${color}; border: 1px solid ${color};">
                  ${s.overallStatus} (${comp})
                </span>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <!-- LEMBAR TANDA TANGAN & PENGESAHAN -->
      <div style="display: flex; justify-content: space-around; margin-top: 8px; page-break-inside: avoid;">
        <div style="width: 40%; text-align: center; font-size: 7.8pt;">
          <div>Mengetahui & Memvalidasi,</div>
          <div style="font-weight: 700; color: #475569;">${signer?.title || 'Pihak Sekolah / Koordinator BKK'}</div>
          <div style="height: 44px; display: flex; align-items: center; justify-content: center; margin: 2px 0;">
            <div style="width: 44px; height: 44px; border: 1.5px dashed #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 6pt; color: #0284c7; font-weight: 800;">
              CAP BKK
            </div>
          </div>
          <div style="font-weight: 800; font-size: 8pt; text-decoration: underline; color: #0f172a;">${signer?.name ? signer.name : '( .................................................. )'}</div>
          <div style="font-size: 6.8pt; color: #64748b; margin-top: 1px;">${signer?.nip ? `NIP. ${signer.nip}` : signer?.name ? `${signer.title || 'Koordinator BKK'} • ${schoolName === 'all' ? 'Sekolah Mitra' : schoolName}` : `NIP. ..................................................`}</div>
          <div style="font-size: 6.8pt; color: #64748b;">${schoolName === 'all' ? 'BKK SMK / SMA Mitra Industri' : schoolName}</div>
        </div>

        <div style="width: 40%; text-align: center; font-size: 7.8pt;">
          <div>Diterbitkan & Disahkan di Karawang, ${printDate}</div>
          <div style="font-weight: 700; color: #475569;">Platform Owner & Pimpinan Asesor</div>
          <div style="height: 44px; display: flex; align-items: center; justify-content: center; margin: 2px 0;">
            <svg style="width: 44px; height: 44px; opacity: 0.9;" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#059669" stroke-width="2.5" stroke-dasharray="5 2.5"/>
              <circle cx="50" cy="50" r="38" stroke="#059669" stroke-width="1.5"/>
              <text x="50" y="38" font-size="7.5" font-weight="900" fill="#059669" text-anchor="middle">BUATDIGITAL.ID</text>
              <text x="50" y="52" font-size="8" font-weight="900" fill="#059669" text-anchor="middle">★ DISAHKAN ★</text>
              <text x="50" y="66" font-size="6.5" font-weight="900" fill="#059669" text-anchor="middle">SIAP MASUK KERJA</text>
            </svg>
          </div>
          <div style="font-weight: 800; font-size: 8pt; text-decoration: underline; color: #0f172a;">Enjang Jahrudin, S.M.</div>
          <div style="font-size: 6.8pt; color: #64748b; margin-top: 1px;">Founder & CEO BuatDigital.id</div>
        </div>
      </div>

      <!-- FOOTER STATIS -->
      <div style="border-top: 1px dashed #cbd5e1; padding-top: 4px; margin-top: 7px; display: flex; justify-content: space-between; align-items: center; font-size: 6.5pt; color: #64748b;">
        <span>Dokumen resmi hasil evaluasi otomatis platform <strong>SMK Siap Masuk Kerja</strong> • Powered by <strong>BuatDigital.id</strong> (www.buatdigital.id).</span>
        <span>Laporan Rekapitulasi Kolektif BKK • <strong>Halaman 1 dari ${totalPages} (1/${totalPages})</strong> • Diterbitkan: ${new Date().toLocaleString('id-ID')}</span>
      </div>

    </div>
  `;
}

/**
 * DIRECT DOWNLOAD COLLECTIVE SCHOOL REPORT AS PDF FILE (NO PRINT PREVIEW DIALOG)
 */
export async function downloadCollectiveSchoolReportPdf(schoolName: string, students: RegisteredUser[], signer?: SchoolSignerInfo): Promise<void> {
  const targetSchoolLabel = schoolName === 'all' ? 'SELURUH_SEKOLAH_MITRA' : schoolName.replace(/\s+/g, '_');
  const fileName = `Laporan_Kolektif_Seleksi_${targetSchoolLabel}.pdf`;
  const htmlContent = generateCollectiveSchoolReportHtml(schoolName, students, signer);

  // Wrap in full HTML document and pass as string — avoids off-screen DOM rendering issues
  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; font-family: Arial, Helvetica, sans-serif; }
  </style>
</head>
<body>${htmlContent}</body>
</html>`;

  const opt = {
    margin: [4, 6, 6, 6],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: 1123
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape' as const,
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    // @ts-ignore
    await html2pdf().set(opt).from(fullHtml, 'string').save();
  } catch (err) {
    console.warn('html2pdf collective failed, falling back to print dialog', err);
    triggerPrint(fullHtml, fileName.replace('.pdf', ''));
  }
}

/**
 * Backward compatibility: Calling printCollectiveSchoolReport now triggers direct PDF download
 */
export async function printCollectiveSchoolReport(schoolName: string, students: RegisteredUser[], signer?: SchoolSignerInfo): Promise<void> {
  return downloadCollectiveSchoolReportPdf(schoolName, students, signer);
}
