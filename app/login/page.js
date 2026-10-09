'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  User,
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Package, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Key, 
  Eye, 
  EyeOff, 
  MessageCircle,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getFirebaseAuth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { verifyBackendAuth, sendEmailOtp, verifyOtpAndRegister, resetPassword } from '@/lib/api';

// Google Brand SVG Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/orders';

  const { user, customerLogin, customerLogout, loginWithSyncedUser } = useAuth();

  // Primary Active Tab: 'signin' | 'signup' | 'forgot'
  const [authTab, setAuthTab] = useState('signin');

  // Sign In Form State
  const [signInMethod, setSignInMethod] = useState('otp'); // 'otp' | 'password'
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInOtp, setSignInOtp] = useState('');
  const [signInStep, setSignInStep] = useState(1); // 1 = Input, 2 = Verify OTP

  // Sign Up (Create Account) Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpOtp, setSignUpOtp] = useState('');
  const [signUpStep, setSignUpStep] = useState(1); // 1 = Input, 2 = Verify OTP

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Common UI State
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if ((signInStep === 2 || signUpStep === 2 || forgotStep === 2) && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signInStep, signUpStep, forgotStep, resendTimer]);

  // If already signed in, redirect
  useEffect(() => {
    if (user && redirectUrl !== '/orders') {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleAuthCompletion = (userData) => {
    loginWithSyncedUser(userData);
    setSuccessMsg('Authenticated successfully! Redirecting...');
    setTimeout(() => {
      router.push(redirectUrl);
    }, 400);
  };

  // -------------------------------------------------------------
  // 🌟 1. ONE-CLICK GOOGLE SIGN-IN / SIGN-UP (100% Free)
  // -------------------------------------------------------------
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const authInstance = getFirebaseAuth();
      if (!authInstance) {
        throw new Error('Google Auth initializing. Please try again.');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(authInstance, provider);
      const googleUser = result.user;
      const idToken = await googleUser.getIdToken();

      // Sync user with ServerByt MySQL backend
      const syncRes = await verifyBackendAuth({
        login_type: 'google',
        email: googleUser.email,
        name: googleUser.displayName || '',
        uid: googleUser.uid,
        token: idToken
      });

      if (syncRes && syncRes.status === 'success') {
        handleAuthCompletion({
          id: syncRes.user?.id || googleUser.uid,
          username: googleUser.displayName || googleUser.email.split('@')[0],
          email: googleUser.email,
          phone: googleUser.phoneNumber || '',
          role: 'customer'
        });
      } else {
        handleAuthCompletion({
          id: googleUser.uid,
          username: googleUser.displayName || googleUser.email.split('@')[0],
          email: googleUser.email,
          role: 'customer'
        });
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed popup peacefully
      } else {
        console.error('Google Auth Error:', error);
        setErrorMsg(error.message || 'Google authentication was cancelled or failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 🌟 2. SIGN IN HANDLERS (OTP & Password)
  // -------------------------------------------------------------
  const handleSendSignInOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = signInEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmailOtp(cleanEmail, 'Valued Patron', 'login');
      if (res && res.success) {
        setSignInStep(2);
        setSignInOtp('');
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`A 6-digit verification code has been sent to ${cleanEmail}`);
      } else {
        setSignInStep(2);
        setSuccessMsg(`Enter the verification code sent to ${cleanEmail}`);
      }
    } catch (err) {
      setErrorMsg('Network error while sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignInOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanCode = signInOtp.trim();
    if (cleanCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit code received on your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpAndRegister(
        signInEmail.split('@')[0],
        signInEmail.trim(),
        'otp_secured_session',
        cleanCode
      );

      if (res && res.success) {
        handleAuthCompletion({
          username: res.user?.username || signInEmail.split('@')[0],
          email: signInEmail.trim(),
          role: 'customer'
        });
      } else {
        setErrorMsg(res?.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setErrorMsg('Error verifying code.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await customerLogin(signInEmail.trim(), signInPassword);
      if (res && res.success) {
        setSuccessMsg('Welcome back!');
        setTimeout(() => router.push(redirectUrl), 400);
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 🌟 3. SIGN UP (CREATE ACCOUNT) HANDLERS
  // -------------------------------------------------------------
  const handleSendSignUpOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpName.trim() || signUpName.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmailOtp(signUpEmail.trim(), signUpName.trim(), 'register');
      if (res && res.success) {
        setSignUpStep(2);
        setSignUpOtp('');
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`A 6-digit verification code has been sent to ${signUpEmail}`);
      } else {
        setSignUpStep(2);
        setSuccessMsg(`Enter the verification code sent to ${signUpEmail}`);
      }
    } catch (err) {
      setErrorMsg('Network error while sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignUpOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanCode = signUpOtp.trim();
    if (cleanCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpAndRegister(
        signUpName.trim(),
        signUpEmail.trim(),
        signUpPassword,
        cleanCode
      );

      if (res && res.success) {
        setSuccessMsg('Account created successfully! Welcome to Al Hayy.');
        setTimeout(() => router.push(redirectUrl), 400);
      } else {
        setErrorMsg(res?.message || 'Invalid verification code.');
      }
    } catch (err) {
      setErrorMsg('Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 🌟 4. FORGOT PASSWORD HANDLERS
  // -------------------------------------------------------------
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmailOtp(forgotEmail.trim(), '', 'forgot_password');
      if (res && res.success) {
        setForgotStep(2);
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`Reset code sent to ${forgotEmail}`);
      } else {
        setErrorMsg(res?.message || 'Unable to send reset code.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit reset code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await resetPassword(forgotEmail.trim(), forgotOtp.trim(), forgotNewPassword);
      if (res && res.success) {
        setSuccessMsg('Password updated! You can now sign in.');
        setTimeout(() => {
          setAuthTab('signin');
          setSignInMethod('password');
          setSignInEmail(forgotEmail);
          setForgotStep(1);
        }, 800);
      } else {
        setErrorMsg(res?.message || 'Failed to reset password.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in & on orders default view
  if (user && redirectUrl === '/orders') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
        <div className="p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#070E1E] text-[#D4AF37] flex items-center justify-center mx-auto text-xl font-bold font-serif-luxury border border-[#D4AF37]/30">
            {user.username?.charAt(0).toUpperCase() || 'P'}
          </div>

          <div className="space-y-1">
            <h1 className="font-serif-luxury text-2xl font-bold text-stone-900">
              Welcome back, {user.username}
            </h1>
            <p className="text-xs text-stone-500">{user.email || user.phone || 'Patron Account'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/orders"
              className="py-3 px-4 rounded-xl bg-[#070E1E] text-[#F7E7B6] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0c1830] transition-colors border border-[#D4AF37]/40 shadow-sm"
            >
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Track Orders</span>
            </Link>

            <button
              onClick={customerLogout}
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-6">
      {redirectUrl === '/checkout' && (
        <div className="p-4 bg-[#070E1E] rounded-2xl border border-[#D4AF37]/40 text-center space-y-1 shadow-lg text-[#FAF7F2]">
          <span className="text-xs font-bold flex items-center justify-center gap-1.5 text-[#F7E7B6]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Please sign in to proceed with secure checkout
          </span>
          <p className="text-[11px] text-stone-300">Your bag items are reserved safely.</p>
        </div>
      )}

      {/* Main Luxury Auth Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative h-11 w-36 mx-auto">
            <Image src="/logo.avif" alt="Al Hayy" fill className="object-contain" priority />
          </div>

          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 tracking-tight">
            {authTab === 'signin' && 'Sign In to Your Account'}
            {authTab === 'signup' && (signUpStep === 1 ? 'Create Patron Account' : 'Verify Email Address')}
            {authTab === 'forgot' && (forgotStep === 1 ? 'Reset Your Password' : 'Set New Password')}
          </h1>

          <p className="text-xs text-stone-500">
            {authTab === 'signin' && 'Access order tracking, express checkout & patron privileges'}
            {authTab === 'signup' && (signUpStep === 1 ? 'Join Al Hayy International for exclusive patron privileges' : `Enter the 6-digit code sent to ${signUpEmail}`)}
            {authTab === 'forgot' && 'Enter your registered email to receive a password reset code'}
          </p>
        </div>

        {/* ==================================================================== */}
        {/* 🌟 TAB SWITCHER: SIGN IN vs CREATE ACCOUNT (SIGN UP)                 */}
        {/* ==================================================================== */}
        {authTab !== 'forgot' && (
          <div className="flex p-1 bg-stone-100 rounded-2xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => {
                setAuthTab('signin');
                setErrorMsg('');
                setSuccessMsg('');
                setSignInStep(1);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'signin' 
                  ? 'bg-[#070E1E] text-[#F7E7B6] shadow-sm border border-[#D4AF37]/40' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setErrorMsg('');
                setSuccessMsg('');
                setSignUpStep(1);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'signup' 
                  ? 'bg-[#070E1E] text-[#F7E7B6] shadow-sm border border-[#D4AF37]/40' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200 animate-in fade-in duration-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/15 text-[#8F6A10] text-xs border border-[#D4AF37]/40 animate-in fade-in duration-200 font-medium">
            {successMsg}
          </div>
        )}

        {/* ==================================================================== */}
        {/* 🌟 1-CLICK GOOGLE BUTTON (AVAILABLE IN BOTH SIGN IN & SIGN UP)       */}
        {/* ==================================================================== */}
        {authTab !== 'forgot' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-3 border border-stone-300 shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 group"
            >
              <GoogleIcon />
              <span className="tracking-wide font-medium">
                {authTab === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
              </span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white px-3 text-stone-400 font-medium">Or continue with email</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 🌟 TAB 1: SIGN IN VIEW                                               */}
        {/* ==================================================================== */}
        {authTab === 'signin' && (
          <div>
            {signInMethod === 'otp' ? (
              signInStep === 1 ? (
                /* Sign In via OTP: Step 1 (Email Input) */
                <form onSubmit={handleSendSignInOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#070E1E] transition-all bg-stone-50/50 focus:bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !signInEmail.includes('@')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#070E1E] hover:bg-[#0b162c] text-[#F7E7B6] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-[#D4AF37]/50 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    ) : (
                      <>
                        <span>Send 6-Digit Code</span>
                        <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setSignInMethod('password')}
                      className="text-xs text-stone-500 hover:text-stone-900 underline"
                    >
                      Sign In with Password instead
                    </button>
                  </div>
                </form>
              ) : (
                /* Sign In via OTP: Step 2 (Verify OTP) */
                <form onSubmit={handleVerifySignInOtp} className="space-y-5">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1">
                    <span className="text-xs font-bold text-stone-800">{signInEmail}</span>
                    <p className="text-[11px] text-stone-500">Enter the 6-digit code sent to your inbox.</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="------"
                      value={signInOtp}
                      onChange={(e) => setSignInOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full py-3.5 text-center text-2xl tracking-[10px] font-mono font-bold rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#070E1E] bg-stone-50/50 focus:bg-white shadow-xs"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || signInOtp.length !== 6}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#022C22] hover:bg-[#064E3B] text-[#F7E7B6] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setSignInStep(1)}
                      className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Edit Email
                    </button>

                    <button
                      type="button"
                      disabled={!canResend || loading}
                      onClick={handleSendSignInOtp}
                      className="text-[#8F6A10] font-bold hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                      {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* Sign In via Password */
              <form onSubmit={handlePasswordSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your email address"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('forgot');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[11px] font-bold text-[#8F6A10] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setSignInMethod('otp')}
                    className="text-xs text-stone-500 hover:text-stone-900 underline"
                  >
                    Sign In with 6-Digit OTP Code instead
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* 🌟 TAB 2: SIGN UP (CREATE ACCOUNT) VIEW                              */}
        {/* ==================================================================== */}
        {authTab === 'signup' && (
          <div>
            {signUpStep === 1 ? (
              <form onSubmit={handleSendSignUpOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Khan"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Create Password (Min. 6 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#022C22] hover:bg-[#064E3B] text-[#F7E7B6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Sign Up: Step 2 (Verify OTP) */
              <form onSubmit={handleVerifySignUpOtp} className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-2xl border text-center text-xs">
                  A verification code has been sent to <strong>{signUpEmail}</strong>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="------"
                    value={signUpOtp}
                    onChange={(e) => setSignUpOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full py-3 text-center text-2xl tracking-[8px] font-mono font-bold rounded-xl border border-stone-300"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || signUpOtp.length !== 6}
                  className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Create Account'}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button type="button" onClick={() => setSignUpStep(1)} className="text-stone-500 hover:underline">
                    Edit Details
                  </button>

                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleSendSignUpOtp}
                    className="text-[#8F6A10] font-bold hover:underline disabled:opacity-40"
                  >
                    {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* 🌟 TAB 3: FORGOT PASSWORD VIEW                                       */}
        {/* ==================================================================== */}
        {authTab === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Code'}
                </button>
                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setAuthTab('signin');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }} 
                    className="text-xs text-stone-500 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-Digit Reset Code"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full py-2.5 text-center text-xl tracking-[6px] font-mono font-bold rounded-xl border border-stone-300"
                />
                <input
                  type="password"
                  required
                  placeholder="New Password (min 6 chars)"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#022C22] text-amber-200 font-bold text-xs uppercase tracking-wider"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* WhatsApp Concierge Support */}
        <div className="pt-2 text-center border-t border-stone-100">
          <a
            href="https://wa.me/917755013772?text=Hello%20Al%20Hayy%20International%2C%20I%20need%20assistance%20with%20my%20order%20login."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Need assistance? WhatsApp Concierge Support</span>
          </a>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-24 text-center text-xs text-stone-400">Loading Sign In...</div>}>
      <LoginContent />
    </Suspense>
  );
}
