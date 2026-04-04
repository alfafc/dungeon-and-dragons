// =============================================
// DUNGEONS & DRAGONS - AVENTURA FAMILIAR (con IA)
// =============================================

let OPENAI_API_KEY = localStorage.getItem('openai_api_key') || '';
const OPENAI_MODEL = 'gpt-4o-mini';

// --- DATOS DEL JUEGO ---

const RACES = [
  { id: 'humano', name: 'Humano', icon: '🧑', desc: '+1 a todo', bonuses: { FUE: 1, DES: 1, CON: 1, INT: 1, SAB: 1, CAR: 1 } },
  { id: 'elfo', name: 'Elfo', icon: '🧝', desc: '+2 DES', bonuses: { DES: 2 } },
  { id: 'enano', name: 'Enano', icon: '⛏️', desc: '+2 CON', bonuses: { CON: 2 } },
  { id: 'mediano', name: 'Mediano', icon: '🦶', desc: '+2 DES', bonuses: { DES: 2 } },
  { id: 'orco', name: 'Semiorco', icon: '💪', desc: '+2 FUE, +1 CON', bonuses: { FUE: 2, CON: 1 } },
  { id: 'tiefling', name: 'Tiefling', icon: '😈', desc: '+2 CAR', bonuses: { CAR: 2 } },
];

const CLASSES = [
  { id: 'guerrero', name: 'Guerrero', icon: '⚔️', desc: 'Fuerte en combate', hitDie: 10, primaryStat: 'FUE', weapon: 'Espada larga', weaponDie: 8, armor: 16, spells: [] },
  { id: 'mago', name: 'Mago', icon: '🔮', desc: 'Poder arcano', hitDie: 6, primaryStat: 'INT', weapon: 'Baston', weaponDie: 6, armor: 12, spells: ['Bola de Fuego', 'Rayo de Escarcha', 'Escudo Magico'] },
  { id: 'picaro', name: 'Picaro', icon: '🗡️', desc: 'Sigilo y trampas', hitDie: 8, primaryStat: 'DES', weapon: 'Daga', weaponDie: 6, armor: 14, spells: [] },
  { id: 'clerigo', name: 'Clerigo', icon: '✝️', desc: 'Sanacion divina', hitDie: 8, primaryStat: 'SAB', weapon: 'Maza', weaponDie: 6, armor: 16, spells: ['Curar Heridas', 'Palabra Sagrada', 'Bendicion'] },
  { id: 'ranger', name: 'Ranger', icon: '🏹', desc: 'Arquero explorador', hitDie: 10, primaryStat: 'DES', weapon: 'Arco largo', weaponDie: 8, armor: 15, spells: ['Marca del Cazador'] },
  { id: 'barbaro', name: 'Barbaro', icon: '🪓', desc: 'Furia salvaje', hitDie: 12, primaryStat: 'FUE', weapon: 'Hacha grande', weaponDie: 12, armor: 14, spells: [] },
];

const STAT_NAMES = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const STAT_FULL_NAMES = {
  FUE: 'Fuerza', DES: 'Destreza', CON: 'Constitucion',
  INT: 'Inteligencia', SAB: 'Sabiduria', CAR: 'Carisma'
};

const MONSTERS = {
  goblin: { name: 'Goblin', icon: '👺', hp: 12, ac: 13, attackMod: 4, damageDie: 6, damageBonus: 1, xp: 50, cr: 0.25 },
  esqueleto: { name: 'Esqueleto', icon: '💀', hp: 15, ac: 13, attackMod: 4, damageDie: 6, damageBonus: 2, xp: 50, cr: 0.25 },
  lobo: { name: 'Lobo', icon: '🐺', hp: 11, ac: 13, attackMod: 4, damageDie: 8, damageBonus: 2, xp: 50, cr: 0.25 },
  bandido: { name: 'Bandido', icon: '🦹', hp: 16, ac: 14, attackMod: 4, damageDie: 8, damageBonus: 1, xp: 75, cr: 0.5 },
  ogro: { name: 'Ogro', icon: '👹', hp: 40, ac: 11, attackMod: 6, damageDie: 10, damageBonus: 4, xp: 200, cr: 2 },
  zombi: { name: 'Zombi', icon: '🧟', hp: 22, ac: 8, attackMod: 3, damageDie: 6, damageBonus: 1, xp: 50, cr: 0.25 },
  arana_gigante: { name: 'Arana Gigante', icon: '🕷️', hp: 26, ac: 14, attackMod: 5, damageDie: 8, damageBonus: 3, xp: 100, cr: 1 },
  minotauro: { name: 'Minotauro', icon: '🐂', hp: 55, ac: 14, attackMod: 6, damageDie: 12, damageBonus: 4, xp: 450, cr: 3 },
  dragon_joven: { name: 'Dragon Joven', icon: '🐉', hp: 75, ac: 17, attackMod: 8, damageDie: 10, damageBonus: 5, xp: 700, cr: 5 },
  rata_gigante: { name: 'Rata Gigante', icon: '🐀', hp: 7, ac: 12, attackMod: 3, damageDie: 4, damageBonus: 1, xp: 25, cr: 0.125 },
  murcielago_gigante: { name: 'Murcielago Gigante', icon: '🦇', hp: 9, ac: 13, attackMod: 3, damageDie: 6, damageBonus: 1, xp: 25, cr: 0.125 },
  troll: { name: 'Troll', icon: '🧌', hp: 50, ac: 13, attackMod: 7, damageDie: 10, damageBonus: 4, xp: 300, cr: 3 },
  espectro: { name: 'Espectro', icon: '👻', hp: 30, ac: 14, attackMod: 5, damageDie: 8, damageBonus: 3, xp: 150, cr: 1 },
  hombre_lobo: { name: 'Hombre Lobo', icon: '🐺', hp: 35, ac: 12, attackMod: 5, damageDie: 8, damageBonus: 3, xp: 200, cr: 2 },
};

// --- CONFIGURACION ---

let gameConfig = {
  dmMode: 'ai',       // 'ai' | 'human'
  duration: 'medium',  // 'short' | 'medium' | 'long'
  difficulty: 'normal', // 'easy' | 'normal' | 'hard'
  tone: 'kids',        // 'kids' | 'teens' | 'adult'
  setting: 'dungeon',  // 'dungeon' | 'forest' | 'castle' | 'pirate' | 'volcano' | 'random'
};

const DURATION_ROOMS = { short: { min: 5, max: 7 }, medium: { min: 10, max: 15 }, long: { min: 20, max: 30 } };

const SETTING_NAMES = {
  dungeon: 'Mazmorra Clasica',
  forest: 'Bosque Encantado',
  castle: 'Castillo Maldito',
  pirate: 'Isla Pirata',
  volcano: 'Templo del Volcan',
  random: 'Sorpresa',
};

function setConfig(key, value) {
  gameConfig[key] = value;
  // Update UI - deselect siblings, select this one
  const prefix = {
    dmMode: 'cfg-dm-',
    duration: 'cfg-dur-',
    difficulty: 'cfg-diff-',
    tone: 'cfg-tone-',
    setting: 'cfg-set-',
  }[key];
  if (prefix) {
    document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => el.classList.remove('selected'));
    const el = document.getElementById(`${prefix}${value}`);
    if (el) el.classList.add('selected');
  }
  saveToLocalStorage();
}

// --- LOCAL STORAGE PERSISTENCE ---

function saveToLocalStorage() {
  localStorage.setItem('dnd_gameConfig', JSON.stringify(gameConfig));
  localStorage.setItem('dnd_playerCount', gameState.playerCount);
  localStorage.setItem('dnd_playerNames', JSON.stringify(gameState.playerNames));
  localStorage.setItem('dnd_characters', JSON.stringify(gameState.characters));
  localStorage.setItem('dnd_dmName', gameState.dmName);
}

function loadFromLocalStorage() {
  const savedConfig = localStorage.getItem('dnd_gameConfig');
  if (savedConfig) {
    const parsed = JSON.parse(savedConfig);
    Object.assign(gameConfig, parsed);
    // Restore UI selections
    Object.entries(gameConfig).forEach(([key, value]) => setConfig(key, value));
  }

  const savedCount = localStorage.getItem('dnd_playerCount');
  if (savedCount) {
    gameState.playerCount = parseInt(savedCount, 10);
  }

  const savedNames = localStorage.getItem('dnd_playerNames');
  if (savedNames) {
    gameState.playerNames = JSON.parse(savedNames);
  }

  const savedChars = localStorage.getItem('dnd_characters');
  if (savedChars) {
    gameState.characters = JSON.parse(savedChars);
  }

  const savedDmName = localStorage.getItem('dnd_dmName');
  if (savedDmName) {
    gameState.dmName = savedDmName;
  }
}

function goToPlayersScreen() {
  // Save API key from input
  const keyInput = document.getElementById('api-key-input');
  if (keyInput && keyInput.value.trim()) {
    OPENAI_API_KEY = keyInput.value.trim();
    localStorage.setItem('openai_api_key', OPENAI_API_KEY);
  }
  if (!OPENAI_API_KEY && gameConfig.dmMode === 'ai') {
    alert('Necesitas una API Key de OpenAI para usar el modo IA.');
    return;
  }
  // Show/hide DM name field based on mode
  const dmSection = document.getElementById('dm-name-section');
  if (dmSection) {
    dmSection.style.display = gameConfig.dmMode === 'human' ? 'block' : 'none';
  }
  showScreen('screen-players');
}

