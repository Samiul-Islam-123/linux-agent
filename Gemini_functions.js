import {GoogleGenAI} from '@google/genai';
import { saveWaveFile, SystemConfig } from './util_functions.js';
import { configDotenv } from 'dotenv';

//geemini object
const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
});

export function formatHistory(history, newPrompt) {
  
  const contents = [
    ...history,
    { role: "user", parts: [{ text: newPrompt }] }
  ];
  return contents;
}

export async function generateResponse(contents) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: SystemConfig
    },
  });

  return response.text;
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