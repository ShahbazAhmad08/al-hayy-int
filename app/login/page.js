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
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/orders';

  const { user, customerLogin, sendEmailOtp, verifyOtpAndRegister, customerLogout } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  // OTP Registration States
  const [registerStep, setRegisterStep] = useState(1); // 1 = Details, 2 = OTP Verification
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (registerStep === 2 && resendTimer > 0) {
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
  }, [registerStep, resendTimer]);

  // If already signed in, redirect or show profile
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

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await customerLogin(emailOrUsername, password);
    if (res.success) {
      router.push(redirectUrl);
    } else {
      setErrorMsg(res.message || 'Unable to sign in. Please check credentials.');
    }
    setLoading(false);
  };

  // Handle Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendEmailOtp(email, username);
      if (res && res.success) {
        setRegisterStep(2);
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`Verification code sent to ${email}. Please check your inbox.`);
      } else {
        setErrorMsg(res?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await sendEmailOtp(email, username);
      if (res && res.success) {
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`A fresh OTP has been sent to ${email}`);
      } else {
        setErrorMsg(res?.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Verify OTP & Create Account
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await verifyOtpAndRegister(username, email, password, otp.trim());
      if (res && res.success) {
        setSuccessMsg('Email verified successfully! Creating your atelier account...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      } else {
        setErrorMsg(res?.message || 'Invalid or expired OTP. Please check code or request a new one.');
      }
    } catch (err) {
      setErrorMsg('Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      {redirectUrl === '/checkout' && (
        <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-center space-y-1">
          <span className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Please sign in to proceed with secure checkout
          </span>
          <p className="text-[11px] text-stone-500">Your bag items are saved safely.</p>
        </div>
      )}

      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-lg space-y-6">
        <div className="text-center space-y-3">
          <div className="relative h-10 w-36 mx-auto">
            <Image src="/logo.avif" alt="Al Hayy" fill className="object-contain" priority />
          </div>
          <h1 className="font-serif-luxury text-xl font-bold text-stone-900">
            {isLoginTab 
              ? 'Sign In to Your Account' 
              : registerStep === 1 
                ? 'Create Customer Account' 
                : 'Verify Your Email OTP'}
          </h1>
          <p className="text-xs text-stone-500">
            {isLoginTab
              ? 'Access order tracking, express checkout & bespoke member privileges'
              : registerStep === 1
                ? 'An OTP verification code will be sent to your email address'
                : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => { 
              setIsLoginTab(true); 
              setErrorMsg(''); 
              setSuccessMsg(''); 
              setRegisterStep(1); 
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isLoginTab ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { 
              setIsLoginTab(false); 
              setErrorMsg(''); 
              setSuccessMsg(''); 
              setRegisterStep(1); 
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isLoginTab ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500'
            }`}
          >
            Register (OTP)
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 animate-in fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 animate-in fade-in">
            {successMsg}
          </div>
        )}

        {/* FORM 1: CUSTOMER LOGIN */}
        {isLoginTab && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Email or Mobile *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="patron@example.com"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-sm disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM 2: STEP 1 - USER REGISTRATION DETAILS */}
        {!isLoginTab && registerStep === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aisha Begum"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Email Address (for OTP) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="patron@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-sm disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Send Email Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM 3: STEP 2 - 6-DIGIT EMAIL OTP VERIFICATION */}
        {!isLoginTab && registerStep === 2 && (
          <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5 text-xs animate-in zoom-in-95 duration-200">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1">
              <span className="text-[11px] text-stone-500 block">OTP Sent to:</span>
              <strong className="text-stone-900 font-mono text-xs">{email}</strong>
              <button
                type="button"
                onClick={() => { setRegisterStep(1); setErrorMsg(''); }}
                className="text-[10px] text-amber-700 hover:underline block mx-auto pt-1 font-semibold"
              >
                Change email address
              </button>
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1.5 text-center">
                Enter 6-Digit Verification Code *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border-2 border-stone-300 text-center font-mono text-base tracking-[0.4em] font-bold text-stone-900 focus:outline-none focus:border-stone-950 focus:ring-0"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Create Account</span>
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="text-center pt-2">
              {resendTimer > 0 ? (
                <span className="text-[11px] text-stone-400">
                  Resend OTP in <strong className="text-stone-700">{resendTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-xs font-bold text-stone-900 hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Verification Code</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Loading sign in portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