function toggleKeyVisibility() {
  const input = document.getElementById('api-key-input');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function initApiKeyInput() {
  const input = document.getElementById('api-key-input');
  if (input && OPENAI_API_KEY) {
    input.value = OPENAI_API_KEY;
  }
}

// --- ESTADO DEL JUEGO ---

let gameState = {
  playerCount: 2,
  playerNames: [],
  characters: [],
  currentCharacterIndex: 0,
  gold: 0,
  inventory: [],
  xp: 0,
  combat: null,
  diceCount: 1,
  diceHistory: [],
  roomCount: 0,
  aiHistory: [],
  isAiThinking: false,
  adventureStarted: false,
  dmName: 'Dungeon Master',
  storyLog: [],
  imageDescriptions: [],
  isGeneratingImage: false,
};

// --- AI DUNGEON MASTER ---

function buildDMSystemPrompt() {
  const durationInfo = DURATION_ROOMS[gameConfig.duration];
  const totalRooms = `${durationInfo.min}-${durationInfo.max}`;

  const toneInstructions = {
    kids: 'Narra para niños: aventura alegre, humor, sin violencia grafica. Usa descripciones divertidas y emocionantes. Los enemigos "caen derrotados" pero nunca hay sangre ni muerte grafica.',
    teens: 'Narra estilo pelicula de aventuras juvenil: mas tension, drama y suspenso. Puede haber peligro real y momentos oscuros, pero sin gore.',
    adult: 'Narra con tono oscuro y realista: decisiones morales complejas, consecuencias duras, ambiguedad moral. El mundo es peligroso y no siempre justo.',
  };

  const difficultyInstructions = {
    easy: 'DIFICULTAD FACIL: enemigos debiles (1-2 por encuentro, solo de CR bajo), mucha curacion y loot. DCs de habilidad entre 8-12. Ofrece opciones de evitar combate frecuentemente. Curacion cada 2-3 salas.',
    normal: 'DIFICULTAD NORMAL: balance clasico de D&D. Grupos de 2-4 enemigos que escalan gradualmente. DCs de habilidad entre 10-15. Curacion cada 3-4 salas.',
    hard: 'DIFICULTAD DIFICIL: enemigos fuertes y numerosos (3-5 por encuentro, incluir CR alto). DCs de habilidad entre 13-18. Poca curacion (cada 5-6 salas). Las trampas hacen mas dano. Recursos escasos.',
  };

  const settingInstructions = {
    dungeon: 'AMBIENTACION: Mazmorra clasica subterranea - cuevas, pasillos de piedra, trampas mecanicas, monstruos clasicos, tesoros escondidos.',
    forest: 'AMBIENTACION: Bosque encantado y misterioso - hadas, druidas, criaturas del bosque, arboles parlantes, ruinas elficas, rios magicos.',
    castle: 'AMBIENTACION: Castillo maldito y gotico - salones polvorientos, armaduras encantadas, fantasmas, vampiros, no-muertos, pasadizos secretos.',
    pirate: 'AMBIENTACION: Isla pirata tropical - playas, cuevas costeras, barcos naufragados, piratas, kraken, tesoros enterrados, selva peligrosa.',
    volcano: 'AMBIENTACION: Templo dentro de un volcan activo - lava, puentes de piedra sobre el fuego, cultistas, elementales de fuego, dragones, gemas de fuego.',
    random: 'AMBIENTACION: Sorprendeme! Elige una ambientacion creativa y original que mezcle elementos fantasticos inesperados.',
  };

  return `Eres el Dungeon Master de un juego de Dungeons & Dragons. Tu trabajo es narrar una aventura emocionante.

${toneInstructions[gameConfig.tone]}

${settingInstructions[gameConfig.setting]}

${difficultyInstructions[gameConfig.difficulty]}

DURACION: La aventura debe durar entre ${totalRooms} salas/encuentros. Ritmo: introduce la aventura, escala la tension, culmina con un boss final epico.

REGLAS IMPORTANTES:
- Narra en segunda persona del plural ("Ante ustedes se abre...", "Ven un...", "Escuchan...")
- Cada respuesta debe ser CONCISA (maximo 3-4 oraciones de narrativa)

FORMATO DE RESPUESTA - Siempre responde en JSON valido con esta estructura exacta:
{
  "narrativa": "Texto descriptivo de lo que pasa y lo que ven los heroes.",
  "opciones": [
    {
      "texto": "Descripcion corta de la accion",
      "tipo": "explorar|combate|sigilo|social|investigar|magia",
      "check": {"stat": "FUE|DES|CON|INT|SAB|CAR", "dc": 10}
    }
  ],
  "combate": null,
  "loot": null,
  "trampa": null,
  "curacion": null,
  "xp": 0,
  "esFinDeAventura": false
}

CAMPO "opciones": siempre genera 3 opciones variadas. El campo "check" es opcional - usalo cuando la accion requiera una tirada de habilidad. Si no requiere tirada, omiti "check".

CAMPO "combate": cuando haya un encuentro de combate, usa este formato en vez de null:
{ "enemigos": ["goblin", "esqueleto", etc], "descripcion": "Los enemigos atacan!" }
Los monstruos disponibles son: goblin, esqueleto, lobo, bandido, ogro, zombi, arana_gigante, minotauro, dragon_joven, rata_gigante, murcielago_gigante, troll, espectro, hombre_lobo.
Cuando hay combate, las "opciones" deben estar vacias [].

CAMPO "loot": cuando encuentren tesoro:
{ "oro": 50, "objetos": [{"nombre": "Pocion de Curacion", "tipo": "pocion", "curacion": 8}] }
Tipos validos de objetos: "pocion" (con campo curacion), "arma" (con campo bonus: 1), "artefacto".

CAMPO "trampa": cuando activen una trampa:
{ "dano": 4, "descripcion": "Un dardo sale de la pared!" }

CAMPO "curacion": cuando un NPC o fuente magica cure al grupo:
{ "cantidad": 10, "descripcion": "Un manantial magico restaura sus fuerzas." }

CAMPO "xp": puntos de experiencia ganados (0 si no aplica). Da entre 25-100 por exploracion exitosa, el combate da XP aparte.

CAMPO "esFinDeAventura": true SOLO cuando la aventura llega a un final epico (victoria o escape). Esto sucede cuando se alcanza la sala ${durationInfo.max} aproximadamente.

DIRECTRICES:
- Empieza con encuentros faciles y escala gradualmente
- Incluye variedad: combate, puzzles, NPCs, trampas, tesoros
- El boss final debe ser impactante y memorable
- Adapta la dificultad al estado del grupo (si estan heridos, da oportunidades de curarse)`;
}

async function callAI(userMessage) {
  gameState.isAiThinking = true;
  showThinkingIndicator();

  const messages = [
    { role: 'system', content: buildDMSystemPrompt() },
    ...gameState.aiHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    gameState.aiHistory.push({ role: 'user', content: userMessage });
    gameState.aiHistory.push({ role: 'assistant', content });

    // Keep history manageable (last 20 exchanges)
    if (gameState.aiHistory.length > 40) {
      gameState.aiHistory = gameState.aiHistory.slice(-30);
    }

    gameState.isAiThinking = false;
    hideThinkingIndicator();

    return parseAIResponse(content);
  } catch (error) {
    gameState.isAiThinking = false;
    hideThinkingIndicator();
    console.error('AI Error:', error);
    addNarrative('combat-msg', 'Error', `No se pudo contactar al Dungeon Master: ${error.message}`);
    return null;
  }
}

function parseAIResponse(content) {
  try {
    // Extract JSON from potential markdown code blocks
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Parse error:', e, 'Content:', content);
    // Try to extract JSON object from the response
    const objMatch = content.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]);
      } catch (e2) {
        console.error('Second parse error:', e2);
      }
    }
    addNarrative('combat-msg', 'Error', 'El Dungeon Master murmuro algo incomprensible... Intentando de nuevo.');
    return null;
  }
}

function showThinkingIndicator() {
  const log = document.getElementById('narrative-log');
  let indicator = document.getElementById('thinking-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'thinking-indicator';
    indicator.className = 'narrative-entry dm';
    indicator.innerHTML = '<div class="speaker">Dungeon Master</div><div class="thinking-dots">Pensando<span>.</span><span>.</span><span>.</span></div>';
    log.appendChild(indicator);
    log.scrollTop = log.scrollHeight;
  }
}

function hideThinkingIndicator() {
  const indicator = document.getElementById('thinking-indicator');
  if (indicator) indicator.remove();
}

// --- IMAGE GENERATION (DALL-E 3) ---

const IMAGE_SETTING_CONTEXT = {
  dungeon: 'underground dungeon, stone walls, torches, dark mysterious atmosphere',
  forest: 'enchanted magical forest, ancient trees, fairy lights, mystical fog',
  castle: 'gothic cursed castle, haunted halls, cobwebs, dark shadows, moonlight',
  pirate: 'tropical pirate island, wooden ships, turquoise ocean, palm trees, treasure',
  volcano: 'volcanic temple interior, flowing lava, ancient stone ruins, fire glow, obsidian',
  random: 'fantasy landscape, magical and mysterious',
};

async function generateSceneImage(narrativeText, extraContext) {
  const setting = IMAGE_SETTING_CONTEXT[gameConfig.setting] || IMAGE_SETTING_CONTEXT.random;

  // Build context from previous scene descriptions for visual continuity
  const recentDescs = gameState.imageDescriptions.slice(-3).join('. ');

  const toneStyle = {
    kids: 'colorful and whimsical illustration, Pixar-like, warm and inviting',
    teens: 'dramatic fantasy illustration, vivid colors, cinematic lighting',
    adult: 'dark and gritty fantasy art, moody atmosphere, realistic details',
  };

  const style = toneStyle[gameConfig.tone] || toneStyle.teens;

  let prompt = `${style}, D&D tabletop RPG scene. Setting: ${setting}. Scene: ${narrativeText.substring(0, 300)}`;
  if (extraContext) prompt += `. ${extraContext}`;
  if (recentDescs) prompt += `. Previous scenes for visual continuity: ${recentDescs}`;
  prompt += '. No text or letters in the image. Painterly digital art, dramatic composition.';

  // Store description for future context
  gameState.imageDescriptions.push(narrativeText.substring(0, 100));
  if (gameState.imageDescriptions.length > 10) {
    gameState.imageDescriptions = gameState.imageDescriptions.slice(-8);
  }

  try {
    gameState.isGeneratingImage = true;
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.substring(0, 4000),
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('DALL-E error:', response.status, err);
      return null;
    }

    const data = await response.json();
    gameState.isGeneratingImage = false;
    return data.data[0].b64_json;
  } catch (error) {
    gameState.isGeneratingImage = false;
    console.error('Image generation error:', error);
    return null;
  }
}

function addImagePlaceholder(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const placeholder = document.createElement('div');
  placeholder.className = 'scene-image-container loading';
  placeholder.id = `img-placeholder-${Date.now()}`;
  placeholder.innerHTML = '<div class="image-loading"><div class="image-loading-spinner"></div><span>Generando imagen...</span></div>';
  container.appendChild(placeholder);
  container.scrollTop = container.scrollHeight;
  return placeholder.id;
}

