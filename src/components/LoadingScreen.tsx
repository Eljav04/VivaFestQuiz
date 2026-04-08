import { motion } from "motion/react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a1628] z-[200] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* BMW-inspired Loading Animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer Circle */}
          <svg className="absolute inset-0" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="55"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="345"
              strokeDashoffset="100"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066b2" />
                <stop offset="100%" stopColor="#1c8cdc" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* BMW Logo Style Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#0066b2] bg-gradient-to-br from-[#0066b2]/20 to-[#1c8cdc]/20 backdrop-blur-sm" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-white via-[#66b3ff] to-white bg-clip-text text-transparent"
        >
          VIVA FEST 2026
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 mt-2"
        >
          Loading quiz...
        </motion.p>
      </motion.div>
    </div>
  );
}
