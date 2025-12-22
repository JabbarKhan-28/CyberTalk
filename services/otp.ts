import { Config } from '@/constants/Config';

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string, otp: string, name: string) => {
    // Check if keys are placeholders
    if (Config.EMAILJS_PUBLIC_KEY.includes('placeholder')) {
        console.warn('EmailJS keys are missing. OTP will be printed to console only.');
        console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}`);
        return true; 
    }

    const data = {
        service_id: Config.EMAILJS_SERVICE_ID,
        template_id: Config.EMAILJS_TEMPLATE_ID,
        user_id: Config.EMAILJS_PUBLIC_KEY,
        template_params: {
            email: email,
            to_name: name,
            passcode: otp,
            app_name: "CyberTalk"
        }
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            console.error('EmailJS Error:', text);
            throw new Error(`EmailJS Error: ${text}`);
        }
    } catch (error) {
        console.error('EmailJS Exception:', error);
        throw error;
    }
};
