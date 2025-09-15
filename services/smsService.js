const crypto = require('crypto');

class SmsService {
    constructor() {
        // SMS templates for different languages
        this.templates = {
            en: {
                reviewRequest: `Hi {customerName}! Thank you for choosing {businessName}. Please share your experience: {reviewLink}`
            },
            he: {
                reviewRequest: `שלום {customerName}! תודה שבחרת ב{businessName}. אנא שתף את החוויה שלך: {reviewLink}`
            }
        };
    }

    async sendReviewSms(data) {
        const {
            customerName,
            businessName,
            reviewLink,
            phoneNumber,
            language = 'en'
        } = data;

        try {
            // Generate message content
            const message = this.generateMessage(customerName, businessName, reviewLink, language);

            // Simulate SMS sending (replace with actual SMS provider integration)
            const result = await this.simulateSmsDelivery(phoneNumber, message);

            // Log for R&D
            console.log('SMS Service - Message prepared:', {
                to: phoneNumber,
                message: message,
                language: language,
                timestamp: new Date().toISOString()
            });

            return {
                messageId: result.messageId,
                status: result.status,
                phoneNumber: phoneNumber,
                message: message
            };

        } catch (error) {
            console.error('SMS Service Error:', error);
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }

    generateMessage(customerName, businessName, reviewLink, language) {
        const template = this.templates[language] || this.templates['en'];

        return template.reviewRequest
            .replace('{customerName}', customerName)
            .replace('{businessName}', businessName)
            .replace('{reviewLink}', reviewLink);
    }

    async simulateSmsDelivery(phoneNumber, message) {
        // Simulate async SMS delivery
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure for R&D
                const isSuccess = Math.random() > 0.1; // 90% success rate

                if (isSuccess) {
                    resolve({
                        messageId: this.generateMessageId(),
                        status: 'sent',
                        deliveredAt: new Date().toISOString()
                    });
                } else {
                    reject(new Error('SMS delivery simulation failed'));
                }
            }, 1000); // Simulate network delay
        });
    }

    generateMessageId() {
        return `sms_${crypto.randomBytes(16).toString('hex')}`;
    }

    // Method to integrate with real SMS providers
    async sendWithProvider(phoneNumber, message, provider = 'twilio') {
        switch (provider) {
            case 'twilio':
                // return await this.sendWithTwilio(phoneNumber, message);
                throw new Error('Twilio integration not implemented yet');

            case 'aws-sns':
                // return await this.sendWithAWSSNS(phoneNumber, message);
                throw new Error('AWS SNS integration not implemented yet');

            default:
                throw new Error(`Unsupported SMS provider: ${provider}`);
        }
    }
}

module.exports = new SmsService();
