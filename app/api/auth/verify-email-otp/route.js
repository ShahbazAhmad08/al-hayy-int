import { NextResponse } from 'next/server';

global.otpStore = global.otpStore || new Map();

export async function POST(request) {
  try {
    const { username, email, password, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const record = global.otpStore.get(cleanEmail);

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'No OTP requested or code expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      global.otpStore.delete(cleanEmail);
      return NextResponse.json(
        { success: false, message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (record.otp !== cleanOtp) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code. Please check and re-enter.' },
        { status: 400 }
      );
    }

    // OTP Verified successfully!
    global.otpStore.delete(cleanEmail);

    const displayName = username ? username.trim() : cleanEmail.split('@')[0];

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully.',
      user: {
        id: 'user_' + Date.now(),
        username: displayName,
        email: cleanEmail,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Verify Email OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed: ' + error.message },
      { status: 500 }
    );
  }
}
