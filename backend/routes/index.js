import express from 'express';
import {
  register,
  login
} from '../controllers/authController.js';
import { pay } from '../controllers/payController.js';
import { exchange } from '../controllers/exchangeController.js';
import { createQR, readQR } from '../controllers/qrController.js';
import { getHistoryHandler } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//  Auth routes
router.post('/register', register);
router.post('/login', login);

//  Payment routes
router.post('/pay', protect, pay);
router.post('/exchange', protect, exchange);

//  QR routes
router.post('/generate_qr', protect, createQR);
router.post('/read_qr', protect, readQR);

//  History route
router.get('/history', protect, getHistoryHandler);

export default router;