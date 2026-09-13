// src/routes/articles.routes.ts
import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth';
import * as articlesController from '../controllers/articles.controller';

const router = Router();

router.get('/', optionalAuth, articlesController.listArticles);
router.get('/:slug', optionalAuth, articlesController.getArticle);
router.post('/', requireAuth, articlesController.createArticle);
router.put('/:id', requireAuth, articlesController.updateArticle);
router.delete('/:id', requireAuth, articlesController.deleteArticle);

export default router;