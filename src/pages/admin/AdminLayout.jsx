import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FolderGit, Users, LogOut, Briefcase } from 'lucide-react';
import authService from '../../api/authService';
import NavBar from '../../components/Navbar';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Events', path: '/admin/events', icon: <Calendar size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit size={20} /> },
    { name: 'Placements', path: '/admin/placements', icon: <Briefcase size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> }, // ✅ Added Users Tab
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <NavBar/>
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0E181C] border-r border-[#1F3037] flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-[#1F3037]">
          <h1 className="text-3xl font-bebas-neue tracking-widest text-white">
            ACM <span className="text-[#2FA6B8]">ADMIN</span>
          </h1>
          <p className="text-xs text-[#BFC7CC] mt-1 tracking-wider opacity-70">CONTROL PANEL</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 bg-black min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;