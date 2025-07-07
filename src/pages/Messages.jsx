import React, { useState } from 'react';
import { Search, Info, Mail, ChevronLeft, MapPin, Send, Star, Video, Phone, Paperclip, Smile } from 'lucide-react';
import { lawyers } from '../data/mock-data';

// Generate mock conversation messages
const generateMockConversation = (lawyerId) => {
  const baseDate = new Date();
  const conversation = [
    {
      id: `msg-${lawyerId}-1`,
      sender: 'lawyer',
      text: 'Hello there! How can I help with your legal needs today?',
      timestamp: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `msg-${lawyerId}-2`,
      sender: 'client',
      text: 'Hi, I needed some advice regarding my case.',
      timestamp: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
    },
    {
      id: `msg-${lawyerId}-3`,
      sender: 'lawyer',
      text: 'Of course. Could you please provide more details about your situation?',
      timestamp: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `msg-${lawyerId}-4`,
      sender: 'client',
      text: 'I have a contract dispute with my landlord. They\'re claiming I violated the lease terms.',
      timestamp: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString()
    },
    {
      id: `msg-${lawyerId}-5`,
      sender: 'lawyer',
      text: 'I see. Do you have a copy of your lease agreement that we could review together?',
      timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `msg-${lawyerId}-6`,
      sender: 'client',
      text: 'Yes, I can send it over. Give me a moment to find the document.',
      timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: `msg-${lawyerId}-7`,
      sender: 'lawyer',
      text: 'Great. Once I review it, we can discuss your options. Would you like to schedule a call to discuss this further?',
      timestamp: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  // Add some lawyer-specific messages
  if (lawyerId % 3 === 0) {
    conversation.push(
      {
        id: `msg-${lawyerId}-8`,
        sender: 'client',
        text: 'That would be helpful. When are you available?',
        timestamp: new Date(baseDate.getTime() - 10 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `msg-${lawyerId}-9`,
        sender: 'lawyer',
        text: 'I have time tomorrow at 2 PM or Thursday at 11 AM. Which works better for you?',
        timestamp: new Date(baseDate.getTime() - 8 * 60 * 60 * 1000).toISOString()
      }
    );
  } else if (lawyerId % 3 === 1) {
    conversation.push(
      {
        id: `msg-${lawyerId}-8`,
        sender: 'client',
        text: 'Here\'s the lease agreement. Let me know what you think.',
        timestamp: new Date(baseDate.getTime() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `msg-${lawyerId}-9`,
        sender: 'lawyer',
        text: 'Got it. I\'ll review this and get back to you shortly with my analysis.',
        timestamp: new Date(baseDate.getTime() - 3 * 60 * 60 * 1000).toISOString()
      }
    );
  }
  
  return conversation.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

const Messages = () => {
  // Get messages with lawyer data and add mock conversations
  const messagesWithLawyers = lawyers.map(lawyer => {
    return { 
      id: lawyer.id,
      lawyer,
      conversation: generateMockConversation(lawyer.id),
      unread: lawyer.id % 4 === 0, // Random unread messages for some conversations
      lastMessage: `${lawyer.id % 2 === 0 ? 'You: ' : ''}Last message in this conversation...`,
      timestamp: new Date(Date.now() - (lawyer.id * 100000)).toISOString()
    };
  });

  // State for tracking the selected conversation and view mode
  const [selectedConversation, setSelectedConversation] = useState(messagesWithLawyers[0]);
  const [mobileView, setMobileView] = useState('list'); // 'list', 'conversation', 'details' for mobile view navigation

  // Format time from timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for conversation headers
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full w-full">
      {/* Mobile View */}
      <div className="block md:hidden h-full w-full">
        {mobileView === 'list' && (
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <header className="bg-primary-400 text-white px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Messages</h1>
              </div>
              
              {/* Search Bar */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full py-2 pl-10 pr-4 bg-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
              
              {/* Recent Matches Section */}
              <div className="mt-5">
                <h2 className="text-white/80 text-sm mb-3">Recent Matches</h2>
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
                  {lawyers.slice(0, 5).map(lawyer => (
                    <div key={lawyer.id} className="flex flex-col items-center flex-shrink-0 w-16">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white">
                          <img 
                            src={lawyer.image} 
                            alt={lawyer.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {lawyer.id % 3 === 0 && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-center text-white/90 truncate w-full">
                        {lawyer.name.split(',')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {messagesWithLawyers.map(message => (
                <div 
                  key={message.id}
                  onClick={() => {
                    setSelectedConversation(message);
                    setMobileView('conversation');
                  }}
                  className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative mr-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img 
                        src={message.lawyer.image}
                        alt={message.lawyer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {message.conversation[message.conversation.length - 1].sender === 'lawyer' && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-primary-400 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium text-gray-900">
                        {message.lawyer.name.split(',')[0]}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(message.conversation[message.conversation.length - 1].timestamp)}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${message.conversation[message.conversation.length - 1].sender === 'lawyer' ? 'text-gray-800 font-medium' : 'text-gray-500'} truncate`}>
                      {message.conversation[message.conversation.length - 1].text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mobileView === 'conversation' && (
          <div className="h-full flex flex-col">
            {/* Conversation Header */}
            <header className="bg-white border-b border-gray-200 p-3 flex items-center">
              <button 
                onClick={() => setMobileView('list')} 
                className="p-1 mr-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              
              <div className="flex items-center flex-1 cursor-pointer" onClick={() => setMobileView('details')}>
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={selectedConversation.lawyer.image}
                    alt={selectedConversation.lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.lawyer.name.split(',')[0]}</h3>
                  <p className="text-xs text-gray-500">{selectedConversation.lawyer.specialties[0]}</p>
                </div>
              </div>
              
              <div className="flex">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setMobileView('details')} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Info size={20} className="text-gray-600" />
                </button>
              </div>
            </header>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedConversation.conversation.map((msg) => {
                const isClient = msg.sender === 'client';
                return (
                  <div key={msg.id} className={`mb-4 flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                    {!isClient && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <img 
                          src={selectedConversation.lawyer.image}
                          alt={selectedConversation.lawyer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isClient ? 'bg-primary-400 text-white' : 'bg-white text-gray-800'} shadow-sm`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">{formatMessageTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center rounded-full border border-gray-300 pl-3 pr-1 py-1">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                />
                <div className="flex items-center">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Paperclip size={18} className="text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Smile size={18} className="text-gray-500" />
                  </button>
                  <button className="ml-1 p-2 rounded-full bg-primary-400 text-white">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mobileView === 'details' && (
          <div className="h-full flex flex-col bg-white">
            {/* Details Header */}
            <header className="p-4 border-b border-gray-200 flex items-center">
              <button 
                onClick={() => setMobileView('conversation')} 
                className="p-1 mr-3 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold">Contact Info</h2>
            </header>
            
            {/* Lawyer Details */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 flex flex-col items-center border-b border-gray-200">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                  <img 
                    src={selectedConversation.lawyer.image}
                    alt={selectedConversation.lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{selectedConversation.lawyer.name}</h3>
                <p className="text-gray-500">{selectedConversation.lawyer.specialties.join(" • ")}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(Math.floor(selectedConversation.lawyer.rating))].map((_, i) => (
                      <Star key={`star-${i}`} size={16} fill="#fd484f" color="#fd484f" />
                    ))}
                    {selectedConversation.lawyer.rating % 1 > 0 && (
                      <div className="relative">
                        <Star size={16} color="#e0e0e0" />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                          <Star size={16} fill="#fd484f" color="#fd484f" />
                        </div>
                      </div>
                    )}
                    {[...Array(5 - Math.ceil(selectedConversation.lawyer.rating))].map((_, i) => (
                      <Star key={`empty-star-${i}`} size={16} color="#e0e0e0" />
                    ))}
                  </div>
                  <span className="ml-1 text-sm">{selectedConversation.lawyer.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-400 mr-3" />
                    <p className="text-gray-800">{selectedConversation.lawyer.location}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <p className="text-gray-800">+1 (555) 123-4567</p>
                  </div>
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <p className="text-gray-800">{selectedConversation.lawyer.name.split(',')[0].toLowerCase()}@legalfirm.com</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">About</h4>
                <p className="text-gray-800">{selectedConversation.lawyer.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout (3-column) */}
      <div className="hidden md:flex h-full w-full">
        {/* Column 1: Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800 mb-3">Messages</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full py-2 pl-10 pr-4 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {messagesWithLawyers.map(message => (
              <div 
                key={message.id}
                onClick={() => setSelectedConversation(message)}
                className={`flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedConversation.id === message.id ? 'bg-gray-100' : ''}`}
              >
                <div className="relative mr-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={message.lawyer.image}
                      alt={message.lawyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {message.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-primary-400 rounded-full border-2 border-white"></span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900">
                      {message.lawyer.name.split(',')[0]}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${message.unread ? 'text-gray-800 font-medium' : 'text-gray-500'} truncate`}>
                    {message.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Column 2: Current Conversation */}
        <div className="flex-1 flex flex-col h-full border-r border-gray-200">
          {/* Conversation Header */}
          <header className="bg-white border-b border-gray-200 p-3 flex items-center">
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={selectedConversation.lawyer.image}
                  alt={selectedConversation.lawyer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedConversation.lawyer.name.split(',')[0]}</h3>
                <p className="text-xs text-gray-500">{selectedConversation.lawyer.specialties[0]}</p>
              </div>
            </div>
            
            <div className="flex">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video size={20} className="text-gray-600" />
              </button>
            </div>
          </header>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {selectedConversation.conversation.map((msg) => {
              const isClient = msg.sender === 'client';
              return (
                <div key={msg.id} className={`mb-4 flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                  {!isClient && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      <img 
                        src={selectedConversation.lawyer.image}
                        alt={selectedConversation.lawyer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isClient ? 'bg-primary-400 text-white' : 'bg-white text-gray-800'} shadow-sm`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70 text-right">{formatMessageTime(msg.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Message Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center rounded-full border border-gray-300 pl-3 pr-1 py-1">
              <input 
                type="text" 
                placeholder="Type a message..."
                className="flex-1 bg-transparent focus:outline-none text-sm"
              />
              <div className="flex items-center">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Paperclip size={18} className="text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Smile size={18} className="text-gray-500" />
                </button>
                <button className="ml-1 p-2 rounded-full bg-primary-400 text-white">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Column 3: Contact Details */}
        <div className="w-80 bg-white flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Contact Info</h2>
          </div>
          
          {/* Lawyer Details */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 flex flex-col items-center border-b border-gray-200">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                <img 
                  src={selectedConversation.lawyer.image}
                  alt={selectedConversation.lawyer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{selectedConversation.lawyer.name}</h3>
              <p className="text-gray-500 text-sm">{selectedConversation.lawyer.specialties.join(" • ")}</p>
              
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(Math.floor(selectedConversation.lawyer.rating))].map((_, i) => (
                    <Star key={`star-${i}`} size={16} fill="#fd484f" color="#fd484f" />
                  ))}
                  {selectedConversation.lawyer.rating % 1 > 0 && (
                    <div className="relative">
                      <Star size={16} color="#e0e0e0" />
                      <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <Star size={16} fill="#fd484f" color="#fd484f" />
                      </div>
                    </div>
                  )}
                  {[...Array(5 - Math.ceil(selectedConversation.lawyer.rating))].map((_, i) => (
                    <Star key={`empty-star-${i}`} size={16} color="#e0e0e0" />
                  ))}
                </div>
                <span className="ml-1 text-sm">{selectedConversation.lawyer.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-400 mr-3" />
                  <p className="text-gray-800">{selectedConversation.lawyer.location}</p>
                </div>
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-400 mr-3" />
                  <p className="text-gray-800">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-400 mr-3" />
                  <p className="text-gray-800">{selectedConversation.lawyer.name.split(',')[0].toLowerCase()}@legalfirm.com</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">About</h4>
              <p className="text-gray-800">{selectedConversation.lawyer.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
