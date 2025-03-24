// ✅ Set me Free
window.TOUCH_THRESHOLD = 25;
window.DRAG_SPEED = 2;
  document.addEventListener('DOMContentLoaded', () => {
    const touchSlider = document.getElementById('touchThreshold');
    const touchValueDisplay = document.getElementById('touchThresholdValue');

    const dragSpeedSlider = document.getElementById('dragSpeed');
    const dragSpeedValueDisplay = document.getElementById('dragSpeedValue');

    touchSlider.addEventListener('input', () => {
      window.TOUCH_THRESHOLD = parseInt(touchSlider.value, 10);
      touchValueDisplay.textContent = touchSlider.value;
      console.log("TOUCH_THRESHOLD:", window.TOUCH_THRESHOLD);
    });

    dragSpeedSlider.addEventListener('input', () => {
      window.DRAG_SPEED = parseInt(dragSpeedSlider.value, 10);
      dragSpeedValueDisplay.textContent = dragSpeedSlider.value;
      console.log("DRAG_SPEED:", window.DRAG_SPEED);
    });

  });

function repositionMusicSettings() {
  var musicSettings = document.getElementById('tutorial-music');
  var container = document.getElementById('music-settings-container');
  var tutorialContent = document.getElementById('tutorial-content');

  if (!musicSettings || !container || !tutorialContent) return;

  if (window.innerWidth >= 950) {
    if (musicSettings.parentElement !== container) {
      container.appendChild(musicSettings);
     musicSettings.style.display = "block"; // Ensure it's visible
    }
  } else {
     if (musicSettings.parentElement !== tutorialContent) {
      tutorialContent.appendChild(musicSettings);
     musicSettings.style.display = "";
    }
  }

  // Ensure sliders and selects are interactive
  document.querySelectorAll('#tutorial-music input[type="range"], #tutorial-music select').forEach(el => {
    el.style.pointerEvents = 'auto';
    el.addEventListener('mousedown', e => e.stopPropagation());
    el.addEventListener('touchstart', e => e.stopPropagation());
  });
}

// Prevent touch and mouse event interference
function initInteractiveButtons() {
  const interactiveButtons = [
    'rotateXButton', 'rotateYButton', 'rotateZButton', 'DropPieceButton',
    'settingsButton', 'pauseButton',
    ...Array.from(document.querySelectorAll('#controlTable button[id]')).map(btn => btn.id)
  ];

  interactiveButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('touchstart', e => btn.classList.add('active-btn'));
    btn.addEventListener('touchend', e => {
      btn.classList.remove('active-btn');
      if (id === 'DropPieceButton' || id === 'settingsButton') {
        e.preventDefault();
        btn.click();
      } else {
        e.preventDefault();
      }
    });

    btn.addEventListener('mousedown', () => btn.classList.add('active-btn'));
    btn.addEventListener('mouseup', () => btn.classList.remove('active-btn'));
  });
}

// Initialize draggable elements (floatables)
function initFloatables() {
  const floatables = document.querySelectorAll('.floatable-container');
  if (window.innerWidth <= 949) {
    floatables.forEach(el => {
      el.style.position = 'absolute';
      el.style.cursor = 'move';
      el.style.userSelect = 'none';
      makeDraggable(el);
    });
  } else {
    floatables.forEach(el => {
      el.removeAttribute('style');
      el.onmousedown = null;
      el.ontouchstart = null;
    });
  }
}

// Draggable setup
function makeDraggable(el) {
  let isDragging = false, startX, startY, origX, origY;

  function dragStart(e) {
    if (e.target.closest('input, select, button')) return;

    e.preventDefault();
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;
    origX = el.offsetLeft;
    origY = el.offsetTop;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }

  function dragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    el.style.left = `${origX + clientX - startX}px`;
    el.style.top = `${origY + clientY - startY}px`;
  }

  function dragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
  }

  el.addEventListener('mousedown', dragStart);
  el.addEventListener('touchstart', dragStart, { passive: false });
}

// Event listeners for initial load and resize
window.addEventListener('resize', () => {
  repositionMusicSettings();
  initFloatables();
});

document.addEventListener('DOMContentLoaded', () => {
  repositionMusicSettings();
  window.addEventListener('resize', repositionMusicSettings);
  initInteractiveButtons();
  initFloatables();
});

function disposeMesh(mesh) {
  if (mesh.geometry) {
    mesh.geometry.dispose();
    mesh.geometry = null;
  }
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(mat => { if(mat.dispose) mat.dispose(); });
    } else {
      mesh.material.dispose();
    }
    mesh.material = null;
  }
}
function toggleMusic() {
  const music = document.getElementById('backgroundMusic');
  if (!music) return;
  if (music.paused) {
    music.play().catch(() => {});
    if (typeof chordGenerator !== 'undefined' && chordGenerator.stop) {
      chordGenerator.stop();
    }
  } else {
    music.pause();
    if (typeof chordGenerator !== 'undefined' && chordGenerator.start && !isPaused) {
      chordGenerator.start();
    }
  }
  const icon = music.paused
    ? '<i class="fa-solid fa-volume-mute"></i>'
    : '<i class="fa-solid fa-volume-up"></i>';
  ['musicButton', 'tutorialMusicButton', 'muteButton',].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.innerHTML = icon;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  ['musicButton', 'tutorialMusicButton', 'muteButton', ].forEach(function(id) {
    var element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', toggleMusic);
    }
    
});  
  
  document.getElementById('musicTrack').addEventListener('change', function () {
    
    const music = document.getElementById('backgroundMusic');
    let url;
    switch (this.value) {
      case 'track1': url = 'https://www.bensound.com/bensound-music/bensound-dreams.mp3'; break;
      case 'track2': url = 'https://www.bensound.com/bensound-music/bensound-moose.mp3'; break;
      case 'track3': url = 'https://www.bensound.com/bensound-music/bensound-dance.mp3'; break;
      case 'track4': url = 'https://www.bensound.com/bensound-music/bensound-stay.mp3'; break;
      default: url = 'https://www.bensound.com/bensound-music/bensound-dreams.mp3';
    }
    const wasPlaying = !music.paused;
    music.pause();
    music.src = url;
    music.load();
    if (wasPlaying) music.play().catch(() => {});
  });
  const musicElem = document.getElementById('backgroundMusic');
  musicElem.volume = parseFloat(document.getElementById('volumeControl').value);
  musicElem.muted = false;
  document.getElementById('volumeControl').addEventListener('input', function () {
    musicElem.volume = parseFloat(this.value);
    
  });
//SoundManager
class SoundManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    
    this.fxVolume = 0.2;
    this.fxMuted = false;
    
    this.echoNode = this.audioContext.createDelay();
    this.echoNode.delayTime.value = 0.25;
    this.echoOn = false; 
    
    this.bgMusic = null;
    
    this.lastMoveSoundTime = 0;
    this.moveSoundDelay = 150;
    this.moveSoundPattern = [
      { type: 'sine', freq: 180, duration: 0.05 },
     
    ];
    this.moveSoundIndex = 0;
  }

playOscillatorSound({ type, frequency, duration, volume }) {
  if (this.fxMuted) return;
  let oscillator = this.audioContext.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

  let gainNode = this.audioContext.createGain();
  gainNode.gain.setValueAtTime(volume * this.fxVolume, this.audioContext.currentTime);

  if (this.echoOn) {
    gainNode.connect(this.echoNode);
    this.echoNode.connect(this.audioContext.destination);
  } else {
    gainNode.connect(this.audioContext.destination);
  }

  oscillator.connect(gainNode);
  oscillator.start();
  oscillator.stop(this.audioContext.currentTime + duration);
}
 
playMoveSound(isAutoDrop = false) {
  const now = Date.now();
  if (now - this.lastMoveSoundTime < this.moveSoundDelay) return;
  this.lastMoveSoundTime = now;
  
  const volume = isAutoDrop ? 0.2 : 0.1;
  const pattern = this.moveSoundPattern[this.moveSoundIndex];
  this.moveSoundIndex = (this.moveSoundIndex + 1) % this.moveSoundPattern.length;
  
  this.playOscillatorSound({
    type: pattern.type,
    frequency: pattern.freq,
    duration: pattern.duration,
    volume: volume
  });
}

playRotateSound(axis) {
  if (this.fxMuted) return;  
  if (!this.lastRotateSoundTimes) {
    this.lastRotateSoundTimes = { x: 0, y: 0, z: 0 };
  }
  const now = Date.now();
  const throttleDelay = 600; 
  
 
  if (now - this.lastRotateSoundTimes[axis] < throttleDelay) {
    return;
  }
  this.lastRotateSoundTimes[axis] = now;
  
  const settings = {
    x: { start: 120, end: 80, duration: 0.3, volume: 0.4, wave: 'sawtooth' },
    y: { start: 110, end: 70, duration: 0.3, volume: 0.3, wave: 'sawtooth' },
    z: { start: 100, end: 60, duration: 0.3, volume: 0.2, wave: 'sawtooth' }
  };
  
  const config = settings[axis];
 
  const oscillator = this.audioContext.createOscillator();
  oscillator.type = config.wave;
  oscillator.frequency.setValueAtTime(config.start, this.audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    config.end,
    this.audioContext.currentTime + config.duration
  );
  
  const gainNode = this.audioContext.createGain();
  gainNode.gain.setValueAtTime(config.volume * this.fxVolume, this.audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + config.duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(this.audioContext.destination);
  oscillator.start();
  oscillator.stop(this.audioContext.currentTime + config.duration);
  oscillator.onended = () => {   
  };
}

  playLineClearSound() {
    if (this.fxMuted) return;    
    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.6);

    let gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(this.fxVolume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.6);
    oscillator.onended = () => {
      // Line clear sound finished
    };
  }
playScoreSound(points) {
  if (this.fxMuted) return;
  let utterance = new SpeechSynthesisUtterance(`Yeah, ${points} points.`);
  utterance.volume = 0.25;
  utterance.lang = "en-US";    
  window.speechSynthesis.speak(utterance);
}
playBonusVoice(reward) {  
  if (this.fxMuted) return;
  let message = `Yeahh, Score x${reward} Bonus!`;
  let utterance = new SpeechSynthesisUtterance(message);
  utterance.volume = 0.75; // Adjust the volume as needed
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

playVoiceMessage(message) {  
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.volume = 0.75;
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}
  

showBonusRewardMessage(reward) {  
   let utterance = new SpeechSynthesisUtterance(`Bonus Reward Achieved! Score x${reward} Bonus!`);
  utterance.volume = 0.75;
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
  let elem = document.getElementById("bonus-reward-msg");
  if (!elem) {
    elem = document.createElement("div");
    elem.id = "bonus-reward-msg";
    elem.className = "bonus-reward";
    document.body.appendChild(elem);
  }
  const musicElem = document.getElementById('backgroundMusic');
  const previousSrc = musicElem ? musicElem.src : "";

  if (musicElem) {
    musicElem.pause();
    
    musicElem.src = 'https://www.bensound.com/bensound-music/bensound-dance.mp3';
    musicElem.load();
    musicElem.play().catch(() => {});
  }
  elem.innerHTML = `Bonus Reward Achieved!<br>Score x${reward} Bonus!<br>
    <img src="https://res.cloudinary.com/dses6pw9b/image/upload/v1741111524/Dance-transp-link_i9axb7.gif" class="bonus-gif" />`;
  elem.style.display = "block";
  setTimeout(() => {
    elem.style.display = "none";
    if (musicElem) {
      musicElem.pause();      
    }
  }, 5000);
}
playBonusReward(reward) {
  this.playBonusVoice(reward);
  this.showBonusRewardMessage(reward);
}
playHighScoreMessage(score) {
  if (this.fxMuted) return;
  let utterance = new SpeechSynthesisUtterance(`New high score: ${score} points! Congratulations!`);
  utterance.volume = 0.75; // Adjust volume as needed
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}  
toggleExternalBgMusic() {
    if (!this.bgMusic) return;
    if (this.bgMusic.paused) {
      this.bgMusic.play().catch(() => {});
    } else {
      this.bgMusic.pause();
    }
  }  
}
class ChordGenerator {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.isPlaying = false;
    this.currentChordIndex = 0;
    this.chords = [
      { name: 'TM', frequencies: [261.63, 329.63, 392.00], duration: 0.6 },
      { name: 'TMM', frequencies: [293.66, 349.23, 440.00], duration: 0.6 },
      { name: 'TU', frequencies: [220.00, 261.63, 329.63], duration: 0.6 },
      { name: 'LU', frequencies: [174.61, 220.00, 261.63], duration: 0.6 },
      { name: 'LU', frequencies: [196.00, 246.94, 293.66], duration: 0.6 },
      { name: 'LU', frequencies: [196.00, 246.94, 293.66], duration: 0.6 },
      { name: 'TMM', frequencies: [293.66, 349.23, 440.00], duration: 0.6 }
    ];
    this.tempo = 1;
     this.chordVolume = 0.075 
    this.timer = null;
  }
  
  start() {
    this.isPlaying = true;
    this.playNextChord();
  }
  
  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }
  
  setTempo(multiplier) {
    this.tempo = multiplier;   
  }
  
  playChord(chord) {
    if (soundManager.fxMuted) return;
    let now = this.audioContext.currentTime;
    let gainNode = this.audioContext.createGain();
    let effectiveVolume = this.chordVolume * soundManager.fxVolume;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(effectiveVolume, now + 0.1);
    gainNode.connect(this.audioContext.destination);
    chord.frequencies.forEach(freq => {
      let osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gainNode);
      osc.start(now);
      gainNode.gain.linearRampToValueAtTime(0.001, now + chord.duration / this.tempo - 0.1);
      osc.stop(now + chord.duration / this.tempo);
    });
  }
  
  playNextChord() {
    if (!this.isPlaying) return;
    const chord = this.chords[this.currentChordIndex];
    this.playChord(chord);
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
    this.timer = setTimeout(() => this.playNextChord(), (chord.duration * 1000) / this.tempo);
  }
}
let audioContext;
let soundManager;
let chordGenerator;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }

  soundManager = new SoundManager(audioContext);
  chordGenerator = new ChordGenerator(audioContext);
  
  document.body.removeEventListener('click', initAudio);
  document.body.removeEventListener('touchstart', initAudio);
}

