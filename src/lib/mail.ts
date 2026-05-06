import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOrderEmail = async (to: string, orderDetails: any) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Gmail credentials not set. Skipping email notification.");
    return;
  }

  const mailOptions = {
    from: `"FeastOS" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Order Confirmation - #${orderDetails.id.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #EAB308;">FeastOS</h2>
        <h3>Thank you for your order!</h3>
        <p>Order ID: <strong>#${orderDetails.id.slice(-6).toUpperCase()}</strong></p>
        <hr />
        <p><strong>Total: $${orderDetails.total.toFixed(2)}</strong></p>
        <p><strong>Delivery Address:</strong> ${orderDetails.address}</p>
        <p>We've received your order and the kitchen is getting started.</p>
        <a href="${process.env.NEXTAUTH_URL}/profile" style="display: inline-block; padding: 10px 20px; background-color: #EAB308; color: black; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Order</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendStatusUpdateEmail = async (to: string, orderId: string, status: string) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

  const statusMessages: Record<string, string> = {
    'PREPARING': 'Your order is now being prepared by our chefs!',
    'READY': 'Your order is ready and on its way!',
    'COMPLETED': 'Order delivered! We hope you enjoy your meal.',
  };

  const mailOptions = {
    from: `"FeastOS" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Order Update - #${orderId.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #EAB308;">FeastOS</h2>
        <h3>Order Status: ${status}</h3>
        <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
        <hr />
        <a href="${process.env.NEXTAUTH_URL}/profile" style="display: inline-block; padding: 10px 20px; background-color: #EAB308; color: black; text-decoration: none; border-radius: 5px; font-weight: bold;">View Details</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending status update email:", error);
  }
};

export const sendReservationEmail = async (to: string, resDetails: any) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

  const mailOptions = {
    from: `"FeastOS" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Reservation Confirmed - FeastOS Elite Dining`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #EAB308;">FeastOS</h2>
        <h3>Your table is reserved!</h3>
        <p>Dear ${resDetails.name},</p>
        <p>We are delighted to confirm your reservation.</p>
        <hr />
        <p><strong>Date:</strong> ${resDetails.date}</p>
        <p><strong>Time:</strong> ${resDetails.time}</p>
        <p><strong>Guests:</strong> ${resDetails.guests}</p>
        <p><strong>Zone:</strong> ${resDetails.zone}</p>
        <hr />
        <p>We look forward to hosting you for an unforgettable culinary experience.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reservation email sent to:", to);
  } catch (error) {
    console.error("Error sending reservation email:", error);
  }
};
