
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

/**
 * Robust API Key detection for browser environments.
 */
const getApiKey = (): string | undefined => {
  // Check process.env (primary requirement)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Check common browser injection points
  return (window as any).API_KEY || (window as any).VITE_API_KEY || (window as any)._env_?.API_KEY;
};

const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const ensureClient = () => {
  const client = getClient();
  if (!client) {
    throw new Error("API_KEY not found. Please set your environment variable in Vercel.");
  }
  return client;
};

const cleanMarkdown = (text: string | undefined): string => {
  if (!text) return "";
  const codeBlockRegex = /^```(?:\w+)?\s*([\s\S]*?)\s*```$/;
  const match = text.trim().match(codeBlockRegex);
  if (match) return match[1].trim();
  return text.trim();
};

const handleApiError = (error: any): string => {
  console.error("Gemini API Error:", error);
  const msg = error?.message || "";
  if (msg.includes("403")) return "Access Denied: Is the Generative Language API enabled for this key?";
  if (msg.includes("429")) return "Rate Limit Reached: Please wait a moment or upgrade your quota.";
  if (msg.includes("401")) return "Invalid API Key: Please verify your key in the environment settings.";
  return `Service Error: ${msg || "Unexpected response from AI service."}`;
};

export const generateMockData = async (req: MockDataRequest): Promise<string> => {
  const ai = ensureClient();
  const model = "gemini-3-flash-preview";
  let prompt = `Generate ${req.count} records of ${req.complexity.toLowerCase()} mock data about "${req.topic}".`;
  
  try {
    if (req.format === 'JSON') {
      prompt += ` Return ONLY a raw JSON array.`;
      const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
      });
      return response.text || "[]";
    } else {
      prompt += ` Return ONLY the raw data in ${req.format} format. No preamble.`;
      const response = await ai.models.generateContent({ model, contents: prompt });
      return cleanMarkdown(response.text);
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateRegex = async (description: string, testString: string): Promise<{ regex: string; explanation: string }> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate Regex for: "${description}". Test: "${testString}". Return JSON {regex, explanation}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { regex: { type: Type.STRING }, explanation: { type: Type.STRING } },
          required: ["regex", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const simplifyCode = async (code: string, language: string): Promise<string> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Refactor this ${language} code for elegance. Code only:\n\n${code}`
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Language name only for: ${code.substring(0, 500)}`,
  });
  return response.text?.trim() || "JavaScript";
};

export const generateCron = async (description: string): Promise<{ cron: string; explanation: string }> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `English to Cron: "${description}". Return JSON {cron, explanation}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { cron: { type: Type.STRING }, explanation: { type: Type.STRING } },
          required: ["cron", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const convertJsonToTypes = async (jsonContent: string, language: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Convert to ${language} types. Code only:\n\n${jsonContent}`,
  });
  return cleanMarkdown(response.text);
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${style} README.md for: ${projectInfo}. Markdown only.`,
  });
  return cleanMarkdown(response.text);
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Commit message for: "${changes}" (Style: ${style}). Message only.`,
  });
  return response.text?.trim() || "chore: update code";
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = ensureClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `SQL to ${target}. Structure only:\n\n${sql}`,
  });
  return cleanMarkdown(response.text);
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = ensureClient();
  try {
    const prompt = `Modern tech OG image. Project: "${title}". Subtitle: "${subtitle}". Keywords: ${tech}. Style: Neon, Dark, Developer Aesthetic.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Image could not be rendered.");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
