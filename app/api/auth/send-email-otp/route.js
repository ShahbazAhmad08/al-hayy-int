import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory / temporary OTP store with expiration
global.otpStore = global.otpStore || new Map();

export async function POST(request) {
  try {
    const { email, name, purpose } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = name ? name.trim() : 'Valued Patron';

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    global.otpStore.set(cleanEmail, { otp, expiresAt });

    const smtpUser = process.env.SMTP_USER || 'shahbazzahmad4772@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'gniylqzuzyabamut';

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const isReset = purpose === 'forgot_password';
    const subject = isReset
      ? `Password Reset Code: ${otp} — Al Hayy International`
      : `Verification Code: ${otp} — Al Hayy International`;
    const heading = isReset ? 'Password Reset Request' : 'Account Verification Code';
    const actionText = isReset
      ? 'We received a request to reset your password. Use the verification code below to set a new password:'
      : 'Thank you for connecting with Al Hayy International. Please use the verification code below to complete sign in / verification:';

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background-color:#070E1E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#070E1E;padding:40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:500px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);">
                <tr>
                  <td style="background-color:#022C22;padding:32px 30px;text-align:center;border-bottom:2px solid #D4AF37;">
                    <h1 style="margin:0;color:#F7E7B6;font-size:22px;letter-spacing:2px;font-weight:800;text-transform:uppercase;">AL HAYY INTERNATIONAL</h1>
                    <p style="margin:6px 0 0;color:#a7f3d0;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Authentic Kashmiri Heritage & Luxury Handcrafts</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 32px;">
                    <h2 style="margin:0 0 12px;color:#070E1E;font-size:18px;font-weight:700;">${heading}</h2>
                    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">Hello <strong>${displayName}</strong>,</p>
                    <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">${actionText}</p>
                    
                    <div style="background-color:#FDFBF7;border:2px dashed #D4AF37;border-radius:16px;padding:22px;text-align:center;margin:24px 0;">
                      <span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#022C22;font-family:monospace;display:inline-block;">${otp}</span>
                    </div>
                    
                    <p style="margin:0 0 8px;color:#64748b;font-size:12px;">⏱️ This verification code is valid for <strong>10 minutes</strong>.</p>
                    <p style="margin:0;color:#94a3b8;font-size:12px;">If you did not request this code, please safely disregard this email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
                    <p style="margin:0;color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} Al Hayy International. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Al Hayy International" <${smtpUser}>`,
      to: cleanEmail,
      subject: subject,
      html: htmlBody,
    });

    return NextResponse.json({
      success: true,
      message: `Verification code sent successfully to ${cleanEmail}`,
    });
  } catch (error) {
    console.error('Send Email OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification email: ' + error.message },
      { status: 500 }
    );
  }
}
