// playAudio.js
import player from 'play-sound';

const sound = player({});

export async function playAudio(filePath) {
  return new Promise((resolve, reject) => {
    const audio = sound.play(filePath, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });

    // Optional: handle process close
    audio.on('close', resolve);
  });
}
