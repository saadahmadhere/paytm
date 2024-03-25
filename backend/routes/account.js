import express from 'express';
import { authMiddleware } from '../middleware.js';
import { Account } from '../models/accountModel.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
	const userId = req.userId;

	const account = await Account.findOne({ userId });
	res.status(200).json({ balance: account.balance });
});

router.post('/transfer', authMiddleware, async (req, res) => {
	const { to, amount } = req.body;
	// const session = await mongoose.startSession();
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Fetch the accounts within the transaction
		const account = await Account.findOne({ userId: req.userId }).session(
			session
		);
		if (!account || account.balance < amount) {
			await session.abortTransaction();
			return res.status(400).json({
				message: 'Insufficient balance',
			});
		}

		const toAccount = await Account.findOne({ userId: to }).session(session);

		if (!toAccount) {
			await session.abortTransaction();
			return res.status(400).json({
				message: 'Invalid account',
			});
		}

		// Perform the transfer
		await Account.updateOne(
			{ userId: req.userId },
			{ $inc: { balance: -amount } }
		).session(session);
		await Account.updateOne(
			{ userId: to },
			{ $inc: { balance: amount } }
		).session(session);
		await session.commitTransaction();

		res.status(200).json({
			message: 'Transfer successful',
		});
	} catch (error) {
		res.json({
			message: 'Something went wrong!',
		});
	}
});

export default router;
