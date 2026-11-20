#!/usr/bin/env python3
"""Convert one Kemitir raster into bounded XYZ layers for the Leaflet viewer."""

import argparse
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import uuid

import numpy as np
from osgeo import gdal

gdal.UseExceptions()

LAYERS = {"rgb": ("rgb",), "multispektral": ("ndvi", "ndre"), "dtm": ("hillshade",)}
RESOLUTION = {"rgb": 1, "multispektral": 2, "dtm": 5}
GTIFF = ["TILED=YES", "COMPRESS=DEFLATE", "BIGTIFF=IF_SAFER"]
NODATA = -9999
PALETTE = "-1 151 67 44\n-0.25 205 137 84\n0 244 227 169\n0.5 118 162 93\n1 34 91 58\nnv 0 0 0 0\n"


def warp(source, target, resolution, bbox, **options):
    # Limit working size before materializing the target; processing stays on disk.
    preview = gdal.AutoCreateWarpedVRT(source, None, options["dstSRS"])
    _, px, _, _, _, py = preview.GetGeoTransform()
    if bbox:
        # gdal.Warp to a virtual dataset computes exact proposed dimensions.
        preview = gdal.Warp("", source, format="VRT", xRes=resolution, yRes=resolution,
                            outputBounds=bbox, outputBoundsSRS="EPSG:4326", **options)
        pixels = preview.RasterXSize * preview.RasterYSize
    else:
        pixels = (math.ceil(preview.RasterXSize * abs(px) / resolution)
                  * math.ceil(preview.RasterYSize * abs(py) / resolution))
    if pixels > 100_000_000:
        raise ValueError(f"Grid sekitar {pixels:,} piksel. Naikkan --resolution atau batasi --bbox.")
    bounds = dict(outputBounds=bbox, outputBoundsSRS="EPSG:4326") if bbox else {}
    return gdal.Warp(str(target), source, xRes=resolution, yRes=resolution,
                     format="GTiff", creationOptions=GTIFF, multithread=True,
                     **bounds, **options)


def indices(ms, work):
    """Compute both indices blockwise, after NoData-aware spatial resampling."""
    targets = {}
    dataset = gdal.GetDriverByName("GTiff")
    cols, rows = ms.RasterXSize, ms.RasterYSize
    for name in LAYERS["multispektral"]:
        path = work / f"{name}.tif"
        file = dataset.Create(str(path), cols, rows, 1, gdal.GDT_Float32, options=GTIFF)
        file.SetGeoTransform(ms.GetGeoTransform())
        file.SetProjection(ms.GetProjection())
        file.GetRasterBand(1).SetNoDataValue(NODATA)
        targets[name] = file
    for y in range(0, rows, 512):
        for x in range(0, cols, 512):
            window = (x, y, min(512, cols - x), min(512, rows - y))
            values = []
            for i in (4, 2, 3):
                band = ms.GetRasterBand(i)
                values.append(band.ReadAsArray(*window) * band.GetScale() + band.GetOffset())
            nir, red, edge = values
            for name, other in (("ndvi", red), ("ndre", edge)):
                denom = nir + other
                valid = np.isfinite(denom) & (np.abs(denom) > 1e-10) & (nir >= 0) & (other >= 0)
                result = np.full(nir.shape, NODATA, dtype=np.float32)
                np.divide(nir - other, denom, out=result, where=valid)
                targets[name].GetRasterBand(1).WriteArray(result, x, y)
    for file in targets.values():
        file.FlushCache()


