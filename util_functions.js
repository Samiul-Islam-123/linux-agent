import wav from 'wav';
import player from 'play-sound'
import { spawn } from "child_process";
import util from "util";

//player object
const sound = player();

export async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

export async function playAudio(filePath) {
    return new Promise((resolve, reject) => {
      sound.play(filePath, (err) => {
        if (err) {
          console.error(`Error playing audio: ${err}`);
          return reject(err);
        }
        resolve();
      });
    });
  }


  export async function runCommand(command) {
    return new Promise((resolve) => {
      console.log("Running command: " + command);
      
      // Split the command, this is important
      const [cmd, ...args] = command.split(" ");
      
      // Use 'pipe' to capture the stdout and stderr streams
      const child = spawn(cmd, args, { 
        stdio: 'pipe', 
        shell: true 
      });
  
      let stdoutData = "";
      let stderrData = "";
  
      // Collect data from stdout stream
      child.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });
  
      // Collect data from stderr stream
      child.stderr.on("data", (data) => {
        stderrData += data.toString();
      });
  
      child.on("close", (code) => {
        // If there was an error, return the stderr output
        if (code !== 0) {
          resolve({ success: false, error: stderrData || `Exited with code ${code}` });
        } else {
          // Otherwise, return the stdout output
          resolve({ success: true, output: stdoutData });
        }
      });
  
      child.on("error", (err) => {
        resolve({ success: false, error: err.message });
      });
    });
  }

export const extractCommandBlock = (text) => {
  
  const lines = text.split('\n');
  const commands = [];

  let inCommandBlock = false;

  for (let line of lines) {
    line = line.trim();

    if (line.toUpperCase() === '# COMMANDS') {
      inCommandBlock = true;
      continue;
    }

    if (line.toUpperCase() === '# EXPLANATION') {
      break;
    }

    if (inCommandBlock) {
      if (line !== '') {
        commands.push(line);
      }
    }
  }

  return commands;
};

//thinking animation
const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let i = 0;

export function startThinking(message = "Thinking") {
  process.stdout.write("\x1b[?25l"); // hide cursor
  return setInterval(() => {
    process.stdout.write(`\r${frames[i = ++i % frames.length]} ${message}...`);
  }, 80);
}

export function stopThinking(interval) {
  clearInterval(interval);
  process.stdout.write("\r"); // clear line
  process.stdout.write("\x1b[?25h"); // show cursor
}

export const SystemConfig = `
      You are Silver, an intelligent Linux automation agent.

      Rules:
      1. Output only the required shell commands under "# COMMANDS".
      2. If the user explicitly asks for details, add an "# EXPLANATION" section, use # EXPLANATION for everything other than command.
      3. Always confirm before running destructive tasks.
      4. Never wrap commands in backticks or markdown.
      5. No inline comments in commands.
      6. If multiple commands are needed, list them in correct order.
      7. Always be safe, clear, and concise.
      8. When explaining command results:
         - If SUCCESS, just say "Command executed successfully."
         - If ERROR, explain what went wrong and suggest fixes.
      9. Keep messages short and actionable.
      10. Say the answers in a user friendly terms. if anything technical is not asked to perform or any checking is requested then coem up with user friendly terms
      11. come up with conclusive answers
      12. while installing any sudo apt commands use -y flag by default 
      13. start the conversation with a nice welcome message
      `



//playAudio('out.wav')