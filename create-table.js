import { sql } from './db.js';

// // Excluir tabela Users se existir
// await sql`DROP TABLE IF EXISTS "Users";`.then(() => {
//   console.log('Tabela Users deletada...');
// }).catch((err) => {
//   console.error(err);
// });

// // Criar tabela Users
// await sql`
// CREATE TABLE "Users" (
//   "id" SERIAL PRIMARY KEY,
//   "name" VARCHAR(255) NOT NULL,
//   "email" VARCHAR(255) NOT NULL UNIQUE,
//   "password" VARCHAR(255) NOT NULL,
//   "role" VARCHAR(50)
// );`.then(() => {
//   console.log('Tabela Users criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// // Excluir tabela Salons se existir
// await sql`DROP TABLE IF EXISTS "Salons" CASCADE;`.then(() => {
//   console.log('Tabela Salons deletada...');
// }).catch((err) => {
//   console.error(err);
// });

// // Criar tabela Salons
// await sql`
// CREATE TABLE "Salons" (
//   "id" SERIAL PRIMARY KEY,
//   "name" VARCHAR(255) NOT NULL,
//   "latitude" FLOAT,
//   "longitude" FLOAT,
//   "picture" VARCHAR(255),
//   "averageRating" FLOAT,
//   "totalReviews" INT,
//   "description" TEXT
// );`.then(() => {
//   console.log('Tabela Salons criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// Excluir tabela Services se existir
// await sql`DROP TABLE IF EXISTS "Services" CASCADE;`.then(() => {
//   console.log('Tabela Services deletada...');
// }).catch((err) => {
//   console.error(err);
// });

// // Criar tabela Services

// // Criar tabela Services com nome único e campo de preço
// await sql`
// CREATE TABLE "Services" (
//   "id" SERIAL PRIMARY KEY,
//   "name" VARCHAR(255) NOT NULL UNIQUE,
//   "duration" INT NOT NULL,
//   "price" DECIMAL(10, 2) NOT NULL
// );`.then(() => {
//   console.log('Tabela Services criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });



// // Excluir tabela SalonServices se existir
// // await sql`DROP TABLE IF EXISTS "SalonServices" CASCADE;`.then(() => {
// //   console.log('Tabela SalonServices deletada...');
// // }).catch((err) => {
// //   console.error(err);
// // });

// // await sql`
// // CREATE TABLE "SalonServices" (
// //     "id" SERIAL PRIMARY KEY,
// //     "salonId" INT REFERENCES "Salons"("id"),
// //     "serviceId" INT REFERENCES "Services"("id"),
// //     "price" DECIMAL(10, 2) NOT NULL,
// //     "duration" INT NOT NULL,  -- Duração em minutos, por exemplo
// //     UNIQUE ("salonId", "serviceId")  -- Garante que um salão não possa ter o mesmo serviço mais de uma vez
// // );`.then(() => {
// //   console.log('Tabela SalonServices criada com sucesso');
// // }).catch((err) => {
// //   console.error(err);
// // });

// // Excluir tabela Queue se existir
// sql`DROP TABLE IF EXISTS "Queue" CASCADE;`.then(() => {
//   console.log('Tabela Queue deletada...');
// }).catch((err) => {
//   console.error(err);
// });

// // Criar tabela Queue
// sql`
// CREATE TABLE "Queue" (
//   "id" SERIAL PRIMARY KEY,
//   "userId" INT REFERENCES "Users"("id"),
//   "salonId" INT REFERENCES "Salons"("id"),
//   "serviceId" INT REFERENCES "Services"("id"),
//   "timestamp" TIMESTAMP NOT NULL
// );`.then(() => {
//   console.log('Tabela Queue criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// // Excluir tabela Reviews se existir
// await sql`DROP TABLE IF EXISTS "Reviews" CASCADE;`.then(() => {
//   console.log('Tabela Reviews deletada...');
// }).catch((err) => {
//   console.error(err);
// });

// // Criar tabela Reviews
// await sql`
// CREATE TABLE "Reviews" (
//   "id" SERIAL PRIMARY KEY,
//   "salonId" INT REFERENCES "Salons"("id"),
//   "userId" INT REFERENCES "Users"("id"),
//   "rating" INT CHECK (rating >= 1 AND rating <= 5),
//   "comment" TEXT
// );`.then(() => {
//   console.log('Tabela Reviews criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// // Excluir tabela OngoingServices se existir
// await sql`DROP TABLE IF EXISTS "OngoingServices" CASCADE;`.then(() => {
//   console.log('Tabela OngoingServices deletada...');
// }).catch((err) => {
//   console.error(err);
// });

// // Criar tabela OngoingServices
// await sql`
// CREATE TABLE "OngoingServices" (
//   "id" SERIAL PRIMARY KEY,
//   "salonId" INT REFERENCES "Salons"("id"),
//   "userId" INT REFERENCES "Users"("id"),
//   "serviceId" INT REFERENCES "Services"("id"),
//   "expectedEndTime" TIMESTAMP
// );`.then(() => {
//   console.log('Tabela OngoingServices criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// Adicionar coluna salonId à tabela Users
// await sql`
// ALTER TABLE "Users"
// ADD COLUMN "salonId" INT REFERENCES "Salons"("id");
// `.then(() => {
//   console.log('Coluna salonId adicionada à tabela Users com sucesso');
// }).catch((err) => {
//   console.error(err);
// });


// Criar tabela SalonServices
// await sql`
// CREATE TABLE "SalonServices" (
//   "salonId" INT REFERENCES "Salons"("id"),
//   "serviceId" INT REFERENCES "Services"("id"),
//   "price" DECIMAL(10, 2) NOT NULL,
//   "duration" INT NOT NULL,
//   PRIMARY KEY ("salonId", "serviceId")
// );`.then(() => {
//   console.log('Tabela SalonServices criada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// Alterar a tabela Services para que o nome do serviço seja único e adicionar um campo de preço
// await sql`
// ALTER TABLE "Services"
// ADD COLUMN "price" DECIMAL(10, 2) NOT NULL DEFAULT 50,
// ADD CONSTRAINT unique_service_name UNIQUE ("name");
// `.then(() => {
//   console.log('Tabela Services alterada com sucesso');
// }).catch((err) => {
//   console.error(err);
// });

// Alterar a tabela Services para que o campo price tenha um valor padrão de 50

// Alterar a tabela Salons para adicionar um campo de endereço
// await sql`
// ALTER TABLE "Salons"
// ADD COLUMN "address" VARCHAR(255);
// `.then(() => {
//   console.log('Coluna address adicionada à tabela Salons com sucesso');
// }).catch((err) => {
//   console.error(err);
// });