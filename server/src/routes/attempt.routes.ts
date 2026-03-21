import { Router } from 'express';
import { startAttempt, submitAttempt, getAttempt, myAttempts } from '../controllers/attempt.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', startAttempt);
router.get('/user/me', myAttempts);
router.get('/:id', getAttempt);
router.patch('/:id/submit', submitAttempt);

export default router;
