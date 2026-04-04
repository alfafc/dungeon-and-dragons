# Dungeons & Dragons - Aventura Familiar

Un juego de D&D completo que corre en el navegador, con un Dungeon Master potenciado por IA que narra la historia, genera encuentros y crea **ilustraciones unicas para cada escena** usando DALL-E 3.

Al finalizar la aventura, se genera una **cronica HTML descargable** con todas las imagenes y la historia completa para revivir la partida.

![D&D Aventura Familiar](https://img.shields.io/badge/D%26D-Aventura%20Familiar-gold?style=for-the-badge&logo=dungeonsanddragons&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini%20%2B%20DALL--E%203-412991?style=flat-square&logo=openai&logoColor=white)

---

## Como jugar

1. Abri `index.html` en cualquier navegador
2. Configura tu aventura (DM, duracion, dificultad, tono, ambientacion)
3. Crea tus personajes (1-4 jugadores)
4. Juga la aventura: explora, combati, resolve puzzles
5. Al terminar, descarga la cronica de tu aventura

> **Nota:** Necesitas una API key de OpenAI con acceso a GPT-4o-mini y DALL-E 3.

---

## Caracteristicas

### Dungeon Master con IA
- **GPT-4o-mini** narra la historia, genera encuentros, enemigos, trampas, tesoros y NPCs
- Se adapta al estado del grupo (si estan heridos, ofrece curacion)
- Escala la dificultad progresivamente hasta un boss final epico

### Generacion de imagenes
- **DALL-E 3** genera una ilustracion unica para cada sala y cada combate
- Las imagenes tienen **contexto acumulativo**: cada prompt incluye las escenas anteriores para mantener coherencia visual
- El estilo se adapta al tono elegido:
  - **Ninos**: colorido y magico, estilo Pixar
  - **Juvenil**: dramatico con colores vividos
  - **Adulto**: oscuro y realista
- Las imagenes se generan **asincronicamente** (no bloquean el juego)

### Cronica de aventura
- Toda la partida se registra automaticamente (narrativa, acciones, combates, imagenes)
- Al finalizar, se descarga un **archivo HTML autosuficiente** con:
  - Las ilustraciones incrustadas en base64
  - La historia completa con formato de libro
  - Info de los heroes y estadisticas finales
- El archivo se puede abrir en cualquier navegador sin conexion

### Sistema de juego completo
- **6 razas**: Humano, Elfo, Enano, Mediano, Semiorco, Tiefling
- **6 clases**: Guerrero, Mago, Picaro, Clerigo, Ranger, Barbaro
- **14 tipos de monstruos** con Challenge Rating progresivo
- **Combate por turnos** con iniciativa, ataques, hechizos y pociones
- **Sistema de dados** fiel a D&D 5e (d4 a d100, criticos, pifias)
- **Loot**: oro, pociones, armas y artefactos

### Dos modos de DM
- **IA**: la IA controla toda la narrativa y los encuentros
- **Humano**: un jugador toma el rol de DM con un panel de control completo

### Configuracion flexible
| Opcion | Valores |
|--------|---------|
| Duracion | Corta (~20 min), Media (~45 min), Larga (~90 min) |
| Dificultad | Facil, Normal, Dificil |
| Tono | Para ninos, Juvenil, Adulto |
| Ambientacion | Mazmorra, Bosque Encantado, Castillo Maldito, Isla Pirata, Templo del Volcan, Sorpresa |

---

## Stack

| Componente | Tecnologia |
|-----------|------------|
| Frontend | HTML + CSS + Vanilla JavaScript |
| Narrativa | OpenAI GPT-4o-mini |
| Imagenes | OpenAI DALL-E 3 |
| Backend | Ninguno (corre 100% en el navegador) |

---

## Estructura

```
dungeon-and-dragons/
├── index.html    # UI: todas las pantallas del juego
├── game.js       # Logica: IA, combate, dados, imagenes, cronica
├── styles.css    # Tema oscuro de fantasia
└── README.md
```

---

## Setup

1. Clona el repo
2. Abri `index.html` en el navegador
3. En la pantalla de configuracion, ingresa tu API key de OpenAI
4. Listo, no hay build ni dependencias

> La API key se guarda en `localStorage` de tu navegador. Nunca se envia a ningun servidor excepto OpenAI.

---

## Licencia

MIT
