const express = require('express');
const smsController = require('../controllers/smsController');
const { validateSmsRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/send-sms', smsController.sendSms);

router.get('/health', (req, res) => {
    res.json({
        status: 'SMS service is running',
        timestamp: new Date().toISOString(),
        auth: 'disabled'
    });
});

module.exports = router;