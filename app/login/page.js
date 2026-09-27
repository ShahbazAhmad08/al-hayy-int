'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Lock, ArrowRight, Loader2, Package, LogOut, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/orders';

  const { user, customerLogin, customerRegister, customerLogout } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isLoginTab) {
      const res = await customerLogin(emailOrUsername, password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.message || 'Unable to sign in. Please check credentials.');
      }
    } else {
      const res = await customerRegister(username, emailOrUsername, password);
      if (res && res.success) {
        setSuccessMsg('Account created! Logging in...');
        await customerLogin(username, password);
        router.push(redirectUrl);
      } else {
        // Local fallback customer login
        await customerLogin(username || emailOrUsername, password);
        router.push(redirectUrl);
      }
    }
    setLoading(false);
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
            {isLoginTab ? 'Sign In to Your Account' : 'Create Customer Account'}
          </h1>
          <p className="text-xs text-stone-500">
            Access order tracking, express checkout & bespoke member privileges
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isLoginTab ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isLoginTab ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500'
            }`}
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoginTab && (
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
          )}

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
            className="w-full py-3 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isLoginTab ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading sign in portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
