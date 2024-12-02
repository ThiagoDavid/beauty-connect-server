import { sql } from './db.js';

export class DatabasePostgres {
  // Métodos para a tabela Users
  async createUser(user) {
    const { name, email, password, role } = user;
    await sql`
      INSERT INTO "Users" (name, email, password, role)
      VALUES (${name}, ${email}, ${password}, ${role})
    `;
  }

  async listUsers(search) {
    console.log(search);
    const email = search.email;
    const id = search.id;
    if (email) {
      return await sql`SELECT * FROM "Users" WHERE LOWER(email) = LOWER(${email})`;
    } else if (id) {
      return await sql`SELECT * FROM "Users" WHERE id = ${id}`;
    }
    return await sql`SELECT * FROM "Users"`;
  }

  async updateUser(id, user) {
    const { name, email, password, role } = user;
    await sql`
      UPDATE "Users"
      SET name = ${name}, email = ${email}, password = ${password}, role = ${role}
      WHERE id = ${id}
    `;
  }

  async deleteUser(id) {
    await sql`
      DELETE FROM "Users"
      WHERE id = ${id}
    `;
  }

  // Métodos para a tabela Salons
  async createSalon(salon) {
    const { name, latitude, longitude, picture, averageRating, totalReviews, description } = salon;
    await sql`
      INSERT INTO "Salons" (name, latitude, longitude, picture, "averageRating", "totalReviews", description)
      VALUES (${name}, ${latitude}, ${longitude}, ${picture}, ${averageRating}, ${totalReviews}, ${description})
    `;
  }

  async listSalons(id) {
    if (id) {
      return await sql`
      SELECT s.*, os."expectedEndTime"
      FROM "Salons" s
      LEFT JOIN "OngoingServices" os ON s.id = os."salonId"
      WHERE s.id = ${id}
      `;
    }
    return await sql`
      SELECT s.*, os."expectedEndTime"
      FROM "Salons" s
      LEFT JOIN "OngoingServices" os ON s.id = os."salonId"
    `;
  }

  async listSalonsWithQueueSize(id = null) {
    if (id) {
      return await sql`
        SELECT DISTINCT ON (s.id) s.*, os."expectedEndTime", (
          SELECT COUNT(*) FROM "Queue" q WHERE q."salonId" = s.id
        ) AS "queueSize"
        FROM "Salons" s
        LEFT JOIN "OngoingServices" os ON s.id = os."salonId"
        WHERE s.id = ${id}
        ORDER BY s.id, os."expectedEndTime"
      `;
    }
    return await sql`
      SELECT DISTINCT ON (s.id) s.*, os."expectedEndTime", (
        SELECT COUNT(*) FROM "Queue" q WHERE q."salonId" = s.id
      ) AS "queueSize"
      FROM "Salons" s
      LEFT JOIN "OngoingServices" os ON s.id = os."salonId"
      ORDER BY s.id, os."expectedEndTime"
    `;
  }

  async updateSalon(id, salon) {
    const { name, latitude, longitude, picture, averageRating, totalReviews, description, address } = salon;
    await sql`
      UPDATE "Salons"
      SET 
        name = ${name}, 
        latitude = ${latitude}, 
        longitude = ${longitude}, 
        picture = ${picture}, 
        "averageRating" = ${averageRating}, 
        "totalReviews" = ${totalReviews}, 
        description = ${description},
        address = ${address}
      WHERE id = ${id}
    `;
  }

  async deleteSalon(id) {
    await sql`
      DELETE FROM "Salons"
      WHERE id = ${id}
    `;
  }

  // Métodos para a tabela Services
  async createService(service) {
    const { name, duration, price } = service;
    try {
      const result = await sql`
        WITH existing_service AS (
          SELECT id FROM "Services" WHERE name = ${name}
        ), new_service AS (
          INSERT INTO "Services" (name, duration, price)
          SELECT ${name}, ${duration}, ${price}
          WHERE NOT EXISTS (SELECT 1 FROM existing_service)
          RETURNING id
        )
        SELECT id FROM new_service
        UNION ALL
        SELECT id FROM existing_service
      `;
      return result[0].id;
    } catch (error) {
      throw error; // Re-throw any errors
    }
  }

  async listSalonServices(salonId) {
    return await sql`
      SELECT s.name AS "salonName", 
        sv.name AS name, 
        ss.price, 
        ss.duration,
        ss."salonId" || '-' || ss."serviceId" AS id,
        ss."serviceId"
      FROM "SalonServices" ss
      JOIN "Salons" s ON ss."salonId" = s.id
      JOIN "Services" sv ON ss."serviceId" = sv.id
      WHERE s.id = ${salonId};
    `;
  }

  async createSalonService(service) {
    const { salonId, serviceId, duration, price } = service;
    await sql`
      INSERT INTO "SalonServices" ("salonId", "serviceId", duration , price)
      VALUES (${salonId}, ${serviceId}, ${duration}, ${price})
    `;
  }

  async listServices(id) {
    if (id) {
      return await sql`SELECT * FROM "Services" WHERE id = ${id}`;
    }
    return await sql`SELECT * FROM "Services"`;
  }

  async updateService(id, service) {
    const { name, duration } = service;
    await sql`
      UPDATE "Services"
      SET name = ${name}, duration = ${duration}
      WHERE id = ${id}
    `;
  }

  async deleteService(id) {
    await sql`
      DELETE FROM "Services"
      WHERE id = ${id}
    `;
  }

