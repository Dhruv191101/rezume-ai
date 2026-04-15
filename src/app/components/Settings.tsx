import { FloatingTooltip } from "./ui/FloatingTooltip";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Key, Eye, EyeOff, Check, X, Loader2, ExternalLink } from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // API Key state
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    // Load saved API key
    const saved = localStorage.getItem("rezume_openrouter_key");
    if (saved) setApiKey(saved);
  }, []);

  const isDark = theme === "dark";

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem("rezume_openrouter_key", trimmed);
    } else {
      localStorage.removeItem("rezume_openrouter_key");
    }
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim() || import.meta.env.VITE_OPENROUTER_API_KEY || "";
    if (!keyToTest) {
      setTestStatus("error");
      setTestMessage("No API key provided.");
      return;
    }

    setTestStatus("testing");
    setTestMessage("");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${keyToTest}`,
          "Content-Type": "application/json",
          "X-Title": "rezumeAI"
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free",
          max_tokens: 10,
          messages: [{ role: "user", content: "Say OK" }]
        })
      });

      if (response.ok) {
        setTestStatus("success");
        setTestMessage("Connection successful! AI features are ready.");
        // Auto-save on successful test
        if (apiKey.trim()) {
          localStorage.setItem("rezume_openrouter_key", apiKey.trim());
        }
      } else {
        const errorData = await response.json();
        const msg = errorData.error?.message || `HTTP ${response.status}`;
        setTestStatus("error");
        setTestMessage(`Connection failed: ${msg}`);
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage(`Network error: ${err.message}`);
    }
  };

  const hasEnvKey = Boolean(import.meta.env.VITE_OPENROUTER_API_KEY);
  const hasUserKey = Boolean(apiKey.trim());
  const activeKeySource = hasUserKey ? "your key" : hasEnvKey ? "built-in key" : "none";

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto w-full dark:bg-slate-900 transition-colors">
      <h1 className="text-[#20294c] dark:text-slate-100 mb-8" style={{ fontSize: 36, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>Settings</h1>
      
      <div className="space-y-6">
        {/* ─── AI Configuration ─── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.1)] transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#0a2d67] dark:bg-blue-600 flex items-center justify-center">
              <Key className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-[#0a2d67] dark:text-blue-400" style={{ fontSize: 18, fontWeight: 600 }}>AI Configuration</h2>
              <p className="text-[#676b89] dark:text-slate-500" style={{ fontSize: 12 }}>Connect your OpenRouter API key to enable AI-powered suggestions</p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <label className="block text-[#676b89] dark:text-slate-400" style={{ fontSize: 13, fontWeight: 500 }}>
              OpenRouter API Key
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showKey ? "text" : "password"}
                  className="w-full bg-[#f0f1f5] dark:bg-slate-900 border border-[#c7cbdb] dark:border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-[#20294c] dark:text-slate-200 focus:outline-none focus:border-[#0a2d67] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#0a2d67]/10 dark:focus:ring-blue-500/10 transition-all font-mono"
                  placeholder="sk-or-v1-..."
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setTestStatus("idle"); }}
                  style={{ fontSize: 13 }}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#676b89] dark:text-slate-500 hover:text-[#20294c] dark:hover:text-slate-300 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2.5 bg-[#0a2d67] dark:bg-blue-600 text-white rounded-lg hover:bg-[#0c3578] dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow-md shrink-0"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Save
              </button>
              <button
                onClick={handleTestKey}
                disabled={testStatus === "testing"}
                className="px-4 py-2.5 bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb] dark:border-slate-600 text-[#20294c] dark:text-slate-200 rounded-lg hover:bg-[#e8e9ef] dark:hover:bg-slate-600 transition-all shrink-0 disabled:opacity-50"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                {testStatus === "testing" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
              </button>
            </div>

            {/* Test result */}
            {testStatus === "success" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-lg">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-green-700 dark:text-green-400" style={{ fontSize: 12 }}>{testMessage}</p>
              </div>
            )}
            {testStatus === "error" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                <X className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                <p className="text-red-600 dark:text-red-400" style={{ fontSize: 12 }}>{testMessage}</p>
              </div>
            )}

            {/* Status indicator */}
            <div className="bg-[#f8f9fb] dark:bg-slate-900/50 rounded-lg p-4 border border-[#e4e5ea]/60 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  hasUserKey || hasEnvKey ? "bg-amber-400" : "bg-red-500"
                } ${testStatus === "success" ? "!bg-green-500 animate-pulse" : ""}`} />
                <div>
                  <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 14, fontWeight: 600 }}>
                    {testStatus === "success" 
                      ? "AI Service: Connected" 
                      : hasUserKey || hasEnvKey 
                        ? "AI Service: Key Provided (untested)" 
                        : "AI Service: Not Configured"}
                  </p>
                  <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 12 }}>
                    {testStatus === "success"
                      ? `Using ${activeKeySource} — NVIDIA Nemotron 3 Super via OpenRouter`
                      : hasUserKey || hasEnvKey
                        ? `Using ${activeKeySource} — click "Test" to confirm it works`
                        : "Add your OpenRouter API key above to enable AI features"}
                  </p>
                </div>
              </div>
            </div>

            {/* Help text */}
            <p className="text-[#676b89] dark:text-slate-500 flex items-center gap-1.5" style={{ fontSize: 12 }}>
              Get a free API key at{" "}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0a2d67] dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                openrouter.ai/keys <ExternalLink className="w-3 h-3" />
              </a>
              {" "}— your key is stored locally in your browser only.
            </p>
          </div>
        </div>

        {/* ─── Profile Information ─── */}
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
        </div>

        {/* ─── Preferences ─── */}
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
