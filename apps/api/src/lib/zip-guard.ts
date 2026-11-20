export type ImportFileType = 'shapefile_zip' | 'geotiff';

export type ZipValidationErrorCode =
  | 'INVALID_MAGIC_BYTES'
  | 'CORRUPT_ZIP_EOCD'
  | 'TOO_MANY_FILES'
  | 'ZIP_SLIP_DETECTED'
  | 'ZIP_BOMB_DETECTED'
  | 'UNCOMPRESSED_LIMIT_EXCEEDED'
  | 'MISSING_SHAPEFILE_COMPONENTS';

export interface ZipValidationResult {
  valid: boolean;
  code?: ZipValidationErrorCode;
  message?: string;
  entriesCount?: number;
  totalUncompressedBytes?: number;
  shapefileBaseName?: string;
}

export const ZIP_SECURITY_LIMITS = Object.freeze({
  maxEntries: 30,
  maxUncompressedBytes: 250 * 1024 * 1024, // 250 MB
  maxCompressionRatio: 100,
  requiredShapefileExtensions: ['.shp', '.shx', '.dbf', '.prj'] as const,
});

const decoder = new TextDecoder('utf-8', { fatal: false });

/**
 * Memeriksa 4 byte pertama (magic bytes) dalam waktu O(1).
 * - ZIP: 50 4B 03 04 (PK\x03\x04)
 * - GeoTIFF: 49 49 2A 00 (II*\0), 4D 4D 00 2A (MM\0*), atau BigTIFF (2B)
 */
export function inspectMagicBytes(
  headerBytes: Uint8Array,
  expectedType: ImportFileType
): boolean {
  if (headerBytes.byteLength < 4) return false;
  const b0 = headerBytes[0];
  const b1 = headerBytes[1];
  const b2 = headerBytes[2];
  const b3 = headerBytes[3];

  if (expectedType === 'shapefile_zip') {
    return b0 === 0x50 && b1 === 0x4b && b2 === 0x03 && b3 === 0x04;
  }

  // GeoTIFF (Little-Endian II*\0 / II+\0 atau Big-Endian MM\0* / MM\0+)
  const isLittleEndianTiff =
    b0 === 0x49 && b1 === 0x49 && (b2 === 0x2a || b2 === 0x2b) && b3 === 0x00;
  const isBigEndianTiff =
    b0 === 0x4d && b1 === 0x4d && b2 === 0x00 && (b3 === 0x2a || b3 === 0x2b);

  return isLittleEndianTiff || isBigEndianTiff;
}

/**
 * Memeriksa apakah path di dalam arsip ZIP aman dari serangan Zip-Slip dalam O(L).
 */
export function isSafeZipEntryPath(rawPath: string): boolean {
  if (!rawPath || rawPath.length === 0) return false;
  const normalized = rawPath.replace(/\\/g, '/');

  if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) {
    return false;
  }

  const segments = normalized.split('/');
  for (const seg of segments) {
    if (seg === '..' || seg === '') {
      if (seg === '..') return false;
    }
  }

  return true;
}

/**
 * Menemukan offset record End of Central Directory (EOCD) dengan memindai dari akhir file (O(K), K <= 65557).
 */
export function findEOCDOffset(zipBuffer: Uint8Array): number {
  const len = zipBuffer.byteLength;
  if (len < 22) return -1;

  const minOffset = Math.max(0, len - 65557);
  for (let i = len - 22; i >= minOffset; i--) {
    if (
      zipBuffer[i] === 0x50 &&
      zipBuffer[i + 1] === 0x4b &&
      zipBuffer[i + 2] === 0x05 &&
      zipBuffer[i + 3] === 0x06
    ) {
      return i;
    }
  }
  return -1;
}

/**
 * Memvalidasi arsip ZIP Shapefile tanpa mengekstrak ke disk.
 * Menjamin:
 * 1. Magic bytes valid (PK\x03\x04).
 * 2. EOCD terbaca dan Central Directory utuh.
 * 3. Bebas Zip-Slip (tidak ada path traversal / separator absolut).
 * 4. Bebas Zip-Bomb (rasio kompresi <= 100x dan total uncompressed <= 250 MB).
 * 5. Jumlah file <= 30.
 * 6. Mengandung 4 ekstensi wajib Shapefile (.shp, .shx, .dbf, .prj) dengan nama basis identik.
 */
