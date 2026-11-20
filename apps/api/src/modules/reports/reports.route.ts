import { FastifyInstance } from 'fastify';
import { db } from '../../plugins/db';
import { CreateReportSchema } from '@kemitir/shared';
import crypto from 'crypto';
import { verifyTurnstileToken } from '../security/turnstile.service';

interface ReportDbRecord {
  id: string;
  user_id: string | null;
  category: string;
  description: string;
  geom: any;
  accuracy_m: number;
  photo_ids: string[];
  validation_status: 'pending' | 'valid' | 'rejected';
  created_at: string;
}

// In-memory fallback store for development/testing when DB is mock
export const inMemoryReports: ReportDbRecord[] = [
  {
    id: 'r0000000-0000-0000-0000-000000000001',
    user_id: 'a0000000-0000-0000-0000-000000000003', // Citizen A
    category: 'Kekeringan Lahan Pertanian',
    description: 'Sawah blok B RT 01 mengalami kekeringan dan tanah retak 2 minggu.',
    geom: { type: 'Point', coordinates: [110.3155, -7.2285] },
    accuracy_m: 8.5,
    photo_ids: [],
    validation_status: 'valid',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000002',
    user_id: 'a0000000-0000-0000-0000-000000000003', // Citizen A
    category: 'Mata Air Mengering / Debit Menurun',
    description: 'Pipa air swadaya RT 01 tersumbat endapan lumpur.',
    geom: { type: 'Point', coordinates: [110.317, -7.229] },
    accuracy_m: 12.0,
    photo_ids: [],
    validation_status: 'pending',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000004',
    user_id: 'c0000000-0000-0000-0000-000000000002', // Citizen B
    category: 'Kebutuhan Bantuan Tangki Air',
    description: 'RT 04 kehabisan air bersih untuk kebutuhan masak minum.',
    geom: { type: 'Point', coordinates: [110.32, -7.232] },
    accuracy_m: 10.0,
    photo_ids: [],
    validation_status: 'pending',
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
];

export async function reportsRoutes(fastify: FastifyInstance) {
  // 1. List reports with privacy and authorization filtering (AUD-01)
  fastify.get<{ Querystring: { status?: string; category?: string } }>(
    '/api/v1/reports',
    { preHandler: [fastify.optionalAuthenticate] },
    async (request, reply) => {
      const user = request.user;
      const isValidatorOrAdmin = user && (user.role === 'validator' || user.role === 'admin');
      const callerId = user?.id;
      const requestedStatus = request.query.status;
      const requestedCategory = request.query.category;

      try {
        let query = `
          SELECT 
            r.id,
            r.category,
            r.description,
            r.accuracy_m,
            r.photo_ids,
            r.validation_status,
            r.created_at,
            ST_AsGeoJSON(r.geom)::json AS geometry
            ${isValidatorOrAdmin ? ', r.user_id' : ''}
          FROM reports r
          WHERE r.deleted_at IS NULL
        `;
        const params: any[] = [];

        if (isValidatorOrAdmin) {
          // Validators & Admins can filter by any status or see all
          if (requestedStatus) {
            params.push(requestedStatus);
            query += ` AND r.validation_status = $${params.length}`;
          }
        } else if (callerId) {
          // Authenticated citizen: see all 'valid' reports + their own pending/rejected reports
          params.push(callerId);
          query += ` AND (r.validation_status = 'valid' OR r.user_id = $${params.length})`;
        } else {
          // Anonymous public caller: ONLY see 'valid' reports
          query += ` AND r.validation_status = 'valid'`;
        }

        if (requestedCategory) {
          params.push(requestedCategory);
          query += ` AND r.category = $${params.length}`;
        }

        query += ` ORDER BY r.created_at DESC LIMIT 50`;

        const res = await db.query(query, params);
        return reply.send({ data: res.rows });
      } catch (err) {
        // In-memory fallback
        let results = [...inMemoryReports];

        if (isValidatorOrAdmin) {
          if (requestedStatus) {
            results = results.filter((r) => r.validation_status === requestedStatus);
          }
        } else if (callerId) {
          results = results.filter((r) => r.validation_status === 'valid' || r.user_id === callerId);
        } else {
          results = results.filter((r) => r.validation_status === 'valid');
        }

        if (requestedCategory) {
          results = results.filter((r) => r.category === requestedCategory);
        }

        // Strip user_id from public outputs
        const sanitized = results.map((r) => {
          const { user_id, ...rest } = r;
          return isValidatorOrAdmin ? r : rest;
        });

        return reply.send({ data: sanitized });
      }
    }
  );

  // 2. Citizen's own reports status list (/api/v1/reports/mine)
  fastify.get(
    '/api/v1/reports/mine',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const callerId = request.user.id;

      try {
        const query = `
          SELECT 
            r.id,
            r.category,
            r.description,
            r.accuracy_m,
            r.photo_ids,
            r.validation_status,
            r.created_at,
            ST_AsGeoJSON(r.geom)::json AS geometry
          FROM reports r
          WHERE r.user_id = $1 AND r.deleted_at IS NULL
          ORDER BY r.created_at DESC
        `;
        const res = await db.query(query, [callerId]);
        return reply.send({ data: res.rows });
      } catch {
        const myReports = inMemoryReports.filter((r) => r.user_id === callerId);
        return reply.send({ data: myReports });
      }
    }
  );

  // 3. Single report detail with strict IDOR protection (/api/v1/reports/:id)
  fastify.get<{ Params: { id: string } }>(
    '/api/v1/reports/:id',
    { preHandler: [fastify.optionalAuthenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const user = request.user;
      const isValidatorOrAdmin = user && (user.role === 'validator' || user.role === 'admin');
      const callerId = user?.id;

      let report: ReportDbRecord | null = null;

      try {
        const res = await db.query(
          `SELECT 
            r.id, r.user_id, r.category, r.description, r.accuracy_m, r.photo_ids,
            r.validation_status, r.created_at, ST_AsGeoJSON(r.geom)::json AS geometry
           FROM reports r
           WHERE r.id = $1 AND r.deleted_at IS NULL`,
          [id]
        );
        report = res.rows[0] || null;
      } catch {
        report = inMemoryReports.find((r) => r.id === id) || null;
      }

      // Return 404 (not 403) to avoid leaking existence of pending reports
      if (!report) {
        return reply.status(404).send({
          error: {
            code: 'NOT_FOUND',
            message: 'Laporan tidak ditemukan',
            requestId: request.id,
          },
        });
      }

      // If report is valid, anyone can see it
      if (report.validation_status === 'valid') {
        const { user_id, ...publicReport } = report;
        return reply.send({ data: isValidatorOrAdmin ? report : publicReport });
      }

      // If report is pending or rejected: only owner or validator/admin can see it
      const isOwner = callerId && report.user_id === callerId;
      if (isOwner || isValidatorOrAdmin) {
        return reply.send({ data: report });
      }

      // Hide existence from unauthorized callers
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Laporan tidak ditemukan',
          requestId: request.id,
        },
      });
    }
  );

  // 4. Create drought report (Protected against spam & automated bots)
  fastify.post(
    '/api/v1/reports',
    {
      preHandler: [fastify.optionalAuthenticate],
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '10 minutes',
        },
      },
    },
    async (request, reply) => {
      const parsed = CreateReportSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validasi form laporan kekeringan gagal',
            details: parsed.error.errors.map((e) => ({
              field: e.path.join('.'),
              issue: e.message,
            })),
            requestId: request.id,
          },
        });
      }

      // Cloudflare Turnstile Human Verification
      const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, request.ip);
      if (!turnstile.success) {
        return reply.status(403).send({
          error: {
            code: 'BOT_VERIFICATION_FAILED',
            message: turnstile.error || 'Verifikasi bot Cloudflare gagal. Silakan coba kembali.',
            requestId: request.id,
          },
        });
      }

      const { category, description, geometry, accuracyMeters, photoIds } = parsed.data;
      const [lng, lat] = geometry.coordinates;
      const userId = request.user?.id || null;
      const reportId = crypto.randomUUID();

      try {
        const res = await db.query(
          `
          INSERT INTO reports (
            id,
            user_id,
            category,
            description,
            geom,
            accuracy_m,
            photo_ids,
            validation_status
          ) VALUES (
            $1, $2, $3, $4,
            ST_SetSRID(ST_MakePoint($5, $6), 4326),
            $7, $8, 'pending'
          ) RETURNING id, user_id, category, description, validation_status, created_at
        `,
          [reportId, userId, category, description, lng, lat, accuracyMeters, photoIds]
        );

        return reply.status(201).send({
          message: 'Laporan kekeringan berhasil dikirim dan menunggu validasi perangkat desa',
          data: res.rows[0],
        });
      } catch (err: any) {
        // In-memory fallback
        const newRecord: ReportDbRecord = {
          id: reportId,
          user_id: userId,
          category,
          description,
          geom: geometry,
          accuracy_m: accuracyMeters,
          photo_ids: photoIds || [],
          validation_status: 'pending',
          created_at: new Date().toISOString(),
        };
        inMemoryReports.unshift(newRecord);

        return reply.status(201).send({
          message: 'Laporan kekeringan berhasil disimpan dan menunggu validasi perangkat desa',
          data: {
            id: newRecord.id,
            category: newRecord.category,
            description: newRecord.description,
            validation_status: newRecord.validation_status,
            created_at: newRecord.created_at,
          },
        });
      }
    }
  );

  // 5. Offline Batch Sync with Poison-Pill Isolation (bekemitir adaptation)
  fastify.post(
    '/api/v1/reports/sync',
    { preHandler: [fastify.optionalAuthenticate] },
    async (request, reply) => {
      const body = request.body as any;
      if (!body || !Array.isArray(body.items)) {
        return reply.status(400).send({
          error: {
            code: 'INVALID_SYNC_ENVELOPE',
            message: 'Body permintaan wajib berupa array { items: [...] } dengan panjang 1-100.',
          },
        });
      }

      if (body.items.length === 0 || body.items.length > 100) {
        return reply.status(400).send({
          error: {
            code: 'SYNC_BATCH_SIZE_EXCEEDED',
            message: 'Jumlah item sinkronisasi offline harus antara 1 hingga 100 item.',
          },
        });
      }

      const userId = request.user?.id || null;
      const syncedReports: any[] = [];
      const rejectedItems: Array<{ index: number; code: string; message: string }> = [];

      for (let i = 0; i < body.items.length; i++) {
        const item = body.items[i];
        const parsed = CreateReportSchema.safeParse(item);
        if (!parsed.success) {
          rejectedItems.push({
            index: i,
            code: 'VALIDATION_FAILED',
            message: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          });
          continue;
        }

        const { category, description, geometry, accuracyMeters, photoIds } = parsed.data;
        const [lng, lat] = geometry.coordinates;
        const reportId = crypto.randomUUID();

        try {
          const res = await db.query(
            `INSERT INTO reports (
              id, user_id, category, description, geom, accuracy_m, photo_ids, validation_status
            ) VALUES (
              $1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, 'pending'
            ) RETURNING id, user_id, category, description, validation_status, created_at`,
            [reportId, userId, category, description, lng, lat, accuracyMeters, photoIds]
          );
          syncedReports.push(res.rows[0]);
        } catch {
          const newRecord: ReportDbRecord = {
            id: reportId,
            user_id: userId,
            category,
            description,
            geom: geometry,
            accuracy_m: accuracyMeters,
            photo_ids: photoIds || [],
            validation_status: 'pending',
            created_at: new Date().toISOString(),
          };
          inMemoryReports.unshift(newRecord);
          syncedReports.push({
            id: newRecord.id,
            category: newRecord.category,
            description: newRecord.description,
            validation_status: newRecord.validation_status,
            created_at: newRecord.created_at,
          });
        }
      }

      return reply.status(200).send({
        success: true,
        data: {
          totalReceived: body.items.length,
          syncedCount: syncedReports.length,
          rejectedCount: rejectedItems.length,
          synced: syncedReports,
          rejected: rejectedItems,
        },
      });
    }
  );

  // 6. Validate Report (Validator / Admin only)
  fastify.patch<{
    Params: { id: string };
    Body: { status: 'valid' | 'rejected'; notes?: string };
  }>(
    '/api/v1/reports/:id/validate',
    { preHandler: [fastify.requireRole('validator', 'admin')] },
    async (request, reply) => {
      const { id } = request.params;
      const { status, notes } = request.body || {};

      if (!status || !['valid', 'rejected'].includes(status)) {
        return reply.status(400).send({
          error: {
            code: 'INVALID_STATUS',
            message: "Status validasi wajib bernilai 'valid' atau 'rejected'",
          },
        });
      }

      const validatorId = request.user?.id;

      try {
        const res = await db.query(
          `UPDATE reports
           SET validation_status = $1, verified_by = $2, verified_at = NOW(), validation_notes = $3
           WHERE id = $4 AND deleted_at IS NULL
           RETURNING id, category, description, validation_status, verified_at`,
          [status, validatorId, notes || null, id]
        );

        if (res.rowCount === 0) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: 'Laporan tidak ditemukan',
            },
          });
        }

        return reply.send({
          message: `Laporan berhasil diubah statusnya menjadi ${status}`,
          data: res.rows[0],
        });
      } catch {
        // In-memory fallback
        const report = inMemoryReports.find((r) => r.id === id);
        if (!report) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: 'Laporan tidak ditemukan',
            },
          });
        }

        report.validation_status = status;
        return reply.send({
          message: `Laporan berhasil diubah statusnya menjadi ${status}`,
          data: {
            id: report.id,
            category: report.category,
            description: report.description,
            validation_status: report.validation_status,
          },
        });
      }
    }
  );
}
