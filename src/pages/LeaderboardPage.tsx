import { useEffect, useState } from "react";
import { Trophy, Medal, Zap, Users, Clock, Timer, QrCode as QrIcon } from "lucide-react";
import { motion } from "motion/react";
import { QrModal } from "../components/QrModal";
import bgImage from "../assets/leaderboard_bg.png";
import api from "../api/axios";
import { QuizResultDto } from "../types";
import config from "../../quiz_config.json";

interface LeaderboardEntry extends QuizResultDto {
  completeTime: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [questionsCount, setQuestionsCount] = useState(0);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    let currentQCount = 0;

    const fetchQuestionsCount = async () => {
      try {
        const res = await api.get("/api/quiz/questions");
        currentQCount = res.data.length;
        setQuestionsCount(currentQCount);
      } catch (e) {
        console.error(e);
      }
    };

    fetchQuestionsCount();

    const loadLeaderboard = async () => {
      try {
        const response = await api.get<QuizResultDto[]>("/api/quiz/leaderboard");

        let qCount = currentQCount;
        if (qCount === 0 && response.data.length > 0) {
          try {
            const res = await api.get("/api/quiz/questions");
            qCount = res.data.length;
            currentQCount = qCount;
            setQuestionsCount(qCount);
          } catch {
            console.log("Could not fetch questions count for complete time calculation.");
          }
        }

        const transformedData = response.data.map((entry) => ({
          ...entry,
          completeTime: (qCount * config.quiz_timer_seconds) - entry.totalRemainingSeconds
        }));

        transformedData.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return a.completeTime - b.completeTime;
        });

