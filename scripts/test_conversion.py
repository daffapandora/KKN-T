"""Offline smoke test with synthetic GeoTIFFs. Never use these as real map data."""

import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

import numpy as np
from osgeo import gdal, osr

gdal.UseExceptions()
osr.UseExceptions()
CONVERTER = Path(__file__).with_name("convert_raster.py")


def fixtures(root):
    # Use projected metres near Kemitir so the viewer can also QA the XYZ output.
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(32749)
    for name, count, dtype in [("rgb", 4, gdal.GDT_Byte), ("multispektral", 4, gdal.GDT_UInt16),
                               ("dtm", 1, gdal.GDT_Float32)]:
        ds = gdal.GetDriverByName("GTiff").Create(str(root / f"{name}.tif"), 180, 180, count, dtype)
        ds.SetProjection(srs.ExportToWkt())
        ds.SetGeoTransform((419800, 5, 0, 9201800, 0, -5))
        if name == "rgb":
            for i, (interpretation, value) in enumerate(zip(
                (gdal.GCI_RedBand, gdal.GCI_GreenBand, gdal.GCI_BlueBand, gdal.GCI_AlphaBand),
                (164, 104, 42, 255),
            ), 1):
                band = ds.GetRasterBand(i)
                band.SetColorInterpretation(interpretation)
                pixels = np.full((180, 180), value, dtype=np.uint8)
                if i == 4:
                    pixels[:, :40] = 0
                band.WriteArray(pixels)
        elif name == "multispektral":
            for i, value in enumerate((10, 20, 40, 60), 1):
                band = ds.GetRasterBand(i)
                band.SetColorInterpretation(gdal.GCI_Undefined)
                band.SetNoDataValue(65535)
                band.SetScale(0.01)
                band.SetOffset(0.1)
                pixels = np.full((180, 180), value, dtype=np.uint16)
                pixels[:, :40] = 65535
                band.WriteArray(pixels)
        else:
            y, x = np.indices((180, 180))
            ds.GetRasterBand(1).WriteArray(800 + np.cos(y / 12) * 20 + x / 5)
        ds.FlushCache()
        band = ds = None


def convert_all(root, tiles):
    for kind in ("rgb", "multispektral", "dtm"):
        subprocess.run([sys.executable, str(CONVERTER), kind, str(root / f"{kind}.tif"),
                        "--resolution", "5", "--zoom", "14-16", "--tiles-dir", str(tiles),
                        "--cog-dir", str(root / "cog"), "--jobs", "2"], check=True)


class SmokeTest(unittest.TestCase):
    def test_xyz_catalog_cog_and_indices(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            fixtures(root)
            tiles = root / "tiles"
            convert_all(root, tiles)
            catalog = json.loads((tiles / "catalog.json").read_text())
            self.assertEqual(set(catalog["layers"]), {"rgb", "ndvi", "ndre", "hillshade"})
            for name, entry in catalog["layers"].items():
                folder = entry["template"].split("/")[0]
                tile = next((tiles / folder / "16").glob("*/*.png"))
                ras = gdal.Open(str(tile))
                self.assertEqual((ras.RasterXSize, ras.RasterYSize), (256, 256))
                self.assertTrue(-8 < entry["bounds"][0][0] < -7 < 110 < entry["bounds"][0][1] < 111)
                cog = gdal.Open(str(root / "cog" / f"{folder}.tif"))
                self.assertEqual(cog.GetMetadataItem("LAYOUT", "IMAGE_STRUCTURE"), "COG")
                if name in ("ndvi", "ndre"):
                    band = cog.GetRasterBand(1)
                    data = band.ReadAsArray()
                    center = data[data.shape[0] // 2, data.shape[1] // 2]
                    self.assertAlmostEqual(center, 0.4 if name == "ndvi" else 1 / 6, places=5)
                    self.assertIn(band.GetNoDataValue(), data)
                if name == "rgb":
                    alpha = cog.GetRasterBand(4).ReadAsArray()
                    self.assertIn(0, alpha)
                    self.assertIn(255, alpha)

    def test_rejects_missing_georeference(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "unreferenced.tif"
            raster = gdal.GetDriverByName("GTiff").Create(str(source), 32, 32, 3)
            raster = None
            process = subprocess.run([sys.executable, str(CONVERTER), "rgb", str(source),
                                      "--tiles-dir", str(root / "tiles")],
                                     capture_output=True, text=True)
            self.assertEqual(process.returncode, 1)
            self.assertIn("CRS dan geotransform", process.stderr)
            self.assertFalse((root / "tiles" / "catalog.json").exists())


if __name__ == "__main__":
    unittest.main()
