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

    let isValid = false;

    // 1. Check in-memory store
    const record = global.otpStore.get(cleanEmail);
    if (record) {
      if (Date.now() <= record.expiresAt && record.otp === cleanOtp) {
        isValid = true;
        global.otpStore.delete(cleanEmail);
      }
    }

    // 2. Fallback to remote database verification if not in local lambda memory
    if (!isValid) {
      try {
        const remoteRes = await fetch(
          'http://alhayyinternational-com.stackstaging.com/v2/api/verify-otp-register.php',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: username || cleanEmail.split('@')[0],
              email: cleanEmail,
              password: password || 'otp_session',
              otp: cleanOtp
            })
          }
        );
        const remoteJson = await remoteRes.json();
        if (remoteJson && remoteJson.success) {
          isValid = true;
        }
      } catch (err) {
        console.warn('Remote verification fallback check:', err.message);
      }
    }

    // If matching 6-digit OTP
    if (!isValid && cleanOtp.length === 6 && record && record.otp === cleanOtp) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code. Please check and re-enter.' },
        { status: 400 }
      );
    }

    // Sync / Save user to ServerByt MySQL users table
    const displayName = username ? username.trim() : cleanEmail.split('@')[0];
    let syncedUser = {
      id: 'user_' + Date.now(),
      username: displayName,
      email: cleanEmail,
      role: 'customer'
    };

    try {
      const syncRes = await fetch(
        'http://alhayyinternational-com.stackstaging.com/v2/api/verify-auth.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login_type: 'email',
            email: cleanEmail,
            name: displayName,
            uid: 'email_' + cleanEmail
          })
        }
      );
      const syncJson = await syncRes.json();
      if (syncJson && syncJson.user) {
        syncedUser = syncJson.user;
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully.',
      user: syncedUser
    });
  } catch (error) {
    console.error('Verify Email OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed: ' + error.message },
      { status: 500 }
    );
  }
}
