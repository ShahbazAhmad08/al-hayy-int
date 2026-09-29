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
  KeyRound, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { sendEmailOtp, verifyOtpAndRegister, resetPassword } from '@/lib/api';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/orders';

  const { user, customerLogin, customerLogout } = useAuth();

  // Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  
  // Login Form
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Forgot Password Form
  const [newPassword, setNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Input, 2 = Verify OTP

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
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
  }, [step, resendTimer]);

  // If already signed in, redirect
  useEffect(() => {
    if (user && redirectUrl !== '/orders') {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  if (user && redirectUrl === '/orders') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
        <div className="p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mx-auto text-xl font-bold font-serif-luxury">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="space-y-1">
            <h1 className="font-serif-luxury text-2xl font-bold text-stone-900">
              Welcome back, {user.username}
            </h1>
            <p className="text-xs text-stone-500">{user.email || 'Patron Account'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/orders"
              className="py-3 px-4 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
            >
              <Package className="w-4 h-4" />
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

  // 1. Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await customerLogin(emailOrUsername, password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.message || 'Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (emailStr) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(emailStr).trim());
  };

  // 2. Handle Send OTP (Registration or Forgot Password)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (authMode === 'register') {
      if (!username || username.trim().length < 2) {
        setErrorMsg('Please enter your full name (at least 2 characters).');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify and re-enter.');
        return;
      }
    }

    setLoading(true);

    try {
      const purpose = authMode === 'forgot' ? 'forgot_password' : 'register';
      const res = await sendEmailOtp(cleanEmail, username.trim(), purpose);

      if (res && res.success) {
        setStep(2);
        setOtp('');
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`A 6-digit verification code has been sent to ${cleanEmail}. Please check your email inbox.`);
      } else {
        setErrorMsg(res?.message || 'Unable to send OTP. Please check your email.');
      }
    } catch (err) {
      setErrorMsg('Network error while sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Verify OTP & Register
  const handleVerifyRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await verifyOtpAndRegister(username.trim(), email.trim(), password, otp.trim());
      if (res && res.success) {
        setSuccessMsg('Account verified successfully! Welcome to Al Hayy.');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } else {
        setErrorMsg(res?.message || 'Invalid verification code.');
      }
    } catch (err) {
      setErrorMsg('Error verifying code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Reset Password Submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== forgotConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await resetPassword(email.trim(), otp.trim(), newPassword);
      if (res && res.success) {
        setSuccessMsg('Password reset successfully! You can now sign in with your new password.');
        setTimeout(() => {
          setAuthMode('login');
          setStep(1);
          setEmailOrUsername(email);
          setPassword('');
          setOtp('');
          setNewPassword('');
          setSuccessMsg('Password updated! Please enter your password to sign in.');
        }, 1200);
      } else {
        setErrorMsg(res?.message || 'Password reset failed. Invalid or expired code.');
      }
    } catch (err) {
      setErrorMsg('Network error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Handler
  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const purpose = authMode === 'forgot' ? 'forgot_password' : 'register';
      const res = await sendEmailOtp(email.trim(), username.trim(), purpose);
      if (res && res.success) {
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`A fresh verification code has been sent to ${email}`);
      } else {
        setErrorMsg(res?.message || 'Failed to resend code.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      {redirectUrl === '/checkout' && (
        <div className="p-4 bg-[#070E1E] rounded-2xl border border-[#D4AF37]/40 text-center space-y-1 shadow-lg text-[#FAF7F2]">
          <span className="text-xs font-bold flex items-center justify-center gap-1.5 text-[#F7E7B6]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Please sign in to proceed with secure checkout
          </span>
          <p className="text-[11px] text-stone-300">Your bag items are saved safely.</p>
        </div>
      )}

      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative h-10 w-36 mx-auto">
            <Image src="/logo.avif" alt="Al Hayy" fill className="object-contain" priority />
          </div>

          <h1 className="font-serif-luxury text-xl font-bold text-stone-900">
            {authMode === 'login' && 'Sign In to Your Account'}
            {authMode === 'register' && (step === 1 ? 'Create Customer Account' : 'Verify Email Address')}
            {authMode === 'forgot' && (step === 1 ? 'Reset Your Password' : 'Set New Password')}
          </h1>

          <p className="text-xs text-stone-500">
            {authMode === 'login' && 'Access order tracking, express checkout & patron privileges'}
            {authMode === 'register' && (step === 1 ? 'Single account per email with OTP verification' : `Enter the 6-digit code sent to ${email}`)}
            {authMode === 'forgot' && (step === 1 ? 'Enter your registered email to receive a password reset code' : `Enter the 6-digit code sent to ${email}`)}
          </p>
        </div>

        {/* Tab switch: Sign In vs Register (Hide when in forgot mode) */}
        {authMode !== 'forgot' && (
          <div className="flex p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
                setStep(1);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'login' ? 'bg-[#070E1E] text-[#F7E7B6] shadow-sm border border-[#D4AF37]/40' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
                setSuccessMsg('');
                setStep(1);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'register' ? 'bg-[#070E1E] text-[#F7E7B6] shadow-sm border border-[#D4AF37]/40' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200 animate-in fade-in duration-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/15 text-[#AA7E18] text-xs border border-[#D4AF37]/30 animate-in fade-in duration-200 font-medium">
            {successMsg}
          </div>
        )}

        {/* -------------------- MODE 1: SIGN IN FORM -------------------- */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="name@example.com"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setErrorMsg('');
                    setSuccessMsg('');
                    setStep(1);
                  }}
                  className="text-[11px] font-bold text-amber-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* -------------------- MODE 2: REGISTER (OTP BASED) -------------------- */}
        {authMode === 'register' && step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Zohra"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address (One account per email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="fatima@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Create Password (Min. 6 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showRegisterConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showRegisterConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showRegisterConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#022C22] hover:bg-[#064E3B] text-amber-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Step 2: Enter OTP */}
        {authMode === 'register' && step === 2 && (
          <form onSubmit={handleVerifyRegister} className="space-y-5">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1">
              <span className="text-xs font-bold text-stone-800">{email}</span>
              <p className="text-[11px] text-stone-500">Please enter the 6-digit code sent to your inbox.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full py-3 text-center text-2xl tracking-[8px] font-mono font-bold rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Verify & Create Account</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Edit Email
              </button>

              <button
                type="button"
                disabled={!canResend || loading}
                onClick={handleResend}
                className="text-amber-800 font-bold hover:underline disabled:opacity-40 disabled:no-underline"
              >
                {canResend ? 'Resend Code' : `Resend Code in ${resendTimer}s`}
              </button>
            </div>
          </form>
        )}

        {/* -------------------- MODE 3: FORGOT PASSWORD -------------------- */}
        {authMode === 'forgot' && step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Forgot Step 2: Enter OTP & New Password */}
        {authMode === 'forgot' && step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1">
              <span className="text-xs font-bold text-stone-800">{email}</span>
              <p className="text-[11px] text-stone-500">Enter the 6-digit reset code and your new password.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                6-Digit Reset Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full py-2.5 text-center text-xl tracking-[6px] font-mono font-bold rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                New Password (Min. 6 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showForgotNewPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 bg-stone-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showForgotNewPassword ? "Hide password" : "Show password"}
                >
                  {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showForgotConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 bg-stone-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showForgotConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#022C22] hover:bg-[#064E3B] text-amber-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                disabled={!canResend || loading}
                onClick={handleResend}
                className="text-amber-800 font-bold hover:underline disabled:opacity-40 disabled:no-underline"
              >
                {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </form>
        )}
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
