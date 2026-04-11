import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Gauge, Trophy, AlertCircle } from "lucide-react";
import { CarDecoration } from "../../components/CarDecoration";
import { useQuizStore } from "../../store/useQuizStore";
import mainBg from "../../assets/main_bg.jpeg";
import { WelcomeInstructions } from "../../components/WelcomeInstructions";
import api from "../../api/axios";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";

export function ParticipantEntry() {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const setParticipantName = useQuizStore((state) => state.setParticipantName);
  const resetQuizState = useQuizStore((state) => state.resetQuizState);
  const navigate = useNavigate();

  useEffect(() => {
    const checkActivity = async () => {
      try {
        const res = await api.get("/api/quiz/check_activity");
        setIsActive(res.data === true || res.data === "true");
      } catch (error) {
        console.error("Activity check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkActivity();
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && isActive) {
      resetQuizState();
      setParticipantName(name);
      navigate("/quiz");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <WelcomeInstructions />
      <CarDecoration />
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${mainBg})`,
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
            <Gauge className="w-10 h-10 text-[#0066b2]" />
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-[#66b3ff] to-white bg-clip-text text-transparent">
            VIVA FEST
          </h1>
          <p className="text-xl text-[#66b3ff] mb-2">2026</p>
          <p className="text-white/80">Avtomobil viktorinası</p>
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
              <label htmlFor="name" className="block text-white/80 mb-1 ml-1 text-lg">
                Adınızı daxil edin
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full px-6 py-4 glass rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0066b2] transition-all duration-300"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={!isActive || isLoading}
              whileHover={isActive ? { scale: 1.02 } : {}}
              whileTap={isActive ? { scale: 0.98 } : {}}
              className={`
                w-full py-5 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                ${isActive
                  ? "bg-gradient-to-r from-[#0066b2] to-[#1c8cdc] text-white hover:shadow-[#0066b2]/50"
                  : "bg-slate-800 text-white/40 cursor-not-allowed border border-white/5"
                }
              `}
            >
              <Trophy className={`w-5 h-5 ${!isActive ? "opacity-20" : ""}`} />
              {isActive ? "Viktorinaya başla" : "Viktorina aktiv deyil"}
            </motion.button>
          </form>

          {!isActive && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-200 rounded-2xl py-4">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <AlertTitle className="font-bold text-base mb-1">Diqqət!</AlertTitle>
                <AlertDescription className="text-red-200/80">
                  Viktorina hazırda deaktivdir
                </AlertDescription>
              </Alert>
            </motion.div>
          )}


        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-6 text-white/70 text-lg"
        >
          VIVA Autoservis • BMW Club
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-2 text-white/70 text-lg"
        >
          tərəfindən hazırlanıb
        </motion.div>
      </motion.div>
    </div>
  );
}