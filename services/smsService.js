const axios = require("axios");

const sendSmsService = async (req) => {
    try {
        const {
            message,
            phoneNumber,
            senderName
        } = req.body;

        // Build request payload – same structure expected by your SMS provider (019SMS)
        const requestBody = {
            sms: {
                user: {
                    username: process.env.SMS_API_USERNAME || "simtlv99", // configure
                },
                source: senderName,
                destinations: {
                    phone: phoneNumber,
                },
                message: message
            },
        };

        // const requestBody = {
        //     "getApiToken":{
        //         "user": {
        //             "username": "simtlv99",
        //             "password": "3HO0Hs#Q76",
        //         },
        //         "username": "simtlv99",
        //         "action": "current"
        //     }
        // }

        console.log("SMS request body:", requestBody , process.env.SUPABASE_FUNCTION_KEY);

        // Call 019SMS API directly from your server
        const response = await axios.post(
            "https://019sms.co.il/api",
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJmaXJzdF9rZXkiOiI3MjIxNCIsInNlY29uZF9rZXkiOiIzODMwMjczIiwiaXNzdWVkQXQiOiIyMi0wMS0yMDI1IDEyOjE2OjQwIiwidHRsIjo2MzA3MjAwMH0.0tKNbjjM7xzhHh29MekIyC9ITnWkDxQG8LHE5OgoDGo`, // keep in .env
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
