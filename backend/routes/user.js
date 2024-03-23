import express from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config.js';

import { z } from 'zod';
import { authMiddleware } from '../middleware.js';
import { User } from '../models/userModel.js';
import { Account } from '../models/accountModel.js';

const signUpSchema = z.object({
	email: z.string().email(),
	firstName: z.string().min(1).max(255),
	lastName: z.string().min(1).max(255),
	password: z.string().min(8).max(255),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const updateBodySchema = z.object({
	email: z.string().email().optional(),
	firstName: z.string().min(1).max(255).optional(),
	lastName: z.string().min(1).max(255).optional(),
});

const router = express.Router();

router.post('/signup', async (req, res) => {
	const { email, firstName, lastName, password } = req.body;

	const isSignedUp = signUpSchema.safeParse({
		email,
		firstName,
		lastName,
		password,
	});

	if (isSignedUp.error) {
		return res.status(411).json(isSignedUp.error);
	}

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return res.status(411).json({ message: 'User already exists' });
	}

	const newUser = new User({ email, firstName, lastName, password });

	/// ----- Create new account and assign a random balance between 1 and 10000------

	await Account.create({
		userId: newUser._id,
		balance: 1 + Math.random() * 10000,
	});

	/// -----  ------

	const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

	newUser.save().then(() => {
		res.json({ message: 'User created', token });
	});
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const validateLogin = loginSchema.safeParse({ email, password });

	if (validateLogin.error) {
		res
			.status(411)
			.json({ message: 'Please enter a valid email and password' });
		return;
	}

	const user = await User.findOne({ email, password });

	if (!user) {
		res.status(411).json({ message: 'User does not exist' });
		return;
	}

	const token = jwt.sign({ userId: user._id }, JWT_SECRET);

	res.status(200).json({ message: 'User logged in', token });
});

router.put('/', authMiddleware, async (req, res) => {
	const validateUpdate = updateBodySchema.safeParse(req.body);

	if (validateUpdate.error) {
		res.status(411).json({ message: 'Error while updating the user' });
	}

	try {
		await User.updateOne({ _id: req.userId }, req.body);
		res.status(200).json({ message: 'User updated successfully.' });
	} catch (error) {
		res.status(500).json({ message: 'Error while updating the user' });
	}
});

router.get('/bulk', async (req, res) => {
	const { filter } = req.query || '';

	try {
		const users = await User.find({
			$or: [
				{ firstName: { $regex: filter, $options: 'i' } },
				{ lastName: { $regex: filter, $options: 'i' } },
			],
		});

		const listOfusers = users.map((user) => ({
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			_id: user._id,
		}));

		res.status(200).json(listOfusers);
	} catch (error) {
		res.status(500).json({ message: 'Error while querying users' });
	}
});

export default router;
