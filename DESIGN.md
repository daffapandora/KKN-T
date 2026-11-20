# Panduan Desain: Kemitir Tangguh Bencana (DESIGN.md)

Pusat data spasial mitigasi bencana kekeringan, inventarisasi sumber air bersih, dan pemetaan partisipatif warga Desa Kemitir, Kecamatan Sumowono, Kabupaten Semarang (Kolaborasi KKN Tematik Universitas Diponegoro 2026).

---

## 1. Identitas & Karakter (Identity & Personality)
- **Karakter Utama**: Berpijak pada realitas desa (grounded), transparan, berbasis data geodesi ilmiah, praktis, dan inklusif untuk warga desa (usia 20–60 tahun) serta perangkat desa.
- **Bukan Gaya**: Bukan klon korporat AI, bukan klon gaya Apple/Linear/Vercel, bukan aplikasi pamer tren visual semu (tidak ada mesh gradient ungu-cyan, tidak ada glow berlebihan, tidak ada kartu mengambang tanpa bobot).
- **Dial Nilai Kehidupan (Liveliness Dials)**:
  - `ENERGY: 1` (Calm/Civic) — Tenang, formal-fungsional sebagai sistem informasi kebencanaan publik desa.
  - `RHYTHM: 2` (Balanced) — Ritme layout seimbang antara peta spasial interaktif, tabel data faktual, dan formulir partisipatif.
  - `MOTION: 1` (Calm/Functional) — Animasi hanya untuk feedback interaksi nyata (transisi drawer, focus ring, dialog). Tidak ada animasi melayang atau bounce hiasan.

---

## 2. Palet Warna (Color System)
Dibatasi secara ketat pada warna representatif desa agraris lereng pegunungan:
- **Netral Dasar**:
  - Background: `#FFFFFF` dan `#F9FAFB`
  - Teks Utama: `#151A22` (kontras rasio > 12:1 pada putih, melampaui WCAG AA)
  - Teks Sekunder: `#4B5563` / `#6F747C` (kontras rasio > 4.5:1)
  - Border Hairline: `#E8EAED` / `#CBD5E1`
- **Warna Pokok (Core Palette)**:
  - **Hijau Ketangguhan & Agraris (Brand Primary)**: `#16A34A` (Hover/Dark: `#15803D`, Tint: `#F0FDF4`)
  - **Biru Sumber Air Pegunungan (Water Primary)**: `#2563EB` (Hover/Dark: `#1D4ED8`, Tint: `#EFF6FF`)
- **Aksen Fungsional Spesifik**:
  - **Peringatan / Hazard Sedang**: `#D97706` / `#F59E0B` (Tint: `#FEF3C7`)
  - **Bahaya / Krisis Kekeringan Tinggi**: `#DC2626` (Tint: `#FEE2E2`)
  - **Partisipasi Warga**: `#7C3AED` (Tint: `#F5F3FF`)
- **Pantangan Warna**:
  - Dilarang menggunakan gradien neon biru-ke-ungu atau ungu-ke-pink.
  - Dilarang menggunakan efek glow kabur di banyak elemen secara bersamaan.

---

## 3. Tipografi & Hierarki (Typography)
- **Font Utama**: `Plus Jakarta Sans` dan `Inter` (sans-serif modern dengan legibilitas tinggi, angka tabular jelas untuk koordinat dan debit air).
- **Font Monospace**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` (khusus representasi koordinat SRID EPSG:4326, kode undangan RT, dan stempel waktu).
- **Prinsip Teks**:
  - Ukuran minimum teks isi 14px (mobile 14–16px) agar nyaman dibaca warga di bawah terik sinar matahari lapangan.
  - Jarak baris (leading) longgar untuk memudahkan pembacaan data teknis.
  - Hindari kapitalisasi ekstrem dengan letter-spacing berlebihan untuk label hiasan.

---

## 4. Motif & Tanda Khas (Identity Motif)
- **Hairline Spatial Grid**: Garis batas tipis 1px (`#E8EAED`) menyerupai garis peta kadastral/topografi.
- **Identitas Kolaborasi Resmi**: Menampilkan tanda kolaborasi "KKN Tematik Universitas Diponegoro 2026 × Pemerintah Desa Kemitir".
- **Parameter Spasial Faktual**: Menggunakan satuan metrik nyata (hektare `ha`, liter per detik `L/s`, elevasi `mdpl`, koordinat derajat desimal).

---

## 5. Ergonomi & Aksesibilitas (Human & Mobile Standards)
- **Target Sentuh Mobile**: Tombol dan elemen interaktif minimal berukuran 44×44px (standar WCAG 2.5.5).
- **Navigasi Keyboard**: Semua tautan, tombol, dan tab wajib memiliki outline `:focus-visible` kontras tinggi (ring 2px emerald/blue dengan offset).
- **Kondisi Komponen Lengkap**: Setiap komponen data wajib memiliki state:
  1. Kondisi Normal (Data terisi)
  2. Kondisi Memuat (Loading skeleton/spinner sopan)
  3. Kondisi Kosong (Empty state informatif)
  4. Kondisi Gangguan/Error (Error state dengan aksi pemulihan)

