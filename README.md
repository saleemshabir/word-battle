# ⚔️ Word Battle

### Think Fast. Spell Smart. Beat Your Friends.

**Word Battle** is a real-time multiplayer vocabulary game where players compete against each other through exciting word challenges. Create a private room, invite your friends, test your vocabulary, and see who can earn the highest score!

<<<<<<< HEAD
Built with **React, Node.js, Express, and Socket.IO**, Word Battle brings fast-paced word competitions right to your browser.
=======
- Create a private room and share its six-character code.
- Join without registration. Players receive random display nicknames.
- Ten rounds per match using Word Scramble, Guess the Word, Missing Letters, Speed Spelling, and Odd Word Out.
- Questions are selected randomly, with a 20-match no-repeat history for each difficulty while the server is running.
- Each difficulty has at least 1,000 generated questions across the four word-based challenge types, plus Odd Word Out questions.
- Easy, Medium and Hard vocabulary sets.
- Server-authoritative 30-second round timer.
- Correct answer: 100 base points plus up to 50 speed bonus points.
- Live scores and leaderboard, answer reveal, winner screen and replay.
- Host can start, kick players, choose difficulty and end a game.
- Reconnect with the same browser/device using a saved player token.
- Responsive dark neon interface with optional sound effects.
>>>>>>> 59a3f0b (Update Word Battle features)

---

## ✨ Features

- 🎮 **Real-Time Multiplayer:** Play with 2–8 players simultaneously.
- 🔐 **Private Game Rooms:** Create a room and invite friends using a unique six-character code.
- 👤 **No Registration Required:** Join instantly with randomly generated player nicknames.
- 🧠 **Five Game Modes:**
  - Word Scramble
  - Guess the Word
  - Missing Letters
  - Speed Spelling
  - Odd Word Out
- 📚 **Three Difficulty Levels:** Easy, Medium, and Hard.
- ⏱️ **30-Second Challenges:** Race against the server-controlled timer.
- 🏆 **Live Leaderboard:** Track scores and rankings throughout the match.
- ⚡ **Speed Bonus:** Earn additional points by answering quickly.
- 🔄 **Reconnection Support:** Rejoin an active match using your saved player token.
- 👑 **Host Controls:** Start games, change difficulty, remove players, and end matches.
- 🔁 **Replay:** Challenge your friends again after the match.
- 🔊 **Sound Effects:** Optional audio feedback.
- 📱 **Responsive Design:** Play across desktop, tablet, and mobile devices.

---

## 🕹️ How to Play

1. Open Word Battle.
2. Create a private room or join an existing room using its code.
3. Invite 1–7 friends.
4. The host selects a difficulty level.
5. Start the game and compete across 10 rounds.
6. Answer the word challenges before the timer runs out.
7. Earn points, climb the leaderboard, and become the Word Battle champion!

---

## 🏅 Scoring System

| Action | Points |
|---|---:|
| Correct Answer | 100 |
| Maximum Speed Bonus | 50 |
| Incorrect Answer | 0 |
| No Answer | 0 |

**Maximum possible score:** 1,500 points per player.

The player with the highest total score after 10 rounds wins the match.

---

## 🎯 Game Modes

| Game Mode | Challenge |
|---|---|
| Word Scramble | Rearrange letters to form the correct word. |
| Guess the Word | Identify a word using the given clues. |
| Missing Letters | Complete the word by filling in missing letters. |
| Speed Spelling | Spell the given word correctly. |
| Odd Word Out | Find the word that does not belong in the group. |

Each match contains 10 rounds, with every game mode appearing twice.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Development and build tooling |
| Node.js | Backend runtime |
| Express.js | Backend server |
| Socket.IO | Real-time multiplayer communication |
| CSS | Styling and responsive design |
| LocalStorage | Player session and reconnection token |

---

## 🚀 Getting Started

Follow these instructions to run Word Battle locally.

### Prerequisites

Make sure you have installed:

- [Node.js 20+](https://nodejs.org/)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/word-battle.git
```

### 2. Navigate to the Project

```bash
cd word-battle
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the Vite URL displayed in your terminal, normally:

```text
http://localhost:5173
```

To test multiplayer, open the application in multiple browsers or devices connected to the same network.

### 5. Build for Production

```bash
npm run build
```

### 6. Start the Production Server

```bash
npm start
```

The Express server serves the production frontend and Socket.IO from the same origin, using port `3001` by default or the port specified by the hosting provider.

---

## ☁️ Deployment

Word Battle can be deployed using **Render's free instance tier**, when available.

### Deploy using Render

1. Push your project to GitHub.
2. Sign in to [Render](https://render.com/).
3. Create a new Web Service.
4. Connect your GitHub repository.
5. Configure the following settings if they are not detected automatically:

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Instance Type | Free, if available |

6. Deploy your application.
7. Share your live Render URL with your friends.

**Note:** Free instances may sleep after inactivity, resulting in slower initial loading. Active game rooms are stored in server memory and are lost when the server restarts or redeploys.

---

## ⚙️ Important Technical Notes

- Game rooms and player scores are stored in server memory.
- The server controls round timers and scoring to maintain fair gameplay.
- Player reconnection uses a token saved in browser LocalStorage.
- Reconnection is supported while the original room remains active.
- Clearing browser data or changing browsers may prevent automatic reconnection.
- Multiple server instances require shared storage and a Socket.IO adapter.

### Future Improvements

- Persistent game rooms using MongoDB or Redis.
- Global player profiles and statistics.
- Public matchmaking.
- Friends and invitation system.
- Global leaderboard.
- More vocabulary challenges and game modes.
- Anti-cheat protection and rate limiting.

---

## 📸 Screenshots

Add screenshots of your application here to showcase its interface.

```text
screenshots/
├── home.png
├── lobby.png
├── gameplay.png
└── leaderboard.png
```

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

---

## 👨‍💻 Developer

**Saleem Shabir**

Computer Science Engineering Student | Full Stack Web Developer in Progress

- GitHub: [@saleemshabir](https://github.com/saleemshabir)

---

<p align="center">
  <b>⚔️ Challenge Your Friends. Test Your Vocabulary. Claim the Crown! 🏆</b>
</p>

<p align="center">
  Made with ❤️ using React, Node.js and Socket.IO.
</p>
