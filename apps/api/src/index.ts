import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRouter } from './trpc/router.ts';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

const server = Fastify({ logger: true });

// Parse JSON bodies
server.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  try {
    const json = body ? JSON.parse(body) : {};
    done(null, json);
  } catch (err) {
    done(err, undefined);
  }
});

server.addHook('preHandler', async (request, reply) => {
  console.log('Raw body:', request.body);
});

async function start() {
  await server.register(cors, { origin: '*' });

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
    },
  });

  try {
    await server.listen({ port: 4000 });
    console.log('Server listening on http://localhost:4000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