document.body.addEventListener('click', initAudio, { once: true });
document.body.addEventListener('touchstart', initAudio, { once: true });


function unlockAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  document.body.removeEventListener('click', unlockAudio);
  document.body.removeEventListener('touchstart', unlockAudio);
}
document.body.addEventListener('click', unlockAudio, { once: true });
document.body.addEventListener('touchstart', unlockAudio, { once: true });


function updateGameSpeed(newSpeed, difficultyFactor = 1) {
  gameSpeed = newSpeed;
  const baseGameSpeed = 600;
  const minGameSpeed = 100;
  const basicMultiplier = 1 + 2 * ((baseGameSpeed - gameSpeed) / (baseGameSpeed - minGameSpeed));
  const tempoMultiplier = basicMultiplier * difficultyFactor;
  chordGenerator.setTempo(tempoMultiplier);
  
  const baseStarfieldRate = 0.0001;
  const maxStarfieldRate = 0.001;
  const factor = (baseGameSpeed - gameSpeed) / (baseGameSpeed - minGameSpeed);
  starfieldRotationRate = baseStarfieldRate + factor * (maxStarfieldRate - baseStarfieldRate);
}

soundManager = new SoundManager();
chordGenerator = new ChordGenerator(soundManager.audioContext);
document.body.addEventListener('click', function startChord() {
  if (!soundManager.fxMuted && !isPaused && chordGenerator) {
    chordGenerator.start();
  }
  document.body.removeEventListener('click', startChord);
}, { once: true });

  //Var...  
  let moveSoundPlaying = false;
  let rotateSoundPlaying = false;
  let lineClearSoundPlaying = false;
  let bonusPerClearedLine = 5; 
  let isPieceMoving = false;
  let lastMoveSoundTime = 0; 
  let lastLineClearTime = 0;
  var fixPieceCount = 0; 
  var fixPieceMax = 25;  
  var lastRotateSoundTime = 0;
  var edgeColorToggle = false; 
  let TOUCH_THRESHOLD = 25;
  let DRAG_SPEED = window.DRAG_SPEED;
  var clickCount = 0, clickTimer;
  var gameStarted = false, gameSpeedBase = 600, gameSpeed = gameSpeedBase;
  var raycaster = new THREE.Raycaster();
  var rotationPoint = new THREE.Vector3(0, 0, 0);
  var spherical = new THREE.Spherical(), rotateSpeed = 1;
  var isTouchDragging = false, touchStartX = 0, touchStartY = 0;
  var linesCleared = 0, projectedPiece = [], startY = 0;
  var isZooming = false, autoDropOnRelease = true, autoZoomEnabled = true;
  var animationFrameId, previewAnimationFrameId = null;
  var selectedPiece = null, isDragging = false, mouseStartX = 0, mouseStartY = 0;
  var mouse = new THREE.Vector2(), previouslySelectedObject = null;
  var starfieldRotationRate = 0.0001;
  var flashIntervalId = null;
  var starGeometry;
  var zoomControl;
  var fxMuted = false, fxVolume = 0.4, fxSoundButton, fxVolumeControl, autoDropCheckbox, autoZoomToggle, gridDepthControl;
  var scene, gameGroup, camera, renderer, ambientLight, directionalLight, piecesGroup;
  var blockSize = 1, gridWidth = 10, gridHeight = 22, gridDepth = 10;
  var score = 0, isGameOver = false, isPaused = false, currentPieceShapeName = "N/A";
  var grid = {}, currentPiece, lastTime = 0;
  var texture = new THREE.TextureLoader().load('https://res.cloudinary.com/dses6pw9b/image/upload/v1726406574/CAD-AI-Robotx150x150transp_f2m3fm.png');
texture.center.set(0.5, 0.5);
texture.rotation = Math.PI;

var baseMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  
  side: THREE.DoubleSide
});
  var base, gridHelper, gridEdgesGeometry, gridEdgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }), gridEdges;
  var tetrominoShapes = [
    { name: "I-Shape", color: 0x00ffff, blocks: [{ x:0, y:0, z:0 }, { x:0, y:1, z:0 }, { x:0, y:-1, z:0 }, { x:0, y:-2, z:0 }] },
    { name: "O-Shape", color: 0x2ff82, blocks: [{ x:0, y:0, z:0 }, { x:1, y:0, z:0 }, { x:0, y:-1, z:0 }, { x:1, y:-1, z:0 }] },
    { name: "T-Shape", color: 0x800080, blocks: [{ x:0, y:0, z:0 }, { x:-1, y:0, z:0 }, { x:1, y:0, z:0 }, { x:0, y:-1, z:0 }] },
    { name: "L-Shape", color: 0xffa500, blocks: [{ x:0, y:0, z:0 }, { x:0, y:-1, z:0 }, { x:0, y:-2, z:0 }, { x:1, y:-2, z:0 }] },
    { name: "S-Shape", color: 0x00ff00, blocks: [{ x:0, y:0, z:0 }, { x:1, y:0, z:0 }, { x:0, y:-1, z:0 }, { x:-1, y:-1, z:0 }] },
    { name: "H-Shape", color: 0x82ff82, active: false, blocks: [{ x:-1, y:1, z:0 }, { x:0, y:1, z:0 }, { x:0, y:0, z:0 }, { x:-1, y:-1, z:0 }, { x:0, y:-1, z:0 }, { x:1, y:-1, z:0 }] },
    { name: "E-Shape", color: 0x8aff8a, active: false, blocks: [{ x:-1, y:1, z:0 }, { x:0, y:1, z:0 }, { x:-1, y:0, z:0 }, { x:-1, y:-1, z:0 }, { x:0, y:-1, z:0 }] },
    { name: "Z-Shape", color: 0xffd07a, active: false, blocks: [{ x:-1, y:0, z:0 }, { x:0, y:0, z:0 }, { x:0, y:-1, z:0 }, { x:1, y:-1, z:0 }, { x:1, y:-2, z:0 }, { x:2, y:-2, z:0 }] },
    { name: "X-Shape", color: 0xff9494, active: false, blocks: [{ x:-1, y:1, z:0 }, { x:1, y:1, z:0 }, { x:0, y:0, z:0 }, { x:-1, y:-1, z:0 }, { x:1, y:-1, z:0 }] }
  ];
  function getActiveShapes() {
    return tetrominoShapes.filter(shape => shape.active !== false);
  }
  var nextPieceShape = null, previewRenderer = null, previewScene = null;
  document.body.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }, { once: true }); 
fxSoundButton = document.getElementById('fxSoundButton');
fxVolumeControl = document.getElementById('fxVolumeControl');
autoDropCheckbox = document.getElementById('autoDropOnRelease');
autoZoomToggle = document.getElementById('autoZoomToggle');
gridDepthControl = document.getElementById('gridDepthControl');
zoomControl = document.getElementById('zoom-control');

fxSoundButton.addEventListener('click', () => {   
  soundManager.fxMuted = !soundManager.fxMuted;    
  fxSoundButton.innerHTML = soundManager.fxMuted
    ? '<i class="fa-solid fa-volume-mute"></i>'
    : '<i class="fa-solid fa-volume-up"></i>';

  if (soundManager.fxMuted) {
    chordGenerator.stop();
  } else if (!isPaused) {
    chordGenerator.start();
  }
});

fxVolumeControl.addEventListener('input', function () { 
  soundManager.fxVolume = parseFloat(this.value);
});
document.addEventListener('DOMContentLoaded', () => {
  // Explicitly initialize global variables
  window.TOUCH_THRESHOLD = 25;
  window.DRAG_SPEED = 2;

  // Get elements from the DOM
  const thresholdSlider = document.getElementById('touchThreshold');
  const thresholdValueDisplay = document.getElementById('touchThresholdValue');
  const dragSpeedSlider = document.getElementById('dragSpeed');
  const dragSpeedValueDisplay = document.getElementById('dragSpeedValue');

  // FIRST set initial values explicitly (to match JS global variables)
  thresholdSlider.value = window.TOUCH_THRESHOLD;
  thresholdValueDisplay.textContent = window.TOUCH_THRESHOLD;
  
  dragSpeedSlider.value = window.DRAG_SPEED;
  dragSpeedValueDisplay.textContent = window.DRAG_SPEED;

  // THEN attach event listeners
  thresholdSlider.addEventListener('input', (e) => {
    window.TOUCH_THRESHOLD = parseInt(e.target.value, 10);
    thresholdValueDisplay.textContent = e.target.value;
    console.log('TOUCH_THRESHOLD updated:', window.TOUCH_THRESHOLD);
  });

  dragSpeedSlider.addEventListener('input', (e) => {
    window.DRAG_SPEED = parseInt(e.target.value, 10);
    dragSpeedValueDisplay.textContent = e.target.value;
    console.log('DRAG_SPEED updated:', window.DRAG_SPEED);
  });
});

//👉 
  function FlashSelected(obj) {
    if (!obj) return;
    if (previouslySelectedObject && previouslySelectedObject !== obj) {
      releaseShape(previouslySelectedObject);
    }
    previouslySelectedObject = obj;
    if (!flashIntervalId) {
      let flag = false;
      flashIntervalId = setInterval(() => {
        document.body.style.cursor = flag ? "pointer" : "default";
        flag = !flag;
      }, 500);
    }
  }
  function releaseShape(obj) {
    if (!obj) return;
    if (flashIntervalId) { clearInterval(flashIntervalId); flashIntervalId = null; document.body.style.cursor = "default"; }
    previouslySelectedObject = null;
  } 
