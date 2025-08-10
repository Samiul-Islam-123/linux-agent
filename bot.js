import readline from "readline";
import chalk from "chalk";
import { generateResponse, formatHistory } from "./Gemini_functions.js";
import { extractCommandBlock, runCommand, startThinking, stopThinking, SystemConfig } from "./util_functions.js";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper: Ask user for input
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Main loop
async function main() {
  const history = [];
  history.push({ role: "model", parts: [{ text: SystemConfig.trim() }] });

  const firstmsgProcess = startThinking("");
  const FirstMessage = await generateResponse("");
  console.log(chalk.cyanBright(`SILVER :\n${FirstMessage}`));
  stopThinking(firstmsgProcess);

  while (true) {
    const prompt = await askQuestion(chalk.greenBright("YOU : "));

    if (prompt.toLowerCase() === "exit") {
      console.log(chalk.cyanBright("SILVER : Goodbye!"));
      rl.close();
      process.exit(0);
    }

    try {
      // Create AI input with history
      let contents = formatHistory(history, prompt);

      // Start thinking animation for AI response
      const thinking = startThinking(chalk.yellow("Thinking"));

      // Get initial AI response
      let response = await generateResponse(contents);
      stopThinking(thinking);
      console.log(chalk.cyanBright(`SILVER :\n${response}`));
      
      // Store initial history
      history.push({ role: "user", parts: [{ text: prompt }] });
      history.push({ role: "model", parts: [{ text: response }] });

      let commands = extractCommandBlock(response);

      // This loop handles multi-step tasks
      do {
        if (commands.length === 0) {
            console.log("No more commands to execute. Task complete or no commands were generated.");
            break; 
        }

        const executionResults = [];
        for (const command of commands) {
          console.log(chalk.magenta(`\n[Running Command] ${command}`));

          // Stop animation before running command
          const commandThinking = startThinking(chalk.yellow("Executing command"));
          stopThinking(commandThinking);

          // Run the command
          const result = await runCommand(command);

          executionResults.push({
            command,
            output: result.success ? result.output : result.error,
            success: result.success
          });
        }

        // Prepare the summary prompt
        const finalSummaryPrompt = `
Summarize the result of executing these commands for the user's requested task.
If any error occurred, explain what went wrong and how to fix it.
If all succeeded, explain what was achieved.
Execution Results:
${JSON.stringify(executionResults, null, 2)}
`.trim();

        contents = formatHistory(history, finalSummaryPrompt);

        // Start thinking animation for summary
        const summaryThinking = startThinking(chalk.yellow("Summarizing task results"));
        
        // Get the AI's summary/next steps
        const finalResponse = await generateResponse(contents);
        stopThinking(summaryThinking);

        if (executionResults.every(r => r.success)) {
            console.log(chalk.cyanBright(`SILVER : ${finalResponse}`));
        } else {
            console.log(chalk.redBright(`SILVER : ${finalResponse}`));
        }

        // Append the summary to history
        history.push({ role: "user", parts: [{ text: finalSummaryPrompt }] });
        history.push({ role: "model", parts: [{ text: finalResponse }] });

        // Check the new response for more commands
        commands = extractCommandBlock(finalResponse);

      } while (commands.length > 0);

    } catch (err) {
      console.error(chalk.redBright("SILVER : Error generating response:", err));
    }
  }
}

await main();


