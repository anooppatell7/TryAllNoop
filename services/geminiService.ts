
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

/**
 * Gets the most current API key available.
 */
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
    throw new Error("API Key Missing: Please add VITE_API_KEY to your Vercel project settings and redeploy.");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanMarkdown = (text: string | undefined): string => {
  if (!text) return "";
  const trimmed = text.trim();
  // Regex to remove markdown code blocks
  const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/g;
  const matches = [...trimmed.matchAll(codeBlockRegex)];
  if (matches.length > 0) {
    return matches.map(m => m[1].trim()).join('\n\n');
  }
  return trimmed;
};

const handleApiError = (error: any): string => {
  console.error("AllNoop Gemini API Error:", error);
  const msg = error?.message || "";
  
  if (msg.includes("429")) {
    return "Rate Limit/Quota Exceeded: Your project is out of free requests. Try clicking 'Pro Mode' in the sidebar to use your own private key.";
  }
  if (msg.includes("403")) return "Access Denied: Is the Generative Language API enabled for this key?";
  if (msg.includes("401")) return "Invalid API Key: Please check your configuration.";
  if (msg.includes("SAFETY")) return "Blocked by Safety Filter: The content was flagged as unsafe by the AI model.";
  
  return `AI Connection Error: ${msg || "Something went wrong while connecting to the AI."}`;
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
    throw new Error(handleApiError(error));
  }
};

export const generateRegex = async (description: string, testString: string): Promise<{ regex: string; explanation: string }> => {
  const ai = createAiClient();
  const model = "gemini-3-flash-preview"; 
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `You are a Regex expert. Generate a Regular Expression for: "${description}". Validate it against this test string: "${testString}". Return valid JSON with "regex" and "explanation" keys.`,
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
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refactor this ${language} code to be more readable, efficient and modern. Return ONLY the code:\n\n${code}`
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify the programming language. Reply with ONLY the name:\n\n${code.substring(0, 500)}`,
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
      contents: `Convert to Cron: "${description}". Return JSON {cron, explanation}`,
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
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a senior developer. Convert this raw JSON object into ${language} type definitions (interfaces/classes). Use standard naming conventions. Return ONLY the code, NO explanation or markdown headers:\n\n${jsonContent}`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a ${style} README.md for: ${projectInfo}. Return raw markdown only.`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a Git commit message for: "${changes}". Style: ${style}. Message only.`,
    });
    return response.text?.trim() || "chore: update code";
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Convert this SQL to ${target}. Optimize structure, no markdown, code only:\n\n${sql}`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const prompt = `Developer OG Image. Project: "${title}". Tagline: "${subtitle}". Tech: ${tech}. Professional dark theme, minimalist.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated.");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
