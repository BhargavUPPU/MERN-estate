import express from 'express';
import { signup ,sign_in,google, sign_out} from '../controllers/auth.controller.js';
const router =express.Router();
router.post('/signup',signup);
router.post('/signin',sign_in);
router.post("/google",google); 
router.get('/sign-out',sign_out);
export default router;