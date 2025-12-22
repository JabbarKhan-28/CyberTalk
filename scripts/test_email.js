const fetch = require('node-fetch'); // Falling back to require if fetch global isn't there, but Node 18 has it.
// Actually standard fetch is global in Node 18+. I'll try global fetch first.

const Config = {
  EMAILJS_SERVICE_ID: 'service_gztexce',
  EMAILJS_TEMPLATE_ID: 'template_qf4mv0j',
  EMAILJS_PUBLIC_KEY: 'dSHPV33xQCKrdh2sg',
};

async function sendTestEmail() {
    const data = {
        service_id: Config.EMAILJS_SERVICE_ID,
        template_id: Config.EMAILJS_TEMPLATE_ID,
        user_id: Config.EMAILJS_PUBLIC_KEY,
        template_params: {
            to_email: 'test@example.com',
            to_name: 'TestUser',
            otp_code: '123456',
            app_name: 'CyberTalk'
        }
    };

    try {
        console.log('Sending test email...');
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('SUCCESS: Email sent successfully.');
        } else {
            const text = await response.text();
            console.error('FAILURE: EmailJS Error:', text);
        }
    } catch (error) {
        console.error('EXCEPTION:', error);
    }
}

sendTestEmail();
