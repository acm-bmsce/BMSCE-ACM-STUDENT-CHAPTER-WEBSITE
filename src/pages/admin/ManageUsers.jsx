import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, Loader2 } from 'lucide-react';
import userService from '../../api/userService';

const ManageUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await userService.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await userService.approveUser(userId);
      // Remove from list instantly
      setPendingUsers(prev => prev.filter(u => (u._id || u.id) !== userId));
      alert("User Approved!");
    } catch (error) {
      alert("Approval failed.");
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-4xl font-bebas-neue text-white tracking-widest mb-6">Pending Approvals</h2>

      {loading ? (
        <div className="text-white"><Loader2 className="animate-spin inline" /> Loading...</div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-gray-500 border border-dashed border-[#1F3037] p-10 rounded-xl text-center">
           No pending registration requests.
        </div>
      ) : (
        <div className="grid gap-4">
           {pendingUsers.map(user => (
             <div key={user._id || user.id} className="bg-[#0E181C] border border-[#1F3037] p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#1F3037] rounded-full text-[#2FA6B8]">
                      <Users size={24} />
                   </div>
                   <div>
                      <h3 className="text-white font-bold text-lg">{user.username}</h3>
                      <p className="text-[#BFC7CC] text-sm">{user.email}</p>
                      <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">
                        Awaiting Approval
                      </span>
                   </div>
                </div>

                <button 
                  onClick={() => handleApprove(user._id || user.id)}
                  className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  <CheckCircle size={18} /> Approve
                </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;