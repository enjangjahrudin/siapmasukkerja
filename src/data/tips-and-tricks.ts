export interface TipArticle {
  id: string;
  category: 'psikotes' | 'kraepelin' | 'interview' | 'fisik-sikap' | 'perusahaan';
  title: string;
  summary: string;
  readTime: string;
  badge: string;
  content: string[];
  keyTakeaways: string[];
}

export const tipsAndTricksData: TipArticle[] = [
  {
    id: 'tip-1',
    category: 'kraepelin',
    title: 'Rahasia Menembus Tes Koran (Kraepelin & Pauli) Nilai A',
    summary: 'Bagaimana menjaga kecepatan, konsistensi ritme napas, dan bentuk kurva grafik agar lolos passing grade psikolog PT Astra & Epson.',
    readTime: '4 menit baca',
    badge: 'Paling Populer',
    content: [
      '1. Jangan Terlalu Ambisius di Kolom Awal: Kesalahan pemula nomor 1 adalah mengerjakan 25 baris di 3 kolom pertama, lalu anjlok menjadi 10 baris di kolom akhir karena kelelahan (Grafik Menurun Tajam = dinilai tidak punya ketahanan kerja).',
      '2. Targetkan Grafik Stabil atau Naik Perlahan: Psikolog mencari kandidat dengan grafik Panker yang stabil (mendatar sedikit naik). Ini mencerminkan stabilitas emosi dan daya tahan terhadap beban kerja lembur.',
      '3. Posisi Tangan & Alat Tulis: Gunakan pensil 2B yang tidak terlalu runcing (agar tidak mudah patah saat ditekan cepat). Tangan kiri jangan menutupi angka berikutnya.',
      '4. Atur Ritme Pernapasan: Jangan menahan napas saat menjumlahkan. Bernapaslah teratur per 2 penjumlahan untuk mencegah oksigen ke otak berkurang.',
      '5. Jika Ada Kesalahan: Coret sekali saja dan tulis angka perbaikan di sampingnya, jangan membuang waktu menghapus dengan penghapus karet.'
    ],
    keyTakeaways: [
      'Grafik stabil sedikit naik lebih disukai daripada cepat di awal lalu anjlok.',
      'Tulis hanya angka satuan (misal 8+7 = 15, tulis angka 5).',
      'Jaga ketelitian di atas 90% (jangan asal cepat tapi banyak salah).'
    ]
  },
  {
    id: 'tip-2',
    category: 'psikotes',
    title: 'Panduan Gambar Wartegg, Pohon (BAUM), dan Orang (DAP)',
    summary: 'Arti psikologis dari 8 kotak Wartegg dan cara menggambar pohon berkambium serta orang yang sedang bekerja.',
    readTime: '5 menit baca',
    badge: 'Wajib Dibaca',
    content: [
      '1. Urutan Kotak Wartegg: Urutan disarankan adalah kombinasi fleksibel seperti 1-2-3-4-5-6-7-8 atau 1-2-3-8-7-6-5-4. Hindari menggambar kotak organik (lengkung) menjadi benda mati kaku secara berlebihan.',
      '2. Karakter 8 Kotak: Kotak 1 (titik tengah = penyesuaian diri/ego), Kotak 2 (garis lengkung = fleksibilitas perasaan), Kotak 3 (3 garis naik = ambisi karier), Kotak 4 (kotak hitam = cara menghadapi masalah), Kotak 5 (dua garis tegak = daya juang), Kotak 6 (garis horizontal & vertikal = logika berpikir), Kotak 7 (titik lengkung = kelembutan/etika), Kotak 8 (lengkungan besar = perlindungan/kebijaksanaan).',
      '3. Tes Pohon (BAUM Test): Gambar pohon berkambium/berakar tunggang (seperti Mangga, Beringin, Nangka). Jangan gambar pohon kelapa, pisang, rumput, atau cemara! Gambar akar, batang kokoh, dahan, ranting, dan daun lebat.',
      '4. Tes Menggambar Orang (DAP): Gambarlah orang berjenis kelamin sama dengan Anda, lengkap dengan anggota tubuh (mata, hidung, telinga, jari 5), serta berikan konteks sedang beraktivitas kerja profesional (bukan sedang bersantai).'
    ],
    keyTakeaways: [
      'Jangan menggambar dengan garis putus-putus atau ragu-ragu (tekanan pensil harus mantap).',
      'Pohon harus memiliki dahan dan dedaunan (mencerminkan produktivitas).',
      'Orang harus proporsional dan memiliki profesi jelas.'
    ]
  },
  {
    id: 'tip-3',
    category: 'interview',
    title: 'Strategi Menjawab Interview HRD & User untuk Operator / QC',
    summary: 'Formula metode STAR, cara menjawab pertanyaan lembur, shift malam, dan alasan memilih perusahaan.',
    readTime: '4 menit baca',
    badge: 'Interview',
    content: [
      '1. Pertanyaan "Ceritakan Tentang Diri Anda": Jawab dengan struktur: Salam -> Latar Belakang Pendidikan & Kejuruan -> Pengalaman Praktik Kerja Lapangan (PKL) / Organisasi -> Keahlian Teknis -> Motivasi Melamar.',
      '2. Pertanyaan "Apakah Bersedia Kerja Shift Malam & Lembur?": Jawab dengan tegas dan antusias: "Saya sangat bersedia dan siap fisik maupun mental untuk bekerja dengan sistem shift, baik shift 1, 2, maupun 3 serta lembur sesuai instruksi pimpinan."',
      '3. Pertanyaan "Bagaimana Jika Rekan Kerja Melakukan Kesalahan (untuk QC)?": Jawab dengan mengutamakan kepatuhan SOP: "Sebagai QC, saya akan memisahkan produk reject tersebut sesuai prosedur, memberi tanda NG, lalu berkoordinasi secara baik dengan operator dan leader tanpa menyalahkan secara pribadi."',
      '4. Pertanyaan "Berapa Gaji yang Diharapkan?": Jawab: "Saya mengikuti standar upah minimum (UMK) yang berlaku di daerah ini serta struktur penggajian dan ketentuan resmi yang ada di perusahaan."'
    ],
    keyTakeaways: [
      'Gunakan metode STAR (Situation, Task, Action, Result) saat menceritakan pengalaman PKL.',
      'Tatap mata interviewer dan jaga intonasi suara tetap terdengar sopan namun bertenaga.',
      'Hindari menjelekkan tempat sekolah, tempat PKL, atau rekan lama.'
    ]
  },
  {
    id: 'tip-4',
    category: 'fisik-sikap',
    title: 'Penerapan 5S / 5R & Standar Disiplin Kerja Industri',
    summary: 'Konsep dasar Seiri, Seiton, Seiso, Seiketsu, Shitsuke yang sering ditanyakan pada tes wawancara operator.',
    readTime: '3 menit baca',
    badge: 'Dasar Industri',
    content: [
      '1. Ringkas (Seiri): Memisahkan barang yang diperlukan dengan yang tidak diperlukan, dan menyingkirkan barang tidak terpakai dari area kerja.',
      '2. Rapi (Seiton): Menata dan memberi label pada setiap alat kerja sesuai tempatnya agar mudah dicari saat dibutuhkan.',
      '3. Resik (Seiso): Membersihkan area kerja dan mesin dari debu, ceceran oli, dan kotoran setiap sebelum dan sesudah shift.',
      '4. Rawat (Seiketsu): Memelihara dan membakukan kondisi Ringkas, Rapi, dan Resik secara konsisten.',
      '5. Rajin (Shitsuke): Membiasakan diri mematuhi peraturan keselamatan kerja (K3), SOP, dan menggunakan APD lengkap.'
    ],
    keyTakeaways: [
      'Hafalkan kepanjangan 5R/5S dalam bahasa Indonesia dan bahasa Jepang.',
      'Selalu sebutkan komitmen terhadap K3 (Kesehatan & Keselamatan Kerja).'
    ]
  }
];
