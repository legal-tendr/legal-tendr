import { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      const result = await authAPI.login(email, password);
      
      if (result.success) {
        // Call the parent's onLogin function with user data from API response
        console.log('Login.jsx - Login successful, result:', result);
        onLogin(email, password, result);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setForgotPasswordStep(1);
    setForgotPasswordData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setForgotPasswordError('');
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotPasswordData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setForgotPasswordError('');
    setPasswordResetSuccess(false);
  };

  const handleForgotPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendPasswordResetOTP = async () => {
    if (!forgotPasswordData.email.trim()) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      const result = await authAPI.sendOTP(forgotPasswordData.email, 'reset_password');
      
      if (result.success) {
        setForgotPasswordStep(2);
      } else {
        setForgotPasswordError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setForgotPasswordError('Network error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const verifyPasswordResetOTP = async () => {
    if (!forgotPasswordData.otp.trim()) {
      setForgotPasswordError('Please enter the OTP code');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      const result = await authAPI.verifyOTP(forgotPasswordData.email, forgotPasswordData.otp);
      
      if (result.success) {
        setForgotPasswordStep(3);
      } else {
        setForgotPasswordError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setForgotPasswordError('Network error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!forgotPasswordData.newPassword.trim()) {
      setForgotPasswordError('Please enter a new password');
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotPasswordError('Passwords do not match');
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setForgotPasswordError('Password must be at least 6 characters long');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      const result = await authAPI.resetPassword(forgotPasswordData.email, forgotPasswordData.newPassword);
      
      if (result.success) {
        setPasswordResetSuccess(true);
        setForgotPasswordError('');
      } else {
        setForgotPasswordError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setForgotPasswordError('Network error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  
  return (
    <div className="mobile-container flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary-400 mb-2">LegalTendr</h1>
          <p className="text-gray-500">Find your legal match</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-center text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition"
              placeholder="client@test.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-6">
            <button 
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-primary-400 hover:underline"
            >
              Forgot Password?
            </button>
            <div className="mt-2">
              Don't have an account? <a href="/signup" className="text-primary-400 hover:underline">Sign Up</a>
            </div>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {forgotPasswordStep === 1 && 'Reset Password'}
                {forgotPasswordStep === 2 && 'Verify OTP'}
                {forgotPasswordStep === 3 && 'New Password'}
              </h2>
              <button 
                onClick={closeForgotPasswordModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {forgotPasswordError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {forgotPasswordError}
                </div>
              )}

              {forgotPasswordStep === 1 && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your email address and we'll send you a verification code to reset your password.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button
                    onClick={sendPasswordResetOTP}
                    disabled={forgotPasswordLoading}
                    className="w-full py-3 px-4 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </>
              )}

              {forgotPasswordStep === 2 && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    We've sent a verification code to <strong>{forgotPasswordData.email}</strong>
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={forgotPasswordData.otp}
                      onChange={handleForgotPasswordInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none text-center text-lg tracking-widest"
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                    />
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={verifyPasswordResetOTP}
                      disabled={forgotPasswordLoading}
                      className="w-full py-3 px-4 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {forgotPasswordLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <button
                      onClick={sendPasswordResetOTP}
                      disabled={forgotPasswordLoading}
                      className="w-full text-sm text-primary-400 hover:underline disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </>
              )}

              {forgotPasswordStep === 3 && !passwordResetSuccess && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your new password below.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={forgotPasswordData.newPassword}
                        onChange={handleForgotPasswordInputChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={forgotPasswordData.confirmPassword}
                      onChange={handleForgotPasswordInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    onClick={resetPassword}
                    disabled={forgotPasswordLoading}
                    className="w-full py-3 px-4 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}

              {passwordResetSuccess && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Password Reset Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                  <button
                    onClick={closeForgotPasswordModal}
                    className="w-full py-3 px-4 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors"
                  >
                    Continue to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