//
  autoDropCheckbox.addEventListener('change', function () { autoDropOnRelease = this.checked; });
  autoZoomToggle.addEventListener('change', function () { autoZoomEnabled = this.checked; });
  gridDepthControl.addEventListener('input', function () {
    let newDepth = Math.min(10, Math.max(2, Math.round(parseInt(this.value) / 2) * 2));
    this.value = newDepth; document.getElementById('gridDepthValue').textContent = newDepth;
    updateGridDepthStatus(newDepth); updateGridDepth(newDepth);
  });
  function updateGridDepthStatus(depth) {
    let status = document.getElementById('gridDepthStatus');
    status.textContent = depth <= 6 ? 'Complete base vertical line = Off' : '';
    status.style.display = depth <= 6 ? 'block' : 'none';
  }
  function updateGridDepth(newDepth) {
    newDepth = Math.min(10, Math.max(2, Math.round(newDepth / 2) * 2));
    gridDepth = newDepth;
    gameGroup.remove(base); disposeMesh(base);
    gameGroup.remove(gridHelper); gameGroup.remove(gridEdges);
    baseGeometry = new THREE.PlaneGeometry(gridWidth * blockSize, newDepth * blockSize);
    base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = Math.PI / 2;
    base.position.set(-blockSize / 2, (-gridHeight / 2 * blockSize) - blockSize / 2, -blockSize / 2);
    gameGroup.add(base);
    gridHelper = new THREE.GridHelper(gridWidth * blockSize, gridWidth);
    gridHelper.rotation.x = 0;
    gridHelper.position.set(-blockSize / 2, (-gridHeight / 2 * blockSize) - blockSize / 2 + 0.01, -blockSize / 2);
    gameGroup.add(gridHelper);
    gridEdgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(gridWidth * blockSize, gridHeight * blockSize, newDepth * blockSize));
    gridEdges = new THREE.LineSegments(gridEdgesGeometry, gridEdgesMaterial);
    gridEdges.position.set(-blockSize / 2, -blockSize / 2, -blockSize / 2);
    gameGroup.add(gridEdges);
    updateRotationPoint();
    restartGame();
    updateGridDepthStatus(newDepth);   updateHighScoreDisplay();
  }
  function updateRotationPoint() {
    if (!base) return;
    let centerX = -blockSize;
    let pivotY = -(gridHeight / 2 * blockSize) + 7;
    let extraZ = (spherical.radius - 15) * 0.2;
    let pivotZ = -blockSize - extraZ;
    rotationPoint.set(centerX, pivotY, pivotZ);
    if (camera) {
      camera.lookAt(rotationPoint);
    }
  }
  function updateCameraPosition() {
    if (!autoZoomEnabled) return;
    let highestY = getHighestFilledY();
    let filledHeight = highestY + gridHeight / 2 + 1;
    let newRadius = 15 + (40 - 15) * (filledHeight / gridHeight);
    spherical.radius += (newRadius - spherical.radius) * 0.1;
    let offset = new THREE.Vector3().setFromSpherical(spherical);
    let extraYOffset = (spherical.radius - 15) * 0.2;
    let extraZOffset = (spherical.radius - 15) * 0.2;
    camera.position.set(
      rotationPoint.x + offset.x - 1,
      rotationPoint.y + offset.y + extraYOffset,
      rotationPoint.z + offset.z + extraZOffset,
    );
    camera.lookAt(rotationPoint);
  }
  initScene(); initCamera();
var canvas = document.createElement("canvas");
var gl = null;
if (window.WebGL2RenderingContext) {
  gl = canvas.getContext("webgl2");
}
if (!gl) {
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}
if (!gl) {
  throw new Error("WebGL not on system.");
}
renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas: canvas,
  context: gl
});
renderer.setPixelRatio(window.devicePixelRatio * 0.75);
document.querySelector('.game-column').appendChild(renderer.domElement);

  function handleResize() {
    let gameCol = document.querySelector('.game-column');
    if (renderer && renderer.domElement.parentNode !== gameCol) { gameCol.appendChild(renderer.domElement); }
    renderer.setSize(gameCol.clientWidth, gameCol.clientHeight);
    camera.aspect = gameCol.clientWidth / gameCol.clientHeight;
    camera.updateProjectionMatrix();
  }

  handleResize();
  window.addEventListener('resize', handleResize);
  renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
  renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored, false);
  ambientLight = new THREE.AmbientLight(0x404040);
  gameGroup.add(ambientLight);
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 50, 50);
  gameGroup.add(directionalLight);
  piecesGroup = new THREE.Group();
  gameGroup.add(piecesGroup);
  renderer.domElement.addEventListener('wheel', onMouseWheel, false);
  
  function getIntersectingPiece(e) {
    let rect = renderer.domElement.getBoundingClientRect();
    let m = new THREE.Vector2();
    m.x = ((e.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
    m.y = -((e.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(m, camera);
    let inter = raycaster.intersectObjects(piecesGroup.children, true);
    return inter.length > 0 ? inter[0].object : null;
  }
  
  function dropPiece() {
    if (isPaused) return;
    while (canMove(0, -1, 0)) { movePiece(0, -1, 0); }
    fixPiece();
  }
  function wallKick() {
    let adjustments = [];
    for (let delta = 1; delta <= 2; delta++) {
      let deltas = [-delta, 0, delta];
      for (let dx of deltas)
        for (let dy of deltas)
          for (let dz of deltas) {
            if (dx === 0 && dy === 0 && dz === 0) continue;
            adjustments.push({ x: dx, y: dy, z: dz, distance: Math.abs(dx) + Math.abs(dy) + Math.abs(dz) });
          }
    }
    adjustments.sort((a, b) => a.distance - b.distance);
    for (let adj of adjustments) {
      if (canMove(adj.x, adj.y, adj.z)) {
        currentPiece.forEach(block => { block.position.x += adj.x * blockSize; block.position.y += adj.y * blockSize; block.position.z += adj.z * blockSize; });
        return true;
      }
    }
    return false;
  }
//piece ids
let pieceIdCounter = 0;
function generateUniquePieceId() {
  return ++pieceIdCounter;
}

function createPiece() {
  if (isTopLayerFull()) { gameOver(); return; }
  let activeShapes = getActiveShapes();
  if (activeShapes.length === 0) activeShapes = tetrominoShapes;
  let shapeData = nextPieceShape || activeShapes[Math.floor(Math.random() * activeShapes.length)];
  nextPieceShape = activeShapes[Math.floor(Math.random() * activeShapes.length)];
  updateNextPiecePreview();
  let shape = shapeData.blocks;
  currentPieceShapeName = shapeData.name;
  currentPiece = [];
  let extraXOffset = 0;
  
  let currentPieceId = generateUniquePieceId();
  
  shape.forEach((pos, index) => {
    let geometry = new THREE.BoxGeometry(blockSize, blockSize , blockSize);
    let material = new THREE.MeshLambertMaterial({ color: shapeData.color, opacity: 0.2, transparent: true });
    let cube = new THREE.Mesh(geometry, material);
    let edgesGeometry = new THREE.EdgesGeometry(geometry);
    let edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true });
    let edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    
    let block = new THREE.Group();
   block.pieceId = currentPieceId;
   block.pieceBlockId = currentPieceId * 10 + (index + 1);
    
    block.add(cube);
    block.add(edges);
    block.position.set(
      (pos.x + extraXOffset) * blockSize,
      (gridHeight / 2 - 1) * blockSize + pos.y * blockSize,
      pos.z * blockSize
    );
    piecesGroup.add(block);
    currentPiece.push(block);
  });
  if (canMove(0, -1, 0)) {
    currentPiece.forEach(block => { block.position.y -= blockSize; });
    gameSpeed = Math.max(100, gameSpeed - 2);
  }
  updateProjectedPiece();
}

  function updateProjectedPiece() {
    projectedPiece.forEach(block => { 
      piecesGroup.remove(block); 
      disposeMesh(block); 
    });
    projectedPiece = [];
    if (!currentPiece) return;
    let landingPositions = currentPiece.map(block => block.position.clone());
    let canMoveDown = true;
    while (canMoveDown) {
      for (let pos of landingPositions) {
        let x = Math.round(pos.x / blockSize);
        let y = Math.floor(pos.y / blockSize) - 1;
        let z = Math.round(pos.z / blockSize);
        if (y < -gridHeight / 2 || grid[`${x},${y},${z}`]) { canMoveDown = false; break; }
      }
      if (canMoveDown) landingPositions.forEach(pos => pos.y -= blockSize);
    }
    currentPiece.forEach((block, index) => {
      let geometry = new THREE.BoxGeometry(blockSize - 0.02, blockSize - 0.02, blockSize - 0.02);
      let material = new THREE.MeshLambertMaterial({
        color: block.children[0].material.color.getHex(),
        opacity: 0.5,
        transparent: false
      });
      let cube = new THREE.Mesh(geometry, material);
      let edgesGeometry = new THREE.EdgesGeometry(geometry);
      let edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: false });
      let edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      let ghostBlock = new THREE.Group();
      ghostBlock.add(cube); ghostBlock.add(edges);
      ghostBlock.position.copy(landingPositions[index]);
      piecesGroup.add(ghostBlock); 
      projectedPiece.push(ghostBlock);
    });
  }
  function updateNextPiecePreview() {
    let container = document.getElementById('next-piece-container');
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    if (previewRenderer) { 
      previewRenderer.dispose();
      if (previewRenderer.domElement && container && previewRenderer.domElement.parentNode === container) 
        container.removeChild(previewRenderer.domElement);
      previewRenderer = null;
    }
    if (previewScene) { 
      disposeScene(previewScene);
      previewScene = null;
    }
    if (previewAnimationFrameId) { cancelAnimationFrame(previewAnimationFrameId); previewAnimationFrameId = null; }
    if (!nextPieceShape) return;
    previewScene = new THREE.Scene();
    let previewCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    previewCamera.position.set(3, 3, 5);
    previewCamera.lookAt(0, 0, 0);
    previewRenderer = new THREE.WebGLRenderer({ alpha: true });
    previewRenderer.setSize(100, 100);
    container.appendChild(previewRenderer.domElement);
    previewScene.add(new THREE.AmbientLight(0x404040));
    let dLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dLight.position.set(0, 10, 10);
    previewScene.add(dLight);
    nextPieceShape.blocks.forEach(pos => {
      let geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      let mat = new THREE.MeshLambertMaterial({ color: nextPieceShape.color });
      let cube = new THREE.Mesh(geom, mat);
      let edGeom = new THREE.EdgesGeometry(geom);
      let edMat = new THREE.LineBasicMaterial({ color: 0x000000 });
      let edges = new THREE.LineSegments(edGeom, edMat);
      let block = new THREE.Group();
      block.add(cube);
      block.add(edges);
      block.position.set(pos.x * 0.6, pos.y * 0.6, pos.z * 0.6);
      previewScene.add(block);
    });
    previewRenderer.render(previewScene, previewCamera);
  }
function movePiece(dx, dy, dz, autoDrop = false) {
  if (isPaused || isPieceMoving) return;
  isPieceMoving = true;

  lastTime = performance.now();

  if (canMove(dx, dy, dz)) {
    currentPiece.forEach(block => {
      block.position.x += dx * blockSize;
      block.position.y += dy * blockSize;
      block.position.z += dz * blockSize;
    });

     updateProjectedPiece();

    togglePieceEdgeColor();
  }

  isPieceMoving = false;
}
  function movePieceDiagonal(dx, dz) {
    if (isPaused) return;
    if (canMove(dx, 0, dz)) {
      currentPiece.forEach(block => {
        block.position.x += dx * blockSize;
        block.position.z += dz * blockSize;
      });
      
      updateProjectedPiece();       
      togglePieceEdgeColor();
    }
  }
  function togglePieceEdgeColor() {
    if (!currentPiece) return;
    edgeColorToggle = !edgeColorToggle;
    var newColor = edgeColorToggle ? 0xff0000 : 0x000000; 
    currentPiece.forEach(block => {
      block.children.forEach(child => {
        if (child instanceof THREE.LineSegments) {
          child.material.color.setHex(newColor);
        }
      });
    });
    projectedPiece.forEach(block => {
      block.children.forEach(child => {
        if (child instanceof THREE.LineSegments) {
          child.material.color.setHex(newColor);
        }
      });
    });
  }
  function canMove(dx, dy, dz) {
    if (!currentPiece) return false;
    return currentPiece.every(block => {
      let x = Math.round(block.position.x / blockSize) + dx;
      let y = Math.round(block.position.y / blockSize) + dy;
      let z = Math.round(block.position.z / blockSize) + dz;
      if (x < -gridWidth / 2 || x >= gridWidth / 2 || y < -gridHeight / 2 || y >= gridHeight / 2 || z < -gridDepth / 2 || z >= gridDepth / 2) return false;
      if (grid[`${x},${y},${z}`]) return false;
      return true;
    });
  }
  function rotatePiece(axis) {
    if (isPaused || !currentPiece) return;
   
    let invert = false;
    if (axis.startsWith('-')) {
      invert = true;
      axis = axis.substring(1); 
    }
    let pivot = currentPiece[0].position.clone();
    let angle = Math.PI / 2;
    if (invert) angle = -angle; 
    let matrix = new THREE.Matrix4();
    if (axis === 'x') {
      matrix.makeRotationX(angle);
    } else if (axis === 'y') {
      matrix.makeRotationY(angle);
    } else if (axis === 'z') {
      matrix.makeRotationZ(angle);
    }    
    currentPiece.forEach(block => {
      block.position.sub(pivot);
      block.position.applyMatrix4(matrix);
      block.position.add(pivot);
      block.position.x = Math.round(block.position.x / blockSize) * blockSize;
      block.position.y = Math.round(block.position.y / blockSize) * blockSize;
      block.position.z = Math.round(block.position.z / blockSize) * blockSize;
    });
    if (!canMove(0, 0, 0)) {
      if (!wallKick()) {
        matrix = new THREE.Matrix4();
        if (axis === 'x') {
          matrix.makeRotationX(-angle);
        } else if (axis === 'y') {
          matrix.makeRotationY(-angle);
        } else if (axis === 'z') {
          matrix.makeRotationZ(-angle);
        }
        currentPiece.forEach(block => {
          block.position.sub(pivot);
          block.position.applyMatrix4(matrix);
          block.position.add(pivot);
          block.position.x = Math.round(block.position.x / blockSize) * blockSize;
          block.position.y = Math.round(block.position.y / blockSize) * blockSize;
          block.position.z = Math.round(block.position.z / blockSize) * blockSize;
        });
     }
  }
  updateProjectedPiece();
}
  var unlockMessages = [];

  function updatePieceCounterBar() {
    var barFill = document.getElementById('pieceCounterFill');
    if (barFill) {
      var percentage = (fixPieceCount / fixPieceMax) * 100;
      barFill.style.width = percentage + '%';
      var barText = document.getElementById('pieceCounterText');
      if (barText) { 
        barText.innerText = "Pieces: " + fixPieceCount.toString() + "/" + fixPieceMax.toString(); 
      }
    }
}
function updateBaseGridColor() {
  let hue = (linesCleared * 0.05) % 1;
  let newColor = new THREE.Color();
  newColor.setHSL(hue, 1, 0.65);
  
  baseMaterial.color.copy(newColor);
  baseMaterial.transparent = true; 
  baseMaterial.opacity = 0.7;
  baseMaterial.depthWrite = false;
  
  if (base) {
    base.material.color.copy(newColor);
    base.material.transparent = true;
  }
  
  if (starGeometry) {
    const colors = starGeometry.getAttribute('color');
    for (let i = 0; i < colors.count; i++) {
      if (i % 10 === 0) {
        colors.setXYZ(i, newColor.r, newColor.g, newColor.b);
      }
    }
    colors.needsUpdate = true;
  }
updateGameSpeed(gameSpeed);
}
  
