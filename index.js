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

function createMusic() {
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

async function main() {
  await new Promise((resolve) => {
    Array.from({ length: 24 }).forEach((_, idx) => {
      const button = document.createElement("input");
      const filename = `key${(idx + 1).toString().padStart("2", "0")}.ogg`;
      const audio = new Audio(`./sounds/${filename}`);
      audio.playbackRate = 4;
      audio.setAttribute("preload", "auto");
      audioMap.set(filename, audio);
      button.type = "checkbox";
      button.setAttribute("data-key", filename);
      button.setAttribute("class", "sound-key");
      container.appendChild(button);
    });
    resolve(true);
  });
  createMusic();
}

main();

async function musicLoop(buttonsArray) {
  let k = 0;
  while (true) {
    if (pause) break;
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
