const smsService = require('../services/smsService');

class SmsController {
    async sendSms(req, res) {
        try {
            const {
                customerName,
                customerEmail,
                orderNumber,
                businessName,
                reviewId,
                reviewLink,
                phoneNumber,
                userId,
                language
            } = req.body;

            // Log the request for R&D purposes (removed user context)
            console.log('SMS Request received:', {
                customerName,
                phoneNumber,
                businessName,
                language,
                timestamp: new Date().toISOString()
            });

            // Call the SMS service
            const result = await smsService.sendReviewSms({
                customerName,
                customerEmail,
                orderNumber,
                businessName,
                reviewId,
                reviewLink,
                phoneNumber,
                userId,
                language
            });

            // Return success response
            res.status(200).json({
                success: true,
                message: 'SMS sent successfully',
                data: {
                    messageId: result.messageId,
                    phoneNumber: phoneNumber,
                    status: result.status
                }
            });

        } catch (error) {
            console.error('SMS Controller Error:', error);

            res.status(400).json({
                success: false,
                error: 'Failed to send SMS',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

module.exports = new SmsController();