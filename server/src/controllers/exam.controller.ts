import { Request, Response } from 'express';
import { prisma, withRetry } from '../utils/prisma';

export async function listExams(_req: Request, res: Response): Promise<void> {
  try {
    const exams = await withRetry(() => prisma.exam.findMany({
      where: { isPublished: true },
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'asc' },
    }));
    res.json({ exams });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getExam(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              select: { id: true, content: true, order: true },
            },
          },
        },
        _count: { select: { questions: true } },
      },
    });
    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }
    res.json({ exam });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}
