import { Config } from '@/constants/Config';

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string, otp: string, name: string) => {
    // Trim email to remove accidental whitespace
    const cleanEmail = email.trim();
    
    // Debug logging for keys and inputs
    console.log('[OTP Debug] input email:', email);
    console.log('[OTP Debug] cleaned email:', cleanEmail);
    console.log('[OTP Debug] Service ID present:', !!Config.EMAILJS_SERVICE_ID);
    console.log('[OTP Debug] Template ID present:', !!Config.EMAILJS_TEMPLATE_ID);
    console.log('[OTP Debug] Public Key present:', !!Config.EMAILJS_PUBLIC_KEY);

    if (!cleanEmail) {
        console.error('[OTP Debug] Email is empty after trimming.');
        throw new Error('Email address is missing.');
    }

    // Check if keys are placeholders or empty
    if (!Config.EMAILJS_PUBLIC_KEY || Config.EMAILJS_PUBLIC_KEY.includes('placeholder')) {
        console.warn('EmailJS keys are missing or invalid. OTP will be printed to console only.');
        console.log(`[MOCK EMAIL] To: ${cleanEmail}, OTP: ${otp}`);
        return true; 
    }

    const data = {
        service_id: Config.EMAILJS_SERVICE_ID,
        template_id: Config.EMAILJS_TEMPLATE_ID,
        user_id: Config.EMAILJS_PUBLIC_KEY,
        template_params: {
            to_email: cleanEmail,
            email: cleanEmail, // MATCHING THE SCREENSHOT: {{email}}
            to_name: name,
            otp_code: otp,
            passcode: otp, // MATCHING THE SCREENSHOT: {{passcode}}
            message: otp,
            reply_to: 'support@cybertalk.app',
            app_name: "CyberTalk"
        }
    };

    try {
        console.log('[OTP Debug] Sending OTP via EmailJS...');
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Origin header removed to prevent CORS errors
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('[OTP Debug] Email sent successfully.');
            return true;
        } else {
            const text = await response.text();
            console.error(`[OTP Debug] EmailJS Error (${response.status}):`, text);
            throw new Error(`EmailJS Error (${response.status}): ${text}`);
        }
    } catch (error) {
        console.error('[OTP Debug] EmailJS Exception:', error);
        throw error;
    }
};