def prepare(source, args, work):
    kind = args.kind
    resolution = args.resolution or RESOLUTION[kind]
    options = dict(resampleAlg="average")
    if kind == "rgb":
        if source.RasterCount not in (3, 4) or any(
            source.GetRasterBand(i).DataType != gdal.GDT_Byte
            for i in range(1, source.RasterCount + 1)
        ):
            raise ValueError("RGB harus punya 3 band Byte (RGB), atau 4 band Byte (RGBA).")
        if source.RasterCount == 4 and source.GetRasterBand(4).GetColorInterpretation() != gdal.GCI_AlphaBand:
            raise ValueError("Tandai band keempat RGB sebagai Alpha, atau ekspor ulang sebagai RGB.")
        actual = [source.GetRasterBand(i).GetColorInterpretation() for i in (1, 2, 3)]
        if any(a not in (gdal.GCI_Undefined, b) for a, b in zip(
            actual, (gdal.GCI_RedBand, gdal.GCI_GreenBand, gdal.GCI_BlueBand)
        )):
            raise ValueError("Band 1–3 harus berurutan Merah, Hijau, Biru.")
        path = work / "rgb.tif"
        output = warp(source, path, resolution, args.bbox, dstSRS="EPSG:3857",
                      dstAlpha=True, dstNodata="None", warpOptions=["INIT_DEST=0"], **options)
        output = None
        return {"rgb": (path, path)}

    if kind == "dtm":
        if source.RasterCount != 1:
            raise ValueError("DTM harus satu band, dengan nilai elevasi dalam meter.")
        terrain = work / "terrain.tif"
        output = warp(source, terrain, resolution, args.bbox, dstSRS="EPSG:32749",
                      outputType=gdal.GDT_Float32, dstNodata=NODATA, **options)
        output = None
        hillshade = work / "hillshade.tif"
        output = gdal.DEMProcessing(str(hillshade), str(terrain), "hillshade",
                                    creationOptions=GTIFF)
        output = None
        return {"hillshade": (hillshade, hillshade)}

    if source.RasterCount < 4 or any(
        source.GetRasterBand(i).GetColorInterpretation() == gdal.GCI_AlphaBand
        for i in (2, 3, 4)
    ):
        raise ValueError("Multispektral memerlukan minimal 4 band: Green, Red, Red Edge, NIR.")
    # Apply each source band's scale/offset after resampling. VRT keeps this lazy.
    spectral = gdal.Translate("", source, format="VRT", outputType=gdal.GDT_Float32,
                              bandList=[1, 2, 3, 4] + (
                                  [source.RasterCount] if source.RasterCount > 4 and
                                  source.GetRasterBand(source.RasterCount).GetColorInterpretation()
                                  == gdal.GCI_AlphaBand else []))
    ms = warp(spectral, work / "spectral.tif", resolution, args.bbox, dstSRS="EPSG:3857",
              outputType=gdal.GDT_Float32, dstNodata=float("nan"),
              warpOptions=["UNIFIED_SRC_NODATA=NO"], **options)
    # Warp copies band metadata by default, but does not apply scale/offset to samples.
    for i in (2, 3, 4):
        src = source.GetRasterBand(i)
        band = ms.GetRasterBand(i)
        scale, offset = src.GetScale(), src.GetOffset()
        band.SetScale(1 if scale is None else scale)
        band.SetOffset(0 if offset is None else offset)
    indices(ms, work)
    ms = spectral = None
    palette = work / "palette.txt"
    palette.write_text(PALETTE, encoding="utf-8")
    products = {}
    for name in LAYERS[kind]:
        numeric, color = work / f"{name}.tif", work / f"{name}-rgba.tif"
        output = gdal.DEMProcessing(str(color), str(numeric), "color-relief",
                                    colorFilename=str(palette), addAlpha=True,
                                    creationOptions=GTIFF)
        output = None
        products[name] = (color, numeric)
    return products


def xy_bounds(path):
    dataset = gdal.Open(str(path))
    extent = gdal.Info(dataset, format="json")["wgs84Extent"]["coordinates"][0]
    lon, lat = zip(*extent)
    return [[min(lat), min(lon)], [max(lat), max(lon)]]