function fixPiece() {
  if (!currentPiece) return;
  currentPiece.forEach(block => {
    block.children.slice().forEach(child => {
      if (child instanceof THREE.LineSegments) {
        block.remove(child);
        disposeMesh(child);
      } else if (child instanceof THREE.Mesh) {
        if (child.material) {
          child.material.transparent = false;
          child.material.opacity = 1;
        }
      }
    });
    const edgeGeometry = new THREE.EdgesGeometry(block.children[0].geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    block.add(edgeLines);
    let x = Math.round(block.position.x / blockSize);
    let y = Math.floor(block.position.y / blockSize);
    let z = Math.round(block.position.z / blockSize);
    grid[`${x},${y},${z}`] = block;
  });
  let cleared = checkLayers();
  fixPieceCount += 1;
  if (cleared.layersClearedY > 0 || cleared.linesClearedX > 0 || cleared.linesClearedZ > 0 || cleared.perpendicularCleared > 0) {
    fixPieceCount -= (bonusPerClearedLine * (cleared.layersClearedY + cleared.linesClearedX + cleared.linesClearedZ + cleared.perpendicularCleared));
  }
  fixPieceCount = Math.max(0, Math.min(fixPieceCount, fixPieceMax));
  updatePieceCounterBar();
  if (fixPieceCount >= fixPieceMax || isTopLayerFull()) {
    gameOver();
    return;
  }
  applyScoring(cleared);
  updateBaseGridColor();
  checkScoreUnlocks();
  updateCameraPosition();
  projectedPiece.forEach(block => {
    piecesGroup.remove(block);
    disposeMesh(block);
  });
  projectedPiece = [];
  if (!isGameOver) createPiece();
  lastTime = 0;
  gameLoop();
}
//ShiftDown
function shiftDownRegion(startLayer, xMin, xMax, zMin, zMax) {
  for (let y = startLayer + 1; y < gridHeight / 2; y++) {
    for (let x = xMin; x <= xMax; x++) {
      for (let z = zMin; z <= zMax; z++) {
        const keyAbove = `${x},${y},${z}`;
        const blockAbove = grid[keyAbove];
        if (blockAbove) {
          blockAbove.position.y -= blockSize;
          const newX = Math.round(blockAbove.position.x / blockSize);
          const newY = Math.floor(blockAbove.position.y / blockSize);
          const newZ = Math.round(blockAbove.position.z / blockSize);
          const keyBelow = `${newX},${newY},${newZ}`;
          grid[keyBelow] = blockAbove;
          delete grid[keyAbove];
        }
      }
    }
  }
}
function shiftDownRegionForLineX(startLayer, candidateZ) {
  const zMin = Math.max(-gridDepth/2, candidateZ - 3);
  const zMax = Math.min(gridDepth/2 - 1, candidateZ + 3);
  const xMin = -gridWidth/2;
  const xMax = gridWidth/2 - 1;
  shiftDownRegion(startLayer, xMin, xMax, zMin, zMax);
}

function shiftDownRegionForLineZ(startLayer, candidateX) {
  const xMin = Math.max(-gridWidth/2, candidateX - 3);
  const xMax = Math.min(gridWidth/2 - 1, candidateX + 3);
  const zMin = -gridDepth/2;
  const zMax = gridDepth/2 - 1;
  shiftDownRegion(startLayer, xMin, xMax, zMin, zMax);
}
function removeLineX(y, z) {
  for (let x = -gridWidth/2; x < gridWidth/2; x++) {
    const key = `${x},${y},${z}`;
    if (grid[key]) {
      piecesGroup.remove(grid[key]);
      disposeMesh(grid[key]);
      delete grid[key];
      removedBlocks++;
    }
  }
  shiftDownRegionForLineX(y, z);
}
function removeLineZ(y, x) {
  for (let z = -gridDepth/2; z < gridDepth/2; z++) {
    const key = `${x},${y},${z}`;
    if (grid[key]) {
      piecesGroup.remove(grid[key]);
      disposeMesh(grid[key]);
      delete grid[key];
      removedBlocks++;
    }
  }
  shiftDownRegionForLineZ(y, x);
}
function shiftDownRegionForLineXZLimited(startLayer, candidateX, candidateZ, verticalLimit = 3) {
  const xMin = Math.max(-gridWidth/2, candidateX - 3);
  const xMax = Math.min(gridWidth/2 - 1, candidateX + 3);
  const zMin = Math.max(-gridDepth/2, candidateZ - 3);
  const zMax = Math.min(gridDepth/2 - 1, candidateZ + 3);
  const yMax = Math.min(gridHeight/2 - 1, startLayer + verticalLimit);  
  for (let y = startLayer + 1; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      for (let z = zMin; z <= zMax; z++) {
        const keyAbove = `${x},${y},${z}`;
        const blockAbove = grid[keyAbove];
        if (blockAbove) {
          blockAbove.position.y -= blockSize;
          const newX = Math.round(blockAbove.position.x / blockSize);
          const newY = Math.floor(blockAbove.position.y / blockSize);
          const newZ = Math.round(blockAbove.position.z / blockSize);
          const keyBelow = `${newX},${newY},${newZ}`;
          grid[keyBelow] = blockAbove;
          delete grid[keyAbove];
        }
      }
    }
  }
}
function shiftDownForLineXZRegion(startLayer, candidateX, candidateZ, verticalLimit) {
  const yMax = Math.min(gridHeight/2 - 1, startLayer + verticalLimit);
  for (let y = startLayer + 1; y <= yMax; y++) {
    for (let x = -gridWidth/2; x < gridWidth/2; x++) {
      for (let z = -gridDepth/2; z < gridDepth/2; z++) {
        if ((z >= candidateZ - 3 && z <= candidateZ + 3) || (x >= candidateX - 3 && x <= candidateX + 3)) {
          const keyAbove = `${x},${y},${z}`;
          const blockAbove = grid[keyAbove];
          if (blockAbove) {
            blockAbove.position.y -= blockSize;
            const newX = Math.round(blockAbove.position.x / blockSize);
            const newY = Math.floor(blockAbove.position.y / blockSize);
            const newZ = Math.round(blockAbove.position.z / blockSize);
            const keyBelow = `${newX},${newY},${newZ}`;
            grid[keyBelow] = blockAbove;
            delete grid[keyAbove];
          }
        }
      }
    }
  }
}
function removeLineXZ(y, candidateX, candidateZ) {
  let removedCount = 0;
  // Remove blocks along X at candidateZ.
  for (let x = -gridWidth/2; x < gridWidth/2; x++) {
    const key = `${x},${y},${candidateZ}`;
    if (grid[key]) {
      piecesGroup.remove(grid[key]);
      disposeMesh(grid[key]);
      delete grid[key];
      removedCount++;
    }
  }
   for (let z = -gridDepth/2; z < gridDepth/2; z++) {
    if (z === candidateZ) continue;
    const key = `${candidateX},${y},${z}`;
    if (grid[key]) {
      piecesGroup.remove(grid[key]);
      disposeMesh(grid[key]);
      delete grid[key];
      removedCount++;
    }
  }
  shiftDownForLineXZRegion(y, candidateX, candidateZ, 3);
  return removedCount;
}
function shiftDownAboveLayer(startLayer) {
  for (let y = startLayer + 1; y < gridHeight/2; y++) {
    for (let x = -gridWidth/2; x < gridWidth/2; x++) {
      for (let z = -gridDepth/2; z < gridDepth/2; z++) {
        const keyAbove = `${x},${y},${z}`;
        const blockAbove = grid[keyAbove];
        if (blockAbove) {
          blockAbove.position.y -= blockSize;
          const newX = Math.round(blockAbove.position.x / blockSize);
          const newY = Math.floor(blockAbove.position.y / blockSize);
          const newZ = Math.round(blockAbove.position.z / blockSize);
          const keyBelow = `${newX},${newY},${newZ}`;
          grid[keyBelow] = blockAbove;
          delete grid[keyAbove];
        }
      }
    }
  }
}
function checkLayersFromFixedPiece() {
  if (isPaused) return 0;
  let minY = Infinity;
  currentPiece.forEach(block => {
    let y = Math.round(block.position.y / blockSize);
    if (y < minY) minY = y;
  });
  minY = Math.max(-gridHeight/2, minY);
  let layersRemoved = 0;
  for (let y = minY; y < gridHeight/2; y++) {
    while (isLayerCompleteY(y)) {
      removeLayerY(y);
      layersRemoved++;
    }
  }
  return layersRemoved;
}
/**/
function checkLayers() {
  var perpendicularRemoved = gridDepth < 8 ? 0 : removePerpendicularXZ();
  var perpendicularCleared = perpendicularRemoved > 0 ? 1 : 0;  
  var layersClearedY = checkLayersY();
  var linesClearedX = checkLinesX();
  var linesClearedZ = gridDepth >= 8 ? checkLinesZ() : 0;
  return {
    perpendicularCleared: perpendicularCleared,
    layersClearedY: layersClearedY,
    linesClearedX: linesClearedX,
    linesClearedZ: linesClearedZ     
  };
}
function removePerpendicularXZ() {
  let totalCleared = 0;
  for (let y = -gridHeight/2; y < gridHeight/2; y++) {
    let completeXCandidates = [];
    for (let z = -gridDepth/2; z < gridDepth/2; z++) {
      if (isLineCompleteX(y, z)) completeXCandidates.push(z);
    }
    let completeZCandidates = [];
    if (gridDepth > 6) {
      for (let x = -gridWidth/2; x < gridWidth/2; x++) {
        if (isLineCompleteZ(y, x)) completeZCandidates.push(x);
      }
    }
    if (completeXCandidates.length > 0 && completeZCandidates.length > 0) {
      let candidateZ = completeXCandidates[0];
      let candidateX = completeZCandidates[0];
      totalCleared += removeLineXZ(y, candidateX, candidateZ);
    }
  }
  return totalCleared;
}
function checkLinesX() {
  var linesRemoved = 0;
  for (var y = -gridHeight/2; y < gridHeight/2; y++) {
    for (var z = -gridDepth/2; z < gridDepth/2; z++) {
      if (isLineCompleteX(y, z)) {
        removeLineX(y, z);
        z--;
        linesRemoved++;
      }
    }
  }
  return linesRemoved;
}
function isLineCompleteX(y, z) {
  for (var x = -gridWidth/2; x < gridWidth/2; x++) {
    if (!grid[`${x},${y},${z}`]) return false;
  }
  return true;
}
function checkLinesZ() {
  if (gridDepth <= 6) return 0;
  var linesRemoved = 0;
  for (var y = -gridHeight/2; y < gridHeight/2; y++) {
    for (var x = -gridWidth/2; x < gridWidth/2; x++) {
      if (isLineCompleteZ(y, x)) {
        removeLineZ(y, x);
        x--;
        linesRemoved++;
      }
    }
  }
  return linesRemoved;
}
function isLineCompleteZ(y, x) {
  for (var z = -gridDepth/2; z < gridDepth/2; z++) {
    if (!grid[`${x},${y},${z}`]) return false;
  }
  return true;
}
function isLayerCompleteY(y) {
  for (var x = -gridWidth/2; x < gridWidth/2; x++) {
    for (var z = -gridDepth/2; z < gridDepth/2; z++) {
      if (!grid[`${x},${y},${z}`]) return false;
    }
  }
  return true;
}
function removeLayerY(y) {
  for (var x = -gridWidth/2; x < gridWidth/2; x++) {
    for (var z = -gridDepth/2; z < gridDepth/2; z++) {
      var key = `${x},${y},${z}`;
      if (grid[key]) {
        piecesGroup.remove(grid[key]);
        disposeMesh(grid[key]);
        delete grid[key];
        removedBlocks++;
      }
    }
  }
  shiftDownAboveLayer(y);
}
function shiftDownAboveLayer(startLayer) {
  for (let y = startLayer + 1; y < gridHeight / 2; y++) {
    for (let x = -gridWidth / 2; x < gridWidth / 2; x++) {
      for (let z = -gridDepth / 2; z < gridDepth / 2; z++) {
        const keyAbove = `${x},${y},${z}`;
        const blockAbove = grid[keyAbove];
        if (blockAbove) {
          // Shift the block down by one block size.
          blockAbove.position.y -= blockSize;
          // Recalculate grid coordinates.
          const newX = Math.round(blockAbove.position.x / blockSize);
          const newY = Math.floor(blockAbove.position.y / blockSize);
          const newZ = Math.round(blockAbove.position.z / blockSize);
          const keyBelow = `${newX},${newY},${newZ}`;
          grid[keyBelow] = blockAbove;
          delete grid[keyAbove];
        }
      }
    }
  }
}
  function checkLayers() {
    var perpendicularRemoved = gridDepth < 8 ? 0 : removePerpendicularXZ();
    var perpendicularCleared = perpendicularRemoved > 0 ? 1 : 0;  
    var layersClearedY = checkLayersY();
    var linesClearedX = checkLinesX();
    var linesClearedZ = gridDepth >= 8 ? checkLinesZ() : 0;
    return {
      perpendicularCleared: perpendicularCleared,
      layersClearedY: layersClearedY,
      linesClearedX: linesClearedX,
      linesClearedZ: linesClearedZ     
    };
  }
