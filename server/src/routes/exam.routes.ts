import { Router } from 'express';
import { listExams, getExam } from '../controllers/exam.controller';

const router = Router();

router.get('/', listExams);
router.get('/:id', getExam);

export default router;
