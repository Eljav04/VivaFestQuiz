import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Trophy, Award, Star, ArrowRight } from "lucide-react";
import { useQuizStore } from "../../store/useQuizStore";
import api from "../../api/axios";
import { QuizResultDto } from "../../types";

export function ParticipantResults() {
  const navigate = useNavigate();
  const { participantName } = useQuizStore();
  const [score, setScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!participantName) {
      navigate("/");
      return;
    }

    // Fetch leaderboard to get our score and rank
    const fetchResults = async () => {
      try {
        const res = await api.get<QuizResultDto[]>('/api/quiz/leaderboard');
        const sorted = res.data.sort((a, b) => b.points - a.points);
        const index = sorted.findIndex(r => r.name === participantName);
        if (index !== -1) {
          setScore(sorted[index].points);
          setRank(index + 1);
        } else {
          setScore(0);
          setRank(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    // Give the backend a small delay to process the submission before fetching leaderboard
    setTimeout(fetchResults, 500);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/leaderboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, participantName]);

  const getPerformanceLevel = () => {
    const s = score || 0;
    if (s >= 1200) return { text: "Outstanding!", color: "from-yellow-400 to-orange-500", icon: Trophy };
    if (s >= 900) return { text: "Excellent!", color: "from-blue-400 to-cyan-500", icon: Award };
    if (s >= 600) return { text: "Good Job!", color: "from-green-400 to-emerald-500", icon: Star };
    return { text: "Keep Trying!", color: "from-gray-400 to-gray-500", icon: Star };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1632417908031-15aeb96efd57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjB3aGVlbCUyMEJNV3xlbnwxfHx8fDE3NzU2NTkxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0a1628]/90 to-[#0066b2]/85" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 glass rounded-full mb-6"
          >
            <PerformanceIcon className="w-12 h-12 text-[#0066b2]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}
          >
            {performance.text}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-white mb-8"
          >
            {participantName}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="glass rounded-3xl p-8 mb-6"
          >
            <div className="text-white/60 text-sm uppercase tracking-wider mb-2">
              Your Score
            </div>
            <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#0066b2] to-[#66b3ff] bg-clip-text text-transparent">
              {score !== null ? score : '...'}
            </div>
            <div className="text-white/60 text-sm mt-2">
              out of 1500 points
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="glass rounded-2xl p-4">
              <div className="text-white/60 text-sm mb-1">Rank</div>
              <div className="text-2xl font-bold text-white">{rank !== null && rank > 0 ? `#${rank}` : '...'}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-white/60 text-sm mb-1">Questions</div>
              <div className="text-2xl font-bold text-white">15</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3 text-white/80">
              <span>Redirecting to leaderboard in</span>
              <span className="inline-flex items-center justify-center w-10 h-10 glass-strong rounded-xl text-[#0066b2] font-bold">
                {countdown}
              </span>
            </div>

            <motion.button
              onClick={() => navigate("/leaderboard")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#0066b2] to-[#1c8cdc] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
            >
              View Leaderboard Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