export function validateShapefileZipArchive(
  zipBuffer: Uint8Array
): ZipValidationResult {
  if (!inspectMagicBytes(zipBuffer, 'shapefile_zip')) {
    return {
      valid: false,
      code: 'INVALID_MAGIC_BYTES',
      message: 'File bukan merupakan arsip ZIP yang valid (magic bytes mismatch).',
    };
  }

  const eocdOffset = findEOCDOffset(zipBuffer);
  if (eocdOffset === -1) {
    return {
      valid: false,
      code: 'CORRUPT_ZIP_EOCD',
      message: 'Struktur ZIP korup: End of Central Directory (EOCD) tidak ditemukan.',
    };
  }

  const view = new DataView(
    zipBuffer.buffer,
    zipBuffer.byteOffset,
    zipBuffer.byteLength
  );

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const cdSizeBytes = view.getUint32(eocdOffset + 12, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);

  if (totalEntries > ZIP_SECURITY_LIMITS.maxEntries) {
    return {
      valid: false,
      code: 'TOO_MANY_FILES',
      message: `Jumlah file (${totalEntries}) melebihi batas aman (${ZIP_SECURITY_LIMITS.maxEntries}).`,
    };
  }

  if (cdOffset + cdSizeBytes > eocdOffset || cdOffset > zipBuffer.byteLength) {
    return {
      valid: false,
      code: 'CORRUPT_ZIP_EOCD',
      message: 'Offset Central Directory korup atau di luar batas file.',
    };
  }

  let currentOffset = cdOffset;
  let totalUncompressedBytes = 0;
  let totalCompressedBytes = 0;
  const entries: Array<{ fileName: string; uncompressedSize: number }> = [];

  for (let i = 0; i < totalEntries; i++) {
    if (currentOffset + 46 > zipBuffer.byteLength) {
      return {
        valid: false,
        code: 'CORRUPT_ZIP_EOCD',
        message: 'Central Directory terpotong sebelum seluruh entri terbaca.',
      };
    }

    const sig = view.getUint32(currentOffset, true);
    if (sig !== 0x02014b50) {
      return {
        valid: false,
        code: 'CORRUPT_ZIP_EOCD',
        message: `Signature Central Directory pada entri ${i} tidak valid.`,
      };
    }

    const compressedSize = view.getUint32(currentOffset + 20, true);
    const uncompressedSize = view.getUint32(currentOffset + 24, true);
    const fileNameLength = view.getUint16(currentOffset + 28, true);
    const extraFieldLength = view.getUint16(currentOffset + 30, true);
    const fileCommentLength = view.getUint16(currentOffset + 32, true);

    const fileNameBytes = zipBuffer.subarray(
      currentOffset + 46,
      currentOffset + 46 + fileNameLength
    );
    const fileName = decoder.decode(fileNameBytes);

    if (!isSafeZipEntryPath(fileName)) {
      return {
        valid: false,
        code: 'ZIP_SLIP_DETECTED',
        message: `Deteksi Zip-Slip pada entri file: "${fileName}". Path traversal dilarang.`,
      };
    }

    totalUncompressedBytes += uncompressedSize;
    totalCompressedBytes += compressedSize;

    if (totalUncompressedBytes > ZIP_SECURITY_LIMITS.maxUncompressedBytes) {
      return {
        valid: false,
        code: 'UNCOMPRESSED_LIMIT_EXCEEDED',
        message: `Total ukuran dekompresi (${Math.round(totalUncompressedBytes / 1024 / 1024)} MB) melebihi batas 250 MB.`,
      };
    }

    entries.push({ fileName, uncompressedSize });

    currentOffset +=
      46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  const effectiveCompressed = Math.max(totalCompressedBytes, 1024);
  const ratio = totalUncompressedBytes / effectiveCompressed;
  if (ratio > ZIP_SECURITY_LIMITS.maxCompressionRatio) {
    return {
      valid: false,
      code: 'ZIP_BOMB_DETECTED',
      message: `Deteksi Zip-Bomb: rasio kompresi ${Math.round(ratio)}:1 melebihi batas aman 100:1.`,
    };
  }

  // Validasi komponen Shapefile (.shp, .shx, .dbf, .prj)
  const nonDirFiles = entries
    .map((e) => e.fileName.replace(/\\/g, '/'))
    .filter((f) => !f.endsWith('/'));

  const baseNames = new Map<string, Set<string>>();
  for (const f of nonDirFiles) {
    const lastSlash = f.lastIndexOf('/');
    const leaf = lastSlash >= 0 ? f.slice(lastSlash + 1) : f;
    const lastDot = leaf.lastIndexOf('.');
    if (lastDot <= 0) continue;

    const base = leaf.slice(0, lastDot);
    const ext = leaf.slice(lastDot).toLowerCase();

    let extSet = baseNames.get(base);
    if (!extSet) {
      extSet = new Set<string>();
      baseNames.set(base, extSet);
    }
    extSet.add(ext);
  }

  let validBaseName: string | null = null;
  for (const [base, exts] of baseNames.entries()) {
    const hasAllRequired = ZIP_SECURITY_LIMITS.requiredShapefileExtensions.every(
      (req) => exts.has(req)
    );
    if (hasAllRequired) {
      validBaseName = base;
      break;
    }
  }

  if (!validBaseName) {
    return {
      valid: false,
      code: 'MISSING_SHAPEFILE_COMPONENTS',
      message:
        'Arsip ZIP Shapefile wajib memuat 4 file dengan nama basis sama: .shp, .shx, .dbf, dan .prj.',
      entriesCount: totalEntries,
      totalUncompressedBytes,
    };
  }

  return {
    valid: true,
    entriesCount: totalEntries,
    totalUncompressedBytes,
    shapefileBaseName: validBaseName,
  };
}

