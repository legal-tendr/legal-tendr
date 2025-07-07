import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password');
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
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm">
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
              className="w-full py-3 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 transition shadow-lg"
            >
              Sign In
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
            <a href="#" className="text-primary-400 hover:underline">Forgot Password?</a>
            <div className="mt-2">
              Don't have an account? <a href="/signup" className="text-primary-400 hover:underline">Sign Up</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
