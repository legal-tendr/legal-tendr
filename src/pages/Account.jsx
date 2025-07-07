import React from 'react';
import { ChevronRight, Settings, CreditCard, HelpCircle, LogOut } from 'lucide-react';

const Account = ({ onLogout }) => {
  return (
    <div>
        {/* Header */}
        <header className="px-4 py-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 text-center">Account</h1>
        </header>
        
        {/* User Profile Section */}
        <div className="flex flex-col items-center pt-8 pb-6 bg-white border-b border-gray-200">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100 mb-3">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="User Profile"
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">John Smith</h2>
          <p className="text-gray-500 text-sm">john.smith@example.com</p>
          
          <button className="mt-3 px-4 py-2 border border-primary-400 text-primary-400 rounded-full text-sm font-medium">
            Edit Profile
          </button>
        </div>
        
        {/* Account Menu */}
        <div className="p-4 space-y-4">
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
          
          {/* Payment Methods */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 mr-3">
                  <CreditCard size={18} className="text-primary-400" />
                </div>
                <span className="text-gray-800">Payment Methods</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Help & Support */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 mr-3">
                  <HelpCircle size={18} className="text-primary-400" />
                </div>
                <span className="text-gray-800">Help & Support</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
          
          {/* Logout Button */}
          <div className="mt-8">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center px-4 py-3.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-primary-400"
            >
              <LogOut size={18} className="mr-2" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            LegalTendr App v1.0.0
          </p>
        </div>
    </div>
  );
};

export default Account;
