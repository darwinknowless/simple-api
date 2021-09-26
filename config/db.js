const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MONGO_URI');

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			// useCreateIndex: true, //use to make unique data Types
			// useFindAndModify: false, //usefindAndUpdate instead of findAndModify
		});
		console.log('MongoDB Connected...');
	} catch (err) {
		console.log(err.message);
		//Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
