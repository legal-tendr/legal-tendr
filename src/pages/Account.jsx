import React, { useState, useEffect } from 'react';
import { ChevronRight, Settings, User, MapPin, LogOut, Edit3, Phone, Mail, Shield, X, Save } from 'lucide-react';
import { userAPI } from '../services/api';

const Account = ({ onLogout, user }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    gender: '',
    phone_no: '',
    about: ''
  });

  console.log('Account component rendered with props:', { onLogout: !!onLogout, user });

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('Account component - user data:', user);
      console.log('Account component - user.id:', user?.id);
      
      if (!user?.id) {
        console.log('Account component - No user ID found, skipping profile fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Account component - Calling getUserProfile with ID:', user.id);
        const result = await userAPI.getUserProfile(user.id);
        console.log('Account component - getUserProfile result:', result);
        console.log('Account component - Full API response:', JSON.stringify(result, null, 2));
        
        if (result.success) {
          if (result.data) {
            // Handle nested response structure - try multiple levels
            let profileData = result.data;
            if (result.data.data) {
              profileData = result.data.data;
            }
            if (result.data.user_profile) {
              profileData = result.data.user_profile;
            }
            
            console.log('Account component - Final extracted profile data:', profileData);
            
            if (profileData && typeof profileData === 'object') {
              setUserProfile(profileData);
            } else {
              console.error('Profile data is not a valid object:', profileData);
              setError('Invalid profile data received');
            }
          } else {
            console.error('No data in successful response:', result);
            setError('No profile data found');
          }
        } else {
          setError(result.error || 'Failed to load profile');
          console.error('Account component - Profile fetch failed:', result);
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  // Initialize edit form data when userProfile is loaded
  useEffect(() => {
    console.log('Initializing edit form data with userProfile:', userProfile);
    if (userProfile) {
      const formData = {
        firstname: userProfile.firstname || userProfile.first_name || '',
        middlename: userProfile.middlename || userProfile.middle_name || '',
        lastname: userProfile.lastname || userProfile.last_name || '',
        gender: userProfile.gender || '',
        phone_no: userProfile.phone_no || userProfile.phoneNumber || '',
        about: userProfile.about || ''
      };
      console.log('Setting edit form data:', formData);
      setEditFormData(formData);
    }
  }, [userProfile]);

  const handleEditProfile = () => {
    setShowEditModal(true);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditError(null);
    // Reset form data to original values
    if (userProfile) {
      const formData = {
        firstname: userProfile.firstname || userProfile.first_name || '',
        middlename: userProfile.middlename || userProfile.middle_name || '',
        lastname: userProfile.lastname || userProfile.last_name || '',
        gender: userProfile.gender || '',
        phone_no: userProfile.phone_no || userProfile.phoneNumber || '',
        about: userProfile.about || ''
      };
      setEditFormData(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      const updateFunction = user.userType === 'lawyer' 
        ? userAPI.updateLawyerProfile 
        : userAPI.updateClientProfile;

      const result = await updateFunction(
        user.id,
        editFormData.firstname,
        editFormData.middlename,
        editFormData.lastname,
        editFormData.gender,
        editFormData.phone_no,
        editFormData.about
      );

      if (result.success) {
        console.log('Profile update successful, refreshing profile data...');
        // Refresh user profile data
        const profileResult = await userAPI.getUserProfile(user.id);
        console.log('Profile refresh result:', profileResult);
        console.log('Profile refresh raw data:', profileResult.data);
        
        if (profileResult.success) {
          if (profileResult.data) {
            // Handle nested response structure - try multiple levels
            let profileData = profileResult.data;
            if (profileResult.data.data) {
              profileData = profileResult.data.data;
            }
            if (profileResult.data.user_profile) {
              profileData = profileResult.data.user_profile;
            }
            
            console.log('Post-update extracted profile data:', profileData);
            
            if (profileData && typeof profileData === 'object') {
              setUserProfile(profileData);
            } else {
              console.error('Invalid profile data after update:', profileData);
              setEditError('Invalid profile data received');
            }
          } else {
            console.error('No data in post-update response:', profileResult);
            setEditError('No profile data found after update');
          }
        } else {
          console.error('Failed to refresh profile data:', profileResult);
          setEditError('Failed to refresh profile data');
        }
        setShowEditModal(false);
      } else {
        setEditError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setEditError('Network error. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setEditLoading(false);
    }
  };
  return (
    <div>
        {/* Header */}
        <header className="px-4 py-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 text-center">Account</h1>
        </header>
        
        {/* User Profile Section */}
        <div className="flex flex-col items-center pt-8 pb-6 bg-white border-b border-gray-200">
          {loading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <User size={32} className="text-gray-400" />
              </div>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : userProfile ? (
            <>
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-primary-100 mb-3">
                <User size={32} className="text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {userProfile.firstname} {userProfile.lastname}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="flex items-center mt-2">
                <span className={`inline-block w-2 h-2 rounded-full ${user.isVerified ? 'bg-primary-400' : 'bg-yellow-400'} mr-2`}></span>
                <span className="text-xs text-gray-500 capitalize">
                  {user.isVerified ? 'Verified' : 'Unverified'} {user.userType}
                </span>
              </div>
              
              <button 
                onClick={handleEditProfile}
                className="mt-3 px-4 py-2 border border-primary-400 text-primary-400 rounded-full text-sm font-medium flex items-center hover:bg-primary-50 transition-colors"
              >
                <Edit3 size={16} className="mr-1" />
                Edit Profile
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <User size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No profile data</p>
            </div>
          )}
        </div>
        
        {/* Profile Details Section */}
        {userProfile && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Profile Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>
                
                {userProfile.phone_no && (
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-800">{userProfile.phone_no}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium text-gray-800 capitalize">{user.userType}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Shield size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Verification Status</p>
                    <p className={`font-medium ${user.isVerified ? 'text-primary-600' : 'text-yellow-600'}`}>
                      {user.isVerified ? 'Verified' : 'Pending Verification'}
                    </p>
                  </div>
                </div>
                
                {userProfile.location && (
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">
                        {userProfile.location.latitude}, {userProfile.location.longitude}
                      </p>
                    </div>
                  </div>
                )}
                
                {userProfile.about && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">About</p>
                    <p className="text-gray-800">{userProfile.about}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="p-4 space-y-4">
          {/* Edit Profile */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={handleEditProfile}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 mr-3">
                  <Edit3 size={18} className="text-primary-400" />
                </div>
                <span className="text-gray-800">Edit Profile</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Update Location */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 mr-3">
                  <MapPin size={18} className="text-primary-400" />
                </div>
                <span className="text-gray-800">Update Location</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Settings */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 mr-3">
                  <Settings size={18} className="text-primary-400" />
                </div>
                <span className="text-gray-800">Settings</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Logout Button */}
          <div className="mt-8">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center px-4 py-3.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-red-600"
            >
              <LogOut size={18} className="mr-2" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            LegalTendr App v1.0.0
          </p>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
                <button 
                  onClick={handleCloseEditModal}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {editError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {editError}
                  </div>
                )}

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={editFormData.firstname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middlename"
                    value={editFormData.middlename}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                    placeholder="Enter your middle name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={editFormData.lastname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_no"
                    value={editFormData.phone_no}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                    placeholder="+639171234567"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={editFormData.about}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-200">
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={editLoading || !editFormData.firstname || !editFormData.lastname}
                  className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-1" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Account;