function resolveImagePlaceholder(placeholderId, base64) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;
  const log = placeholder.closest('.narrative-log, .combat-log');
  if (base64) {
    placeholder.classList.remove('loading');
    placeholder.innerHTML = `<img src="data:image/png;base64,${base64}" alt="Escena de la aventura" class="scene-image">`;
  } else {
    placeholder.remove();
  }
  if (log) log.scrollTop = log.scrollHeight;
}

// --- STORY LOG ---

function logStory(type, title, text, imageBase64) {
  gameState.storyLog.push({
    type,
    title,
    text,
    imageBase64: imageBase64 || null,
    timestamp: new Date().toISOString(),
    room: gameState.roomCount,
  });
}

function updateLastStoryImage(base64) {
  // Find the last story entry without an image and add it
  for (let i = gameState.storyLog.length - 1; i >= 0; i--) {
    if (gameState.storyLog[i].type === 'scene' && !gameState.storyLog[i].imageBase64) {
      gameState.storyLog[i].imageBase64 = base64;
      return;
    }
  }
}

// --- UTILIDADES ---

function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollMultiple(count, sides) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(roll(sides));
  }
  return results;
}

function rollStat() {
  const rolls = rollMultiple(4, 6);
  rolls.sort((a, b) => a - b);
  const kept = rolls.slice(1);
  return { total: kept.reduce((a, b) => a + b, 0), rolls, kept };
}

function getMod(stat) {
  return Math.floor((stat - 10) / 2);
}

function modStr(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function getModForStat(character, statName) {
  return getMod(character.stats[statName]);
}

// --- PANTALLAS ---

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// --- SETUP ---

function setPlayerCount(count) {
  gameState.playerCount = count;
  document.querySelectorAll('.player-count-selector .btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`pc-${count}`).classList.add('active');
  renderPlayerNames();
  saveToLocalStorage();
}

function renderPlayerNames() {
  const container = document.getElementById('player-names-container');
  container.innerHTML = '';
  for (let i = 0; i < gameState.playerCount; i++) {
    const div = document.createElement('div');
    div.className = 'player-name-input';
    div.innerHTML = `
      <label>Jugador ${i + 1}:</label>
      <input type="text" id="player-name-${i}" placeholder="Nombre del jugador" value="${gameState.playerNames[i] || ''}">
    `;
    container.appendChild(div);
  }
}

function startCharacterCreation() {
  gameState.playerNames = [];
  for (let i = 0; i < gameState.playerCount; i++) {
    const input = document.getElementById(`player-name-${i}`);
    gameState.playerNames.push(input.value || `Jugador ${i + 1}`);
  }
  if (gameConfig.dmMode === 'human') {
    const dmInput = document.getElementById('dm-human-name');
    gameState.dmName = (dmInput && dmInput.value.trim()) || 'Dungeon Master';
  }
  gameState.characters = [];
  gameState.currentCharacterIndex = 0;
  saveToLocalStorage();
  showCharacterScreen();
}

// --- CHARACTER CREATION ---

let tempCharacter = {};

function showCharacterScreen() {
  const idx = gameState.currentCharacterIndex;
  document.getElementById('char-player-name').textContent = gameState.playerNames[idx];
  document.getElementById('char-name').value = '';
  tempCharacter = { race: null, class: null, stats: {} };

  renderRaceOptions();
  renderClassOptions();
  renderStats();
  showScreen('screen-character');
}

function renderRaceOptions() {
  const container = document.getElementById('race-options');
  container.innerHTML = RACES.map(r => `
    <div class="option-card ${tempCharacter.race === r.id ? 'selected' : ''}" onclick="selectRace('${r.id}')">
      <div class="icon">${r.icon}</div>
      <div class="name">${r.name}</div>
      <div class="desc">${r.desc}</div>
    </div>
  `).join('');
}

function renderClassOptions() {
  const container = document.getElementById('class-options');
  container.innerHTML = CLASSES.map(c => `
    <div class="option-card ${tempCharacter.class === c.id ? 'selected' : ''}" onclick="selectClass('${c.id}')">
      <div class="icon">${c.icon}</div>
      <div class="name">${c.name}</div>
      <div class="desc">${c.desc}</div>
    </div>
  `).join('');
}

function selectRace(raceId) {
  tempCharacter.race = raceId;
  renderRaceOptions();
}

function selectClass(classId) {
  tempCharacter.class = classId;
  renderClassOptions();
}

function renderStats() {
  const container = document.getElementById('stats-container');
  container.innerHTML = STAT_NAMES.map(stat => {
    const val = tempCharacter.stats[stat];
    return `
      <div class="stat-card">
        <div class="stat-name">${stat} (${STAT_FULL_NAMES[stat]})</div>
        <div class="stat-value">${val ? val.total : '?'}</div>
        <div class="stat-mod">${val ? modStr(getMod(val.total)) : ''}</div>
        <div class="stat-rolls">${val ? `[${val.rolls.join(', ')}]` : 'Sin tirar'}</div>
      </div>
    `;
  }).join('');
}

function rollAllStats() {
  STAT_NAMES.forEach(stat => {
    tempCharacter.stats[stat] = rollStat();
  });
  renderStats();

  document.querySelectorAll('.stat-card').forEach(card => {
    card.classList.add('dice-rolling');
    setTimeout(() => card.classList.remove('dice-rolling'), 500);
  });
}

function confirmCharacter() {
  const name = document.getElementById('char-name').value.trim();
  if (!name) { alert('Escribe un nombre para tu personaje!'); return; }
  if (!tempCharacter.race) { alert('Elige una raza!'); return; }
  if (!tempCharacter.class) { alert('Elige una clase!'); return; }
  if (!tempCharacter.stats.FUE) { alert('Tira las estadisticas!'); return; }

  const race = RACES.find(r => r.id === tempCharacter.race);
  const cls = CLASSES.find(c => c.id === tempCharacter.class);

  const stats = {};
  STAT_NAMES.forEach(stat => {
    stats[stat] = tempCharacter.stats[stat].total + (race.bonuses[stat] || 0);
  });

  const conMod = getMod(stats.CON);
  const maxHp = cls.hitDie + conMod;

  const character = {
    name,
    playerName: gameState.playerNames[gameState.currentCharacterIndex],
    race: race,
    class: cls,
    stats,
    maxHp,
    hp: maxHp,
    ac: cls.armor + (cls.id === 'barbaro' ? getMod(stats.CON) : 0),
    level: 1,
    weaponBonus: 0,
    spellSlots: cls.spells.length > 0 ? 3 : 0,
    maxSpellSlots: cls.spells.length > 0 ? 3 : 0,
  };

  gameState.characters.push(character);
  gameState.currentCharacterIndex++;
  saveToLocalStorage();

  if (gameState.currentCharacterIndex < gameState.playerCount) {
    showCharacterScreen();
  } else {
    startAdventure();
  }
}

// --- ADVENTURE (AI-POWERED) ---

function getPartyDescription() {
  return gameState.characters.map(c =>
    `${c.name} (${c.race.name} ${c.class.name}, HP: ${c.hp}/${c.maxHp}, CA: ${c.ac}, FUE:${c.stats.FUE} DES:${c.stats.DES} CON:${c.stats.CON} INT:${c.stats.INT} SAB:${c.stats.SAB} CAR:${c.stats.CAR})`
  ).join(', ');
}

function getGameStateForAI() {
  return `[ESTADO DEL GRUPO] ${getPartyDescription()}. Oro: ${gameState.gold}. XP: ${gameState.xp}. Inventario: ${gameState.inventory.map(i => i.name).join(', ') || 'vacio'}. Sala actual: ${gameState.roomCount} de ~15.`;
}

async function startAdventure() {
  gameState.gold = 0;
  gameState.inventory = [];
  gameState.xp = 0;
  gameState.roomCount = 0;
  gameState.aiHistory = [];
  gameState.storyLog = [];
  gameState.imageDescriptions = [];
  gameState.adventureStarted = true;
  showScreen('screen-adventure');
  document.getElementById('narrative-log').innerHTML = '';

  if (gameConfig.dmMode === 'ai') {
    const settingName = SETTING_NAMES[gameConfig.setting] || 'Mazmorra';
    const prompt = `${getGameStateForAI()}

Comienza una nueva aventura para este grupo de heroes. La ambientacion es: ${settingName}. Describe el inicio de la aventura. Esta es la sala 1. Genera la primera escena con 3 opciones para los jugadores.`;

    const response = await callAI(prompt);
    if (response) {
      processAIRoom(response);
    }
  } else {
    // Human DM mode
    addNarrative('dm', gameState.dmName, 'La aventura esta por comenzar... El Dungeon Master prepara la primera escena.');
    updatePartyStatus();
    renderHumanDMActions();
  }
}

function processAIRoom(response) {
  gameState.roomCount++;

  // Narrativa
  if (response.narrativa) {
    addNarrative('dm', `Dungeon Master (Sala ${gameState.roomCount})`, response.narrativa);
    logStory('scene', `Sala ${gameState.roomCount}`, response.narrativa);

    // Generate scene image asynchronously
    const placeholderId = addImagePlaceholder('narrative-log');
    generateSceneImage(response.narrativa).then(base64 => {
      resolveImagePlaceholder(placeholderId, base64);
      if (base64) updateLastStoryImage(base64);
    });
  }

  // XP
  if (response.xp && response.xp > 0) {
    gameState.xp += response.xp;
    addNarrative('success', 'Experiencia!', `El grupo gana ${response.xp} XP. (Total: ${gameState.xp} XP)`);
  }

  // Loot
  if (response.loot) {
    processAILoot(response.loot);
  }

  // Trampa
  if (response.trampa) {
    const targetIdx = Math.floor(Math.random() * gameState.characters.length);
    const target = gameState.characters[targetIdx];
    const dmg = roll(response.trampa.dano || 4) + roll(response.trampa.dano || 4);
    target.hp = Math.max(0, target.hp - dmg);
    addNarrative('combat-msg', 'Trampa!', `${response.trampa.descripcion || 'Una trampa se activa!'} ${target.name} recibe ${dmg} puntos de dano!`);
  }

  // Curacion
  if (response.curacion) {
    const amount = response.curacion.cantidad || 10;
    gameState.characters.forEach(c => {
      c.hp = Math.min(c.maxHp, c.hp + amount);
    });
    addNarrative('success', 'Curacion!', `${response.curacion.descripcion || 'El grupo se cura.'} Todos recuperan ${amount} HP!`);
  }

  // Fin de aventura
  if (response.esFinDeAventura) {
    showVictory();
    return;
  }

  // Combate
  if (response.combate && response.combate.enemigos && response.combate.enemigos.length > 0) {
    const validEnemies = response.combate.enemigos.filter(e => MONSTERS[e]);
    if (validEnemies.length > 0) {
      if (response.combate.descripcion) {
        addNarrative('combat-msg', 'Combate!', response.combate.descripcion);
      }
      updatePartyStatus();
      setTimeout(() => startCombat(validEnemies), 1500);
      return;
    }
  }

  // Opciones
  if (response.opciones && response.opciones.length > 0) {
    renderAIActions(response.opciones);
  }

  updatePartyStatus();
}

function processAILoot(loot) {
  if (loot.oro && loot.oro > 0) {
    gameState.gold += loot.oro;
    addNarrative('loot', 'Tesoro!', `Encuentran ${loot.oro} monedas de oro! (Total: ${gameState.gold})`);
  }
  if (loot.objetos) {
    loot.objetos.forEach(item => {
      if (item.tipo === 'pocion') {
        const potion = { name: item.nombre, type: 'potion', healing: item.curacion || 8 };
        gameState.inventory.push(potion);
        addNarrative('loot', 'Objeto!', `Encuentran: ${item.nombre} (cura ${potion.healing} HP).`);
      } else if (item.tipo === 'arma') {
        const bonus = item.bonus || 1;
        gameState.characters.forEach(c => {
          if (c.weaponBonus < bonus) c.weaponBonus = bonus;
        });
        addNarrative('loot', 'Arma!', `Encuentran: ${item.nombre}! (+${bonus} al dano).`);
      } else if (item.tipo === 'artefacto') {
        gameState.inventory.push({ name: item.nombre, type: 'artifact' });
        addNarrative('loot', 'Objeto legendario!', `Encuentran: ${item.nombre}!`);
      }
    });
  }
}

function renderAIActions(opciones) {
  const container = document.getElementById('adventure-actions');
  container.innerHTML = '<h4 style="color: var(--gold); margin-bottom: 8px;">Que hacen?</h4>';

  opciones.forEach((opcion, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    const typeIcons = { explorar: '🚶', combate: '⚔️', sigilo: '🤫', social: '🗣️', investigar: '🔍', magia: '✨' };
    const icon = typeIcons[opcion.tipo] || '▶️';
    btn.textContent = `${icon} ${opcion.texto}`;
    btn.onclick = () => makeAIChoice(opcion);
    container.appendChild(btn);
  });

  // Potion button
  const potions = gameState.inventory.filter(i => i.type === 'potion');
  if (potions.length > 0) {
    const injured = gameState.characters.find(c => c.hp < c.maxHp);
    if (injured) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = `🧪 Usar Pocion de Curacion (${potions.length} disponibles)`;
      btn.onclick = () => usePotion();
      container.appendChild(btn);
    }
  }

  // Custom action input
  const customDiv = document.createElement('div');
  customDiv.style.cssText = 'display:flex; gap:8px; margin-top:10px;';
  customDiv.innerHTML = `
    <input type="text" id="custom-action" placeholder="O escribe tu propia accion..." style="flex:1; padding:10px; border:2px solid var(--border); border-radius:8px; background:var(--bg-dark); color:var(--text); font-size:0.95em;">
    <button class="btn btn-primary" onclick="submitCustomAction()">Hacer</button>
  `;
  container.appendChild(customDiv);

  // Enter key support
  setTimeout(() => {
    const input = document.getElementById('custom-action');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitCustomAction();
      });
    }
  }, 100);
}

