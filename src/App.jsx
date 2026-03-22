import { useState, useEffect, useRef, useCallback } from "react";
import CONFIG from "./config";

const GOOGLE_KEY = CONFIG.GOOGLE_KEY;
const ANTHROPIC_KEY = CONFIG.ANTHROPIC_KEY;

// ─── STYLES ───────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

:root {
  --sky: #e8f4fd;
  --sky2: #d0eaf8;
  --ocean: #1a6eb5;
  --ocean2: #2484d4;
  --ocean3: #56a8e8;
  --seafoam: #0db885;
  --seafoam2: #10d49a;
  --coral: #ff5757;
  --coral2: #ff7a7a;
  --sand: #fff8f0;
  --sand2: #ffefd8;
  --sunshine: #ffb800;
  --sunshine2: #ffd060;
  --lavender: #8b5cf6;
  --cream: #fffcf8;
  --white: #ffffff;
  --ink: #1a1f2e;
  --ink2: #2d3447;
  --muted: #6b7589;
  --muted2: #8e9ab5;
  --border: #e8ecf5;
  --border2: #d4daea;
  --card: #ffffff;
  --sh: 0 2px 12px rgba(26,31,46,0.07);
  --shm: 0 8px 32px rgba(26,31,46,0.12);
  --shl: 0 20px 60px rgba(26,31,46,0.16);
  --r: 18px; --rs: 12px; --rxs: 8px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--sky); }
::-webkit-scrollbar-thumb { background: var(--ocean3); border-radius: 3px; }

/* ── NAV ── */
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 66px;
  background: rgba(255,252,248,0.92); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 200;
}
.logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.65rem; color: var(--ocean); cursor: pointer;
  font-weight: 700; letter-spacing: -0.5px;
}
.logo em { color: var(--coral); font-style: italic; }
.nav-l { display: flex; align-items: center; gap: 16px; }
.back {
  display: flex; align-items: center; gap: 6px;
  background: var(--sky); border: 1px solid var(--border2);
  color: var(--muted); border-radius: 30px; padding: 7px 16px;
  font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
}
.back:hover { background: var(--sky2); color: var(--ink); }
.nav-r { display: flex; align-items: center; gap: 10px; }
.nav-city { font-size: 0.72rem; color: var(--muted2); letter-spacing: 1.5px; text-transform: uppercase; }
.prog { display: flex; gap: 5px; }
.pd { width: 6px; height: 6px; border-radius: 50%; background: var(--border2); transition: all 0.3s; }
.pd.on { background: var(--ocean); width: 18px; border-radius: 3px; }
.pd.done { background: var(--seafoam); }
.ubtn {
  display: flex; align-items: center; gap: 7px;
  background: var(--ocean); color: white; border: none;
  border-radius: 30px; padding: 7px 16px; font-size: 0.8rem;
  cursor: pointer; transition: all 0.2s;
}
.ubtn:hover { background: var(--ocean2); }
.ubtn.guest { background: var(--sky2); color: var(--ocean); border: 1px solid var(--border2); }
.ubtn.guest:hover { background: var(--sky); }
.uav {
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg, var(--ocean3), var(--seafoam));
  display: flex; align-items: center; justify-content: center;
  font-size: 0.66rem; font-weight: 700;
}

/* ── HERO ── */
.hero {
  min-height: calc(100vh - 66px);
  background: linear-gradient(145deg, #e8f4fd 0%, #f0f8ff 30%, #fff8f0 60%, #fff0f5 100%);
  position: relative; overflow: hidden;
  display: grid; grid-template-columns: 1fr 1fr;
  align-items: center;
}
@media(max-width:900px) { .hero { grid-template-columns: 1fr; } }
.hero-shapes {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.hero-shape {
  position: absolute; border-radius: 50%; opacity: 0.35;
}
.hs1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(26,110,181,0.18) 0%, transparent 70%); top: -200px; right: -100px; }
.hs2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(13,184,133,0.15) 0%, transparent 70%); bottom: -100px; left: -80px; }
.hs3 { width: 250px; height: 250px; background: radial-gradient(circle, rgba(255,184,0,0.2) 0%, transparent 70%); top: 30%; left: 42%; }
.hero-left { position: relative; z-index: 2; padding: 80px 50px 80px 7vw; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(26,110,181,0.1); border: 1px solid rgba(26,110,181,0.25);
  border-radius: 30px; padding: 7px 16px; margin-bottom: 28px;
  font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--ocean); font-weight: 600;
}
.badge-pulse {
  width: 7px; height: 7px; border-radius: 50%; background: var(--seafoam);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.4);} }
.hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 5vw, 4.8rem);
  line-height: 1.05; margin-bottom: 22px; color: var(--ink);
}
.hero-h1 em { font-style: italic; color: var(--ocean); }
.hero-h1 .accent { color: var(--coral); }
.hero-sub {
  color: var(--muted); font-size: 1.05rem;
  max-width: 440px; margin-bottom: 36px;
  line-height: 1.8; font-weight: 300;
}
.hero-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px; }
.hero-pill {
  display: flex; align-items: center; gap: 6px;
  background: white; border: 1px solid var(--border);
  border-radius: 30px; padding: 7px 14px;
  font-size: 0.8rem; color: var(--ink2); box-shadow: var(--sh);
}
.hero-pill-dot { width: 6px; height: 6px; border-radius: 50%; }
.sc { width: 100%; max-width: 500px; position: relative; z-index: 3; }
.sw {
  display: flex; background: white; border-radius: 60px;
  box-shadow: 0 4px 24px rgba(26,110,181,0.18), var(--shm);
  border: 1.5px solid rgba(26,110,181,0.15);
}
.si-wrap { display: flex; align-items: center; flex: 1; overflow: hidden; border-radius: 60px 0 0 60px; }
.sicon { padding: 0 0 0 20px; color: var(--ocean3); font-size: 1.05rem; flex-shrink: 0; }
.si {
  flex: 1; border: none; padding: 18px 14px;
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
  background: transparent; color: var(--ink); outline: none;
}
.si::placeholder { color: var(--muted2); }
.ssugg {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0;
  background: white; border-radius: var(--rs); box-shadow: var(--shl);
  z-index: 100; overflow: hidden; border: 1px solid var(--border);
}
.sitem {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 18px; cursor: pointer; transition: background 0.15s; font-size: 0.88rem;
}
.sitem:hover { background: var(--sky); }
.ssub { font-size: 0.72rem; color: var(--muted2); }
.sbtn {
  background: linear-gradient(135deg, var(--ocean), var(--ocean2));
  color: white; border: none; padding: 18px 26px;
  font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
  border-radius: 0 60px 60px 0; letter-spacing: 0.3px;
}
.sbtn:hover { filter: brightness(1.08); }
.chips { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 16px; }
.chip {
  background: rgba(255,255,255,0.8); border: 1px solid var(--border2);
  color: var(--ink2); border-radius: 30px; padding: 6px 14px;
  font-size: 0.78rem; cursor: pointer; transition: all 0.2s;
  backdrop-filter: blur(4px);
}
.chip:hover { background: white; border-color: var(--ocean3); color: var(--ocean); }

/* HERO RIGHT */
.hero-right { position: relative; z-index: 2; padding: 40px 7vw 40px 20px; }
.dest-cards { display: flex; flex-direction: column; gap: 10px; }
.dest-card {
  background: white; border: 1px solid var(--border);
  border-radius: 16px; padding: 14px 18px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: var(--sh); transition: all 0.3s;
  animation: cardIn 0.5s ease both;
}
.dest-card:nth-child(1){animation-delay:0.1s;}
.dest-card:nth-child(2){animation-delay:0.22s;}
.dest-card:nth-child(3){animation-delay:0.34s;}
@keyframes cardIn { from{opacity:0;transform:translateX(16px);} to{opacity:1;transform:translateX(0);} }
.dest-card:hover { transform: translateX(-3px); box-shadow: var(--shm); }
.dest-emo {
  width: 50px; height: 50px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; flex-shrink: 0;
}
.dest-name { font-weight: 600; font-size: 0.92rem; margin-bottom: 2px; color: var(--ink); }
.dest-meta { font-size: 0.73rem; color: var(--muted2); }
.dest-tag { border-radius: 20px; padding: 3px 10px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; }
.tag-green { background: rgba(13,184,133,0.12); color: #0a9d72; }
.tag-blue { background: rgba(26,110,181,0.12); color: var(--ocean); }
.tag-orange { background: rgba(255,184,0,0.18); color: #b87d00; }
.hero-stats {
  display: flex; gap: 0; margin-top: 20px;
  background: white; border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden; box-shadow: var(--sh);
}
.hstat { flex: 1; padding: 16px; text-align: center; border-right: 1px solid var(--border); }
.hstat:last-child { border-right: none; }
.hstat-n { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--ocean); font-weight: 700; }
.hstat-l { font-size: 0.69rem; color: var(--muted2); margin-top: 1px; }

/* ── STEP PAGES ── */
.page { padding: 44px 5vw 72px; max-width: 1380px; margin: 0 auto; }
.sh { margin-bottom: 30px; }
.sey { font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase; color: var(--ocean); margin-bottom: 6px; font-weight: 600; }
.st { font-family: 'Playfair Display', serif; font-size: 2.4rem; color: var(--ink); line-height: 1.1; }
.st span { color: var(--seafoam); font-style: italic; }
.ss { color: var(--muted); margin-top: 8px; font-weight: 300; font-size: 0.91rem; }
.section-label {
  font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 10px; font-weight: 600;
}

/* PREFS */
.pg { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px,1fr)); gap: 9px; margin: 20px 0; }
.pc {
  background: white; border: 2px solid var(--border);
  border-radius: var(--r); padding: 16px 14px;
  cursor: pointer; transition: all 0.2s; box-shadow: var(--sh);
}
.pc:hover { border-color: var(--ocean3); transform: translateY(-2px); box-shadow: var(--shm); }
.pc.sel { border-color: var(--ocean); background: var(--sky); }
.pi { font-size: 1.6rem; margin-bottom: 7px; }
.pn { font-weight: 600; font-size: 0.86rem; color: var(--ink); }
.pd2 { font-size: 0.71rem; color: var(--muted2); margin-top: 2px; }
.cpw { display: flex; gap: 8px; margin-bottom: 14px; }
.cpi {
  flex: 1; padding: 11px 17px; border: 2px solid var(--border);
  border-radius: 60px; font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; background: white; color: var(--ink); outline: none; transition: all 0.2s;
}
.cpi:focus { border-color: var(--ocean); }
.cpi::placeholder { color: var(--muted2); }
.cap {
  background: var(--ocean); color: white; border: none;
  border-radius: 60px; padding: 11px 20px; font-size: 0.85rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.cap:hover { background: var(--ocean2); }
.ctags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.ctag {
  background: var(--sky2); color: var(--ocean);
  border: 1px solid rgba(26,110,181,0.3);
  border-radius: 30px; padding: 5px 12px; font-size: 0.79rem;
  display: flex; align-items: center; gap: 5px;
}
.ctag button { background: none; border: none; color: var(--ocean3); cursor: pointer; font-size: 0.85rem; }
.ctag button:hover { color: var(--coral); }

/* TRANSPORT */
.transport-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 8px; margin-bottom: 26px; }
.tc {
  background: white; border: 2px solid var(--border);
  border-radius: var(--r); padding: 16px 12px;
  cursor: pointer; transition: all 0.2s; text-align: center;
  box-shadow: var(--sh);
}
.tc:hover { border-color: var(--ocean3); transform: translateY(-1px); }
.tc.sel { border-color: var(--ocean); background: var(--sky); }
.tc-icon { font-size: 1.6rem; margin-bottom: 6px; }
.tc-name { font-weight: 600; font-size: 0.84rem; color: var(--ink); }

