// src/controllers/articles.controller.ts
import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import * as articlesService from '../services/articles.service';

const articleSchema = z.object({
  title: z.string().min(1).max(255),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

// Public: dashboard listing — only published articles unless caller is admin
export async function listArticles(req: AuthRequest, res: Response) {
  const articles = await articlesService.getAllArticles(!!req.isAdmin);
  res.status(200).json(articles);
}

// Public: single article page
export async function getArticle(req: AuthRequest, res: Response) {
  const article = await articlesService.getArticleBySlug(req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  if (!article.published && !req.isAdmin) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.status(200).json(article);
}

// Protected: editor create
export async function createArticle(req: AuthRequest, res: Response) {
  const parsed = articleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const article = await articlesService.createArticle(parsed.data);
  res.status(201).json(article);
}

// Protected: editor update
export async function updateArticle(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const parsed = articleSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const updated = await articlesService.updateArticle(id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Article not found' });
  res.status(200).json(updated);
}

// Protected: delete
export async function deleteArticle(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const deleted = await articlesService.deleteArticle(id);
  if (!deleted) return res.status(404).json({ error: 'Article not found' });
  res.status(200).json({ message: 'Article deleted' });
}