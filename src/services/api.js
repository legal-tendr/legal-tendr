// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Base API function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'KEY': API_KEY,
  };

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle different success response formats
    const isSuccess = data.status === 'SUCCESS' || response.ok;
    
    return { 
      success: isSuccess, 
      data, 
      status: response.status,
      message: data.message 
    };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message, status: error.status || 500 };
  }
};

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    return await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Send OTP
  sendOTP: async (email, processType = 'create_user') => {
    return await apiCall('/api/auth/send_otp', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        process_type: processType 
      }),
    });
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    return await apiCall('/api/auth/verify_otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Reset password
  resetPassword: async (email, password) => {
    return await apiCall('/api/auth/reset_password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Registration API functions
export const registrationAPI = {
  // Create new user
  createUser: async (email, password, userType) => {
    return await apiCall('/api/register/create_user', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        user_type: userType 
      }),
    });
  },

  // Insert client profile
  insertClientProfile: async (userId, firstname, middlename, lastname, gender, phoneNo, about) => {
    return await apiCall('/api/register/insert_client_profile', {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userId,
        firstname,
        middlename,
        lastname,
        gender,
        phone_no: phoneNo,
        about
      }),
    });
  },

  // Insert lawyer profile
  insertLawyerProfile: async (userId, firstname, middlename, lastname, gender, phoneNo, about, barIdNo, experienceYears) => {
    return await apiCall('/api/register/insert_lawyer_profile', {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userId,
        firstname,
        middlename,
        lastname,
        gender,
        phone_no: phoneNo,
        about,
        bar_id_no: barIdNo,
        experience_years: experienceYears
      }),
    });
  },

  // Get legal specializations
  getLegalSpecializations: async () => {
    return await apiCall('/api/get_legal_specializations', {
      method: 'GET',
    });
  },
};

// User Profile API functions
export const userAPI = {
  // Get user profile
  getUserProfile: async (userId) => {
    return await apiCall(`/api/user/get_user_profile/${userId}`, {
      method: 'GET',
    });
  },

  // Update client profile
  updateClientProfile: async (userId, firstname, middlename, lastname, gender, phoneNo, about) => {
    return await apiCall('/api/user/update_client_profile', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        firstname,
        middlename,
        lastname,
        gender,
        phone_no: phoneNo,
        about
      }),
    });
  },

  // Update lawyer profile
  updateLawyerProfile: async (userId, firstname, middlename, lastname, gender, phoneNo, about, barIdNo, experienceYears) => {
    return await apiCall('/api/user/update_lawyer_profile', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        firstname,
        middlename,
        lastname,
        gender,
        phone_no: phoneNo,
        about,
        bar_id_no: barIdNo,
        experience_years: experienceYears
      }),
    });
  },

  // Insert or update user location
  updateUserLocation: async (userId, latitude, longitude, city, region, country) => {
    return await apiCall('/api/user/insert_update_user_location', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        latitude,
        longitude,
        city,
        region,
        country
      }),
    });
  },

  // Get lawyer specializations
  getLawyerSpecializations: async (userId) => {
    return await apiCall(`/api/user/get_lawyer_specialization/${userId}`, {
      method: 'GET',
    });
  },

  // Insert or update lawyer specializations
  updateLawyerSpecializations: async (userId, specializationList) => {
    return await apiCall('/api/user/insert_update_lawyer_specialization', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        specialization_list: specializationList
      }),
    });
  },

  // Get client cases
  getClientCases: async (userId) => {
    return await apiCall(`/api/user/get_client_case/${userId}`, {
      method: 'GET',
    });
  },

  // Insert client case
  insertClientCase: async (userId, title, description, status, specializationId, openedDate, closedDate) => {
    return await apiCall('/api/user/insert_client_case', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        title,
        description,
        status,
        specialization_id: specializationId,
        opened_date: openedDate,
        closed_date: closedDate
      }),
    });
  },
};

// Matching API functions
export const matchAPI = {
  // Find nearby lawyers
  findNearbyLawyers: async (userId, radius) => {
    return await apiCall('/api/match/find_nearby_lawyers', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        radius
      }),
    });
  },

  // Get all lawyers by fetching all users with lawyer type
  getAllLawyers: async () => {
    // Since there's no direct "get all lawyers" endpoint, we'll create a mock response
    // This should be replaced with a proper backend endpoint
    return {
      success: true,
      data: [] // Empty for now until proper endpoint is available
    };
  },

  // Find lawyers based on case
  findLawyersBasedOnCase: async (userId) => {
    return await apiCall('/api/match/find_lawyers_based_on_case', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId
      }),
    });
  },

  // Client likes a lawyer
  insertClientLike: async (clientUserId, lawyerUserId) => {
    return await apiCall('/api/match/insert_client_likes', {
      method: 'POST',
      body: JSON.stringify({
        client_user_id: clientUserId,
        lawyer_user_id: lawyerUserId
      }),
    });
  },

  // Get client likes
  getClientLikes: async (userId) => {
    return await apiCall(`/api/match/get_client_likes/${userId}`, {
      method: 'GET',
    });
  },

  // Get who liked lawyer
  getWhoLikedLawyer: async (userId) => {
    return await apiCall(`/api/match/get_who_liked_lawyer/${userId}`, {
      method: 'GET',
    });
  },

  // Lawyer accepts like
  lawyerAcceptLike: async (clientUserId, lawyerUserId) => {
    return await apiCall('/api/match/lawyer_accept_like', {
      method: 'POST',
      body: JSON.stringify({
        client_user_id: clientUserId,
        lawyer_user_id: lawyerUserId
      }),
    });
  },
};

export default apiCall;
