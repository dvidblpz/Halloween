
/* =========================================================
   DULCE INVITACIÓN
   HALLOWEEN · THE NIGHT HUNTER
========================================================= */

'use strict';

const CONFIG = {
  eventDate: '2026-10-31T20:00:00-06:00',
  whatsapp: '528443811681',
  mapsQuery: '',
  rsvpMessage: '¡Hola! Confirmo mi asistencia a la fiesta de Halloween. 🎃',

  gameSeconds: 60,
  totalPumpkins: 5,
  startingLives: 3,
  playerSpeed: 67,
  hunterSpeed: 31,
  hunterDamageCooldown: 1600
};

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener('load', () => {
  window.setTimeout(() => {
    $('#preloader')?.classList.add('loaded');
  }, 450);
});


/* =========================================================
   BIENVENIDA Y MÚSICA
========================================================= */

let musicIsPlaying = false;

$('#enterInvitation')?.addEventListener('click', async () => {
  $('#welcomeScreen')?.classList.add('hidden');

  const music = $('#backgroundMusic');

  if (!music || !music.querySelector('source')) return;

  try {
    music.volume = 0.32;
    await music.play();
    musicIsPlaying = true;
  } catch (error) {
    musicIsPlaying = false;
  }

  updateMusicButton();
});


function updateMusicButton() {
  const button = $('#musicToggle');

  if (!button) return;

  button.textContent = musicIsPlaying ? '♫' : '♪';

  button.setAttribute(
    'aria-label',
    musicIsPlaying ? 'Desactivar música' : 'Activar música'
  );

  button.title = musicIsPlaying
    ? 'Desactivar música'
    : 'Activar música';
}


$('#musicToggle')?.addEventListener('click', async () => {
  const music = $('#backgroundMusic');

  if (!music) return;

  if (music.paused) {
    try {
      music.volume = 0.32;
      await music.play();
      musicIsPlaying = true;
    } catch (error) {
      musicIsPlaying = false;
    }
  } else {
    music.pause();
    musicIsPlaying = false;
  }

  updateMusicButton();
});


/* =========================================================
   MENÚ MÓVIL
========================================================= */

const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');


function closeMenu() {
  mainNav?.classList.remove('active');

  menuToggle?.setAttribute(
    'aria-expanded',
    'false'
  );
}


menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('active') ?? false;

  menuToggle.setAttribute(
    'aria-expanded',
    String(isOpen)
  );
});


$$('#mainNav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});


window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    closeMenu();
  }
});


/* =========================================================
   HEADER Y BOTÓN VOLVER ARRIBA
========================================================= */

function updateScrollUI() {
  $('#siteHeader')?.classList.toggle(
    'scrolled',
    window.scrollY > 35
  );

  $('#backToTop')?.classList.toggle(
    'visible',
    window.scrollY > 550
  );
}


window.addEventListener(
  'scroll',
  updateScrollUI,
  { passive: true }
);


$('#backToTop')?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


updateScrollUI();


/* =========================================================
   ANIMACIONES AL DESPLAZARSE
========================================================= */

const revealElements = $$('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -25px 0px'
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add('visible');
  });
}


/* =========================================================
   CUENTA REGRESIVA
========================================================= */

function updateCountdown() {
  const target = new Date(CONFIG.eventDate).getTime();
  const diff = target - Date.now();

  const message = $('#countdownMessage');

  if (!Number.isFinite(target)) {
    if (message) {
      message.textContent = 'Configura la fecha del evento en script.js.';
    }
    return;
  }

  if (diff <= 0) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
      const element = document.getElementById(id);

      if (element) element.textContent = '00';
    });

    if (message) {
      message.textContent =
        'La noche ha llegado. ¡Que comience la fiesta!';
    }

    return;
  }

  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = String(value).padStart(2, '0');
    }
  });
}


updateCountdown();

window.setInterval(updateCountdown, 1000);


/* =========================================================
   ENLACES A MAPAS
========================================================= */

if (CONFIG.mapsQuery.trim()) {
  const query = encodeURIComponent(CONFIG.mapsQuery.trim());

  const mapsLink = $('#mapsLink');
  const wazeLink = $('#wazeLink');

  if (mapsLink) {
    mapsLink.href =
      `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  if (wazeLink) {
    wazeLink.href =
      `https://waze.com/ul?q=${query}&navigate=yes`;
  }
}


/* =========================================================
   CONFIRMACIÓN POR WHATSAPP
========================================================= */

const whatsappButton = $('#whatsappButton');

