import express from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config.js';
import { User } from '../db.js';
import { z } from 'zod';

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

const router = express.Router();

router.post('/signup', (req, res) => {
	const { email, firstName, lastName, password } = req.body;

	const signUpSchema = signUpSchema.safeParse({
		email,
		firstName,
		lastName,
		password,
	});

	if (signUpSchema.error) {
		res.status(411).json(signUpSchema.error);
		return;
	}

	User.findOne({ email }).then((user) => {
		if (user) {
			res.status(411).json({ message: 'User already exists' });
			return;
		}
	});

	const newUser = new User({ email, firstName, lastName, password });

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

export default router;
