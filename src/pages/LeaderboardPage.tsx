import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trophy, Medal, Award, Gauge, Users, Clock } from "lucide-react";
const exampleImage = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=200&h=200";
import api from "../api/axios";
import { QuizResultDto } from "../types";

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<QuizResultDto[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Load leaderboard
    const loadLeaderboard = async () => {
      try {
        const response = await api.get<QuizResultDto[]>("/api/quiz/leaderboard");
        // Sort by points descending
        const sorted = response.data.sort((a, b) => b.points - a.points);
        setLeaderboard(sorted);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000); // Refresh every 5 seconds

    // Update clock
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-300" />;
      case 3:
        return <Award className="w-8 h-8 text-orange-400" />;
      default:
        return null;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400/20 to-orange-500/20 border-yellow-400/50";
      case 2:
        return "from-gray-300/20 to-gray-400/20 border-gray-300/50";
      case 3:
        return "from-orange-400/20 to-red-500/20 border-orange-400/50";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a1628]">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1761754844718-c95b698e4195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZmVzdGl2YWwlMjBjcm93ZHxlbnwxfHx8fDE3NzU2NTkxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0a1628]/95 to-[#0066b2]/30" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066b2]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1c8cdc]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 md:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 glass-strong rounded-3xl p-4 flex items-center justify-center">
                <img 
                  src={exampleImage} 
                  alt="VIVA Fest Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-[#66b3ff] to-white bg-clip-text text-transparent mb-2">
                  VIVA FEST
                </h1>
                <p className="text-3xl text-[#66b3ff]">2026 - Canlı Liderlər lövhəsi</p>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex flex-col gap-4">
              <div className="glass-strong px-6 py-4 rounded-2xl flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#66b3ff]" />
                <div className="text-right">
                  <div className="text-white/60 text-sm">Cari vaxt</div>
                  <div className="text-white font-bold text-xl">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="glass-strong px-6 py-4 rounded-2xl flex items-center gap-3">
                <Users className="w-6 h-6 text-[#66b3ff]" />
                <div className="text-right">
                  <div className="text-white/60 text-sm">İştirakçılar</div>
                  <div className="text-white font-bold text-xl">
                    {leaderboard.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 bg-green-400 rounded-full"
            />
            <span className="text-green-400 font-semibold text-xl uppercase tracking-wider">
              Canlı Yenilənmə
            </span>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto"
          >
            {/* Second Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <div className="glass-strong border-2 border-gray-300/50 rounded-3xl p-6 text-center">
                <Medal className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-6xl font-bold text-gray-300 mb-2">2</div>
                <div className="text-2xl font-bold text-white mb-2 truncate">
                  {leaderboard[1].name}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                  {leaderboard[1].points}
                </div>
                <div className="text-white/60 text-sm mt-2">bal</div>
              </div>
            </motion.div>

            {/* First Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-strong border-2 border-yellow-400/50 rounded-3xl p-8 text-center bg-gradient-to-br from-yellow-400/10 to-orange-500/10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                <div className="text-7xl font-bold text-yellow-400 mb-2">1</div>
                <div className="text-3xl font-bold text-white mb-3 truncate">
                  {leaderboard[0].name}
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {leaderboard[0].points}
                </div>
                <div className="text-white/60 mt-2">bal</div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 px-4 py-2 bg-yellow-400/20 rounded-full text-yellow-400 font-semibold"
                >
                  <Gauge className="w-4 h-4 inline mr-1" />
                  Çempion
                </motion.div>
              </div>
            </motion.div>

            {/* Third Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <div className="glass-strong border-2 border-orange-400/50 rounded-3xl p-6 text-center">
                <Award className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <div className="text-6xl font-bold text-orange-400 mb-2">3</div>
                <div className="text-2xl font-bold text-white mb-2 truncate">
                  {leaderboard[2].name}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  {leaderboard[2].points}
                </div>
                <div className="text-white/60 text-sm mt-2">bal</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-strong rounded-3xl p-8 max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#0066b2]" />
            Tam Reytinq
          </h2>

          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={`${entry.id}-${entry.name}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className={`
                  glass-hover rounded-2xl p-6 flex items-center gap-6 transition-all duration-300
                  ${index < 3 ? `bg-gradient-to-r ${getRankGradient(index + 1)} border` : ""}
                `}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-16">
                  {index < 3 ? (
                    getRankIcon(index + 1)
                  ) : (
                    <span className="text-3xl font-bold text-white/40">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white">
                    {entry.name}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#0066b2] to-[#66b3ff] bg-clip-text text-transparent">
                    {entry.points}
                  </div>
                  <div className="text-white/60 text-sm">bal</div>
                </div>
              </motion.div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p className="text-2xl">Hələ iştirakçı yoxdur</p>
                <p className="text-lg mt-2">Liderlər lövhəsi real vaxt rejimində yenilənəcək</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