/* DAYS SELECTOR */
.days-row {
  display: flex; align-items: center; gap: 16px;
  background: white; border: 2px solid var(--border);
  border-radius: var(--r); padding: 20px; margin-bottom: 26px;
  box-shadow: var(--sh);
}
.days-label { font-weight: 600; font-size: 0.9rem; flex-shrink: 0; }
.days-sub { font-size: 0.78rem; color: var(--muted2); flex: 1; }
.days-picker { display: flex; align-items: center; gap: 10px; }
.days-btn {
  width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--border2);
  background: white; font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; font-weight: 600; color: var(--ink);
}
.days-btn:hover { border-color: var(--ocean); color: var(--ocean); }
.days-num {
  font-family: 'Playfair Display', serif; font-size: 1.5rem;
  font-weight: 700; color: var(--ocean); min-width: 32px; text-align: center;
}

/* BUDGET */
.bg { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 9px; margin-bottom: 26px; }
.bc {
  background: white; border: 2px solid var(--border);
  border-radius: var(--r); padding: 16px;
  cursor: pointer; transition: all 0.2s; box-shadow: var(--sh);
}
.bc:hover { border-color: var(--sunshine); transform: translateY(-1px); }
.bc.sel { border-color: var(--sunshine); background: #fffbf0; }
.btr { font-size: 1.2rem; font-weight: 700; margin-bottom: 2px; }
.bl { font-weight: 600; font-size: 0.88rem; margin-bottom: 2px; }
.br { font-size: 0.73rem; font-weight: 600; margin-bottom: 5px; }
.bd { font-size: 0.71rem; color: var(--muted2); line-height: 1.4; }
.conds { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 26px; }
.cg label { font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 7px; font-weight: 600; }
.pills { display: flex; gap: 6px; flex-wrap: wrap; }
.pill {
  background: white; border: 2px solid var(--border);
  border-radius: 30px; padding: 6px 13px; font-size: 0.8rem;
  cursor: pointer; transition: all 0.18s; color: var(--ink2);
  box-shadow: var(--sh);
}
.pill:hover { border-color: var(--ocean3); }
.pill.sel { background: var(--sky); border-color: var(--ocean); color: var(--ocean); }
.time-row {
  display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 26px;
  background: white; border: 2px solid var(--border);
  border-radius: var(--r); padding: 20px; box-shadow: var(--sh);
}
.tg { display: flex; flex-direction: column; gap: 6px; }
.tg label { font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
.tinput {
  padding: 10px 15px; border: 2px solid var(--border);
  border-radius: var(--rs); font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem; background: var(--sky); color: var(--ink); outline: none; transition: all 0.2s;
}
.tinput:focus { border-color: var(--ocean); background: white; }
.brow { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
.gobt {
  background: linear-gradient(135deg, var(--ocean), var(--seafoam));
  color: white; border: none; border-radius: 60px; padding: 13px 40px;
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
}
.gobt:hover { filter: brightness(1.08); transform: translateY(-1px); }

/* ── RESULTS ── */
.rl { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
@media(max-width:960px) { .rl { grid-template-columns: 1fr; } }
.map-wrap { margin-bottom: 18px; }
.mapbox { width: 100%; height: 300px; border-radius: var(--r); overflow: hidden; border: 2px solid var(--border); box-shadow: var(--shm); }
.mapbox iframe { width: 100%; height: 100%; border: none; }
.map-hint { font-size: 0.75rem; color: var(--muted2); margin-top: 7px; display: flex; align-items: center; gap: 5px; }
.plgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(248px,1fr)); gap: 13px; }
.plcard {
  background: white; border-radius: var(--r); overflow: hidden;
  border: 2px solid var(--border); cursor: pointer;
  transition: all 0.22s; box-shadow: var(--sh);
}
.plcard:hover { border-color: var(--ocean3); transform: translateY(-2px); box-shadow: var(--shm); }
.plcard.focused { border-color: var(--sunshine); box-shadow: 0 0 0 3px rgba(255,184,0,0.15), var(--shm); }
.plcard.added { border-color: var(--seafoam); }
.plimg {
  width: 100%; height: 155px; overflow: hidden;
  background: var(--sky); display: flex; align-items: center;
  justify-content: center; font-size: 2.5rem; position: relative;
}
.plimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pbadge {
  position: absolute; top: 8px; right: 8px;
  background: rgba(26,31,46,0.72); color: white;
  border-radius: 20px; padding: 3px 9px; font-size: 0.68rem;
  font-weight: 700; backdrop-filter: blur(6px);
}
.pin-badge {
  position: absolute; top: 8px; left: 8px;
  background: var(--seafoam); color: white;
  border-radius: 20px; padding: 3px 9px; font-size: 0.68rem; font-weight: 700;
}
.plbody { padding: 12px 14px; }
.pltype { font-size: 0.64rem; letter-spacing: 2px; text-transform: uppercase; color: var(--ocean); margin-bottom: 3px; font-weight: 600; }
.plname { font-family: 'Playfair Display', serif; font-size: 1.05rem; margin-bottom: 3px; font-weight: 600; color: var(--ink); }
.plrat { font-size: 0.79rem; color: var(--sunshine); }
.plrat span { color: var(--muted2); }
.pldesc { font-size: 0.77rem; color: var(--muted); margin-top: 5px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.plfoot { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--border); }
.pldur { font-size: 0.73rem; color: var(--muted2); }
.addbt {
  background: var(--sky); color: var(--ocean);
  border: 1.5px solid var(--ocean3); border-radius: 30px;
  padding: 6px 16px; font-size: 0.78rem; cursor: pointer;
  transition: all 0.18s; font-weight: 600;
}
.addbt:hover { background: var(--ocean); color: white; border-color: var(--ocean); }
.addbt.added { background: var(--seafoam); color: white; border-color: var(--seafoam); }
.show-more {
  width: 100%; margin-top: 14px; padding: 13px;
  background: white; border: 2px solid var(--border2);
  border-radius: var(--r); font-size: 0.88rem;
  font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s;
  box-shadow: var(--sh);
}
.show-more:hover { border-color: var(--ocean3); color: var(--ocean); }
.show-more:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── SIDEBAR ── */
.sb {
  background: white; border: 2px solid var(--border);
  border-radius: var(--r); padding: 22px 18px;
  position: sticky; top: 78px; box-shadow: var(--shm);
}
.sbt { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 2px; color: var(--ink); }
.sbs { font-size: 0.73rem; color: var(--muted2); margin-bottom: 14px; }
.il { list-style: none; }
.ii {
  background: var(--sky); border-radius: var(--rxs);
  padding: 9px 11px; display: flex; align-items: center;
  justify-content: space-between; font-size: 0.81rem; margin-bottom: 6px;
  cursor: grab; user-select: none; transition: all 0.15s;
  border: 1.5px solid transparent;
}
.ii:active { cursor: grabbing; }
.ii.dragging { opacity: 0.35; }
.ii-l { display: flex; align-items: center; gap: 8px; }
.dh { color: var(--muted2); font-size: 0.85rem; cursor: grab; }
.iis { font-size: 0.67rem; color: var(--muted2); margin-top: 1px; }
.rmbt { background: none; border: none; color: var(--muted2); cursor: pointer; font-size: 0.88rem; transition: color 0.15s; }
.rmbt:hover { color: var(--coral); }
.em { text-align: center; padding: 18px 0; font-size: 0.79rem; color: var(--muted2); }
.finbt {
  width: 100%; margin-top: 12px;
  background: linear-gradient(135deg, var(--ocean), var(--seafoam));
  color: white; border: none; border-radius: 60px; padding: 13px;
  font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem;
  cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
}
.finbt:hover:not(:disabled) { filter: brightness(1.08); }
.finbt:disabled { opacity: 0.28; cursor: not-allowed; }

/* ── DAY TABS ── */
.day-tabs { display: flex; gap: 6px; margin-bottom: 18px; flex-wrap: wrap; }
.day-tab {
  background: white; border: 2px solid var(--border);
  border-radius: 30px; padding: 7px 18px;
  font-size: 0.82rem; font-weight: 600; cursor: pointer;
  transition: all 0.18s; color: var(--muted);
}
.day-tab:hover { border-color: var(--ocean3); color: var(--ocean); }
.day-tab.active { background: var(--ocean); border-color: var(--ocean); color: white; }
.day-tab .count { background: rgba(255,255,255,0.25); border-radius: 20px; padding: 1px 6px; font-size: 0.7rem; margin-left: 5px; }
.day-tab.active .count { background: rgba(255,255,255,0.3); }

/* ── ITINERARY PAGE ── */
.ih { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 14px; }
.imt { font-family: 'Playfair Display', serif; font-size: clamp(2rem,5vw,3rem); line-height: 1.1; }
.imt em { font-style: italic; color: var(--coral); }
.iml { color: var(--muted); font-size: 0.84rem; margin-top: 8px; }
.iac { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.obt { background: white; border: 2px solid var(--border2); color: var(--ink); border-radius: 60px; padding: 9px 22px; font-size: 0.84rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
.obt:hover { border-color: var(--ocean3); color: var(--ocean); }
.dbt { background: var(--ocean); color: white; border: none; border-radius: 60px; padding: 9px 22px; font-size: 0.84rem; cursor: pointer; transition: all 0.2s; font-weight: 600; }
.dbt:hover { background: var(--ocean2); }
.aib {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(13,184,133,0.1); color: var(--seafoam);
  border: 1px solid rgba(13,184,133,0.25);
  border-radius: 20px; padding: 4px 11px; font-size: 0.71rem; font-weight: 600; margin-top: 8px;
}

/* COST SUMMARY */
.cost-box {
  background: linear-gradient(135deg, #fffbf0, #fff8e8);
  border: 2px solid rgba(255,184,0,0.3);
  border-radius: var(--r); padding: 20px 22px;
  margin-bottom: 28px; border-left: 4px solid var(--sunshine);
}
.cost-ttl { font-weight: 700; font-size: 0.9rem; color: var(--ink); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.cost-rows { display: flex; flex-direction: column; gap: 5px; }
.cost-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
.cost-lbl { color: var(--muted); }
.cost-val { font-weight: 600; color: var(--ink); }
.cost-total { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1.5px solid rgba(255,184,0,0.25); font-size: 1rem; font-weight: 700; }
.cost-total-val { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--sunshine); }

/* MULTI-DAY ITIN TABS */
.itin-day-tabs { display: flex; gap: 6px; margin-bottom: 28px; flex-wrap: wrap; }
.idt {
  background: white; border: 2px solid var(--border);
  border-radius: 30px; padding: 8px 20px;
  font-size: 0.84rem; font-weight: 600; cursor: pointer;
  transition: all 0.18s; color: var(--muted);
}
.idt.active { background: var(--ocean); border-color: var(--ocean); color: white; }

/* TIMELINE */
.tl { display: flex; flex-direction: column; }
.tlb { display: grid; grid-template-columns: 88px 1fr; gap: 0 18px; }
.ttc { text-align: right; padding-top: 18px; position: relative; }
.ttime { font-size: 0.79rem; font-weight: 600; color: var(--ocean); white-space: nowrap; cursor: pointer; border-bottom: 1.5px dashed rgba(26,110,181,0.3); display: inline-block; transition: color 0.15s; }
.ttime:hover { color: var(--seafoam); }
.tdur { font-size: 0.64rem; color: var(--muted2); margin-top: 1px; }
.tline { position: absolute; right: -10px; top: 24px; bottom: -24px; width: 2px; background: var(--sky2); }
.tdot { position: absolute; right: -16px; top: 18px; width: 12px; height: 12px; border-radius: 50%; background: var(--ocean); border: 2.5px solid var(--cream); box-shadow: 0 0 0 2px var(--ocean); z-index: 1; }
.tcc { padding: 12px 0 22px; }
.tcard { background: white; border: 1.5px solid var(--border); border-radius: var(--r); overflow: hidden; display: flex; box-shadow: var(--sh); transition: all 0.2s; }
.tcard:hover { border-color: var(--border2); box-shadow: var(--shm); }
.tcimg { width: 110px; min-width: 110px; height: 115px; overflow: hidden; background: var(--sky); display: flex; align-items: center; justify-content: center; font-size: 1.9rem; }
.tcimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tcb { padding: 14px; flex: 1; }
.tctype { font-size: 0.63rem; letter-spacing: 2px; text-transform: uppercase; color: var(--ocean); margin-bottom: 2px; font-weight: 600; }
.tcname { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; margin-bottom: 5px; color: var(--ink); }
.tcdesc { font-size: 0.8rem; color: var(--muted); line-height: 1.55; }
.tcmeta { font-size: 0.74rem; color: var(--sunshine); margin-top: 7px; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.cbadge { background: rgba(255,184,0,0.15); color: #a07000; border: 1px solid rgba(255,184,0,0.3); border-radius: 20px; padding: 2px 9px; font-size: 0.71rem; font-weight: 700; }
.edit-link { font-size: 0.7rem; color: var(--ocean3); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
.edit-link:hover { color: var(--ocean); }
.trvl { display: grid; grid-template-columns: 88px 1fr; gap: 0 18px; }
.trvli { font-size: 0.73rem; color: var(--muted2); display: flex; align-items: center; gap: 6px; background: var(--sky); border-radius: 7px; padding: 5px 11px; margin: 2px 0; }
.travel-loading { font-size: 0.73rem; color: var(--ocean3); display: flex; align-items: center; gap: 6px; padding: 5px 11px; }

/* MODALS */
.pov { position: fixed; inset: 0; background: rgba(26,31,46,0.5); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px); }
.pmodal { background: white; border-radius: var(--r); padding: 32px; width: 100%; max-width: 520px; box-shadow: var(--shl); max-height: 90vh; overflow-y: auto; position: relative; }
.pmc { position: absolute; top: 12px; right: 12px; background: var(--sky); border: none; font-size: 1.1rem; cursor: pointer; color: var(--muted); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.pmc:hover { background: var(--sky2); color: var(--ink); }
.pm-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.pm-av { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--ocean), var(--seafoam)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; color: white; }
.pm-name { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: var(--ink); }
.pm-sub { font-size: 0.79rem; color: var(--muted2); margin-top: 2px; }
.pm-stats { display: flex; gap: 10px; margin-bottom: 22px; }
.pms { background: var(--sky); border-radius: var(--rs); padding: 14px 16px; flex: 1; text-align: center; border: 1px solid var(--border); }
.pms-n { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--ocean); font-weight: 700; }
.pms-l { font-size: 0.7rem; color: var(--muted2); margin-top: 1px; }
.pm-sec { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; font-weight: 600; }
.pm-map { width: 100%; height: 200px; border-radius: var(--rs); overflow: hidden; margin-bottom: 18px; border: 2px solid var(--border); }
.pm-map iframe { width: 100%; height: 100%; border: none; }
.pm-trips { display: flex; flex-direction: column; gap: 7px; max-height: 240px; overflow-y: auto; }
.pm-trip { background: var(--sky); border-radius: var(--rs); padding: 11px 14px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
.pm-trip-city { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 600; color: var(--ink); }
.pm-trip-meta { font-size: 0.72rem; color: var(--muted2); margin-top: 2px; }
.pm-trip-stops { font-size: 0.76rem; color: var(--seafoam); font-weight: 700; }
.pm-empty { color: var(--muted2); text-align: center; padding: 20px; font-size: 0.85rem; }
.pm-btns { display: flex; gap: 9px; margin-top: 18px; }
.pm-switch { flex: 1; padding: 10px; background: var(--sky); border: 2px solid var(--border2); border-radius: 60px; font-size: 0.84rem; cursor: pointer; color: var(--ocean); font-weight: 600; transition: all 0.2s; }
.pm-switch:hover { border-color: var(--ocean3); }
.pm-logout { flex: 1; padding: 10px; background: var(--sky); border: 2px solid var(--border2); border-radius: 60px; font-size: 0.84rem; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.pm-logout:hover { color: var(--coral); border-color: rgba(255,87,87,0.3); }

/* USER SETUP */
.usetup { background: white; border-radius: var(--r); padding: 36px; width: 100%; max-width: 400px; box-shadow: var(--shl); border: 2px solid var(--border); }
.ust { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 5px; color: var(--ink); }
.uss { color: var(--muted); font-size: 0.85rem; margin-bottom: 22px; line-height: 1.6; }
.uinp { width: 100%; padding: 13px 16px; border: 2px solid var(--border); border-radius: var(--rs); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; background: var(--sky); color: var(--ink); outline: none; transition: all 0.2s; margin-bottom: 12px; }
.uinp:focus { border-color: var(--ocean); background: white; }
.uinp::placeholder { color: var(--muted2); }
.ubf { width: 100%; padding: 13px; background: linear-gradient(135deg, var(--ocean), var(--seafoam)); color: white; border: none; border-radius: 60px; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.ubf:hover { filter: brightness(1.07); }
.div-or { display: flex; align-items: center; gap: 10px; margin: 16px 0; color: var(--muted2); font-size: 0.78rem; }
.div-or::before, .div-or::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.user-list { display: flex; flex-direction: column; gap: 7px; }
.user-item { display: flex; align-items: center; gap: 11px; background: var(--sky); border: 2px solid var(--border); border-radius: var(--rs); padding: 10px 13px; cursor: pointer; transition: all 0.2s; }
.user-item:hover { border-color: var(--ocean3); background: var(--sky2); }
.user-item-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--ocean3), var(--seafoam)); display: flex; align-items: center; justify-content: center; font-size: 0.76rem; font-weight: 700; color: white; flex-shrink: 0; }
.user-item-name { font-weight: 600; font-size: 0.87rem; color: var(--ink); }
.user-item-meta { font-size: 0.71rem; color: var(--muted2); }
.user-item-del { background: none; border: none; color: var(--muted2); cursor: pointer; margin-left: auto; font-size: 0.85rem; padding: 4px; transition: color 0.15s; }
.user-item-del:hover { color: var(--coral); }

/* TIME EDIT */
.teov { position: fixed; inset: 0; background: rgba(26,31,46,0.5); z-index: 400; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
.temod { background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 26px; width: 100%; max-width: 310px; box-shadow: var(--shl); }
.temt { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700; margin-bottom: 4px; color: var(--ink); }
.tems { color: var(--muted2); font-size: 0.8rem; margin-bottom: 16px; }
.temr { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.teml { font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
.temi { padding: 10px 13px; border: 2px solid var(--border); border-radius: var(--rs); font-family: 'DM Sans', sans-serif; font-size: 0.92rem; background: var(--sky); color: var(--ink); outline: none; width: 100%; transition: all 0.2s; }
.temi:focus { border-color: var(--ocean); background: white; }
.tembtns { display: flex; gap: 9px; margin-top: 14px; }
.tem-c { flex: 1; padding: 10px; background: var(--sky); border: 2px solid var(--border); border-radius: 60px; font-size: 0.83rem; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.tem-c:hover { border-color: var(--border2); }
.tem-s { flex: 1; padding: 10px; background: var(--ocean); color: white; border: none; border-radius: 60px; font-size: 0.83rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.tem-s:hover { background: var(--ocean2); }

/* LOADING */
.ls { position: fixed; inset: 0; background: rgba(26,31,46,0.6); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; backdrop-filter: blur(8px); }
.spin { width: 38px; height: 38px; border: 3px solid rgba(255,255,255,0.2); border-top-color: var(--ocean); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.lt { color: white; font-size: 0.9rem; font-weight: 400; }
.lt-sub { color: rgba(255,255,255,0.6); font-size: 0.78rem; }
.toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); background: var(--ink); color: white; padding: 10px 22px; border-radius: 60px; font-size: 0.84rem; z-index: 600; transition: opacity 0.3s; pointer-events: none; white-space: nowrap; box-shadow: var(--shm); }
@media print { .np { display: none !important; } }
`;

// ─── DATA ─────────────────────────────────────────────────────
const BUDGETS = [
  { id:"free", tier:"$", label:"Free & Budget", range:"$0–$25/person", desc:"Parks, free museums, street food & hidden gems.", color:"#0db885", avg:12 },
  { id:"mid", tier:"$$", label:"Mid-Range", range:"$25–$75/person", desc:"Casual dining, paid attractions & comfortable experiences.", color:"#d4920a", avg:45 },
  { id:"upscale", tier:"$$$", label:"Upscale", range:"$75–$150/person", desc:"Nicer restaurants, private tours & premium venues.", color:"#8b5cf6", avg:110 },
  { id:"luxury", tier:"$$$$", label:"Luxury", range:"$150+/person", desc:"Fine dining, exclusive experiences & VIP access.", color:"#ff5757", avg:220 },
];

const TRANSPORT = [
  { id:"walking", icon:"🚶", name:"Walking" },
  { id:"transit", icon:"🚌", name:"Transit" },
  { id:"driving", icon:"🚗", name:"Driving" },
  { id:"cycling", icon:"🚴", name:"Cycling" },
  { id:"rideshare", icon:"🚕", name:"Rideshare" },
];

const PREFS = [
  { val:"sightseeing", icon:"🏛️", name:"Sightseeing", desc:"Landmarks & historic sites" },
  { val:"restaurants", icon:"🍽️", name:"Dining", desc:"Local favorites & top-rated" },
  { val:"museums", icon:"🎨", name:"Museums", desc:"Art, history & science" },
  { val:"hiking", icon:"🥾", name:"Nature & Hiking", desc:"Trails, parks & outdoors" },
  { val:"shopping", icon:"🛍️", name:"Shopping", desc:"Markets & boutiques" },
  { val:"entertainment", icon:"🎭", name:"Entertainment", desc:"Shows & nightlife" },
  { val:"cafes", icon:"☕", name:"Cafés", desc:"Coffee & cozy spots" },
  { val:"sports", icon:"⚽", name:"Sports", desc:"Active experiences" },
];

const CITIES = [
  {city:"New York City",country:"United States",flag:"🇺🇸"},{city:"Paris",country:"France",flag:"🇫🇷"},
  {city:"Tokyo",country:"Japan",flag:"🇯🇵"},{city:"London",country:"United Kingdom",flag:"🇬🇧"},
  {city:"Rome",country:"Italy",flag:"🇮🇹"},{city:"Barcelona",country:"Spain",flag:"🇪🇸"},
  {city:"Kyoto",country:"Japan",flag:"🇯🇵"},{city:"Amsterdam",country:"Netherlands",flag:"🇳🇱"},
  {city:"Chicago",country:"United States",flag:"🇺🇸"},{city:"Sydney",country:"Australia",flag:"🇦🇺"},
  {city:"Dubai",country:"UAE",flag:"🇦🇪"},{city:"Lisbon",country:"Portugal",flag:"🇵🇹"},
  {city:"Nashville",country:"United States",flag:"🇺🇸"},{city:"New Orleans",country:"United States",flag:"🇺🇸"},
  {city:"Charlottesville",country:"United States",flag:"🇺🇸"},{city:"Mexico City",country:"Mexico",flag:"🇲🇽"},
  {city:"Bali",country:"Indonesia",flag:"🇮🇩"},{city:"Istanbul",country:"Turkey",flag:"🇹🇷"},
  {city:"Prague",country:"Czech Republic",flag:"🇨🇿"},{city:"Buenos Aires",country:"Argentina",flag:"🇦🇷"},
];

const MOCK = [
  {id:1,name:"Central Park",type:"Park",rating:4.8,reviews:42300,emoji:"🌳",desc:"An iconic 843-acre urban oasis with meadows, lakes, and world-famous skyline views.",duration:90,lat:40.7851,lng:-73.9683,priceLevel:0},
  {id:2,name:"Metropolitan Museum of Art",type:"Museum",rating:4.9,reviews:31000,emoji:"🎨",desc:"One of the world's great art museums, spanning 5,000 years of civilizations.",duration:120,lat:40.7794,lng:-73.9632,priceLevel:2},
  {id:3,name:"Brooklyn Bridge",type:"Landmark",rating:4.8,reviews:55000,emoji:"🌉",desc:"Walk this iconic 1883 suspension bridge for breathtaking Manhattan skyline views.",duration:45,lat:40.7061,lng:-73.9969,priceLevel:0},
  {id:4,name:"Katz's Delicatessen",type:"Restaurant",rating:4.5,reviews:12000,emoji:"🥪",desc:"A legendary NYC institution since 1888, famous for its towering pastrami sandwiches.",duration:60,lat:40.7223,lng:-73.9874,priceLevel:2},
  {id:5,name:"Times Square",type:"Landmark",rating:4.5,reviews:98000,emoji:"🌆",desc:"The neon-lit, electric heart of Manhattan — overwhelming and utterly unforgettable.",duration:45,lat:40.758,lng:-73.9855,priceLevel:0},
  {id:6,name:"The High Line",type:"Park",rating:4.7,reviews:29000,emoji:"🌿",desc:"A 1.45-mile elevated park built on a former freight rail line with Hudson River views.",duration:75,lat:40.748,lng:-74.0048,priceLevel:0},
  {id:7,name:"Museum of Modern Art",type:"Museum",rating:4.7,reviews:22000,emoji:"🖼️",desc:"MoMA houses extraordinary modern art — from Picasso's masterworks to Warhol's icons.",duration:120,lat:40.7614,lng:-73.9776,priceLevel:2},
  {id:8,name:"Smorgasburg",type:"Food Market",rating:4.6,reviews:8900,emoji:"🍜",desc:"Brooklyn's beloved open-air food market with 100+ local vendors every weekend.",duration:90,lat:40.7223,lng:-73.9592,priceLevel:1},
];

// ─── HELPERS ──────────────────────────────────────────────────
function purl(ref) { if(!ref||!GOOGLE_KEY||GOOGLE_KEY==="PASTE_YOUR_GOOGLE_KEY_HERE") return null; return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${GOOGLE_KEY}`; }
function ft(h,m) { const ap=h>=12?"PM":"AM"; const hh=h>12?h-12:h===0?12:h; return `${hh}:${String(m).padStart(2,"0")} ${ap}`; }
function useToast() { const[msg,setMsg]=useState(""); const[vis,setVis]=useState(false); const t=useRef(); const show=m=>{setMsg(m);setVis(true);clearTimeout(t.current);t.current=setTimeout(()=>setVis(false),2500);}; return{msg,vis,show}; }

// Static map URL showing multiple pins using Google Maps Static API
function buildStaticMapUrl(places) {
  if (!GOOGLE_KEY || !places.length) return null;
  const size = "600x280";
  const style = "&style=feature:water|color:0xa8d8ea&style=feature:landscape|color:0xf5f0e8";
  const markers = places.map((p,i) =>
    `&markers=color:0x1a6eb5|label:${i+1}|${p.lat},${p.lng}`
  ).join("");
  return `https://maps.googleapis.com/maps/api/staticmap?size=${size}&scale=2${markers}&key=${GOOGLE_KEY}`;
}

// ─── AI FUNCTIONS ─────────────────────────────────────────────
async function fetchAIDescs(places, city, budget, prefs) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "PASTE_YOUR_ANTHROPIC_KEY_HERE") return null;
  const list = places.map((p,i) => `${i+1}. ${p.name} (${p.type})`).join("\n");
  const blabel = budget ? BUDGETS.find(b=>b.id===budget)?.label : "moderate";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1500,
        messages:[{role:"user",content:`Write vivid, specific 2-sentence travel descriptions for each place in ${city}. Budget: ${blabel}. Interests: ${prefs||"general"}. Be specific about what makes each place uniquely worth visiting.\n${list}\nRespond ONLY as JSON: [{"id":1,"desc":"..."}]\nNo markdown.`}]
      })
    });
    const d = await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  } catch { return null; }
}

async function fetchAICosts(places, city, budget) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "PASTE_YOUR_ANTHROPIC_KEY_HERE") return null;
  const list = places.map((p,i) => `${i+1}. ${p.name} (${p.type})`).join("\n");
  const blabel = budget ? BUDGETS.find(b=>b.id===budget)?.label : "mid-range";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
        messages:[{role:"user",content:`Research and estimate realistic per-person costs in USD for each of these places in ${city} for a ${blabel} traveler. Look up actual admission prices, menu prices for restaurants, or market rates. Be specific and varied — do NOT give the same price to everything. For free parks use $0. For restaurants estimate a typical meal cost. For museums use actual ticket prices.\n${list}\nRespond ONLY as JSON: [{"id":1,"cost":25,"note":"Suggested donation"}]\nNo markdown.`}]
      })
    });
    const d = await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  } catch { return null; }
}

