'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowRight, User, Mail, Lock, BookOpen, Loader2, Sparkles, Binary } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    Branch: '',
    Email: '',
    password: '',
  });
  const [completionData, setCompletionData] = useState({ username: '', branch: '' });
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [isCompletingGoogleSignup, setIsCompletingGoogleSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.signup(formData);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (response: any) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', response.token);
    if (response.user) {
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userId', response.user.id.toString());
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userUsername', response.user.username);
      localStorage.setItem('userInitial', response.user.name[0].toUpperCase());
    }
    router.push('/');
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.googleAuth(credentialResponse.credential, 'signup');
      
      if (res.needs_completion) {
        setGoogleUserData(res.userData);
        setCompletionData({ 
          username: res.userData.suggestedUsername,
          branch: '' 
        });
        setIsCompletingGoogleSignup(true);
      } else {
        handleAuthSuccess(res);
      }
    } catch (err: any) {
      const msg = err.message || 'Google authentication failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionData.branch) {
      setError('Please select your branch');
      return;
    }
    setLoading(true);
    try {
      const res = await api.googleSignupComplete({
        ...googleUserData,
        ...completionData
      });
      handleAuthSuccess(res);
    } catch (err) {
      setError('Failed to complete signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!isCompletingGoogleSignup ? (
          <motion.div 
            key="signup-form"
            initial="hidden" 
            animate="visible" 
            exit={{ opacity: 0, x: -20 }}
            variants={fadeInUp} 
            className="w-full max-w-[500px] bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 md:p-10 space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center mx-auto shadow-lg -rotate-3 mb-4">
                <UserPlus size={24} />
              </div>
              <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
                Register Core
              </h1>
              <p className="text-black/40 font-bold text-base">
                Initialize your profile in the ecosystem.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                    Identifier
                  </label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="USERNAME"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black transition-all uppercase text-xs"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                    Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="FULL NAME"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black transition-all uppercase text-xs"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                    Transmission
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                    <input
                      type="email"
                      id="email"
                      name="Email"
                      placeholder="EMAIL"
                      required
                      value={formData.Email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black transition-all uppercase text-xs"
                    />
                  </div>
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <label htmlFor="branch" className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                    Spec
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                    <select
                      id="branch"
                      name="Branch"
                      required
                      value={formData.Branch}
                      onChange={handleChange}
                      className="w-full pl-12 pr-8 py-3.5 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black transition-all appearance-none uppercase text-xs"
                    >
                      <option value="" disabled>BRANCH</option>
                      <option value="Computer">COMPUTER</option>
                      <option value="AIDS">AIDS</option>
                      <option value="CS (DS)">CS (DS)</option>
                      <option value="CS (Data science)">CS (DATA SCIENCE)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                  Security Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="PASSWORD (8+ CHARACTERS)"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black transition-all uppercase text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[65px] bg-black text-white font-bold text-lg uppercase tracking-tight rounded-full flex items-center justify-center hover:bg-gray-900 shadow-xl transition-all disabled:opacity-30"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Complete Dashboard <ArrowRight className="ml-2" size={20} /></>}
              </button>

              <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-50">
                 <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        setError('Google Login Failed');
                      }}
                      useOneTap={false}
                      theme="outline"
                      shape="pill"
                      width="340px"
                    />
                 </div>
                 
                 <div className="text-center text-xs font-bold text-black/40">
                   Existing operative?{' '}
                   <Link href="/login" className="text-black font-bold underline underline-offset-4 hover:text-black/60 transition-colors uppercase tracking-widest text-[10px]">
                     Direct Access
                   </Link>
                 </div>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="completion-signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-[420px] bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 md:p-10 space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center mx-auto shadow-lg rotate-3 mb-4">
                <Sparkles size={24} />
              </div>
              <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
                Finalize Profile
              </h1>
              <p className="text-black/40 font-bold text-xs uppercase tracking-widest">
                Hello {googleUserData?.name.split(' ')[0]}, just two more things.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleGoogleCompletion}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                    Username Identifier
                  </label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <input
                      type="text"
                      placeholder="USERNAME"
                      required
                      value={completionData.username}
                      onChange={(e) => setCompletionData({...completionData, username: e.target.value.toUpperCase()})}
                      className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black focus:bg-white transition-all uppercase text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-black uppercase tracking-widest ml-4">
                    Deployment Branch
                  </label>
                  <div className="relative">
                    <Binary className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <select
                      required
                      value={completionData.branch}
                      onChange={(e) => setCompletionData({...completionData, branch: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-100 bg-gray-50/50 font-bold text-black focus:outline-none focus:border-black focus:bg-white appearance-none transition-all uppercase text-sm"
                    >
                      <option value="" disabled>SELECT BRANCH</option>
                      <option value="Computer">COMPUTER</option>
                      <option value="AIDS">AIDS</option>
                      <option value="CS (DS)">CS (DS)</option>
                      <option value="CS (Data science)">CS (DATA SCIENCE)</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[65px] bg-black text-white font-bold text-lg uppercase tracking-tight rounded-full flex items-center justify-center hover:bg-gray-900 shadow-lg transition-all disabled:opacity-30"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Complete Setup <Sparkles className="ml-2" size={20} /></>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