function checkPerpendicularXZ() {
    var totalCleared = 0;
    for (var y = -gridHeight / 2; y < gridHeight / 2; y++) {
      var completeX = [];
      for (var z = -gridDepth / 2; z < gridDepth / 2; z++) {
        if (isLineCompleteX(y, z)) {
          completeX.push(z);
        }
      }
      var completeZ = [];
      if (gridDepth > 6) {
        for (var x = -gridWidth / 2; x < gridWidth / 2; x++) {
          if (isLineCompleteZ(y, x)) {
            completeZ.push(x);
          }
        }
      }
      if (completeX.length > 0 && completeZ.length > 0) {
        completeX.forEach(function(z) {
          removeLineX(y, z);
          totalCleared++;
        });
        completeZ.forEach(function(x) {
          removeLineZ(y, x);
          totalCleared++;
        });
      }
    }
    return totalCleared;
  }
  function isLineCompleteZ(y, x) {
    for (var z = -gridDepth / 2; z < gridDepth / 2; z++) {
      if (!grid[`${x},${y},${z}`]) {
        return false;
      }
    }
    return true;
  }
function checkLayersY() {
    var layersRemoved = 0;
    var layerCounts = new Array(gridHeight).fill(0);
    for (var key in grid) {
      if (grid.hasOwnProperty(key)) {
        var coords = key.split(',').map(Number);
        var layerIndex = coords[1] + gridHeight / 2;
        if (layerIndex >= 0 && layerIndex < gridHeight) {
          layerCounts[layerIndex]++;
        }
      }
    }
    for (var i = 0; i < layerCounts.length; i++) {
      if (layerCounts[i] === gridWidth * gridDepth) {
        removeLayerY(i - gridHeight / 2);
        layersRemoved++;
      }
    }
    return layersRemoved;
  }
/**/
  function isTopLayerFull() {
    var topLayerY = gridHeight / 2 - 1;
    for (var x = -gridWidth / 2; x < gridWidth / 2; x++) {
      for (var z = -gridDepth / 2; z < gridDepth / 2; z++) {
        if (grid[`${x},${topLayerY},${z}`]) {
          return true;
        }
      }
    }
    return false;
  } 
  
  function getHighestFilledY() {
    let highest = -gridHeight / 2 - 3;
    for (let key in grid) {
      let coords = key.split(',').map(Number);
      if (coords[1] > highest) highest = coords[1];
    }
    return highest;
  }
  //Cleaner
  function cleanupGameResources() {
    while (piecesGroup.children.length > 0) {
      let child = piecesGroup.children[0];
      piecesGroup.remove(child);
      disposeMesh(child);
    }
    for (let key in grid) {
      if (grid.hasOwnProperty(key)) {
        let block = grid[key];
        if (block) {
          piecesGroup.remove(block);
          disposeMesh(block);
        }
        delete grid[key];
      }
    }
    projectedPiece.forEach(function(block) {
      piecesGroup.remove(block);
      disposeMesh(block);
    });
    projectedPiece = [];
    let container = document.getElementById('next-piece-container');
    if (previewRenderer) {
      previewRenderer.dispose();
      if (previewRenderer.domElement && container && previewRenderer.domElement.parentNode === container) 
        container.removeChild(previewRenderer.domElement);
      previewRenderer = null;
    }
    if (previewScene) {
      disposeScene(previewScene);
      previewScene = null;
    }
    if (previewAnimationFrameId) { cancelAnimationFrame(previewAnimationFrameId); previewAnimationFrameId = null; }
  }
  function onContextLost(e) {
    e.preventDefault(); cancelAnimationFrame(animationFrameId); isPaused = true; updatePauseButtons();
    document.getElementById('game-paused').style.display = 'block'; renderer.forceContextLoss();
  }
  function onContextRestored(e) {
    reinitializeWebGLResources(); isPaused = false; lastTime = 0; gameLoop();
    document.getElementById('game-paused').style.display = 'none';
  }
  function reinitializeWebGLResources() {
    disposeScene(scene);
    if (renderer) {
      renderer.dispose();
    }
    initScene();
    initCamera();
    handleResize();
    restartGame();
  }
  function disposeScene(obj) {
    if (!obj) return;
    for (let i = obj.children.length - 1; i >= 0; i--) {
      disposeScene(obj.children[i]); obj.remove(obj.children[i]);
    }
    if (obj.geometry) { obj.geometry.dispose(); obj.geometry = null; }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => { if(m.dispose) m.dispose(); });
      } else {
        obj.material.dispose();
      }
      obj.material = null;
    }
  }
  //Initr
function pauseGame() {
    isPaused = true;   
    const pauseOverlay = document.getElementById('game-paused');
    if (pauseOverlay) {
        pauseOverlay.style.display = 'block';
    }
    const music = document.getElementById('backgroundMusic');
    if (music && !music.paused) {
        music.pause();
    }
  chordGenerator.stop();
}
function resumeGame() {
    isPaused = false;
    const pauseOverlay = document.getElementById('game-paused');
    if (pauseOverlay) {
        pauseOverlay.style.display = 'none';
    }
    lastTime = 0; 
   if (chordGenerator && !chordGenerator.isPlaying) {
    chordGenerator.start();
  }
  
}   
function restartGame() {
  cancelAnimationFrame(animationFrameId);
 if (typeof cleanupGameResources === 'function') {
    cleanupGameResources();
  }
  pieceIdCounter = 0; 
  fixPieceCount = 0; 
  gameSpeed = 600;   
  updateGameSpeed(gameSpeed); 
  if (starfieldGroup) {
    starfieldGroup.rotation.y = 0;
  }    
  tetrominoShapes.forEach(shape => { 
    if (["E-Shape", "H-Shape", "Z-Shape", "X-Shape"].includes(shape.name)) {
      shape.active = false; 
    }    
  });
  
  grid = {}; 
  score = 0; 
  isGameOver = false; 
  isPaused = false; 
  gameStarted = true;
  removedBlocks = 0;
  linesCleared = 0;
  
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('game-paused').style.display = 'none';
  document.getElementById('scoreboard').innerText = '0';
  document.getElementById('gameSpeedFill').style.width = "0%";
  
  updateVariableInfo();
  updatePieceCounterBar();  
  while (piecesGroup.children.length > 0) {
    let child = piecesGroup.children[0];
    piecesGroup.remove(child);
    disposeMesh(child);
  }  
  projectedPiece.forEach(block => { 
    piecesGroup.remove(block); 
    disposeMesh(block); 
  });
  projectedPiece = []; 
  currentPiece = null;
  nextPieceShape = null;
  lastTime = 0; 
  if (!isGameOver) {
    createPiece();
  }
  gameLoop();
}
  
  function initScene() {
    scene = new THREE.Scene();
    gameGroup = new THREE.Group();
    scene.add(gameGroup);
    let amb = new THREE.AmbientLight(0x404040);
    gameGroup.add(amb);
    let dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(0, 50, 50);
    gameGroup.add(dir);
    piecesGroup = new THREE.Group();
    gameGroup.add(piecesGroup);
    recreateGrid();
    updateRotationPoint();
    initStarfield();
  }
  function initStarfield() {
    starfieldGroup = new THREE.Group();
    const starCount = 1000;
    starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const range = 200;
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * range;
      positions[i * 3 + 1] = (Math.random() - 0.5) * range;
      positions[i * 3 + 2] = (Math.random() - 0.5) * range;
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    let starMat = new THREE.PointsMaterial({ size: 0.7, vertexColors: true, transparent: true, opacity: 0.8 });
    let stars = new THREE.Points(starGeometry, starMat);
    starfieldGroup.add(stars); starfieldGroup.position.set(0, 0, 0);
    gameGroup.add(starfieldGroup);
  }
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(rotationPoint.x + 25, rotationPoint.y + 35, rotationPoint.z + 45);
    camera.lookAt(rotationPoint);
    let offset = camera.position.clone().sub(rotationPoint);
    spherical.setFromVector3(offset);
  }
function recreateGrid() {
    baseGeometry = new THREE.PlaneGeometry(gridWidth * blockSize, gridDepth * blockSize);
    base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = Math.PI / 2;
    base.position.set(-blockSize / 2, (-gridHeight / 2 * blockSize) - blockSize / 2, -blockSize / 2);
    gameGroup.add(base);
    gridHelper = new THREE.GridHelper(gridWidth * blockSize, gridWidth);
    gridHelper.rotation.x = 0;
    gridHelper.position.set(-blockSize / 2, (-gridHeight / 2 * blockSize) - blockSize / 2 + 0.01, -blockSize / 2);
    gameGroup.add(gridHelper);
    gridEdgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(gridWidth * blockSize, gridHeight * blockSize, gridDepth * blockSize));
    gridEdges = new THREE.LineSegments(gridEdgesGeometry, gridEdgesMaterial);
    gridEdges.position.set(-blockSize / 2, -blockSize / 2, -blockSize / 2);
    gameGroup.add(gridEdges);
  }
function gameLoop(time) {
  if (isGameOver) return;
  animationFrameId = requestAnimationFrame(gameLoop);
  if (!lastTime) lastTime = time;
  if (time - lastTime > gameSpeed) {
    lastTime = time;
    if (canMove(0, -1, 0))
      movePiece(0, -1, 0, true);  
    else
      fixPiece();
  }
  if (!isPaused) {
      if (!lastTime) lastTime = time;
      if (time - lastTime > gameSpeed) {
        lastTime = time;
        if (canMove(0, -1, 0)) {
          movePiece(0, -1, 0);
        } else {
          fixPiece();
        }
      }
      if (starfieldGroup) {
        starfieldGroup.rotation.y += starfieldRotationRate;
      }
    }    
    updateCameraPosition();
    updateVariableInfo();
    renderer.render(scene, camera);
  }  
  //score
