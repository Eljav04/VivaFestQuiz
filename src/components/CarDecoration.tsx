import { motion } from "motion/react";

export function CarDecoration() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      {/* Wheel Pattern */}
      <motion.div
        className="absolute top-20 right-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" stroke="#0066b2" strokeWidth="3" />
          <circle cx="60" cy="60" r="40" stroke="#0066b2" strokeWidth="2" />
          <circle cx="60" cy="60" r="25" stroke="#0066b2" strokeWidth="2" />
          <line x1="60" y1="5" x2="60" y2="115" stroke="#0066b2" strokeWidth="2" />
          <line x1="5" y1="60" x2="115" y2="60" stroke="#0066b2" strokeWidth="2" />
          <line x1="18" y1="18" x2="102" y2="102" stroke="#0066b2" strokeWidth="2" />
          <line x1="102" y1="18" x2="18" y2="102" stroke="#0066b2" strokeWidth="2" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" stroke="#1c8cdc" strokeWidth="3" />
          <circle cx="60" cy="60" r="40" stroke="#1c8cdc" strokeWidth="2" />
          <circle cx="60" cy="60" r="25" stroke="#1c8cdc" strokeWidth="2" />
          <line x1="60" y1="5" x2="60" y2="115" stroke="#1c8cdc" strokeWidth="2" />
          <line x1="5" y1="60" x2="115" y2="60" stroke="#1c8cdc" strokeWidth="2" />
          <line x1="18" y1="18" x2="102" y2="102" stroke="#1c8cdc" strokeWidth="2" />
          <line x1="102" y1="18" x2="18" y2="102" stroke="#1c8cdc" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* BMW Kidney Grille Pattern */}
      <motion.div
        className="absolute top-1/3 left-10"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
          <path
            d="M 10 30 Q 10 10 25 5 Q 35 2 45 10 L 45 50 Q 35 58 25 55 Q 10 50 10 30 Z"
            stroke="#0066b2"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 55 10 Q 65 2 75 5 Q 90 10 90 30 Q 90 50 75 55 Q 65 58 55 50 Z"
            stroke="#0066b2"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Engine Lines Pattern */}
      <motion.div
        className="absolute bottom-1/4 right-32"
        initial={{ scaleX: 0.8 }}
        animate={{ scaleX: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
          <line x1="10" y1="20" x2="140" y2="20" stroke="#66b3ff" strokeWidth="2" />
          <line x1="10" y1="35" x2="140" y2="35" stroke="#66b3ff" strokeWidth="2" />
          <line x1="10" y1="50" x2="140" y2="50" stroke="#66b3ff" strokeWidth="3" />
          <line x1="10" y1="65" x2="140" y2="65" stroke="#66b3ff" strokeWidth="2" />
          <line x1="10" y1="80" x2="140" y2="80" stroke="#66b3ff" strokeWidth="2" />
          <circle cx="30" cy="50" r="8" stroke="#66b3ff" strokeWidth="2" />
          <circle cx="75" cy="50" r="8" stroke="#66b3ff" strokeWidth="2" />
          <circle cx="120" cy="50" r="8" stroke="#66b3ff" strokeWidth="2" />
        </svg>
      </motion.div>
    </div>
  );
}
