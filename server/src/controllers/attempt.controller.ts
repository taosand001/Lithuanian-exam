
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export async function startAttempt(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { examId } = req.body;
    const userId = req.user!.userId;
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }
    const attempt = await prisma.examAttempt.create({
      data: { userId, examId },
      include: { exam: true },
    });
    res.status(201).json({ attempt });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function submitAttempt(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { answers, timeSpent } = req.body;
    const userId = req.user!.userId;

    const attempt = await prisma.examAttempt.findUnique({
      where: { id },
      include: { exam: true },
    });
    if (!attempt) {
      res.status(404).json({ error: 'Attempt not found' });
      return;
    }
    if (attempt.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    if (attempt.completedAt) {
      res.status(400).json({ error: 'Attempt already submitted' });
      return;
    }

    const questions = await prisma.question.findMany({
      where: { examId: attempt.examId },
      include: { options: true },
    });

    let correct = 0;
    const answerRecords = [];

    for (const q of questions) {
      const ans = answers?.find((a: { questionId: string }) => a.questionId === q.id);
      if (!ans) continue;
      let isCorrect: boolean | null = null;
      if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE' || q.type === 'MULTI_SELECT') {
        const correctOption = q.options.find(o => o.isCorrect);
        isCorrect = correctOption?.id === ans.selectedOption;
        if (isCorrect) correct++;
      } else if (q.type === 'FILL_BLANK') {
        const correctOption = q.options.find(o => o.isCorrect);
        isCorrect = correctOption?.content.toLowerCase().trim() === ans.textAnswer?.toLowerCase().trim();
        if (isCorrect) correct++;
      }
      answerRecords.push({
        attemptId: id,
        questionId: q.id,
        selectedOption: ans.selectedOption || null,
        textAnswer: ans.textAnswer || null,
        isCorrect,
      });
    }

    if (answerRecords.length > 0) {
      await prisma.attemptAnswer.createMany({ data: answerRecords });
    }

    const totalGraded = questions.filter(q =>
      ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'MULTI_SELECT', 'FILL_BLANK'].includes(q.type)
    ).length;
    const score = totalGraded > 0 ? (correct / totalGraded) * 100 : 0;
    const passed = score >= attempt.exam.passingScore;

    const updated = await prisma.examAttempt.update({
      where: { id },
      data: { score, passed, completedAt: new Date(), timeSpent: timeSpent || null },
      include: {
        exam: true,
        answers: {
          include: {
            question: {
              include: {
                options: { orderBy: { order: 'asc' } },
              },
            },
          },
        },
      },
    });

    res.json({ attempt: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAttempt(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const attempt = await prisma.examAttempt.findUnique({
      where: { id },
      include: {
        exam: true,
        answers: {
          include: {
            question: {
              include: {
                options: { orderBy: { order: 'asc' } },
              },
            },
          },
        },
      },
    });
    if (!attempt) {
      res.status(404).json({ error: 'Attempt not found' });
      return;
    }
    if (attempt.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    res.json({ attempt });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function myAttempts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      include: { exam: { select: { id: true, title: true, level: true, passingScore: true } } },
      orderBy: { startedAt: 'desc' },
    });
    res.json({ attempts });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}
