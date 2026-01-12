"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // For forgot password
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("login"); // 'login' | 'forgot' | 'otp' | 'reset'
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval;
    if (view === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setLoginSuccess(false);

    if (user) {
      router.push("/dashboard");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || username.trim() === "" || !emailRegex.test(username)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password || password.trim() === "" || password.length < 6) {
      setPasswordError("Enter at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Pass skipRedirect=true to prevent immediate redirect if we want to show success message first
      // But here we can just let it redirect or handle it manually
      await login(username, password, true);
      setLoginSuccess(true);
      setSuccess("Login successful");
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      const errorMsg = err?.message || "Invalid email or password";
      if (errorMsg.includes("already logged in")) {
        setError(errorMsg);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess("OTP sent successfully to your email.");
      setView("otp");
      setTimer(60);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "";
      if (typeof msg === "string" && /user not found/i.test(msg)) {
        setEmailError(
          "The provided email address is not registered. Please enter a valid registered email address."
        );
      } else {
        setError(msg || "Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOtpError("");
    setIsLoading(true);

    if (!otp || otp.length !== 6 || isNaN(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.verifyOtp({ emailId: email, otp });
      const token = res?.data?.resetToken;
      if (token) {
        setResetToken(token);
      }
      setSuccess("OTP verified successfully.");
      setView("reset");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Invalid OTP";
      setOtpError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setOtpError("");
    setIsResending(true);

    try {
      await authApi.resendOtp(email);
      setSuccess("OTP resent successfully.");
      setTimer(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setIsLoading(true);
    try {
      if (!newPassword || newPassword.trim() === "" || newPassword.length < 6) {
        setNewPasswordError("Enter at least 6 characters");
        return;
      }
      if (!confirmPassword || confirmPassword !== newPassword) {
        setConfirmPasswordError("Passwords do not match");
        return;
      }
      await authApi.resetPassword({ resetToken, newPassword });
      setSuccess("Password reset successful. Please login.");
      setView("login");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to reset password. Please check your token.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = (newView) => {
    setView(newView);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Image/Theme */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/ai-placement-ecosystem.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 sm:mx-6 p-0 relative z-20 border border-gray-100">
        <div className="pt-8 px-6 sm:px-8 text-center rounded-t-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {view === "login"
                ? "USER LOGIN"
                : view === "forgot"
                ? "FORGOT PASSWORD"
                : view === "otp"
                ? "VERIFY OTP"
                : "RESET PASSWORD"}
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8 pt-4">
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                {success}
              </div>
            )}

            {view === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label
                    className="block text-primary-900 text-sm font-semibold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="email"
                    className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      emailError
                        ? "border-red-400 focus:ring-red-500"
                        : "focus:ring-primary-500"
                    }`}
                    placeholder="you@example.com"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    required
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-600">{emailError}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className="block text-primary-900 text-sm font-semibold"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleView("forgot")}
                      className="text-xs font-medium text-primary-600 hover:text-primary-800"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showLoginPassword ? "text" : "password"}
                      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all pr-12 ${
                        passwordError
                          ? "border-red-400 focus:ring-red-500"
                          : "focus:ring-primary-500"
                      }`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      required
                    />
                    {passwordError && (
                      <p className="mt-1 text-xs text-red-600">
                        {passwordError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showLoginPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="1"
                            y1="1"
                            x2="23"
                            y2="23"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 font-medium"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-[0.98] ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Logging in..." : "LOGIN"}
                </button>
              </form>
            ) : view === "forgot" ? (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Enter your registered email address
                </p>

                <div>
                  <label
                    className="block text-primary-900 text-sm font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email Id
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      emailError
                        ? "border-red-400 focus:ring-red-500"
                        : "focus:ring-primary-500"
                    }`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    required
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-600">{emailError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-[0.98] ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Submiting..." : "Submit"}
                </button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => toggleView("login")}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : view === "otp" ? (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Enter the 6-digit OTP sent to your email
                </p>
                <div>
                  <label
                    className="block text-primary-900 text-sm font-semibold mb-2"
                    htmlFor="otp"
                  >
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-center tracking-widest text-lg ${
                      otpError
                        ? "border-red-400 focus:ring-red-500"
                        : "focus:ring-primary-500"
                    }`}
                    placeholder="------"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOtp(val);
                      if (otpError) setOtpError("");
                    }}
                    required
                  />
                  {otpError && (
                    <p className="mt-1 text-xs text-red-600">{otpError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-[0.98] ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timer > 0 || isResending}
                    className={`text-sm font-bold ${
                      timer > 0 || isResending
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-primary-600 hover:text-primary-800"
                    }`}
                  >
                    {isResending
                      ? "Resending..."
                      : timer > 0
                      ? `Resend OTP in ${timer}s`
                      : "Resend OTP"}
                  </button>
                </div>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => toggleView("login")}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <label
                    className="block text-primary-900 text-sm font-semibold mb-2"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all pr-12 ${
                        newPasswordError
                          ? "border-red-400 focus:ring-red-500"
                          : "focus:ring-primary-500"
                      }`}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (newPasswordError) setNewPasswordError("");
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="1"
                            y1="1"
                            x2="23"
                            y2="23"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {newPasswordError && (
                    <p className="mt-1 text-xs text-red-600">
                      {newPasswordError}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-primary-900 text-sm font-semibold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all pr-12 ${
                        confirmPasswordError
                          ? "border-red-400 focus:ring-red-500"
                          : "focus:ring-primary-500"
                      }`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmPasswordError) setConfirmPasswordError("");
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="1"
                            y1="1"
                            x2="23"
                            y2="23"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1 text-xs text-red-600">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-[0.98] ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => toggleView("login")}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
