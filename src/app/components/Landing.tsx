import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload, Sparkles, Target, Search, ArrowRight, ChevronDown, Info, LayoutDashboard, BarChart3, FileText, Star, Shield
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FloatingTooltip } from "./ui/FloatingTooltip";

const roles = [
  "Software Engineer", "Data Analyst", "Product Manager", "UX Designer",
  "DevOps Engineer", "Marketing Manager", "Data Scientist", "Frontend Developer",
];

function NavPill({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#f0f1f5] dark:bg-slate-800 border border-[#c7cbdb] dark:border-slate-700 rounded-lg px-4 py-2 flex items-center gap-2 text-[#0a2d67] dark:text-blue-400 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.1)] hover:bg-[#e8e9ef] dark:hover:bg-slate-700 transition-colors"
      style={{ fontSize: 17, fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
    >
      {children}
    </button>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden transition-colors" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#c7cbdb]/30 dark:border-slate-800 shadow-[0px_2px_8px_0px_rgba(32,41,76,0.05)] transition-colors">
        <div className="flex items-center justify-between px-10 py-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/icon.png" alt="rezumeAI icon" className="h-8 w-8 object-contain drop-shadow-sm" />
            <span className="text-[#676b89] dark:text-slate-300" style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Roboto', sans-serif" }}>
              rezume<span className="text-[#0a2d67] dark:text-blue-500">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/")} className="text-[#0a2d67] dark:text-blue-400 hover:opacity-80 transition-colors" style={{ fontSize: 16, fontWeight: 600 }}>Home</button>
            <button onClick={() => navigate("/app/editor")} className="text-[#676b89] dark:text-slate-400 hover:text-[#0a2d67] dark:hover:text-blue-400 transition-colors" style={{ fontSize: 16, fontWeight: 500 }}>Editor</button>
            <button onClick={() => navigate("/app/insights")} className="text-[#676b89] dark:text-slate-400 hover:text-[#0a2d67] dark:hover:text-blue-400 transition-colors" style={{ fontSize: 16, fontWeight: 500 }}>Insights</button>
          </div>

          <div className="flex items-center gap-4">
            <NavPill onClick={() => navigate("/app")}>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </NavPill>
          </div>
        </div>
      </nav>

      <section className="max-w-[1200px] mx-auto px-10 pt-32 pb-20">
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[#20294c] dark:text-slate-100 mb-6"
            style={{ fontSize: 80, fontWeight: 400, lineHeight: 1.05, fontFamily: "'DM Serif Display', serif" }}
          >
            Be painfully<br />aware.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[#20294c] dark:text-slate-300 mx-auto max-w-2xl"
            style={{ fontSize: 24, lineHeight: 1.5, fontWeight: 400 }}
          >
            ResumeAI connects to your career goals and gives<br />
            you a clear, honest picture of where your resume stands.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-[#0a2d67] dark:text-blue-400 mt-4"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            ↓ Add your resume below
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-6 mt-12 mb-4"
        >
          <div className="bg-[#f0f1f5] dark:bg-slate-800 rounded-2xl p-6 shadow-sm w-[340px] transition-colors">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 mb-4 border border-[#c7cbdb]/50 dark:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 14 }}>ATS Score</span>
                <span className="text-[#0a2d67] dark:text-blue-400" style={{ fontSize: 14, fontWeight: 600 }}>Software Eng.</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 48, fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>67</span>
                <span className="text-[#676b89] dark:text-slate-500 pb-2" style={{ fontSize: 18 }}>/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#f0f1f5] dark:bg-slate-800">
                <div className="h-full rounded-full bg-[#0a2d67] dark:bg-blue-500" style={{ width: "67%" }} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["React", "Node.js", "Python"].map(s => (
                <span key={s} className="px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-[#c7cbdb]/50 dark:border-slate-700 text-[#0a2d67] dark:text-blue-400" style={{ fontSize: 13, fontWeight: 500 }}>{s}</span>
              ))}
              <span className="px-3 py-1 rounded-md bg-[#0a2d67] dark:bg-blue-600 text-white" style={{ fontSize: 13, fontWeight: 500 }}>+4 more</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-[#c7cbdb]/40 dark:border-slate-700 w-[340px] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0a2d67] dark:bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 16, fontWeight: 600 }}>AI Suggestion</span>
            </div>
            <div className="bg-[#f0f1f5] dark:bg-slate-900 rounded-lg p-4 mb-3 transition-colors">
              <p className="text-[#676b89] dark:text-slate-500 line-through mb-2" style={{ fontSize: 13, lineHeight: 1.5 }}>Worked on building web apps</p>
              <p className="text-[#0a2d67] dark:text-blue-300" style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>Architected 5+ production React apps serving 50K+ daily users</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-[#0a2d67] dark:bg-blue-600 text-white" style={{ fontSize: 13, fontWeight: 600 }}>Accept</button>
              <button className="flex-1 py-2 rounded-lg bg-[#f0f1f5] dark:bg-slate-700 text-[#676b89] dark:text-slate-400 border border-[#c7cbdb] dark:border-slate-600 focus:outline-none" style={{ fontSize: 13, fontWeight: 600 }}>Reject</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Upload Section - moved up to be section 2 */}
      <section className="py-24 px-10">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[#20294c] dark:text-slate-100 mb-4" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
            To separate<br />anxiety from<br />your career.
          </h2>
          <p className="text-[#676b89] dark:text-slate-400 mb-12" style={{ fontSize: 20, lineHeight: 1.7 }}>
            Upload your resume. Pick a role. Get answers.
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb] dark:border-slate-700 p-8 shadow-sm text-left max-w-lg mx-auto transition-colors">
            <div className="relative mb-6">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-[#f0f1f5] dark:bg-slate-900 border border-[#c7cbdb] dark:border-slate-700 rounded-lg px-5 py-3.5 flex items-center justify-between hover:bg-[#e8e9ef] dark:hover:bg-slate-700 transition-colors"
              >
                <span className={selectedRole ? "text-[#20294c] dark:text-slate-200" : "text-[#676b89] dark:text-slate-500"} style={{ fontSize: 16, fontWeight: 500 }}>
                  {selectedRole || "Select target role..."}
                </span>
                <ChevronDown className="w-4 h-4 text-[#676b89] dark:text-slate-500" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white dark:bg-slate-800 border border-[#c7cbdb] dark:border-slate-700 shadow-md z-10 py-1 max-h-52 overflow-y-auto transition-colors">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => { setSelectedRole(role); setShowDropdown(false); }}
                      className="w-full text-left px-5 py-3 text-[#20294c] dark:text-slate-300 hover:bg-[#f0f1f5] dark:hover:bg-slate-700 transition-colors focus:outline-none"
                      style={{ fontSize: 15 }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
              className={`relative rounded-xl border-2 border-dashed p-10 transition-all cursor-pointer group ${
                isDragging ? "border-[#0a2d67] dark:border-blue-500 bg-[#0a2d67]/5 dark:bg-blue-500/10" : "border-[#c7cbdb] dark:border-slate-700 hover:border-[#0a2d67]/40 dark:hover:border-blue-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#f0f1f5] dark:bg-slate-900 border border-[#c7cbdb] dark:border-slate-700 flex items-center justify-center group-hover:bg-[#0a2d67]/5 dark:group-hover:bg-blue-500/10 transition-colors">
                  <Upload className="w-5 h-5 text-[#676b89] dark:text-slate-400 group-hover:text-[#0a2d67] dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 500 }}>Drop your resume here</p>
                <p className="text-[#676b89] dark:text-slate-500" style={{ fontSize: 14 }}>or click to browse files</p>
              </div>
              <div className="absolute top-3 right-4">
                <FloatingTooltip placement="bottom-end" content={<span style={{ fontSize: 13 }}>Supported: PDF, DOCX (max 5MB)</span>}>
                  <Info className="w-4 h-4 text-[#c7cbdb] dark:text-slate-600 hover:text-[#0a2d67] dark:hover:text-blue-400 transition-colors" />
                </FloatingTooltip>
              </div>
            </div>

            <button
              onClick={() => navigate("/app")}
              className="mt-6 w-full py-3.5 rounded-lg bg-[#0a2d67] dark:bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-[#0a2d67]/90 dark:hover:bg-blue-500 transition-colors shadow-sm"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              Analyze Resume
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f0f1f5] dark:bg-slate-800/50 py-24 px-10 transition-colors">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-[#20294c] dark:text-slate-100 mb-6" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
              Stop guessing<br />keywords<br />manually.
            </h2>
            <p className="text-[#676b89] dark:text-slate-400 max-w-md" style={{ fontSize: 20, lineHeight: 1.7 }}>
              Our AI reads job descriptions the same way ATS systems do, then tells you exactly what's missing from your resume.
            </p>
          </div>
          <div className="flex-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-[#c7cbdb]/40 dark:border-slate-700 transition-colors">
              <h4 className="text-[#0a2d67] dark:text-blue-400 mb-4" style={{ fontSize: 18, fontWeight: 600 }}>Missing Keywords</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {["CI/CD", "Agile", "TypeScript", "REST API", "System Design", "Docker", "Microservices"].map(kw => (
                  <span key={kw} className="px-4 py-2 rounded-lg bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb] dark:border-slate-600 text-[#20294c] dark:text-slate-300 hover:bg-[#0a2d67] dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all cursor-default" style={{ fontSize: 14, fontWeight: 500 }}>
                    {kw}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#c7cbdb]/40 dark:border-slate-700">
                <div className="w-2 h-2 rounded-full bg-[#ef4444] dark:bg-red-500" />
                <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 14 }}>7 keywords missing for Software Engineer role</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#20294c] dark:text-slate-100 mb-4" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
              More than just a<br />score.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { title: "Search", subtitle: "Every keyword", desc: "Scan your resume against thousands of job descriptions to find exactly what's missing.", icon: Search },
              { title: "Recall", subtitle: "Your strengths", desc: "AI identifies your strongest bullets and suggests how to replicate that quality everywhere.", icon: BarChart3 },
              { title: "Filter", subtitle: "What matters", desc: "Focus on the changes that will have the biggest impact on your ATS compatibility score.", icon: Target },
            ].map((f) => (
              <div key={f.title} className="bg-[#f0f1f5] dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <h3 style={{ fontSize: 28, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }} className="text-[#20294c] dark:text-slate-100">
                    {f.title}. <span className="text-[#676b89] dark:text-slate-400" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}>{f.subtitle}</span>
                  </h3>
                </div>
                <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 16, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb] dark:border-slate-700 p-6 flex items-center justify-between shadow-sm transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0a2d67] dark:bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>Current ATS Score</p>
                <p className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>67 / 100</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 14 }}>Potential after fixes:</span>
              <span className="text-[#0a2d67] dark:text-blue-400 bg-[#f0f1f5] dark:bg-slate-900 px-4 py-2 rounded-lg border border-[#c7cbdb] dark:border-slate-700" style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>92</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f0f1f5] dark:bg-slate-800/50 py-24 px-10 transition-colors">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[#20294c] dark:text-slate-100 mb-4" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
            Inform &<br />Delight.
          </h2>
          <p className="text-[#676b89] dark:text-slate-400 mb-12 max-w-lg" style={{ fontSize: 20, lineHeight: 1.7 }}>
            Every insight is designed to be actionable. No jargon, no confusion — just clear paths to a better resume.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb] dark:border-slate-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0a2d67] dark:text-blue-400" />
                </div>
                <span className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 18, fontWeight: 600 }}>Resume Analysis</span>
              </div>
              {[
                { label: "Skills Match", value: "72%" },
                { label: "Keywords Found", value: "4/12" },
                { label: "Format Score", value: "85%" },
                { label: "Impact Score", value: "58%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#c7cbdb]/30 dark:border-slate-700 last:border-0">
                  <span className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 15 }}>{item.label}</span>
                  <span className="text-[#0a2d67] dark:text-blue-400" style={{ fontSize: 15, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb] dark:border-slate-600 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#0a2d67] dark:text-blue-400" />
                </div>
                <span className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 18, fontWeight: 600 }}>Top Suggestions</span>
              </div>
              {[
                "Add measurable achievements to each role",
                "Include a Projects section with links",
                "Use STAR method for experience bullets",
                "Mirror job description language",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-[#c7cbdb]/30 dark:border-slate-700 last:border-0">
                  <span className="text-[#0a2d67] dark:text-blue-400 shrink-0 mt-0.5" style={{ fontSize: 13, fontWeight: 700 }}>0{i + 1}</span>
                  <span className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 15, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a2d67] dark:bg-blue-900 py-24 px-10 transition-colors">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-white mb-6" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
              Never guess<br />about ATS<br />again.
            </h2>
            <p className="text-white/60 mb-8 max-w-md" style={{ fontSize: 20, lineHeight: 1.7 }}>
              Upload once, get instant clarity. Our AI breaks down exactly how automated systems read your resume — no more black boxes.
            </p>
            <button
              onClick={() => navigate("/app")}
              className="bg-white dark:bg-slate-100 text-[#0a2d67] dark:text-blue-900 rounded-lg px-6 py-3 flex items-center gap-2 hover:bg-[#f0f1f5] dark:hover:bg-slate-200 transition-colors shadow-sm"
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              <Upload className="w-5 h-5" />
              Try it now
            </button>
          </div>
          <div className="flex-1">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1736939661350-dec5c2bd5cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXN1bWUlMjBkb2N1bWVudCUyMGxhcHRvcHxlbnwxfHx8fDE3NzQwMzMwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Resume analysis"
              className="rounded-2xl w-full object-cover max-h-[360px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f0f1f5] dark:bg-slate-900 py-20 px-10 transition-colors border-t border-[#c7cbdb]/40 dark:border-slate-800">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[#20294c] dark:text-slate-100 mb-4" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
            It's just a resume,<br />after all.
          </h2>
          <p className="text-[#676b89] dark:text-slate-400 mb-10" style={{ fontSize: 20, lineHeight: 1.6 }}>
            But it's your first impression. Make it count.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="bg-[#0a2d67] dark:bg-blue-600 text-white rounded-lg px-8 py-4 hover:bg-[#0a2d67]/90 dark:hover:bg-blue-500 transition-colors shadow-sm"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            Get started free
          </button>
        </div>
      </section>

      <footer className="py-10 px-10 border-t border-[#c7cbdb]/40 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate("/")}>
            <img src="/icon.png" alt="rezumeAI icon" className="h-6 w-6 object-contain grayscale" />
            <span className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 20, fontWeight: 700 }}>
              rezume<span className="text-[#0a2d67] dark:text-blue-500">AI</span>
            </span>
          </div>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Blog", "Contact"].map(link => (
              <NavPill key={link}>{link}</NavPill>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
