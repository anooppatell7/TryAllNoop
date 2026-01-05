
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

export class QuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

const getActiveKey = (): string | undefined => {
  return (process?.env?.API_KEY) || 
         ((process?.env as any)?.VITE_API_KEY) || 
         ((window as any).API_KEY) || 
         ((window as any).VITE_API_KEY) ||
         // @ts-ignore
         (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY);
};

const createAiClient = () => {
  const apiKey = getActiveKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanMarkdown = (text: string | undefined): string => {
  if (!text) return "";
  const trimmed = text.trim();
  const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/g;
  const matches = [...trimmed.matchAll(codeBlockRegex)];
  if (matches.length > 0) {
    return matches.map(m => m[1].trim()).join('\n\n');
  }
  return trimmed;
};

const handleApiError = (error: any): Error => {
  console.error("AllNoop API Error:", error);
  const msg = error?.message || "";
  
  if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
    return new QuotaError("The shared free quota is exhausted. Please use 'Pro Mode' in the sidebar to connect your own private key for unlimited use.");
  }
  
  if (msg.includes("403")) return new Error("Access Denied: The API key is invalid or permissions are restricted.");
  if (msg.includes("SAFETY")) return new Error("Safety Filter: The AI refused to generate this content for safety reasons.");
  
  return new Error(msg || "An unexpected error occurred while connecting to Gemini.");
};

export const generateMockData = async (req: MockDataRequest): Promise<string> => {
  const ai = createAiClient();
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
      prompt += ` Return ONLY the raw data in ${req.format} format.`;
      const response = await ai.models.generateContent({ model, contents: prompt });
      return cleanMarkdown(response.text);
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

export const generateRegex = async (description: string, testString: string): Promise<{ regex: string; explanation: string }> => {
  const ai = createAiClient();
  const model = "gemini-3-flash-preview"; 
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a Regex for: "${description}". Validate against: "${testString}". Return JSON {regex, explanation}`,
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
    throw handleApiError(error);
  }
};

export const simplifyCode = async (code: string, language: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refactor this ${language} code. Return ONLY code:\n\n${code}`
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Programming language? (One word response): ${code.substring(0, 300)}`,
    });
    return response.text?.trim() || "JavaScript";
  } catch {
    return "JavaScript";
  }
};

export const generateCron = async (description: string): Promise<{ cron: string; explanation: string }> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Cron for: "${description}". Return JSON {cron, explanation}`,
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
    throw handleApiError(error);
  }
};

export const convertJsonToTypes = async (jsonContent: string, language: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Convert to ${language} types. Return ONLY code:\n\n${jsonContent}`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a ${style} README.md for: ${projectInfo}. Markdown only.`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Commit msg for: "${changes}". Style: ${style}. Text only.`,
    });
    return response.text?.trim() || "chore: update code";
  } catch (error) {
    throw handleApiError(error);
  }
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `SQL to ${target}. Code only:\n\n${sql}`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const prompt = `Dev OG Image. Title: "${title}". Sub: "${subtitle}". Tech: ${tech}. High-tech dark style.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Image generation failed.");
  } catch (error) {
    throw handleApiError(error);
  }
};
