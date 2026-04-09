import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Trash2,
  Save,
  Settings,
  CheckCircle2,
  Circle,
  Eye,
  BarChart3,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import { QuestionDto, QuizResultDto } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

interface LocalQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function AdminPanel() {
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<LocalQuestion>({
    id: 0,
    question: "Yeni Sual",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const [stats, setStats] = useState({
    participants: 0,
    avgScore: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Load questions and stats
  const fetchData = async () => {
    try {
      // Fetch Questions
      const questionsRes = await api.get<QuestionDto[]>("/api/quiz/admin/questions");
      const localQuestions = questionsRes.data.map(q => ({
        id: q.id,
        question: q.title,
        options: q.answers.map(a => a.title),
        correctAnswer: q.answers.findIndex(a => a.isRight),
      }));
      setQuestions(localQuestions);
      if (localQuestions.length > 0 && selectedQuestion === null) {
        setSelectedQuestion(localQuestions[0].id);
      }

      // Fetch Leaderboard for stats
      const leaderboardRes = await api.get<QuizResultDto[]>("/api/quiz/leaderboard");
      const leaderboard = leaderboardRes.data;
      const avgScore = leaderboard.length > 0
        ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.points, 0) / leaderboard.length)
        : 0;
      
      setStats({
        participants: leaderboard.length,
        avgScore,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedQuestion !== null) {
      const selected = questions.find((q) => q.id === selectedQuestion);
      if (selected) {
        setEditedQuestion({ ...selected });
      }
    }
  }, [selectedQuestion, questions]);

  const handleQuestionChange = (field: keyof LocalQuestion, value: any) => {
    setEditedQuestion({ ...editedQuestion, [field]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dto: QuestionDto = {
        id: editedQuestion.id,
        title: editedQuestion.question,
        answers: editedQuestion.options.map((opt, i) => ({
          id: 0, // backend generates answer id
          title: opt,
          isRight: i === editedQuestion.correctAnswer
        }))
      };

      if (editedQuestion.id === 0) {
        // Create new
        const res = await api.post<QuestionDto>("/api/quiz/admin/questions", dto);
        setQuestions([...questions, {
          id: res.data.id,
          question: res.data.title,
          options: res.data.answers.map(a => a.title),
          correctAnswer: res.data.answers.findIndex(a => a.isRight)
        }]);
        setSelectedQuestion(res.data.id);
      } else {
        // Update existing
        await api.put(`/api/quiz/admin/questions/${editedQuestion.id}`, dto);
        const updatedQuestions = questions.map((q) =>
          q.id === editedQuestion.id ? editedQuestion : q
        );
        setQuestions(updatedQuestions);
      }
      toast.success("Sual uğurla yadda saxlanıldı!");
      fetchData(); // reload
    } catch (e) {
      console.error(e);
      toast.error("Sualı yadda saxlamaq mümkün olmadı.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: LocalQuestion = {
      id: 0, // 0 denotes unsaved new question
      question: "Yeni Sual",
      options: ["Variant A", "Variant B", "Variant C", "Variant D"],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(0);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (id === 0) {
      // Just local delete
      const filtered = questions.filter((q) => q.id !== id);
      setQuestions(filtered);
      setSelectedQuestion(filtered[0]?.id || null);
      return;
    }
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/quiz/admin/questions/${id}`);
      const filtered = questions.filter((q) => q.id !== id);
      setQuestions(filtered);
      if (selectedQuestion === id) {
        setSelectedQuestion(filtered[0]?.id || null);
      }
      toast.success("Sual uğurla silindi.");
    } catch (e) {
      console.error(e);
      toast.error("Sualı silmək mümkün olmadı.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearLeaderboard = async () => {
    setIsResetting(true);
    try {
      await api.delete("/api/quiz/admin/results/reset");
      setStats({ participants: 0, avgScore: 0 });
      toast.success("Liderlər lövhəsi uğurla təmizləndi!");
    } catch (e) {
      console.error(e);
      toast.error("Liderlər lövhəsini təmizləmək mümkün olmadı.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#0066b2]/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-strong rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0066b2] to-[#1c8cdc] rounded-2xl flex items-center justify-center">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Paneli</h1>
                <p className="text-white/60">VIVA FEST 2026 Viktorina İdarəetməsi</p>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="/leaderboard"
                target="_blank"
                className="glass px-6 py-3 rounded-xl text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Liderlər lövhəsinə bax
              </a>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/60 text-sm mb-1">Ümumi Suallar</div>
                <div className="text-4xl font-bold text-white">{questions.length}</div>
              </div>
              <div className="w-14 h-14 bg-[#0066b2]/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-[#0066b2]" />
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/60 text-sm mb-1">İştirakçılar</div>
                <div className="text-4xl font-bold text-white">{stats.participants}</div>
              </div>
              <div className="w-14 h-14 bg-[#1c8cdc]/20 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-[#1c8cdc]" />
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/60 text-sm mb-1">Ortalama Bal</div>
                <div className="text-4xl font-bold text-white">{stats.avgScore}</div>
              </div>
              <div className="w-14 h-14 bg-[#66b3ff]/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-[#66b3ff]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sidebar - Question List */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Suallar</h2>
                <button
                  onClick={handleAddQuestion}
                  className="p-2 bg-[#0066b2] hover:bg-[#1c8cdc] rounded-xl transition-all"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {questions.map((q, index) => (
                  <motion.button
                    key={q.id === 0 ? `new-${index}` : q.id}
                    onClick={() => setSelectedQuestion(q.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all
                      ${
                        selectedQuestion === q.id
                          ? "bg-[#0066b2]/30 border border-[#0066b2]"
                          : "glass hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-white/80 text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm line-clamp-2">
                          {q.question}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Sualı Redaktə Et</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={isDeleting}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all text-red-400 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bu sualı silmək istədiyinizə əminsiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu hərəkət geri qaytarıla bilməz. Bu, sualı qalıcı olaraq siləcək.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İmtina et</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteQuestion(editedQuestion.id)}>Davam et</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-white/80 mb-2 text-sm">
                    Sualın Mətni
                  </label>
                  <textarea
                    value={editedQuestion.question}
                    onChange={(e) =>
                      handleQuestionChange("question", e.target.value)
                    }
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0066b2] transition-all resize-none"
                    rows={3}
                    placeholder="Sualınızı daxil edin..."
                  />
                </div>

                {/* Answer Options */}
                <div>
                  <label className="block text-white/80 mb-3 text-sm">
                    Cavab Seçimləri
                  </label>
                  <div className="space-y-3">
                    {editedQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuestionChange("correctAnswer", index)
                          }
                          className="flex-shrink-0"
                        >
                          {editedQuestion.correctAnswer === index ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-white/40" />
                          )}
                        </button>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-sm font-bold flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            className="flex-1 px-4 py-3 glass rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0066b2] transition-all"
                            placeholder={`Variant ${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Düzgün cavabı qeyd etmək üçün dairə ikonuna klikləyin
                  </p>
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={handleSave}
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#0066b2] to-[#1c8cdc] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaving ? "Yadda saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}
                </motion.button>

                {/* Clear Leaderboard WITH ALERT DIALOG */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      disabled={isResetting}
                      className="w-full py-3 glass hover:bg-red-500/20 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-red-500/20 disabled:opacity-50"
                    >
                      {isResetting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                      Liderlər lövhəsini sıfırla
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tamamilə əminsiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu hərəkət geri qaytarıla bilməz. Bu, liderlər lövhəsinin vəziyyətini qalıcı olaraq siləcək və bütün iştirakçı reytinqlərini serverlərdən təmizləyəcək.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İmtina et</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearLeaderboard}>Davam et</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
