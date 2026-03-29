import { Request, Response } from 'express';
import { prisma, withRetry } from '../utils/prisma';

export async function getStats(_req: Request, res: Response): Promise<void> {
  try {
    const [totalUsers, totalExams, totalAttempts, recentAttempts] = await withRetry(() => Promise.all([
      prisma.user.count(),
      prisma.exam.count(),
      prisma.examAttempt.count(),
      prisma.examAttempt.findMany({
        take: 10,
        orderBy: { startedAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          exam: { select: { title: true, level: true } },
        },
      }),
    ]));
    res.json({ totalUsers, totalExams, totalAttempts, recentAttempts });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listAllExams(_req: Request, res: Response): Promise<void> {
  try {
    const exams = await prisma.exam.findMany({
      include: { _count: { select: { questions: true, attempts: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ exams });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createExam(req: Request, res: Response): Promise<void> {
  try {
    const { title, titleEn, description, level, category, timeLimit, passingScore, isPublished } = req.body;
    const exam = await prisma.exam.create({
      data: { title, titleEn, description, level, category, timeLimit: Number(timeLimit), passingScore: Number(passingScore), isPublished: isPublished ?? false },
    });
    res.status(201).json({ exam });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateExam(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body;
    const exam = await prisma.exam.update({ where: { id }, data });
    res.json({ exam });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteExam(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.exam.delete({ where: { id } });
    res.json({ message: 'Exam deleted' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getQuestions(req: Request, res: Response): Promise<void> {
  try {
    const { examId } = req.params;
    const questions = await prisma.question.findMany({
      where: { examId },
      include: { options: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    res.json({ questions });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createQuestion(req: Request, res: Response): Promise<void> {
  try {
    const { examId, type, skill, content, passage, audioUrl, points, order, explanation, options } = req.body;
    const question = await prisma.question.create({
      data: {
        examId, type, skill, content,
        passage: passage || null,
        audioUrl: audioUrl || null,
        points: Number(points) || 1,
        order: Number(order) || 0,
        explanation: explanation || null,
        options: {
          create: (options || []).map((o: { content: string; isCorrect: boolean; order: number }, i: number) => ({
            content: o.content,
            isCorrect: o.isCorrect,
            order: o.order ?? i,
          })),
        },
      },
      include: { options: true },
    });
    res.status(201).json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateQuestion(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { options, ...data } = req.body;
    const question = await prisma.question.update({
      where: { id },
      data,
      include: { options: true },
    });
    res.json({ question });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteQuestion(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.question.delete({ where: { id } });
    res.json({ message: 'Question deleted' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { attempts: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}
