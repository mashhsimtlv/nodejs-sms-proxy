const axios = require("axios");

const sendSmsService = async (req) => {
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
            language,
        } = req.body;

        // Build request payload – same structure expected by your SMS provider (019SMS)
        const requestBody = {
            sms: {
                user: {
                    username: process.env.SMS_API_USERNAME || "simtlv99", // configure
                },
                source: process.env.SMS_SENDER_NAME || "Revuity", // default if not set
                destinations: {
                    phone: phoneNumber,
                },
                message: `Thank you ${customerName}! Please leave your review here: ${reviewLink}`, // can improve with templates
            },
        };

        console.log("SMS request body:", requestBody , process.env.SUPABASE_FUNCTION_KEY);

        // Call 019SMS API directly from your server
        const response = await axios.post(
            "https://019sms.co.il/api",
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer 82939fc95e11bca3e15f815f13927e1e8efdccd4fb1a1bd4e03737f1359d8659`, // keep in .env
                },
            }
        );

        console.log("SMS API Response:", response.data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("sendSmsService error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

module.exports = { sendSmsService };
