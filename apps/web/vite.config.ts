import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// In-memory mock reports store for development mode
const mockReports = [
  {
    id: 'rep-001',
    user_id: 'a0000000-0000-0000-0000-000000000003',
    category: 'Penurunan Debit Air',
    description: 'Debit mata air Tuk Gedang Kidul menyusut drastis hingga 2 L/detik, warga mulai antre tandon sejak pagi.',
    validation_status: 'pending',
    accuracy_m: 8.5,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'rep-002',
    user_id: 'a0000000-0000-0000-0000-000000000003',
    category: 'Pipa Retak / Bocor',
    description: 'Pipa transmisi 2 dim ke tandon RT 03 pecah tertimpa longsor tebing kecil.',
    validation_status: 'pending',
    accuracy_m: 6.2,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rep-003',
    user_id: 'a0000000-0000-0000-0000-000000000003',
    category: 'Kekeringan Lahan Pertanian',
    description: 'Embung tani Blok Sawah Kaliduren surut total, 4 hektar bibit cabai terancam gagal panen.',
    validation_status: 'valid',
    accuracy_m: 11.0,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const readJsonBody = (req: any): Promise<any> => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve({});
      }
    });
  });
};

const sendJson = (res: any, status: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = status;
  res.end(JSON.stringify(data));
};

