import { sql } from './db.js';

sql`DROP TABLE IF EXISTS videos;`.then(() => {
  console.log('Tabela deletada...');
}).catch((err) => {
  console.error(err);
});

sql`
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL
);`.then(() => {
  console.log('Tabela criada com sucesso');
}).catch((err) => {
  console.error(err);
});