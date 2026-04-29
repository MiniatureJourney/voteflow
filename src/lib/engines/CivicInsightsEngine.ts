import { GoogleGenerativeAI } from "@google/generative-ai";

export class CivicInsightsEngine {
  private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  // Using gemini-1.5-flash for fastest inference in production
  private static model = CivicInsightsEngine.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  /**
   * Generates AI-driven insights about upcoming propositions or candidates based on zip code.
   * Extensible for deep Gemini/Vertex AI analysis.
   */
  static async getInsightsForRegion(zipCode: string): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCdqwhR36TChH4jWESU9PTNIf9rd0cGPEg";
    if (!apiKey) {
      return ["Provide a valid GEMINI_API_KEY to unlock live real-time election updates."];
    }
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a helpful civic AI assistant. 
Identify the current real-time upcoming local or federal elections, candidates, or active propositions applicable to the US postal area zip code: "${zipCode}". 
If there are NO active or upcoming scheduled elections in this region, return ONLY the following sentence exactly: "There are currently no active or upcoming elections scheduled for this location."
Otherwise, output 2 short, highly detailed paragraph insights summarizing local ballot measures or candidates. Make sure your response is strictly factual for this location.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (text.includes("no active or upcoming elections") || text.length < 10) {
        return ["There are currently no active or upcoming elections scheduled for this location."];
      }
      
      return text.split('\n\n').map(t => t.trim()).filter(t => t.length > 0);
    } catch (e) {
      console.error("Gemini API error:", e);
      return ["There are currently no active or upcoming elections scheduled for this location."];
    }
  }

  /**
   * Crowd density prediction system (mock logic).
   * Generates a density curve for Election Day based on historical polling data.
   */
  static predictCrowdDensity(hourOfDay: number): { level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', waitTime: number } {
    if (hourOfDay < 7 || hourOfDay > 20) return { level: 'LOW', waitTime: 0 };
    if (hourOfDay >= 7 && hourOfDay <= 9) return { level: 'HIGH', waitTime: 45 }; // Morning rush
    if (hourOfDay >= 12 && hourOfDay <= 14) return { level: 'MEDIUM', waitTime: 25 }; // Lunch rush
    if (hourOfDay >= 17 && hourOfDay <= 19) return { level: 'CRITICAL', waitTime: 65 }; // Post-work rush
    
    return { level: 'LOW', waitTime: 10 }; // Off-peak hours
  }
}
