import React, { useState, useEffect } from 'react';
import { Calendar, FolderGit, Users, Eye, Loader2, ArrowUpRight } from 'lucide-react';
// Import your services
import eventService from '../../api/eventService';
import projectService from '../../api/projectService';
import placementService from '../../api/placementService';
import userService from '../../api/userService';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-[#0E181C] border border-[#1F3037] p-6 rounded-xl hover:border-[#2FA6B8] transition duration-300 relative overflow-hidden group">
    {/* Background Glow Effect */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${color}`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[#BFC7CC] text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-bebas-neue text-white tracking-wide">
          {loading ? <Loader2 className="animate-spin h-8 w-8 text-[#2FA6B8]" /> : value}
        </h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: 0,
    projects: 0,
    users: 0,
    insights: 0
  });
  
  // To store data for "Recent Activity"
  const [recentProject, setRecentProject] = useState(null);
  const [recentEvent, setRecentEvent] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        // NOTE: We pass a high limit (100) to get all items for counting.
        // If your DB grows large, you should create a specific backend endpoint for stats.
        const [eventsRes, projectsRes, insightsRes, usersRes] = await Promise.allSettled([
          eventService.getEvents(100),       // Fetch events
          projectService.getAllProjects(100), // Fetch projects
          placementService.getInsights(100),  // Fetch insights
          userService.getAllUsers ? userService.getAllUsers() : Promise.resolve({ data: [] }) // Fallback if getAllUsers doesn't exist
        ]);

        // Helper to safely extract data from Promise.allSettled
        const getData = (res) => (res.status === 'fulfilled' && res.value?.data) ? res.value.data : [];

        const eventsData = getData(eventsRes);
        const projectsData = getData(projectsRes);
        const insightsData = getData(insightsRes);
        const usersData = getData(usersRes); // Assuming this returns all users

        // Set Counts
        setStats({
          events: eventsData.length,
          projects: projectsData.length,
          insights: insightsData.length,
          users: usersData.length || 0 // If 0, it might mean the API method is missing
        });

        // Set Recent Activity (Get the latest one from the array)
        if (projectsData.length > 0) setRecentProject(projectsData[0]); // Assumes API returns newest first
        if (eventsData.length > 0) setRecentEvent(eventsData[0]);

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bebas-neue text-white tracking-widest mb-2">Dashboard Overview</h2>
        <p className="text-[#BFC7CC]">Welcome back, Master Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Events" 
          value={stats.events} 
          icon={Calendar} 
          color="bg-blue-500" 
          loading={loading}
        />
        <StatCard 
          title="Projects" 
          value={stats.projects} 
          icon={FolderGit} 
          color="bg-purple-500" 
          loading={loading}
        />
        <StatCard 
          title="Insights" 
          value={stats.insights} 
          icon={ArrowUpRight} 
          color="bg-pink-500" 
          loading={loading}
        />
        <StatCard 
          title="Total Users" 
          value={stats.users} 
          icon={Users} 
          color="bg-green-500" 
          loading={loading}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-[#0E181C] border border-[#1F3037] rounded-xl p-6 mt-8">
        <h3 className="text-2xl font-bebas-neue text-white mb-4 tracking-wide">Recent Activity</h3>
        
        {loading ? (
           <div className="py-4 text-[#BFC7CC] text-sm flex items-center gap-2">
             <Loader2 className="animate-spin" size={16}/> Updating feed...
           </div>
        ) : (
          <div className="space-y-0 divide-y divide-[#1F3037]">
            
            {/* Dynamic Project Item */}
            {recentProject ? (
              <div className="flex items-center justify-between py-4 hover:bg-[#141F23] px-2 -mx-2 rounded transition-colors">
                <div className="flex flex-col">
                  <span className="text-white font-medium">New Project Submitted: "{recentProject.title}"</span>
                  <span className="text-[#BFC7CC] text-xs">By {recentProject.author}</span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded border font-bold uppercase ${
                  recentProject.status === 'APPROVED' 
                    ? 'text-green-400 bg-green-400/10 border-green-400/30' 
                    : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                }`}>
                  {recentProject.status}
                </span>
              </div>
            ) : (
               <div className="py-4 text-[#BFC7CC] text-sm italic">No recent projects found.</div>
            )}

            {/* Dynamic Event Item */}
            {recentEvent ? (
              <div className="flex items-center justify-between py-4 hover:bg-[#141F23] px-2 -mx-2 rounded transition-colors">
                <div className="flex flex-col">
                   <span className="text-white font-medium">Upcoming Event: "{recentEvent.title}"</span>
                   <span className="text-[#BFC7CC] text-xs">{new Date(recentEvent.date).toLocaleDateString()} • {recentEvent.location}</span>
                </div>
                <span className="text-[#2FA6B8] text-[10px] px-2 py-1 bg-[#2FA6B8]/10 rounded border border-[#2FA6B8]/30 font-bold uppercase">
                  ACTIVE
                </span>
              </div>
            ) : (
              <div className="py-4 text-[#BFC7CC] text-sm italic">No events scheduled.</div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;