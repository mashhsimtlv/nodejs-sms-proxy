const express = require('express');
const cors = require('cors');
const smsRoutes = require('./routes/smsRoute');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/functions/v1', smsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

app.listen(PORT, () => {
    console.log(`SMS API server running on port ${PORT}`);
});

module.exports = app;