// ─── DIRECTIONS API ───────────────────────────────────────────
async function fetchTravelTime(origin, destination, mode) {
  try {
    const params = new URLSearchParams({ origin:`${origin.lat},${origin.lng}`, destination:`${destination.lat},${destination.lng}`, mode });
    const r = await fetch(`/api/directions?${params}`);
    const d = await r.json();
    return d.minutes || 15;
  } catch { return 15; }
}

async function fetchAllTravelTimes(places, transport) {
  if (places.length < 2) return {};
  const results = {};
  for (let i = 0; i < places.length - 1; i++) {
    const mins = await fetchTravelTime(
      { lat: places[i].lat, lng: places[i].lng },
      { lat: places[i+1].lat, lng: places[i+1].lng },
      transport
    );
    results[i] = mins;
  }
  return results;
}

// ─── STORAGE ──────────────────────────────────────────────────
const USERS_KEY = "mapistry_users_v2";
const ACTIVE_KEY = "mapistry_active_v2";
function loadUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)||"{}"); } catch { return {}; } }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function loadActive() { return localStorage.getItem(ACTIVE_KEY)||null; }
function saveActive(n) { localStorage.setItem(ACTIVE_KEY, n); }
function getUserHist(name) { const u=loadUsers(); return u[name]?.history||[]; }
function saveUserHist(name, h) { const u=loadUsers(); if(!u[name]) u[name]={created:new Date().toLocaleDateString()}; u[name].history=h; saveUsers(u); }
function getUserCreated(name) { return loadUsers()[name]?.created||""; }