async function submitCustomAction() {
  const input = document.getElementById('custom-action');
  if (!input || !input.value.trim()) return;
  const action = input.value.trim();

  addNarrative('action', 'Accion libre', action);
  logStory('action', 'Accion libre', action);
  disableActions();

  const prompt = `${getGameStateForAI()}

Los heroes deciden: "${action}"

Narra lo que sucede como resultado de esta accion. Si requiere alguna tirada de habilidad, inclui un check apropiado en las opciones siguientes. Genera la siguiente escena.`;

  const response = await callAI(prompt);
  if (response) {
    processAIRoom(response);
  }
}

async function makeAIChoice(opcion) {
  addNarrative('action', 'Accion', opcion.texto);
  logStory('action', 'Accion', opcion.texto);
  disableActions();

  // Skill check
  if (opcion.check) {
    const check = opcion.check;
    const bestChar = gameState.characters.reduce((best, c) =>
      (c.stats[check.stat] || 10) > (best.stats[check.stat] || 10) ? c : best
    );
    const d20 = roll(20);
    const mod = getModForStat(bestChar, check.stat);
    const total = d20 + mod;
    const dc = check.dc || 12;

    let success;
    let resultText = `${bestChar.name} tira ${STAT_FULL_NAMES[check.stat] || check.stat}: 🎲 ${d20} ${modStr(mod)} = ${total} vs DC ${dc}`;

    if (d20 === 20) {
      resultText += ' - CRITICO! Exito automatico!';
      addNarrative('success', 'Prueba de habilidad', resultText);
      success = true;
    } else if (d20 === 1) {
      resultText += ' - PIFIA! Fallo automatico!';
      addNarrative('combat-msg', 'Prueba de habilidad', resultText);
      success = false;
    } else if (total >= dc) {
      resultText += ' - Exito!';
      addNarrative('success', 'Prueba de habilidad', resultText);
      success = true;
    } else {
      resultText += ' - Fallo!';
      addNarrative('combat-msg', 'Prueba de habilidad', resultText);
      success = false;
    }

    const prompt = `${getGameStateForAI()}

Los heroes eligieron: "${opcion.texto}" (tipo: ${opcion.tipo}).
Resultado de la tirada de ${STAT_FULL_NAMES[check.stat] || check.stat}: ${success ? 'EXITO' : 'FALLO'} (sacaron ${total} vs DC ${dc}${d20 === 20 ? ', critico natural 20!' : ''}${d20 === 1 ? ', pifia natural 1!' : ''}).

Narra las consecuencias ${success ? 'positivas' : 'negativas'} de este resultado. ${!success ? 'Puede haber consecuencias menores negativas (trampa, enemigos alertados, etc) pero no catastróficas.' : ''} Genera la siguiente escena.`;

    const response = await callAI(prompt);
    if (response) {
      processAIRoom(response);
    }
  } else {
    const prompt = `${getGameStateForAI()}

Los heroes eligieron: "${opcion.texto}" (tipo: ${opcion.tipo}).

Narra lo que sucede. Genera la siguiente escena.`;

    const response = await callAI(prompt);
    if (response) {
      processAIRoom(response);
    }
  }
}

function disableActions() {
  const container = document.getElementById('adventure-actions');
  container.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
  const input = document.getElementById('custom-action');
  if (input) input.disabled = true;
}

function usePotion() {
  const potionIdx = gameState.inventory.findIndex(i => i.type === 'potion');
  if (potionIdx === -1) return;
  const potion = gameState.inventory[potionIdx];
  gameState.inventory.splice(potionIdx, 1);

  const injured = gameState.characters.filter(c => c.hp < c.maxHp).sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
  if (injured.length === 0) return;

  const target = injured[0];
  const healAmount = potion.healing + roll(4);
  target.hp = Math.min(target.maxHp, target.hp + healAmount);

  addNarrative('success', 'Pocion!', `${target.name} bebe una pocion y recupera ${healAmount} HP! (${target.hp}/${target.maxHp})`);
  updatePartyStatus();
}

