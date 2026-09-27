'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, User, ArrowRight, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminAuthPage() {
  const router = useRouter();
  const { adminLogin, adminUser, isAdmin, loading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-redirect to dashboard if already authenticated as admin
  useEffect(() => {
    if (!authLoading && adminUser && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [adminUser, isAdmin, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await adminLogin(username.trim(), password.trim());
      if (res && res.success) {
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(res?.message || 'Unauthorized: Invalid administrative credentials.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during admin authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Return to Store */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-stone-200/80 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="relative h-10 w-40 mx-auto">
              <Image src="/logo.avif" alt="Al Hayy Kashmir" fill className="object-contain" priority />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 font-serif-luxury">
              Administrator Sign In
            </h1>
            <p className="text-xs text-stone-500">
              Authorized personnel only. Access product catalog, inquiries, and orders.
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200 animate-in fade-in duration-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure Hint */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-[11px] text-stone-600 space-y-1">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <span>Default Admin Credentials:</span>
            </div>
            <div className="flex items-center justify-between text-stone-700 pt-0.5">
              <span>Username: <strong className="text-stone-950 font-mono bg-stone-200/70 px-1.5 py-0.5 rounded">admin</strong></span>
              <span>Password: <strong className="text-stone-950 font-mono bg-stone-200/70 px-1.5 py-0.5 rounded">admin123</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
