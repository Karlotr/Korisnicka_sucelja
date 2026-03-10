'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

function hasRecoveryParams() {
  if (typeof window === 'undefined') {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return (
    searchParams.get('type') === 'recovery' ||
    hashParams.get('type') === 'recovery' ||
    searchParams.has('code') ||
    searchParams.has('token_hash') ||
    hashParams.has('access_token')
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const syncRecoveryState = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!sessionError && data.session) {
        setIsRecoverySession(true);
      } else if (hasRecoveryParams()) {
        setIsRecoverySession(true);
      }

      setIsCheckingSession(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
        setIsCheckingSession(false);
      }
    });

    void syncRecoveryState();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setIsUpdated(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">
            Choose a new password for your account.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {isUpdated ? (
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Password updated</h2>
                <p className="text-sm text-gray-400">
                  Your password has been changed successfully. You can now sign in with the new password.
                </p>
              </div>
              <Link href="/auth/login" className="block">
                <Button
                  type="button"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3"
                >
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : isCheckingSession ? (
            <div className="py-8 text-center text-gray-400">
              Validating recovery link...
            </div>
          ) : !isRecoverySession ? (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Invalid or expired link</h2>
                <p className="text-sm text-gray-400">
                  Request a new password reset email and open the latest link from your inbox.
                </p>
              </div>
              <Link href="/auth/forgot-password" className="block">
                <Button
                  type="button"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3"
                >
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3"
                isLoading={isLoading}
              >
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
