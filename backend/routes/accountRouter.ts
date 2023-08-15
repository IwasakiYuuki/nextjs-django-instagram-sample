import express  from 'express';
import {
  authenticate,
  account,
  login,
  verify,
  refresh,
  register
} from '../controllers/accountController';

const router = express.Router();

router.get('/account', authenticate, account)
router.post('/auth/login', login)
router.post('/auth/verify', verify)
router.post('/auth/refresh', refresh)
router.post('/auth/register', register)

export default router;
