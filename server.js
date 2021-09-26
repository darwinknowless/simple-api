const express = require('express'),
	connectDB = require('./config/db'),
	app = express();

// connect database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
