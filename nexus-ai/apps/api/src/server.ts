import Fastify from 'fastify';
import cors from '@fastify/cors';
import { incidentRoutes } from './routes/incidents.js';
import { platformRoutes } from './routes/platform.js';

const app = Fastify({ logger: { level: 'info' }, disableRequestLogging: true });
await app.register(cors, { origin: true });
await app.register(platformRoutes);
await app.register(incidentRoutes);

const port = Number(process.env.PORT ?? 4000);
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    const mode = process.env.ANTHROPIC_API_KEY
      ? 'Claude (live model)'
      : 'scripted (no API key set)';
    app.log.info(`Nexus API on http://localhost:${port}  copilot mode: ${mode}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
