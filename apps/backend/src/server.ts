import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import articlesRoutes from './routes/articles.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});