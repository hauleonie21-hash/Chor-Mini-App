const tracksConfig = [
  { name: "Klavier", file: "audio/klavier.mp3", defaultVolume: 80 },
  { name: "Sopran", file: "audio/sopran.mp3", defaultVolume: 80 },
  { name: "Alt", file: "audio/alt.mp3", defaultVolume: 80 },
  { name: "Tenor", file: "audio/tenor.mp3", defaultVolume: 80 },
  { name: "Bass", file: "audio/bass.mp3", defaultVolume: 80 }
];
const tracksEl = document.getElementById("tracks");
const playPauseBtn = document.getElementById("playPause");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const masterVolume = document.getElementById("masterVolume");
const masterValue = document.getElementById("masterValue");
const tempo = document.getElementById("tempo");
const tempoValue = document.getElementById("tempoValue");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const progress = document.getElementById("progress");
const timeDisplay = document.getElementById("timeDisplay");
let tracks = [];
let isPlaying = false;

function createTracks() {
  tracksConfig.forEach((config, index) => {
    const audio = new Audio(config.file);
    audio.preload = "auto";audio.addEventListener("ended", () => {
  isPlaying = false;
  playPauseBtn.textContent = "▶ Abspielen";
  tracks.forEach(t => {
    t.audio.pause();
    t.audio.currentTime = 0;
  });
  progress.value = 0;
});

    const card = document.createElement("article");
    card.className = "track";
    card.innerHTML = `
      <h2>${config.name}</h2>
      <div class="volume-wrap">
        <label for="vol-${index}">Lautstärke</label>
        <input id="vol-${index}" type="range" min="0" max="100" value="${config.defaultVolume}">
        <span id="val-${index}">${config.defaultVolume}%</span>
      </div>
      <button type="button" class="solo" aria-label="${config.name} solo hören">S</button>
      <button type="button" class="mute" aria-label="${config.name} stumm schalten">M</button>
    `;
    tracksEl.appendChild(card);

    const volume = card.querySelector(`#vol-${index}`);
    const value = card.querySelector(`#val-${index}`);
    const solo = card.querySelector(".solo");
    const mute = card.querySelector(".mute");

    const track = { config, audio, volume, value, solo, mute, isSolo: false, isMuted: false };
    tracks.push(track);

    volume.addEventListener("input", () => {
      value.textContent = `${volume.value}%`;
      updateVolumes();
    });
    solo.addEventListener("click", () => {
      track.isSolo = !track.isSolo;
      solo.classList.toggle("active", track.isSolo);
      updateVolumes();
    });
    mute.addEventListener("click", () => {
      track.isMuted = !track.isMuted;
      mute.classList.toggle("active", track.isMuted);
      updateVolumes();
    });
  });
  updateVolumes();
}

function updateVolumes() {
  const master = Number(masterVolume.value) / 100;
  const hasSolo = tracks.some(t => t.isSolo);
  tracks.forEach(t => {
    const ownVolume = Number(t.volume.value) / 100;
    const audibleBySolo = !hasSolo || t.isSolo;
    t.audio.volume = t.isMuted || !audibleBySolo ? 0 : ownVolume * master;
    t.audio.playbackRate = Number(tempo.value) / 100;
  });
  masterValue.textContent = `${masterVolume.value}%`;
  tempoValue.textContent = `${tempo.value}%`;
}

function syncToFirstTrack() {
  const current = tracks[0]?.audio.currentTime || 0;
  tracks.forEach(t => { t.audio.currentTime = current; });
}

async function playAll() {
  syncToFirstTrack();
  try {
    await Promise.all(tracks.map(t => t.audio.play()));
    isPlaying = true;
playPauseBtn.textContent = "⏸ Pause";
updateProgress();
  } catch (error) {
    alert("Die Audiodateien konnten nicht abgespielt werden. Bitte prüfe, ob sie im Ordner 'audio' liegen und richtig benannt sind.");
  }
}

function pauseAll() {
  tracks.forEach(t => t.audio.pause());
  isPlaying = false;
  playPauseBtn.textContent = "▶ Abspielen";
}

function stopAll() {
  pauseAll();
  tracks.forEach(t => { t.audio.currentTime = 0; });
}

function resetAll() {
  stopAll();
  masterVolume.value = 80;
  tempo.value = 100;
  tracks.forEach(t => {
    t.volume.value = t.config.defaultVolume;
    t.value.textContent = `${t.config.defaultVolume}%`;
    t.isSolo = false;
    t.isMuted = false;
    t.solo.classList.remove("active");
    t.mute.classList.remove("active");
  });
  updateVolumes();
} 

playPauseBtn.addEventListener("click", () => isPlaying ? pauseAll() : playAll());
stopBtn.addEventListener("click", stopAll);
resetBtn.addEventListener("click", resetAll);
masterVolume.addEventListener("input", updateVolumes);
tempo.addEventListener("input", updateVolumes);

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function updateProgress() {
  if (!tracks.length) return;

  const firstAudio = tracks[0].audio;
  const current = firstAudio.currentTime;
  const duration = firstAudio.duration || 0;

  if (duration > 0) {
    progress.value = (current / duration) * 100;
    timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  if (isPlaying) {
    requestAnimationFrame(updateProgress);
  }
}

progress.addEventListener("input", () => {
  if (!tracks.length) return;

  const firstAudio = tracks[0].audio;
  const duration = firstAudio.duration || 0;
  const newTime = (Number(progress.value) / 100) * duration;

  tracks.forEach(t => {
    t.audio.currentTime = newTime;
  });
});

rewindBtn.addEventListener("click", () => {
  tracks.forEach(t => {
    t.audio.currentTime = Math.max(0, t.audio.currentTime - 10);
  });
});

forwardBtn.addEventListener("click", () => {
  tracks.forEach(t => {
    t.audio.currentTime = Math.min(t.audio.duration || 0, t.audio.currentTime + 10);
  });
});

tracksEl.addEventListener("loadedmetadata", updateProgress, true);

createTracks();
