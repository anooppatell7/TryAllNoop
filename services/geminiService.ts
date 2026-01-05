
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

/**
 * Safely retrieves the API Key from the environment.
 * Assumes process.env.API_KEY is the primary source as per requirements.
 */
const getApiKey = (): string | undefined => {
  try {
    // Check process.env first (standard for Vercel/Node environments)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // process.env might not be defined in some browser environments
  }
  
  // Fallbacks for various build tools
  return (window as any).API_KEY || (window as any).VITE_API_KEY;
};

/**
 * Creates a new instance of the Gemini AI client.
 * Guidelines recommend creating a new instance per call for fresh configuration.
 */
const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("AllNoop: API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Ensures the client is available or throws a user-friendly error.
 */
const ensureClient = () => {
  const client = getClient();
  if (!client) {
    throw new Error("Application configuration error. Please ensure the API_KEY is correctly set in your environment.");
  }
  return client;
};

/**
 * Helper to strip markdown code blocks from AI responses.
 */
const cleanMarkdown = (text: string | undefined): string => {
  if (!text) return "";
  const trimmed = text.trim();
  const codeBlockRegex = /^```(?:\w+)?\s*([\s\S]*?)\s*```$/;
  const match = trimmed.match(codeBlockRegex);
  if (match) return match[1].trim();
  return trimmed;
};

export const generateMockData = async (req: MockDataRequest): Promise<string> => {
  const ai = ensureClient();
  const model = "gemini-3-flash-preview";
  let prompt = `Generate ${req.count} records of ${req.complexity.toLowerCase()} mock data about "${req.topic}".`;
  
  try {
    if (req.format === 'JSON') {
      prompt += ` Return ONLY a raw JSON array. Do not include markdown formatting.`;
      const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
      });
      return response.text || "[]";
    } else {
      prompt += ` Return the data in ${req.format} format. Output ONLY the raw data without any preamble or markdown blocks.`;
      const response = await ai.models.generateContent({ model, contents: prompt });
      return cleanMarkdown(response.text);
    }
  } catch (error) {
    console.error("MockData Generation Error:", error);
    throw error;
  }
};

export const generateRegex = async (description: string, testString: string): Promise<{ regex: string; explanation: string }> => {
  const ai = ensureClient();
  const prompt = `Create a Regex for: "${description}". Test against: "${testString}". Return JSON with "regex" and "explanation" fields.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { 
          regex: { type: Type.STRING }, 
          explanation: { type: Type.STRING } 
        },
        required: ["regex", "explanation"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text);
};

export const simplifyCode = async (code: string, language: string): Promise<string> => {
  const ai = ensureClient();
  const prompt = `Refactor this ${language} code for maximum elegance, performance, and readability. Return ONLY the refactored code without markdown blocks:\n\n${code}`;
  const response = await ai.models.generateContent({ model: "gemini-3-pro-preview", contents: prompt });
  return cleanMarkdown(response.text) || "// Simplification could not be generated.";
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Identify the programming language of this code snippet and return ONLY the language name (e.g. "TypeScript", "Python"): ${code}`,
  });
  return response.text?.trim() || "JavaScript";
};

export const generateCron = async (description: string): Promise<{ cron: string; explanation: string }> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert this description to a 5-field Cron expression: "${description}". Return JSON with "cron" and "explanation" keys.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { 
          cron: { type: Type.STRING }, 
          explanation: { type: Type.STRING } 
        },
        required: ["cron", "explanation"]
      }
    }
  });
  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text);
};

export const convertJsonToTypes = async (jsonContent: string, language: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Convert the following JSON into ${language} type definitions. Provide only the code, no markdown wrappers:\n\n${jsonContent}`,
  });
  return cleanMarkdown(response.text);
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a high-quality README.md based on this info: ${projectInfo}. Style: ${style}. Return raw markdown content only.`,
  });
  return cleanMarkdown(response.text);
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a concise Git commit message for these changes: "${changes}". Style preference: ${style}. Return the message only.`,
  });
  return response.text?.trim() || "chore: update code";
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Convert this SQL structure/query to its ${target} equivalent. Focus on optimal structure for the target database. Return ONLY the code:\n\n${sql}`,
  });
  return cleanMarkdown(response.text);
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = ensureClient();
  const prompt = `Create a professional developer-themed OG image for a project titled "${title}". Subtitle: "${subtitle}". Tech keywords: ${tech}. Style: Dark mode, minimalist, sharp gradients, high-tech aesthetics.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { 
      imageConfig: { 
        aspectRatio: "16:9" 
      } 
    }
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) throw new Error("Failed to generate image candidates.");
  
  for (const part of candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image data found in AI response.");
};
