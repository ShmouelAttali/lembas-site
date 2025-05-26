import twilio from "twilio";
import {toE164} from "@/lib/utils";

export const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export async function sendSms(to: string, message: string) {
    twilioClient.messages
        .create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${toE164(to)}`,
        })
        .catch(console.error);
}