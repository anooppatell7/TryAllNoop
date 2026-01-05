
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

// Initialize Gemini Client with safety checks for browser environments
const getClient = () => {
  // Check if process exists to avoid ReferenceError in raw browser environments
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : (window as any).VITE_API_KEY;
  
  if (!apiKey) {
    console.error("AllNoop Error: Gemini API Key not found in environment.");
    // We throw inside the actual calls so the UI can mount first
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const ensureClient = () => {
  const client = getClient();
  if (!client) throw new Error("API Key is missing. Please set API_KEY in your environment variables.");
  return client;
};

// Utility to strip markdown code blocks (```lang ... ```)
const cleanMarkdown = (text: string): string => {
  if (!text) return "";
  const codeBlockRegex = /^```(?:\w+)?\s*([\s\S]*?)\s*```$/;
  const match = text.trim().match(codeBlockRegex);
  if (match) {
    return match[1].trim();
  }
  return text.trim();
};

export const generateMockData = async (req: MockDataRequest): Promise<string> => {
  const ai = ensureClient();
  const model = "gemini-3-flash-preview";

  let prompt = `Generate ${req.count} records of ${req.complexity.toLowerCase()} mock data about "${req.topic}".`;
  
  if (req.format === 'JSON') {
    prompt += ` Return ONLY a raw JSON array.`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return response.text || "[]";
    } catch (e) {
        console.error("Gemini JSON Error", e);
        throw e;
    }
  } else {
    prompt += ` Return the data in ${req.format} format. Output ONLY the raw data. Do not include markdown code blocks.`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return cleanMarkdown(response.text || "");
  }
};

export const generateRegex = async (description: string, testString: string): Promise<{ regex: string; explanation: string }> => {
  const ai = ensureClient();
  const prompt = `
    Create a Regular Expression for: "${description}".
    Match test case: "${testString}".
    Return JSON: { "regex": string, "explanation": string }
  `;

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
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const simplifyCode = async (code: string, language: string): Promise<string> => {
  const ai = ensureClient();
  const prompt = `Refactor this ${language} code for elegance and efficiency. Return ONLY code.\n\n${code}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
  });
  return cleanMarkdown(response.text || "// No simplification possible.");
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this code and return ONLY the language name: ${code}`,
  });
  return response.text?.trim() || "JavaScript";
};

export const generateCron = async (description: string): Promise<{ cron: string; explanation: string }> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert to 5-field Cron: "${description}". Return JSON { "cron", "explanation" }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
            cron: { type: Type.STRING },
            explanation: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const convertJsonToTypes = async (jsonContent: string, language: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Convert this JSON to ${language} types. No markdown: ${jsonContent}`,
  });
  return cleanMarkdown(response.text || "");
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate README.md for: ${projectInfo}. Style: ${style}. Raw markdown.`,
  });
  return cleanMarkdown(response.text || "");
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write Git commit for: "${changes}". Style: ${style}. Return message only.`,
  });
  return response.text?.trim() || "docs: update repository";
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Convert SQL to ${target}. Output structure only.\n\n${sql}`,
  });
  return cleanMarkdown(response.text || "");
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = ensureClient();
  const prompt = `Modern OG image for GitHub. Title: "${title}". Subtitle: "${subtitle}". Tech: ${tech}. Style: Dark, neon accents, minimalist.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("No image generated");
};
