import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Edit3, MapPin, Award } from 'lucide-react';
import { userAPI } from '../services/api';

const Dashboard = ({ user }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [lawyerSpecializations, setLawyerSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // Fetch user profile
        const profileResult = await userAPI.getUserProfile(user.id);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
          
          // If user is a lawyer, fetch specializations
          if (profileResult.data.user_type === 'lawyer') {
            const specializationsResult = await userAPI.getLawyerSpecializations(user.id);
            if (specializationsResult.success) {
              setLawyerSpecializations(specializationsResult.data);
            }
          }
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        setError('Network error loading profile');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  return (
    <div>
        {/* Header with Greeting */}
        <header className="bg-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-md">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-white bg-opacity-20 rounded w-48 mb-2"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-64"></div>
            </div>
          ) : userProfile ? (
            <>
              <h1 className="text-2xl font-bold">
                Welcome back, {userProfile.firstname} {userProfile.lastname}!
              </h1>
              <p className="opacity-90 mt-1">
                {userProfile.user_type === 'lawyer' 
                  ? 'Manage your legal practice and clients' 
                  : 'Find legal expertise that fits your needs'
                }
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Welcome back!</h1>
              <p className="opacity-90 mt-1">Loading your profile...</p>
            </>
          )}
        </header>

        {/* Dashboard Content */}
        <div className="p-5 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* User Profile Section */}
          {userProfile && (
            <section className="bg-white rounded-xl shadow-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                <button className="text-primary-400 text-sm font-medium flex items-center">
                  <Edit3 size={16} className="mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {userProfile.firstname} {userProfile.middlename} {userProfile.lastname}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{userProfile.user_type}</p>
                  </div>
                </div>
                
                {userProfile.phone_no && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <p className="text-sm text-gray-600">{userProfile.phone_no}</p>
                  </div>
                )}
                
                {userProfile.location && (
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-3" />
                    <p className="text-sm text-gray-600">
                      Lat: {userProfile.location.latitude}, Lng: {userProfile.location.longitude}
                    </p>
                  </div>
                )}
                
                {userProfile.about && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{userProfile.about}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Lawyer Specializations Section */}
          {userProfile?.user_type === 'lawyer' && lawyerSpecializations.length > 0 && (
            <section className="bg-white rounded-xl shadow-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Specializations</h2>
                <button className="text-primary-400 text-sm font-medium flex items-center">
                  <Edit3 size={16} className="mr-1" />
                  Manage
                </button>
              </div>
              
              <div className="space-y-3">
                {lawyerSpecializations.map(spec => (
                  <div key={spec.id} className="flex items-start p-3 border border-gray-100 rounded-lg">
                    <Award size={18} className="text-primary-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{spec.specialization}</h3>
                      <p className="text-sm text-gray-600 mt-1">{spec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Actions Section */}
          <section className="bg-white rounded-xl shadow-card p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <Edit3 size={20} className="text-primary-400" />
                </div>
                <span className="text-sm font-medium text-gray-700">Edit Profile</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <MapPin size={20} className="text-primary-400" />
                </div>
                <span className="text-sm font-medium text-gray-700">Update Location</span>
              </button>
            </div>
          </section>
        </div>
    </div>
  );
};

export default Dashboard;