function addNarrative(type, title, text) {
  const log = document.getElementById('narrative-log');
  const entry = document.createElement('div');
  entry.className = `narrative-entry ${type}`;
  entry.innerHTML = `<div class="speaker">${title}</div><div>${text}</div>`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updatePartyStatus() {
  const container = document.getElementById('party-status');
  container.innerHTML = `<h4 style="color: var(--gold); margin-bottom: 10px;">Grupo (${gameState.gold} 💰 | ${gameState.xp} XP | Sala ${gameState.roomCount})</h4>`;
  gameState.characters.forEach(c => {
    const hpPercent = (c.hp / c.maxHp) * 100;
    const barClass = hpPercent <= 25 ? 'low' : hpPercent <= 50 ? 'medium' : '';
    const member = document.createElement('div');
    member.className = 'party-member';
    member.innerHTML = `
      <div class="member-icon">${c.race.icon}</div>
      <div class="member-info">
        <div class="member-name">${c.name} (${c.playerName})</div>
        <div class="member-class">${c.race.name} ${c.class.name} | CA: ${c.ac}</div>
        <div class="hp-bar"><div class="hp-bar-fill ${barClass}" style="width: ${hpPercent}%"></div></div>
        <div class="hp-text">${c.hp}/${c.maxHp} HP${c.spellSlots > 0 ? ` | Hechizos: ${c.spellSlots}/${c.maxSpellSlots}` : ''}</div>
      </div>
    `;
    container.appendChild(member);
  });
}

// --- HUMAN DM MODE ---

function renderHumanDMActions() {
  const container = document.getElementById('adventure-actions');
  container.innerHTML = '';

  const toolbar = document.createElement('div');
  toolbar.className = 'dm-toolbar';
  toolbar.innerHTML = `
    <h4>Panel del Dungeon Master (${gameState.dmName})</h4>
    <textarea id="dm-narration" placeholder="Escribe la narrativa para los jugadores... (Que ven? Que escuchan? Que pasa?)"></textarea>
    <div class="dm-toolbar-row">
      <button class="btn btn-primary" onclick="dmSendNarration()">Narrar</button>
      <button class="btn btn-secondary" onclick="dmShowCombatPanel()">Iniciar Combate</button>
      <button class="btn btn-secondary" onclick="dmShowLootPanel()">Dar Loot</button>
      <button class="btn btn-secondary" onclick="dmShowTrapPanel()">Trampa</button>
      <button class="btn btn-secondary" onclick="dmHealParty()">Curar Grupo</button>
      <button class="btn btn-secondary" onclick="dmGiveXP()">Dar XP</button>
      <button class="btn btn-danger" onclick="dmEndAdventure()">Fin de Aventura</button>
    </div>
    <div id="dm-extra-panel"></div>
    <hr style="border-color: var(--border); margin: 5px 0;">
    <h4 style="font-size:0.85em; color: var(--text-dim);">Opciones para jugadores:</h4>
    <div style="display:flex; gap:8px;">
      <input type="text" id="dm-option-1" placeholder="Opcion 1" style="flex:1; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text); font-size:0.9em;">
      <input type="text" id="dm-option-2" placeholder="Opcion 2" style="flex:1; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text); font-size:0.9em;">
      <input type="text" id="dm-option-3" placeholder="Opcion 3" style="flex:1; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text); font-size:0.9em;">
    </div>
    <div class="dm-toolbar-row">
      <button class="btn btn-primary" onclick="dmSendOptions()">Enviar Opciones a Jugadores</button>
    </div>
  `;
  container.appendChild(toolbar);
}

function dmSendNarration() {
  const textarea = document.getElementById('dm-narration');
  if (!textarea || !textarea.value.trim()) return;
  gameState.roomCount++;
  const narration = textarea.value.trim();
  addNarrative('dm', `${gameState.dmName} (Sala ${gameState.roomCount})`, narration);
  logStory('scene', `Sala ${gameState.roomCount}`, narration);

  // Generate scene image for human DM narration too
  const placeholderId = addImagePlaceholder('narrative-log');
  generateSceneImage(narration).then(base64 => {
    resolveImagePlaceholder(placeholderId, base64);
    if (base64) updateLastStoryImage(base64);
  });

  textarea.value = '';
  updatePartyStatus();
}

function dmSendOptions() {
  const options = [];
  for (let i = 1; i <= 3; i++) {
    const input = document.getElementById(`dm-option-${i}`);
    if (input && input.value.trim()) {
      options.push(input.value.trim());
    }
  }
  if (options.length === 0) { alert('Escribe al menos una opcion!'); return; }

  // Switch to player view
  const container = document.getElementById('adventure-actions');
  container.innerHTML = '<h4 style="color: var(--gold); margin-bottom: 8px;">Que hacen?</h4>';

  options.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = text;
    btn.onclick = () => {
      addNarrative('action', 'Accion', text);
      // Show DM panel again for response
      renderHumanDMActions();
    };
    container.appendChild(btn);
  });

  // Custom action
  const customDiv = document.createElement('div');
  customDiv.style.cssText = 'display:flex; gap:8px; margin-top:10px;';
  customDiv.innerHTML = `
    <input type="text" id="player-custom-action" placeholder="O escribe tu propia accion..." style="flex:1; padding:10px; border:2px solid var(--border); border-radius:8px; background:var(--bg-dark); color:var(--text); font-size:0.95em;">
    <button class="btn btn-primary" onclick="dmPlayerCustomAction()">Hacer</button>
  `;
  container.appendChild(customDiv);
  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-secondary';
  backBtn.style.marginTop = '10px';
  backBtn.textContent = 'Volver al Panel DM';
  backBtn.onclick = () => renderHumanDMActions();
  container.appendChild(backBtn);
}

function dmPlayerCustomAction() {
  const input = document.getElementById('player-custom-action');
  if (!input || !input.value.trim()) return;
  addNarrative('action', 'Accion libre', input.value.trim());
  renderHumanDMActions();
}

function dmShowCombatPanel() {
  const panel = document.getElementById('dm-extra-panel');
  panel.innerHTML = `
    <h4 style="color: var(--red-light); margin: 8px 0 5px;">Seleccionar Enemigos:</h4>
    <div id="dm-selected-enemies" style="margin-bottom:8px; color: var(--gold); min-height:20px;"></div>
    <div class="dm-monster-select">
      ${Object.entries(MONSTERS).map(([id, m]) => `
        <button class="btn btn-small" onclick="dmAddEnemy('${id}')">${m.icon} ${m.name} (CR ${m.cr})</button>
      `).join('')}
    </div>
    <div class="dm-toolbar-row" style="margin-top:8px;">
      <button class="btn btn-danger" onclick="dmStartCombat()">Iniciar Combate!</button>
      <button class="btn btn-secondary" onclick="dmClearEnemies()">Limpiar</button>
      <button class="btn btn-secondary" onclick="document.getElementById('dm-extra-panel').innerHTML=''">Cancelar</button>
    </div>
  `;
  gameState._dmSelectedEnemies = [];
}

function dmAddEnemy(monsterId) {
  if (!gameState._dmSelectedEnemies) gameState._dmSelectedEnemies = [];
  gameState._dmSelectedEnemies.push(monsterId);
  const display = document.getElementById('dm-selected-enemies');
  display.textContent = gameState._dmSelectedEnemies.map(id => `${MONSTERS[id].icon} ${MONSTERS[id].name}`).join(', ');
}

function dmClearEnemies() {
  gameState._dmSelectedEnemies = [];
  const display = document.getElementById('dm-selected-enemies');
  if (display) display.textContent = '';
}

function dmStartCombat() {
  if (!gameState._dmSelectedEnemies || gameState._dmSelectedEnemies.length === 0) {
    alert('Selecciona al menos un enemigo!');
    return;
  }
  const enemies = [...gameState._dmSelectedEnemies];
  gameState._dmSelectedEnemies = [];
  addNarrative('combat-msg', 'Combate!', 'El Dungeon Master inicia un combate!');
  updatePartyStatus();
  setTimeout(() => startCombat(enemies), 500);
}

function dmShowLootPanel() {
  const panel = document.getElementById('dm-extra-panel');
  panel.innerHTML = `
    <h4 style="color: var(--gold); margin: 8px 0 5px;">Dar Tesoro:</h4>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <div style="flex:1; min-width:120px;">
        <label style="font-size:0.8em;">Oro:</label>
        <input type="number" id="dm-loot-gold" value="0" min="0" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text);">
      </div>
      <div style="flex:2; min-width:200px;">
        <label style="font-size:0.8em;">Pocion (HP que cura):</label>
        <input type="number" id="dm-loot-potion" value="0" min="0" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text);">
      </div>
      <div style="flex:2; min-width:200px;">
        <label style="font-size:0.8em;">Objeto especial (nombre):</label>
        <input type="text" id="dm-loot-item" placeholder="Ej: Espada de Fuego" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text);">
      </div>
    </div>
    <div class="dm-toolbar-row" style="margin-top:8px;">
      <button class="btn btn-primary" onclick="dmGiveLoot()">Dar Loot!</button>
      <button class="btn btn-secondary" onclick="document.getElementById('dm-extra-panel').innerHTML=''">Cancelar</button>
    </div>
  `;
}

function dmGiveLoot() {
  const goldInput = document.getElementById('dm-loot-gold');
  const potionInput = document.getElementById('dm-loot-potion');
  const itemInput = document.getElementById('dm-loot-item');

  const gold = parseInt(goldInput.value) || 0;
  const potionHeal = parseInt(potionInput.value) || 0;
  const itemName = itemInput ? itemInput.value.trim() : '';

  if (gold > 0) {
    gameState.gold += gold;
    addNarrative('loot', 'Tesoro!', `Encuentran ${gold} monedas de oro! (Total: ${gameState.gold})`);
  }
  if (potionHeal > 0) {
    gameState.inventory.push({ name: 'Pocion de Curacion', type: 'potion', healing: potionHeal });
    addNarrative('loot', 'Objeto!', `Encuentran: Pocion de Curacion (cura ${potionHeal} HP).`);
  }
  if (itemName) {
    gameState.inventory.push({ name: itemName, type: 'artifact' });
    addNarrative('loot', 'Objeto!', `Encuentran: ${itemName}!`);
  }

  document.getElementById('dm-extra-panel').innerHTML = '';
  updatePartyStatus();
}

function dmShowTrapPanel() {
  const panel = document.getElementById('dm-extra-panel');
  panel.innerHTML = `
    <h4 style="color: var(--red-light); margin: 8px 0 5px;">Trampa:</h4>
    <div style="display:flex; gap:8px;">
      <div style="flex:1;">
        <label style="font-size:0.8em;">Dano (dado):</label>
        <select id="dm-trap-die" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text);">
          <option value="4">d4 (leve)</option>
          <option value="6" selected>d6 (moderado)</option>
          <option value="8">d8 (fuerte)</option>
          <option value="10">d10 (severo)</option>
        </select>
      </div>
      <div style="flex:2;">
        <label style="font-size:0.8em;">Descripcion:</label>
        <input type="text" id="dm-trap-desc" value="Una trampa se activa!" style="width:100%; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg-dark); color:var(--text);">
      </div>
    </div>
    <div class="dm-toolbar-row" style="margin-top:8px;">
      <button class="btn btn-danger" onclick="dmActivateTrap()">Activar Trampa!</button>
      <button class="btn btn-secondary" onclick="document.getElementById('dm-extra-panel').innerHTML=''">Cancelar</button>
    </div>
  `;
}

function dmActivateTrap() {
  const die = parseInt(document.getElementById('dm-trap-die').value) || 6;
  const desc = document.getElementById('dm-trap-desc').value || 'Una trampa se activa!';
  const targetIdx = Math.floor(Math.random() * gameState.characters.length);
  const target = gameState.characters[targetIdx];
  const dmg = roll(die) + roll(die);
  target.hp = Math.max(0, target.hp - dmg);
  addNarrative('combat-msg', 'Trampa!', `${desc} ${target.name} recibe ${dmg} puntos de dano!`);
  document.getElementById('dm-extra-panel').innerHTML = '';
  updatePartyStatus();
}

function dmHealParty() {
  const amount = parseInt(prompt('Cuantos HP recupera cada personaje?', '10')) || 0;
  if (amount <= 0) return;
  gameState.characters.forEach(c => {
    c.hp = Math.min(c.maxHp, c.hp + amount);
  });
  addNarrative('success', 'Curacion!', `El grupo se cura. Todos recuperan ${amount} HP!`);
  updatePartyStatus();
}

function dmGiveXP() {
  const amount = parseInt(prompt('Cuantos XP gana el grupo?', '50')) || 0;
  if (amount <= 0) return;
  gameState.xp += amount;
  addNarrative('success', 'Experiencia!', `El grupo gana ${amount} XP! (Total: ${gameState.xp} XP)`);
  updatePartyStatus();
}

