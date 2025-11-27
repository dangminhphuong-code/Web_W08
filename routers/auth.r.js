import express from 'express';
import { getLogin, getRegister, postLogin, getLogout, postRegister } from '../controllers/auth.c.js';

const router = express.Router();

router.get('/login', getLogin);
router.get('/register', getRegister);
router.get('/logout', getLogout);
router.post('/login', postLogin);
router.post('/register', postRegister);

export default router;