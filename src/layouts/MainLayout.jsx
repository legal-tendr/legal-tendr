import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Briefcase, MessageSquare, User, LogOut } from 'lucide-react';

const MainLayout = ({ onLogout }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, icon, label }) => {
    const Icon = icon;
    return (
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center transition-colors duration-200 ${isActive 
            ? 'text-primary-400' 
            : 'text-gray-500 hover:text-primary-300'}`
        }
      >
        <Icon size={22} className="flex-shrink-0" />
        <span className="ml-3 text-sm font-medium">{label}</span>
      </NavLink>
    );
  };

  return (
    <div className="h-full w-full">
      {/* MOBILE LAYOUT - Only visible on small screens */}
      <div className="block md:hidden h-full">
        <div className="mobile-container h-full">
          {/* Main Content Area with padding for bottom nav */}
          <main className="pb-20 min-h-full">
            <Outlet />
          </main>
          
          {/* Bottom Mobile Navigation */}
          <nav className="nav-dock">
            <NavLink to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Home size={22} className={isActive('/dashboard') ? 'text-primary-400' : 'text-gray-500'} />
              <span className="text-xs mt-1">Home</span>
            </NavLink>
            
            <NavLink to="/discover" className={`nav-item ${isActive('/discover') ? 'active' : ''}`}>
              <Compass size={22} className={isActive('/discover') ? 'text-primary-400' : 'text-gray-500'} />
              <span className="text-xs mt-1">Discover</span>
            </NavLink>
            
            <NavLink to="/my-cases" className={`nav-item ${isActive('/my-cases') ? 'active' : ''}`}>
              <Briefcase size={22} className={isActive('/my-cases') ? 'text-primary-400' : 'text-gray-500'} />
              <span className="text-xs mt-1">Cases</span>
            </NavLink>
            
            <NavLink to="/messages" className={`nav-item ${isActive('/messages') ? 'active' : ''}`}>
              <MessageSquare size={22} className={isActive('/messages') ? 'text-primary-400' : 'text-gray-500'} />
              <span className="text-xs mt-1">Messages</span>
            </NavLink>
            
            <NavLink to="/account" className={`nav-item ${isActive('/account') ? 'active' : ''}`}>
              <User size={22} className={isActive('/account') ? 'text-primary-400' : 'text-gray-500'} />
              <span className="text-xs mt-1">Account</span>
            </NavLink>
          </nav>
        </div>
      </div>
      
      {/* DESKTOP LAYOUT - Only visible on medium screens and up */}
      <div className="hidden md:flex h-full w-full">
        {/* Desktop Sidebar */}
        <aside className="w-64 lg:w-72 flex-shrink-0 bg-white border-r border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-gray-100">
            <h1 className="text-xl font-bold text-primary-400">LegalTendr</h1>
          </div>
          
          <div className="flex flex-col justify-between flex-grow overflow-y-auto py-4 px-6">
            <nav className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase">Menu</h2>
                <div className="flex flex-col space-y-4">
                  <NavItem to="/dashboard" icon={Home} label="Dashboard" />
                  <NavItem to="/discover" icon={Compass} label="Discover" />
                  <NavItem to="/my-cases" icon={Briefcase} label="My Cases" />
                  <NavItem to="/messages" icon={MessageSquare} label="Messages" />
                  <NavItem to="/account" icon={User} label="Account" />
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase">Other</h2>
                <button 
                  onClick={onLogout}
                  className="flex items-center text-gray-500 hover:text-primary-400 transition-colors duration-200"
                >
                  <LogOut size={22} className="flex-shrink-0" />
                  <span className="ml-3 text-sm font-medium">Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>
        
        {/* Main Desktop Content */}
        <main className="flex-grow bg-white overflow-y-auto p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
