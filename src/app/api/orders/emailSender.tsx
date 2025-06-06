/* Helper method to send email */
import {OrderConfirmation} from "@/emails/OrderConfirmation";
import {Resend} from "resend";
import {CustomerInfo, OrderInfo} from "@/types/types";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export function sendOrderEmail(
    customer: CustomerInfo,
    order: OrderInfo,
    orderItemsPayload: any[]
) {
    console.info('sending email to ', customer.name, customer.email)
    resend.emails
        .send({
            from: 'lembas@shmouel.com',
            to: customer.email,
            subject: `הזמנה מספר ${order.id} מלמבס התקבלה`,
            react: (
                <OrderConfirmation
                    customer={customer}
                    order={order}
                    items={orderItemsPayload}
                />
            ),
        })
        .catch(console.error)
        .then((res) => {
            console.info('email sent', res);
        });
}