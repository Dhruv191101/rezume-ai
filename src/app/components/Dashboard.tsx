import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Info, TrendingUp, AlertTriangle, Tag, Lightbulb, ArrowRight, Upload, FileEdit } from "lucide-react";

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info className="w-4 h-4 text-[#c7cbdb] dark:text-slate-500 hover:text-[#676b89] dark:hover:text-slate-300 transition-colors cursor-help" />
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-4 py-2.5 rounded-lg bg-[#20294c] dark:bg-slate-700 shadow-xl whitespace-nowrap z-20">
          <p className="text-white" style={{ fontSize: 13 }}>{text}</p>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" className="stroke-[#f0f1f5] dark:stroke-slate-800" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          className="stroke-[#0a2d67] dark:stroke-blue-500 transition-all duration-1000"
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 36, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>{score}</span>
        <span className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>/ 100</span>
      </div>
    </div>
  );
}

const missingKeywords = ["CI/CD", "Agile", "TypeScript", "REST API", "System Design", "Microservices", "Docker"];
const weaknesses = [
  "Work experience bullets lack quantifiable metrics",
  "Summary section is too generic for the target role",
  "Technical skills section missing key frameworks",
];
const suggestions = [
  "Add 2-3 measurable achievements per role",
  "Tailor your summary to mention the specific role",
  "Include a dedicated 'Projects' section with links",
  "Use stronger action verbs: 'Architected', 'Spearheaded'",
];

export function Dashboard() {
  const navigate = useNavigate();
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rezumeData");
    setHasResume(!!saved);
  }, []);

  return (
    <div className="p-10 h-full w-full overflow-y-auto dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="max-w-[1100px] mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[#20294c] dark:text-slate-100 mb-2" style={{ fontSize: 36, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>Dashboard</h1>
          <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 16 }}>Your resume analysis at a glance</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <button
            onClick={() => navigate("/app/editor")}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-6 flex items-center gap-4 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(32,41,76,0.12)] hover:-translate-y-1 transition-all duration-300 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0a2d67] dark:bg-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileEdit className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>Open Editor</p>
              <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>Edit & preview your resume</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#c7cbdb] dark:text-slate-600 ml-auto group-hover:text-[#0a2d67] dark:group-hover:text-blue-400 transition-colors" />
          </button>

          <button
            onClick={() => navigate("/app/insights")}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-6 flex items-center gap-4 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(32,41,76,0.12)] hover:-translate-y-1 transition-all duration-300 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb]/50 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Tag className="w-5 h-5 text-[#0a2d67] dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>Keyword Scan</p>
              <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>Analyze against a job listing</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#c7cbdb] dark:text-slate-600 ml-auto group-hover:text-[#0a2d67] dark:group-hover:text-blue-400 transition-colors" />
          </button>

          <button
            onClick={() => navigate("/app/editor")}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-6 flex items-center gap-4 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(32,41,76,0.12)] hover:-translate-y-1 transition-all duration-300 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb]/50 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-[#0a2d67] dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>Upload Resume</p>
              <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>Import PDF or TXT file</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#c7cbdb] dark:text-slate-600 ml-auto group-hover:text-[#0a2d67] dark:group-hover:text-blue-400 transition-colors" />
          </button>
        </div>

        {/* Score Section */}
        <div className="flex items-center gap-8 mb-10 bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-8 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] transition-colors">
          <ScoreRing score={67} />
          <div>
            <h2 className="text-[#20294c] dark:text-slate-200 mb-1.5" style={{ fontSize: 22, fontWeight: 500 }}>ATS Compatibility Score</h2>
            <p className="text-[#676b89] dark:text-slate-400 max-w-md" style={{ fontSize: 15, lineHeight: 1.65 }}>
              Your resume scores <span className="text-[#0a2d67] dark:text-blue-400" style={{ fontWeight: 600 }}>67/100</span> for the Software Engineer role.
              There are several areas where improvements could significantly boost your chances.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Skills Match */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-7 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(32,41,76,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb]/50 dark:border-slate-600 flex items-center justify-center transition-colors">
                  <TrendingUp className="w-[18px] h-[18px] text-[#0a2d67] dark:text-blue-400" />
                </div>
                <h3 className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>Skills Match</h3>
              </div>
              <Tooltip text="How well your skills match the target role" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 32, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>72%</span>
              <span className="text-[#676b89] dark:text-slate-500 pb-1" style={{ fontSize: 14 }}>match rate</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f0f1f5] dark:bg-slate-700 mb-3 transition-colors">
              <div className="h-full rounded-full bg-[#0a2d67] dark:bg-blue-500 transition-all duration-1000" style={{ width: "72%" }} />
            </div>
            <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 14 }}>7 of 10 required skills detected</p>
          </div>

          {/* Missing Keywords */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-7 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(32,41,76,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb]/50 dark:border-slate-600 flex items-center justify-center transition-colors">
                  <Tag className="w-[18px] h-[18px] text-[#0a2d67] dark:text-blue-400" />
                </div>
                <h3 className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>Missing Keywords</h3>
              </div>
              <Tooltip text="Keywords absent from your resume" />
            </div>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw) => (
                <span key={kw} className="px-3 py-1.5 rounded-lg bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb]/50 dark:border-slate-600 text-[#20294c] dark:text-slate-300 hover:bg-[#0a2d67] dark:hover:bg-blue-600 hover:text-white hover:border-[#0a2d67] dark:hover:border-blue-600 transition-all cursor-default" style={{ fontSize: 13, fontWeight: 500 }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-7 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(32,41,76,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#fff3cd] dark:bg-amber-900/30 border border-[#ffc107]/20 dark:border-amber-700/50 flex items-center justify-center transition-colors">
                  <AlertTriangle className="w-[18px] h-[18px] text-[#b8860b] dark:text-amber-400" />
                </div>
                <h3 className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>Weaknesses</h3>
              </div>
              <Tooltip text="Areas that may cause ATS rejection" />
            </div>
            <div className="flex flex-col gap-2.5">
              {weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#f0f1f5] dark:bg-slate-700/50 rounded-lg px-4 py-3 border border-[#c7cbdb]/30 dark:border-slate-700 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b8860b] dark:bg-amber-400 mt-2 shrink-0" />
                  <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 14, lineHeight: 1.5 }}>{w}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-gradient-to-br from-[#0a2d67] to-[#124294] dark:from-blue-900 dark:to-slate-800 rounded-2xl p-7 shadow-[0px_4px_12px_0px_rgba(10,45,103,0.3)] hover:shadow-[0px_12px_32px_0px_rgba(10,45,103,0.4)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-white/10 dark:bg-white/5 flex items-center justify-center">
                <Lightbulb className="w-[18px] h-[18px] text-white dark:text-blue-300" />
              </div>
              <h3 className="text-white dark:text-slate-100" style={{ fontSize: 16, fontWeight: 600 }}>Suggestions</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/8 dark:bg-white/5 rounded-lg px-4 py-3">
                  <span className="text-white/40 dark:text-slate-500 shrink-0" style={{ fontSize: 13, fontWeight: 700 }}>0{i + 1}</span>
                  <p className="text-white/70 dark:text-slate-300" style={{ fontSize: 14, lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
