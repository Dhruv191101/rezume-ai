import { FloatingTooltip } from "./ui/FloatingTooltip";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto w-full dark:bg-slate-900 transition-colors">
      <h1 className="text-[#20294c] dark:text-slate-100 mb-8" style={{ fontSize: 36, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.1)] transition-colors">
          <h2 className="text-[#0a2d67] dark:text-blue-400 mb-6" style={{ fontSize: 18, fontWeight: 600 }}>Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[#676b89] dark:text-slate-400 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>Name</label>
              <input type="text" className="w-full bg-[#f0f1f5] dark:bg-slate-900 border border-[#c7cbdb] dark:border-slate-700 rounded-lg px-4 py-2 text-[#20294c] dark:text-slate-200 focus:outline-none focus:border-[#0a2d67] dark:focus:border-blue-500" defaultValue="Jane Doe" />
            </div>
            <div>
              <label className="block text-[#676b89] dark:text-slate-400 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>Email Address</label>
              <input type="email" className="w-full bg-[#f0f1f5] dark:bg-slate-900 border border-[#c7cbdb] dark:border-slate-700 rounded-lg px-4 py-2 text-[#20294c] dark:text-slate-200 focus:outline-none focus:border-[#0a2d67] dark:focus:border-blue-500" defaultValue="jane@example.com" />
            </div>
          </div>

          {/* AI Service Status */}
          <div className="mt-6 bg-[#f0f1f5] dark:bg-slate-900 rounded-lg p-4 border border-[#c7cbdb]/30 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 14, fontWeight: 600 }}>AI Service: Active</p>
                <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 12 }}>Powered by NVIDIA Nemotron 3 Super via OpenRouter — no API key needed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.1)] transition-colors">
          <h2 className="text-[#0a2d67] dark:text-blue-400 mb-6" style={{ fontSize: 18, fontWeight: 600 }}>Preferences</h2>
          <div className="flex items-center justify-between py-3 border-b border-[#c7cbdb]/30 dark:border-slate-700">
            <div>
              <h3 className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 15, fontWeight: 600 }}>Email Notifications</h3>
              <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>Receive an email when my resume analysis is ready.</p>
            </div>
            <div className="w-12 h-6 bg-[#0a2d67] dark:bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 pt-6">
            <div>
              <h3 className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 15, fontWeight: 600 }}>Dark Theme</h3>
              <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>Switch application to dark mode.</p>
            </div>
            
            {mounted && (
              <div 
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isDark ? "bg-blue-500" : "bg-[#c7cbdb]"}`}
              >
                <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${isDark ? "right-1" : "left-1"}`}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
