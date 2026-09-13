import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
