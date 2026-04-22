import { useState, useRef, useEffect } from "react";
import { Check, X, Sparkles, ChevronRight, Upload, Download, Loader2, ChevronDown, FileText, Briefcase, Code2, GraduationCap, User, ArrowRight } from "lucide-react";
import { fetchAISuggestions } from "../services/openRouter";
import { useReactToPrint } from "react-to-print";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { ResumePreview } from "./ResumePreview";

// Initialize PDF.js worker securely using Vite URL import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Suggestion {
  id: string;
  original: string;
  improved: string;
  reason: string;
  accepted: boolean | null;
}

interface ResumeSection {
  id: string;
  section: string;
  content: string;
}

const sectionIcons: Record<string, React.ElementType> = {
  summary: User,
  experience: Briefcase,
  skills: Code2,
  education: GraduationCap,
};

const defaultResume: ResumeSection[] = [
  { id: "summary", section: "Summary", content: "Experienced software engineer with 4+ years working on web applications. Skilled in JavaScript, React, and backend technologies. Looking for new opportunities to grow." },
  { id: "experience", section: "Experience", content: "Worked on building web applications using React and Node.js\nHelped improve the deployment process for the team\nResponsible for database management and optimization\nParticipated in code reviews and mentored junior developers" },
  { id: "skills", section: "Skills", content: "JavaScript, React, Node.js, Python, SQL, Git, HTML, CSS" },
  { id: "education", section: "Education", content: "B.S. Computer Science — State University, 2020" },
];

