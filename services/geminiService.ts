
import { GoogleGenAI, Type } from "@google/genai";
import { MockDataRequest } from "../types";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
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
  const ai = getClient();
  // Using gemini-3-flash-preview for basic text tasks
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
    prompt += ` Return the data in ${req.format} format. Output ONLY the raw data (e.g. CSV headers and rows, or SQL INSERT statements). Do not include markdown code blocks or explanations.`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return cleanMarkdown(response.text || "");
  }
};

export const generateRegex = async (description: string, testString: string): Promise<{ regex: string; explanation: string }> => {
  const ai = getClient();
  const prompt = `
    Create a Regular Expression (Regex) for the following requirement: "${description}".
    Also provide a brief explanation of how it works.
    If provided, ensure it matches this test case: "${testString}".
    Return JSON format: { "regex": string, "explanation": string }
  `;

  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex reasoning/coding tasks
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
  const ai = getClient();
  const prompt = `
    Refactor the following ${language} code to be more concise, readable, and efficient. 
    Add comments explaining significant reductions.
    Return ONLY the code, no markdown formatting.

    Code:
    ${code}
  `;

  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for code refactoring
    model: "gemini-3-pro-preview",
    contents: prompt,
  });

  return cleanMarkdown(response.text || "// No simplification possible.");
};

export const detectLanguage = async (code: string): Promise<string> => {
  const ai = getClient();
  const prompt = `Analyze this code and return ONLY the language name: ${code}`;
  const response = await ai.models.generateContent({
    // Using gemini-3-flash-preview for simple analysis
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text?.trim() || "JavaScript";
};

export const generateCron = async (description: string): Promise<{ cron: string; explanation: string }> => {
  const ai = getClient();
  const prompt = `
    Convert this schedule into a 5-field Cron expression: "${description}".
    Return JSON format: { "cron": string, "explanation": string }
  `;

  const response = await ai.models.generateContent({
    // Using gemini-3-flash-preview
    model: "gemini-3-flash-preview",
    contents: prompt,
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
  const ai = getClient();
  const prompt = `Convert this JSON to ${language} types. No markdown: ${jsonContent}`;
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for technical conversion
    model: "gemini-3-pro-preview",
    contents: prompt,
  });
  return cleanMarkdown(response.text || "");
};

export const generateReadme = async (projectInfo: string, style: string = "Standard"): Promise<string> => {
  const ai = getClient();
  const prompt = `Generate a README.md for: ${projectInfo}. Style: ${style}. Return raw markdown.`;
  const response = await ai.models.generateContent({
    // Using gemini-3-flash-preview for summarization/writing
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return cleanMarkdown(response.text || "");
};

export const generateCommitMessage = async (changes: string, style: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    Write a professional Git commit message based on these changes: "${changes}".
    Style: ${style} (e.g. Conventional Commits, Emoji, Short).
    Return ONLY the commit message.
  `;
  const response = await ai.models.generateContent({
    // Using gemini-3-flash-preview
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text?.trim() || "docs: update repository";
};

export const sqlToNoSql = async (sql: string, target: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    Convert the following SQL schema/query to ${target} (e.g. MongoDB, Firestore, DynamoDB).
    Suggest a good NoSQL structure. Return ONLY the code/json.

    SQL:
    ${sql}
  `;
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for database migration logic
    model: "gemini-3-pro-preview",
    contents: prompt,
  });
  return cleanMarkdown(response.text || "");
};

export const generateOgImage = async (title: string, subtitle: string, tech: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    A professional, modern, and clean Open Graph social media image for a GitHub repository.
    The project title is "${title}".
    The tagline is "${subtitle}".
    The technologies used are: ${tech}.
    Visual style: Dark mode, neon accents, high-quality developer aesthetic, minimalist typography.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    // Correctly structure contents with parts for image generation
    contents: { parts: [{ text: prompt }] },
    config: {
        imageConfig: { aspectRatio: "16:9" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};
