# KKN-T Desa Kemitir: Data Peta Dasar untuk WebGIS

Repo ini menyimpan metadata, dokumen pendukung, dan konfigurasi untuk WebGIS ketahanan kekeringan Desa Kemitir. Raster besar (GeoTIFF, 2 sampai 55 GB per file) tetap di Google Drive karena melebihi batas GitHub dan Git LFS.

## Tautan Data Drive

| Folder | Isi | Tautan |
|---|---|---|
| Induk | Peta Foto Desa Kemitir | [Buka](https://drive.google.com/drive/folders/12azqkvMbPMFPutg-R1l0G_ycj7clcSKC) |
| Raw Data | Foto mentah drone (Multispektral) | [Buka](https://drive.google.com/drive/folders/171054N9kYXVj0-XMdSbqHqCVKQPfxQjh) |
| Elev Model | DTM Kemitir.tif (14,4 GB), DSM final.tif (17,8 GB) | [Buka](https://drive.google.com/drive/folders/1geaj-rF-Z-o6L8VrCU0QDUipLEUtIpd_) |
| RGB | RGB_Kemitir.tif (2,6 GB), Orthomosaik final rgb 1.tif (1,9 GB), laporan, GCP, uji akurasi | [Buka](https://drive.google.com/drive/folders/1OKv9DnV97dmKzYrnRYRLib6yxI9ngiAI) |
| Multispektral | MultiSpektral high res.tif (55,4 GB), low resolution.tif (18,1 GB), laporan, GCP, uji akurasi | [Buka](https://drive.google.com/drive/folders/1Ej85xjeFDU3OFwgo2NBv0qxQbLzB_c2s) |

Catatan: "Salinan Orthomosaik final rgb 1.tif" adalah duplikat dan tidak perlu diunduh.

## Struktur Folder

```
KKN-T/
├── data/
│   ├── elev-model/      Catatan Penting.txt
│   ├── rgb/             Control Point.csv, UJIAkurasi PEta.xls, Report RGB Kemitir.pdf
│   ├── multispektral/   Control Point.csv, UJI AKURASI PETA.xlsx, Panduan band.txt, Report ms.pdf
│   ├── raw/             (lokal saja, tidak di-commit)
│   └── vector/          batas desa, sumur, jaringan air (GeoJSON/SHP)
├── processed/           (lokal) hasil COG, NDVI, tile, tidak di-commit
├── webgis/              kode aplikasi WebGIS
└── scripts/             skrip konversi raster
```

## Informasi Data

- DSM dari fotogrametri RGB, DTM dari fotogrametri Multispektral. Akurasi ada pada file uji akurasi di folder masing-masing sensor.
- Band multispektral: 1 Green (0,544–0,576 µm), 2 Red (0,634–0,666 µm), 3 Red Edge (0,714–0,746 µm), 4 NIR (0,834–0,886 µm).

## Alur Data untuk WebGIS

Raster puluhan GB tidak bisa dibuka langsung di browser. Alurnya:

1. **Unduh cepat** dengan rclone (paralel):
   ```bash
   rclone copy "gdrive:Peta Foto Desa Kemitir/RGB" data/raw/rgb --transfers 8 --drive-chunk-size 128M -P
   ```
2. **Turunkan resolusi dan buat COG** (Cloud Optimized GeoTIFF):
   ```bash
   gdalwarp -tr 0.2 0.2 -r average RGB_Kemitir.tif rgb_20cm.tif
   gdal_translate rgb_20cm.tif rgb_cog.tif -of COG -co COMPRESS=WEBP -co QUALITY=85
   ```
3. **Buat produk analisis** kekeringan dari multispektral (low resolution sudah cukup):
   ```bash
   gdal_calc.py -A ms_low.tif --A_band=4 -B ms_low.tif --B_band=2 \
     --outfile=ndvi.tif --calc="(A.astype(float)-B)/(A+B)" --type=Float32
   ```
   Bisa juga NDRE (Red Edge) untuk stres vegetasi, dan hillshade/slope dari DTM.
4. **Buat tile XYZ** untuk peta web:
   ```bash
   gdal2tiles.py -z 14-20 --xyz --processes=8 rgb_cog.tif tiles/rgb
   ```
   Alternatif lebih ringan: konversi ke satu file **PMTiles** agar bisa di-host statis.
5. **Hosting**: tile/PMTiles di Cloudflare R2 atau GitHub Releases (maks 2 GB per file), aplikasi Leaflet/MapLibre di GitHub Pages dari folder `webgis/`.

| Layer WebGIS | Sumber | Format web |
|---|---|---|
| Basemap foto udara | RGB_Kemitir.tif | XYZ / PMTiles |
| Indeks vegetasi (NDVI/NDRE) | Multispektral low res | COG / PNG tile |
| Topografi, hillshade, aliran air | DTM | COG / tile |
| Batas desa, titik sumur | Digitasi | GeoJSON (di repo) |

## Git LFS

File biner kecil (PDF, XLS) dilacak via LFS sesuai `.gitattributes`. Raster besar diabaikan oleh `.gitignore`.

```bash
git lfs install && git clone https://github.com/daffapandora/KKN-T.git
```
