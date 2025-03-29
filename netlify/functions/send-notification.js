const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { email, subject, formData } = JSON.parse(event.body);

    // Create email content
    const emailContent = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: emailContent
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
};
