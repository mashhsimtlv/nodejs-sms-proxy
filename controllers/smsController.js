const {sendSmsService} = require('../services/smsService');
const logtail = require("../helpers/logtail");

class SmsController {
    async sendSms(req, res) {
        try {
            const response = await sendSmsService(req);
            res.status(201).json(response);
        } catch (error) {
            await logtail.error('Error in Update User', { error: error.message, stack: error.stack });
            res.status(500).json({ message: 'Error Sending SMS', error: error.message });
        }
    }
}

module.exports = new SmsController();