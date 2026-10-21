# Runbook Operasional & Panduan Penggelaran (Deployment)
**Kemitir Tangguh Bencana**

---

## 1. Persyaratan Awal (Prerequisites)
- **Node.js**: v20.x LTS
- **pnpm**: v10.x (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker & Docker Compose**: v2.20+
- **PostgreSQL 16 & PostGIS 3.4** (tersedia via Docker)

---

## 2. Menjalankan di Lingkungan Lokal (Local Development)

```bash
# 1. Klon repositori dan salin konfigurasi env
cp .env.example .env

# 2. Pasang semua dependensi monorepo
pnpm install

# 3. Jalankan container PostGIS & Nginx
docker compose up -d db

# 4. Jalankan migrasi dan data awal (seeding)
pnpm db:migrate
pnpm db:seed

# 5. Jalankan backend API dan frontend WebGIS secara paralel
pnpm dev
```

Aplikasi dapat diakses pada:
- **Frontend WebGIS & PWA:** http://localhost:3000
- **REST API & Health Check:** http://localhost:4000/health
- **PostGIS Port (Lokal):** localhost:5432

---

## 3. Menjalankan Pengujian (Testing)

```bash
# Jalankan seluruh unit test pada semua package dan app
pnpm test

# Jalankan pemeriksaan typecheck TypeScript
pnpm typecheck
```

---

## 4. Prosedur Pencadangan (Backup) & Pemulihan (Restore)

### Cadangan Harian
Jalankan skrip pencadangan otomatis (atau jadwalkan via cron pada pukul 02:00 WIB):
```bash
./infra/scripts/backup.sh
```

### Pemulihan Data (Restore)
```bash
# Kembalikan basis data dari berkas dump kustom
pg_restore -h localhost -p 5432 -U kemitir_user -d kemitir_gis -v /tmp/kemitir_backups/<nama_file>.dump
```

---

## 5. Konfigurasi Produksi pada Cloud VPS (IDCloudHost)
1. Perbarui paket OS Ubuntu 24.04: `sudo apt update && sudo apt upgrade -y`
2. Konfigurasi firewall UFW:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. Aktifkan proxy Cloudflare (Orange Cloud) dengan sertifikat SSL/TLS mode **Full (Strict)**.
4. Bangun dan jalankan stack produksi menggunakan docker compose:
   ```bash
   docker compose -f infra/docker-compose.yml up -d --build
   ```
