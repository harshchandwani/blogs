// src/db/index.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Aiven requires SSL; postgres-js needs this explicitly in some environments
const client = postgres(connectionString, { ssl: 'require' });

export const db = drizzle(client, { schema });