import { buildApp } from './app';
import { config } from './config';

async function startServer() {
  const app = buildApp();

  try {
    const address = await app.listen({
      port: config.PORT,
      host: config.HOST,
    });
    console.log(`[API] Kemitir Tangguh Bencana API listening at ${address}`);
    console.log(`[API] Health check available at ${address}/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
