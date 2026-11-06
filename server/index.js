import express from "express";
import http from "http";
import path from "path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { getQuestionSet, roundsPerMatch } from "./questions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" }, pingInterval: 25000, pingTimeout: 20000 });

app.get("/health", (_req, res) => res.json({ ok: true, service: "word-battle" }));

if (process.env.NODE_ENV === "production") {
  const dist = path.join(__dirname, "../dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

const rooms = new Map();
const nickAdjectives = ["Neon", "Swift", "Clever", "Cosmic", "Lucky", "Bright", "Pixel", "Rapid", "Mighty", "Fuzzy", "Turbo", "Witty"];
const nickNouns = ["Fox", "Falcon", "Comet", "Tiger", "Otter", "Panda", "Wizard", "Dragon", "Raven", "Shark", "Koala", "Wolf"];
const codeChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  let code;
  do { code = Array.from({ length: 6 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]).join(""); }
  while (rooms.has(code));
  return code;
}
function makeNickname() {
  return `${nickAdjectives[Math.floor(Math.random() * nickAdjectives.length)]}${nickNouns[Math.floor(Math.random() * nickNouns.length)]}${Math.floor(10 + Math.random() * 90)}`;
}
function publicRoom(room) {
  return {
    code: room.code, status: room.status, hostId: room.hostId, difficulty: room.difficulty,
    round: room.round, totalRounds: roundsPerMatch, deadline: room.deadline,
    question: room.question ? { type: room.question.type, prompt: room.question.prompt, clue: room.question.clue, display: room.question.display, choices: room.question.choices || null } : null,
    answer: room.revealed ? room.question?.answer : null,
    players: [...room.players.values()].map(p => ({ id: p.id, nickname: p.nickname, score: p.score, connected: p.connected, answered: p.answered, correctAnswers: p.correctAnswers })),
    leaderboard: [...room.players.values()].map(p => ({ id: p.id, nickname: p.nickname, score: p.score, connected: p.connected })).sort((a,b) => b.score - a.score),
    revealed: room.revealed
  };
}
function emitRoom(room) { io.to(room.code).emit("room:update", publicRoom(room)); }
function cleanRoom(room) {
  if (room.timer) clearTimeout(room.timer);
  if (room.nextTimer) clearTimeout(room.nextTimer);
  rooms.delete(room.code);
}
function startRound(room) {
  if (room.timer) clearTimeout(room.timer);
  if (room.nextTimer) clearTimeout(room.nextTimer);
  room.round += 1;
  room.question = room.questionSet[room.round - 1];
  room.revealed = false;
  room.deadline = Date.now() + 30000;
  for (const p of room.players.values()) { p.answered = false; p.lastAnswer = null; }
  emitRoom(room);
  room.timer = setTimeout(() => finishRound(room), 30000);
}
function finishRound(room) {
  if (!room || room.status !== "playing" || room.revealed) return;
  room.revealed = true;
  room.deadline = null;
  emitRoom(room);
  if (room.round >= roundsPerMatch) {
    room.status = "finished";
    emitRoom(room);
    return;
  }
  room.nextTimer = setTimeout(() => {
    if (rooms.get(room.code) === room && room.status === "playing") startRound(room);
  }, 4500);
}
function safeAck(ack, data) { if (typeof ack === "function") ack(data); }

io.on("connection", socket => {
  socket.on("room:create", ({ token } = {}, ack) => {
    const code = makeCode();
    const nickname = makeNickname();
    const room = {
      code, status: "lobby", hostId: socket.id, difficulty: "Easy", round: 0,
      question: null, questionSet: null, deadline: null, revealed: false, timer: null, nextTimer: null,
      players: new Map()
    };
    room.players.set(socket.id, { id: socket.id, token: token || randomUUID(), nickname, score: 0, connected: true, answered: false, correctAnswers: 0, lastAnswer: null });
    rooms.set(code, room);
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.playerToken = room.players.get(socket.id).token;
    safeAck(ack, { ok: true, room: publicRoom(room), token: socket.data.playerToken });
  });

  socket.on("room:join", ({ code, token } = {}, ack) => {
    code = String(code || "").toUpperCase().trim();
    const room = rooms.get(code);
    if (!room) return safeAck(ack, { ok: false, error: "Room not found. Check the code and try again." });
    let player = [...room.players.values()].find(p => token && p.token === token);
    if (player) {
      if (player.connected && player.id !== socket.id) io.to(player.id).emit("session:replaced");
      const wasHost = room.hostId === player.id;
      room.players.delete(player.id);
      player.id = socket.id;
      player.connected = true;
      if (wasHost) room.hostId = socket.id;
      room.players.set(socket.id, player);
    } else {
      if (room.status !== "lobby") return safeAck(ack, { ok: false, error: "This game has already started. Rejoining requires your saved session on this browser." });
      if (room.players.size >= 8) return safeAck(ack, { ok: false, error: "This room is full (8 players maximum)." });
      player = { id: socket.id, token: randomUUID(), nickname: makeNickname(), score: 0, connected: true, answered: false, correctAnswers: 0, lastAnswer: null };
      room.players.set(socket.id, player);
    }
    if (room.status === "lobby" && !room.players.has(room.hostId)) room.hostId = socket.id;
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.playerToken = player.token;
    safeAck(ack, { ok: true, room: publicRoom(room), token: player.token });
    emitRoom(room);
  });

  socket.on("host:difficulty", ({ difficulty } = {}, ack) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.hostId !== socket.id || room.status !== "lobby") return safeAck(ack, { ok: false, error: "Only the host can change difficulty before the game starts." });
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) return safeAck(ack, { ok: false, error: "Invalid difficulty." });
    room.difficulty = difficulty; emitRoom(room); safeAck(ack, { ok: true });
  });

  socket.on("host:start", (_data, ack) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.hostId !== socket.id || room.status !== "lobby") return safeAck(ack, { ok: false, error: "Only the host can start this game." });
    if (room.players.size < 2) return safeAck(ack, { ok: false, error: "At least two players are required to start." });
    room.status = "playing";
    room.round = 0;
    room.questionSet = getQuestionSet(room.difficulty);
    for (const p of room.players.values()) { p.score = 0; p.correctAnswers = 0; }
    safeAck(ack, { ok: true });
    startRound(room);
  });

  socket.on("game:answer", ({ answer } = {}, ack) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.players.get(socket.id);
    if (!room || !player || room.status !== "playing" || room.revealed) return safeAck(ack, { ok: false, error: "This round is not accepting answers." });
    if (player.answered) return safeAck(ack, { ok: false, error: "You have already answered this round." });
    if (Date.now() >= room.deadline) return safeAck(ack, { ok: false, error: "Time is up." });
    const normalized = String(answer || "").trim().toUpperCase().replace(/[^A-Z]/g, "");
    const correct = normalized === room.question.answer.toUpperCase().replace(/[^A-Z]/g, "");
    player.answered = true;
    player.lastAnswer = normalized;
    let points = 0;
    if (correct) {
      const remaining = Math.max(0, room.deadline - Date.now());
      const bonus = Math.floor((remaining / 30000) * 50);
      points = 100 + bonus;
      player.score += points;
      player.correctAnswers += 1;
    }
    safeAck(ack, { ok: true, correct, points });
    emitRoom(room);
    if ([...room.players.values()].every(p => p.answered || !p.connected)) {
      if (room.timer) clearTimeout(room.timer);
      finishRound(room);
    }
  });

  socket.on("host:kick", ({ playerId } = {}, ack) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.hostId !== socket.id || room.status === "finished") return safeAck(ack, { ok: false, error: "Only the host can remove players." });
    if (playerId === socket.id) return safeAck(ack, { ok: false, error: "The host cannot kick themselves." });
    const target = room.players.get(playerId);
    if (!target) return safeAck(ack, { ok: false, error: "Player not found." });
    io.to(playerId).emit("session:kicked");
    const targetSocket = io.sockets.sockets.get(playerId);
    if (targetSocket) { targetSocket.leave(room.code); targetSocket.data.roomCode = null; }
    room.players.delete(playerId);
    emitRoom(room); safeAck(ack, { ok: true });
  });

  socket.on("host:end", (_data, ack) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.hostId !== socket.id) return safeAck(ack, { ok: false, error: "Only the host can end the game." });
    room.status = "finished";
    room.revealed = true;
    if (room.timer) clearTimeout(room.timer);
    if (room.nextTimer) clearTimeout(room.nextTimer);
    emitRoom(room); safeAck(ack, { ok: true });
  });

  socket.on("host:replay", (_data, ack) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.hostId !== socket.id || room.status !== "finished") return safeAck(ack, { ok: false, error: "Only the host can restart a finished game." });
    room.status = "lobby"; room.round = 0; room.question = null; room.deadline = null; room.revealed = false;
    for (const p of room.players.values()) { p.score = 0; p.correctAnswers = 0; p.answered = false; p.lastAnswer = null; }
    emitRoom(room); safeAck(ack, { ok: true });
  });

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.players.get(socket.id);
    if (!room || !player) return;
    player.connected = false;
    emitRoom(room);
    if (room.status === "playing" && [...room.players.values()].every(p => p.answered || !p.connected)) {
      if (room.timer) clearTimeout(room.timer);
      finishRound(room);
    }
    // Empty rooms are reclaimed after 10 minutes.
    if ([...room.players.values()].every(p => !p.connected)) {
      setTimeout(() => {
        const current = rooms.get(room.code);
        if (current === room && [...current.players.values()].every(p => !p.connected)) cleanRoom(current);
      }, 10 * 60 * 1000);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Word Battle server listening on ${PORT}`));
