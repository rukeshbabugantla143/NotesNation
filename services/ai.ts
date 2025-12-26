
// @ts-ignore: This directive is necessary because TypeScript cannot resolve modules from the importmap.
import { GoogleGenAI, Type } from "@google/genai";

export const AIService = {
  /**
   * Powerful Syllabus Analyzer for Indian Universities.
   */
  async analyzeSyllabus(subject: string, stream: string, content: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior Professor for ${stream}. Analyze this syllabus for "${subject}":
        "${content}"
        
        Provide a structured output:
        1. **Difficulty Map**: Categorize topics into 'Foundation', 'Intermediate', and 'Scoring'.
        2. **Time Allocation**: Suggest how many days to spend on each unit.
        3. **Examination Strategy**: Which units usually carry the most marks in JNTU/OU style exams.
        4. **Resources**: Recommend the best types of notes to look for.`,
      });
      return response.text;
    } catch (error) {
      console.error("Syllabus Error:", error);
      return "Syllabus analysis failed. Ensure the text is clear.";
    }
  },

  /**
   * Generates interactive Flashcards from a topic.
   */
  async generateFlashcards(topic: string, subject: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 8 high-yield flashcards for the topic "${topic}" in the subject "${subject}" for an Indian University student. Focus on definitions, theorems, and "must-know" facts for exams.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The front of the card (Question/Term)" },
                answer: { type: Type.STRING, description: "The back of the card (Definition/Explanation)" }
              },
              required: ["question", "answer"]
            }
          }
        }
      });
      const text = response.text || '[]';
      return JSON.parse(text.trim());
    } catch (error) {
      console.error("AI Flashcard Error:", error);
      throw error;
    }
  },

  /**
   * Generates interactive Quiz Questions from study material.
   */
  async generateQuiz(topic: string, subject: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 challenging multiple-choice questions (MCQs) for the topic "${topic}" in "${subject}".
        Format:
        Q1. [Question]
        A) [Option] B) [Option] C) [Option] D) [Option]
        Correct Answer: [Letter]
        Explanation: [Brief Reason]
        
        Keep it focused on typical Indian University exam patterns.`,
      });
      return response.text;
    } catch (error) {
      return "Failed to generate quiz. Try again.";
    }
  },

  /**
   * Concept Explainer - Deep Dive.
   */
  async explainConcept(concept: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain "${concept}" in detail. 
        - Use a real-world analogy.
        - List 5 key mathematical/logical points.
        - Explain why this is important for an engineer or medical student.
        - Suggest 2 common exam questions on this.`,
      });
      return response.text;
    } catch (error) {
      return "Concept explanation failed.";
    }
  },

  /**
   * Fetches latest education news using Google Search Grounding.
   */
  async getLatestEducationNews(state: string, category: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const prompt = `Provide a detailed summary of the latest education news, exam notifications, results, and admission updates for students in ${state} for the category: ${category}. focus on universities like JNTU, OU, AU and state boards like BIEAP/TSBIE.`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      return {
        text: response.text,
        // Extracting grounding chunks (sources) as required by guidelines
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("Education News Error:", error);
      throw error;
    }
  },

  /**
   * Streams a conversation with the AI Academic Tutor.
   */
  async *streamChat(message: string, history: any[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
      });

      const result = await chat.sendMessageStream({ 
        message: message 
      });

      for await (const chunk of result) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      yield "I'm having trouble connecting to my knowledge base. Let's try again in a moment!";
    }
  }
};
