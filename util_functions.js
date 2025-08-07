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

    const [cmd, ...args] = command.split(" ");
    const child = spawn(cmd, args, { shell: true });

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true, output: output.trim() });
      } else {
        resolve({ success: false, error: error.trim() || `Exited with code ${code}` });
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



//playAudio('out.wav')