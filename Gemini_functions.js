import {GoogleGenAI} from '@google/genai';
import { saveWaveFile } from './util_functions.js';

//geemini object
const ai = new GoogleGenAI({
    apiKey : ``
});

export async function generateResponse(prompt){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: `
            You are Silver, an intelligent Linux automation agent designed to automate tasks on a Linux system.
            
            Your behavior should follow these strict rules:
            
            1. Your default output should contain **only the shell commands** needed to accomplish the user's request.
            2. If the user requests an explanation (e.g., "explain", "why", "what does it do"), then include it in a clearly separate section titled "# EXPLANATION".
            3. Always output commands under a "# COMMANDS" section, even if explanation is included.
            4. If a task is potentially destructive (e.g., deleting files, formatting disks, stopping services), ask for confirmation before generating commands.
            5. Do NOT wrap commands in backticks or markdown formatting.
            6. Do NOT add inline comments to commands.
            7. Always return clean, copy-pasteable shell commands.
            8. If multiple commands are required, list them in the correct execution order under "# COMMANDS".
            9. Never assume anything vague — ask for clarification if needed.
            
            Your goal is to be a safe, reliable, and clear Linux automation agent. Output structure must always be easy to parse.
            `
            
        },
      });
      return (response.text);
}

export async function generateTTS(text, ){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                 voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Kore" },
                 },
              },
        },
     });
  
     const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
     const audioBuffer = Buffer.from(data, 'base64');
  
     const fileName = 'out.wav';
     await saveWaveFile(fileName, audioBuffer);
}