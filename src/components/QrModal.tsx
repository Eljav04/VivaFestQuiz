import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import qrCode from "../assets/qr-code.svg";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QrModal({ isOpen, onClose }: QrModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative aspect-square h-[85vh] max-w-[90vw] glass-strong rounded-[3rem] p-12 flex flex-col items-center justify-center text-center border-2 border-white/10 shadow-[0_0_100px_rgba(0,102,178,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-30"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-2">
              <h3 className="text-4xl md:text-3xl font-bold mb-2">
                Yarışa qoşulmaq üçün skan edin
              </h3>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-white p-3 transition-all w-[90%]">
                <img
                  src={qrCode}
                  alt="Join QR Code"
                  className="w-full h-[80%] object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
