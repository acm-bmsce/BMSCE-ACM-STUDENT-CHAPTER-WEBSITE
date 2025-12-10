import React from 'react';
import { Calendar, FolderGit, Users, Eye } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-[#0E181C] border border-[#1F3037] p-6 rounded-xl hover:border-[#2FA6B8] transition duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[#BFC7CC] text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-bebas-neue text-white tracking-wide">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bebas-neue text-white tracking-widest mb-2">Dashboard Overview</h2>
        <p className="text-[#BFC7CC]">Welcome back, Master Admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Events" value="42" icon={Calendar} color="bg-blue-500" />
        <StatCard title="Projects" value="15" icon={FolderGit} color="bg-purple-500" />
        <StatCard title="Members" value="128" icon={Users} color="bg-green-500" />
        <StatCard title="Site Visits" value="2.4k" icon={Eye} color="bg-[#2FA6B8]" />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-[#0E181C] border border-[#1F3037] rounded-xl p-6 mt-8">
        <h3 className="text-2xl font-bebas-neue text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#1F3037]">
            <span className="text-white">New Project Submitted: "AI Drone System"</span>
            <span className="text-[#2FA6B8] text-xs px-2 py-1 bg-[#2FA6B8]/10 rounded border border-[#2FA6B8]/30">PENDING</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#1F3037]">
            <span className="text-white">Event Created: "Hackathon 2025"</span>
            <span className="text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded border border-green-400/30">PUBLISHED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;