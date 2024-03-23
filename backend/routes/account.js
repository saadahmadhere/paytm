import express from 'express';
import { authMiddleware } from '../middleware';
import { Account } from '../models/accountModel';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
	const userId = req.userId;

	const account = await Account.findOne({ userId });
	res.status(200).json({ balance: account.balance });
});

export default router;
