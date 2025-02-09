const container = document.querySelector(".container");
const playButton = document.querySelector(".play");
const pauseButton = document.querySelector(".pause");

const audioMap = new Map();
let pause = false;

function handlePauseState() {
  if (pause) {
    pauseButton.setAttribute("disabled", "true");
  } else {
    pauseButton.removeAttribute("disabled");
  }
}

async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

function selectSound() {
  const buttons = document.querySelectorAll(".sound-key");
  if (!buttons) return;
  buttons.forEach((button) => {
    button.addEventListener("change", async (e) => {
      if (e.target.checked) {
        const key = button.getAttribute("data-key");
        const audio = audioMap.get(key);
        audio.play();
      }
    });
  });
}

function addListenerEventOnAudio() {
  const audios = audioMap.values();
  const buttons = Array.from(document.querySelectorAll(".sound-key"));
  return new Promise((resolve) => {
    for (const audio of audios) {
      const key = audio.getAttribute("data-key");
      audio.addEventListener("play", async (e) => {
        const button = buttons.find((btn) => {
          return btn.attributes["data-key"].value === key;
        });
        button.classList.add("playing");
        await sleep(200);
        button.classList.remove("playing");
      });
    }
    resolve(true);
  });
}

async function main() {
  await new Promise((resolve) => {
    // creating 24 buttons that will play the audio
    Array.from({ length: 24 }).forEach((_, idx) => {
      const button = document.createElement("input");
      const filename = `key${(idx + 1).toString().padStart("2", "0")}.ogg`;
      const audio = new Audio(`./sounds/${filename}`);
      audio.setAttribute("data-key", filename);
      // speed of single audio
      audio.playbackRate = 4;
      // preloading all the audio for better user experience
      audio.setAttribute("preload", "auto");
      audioMap.set(filename, audio);
      button.type = "checkbox";
      button.setAttribute("data-key", filename);
      button.setAttribute("class", "sound-key");
      container.appendChild(button);
    });
    resolve(true);
  });
  await addListenerEventOnAudio();
  selectSound();
}

main();

async function musicLoop(buttonsArray) {
  let k = 0;
  while (true) {
    if (pause) break;
    // tempo
    await sleep(500);
    if (k >= 4) k = 0;
    for (let j = 0; j < buttonsArray.length; j++) {
      const btn = buttonsArray[j][k];
      if (btn && btn.checked) {
        btn.classList.add("playing");
        const key = btn.getAttribute("data-key");
        const audio = audioMap.get(key);
        audio.play();
      }
      btn.classList.remove("playing");
    }
    k++;
  }
}

async function handleCreateMusic() {
  const checkedbutton = Array.from(document.querySelectorAll(".sound-key"));
  let TWODArray = [];
  const rows = checkedbutton.length / 4;
  const columns = checkedbutton.length / 6;
  for (let i = 0; i < rows; i++) {
    const buttons = checkedbutton.slice(i * columns, (i + 1) * columns);
    TWODArray[i] = buttons;
  }
  const findCheckedButton = checkedbutton.find((btn) => btn.checked);
  pause = false;
  handlePauseState();
  if (!findCheckedButton) return;
  await musicLoop(TWODArray);
}

function handlePause() {
  pause = true;
  handlePauseState();
}
