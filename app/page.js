'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] overflow-hidden font-sans">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="w-full px-8 lg:px-16 py-5 flex items-center justify-between bg-[#f8f9ff] relative z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] rounded-xl flex items-center justify-center shadow-lg shadow-purple-300/30">
            <span className="text-white font-extrabold text-lg">R</span>
          </div>
          <span className="text-2xl font-extrabold text-gray-800">Recruit<span className="text-[#6c5ce7]">Pro</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="#personal" className="text-sm font-semibold text-gray-500 hover:text-[#6c5ce7] transition-colors">Personal</Link>
          <Link href="#business" className="text-sm font-bold text-gray-900 transition-colors">Business</Link>
          <Link href="#partners" className="text-sm font-semibold text-gray-500 hover:text-[#6c5ce7] transition-colors">Partners</Link>
          <Link href="#help" className="text-sm font-semibold text-gray-500 hover:text-[#6c5ce7] transition-colors">Help & FAQ</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
             <button className="px-8 py-2.5 bg-[#4c40f7] text-white rounded-full font-bold text-sm hover:bg-[#3f35cc] transition-colors shadow-lg shadow-indigo-500/30">
               Login
             </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-8 lg:px-16 pt-20 pb-20 flex items-center min-h-[calc(100vh-80px)]">
        
        {/* Background Blobs matching reference */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[0%] left-[0%] w-[300px] h-[300px] bg-[#f8a5c2]/30 rounded-full blur-[80px]" />
          <div className="absolute bottom-[20%] right-[0%] w-[400px] h-[400px] bg-[#d6a2e8]/20 rounded-full blur-[100px]" />
          
          {/* Main Diagonal Pill shape */}
          <div className="absolute top-[10%] right-[10%] w-[800px] h-[350px] bg-gradient-to-tr from-[#74b9ff]/40 to-[#a29bfe]/40 rounded-full rotate-[-35deg] blur-[10px] z-0" />
          
          {/* Decorative shapes */}
          <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-green-400 rounded-full" />
          <div className="absolute bottom-[40%] left-[10%] w-4 h-4 bg-blue-500 rounded-full" />
          <div className="absolute top-[60%] left-[25%] w-8 h-24 bg-green-200 rounded-full rotate-45" />
          <div className="absolute top-[30%] right-[40%] w-4 h-12 bg-yellow-400 rounded-full rotate-45" />
          <div className="absolute bottom-[30%] right-[15%] w-16 h-16 bg-white rounded-full shadow-sm" />
        </div>

        {/* Left — Text Content */}
        <div className="relative z-10 w-full lg:w-[45%] pr-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-green-500 font-bold text-xs uppercase tracking-widest mb-6">
              IT'S AS EASY AS 1, 2, 3
            </p>

            <h1 className="text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Less worrying,<br/>more hiring.
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-sm">
              Connect with talented students across the country or around the world.
            </p>

            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#4c40f7] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-[#3f35cc] transition-colors"
              >
                Get The App 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </motion.button>
            </Link>

            {/* Left side yellow circle */}
            <div className="absolute top-[50%] left-[-15%] w-24 h-24 bg-yellow-300 rounded-full blur-[2px] opacity-80 z-[-1]" />
          </motion.div>
        </div>

        {/* Right — Robot & Floating Elements */}
        <div className="hidden lg:block w-[55%] relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] flex items-center justify-center"
          >
            {/* Robot Image */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20"
            >
              <img
                src="/images/robot_clean.png"
                alt="AI Robot"
                className="w-full max-w-[450px] object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[20%] right-[5%] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-3 pr-8 flex items-center gap-3 z-30"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                 <span className="text-xl">👩‍🎓</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">John D</p>
                <p className="text-xs text-gray-400">john@nowpay.com</p>
              </div>
              <div className="absolute -top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                98% Match
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[40%] left-[10%] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-3 pr-6 flex items-center gap-3 z-30"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍💻</span>
              </div>
              <div>
                <p className="text-xs text-gray-800 font-bold mb-1">Scanning... <span className="text-gray-400 ml-2">40%</span></p>
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-green-500 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
