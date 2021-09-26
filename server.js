const express = require('express'),
	connectDB = require('./config/db'),
	app = express();

// Connect database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// ============== ROUTES DECLARATION & IMPORT ====================== //
const authRoute = require('./routes/api/auth');
app.use('/api/auth', authRoute);

const userRoute = require('./routes/api/user');
app.use('/api/users', userRoute);

const profileRoute = require('./routes/api/profile');
app.use('/api/profile', profileRoute);

const postRoute = require('./routes/api/posts');
app.use('/api/posts', postRoute);
// ============== END ROUTES DECLARATION & IMPORT ====================== //

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
