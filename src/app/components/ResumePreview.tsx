import { forwardRef } from "react";

interface ResumeSection {
  id: string;
  section: string;
  content: string;
}

interface ResumePreviewProps {
  resumeData: ResumeSection[];
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData }, ref) => {
    return (
      <div 
        ref={ref} 
        className="bg-white w-full max-w-[850px] min-h-[1100px] shadow-[0px_4px_24px_rgba(0,0,0,0.06)] rounded-sm p-12 text-black print:shadow-none print:p-0 print:min-h-0 mx-auto"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* ATS Friendly Header Header */}
        <div className="text-center border-b-[1.5px] border-black pb-4 mb-6">
          <h1 className="text-4xl font-bold mb-1 text-black">Jane Doe</h1>
          <p className="text-gray-700 text-[15px]">jane.doe@example.com | (555) 123-4567 | linkedin.com/in/janedoe</p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-5">
          {resumeData.map((s) => {
            if (!s.content.trim()) return null;
            
            return (
              <div key={s.id} className="print:break-inside-avoid">
                <h4 className="text-[14px] font-bold uppercase tracking-wider mb-2 text-black">
                  {s.section}
                </h4>
                <div 
                  className="text-black whitespace-pre-wrap leading-[1.6]" 
                  style={{ fontSize: '13px' }}
                >
                  {s.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
