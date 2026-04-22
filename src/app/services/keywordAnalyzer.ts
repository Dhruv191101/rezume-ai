const ENV_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

/** Returns the active API key — user-provided (localStorage) takes priority over .env */
function getApiKey(): string {
  return localStorage.getItem("openrouter_api_key") || ENV_API_KEY;
}

export async function analyzeMissingKeywords(
  resumeContent: string,
  jobDescription: string
) {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("No API key configured. Falling back to mock Insights data for demo.");
    return {
      matchScore: 65,
      missingKeywords: [
        {
          keyword: "Kubernetes",
          importance: "High",
          reason: "Mentioned 3 times in the job description as a core requirement."
        },
        {
          keyword: "CI/CD Pipelines",
          importance: "High",
          reason: "Required for senior backend roles to manage automated deployments."
        },
        {
          keyword: "GraphQL",
          importance: "Medium",
          reason: "Listed as a preferred skill for API development."
        }
      ]
    };
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
        "Authorization": `Bearer ${apiKey}`,
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
      let apiMsg = "";
      let code: number | string = response.status;
      try {
        const errorData = await response.json();
        apiMsg = errorData.error?.message || "";
        code = errorData.error?.code || response.status;
      } catch {
        // response body wasn't JSON
      }

      const lowerMsg = apiMsg.toLowerCase();
      if (
        code === 401 || response.status === 401 ||
        lowerMsg.includes("user not found") ||
        lowerMsg.includes("invalid") ||
        lowerMsg.includes("unauthorized") ||
        lowerMsg.includes("invalid_api_key") ||
        lowerMsg.includes("no auth")
      ) {
        console.warn("API key invalid/expired. Falling back to mock Insights data for demo.");
        return {
          matchScore: 65,
          missingKeywords: [
            {
              keyword: "Kubernetes",
              importance: "High",
              reason: "Mentioned 3 times in the job description as a core requirement."
            },
            {
              keyword: "CI/CD Pipelines",
              importance: "High",
              reason: "Required for senior backend roles to manage automated deployments."
            },
            {
              keyword: "GraphQL",
              importance: "Medium",
              reason: "Listed as a preferred skill for API development."
            }
          ]
        };
      }
      if (response.status === 402 || lowerMsg.includes("insufficient")) {
        throw new Error("API key has insufficient credits. Please add credits on openrouter.ai or use a free model.");
      }
      if (response.status === 429) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      throw new Error(apiMsg || `API request failed (HTTP ${response.status}). Please try again.`);
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
