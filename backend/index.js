import express from 'express';
import { User } from './db.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
	const users = await User.find({ name: 'saad' });
	res.status(200).json({
		message: 'Hello from server.js',
		users,
	});
});

app.post('/signup', (req, res) => {
	const { firstName, lastName, email, password } = req.body;
	const user = new User({
		firstName,
		lastName,
		email,
		password,
	});

	user.save();
	res.status(200).json({ message: 'User created successfully!' });
});

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});
