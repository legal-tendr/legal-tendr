import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { cases, lawyers } from '../data/mock-data';

const MyCases = () => {
  // Get lawyers for each case
  const casesWithLawyers = cases.map(caseItem => {
    const lawyer = lawyers.find(l => l.id === caseItem.lawyerId);
    return { ...caseItem, lawyer };
  });

  return (
    <div>
        {/* Header */}
        <header className="px-4 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">My Cases</h1>
        </header>

        {/* Cases List */}
        <div className="p-4">
          {casesWithLawyers.length > 0 ? (
            <div className="space-y-4">
              {casesWithLawyers.map(caseItem => (
                <div 
                  key={caseItem.id} 
                  className="bg-white p-4 rounded-xl shadow-card border border-gray-100"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{caseItem.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === 'Active' 
                        ? 'bg-primary-100 text-primary-700' 
                        : caseItem.status === 'Pending Consultation'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {caseItem.status}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center">
                    {caseItem.lawyer && (
                      <>
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={caseItem.lawyer.image} 
                            alt={caseItem.lawyer.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{caseItem.lawyer.name}</p>
                          <p className="text-xs text-gray-500">
                            {caseItem.lawyer.specialties[0]}
                          </p>
                        </div>
                      </>
                    )}
                    {!caseItem.lawyer && (
                      <p className="text-sm text-gray-500">No lawyer assigned</p>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <p className="text-gray-500">
                      Updated: {new Date(caseItem.lastUpdate).toLocaleDateString()}
                    </p>
                    <button className="flex items-center text-primary-400 font-medium">
                      Details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No cases found</p>
            </div>
          )}
        </div>
        
        {/* Floating Action Button for Adding New Case */}
        <div className="fixed bottom-24 right-6">
          <button 
            className="w-14 h-14 rounded-full bg-primary-400 text-white flex items-center justify-center shadow-lg"
            aria-label="Add new case"
          >
            <Plus size={24} />
          </button>
        </div>
    </div>
  );
};

export default MyCases;
