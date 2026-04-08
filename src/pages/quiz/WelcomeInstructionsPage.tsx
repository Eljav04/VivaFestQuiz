import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Info, Users, Monitor, Shield } from "lucide-react";

export function WelcomeInstructions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
    if (!hasSeenInstructions) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenInstructions", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0066b2] rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome to VIVA FEST 2026</h2>
                  <p className="text-white/60">BMW Quiz Application Guide</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 glass-hover rounded-xl text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Screen Overview */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0066b2]" />
                  Participant Flow (Mobile)
                </h3>
                <ol className="space-y-3 text-white/80">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0066b2] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span><strong>Entry Screen:</strong> Enter your name to join the quiz</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0066b2] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span><strong>Quiz Screen:</strong> Answer 15 questions (30s each). Select your answer and click Next</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0066b2] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span><strong>Results Screen:</strong> View your score and automatic redirect to leaderboard</span>
                  </li>
                </ol>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[#1c8cdc]" />
                  Display Screens (Desktop/TV)
                </h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-[#1c8cdc] rounded-full mt-2"></span>
                    <span><strong>Leaderboard:</strong> Real-time rankings displayed on large screens. Updates every 2 seconds with live participant data</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-[#1c8cdc] rounded-full mt-2"></span>
                    <span>Top 3 participants highlighted with special podium design</span>
                  </li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#66b3ff]" />
                  Admin Panel (Desktop)
                </h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-[#66b3ff] rounded-full mt-2"></span>
                    <span>Edit quiz questions and answers</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-[#66b3ff] rounded-full mt-2"></span>
                    <span>Add or remove questions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-[#66b3ff] rounded-full mt-2"></span>
                    <span>View participant statistics</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-[#66b3ff] rounded-full mt-2"></span>
                    <span>Clear leaderboard for new session</span>
                  </li>
                </ul>
              </div>

              {/* Quick Tips */}
              <div className="bg-[#0066b2]/20 border border-[#0066b2]/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• Use the navigation bar at the bottom to switch between screens</li>
                  <li>• Score is calculated based on correct answers + time bonus</li>
                  <li>• Faster answers earn more points (up to 50 bonus points)</li>
                  <li>• This is a demo with mock data - integrate with backend for production</li>
                </ul>
              </div>

              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#0066b2] to-[#1c8cdc] text-white rounded-2xl font-semibold"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
