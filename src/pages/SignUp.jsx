import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { authAPI, registrationAPI } from '../services/api';

const SignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userType: 'Client',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    about: '',
    password: '',
    confirmPassword: '',
    otp: '',
    // Lawyer-specific fields
    barIdNo: '',
    experienceYears: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const steps = [
    {
      title: 'User Type',
      description: 'Are you a client or lawyer?',
      fields: ['userType'],
    },
    {
      title: 'Personal Information',
      description: 'Tell us a bit about yourself',
      fields: ['firstName', 'middleName', 'lastName', 'email', 'phone', 'gender', 'about'],
    },
    {
      title: 'Set Password',
      description: 'Create a secure password',
      fields: ['password', 'confirmPassword'],
    },
    {
      title: 'Complete',
      description: 'Account created successfully',
      fields: [],
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
      // User type step validation
      if (!formData.userType) {
        stepErrors.userType = 'Please select a user type';
        isValid = false;
      }
    } else if (step === 1) {
      // Personal information step validation
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
      if (!formData.gender.trim()) {
        stepErrors.gender = 'Gender is required';
        isValid = false;
      }
      if (!formData.about.trim()) {
        stepErrors.about = 'About section is required';
        isValid = false;
      }
      // Lawyer-specific validation
      if (formData.userType === 'Lawyer') {
        if (!formData.barIdNo.trim()) {
          stepErrors.barIdNo = 'Bar ID number is required for lawyers';
          isValid = false;
        }
        if (!formData.experienceYears || formData.experienceYears < 0) {
          stepErrors.experienceYears = 'Experience years is required for lawyers';
          isValid = false;
        }
      }
    } else if (step === 2) {
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
    } else if (step === 3) {
      // OTP step validation
      if (!formData.otp.trim()) {
        stepErrors.otp = 'OTP is required';
        isValid = false;
      } else if (formData.otp.length !== 6) {
        stepErrors.otp = 'OTP must be 6 digits';
        isValid = false;
      }
    }

    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      // If moving from password step, create user account first
      if (currentStep === 2) {
        await createUserAccount();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const createUserAccount = async () => {
    console.log('createUserAccount called');
    setLoading(true);
    setErrors({});
    
    try {
      console.log('Calling registrationAPI.createUser with:', {
        email: formData.email,
        userType: formData.userType
      });
      
      // Step 1: Create user account only
      const userResult = await registrationAPI.createUser(
        formData.email, 
        formData.password, 
        formData.userType
      );
      
      console.log('createUser result:', userResult);
      console.log('Full userResult.data:', userResult.data);
      
      if (!userResult.success) {
        setErrors({ general: userResult.error || 'Failed to create user account.' });
        setLoading(false);
        return;
      }

      // Store user ID for profile creation
      const userId = userResult.data?.user_id || userResult.data?.id;
      console.log('User created with ID:', userId);
      console.log('Available keys in data:', Object.keys(userResult.data || {}));
      setFormData(prev => ({ ...prev, userId }));

      // Move to next step (completion) after successful user creation
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Error in createUserAccount:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      const result = await authAPI.sendOTP(formData.email, 'create_user');
      
      if (result.success) {
        setOtpSent(true);
        setShowOtpVerification(true);
      } else {
        setErrors({ general: result.error || 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp.trim()) {
      setErrors({ otp: 'Please enter the OTP code' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await authAPI.verifyOTP(formData.email, formData.otp);
      
      if (result.success) {
        setOtpVerified(true);
        // Create profile after OTP verification
        await createUserProfile(formData.userId);
        // Redirect to login after successful verification
        navigate('/login');
      } else {
        setErrors({ otp: result.error || 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const skipOtpVerification = async () => {
    // Skip OTP and create profile directly
    await createUserProfile(formData.userId);
    // Redirect to login after skipping verification
    navigate('/login');
  };

  const createUserProfile = async (userId) => {
    try {
      console.log('Creating user profile for userId:', userId);

      // Create user profile based on user type
      let profileResult;
      if (formData.userType === 'client') {
        profileResult = await registrationAPI.insertClientProfile(
          userId,
          formData.firstName,
          formData.lastName,
          formData.middleName || '',
          formData.gender || '',
          formData.phoneNumber || '',
          formData.about || ''
        );
      } else if (formData.userType === 'lawyer') {
        profileResult = await registrationAPI.insertLawyerProfile(
          userId,
          formData.firstName,
          formData.lastName,
          formData.middleName || '',
          formData.gender || '',
          formData.phoneNumber || '',
          formData.about || ''
        );
      }

      console.log('Profile creation result:', profileResult);

      if (!profileResult?.success) {
        console.log('Profile creation failed:', profileResult?.error);
        setErrors({ general: profileResult?.error || 'Failed to create profile. Please try again.' });
        return;
      }

      console.log('Profile created successfully, proceeding to completion');

      // Success - proceed to completion step
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }
  };


  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No longer needed since OTP step is removed
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
      // First step - User Type Selection
      return (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a... *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'Client' }))}
                className={`p-6 border-2 rounded-lg text-center transition ${
                  formData.userType === 'Client'
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-semibold mb-2">Client</div>
                <div className="text-sm text-gray-600">
                  Looking for legal services
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'Lawyer' }))}
                className={`p-6 border-2 rounded-lg text-center transition ${
                  formData.userType === 'Lawyer'
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-semibold mb-2">Lawyer</div>
                <div className="text-sm text-gray-600">
                  Providing legal services
                </div>
              </button>
            </div>
            {errors.userType && (
              <p className="mt-2 text-xs text-red-500">{errors.userType}</p>
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
      // Second step - Personal Information
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
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.middleName ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
              placeholder="M."
            />
            {errors.middleName && (
              <p className="mt-1 text-xs text-red-500">{errors.middleName}</p>
            )}
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
              placeholder="+639171234567"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition bg-white`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About *
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-3 border ${errors.about ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition resize-none`}
              placeholder={formData.userType === 'Client' ? 'Tell us about your legal needs...' : 'Tell us about your legal expertise...'}
            />
            {errors.about && (
              <p className="mt-1 text-xs text-red-500">{errors.about}</p>
            )}
          </div>

          {/* Lawyer-specific fields */}
          {formData.userType === 'Lawyer' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bar ID Number *
                </label>
                <input
                  type="text"
                  name="barIdNo"
                  value={formData.barIdNo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.barIdNo ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
                  placeholder="BR-2023-7890"
                />
                {errors.barIdNo && (
                  <p className="mt-1 text-xs text-red-500">{errors.barIdNo}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border ${errors.experienceYears ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition`}
                  placeholder="5"
                />
                {errors.experienceYears && (
                  <p className="mt-1 text-xs text-red-500">{errors.experienceYears}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="py-3 px-6 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>
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
    } else if (currentStep === 2) {
      // Third step - Password
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
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="py-3 px-6 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 transition shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </>
      );
    } else if (currentStep === 3) {
      // Final step - Success with optional OTP verification
      if (otpVerified) {
        // Show final success screen
        return (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Created Successfully!</h3>
            <p className="text-gray-600 mb-8">
              Your account and profile have been created. Please log in to access your dashboard and complete your profile setup.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="py-3 px-8 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 transition shadow-md"
            >
              Go to Login
            </button>
          </div>
        );
      } else {
        // Show optional OTP verification
        return (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Created!</h3>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You can optionally verify your email address for added security.
            </p>

            {!showOtpVerification ? (
              // Initial OTP options
              <div className="space-y-4">
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Verify Email Address'}
                </button>
                <button
                  onClick={skipOtpVerification}
                  className="w-full py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                >
                  Skip Verification
                </button>
              </div>
            ) : (
              // OTP input form
              <div className="space-y-4">
                {errors.general && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {errors.general}
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a verification code to <strong>{formData.email}</strong>
                </p>

                <div>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.otp ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition text-center text-lg tracking-widest`}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                  {errors.otp && (
                    <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={verifyOTP}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <button
                    onClick={skipOtpVerification}
                    className="w-full py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  >
                    Skip Verification
                  </button>
                </div>

                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-sm text-primary-400 hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="mobile-container md:flex md:items-center md:justify-center px-6 py-10">
      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-400 mb-2">Create Account</h1>
          <p className="text-gray-500">{steps[currentStep]?.description || ''}</p>
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
