// scripts/test-db.ts
// Run with: npx tsx scripts/test-db.ts
import dotenv from 'dotenv';
import postgres from 'postgres';
import { inspect } from 'util';

dotenv.config();

async function main() {
  console.log('Connecting to:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful:', result);

    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables in public schema:', tables);

    if (tables.some((t) => t.table_name === 'articles')) {
      const count = await sql`SELECT COUNT(*) FROM articles`;
      console.log('✅ Articles table row count:', count);

      const columns = await sql`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_name = 'articles'
        ORDER BY ordinal_position
      `;
      console.log('📋 Actual columns in "articles":', columns);

      console.log('\n--- Testing exact failing query (raw postgres-js) ---');
      try {
        const raw = await sql`
          select id, title, slug, excerpt, content, cover_image_url, published, created_at, updated_at
          from articles where articles.slug = ${'new-title'}
        `;
        console.log('✅ Raw query succeeded:', raw);
      } catch (rawErr) {
        console.error('❌ Raw query failed. Full error with util.inspect:');
        console.error(inspect(rawErr, { depth: null, colors: true }));
      }

      console.log('\n--- Testing same query via Drizzle ---');
      try {
        const { db } = await import('../src/db');
        const { articles } = await import('../src/db/schema');
        const { eq } = await import('drizzle-orm');
        const drizzleResult = await db.select().from(articles).where(eq(articles.slug, 'new-title'));
        console.log('✅ Drizzle query succeeded:', drizzleResult);
      } catch (drizzleErr) {
        console.error('❌ Drizzle query failed. Full error with util.inspect:');
        console.error(inspect(drizzleErr, { depth: null, colors: true }));
      }
    } else {
      console.log('❌ "articles" table does not exist — migration has not run');
    }
  } catch (err) {
    console.error('❌ Raw error:', err);
  } finally {
    await sql.end();
  }
}

main();