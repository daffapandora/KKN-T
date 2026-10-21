#!/bin/bash
# ==============================================================================
# Backup Script: PostgreSQL + PostGIS to Cloudflare R2
# Retention: 7 daily + 4 weekly
# ==============================================================================

set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_DIR:-/tmp/kemitir_backups}"
DB_NAME="${POSTGRES_DB:-kemitir_gis}"
DB_USER="${POSTGRES_USER:-kemitir_user}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
R2_BUCKET="${R2_BUCKET_NAME:-kemitir-backups}"

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump"

echo "[$(date -Iseconds)] Starting database backup for ${DB_NAME}..."

# Export PostgreSQL dump in custom binary format (-Fc)
PGPASSWORD="${POSTGRES_PASSWORD:-}" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -Fc \
  -v \
  -f "$BACKUP_FILE" \
  "$DB_NAME"

# Compute SHA256 Checksum
sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"

echo "[$(date -Iseconds)] Backup created successfully: ${BACKUP_FILE}"
echo "[$(date -Iseconds)] Size: $(du -h "$BACKUP_FILE" | cut -f1)"

# If AWS CLI or RClone is configured for Cloudflare R2:
if command -v aws &> /dev/null && [ -n "${R2_BUCKET_NAME:-}" ]; then
  echo "[$(date -Iseconds)] Uploading backup to Cloudflare R2 bucket: ${R2_BUCKET}..."
  aws s3 cp "$BACKUP_FILE" "s3://${R2_BUCKET}/db_backups/$(basename "$BACKUP_FILE")" --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
  aws s3 cp "${BACKUP_FILE}.sha256" "s3://${R2_BUCKET}/db_backups/$(basename "${BACKUP_FILE}.sha256")" --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
  echo "[$(date -Iseconds)] Upload to R2 completed."
fi

# Clean up local dumps older than 7 days
find "$BACKUP_DIR" -name "*.dump" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.sha256" -mtime +7 -delete

echo "[$(date -Iseconds)] Backup routine finished."
