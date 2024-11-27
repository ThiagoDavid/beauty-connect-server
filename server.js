// import { DatabaseMemory } from "./database-memory.js";
import { fastify } from "fastify";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

const database = new DatabasePostgres();

// Rota de criação de vídeos

server.post('/videos', async (request, reply) => {
  const {title, description, duration } = request.body;
  await database.create({
    title,
    description,
    duration,
  });

  return reply.status(201).send();
});

// GET
server.get('/videos', async (request) => {
  const search = request.query.search;
  const videos = await database.list(search);
  console.log(videos);
  return videos;
});

server.put('/videos/:id', async (request, reply) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;
  await database.update(videoId, {
    title,
    description,
    duration,
  });
  return reply.status(204).send();
});

server.delete('/videos/:id', async (request, reply) => {
  const videoId = request.params.id;
  await database.delete(videoId);
  return reply.status(204).send();
})

server.listen({
  port: 3333,
});