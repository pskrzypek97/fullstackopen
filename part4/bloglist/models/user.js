const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minLength: 3,
		required: true,
		unique: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
});

userSchema.plugin(uniqueValidator);

//changing _id property (Object) to id (String)
//and removing _id and __v
userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
