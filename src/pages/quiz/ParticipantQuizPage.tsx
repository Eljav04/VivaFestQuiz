import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ChevronRight } from "lucide-react";
import api from "../../api/axios";
import { ParticipantQuestionDto, SubmitQuizDto } from "../../types";
import { useQuizStore } from "../../store/useQuizStore";
import config from "../../../quiz_config.json";

export function ParticipantQuiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<ParticipantQuestionDto[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(config.quiz_timer_seconds);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);

  const { participantName, addAnswer, answers, totalRemainingSeconds } = useQuizStore();

  useEffect(() => {
    if (!participantName) {
      navigate("/");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await api.get<ParticipantQuestionDto[]>('/api/quiz/questions');
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to load questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [participantName, navigate]);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-submit when time runs out
      if (!isTransitioningRef.current && selectedAnswerId === null) {
        handleNext();
      }
    }
  }, [timeLeft, loading, questions, selectedAnswerId]);

  const handleAnswerSelect = (answerId: number) => {
    if (selectedAnswerId === null) {
      setSelectedAnswerId(answerId);
      // Auto-proceed after a short delay to show selection
      setTimeout(() => {
        handleNext(answerId);
      }, 600);
    }
  };

  const handleNext = async (providedAnswerId?: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const question = questions[currentQuestion];
    
    // Fallback answerId if none selected when time ran out
    const answeredId = providedAnswerId ?? selectedAnswerId ?? 0;
    
    // Save to Zustand
    addAnswer(question.id, answeredId, timeLeft);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswerId(null);
      setTimeLeft(config.quiz_timer_seconds);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    } else {
      // It was the last question, submit
      try {
        const payload: SubmitQuizDto = {
          name: participantName,
          // We must compute final remaining seconds since Zustand state update is async here
          totalRemainingSeconds: totalRemainingSeconds + timeLeft,
          answers: [...answers, { questionId: question.id, answerId: answeredId }]
        };
        await api.post('/api/quiz/submit', payload);
      } catch (error) {
        console.error("Submit failed", error);
      } finally {
        navigate("/results");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="text-white text-2xl">Suallar yüklənir...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a1628] gap-4">
        <div className="text-white text-2xl">Heç bir sual yoxdur.</div>
        <button className="px-6 py-2 bg-[#0066b2] rounded-xl text-white" onClick={() => navigate("/")}>Geri qayıt</button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1708063785769-43da3123684d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCTVclMjBlbmdpbmUlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3NTY1OTExMXww&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/98 via-[#0a1628]/95 to-[#0066b2]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-6 max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass px-6 py-3 rounded-2xl"
          >
            <span className="text-white/80 text-sm mr-2">Sual</span>
            <span className="text-white font-bold text-lg">
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass px-6 py-3 rounded-2xl flex items-center gap-3"
          >
            <Clock className="w-5 h-5 text-[#66b3ff]" />
            <span
              className={`font-bold text-lg ${
                timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white"
              }`}
            >
              {timeLeft}s
            </span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="glass rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0066b2] to-[#1c8cdc]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                {question.title}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {question.answers.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={selectedAnswerId !== null}
                  whileHover={selectedAnswerId === null ? { scale: 1.02 } : {}}
                  whileTap={selectedAnswerId === null ? { scale: 0.98 } : {}}
                  className={`
                    glass-hover rounded-2xl p-6 text-left transition-all duration-300
                    ${
                      selectedAnswerId === option.id
                        ? "glass-active"
                        : "glass"
                    }
                    ${selectedAnswerId !== null && selectedAnswerId !== option.id ? "opacity-50" : ""}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                      ${
                        selectedAnswerId === option.id
                          ? "bg-[#0066b2] text-white"
                          : "bg-white/10 text-white/60"
                      }
                    `}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-white font-medium text-lg">
                      {option.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>


          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
