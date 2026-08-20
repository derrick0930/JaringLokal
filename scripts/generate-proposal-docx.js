import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color Palette
const COLORS = {
  PRIMARY: '0B2545',       // Deep Ocean Navy
  PRIMARY_LIGHT: '134074', // Marine Blue
  SECONDARY: 'D97706',     // Sand Amber
  TEXT_DARK: '1E293B',     // Slate 800
  TEXT_MUTED: '475569',    // Slate 600
  BG_LIGHT: 'F8FAFC',      // Slate 50
  BG_ACCENT: 'EFF6FF',     // Ocean 50
  BORDER: 'CBD5E1',        // Slate 300
  WHITE: 'FFFFFF',
  SUCCESS: '166534',       // Green 800
};

function createDocTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 38, // 19pt
        color: COLORS.PRIMARY,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createDocSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 280 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 22, // 11pt
        color: COLORS.TEXT_MUTED,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createBadge(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 140 },
    children: [
      new TextRun({
        text: `【 ${text} 】`,
        bold: true,
        size: 22,
        color: COLORS.SECONDARY,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createH1(title, numberStr = '') {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [
      new TextRun({
        text: numberStr ? `${numberStr} ` : '',
        bold: true,
        size: 30, // 15pt
        color: COLORS.SECONDARY,
        font: 'Segoe UI',
      }),
      new TextRun({
        text: title,
        bold: true,
        size: 30,
        color: COLORS.PRIMARY,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createH2(title, numberStr = '') {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({
        text: numberStr ? `${numberStr} ` : '',
        bold: true,
        size: 24, // 12pt
        color: COLORS.SECONDARY,
        font: 'Segoe UI',
      }),
      new TextRun({
        text: title,
        bold: true,
        size: 24,
        color: COLORS.PRIMARY_LIGHT,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createP(text, isLead = false) {
  return new Paragraph({
    spacing: { before: 40, after: 80, line: 280 },
    children: [
      new TextRun({
        text,
        size: isLead ? 22 : 21,
        color: isLead ? COLORS.PRIMARY : COLORS.TEXT_DARK,
        font: 'Segoe UI',
        bold: isLead,
      }),
    ],
  });
}

function createBullet(title, desc) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 30, after: 50, line: 260 },
    children: [
      new TextRun({
        text: title ? `${title}: ` : '',
        bold: true,
        size: 21,
        color: COLORS.TEXT_DARK,
        font: 'Segoe UI',
      }),
      new TextRun({
        text: desc,
        size: 21,
        color: COLORS.TEXT_DARK,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createCallout(title, text) {
  const border = { style: BorderStyle.SINGLE, size: 16, color: COLORS.SECONDARY };
  const none = { style: BorderStyle.NONE, size: 0, color: 'auto' };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { left: border, top: none, right: none, bottom: none },
            shading: { fill: COLORS.BG_ACCENT },
            margins: { top: 120, bottom: 120, left: 160, right: 120 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: `💡 ${title}`,
                    bold: true,
                    size: 21,
                    color: COLORS.PRIMARY,
                    font: 'Segoe UI',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 0, after: 0, line: 260 },
                children: [
                  new TextRun({
                    text,
                    italics: true,
                    size: 20,
                    color: COLORS.TEXT_MUTED,
                    font: 'Segoe UI',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createStyledTable(headers, rowsData, columnWidthsPercent) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      width: { size: columnWidthsPercent[i], type: WidthType.PERCENTAGE },
      shading: { fill: COLORS.PRIMARY },
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 0 },
          children: [
            new TextRun({
              text: h,
              bold: true,
              size: 20,
              color: COLORS.WHITE,
              font: 'Segoe UI',
            }),
          ],
        }),
      ],
    })),
  });

  const bodyRows = rowsData.map((row, rIdx) => {
    const bgFill = rIdx % 2 === 0 ? COLORS.WHITE : COLORS.BG_LIGHT;
    return new TableRow({
      children: row.map((cellText, cIdx) => new TableCell({
        width: { size: columnWidthsPercent[cIdx], type: WidthType.PERCENTAGE },
        shading: { fill: bgFill },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 0, line: 250 },
            children: [
              new TextRun({
                text: cellText,
                size: 20,
                color: COLORS.TEXT_DARK,
                font: 'Segoe UI',
              }),
            ],
          }),
        ],
      })),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  });
}

async function generateProposal() {
  console.log('Generating PROPOSAL_JARINGLOKAL.docx...');

  const doc = new Document({
    creator: 'Tim JaringLokal (blup blup)',
    title: 'Proposal Platform JaringLokal',
    description: 'Sistem Distribusi Hasil Laut & Digitalisasi UMKM Pesisir Berbasis Escrow Real-Time',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 80 },
                children: [
                  new TextRun({
                    text: 'Proposal JaringLokal — WDC 2026 (UMKM Goes Digital)',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                    font: 'Segoe UI',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Halaman ',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: COLORS.PRIMARY,
                    bold: true,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: COLORS.PRIMARY,
                    bold: true,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    text: '  |  JaringLokal: Platform Hasil Laut & UMKM Pesisir',
                    size: 16,
                    color: COLORS.TEXT_MUTED,
                    font: 'Segoe UI',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ── COVER / TITLE SECTION ──
          createBadge('WDC 2026 · TEMA: UMKM GOES DIGITAL'),
          createDocTitle('PROPOSAL PLATFORM DIGITAL "JARINGLOKAL"'),
          createDocSubtitle('Sistem Distribusi Hasil Laut & Digitalisasi UMKM Pesisir Terintegrasi Berbasis Escrow Real-Time (Rekening Bersama 3-Pihak)'),

          createStyledTable(
            ['Informasi Tim & Proyek', 'Keterangan'],
            [
              ['Nama Tim', 'blup blup'],
              ['Anggota Tim', '1. Ardinazer / Hiu (Product Designer & Frontend)\n2. Developer / Paus (System Architecture & Backend)'],
              ['Nama Platform', 'JaringLokal (AerLaut) — Ekosistem Distribusi Maritim & UMKM Pesisir'],
              ['Fokus Utama', 'Memotong Rantai Tengkulak, Digitalisasi Stok Hasil Laut, dan Rekening Bersama (Escrow) 3 Pihak'],
              ['Teknologi Utama', 'React 19, Vite, Tailwind CSS, Supabase PostgreSQL, Supabase Realtime, Cloudflare Turnstile'],
              ['Tautan Proyek (GitHub)', 'https://github.com/derrick0930/JaringLokal'],
              ['Tautan Live Preview', 'https://jaringlokal.vercel.app/ (AerLaut)']
            ],
            [30, 70]
          ),

          new Paragraph({ spacing: { before: 140, after: 140 } }),

          createCallout(
            'Ringkasan Singkat Proyek',
            '"JaringLokal diciptakan untuk memutus 3–5 lapisan perantara (tengkulak) hasil laut dan memberdayakan UMKM pesisir (pengolah terasi, ikan asap, kerupuk, bandeng presto). Platform ini menghadirkan pencatatan stok harian real-time, transaksi rekening bersama (Escrow 3 Pihak) yang aman, live order chat terpadu, hingga visualisasi demografi pengunjung wilayah."'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // ── BAB I. LATAR BELAKANG & PERMASALAHAN ──
          createH1('LATAR BELAKANG DAN MASALAH', 'I.'),
          createP(
            'Indonesia memiliki garis pantai yang sangat luas dengan ribuan desa pesisir. Namun di balik potensi maritim yang melimpah, nelayan tradisional dan pelaku UMKM olahan pesisir masih menghadapi masalah struktural:',
            true
          ),
          createBullet('Rantai Pasok Terlalu Panjang (3–5 Lapisan Perantara)', 'Nelayan menjual hasil tangkapan dengan harga sangat rendah ke tengkulak lokal, sementara konsumen akhir dan restoran membayar harga mahal untuk hasil laut yang kesegarannya sudah menurun.'),
          createBullet('Pencatatan Manual & Kerentanan Stok Rusak', 'UMKM pesisir masih mengandalkan buku catatan manual. Stok harian tangkapan segar yang tidak sinkron sering memicu pembusukan komoditas sebelum terjual.'),
          createBullet('Risiko Transaksi Jarak Jauh', 'Pembeli di luar kota ragu mentransfer dana karena takut barang tidak dikirim atau tidak segar, sedangkan nelayan takut mengirim barang jika pembayaran belum pasti.'),
          createBullet('Keterbatasan Akses Pasar Olahan Pesisir', 'Produk khas olahan ibu-ibu pesisir (terasi super, ikan asap, bandeng presto) hanya beredar di pasar desa terdekat dan sulit menembus pasar perkotaan.'),

          // ── BAB II. SOLUSI & TUJUAN PROYEK ──
          createH1('SOLUSI DAN TUJUAN PROYEK', 'II.'),
          createP(
            'Berangkat dari persoalan tersebut, kami membangun JaringLokal sebagai solusi e-commerce distribusi maritim terpadu:'
          ),
          createBullet('Tujuan 1 (Pemberdayaan Ekonomi)', 'Meningkatkan pendapatan bersih nelayan mitra sebesar minimal 30% dengan memotong rantai tengkulak dan menghubungkan langsung ke pembeli.'),
          createBullet('Tujuan 2 (Digitalisasi Stok & Operasional)', 'Menyediakan etalase digital dan sistem inventori otomatis (CRUDS) dengan auto-deduction stok saat transaksi.'),
          createBullet('Tujuan 3 (Keamanan Transaksi Terjamin)', 'Menyediakan sistem Rekening Bersama (Escrow 3-Pihak: Pembeli - Penjual - Admin) dengan live chat transaksi untuk perlindungan 100% dari penipuan.'),
          createBullet('Tujuan 4 (Dukungan & Analisis Bisnis)', 'Menyediakan live dashboard analitik pengunjung, tiket bantuan otomatis, serta QR Code generator untuk pemasaran fisik.'),

          // ── BAB III. CARA KERJA SISTEM (WORKFLOW) ──
          createH1('CARA KERJA SISTEM (WORKFLOW & ARSITEKTUR)', 'III.'),
          createP('Sistem JaringLokal beroperasi melalui 5 tahapan alur utama:'),

          createStyledTable(
            ['Tahap', 'Alur / Cara Kerja', 'Mekanisme Sistem & Database'],
            [
              [
                '1. Kurasi Mitra',
                'Nelayan / UMKM mendaftar toko melalui Seller Register. Status toko awal adalah "pending".',
                'Admin memeriksa profil di Admin Stores Hub. Saat disetujui ("approved"), role akun otomatis naik menjadi "seller".'
              ],
              [
                '2. Manajemen Stok',
                'Penjual mengunggah produk segar atau olahan dengan foto, harga, satuan (kg/ekor), dan stok awal.',
                'Data tersimpan di Supabase PostgreSQL dan tersinkronisasi secara real-time ke halaman katalog publik.'
              ],
              [
                '3. Checkout & Rekber',
                'Pembeli memilih produk, memasukkan ke keranjang, dan melakukan checkout.',
                'Stok produk berkurang otomatis (auto-deduction). Order masuk status "pending_payment" (Rekening Bersama).'
              ],
              [
                '4. Siklus Escrow',
                'Pembeli transfer dana -> Admin verifikasi ("in_escrow") -> Penjual kirim hasil laut ("shipped").',
                'Semua pihak berkoordinasi langsung di Ruang Diskusi Pesanan Real-Time (Live Escrow Order Chat).'
              ],
              [
                '5. Penyelesaian',
                'Pembeli mengonfirmasi barang telah diterima dengan segar -> Transaksi "completed".',
                'Admin melepaskan dana ke rekening penjual. Aktivitas tercatat di Log Analitik & Statistik.'
              ]
            ],
            [15, 45, 40]
          ),

          createH2('3.1 Otomatisasi Tiket Bantuan & Pemantauan Pengunjung'),
          createBullet('Auto-Resolve Tiket Inaktif', 'Tiket bantuan pengguna yang tidak memiliki balasan selama 7 hari (1 minggu) otomatis diselesaikan oleh cron bot sistem.'),
          createBullet('Geolokasi Visitor & Log IP', 'Sistem merekam IP pengunjung dan memetakan persebaran kota serta tipe perangkat (Mobile vs Desktop) untuk bahan evaluasi pasar UMKM.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ── BAB IV. SPESIFIKASI TEKNOLOGI ──
          createH1('SPESIFIKASI TEKNOLOGI (TECH STACK)', 'IV.'),
          createStyledTable(
            ['Komponen', 'Teknologi', 'Fungsi Utama'],
            [
              ['Frontend Framework', 'React 19 + Vite', 'Performa ultra-cepat, Single Page Application modern, build ringan.'],
              ['Styling & UI', 'Tailwind CSS, Lucide React, clsx', 'Tampilan modern, tema bahari bernuansa maritim yang elegan & responsif mobile.'],
              ['Database & BaaS', 'Supabase (PostgreSQL 15)', 'Penyimpanan relasional tangguh (`users`, `stores`, `products`, `orders`, `order_chats`, `user_logs`, `support_tickets`).'],
              ['Realtime Engine', 'Supabase Realtime (WebSocket CDC)', 'Sinkronisasi instan chat pesanan, perubahan stok, dan update status tanpa reload.'],
              ['Keamanan & Anti-Bot', 'Cloudflare Turnstile, reCAPTCHA v3, RLS', 'Proteksi form registrasi, login, dan tiket bantuan dari spam & bot crawling.']
            ],
            [25, 30, 45]
          ),

          // ── BAB V. FITUR UTAMA PLATFORM ──
          createH1('FITUR-FITUR UTAMA PLATFORM', 'V.'),
          createBullet('1. Multi-Role Dashboard', 'Tampilan dashboard khusus untuk Pembeli (UserDashboard), Penjual (SellerDashboard), dan Pengelola (Admin Hub).'),
          createBullet('2. Escrow Order Hub & Live Chat 3-Pihak', 'Ruang obrolan real-time per nomor order untuk komunikasi pembeli, nelayan, dan admin.'),
          createBullet('3. Auto-Stock Management', 'Stok komoditas laut berkurang otomatis saat pemesanan terjadi untuk mencegah overselling.'),
          createBullet('4. Dynamic QR Code Generator', 'Fitur pembuatan kode QR instan untuk disematkan pada kotak pendingin (coolbox) atau etalase toko.'),
          createBullet('5. Pusat Bantuan Terpadu', 'Sistem tiket interaktif di dalam aplikasi serta jalur cepat WhatsApp Direct Admin untuk bantuan pra-login.'),

          // ── BAB VI. DAMPAK DAN RENCANA IMPLEMENTASI ──
          createH1('DAMPAK SOSIAL-EKONOMI DAN ROADMAP', 'VI.'),
          createP(
            'Implementasi JaringLokal diharapkan dapat meningkatkan kemandirian ekonomi desa pesisir melalui 4 fase pengembangan:'
          ),
          createBullet('Fase 1 (Riset & Prototipe)', 'Studi lapangan bersama 50 nelayan dan UMKM di pesisir Tuban (Selesai).'),
          createBullet('Fase 2 (Pengembangan Platform)', 'Pembangunan arsitektur React 19 + Supabase Realtime + Escrow System (Selesai).'),
          createBullet('Fase 3 (Peluncuran WDC 2026)', 'Uji coba pilot project 240+ nelayan dan rilis publik (Tahap Berjalan).'),
          createBullet('Fase 4 (Ekspansi & Integrasi Payment Gateway)', 'Integrasi QRIS otomatis, peluncuran PWA mobile, dan perluasan ke 12 desa pesisir.'),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          new Paragraph({
            spacing: { before: 240, after: 80 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Agustus 2026\n',
                size: 20,
                color: COLORS.TEXT_DARK,
                font: 'Segoe UI',
              }),
              new TextRun({
                text: 'Tim Pengembang JaringLokal (blup blup)\n',
                bold: true,
                size: 22,
                color: COLORS.PRIMARY,
                font: 'Segoe UI',
              }),
              new TextRun({
                text: 'Hiu & Paus — WDC 2026',
                size: 20,
                color: COLORS.TEXT_MUTED,
                font: 'Segoe UI',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve(__dirname, '../PROPOSAL_JARINGLOKAL.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Word Document successfully generated at: ${outputPath}`);
}

generateProposal().catch(err => {
  console.error('❌ Error generating Word document:', err);
});
