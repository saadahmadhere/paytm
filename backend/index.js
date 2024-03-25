import express from 'express';
import cors from 'cors';
import mainRouter from './routes/index.js';
import './db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});
