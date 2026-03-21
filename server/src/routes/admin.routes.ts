import { Router } from 'express';
import {
  getStats, listAllExams, createExam, updateExam, deleteExam,
  getQuestions, createQuestion, updateQuestion, deleteQuestion,
  listUsers, updateUserRole,
} from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/stats', getStats);
router.get('/exams', listAllExams);
router.post('/exams', createExam);
router.put('/exams/:id', updateExam);
router.delete('/exams/:id', deleteExam);
router.get('/questions/:examId', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/users', listUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