  // Métodos para a tabela Queue
  async createQueue(queue) {
    const { userId, salonId, serviceId, timestamp } = queue;
    await sql`
      INSERT INTO "Queue" ("userId", "salonId", "serviceId", timestamp)
      VALUES (${userId}, ${salonId}, ${serviceId}, ${timestamp})
    `;
  }

  async listQueue(salonId) {
    if (salonId) {
      return await sql`SELECT * FROM "Queue" WHERE "salonId" = ${salonId} ORDER BY timestamp`;
    }
    return await sql`SELECT * FROM "Queue" ORDER BY timestamp`;
  }

  async updateQueue(id, queue) {
    const { userId, salonId, serviceId, timestamp } = queue;
    await sql`
      UPDATE "Queue"
      SET "userId" = ${userId}, "salonId" = ${salonId}, "serviceId" = ${serviceId}, timestamp = ${timestamp}
      WHERE id = ${id}
    `;
  }
  async listQueuesBySalonId(salonId) {
    return await sql`
      SELECT q.*, s.name AS salon, u.name AS name
      FROM "Queue" q
      JOIN "Salons" s ON q."salonId" = s.id
      JOIN "Users" u ON q."userId" = u.id
      WHERE q."salonId" = ${salonId}
      ORDER BY q.timestamp
    `;
  }
  async deleteQueue(id) {
    await sql`
      DELETE FROM "Queue"
      WHERE id = ${id}
    `;
  }

  async removeUserFromSalonQueue(salonId, userId) {
    await sql`
      DELETE FROM "Queue"
      WHERE "userId" = ${userId} AND "salonId" = ${salonId}
    `;
  }

  // Métodos para a tabela Reviews
  async createReview(review) {
    const { salonId, userId, rating, comment } = review;
    await sql`
      INSERT INTO "Reviews" ("salonId", "userId", rating, comment)
      VALUES (${salonId}, ${userId}, ${rating}, ${comment})
    `;
  }

  async listReviews(salonId) {
    if (salonId) {
      return await sql`
      SELECT r.*, u.name AS user
      FROM "Reviews" r
      JOIN "Users" u ON r."userId" = u.id
      WHERE r."salonId" = ${salonId}
      `;
    }
    return await sql`
      SELECT r.*, u.name AS user
      FROM "Reviews" r
      JOIN "Users" u ON r."userId" = u.id
    `;
  }

  async updateReview(id, review) {
    const { salonId, userId, rating, comment } = review;
    await sql`
      UPDATE "Reviews"
      SET "salonId" = ${salonId}, "userId" = ${userId}, rating = ${rating}, comment = ${comment}
      WHERE id = ${id}
    `;
  }

  async deleteReview(id) {
    await sql`
      DELETE FROM "Reviews"
      WHERE id = ${id}
    `;
  }

  // Métodos para a tabela OngoingServices
  async createOngoingService(ongoingService) {
    const { salonId, userId, serviceId, expectedEndTime } = ongoingService;
    await sql`
      INSERT INTO "OngoingServices" ("salonId", "userId", "serviceId", "expectedEndTime")
      VALUES (${salonId}, ${userId}, ${serviceId}, ${expectedEndTime})
    `;
  }

  async listOngoingServices(salonId) {
    if (salonId) {
      return await sql`SELECT * FROM "OngoingServices" WHERE "salonId" = ${salonId}`;
    }
    return await sql`SELECT * FROM "OngoingServices"`;
  }

  async listOngoingServicesWithDetails(salonId) {
    if (salonId) {
      return await sql`
        SELECT DISTINCT ON (os."userId") os.*, u.name AS user, s.name AS service, sl.name AS salon
        FROM "OngoingServices" os
        JOIN "Users" u ON os."userId" = u.id
        JOIN "Services" s ON os."serviceId" = s.id
        JOIN "Salons" sl ON os."salonId" = sl.id
        WHERE os."salonId" = ${salonId}
        ORDER BY os."userId", os."expectedEndTime"
      `;
    }
    return await sql`
      SELECT DISTINCT ON (os."userId") os.*, u.name AS user, s.name AS service, sl.name AS salon
      FROM "OngoingServices" os
      JOIN "Users" u ON os."userId" = u.id
      JOIN "Services" s ON os."serviceId" = s.id
      JOIN "Salons" sl ON os."salonId" = sl.id
      ORDER BY os."userId", os."expectedEndTime"
    `;
  }
  async updateOngoingService(id, ongoingService) {
    const { salonId, userId, serviceId, expectedEndTime } = ongoingService;
    await sql`
      UPDATE "OngoingServices"
      SET "salonId" = ${salonId}, "userId" = ${userId}, "serviceId" = ${serviceId}, "expectedEndTime" = ${expectedEndTime}
      WHERE id = ${id}
    `;
  }

  async deleteOngoingService(id) {
    await sql`
      DELETE FROM "OngoingServices"
      WHERE id = ${id}
    `;
  }

  async finishOngoingService(salonId, userId) {
    await sql`
      DELETE FROM "OngoingServices"
      WHERE "salonId" = ${salonId} AND "userId" = ${userId}
    `;
  }

  //Todo
  //SalonServices
  // SELECT s.name AS salon_name, 
  //       sv.name AS service_name, 
  //       ss.price, 
  //       ss.duration
  // FROM "SalonServices" ss
  // JOIN "Salons" s ON ss.salonId = s.id
  // JOIN "Services" sv ON ss.serviceId = sv.id
  // WHERE s.id = <salon_id>;

  // INSERT INTO "SalonServices" (salonId, serviceId, price, duration)
  // VALUES (<salon_id>, <service_id>, <price>, <duration>);
}