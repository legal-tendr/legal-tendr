import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cases, messages, lawyers } from '../data/mock-data';

const Dashboard = () => {
  // Get the first few cases and messages for the dashboard preview
  const recentCases = cases.slice(0, 2);
  const recentMessages = messages.slice(0, 2).map(message => {
    // Find the lawyer associated with this message
    const lawyer = lawyers.find(l => l.id === message.lawyerId);
    return { ...message, lawyer };
  });

  return (
    <div>
        {/* Header with Greeting */}
        <header className="bg-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-md">
          <h1 className="text-2xl font-bold">Welcome back, Client!</h1>
          <p className="opacity-90 mt-1">Find legal expertise that fits your needs</p>
        </header>

        {/* Dashboard Content */}
        <div className="p-5 space-y-6">
          {/* Recent Cases Section */}
          <section className="bg-white rounded-xl shadow-card p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Recent Cases</h2>
              <a href="#" className="text-primary-400 text-sm font-medium">View All</a>
            </div>
            
            <div className="space-y-3">
              {recentCases.map(caseItem => {
                const lawyer = lawyers.find(l => l.id === caseItem.lawyerId);
                return (
                  <div key={caseItem.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{caseItem.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          caseItem.status === 'Active' ? 'bg-primary-400' : 'bg-yellow-400'
                        } mr-2`}></span>
                        <span className="text-sm text-gray-600">{caseItem.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {lawyer ? `Lawyer: ${lawyer.name}` : 'Unassigned'}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Messages Section */}
          <section className="bg-white rounded-xl shadow-card p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Recent Messages</h2>
              <a href="#" className="text-primary-400 text-sm font-medium">View All</a>
            </div>
            
            <div className="space-y-3">
              {recentMessages.map(message => (
                <div key={message.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={message.lawyer.image} 
                      alt={message.lawyer.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{message.lawyer.name}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links Section */}
          <section className="bg-white rounded-xl shadow-card p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Find a Specialist</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Legal Resources</span>
              </button>
            </div>
          </section>
        </div>
    </div>
  );
};

export default Dashboard;
