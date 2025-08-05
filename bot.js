import readline from "readline";
import { generateResponse, generateTTS } from "./Gemini_functions.js";
import { playAudio } from "./SoundPlayer.js";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Wrap rl.question in a promise so we can use `await`
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Main chat loop
async function main() {
  while (true) {
    const prompt = await askQuestion("YOU : ");
    
    if (prompt.toLowerCase() === "exit") {
      console.log("SILVER : Goodbye!");
      rl.close();
      process.exit(0); // Exit the process cleanly
    }

    try {
        const response = await generateResponse(prompt);
        console.log("SILVER : " + response);
        //TTS
        console.log('generating Speech ...')
      await generateTTS(response)
      console.log('Speech generated')
      //play the audio
      console.log('playing audio ...')
      await playAudio('out.wav')

      //print
    } catch (err) {
      console.error("SILVER : Error generating response:", err);
    }
  }
}

await main();
