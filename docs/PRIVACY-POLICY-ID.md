# Kebijakan Privasi & Perlindungan Data Pribadi
**Sistem Informasi Spasial Desa Kemitir (Kemitir Tangguh Bencana)**  
*Kepatuhan terhadap Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)*

---

## 1. Identitas Pengendali Data
Pengendali Data Pribadi pada sistem ini adalah **Pemerintah Desa Kemitir**, Kecamatan Sumowono, Kabupaten Semarang, Jawa Tengah, berkolaborasi dengan **Tim Kuliah Kerja Nyata (KKN) Universitas Diponegoro 2026**.

## 2. Data yang Dikumpulkan
Sistem ini menerapkan prinsip **minimalisasi data** (*data minimization*):
- **Warga Terdaftar:** Nama lengkap, nomor telepon (disimpan dalam bentuk hash kriptografis atau terenkripsi), domisili RT/RW dan Dusun.
- **Laporan Kondisi & Partisipatif:** Koordinat lokasi (GPS), foto sarana/lahan terkait bencana kekeringan, deskripsi kondisi, dan stempel waktu.
- **Data Sensor Perangkat:** Sistem meminta izin akses kamera dan lokasi (geolocation) secara eksplisit hanya saat warga hendak menambahkan laporan atau memetakan objek swadaya.

## 3. Metadata Foto & EXIF Stripping
Semua foto yang diunggah oleh warga akan dibersihkan dari metadata EXIF (termasuk tag lokasi bawaan kamera ponsel dan merk perangkat) sebelum disimpan ke penyimpanan awan (Cloudflare R2), guna mencegah kebocoran data pelacak perangkat.

## 4. Publikasi pada Peta Publik
Peta WebGIS yang dapat dibuka oleh umum **TIDAK PERNAH** mempublikasikan nomor telepon, nama lengkap, atau alamat rumah pribadi pelapor. Laporan warga ditampilkan sebagai kategori umum setelah divalidasi oleh Validator Desa.

## 5. Penyimpanan dan Retensi Data
Data disimpan pada peladen privat aman dengan enkripsi TLS pada saat transmisi (*in transit*) dan enkripsi volume (*at rest*). Cadangan data harian disimpan secara terenkripsi ke Cloudflare R2 dengan retensi maksimal 30 hari.

## 6. Hak Warga sebagai Subjek Data
Warga berhak untuk:
1. Mengetahui data apa saja yang tercatat atas nomor teleponnya.
2. Meminta perbaikan data yang tidak akurat.
3. Meminta penghapusan permanen akun atau data riwayat laporannya.

Permohonan hak subjek data dapat diajukan langsung melalui Sekretariat Kantor Desa Kemitir atau surel resmi pengelola: `admin@desakemitir.id`.
