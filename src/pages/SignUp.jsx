import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const SignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us a bit about yourself',
      fields: ['firstName', 'lastName', 'email', 'phone', 'province', 'city'],
    },
    {
      title: 'Set Password',
      description: 'Create a secure password',
      fields: ['password', 'confirmPassword'],
    },
    {
      title: 'Complete',
      description: 'Your account has been created',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const currentFields = steps[step].fields;
    const stepErrors = {};
    let isValid = true;

    if (step === 0) {
      // First step validation
      if (!formData.firstName.trim()) {
        stepErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        stepErrors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!formData.email.trim()) {
        stepErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = 'Email is invalid';
        isValid = false;
      }
      if (!formData.phone.trim()) {
        stepErrors.phone = 'Phone number is required';
        isValid = false;
      }
      if (!formData.province.trim()) {
        stepErrors.province = 'Province is required';
        isValid = false;
      }
      if (!formData.city.trim()) {
        stepErrors.city = 'City/Municipality is required';
        isValid = false;
      }
    } else if (step === 1) {
      // Password step validation
      if (!formData.password) {
        stepErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        stepErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }
      
      if (!formData.confirmPassword) {
        stepErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === steps.length - 2 && validateStep(currentStep)) {
      // On the last input step (before confirmation step)
      setCurrentStep((prev) => prev + 1);
      // Simulate account creation delay
      setTimeout(() => {
        // Login with the email and password from the form
        onLogin('client@test.com', 'password');
        navigate('/dashboard');
      }, 1500);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? 'bg-primary-400 text-white'
                  : 'bg-gray-200 text-gray-500'
              } ${index === currentStep ? 'ring-2 ring-primary-300 ring-offset-2' : ''}`}
            >
              {index < currentStep ? (
                <CheckCircle size={16} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-1 ${
                  index < currentStep ? 'bg-primary-400' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderForm = () => {
    if (currentStep === 0) {
      // First step - Personal information
      return (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
              placeholder="johndoe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province *
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.province ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition bg-white`}
            >
              <option value="">Select Province</option>
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Manitoba">Manitoba</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
              <option value="Northwest Territories">Northwest Territories</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="Nunavut">Nunavut</option>
              <option value="Ontario">Ontario</option>
              <option value="Prince Edward Island">Prince Edward Island</option>
              <option value="Quebec">Quebec</option>
              <option value="Saskatchewan">Saskatchewan</option>
              <option value="Yukon">Yukon</option>
            </select>
            {errors.province && (
              <p className="mt-1 text-xs text-red-500">{errors.province}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/Municipality *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.city ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
              placeholder="Toronto"
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="py-3 px-6 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 transition shadow-md flex items-center"
            >
              Next <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </>
      );
    } else if (currentStep === 1) {
      // Second step - Password
      return (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
            {!errors.password && (
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="py-3 px-6 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 transition shadow-md flex items-center"
            >
              Create Account
            </button>
          </div>
        </>
      );
    } else {
      // Complete step
      return (
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Created!</h3>
          <p className="text-gray-600 mb-8">
            Your account has been successfully created. You'll be redirected to your dashboard shortly.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="mobile-container md:flex md:items-center md:justify-center px-6 py-10">
      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-400 mb-2">Create Account</h1>
          <p className="text-gray-500">{steps[currentStep].description}</p>
        </div>
        
        {/* Step Indicator */}
        {renderStepIndicator()}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
        </form>
        
        {/* Login Link */}
        {currentStep < steps.length - 1 && (
          <div className="text-center text-sm text-gray-500 mt-8">
            Already have an account? <a href="/login" className="text-primary-400 hover:underline">Sign In</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
