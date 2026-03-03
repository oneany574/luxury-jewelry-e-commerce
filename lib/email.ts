import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'noreply@luxejewelry.com';

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
) {
  try {
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B7355;">Order Confirmation</h1>
        <p>Thank you for your purchase!</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <table style="width: 100%; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p style="text-align: right; font-size: 18px; font-weight: bold;">
          Total: $${total.toFixed(2)}
        </p>
        <p style="color: #666; margin-top: 30px;">
          You will receive tracking information once your order ships.
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html,
    });

    return result;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
}

export async function sendAppointmentConfirmation(
  email: string,
  customerName: string,
  date: string,
  time: string,
  type: string
) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B7355;">Appointment Confirmed</h1>
        <p>Dear ${customerName},</p>
        <p>Your jewelry consultation appointment has been confirmed.</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Appointment Type:</strong> ${type}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
        <p style="color: #666; margin-top: 30px;">
          We look forward to seeing you!<br>
          Luxe Jewelry Team
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Appointment Confirmation - ${date}`,
      html,
    });

    return result;
  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    throw error;
  }
}

export async function sendCustomDesignNotification(
  email: string,
  customerName: string,
  designDescription: string
) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B7355;">Custom Jewelry Design Received</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for submitting your custom jewelry design request!</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Design Description:</strong></p>
          <p>${designDescription}</p>
        </div>
        <p>Our expert designers will review your submission and contact you within 2-3 business days with next steps and a quote.</p>
        <p style="color: #666; margin-top: 30px;">
          Best regards,<br>
          Luxe Jewelry Design Team
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Custom Jewelry Design Received',
      html,
    });

    return result;
  } catch (error) {
    console.error('Error sending custom design notification:', error);
    throw error;
  }
}