// Mock API fallback plugin to handle /api requests during local dev when backend is offline or sandboxed
const mockApiPlugin = (): Plugin => ({
  name: 'mock-api-fallback',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url || '';
      const method = req.method || 'GET';

      // 1. Dashboard summary
      if (url === '/api/v1/dashboard/summary') {
        return sendJson(res, 200, {
          village: {
            name: 'Desa Kemitir',
            subdistrict: 'Kecamatan Sumowono',
            regency: 'Kabupaten Semarang',
            areaHectares: 1245,
            population: 4832,
            waterSourcesCount: 28,
            publicFacilitiesCount: 12,
          },
          riskDistribution: {
            low: 35,
            medium: 40,
            high: 20,
            veryHigh: 5,
          },
          statistics: {
            totalReports: mockReports.length,
            totalParticipatoryFeatures: 8,
          },
        });
      }

      // 2. Auth Login
      if (url === '/api/v1/auth/login' && method === 'POST') {
        const body = await readJsonBody(req);
        if (body._hp_trap || body.website_hp || body.hp_check) {
          return sendJson(res, 403, {
            error: {
              code: 'BOT_TRAP_TRIGGERED',
              message: 'Pengiriman formulir otomatis (spam bot) terdeteksi dan dibatalkan.',
            },
          });
        }
        const phone = (body.phone || '').replace(/[^0-9]/g, '');
        const password = body.password || '';

        if (password !== 'KemitirTangguh2026!') {
          return sendJson(res, 401, {
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Nomor telepon atau kata sandi tidak cocok.',
            },
          });
        }

        if (phone === '081234567890') {
          return sendJson(res, 200, {
            message: 'Berhasil masuk ke sistem',
            data: {
              user: {
                id: 'a0000000-0000-0000-0000-000000000001',
                name: 'Administrator Desa Kemitir',
                role: 'admin',
                phone: '081234567890',
                rt: '01',
                rw: '01',
                dusun: 'Kemitir',
                status: 'active',
              },
              accessToken: 'dev-token-admin-kemitir',
            },
          });
        }

        if (phone === '081234567891') {
          return sendJson(res, 200, {
            message: 'Berhasil masuk ke sistem',
            data: {
              user: {
                id: 'a0000000-0000-0000-0000-000000000002',
                name: 'Bapak Kadus Kemitir Kidul',
                role: 'validator',
                phone: '081234567891',
                rt: '02',
                rw: '01',
                dusun: 'Kemitir Kidul',
                status: 'active',
              },
              accessToken: 'dev-token-validator-kemitir',
            },
          });
        }

        // Generic citizen login
        return sendJson(res, 200, {
          message: 'Berhasil masuk ke sistem',
          data: {
            user: {
              id: 'a0000000-0000-0000-0000-000000000003',
              name: 'Warga Kemitir RT 01',
              role: 'citizen',
              phone: phone || '081234567892',
              rt: '01',
              rw: '01',
              dusun: 'Dusun Garon',
              status: 'active',
            },
            accessToken: 'dev-token-citizen-kemitir',
          },
        });
      }

      // 3. Auth Register
      if (url === '/api/v1/auth/register' && method === 'POST') {
        const body = await readJsonBody(req);
        if (body._hp_trap || body.website_hp || body.hp_check) {
          return sendJson(res, 403, {
            error: {
              code: 'BOT_TRAP_TRIGGERED',
              message: 'Pengiriman formulir otomatis (spam bot) terdeteksi dan dibatalkan.',
            },
          });
        }
        const role = body.inviteCode?.toUpperCase().includes('VAL') ? 'validator' : 'citizen';
        const newUser = {
          id: `u-${Date.now()}`,
          name: body.name || 'Warga Baru',
          phone: body.phone || '081234567890',
          role,
          rt: body.rt || '01',
          rw: body.rw || '01',
          dusun: body.dusun || 'Dusun Kemitir Kidul',
          status: 'active',
        };
        return sendJson(res, 201, {
          message: 'Pendaftaran berhasil',
          data: {
            user: newUser,
            accessToken: `dev-token-${role}-${Date.now()}`,
          },
        });
      }

      // 4. Current user /api/v1/me
      if (url === '/api/v1/me' && method === 'GET') {
        const authHeader = req.headers['authorization'] || '';
        if (authHeader.includes('admin')) {
          return sendJson(res, 200, {
            data: {
              id: 'a0000000-0000-0000-0000-000000000001',
              name: 'Administrator Desa Kemitir',
              role: 'admin',
              phone: '081234567890',
              rt: '01',
              rw: '01',
              dusun: 'Kemitir',
              status: 'active',
            },
          });
        } else if (authHeader.includes('validator')) {
          return sendJson(res, 200, {
            data: {
              id: 'a0000000-0000-0000-0000-000000000002',
              name: 'Bapak Kadus Kemitir Kidul',
              role: 'validator',
              phone: '081234567891',
              rt: '02',
              rw: '01',
              dusun: 'Kemitir Kidul',
              status: 'active',
            },
          });
        } else if (authHeader.length > 5) {
          return sendJson(res, 200, {
            data: {
              id: 'a0000000-0000-0000-0000-000000000003',
              name: 'Warga Kemitir RT 01',
              role: 'citizen',
              phone: '081234567892',
              rt: '01',
              rw: '01',
              dusun: 'Dusun Garon',
              status: 'active',
            },
          });
        } else {
          return sendJson(res, 401, {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Sesi masuk tidak valid atau telah berakhir.',
            },
          });
        }
      }

      // 5. Reports validation: PATCH /api/v1/reports/:id/validate
      if (method === 'PATCH' && url.startsWith('/api/v1/reports/') && url.endsWith('/validate')) {
        const body = await readJsonBody(req);
        const reportId = url.split('/')[4];
        const target = mockReports.find((r) => r.id === reportId);
        if (target) {
          target.validation_status = body.status === 'valid' ? 'valid' : 'rejected';
        }
        return sendJson(res, 200, {
          message: 'Status validasi laporan berhasil diperbarui',
          data: {
            id: reportId,
            validation_status: body.status || 'valid',
          },
        });
      }

      // 6. Reports listing: GET /api/v1/reports?status=pending or /api/v1/reports/mine
      if (method === 'GET' && url.startsWith('/api/v1/reports')) {
        if (url.includes('mine')) {
          return sendJson(res, 200, {
            data: mockReports.filter((r) => r.user_id === 'a0000000-0000-0000-0000-000000000003'),
          });
        }
        if (url.includes('status=pending')) {
          return sendJson(res, 200, {
            data: mockReports.filter((r) => r.validation_status === 'pending'),
          });
        }
        return sendJson(res, 200, {
          data: mockReports,
        });
      }

      // 7. Reports submission: POST /api/v1/reports
      if (method === 'POST' && url === '/api/v1/reports') {
        const body = await readJsonBody(req);
        if (body._hp_trap || body.website_hp || body.hp_check) {
          return sendJson(res, 403, {
            error: {
              code: 'BOT_TRAP_TRIGGERED',
              message: 'Pengiriman formulir otomatis (spam bot) terdeteksi dan dibatalkan.',
            },
          });
        }
        const newRep = {
          id: `rep-${Date.now()}`,
          user_id: 'a0000000-0000-0000-0000-000000000003',
          category: body.category || 'Penurunan Debit Air',
          description: body.description || '',
          validation_status: 'pending',
          accuracy_m: body.accuracy_m || 10,
          created_at: new Date().toISOString(),
        };
        mockReports.unshift(newRep);
        return sendJson(res, 201, {
          message: 'Laporan berhasil dicatat',
          data: newRep,
        });
      }

      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if (res && 'writeHead' in res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  error: {
                    code: 'BACKEND_UNAVAILABLE',
                    message: 'Koneksi ke backend API (Fastify port 4000) gagal.',
                  },
                })
              );
            }
          });
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Code-split map library chunk as required by Section 8
          'maplibre-chunk': ['maplibre-gl'],
          'vendor-chunk': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand'],
        },
      },
    },
  },
});
