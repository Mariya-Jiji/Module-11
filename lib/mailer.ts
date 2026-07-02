import nodemailer from 'nodemailer';

export async function sendOTPVerificationEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code - The AI Signal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Verify your email address</h2>
        <p style="color: #444; line-height: 1.5;">
          Thanks for signing up for The AI Signal! Please use the 6-digit code below to verify your email address.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <div style="background-color: #0B0B0C; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 24px; display: inline-block; letter-spacing: 4px;">
            ${otp}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}
