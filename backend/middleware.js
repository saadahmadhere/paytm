import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

export const authMiddleware = (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization || !authHeader.startsWith('Bearer ')) {
		res.status(403).json({ message: 'Please login' });
		return;
	}

	const token = authorization.split(' ')[1];

	try {
		const decode = jwt.verify(token, JWT_SECRET);
		req.userId = decode.userId;
		next();
	} catch {
		res.status(403).json({ message: 'Please login, from jwt verify' });
	}

	// jwt.verify(token, JWT_SECRET, (err, payload) => {
	// 	if (err) {
	// 		res.status(403).json({ message: 'Please login, from jwt verify' });
	// 		return;
	// 	}

	// 	const { userId } = payload;

	// 	req.userId = userId;

	// 	next();
	// });
};
