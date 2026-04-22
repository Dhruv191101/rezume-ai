const ENV_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

/** Returns the built-in API key (site's own key) */
function getApiKey(): string {
  return ENV_API_KEY;
}

export async function fetchAISuggestions(
  resumeContent: string,
  targetRole: string
) {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("No API key configured. Falling back to mock AI suggestions for demo.");
    return [
      {
        id: "mock1",
        original: "Experienced software engineer with 4+ years working on web applications.",
        improved: "Senior Software Engineer with 4+ years of experience architecting scalable web applications.",
        reason: `Highly relevant for the targeted ${targetRole} position.`
      },
      {
        id: "mock2",
        original: "Worked on building web applications using React and Node.js",
        improved: "Developed and deployed multiple full-stack web applications utilizing React and Node.js",
        reason: "Uses stronger action verbs to describe your experience."
      },
      {
        id: "mock3",
        original: "Looking for new opportunities to grow.",
        improved: "Seeking to leverage expertise in frontend technologies to drive product innovation.",
        reason: "More specific and outcome-focused objective."
      }
    ];
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
      // Translate common API errors to user-friendly messages
      if (
        code === 401 || response.status === 401 ||
        lowerMsg.includes("user not found") ||
        lowerMsg.includes("invalid") ||
        lowerMsg.includes("unauthorized") ||
        lowerMsg.includes("invalid_api_key") ||
        lowerMsg.includes("no auth")
      ) {
        console.warn("API key invalid/expired. Falling back to mock AI suggestions for demo.");
        return [
          {
            id: "mock1",
            original: "Experienced software engineer with 4+ years working on web applications.",
            improved: "Senior Software Engineer with 4+ years of experience architecting scalable web applications.",
            reason: `Highly relevant for the targeted ${targetRole} position.`
          },
          {
            id: "mock2",
            original: "Worked on building web applications using React and Node.js",
            improved: "Developed and deployed multiple full-stack web applications utilizing React and Node.js",
            reason: "Uses stronger action verbs to describe your experience."
          },
          {
            id: "mock3",
            original: "Looking for new opportunities to grow.",
            improved: "Seeking to leverage expertise in frontend technologies to drive product innovation.",
            reason: "More specific and outcome-focused objective."
          }
        ];
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
