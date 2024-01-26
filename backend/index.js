import express from 'express';
import mainRouter from './routes/index.js';
import userRouter from './routes/user.js';
import { User } from './db.js';

const app = express();
app.use('/api/v1', mainRouter);
app.use('/api/v1/user', userRouter);
app.use(express.json());

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});
