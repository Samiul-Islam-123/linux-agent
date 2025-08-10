#!/usr/bin/env node
import readline from "readline";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import os from "os";
import { extractCommandBlock, runCommand, startThinking, stopThinking, SystemConfig } from "./util_functions.js";

// Location for config file
const configDir = path.join(os.homedir(), ".silver");
const configFile = path.join(configDir, "config.json");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper: Ask user for input
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Check & get API key
async function ensureApiKey() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (fs.existsSync(configFile)) {
    const savedConfig = JSON.parse(fs.readFileSync(configFile, "utf-8"));
    if (savedConfig.apiKey) {
      process.env.GEMINI_API_KEY = savedConfig.apiKey;
      return;
    }
  }

  const apiKey = await askQuestion(chalk.yellow("Enter your Gemini API Key: "));
  fs.writeFileSync(configFile, JSON.stringify({ apiKey: apiKey.trim() }, null, 2));
  process.env.GEMINI_API_KEY = apiKey.trim();
  console.log(chalk.green("✅ API Key saved successfully!"));
}

// Main loop
async function main() {
  await ensureApiKey();

  const { generateResponse, formatHistory } = await import("./Gemini_functions.js");

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
      let contents = formatHistory(history, prompt);
      const thinking = startThinking(chalk.yellow("Thinking"));
      let response = await generateResponse(contents);
      stopThinking(thinking);
      console.log(chalk.cyanBright(`SILVER :\n${response}`));

      history.push({ role: "user", parts: [{ text: prompt }] });
      history.push({ role: "model", parts: [{ text: response }] });

      let commands = extractCommandBlock(response);

      do {
        if (commands.length === 0) {
          console.log("No more commands to execute.");
          break;
        }

        const executionResults = [];
        for (const command of commands) {
          console.log(chalk.magenta(`\n[Running Command] ${command}`));
          const commandThinking = startThinking(chalk.yellow("Executing command"));
          stopThinking(commandThinking);
          const result = await runCommand(command);
          executionResults.push({
            command,
            output: result.success ? result.output : result.error,
            success: result.success
          });
        }

        const finalSummaryPrompt = `
Summarize the result of executing these commands for the user's requested task.
If any error occurred, explain what went wrong and how to fix it.
If all succeeded, explain what was achieved.
Execution Results:
${JSON.stringify(executionResults, null, 2)}
`.trim();

        contents = formatHistory(history, finalSummaryPrompt);
        const summaryThinking = startThinking(chalk.yellow("Summarizing task results"));
        const finalResponse = await generateResponse(contents);
        stopThinking(summaryThinking);

        if (executionResults.every(r => r.success)) {
          console.log(chalk.cyanBright(`SILVER : ${finalResponse}`));
        } else {
          console.log(chalk.redBright(`SILVER : ${finalResponse}`));
        }

        history.push({ role: "user", parts: [{ text: finalSummaryPrompt }] });
        history.push({ role: "model", parts: [{ text: finalResponse }] });

        commands = extractCommandBlock(finalResponse);
      } while (commands.length > 0);

    } catch (err) {
      console.error(chalk.redBright("SILVER : Error generating response:", err));
    }
  }
}

await main();
