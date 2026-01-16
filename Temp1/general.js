const playBtn = document.getElementById("playBtn");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressBarContainer = document.getElementById("progressBarContainer");
const timeDisplay = document.getElementById("timeDisplay");
const volumeControl = document.getElementById("volumeControl");
const volumeBtn = document.getElementById("volumeBtn");
const volumeIcon = document.getElementById("volumeIcon");

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

/* === PLAY / PAUSE === */
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

/* === PROGRESO === */
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  timeDisplay.textContent =
    `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

audio.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  progress.style.width = "0%";
});

/* === CLICK + DRAG === */
function moveProgress(clientX, apply) {
  const rect = progressBarContainer.getBoundingClientRect();
  let offsetX = clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  const percent = offsetX / rect.width;
  progress.style.width = percent * 100 + "%";
  if (apply) audio.currentTime = percent * audio.duration;
}

progressBarContainer.addEventListener("mousedown", e => {
  moveProgress(e.clientX, true);
});

/* === TOUCH === */
progressBarContainer.addEventListener("touchstart", e => {
  moveProgress(e.touches[0].clientX, true);
});

progressBarContainer.addEventListener("touchmove", e => {
  moveProgress(e.touches[0].clientX, true);
});

/* === VOLUMEN === */
let lastVolume = 1;

volumeBtn.addEventListener("click", () => {
  if (audio.volume === 0) {
    audio.volume = lastVolume;
  } else {
    lastVolume = audio.volume;
    audio.volume = 0;
  }
  volumeControl.value = audio.volume;
  actualizarIcono(audio.volume);
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
  actualizarIcono(audio.volume);
});

function actualizarIcono(vol) {
  if (vol == 0) volumeIcon.src = "iconos/silencio.png";
  else if (vol < 1) volumeIcon.src = "iconos/volumen-reducido.png";
  else volumeIcon.src = "iconos/alto-volumen.png";
}

/* === TABS === */
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    contents.forEach(c =>
      c.classList.toggle("active", c.id === tab.dataset.tab)
    );
  });
});
