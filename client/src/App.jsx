import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io({ autoConnect: false, reconnection: true, reconnectionAttempts: Infinity });
const tokenKey = "word-battle-player-token";
const roomKey = "word-battle-room-code";

function App() {
  const [screen, setScreen] = useState("home");
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(tokenKey) || "");
  const [code, setCode] = useState(localStorage.getItem(roomKey) || "");
  const [difficulty, setDifficulty] = useState("Easy");
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [soundOn, setSoundOn] = useState(true);
  const [busy, setBusy] = useState(false);
  const audioRef = useRef(null);

  const isHost = room?.hostId === socket.id;
  const leaderboard = useMemo(() => [...(room?.leaderboard || [])].sort((a,b) => b.score - a.score), [room]);
  const myPlayer = room?.players?.find(p => p.id === socket.id);

  function tone(freq = 660, duration = 0.12) {
    if (!soundOn) return;
    try {
      const ctx = audioRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioRef.current = ctx;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.055, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + duration);
    } catch {}
  }

  useEffect(() => {
    socket.connect();
    socket.on("room:update", data => {
      setRoom(data);
      setScreen(data.status === "lobby" ? "lobby" : data.status === "playing" ? "game" : "results");
      setDifficulty(data.difficulty);
      if (data.revealed) {
        setAnswerFeedback(data.answer ? `Correct answer: ${data.answer}` : "");
        tone(520, 0.18);
      }
    });
    socket.on("session:kicked", () => {
      setRoom(null); setScreen("home");
      localStorage.removeItem(tokenKey); localStorage.removeItem(roomKey);
      setNotice("You were removed from the room by the host.");
    });
    socket.on("session:replaced", () => setNotice("This player session was reconnected from another device."));
    socket.on("connect", () => {
      const savedToken = localStorage.getItem(tokenKey);
      const savedCode = localStorage.getItem(roomKey);
      if (savedToken && savedCode && !room) {
        socket.emit("room:join", { code: savedCode, token: savedToken }, result => {
          if (result?.ok) { setToken(result.token); setRoom(result.room); setScreen(result.room.status === "lobby" ? "lobby" : result.room.status === "playing" ? "game" : "results"); }
        });
      }
    });
    return () => {
      socket.off("room:update"); socket.off("session:kicked"); socket.off("session:replaced"); socket.off("connect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!room?.deadline || room.status !== "playing" || room.revealed) { setSeconds(0); return; }
    const update = () => setSeconds(Math.max(0, Math.ceil((room.deadline - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 150);
    return () => clearInterval(id);
  }, [room?.deadline, room?.status, room?.revealed]);

  function handleResult(result) {
    setBusy(false);
    if (!result?.ok) { setNotice(result?.error || "Something went wrong."); return false; }
    setNotice("");
    return true;
  }

  function createRoom() {
    setBusy(true);
    socket.emit("room:create", { token }, result => {
      if (!handleResult(result)) return;
      setToken(result.token); setRoom(result.room); setCode(result.room.code);
      localStorage.setItem(tokenKey, result.token); localStorage.setItem(roomKey, result.room.code);
      setScreen("lobby");
    });
  }
  function joinRoom() {
    if (code.trim().length !== 6) { setNotice("Enter a six-character room code."); return; }
    setBusy(true);
    socket.emit("room:join", { code, token }, result => {
      if (!handleResult(result)) return;
      setToken(result.token); setRoom(result.room); setCode(result.room.code);
      localStorage.setItem(tokenKey, result.token); localStorage.setItem(roomKey, result.room.code);
      setScreen(result.room.status === "lobby" ? "lobby" : result.room.status === "playing" ? "game" : "results");
    });
  }
  function hostAction(event, payload = {}) {
    setNotice("");
    socket.emit(event, payload, result => { if (!handleResult(result)) return; });
  }
  function submitAnswer(value = answer) {
    if (!value.trim() || room?.revealed || myPlayer?.answered) return;
    socket.emit("game:answer", { answer: value }, result => {
      if (!result?.ok) { setNotice(result?.error || "Could not submit answer."); return; }
      setAnswerFeedback(result.correct ? `Correct! +${result.points} points` : "Not quite. Better luck next round.");
      tone(result.correct ? 880 : 220, 0.18);
      setAnswer("");
    });
  }
  function copyCode() {
    navigator.clipboard?.writeText(room?.code || code);
    setNotice("Room code copied.");
  }
  async function shareResults() {
    const text = `Word Battle results · ${leaderboard.map((p,i)=>`${i+1}. ${p.nickname}: ${p.score}`).join(" | ")}`;
    if (navigator.share) { try { await navigator.share({ title: "Word Battle results", text }); } catch {} }
    else { await navigator.clipboard?.writeText(text); setNotice("Results copied to clipboard."); }
  }
  function leaveRoom() {
    socket.disconnect();
    localStorage.removeItem(tokenKey); localStorage.removeItem(roomKey);
    setToken(""); setRoom(null); setScreen("home");
    setTimeout(() => socket.connect(), 100);
  }

  const title = <div className="brand"><div className="brand-mark">W<span>B</span></div><div><div className="brand-name">WORD<span> BATTLE</span></div><div className="brand-tag">THINK FAST. SPELL SMART. WIN BIG.</div></div></div>;

  return <main className="app-shell">
    <header className="topbar">{title}<div className="top-actions"><span className="live-dot">● LIVE MULTIPLAYER</span><button className="icon-btn" onClick={() => setSoundOn(v => !v)} title="Toggle sound">{soundOn ? "♫" : "♪̸"}</button></div></header>
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}

    {screen === "home" && <section className="hero">
      <div className="eyebrow">THE ULTIMATE WORD SHOWDOWN</div>
      <h1>Words are your<br/><span>weapon.</span></h1>
      <p className="hero-copy">Challenge your friends. Outsmart the clock. Claim the crown.</p>
      <div className="home-grid">
        <article className="panel create-panel"><div className="panel-icon">✦</div><h2>Create a room</h2><p>Start a battle and invite up to seven friends.</p><button className="primary-btn" disabled={busy} onClick={createRoom}>CREATE ROOM <span>↗</span></button></article>
        <article className="panel join-panel"><div className="panel-icon">⌁</div><h2>Join a room</h2><p>Enter the six-character code shared by your host.</p><input className="code-input" maxLength={6} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" onKeyDown={e=>e.key==="Enter" && joinRoom()}/><button className="secondary-btn" disabled={busy} onClick={joinRoom}>JOIN BATTLE <span>→</span></button></article>
      </div>
      <div className="how-row"><span>01 · JOIN A ROOM</span><i></i><span>02 · PLAY 5-10 QUESTIONS</span><i></i><span>03 · TOP THE LEADERBOARD</span></div>
    </section>}

    {screen === "lobby" && room && <section className="content-section">
      <div className="section-heading"><div><div className="eyebrow">BATTLE LOBBY</div><h1>Get ready to <span>rumble.</span></h1></div><div className="room-code-box"><small>ROOM CODE</small><strong>{room.code}</strong><button onClick={copyCode}>COPY</button></div></div>
      <div className="lobby-layout">
        <article className="panel players-panel"><div className="panel-head"><h2>Players <span className="count">{room.players.length}/8</span></h2><span className="waiting"><i/> WAITING FOR PLAYERS</span></div><div className="player-grid">{room.players.map((p,i)=><div className="player-tile" key={p.id}><div className={`avatar avatar-${i%6}`}>{p.nickname.slice(0,1)}</div><div><strong>{p.nickname}</strong><small>{p.id===room.hostId ? "HOST" : "PLAYER"} · {p.connected ? "CONNECTED" : "RECONNECTING"}</small></div>{p.id===room.hostId && <span className="crown">♛</span>}{isHost && p.id!==socket.id && <button className="kick-btn" onClick={()=>hostAction("host:kick",{playerId:p.id})}>KICK</button>}</div>)}</div><div className="invite-hint">Share the room code with friends. No account or download needed.</div></article>
        <article className="panel settings-panel">
          <div className="eyebrow">MATCH SETTINGS</div>
          <h2>Choose difficulty</h2>
          <div className="difficulty-list">{["Easy","Medium","Hard"].map(level=><button key={level} disabled={!isHost} className={`difficulty ${difficulty===level?"selected":""}`} onClick={()=>{setDifficulty(level);hostAction("host:difficulty",{difficulty:level});}}><span>{level==="Easy"?"✧":level==="Medium"?"✦":"✹"}</span><b>{level}</b><small>{level==="Easy"?"Common words":level==="Medium"?"Trickier vocabulary":"Advanced words"}</small></button>)}</div>
          <div className="match-facts">
            <label><small>QUESTIONS PER MATCH</small><select className="code-input" disabled={!isHost} value={room.totalQuestions} onChange={event=>hostAction("host:question-count",{questionCount:Number(event.target.value)})}>{Array.from({length:6},(_,index)=>index+5).map(count=><option key={count} value={count}>{count} questions</option>)}</select></label>
            <div><strong>30s</strong><small>PER QUESTION</small></div>
            <div><strong>08</strong><small>MAX PLAYERS</small></div>
          </div>
          <button className="primary-btn full" disabled={!isHost || room.players.length<2} onClick={()=>hostAction("host:start")}>{isHost?"START BATTLE":"WAITING FOR HOST"} <span>↗</span></button>
          {isHost && room.players.length<2 && <small className="muted center">At least two players are required.</small>}
          <button className="text-btn" onClick={leaveRoom}>Leave room</button>
        </article>
      </div>
    </section>}

    {screen === "game" && room && <section className="content-section game-section">
      <div className="game-top"><div><div className="eyebrow">QUESTION {room.round} OF {room.totalQuestions}</div><h1>{room.question?.type}</h1></div><div className={`timer ${seconds<=10?"urgent":""}`}><small>TIME LEFT</small><strong>{String(seconds).padStart(2,"0")}<em>s</em></strong></div></div>
      <div className="progress-track" style={{gridTemplateColumns:`repeat(${room.totalQuestions},1fr)`}}>{Array.from({length:room.totalQuestions},(_,i)=><div key={i} className={i<room.round?"done":i===room.round-1?"active":""}/>)}</div>
      <div className="game-layout"><article className="panel challenge-panel"><div className="challenge-label">QUESTION {String(room.round).padStart(2,"0")} <span>· {room.difficulty.toUpperCase()}</span></div><h2>{room.question?.prompt}</h2><p className="clue">{room.question?.clue}</p><div className="puzzle-display">{room.question?.display}</div>
        {room.question?.choices ? <div className="choice-grid">{room.question.choices.map(choice=><button key={choice} className="choice-btn" disabled={myPlayer?.answered || room.revealed} onClick={()=>submitAnswer(choice)}>{choice}</button>)}</div> : <form className="answer-form" onSubmit={e=>{e.preventDefault();submitAnswer();}}><input autoComplete="off" autoFocus value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="TYPE YOUR ANSWER..." disabled={myPlayer?.answered || room.revealed}/><button className="primary-btn" disabled={myPlayer?.answered || room.revealed || !answer.trim()}>SUBMIT ↗</button></form>}
        {myPlayer?.answered && <div className="feedback">{answerFeedback || "Answer submitted. Waiting for the round to finish..."}</div>}
        {room.revealed && <div className="reveal-box"><small>CORRECT ANSWER</small><strong>{room.answer}</strong></div>}
      </article><aside className="panel leaderboard-panel"><div className="panel-head"><h2>Live leaderboard</h2><span className="live-tag">● LIVE</span></div>{leaderboard.map((p,i)=><div className={`leader-row ${p.id===socket.id?"you":""}`} key={p.id}><span className="rank">{String(i+1).padStart(2,"0")}</span><div className="leader-avatar">{p.nickname.slice(0,1)}</div><div className="leader-name">{p.nickname}<small>{p.id===socket.id?"YOU":p.connected?"PLAYING":"OFFLINE"}</small></div><strong>{p.score}</strong></div>)}<div className="your-score"><small>YOUR SCORE</small><strong>{myPlayer?.score ?? 0}</strong></div></aside></div>
    </section>}

    {screen === "results" && room && <section className="content-section results-section"><div className="winner-burst">✦</div><div className="eyebrow">BATTLE COMPLETE</div><h1>{leaderboard[0]?.nickname === myPlayer?.nickname ? "You are the" : "The winner is"} <span>{leaderboard[0]?.nickname || "Champion"}!</span></h1><p className="hero-copy">Room totals across every match. What a battle.</p><div className="results-card panel"><div className="podium-crown">♛</div><div className="eyebrow">FINAL ROOM TOTALS</div>{leaderboard.map((p,i)=><div className={`result-row ${i===0?"first":""}`} key={p.id}><span className="result-rank">{i===0?"♛":`#${i+1}`}</span><div className="leader-avatar">{p.nickname.slice(0,1)}</div><div className="leader-name">{p.nickname}<small>{p.correctAnswers} CORRECT ANSWERS</small></div><strong>{p.score}<small>PTS</small></strong></div>)}</div><div className="result-actions"><button className="primary-btn" disabled={!isHost} onClick={()=>hostAction("host:replay")}>{isHost?"PLAY AGAIN ↻":"WAITING FOR HOST"}</button><button className="secondary-btn" onClick={shareResults}>SHARE RESULTS ↗</button><button className="text-btn" onClick={leaveRoom}>EXIT ROOM</button></div></section>}

    <footer><span>WORD BATTLE © 2026</span><span>BUILT FOR FRIENDLY COMPETITION</span><span>NO LOGIN · NO DOWNLOAD</span></footer>
  </main>;
}

export default App;