function getCurrentHighScore() {
    let hsKey = "highscores_depth_" + gridDepth;
    let hsList = JSON.parse(localStorage.getItem(hsKey)) || [];
    return hsList.length > 0 ? hsList[0].score : 0;
  }
function gameOver() {
    isGameOver = true;
    document.getElementById('game-over').style.display = 'flex';
    if (currentPiece) {
      currentPiece.forEach(block => { piecesGroup.remove(block); disposeMesh(block); });
      currentPiece = null;
    }
    projectedPiece.forEach(block => { piecesGroup.remove(block); disposeMesh(block); });
    recordHighScore(); projectedPiece = [];
    if (!isGameOver) createPiece();
    lastTime = 0; gameLoop();
  chordGenerator.stop(); 
  } 
  function checkScoreUnlocks() {
      var unlockedShapes = [];
      tetrominoShapes.forEach(shape => {
        if (!shape.active && !shape.unlockedNotified) {
          if (shape.name === 'E-Shape' && score > 600) { 
            shape.active = true; 
            shape.unlockedNotified = true; 
            gameSpeed += 100; 
            unlockedShapes.push({shape: shape, bonus: 100});
          }
          if (shape.name === 'H-Shape' && score > 16000) { 
            shape.active = true; 
            shape.unlockedNotified = true; 
            gameSpeed += 130; 
            unlockedShapes.push({shape: shape, bonus: 130});
          }
          if (shape.name === 'Z-Shape' && score > 26000) { 
            shape.active = true; 
            shape.unlockedNotified = true; 
            gameSpeed += 160; 
            unlockedShapes.push({shape: shape, bonus: 160});
          }
          if (shape.name === 'X-Shape' && score > 36000) { 
            shape.active = true; 
            shape.unlockedNotified = true; 
            gameSpeed += 200; 
            unlockedShapes.push({shape: shape, bonus: 200});
          }
        }
      });
      if (unlockedShapes.length > 0) {
        unlockedShapes.forEach(item => {
          let utterance = new SpeechSynthesisUtterance(item.shape.name + " unlocked!");
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
        });
        var gridMsg = "Clear Grid?";
        var message = unlockedShapes.map(item => item.shape.name + " unlocked!").join("<br>") + "<br><br>" + gridMsg;
        showUnlockShapeConfirmation(message, function(){
          cleanupGameResources();
          recreateGrid();
          createPiece();
        }, function(){
          unlockedShapes.forEach(function(item) {
           });
        });
      }
    }
    function showUnlockShapeConfirmation(message, onConfirm, onDecline) {
      isPaused = true; 
      var modal = document.getElementById('unlock-message');
      if (!modal) return;
      modal.innerHTML = '<h2> </h2><p>' + message + '</p>' +
        '<div class="unlock-buttons" style="margin-top:20px;">' +
          '<button id="unlockYes" class="settings-action-button" style="margin-right:10px;"><i class="fa-solid fa-check"></i> </button>' +
          '<button id="unlockNo" class="settings-action-button"><i class="fa-solid fa-times"></i> </button>' +
        '</div>';
      modal.classList.add('modal-zoom-in');
      modal.style.display = 'block';
      function cleanUp() {
        modal.style.display = 'none';
        modal.classList.remove('modal-zoom-in');
        document.removeEventListener('keydown', keyHandler);
      }       document.getElementById('unlockYes').addEventListener('click', function() {
        cleanUp();
        if (onConfirm) onConfirm();
        isPaused = false; 
      });
document.getElementById('unlockNo').addEventListener('click', function() {
        cleanUp();
        if (onDecline) onDecline();
        isPaused = false;
      });     
      function keyHandler(e) {
        if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
          cleanUp();
          if (onConfirm) onConfirm();
          isPaused = false;
        } else if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
          cleanUp();
          if (onDecline) onDecline();
          isPaused = false;
        }
      }
      document.addEventListener('keydown', keyHandler);
    }
    function showScorePointNotification(message) {
      var modal = document.getElementById('score-point-message');
      if (!modal) return;
      modal.innerHTML = '<p>' + message + '</p>';
      modal.classList.add('modal-zoom-in');
      modal.style.display = 'block';
      setTimeout(function(){
        modal.style.display = 'none';
        modal.classList.remove('modal-zoom-in');
      }, 2000);
    }
function recordHighScore() {
  if (score === 0) return;
  let hsKey = "highscores_depth_" + gridDepth;
  let hsList = JSON.parse(localStorage.getItem(hsKey)) || [];
  hsList.sort((a, b) => b.score - a.score);
  if (hsList.length < 10 || score > hsList[hsList.length - 1].score) {
    let infoEl = document.getElementById('multiplayer-info');
    let defaultName = infoEl.textContent.trim() || "Player";
    let defaultAvatar = infoEl.querySelector('img')?.src || "defaultAvatar.png";
    
    showModal({
      title: "New High Score!",
      message: "Enter your name:",
      input: true,
      defaultValue: defaultName,
      callback: (name) => {
        name = name.trim() || "Anonymous";
        // Include the avatar in the high score entry
        hsList.push({ name: name, score: score, avatar: defaultAvatar });
        hsList.sort((a, b) => b.score - a.score).splice(10);
        localStorage.setItem(hsKey, JSON.stringify(hsList));
        updateHighScoreDisplay();
        
        // Call high score speech announcement here:
        if (soundManager && typeof soundManager.playHighScoreMessage === 'function') {
          soundManager.playHighScoreMessage(score);
        }
      },
      restoreGameOver: true 
    });
    
    // You can still call your generic voice message concurrently if desired:
    if (soundManager && typeof soundManager.playVoiceMessage === 'function') {
      soundManager.playVoiceMessage(`Yeahh ${defaultName}, you did it`);
    }
  }
}

function showModal(opts) {
  const gameOverElem = document.getElementById('game-over');
  if (gameOverElem) {
    gameOverElem.style.display = 'none';
  }
  window.modalActive = true;
  const box = document.getElementById('message-box');
  if (!box) return;
  let html = '';
  if (opts.title) { html += `<h2>${opts.title}</h2>`; }
  if (opts.input) {
    html += `<label for="modal-input" style="display:block; margin-bottom:5px; color:#fff; font-size:18px;">${opts.inputLabel || " "}</label>`;
    html += `<input type="text" id="modal-input" value="${opts.defaultValue || ''}" style="width: 80%; font-size:18px; padding:10px; margin-bottom:10px;" />`;
  }
  if (opts.message) { html += `<p style="color:#fff; font-size:16px;">${opts.message}</p>`; }
  html += `<button id="modal-ok-btn" class="modal-btn" style="padding:10px 20px; font-size:18px; cursor:pointer;">OK</button>`;
  box.innerHTML = html;
  box.style.display = 'block';
  if (opts.input) {
    setTimeout(() => {
      const input = document.getElementById('modal-input');
      if (input) {
        input.focus();
        input.addEventListener('keydown', function(e) {
          if (e.key === "Enter") {
            document.getElementById('modal-ok-btn').click();
          }
        });
      }
    }, 100);
  }
  document.getElementById('modal-ok-btn').addEventListener('click', function() {
    const value = opts.input ? document.getElementById('modal-input').value.trim() : '';
    box.style.display = 'none';
    window.modalActive = false;
    if (opts.restoreGameOver && gameOverElem) {
      gameOverElem.style.display = 'block';
    }
    if (opts.callback) {
      opts.callback(value);
    }
  });
}
function updateHighScoreDisplay() {
  let hsKey = "highscores_depth_" + gridDepth;
  let hsList = JSON.parse(localStorage.getItem(hsKey)) || [];

  let highScoreListEl = document.getElementById('highScoreList');
  highScoreListEl.innerHTML = hsList.length === 0 ? "<li>No high scores yet!</li>" : "";
  if (hsList.length > 0) {
    highScoreListEl.innerHTML = "";
    hsList.forEach((entry, i) => {
      let li = document.createElement('li');
      if (entry.avatar) {
  let img = document.createElement('img');
  img.src = entry.avatar;
  img.alt = "avatar";
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.borderRadius = "50%";  // This makes the image round
  img.style.verticalAlign = "middle";
  img.style.marginRight = "5px";
  li.appendChild(img);
}

      // Append the text with the rank, name, and score
      let textNode = document.createTextNode((i + 1) + ". " + entry.name + " - " + entry.score);
      li.appendChild(textNode);
      
      highScoreListEl.appendChild(li);
    });
  }
  
  // If you have another element that should mirror this list, update it too.
  let logEl = document.getElementById('logHighScoreList');
  if (logEl) logEl.innerHTML = highScoreListEl.innerHTML;
}

updateHighScoreDisplay();
document.getElementById('gridDepthControl').addEventListener('input', function () {
  document.getElementById('gridDepthValue').textContent = this.value; 
  updateHighScoreDisplay();
});

  function updateScore(points) {
      score += points;
      document.getElementById('scoreboard').innerText = ' ' + score;
      
    } 
let bonusRewardApplied = false;

function applyScoring(cleared) {  
  if (bonusChallengeActive) {
    let condMet = false;
    switch (currentBonusChallenge.description) {
      case "Clear 1 horizontal line":
        condMet = (cleared.linesClearedX >= 1 && cleared.linesClearedZ === 0);
        break;
      case "Clear 1 vertical line":
        condMet = (cleared.linesClearedZ >= 1 && cleared.linesClearedX === 0);
        break;
      case "Clear 2 horizontal lines":
        condMet = (cleared.linesClearedX >= 2);
        break;
      case "Clear 2 vertical lines":
        condMet = (cleared.linesClearedZ >= 2);
        break;
      case "Clear 2 parallel lines":
        condMet = (cleared.linesClearedX >= 2 || cleared.linesClearedZ >= 2);
        break;
      case "Clear 2 perpendicular lines":
        condMet = (cleared.linesClearedX >= 1 && cleared.linesClearedZ >= 1);
        break;
      default:
        break;
    }
    if (condMet) {     
      bonusRewardApplied = true;      
      clearTimeout(bonusChallengeTimerId);
      hideBonusChallengeMessage();
      bonusChallengeActive = false;
    }
  } else if (
    (linesCleared % 3 === 0) &&
    linesCleared !== 0 &&
    linesCleared !== lastBonusTriggered
  ) {
    triggerRandomBonusChallenge();
    lastBonusTriggered = linesCleared;
  }
  let effectiveMultiplier = bonusRewardApplied ? currentBonusChallenge.reward : 1;  
  let totalCleared =
    cleared.layersClearedY +
    cleared.linesClearedX +
    cleared.linesClearedZ +
    (cleared.perpendicularCleared * 2);
  totalCleared = Math.min(totalCleared, 12);
  var scoreMap = {
    1: 100,
    2: 300,
    3: 500,
    4: 1000,
    5: 1500,
    6: 2000,
    7: 4000,
    8: 5000,
    9: 5000,
    10: 6000,
    11: 8000,
    12: 10000,
  };  
  let points = (scoreMap[totalCleared] * effectiveMultiplier) || 0;
  gameSpeed = Math.max(100, gameSpeed - (10 * totalCleared));
  if (totalCleared > 0) {
    soundManager.playScoreSound(points);
    showScorePointNotification("+" + points + " points!");
    soundManager.playLineClearSound();
  }  
  updateScore(points);
  linesCleared += totalCleared; 
  if (bonusRewardApplied) {   soundManager.playBonusReward(currentBonusChallenge.reward);
    bonusRewardApplied = false;
  }
}

const bonusChallengeOptions = [
  "Clear 1 horizontal line",
  "Clear 1 vertical line",
  "Clear 2 horizontal lines",
  "Clear 2 vertical lines",
  "Clear 2 parallel lines",
  "Clear 2 perpendicular lines",
];
const bonusRewardOptions = [5, 10, 15];
const bonusTimeOptions = [30, 35, 20, 25];
let currentBonusChallenge = { description: "", reward: 2, duration: 30 };
let activeScoreMultiplier = 1;
let lastBonusTriggered = 0;
let bonusChallengeActive = false;
let bonusChallengeDuration = 20000;
let bonusChallengeTimerId = null;
let bonusChallengeCountdownInterval = null;

function showBonusChallengeMessage() {
  let elem = document.getElementById("bonus-challenge-msg");
  if (!elem) {
    elem = document.createElement("div");
    elem.id = "bonus-challenge-msg";
    elem.className = "bonus-challenge";
    document.body.appendChild(elem);
  }
  elem.style.display = "block";
}

