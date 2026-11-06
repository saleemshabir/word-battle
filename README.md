# Word Battle

A real-time multiplayer word game for 2–8 players. Built with React, Vite, Node.js, Express and Socket.IO.

## Features

- Create a private room and share its six-character code.
- Join without registration. Players receive random display nicknames.
- Ten rounds per match using Word Scramble, Guess the Word, Missing Letters, Speed Spelling, and Odd Word Out.
- Questions are selected randomly, with a 20-match no-repeat history for each difficulty while the server is running.
- Easy, Medium and Hard vocabulary sets.
- Server-authoritative 30-second round timer.
- Correct answer: 100 base points plus up to 50 speed bonus points.
- Live scores and leaderboard, answer reveal, winner screen and replay.
- Host can start, kick players, choose difficulty and end a game.
- Reconnect with the same browser/device using a saved player token.
- Responsive dark neon interface with optional sound effects.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173). Open it in multiple browsers or devices on the same network to test multiplayer. For another device on your Wi-Fi, use your computer's LAN IP and port 5173.

For production build:

```bash
npm run build
npm start
```

The Express server serves the built frontend and Socket.IO from the same origin on port 3001 (or the `PORT` supplied by the host).

## Deploy free

1. Create a GitHub repository and push this project.
2. In Render, create a new **Web Service** connected to that repository.
3. Render detects `render.yaml`. If configuring manually:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
   - Use the free instance tier if available.
4. Wait for the deploy to finish, then open the Render URL and share it.

The free instance may sleep when idle. The first visit after inactivity can take longer. Active rooms are stored in memory and are lost if the server restarts or redeploys. This first version is intended for casual private matches, not persistent tournaments.

## Game rules

- Each match has ten rounds, with each challenge type appearing twice.
- Each round lasts 30 seconds.
- Correct answer = 100 points + speed bonus (up to 50). Incorrect or unanswered = 0.
- The player with the highest total score after ten rounds wins.
- The host chooses Easy, Medium or Hard before starting.
- The host starts and can end the match or remove a player.
- If a player disconnects, they can reconnect from the same browser using their saved session token. The server keeps their score while the room remains active.

## Important deployment notes

- This app uses in-memory room state. Do not run multiple server instances without adding shared storage and a Socket.IO adapter.
- Reconnection works from the same browser profile because the token is stored in localStorage. Clearing site data or switching browsers loses that token.
- For production-grade persistence, add Redis or a database, rate limiting, abuse protection and automated tests.
