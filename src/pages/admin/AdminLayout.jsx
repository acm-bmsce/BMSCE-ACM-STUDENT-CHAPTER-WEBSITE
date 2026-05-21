import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, FolderGit, Users, LogOut, 
  Briefcase, Menu, X 
} from 'lucide-react';
import authService from '../../api/authService';
import NavBar from '../../components/Navbar';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Events', path: '/admin/events', icon: <Calendar size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit size={20} /> },
    { name: 'Placements', path: '/admin/placements', icon: <Briefcase size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* 1. FIXED NAVBAR */}
      <div className="fixed top-0 w-full z-40">
        <NavBar/>
      </div>

      {/* 2. MOBILE TOGGLE BUTTON (Visible only on Mobile) 
         - Places a button just below the navbar to open sidebar
      */}
      <div className="fixed top-24 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-[#2FA6B8] p-2 rounded-md shadow-[0_0_15px_rgba(47,166,184,0.5)] text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 3. SIDEBAR (Responsive) 
         - Default: Hidden off-screen (-translate-x-full)
         - Desktop (md:): Always visible (translate-x-0)
         - Open State: visible (translate-x-0)
      */}
      <aside className={`
        fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 
        bg-[#0E181C] border-r border-[#1F3037] 
        flex flex-col z-40 overflow-y-auto transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="p-6 border-b border-[#1F3037]">
          <h1 className="text-3xl font-bebas-neue tracking-widest text-white">
            ACM <span className="text-[#2FA6B8]">ADMIN</span>
          </h1>
          <p className="text-xs text-[#BFC7CC] mt-1 tracking-wider opacity-70">CONTROL PANEL</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile click
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#2FA6B8]/10 text-[#2FA6B8] border border-[#2FA6B8]/50' 
                    : 'text-[#BFC7CC] hover:bg-[#1F3037] hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1F3037]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 4. OVERLAY (Mobile Only) 
         - Darkens background when sidebar is open
      */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 5. MAIN CONTENT AREA 
         - Mobile: ml-0 (Full width)
         - Desktop: ml-64 (Pushed by sidebar)
      */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-36 md:pt-32 bg-black min-h-screen transition-all duration-300">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;