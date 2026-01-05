
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

const getClient = () => {
  // Exclusively use process.env.API_KEY as per guidelines. 
  // The shim in index.tsx handles mapping VITE_API_KEY to this variable.
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const ensureClient = () => {
  const client = getClient();
  if (!client) {
    throw new Error("API_KEY not found. Please ensure VITE_API_KEY or API_KEY is set in your Vercel environment variables.");
  }
  return client;
};

const cleanMarkdown = (text: string | undefined): string => {
  if (!text) return "";
  const trimmed = text.trim();
  const codeBlockRegex = /^```(?:\w+)?\s*([\s\S]*?)\s*```$/;
  const match = trimmed.match(codeBlockRegex);
  if (match) return match[1].trim();
  return trimmed;
};

const handleApiError = (error: any): string => {
  console.error("AllNoop Gemini API Error:", error);
  const msg = error?.message || "";
  
  if (msg.includes("403")) return "Access Denied: Is the Generative Language API enabled?";
  if (msg.includes("429")) return "Quota Exceeded: Please wait a moment.";
  if (msg.includes("401")) return "Invalid API Key: Please check your Vercel Environment Variables.";
  
  return `AI Error: ${msg || "Unexpected service response."}`;
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
      prompt += ` Return ONLY the raw data in ${req.format} format.`;
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
      contents: `Refactor this ${language} code for elegance. No markdown, code only:\n\n${code}`
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Reply with ONLY the language name of this code: ${code.substring(0, 300)}`,
    });
    return response.text?.trim() || "JavaScript";
  } catch {
    return "JavaScript";
  }
};

export const generateCron = async (description: string): Promise<{ cron: string; explanation: string }> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate to Cron: "${description}". Return JSON {cron, explanation}`,
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
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Convert JSON to ${language} types. Code only, no markdown:\n\n${jsonContent}`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a ${style} style README.md for this project: ${projectInfo}. Raw markdown only.`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Git commit message for: "${changes}". Format: ${style}. Return message only.`,
    });
    return response.text?.trim() || "chore: update source";
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = ensureClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Convert SQL to ${target}. Optimized structure only, no markdown:\n\n${sql}`,
    });
    return cleanMarkdown(response.text);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = ensureClient();
  try {
    const prompt = `Developer OG Image. Project: "${title}". Tagline: "${subtitle}". Stack: ${tech}. Style: Professional, Dark, High-Contrast.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned from AI.");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