def estimated_tiles(bounds, lo, hi):
    def tile_y(lat, side):
        lat = min(85.05112878, max(-85.05112878, lat))
        return math.floor((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * side)

    (south, west), (north, east) = bounds
    total = 0
    for z in range(lo, hi + 1):
        side = 2 ** z
        cols = math.floor((east + 180) / 360 * side) - math.floor((west + 180) / 360 * side) + 1
        rows = tile_y(south, side) - tile_y(north, side) + 1
        total += cols * rows
    return total


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("kind", choices=LAYERS)
    parser.add_argument("source", type=Path, help="GeoTIFF bereferensi koordinat")
    parser.add_argument("--resolution", type=float, help="Ukuran piksel target dalam satuan proyeksi meter")
    parser.add_argument("--bbox", nargs=4, type=float, metavar=("W", "S", "E", "N"),
                        help="Potong area (EPSG:4326, derajat)")
    parser.add_argument("--zoom", default="12-17", help="Rentang zoom XYZ, mis. 14-16")
    parser.add_argument("--jobs", type=int, default=2, help="Jumlah proses pembuat tile")
    parser.add_argument("--tiles-dir", type=Path, default=Path("webgis/tiles"),
                        help="Folder XYZ dan catalog.json")
    parser.add_argument("--cog-dir", type=Path, help="Simpan COG opsional (NDVI/NDRE berupa nilai Float32)")
    args = parser.parse_args()
    try:
        lo, hi = (int(x) for x in args.zoom.split("-"))
        if not 0 <= lo <= hi <= 21 or not 1 <= args.jobs <= 16:
            raise ValueError
        if args.resolution is not None and not (math.isfinite(args.resolution) and args.resolution > 0):
            raise ValueError
        if args.bbox:
            w, s, e, n = args.bbox
            if not (-180 <= w < e <= 180 and -85 <= s < n <= 85):
                raise ValueError
    except ValueError:
        parser.error("Gunakan zoom MIN-MAX (0–21), jobs 1–16, resolusi positif, dan bbox W S E N yang valid.")

    tiler = shutil.which("gdal2tiles.py") or shutil.which("gdal2tiles")
    if not tiler or int(gdal.VersionInfo("VERSION_NUM")) < 3060000:
        parser.error("GDAL >= 3.6 diperlukan, termasuk gdal2tiles serta binding Python dan NumPy.")
    try:
        source = gdal.Open(str(args.source.resolve(strict=True)))
        if not source.GetProjection() or source.GetGeoTransform(can_return_null=True) is None:
            raise ValueError("Raster harus punya CRS dan geotransform. Periksa dengan gdalinfo.")
        args.tiles_dir.mkdir(parents=True, exist_ok=True)
        catalog = args.tiles_dir / "catalog.json"
        entries = json.loads(catalog.read_text(encoding="utf-8")) if catalog.exists() else {"version": 1, "layers": {}}
        if entries.get("version") != 1 or not isinstance(entries.get("layers"), dict):
            raise ValueError("Format catalog.json tidak dikenal.")
        if args.cog_dir:
            args.cog_dir.mkdir(parents=True, exist_ok=True)
        run = uuid.uuid4().hex[:12]
        with tempfile.TemporaryDirectory(prefix=".convert-", dir=args.tiles_dir) as temp:
            work = Path(temp)
            for name, (visual, numeric) in prepare(source, args, work).items():
                folder = f"{name}-{run}"
                bounds = xy_bounds(visual)
                count = estimated_tiles(bounds, lo, hi)
                if count > 15_000:
                    raise ValueError(f"{name}: sekitar {count:,} tile. Turunkan zoom maksimum atau potong dengan --bbox.")
                print(f"Membuat tile {name} pada zoom {lo}–{hi}…", flush=True)
                subprocess.run([tiler, "--xyz", "--zoom", f"{lo}-{hi}", "--processes",
                                str(args.jobs), "--webviewer=none", "--quiet",
                                str(visual), str(work / folder)], check=True)
                if not next((work / folder / str(hi)).glob("*/*.png"), None):
                    raise ValueError(f"Tidak ada tile {name}. Periksa cakupan dan NoData raster.")
                entries["layers"][name] = dict(template=f"{folder}/{{z}}/{{x}}/{{y}}.png",
                                               bounds=bounds, minZoom=lo, maxNativeZoom=hi)
                if args.cog_dir:
                    cog = gdal.Translate(str(args.cog_dir / f"{folder}.tif"), str(numeric),
                                         format="COG", creationOptions=["COMPRESS=DEFLATE",
                                                                        "BIGTIFF=IF_SAFER"])
                    cog = None
                (work / folder).rename(args.tiles_dir / folder)
            pending = work / "catalog.json"
            pending.write_text(json.dumps(entries, indent=2, allow_nan=False) + "\n", encoding="utf-8")
            pending.replace(catalog)
        print(f"Selesai: {catalog}")
    except (OSError, RuntimeError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Konversi gagal: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
