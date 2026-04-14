const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

export async function analyzeMissingKeywords(
  resumeContent: string,
  jobDescription: string
) {
  if (!API_KEY) {
    throw new Error("AI service is not configured. Please contact the administrator.");
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) and technical recruiter.
I will provide you with a Resume and a Job Description. 
Compare the two and identify the most critical keywords or skills that are present in the job description but MISSING from the resume.
Return the result strictly as a JSON object with this exact structure:

{
  "matchScore": 65,
  "missingKeywords": [
    {
      "keyword": "Kubernetes",
      "importance": "High",
      "reason": "Mentioned 3 times in the job description as a core requirement."
    }
  ]
}

- Match score should be an integer from 0 to 100 representing how well the resume matches the job description.
- Missing keywords should be an array of objects. Limit it to the top 4-6 most important missing keywords.
- Do not wrap the JSON in markdown blocks. Output only valid JSON.

Resume:
${resumeContent}

Job Description:
${jobDescription}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, 
        "X-Title": "rezumeAI"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to analyze keywords");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
        // Strip markdown code fences if present
        let cleaned = content.trim();
        if (cleaned.startsWith("\`\`\`")) {
          cleaned = cleaned.replace(/^\`\`\`(?:json)?\n?/, "").replace(/\n?\`\`\`$/, "");
        }
        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch(e) {
        console.error("Failed to parse JSON", content);
        throw new Error("Invalid response format from AI.");
    }
  } catch (error) {
    console.error("Error analyzing keywords:", error);
    throw error;
  }
}
