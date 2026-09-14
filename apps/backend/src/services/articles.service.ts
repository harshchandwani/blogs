// src/services/articles.service.ts
import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { articles, NewArticle } from '../db/schema';
import { slugify } from '../utils/slug';

export async function getAllArticles(includeUnpublished = false) {
  const rows = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return includeUnpublished ? rows : rows.filter((a) => a.published);
}

// ToDo: Change any to string later
export async function getArticleBySlug(slug: any) {
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
  return article ?? null;
}

export async function getArticleById(id: number) {
  const [article] = await db.select().from(articles).where(eq(articles.id, id));
  return article ?? null;
}

export async function createArticle(data: Pick<NewArticle, 'title' | 'excerpt' | 'content' | 'coverImageUrl' | 'published'>) {
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;

  // handle slug collisions
  while (await getArticleBySlug(slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const [created] = await db.insert(articles).values({ ...data, slug }).returning();
  return created;
}

export async function updateArticle(id: number, data: Partial<NewArticle>) {
  const [updated] = await db
    .update(articles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning();
  return updated ?? null;
}

export async function deleteArticle(id: number) {
  const [deleted] = await db.delete(articles).where(eq(articles.id, id)).returning();
  return deleted ?? null;
}