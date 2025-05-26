// sendSms.ts

type Recipient = {
    Phone: string;
};

type SmsSettings = {
    Sender: string;
};

type SmsPayload = {
    Data: {
        Message: string;
        Recipients: Recipient[];
        Settings: SmsSettings;
    };
};

type SendSmsResponse = {
    Status: string;
    Message: string;
    Data?: any;
};

export async function sendSms(
    message: string,
    phone: string
): Promise<SendSmsResponse> {
    const url = 'https://capi.upsend.co.il/api/v2/SMS/SendSms';

    const user = process.env.UPSEND_USER;
    const token = process.env.UPSEND_TOKEN;
    const sender = process.env.UPSEND_SENDER;

    if (!user || !token || !sender) {
        throw new Error('Missing UPSEND_USER, UPSEND_TOKEN, or UPSEND_SENDER in environment variables');
    }

    const payload: SmsPayload = {
        Data: {
            Message: message,
            Recipients: [{ Phone: phone }],
            Settings: { Sender: sender },
        },
    };

    const credentials = Buffer.from(`${user}:${token}`).toString('base64');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to send SMS: ${response.status} ${error}`);
    }

    return response.json();
}
