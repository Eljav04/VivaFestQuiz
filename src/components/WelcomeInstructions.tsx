import { useState, useEffect } from "react";
import { Info, HelpCircle, Clock, Award, ShieldAlert, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import config from "../../quiz_config.json";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";

export function WelcomeInstructions() {
  const [isVisible, setIsVisible] = useState(false);
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
    if (!hasSeenInstructions) {
      setIsVisible(true);
      fetchQuestionCount();
    }
  }, []);

  const fetchQuestionCount = async () => {
    try {
      const res = await api.get('/api/quiz/questions');
      setQuestionCount(res.data.length);
    } catch (error) {
      console.error("Failed to load questions count", error);
      setQuestionCount(15); // Fallback
    }
  };

  const handleClose = () => {
    localStorage.setItem("hasSeenInstructions", "true");
    setIsVisible(false);
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl w-[95vw] max-h-[85vh] flex flex-col p-0 glass-strong border border-white/10 text-white gap-0 overflow-hidden outline-none bg-[#0a1628]/95 [&>button]:hidden"
      >
        <DialogHeader className="p-6 pb-4 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-4 text-left pr-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#0066b2] to-[#1c8cdc] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <Info className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Qaydalara diqqət!
              </h2>
              <p className="text-[#66b3ff] font-medium mt-1">Avtomobil viktorinası təlimatı</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {/* Question Count & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass hover:bg-white/5 transition-colors rounded-2xl p-4 md:p-5 border border-white/5">
              <HelpCircle className="w-8 h-8 text-[#0066b2] mb-3" />
              <div className="text-white/60 text-sm mb-1">Sualların sayı</div>
              <div className="text-xl font-bold text-white">
                {questionCount !== null ? questionCount : '...'}
              </div>
            </div>
            <div className="glass hover:bg-white/5 transition-colors rounded-2xl p-4 md:p-5 border border-white/5">
              <Clock className="w-8 h-8 text-[#1c8cdc] mb-3" />
              <div className="text-white/60 text-sm mb-1">Hər sual üçün</div>
              <div className="text-xl font-bold text-white">
                {config.quiz_timer_seconds} saniyə
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="glass rounded-2xl p-5 md:p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Xal sistemi və qaydalar
            </h3>
            <ul className="space-y-4 text-white/80 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1"><CheckCircle2 className="w-5 h-5 text-green-400" /></span>
                <span><strong>100 Bal:</strong> Hər düzgün cavab sizə 100 bal qazandırır.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1"><Clock className="w-5 h-5 text-[#66b3ff]" /></span>
                <span><strong>Əlavə Vaxt:</strong> Tez cavablandırdığınız hər saniyə əlavə bal verir.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1"><ShieldAlert className="w-5 h-5 text-orange-400" /></span>
                <span><strong>Səhvlər:</strong> Səhv cavab qeyd etsəniz, ballarınızdan <strong>çıxılmır</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-1"><Info className="w-5 h-5 text-red-400" /></span>
                <span><strong>Geri Qayıtmaq:</strong> Cavabı seçdikdən dərhal sonra növbəti suala keçid olur və geri qayıtmaq mümkün deyil.</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 shrink-0 border-t border-white/10 sm:justify-center">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-[#0066b2] to-[#1c8cdc] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-[#0066b2]/40 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            Təsdiqlə
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
