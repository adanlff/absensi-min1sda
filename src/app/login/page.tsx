'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, GraduationCap, User, Lock, LogIn, Phone, Loader2, Eye, EyeOff } from 'lucide-react'
import { SiWhatsapp } from 'react-icons/si'
import { motion, AnimatePresence } from 'framer-motion'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'walikelas' | ''>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: AlertType;
    title: string;
    message: string;
  }>({
    type: "success",
    title: "",
    message: "",
  });
  const [apiResponse, setApiResponse] = useState<any>(null);
  const router = useRouter()

  const selectRole = (role: 'admin' | 'walikelas') => {
    setSelectedRole(role)
    setError('')
  }

  const showSweetAlert = (type: AlertType, title: string, message: string) => {
    setAlertConfig({ type, title, message });
    setShowAlert(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Silakan pilih peran terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: selectedRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setApiResponse(data);
        showSweetAlert(
          "success",
          "Login Berhasil!",
          "Anda berhasil masuk ke sistem. Selamat datang!"
        );
        setTimeout(() => {
          handleSuccessRedirect(data);
        }, 2000);
      } else {
        setError(data.error || 'Login gagal');
        showSweetAlert("error", "Login Gagal", data.error || 'Login gagal');
      }
    } catch (error) {
      setError('Terjadi kesalahan pada server');
      showSweetAlert("error", "Error", "Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessRedirect = (data?: any) => {
    const response = data || apiResponse;
    if (response) {
      router.push(response.redirect);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center p-4 lg:p-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-6xl h-auto lg:h-full max-h-[95vh] lg:max-h-[92vh] grid lg:grid-cols-2 overflow-hidden"
      >
        {/* Sweet Alert Component for success notification */}
        <SweetAlert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          duration={alertConfig.type === "success" ? 2000 : 5000}
          showCloseButton={false}
        />
          {/* Left Hero Section (Landscape Split) */}
          <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center p-12">
              {/* Subtle Static Gradient Orbs instead of heavy animated bubbles */}
              <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-white/5 rounded-full blur-3xl" />
              
              <div className="text-center space-y-8 relative z-10 w-full max-w-md">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-48 h-48 mx-auto flex items-center justify-center"
                  >
                      <img src="/assets/gambar/min1.png" alt="MIN 1 Sidoarjo" className="w-40 h-40 object-contain drop-shadow-xl" />
                  </motion.div>
                  
                  <div className="text-white space-y-4">
                      <div className="space-y-1">
                        <h2 className="text-4xl xl:text-5xl font-bold tracking-tight">Selamat Datang</h2>
                        <p className="text-xl font-light text-white/80">Sistem Informasi Absensi</p>
                      </div>
                      
                      <div className="w-12 h-1 bg-white/30 mx-auto rounded-full" />
                      
                      <div className="space-y-1">
                          <p className="text-2xl font-bold tracking-wide">MIN 1 Sidoarjo</p>
                          <p className="text-[10px] text-white/60 tracking-widest uppercase">Membangun Generasi Madani</p>
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Right Form Section */}
          <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 overflow-y-auto lg:overflow-hidden">
              <div className="w-full max-w-sm mx-auto space-y-6">
                  
                  {/* Mobile Logo Only */}
                  <div className="lg:hidden text-center mb-4">
                      <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center overflow-hidden">
                          <img src="/assets/gambar/min1.png" alt="MIN 1 Sidoarjo" className="w-16 h-16 object-contain" />
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Login ke Sistem</h1>
                      <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base font-medium">Pilih peran dan gunakan akun Anda</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Role Tabs Style */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] ml-1">Kategori Akses</span>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50/50 dark:bg-slate-950 p-1 rounded-2xl border border-gray-100 dark:border-slate-800">
                          <button 
                            type="button"
                            onClick={() => selectRole('admin')}
                            className={`flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-300 font-bold text-base ${selectedRole === 'admin' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 translate-y-[-1px]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                          >
                            <ShieldCheck className={`w-3.5 h-3.5 ${selectedRole === 'admin' ? 'text-primary' : 'text-gray-300'}`} />
                            <span>ADMIN</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => selectRole('walikelas')}
                            className={`flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-300 font-bold text-base ${selectedRole === 'walikelas' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 translate-y-[-1px]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                          >
                            <GraduationCap className={`w-3.5 h-3.5 ${selectedRole === 'walikelas' ? 'text-primary' : 'text-gray-300'}`} />
                            <span>WALI KELAS</span>
                          </button>
                        </div>
                      </div>

                      {/* Input Group */}
                      <div className="space-y-3">
                        <div className="group relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                            <User className="h-4 w-4" />
                          </div>
                          <input 
                            type="text" 
                            required 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:border-primary transition-all outline-none text-base font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white placeholder:font-normal" 
                            placeholder="Username" 
                          />
                        </div>

                        <div className="group relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full pl-11 pr-12 py-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:border-primary transition-all outline-none text-base font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white placeholder:font-normal" 
                            placeholder="Password" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-primary transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>



                      <motion.button 
                        whileTap={{ scale: 0.97 }}
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-[#344430] text-white font-bold text-sm tracking-[0.2em] rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            <span>LOADING...</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            <span>MASUK SEKARANG</span>
                          </>
                        )}
                      </motion.button>
                  </form>
                  
                  {/* Footer links */}
                  <div className="flex flex-col items-center pt-5 border-t border-gray-50 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-3">Lupa Password / Butuh Bantuan?</p>
                      <a 
                        href="https://wa.me/08123456789" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center space-x-2 text-primary hover:text-primary/80 font-bold text-sm transition-colors py-1"
                      >
                          <SiWhatsapp className="w-5 h-5" />
                          <span>HUBUNGI ADMIN</span>
                      </a>
                  </div>
              </div>
          </div>
      </motion.div>

    </div>
  )
}
