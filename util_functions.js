import wav from 'wav';
import player from 'play-sound'
import { exec } from "child_process";
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


const execPromise = util.promisify(exec);

export async function runCommand(command) {
  try {
    console.log("Running command : "+command)
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      return { success: false, error: stderr.trim() };
    }
    console.log(stdout)
    return { success: true, output: stdout.trim() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export const extractCommandBlock = (text) => {
  const commandSectionMatch = text.match(/# COMMANDS\s+([\s\S]*?)\n# EXPLANATION/i);
  if (!commandSectionMatch) return [];

  // Split by line, trim, and filter out empty lines
  return commandSectionMatch[1]
    .split('\n')
    .map(cmd => cmd.trim())
    .filter(Boolean);
};


//playAudio('out.wav')