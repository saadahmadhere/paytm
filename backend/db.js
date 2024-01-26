import mongoose from 'mongoose';

const mongoURL =
	'mongodb+srv://saadahmad728:9ckeZFScOMELsYCh@paytm-cluster.ncgc4qa.mongodb.net/';

//mongoose.connect(process.env.MONGO_URI, {
mongoose
	.connect(mongoURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.error('Error connecting to MongoDB', err);
	});

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
});

const User = mongoose.model('User', userSchema);

export { User };
