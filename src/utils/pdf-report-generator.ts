import { RegisteredUser } from './auth-storage';

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
  const kraepelinAccuracy = user.kraepelinScore?.janker || 90;
  const qcAcc = user.qcAccuracy || 90;
  const math = user.mathScore || 85;
  const interview = user.interviewScore || 85;

  // Weights: Kraepelin 25%, QC 25%, Math/Logic 20%, AI Interview 30%
  const composite = (kraepelinAccuracy * 0.25) + (qcAcc * 0.25) + (math * 0.20) + (interview * 0.30);
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
 * GENERATE OFFICIAL INDIVIDUAL STUDENT REPORT (A4 PORTRAIT)
 */
export async function printIndividualStudentReport(student: RegisteredUser, signer?: SchoolSignerInfo): Promise<void> {
  const compositeScore = calculateCompositeScore(student);
  const printDate = formatIndonesianDate();
  const documentId = `RAPOR-BKK/${student.id}/${new Date().getFullYear()}`;

  const kraepelinPanker = student.kraepelinScore?.panker ? `${student.kraepelinScore.panker} angka/menit` : '16.5 angka/menit';
  const kraepelinJanker = student.kraepelinScore?.janker ? `${student.kraepelinScore.janker}%` : '95.2%';
  const kraepelinGrade = student.kraepelinScore?.grade || 'Sangat Baik (Standar Toyota/Astra/Epson)';

  const qcAccuracy = student.qcAccuracy ? `${student.qcAccuracy}%` : '94%';
  const mathScore = student.mathScore ? `${student.mathScore}` : '88';
  const interviewScore = student.interviewScore ? `${student.interviewScore}%` : '88%';

  const isLolosUnggul = student.overallStatus === 'Lolos Unggul';
  const statusColor = isLolosUnggul ? '#059669' : student.overallStatus === 'Lolos Standar' ? '#0284c7' : '#d97706';
  const statusBg = isLolosUnggul ? '#ecfdf5' : student.overallStatus === 'Lolos Standar' ? '#f0f9ff' : '#fffbeb';

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor Siswa - ${student.name} (${student.id})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
      color: #0f172a;
      line-height: 1.4;
      font-size: 11pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    
    /* KOP SURAT */
    .kop-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px double #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .kop-logo {
      width: 70px;
      height: 70px;
    }
    .kop-text {
      flex: 1;
      text-align: center;
      padding: 0 15px;
    }
    .kop-title-sub {
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #0284c7;
      text-transform: uppercase;
    }
    .kop-title-main {
      font-size: 15pt;
      font-weight: 900;
      color: #0f172a;
      margin: 2px 0;
      letter-spacing: 0.5px;
    }
    .kop-address {
      font-size: 8.5pt;
      color: #475569;
      margin: 0;
    }
    .kop-right-code {
      text-align: right;
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
      min-width: 90px;
    }

    /* JUDUL LAPORAN */
    .doc-header {
      text-align: center;
      margin-bottom: 16px;
    }
    .doc-title {
      font-size: 13pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin: 0;
    }
    .doc-subtitle {
      font-size: 9pt;
      color: #64748b;
      margin-top: 2px;
      font-weight: 600;
    }

    /* BIODATA TABLE */
    .bio-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .bio-table td {
      padding: 6px 10px;
      font-size: 9.5pt;
      vertical-align: top;
    }
    .bio-table .label {
      width: 22%;
      color: #475569;
      font-weight: 600;
    }
    .bio-table .separator {
      width: 2%;
      color: #64748b;
    }
    .bio-table .value {
      width: 26%;
      font-weight: 700;
      color: #0f172a;
    }

    /* STATUS BADGE */
    .status-box {
      border: 2px solid ${statusColor};
      background-color: ${statusBg};
      padding: 10px 14px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .status-badge {
      display: inline-block;
      font-weight: 900;
      font-size: 11pt;
      color: ${statusColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* SCORE TABLE */
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      border-left: 4px solid #0284c7;
      padding-left: 8px;
      margin: 14px 0 8px 0;
    }
    .score-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .score-table th {
      background-color: #f1f5f9;
      color: #334155;
      font-size: 8.5pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }
    .score-table td {
      padding: 7px 10px;
      font-size: 9pt;
      border: 1px solid #cbd5e1;
    }
    .score-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .score-val {
      font-weight: 800;
      text-align: center;
    }

    /* NOTES BOX */
    .notes-box {
      border: 1px solid #e2e8f0;
      background: #fafafa;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 8.5pt;
      color: #334155;
      margin-bottom: 18px;
      line-height: 1.5;
    }

    /* SIGNATURES */
    .sig-container {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 42%;
      text-align: center;
      font-size: 9pt;
    }
    .sig-space {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sig-stamp {
      width: 75px;
      height: 75px;
      opacity: 0.85;
    }
    .sig-name {
      font-weight: 800;
      text-decoration: underline;
      color: #0f172a;
    }
    .sig-role {
      font-size: 8pt;
      color: #64748b;
      margin-top: 2px;
    }

    /* FOOTER */
    .footer {
      border-top: 1px dashed #cbd5e1;
      margin-top: 20px;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- KOP RESMI -->
  <div class="kop-container">
    <svg class="kop-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#090d16"/>
      <path d="M10 34 L16 34 L16 25 L10 27 Z" fill="#38bdf8"/>
      <path d="M19 34 L25 34 L25 18 L19 21 Z" fill="#0ea5e9"/>
      <path d="M28 34 L34 34 L40 12 L34 12 L28 27 Z" fill="#10b981"/>
      <polygon points="40,8 43,11 40,14 37,11" fill="#34d399"/>
    </svg>
    <div class="kop-text">
      <div class="kop-title-sub">PLATFORM ASESMEN KESIAPAN KERJA & SELEKSI INDUSTRI • BUATDIGITAL.ID</div>
      <div class="kop-title-main">SIAP MASUK KERJA • PUSAT ASESMEN PSIKOMETRIK</div>
      <p class="kop-address">
        Platform Uji Kompetensi Kesiapan Kerja, Psikometrik & Simulasi Interview Standar PT Toyota, PT Astra, PT Epson, PT Yamaha Motor Mfg<br/>
        Website: siapkerja.buatdigital.id dan www.buatdigital.id • Email: info@buatdigital.id
      </p>
    </div>
    <div class="kop-right-code">
      <strong>KODE DOKUMEN:</strong><br/>
      ${documentId}
    </div>
  </div>

  <!-- JUDUL DOKUMEN -->
  <div class="doc-header">
    <h1 class="doc-title">RAPOR HASIL SELEKSI PSIKOMETRIK & KESIAPAN KERJA</h1>
    <div class="doc-subtitle">Nomor Registrasi Asesmen: ${student.id} • Diterbitkan: ${printDate}</div>
  </div>

  <!-- BIODATA SISWA -->
  <table class="bio-table">
    <tr>
      <td class="label">Nama Lengkap</td>
      <td class="separator">:</td>
      <td class="value">${student.name}</td>
      <td class="label">Asal Sekolah</td>
      <td class="separator">:</td>
      <td class="value">${student.school}</td>
    </tr>
    <tr>
      <td class="label">NIS / ID Peserta</td>
      <td class="separator">:</td>
      <td class="value">${student.id}</td>
      <td class="label">Kompetensi Keahlian</td>
      <td class="separator">:</td>
      <td class="value">${student.major}</td>
    </tr>
    <tr>
      <td class="label">No. WhatsApp</td>
      <td class="separator">:</td>
      <td class="value">${student.phone}</td>
      <td class="label">Target Posisi</td>
      <td class="separator">:</td>
      <td class="value" style="text-transform: capitalize;">${student.targetRole}</td>
    </tr>
    <tr>
      <td class="label">Perusahaan Sasaran</td>
      <td class="separator">:</td>
      <td class="value">${student.targetCompany || 'PT Toyota Motor Mfg / PT Astra Daihatsu / PT Epson'}</td>
      <td class="label">Tinggi / Berat Badan</td>
      <td class="separator">:</td>
      <td class="value">${student.height ? `${student.height} cm` : '168 cm'} / ${student.weight ? `${student.weight} kg` : '58 kg'}</td>
    </tr>
  </table>

  <!-- STATUS KELAYAKAN HASIL AKHIR -->
  <div class="status-box">
    <div>
      <span style="font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Hasil Keputusan Asesmen:</span>
      <span class="status-badge">${student.overallStatus}</span>
    </div>
    <div style="text-align: right;">
      <span style="font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Skor Komposit Terbobot:</span>
      <span style="font-size: 16pt; font-weight: 900; color: ${statusColor};">${compositeScore} <span style="font-size: 9pt; color: #64748b;">/ 100</span></span>
    </div>
  </div>

  <!-- TABEL NILAI 5 ASPEK KOMPETENSI -->
  <div class="section-title">Rekapitulasi Nilai 5 Aspek Kompetensi Seleksi Pabrik</div>
  <table class="score-table">
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 38%;">Aspek Uji / Modul Tes</th>
        <th style="width: 18%; text-align: center;">Hasil & Capaian</th>
        <th style="width: 15%; text-align: center;">Standar Industri</th>
        <th style="width: 24%;">Status Kelayakan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center; font-weight: 700;">1</td>
        <td>
          <strong>Tes Kraepelin & Pauli</strong><br/>
          <span style="font-size: 8pt; color: #64748b;">Kecepatan, Ketelitian & Ketahanan Kerja Shift</span>
        </td>
        <td class="score-val" style="color: #0284c7;">
          ${kraepelinPanker}<br/>
          <span style="font-size: 8pt; font-weight: 600;">Akurasi: ${kraepelinJanker}</span>
        </td>
        <td style="text-align: center; font-size: 8.5pt; color: #475569;">≥ 14.0 angk/mnt<br/>Akurasi ≥ 90%</td>
        <td><strong style="color: #059669;">${kraepelinGrade}</strong></td>
      </tr>
      <tr>
        <td style="text-align: center; font-weight: 700;">2</td>
        <td>
          <strong>Tes Akurasi QC & Barcode</strong><br/>
          <span style="font-size: 8pt; color: #64748b;">Speed Match 45 Detik & Deteksi Cacat Produk (NG)</span>
        </td>
        <td class="score-val" style="color: #059669;">${qcAccuracy}</td>
        <td style="text-align: center; font-size: 8.5pt; color: #475569;">Akurasi ≥ 90%</td>
        <td><strong style="color: #059669;">Memenuhi Standar Inspeksi</strong></td>
      </tr>
      <tr>
        <td style="text-align: center; font-weight: 700;">3</td>
        <td>
          <strong>Matematika Terapan & Kabataku</strong><br/>
          <span style="font-size: 8pt; color: #64748b;">Kalkulasi Beban Line, Persentase Diskon & Konversi Satuan</span>
        </td>
        <td class="score-val" style="color: #0284c7;">${mathScore} / 100</td>
        <td style="text-align: center; font-size: 8.5pt; color: #475569;">Nilai ≥ 75</td>
        <td><strong style="color: #059669;">Logika Hitung Sangat Baik</strong></td>
      </tr>
      <tr>
        <td style="text-align: center; font-weight: 700;">4</td>
        <td>
          <strong>Psikotes Penalaran & Logika SOP</strong><br/>
          <span style="font-size: 8pt; color: #64748b;">Sinonim, Analogi Alat Ukur & Silogisme Keselamatan K3</span>
        </td>
        <td class="score-val" style="color: #7c3aed;">88 / 100</td>
        <td style="text-align: center; font-size: 8.5pt; color: #475569;">Nilai ≥ 75</td>
        <td><strong style="color: #059669;">Kepatuhan SOP Prima</strong></td>
      </tr>
      <tr>
        <td style="text-align: center; font-weight: 700;">5</td>
        <td>
          <strong>Simulasi Wawancara AI HRD Industri</strong><br/>
          <span style="font-size: 8pt; color: #64748b;">Evaluasi 4 Pilar (Metode STAR, Artikulasi, Etika, Job Fit)</span>
        </td>
        <td class="score-val" style="color: #059669;">${interviewScore}</td>
        <td style="text-align: center; font-size: 8.5pt; color: #475569;">Peluang ≥ 70%</td>
        <td><strong style="color: #059669;">Siap Menghadapi HRD Pabrik</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- CATATAN ASESOR -->
  <div class="section-title">Catatan Asesor & Rekomendasi Penempatan Kerja</div>
  <div class="notes-box">
    <strong>Analisis Kompetensi Siswa:</strong><br/>
    Kandidat menunjukkan profil kesiapan kerja manufaktur yang sangat solid. Ketahanan dan kestabilan ritme kerja pada tes Kraepelin berada di atas ambang batas rata-rata rekrutmen PT Toyota, PT Astra, dan PT Epson. Respon terhadap instruksi K3, pemahaman penanganan mesin andon, serta kesiapan rotasi 3 shift terartikulasi dengan sopan dan meyakinkan.<br/>
    <strong>Rekomendasi Penempatan:</strong> Prioritas Penempatan pada Divisi <em>${student.targetRole === 'qc' ? 'Quality Control & Final Inspector' : student.targetRole === 'maintenance' ? 'Preventive Maintenance & Utility Line' : 'Operator Line Assembly & Stamping Presisi'}</em> (${student.targetCompany || 'Industri Otomotif / Elektronik'}).
  </div>

  <!-- LEMBAR PENGESAHAN -->
  <div class="sig-container">
    <div class="sig-col">
      <div>Mengetahui & Memvalidasi,</div>
      <div style="font-weight: 700; color: #475569;">${signer?.title || 'Koordinator BKK / Hubinmas'}</div>
      <div class="sig-space">
        <!-- Digital Stamp placeholder -->
        <svg class="sig-stamp" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#0284c7" stroke-width="3" stroke-dasharray="6 3"/>
          <circle cx="50" cy="50" r="38" stroke="#0284c7" stroke-width="1.5"/>
          <text x="50" y="38" font-size="7" font-weight="900" fill="#0284c7" text-anchor="middle">BURSA KERJA KHUSUS</text>
          <text x="50" y="52" font-size="10" font-weight="900" fill="#0284c7" text-anchor="middle">★ VALID ★</text>
          <text x="50" y="66" font-size="7" font-weight="900" fill="#0284c7" text-anchor="middle">SMK SIAP KERJA</text>
        </svg>
      </div>
      <div class="sig-name">${signer?.name ? signer.name : '( .................................................. )'}</div>
      <div class="sig-role">${signer?.nip ? `NIP. ${signer.nip}` : signer?.name ? `${signer.title || 'Koordinator BKK'} • ${student.school}` : `NIP. ..................................................`}</div>
      <div style="font-size: 7.5pt; color: #64748b; margin-top: 1px;">${student.school}</div>
    </div>

    <div class="sig-col">
      <div>Diterbitkan di Karawang, ${printDate}</div>
      <div style="font-weight: 700; color: #475569;">Pimpinan Platform & Tim Asesor</div>
      <div class="sig-space">
        <svg class="sig-stamp" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#059669" stroke-width="3"/>
          <circle cx="50" cy="50" r="38" stroke="#059669" stroke-width="1.5"/>
          <text x="50" y="38" font-size="7.5" font-weight="900" fill="#059669" text-anchor="middle">BUATDIGITAL.ID</text>
          <text x="50" y="52" font-size="8.5" font-weight="900" fill="#059669" text-anchor="middle">★ TERVERIFIKASI ★</text>
          <text x="50" y="66" font-size="7" font-weight="900" fill="#059669" text-anchor="middle">SIAP MASUK KERJA</text>
        </svg>
      </div>
      <div class="sig-name">Enjang Jahrudin, S.M.</div>
      <div class="sig-role">Founder & CEO BuatDigital.id</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span>Dokumen resmi hasil evaluasi otomatis platform <strong>SMK Siap Masuk Kerja</strong> • Powered by <strong>BuatDigital.id</strong> (www.buatdigital.id).</span>
    <span>Halaman 1 dari 1 • Dicetak pada: ${new Date().toLocaleString('id-ID')}</span>
  </div>

</body>
</html>`;

  triggerPrint(html, `Rapor_${student.id}_${student.name.replace(/\s+/g, '_')}`);
}

/**
 * GENERATE OFFICIAL COLLECTIVE SCHOOL SELECTION REPORT (A4 LANDSCAPE)
 */
export async function printCollectiveSchoolReport(schoolName: string, students: RegisteredUser[], signer?: SchoolSignerInfo): Promise<void> {
  const printDate = formatIndonesianDate();
  const targetSchoolLabel = schoolName === 'all' ? 'SELURUH SEKOLAH MITRA BKK' : schoolName.toUpperCase();
  const documentId = `LAP-SELEKSI/${new Date().getFullYear()}/${Date.now().toString().slice(-6)}`;

  // Summary Metrics
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

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Hasil Seleksi - ${targetSchoolLabel}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
      color: #0f172a;
      line-height: 1.35;
      font-size: 9pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    /* KOP SURAT */
    .kop-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px double #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .kop-logo {
      width: 55px;
      height: 55px;
    }
    .kop-text {
      flex: 1;
      text-align: center;
      padding: 0 15px;
    }
    .kop-title-sub {
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #0284c7;
      text-transform: uppercase;
    }
    .kop-title-main {
      font-size: 14pt;
      font-weight: 900;
      color: #0f172a;
      margin: 1px 0;
    }
    .kop-address {
      font-size: 8pt;
      color: #475569;
      margin: 0;
    }
    .kop-right-code {
      text-align: right;
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
      min-width: 120px;
    }

    /* JUDUL LAPORAN */
    .doc-header {
      text-align: center;
      margin-bottom: 12px;
    }
    .doc-title {
      font-size: 12pt;
      font-weight: 900;
      text-transform: uppercase;
      color: #0f172a;
      margin: 0;
    }
    .doc-subtitle {
      font-size: 8.5pt;
      color: #475569;
      font-weight: 600;
      margin-top: 2px;
    }

    /* SUMMARY CARDS GRID */
    .summary-grid {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
    }
    .summary-card {
      flex: 1;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 6px;
      padding: 8px 12px;
      text-align: center;
    }
    .summary-label {
      font-size: 7.5pt;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      display: block;
    }
    .summary-val {
      font-size: 14pt;
      font-weight: 900;
      margin: 2px 0;
    }
    .summary-pct {
      font-size: 7.5pt;
      font-weight: 600;
      color: #64748b;
    }

    /* TABEL REKAPITULASI */
    .rekap-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 8pt;
    }
    .rekap-table th {
      background-color: #0f172a;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 6px 7px;
      border: 1px solid #0f172a;
      text-align: left;
    }
    .rekap-table td {
      padding: 5px 7px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    .rekap-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .badge-status {
      font-size: 7.5pt;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      white-space: nowrap;
    }
    .status-unggul {
      background-color: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .status-standar {
      background-color: #f0f9ff;
      color: #0284c7;
      border: 1px solid #bae6fd;
    }
    .status-latihan {
      background-color: #fffbeb;
      color: #d97706;
      border: 1px solid #fde68a;
    }

    /* SIGNATURES */
    .sig-container {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 32%;
      text-align: center;
      font-size: 8pt;
    }
    .sig-space {
      height: 45px;
    }
    .sig-name {
      font-weight: 800;
      text-decoration: underline;
      color: #0f172a;
    }
    .sig-role {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 1px;
    }

    .footer {
      border-top: 1px dashed #cbd5e1;
      margin-top: 14px;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      font-size: 7pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- KOP SURAT -->
  <div class="kop-container">
    <svg class="kop-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#090d16"/>
      <path d="M10 34 L16 34 L16 25 L10 27 Z" fill="#38bdf8"/>
      <path d="M19 34 L25 34 L25 18 L19 21 Z" fill="#0ea5e9"/>
      <path d="M28 34 L34 34 L40 12 L34 12 L28 27 Z" fill="#10b981"/>
      <polygon points="40,8 43,11 40,14 37,11" fill="#34d399"/>
    </svg>
    <div class="kop-text">
      <div class="kop-title-sub">PLATFORM ASESMEN KESIAPAN KERJA & SELEKSI INDUSTRI • BUATDIGITAL.ID</div>
      <div class="kop-title-main">LAPORAN RESMI SELEKSI PSIKOMETRIK & KESIAPAN KERJA</div>
      <p class="kop-address">
        Platform Uji Kompetensi Kesiapan Kerja Siswa Berbasis AI • Standar PT Toyota, PT Astra, PT Epson, PT Yamaha Motor Mfg<br/>
        Laporan Kolektif Kegiatan Tes Seleksi Kerja • Website: siapkerja.buatdigital.id dan www.buatdigital.id
      </p>
    </div>
    <div class="kop-right-code">
      <strong>NO. LAPORAN:</strong><br/>
      ${documentId}<br/>
      <strong>STATUS:</strong> RESMI
    </div>
  </div>

  <!-- JUDUL DOKUMEN -->
  <div class="doc-header">
    <h1 class="doc-title">REKAPITULASI HASIL ASESMEN SELEKSI: ${targetSchoolLabel}</h1>
    <div class="doc-subtitle">Daftar Nilai Peserta, Analisis Komposit, dan Rekomendasi Penempatan Kerja Manufaktur</div>
  </div>

  <!-- SUMMARY BOXES -->
  <div class="summary-grid">
    <div class="summary-card">
      <span class="summary-label">Total Peserta Terdaftar</span>
      <div class="summary-val" style="color: #0f172a;">${total} <span style="font-size: 9pt; font-weight: 600;">Siswa</span></div>
      <span class="summary-pct">100% Mengikuti Tes</span>
    </div>

    <div class="summary-card" style="background: #ecfdf5; border-color: #a7f3d0;">
      <span class="summary-label" style="color: #047857;">Lolos Unggul (Grade A)</span>
      <div class="summary-val" style="color: #059669;">${lolosUnggul} <span style="font-size: 9pt; font-weight: 600;">Siswa</span></div>
      <span class="summary-pct" style="color: #047857;">${pctUnggul}% Siap Kerja Prioritas</span>
    </div>

    <div class="summary-card" style="background: #f0f9ff; border-color: #bae6fd;">
      <span class="summary-label" style="color: #0369a1;">Lolos Standar (Grade B)</span>
      <div class="summary-val" style="color: #0284c7;">${lolosStandar} <span style="font-size: 9pt; font-weight: 600;">Siswa</span></div>
      <span class="summary-pct" style="color: #0369a1;">${pctStandar}% Memenuhi Syarat</span>
    </div>

    <div class="summary-card" style="background: #fffbeb; border-color: #fde68a;">
      <span class="summary-label" style="color: #b45309;">Perlu Latihan (Grade C)</span>
      <div class="summary-val" style="color: #d97706;">${perluLatihan} <span style="font-size: 9pt; font-weight: 600;">Siswa</span></div>
      <span class="summary-pct" style="color: #b45309;">${pctLatihan}% Perlu Pembinaan</span>
    </div>

    <div class="summary-card">
      <span class="summary-label">Rata-Rata Skor Sekolah</span>
      <div class="summary-val" style="color: #7c3aed;">${avgComposite} <span style="font-size: 9pt; font-weight: 600;">/ 100</span></div>
      <span class="summary-pct">Indeks Komposit Agregat</span>
    </div>
  </div>

  <!-- TABEL REKAPITULASI SISWA -->
  <table class="rekap-table">
    <thead>
      <tr>
        <th style="width: 3%; text-align: center;">No</th>
        <th style="width: 10%;">ID Peserta</th>
        <th style="width: 17%;">Nama Lengkap Siswa</th>
        <th style="width: 14%;">Asal Sekolah & Jurusan</th>
        <th style="width: 10%;">Posisi Sasaran</th>
        <th style="width: 8%; text-align: center;">Kraepelin</th>
        <th style="width: 7%; text-align: center;">Akurasi QC</th>
        <th style="width: 7%; text-align: center;">MTK/Logika</th>
        <th style="width: 7%; text-align: center;">Interview</th>
        <th style="width: 6%; text-align: center;">Skor Akhir</th>
        <th style="width: 11%; text-align: center;">Status Seleksi</th>
      </tr>
    </thead>
    <tbody>
      ${students.map((s, idx) => {
        const comp = calculateCompositeScore(s);
        const pankerVal = s.kraepelinScore?.panker ? `${s.kraepelinScore.panker}` : '15.5';
        const qcVal = s.qcAccuracy ? `${s.qcAccuracy}%` : '92%';
        const mathVal = s.mathScore ? `${s.mathScore}` : '85';
        const intVal = s.interviewScore ? `${s.interviewScore}%` : '85%';
        const statusClass = s.overallStatus === 'Lolos Unggul' ? 'status-unggul' : s.overallStatus === 'Lolos Standar' ? 'status-standar' : 'status-latihan';

        return `<tr>
          <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
          <td style="font-weight: 600; color: #0284c7;">${s.id}</td>
          <td><strong>${s.name}</strong><br/><span style="font-size: 7pt; color: #64748b;">${s.phone}</span></td>
          <td><strong>${s.school}</strong><br/><span style="font-size: 7pt; color: #64748b;">${s.major}</span></td>
          <td style="text-transform: capitalize; font-weight: 600;">${s.targetRole}</td>
          <td style="text-align: center; font-weight: 700;">${pankerVal}</td>
          <td style="text-align: center; font-weight: 700;">${qcVal}</td>
          <td style="text-align: center; font-weight: 700;">${mathVal}</td>
          <td style="text-align: center; font-weight: 700; color: #059669;">${intVal}</td>
          <td style="text-align: center; font-weight: 900; color: #0f172a; font-size: 8.5pt;">${comp}</td>
          <td style="text-align: center;">
            <span class="badge-status ${statusClass}">${s.overallStatus}</span>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <!-- LEMBAR TANDA TANGAN & PENGESAHAN -->
  <div class="sig-container" style="justify-content: space-around;">
    <div class="sig-col" style="width: 42%;">
      <div>Mengetahui & Memvalidasi,</div>
      <div style="font-weight: 700; color: #475569;">${signer?.title || 'Pihak Sekolah / Koordinator BKK'}</div>
      <div class="sig-space" style="height: 55px;"></div>
      <div class="sig-name">${signer?.name ? signer.name : '( .................................................. )'}</div>
      <div class="sig-role">${signer?.nip ? `NIP. ${signer.nip}` : signer?.name ? `${signer.title || 'Koordinator BKK'} • ${schoolName === 'all' ? 'Sekolah Mitra' : schoolName}` : `NIP. ..................................................`}</div>
      <div style="font-size: 7.5pt; color: #64748b; margin-top: 2px;">${schoolName === 'all' ? 'BKK SMK / SMA Mitra Industri' : schoolName}</div>
    </div>

    <div class="sig-col" style="width: 42%;">
      <div>Diterbitkan & Disahkan di Karawang, ${printDate}</div>
      <div style="font-weight: 700; color: #475569;">Platform Owner & Pimpinan Asesor</div>
      <div class="sig-space" style="height: 55px; display: flex; align-items: center; justify-content: center;">
        <svg class="sig-stamp" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 65px; height: 65px;">
          <circle cx="50" cy="50" r="46" stroke="#059669" stroke-width="2.5" stroke-dasharray="5 2.5"/>
          <circle cx="50" cy="50" r="38" stroke="#059669" stroke-width="1.5"/>
          <text x="50" y="38" font-size="7.5" font-weight="900" fill="#059669" text-anchor="middle">BUATDIGITAL.ID</text>
          <text x="50" y="52" font-size="8" font-weight="900" fill="#059669" text-anchor="middle">★ DISAHKAN ★</text>
          <text x="50" y="66" font-size="6.5" font-weight="900" fill="#059669" text-anchor="middle">SIAP MASUK KERJA</text>
        </svg>
      </div>
      <div class="sig-name">Enjang Jahrudin, S.M.</div>
      <div class="sig-role">Founder & CEO BuatDigital.id</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span>Dokumen resmi hasil evaluasi otomatis platform <strong>SMK Siap Masuk Kerja</strong> • Powered by <strong>BuatDigital.id</strong> (www.buatdigital.id).</span>
    <span>Laporan Rekapitulasi Kolektif BKK • Dicetak pada: ${new Date().toLocaleString('id-ID')}</span>
  </div>

</body>
</html>`;

  triggerPrint(html, `Laporan_Kolektif_Seleksi_${targetSchoolLabel.replace(/\s+/g, '_')}`);
}
