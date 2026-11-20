# KKN-T Desa Kemitir: Data Peta Dasar untuk WebGIS

Repo ini menyimpan metadata, dokumen pendukung, dan konfigurasi untuk WebGIS ketahanan kekeringan Desa Kemitir. Raster besar (GeoTIFF, 2 sampai 55 GB per file) tetap di Google Drive karena melebihi batas GitHub dan Git LFS.

## Tautan Data Drive

| Folder | Isi | Tautan |
|---|---|---|
| Induk | Peta Foto Desa Kemitir | [Buka](https://drive.google.com/drive/folders/12azqkvMbPMFPutg-R1l0G_ycj7clcSKC) |
| Raw Data | Foto mentah drone (Multispektral) | [Buka](https://drive.google.com/drive/folders/171054N9kYXVj0-XMdSbqHqCVKQPfxQjh) |
| Elev Model | DTM Kemitir.tif (14,4 GB), DSM final.tif (17,8 GB) | [Buka](https://drive.google.com/drive/folders/1geaj-rF-Z-o6L8VrCU0QDUipLEUtIpd_) |
| RGB | RGB_Kemitir.tif (2,6 GB), Orthomosaik final rgb 1.tif (1,9 GB), laporan, GCP, uji akurasi | [Buka](https://drive.google.com/drive/folders/1OKv9DnV97dmKzYrnRYRLib6yxI9ngiAI) |
| Multispektral | MultiSpektral high res.tif (55,4 GB), Multispektral low resolution.tif (18,1 GB), laporan, GCP, uji akurasi | [Buka](https://drive.google.com/drive/folders/1Ej85xjeFDU3OFwgo2NBv0qxQbLzB_c2s) |

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

Simpan GeoTIFF sumber di Drive dan unduh hanya file yang akan diproses. Untuk uji pertama, mulai dengan satu ortomosaik RGB. Jika unduhan ZIP dari Drive gagal, pilih file TIFF-nya saja atau gunakan `rclone copyto` dengan remote Drive yang sudah dikonfigurasi.

### Instalasi dan uji lokal

Jalankan dari root repo. Di Ubuntu/Debian, paket berikut memasang GDAL dan binding untuk Python sistem. Di macOS/Windows, gunakan lingkungan GDAL ≥ 3.6 yang menyediakan NumPy, binding `osgeo`, dan `gdal2tiles` atau `gdal2tiles.py` pada `PATH`. Ganti `/usr/bin/python3` dengan Python dari lingkungan tersebut.

```bash
sudo apt install gdal-bin python3-gdal python3-numpy
mkdir -p data/raw/rgb data/raw/multispektral data/raw/elev-model
```

Letakkan ortomosaik dari folder [RGB](https://drive.google.com/drive/folders/1OKv9DnV97dmKzYrnRYRLib6yxI9ngiAI) di `data/raw/rgb/`. Periksa CRS, NoData, dan urutan band dengan `gdalinfo`, lalu buat tile. RGB membutuhkan GeoTIFF 8-bit dengan band merah, hijau, biru, dan alpha opsional. Jika citra bukan 8-bit, buat ekspor RGB Byte yang sudah diatur kontrasnya di QGIS terlebih dahulu.

```bash
gdalinfo "data/raw/rgb/Orthomosaik final rgb 1.tif"
/usr/bin/python3 scripts/convert_raster.py rgb "data/raw/rgb/Orthomosaik final rgb 1.tif" \
  --resolution 2 --zoom 14-16
/usr/bin/python3 -m http.server 8000 --bind 127.0.0.1 --directory webgis
```

Buka [WebGIS lokal](http://127.0.0.1:8000/) melalui browser. Pilih **Foto udara** untuk melihat konversi. Jangan membuka `index.html` langsung lewat `file://`, karena peta mengambil katalog melalui HTTP. Tanpa katalog, aplikasi menampilkan peta dasar lokal dan menandai overlay sebagai belum tersedia.

### Tambahkan lapisan setelah RGB bekerja

```bash
/usr/bin/python3 scripts/convert_raster.py multispektral \
  "data/raw/multispektral/Multispektral low resolution.tif" --cog-dir processed/cog
/usr/bin/python3 scripts/convert_raster.py dtm \
  "data/raw/elev-model/Dtm Kemitir.tif" --cog-dir processed/cog
```

- **NDVI/NDRE:** menggunakan NIR (band 4) terhadap Red (band 2) atau Red Edge (band 3). Periksa bahwa band berurutan sesuai panduan di [Multispektral](https://drive.google.com/drive/folders/1Ej85xjeFDU3OFwgo2NBv0qxQbLzB_c2s). Gunakan data reflektansi yang telah dikalibrasi; piksel dengan NoData, penyebut nol, atau nilai negatif tidak diberi nilai indeks. Nilai indeks dihitung setelah resampling dan belum membuktikan kondisi kekeringan. Dengan `--cog-dir`, nilai NDVI dan NDRE juga disimpan sebagai COG Float32, terpisah dari tile berwarna.
- **Hillshade:** dibuat dari DTM satu band dengan elevasi dalam meter. DTM diproyeksikan ke UTM 49S untuk pemrosesan relief. Hillshade adalah visualisasi relief, bukan peta aliran atau kemiringan.
- **Batasi beban kerja:** `--bbox BARAT SELATAN TIMUR UTARA` membatasi area (bujur/lintang WGS84), `--resolution` mengatur besaran piksel target dalam satuan proyeksi meter, dan `--zoom` mengatur jenjang detail tile. Pertahankan uji awal pada zoom `14-16`, kemudian naikkan bertahap. Skrip menolak grid target di atas 100 juta piksel atau cakupan di atas sekitar 15.000 tile per layer; pastikan ruang disk cukup untuk raster sementara, tile, dan COG.
- **Jalankan berurutan:** setiap konversi memperbarui `webgis/tiles/catalog.json` dengan folder tile berversi. Folder lama tidak otomatis dihapus. Setelah memverifikasi hasil baru, arsipkan atau hapus versi lama yang sudah tidak dirujuk katalog.

### Hosting produksi

- **Aplikasi:** sajikan isi `webgis/` sebagai situs statis. Jika memakai GitHub Pages dari struktur ini, gunakan workflow Pages yang mengunggah `webgis/` sebagai artefak, bukan memilih `/webgis` sebagai sumber publikasi branch.
- **Tile:** taruh folder tile yang dirujuk katalog dan `catalog.json` di server statis atau object storage. Atur `catalogUrl` di `webgis/config.js` ke URL HTTPS katalog. Unggah tile dahulu, lalu katalog; pertahankan struktur direktori. Bila hosting beda origin, izinkan origin aplikasi membaca katalog lewat CORS. Pastikan pemilik data mengizinkan publikasi sebelum memasang tile di hosting publik.
- **Git:** tile, COG, dan raster sumber tidak perlu didorong ke GitHub. Lihat [dokumentasi GDAL XYZ](https://gdal.org/en/stable/programs/gdal2tiles.html) untuk format tile. Titik awal mengikuti [Wikidata Kemitir](https://www.wikidata.org/wiki/Q12490778?uselang=id), bukan batas administrasi.
- **Peta dasar:** jalan, aliran, dan label tempat di `webgis/basemap/` adalah cuplikan [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL), dipotong ke sekitar Kemitir. Peta dasar tidak memanggil server tile OpenStreetMap. Lihat [catatan cakupan dan lisensi](webgis/basemap/README.md). Cuplikan ini bukan batas desa resmi dan tidak diperbarui otomatis.

Jalankan `/usr/bin/python3 scripts/test_conversion.py` untuk memeriksa keluaran XYZ, COG, NoData, dan nilai indeks menggunakan GeoTIFF sintetis.

## Git LFS

File biner kecil (PDF, XLS) dilacak via LFS sesuai `.gitattributes`. Raster besar diabaikan oleh `.gitignore`.

```bash
git lfs install && git clone https://github.com/daffapandora/KKN-T.git
```
