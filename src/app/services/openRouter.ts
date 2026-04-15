const ENV_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

function getApiKey(): string {
  // User-provided key from Settings takes priority
  const userKey = localStorage.getItem("rezume_openrouter_key");
  if (userKey && userKey.trim()) return userKey.trim();
  return ENV_API_KEY;
}

export async function fetchAISuggestions(
  resumeContent: string,
  targetRole: string
) {
  const API_KEY = getApiKey();
  if (!API_KEY) {
    throw new Error("No API key configured. Please add your OpenRouter API key in Settings.");
  }

  const prompt = `You are an expert resume writer and technical recruiter. 
The user is applying for a role as a "${targetRole}".
Analyze the following resume content and suggest 4 specific improvements that would increase the candidate's chances for this role.
Only return a JSON array of objects. Do not wrap in markdown tags or include other text.

The JSON should have this exact structure:
[
  {
    "id": "a unique string id",
    "original": "the exact original text from the resume you want replacing",
    "improved": "the new text replacing the original",
    "reason": "a brief reason why this is better for a targetRole"
  }
]

Resume content:
${resumeContent}
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
      const apiMsg = errorData.error?.message || "";
      const code = errorData.error?.code || response.status;
      // Translate common API errors to user-friendly messages
      if (code === 401 || apiMsg.toLowerCase().includes("user not found") || apiMsg.toLowerCase().includes("invalid") || apiMsg.toLowerCase().includes("unauthorized")) {
        throw new Error("Invalid API key. Please update your OpenRouter API key in Settings.");
      }
      throw new Error(apiMsg || "Failed to fetch AI suggestions. Please try again.");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Attempt to parse JSON array carefully
    try {
        // Strip markdown code fences if present
        let cleaned = content.trim();
        if (cleaned.startsWith("\`\`\`")) {
          cleaned = cleaned.replace(/^\`\`\`(?:json)?\n?/, "").replace(/\n?\`\`\`$/, "");
        }
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
            return parsed;
        } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
            return parsed.suggestions;
        }
        return [];
    } catch(e) {
        console.error("Failed to parse JSON", content);
        throw new Error("Invalid response format from AI.");
    }
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}
