import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Calendar, User, FileText, X, Save } from 'lucide-react';
import { userAPI } from '../services/api';

const MyCases = ({ user }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [newCaseData, setNewCaseData] = useState({
    title: '',
    description: '',
    specialization: '',
    status: 'In Progress'
  });

  useEffect(() => {
    const fetchCases = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching cases for user ID:', user.id);
        const result = await userAPI.getClientCases(user.id);
        console.log('Get client cases result:', result);
        console.log('Full API response:', JSON.stringify(result, null, 2));
        
        if (result.success) {
          if (result.data) {
            // Handle nested response structure
            let casesData = result.data;
            if (result.data.data) {
              casesData = result.data.data;
            }
            
            console.log('Final cases data:', casesData);
            
            if (Array.isArray(casesData)) {
              setCases(casesData);
            } else {
              console.error('Cases data is not an array:', casesData);
              setError('Invalid cases data received');
            }
          } else {
            console.error('No data in successful response:', result);
            setError('No cases data found');
          }
        } else {
          setError(result.error || result.message || 'Failed to load cases');
          console.error('Cases fetch failed:', result);
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user?.id]);

  const handleAddCase = () => {
    setShowAddModal(true);
    setAddError(null);
    setNewCaseData({
      title: '',
      description: '',
      specialization: '',
      status: 'In Progress'
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setAddError(null);
    setNewCaseData({
      title: '',
      description: '',
      specialization: '',
      status: 'In Progress'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCaseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCase = async () => {
    if (!newCaseData.title.trim() || !newCaseData.description.trim()) {
      setAddError('Title and description are required');
      return;
    }

    setAddLoading(true);
    setAddError(null);

    try {
      console.log('Creating case with data:', newCaseData);
      
      // Map specialization name to ID - for now use 1 as default
      let specializationId = 1;
      if (newCaseData.specialization) {
        // You could add a mapping here based on specialization names
        // For now, just use 1 as default
        specializationId = 1;
      }

      const result = await userAPI.insertClientCase(
        user.id,
        newCaseData.title,
        newCaseData.description,
        newCaseData.status,
        specializationId,
        new Date().toISOString().split('T')[0], // opened_date
        newCaseData.status === 'Closed' ? new Date().toISOString().split('T')[0] : null // closed_date
      );

      console.log('Case creation result:', result);

      if (result.success) {
        console.log('Case created successfully, refreshing cases list...');
        // Refresh cases list
        const casesResult = await userAPI.getClientCases(user.id);
        console.log('Cases refresh result:', casesResult);
        
        if (casesResult.success && casesResult.data) {
          // Handle nested response structure
          const casesData = casesResult.data.data || casesResult.data;
          console.log('Setting cases data:', casesData);
          setCases(casesData);
        }
        setShowAddModal(false);
      } else {
        console.error('Case creation failed:', result);
        setAddError(result.error || result.message || 'Failed to create case');
      }
    } catch (err) {
      setAddError('Network error. Please try again.');
      console.error('Error creating case:', err);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
        {/* Header */}
        <header className="px-4 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">My Cases</h1>
        </header>

        {/* Cases List */}
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-card border border-gray-100 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : cases.length > 0 ? (
            <div className="space-y-4">
              {cases.map(caseItem => (
                <div 
                  key={caseItem.id} 
                  className="bg-white p-4 rounded-xl shadow-card border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800 flex-1 pr-2">{caseItem.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === 'Open' 
                        ? 'bg-primary-100 text-primary-700' 
                        : caseItem.status === 'Close'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {caseItem.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{caseItem.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{caseItem.specialization}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar size={16} className="mr-1" />
                      <span>Opened: {new Date(caseItem.opened_date).toLocaleDateString()}</span>
                    </div>
                    <button className="flex items-center text-primary-400 font-medium hover:text-primary-500">
                      Details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">No cases found</p>
              <p className="text-sm text-gray-400">Create your first case to get started</p>
            </div>
          )}
        </div>
        
        {/* Floating Action Button for Adding New Case */}
        <div className="fixed bottom-24 right-6">
          <button 
            onClick={handleAddCase}
            className="w-14 h-14 rounded-full bg-primary-400 text-white flex items-center justify-center shadow-lg hover:bg-primary-500 transition-colors"
            aria-label="Add new case"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Add Case Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Add New Case</h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {addError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {addError}
                  </div>
                )}

                {/* Case Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newCaseData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                    placeholder="Enter case title"
                  />
                </div>

                {/* Case Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={newCaseData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none resize-none"
                    placeholder="Describe your case..."
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Area
                  </label>
                  <select
                    name="specialization"
                    value={newCaseData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                  >
                    <option value="">Select legal area</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Civil Law">Civil Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Real Estate Law">Real Estate Law</option>
                    <option value="Employment Law">Employment Law</option>
                    <option value="Immigration Law">Immigration Law</option>
                    <option value="Personal Injury">Personal Injury</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCase}
                  disabled={addLoading}
                  className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {addLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create Case
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

export default MyCases;
