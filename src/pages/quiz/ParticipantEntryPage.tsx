import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Zap, Trophy } from "lucide-react";
import { CarDecoration } from "./CarDecoration";
import { useQuizStore } from "../../store/useQuizStore";

export function ParticipantEntry() {
  const [name, setName] = useState("");
  const setParticipantName = useQuizStore((state) => state.setParticipantName);
  const resetQuizState = useQuizStore((state) => state.resetQuizState);
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      resetQuizState();
      setParticipantName(name);
      navigate("/quiz");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <CarDecoration />
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1630394781361-cce39e409555?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCTVclMjBjYXIlMjBsdXh1cnklMjBhdXRvbW90aXZlfGVufDF8fHx8MTc3NTY1OTExMHww&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0a1628]/90 to-[#0066b2]/80" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-[#0066b2]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#1c8cdc]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Title Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-3xl mb-6">
            <Zap className="w-10 h-10 text-[#0066b2]" />
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-[#66b3ff] to-white bg-clip-text text-transparent">
            VIVA FEST
          </h1>
          <p className="text-xl text-[#66b3ff] mb-2">2026</p>
          <p className="text-white/80">BMW Automotive Quiz Challenge</p>
        </motion.div>

        {/* Entry Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white/90 mb-3 text-lg">
                Enter Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name here..."
                className="w-full px-6 py-4 glass rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0066b2] transition-all duration-300"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-[#0066b2] to-[#1c8cdc] text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-[#0066b2]/50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Trophy className="w-5 h-5" />
              Join Quiz
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>15 Questions</span>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <span>30s per question</span>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <span>Live Leaderboard</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-6 text-white/50 text-sm"
        >
          Powered by VIVA Autoservice • BMW Club
        </motion.div>
      </motion.div>
    </div>
  );
}