function hideBonusChallengeMessage() {
  let elem = document.getElementById("bonus-challenge-msg");
  if (elem) {
    elem.style.display = "none";
  }
  if (bonusChallengeCountdownInterval) {
    clearInterval(bonusChallengeCountdownInterval);
    bonusChallengeCountdownInterval = null;
  }
}

function triggerRandomBonusChallenge() {
  bonusChallengeActive = true;
  let challenge = bonusChallengeOptions[Math.floor(Math.random() * bonusChallengeOptions.length)];
  let reward = bonusRewardOptions[Math.floor(Math.random() * bonusRewardOptions.length)];
  let time = bonusTimeOptions[Math.floor(Math.random() * bonusTimeOptions.length)];
  currentBonusChallenge.description = challenge;
  currentBonusChallenge.reward = reward;
  currentBonusChallenge.duration = time;
  let elem = document.getElementById("bonus-challenge-msg");
  if (!elem) {
    elem = document.createElement("div");
    elem.id = "bonus-challenge-msg";
    elem.className = "bonus-challenge";
    document.body.appendChild(elem);
  }
  elem.innerHTML = `Bonus Challenge: ${challenge} within <span id='bonus-challenge-countdown'>${time}</span> seconds to get Score x${reward} bonus!`;
  elem.style.display = "block";
  let countdownElem = document.getElementById("bonus-challenge-countdown");
  let timeLeft = time;
  countdownElem.textContent = timeLeft;
  bonusChallengeCountdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(bonusChallengeCountdownInterval);
      bonusChallengeCountdownInterval = null;
    } else {
      countdownElem.textContent = timeLeft;
    }
  }, 1000);
  bonusChallengeTimerId = setTimeout(() => {
    hideBonusChallengeMessage();
    bonusChallengeActive = false;
  }, time * 1000);
}
function triggerBonusReward() { 
  clearTimeout(bonusChallengeTimerId);
  hideBonusChallengeMessage();
  bonusChallengeActive = false;
}
function updateBonusDisplay(bonusElem, remainingSeconds) {
  const countdownElem = bonusElem.querySelector('.bonus-countdown');
  if (countdownElem) {
    countdownElem.textContent = remainingSeconds;
  }
}
  
//var
function updateVariableInfo() {          
           
      var gsFill = document.getElementById('gameSpeedFill');
      if (gsFill) {
        var percentage = ((600 - gameSpeed) / 500) * 100;
        gsFill.style.width = percentage + "%";
        var gsText = document.getElementById('gameSpeedText');
        if (gsText) { 
          gsText.innerText = "Speed: " + gameSpeed.toString();
        } 
      }  
      updateGridProgressBar();
      updateHighScoreBar();     
    }
function updateGridProgressBar() {
      var barFill = document.getElementById('gridProgressFill');
      if (!barFill) return;
      var minY = -gridHeight / 2, maxY = gridHeight / 2;
      var highest = getHighestFilledY();
      highest = Math.max(minY, Math.min(maxY, highest));
      var percentage = ((highest - minY) / (maxY - minY)) * 100;
      barFill.style.width = percentage + "%";
      var barText = document.getElementById('gridProgressText');
      if (barText) { barText.innerText = "Grid: " + Math.round(percentage) + "%"; }
    }
    function updateHighScoreBar() {
      var barFill = document.getElementById('highScoreFill');
      if (!barFill) return;
      var highScore = getCurrentHighScore();
      var percentage = (highScore > 0) ? (score / highScore) * 100 : 0;
      percentage = Math.min(100, percentage);
      barFill.style.width = percentage + "%";
      var barText = document.getElementById('highScoreText');
      if (barText) { barText.innerText = "High: " + score + " / " + highScore; }
    }
   //tuto
    var pauseButtons = document.querySelectorAll('.pauseButton');
    function updatePauseButtons() { pauseButtons.forEach(btn => { btn.innerHTML = isPaused ? '&#5125;' : '&#10073;&#10073;'; }); }
    pauseButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!isPaused) {
      pauseGame();
    } else {
      resumeGame();
    }
    updatePauseButtons();
  });
})
    Array.from(document.getElementsByName('difficulty')).forEach(radio => {
      radio.addEventListener('change', () => { setGameDifficulty(parseFloat(radio.value)); if (radio.checked) {
setGameDifficulty(parseFloat(radio.value));
      } });
    });
     function setGameDifficulty(multiplier) {
   // Validate the multiplier value
    if (isNaN(multiplier) || multiplier <= 0) {
      console.error('Invalid difficulty multiplier:', multiplier);
      return;
    }
   gameSpeedBase = 600 / multiplier;
    gameSpeed = gameSpeedBase;
    updateGameSpeed(gameSpeed);   
    
  }    document.getElementById('settingsButton').addEventListener('click', () => {
      document.getElementById('tutorial-screen').style.display = 'block';
      isPaused = true; updatePauseButtons();
      document.getElementById('game-paused').style.display = 'block';
    });    document.getElementById('settingsTableButton').addEventListener('click', () => {
      document.getElementById('tutorial-screen').style.display = 'block';
      isPaused = true; updatePauseButtons();
      document.getElementById('game-paused').style.display = 'block';
    });    document.getElementById('closeTutorialButton').addEventListener('click', () => {
  document.getElementById('tutorial-screen').style.display = 'none';   
  resumeGame();
  updatePauseButtons();
  updateNextPiecePreview();
});    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.addEventListener('mousedown', function (e) {
      if (!gameStarted || isPaused) return;
      if (e.button === 0) {
        selectedPiece = getIntersectingPiece(e);
        if (selectedPiece) {
          isDragging = true;
          mouseStartX = e.clientX; mouseStartY = e.clientY;
          FlashSelected(selectedPiece);
        }
      }
    });
    document.addEventListener('mousemove', function(e) {
      if (!gameStarted || !isDragging || !selectedPiece || isPaused) return;
      let deltaX = e.clientX - mouseStartX;
      let deltaY = e.clientY - mouseStartY;
      const threshold = 10; if (Math.abs(deltaX) >= threshold && Math.abs(deltaY) >= threshold) {
        movePieceDiagonal(deltaX > 0 ? 1 : -1, deltaY > 0 ? 1 : -1);
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
      } else {
        if (Math.abs(deltaX) >= threshold) {
          movePiece(deltaX > 0 ? 1 : -1, 0, 0);
          mouseStartX = e.clientX;
        }
        if (Math.abs(deltaY) >= threshold) {
          movePiece(0, 0, deltaY > 0 ? 1 : -1);
          mouseStartY = e.clientY;
        }
      }
    });
    function initTutorialTabs() {
      let tabs = document.querySelectorAll('#tutorial-tabs .tutorial-tab'),
        contents = document.querySelectorAll('.tutorial-tab-content');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          let target = document.getElementById('tutorial-' + tab.getAttribute('data-tab'));
          if (target) target.classList.add('active');
        });
      });
    }
    initTutorialTabs();
    updateNextPiecePreview();
let isPieceBeingMoved = false;

function onPieceDragStart(event) {
  isPieceBeingMoved = true;
  soundManager.playMoveSound();
}
function onPieceDragEnd(event) {
  isPieceBeingMoved = false;
}
document.addEventListener('mousedown', function(e) {
  e.preventDefault();
  if (e.button === 0) {
    let m = new THREE.Vector2();
    m.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
    m.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(m, camera);
    let intersections = raycaster.intersectObjects(piecesGroup.children, true);
    
    if (intersections.length > 0) {
      onPieceDragStart(e);
      FlashSelected(intersections[0].object);
    }
  }
});
document.addEventListener('mouseup', function(e) {
  if (isPieceBeingMoved) {
    onPieceDragEnd(e);
  }
});
renderer.domElement.addEventListener('mousemove', function(e) {
  if (isPieceBeingMoved) {
    soundManager.playMoveSound();
  }
});
  
  function handleResize() {
      let gameCol = document.querySelector('.game-column');
      if (renderer.domElement.parentNode !== gameCol) gameCol.appendChild(renderer.domElement);
      renderer.setSize(gameCol.clientWidth, gameCol.clientHeight);
      camera.aspect = gameCol.clientWidth / gameCol.clientHeight;
      camera.updateProjectionMatrix();
    }
    handleResize();
    window.addEventListener('resize', handleResize);
  // Add this event listener to your renderer's DOM element (e.g., your Three.js canvas)
renderer.domElement.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // Prevent default context menu
  
  // Determine axis: Shift -> 'y', Ctrl -> 'z', otherwise 'x'
  let axis = 'x';
  if (event.shiftKey) {
    axis = 'y';
  } else if (event.ctrlKey) {
    axis = 'z';
  }
  
  // This call now uses the throttled version of playRotateSound
  soundManager.playRotateSound(axis);
});

    renderer.domElement.addEventListener('touchmove', e => { e.preventDefault(); }, false);
    renderer.domElement.addEventListener('touchend', e => { e.preventDefault(); }, false);
    renderer.domElement.addEventListener('touchstart', onTouchStart, false);
    renderer.domElement.addEventListener('touchmove', onTouchMove, false);
    renderer.domElement.addEventListener('touchend', onTouchEnd, false);
    var isRotatingGrid = false, rotateStartX = 0, rotateStartY = 0;
    let rotateControl = document.getElementById('rotate-control');
    rotateControl.addEventListener('mousedown', e => { 
      e.preventDefault(); 
      isRotatingGrid = true; 
      rotateStartX = e.clientX; 
      rotateStartY = e.clientY; 
      rotateControl.classList.add('active'); 
    });
    rotateControl.addEventListener('touchstart', e => { 
      e.preventDefault(); 
      if (e.touches.length == 1) { 
        isRotatingGrid = true; 
        rotateStartX = e.touches[0].clientX; 
        rotateStartY = e.touches[0].clientY; 
        rotateControl.classList.add('active'); 
      } 
    });
    document.addEventListener('mousemove', function(e) {
      if (isRotatingGrid) {
        let deltaX = e.clientX - rotateStartX;
        let deltaY = e.clientY - rotateStartY;
        spherical.theta -= deltaX * rotateSpeed * 0.005;
        spherical.phi -= deltaY * rotateSpeed * 0.005;
        const EPS = 0.000001;
        spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.phi));
        let offset = new THREE.Vector3().setFromSpherical(spherical);
        camera.position.copy(rotationPoint).add(offset);
        camera.lookAt(rotationPoint);
        rotateStartX = e.clientX;
        rotateStartY = e.clientY;
      }
    });

    document.addEventListener('touchmove', function(e) {
      if (isRotatingGrid && e.touches.length === 1) {
        let touch = e.touches[0];
        let deltaX = touch.clientX - rotateStartX;
        let deltaY = touch.clientY - rotateStartY;
        spherical.theta -= deltaX * rotateSpeed * 0.005;
        spherical.phi -= deltaY * rotateSpeed * 0.005;
        const EPS = 0.000001;
        spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.phi));
        let offset = new THREE.Vector3().setFromSpherical(spherical);
        camera.position.copy(rotationPoint).add(offset);
        camera.lookAt(rotationPoint);
        rotateStartX = touch.clientX;
        rotateStartY = touch.clientY;
        e.preventDefault();
      }
    }, { passive: false });
    document.addEventListener('mouseup', e => { 
      if (isRotatingGrid) { 
        isRotatingGrid = false; 
        rotateControl.classList.remove('active'); 
      } 
    });
    document.addEventListener('touchend', e => { 
      if (isRotatingGrid) { 
        isRotatingGrid = false; 
        rotateControl.classList.remove('active'); 
      } 
    });
