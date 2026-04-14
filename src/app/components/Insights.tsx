import { useState, useRef } from "react";
import { AlertCircle, Search, Lightbulb, Activity, CheckCircle, Target, Loader2, Upload } from "lucide-react";
import { analyzeMissingKeywords } from "../services/keywordAnalyzer";
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface KeywordResult {
  keyword: string;
  importance: string;
  reason: string;
}

export function Insights() {
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<KeywordResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    let text = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
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

    // Parse into sections and save so handleScan can read it
    const lines = text.split('\n');
    let currentSection = "summary";
    let summary = "";
    let experience = "";
    let education = "";
    let skills = "";

    for(const line of lines) {
       const lower = line.toLowerCase().trim();
       if (!lower) continue;
       if (lower.includes("experience") && lower.length < 20) { currentSection = "experience"; continue; }
       if (lower.includes("education") && lower.length < 20) { currentSection = "education"; continue; }
       if (lower.includes("skills") && lower.length < 20) { currentSection = "skills"; continue; }
       if (lower.includes("summary") && lower.length < 20) { currentSection = "summary"; continue; }

       if (currentSection === "summary") summary += line + "\n";
       if (currentSection === "experience") experience += line + "\n";
       if (currentSection === "education") education += line + "\n";
       if (currentSection === "skills") skills += line + "\n";
    }

    const parsed = [
      { id: "summary", section: "Summary", content: summary.trim() },
      { id: "experience", section: "Experience", content: experience.trim() },
      { id: "skills", section: "Skills", content: skills.trim() },
      { id: "education", section: "Education", content: education.trim() },
    ];
    localStorage.setItem("rezumeData", JSON.stringify(parsed));
    setErrorMsg("");
  };

  const handleScan = async () => {
    if (!jobDescription.trim()) {
      setErrorMsg("Please paste a job description to scan against.");
      return;
    }
    setErrorMsg("");
    
    const saved = localStorage.getItem("rezumeData");
    if (!saved) {
      setErrorMsg("Your resume is empty. Please upload a resume or add content in the Editor first.");
      return;
    }
    
    try {
      const resumeArray = JSON.parse(saved);
      const resumeContent = resumeArray.map((s: any) => `${s.section}:\n${s.content}`).join("\n\n");
      setIsScanning(true);
      const result = await analyzeMissingKeywords(resumeContent, jobDescription);
      
      setMatchScore(result.matchScore || 0);
      setMissingKeywords(result.missingKeywords || []);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze keywords.");
    } finally {
      setIsScanning(false);
    }
  };

  const scoreColor = matchScore === null ? "text-slate-400" 
    : matchScore >= 80 ? "text-green-500" 
    : matchScore >= 60 ? "text-amber-500" 
    : "text-red-500";

  return (
    <div className="p-10 h-full w-full overflow-y-auto dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[#20294c] dark:text-slate-100 mb-2" style={{ fontSize: 36, fontWeight: 400, fontFamily: "'DM Serif Display', serif" }}>Insights</h1>
          <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 16 }}>
            Compare your resume against a job description to find critical missing keywords.
          </p>
        </div>

        {/* Upload Resume Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#c7cbdb]/50 dark:border-slate-700 p-6 mb-8 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.06)] flex items-center gap-5 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#0a2d67] dark:bg-blue-600 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 16, fontWeight: 600 }}>
              {uploadedFileName ? `Uploaded: ${uploadedFileName}` : "Upload your resume for analysis"}
            </p>
            <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13 }}>
              {uploadedFileName ? "Resume loaded into memory. Ready for scanning." : "The AI will extract and analyze your resume content against job descriptions."}
            </p>
          </div>
          <label className="bg-[#f0f1f5] dark:bg-slate-700 border border-[#c7cbdb] dark:border-slate-600 text-[#0a2d67] dark:text-blue-400 hover:bg-[#e8e9ef] dark:hover:bg-slate-600 rounded-lg px-5 py-2.5 inline-flex items-center gap-2 cursor-pointer transition-colors shrink-0" style={{ fontSize: 14, fontWeight: 600 }}>
            <Upload className="w-4 h-4" />
            {uploadedFileName ? "Replace" : "Upload PDF/TXT"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf"
              className="hidden"
              onChange={handleResumeUpload}
            />
          </label>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side: Input */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 shadow-[0px_1px_4px_0px_rgba(32,41,76,0.1)] flex flex-col transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#f0f1f5] dark:bg-slate-700">
                <Target className="w-5 h-5 text-[#0a2d67] dark:text-blue-400" />
              </div>
              <h2 className="text-[#20294c] dark:text-slate-100" style={{ fontSize: 18, fontWeight: 600 }}>
                Job Description
              </h2>
            </div>
            
            <textarea 
              className="w-full flex-1 min-h-[300px] bg-[#f0f1f5]/50 dark:bg-slate-900/50 border border-[#c7cbdb]/40 dark:border-slate-700 rounded-lg p-4 text-[#20294c] dark:text-slate-200 focus:outline-none focus:border-[#0a2d67]/50 dark:focus:border-blue-500/50 resize-y transition-colors mb-6"
              placeholder="Paste the full job description here to extract the most important keywords and requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ fontSize: 14, lineHeight: 1.6 }}
            />
            
            {errorMsg && <p className="text-red-500 dark:text-red-400 mb-4" style={{fontSize: 14}}>{errorMsg}</p>}
            
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-[#0a2d67] dark:bg-blue-600 text-white hover:bg-[#0a2d67]/90 dark:hover:bg-blue-500 rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm" 
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Target Keywords...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Scan Resume vs Job
                </>
              )}
            </button>
          </div>

          {/* Right Side: Results */}
          <div className="bg-[#f0f1f5]/30 dark:bg-slate-800/50 rounded-2xl p-8 border border-[#c7cbdb]/40 dark:border-slate-700 flex flex-col transition-colors">
            
            {matchScore === null && !isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                <Activity className="w-16 h-16 text-[#676b89] dark:text-slate-500 mb-4" />
                <h3 className="text-[#20294c] dark:text-slate-300 mb-2" style={{ fontSize: 20, fontWeight: 600 }}>Ready to Scan</h3>
                <p className="text-[#676b89] dark:text-slate-400 max-w-[280px]" style={{ fontSize: 14 }}>
                  Upload a resume above and paste a job description, then click scan to see how well your resume matches.
                </p>
              </div>
            ) : isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-4 border-[#c7cbdb] dark:border-slate-700 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#0a2d67] dark:text-blue-500 animate-spin" />
                  </div>
                </div>
                <h3 className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 18, fontWeight: 600 }}>AI is reading your resume...</h3>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#c7cbdb]/40 dark:border-slate-700">
                  <div>
                    <h3 className="text-[#676b89] dark:text-slate-400 uppercase tracking-widest mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Match Score</h3>
                    <div className={`text-4xl font-bold ${scoreColor}`}>
                      {matchScore}%
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-[#676b89] dark:text-slate-400 uppercase tracking-widest mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Status</h3>
                    <div className="text-[#20294c] dark:text-slate-200" style={{ fontSize: 15, fontWeight: 500 }}>
                      {matchScore! >= 80 ? 'Highly Competitive' : matchScore! >= 60 ? 'Needs Optimization' : 'Poor Match'}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-[#20294c] dark:text-slate-200 mb-6 flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Missing Critical Keywords
                  </h3>
                  
                  {missingKeywords.length === 0 ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-6 text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h4 className="text-green-800 dark:text-green-400 font-medium mb-1">Perfect!</h4>
                      <p className="text-green-600/80 dark:text-green-500/80 text-sm">Your resume contains all the critical keywords from this job description.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {missingKeywords.map((kw, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 border border-[#c7cbdb]/50 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[#0a2d67] dark:text-blue-400" style={{ fontSize: 15, fontWeight: 600 }}>{kw.keyword}</h4>
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                              kw.importance.toLowerCase() === 'high' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {kw.importance} Priority
                            </span>
                          </div>
                          <p className="text-[#676b89] dark:text-slate-400" style={{ fontSize: 13, lineHeight: 1.6 }}>
                            {kw.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}