import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
function formatPhoneNumber(phone, type) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    // Handle cases where the number starts with 972 but missing "+"
    if (cleaned.startsWith('972') && cleaned.length === 12) {
        return type === 'sms' ? `0${cleaned.slice(3)}` : `+${cleaned}`;
    }
    // Handle local numbers like 0543982101 or 054-398-2101
    if (cleaned.length === 10 && cleaned.startsWith('05')) {
        return type === 'sms' ? cleaned : `+972${cleaned.slice(1)}`;
    }
    // Fallback: Return original if it doesn’t match expected formats
    return phone;
}
serve(async (req)=>{
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders
        });
    }
    try {
        const { customerName, customerEmail, orderNumber, businessName, reviewId, reviewLink, phoneNumber, userId } = await req.json();
        console.log('Received request with body:', JSON.stringify({
            customerName,
            customerEmail,
            orderNumber,
            businessName,
            reviewLink,
            reviewId,
            phoneNumber,
            userId
        }, null, 2));
        if (!phoneNumber) {
            throw new Error('Phone number is required');
        }
        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabase = createClient(supabaseUrl, supabaseKey);
        // Get the user's profile including language preference and SMS templates
        const { data: profileData, error: profileError } = await supabase.from('profiles').select('sms_sender_name, sms_templates, language_preference').eq('id', userId).single();
        if (profileError) {
            console.error('Error fetching profile:', profileError);
            throw new Error('Error fetching profile');
        }
        // Format phone number: remove '+' prefix if present
        // const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber
        const formattedPhone = formatPhoneNumber(phoneNumber, 'sms');
        console.log("Sending to PHONE: " + formattedPhone);
        const endPoint = 'https://019sms.co.il/api';
        const userName = 'simtlv99';
        const accessToken = Deno.env.get('SMS_API_TOKEN');
        if (!accessToken) {
            throw new Error('SMS API token not configured');
        }
        // Use the sender name from profile, fallback to "Revuity" if not set
        const senderName = (profileData?.sms_sender_name || '').trim() || 'Revuity';
        console.log('Using sender name:', senderName);
        // Get the correct template based on language preference
        const languagePreference = profileData?.language_preference || 'en';
        const templates = profileData?.sms_templates || {
            en: "Thank you for your order! We would love to hear your feedback: {reviewLink}",
            he: "!תודה על הזמנתך! נשמח לשמוע את המשוב שלך: {reviewLink}"
        };
        // Select template based on language preference
        const template = templates[languagePreference];
        const message = template.replace(/{reviewLink}/g, reviewLink).replace(/{reviewId}/g, reviewId);
        console.log('Using template for language:', languagePreference);
        console.log('Final message:', message);
        // Create the request body according to 019SMS API specifications
        const requestBody = {
            sms: {
                user: {
                    username: userName
                },
                source: senderName,
                destinations: {
                    phone: formattedPhone
                },
                message: message
            }
        };
        console.log('Making request to SMS API:', {
            url: endPoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken.substring(0, 4)}...` // Log only first 4 chars of token
            },
            body: JSON.stringify(requestBody, null, 2)
        });
        const response = await fetch(endPoint, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const responseText = await response.text();
        console.log('SMS API Response:', {
            status: response.status,
            statusText: response.statusText,
            body: responseText
        });
        if (!response.ok) {
            throw new Error(`SMS API error: ${responseText}`);
        }
        // Log the successful SMS
        await supabase.from('sms_logs').insert({
            user_id: userId,
            phone_number: formattedPhone,
            message: message,
            status: 'sent',
            sent_at: new Date().toISOString()
        });
        return new Response(JSON.stringify({
            success: true
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 400,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
});