        setLeaderboard(transformedData);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000);

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  let fastestPlayer: LeaderboardEntry | null = null;
  leaderboard.forEach(player => {
    if (player.points > 0) {
      if (!fastestPlayer || player.completeTime < fastestPlayer.completeTime) {
        fastestPlayer = player;
      }
    }
  });

  const isFastestPlayer = (playerId: number) => {
    return fastestPlayer?.id === playerId;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Dark Semi-Transparent Overlay */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />

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
      <div className="relative z-10 p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="flex items-center justify-between">
            <div>

              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#66b3ff] via-white to-[#66b3ff] bg-clip-text text-transparent mb-2">
                VIVA FEST 2026
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#66b3ff] via-white to-[#66b3ff] bg-clip-text text-transparent">
                REYTINQ CƏDVƏLİ
              </h2>
            </div>

            {/* Status Info - Top Right */}
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
              <div className="flex flex-col gap-2">
                <div className="glass-strong px-6 py-4 rounded-2xl flex items-center justify-between gap-3">
                  <Users className="w-6 h-6 text-[#66b3ff]" />
                  <div className="text-right">
                    <div className="text-white/60 text-sm">İştirakçılar</div>
                    <div className="text-white font-bold text-xl">
                      {leaderboard.length}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsQrOpen(true)}
                  className="w-full glass p-3 py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold hover:bg-white/10 transition-colors uppercase text-sm tracking-wider border border-white/10"
                >
                  <QrIcon className="w-6 h-6 text-[#66b3ff]" />
                  QR Göstər
                </button>
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
              CANLI YENİLƏNMƏ
            </span>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-end justify-center gap-10 mb-16 mt-12 max-w-6xl mx-auto"
          >
            {/* Second Place - Left */}
            {leaderboard[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-1 max-w-xs"
              >
                <div className="glass-strong border-2 border-gray-400/50 rounded-3xl p-8 pt-10 text-center h-80 flex flex-col items-center relative bg-slate-900/40">
                  {/* Rank Circle Overlay */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-18 h-18 rounded-full bg-[#b8b8b8] border-4 border-[#1e293b] flex items-center justify-center text-slate-900 text-2xl font-bold shadow-lg">
                    2
                  </div>

                  {/* Fastest Time Badge */}
                  {isFastestPlayer(leaderboard[1].id) && (
                    <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      <Zap className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-[10px] font-semibold">Ən sürətli vaxt</span>
                    </div>
                  )}

                  {/* Avatar / Icon Circle */}
                  <div className="w-24 h-24 rounded-full border-4 border-gray-400/60 p-1 mb-4 flex items-center justify-center bg-gray-400/10">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center overflow-hidden">
                      <Medal className="w-12 h-12 text-white/90" />
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-white mb-1 truncate w-full px-2">
                    {leaderboard[1].name}
                  </div>

                  <div className="mt-auto">
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                      {leaderboard[1].points.toLocaleString()}
                    </div>
                    <div className="text-white/40 text-xs font-bold tracking-tighter">XAL</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* First Place - Center */}
            {leaderboard[0] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 max-w-sm scale-110"
              >
                <div className="glass-strong border-2 border-yellow-400/50 rounded-3xl p-8 pt-12 text-center h-96 flex flex-col items-center relative bg-slate-900/60 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
                  {/* Rank Circle Overlay */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#ffcc00] border-4 border-[#1e293b] flex items-center justify-center text-slate-900 text-3xl font-black shadow-xl">
                    1
                  </div>

                  {/* Fastest Time Badge */}
                  {isFastestPlayer(leaderboard[0].id) && (
                    <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-full px-3 py-1 flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.4)] z-20">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-xs font-semibold">Ən sürətli vaxt</span>
                    </div>
                  )}

                  {/* Avatar / Icon Circle */}
                  <div className="w-32 h-32 rounded-full border-4 border-yellow-400/80 p-1.5 mb-6 flex items-center justify-center bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center overflow-hidden">
                      <Trophy className="w-16 h-16 text-white/90" />
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-white mb-2 truncate w-full px-2">
                    {leaderboard[0].name}
                  </div>

                  <div className="mt-auto">
                    <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {leaderboard[0].points.toLocaleString()}
                    </div>
                    <div className="text-white/40 text-sm font-bold tracking-tighter">XAL</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Third Place - Right */}
            {leaderboard[2] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex-1 max-w-xs"
              >
                <div className="glass-strong border-2 border-orange-600/50 rounded-3xl p-8 pt-10 text-center h-72 flex flex-col items-center relative bg-slate-900/40">
                  {/* Rank Circle Overlay */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#cd7f32] border-4 border-[#1e293b] flex items-center justify-center text-slate-900 text-2xl font-bold shadow-lg">
                    3
                  </div>

                  {/* Fastest Time Badge */}
                  {isFastestPlayer(leaderboard[2].id) && (
                    <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      <Zap className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-[10px] font-semibold">Ən sürətli vaxt</span>
                    </div>
                  )}

                  {/* Avatar / Icon Circle */}
                  <div className="w-20 h-20 rounded-full border-4 border-orange-600/60 p-1 mb-2 flex items-center justify-center bg-orange-600/10">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center overflow-hidden">
                      <Medal className="w-10 h-10 text-white/90" />
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-white mb-1 truncate w-full px-2">
                    {leaderboard[2].name}
                  </div>

                  <div className="mt-auto">
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      {leaderboard[2].points.toLocaleString()}
                    </div>
                    <div className="text-white/40 text-xs font-bold tracking-tighter">XAL</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Complete Rankings */}
        {leaderboard.length > 3 && (
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

            <div className="grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-white/60 text-sm uppercase tracking-wider">
              <div className="col-span-2">Sıra</div>
              <div className="col-span-5">İştirakçı</div>
              <div className="col-span-3">Vaxt</div>
              <div className="col-span-2 text-right">Xal</div>
            </div>

            <div className="space-y-3">
              {leaderboard.slice(3).map((entry, index) => {
                const actualRank = index + 4;
                const isFastest = isFastestPlayer(entry.id);

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className={`
                      glass-hover rounded-2xl p-6 transition-all duration-300
                      ${isFastest
                        ? 'border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] bg-green-500/5'
                        : ''
                      }
                    `}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <span className="text-2xl font-bold text-white/60">
                          {String(actualRank).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="col-span-5">
                        <div className="flex items-center gap-3">
                          <div className="text-xl font-bold text-white">
                            {entry.name}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center gap-2">
                        {isFastest ? (
                          <Zap className="w-5 h-5 text-green-400" />
                        ) : (
                          <Timer className="w-5 h-5 text-[#66b3ff]" />
                        )}
                        <div className={isFastest ? 'text-green-400' : 'text-white/80'}>
                          <span className="font-semibold">Vaxt: </span>
                          <span className="font-bold">{entry.completeTime}s</span>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#0066b2] to-[#66b3ff] bg-clip-text text-transparent">
                          {entry.points}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {leaderboard.length === 0 && (
          <div className="glass-strong rounded-3xl p-12 max-w-4xl mx-auto text-center">
            <Users className="w-20 h-20 mx-auto mb-6 text-white/40" />
            <p className="text-3xl text-white/80 mb-2">Hələ iştirakçı yoxdur</p>
            <p className="text-xl text-white/60">Liderlər lövhəsi real vaxt rejimində yenilənəcək</p>
          </div>
        )}
      </div>

      <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
    </div>
  );
}