export function Editor() {
  const [resumeData, setResumeData] = useState<ResumeSection[]>(() => {
    const saved = localStorage.getItem("rezumeData");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return defaultResume;
  });
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["summary", "experience", "skills", "education"]));
  // view: 'edit' shows editor+AI side-by-side, 'preview' shows document preview
  const [view, setView] = useState<'edit' | 'preview'>('edit');

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("rezumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  const handleAction = (id: string, accept: boolean) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, accepted: accept } : s)));
    
    if (accept) {
      const suggestion = suggestions.find(s => s.id === id);
      if (suggestion) {
        setResumeData(prev => prev.map(section => ({
          ...section,
          content: section.content.replace(suggestion.original, suggestion.improved)
        })));
      }
    }
  };

  const handleContentChange = (id: string, newContent: string) => {
    setResumeData(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let text = "";
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageText = "";
        let lastY = -1;
        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          const y = item.transform[5]; // Y coordinate
          if (lastY !== -1 && Math.abs(lastY - y) > 4) {
            pageText += "\n" + item.str;
          } else {
            pageText += (pageText.endsWith("\n") || pageText.endsWith(" ") ? "" : " ") + item.str;
          }
          lastY = y;
        }
        fullText += pageText + "\n";
      }
      text = fullText;
    } else {
      text = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve((evt.target?.result as string) || "");
        reader.readAsText(file);
      });
    }

    const lines = text.split('\n');
    let currentSection = "summary";
    let summary = "";
    let experience = "";
    let education = "";
    let skills = "";

    for(const line of lines) {
       const lower = line.toLowerCase().trim();
       if (!lower) continue;
       
       // Header detection - improved to catch typical resume headers (ignoring spacing issues from PDF parsers)
       const normalized = lower.replace(/\s+/g, '');
       if (normalized.length < 50) {
         if (normalized.includes("experience") || normalized.includes("workhistory") || normalized.includes("employment")) { currentSection = "experience"; continue; }
         if (normalized.includes("education") || normalized.includes("academic") || normalized.includes("certifications") || normalized.includes("qualification")) { currentSection = "education"; continue; }
         if (normalized.includes("skills") || normalized.includes("technologies") || normalized.includes("corecompetencies") || normalized.includes("expertise")) { currentSection = "skills"; continue; }
         if (normalized.includes("summary") || normalized.includes("profile") || normalized.includes("aboutme") || normalized.includes("objective") || normalized.includes("professionalsummary")) { currentSection = "summary"; continue; }
       }

       if (currentSection === "summary") summary += line + "\n";
       if (currentSection === "experience") experience += line + "\n";
       if (currentSection === "education") education += line + "\n";
       if (currentSection === "skills") skills += line + "\n";
    }

    setResumeData([
      { id: "summary", section: "Summary", content: summary.trim() },
      { id: "experience", section: "Experience", content: experience.trim() },
      { id: "skills", section: "Skills", content: skills.trim() },
      { id: "education", section: "Education", content: education.trim() },
    ]);
    setSuggestions([]);
  };

  const handleGenerateAI = async () => {
    if (!targetRole.trim()) {
      setErrorMsg("Please enter a target job role.");
      return;
    }
    setErrorMsg("");
    setIsGenerating(true);
    
    try {
      const fullText = resumeData.map(s => `${s.section}:\n${s.content}`).join("\n\n");
      const results = await fetchAISuggestions(fullText, targetRole);
      
      if (results && Array.isArray(results) && results.length > 0) {
        const newSuggestions = results.map((r: any) => ({
           id: Math.random().toString(36).substring(7),
           original: r.original || "Original text not specified",
           improved: r.improved || "Improved text not specified",
           reason: r.reason || "AI generated suggestion",
           accepted: null
        }));
        setSuggestions(newSuggestions);
      } else {
        setErrorMsg("No structured suggestions generated. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate suggestions.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pending = suggestions.filter((s) => s.accepted === null).length;
  const accepted = suggestions.filter((s) => s.accepted === true).length;
  const wordCount = resumeData.reduce((acc, s) => acc + s.content.split(/\s+/).filter(Boolean).length, 0);

  // Highlight matching text in textarea content
  const isTextHighlighted = (sectionContent: string) => {
    if (!activeSuggestion) return false;
    const sg = suggestions.find(s => s.id === activeSuggestion);
    if (!sg || sg.accepted !== null) return false;
    return sectionContent.includes(sg.original);
  };

  return (
    <div className="h-full flex flex-col dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Roboto', sans-serif" }}>
      
      {/* ─── Toolbar Ribbon ─── */}
      <div className="px-6 py-3 border-b border-[#c7cbdb]/40 dark:border-slate-800 bg-white dark:bg-slate-950/60 flex items-center gap-3 shrink-0 transition-colors">
        
        {/* Left cluster: Title + Upload */}
        <h1 className="text-[#20294c] dark:text-slate-100 mr-2" style={{ fontSize: 22, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>Editor</h1>
        <div className="w-px h-6 bg-[#c7cbdb]/50 dark:bg-slate-700 mx-1" />
        
        <label className="bg-[#f0f1f5] dark:bg-slate-800 border border-[#c7cbdb]/60 dark:border-slate-700 text-[#0a2d67] dark:text-blue-400 hover:bg-[#e8e9ef] dark:hover:bg-slate-700 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-sm" style={{ fontSize: 13, fontWeight: 600 }}>
          <Upload className="w-3.5 h-3.5" />
          Upload
          <input type="file" accept=".txt,.pdf" className="hidden" onChange={handleFileUpload} />
        </label>

        {/* Center: Role input + Suggest */}
        <div className="flex-1 flex items-center justify-center gap-2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 bg-[#f0f1f5] dark:bg-slate-800 border border-[#c7cbdb]/60 dark:border-slate-700 rounded-lg px-3 py-1.5 flex-1 transition-colors focus-within:border-[#0a2d67] dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-[#0a2d67]/10 dark:focus-within:ring-blue-500/10">
            <Briefcase className="w-3.5 h-3.5 text-[#676b89] dark:text-slate-500 shrink-0" />
            <input 
              type="text" 
              className="bg-transparent border-none outline-none text-[#20294c] dark:text-slate-200 placeholder-[#676b89]/60 dark:placeholder-slate-500 w-full" 
              placeholder="Target role, e.g. Senior Frontend Engineer" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
              style={{ fontSize: 13 }}
            />
          </div>
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="bg-[#0a2d67] dark:bg-blue-600 text-white hover:bg-[#0c3578] dark:hover:bg-blue-500 rounded-lg px-4 py-1.5 flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm hover:shadow-md shrink-0" 
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isGenerating ? "Analyzing..." : "AI Suggest"}
          </button>
        </div>

        {/* Right cluster: View toggle + Download */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#f0f1f5] dark:bg-slate-800 rounded-lg p-0.5 border border-[#c7cbdb]/40 dark:border-slate-700">
            <button 
              onClick={() => setView('edit')}
              className={`px-3 py-1 rounded-md transition-all ${view === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#0a2d67] dark:text-blue-400' : 'text-[#676b89] dark:text-slate-500 hover:text-[#20294c] dark:hover:text-slate-300'}`}
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              Edit
            </button>
            <button 
              onClick={() => setView('preview')}
              className={`px-3 py-1 rounded-md transition-all ${view === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#0a2d67] dark:text-blue-400' : 'text-[#676b89] dark:text-slate-500 hover:text-[#20294c] dark:hover:text-slate-300'}`}
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              Preview
            </button>
          </div>
          <button onClick={() => reactToPrintFn()} className="bg-[#f0f1f5] dark:bg-slate-800 border border-[#c7cbdb]/60 dark:border-slate-700 text-[#0a2d67] dark:text-blue-400 hover:bg-[#e8e9ef] dark:hover:bg-slate-700 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 transition-all hover:shadow-sm" style={{ fontSize: 13, fontWeight: 600 }}>
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>

      {/* Error bar */}
      {errorMsg && (
        <div className="px-6 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800/50 flex items-center gap-2">
          <X className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
          <p className="text-red-600 dark:text-red-400" style={{ fontSize: 13 }}>{errorMsg}</p>
          <button onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stats bar */}
      <div className="px-6 py-2 border-b border-[#c7cbdb]/30 dark:border-slate-800/50 bg-[#fafbfd] dark:bg-slate-900/50 flex items-center gap-4 text-[#676b89] dark:text-slate-500 shrink-0" style={{ fontSize: 12 }}>
        <span className="flex items-center gap-1.5">
          <FileText className="w-3 h-3" />
          {wordCount} words
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c7cbdb] dark:bg-slate-600" />
          {resumeData.length} sections
        </span>
        {suggestions.length > 0 && (
          <>
            <div className="w-px h-3 bg-[#c7cbdb]/50 dark:bg-slate-700" />
            <span className="flex items-center gap-1.5 text-[#0a2d67] dark:text-blue-400" style={{ fontWeight: 600 }}>
              <Sparkles className="w-3 h-3" />
              {pending} pending
            </span>
            {accepted > 0 && (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400" style={{ fontWeight: 600 }}>
                <Check className="w-3 h-3" />
                {accepted} applied
              </span>
            )}
          </>
        )}
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 min-h-0">
        {view === 'preview' ? (
          /* ─── Full Preview Mode ─── */
          <div className="h-full overflow-y-auto bg-[#e4e5ea] dark:bg-[#0f172a] transition-colors">
            <div className="p-8 pb-16 flex justify-center min-w-max">
              <ResumePreview ref={contentRef} resumeData={resumeData} />
            </div>
          </div>
        ) : (
          /* ─── Editor + AI Suggestions Side by Side ─── */
          <PanelGroup direction="horizontal" className="h-full">
            
            {/* Left Panel: Resume Editor */}
            <Panel defaultSize={(suggestions.length > 0 || isGenerating) ? 55 : 100} minSize={40} className="flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/40 transition-colors">
                <div className="max-w-3xl mx-auto px-8 py-6 flex flex-col gap-3">
                  {resumeData.map((s) => {
                    const Icon = sectionIcons[s.id] || FileText;
                    const isExpanded = expandedSections.has(s.id);
                    const highlighted = isTextHighlighted(s.content);
                    const sectionWordCount = s.content.split(/\s+/).filter(Boolean).length;
                    
                    return (
                      <div 
                        key={s.id} 
                        className={`rounded-xl border transition-all duration-200 ${
                          highlighted 
                            ? 'border-[#0a2d67]/30 dark:border-blue-500/30 shadow-[0_0_0_3px_rgba(10,45,103,0.06)] dark:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] bg-white dark:bg-slate-800/60' 
                            : 'border-[#c7cbdb]/40 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-[#c7cbdb]/70 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Section Header */}
                        <button 
                          onClick={() => toggleSection(s.id)}
                          className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            highlighted
                              ? 'bg-[#0a2d67]/10 dark:bg-blue-500/15'
                              : 'bg-[#f0f1f5] dark:bg-slate-700/60 group-hover:bg-[#e8e9ef] dark:group-hover:bg-slate-700'
                          }`}>
                            <Icon className={`w-4 h-4 ${highlighted ? 'text-[#0a2d67] dark:text-blue-400' : 'text-[#676b89] dark:text-slate-400'}`} />
                          </div>
                          <span className="text-[#20294c] dark:text-slate-200 flex-1 text-left" style={{ fontSize: 15, fontWeight: 600 }}>
                            {s.section}
                          </span>
                          <span className="text-[#c7cbdb] dark:text-slate-600 mr-2" style={{ fontSize: 11, fontWeight: 500 }}>
                            {sectionWordCount} words
                          </span>
                          <ChevronDown className={`w-4 h-4 text-[#c7cbdb] dark:text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                        </button>
                        
                        {/* Section Content */}
                        {isExpanded && (
                          <div className="px-5 pb-4 pt-0">
                            <textarea 
                              className="w-full bg-[#f8f9fb] dark:bg-slate-900/50 border border-[#e4e5ea] dark:border-slate-700/50 rounded-lg p-4 text-[#20294c] dark:text-slate-200 focus:outline-none focus:border-[#0a2d67]/40 dark:focus:border-blue-500/40 focus:ring-2 focus:ring-[#0a2d67]/5 dark:focus:ring-blue-500/5 resize-y min-h-[80px] transition-all placeholder-[#c7cbdb] dark:placeholder-slate-600"
                              value={s.content}
                              onChange={(e) => handleContentChange(s.id, e.target.value)}
                              placeholder={`Enter your ${s.section.toLowerCase()} here...`}
                              style={{ fontSize: 14, lineHeight: 1.7, fontFamily: "'Roboto', sans-serif" }}
                              rows={Math.max(3, s.content.split('\n').length + 1)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Prompt if no suggestions yet */}
                  {suggestions.length === 0 && !isGenerating && (
                    <div className="mt-4 rounded-xl border border-dashed border-[#c7cbdb]/60 dark:border-slate-700/60 bg-[#fafbfd] dark:bg-slate-800/20 p-8 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#f0f1f5] dark:bg-slate-800 border border-[#c7cbdb]/40 dark:border-slate-700 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-5 h-5 text-[#676b89] dark:text-slate-500" />
                      </div>
                      <p className="text-[#20294c] dark:text-slate-300 mb-1" style={{ fontSize: 15, fontWeight: 600 }}>Ready for AI suggestions</p>
                      <p className="text-[#676b89] dark:text-slate-500 max-w-sm mx-auto" style={{ fontSize: 13, lineHeight: 1.6 }}>
                        Enter a target role in the toolbar above and click <strong>AI Suggest</strong> to get Grammarly-style inline improvements for your resume.
                      </p>
                    </div>
                  )}


                </div>
              </div>
            </Panel>

            {/* Resize Handle — only show when suggestions exist or is generating */}
            {(suggestions.length > 0 || isGenerating) && (
              <>
                <PanelResizeHandle className="w-1 bg-[#e4e5ea] dark:bg-slate-800 hover:bg-[#0a2d67]/20 dark:hover:bg-blue-500/30 cursor-col-resize transition-colors flex items-center justify-center group">
                  <div className="w-0.5 h-8 bg-[#c7cbdb] dark:bg-slate-700 rounded-full group-hover:bg-[#0a2d67]/50 dark:group-hover:bg-blue-500/50 transition-colors" />
                </PanelResizeHandle>

                {/* Right Panel: AI Suggestions */}
                <Panel defaultSize={45} minSize={28} className="flex flex-col min-h-0 bg-[#fafbfd] dark:bg-slate-950/40 border-l border-[#e4e5ea] dark:border-slate-800 transition-colors">
                  
                  {/* Panel Header */}
                  <div className="px-5 py-3 border-b border-[#e4e5ea] dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#0a2d67] dark:bg-blue-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 14, fontWeight: 600 }}>AI Suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0a2d67]/8 dark:bg-blue-500/15 text-[#0a2d67] dark:text-blue-400 rounded-md px-2 py-0.5" style={{ fontSize: 11, fontWeight: 700 }}>
                        {pending} of {suggestions.length}
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Suggestions */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
                    {isGenerating ? (
                      // Skeleton Screen for Suggestions
                      [1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-[#e4e5ea] dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-4 animate-pulse">
                          {/* Suggestion number */}
                          <div className="pb-2 flex items-center justify-between">
                            <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                          </div>

                          {/* Original → Improved */}
                          <div className="pb-3">
                            <div className="flex items-start gap-2 mb-2.5">
                              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                <X className="w-2.5 h-2.5 text-red-500/50 dark:text-red-400/50" />
                              </div>
                              <div className="flex-1 space-y-2 mt-1">
                                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 mb-3">
                              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-green-600/50 dark:text-green-400/50" />
                              </div>
                              <div className="flex-1 space-y-2 mt-1">
                                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
                                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                              </div>
                            </div>
                            
                            {/* Reason */}
                            <div className="bg-[#f8f9fb] dark:bg-slate-900/40 rounded-lg px-3 py-2 mb-3 h-8 flex items-center">
                              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                              <div className="flex-1 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-800/20"></div>
                              <div className="w-24 h-8 bg-[#f0f1f5] dark:bg-slate-800 rounded-lg border border-[#e4e5ea] dark:border-slate-700"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                    suggestions.map((sg, index) => (
                      <div
                        key={sg.id}
                        onMouseEnter={() => { setHoveredSuggestion(sg.id); setActiveSuggestion(sg.id); }}
                        onMouseLeave={() => { setHoveredSuggestion(null); setActiveSuggestion(null); }}
                        className={`rounded-xl transition-all duration-200 ${
                          sg.accepted === true
                            ? "bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800/40"
                            : sg.accepted === false
                            ? "bg-[#f0f1f5]/60 dark:bg-slate-800/30 border border-[#c7cbdb]/30 dark:border-slate-800/30 opacity-50"
                            : hoveredSuggestion === sg.id
                            ? "bg-white dark:bg-slate-800/80 border border-[#0a2d67]/20 dark:border-blue-500/30 shadow-lg shadow-[#0a2d67]/[0.04] dark:shadow-blue-500/[0.04]"
                            : "bg-white dark:bg-slate-800/50 border border-[#e4e5ea] dark:border-slate-700/50 hover:shadow-sm"
                        }`}
                      >
                        {/* Suggestion number */}
                        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 ${
                            sg.accepted === true
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : sg.accepted === false
                              ? 'bg-[#f0f1f5] dark:bg-slate-700/50 text-[#c7cbdb] dark:text-slate-600'
                              : 'bg-[#0a2d67]/8 dark:bg-blue-500/15 text-[#0a2d67] dark:text-blue-400'
                          }`} style={{ fontSize: 11, fontWeight: 700 }}>
                            #{index + 1}
                          </span>
                          {sg.accepted === true && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1" style={{ fontSize: 11, fontWeight: 600 }}>
                              <Check className="w-3 h-3" /> Applied
                            </span>
                          )}
                        </div>

                        {/* Original → Improved */}
                        <div className="px-4 pb-3">
                          <div className="flex items-start gap-2 mb-2.5">
                            <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-0.5 shrink-0">
                              <X className="w-2.5 h-2.5 text-red-500 dark:text-red-400" />
                            </div>
                            <p className="text-[#676b89] dark:text-slate-500 line-through" style={{ fontSize: 13, lineHeight: 1.5 }}>
                              {sg.original}
                            </p>
                          </div>
                          <div className="flex items-start gap-2 mb-3">
                            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5 shrink-0">
                              <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                            </div>
                            <p className={`${sg.accepted === false ? "text-[#676b89] dark:text-slate-600" : "text-[#20294c] dark:text-slate-200"}`} style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>
                              {sg.improved}
                            </p>
                          </div>
                          
                          {/* Reason */}
                          <div className="bg-[#f8f9fb] dark:bg-slate-900/40 rounded-lg px-3 py-2 mb-3">
                            <div className="flex items-start gap-1.5 text-[#676b89] dark:text-slate-400">
                              <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-[#0a2d67] dark:text-blue-400" />
                              <span style={{ fontSize: 12, lineHeight: 1.5 }}>{sg.reason}</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          {sg.accepted === null && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(sg.id, true)}
                                className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all border border-green-200 dark:border-green-800/40 hover:shadow-sm"
                                style={{ fontSize: 12, fontWeight: 600 }}
                              >
                                <Check className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                onClick={() => handleAction(sg.id, false)}
                                className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#f0f1f5] dark:bg-slate-800 text-[#676b89] dark:text-slate-400 hover:bg-[#e8e9ef] dark:hover:bg-slate-700 transition-all border border-[#e4e5ea] dark:border-slate-700"
                                style={{ fontSize: 12, fontWeight: 600 }}
                              >
                                <X className="w-3.5 h-3.5" /> Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )))}

                    {/* Accept All / Dismiss All */}
                    {!isGenerating && pending > 1 && (
                      <div className="flex gap-2 pt-2 pb-4 sticky bottom-0 bg-gradient-to-t from-[#fafbfd] dark:from-slate-950/80 via-[#fafbfd] dark:via-slate-950/60 to-transparent pt-6">
                        <button
                          onClick={() => suggestions.filter(s => s.accepted === null).forEach(s => handleAction(s.id, true))}
                          className="flex-1 py-2.5 rounded-lg bg-[#0a2d67] dark:bg-blue-600 text-white hover:bg-[#0c3578] dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                          style={{ fontSize: 13, fontWeight: 600 }}
                        >
                          <Check className="w-3.5 h-3.5" /> Accept All ({pending})
                        </button>
                      </div>
                    )}
                  </div>
                </Panel>
              </>
            )}
          </PanelGroup>
        )}
      </div>

      {/* Hidden preview for PDF printing */}
      {view !== 'preview' && (
        <div className="hidden">
          <ResumePreview ref={contentRef} resumeData={resumeData} />
        </div>
      )}
    </div>
  );
}
