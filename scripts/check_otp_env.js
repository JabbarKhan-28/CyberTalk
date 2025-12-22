require('dotenv').config();

const SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

console.log('--- OTP Environment Check ---');
console.log('Service ID:', SERVICE_ID ? 'Set ✅' : 'Missing ❌');
console.log('Template ID:', TEMPLATE_ID ? 'Set ✅' : 'Missing ❌');
console.log('Public Key:', PUBLIC_KEY ? 'Set ✅' : 'Missing ❌');

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error('Missing required environment variables. Please check your .env file.');
    process.exit(1);
}

const data = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
        to_email: 'test@example.com',
        to_name: 'Test Debugger',
        otp_code: '123456',
        app_name: 'CyberTalk Debug'
    }
};

console.log('\nAttempting to send test email...');

fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(async res => {
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
    if (res.ok) console.log('✅ Test Email Sent Successfully!');
    else console.error('❌ Test Email Failed');
})
.catch(err => console.error('Exception:', err));
