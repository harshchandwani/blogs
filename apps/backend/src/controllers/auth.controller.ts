// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const { password } = parsed.data;
  const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);

  if (!isValid) {
    // deliberately vague — don't leak whether the password format was close
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.status(200).json({ token });
}