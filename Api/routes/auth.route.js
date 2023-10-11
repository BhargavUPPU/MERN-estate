import express from 'express';
import { signup ,sign_in} from '../controllers/auth.controller.js';
const router =express.Router();
router.post('/signup',signup);
router.post('/signin',sign_in);
export default router;