document.getElementById('settingsRestartButton')?.addEventListener('click', restartGame);
    document.getElementById('tutorialRestartButton').addEventListener('click', () => { document.getElementById('tutorial-screen').style.display = 'none'; restartGame(); });
    restartGame();

    let pressedKeys = {};
    function onDocumentMouseDown(e) {
      e.preventDefault();
      if (e.button === 0) {
        let m = new THREE.Vector2();
        m.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
        m.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
        let r = new THREE.Raycaster();
        r.setFromCamera(m, camera);
        let inter = r.intersectObjects(piecesGroup.children, true);
        if (inter.length > 0) { FlashSelected(inter[0].object); }
      } else if (e.button === 2) {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function () {
          if (clickCount === 1) rotatePiece('z');
          else if (clickCount === 2) rotatePiece('y');
          else if (clickCount === 3) rotatePiece('x');
          clickCount = 0;
        }, 300);
      } else if (e.button === 1) {
        isRotating = true;
        startX = e.clientX; startY = e.clientY;
        let offset = camera.position.clone().sub(rotationPoint);
        spherical.setFromVector3(offset);
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
      }
    }
    function onMouseMove(e) {
      if (isRotating) {
        let deltaX = e.clientX - startX, deltaY = e.clientY - startY;
        spherical.theta -= deltaX * rotateSpeed * 0.005;
        spherical.phi -= deltaY * rotateSpeed * 0.005;
        let EPS = 0.000001;
        spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.phi));
        let offset = new THREE.Vector3().setFromSpherical(spherical);
        camera.position.copy(rotationPoint).add(offset);
        camera.lookAt(rotationPoint);
        startX = e.clientX; startY = e.clientY;
      }
    }
    function onMouseUp(e) {
      if (e.button === 1) {
        isRotating = false;
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
      }
    }
    zoomControl.addEventListener('mousedown', function (e) { e.preventDefault(); isZooming = true; startY = e.clientY; zoomControl.classList.add('active'); });
    zoomControl.addEventListener('touchstart', function (e) { e.preventDefault(); isZooming = true; startY = e.touches[0].clientY; zoomControl.classList.add('active'); });
    document.addEventListener('mousemove', function (e) {
      if (isZooming) {
        let deltaY = e.clientY - startY;
        spherical.radius += deltaY * 0.05;
        spherical.radius = Math.max(5, Math.min(100, spherical.radius));
        let offset = new THREE.Vector3().setFromSpherical(spherical);
        camera.position.copy(rotationPoint).add(offset);
        camera.lookAt(rotationPoint);
        startY = e.clientY;
      }
    });
    document.addEventListener('touchmove', function (e) {
      if (isZooming && e.touches.length == 1) {
        let deltaY = e.touches[0].clientY - startY;
        spherical.radius += deltaY * 0.05;
        spherical.radius = Math.max(5, Math.min(100, spherical.radius));
        let offset = new THREE.Vector3().setFromSpherical(spherical);
        camera.position.copy(rotationPoint).add(offset);
        camera.lookAt(rotationPoint);
        startY = e.touches[0].clientY;
      }
    });
    document.addEventListener('mouseup', function(e) {
      if (isZooming) {
        isZooming = false;
        zoomControl.classList.remove('active');
      }
      if (e.button === 0 && isDragging) {
        isDragging = false;
        if (!isPaused && autoDropOnRelease) {
          dropPiece();
        }
        if (selectedPiece) {
          releaseShape(selectedPiece);
        }
        selectedPiece = null;
      }
      if (e.button === 1) {
        isRotating = false;
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
      }
    });
    document.addEventListener('touchend', function (e) { if (isZooming) { isZooming = false; zoomControl.classList.remove('active'); } });
    function onMouseWheel(e) {
      e.preventDefault();
      spherical.radius += e.deltaY * 0.05;
      spherical.radius = Math.max(5, Math.min(100, spherical.radius));
      let offset = new THREE.Vector3().setFromSpherical(spherical);
      camera.position.copy(rotationPoint).add(offset);
      camera.lookAt(rotationPoint);
    }
    function onDocumentTouchStart(e) {
      e.preventDefault();
      let touch = e.touches[0];
      let rect = renderer.domElement.getBoundingClientRect();
      let m = new THREE.Vector2();
      m.x = ((touch.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
      m.y = -((touch.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(m, camera);
      let intersects = raycaster.intersectObjects(piecesGroup.children, true);
      if (intersects.length > 0) { FlashSelected(intersects[0].object); }
    }
    function onTouchStart(e) {
      e.preventDefault();
      if (!gameStarted || isPaused) return;
      isTouchDragging = true;
      let touch = e.touches[0];
      touchStartX = touch.clientX; touchStartY = touch.clientY;
    }
   function onTouchMove(e) {
  e.preventDefault();
  if (!gameStarted || !isTouchDragging || isPaused) return;

  let touch = e.touches[0];
  let deltaX = touch.clientX - touchStartX;
  let deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) >= TOUCH_THRESHOLD && Math.abs(deltaY) >= TOUCH_THRESHOLD) {
    movePieceDiagonal(
      (deltaX > 0 ? 1 : -1) * DRAG_SPEED, 
      (deltaY > 0 ? 1 : -1) * DRAG_SPEED
    );
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  } else {
    if (Math.abs(deltaX) >= TOUCH_THRESHOLD) {
      movePiece((deltaX > 0 ? 1 : -1) * DRAG_SPEED, 0, 0);
      touchStartX = touch.clientX;
    }
    if (Math.abs(deltaY) >= TOUCH_THRESHOLD) {
      movePiece(0, 0, (deltaY > 0 ? 1 : -1) * DRAG_SPEED);
      touchStartY = touch.clientY;
    }
  }
}

    function onTouchEnd(e) {
      e.preventDefault();
      if (!gameStarted || isPaused) return;
      isTouchDragging = false;
      if (autoDropOnRelease) {
        dropPiece();
      }
    }
function addRepeatAction(id, func) {
  const btn = document.getElementById(id);
  let timeoutId;
  const initialDelay = 250, startingDelay = 75, accel = 0.9, minDelay = 25;
  let currentDelay = startingDelay;
  function start(e) {
    e.preventDefault();
    if (isPaused) return;
    func();
    currentDelay = startingDelay;
    timeoutId = setTimeout(repeat, initialDelay);
  }
  function repeat() {
    if (isPaused) return;
    func();
    currentDelay = Math.max(minDelay, currentDelay * accel);
    timeoutId = setTimeout(repeat, currentDelay);
  }
  function stop() { clearTimeout(timeoutId); }
  btn.addEventListener('mousedown', start);
  btn.addEventListener('touchstart', start);
  btn.addEventListener('mouseup', stop);
  btn.addEventListener('mouseleave', stop);
  btn.addEventListener('touchend', stop);
  btn.addEventListener('touchcancel', stop);
}
function addRepeatActions(ids, func) {
  ids.forEach(id => addRepeatAction(id, func));
}

document.addEventListener('keydown', function(e) {
  const targetTag = e.target.tagName.toLowerCase();
  if (targetTag === 'input' || targetTag === 'textarea') return;
  
  e.preventDefault();
  pressedKeys[e.code] = true;
  
  if (e.code === 'KeyJ') {
    rotatePiece(e.ctrlKey ? '-x' : 'x');
    soundManager.playRotateSound('x');
    return;
  }
  if (e.code === 'KeyK') {
    rotatePiece(e.ctrlKey ? '-y' : 'y');
    soundManager.playRotateSound('y');
    return;
  }
  if (e.code === 'KeyL') {
    rotatePiece(e.ctrlKey ? '-z' : 'z');
    soundManager.playRotateSound('z');
    return;
  }
  if (e.code === 'KeyM' || (e.key && e.key.toLowerCase() === 'm')) {
    toggleMusic();
    return;
  }
  if (e.code === 'KeyP' || (e.key && e.key.toLowerCase() === 'p')) {
    if (isPaused) {
      resumeGame(); 
    } else {
      pauseGame();  
    }
    updatePauseButtons();
    return;
  }
  if (e.code === 'Escape') {
    let ts = document.getElementById('tutorial-screen');
    ts.style.display = (ts.style.display === 'block') ? 'none' : 'block';
    isPaused = (ts.style.display === 'block');
    updatePauseButtons();
    document.getElementById('game-paused').style.display = isPaused ? 'block' : 'none';
    return;
  }
  // Diagonals
  if ((pressedKeys["ArrowUp"] || pressedKeys["KeyZ"]) && (pressedKeys["ArrowLeft"] || pressedKeys["KeyQ"])) {
    movePieceDiagonal(-1, -1);
    soundManager.playMoveSound(false);
    return;
  }
  if ((pressedKeys["ArrowUp"] || pressedKeys["KeyZ"]) && (pressedKeys["ArrowRight"] || pressedKeys["KeyD"])) {
    movePieceDiagonal(1, -1);
    soundManager.playMoveSound(false);
    return;
  }
  if ((pressedKeys["ArrowDown"] || pressedKeys["KeyS"]) && (pressedKeys["ArrowLeft"] || pressedKeys["KeyQ"])) {
    movePieceDiagonal(-1, 1);
    soundManager.playMoveSound(false);
    return;
  }
  if ((pressedKeys["ArrowDown"] || pressedKeys["KeyS"]) && (pressedKeys["ArrowRight"] || pressedKeys["KeyD"])) {
    movePieceDiagonal(1, 1);
    soundManager.playMoveSound(false);
    return;
  }
  // Straight moves
  if (pressedKeys["ArrowUp"] || pressedKeys["KeyZ"]) {
    movePiece(0, 0, -1);
    soundManager.playMoveSound(false);
  } else if (pressedKeys["ArrowDown"] || pressedKeys["KeyS"]) {
    movePiece(0, 0, 1);
    soundManager.playMoveSound(false);
  } else if (pressedKeys["ArrowLeft"] || pressedKeys["KeyQ"]) {
    movePiece(-1, 0, 0);
    soundManager.playMoveSound(false);
  } else if (pressedKeys["ArrowRight"] || pressedKeys["KeyD"]) {
    movePiece(1, 0, 0);
    soundManager.playMoveSound(false);
  }
  if (e.code === "Space" || e.code === "Enter") {
    dropPiece();
    soundManager.playMoveSound(false);
    return;
  }
  if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
    movePiece(0, -1, 0);
    soundManager.playMoveSound(false);
    return;
  }
  if (e.code === "KeyR") {
    restartGame();
    return;
  }
});

document.addEventListener('keyup', function(e) {
  delete pressedKeys[e.code];
});

// Repeat actions for mobile or on-screen controls:
addRepeatActions(['moveUpButton'], () => { if (!isPaused) { movePiece(0, 0, -1); soundManager.playMoveSound(false); } });
addRepeatActions(['moveDownButton'], () => { if (!isPaused) { movePiece(0, 0, 1); soundManager.playMoveSound(false); } });
addRepeatActions(['moveLeftButton'], () => { if (!isPaused) { movePiece(-1, 0, 0); soundManager.playMoveSound(false); } });
addRepeatActions(['moveRightButton'], () => { if (!isPaused) { movePiece(1, 0, 0); soundManager.playMoveSound(false); } });
addRepeatActions(['moveUpLeftButton'], () => { if (!isPaused) { movePieceDiagonal(-1, -1); soundManager.playMoveSound(false); } });
addRepeatActions(['moveUpRightButton'], () => { if (!isPaused) { movePieceDiagonal(1, -1); soundManager.playMoveSound(false); } });
addRepeatActions(['moveDownLeftButton'], () => { if (!isPaused) { movePieceDiagonal(-1, 1); soundManager.playMoveSound(false); } });
addRepeatActions(['moveDownRightButton'], () => { if (!isPaused) { movePieceDiagonal(1, 1); soundManager.playMoveSound(false); } });
addRepeatActions(['rotateXButton'], () => { if (!isPaused) { rotatePiece('x'); soundManager.playRotateSound('x'); } });
addRepeatActions(['rotateYButton'], () => { if (!isPaused) { rotatePiece('y'); soundManager.playRotateSound('y'); } });
addRepeatActions(['rotateZButton'], () => { if (!isPaused) { rotatePiece('z'); soundManager.playRotateSound('z'); } });
addRepeatActions(['moveWButton'], () => { if (!isPaused) { movePiece(0, -1, 0); soundManager.playMoveSound(false); } });
document.getElementById('DropPieceButton').addEventListener('click', () => {
  if (!isPaused) {
    dropPiece();
    soundManager.playMoveSound(false);
  }
});

function updateMobileControlTable() {
  const controlTable = document.getElementById('controlTable');
  const mobileContainer = document.getElementById('mobile-control-container');
  const moveToggle = document.getElementById('moveControlsToggle');
  if (!controlTable || !mobileContainer || !moveToggle) return;
  if (window.innerWidth <= 949 && moveToggle.checked) {
    if (!mobileContainer.contains(controlTable)) {
      mobileContainer.appendChild(controlTable);
      controlTable.style.display = 'table';
    }
  } else {
    const tableColumn = document.querySelector('.table-column');
    if (tableColumn && mobileContainer.contains(controlTable)) {
      tableColumn.appendChild(controlTable);
    }
  }
}
window.addEventListener('resize', updateMobileControlTable);
const moveToggleElem = document.getElementById('moveControlsToggle');
if (moveToggleElem) {
  moveToggleElem.addEventListener('change', updateMobileControlTable);
}
updateMobileControlTable();

});