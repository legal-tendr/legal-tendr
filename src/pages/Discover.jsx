import React, { useState, useRef, useMemo, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { X, Heart, MapPin, Star, User } from 'lucide-react';
import { matchAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Discover = ({ user }) => {
  const [lawyers, setLawyers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  // Fetch lawyers when component mounts
  useEffect(() => {
    const fetchLawyers = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await matchAPI.getAllLawyers();
        
        if (result.success && result.data) {
          setLawyers(result.data);
          setCurrentIndex(result.data.length - 1);
        } else {
          setError('Failed to load lawyers');
        }
      } catch (err) {
        setError('Network error');
        console.error('Error fetching lawyers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [user?.id]);

  const childRefs = useMemo(
    () =>
      Array(lawyers.length)
        .fill(0)
        .map(() => React.createRef()),
    [lawyers.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < lawyers.length - 1;
  const canSwipe = currentIndex >= 0;

  // Set last direction and decrease current index
  const swiped = async (direction, nameToDelete, index) => {
    setLastDirection(direction);
    
    // Handle like/pass action
    if (direction === 'right' && user?.id) {
      try {
        const lawyer = lawyers[index];
        await matchAPI.insertClientLikes(user.id, lawyer.id);
        console.log(`Liked lawyer: ${lawyer.name}`);
      } catch (error) {
        console.error('Error recording like:', error);
      }
    }
    
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
    // Handle the case where card is removed (not using updateCurrentIndex)
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < lawyers.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };
  
  // Render star rating component
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#fd484f" color="#fd484f" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={14} color="#e0e0e0" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={14} fill="#fd484f" color="#fd484f" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={14} color="#e0e0e0" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="h-full w-full flex flex-col">
        {/* Header */}
        <header className="px-4 py-4 shadow-sm bg-white">
          <h1 className="text-xl font-bold text-center text-primary-400">Find Your Legal Match</h1>
        </header>

        {/* Card Stack and Buttons Container */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden md:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
              <p className="text-gray-500">Finding lawyers for you...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <User size={48} className="text-gray-300 mb-4" />
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-sm text-gray-400">Please try again later</p>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <User size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">No lawyers found</p>
              <p className="text-sm text-gray-400">Check back later for new matches</p>
            </div>
          ) : currentIndex < 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Heart size={48} className="text-primary-400 mb-4" />
              <p className="text-gray-500 mb-2">You've seen all available lawyers</p>
              <p className="text-sm text-gray-400">Check back later for new matches</p>
            </div>
          ) : (
            <>
              {/* Card Stack */}
              <div className="relative h-[calc(100vh-230px)] md:h-[500px] w-full max-w-md mx-auto">
                <AnimatePresence>
                  {lawyers.map((lawyer, index) => (
                    index === currentIndex && (
                      <motion.div 
                        key={lawyer.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: lastDirection === 'left' ? -300 : 300, rotate: lastDirection === 'left' ? -20 : 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute top-0 left-0 right-0 mx-auto w-full h-full"
                      >
                        <TinderCard
                          ref={childRefs[index]}
                          className="w-full h-full cursor-grab"
                          preventSwipe={['up', 'down']}
                          swipeRequirementType="position"
                          swipeThreshold={100}
                          onSwipe={(dir) => swiped(dir, lawyer.name || lawyer.first_name, index)}
                          onCardLeftScreen={() => outOfFrame(lawyer.name || lawyer.first_name, index)}
                        >
                          <div 
                            className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-card border border-gray-200 transition-transform duration-200 ease-out"
                            style={{
                              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)`,
                            }}
                          >
                            <img 
                              src={lawyer.profile_picture || '/api/placeholder/400/600'} 
                              alt={lawyer.name || `${lawyer.first_name} ${lawyer.last_name}`} 
                              className="absolute top-0 left-0 w-full h-full object-cover z-0"
                            />
                            
                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-5 z-10 text-white">
                              <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold">
                                  {lawyer.name || `${lawyer.first_name} ${lawyer.last_name}`}
                                </h2>
                              </div>
                              
                              <div className="flex items-center mb-2">
                                <MapPin size={14} className="mr-1" />
                                <p className="text-sm">{lawyer.location || 'Location not specified'}</p>
                              </div>
                              
                              {lawyer.rating && (
                                <div className="flex items-center gap-1 mb-3">
                                  {renderStars(lawyer.rating)}
                                  <span className="ml-1 text-xs">{lawyer.rating.toFixed(1)}</span>
                                </div>
                              )}
                              
                              {lawyer.specializations && (
                                <p className="text-sm text-gray-100 mb-3">
                                  {Array.isArray(lawyer.specializations) 
                                    ? lawyer.specializations.join(" • ")
                                    : lawyer.specializations
                                  }
                                </p>
                              )}
                              
                              <p className="text-sm">
                                {lawyer.bio || lawyer.about || 'No bio available'}
                              </p>
                            </div>
                          </div>
                        </TinderCard>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
          
          {/* Swipe Buttons - Only show if there are cards to swipe */}
          {!loading && !error && lawyers.length > 0 && currentIndex >= 0 && (
            <div className="mt-4 md:mt-8 flex justify-center items-center gap-10 pb-4 z-10">
              <motion.button 
                onClick={() => swipe('left')} 
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-primary-400 shadow-lg border border-gray-200"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <X size={26} className="text-primary-400" />
              </motion.button>
              <motion.button 
                onClick={() => swipe('right')} 
                className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-400 text-white shadow-lg"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <Heart size={26} fill="white" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {lastDirection && (
            <motion.div 
              className="fixed top-20 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium shadow-md">
                {lastDirection === 'right' ? (
                  <span className="text-primary-400">Interested</span>
                ) : (
                  <span className="text-gray-500">Passed</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default Discover;
