import express from 'express';
import {registerUser, loginUser} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: "You are authenticated",
    user: req.user });
});



export default router;