if (
  whatsappButton &&
  /^\d{10,15}$/.test(CONFIG.whatsapp)
) {
  whatsappButton.href =
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.rsvpMessage)}`;
}


/* =========================================================
   VIDEO
========================================================= */

const trailerVideo = $('#trailerVideo');

if (trailerVideo) {
  trailerVideo.addEventListener('error', () => {
    console.warn(
      'No se pudo cargar el tráiler. Revisa la ruta del archivo de video.'
    );
  });
}


/* =========================================================
   VIDEOJUEGO RETRO: THE NIGHT HUNTER
========================================================= */

function initRetroGame() {
  const canvas = $('#retroCanvas');
  const overlay = $('#retroOverlay');
  const startButton = $('#retroStart');
  const title = $('#retroTitle');
  const description = $('#retroDescription');

  const timerLabel = $('#retroTimer');
  const livesLabel = $('#retroLives');
  const pumpkinsLabel = $('#retroPumpkins');
  const statusLabel = $('#retroStatus');

  if (
    !canvas ||
    !overlay ||
    !startButton ||
    !timerLabel ||
    !livesLabel ||
    !pumpkinsLabel
  ) {
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const TILE = 16;

  const keys = new Set();

  let running = false;
  let animationFrame = 0;
  let timerInterval = null;
  let lastFrame = 0;
  let elapsed = 0;
  let timeLeft = CONFIG.gameSeconds;
  let lives = CONFIG.startingLives;
  let found = 0;
  let invulnerableUntil = 0;

  const player = {
    x: 2 * TILE,
    y: 8 * TILE,
    speed: CONFIG.playerSpeed,
    face: 1,
    moving: false
  };

  const hunter = {
    x: 17 * TILE,
    y: 3 * TILE,
    speed: CONFIG.hunterSpeed,
    direction: -1,
    alert: false,
    nextPatrolChange: 0
  };

  let pumpkins = [];
  let trees = [];
  let cabins = [];

  const colors = {
    sky: '#10182b',
    sky2: '#20233b',
    ground: '#26372c',
    grass: '#3d5635',
    tree: '#14251e',
    trunk: '#50382b',
    cabin: '#49352e',
    cabinDark: '#211d2b',
    window: '#ffad45',
    pumpkin: '#ff812c',
    pumpkinDark: '#bd451f',
    player: '#e8d9bd',
    playerCoat: '#43647a',
    hunter: '#17131c',
    mask: '#d9d2bf',
    red: '#e33d47'
  };


  /* -----------------------------------------------------
     UTILIDADES DE DIBUJO
  ----------------------------------------------------- */

  function block(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height)
    );
  }


  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
  }


  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /* -----------------------------------------------------
     CONSTRUIR EL MUNDO
  ----------------------------------------------------- */

  function makeWorld() {
    pumpkins = [
      { x: 4 * TILE, y: 3 * TILE, found: false },
      { x: 8 * TILE, y: 8 * TILE, found: false },
      { x: 11 * TILE, y: 4 * TILE, found: false },
      { x: 15 * TILE, y: 8 * TILE, found: false },
      { x: 18 * TILE, y: 6 * TILE, found: false }
    ];

    trees = [];

    for (let i = 0; i < 33; i++) {
      trees.push({
        x: randomBetween(0, W - 12),
        y: randomBetween(15, H - 14),
        size: randomBetween(7, 13)
      });
    }

    cabins = [
      { x: 5 * TILE, y: 1.2 * TILE },
      { x: 13 * TILE, y: 1.5 * TILE }
    ];

    player.x = 2 * TILE;
    player.y = 8 * TILE;
    player.face = 1;
    player.moving = false;

    hunter.x = 17 * TILE;
    hunter.y = 3 * TILE;
    hunter.direction = -1;
    hunter.alert = false;
    hunter.nextPatrolChange = 0;
  }


  /* -----------------------------------------------------
     DIBUJAR BOSQUE
  ----------------------------------------------------- */

  function drawForest() {
    block(0, 0, W, H, colors.sky);
    block(0, 0, W, 56, colors.sky2);

    // Luna pixelada.
    block(245, 12, 17, 17, '#d8d1bb');
    block(251, 8, 12, 12, colors.sky2);
    block(249, 18, 6, 6, '#b9b7b2');

    // Estrellas.
    for (let i = 0; i < 22; i++) {
      const sx = (i * 47 + 13) % W;
      const sy = (i * 19 + 7) % 47;

      block(sx, sy, 2, 2, '#c8c5d3');
    }

    // Suelo.
    block(0, 56, W, H - 56, colors.ground);

    // Sendero.
    block(0, 112, W, 27, '#55463b');
    block(0, 119, W, 2, '#665341');

    // Hierba.
    for (let i = 0; i < 45; i++) {
      const gx = (i * 67 + 11) % W;
      const gy = 57 + ((i * 31 + 9) % 120);

      block(gx, gy, 3, 2, colors.grass);
    }

    // Árboles.
    trees.forEach(tree => {
      block(tree.x + 3, tree.y + 5, 4, 9, colors.trunk);
      block(tree.x, tree.y, tree.size, tree.size, colors.tree);
      block(tree.x + 2, tree.y - 3, 5, 5, '#1d3026');
    });

    // Cabañas.
    cabins.forEach(cabin => {
      const x = cabin.x;
      const y = cabin.y;

      block(x, y + 9, 38, 24, colors.cabin);
      block(x - 4, y + 7, 46, 5, '#2d2025');
      block(x + 4, y + 2, 30, 7, '#38252b');
      block(x + 8, y + 14, 7, 8, colors.window);
      block(x + 24, y + 14, 7, 8, colors.window);
      block(x + 17, y + 20, 7, 13, colors.cabinDark);
    });

    // Viñeta oscura.
    const gradient = ctx.createRadialGradient(
      W / 2, H / 2, 35,
      W / 2, H / 2, 185
    );

    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'rgba(0,0,0,0.43)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  }


  /* -----------------------------------------------------
     DIBUJAR CALABAZAS
  ----------------------------------------------------- */

  function drawPumpkin(x, y) {
    block(x + 3, y, 5, 3, '#6e9a3b');
    block(x + 1, y + 3, 9, 7, colors.pumpkin);
    block(x, y + 5, 11, 4, colors.pumpkinDark);
    block(x + 3, y + 4, 2, 3, '#fff1a0');
    block(x + 7, y + 4, 2, 3, '#fff1a0');
    block(x + 4, y + 8, 4, 2, '#371c1b');
  }


  /* -----------------------------------------------------
     DIBUJAR JUGADOR
  ----------------------------------------------------- */

  function drawPlayer(x, y, now) {
    const blinking =
      now < invulnerableUntil &&
      Math.floor(now / 100) % 2 === 0;

    if (blinking) return;

    // Sombra.
    block(x + 2, y + 14, 12, 3, '#101611');

    // Piernas.
    block(x + 4, y + 10, 3, 5, '#292a38');
    block(x + 9, y + 10, 3, 5, '#292a38');

    // Chaqueta.
    block(x + 3, y + 5, 9, 7, colors.playerCoat);
    block(x + 5, y + 5, 3, 6, '#6e8b98');

    // Cabeza.
    block(x + 5, y + 1, 6, 5, colors.player);
    block(x + 4, y, 8, 2, '#372b2b');

    // Mochila.
    block(
      x + (player.face > 0 ? 1 : 12),
      y + 6,
      3,
      5,
      '#70462e'
    );
  }


  /* -----------------------------------------------------
     DIBUJAR CAZADOR ORIGINAL
  ----------------------------------------------------- */

  function drawHunter(x, y) {
    // Sombra.
    block(x + 1, y + 14, 14, 3, '#0a0b0d');

    // Botas.
    block(x + 2, y + 12, 5, 4, '#171318');
    block(x + 9, y + 12, 5, 4, '#171318');

    // Cuerpo.
    block(x + 2, y + 6, 12, 8, colors.hunter);
    block(x, y + 7, 3, 7, '#25202a');
    block(x + 13, y + 7, 3, 7, '#25202a');

    // Cabeza y máscara.
    block(x + 3, y + 1, 10, 7, colors.mask);
    block(x + 2, y, 12, 3, '#17131c');

    // Ojos.
    block(x + 5, y + 3, 2, 2, '#b92835');
    block(x + 10, y + 3, 2, 2, '#b92835');

    // Boca.
    block(x + 6, y + 6, 4, 1, '#30242b');
  }


  /* -----------------------------------------------------
     HUD
  ----------------------------------------------------- */

  function updateHUD() {
    timerLabel.textContent =
      String(timeLeft).padStart(2, '0');

    livesLabel.textContent =
      lives > 0 ? Array(lives).fill('♥').join(' ') : '—';

    pumpkinsLabel.textContent =
      `${String(found).padStart(2, '0')} / 05`;

    if (statusLabel) {
      statusLabel.textContent =
        running ? '● SURVIVE!' : '● PLAYER 1';

      statusLabel.style.color =
        running ? '#ff9b38' : '#a9e6a1';
    }
  }


  /* -----------------------------------------------------
     MOVIMIENTO DEL JUGADOR
  ----------------------------------------------------- */

  function getDirection() {
    let dx = 0;
    let dy = 0;

    if (keys.has('left')) dx -= 1;
    if (keys.has('right')) dx += 1;
    if (keys.has('up')) dy -= 1;
    if (keys.has('down')) dy += 1;

    return { dx, dy };
  }


  function movePlayer(dt) {
    const { dx, dy } = getDirection();

    player.moving = dx !== 0 || dy !== 0;

    if (!player.moving) return;

    const length = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / length;
    const ny = dy / length;

    player.x += nx * player.speed * dt;
    player.y += ny * player.speed * dt;

    if (dx !== 0) {
      player.face = dx > 0 ? 1 : -1;
    }

    player.x = Math.max(0, Math.min(W - 16, player.x));
    player.y = Math.max(48, Math.min(H - 16, player.y));
  }


  /* -----------------------------------------------------
     RECOGER CALABAZAS
  ----------------------------------------------------- */

  function checkPumpkins() {
    pumpkins.forEach(pumpkin => {
      if (pumpkin.found) return;

      if (distance(player, pumpkin) < 18) {
        pumpkin.found = true;
        found++;

        updateHUD();

        if (found >= CONFIG.totalPumpkins) {
          finishGame(true);
        }
      }
    });
  }


  /* -----------------------------------------------------
     COMPORTAMIENTO DEL CAZADOR
  ----------------------------------------------------- */

  function moveHunter(dt, now) {
    if (!running) return;

    const d = distance(player, hunter);

    hunter.alert = d < 105;

    if (hunter.alert) {
      const dx = player.x - hunter.x;
      const dy = player.y - hunter.y;
      const length = Math.max(1, Math.sqrt(dx * dx + dy * dy));

      hunter.x +=
        (dx / length) * hunter.speed * 1.4 * dt;

      hunter.y +=
        (dy / length) * hunter.speed * 1.4 * dt;

    } else {
      hunter.x += hunter.direction * hunter.speed * .55 * dt;

      if (now > hunter.nextPatrolChange) {
        hunter.direction = Math.random() > .5 ? 1 : -1;
        hunter.nextPatrolChange = now + randomBetween(900, 2200);
      }
    }

    hunter.x = Math.max(0, Math.min(W - 16, hunter.x));
    hunter.y = Math.max(48, Math.min(H - 16, hunter.y));

    // Evitar daño continuo cada fotograma.
    if (
      d < 16 &&
      now > invulnerableUntil
    ) {
      lives--;

      invulnerableUntil =
        now + CONFIG.hunterDamageCooldown;

      // Empujar al jugador lejos del cazador.
      const direction = player.x < hunter.x ? -1 : 1;

      player.x = Math.max(
        0,
        Math.min(W - 16, player.x + direction * 22)
      );

      updateHUD();

      if (lives <= 0) {
        finishGame(false);
      }
    }
  }


  /* -----------------------------------------------------
     RENDERIZADO
  ----------------------------------------------------- */

  function render(now) {
    drawForest();

    pumpkins.forEach(pumpkin => {
      if (!pumpkin.found) {
        drawPumpkin(pumpkin.x, pumpkin.y);
      }
    });

    drawPlayer(player.x, player.y, now);
    drawHunter(hunter.x, hunter.y);

    if (hunter.alert && running) {
      block(6, 6, 65, 12, '#171019');

      ctx.fillStyle = colors.red;
      ctx.font = '7px monospace';
      ctx.fillText('DANGER!', 10, 15);
    }

    // Líneas CRT discretas.
    for (let y = 0; y < H; y += 4) {
      block(0, y, W, 1, 'rgba(0,0,0,0.12)');
    }
  }


  /* -----------------------------------------------------
     BUCLE PRINCIPAL
  ----------------------------------------------------- */

  function loop(now) {
    if (!running) return;

    const dt = Math.min(
      (now - lastFrame) / 1000 || 0,
      0.04
    );

    lastFrame = now;
    elapsed += dt;

    movePlayer(dt);
    moveHunter(dt, now);

    if (!running) return;

    checkPumpkins();
    render(now);

    if (running) {
      animationFrame = requestAnimationFrame(loop);
    }
  }


  /* -----------------------------------------------------
     FINAL DEL JUEGO
  ----------------------------------------------------- */

  function finishGame(won) {
    if (!running) return;

    running = false;

    clearInterval(timerInterval);
    timerInterval = null;

    cancelAnimationFrame(animationFrame);
    keys.clear();

    overlay.classList.remove('hidden');

    title.textContent = won
      ? 'YOU SURVIVED!'
      : 'GAME OVER';

    description.innerHTML = won
      ? 'HAS ENCONTRADO LAS 5 CALABAZAS.<br>POR ESTA NOCHE, ESTÁS A SALVO.'
      : 'EL CAZADOR TE HA ENCONTRADO.<br>¿TE ATREVES A INTENTARLO OTRA VEZ?';

    startButton.textContent = won
      ? 'PLAY AGAIN'
      : 'TRY AGAIN';

    updateHUD();
  }


  /* -----------------------------------------------------
     INICIAR / REINICIAR
  ----------------------------------------------------- */

  function startGame() {
    clearInterval(timerInterval);
    cancelAnimationFrame(animationFrame);

    keys.clear();
    makeWorld();

    running = true;
    elapsed = 0;
    timeLeft = CONFIG.gameSeconds;
    lives = CONFIG.startingLives;
    found = 0;
    invulnerableUntil = 0;
    lastFrame = performance.now();

    updateHUD();
    overlay.classList.add('hidden');

    animationFrame = requestAnimationFrame(loop);

    timerInterval = window.setInterval(() => {
      if (!running) return;

      timeLeft = Math.max(0, timeLeft - 1);

      updateHUD();

      if (timeLeft <= 0) {
        finishGame(false);
      }
    }, 1000);
  }


  /* -----------------------------------------------------
     TECLADO
  ----------------------------------------------------- */

  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
  };

  document.addEventListener('keydown', event => {
    const direction = keyMap[event.key];

    if (!direction || !running) return;

    event.preventDefault();
    keys.add(direction);
  });

  document.addEventListener('keyup', event => {
    const direction = keyMap[event.key];

    if (direction) {
      keys.delete(direction);
    }
  });

  window.addEventListener('blur', () => {
    keys.clear();
  });


  /* -----------------------------------------------------
     BOTONES TÁCTILES
  ----------------------------------------------------- */

  document.querySelectorAll('[data-direction]').forEach(button => {
    const direction = button.dataset.direction;

    function release(event) {
      if (event) event.preventDefault();
      keys.delete(direction);
    }

    button.addEventListener('pointerdown', event => {
      if (!running) return;

      event.preventDefault();
      keys.add(direction);

      try {
        button.setPointerCapture(event.pointerId);
      } catch (error) {
        // La captura del puntero es opcional.
      }
    });

    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', () => {
      keys.delete(direction);
    });

    button.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  });


  /* -----------------------------------------------------
     BOTÓN START
  ----------------------------------------------------- */

  startButton.addEventListener('click', startGame);

  makeWorld();
  render(0);
  updateHUD();
}


initRetroGame();


/* =========================================================
   PROTECCIÓN DISUASORIA CONTRA COPIA
========================================================= */

/*
  Estas medidas dificultan la copia casual del contenido.
  No impiden capturas de pantalla, grabaciones ni extracción
  de recursos desde las herramientas del navegador.
*/


document.addEventListener('contextmenu', event => {
  if (!event.target.closest('input, textarea, select')) {
    event.preventDefault();
  }
});


document.addEventListener('selectstart', event => {
  if (!event.target.closest('input, textarea, select')) {
    event.preventDefault();
  }
});


document.addEventListener('dragstart', event => {
  if (event.target.matches('img, video')) {
    event.preventDefault();
  }
});


document.addEventListener('copy', event => {
  if (!event.target.closest('input, textarea, select')) {
    event.preventDefault();
  }
});


document.addEventListener('cut', event => {
  if (!event.target.closest('input, textarea, select')) {
    event.preventDefault();
  }
});


document.addEventListener('paste', event => {
  if (!event.target.closest('input, textarea, select')) {
    event.preventDefault();
  }
});


document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  const modifier = event.ctrlKey || event.metaKey;

  const blocked = modifier &&
    ['c', 'x', 'v', 'a', 's', 'u', 'p'].includes(key);

  if (
    blocked &&
    !event.target.closest('input, textarea, select')
  ) {
    event.preventDefault();
  }

  // No bloqueamos F12 ni las herramientas de desarrollo.
});


/* =========================================================
   EVITAR ARRASTRE DE IMÁGENES Y VIDEO
========================================================= */

$$('img, video').forEach(element => {
  element.setAttribute('draggable', 'false');
});
