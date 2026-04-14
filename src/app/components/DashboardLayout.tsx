import { NavLink, Outlet, useLocation, Link } from "react-router";
import { LayoutDashboard, FileEdit, Lightbulb, Settings, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/app/editor", icon: FileEdit, label: "Editor", end: false },
  { to: "/app/insights", icon: Lightbulb, label: "Insights", end: false },
];

export function DashboardLayout() {
  const location = useLocation();
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fafbfd] dark:bg-slate-900 flex transition-colors" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[230px] bg-white dark:bg-slate-950 flex flex-col shrink-0 shadow-[4px_0px_20px_0px_rgba(32,41,76,0.05)] z-10 border-r border-[#c7cbdb]/40 dark:border-slate-800 transition-colors">
        <div className="px-6 py-6 border-b border-[#c7cbdb]/30 dark:border-slate-800/50">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={`${import.meta.env.BASE_URL}icon.png`} alt="rezumeAI icon" className="h-8 w-8 object-contain drop-shadow-sm dark:brightness-110" />
            <span className="text-[#0a2d67] dark:text-white" style={{ fontSize: 24, fontWeight: 700 }}>
              rezume<span className="text-[#676b89] dark:text-white/60">AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#f0f1f5] text-[#0a2d67] dark:bg-blue-600/20 dark:text-blue-400 font-semibold shadow-sm"
                    : "text-[#676b89] hover:bg-[#fafbfd] hover:text-[#20294c] dark:text-white/50 dark:hover:bg-slate-800 dark:hover:text-white/80"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-[18px] h-[18px]" />
                  <span style={{ fontSize: 15, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-[#c7cbdb]/30 dark:border-slate-800/50">
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
                isActive
                  ? "bg-[#f0f1f5] text-[#0a2d67] dark:bg-blue-600/20 dark:text-blue-400 font-semibold"
                  : "text-[#676b89] hover:bg-[#fafbfd] hover:text-[#20294c] dark:text-white/40 dark:hover:bg-slate-800 dark:hover:text-white/70"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings className="w-[18px] h-[18px]" />
                <span style={{ fontSize: 15, fontWeight: isActive ? 600 : 500 }}>Settings</span>
              </>
            )}
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden bg-[#fafbfd] dark:bg-slate-900 relative transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