// ─── PDF EXPORT ───────────────────────────────────────────────
function exportPDF(city, dayPlans, budget, transport, descMap, costMap, travelMap) {
  const{jsPDF}=window.jspdf||{};
  if(!jsPDF){alert("jsPDF not loaded.");return;}
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();
  doc.setFillColor(26,110,181); doc.rect(0,0,W,36,"F");
  doc.setFont("times","bold"); doc.setFontSize(22); doc.setTextColor(255,255,255); doc.text("Mapistry",14,22);
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(200,225,245); doc.text("Your personal travel planner",14,30);
  doc.setFont("times","bold"); doc.setFontSize(18); doc.setTextColor(26,31,46); doc.text(`Your Trip to ${city}`,14,52);
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=TRANSPORT.find(t=>t.id===transport)?.name||"Walking";
  const meta=[blabel,`by ${tlabel}`].filter(Boolean).join(" · ");
  if(meta){doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(107,114,128);doc.text(meta,14,60);}
  let y=68;
  dayPlans.forEach((day,di)=>{
    if(dayPlans.length>1){
      if(y>260){doc.addPage();y=20;}
      doc.setFillColor(232,244,253); doc.rect(14,y-4,W-28,10,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(26,110,181);
      doc.text(`Day ${di+1}`,16,y+3); y+=14;
    }
    let h=day.startH, m=day.startM;
    day.places.forEach((p,i)=>{
      if(y>250){doc.addPage();y=20;}
      const ts=ft(h,m),eH=h+Math.floor((m+p.duration)/60),eM=(m+p.duration)%60,te=ft(eH,eM);
      doc.setFillColor(26,110,181); doc.roundedRect(14,y-4,36,8,4,4,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255); doc.text(`${ts}–${te}`,16,y+1.5);
      const cost=costMap?.[p.id];
      if(cost!=null){doc.setFillColor(255,184,0);doc.roundedRect(52,y-4,20,8,4,4,"F");doc.setTextColor(26,31,46);doc.text(`$${cost}`,54,y+1.5);}
      y+=10;
      doc.setFont("times","bold");doc.setFontSize(13);doc.setTextColor(26,31,46);doc.text(p.name,14,y);y+=6;
      doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(107,114,128);doc.text(`${p.type} · ★ ${p.rating} · ~${p.duration} min`,14,y);y+=6;
      const desc=descMap?.[p.id]||p.desc;
      doc.setFontSize(9);doc.setTextColor(50,50,60);const lines=doc.splitTextToSize(desc,W-28);doc.text(lines,14,y);y+=lines.length*5+4;
      if(i<day.places.length-1){
        const tv=travelMap?.[`${di}-${i}`]||15;
        doc.setFont("helvetica","italic");doc.setFontSize(8);doc.setTextColor(13,184,133);
        doc.text(`  ~${tv} min ${tlabel.toLowerCase()} to next stop`,14,y);y+=7;
        h=eH+Math.floor((eM+tv)/60);m=(eM+tv)%60;
      }
      doc.setDrawColor(220,228,240);doc.line(14,y,W-14,y);y+=7;
    });
  });
  const pg=doc.internal.getNumberOfPages();
  for(let i=1;i<=pg;i++){doc.setPage(i);doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(107,114,128);doc.text(`Mapistry · Page ${i} of ${pg}`,W/2,290,{align:"center"});}
  doc.save(`mapistry-${city.replace(/\s+/g,"-").toLowerCase()}.pdf`);
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [cin, setCin] = useState("");
  const [sugg, setSugg] = useState([]);
  const [showS, setShowS] = useState(false);
  const [prefs, setPrefs] = useState(new Set());
  const [cprefs, setCprefs] = useState([]);
  const [cpinput, setCpinput] = useState("");
  const [budget, setBudget] = useState(null);
  const [transport, setTransport] = useState("walking");
  const [numDays, setNumDays] = useState(1);
  const [conds, setConds] = useState({});
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("21:00");

  // places state
  const [places, setPlaces] = useState(MOCK);
  const [allPlaces, setAllPlaces] = useState(MOCK);
  const [visibleCount, setVisibleCount] = useState(8);
  const [focusedId, setFocusedId] = useState(null);
  const [previewMapSrc, setPreviewMapSrc] = useState("");
  const [staticMapUrl, setStaticMapUrl] = useState("");

  // multi-day itinerary: array of arrays, one per day
  const [dayPlans, setDayPlans] = useState([[]]);
  const [activeDay, setActiveDay] = useState(0); // which day tab is active in step 3 sidebar
  const [itinViewDay, setItinViewDay] = useState(0); // which day tab in step 4

  // AI results
  const [descMap, setDescMap] = useState(null);
  const [costMap, setCostMap] = useState(null);
  const [travelMap, setTravelMap] = useState({});
  const [travelLoading, setTravelLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [lmsg, setLmsg] = useState("");
  const [lsub, setLsub] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [dragDay, setDragDay] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [editTimeVal, setEditTimeVal] = useState("");
  const [editDurVal, setEditDurVal] = useState(60);

  // accounts
  const [activeUser, setActiveUser] = useState(null);
  const [hist, setHist] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserSetup, setShowUserSetup] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const toast = useToast();
  const sref = useRef();
  const nextToken = useRef(null);

  // load user on mount
  useEffect(() => {
    const active = loadActive();
    if (active && loadUsers()[active]) {
      setActiveUser(active);
      setHist(getUserHist(active));
    }
  }, []);

  // sync dayPlans count when numDays changes
  useEffect(() => {
    setDayPlans(prev => {
      const next = [...prev];
      while (next.length < numDays) next.push([]);
      while (next.length > numDays) next.pop();
      return next;
    });
    if (activeDay >= numDays) setActiveDay(numDays - 1);
  }, [numDays]);

  // city autocomplete
  useEffect(() => {
    if (cin.length < 2) { setSugg([]); return; }
    const q = cin.toLowerCase();
    setSugg(CITIES.filter(s => s.city.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)).slice(0, 6));
    setShowS(true);
  }, [cin]);

  useEffect(() => {
    const fn = e => { if (sref.current && !sref.current.contains(e.target)) setShowS(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function selCity(c) { setCin(c); setCity(c); setShowS(false); }

  // update static map when itin changes
  useEffect(() => {
    const allAdded = dayPlans.flat();
    if (allAdded.length > 0) {
      setStaticMapUrl(buildStaticMapUrl(allAdded));
    } else {
      setStaticMapUrl("");
    }
  }, [dayPlans]);

  // ── ACCOUNTS ────────────────────────────────────────────────
  function createUser() {
    const name = usernameInput.trim();
    if (!name) { toast.show("Please enter a name!"); return; }
    const users = loadUsers();
    if (!users[name]) users[name] = { created: new Date().toLocaleDateString(), history: [] };
    saveUsers(users);
    saveActive(name);
    setActiveUser(name);
    setHist(users[name].history || []);
    setShowUserSetup(false);
    setUsernameInput("");
    toast.show(`Welcome, ${name}! 👋`);
  }

  function switchUser(name) {
    saveActive(name);
    setActiveUser(name);
    setHist(getUserHist(name));
    setShowUserSetup(false);
    setShowProfile(false);
    toast.show(`Switched to ${name}`);
  }

  function deleteUser(name, e) {
    e.stopPropagation();
    const users = loadUsers();
    delete users[name];
    saveUsers(users);
    if (activeUser === name) { setActiveUser(null); setHist([]); localStorage.removeItem(ACTIVE_KEY); }
    toast.show(`Deleted ${name}`);
  }

  function logout() {
    setActiveUser(null); setHist([]);
    localStorage.removeItem(ACTIVE_KEY);
    setShowProfile(false);
    toast.show("Logged out");
  }

  function saveTrip() {
    if (!activeUser) return;
    const allPlacesFlat = dayPlans.flat();
    if (!allPlacesFlat.length) return;
    const entry = {
      id: Date.now(), city,
      lat: allPlacesFlat[0]?.lat || 0, lng: allPlacesFlat[0]?.lng || 0,
      date: new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" }),
      stops: allPlacesFlat.length, days: numDays,
      img: allPlacesFlat[0]?.photoRef ? purl(allPlacesFlat[0].photoRef) : null,
      emoji: allPlacesFlat[0]?.emoji || "📍",
      places: allPlacesFlat.map(p => p.name)
    };
    const newHist = [entry, ...hist].slice(0, 30);
    setHist(newHist);
    saveUserHist(activeUser, newHist);
  }

  // ── PREFS & CUSTOM TAGS ──────────────────────────────────────
  function addCpref() {
    const v = cpinput.trim();
    if (!v) return;
    if (cprefs.includes(v)) { toast.show("Already added!"); return; }
    setCprefs(c => [...c, v]);
    setCpinput("");
  }

  // ── FETCH PLACES ─────────────────────────────────────────────
  async function doFetch(c, token = null) {
    try {
      const allP = [...prefs, ...cprefs];
      const q = allP.length > 0 ? `${allP.join(" and ")} in ${c}` : `top attractions in ${c}`;
      const url = token
        ? `/api/places?query=${encodeURIComponent(q)}&pagetoken=${token}`
        : `/api/places?query=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results?.length > 0) {
        return {
          places: data.results.map((p, i) => ({
            id: Date.now() + i, name: p.name,
            type: (p.types?.[0] || "attraction").replace(/_/g, " "),
            rating: p.rating || 4.0, reviews: p.user_ratings_total || 0,
            emoji: "📍",
            desc: p.editorial_summary?.overview || p.formatted_address || `A great spot in ${c}.`,
            duration: 60, lat: p.geometry.location.lat, lng: p.geometry.location.lng,
            photoRef: p.photos?.[0]?.photo_reference || null,
            priceLevel: p.price_level ?? 1,
          })),
          nextToken: data.next_page_token || null
        };
      }
    } catch (e) { console.log(e); }
    return { places: MOCK, nextToken: null };
  }

  async function goToResults() {
    const c = cin.trim();
    if (!c) { toast.show("Please enter a city!"); return; }
    setCity(c);
    setPreviewMapSrc(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(c)}&zoom=13`);
    setLmsg(`Finding the best spots in ${c}…`);
    setLoading(true);
    const { places: p, nextToken: nt } = await doFetch(c);
    nextToken.current = nt;
    setAllPlaces(p); setPlaces(p); setVisibleCount(8);
    setDayPlans(Array.from({ length: numDays }, () => []));
    setLoading(false);
    setStep(3);
  }

  async function showMore() {
    setLmsg("Loading more places…"); setLoading(true);
    if (nextToken.current) {
      await new Promise(r => setTimeout(r, 2000));
      const { places: more, nextToken: nt } = await doFetch(city, nextToken.current);
      nextToken.current = nt;
      const combined = [...allPlaces, ...more];
      setAllPlaces(combined); setPlaces(combined); setVisibleCount(v => v + 9);
    } else { setVisibleCount(v => v + 8); }
    setLoading(false);
  }

  // Click to preview one place on map
  function focusPlace(p) {
    setFocusedId(p.id);
    const allAdded = dayPlans.flat();
    if (allAdded.length > 0) {
      // show all added + this focused one
      const toShow = allAdded.find(x => x.id === p.id) ? allAdded : [...allAdded, p];
      setStaticMapUrl(buildStaticMapUrl(toShow));
    } else {
      setPreviewMapSrc(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(p.name + " " + city)}&zoom=16`);
    }
  }

  function addToDay(place, dayIndex) {
    setDayPlans(prev => {
      const next = prev.map(d => [...d]);
      if (next[dayIndex].find(x => x.id === place.id)) {
        next[dayIndex] = next[dayIndex].filter(x => x.id !== place.id);
      } else {
        next[dayIndex] = [...next[dayIndex], place];
        toast.show(`Added to Day ${dayIndex + 1}!`);
      }
      return next;
    });
  }

  function removeFromDay(placeId, dayIndex) {
    setDayPlans(prev => {
      const next = prev.map(d => [...d]);
      next[dayIndex] = next[dayIndex].filter(x => x.id !== placeId);
      return next;
    });
  }

  function isAdded(placeId) {
    return dayPlans.some(day => day.find(p => p.id === placeId));
  }

  // ── GENERATE ITINERARY ───────────────────────────────────────
  async function goToItinerary() {
    const allAdded = dayPlans.flat();
    if (allAdded.length === 0) { toast.show("Add at least one place!"); return; }
    setLmsg("Crafting your perfect day…"); setLsub(""); setLoading(true);

    let dm = null, cm = null;
    if (ANTHROPIC_KEY && ANTHROPIC_KEY !== "PASTE_YOUR_ANTHROPIC_KEY_HERE") {
      setLmsg("✨ AI is writing your itinerary…");
      setLsub("Personalizing descriptions & researching costs");
      const allP = [...prefs, ...cprefs].join(", ");
      const [descRes, costRes] = await Promise.all([
        fetchAIDescs(allAdded, city, budget, allP),
        fetchAICosts(allAdded, city, budget),
      ]);
      if (descRes) { dm = {}; descRes.forEach(x => { dm[x.id] = x.desc; }); setAiUsed(true); }
      if (costRes) { cm = {}; costRes.forEach(x => { cm[x.id] = x.cost; }); }
    }

    setDescMap(dm); setCostMap(cm);
    setLoading(false);
    setStep(4);
    setItinViewDay(0);
    saveTrip();

    // Fetch real travel times after rendering
    setTravelLoading(true);
    const tm = {};
    for (let di = 0; di < dayPlans.length; di++) {
      const day = dayPlans[di];
      for (let i = 0; i < day.length - 1; i++) {
        const mins = await fetchTravelTime(
          { lat: day[i].lat, lng: day[i].lng },
          { lat: day[i+1].lat, lng: day[i+1].lng },
          transport
        );
        tm[`${di}-${i}`] = mins;
      }
    }
    setTravelMap(tm);
    setTravelLoading(false);
  }

  // ── DRAG & DROP (across days) ────────────────────────────────
  function onDragStart(i, dayIdx) { setDragIdx(i); setDragDay(dayIdx); }
  function onDragOver(e, i, dayIdx) {
    e.preventDefault();
    if (dragIdx === null) return;
    if (dragDay === dayIdx && dragIdx === i) return;
    setDayPlans(prev => {
      const next = prev.map(d => [...d]);
      const [item] = next[dragDay].splice(dragIdx, 1);
      next[dayIdx].splice(i, 0, item);
      return next;
    });
    setDragIdx(i);
    setDragDay(dayIdx);
  }
  function onDragEnd() { setDragIdx(null); setDragDay(null); }

  // ── TIME EDITING ─────────────────────────────────────────────
  function openEdit(p) { setEditingPlace(p); setEditTimeVal(p.customTime || ""); setEditDurVal(p.duration || 60); }
  function saveEdit() {
    setDayPlans(prev => prev.map(day => day.map(p => p.id === editingPlace.id ? { ...p, customTime: editTimeVal || undefined, duration: editDurVal } : p)));
    setEditingPlace(null);
    toast.show("Updated!");
  }

  // ── TIMELINE COMPUTATION ─────────────────────────────────────
  function computeDayTimes(dayIndex) {
    const [sh, sm] = startTime.split(":").map(Number);
    let h = sh, m = sm;
    const day = dayPlans[dayIndex] || [];
    return day.map((place, i) => {
      const travelMin = travelMap[`${dayIndex}-${i}`] || "…";
      if (place.customTime) {
        const [ch, cm2] = place.customTime.split(":").map(Number);
        const eH = ch + Math.floor((cm2 + place.duration) / 60), eM = (cm2 + place.duration) % 60;
        if (i < day.length - 1) { h = eH + Math.floor((eM + (travelMap[`${dayIndex}-${i}`] || 15)) / 60); m = (eM + (travelMap[`${dayIndex}-${i}`] || 15)) % 60; }
        return { start: ft(ch, cm2), end: ft(eH, eM), travel: travelMin };
      }
      const ts = ft(h, m);
      const eH = h + Math.floor((m + place.duration) / 60), eM = (m + place.duration) % 60;
      if (i < day.length - 1) { h = eH + Math.floor((eM + (travelMap[`${dayIndex}-${i}`] || 15)) / 60); m = (eM + (travelMap[`${dayIndex}-${i}`] || 15)) % 60; }
      return { start: ts, end: ft(eH, eM), travel: travelMin };
    });
  }

  // ── DERIVED STATE ────────────────────────────────────────────
  const blabel = budget ? BUDGETS.find(b => b.id === budget)?.label : null;
  const tlabel = TRANSPORT.find(t => t.id === transport)?.name || "Walking";
  const allAdded = dayPlans.flat();
  const totalCost = costMap ? allAdded.reduce((s, p) => s + (costMap[p.id] ?? 0), 0) : null;
  const visiblePlaces = places.slice(0, visibleCount);
  const initials = activeUser ? activeUser.slice(0, 2).toUpperCase() : "";
  const knownUsers = Object.keys(loadUsers());
  const visitedCities = [...new Set(hist.map(h => h.city))];

  const profileMapSrc = visitedCities.length > 0
    ? `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_KEY}&q=${encodeURIComponent(visitedCities.join(" OR "))}&zoom=2`
    : `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=world&zoom=2`;

  // Map to show in results step
  const mapSrc = (() => {
    const added = dayPlans.flat();
    if (staticMapUrl && added.length > 0) return null; // use static map
    return previewMapSrc || `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(city)}&zoom=13`;
  })();

  // Build dayPlans with start times for PDF
  const dayPlansForPDF = dayPlans.map(day => {
    const [sh, sm] = startTime.split(":").map(Number);
    return { places: day, startH: sh, startM: sm };
  });

  return (
    <>
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className="nav np">
        <div className="nav-l">
          <div className="logo" onClick={() => { setStep(1); setDayPlans([[]]); setCin(""); setCity(""); }}>
            Mapit<em>stry</em>
          </div>
          {step > 1 && <button className="back" onClick={() => setStep(step - 1)}>← Back</button>}
        </div>
        <div className="nav-r">
          {city && step > 1 && <div className="nav-city">📍 {city}</div>}
          {step > 1 && <div className="prog">{[1,2,3,4].map(s => <div key={s} className={`pd ${s===step?"on":s<step?"done":""}`}/>)}</div>}
          {activeUser
            ? <button className="ubtn" onClick={() => setShowProfile(true)}><div className="uav">{initials}</div>{activeUser}</button>
            : <button className="ubtn guest" onClick={() => setShowUserSetup(true)}>👤 Sign In</button>
          }
        </div>
      </nav>

      {/* ── STEP 1: HERO ── */}
      {step === 1 && (
        <div className="hero">
          <div className="hero-shapes">
            <div className="hero-shape hs1"/><div className="hero-shape hs2"/><div className="hero-shape hs3"/>
          </div>
          <div className="hero-left">
            <div className="hero-badge"><div className="badge-pulse"/>AI-Powered Travel Planner</div>
            <h1 className="hero-h1">
              Plan your <em>perfect day</em>,<br/>
              <span className="accent">anywhere</span> in the world.
            </h1>
            <p className="hero-sub">Enter any city or town — get a personalized itinerary with real photos, AI cost estimates, and real-time travel times.</p>
            <div className="hero-pills">
              {[
                { dot:"#0db885", text:"Real Google Places photos" },
                { dot:"#1a6eb5", text:"AI-written descriptions" },
                { dot:"#ffb800", text:"Realistic cost estimates" },
                { dot:"#ff5757", text:"Live travel time calculations" },
              ].map(p => (
                <div key={p.text} className="hero-pill">
                  <div className="hero-pill-dot" style={{ background: p.dot }}/>
                  {p.text}
                </div>
              ))}
            </div>
            <div className="sc" ref={sref}>
              <div className="sw">
                <div className="si-wrap">
                  <div className="sicon">📍</div>
                  <input className="si" placeholder="Type any city or town…" value={cin}
                    onChange={e => { setCin(e.target.value); setCity(e.target.value); }}
                    onKeyDown={e => { if (e.key === "Enter" && cin.trim()) { setShowS(false); setStep(2); } }}
                    onFocus={() => cin.length >= 2 && setShowS(true)}
                  />
                </div>
                <button className="sbtn" onClick={() => { if (cin.trim()) { setShowS(false); setStep(2); } else toast.show("Please enter a city!"); }}>
                  Explore →
                </button>
              </div>
              {showS && sugg.length > 0 && (
                <div className="ssugg">
                  {sugg.map(s => (
                    <div key={s.city} className="sitem" onClick={() => selCity(s.city)}>
                      <span>{s.flag}</span>
                      <div><div>{s.city}</div><div className="ssub">{s.country}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="chips">
              {["🗽 New York City","🗼 Paris","🏯 Kyoto","🎸 Nashville","🏛️ Rome","🌊 Bali"].map(c => (
                <div key={c} className="chip" onClick={() => { const v=c.split(" ").slice(1).join(" "); setCin(v); setCity(v); setShowS(false); }}>{c}</div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="dest-cards">
              {[
                {emo:"🗼", bg:"#e8f4fd", name:"Eiffel Tower", meta:"Paris, France · ★ 4.7 · Landmark", tag:"Free entry", tagClass:"tag-green"},
                {emo:"🏯", bg:"#fff8f0", name:"Fushimi Inari", meta:"Kyoto, Japan · ★ 4.9 · Temple", tag:"~2 hours", tagClass:"tag-blue"},
                {emo:"🎨", bg:"#f0f8ff", name:"Uffizi Gallery", meta:"Florence, Italy · ★ 4.6 · Museum", tag:"~$20", tagClass:"tag-orange"},
              ].map(d => (
                <div key={d.name} className="dest-card">
                  <div className="dest-emo" style={{ background: d.bg }}>{d.emo}</div>
                  <div style={{ flex:1 }}>
                    <div className="dest-name">{d.name}</div>
                    <div className="dest-meta">{d.meta}</div>
                  </div>
                  <div className={`dest-tag ${d.tagClass}`}>{d.tag}</div>
                </div>
              ))}
            </div>
            <div className="hero-stats">
              <div className="hstat"><div className="hstat-n">AI</div><div className="hstat-l">Personalized</div></div>
              <div className="hstat"><div className="hstat-n">50+</div><div className="hstat-l">Cities</div></div>
              <div className="hstat"><div className="hstat-n">Free</div><div className="hstat-l">Always</div></div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: PREFERENCES ── */}
      {step === 2 && (
        <div className="page">
          <div className="sh">
            <div className="sey">Step 2 of 4</div>
            <h2 className="st">Customize your trip to <span>{city}</span></h2>
            <p className="ss">Tell us what you love, how you get around, and how long you're staying.</p>
          </div>

          <div className="pg">
            {PREFS.map(p => (
              <div key={p.val} className={`pc ${prefs.has(p.val) ? "sel" : ""}`} onClick={() => setPrefs(prev => { const n = new Set(prev); n.has(p.val) ? n.delete(p.val) : n.add(p.val); return n; })}>
                <div className="pi">{p.icon}</div><div className="pn">{p.name}</div><div className="pd2">{p.desc}</div>
              </div>
            ))}
          </div>
          <div className="cpw">
            <input className="cpi" placeholder="Type your own interest… e.g. jazz bars, rooftop views, street art" value={cpinput} onChange={e => setCpinput(e.target.value)} onKeyDown={e => e.key === "Enter" && addCpref()}/>
            <button className="cap" onClick={addCpref}>+ Add</button>
          </div>
          {cprefs.length > 0 && <div className="ctags">{cprefs.map(t => <div key={t} className="ctag">{t}<button onClick={() => setCprefs(c => c.filter(x => x !== t))}>✕</button></div>)}</div>}

          {/* NUMBER OF DAYS */}
          <div className="section-label" style={{ marginTop: 8 }}>Trip Length</div>
          <div className="days-row">
            <div>
              <div className="days-label">How many days?</div>
              <div className="days-sub">We'll create a separate day-by-day itinerary for each day</div>
            </div>
            <div className="days-picker">
              <button className="days-btn" onClick={() => setNumDays(d => Math.max(1, d - 1))}>−</button>
              <div className="days-num">{numDays}</div>
              <button className="days-btn" onClick={() => setNumDays(d => Math.min(7, d + 1))}>+</button>
            </div>
            <div style={{ fontSize:"0.8rem", color:"var(--muted2)" }}>
              {numDays === 1 ? "1 day" : `${numDays} days`}
            </div>
          </div>

          {/* TRANSPORT */}
          <div className="section-label">Getting Around</div>
          <div className="transport-grid">
            {TRANSPORT.map(t => (
              <div key={t.id} className={`tc ${transport === t.id ? "sel" : ""}`} onClick={() => setTransport(t.id)}>
                <div className="tc-icon">{t.icon}</div>
                <div className="tc-name">{t.name}</div>
              </div>
            ))}
          </div>

          {/* TRIP TIMES */}
          <div className="section-label">Daily Times</div>
          <div className="time-row">
            <div className="tg"><label>Start Time</label><input type="time" className="tinput" value={startTime} onChange={e => setStartTime(e.target.value)}/></div>
            <div className="tg"><label>End Time</label><input type="time" className="tinput" value={endTime} onChange={e => setEndTime(e.target.value)}/></div>
            <div style={{ display:"flex", alignItems:"flex-end", paddingBottom:4, color:"var(--muted2)", fontSize:"0.82rem" }}>
              Applied to each day of your trip
            </div>
          </div>

          {/* BUDGET */}
          <div className="section-label">Budget (per person per day)</div>
          <div className="bg">
            {BUDGETS.map(b => (
              <div key={b.id} className={`bc ${budget === b.id ? "sel" : ""}`} onClick={() => setBudget(budget === b.id ? null : b.id)}>
                <div className="btr" style={{ color: b.color }}>{b.tier}</div>
                <div className="bl">{b.label}</div>
                <div className="br" style={{ color: b.color }}>{b.range}</div>
                <div className="bd">{b.desc}</div>
              </div>
            ))}
          </div>

          <div className="conds">
            {[
              { g:"group", l:"Traveling with", o:["Solo","Couple","Family & Kids","Friends"] },
              { g:"pace", l:"Pace", o:["Relaxed","Balanced","Packed"] },
            ].map(({ g, l, o }) => (
              <div key={g} className="cg">
                <label>{l}</label>
                <div className="pills">{o.map(v => <div key={v} className={`pill ${conds[g]===v?"sel":""}`} onClick={() => setConds(c => ({ ...c, [g]: c[g]===v?undefined:v }))}>{v}</div>)}</div>
              </div>
            ))}
          </div>
          <div className="brow"><button className="gobt" onClick={goToResults}>Find Places →</button></div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ── */}
      {step === 3 && (
        <div className="page">
          <div className="sh">
            <div className="sey">Step 3 of 4</div>
            <h2 className="st">Best spots in <span>{city}</span></h2>
            <p className="ss">Click a card to preview on the map. Add places and assign them to days using the sidebar.</p>
          </div>
          <div className="rl">
            <div>
              <div className="map-wrap">
                <div className="mapbox">
                  {staticMapUrl && dayPlans.flat().length > 0
                    ? <img src={staticMapUrl} alt="Map showing all pinned locations" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                        onError={() => setStaticMapUrl("")}/>
                    : <iframe key={mapSrc} title="map" src={mapSrc} allowFullScreen/>
                  }
                </div>
                <div className="map-hint">
                  {dayPlans.flat().length > 0
                    ? <>📍 {dayPlans.flat().length} location{dayPlans.flat().length!==1?"s":""} pinned across {numDays} day{numDays!==1?"s":""} · Click a card to preview</>
                    : <>Click any card to see it on the map</>
                  }
                </div>
              </div>
              <div className="plgrid">
                {visiblePlaces.map(p => {
                  const added = isAdded(p.id);
                  const focused = focusedId === p.id;
                  const img = p.photoRef ? purl(p.photoRef) : null;
                  const pb = p.priceLevel===0?"Free":p.priceLevel===1?"$":p.priceLevel===2?"$$":p.priceLevel===3?"$$$":null;
                  return (
                    <div key={p.id} className={`plcard ${added?"added":""} ${focused&&!added?"focused":""}`} onClick={() => focusPlace(p)}>
                      <div className="plimg">
                        {img ? <img src={img} alt={p.name} onError={e=>{e.target.parentElement.innerHTML=p.emoji;}} loading="lazy"/> : <span>{p.emoji}</span>}
                        {pb && <div className="pbadge">{pb}</div>}
                        {added && <div className="pin-badge">📍 Pinned</div>}
                      </div>
                      <div className="plbody">
                        <div className="pltype">{p.type}</div>
                        <div className="plname">{p.name}</div>
                        <div className="plrat">★ {p.rating} <span>({p.reviews.toLocaleString()} reviews)</span></div>
                        <div className="pldesc">{p.desc}</div>
                      </div>
                      <div className="plfoot">
                        <div className="pldur">~{p.duration} min</div>
                        <button className={`addbt ${added?"added":""}`} onClick={e => { e.stopPropagation(); addToDay(p, activeDay); }}>
                          {added ? "✓ Pinned" : `+ Day ${activeDay+1}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {places.length > visibleCount && <button className="show-more" onClick={showMore}>+ Show More Places</button>}
              {places.length <= visibleCount && allPlaces.length >= 8 && <button className="show-more" onClick={showMore} disabled={!nextToken.current}>{nextToken.current ? "+ Load More from Google" : "✓ All places loaded"}</button>}
            </div>

            {/* SIDEBAR */}
            <div className="sb np">
              <div className="sbt">Your Itinerary</div>
              <div className="sbs">{dayPlans.flat().length} place{dayPlans.flat().length!==1?"s":""} across {numDays} day{numDays!==1?"s":""} · drag between days</div>

              {numDays > 1 && (
                <div className="day-tabs">
                  {dayPlans.map((day, di) => (
                    <div key={di} className={`day-tab ${activeDay===di?"active":""}`} onClick={() => setActiveDay(di)}>
                      Day {di+1}
                      <span className="count">{day.length}</span>
                    </div>
                  ))}
                </div>
              )}

              <ul className="il">
                {dayPlans[activeDay]?.length === 0
                  ? <div className="em">Add places to Day {activeDay+1} →</div>
                  : dayPlans[activeDay].map((p, i) => (
                    <li key={p.id} className={`ii ${dragIdx===i&&dragDay===activeDay?"dragging":""}`} draggable
                      onDragStart={() => onDragStart(i, activeDay)}
                      onDragOver={e => onDragOver(e, i, activeDay)}
                      onDragEnd={onDragEnd}>
                      <div className="ii-l">
                        <span className="dh">⠿</span>
                        <div><div>{p.emoji} {p.name}</div><div className="iis">{p.type} · ~{p.duration} min</div></div>
                      </div>
                      <button className="rmbt" onClick={() => removeFromDay(p.id, activeDay)}>✕</button>
                    </li>
                  ))
                }
              </ul>

              {numDays > 1 && (
                <div style={{ fontSize:"0.73rem", color:"var(--muted2)", marginTop:8, textAlign:"center" }}>
                  Drag places between Day tabs to reassign
                </div>
              )}

              <button className="finbt" onClick={goToItinerary} disabled={dayPlans.flat().length === 0}>
                ✨ Generate Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: ITINERARY ── */}
      {step === 4 && (
        <div className="page">
          <div className="ih">
            <div>
              <h2 className="imt">Your {numDays > 1 ? `${numDays}-day trip to` : "day in"} <em>{city}</em></h2>
              <div className="iml">{[blabel, tlabel, conds.group, conds.pace].filter(Boolean).join(" · ")}{allAdded.length > 0 ? ` · ${allAdded.length} stops` : ""}</div>
              {aiUsed && <div className="aib">✦ AI-personalized descriptions & cost research</div>}
              {travelLoading && <div style={{ fontSize:"0.76rem", color:"var(--ocean3)", marginTop:6 }}>⏱ Calculating real travel times via Google Maps…</div>}
            </div>
            <div className="iac np">
              <button className="obt" onClick={() => setStep(3)}>← Edit Places</button>
              <button className="dbt" onClick={() => exportPDF(city, dayPlansForPDF, budget, transport, descMap, costMap, travelMap)}>⬇ Export PDF</button>
            </div>
          </div>

          {/* COST SUMMARY */}
          {totalCost != null && totalCost > 0 && (
            <div className="cost-box">
              <div className="cost-ttl">💰 Estimated Trip Cost {numDays > 1 ? `(${numDays} days)` : ""}</div>
              <div className="cost-rows">
                {allAdded.map(p => {
                  const c = costMap?.[p.id];
                  return c != null ? (
                    <div key={p.id} className="cost-row">
                      <span className="cost-lbl">{p.name}</span>
                      <span className="cost-val">~${c}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="cost-total">
                <span>Total per person</span>
                <span className="cost-total-val">~${totalCost}</span>
              </div>
            </div>
          )}

          {/* DAY TABS for itinerary view */}
          {numDays > 1 && (
            <div className="itin-day-tabs">
              {dayPlans.map((_, di) => (
                <div key={di} className={`idt ${itinViewDay===di?"active":""}`} onClick={() => setItinViewDay(di)}>
                  Day {di+1} · {dayPlans[di].length} stop{dayPlans[di].length!==1?"s":""}
                </div>
              ))}
            </div>
          )}

          {/* TIMELINE */}
          {(() => {
            const day = dayPlans[itinViewDay] || [];
            const times = computeDayTimes(itinViewDay);
            return (
              <div className="tl">
                {day.map((place, i) => {
                  const t = times[i] || { start:"9:00 AM", end:"10:00 AM", travel:"…" };
                  const img = place.photoRef ? purl(place.photoRef) : null;
                  const isLast = i === day.length - 1;
                  const cost = costMap?.[place.id];
                  const desc = descMap?.[place.id] || place.desc;
                  return (
                    <div key={place.id}>
                      <div className="tlb">
                        <div className="ttc">
                          <div className="ttime" onClick={() => openEdit(place)} title="Click to edit">{t.start}</div>
                          <div className="tdur">until {t.end}</div>
                          {!isLast && <div className="tline"/>}
                          <div className="tdot"/>
                        </div>
                        <div className="tcc">
                          <div className="tcard">
                            <div className="tcimg">{img ? <img src={img} alt={place.name} onError={e=>{e.target.parentElement.innerHTML=place.emoji;}}/> : <span>{place.emoji}</span>}</div>
                            <div className="tcb">
                              <div className="tctype">{place.type}</div>
                              <div className="tcname">{place.name}</div>
                              <div className="tcdesc">{desc}</div>
                              <div className="tcmeta">
                                <span>★ {place.rating}</span>
                                <span>~{place.duration} min</span>
                                {cost != null && <span className="cbadge">~${cost}</span>}
                                <span className="edit-link" onClick={() => openEdit(place)}>✏️ edit time</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="trvl">
                          <div/>
                          <div className={travelLoading && t.travel==="…" ? "travel-loading" : "trvli"}>
                            {travelLoading && t.travel==="…"
                              ? <>⏱ Calculating travel time…</>
                              : <>{TRANSPORT.find(x=>x.id===transport)?.icon||"🚶"} ~{t.travel} min by {tlabel.toLowerCase()} to next stop</>
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── USER SETUP MODAL ── */}
      {showUserSetup && (
        <div className="pov" onClick={e => e.target===e.currentTarget && setShowUserSetup(false)}>
          <div className="usetup">
            <div className="ust">Create your profile</div>
            <div className="uss">Pick a name to save trips and track where you've been. No password needed — saved to this device only.</div>
            <input className="uinp" placeholder="Enter a username…" value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && createUser()} autoFocus/>
            <button className="ubf" onClick={createUser}>Create Profile →</button>
            {knownUsers.length > 0 && (
              <>
                <div className="div-or">or switch to existing profile</div>
                <div className="user-list">
                  {knownUsers.map(name => (
                    <div key={name} className="user-item" onClick={() => switchUser(name)}>
                      <div className="user-item-av">{name.slice(0,2).toUpperCase()}</div>
                      <div>
                        <div className="user-item-name">{name}</div>
                        <div className="user-item-meta">{getUserHist(name).length} trips · since {getUserCreated(name)}</div>
                      </div>
                      <button className="user-item-del" onClick={e => deleteUser(name, e)}>🗑</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE MODAL ── */}
      {showProfile && activeUser && (
        <div className="pov" onClick={e => e.target===e.currentTarget && setShowProfile(false)}>
          <div className="pmodal">
            <button className="pmc" onClick={() => setShowProfile(false)}>✕</button>
            <div className="pm-hdr">
              <div className="pm-av">{initials}</div>
              <div>
                <div className="pm-name">{activeUser}</div>
                <div className="pm-sub">Member since {getUserCreated(activeUser)}</div>
              </div>
            </div>
            <div className="pm-stats">
              <div className="pms"><div className="pms-n">{hist.length}</div><div className="pms-l">Trips</div></div>
              <div className="pms"><div className="pms-n">{hist.reduce((s,h)=>s+h.stops,0)}</div><div className="pms-l">Places</div></div>
              <div className="pms"><div className="pms-n">{visitedCities.length}</div><div className="pms-l">Cities</div></div>
            </div>
            {visitedCities.length > 0 && (
              <>
                <div className="pm-sec">🌍 Cities You've Explored</div>
                <div className="pm-map">
                  <iframe key={profileMapSrc} title="visited-map" src={profileMapSrc} allowFullScreen/>
                </div>
              </>
            )}
            <div className="pm-sec">🧳 Past Trips</div>
            {hist.length === 0
              ? <div className="pm-empty">No trips yet — go plan one! ✈️</div>
              : <div className="pm-trips">
                  {hist.map(h => (
                    <div key={h.id} className="pm-trip">
                      <div>
                        <div className="pm-trip-city">{h.emoji} {h.city}</div>
                        <div className="pm-trip-meta">{h.date}{h.days>1?` · ${h.days} days`:""} · {h.places?.slice(0,2).join(", ")}{h.stops>2?` +${h.stops-2} more`:""}</div>
                      </div>
                      <div className="pm-trip-stops">📍 {h.stops}</div>
                    </div>
                  ))}
                </div>
            }
            <div className="pm-btns">
              <button className="pm-switch" onClick={() => { setShowProfile(false); setShowUserSetup(true); }}>Switch User</button>
              <button className="pm-logout" onClick={logout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TIME EDIT MODAL ── */}
      {editingPlace && (
        <div className="teov" onClick={e => e.target===e.currentTarget && setEditingPlace(null)}>
          <div className="temod">
            <div className="temt">Edit Time</div>
            <div className="tems">{editingPlace.name}</div>
            <div className="temr"><div className="teml">Start Time</div><input type="time" className="temi" value={editTimeVal} onChange={e => setEditTimeVal(e.target.value)}/></div>
            <div className="temr"><div className="teml">Duration (minutes)</div><input type="number" className="temi" value={editDurVal} min={15} max={480} step={15} onChange={e => setEditDurVal(Number(e.target.value))}/></div>
            <div className="tembtns">
              <button className="tem-c" onClick={() => setEditingPlace(null)}>Cancel</button>
              <button className="tem-s" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="ls">
          <div className="spin"/>
          <div className="lt">{lmsg}</div>
          {lsub && <div className="lt-sub">{lsub}</div>}
        </div>
      )}
      <div className="toast" style={{ opacity: toast.vis ? 1 : 0 }}>{toast.msg}</div>
    </>
  );
}
