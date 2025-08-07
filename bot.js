import readline from "readline";
import { generateResponse, generateTTS } from "./Gemini_functions.js";
import { playAudio } from "./SoundPlayer.js";
import { extractCommandBlock, runCommand } from "./util_functions.js";

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

      // Extract commands
      const commands = extractCommandBlock(response);

      const CommandOutputs = [];

      //console.log(`Commands : ${commands}`)
      // Execute commands one by one
      for (const command of commands) {
        const result = await runCommand(command);
        CommandOutputs.push({
          command: command,
          output: result.success ? result.output : 'ERROR: ' + result.error
        });
        console.log(`\n>> ${command}\n${result.success ? result.output : 'ERROR: ' + result.error}`);
        console.log("--------------------------------------------------");
        console.log(
          await generateResponse(
            JSON.stringify(CommandOutputs),
            "Explain these command outputs clearly, in order."
          )
        );


      }

      // TTS (if needed)
      // await generateTTS(response);
      // await playAudio('out.wav');

    } catch (err) {
      console.error("SILVER : Error generating response:", err);
    }

  }
}

await main();
