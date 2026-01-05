import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import authService from '../../api/authService';
import NavBar from '../../components/Navbar';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  // --- GLOBAL STATE ---
  const [mode, setMode] = useState('LOGIN'); // Options: 'LOGIN', 'REGISTER', 'RESET'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- FORM DATA STATE ---
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [regData, setRegData] = useState({ username: '', email: '', password: '' });
  const [resetUsername, setResetUsername] = useState('');

  // --- HELPERS ---
  const clearState = () => {
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  const switchMode = (newMode) => {
    clearState();
    setMode(newMode);
  };

  // --- HANDLERS ---

  // 1. LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(credentials.username, credentials.password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(regData);
      setSuccessMsg("Registration successful! Your account is pending approval by the Master Admin.");
      // Optional: Clear form
      setRegData({ username: '', email: '', password: '' });
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Registration failed. Username or Email might already represent an account.");
    } finally {
      setLoading(false);
    }
  };

  // 3. RESET PASSWORD REQUEST
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.requestPasswordReset(resetUsername);
      setSuccessMsg("Request sent! Please contact the Master Admin to approve your reset.");
    } catch (err) {
      console.error("Reset Error:", err);
      setError("Failed to send request. Ensure the username is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0E181C] border border-[#1F3037] p-8 rounded-xl shadow-2xl relative overflow-hidden">
        <NavBar/>
        {/* Top Glow Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2FA6B8] to-transparent"></div>

        {/* --- HEADER --- */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bebas-neue text-white tracking-widest mb-2">
            {mode === 'LOGIN' && 'Admin Portal'}
            {mode === 'REGISTER' && 'Request Access'}
            {mode === 'RESET' && 'Reset Password'}
          </h2>
          <p className="text-[#BFC7CC] text-sm">
            {mode === 'LOGIN' && 'Authorized Personnel Only'}
            {mode === 'REGISTER' && 'Create a Coordinator Account'}
            {mode === 'RESET' && 'Enter your username to request a reset'}
          </p>
        </div>

        {/* --- FEEDBACK MESSAGES --- */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm text-center">
            {successMsg}
          </div>
        )}

        {/* --- MODE 1: LOGIN FORM --- */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FA6B8] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Username"
                value={credentials.username}
                onChange={e => setCredentials({...credentials, username: e.target.value})}
                className="w-full bg-black border border-[#1F3037] text-white pl-10 pr-4 py-3 rounded-lg focus:border-[#2FA6B8] outline-none transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FA6B8] w-5 h-5" />
              <input 
                type="password" 
                placeholder="Password"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
                className="w-full bg-black border border-[#1F3037] text-white pl-10 pr-4 py-3 rounded-lg focus:border-[#2FA6B8] outline-none transition-colors"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 bg-[#2FA6B8] hover:bg-[#268A98] text-white font-bebas-neue tracking-widest text-xl py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
            </button>

            <div className="flex justify-between mt-4 text-sm">
              <button type="button" onClick={() => switchMode('RESET')} className="text-[#BFC7CC] hover:text-[#2FA6B8] underline">
                Forgot Password?
              </button>
              <button type="button" onClick={() => switchMode('REGISTER')} className="text-[#BFC7CC] hover:text-[#2FA6B8] underline">
                New User? Sign Up
              </button>
            </div>
          </form>
        )}

        {/* --- MODE 2: REGISTER FORM --- */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FA6B8] w-5 h-5" />
              <input 
                name="username" 
                placeholder="Choose Username"
                value={regData.username}
                onChange={e => setRegData({...regData, username: e.target.value})}
                className="w-full bg-black border border-[#1F3037] text-white pl-10 pr-4 py-3 rounded-lg focus:border-[#2FA6B8] outline-none"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FA6B8] w-5 h-5" />
              <input 
                name="email" 
                type="email"
                placeholder="Email Address"
                value={regData.email}
                onChange={e => setRegData({...regData, email: e.target.value})}
                className="w-full bg-black border border-[#1F3037] text-white pl-10 pr-4 py-3 rounded-lg focus:border-[#2FA6B8] outline-none"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FA6B8] w-5 h-5" />
              <input 
                name="password" 
                type="password"
                placeholder="Choose Password"
                value={regData.password}
                onChange={e => setRegData({...regData, password: e.target.value})}
                className="w-full bg-black border border-[#1F3037] text-white pl-10 pr-4 py-3 rounded-lg focus:border-[#2FA6B8] outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 bg-[#2FA6B8] hover:bg-[#268A98] text-white font-bebas-neue tracking-widest text-xl py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Request Access"}
            </button>

            <button type="button" onClick={() => switchMode('LOGIN')} className="flex items-center justify-center gap-2 text-[#BFC7CC] hover:text-white mt-2 text-sm">
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

        {/* --- MODE 3: RESET PASSWORD FORM --- */}
        {mode === 'RESET' && (
          <form onSubmit={handleResetRequest} className="flex flex-col gap-5">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2FA6B8] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Enter your Username"
                value={resetUsername}
                onChange={e => setResetUsername(e.target.value)}
                className="w-full bg-black border border-[#1F3037] text-white pl-10 pr-4 py-3 rounded-lg focus:border-[#2FA6B8] outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 bg-[#2FA6B8] hover:bg-[#268A98] text-white font-bebas-neue tracking-widest text-xl py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send Request"}
            </button>

            <button type="button" onClick={() => switchMode('LOGIN')} className="flex items-center justify-center gap-2 text-[#BFC7CC] hover:text-white mt-2 text-sm">
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminLogin;