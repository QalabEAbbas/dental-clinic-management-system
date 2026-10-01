const errorHandler = require('./src/middleware/errorHandler');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/config/database');
const doctorRoutes = require('./src/routes/doctorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/doctors', doctorRoutes);



app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.status(200).json({
            success: true,
            message: 'Dental Clinic API is running',
            database: 'connected'
        });
    } catch (error) {
        console.error('Database health check failed:', error);

        res.status(500).json({
            success: false,
            message: 'API is running but database connection failed'
        });
    }
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});