function dmEndAdventure() {
  if (confirm('Terminar la aventura con victoria?')) {
    showVictory();
  }
}

// --- COMBAT SYSTEM ---

function startCombat(enemyIds) {
  const enemies = enemyIds.map((id, i) => {
    const template = MONSTERS[id];
    return {
      ...template,
      id: `enemy_${i}`,
      maxHp: template.hp,
      isEnemy: true,
    };
  });

  const combatants = [];

  gameState.characters.forEach(c => {
    const initRoll = roll(20);
    const mod = getModForStat(c, 'DES');
    combatants.push({
      ...c,
      initiative: initRoll + mod,
      initRoll,
      isEnemy: false,
      ref: c,
    });
  });

  enemies.forEach(e => {
    const initRoll = roll(20);
    combatants.push({
      ...e,
      initiative: initRoll,
      initRoll,
    });
  });

  combatants.sort((a, b) => b.initiative - a.initiative);

  gameState.combat = {
    combatants,
    currentTurn: 0,
    round: 1,
  };

  showScreen('screen-combat');
  document.getElementById('combat-log').innerHTML = '';

  addCombatLog('info', `⚔️ COMBATE - Ronda ${gameState.combat.round}`);

  // Generate combat image
  const enemyNames = enemies.map(e => e.name).join(', ');
  const combatDesc = `Epic battle scene: heroes fighting against ${enemyNames}`;
  logStory('combat', 'Combate!', `Los heroes se enfrentan a: ${enemyNames}`);
  const combatPlaceholderId = addImagePlaceholder('combat-log');
  generateSceneImage(combatDesc, 'action combat scene, dynamic poses, weapons clashing, magical effects').then(base64 => {
    resolveImagePlaceholder(combatPlaceholderId, base64);
    if (base64) {
      const combatEntry = gameState.storyLog.find(e => e.type === 'combat' && !e.imageBase64);
      if (combatEntry) combatEntry.imageBase64 = base64;
    }
  });

  combatants.forEach(c => {
    const type = c.isEnemy ? 'enemy-turn' : 'info';
    addCombatLog(type, `${c.isEnemy ? c.icon : c.race.icon} ${c.name}: Iniciativa ${c.initRoll} ${c.isEnemy ? '' : modStr(getModForStat(c.ref || c, 'DES'))} = ${c.initiative}`);
  });

  updateTurnOrder();
  processTurn();
}

function addCombatLog(type, text) {
  const log = document.getElementById('combat-log');
  const entry = document.createElement('div');
  entry.className = `combat-log-entry ${type}`;
  entry.innerHTML = text;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateTurnOrder() {
  const container = document.getElementById('turn-order');
  const combat = gameState.combat;
  container.innerHTML = '<h4>Orden de Turno</h4>';

  combat.combatants.forEach((c, i) => {
    const isActive = i === combat.currentTurn;
    const isDead = c.hp <= 0;
    const isEnemyClass = c.isEnemy ? 'enemy' : '';
    const activeClass = isActive ? 'active-turn' : '';
    const deadClass = isDead ? 'dead' : '';

    const entry = document.createElement('div');
    entry.className = `turn-entry ${isEnemyClass} ${activeClass} ${deadClass}`;
    entry.innerHTML = `
      <span class="turn-init">${c.initiative}</span>
      <span>${c.isEnemy ? c.icon : c.race.icon} ${c.name}</span>
      <span style="margin-left:auto">${c.hp}/${c.maxHp}</span>
    `;
    container.appendChild(entry);
  });
}

function processTurn() {
  const combat = gameState.combat;
  if (!combat) return;

  const livingEnemies = combat.combatants.filter(c => c.isEnemy && c.hp > 0);
  const livingPlayers = combat.combatants.filter(c => !c.isEnemy && c.hp > 0);

  if (livingEnemies.length === 0) {
    endCombat(true);
    return;
  }
  if (livingPlayers.length === 0) {
    endCombat(false);
    return;
  }

  const current = combat.combatants[combat.currentTurn];

  if (current.hp <= 0) {
    nextTurn();
    return;
  }

  updateTurnOrder();

  if (current.isEnemy) {
    setTimeout(() => enemyTurn(current), 800);
  } else {
    showPlayerCombatActions(current);
  }
}

function showPlayerCombatActions(player) {
  const container = document.getElementById('combat-actions');
  container.innerHTML = `<h4>Turno de ${player.name}</h4>`;

  const attackBtn = document.createElement('button');
  attackBtn.className = 'btn';
  attackBtn.textContent = `⚔️ Atacar con ${player.class.weapon}`;
  attackBtn.onclick = () => showTargetSelect(player, 'attack');
  container.appendChild(attackBtn);

  if (player.ref && player.ref.spellSlots > 0 && player.class.spells.length > 0) {
    player.class.spells.forEach(spell => {
      const spellBtn = document.createElement('button');
      spellBtn.className = 'btn btn-secondary';
      spellBtn.textContent = `✨ ${spell}`;
      spellBtn.onclick = () => {
        if (spell === 'Curar Heridas') {
          showHealTargetSelect(player, spell);
        } else if (spell === 'Bendicion') {
          castBlessingSpell(player);
        } else if (spell === 'Escudo Magico') {
          castShieldSpell(player);
        } else {
          showTargetSelect(player, 'spell', spell);
        }
      };
      container.appendChild(spellBtn);
    });
  }

  const potions = gameState.inventory.filter(i => i.type === 'potion');
  if (potions.length > 0) {
    const potionBtn = document.createElement('button');
    potionBtn.className = 'btn btn-secondary';
    potionBtn.textContent = `🧪 Usar Pocion (${potions.length})`;
    potionBtn.onclick = () => useCombatPotion(player);
    container.appendChild(potionBtn);
  }
}

function showTargetSelect(player, actionType, spell) {
  const combat = gameState.combat;
  const livingEnemies = combat.combatants.filter(c => c.isEnemy && c.hp > 0);
  const container = document.getElementById('combat-actions');

  const targetDiv = document.createElement('div');
  targetDiv.className = 'target-select';
  targetDiv.innerHTML = '<strong>Elegir objetivo:</strong>';

  livingEnemies.forEach(enemy => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-small';
    btn.textContent = `${enemy.icon} ${enemy.name} (${enemy.hp}/${enemy.maxHp} HP)`;
    btn.onclick = () => {
      if (actionType === 'attack') {
        playerAttack(player, enemy);
      } else if (actionType === 'spell') {
        castOffensiveSpell(player, enemy, spell);
      }
    };
    targetDiv.appendChild(btn);
  });

  container.appendChild(targetDiv);
}

function showHealTargetSelect(player, spell) {
  const combat = gameState.combat;
  const livingPlayers = combat.combatants.filter(c => !c.isEnemy && c.hp > 0);
  const container = document.getElementById('combat-actions');

  const targetDiv = document.createElement('div');
  targetDiv.className = 'target-select';
  targetDiv.innerHTML = '<strong>A quien curar?</strong>';

  livingPlayers.forEach(target => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary btn-small';
    btn.textContent = `${target.race.icon} ${target.name} (${target.hp}/${target.maxHp} HP)`;
    btn.onclick = () => castHealSpell(player, target, spell);
    targetDiv.appendChild(btn);
  });

  container.appendChild(targetDiv);
}

function playerAttack(attacker, target) {
  const d20 = roll(20);
  const primaryStat = attacker.class.primaryStat;
  const atkMod = getModForStat(attacker.ref || attacker, primaryStat);
  const total = d20 + atkMod;

  let logText = `${attacker.race.icon} ${attacker.name} ataca a ${target.icon} ${target.name}: 🎲 ${d20} ${modStr(atkMod)} = ${total} vs CA ${target.ac}`;

  if (d20 === 1) {
    logText += ' - PIFIA!';
    addCombatLog('miss', logText);
  } else if (d20 === 20) {
    const dmgDice = rollMultiple(2, attacker.class.weaponDie);
    const dmg = dmgDice.reduce((a, b) => a + b, 0) + atkMod + (attacker.ref ? attacker.ref.weaponBonus : 0);
    const finalDmg = Math.max(1, dmg);
    target.hp = Math.max(0, target.hp - finalDmg);
    logText += ` - 💥 CRITICO! Dano: ${finalDmg} (${dmgDice.join('+')} ${modStr(atkMod)})`;
    addCombatLog('critical', logText);
    shakeCombatLog();
  } else if (total >= target.ac) {
    const dmgRoll = roll(attacker.class.weaponDie);
    const dmg = dmgRoll + atkMod + (attacker.ref ? attacker.ref.weaponBonus : 0);
    const finalDmg = Math.max(1, dmg);
    target.hp = Math.max(0, target.hp - finalDmg);
    logText += ` - Impacto! Dano: ${finalDmg}`;
    addCombatLog('hit', logText);
  } else {
    logText += ' - Falla!';
    addCombatLog('miss', logText);
  }

  if (target.hp <= 0) {
    addCombatLog('hit', `💀 ${target.icon} ${target.name} ha sido derrotado!`);
  }

  updateTurnOrder();
  nextTurn();
}

