import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'mock_email_app_password') {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

export const sendNotificationEmail = async ({ to, subject, html, text }) => {
  try {
    const client = getTransporter();
    if (!client) {
      console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }

    const info = await client.sendMail({
      from: process.env.EMAIL_FROM || 'Mixer Fix <noreply@mixerfix.com>',
      to,
      subject,
      text: text || '',
      html: html || `<p>${text}</p>`,
    });

    console.log(`[Email Sent] Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[Email Notice] Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};
