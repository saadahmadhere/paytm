import mongoose from 'mongoose';

export const accoutSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	balance: {
		type: Number,
		required: true,
	},
});

export const Account = mongoose.model('Account', accoutSchema);
