import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSummary(details: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional, concise CV summary based on these details: ${details}. Keep it under 3 sentences.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary. Please try again.";
  }
}

export async function improveBulletPoint(point: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Improve this CV bullet point to be more professional and impact-oriented: "${point}". Provide only the improved text.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return point;
  }
}

export async function suggestSkills(jobTitle: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5-8 relevant skills for a ${jobTitle} position. Return as a comma-separated list.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
}