function castOffensiveSpell(caster, target, spell) {
  if (caster.ref) caster.ref.spellSlots--;

  const intMod = getModForStat(caster.ref || caster, caster.class.primaryStat);
  let dmg = 0;
  let desc = '';

  if (spell === 'Bola de Fuego') {
    const dice = rollMultiple(3, 6);
    dmg = dice.reduce((a, b) => a + b, 0);
    desc = `🔥 ${caster.name} lanza Bola de Fuego! (${dice.join('+')} = ${dmg} dano de fuego)`;
    const combat = gameState.combat;
    const livingEnemies = combat.combatants.filter(c => c.isEnemy && c.hp > 0);
    livingEnemies.forEach(enemy => {
      const saveDC = 8 + intMod + 2;
      const saveRoll = roll(20);
      if (saveRoll >= saveDC) {
        const halfDmg = Math.floor(dmg / 2);
        enemy.hp = Math.max(0, enemy.hp - halfDmg);
        desc += `\n${enemy.icon} ${enemy.name} esquiva parcialmente (${halfDmg} dano)`;
      } else {
        enemy.hp = Math.max(0, enemy.hp - dmg);
        desc += `\n${enemy.icon} ${enemy.name} recibe ${dmg} dano!`;
      }
      if (enemy.hp <= 0) desc += ` 💀 Derrotado!`;
    });
    addCombatLog('critical', desc);
  } else if (spell === 'Rayo de Escarcha') {
    const d20 = roll(20);
    const total = d20 + intMod;
    dmg = roll(8) + roll(8);
    desc = `❄️ ${caster.name} lanza Rayo de Escarcha a ${target.name}: 🎲 ${d20} ${modStr(intMod)} = ${total}`;
    if (total >= target.ac) {
      target.hp = Math.max(0, target.hp - dmg);
      desc += ` - Impacto! ${dmg} dano de frio!`;
      if (target.hp <= 0) desc += ` 💀 Derrotado!`;
      addCombatLog('hit', desc);
    } else {
      desc += ` - Falla!`;
      addCombatLog('miss', desc);
    }
  } else if (spell === 'Palabra Sagrada') {
    dmg = roll(8) + roll(8) + intMod;
    target.hp = Math.max(0, target.hp - dmg);
    desc = `✨ ${caster.name} pronuncia una Palabra Sagrada contra ${target.name}! ${dmg} dano radiante!`;
    if (target.hp <= 0) desc += ` 💀 Derrotado!`;
    addCombatLog('hit', desc);
  } else if (spell === 'Marca del Cazador') {
    dmg = roll(6) + roll(caster.class.weaponDie) + intMod;
    target.hp = Math.max(0, target.hp - dmg);
    desc = `🎯 ${caster.name} marca a ${target.name} y dispara! ${dmg} dano!`;
    if (target.hp <= 0) desc += ` 💀 Derrotado!`;
    addCombatLog('hit', desc);
  }

  updateTurnOrder();
  nextTurn();
}

function castHealSpell(caster, target, spell) {
  if (caster.ref) caster.ref.spellSlots--;
  const sabMod = getModForStat(caster.ref || caster, 'SAB');
  const healAmount = roll(8) + sabMod;
  const actualTarget = target.ref || target;
  actualTarget.hp = Math.min(actualTarget.maxHp, actualTarget.hp + healAmount);
  target.hp = actualTarget.hp;

  addCombatLog('heal', `💚 ${caster.name} cura a ${target.name} por ${healAmount} HP! (${actualTarget.hp}/${actualTarget.maxHp})`);
  updateTurnOrder();
  nextTurn();
}

function castBlessingSpell(caster) {
  if (caster.ref) caster.ref.spellSlots--;
  const combat = gameState.combat;
  const livingPlayers = combat.combatants.filter(c => !c.isEnemy && c.hp > 0);
  livingPlayers.forEach(p => {
    if (p.ref) p.ref.ac += 1;
    p.ac += 1;
  });
  addCombatLog('heal', `🙏 ${caster.name} bendice al grupo! +1 CA para todos!`);
  updateTurnOrder();
  nextTurn();
}

function castShieldSpell(caster) {
  if (caster.ref) caster.ref.spellSlots--;
  if (caster.ref) caster.ref.ac += 3;
  caster.ac += 3;
  addCombatLog('heal', `🛡️ ${caster.name} conjura Escudo Magico! +3 CA hasta el final del combate!`);
  updateTurnOrder();
  nextTurn();
}

function useCombatPotion(player) {
  const potionIdx = gameState.inventory.findIndex(i => i.type === 'potion');
  if (potionIdx === -1) return;
  const potion = gameState.inventory[potionIdx];
  gameState.inventory.splice(potionIdx, 1);

  const heal = potion.healing + roll(4);
  const target = player.ref || player;
  target.hp = Math.min(target.maxHp, target.hp + heal);
  player.hp = target.hp;

  addCombatLog('heal', `🧪 ${player.name} bebe una pocion y recupera ${heal} HP! (${target.hp}/${target.maxHp})`);
  updateTurnOrder();
  nextTurn();
}

function enemyTurn(enemy) {
  const combat = gameState.combat;
  const livingPlayers = combat.combatants.filter(c => !c.isEnemy && c.hp > 0);
  if (livingPlayers.length === 0) { nextTurn(); return; }

  livingPlayers.sort((a, b) => a.hp - b.hp);
  const target = Math.random() < 0.6 ? livingPlayers[0] : livingPlayers[Math.floor(Math.random() * livingPlayers.length)];

  const d20 = roll(20);
  const total = d20 + enemy.attackMod;
  const targetAc = target.ref ? target.ref.ac : target.ac;

  let logText = `${enemy.icon} ${enemy.name} ataca a ${target.race.icon} ${target.name}: 🎲 ${d20} ${modStr(enemy.attackMod)} = ${total} vs CA ${targetAc}`;

  if (d20 === 1) {
    logText += ' - PIFIA!';
    addCombatLog('miss', logText);
  } else if (d20 === 20) {
    const dmg = roll(enemy.damageDie) + roll(enemy.damageDie) + enemy.damageBonus;
    const actualTarget = target.ref || target;
    actualTarget.hp = Math.max(0, actualTarget.hp - dmg);
    target.hp = actualTarget.hp;
    logText += ` - 💥 CRITICO! Dano: ${dmg}`;
    addCombatLog('critical', logText);
    shakeCombatLog();
  } else if (total >= targetAc) {
    const dmg = roll(enemy.damageDie) + enemy.damageBonus;
    const actualTarget = target.ref || target;
    actualTarget.hp = Math.max(0, actualTarget.hp - dmg);
    target.hp = actualTarget.hp;
    logText += ` - Impacto! Dano: ${dmg}`;
    addCombatLog('enemy-turn', logText);
  } else {
    logText += ' - Falla!';
    addCombatLog('miss', logText);
  }

  if (target.hp <= 0) {
    addCombatLog('enemy-turn', `💀 ${target.race.icon} ${target.name} ha caido!`);
  }

  updateTurnOrder();
  nextTurn();
}

function nextTurn() {
  const combat = gameState.combat;
  if (!combat) return;

  combat.currentTurn++;
  if (combat.currentTurn >= combat.combatants.length) {
    combat.currentTurn = 0;
    combat.round++;
    addCombatLog('info', `⚔️ Ronda ${combat.round}`);
  }

  setTimeout(() => processTurn(), 500);
}

function shakeCombatLog() {
  const log = document.getElementById('combat-log');
  log.classList.add('shake');
  setTimeout(() => log.classList.remove('shake'), 400);
}

async function endCombat(victory) {
  const combat = gameState.combat;

  if (victory) {
    let totalXp = 0;
    combat.combatants.filter(c => c.isEnemy).forEach(e => {
      totalXp += e.xp || 0;
    });
    gameState.xp += totalXp;

    addCombatLog('info', `🎉 Victoria! El grupo gana ${totalXp} XP! (Total: ${gameState.xp} XP)`);
    logStory('combat-end', 'Victoria en combate', `Los heroes derrotaron a los enemigos y ganaron ${totalXp} XP.`);

    combat.combatants.filter(c => !c.isEnemy).forEach(c => {
      if (c.ref) c.ref.hp = c.hp;
    });

    setTimeout(async () => {
      showScreen('screen-adventure');
      addNarrative('success', 'Victoria en combate!', 'Los enemigos han sido derrotados!');
      updatePartyStatus();
      gameState.combat = null;

      if (gameConfig.dmMode === 'human') {
        renderHumanDMActions();
      } else {
        const defeatedEnemies = combat.combatants.filter(c => c.isEnemy).map(e => e.name).join(', ');
        const prompt = `${getGameStateForAI()}

Los heroes acaban de ganar un combate contra: ${defeatedEnemies}. Narra brevemente la escena post-combate. Puede haber loot, pistas, o el camino que sigue. Genera la siguiente escena con opciones.`;

        const response = await callAI(prompt);
        if (response) {
          processAIRoom(response);
        }
      }
    }, 2000);
  } else {
    addCombatLog('info', '💀 El grupo ha sido derrotado...');
    logStory('combat-end', 'Derrota en combate', 'Los heroes han caido ante sus enemigos...');
    setTimeout(() => {
      showDefeat();
      gameState.combat = null;
    }, 2000);
  }
}

// --- VICTORY / DEFEAT ---

function showVictory() {
  logStory('victory', 'Victoria!', 'Los heroes han completado la aventura!');

  // Generate a final epic victory image
  const victoryDesc = `Triumphant heroes celebrating victory, epic fantasy scene, golden light, treasure and glory, ${IMAGE_SETTING_CONTEXT[gameConfig.setting] || 'fantasy landscape'}`;
  generateSceneImage(victoryDesc, 'victorious celebration, heroic poses, dramatic golden lighting').then(base64 => {
    if (base64) {
      const entry = gameState.storyLog[gameState.storyLog.length - 1];
      if (entry && entry.type === 'victory') entry.imageBase64 = base64;
      // Update the end screen image if visible
      const imgContainer = document.getElementById('end-scene-image');
      if (imgContainer) {
        imgContainer.innerHTML = `<img src="data:image/png;base64,${base64}" alt="Victoria" class="scene-image">`;
      }
    }
  });

  const content = document.getElementById('end-content');
  content.className = 'end-content victory';
  content.innerHTML = `
    <h2>🏆 VICTORIA! 🏆</h2>
    <div id="end-scene-image" class="scene-image-container loading"><div class="image-loading"><div class="image-loading-spinner"></div><span>Generando imagen final...</span></div></div>
    <p>Los heroes han completado la aventura!</p>
    <p>Ambientacion: ${SETTING_NAMES[gameConfig.setting] || 'Mazmorra'} | DM: ${gameConfig.dmMode === 'ai' ? 'IA' : gameState.dmName}</p>
    <p>Oro total: ${gameState.gold} 💰</p>
    <p>Experiencia total: ${gameState.xp} XP</p>
    <p>Salas exploradas: ${gameState.roomCount}</p>
    <p>Objetos encontrados: ${gameState.inventory.map(i => i.name).join(', ') || 'ninguno'}</p>
    <br>
    <h3>Los Heroes</h3>
    ${gameState.characters.map(c => `
      <p>${c.race.icon} <strong>${c.name}</strong> - ${c.race.name} ${c.class.name} (${c.hp}/${c.maxHp} HP)</p>
    `).join('')}
    <br>
    <p><em>La leyenda de estos heroes se contara por generaciones!</em></p>
    <button onclick="downloadAdventureHTML()" class="btn btn-primary btn-large" style="margin-top:15px;">📜 Descargar Cronica de Aventura</button>
  `;
  showScreen('screen-end');
}

