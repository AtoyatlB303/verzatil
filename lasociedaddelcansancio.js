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

// === PLAY / PAUSE ===
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

// === PROGRESO ===
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

audio.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  progress.style.width = "0%";
});

// === CONTROL DE PROGRESO ===
let isDragging = false;
progressBarContainer.addEventListener("mousedown", e => {
  isDragging = true;
  moveProgress(e);
});
window.addEventListener("mousemove", e => {
  if (isDragging) moveProgress(e);
});
window.addEventListener("mouseup", e => {
  if (isDragging) {
    moveProgress(e, true);
    isDragging = false;
  }
});

function moveProgress(e, apply = false) {
  const rect = progressBarContainer.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  const percent = offsetX / rect.width;
  progress.style.width = percent * 100 + "%";
  if (apply) audio.currentTime = percent * audio.duration;
}

// === VOLUMEN / MUTE ===
let lastVolume = 1;

// Clic en el icono de volumen
volumeBtn.addEventListener("click", () => {
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    audio.volume = lastVolume;
    volumeControl.value = lastVolume;
    actualizarIconoVolumen(audio.volume);
  } else {
    audio.muted = true;
    lastVolume = volumeControl.value;
    volumeControl.value = 0;
    actualizarIconoVolumen(0);
  }
});

// Cambios en el control de volumen
volumeControl.addEventListener("input", () => {
  audio.muted = false;
  audio.volume = volumeControl.value;
  actualizarIconoVolumen(audio.volume);
});

// Actualiza el ícono según el volumen
function actualizarIconoVolumen(volumen) {
  if (volumen == 0) {
    volumeIcon.src = "iconos/silencio.png";
  } else if (volumen > 0 && volumen < 1) {
    volumeIcon.src = "iconos/volumen-reducido.png";
  } else {
    volumeIcon.src = "iconos/alto-volumen.png";
  }
}

// === TABS ===
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    contents.forEach(c => c.classList.toggle("active", c.id === target));
  });
});
