import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { config } from '../config';

// Signatures of known malicious automation tools, vulnerability scanners, and aggressive bots
const MALICIOUS_BOT_SIGNATURES = [
  'sqlmap',
  'nikto',
  'masscan',
  'zgrab',
  'acunetix',
  'dirbuster',
  'gobuster',
  'nmap',
  'havij',
  'wprecon',
  'nessus',
  'openvas',
  'qualys',
  'webinspect',
  'semrushbot',
  'dotbot',
  'mj12bot',
  'ahrefsbot',
  'petalbot',
  'bytespider',
];

const botProtectionPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  if (!config.BOT_PROTECTION_ENABLED) {
    return;
  }

  // 1. Hook: Inspect User-Agent and block aggressive / malicious bots
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const userAgent = (request.headers['user-agent'] || '').toLowerCase();

    // Check malicious signatures
    for (const signature of MALICIOUS_BOT_SIGNATURES) {
      if (userAgent.includes(signature)) {
        return reply.status(403).send({
          error: {
            code: 'BOT_ACCESS_DENIED',
            message: 'Akses otomatis/alat pemindaian mencurigakan ditolak oleh sistem keamanan Desa Kemitir.',
            requestId: request.id,
          },
        });
      }
    }
  });

  // 2. Hook: Honeypot Trap Detection on incoming POST / PATCH requests
  fastify.addHook('preValidation', async (request: FastifyRequest, reply: FastifyReply) => {
    if (['POST', 'PATCH', 'PUT'].includes(request.method) && request.body && typeof request.body === 'object') {
      const body = request.body as Record<string, any>;
      // Common honeypot field names that are hidden in UI
      const honeypotKeys = ['_hp_trap', 'website_hp', 'hp_check', '_trap_confirm'];

      for (const key of honeypotKeys) {
        if (body[key] && typeof body[key] === 'string' && body[key].trim().length > 0) {
          request.log.warn(
            { ip: request.ip, path: request.url, trapField: key },
            'Bot honeypot trap triggered - automated spam rejected'
          );
          return reply.status(403).send({
            error: {
              code: 'BOT_TRAP_TRIGGERED',
              message: 'Pengiriman formulir otomatis (spam bot) terdeteksi dan dibatalkan.',
              requestId: request.id,
            },
          });
        }
      }
    }
  });

  // 3. Hook: Append anti-scraping and indexing defenses to sensitive endpoints
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith('/api/v1/auth') || request.url.startsWith('/api/v1/reports')) {
      reply.header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
    reply.header('X-Content-Type-Options', 'nosniff');
  });
};

export const registerBotProtectionPlugin = fp(botProtectionPlugin, {
  name: 'bot-protection',
});