function showDefeat() {
  logStory('defeat', 'Derrota', 'Los heroes han caido...');

  const defeatDesc = `Fallen heroes defeated in battle, dark dramatic scene, somber atmosphere, ${IMAGE_SETTING_CONTEXT[gameConfig.setting] || 'fantasy landscape'}`;
  generateSceneImage(defeatDesc, 'fallen warriors, dramatic shadows, somber mood').then(base64 => {
    if (base64) {
      const entry = gameState.storyLog[gameState.storyLog.length - 1];
      if (entry && entry.type === 'defeat') entry.imageBase64 = base64;
      const imgContainer = document.getElementById('end-scene-image');
      if (imgContainer) {
        imgContainer.innerHTML = `<img src="data:image/png;base64,${base64}" alt="Derrota" class="scene-image">`;
      }
    }
  });

  const content = document.getElementById('end-content');
  content.className = 'end-content defeat';
  content.innerHTML = `
    <h2>💀 Derrota 💀</h2>
    <div id="end-scene-image" class="scene-image-container loading"><div class="image-loading"><div class="image-loading-spinner"></div><span>Generando imagen final...</span></div></div>
    <p>Los heroes han caido en las profundidades de la mazmorra...</p>
    <p>Oro acumulado: ${gameState.gold} 💰</p>
    <p>Experiencia acumulada: ${gameState.xp} XP</p>
    <br>
    <p><em>Pero toda derrota es una leccion. Nuevos heroes se alzaran!</em></p>
    <button onclick="downloadAdventureHTML()" class="btn btn-primary btn-large" style="margin-top:15px;">📜 Descargar Cronica de Aventura</button>
  `;
  showScreen('screen-end');
}

// --- ADVENTURE CHRONICLE (HTML EXPORT) ---

function buildAdventureHTML() {
  const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const settingName = SETTING_NAMES[gameConfig.setting] || 'Mazmorra';
  const isVictory = gameState.storyLog.some(e => e.type === 'victory');
  const heroesHTML = gameState.characters.map(c => `
    <div class="hero-card">
      <span class="hero-icon">${c.race.icon}</span>
      <div class="hero-info">
        <strong>${c.name}</strong> (${c.playerName})<br>
        ${c.race.name} ${c.class.name} | HP: ${c.hp}/${c.maxHp} | CA: ${c.ac}<br>
        FUE:${c.stats.FUE} DES:${c.stats.DES} CON:${c.stats.CON} INT:${c.stats.INT} SAB:${c.stats.SAB} CAR:${c.stats.CAR}
      </div>
    </div>
  `).join('');

  const storyEntriesHTML = gameState.storyLog.map(entry => {
    const typeClass = entry.type;
    const imageHTML = entry.imageBase64
      ? `<div class="chronicle-image"><img src="data:image/png;base64,${entry.imageBase64}" alt="${entry.title}"></div>`
      : '';

    let icon = '';
    if (entry.type === 'scene') icon = '📖';
    else if (entry.type === 'action') icon = '⚡';
    else if (entry.type === 'combat') icon = '⚔️';
    else if (entry.type === 'combat-end') icon = '🏅';
    else if (entry.type === 'victory') icon = '🏆';
    else if (entry.type === 'defeat') icon = '💀';

    return `
      <div class="chronicle-entry ${typeClass}">
        ${imageHTML}
        <div class="chronicle-text">
          <div class="chronicle-title">${icon} ${entry.title}</div>
          <p>${entry.text}</p>
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cronica: ${settingName} - ${date}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', 'Georgia', serif;
    background: #0a0a14;
    color: #e0d8c8;
    line-height: 1.7;
  }
  .chronicle-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .chronicle-header {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(180deg, #1a1a2e 0%, #0a0a14 100%);
    border-bottom: 2px solid #e6a817;
    margin-bottom: 40px;
  }
  .chronicle-header h1 {
    font-size: 2.5em;
    color: #e6a817;
    text-shadow: 0 0 30px rgba(230, 168, 23, 0.3);
    margin-bottom: 10px;
  }
  .chronicle-header .subtitle {
    font-size: 1.2em;
    color: #a89070;
    font-style: italic;
  }
  .chronicle-header .meta {
    margin-top: 15px;
    font-size: 0.9em;
    color: #7a7060;
  }
  .heroes-section {
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 40px;
  }
  .heroes-section h2 {
    color: #e6a817;
    margin-bottom: 15px;
    font-size: 1.4em;
  }
  .hero-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: #12121e;
    border-radius: 8px;
    margin-bottom: 8px;
    border-left: 3px solid #e6a817;
  }
  .hero-icon { font-size: 2em; }
  .hero-info { font-size: 0.95em; line-height: 1.5; }
  .hero-info strong { color: #e6a817; }
  .chronicle-entry {
    margin-bottom: 35px;
    background: #12121e;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #222;
  }
  .chronicle-entry.scene { border-left: 4px solid #e6a817; }
  .chronicle-entry.action { border-left: 4px solid #4a9eff; }
  .chronicle-entry.combat { border-left: 4px solid #ff4444; }
  .chronicle-entry.combat-end { border-left: 4px solid #44cc44; }
  .chronicle-entry.victory { border-left: 4px solid #ffd700; }
  .chronicle-entry.defeat { border-left: 4px solid #8b0000; }
  .chronicle-image {
    width: 100%;
    overflow: hidden;
  }
  .chronicle-image img {
    width: 100%;
    height: auto;
    display: block;
  }
  .chronicle-text {
    padding: 20px;
  }
  .chronicle-title {
    font-size: 1.15em;
    font-weight: bold;
    color: #e6a817;
    margin-bottom: 8px;
  }
  .chronicle-text p {
    color: #c8c0b0;
    font-size: 1.05em;
  }
  .chronicle-footer {
    text-align: center;
    padding: 40px 20px;
    border-top: 2px solid #e6a817;
    margin-top: 40px;
  }
  .chronicle-footer h2 {
    color: ${isVictory ? '#ffd700' : '#8b0000'};
    font-size: 2em;
    margin-bottom: 15px;
  }
  .stats-grid {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .stat-box {
    text-align: center;
    padding: 15px;
    background: #1a1a2e;
    border-radius: 8px;
    min-width: 100px;
  }
  .stat-box .value {
    font-size: 1.8em;
    color: #e6a817;
    font-weight: bold;
  }
  .stat-box .label {
    font-size: 0.85em;
    color: #7a7060;
    margin-top: 5px;
  }
  .watermark {
    margin-top: 30px;
    font-size: 0.8em;
    color: #444;
    font-style: italic;
  }
</style>
</head>
<body>
<div class="chronicle-header">
  <h1>⚔️ Cronica de Aventura ⚔️</h1>
  <div class="subtitle">${settingName}</div>
  <div class="meta">${date} | Dificultad: ${gameConfig.difficulty} | DM: ${gameConfig.dmMode === 'ai' ? 'IA' : gameState.dmName}</div>
</div>
<div class="chronicle-container">
  <div class="heroes-section">
    <h2>🛡️ Los Heroes</h2>
    ${heroesHTML}
  </div>
  <h2 style="color: #e6a817; margin-bottom: 25px; font-size: 1.6em; text-align: center;">📜 La Historia</h2>
  ${storyEntriesHTML}
  <div class="chronicle-footer">
    <h2>${isVictory ? '🏆 Victoria! 🏆' : '💀 Derrota 💀'}</h2>
    <p>${isVictory ? 'La leyenda de estos heroes se contara por generaciones!' : 'Pero toda derrota es una leccion. Nuevos heroes se alzaran!'}</p>
    <div class="stats-grid">
      <div class="stat-box"><div class="value">${gameState.roomCount}</div><div class="label">Salas</div></div>
      <div class="stat-box"><div class="value">${gameState.gold}</div><div class="label">Oro</div></div>
      <div class="stat-box"><div class="value">${gameState.xp}</div><div class="label">XP</div></div>
    </div>
    <div class="watermark">Generado con D&D Aventura Familiar</div>
  </div>
</div>
</body>
</html>`;
}

function downloadAdventureHTML() {
  const html = buildAdventureHTML();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  const setting = gameConfig.setting || 'aventura';
  a.href = url;
  a.download = `partida_${setting}_${timestamp}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- FREE DICE ROLLER ---

function setDiceCount(count) {
  gameState.diceCount = count;
  document.querySelectorAll('.dice-count-selector .btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`dc-${count}`).classList.add('active');
}

function rollFreeDice(sides) {
  const count = gameState.diceCount;
  const results = rollMultiple(count, sides);
  const total = results.reduce((a, b) => a + b, 0);

  const resultContainer = document.getElementById('dice-result');
  resultContainer.innerHTML = results.map(r => `<span class="single-die dice-rolling">${r}</span>`).join('');
  if (count > 1) {
    resultContainer.innerHTML += `<span class="total">= ${total}</span>`;
  }

  if (sides === 20 && count === 1) {
    if (results[0] === 20) {
      resultContainer.innerHTML = `<span class="single-die critical-text">20!</span><span class="total">CRITICO!</span>`;
    } else if (results[0] === 1) {
      resultContainer.innerHTML = `<span class="single-die" style="color: var(--red)">1</span><span class="total" style="color: var(--red)">PIFIA!</span>`;
    }
  }

  const entry = `${count}d${sides}: [${results.join(', ')}]${count > 1 ? ` = ${total}` : ''}`;
  gameState.diceHistory.unshift(entry);
  if (gameState.diceHistory.length > 20) gameState.diceHistory.pop();

  const historyContainer = document.getElementById('dice-history');
  historyContainer.innerHTML = gameState.diceHistory.map(h => `<div class="dice-history-entry">${h}</div>`).join('');
}

// --- INIT ---

loadFromLocalStorage();
renderPlayerNames();
// Restore player count button
document.querySelectorAll('.player-count-selector .btn').forEach(b => b.classList.remove('active'));
const pcBtn = document.getElementById(`pc-${gameState.playerCount}`);
if (pcBtn) pcBtn.classList.add('active');
initApiKeyInput();
