const express = require('express');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cors({
origin: 'http://127.0.0.1:5500',
}));
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
res.send('Employee Attendance System API is running');
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});