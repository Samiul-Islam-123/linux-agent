import wav from 'wav';
import player from 'play-sound'

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

//playAudio('out.wav')