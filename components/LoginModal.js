import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';

export default function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // For forgot password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setEmail('');
      setError('');
      setSuccess('');
      setView('login');
      setRemember(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.trim() === '') {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);
      onClose();
      // Reset state
      setUsername('');
      setPassword('');
      setView('login');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      const token = res?.data?.resetToken;
      if (token) {
        setResetToken(token);
        setSuccess('Reset token generated. Proceed to reset password.');
        setView('reset');
      } else {
        setSuccess('If an account exists with this email, a reset link has been sent.');
      }
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.resetPassword({ resetToken, newPassword });
      setSuccess('Password reset successful. Please login.');
      setView('login');
    } catch (err) {
      setError('Failed to reset password. Please check your token.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = (newView) => {
    setView(newView);
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 sm:mx-6 p-0 relative overflow-hidden">
        <button
          onClick={() => { onClose(); setView('login'); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="grid md:grid-cols-2">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-1 text-gray-900">Login</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                {success}
              </div>
            )}

            {view === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Email Address
                  </label>
                  <input
                    id="username"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="you@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="password">
                      Password
                    </label>
                    <button type="button" onClick={() => toggleView('forgot')} className="text-xs text-primary-600 hover:text-primary-800">
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter 6 character or more"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-gray-300" />
                  <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-primary-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'LOGIN'}
                </button>
                <div className="flex items-center gap-2 my-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-xs text-gray-500">or login with</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="border border-gray-300 rounded-md py-2 font-medium text-gray-700 hover:bg-gray-50">Google</button>
                  <button type="button" className="border border-gray-300 rounded-md py-2 font-medium text-gray-700 hover:bg-gray-50">Facebook</button>
                </div>
              </form>
            ) : view === 'forgot' ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">Enter your email to receive a reset token.</p>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-primary-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center mt-2">
                  <button type="button" onClick={() => toggleView('login')} className="text-sm text-primary-600 hover:text-primary-800">
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resetToken">
                    Reset Token
                  </label>
                  <input
                    id="resetToken"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter reset token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-primary-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
                <div className="text-center mt-2">
                  <button type="button" onClick={() => toggleView('login')} className="text-sm text-primary-600 hover:text-primary-800">
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="hidden md:block bg-gradient-to-br from-purple-500 to-primary-600 text-white p-8">
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="rounded-xl bg-white/10 p-6">
                  <div className="mx-auto w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M12 8h.01M4 6h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <p className="text-center text-sm">Secure login for SAGROWINFOTECH users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
