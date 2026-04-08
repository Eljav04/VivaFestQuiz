import { Link, useLocation } from "react-router";
import { Home, PlayCircle, Trophy, Settings } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  const links = [
    { path: "/", icon: Home, label: "Entry" },
    { path: "/quiz", icon: PlayCircle, label: "Quiz" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/admin", icon: Settings, label: "Admin" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-strong px-6 py-3 rounded-full flex items-center gap-2">
        {links.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`
              px-4 py-2 rounded-full transition-all flex items-center gap-2
              ${
                location.pathname === path
                  ? "bg-[#0066b2] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:inline">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
