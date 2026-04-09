import { createBrowserRouter } from "react-router-dom";
import { ParticipantEntry } from "../pages/quiz/ParticipantEntryPage";
import { ParticipantQuiz } from "../pages/quiz/ParticipantQuizPage";
import { ParticipantResults } from "../pages/quiz/ParticipantResultsPage";
import { Leaderboard } from "../pages/LeaderboardPage";
import { AdminPanel } from "../pages/AdminPage";
import { Navigation } from "../components/Navigation";


function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><ParticipantEntry /></Layout>,
  },
  {
    path: "/quiz",
    element: <Layout><ParticipantQuiz /></Layout>,
  },
  {
    path: "/results",
    element: <Layout><ParticipantResults /></Layout>,
  },
  {
    path: "/leaderboard",
    element: <Layout><Leaderboard /></Layout>,
  },
  {
    path: "/admin",
    element: <Layout><AdminPanel /></Layout>,
  },
]);