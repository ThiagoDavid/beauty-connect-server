import { fastify } from "fastify";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

const database = new DatabasePostgres();

// Rota de criação de Users

// Rotas para Users
server.post('/users', async (request, reply) => {
  const { name, email, password, role } = request.body;
  await database.createUser({
    name,
    email,
    password,
    role,
  });
  return reply.status(201).send();
});

server.get('/users', async (request) => {
  const search = request.query.search;
  const users = await database.listUsers(request.query);
  return users;
});

server.put('/users/:id', async (request, reply) => {
  const userId = request.params.id;
  const { name, email, password, role } = request.body;
  await database.updateUser(userId, {
    name,
    email,
    password,
    role,
  });
  return reply.status(204).send();
});

server.delete('/users/:id', async (request, reply) => {
  const userId = request.params.id;
  await database.deleteUser(userId);
  return reply.status(204).send();
});

// Rotas para Salons
server.post('/salons', async (request, reply) => {
  const { name, latitude, longitude, picture, averageRating, totalReviews, description } = request.body;
  await database.createSalon({
    name,
    latitude,
    longitude,
    picture,
    averageRating,
    totalReviews,
    description,
  });
  return reply.status(201).send();
});

server.get('/salons', async (request, replay) => {
  const id = request.query.id ?? null;
  const salons = await database.listSalonsWithQueueSize(id);
  return salons;
});

server.put('/salons/:id', async (request, reply) => {
  const salonId = request.params.id;
  const { name, latitude, longitude, picture, averageRating, totalReviews, description, address } = request.body;
  await database.updateSalon(salonId, {
    name,
    latitude,
    longitude,
    picture,
    averageRating,
    totalReviews,
    description,
    address,
  });
  return reply.status(204).send();
});

server.delete('/salons/:id', async (request, reply) => {
  const salonId = request.params.id;
  await database.deleteSalon(salonId);
  return reply.status(204).send();
});

// Rotas para Services.
server.post('/services', async (request, reply) => {
  const { name, duration, price, salonId } = request.body;
  await database.createService({
    name,
    duration,
    price,
  });
  return reply.status(201).send();
});

server.post('/salon-services', async (request, reply) => {
  const { name, duration, price, salonId } = request.body;
  const serviceId = await database.createService({
    name,
    duration,
    price,
  }); 

  await database.createSalonService({
    salonId,
    serviceId,
    duration,
    price,
  });

  return reply.status(201).send();
});

server.get('/salon-services', async (request, reply) => {
  const salonId = request.query.salonId ?? null;
  const services = await database.listSalonServices(salonId);
  return services;
});

server.get('/services', async (request) => {
  const id = request.query.id ?? null;
  const services = await database.listServices(id);
  return services;
});

server.put('/services/:id', async (request, reply) => {
  const serviceId = request.params.id;
  const { name, duration } = request.body;
  await database.updateService(serviceId, {
    name,
    duration,
  });
  return reply.status(204).send();
});

server.delete('/services/:id', async (request, reply) => {
  const serviceId = request.params.id;
  await database.deleteService(serviceId);
  return reply.status(204).send();
});

// Rotas para Queue
server.post('/queue', async (request, reply) => {
  const { userId, salonId, serviceId, timestamp } = request.body;
  await database.createQueue({
    userId,
    salonId,
    serviceId,
    timestamp,
  });
  return reply.status(201).send();
});

server.get('/queue', async (request) => {
  const salonId = request.query.salonId ?? null;
  const queue = await database.listQueue(salonId);
  return queue;
});

server.get('/queue/by-salon/:salonId', async (request) => {
  const salonId = request.params.salonId;
  const queue = await database.listQueuesBySalonId(salonId);
  return queue;
});

server.put('/queue/:id', async (request, reply) => {
  const queueId = request.params.id;
  const { userId, salonId, serviceId, timestamp } = request.body;
  await database.updateQueue(queueId, {
    userId,
    salonId,
    serviceId,
    timestamp,
  });
  return reply.status(204).send();
});

server.delete('/queue/:salonId/:userId', async (request, reply) => {
  const salonId = request.params.salonId;
  const userId = request.params.userId;
  await database.removeUserFromSalonQueue(salonId, userId);
  return reply.status(204).send();
});

// Rotas para Reviews
server.post('/reviews', async (request, reply) => {
  const { salonId, userId, rating, comment } = request.body;
  await database.createReview({
    salonId,
    userId,
    rating,
    comment,
  });
  return reply.status(201).send();
});

server.get('/reviews', async (request) => {
  const salonId = request.query.salonId ?? null;
  const reviews = await database.listReviews(salonId);
  return reviews;
});

server.put('/reviews/:id', async (request, reply) => {
  const reviewId = request.params.id;
  const { salonId, userId, rating, comment } = request.body;
  await database.updateReview(reviewId, {
    salonId,
    userId,
    rating,
    comment,
  });
  return reply.status(204).send();
});

server.delete('/reviews/:id', async (request, reply) => {
  const reviewId = request.params.id;
  await database.deleteReview(reviewId);
  return reply.status(204).send();
});

// Rotas para OngoingServices
server.post('/ongoing-services', async (request, reply) => {
  const { salonId, userId, serviceId, expectedEndTime } = request.body;
  await database.createOngoingService({
    salonId,
    userId,
    serviceId,
    expectedEndTime,
  });
  return reply.status(201).send();
});

server.get('/ongoing-services', async (request) => {
  const salonId = request.query.salonId ?? null;
  const ongoingServices = await database.listOngoingServicesWithDetails(salonId);
  return ongoingServices;
});

server.put('/ongoing-services/:id', async (request, reply) => {
  const ongoingServiceId = request.params.id;
  const { salonId, userId, serviceId, expectedEndTime } = request.body;
  await database.updateOngoingService(ongoingServiceId, {
    salonId,
    userId,
    serviceId,
    expectedEndTime,
  });
  return reply.status(204).send();
});

server.delete('/ongoing-services/:salonId/:userId', async (request, reply) => {
  const salonId = request.params.salonId;
  const userId = request.params.userId;
  await database.finishOngoingService(salonId, userId);
  return reply.status(204).send();
});


server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
});