import { useState, useEffect, useRef } from "react";
import CONFIG from "./config";

const GOOGLE_KEY = CONFIG.GOOGLE_KEY;
const ANTHROPIC_KEY = CONFIG.ANTHROPIC_KEY;

// ─── HERO PHOTOS ──────────────────────────────────────────────
const HERO_PHOTOS = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=85", // Paris Eiffel
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=85", // Tokyo
  "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1400&q=85", // Rome
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1400&q=85", // New York
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=85", // Bali
];

// ─── STYLES ───────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
:root {
  --terra: #c45c26;
  --terra2: #e06b30;
  --terra3: #f5a574;
  --sand: #f7f0e6;
  --sand2: #ede3d4;
  --sand3: #e0d4c0;
  --warm: #faf6f0;
  --white: #ffffff;
  --ocean: #1b5e8a;
  --ocean2: #2474ad;
  --ocean3: #4a9fd4;
  --sage: #4a7c59;
  --sage2: #5c9e6e;
  --gold: #c8820a;
  --gold2: #e09c14;
  --ink: #1a1410;
  --ink2: #2d2520;
  --muted: #6b5d52;
  --muted2: #9b8c80;
  --border: rgba(180,150,120,0.2);
  --border2: rgba(180,150,120,0.35);
  --r: 18px; --rs: 12px; --rxs: 8px;
  --sh: 0 2px 12px rgba(26,20,16,0.08);
  --shm: 0 8px 32px rgba(26,20,16,0.13);
  --shl: 0 24px 64px rgba(26,20,16,0.18);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: var(--warm); color: var(--ink); min-height: 100vh; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--sand2); }
::-webkit-scrollbar-thumb { background: var(--ocean3); border-radius: 3px; }

/* ── NAV ── */
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 66px;
  background: rgba(250,246,240,0.93); backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border2);
  position: sticky; top: 0; z-index: 300;
}
.logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; color: var(--ocean); cursor: pointer; font-weight: 600; letter-spacing: -0.3px; }
.logo em { font-style: italic; color: var(--ocean2); }
.nav-l { display: flex; align-items: center; gap: 16px; }
.back { display: flex; align-items: center; gap: 6px; background: var(--sand); border: 1px solid var(--border2); color: var(--muted); border-radius: 30px; padding: 7px 16px; font-size: 0.79rem; cursor: pointer; transition: all 0.2s; }
.back:hover { background: var(--sand2); color: var(--ink); }
.nav-r { display: flex; align-items: center; gap: 10px; }
.nav-city { font-size: 0.71rem; color: var(--muted2); letter-spacing: 1.5px; text-transform: uppercase; }
.prog { display: flex; gap: 5px; }
.pd { width: 6px; height: 6px; border-radius: 50%; background: var(--sand3); transition: all 0.3s; }
.pd.on { background: var(--ocean); width: 18px; border-radius: 3px; }
.pd.done { background: var(--sage); }
.ubtn { display: flex; align-items: center; gap: 7px; background: var(--ocean); color: white; border: none; border-radius: 30px; padding: 7px 16px; font-size: 0.79rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
.ubtn:hover { background: var(--ocean2); }
.ubtn.guest { background: var(--sand); color: var(--ocean); border: 1px solid var(--border2); }
.ubtn.guest:hover { background: var(--sand2); }
.uav { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg,var(--ocean),var(--ocean2)); display: flex; align-items: center; justify-content: center; font-size: 0.66rem; font-weight: 700; }

/* ── HERO ── */
.hero {
  min-height: calc(100vh - 66px); position: relative; overflow: hidden;
  display: grid; grid-template-columns: 1fr 1fr;
}
@media(max-width:900px) { .hero { grid-template-columns: 1fr; } }
.hero-photo-side { position: relative; overflow: hidden; }
.hero-photo { position: absolute; inset: 0; object-fit: cover; width: 100%; height: 100%; transition: opacity 1.5s ease; }
.hero-photo-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(250,246,240,0.15) 0%, rgba(26,20,16,0.3) 100%); }
.hero-photo-caption { position: absolute; bottom: 20px; right: 20px; background: rgba(26,20,16,0.55); color: rgba(255,255,255,0.85); font-size: 0.71rem; padding: 5px 12px; border-radius: 20px; backdrop-filter: blur(6px); }
.photo-dots { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.photo-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; }
.photo-dot.on { background: white; width: 18px; border-radius: 3px; }
.hero-content { background: var(--warm); display: flex; flex-direction: column; justify-content: center; padding: 80px 60px 80px 7vw; position: relative; z-index: 2; }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(27,94,138,0.1); border: 1px solid rgba(27,94,138,0.25); border-radius: 30px; padding: 7px 16px; font-size: 0.71rem; letter-spacing: 2px; text-transform: uppercase; color: var(--ocean); font-weight: 600; margin-bottom: 28px; }
.eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ocean); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(1.5);} }
.hero-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 5vw, 5rem); line-height: 1.03; margin-bottom: 20px; color: var(--ink); }
.hero-h1 em { font-style: italic; color: var(--ocean); }
.hero-sub { color: var(--muted); font-size: 1rem; max-width: 420px; margin-bottom: 32px; line-height: 1.8; font-weight: 300; }
.feature-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; }
.feat { display: flex; align-items: center; gap: 10px; font-size: 0.84rem; color: var(--ink2); }
.feat-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
.feat-green { background: rgba(74,124,89,0.15); color: var(--sage2); }
.feat-orange { background: rgba(27,94,138,0.12); color: var(--ocean); }
.feat-blue { background: rgba(27,94,138,0.12); color: var(--ocean); }
.feat-gold { background: rgba(200,130,10,0.12); color: var(--gold); }
.sc { width: 100%; max-width: 480px; position: relative; z-index: 3; }
.sw { display: flex; background: white; border-radius: 60px; box-shadow: 0 4px 28px rgba(27,94,138,0.18), var(--shm); border: 2px solid rgba(27,94,138,0.15); }
.si-wrap { display: flex; align-items: center; flex: 1; overflow: hidden; border-radius: 60px 0 0 60px; }
.sicon { padding: 0 0 0 20px; color: var(--ocean3); font-size: 1rem; flex-shrink: 0; }
.si { flex: 1; border: none; padding: 18px 13px; font-family: 'DM Sans', sans-serif; font-size: 0.94rem; background: transparent; color: var(--ink); outline: none; }
.si::placeholder { color: var(--muted2); }
.ssugg { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: white; border-radius: var(--rs); box-shadow: var(--shl); z-index: 100; overflow: hidden; border: 1px solid var(--border2); }
.sitem { display: flex; align-items: center; gap: 12px; padding: 12px 18px; cursor: pointer; transition: background 0.15s; font-size: 0.87rem; }
.sitem:hover { background: var(--sand); }
.ssub { font-size: 0.72rem; color: var(--muted2); }
.sbtn { background: linear-gradient(135deg, var(--ocean), var(--ocean2)); color: white; border: none; padding: 18px 26px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; border-radius: 0 60px 60px 0; letter-spacing: 0.3px; }
.sbtn:hover { filter: brightness(1.08); }
.chips { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 16px; }
.chip { background: rgba(255,255,255,0.85); border: 1px solid var(--border2); color: var(--ink2); border-radius: 30px; padding: 6px 14px; font-size: 0.77rem; cursor: pointer; transition: all 0.2s; }
.chip:hover { background: white; border-color: var(--ocean3); color: var(--ocean); }
.hero-proof { display: flex; gap: 20px; margin-top: 24px; }
.proof-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--muted); }
.proof-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--sage); }

/* ── STEP PAGES ── */
.page { padding: 44px 5vw 72px; max-width: 1380px; margin: 0 auto; }
.sh { margin-bottom: 28px; }
.sey { font-size: 0.67rem; letter-spacing: 3px; text-transform: uppercase; color: var(--ocean); margin-bottom: 6px; font-weight: 600; }
.st { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: var(--ink); line-height: 1.1; }
.st span { color: var(--ocean); font-style: italic; }
.ss { color: var(--muted); margin-top: 8px; font-weight: 300; font-size: 0.91rem; }
.sec-label { font-size: 0.69rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; font-weight: 600; }

/* PREFS */
.pg { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px,1fr)); gap: 9px; margin: 20px 0; }
.pc { background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 15px 13px; cursor: pointer; transition: all 0.2s; box-shadow: var(--sh); }
.pc:hover { border-color: var(--ocean3); transform: translateY(-2px); box-shadow: var(--shm); }
.pc.sel { border-color: var(--ocean); background: rgba(27,94,138,0.06); }
.pi { font-size: 1.55rem; margin-bottom: 7px; }
.pn { font-weight: 600; font-size: 0.85rem; color: var(--ink); }
.pd2 { font-size: 0.7rem; color: var(--muted2); margin-top: 2px; }
.cpw { display: flex; gap: 8px; margin-bottom: 14px; }
.cpi { flex: 1; padding: 11px 17px; border: 2px solid var(--border2); border-radius: 60px; font-family: 'DM Sans', sans-serif; font-size: 0.89rem; background: white; color: var(--ink); outline: none; transition: all 0.2s; }
.cpi:focus { border-color: var(--ocean); }
.cpi::placeholder { color: var(--muted2); }
.cap { background: var(--ocean); color: white; border: none; border-radius: 60px; padding: 11px 20px; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.cap:hover { background: var(--ocean2); }
.ctags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.ctag { background: rgba(27,94,138,0.1); color: var(--ocean); border: 1px solid rgba(27,94,138,0.25); border-radius: 30px; padding: 5px 12px; font-size: 0.78rem; display: flex; align-items: center; gap: 5px; }
.ctag button { background: none; border: none; color: var(--ocean3); cursor: pointer; font-size: 0.82rem; line-height: 1; }
.ctag button:hover { color: var(--ink); }

/* TRANSPORT */
.transport-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 8px; margin-bottom: 26px; }
.tc { background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 15px 10px; cursor: pointer; transition: all 0.2s; text-align: center; box-shadow: var(--sh); }
.tc:hover { border-color: var(--ocean3); transform: translateY(-1px); }
.tc.sel { border-color: var(--ocean); background: rgba(27,94,138,0.06); }
.tc-icon { font-size: 1.55rem; margin-bottom: 6px; }
.tc-name { font-weight: 600; font-size: 0.83rem; color: var(--ink); }

/* DAYS */
.days-row { display: flex; align-items: center; gap: 20px; background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 20px 24px; margin-bottom: 26px; box-shadow: var(--sh); }
.days-text { flex: 1; }
.days-title { font-weight: 600; font-size: 0.92rem; margin-bottom: 3px; }
.days-subtitle { font-size: 0.78rem; color: var(--muted2); }
.days-ctrl { display: flex; align-items: center; gap: 12px; }
.daybtn { width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--border2); background: white; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--ink); font-weight: 600; }
.daybtn:hover { border-color: var(--ocean); color: var(--ocean); }
.daynum { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--ocean); min-width: 28px; text-align: center; }

/* BUDGET */
.bg { display: grid; grid-template-columns: repeat(auto-fill, minmax(178px,1fr)); gap: 9px; margin-bottom: 26px; }
.bc { background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 16px; cursor: pointer; transition: all 0.2s; box-shadow: var(--sh); }
.bc:hover { border-color: var(--gold2); transform: translateY(-1px); }
.bc.sel { border-color: var(--gold); background: rgba(200,130,10,0.05); }
.btr { font-size: 1.2rem; font-weight: 700; margin-bottom: 2px; }
.bl { font-weight: 600; font-size: 0.87rem; margin-bottom: 2px; }
.br { font-size: 0.72rem; font-weight: 600; margin-bottom: 5px; }
.bd { font-size: 0.7rem; color: var(--muted2); line-height: 1.4; }
.time-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 26px; background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 20px; box-shadow: var(--sh); }
.tg { display: flex; flex-direction: column; gap: 6px; }
.tg label { font-size: 0.69rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
.tinput { padding: 10px 15px; border: 2px solid var(--border2); border-radius: var(--rs); font-family: 'DM Sans', sans-serif; font-size: 0.92rem; background: var(--sand); color: var(--ink); outline: none; transition: all 0.2s; }
.tinput:focus { border-color: var(--ocean); background: white; }
.brow { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
.gobt { background: linear-gradient(135deg, var(--ocean), var(--ocean2)); color: white; border: none; border-radius: 60px; padding: 13px 40px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
.gobt:hover { filter: brightness(1.08); transform: translateY(-1px); }

/* ── RESULTS ── */
.rl { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
@media(max-width:960px) { .rl { grid-template-columns: 1fr; } }
.map-wrap { margin-bottom: 18px; }
.mapbox { width: 100%; height: 300px; border-radius: var(--r); overflow: hidden; border: 2px solid var(--border2); box-shadow: var(--shm); background: var(--sand2); }
.mapbox img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mapbox iframe { width: 100%; height: 100%; border: none; }
.map-hint { font-size: 0.74rem; color: var(--muted2); margin-top: 6px; display: flex; align-items: center; gap: 5px; }
.plgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px,1fr)); gap: 13px; }
.plcard { background: white; border-radius: var(--r); overflow: hidden; border: 2px solid var(--border); cursor: pointer; transition: all 0.22s; box-shadow: var(--sh); }
.plcard:hover { border-color: var(--ocean3); transform: translateY(-2px); box-shadow: var(--shm); }
.plcard.focused { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(200,130,10,0.12), var(--shm); }
.plcard.added { border-color: var(--sage); background: rgba(74,124,89,0.03); }
.plimg { width: 100%; height: 155px; overflow: hidden; background: var(--sand2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; position: relative; }
.plimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pbadge { position: absolute; top: 8px; right: 8px; background: rgba(26,20,16,0.7); color: white; border-radius: 20px; padding: 3px 9px; font-size: 0.68rem; font-weight: 700; backdrop-filter: blur(6px); }
.pin-badge { position: absolute; top: 8px; left: 8px; background: var(--sage); color: white; border-radius: 20px; padding: 3px 9px; font-size: 0.68rem; font-weight: 700; }
.plbody { padding: 12px 14px; }
.pltype { font-size: 0.63rem; letter-spacing: 2px; text-transform: uppercase; color: var(--ocean); margin-bottom: 3px; font-weight: 600; }
.plname { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; margin-bottom: 3px; font-weight: 600; color: var(--ink); }
.plrat { font-size: 0.78rem; color: var(--gold); }
.plrat span { color: var(--muted2); }
.pldesc { font-size: 0.76rem; color: var(--muted); margin-top: 5px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.plfoot { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-top: 1px solid var(--border); }
.pldur { font-size: 0.72rem; color: var(--muted2); }
.addbt { background: var(--sand); color: var(--ocean); border: 1.5px solid var(--ocean3); border-radius: 30px; padding: 6px 16px; font-size: 0.77rem; cursor: pointer; transition: all 0.18s; font-weight: 600; }
.addbt:hover { background: var(--ocean); color: white; border-color: var(--ocean); }
.addbt.added { background: var(--sage); color: white; border-color: var(--sage); }
.show-more { width: 100%; margin-top: 14px; padding: 13px; background: white; border: 2px solid var(--border2); border-radius: var(--r); font-size: 0.87rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; box-shadow: var(--sh); }
.show-more:hover { border-color: var(--ocean3); color: var(--ocean); }
.show-more:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── SIDEBAR ── */
.sb { background: white; border: 2px solid var(--border2); border-radius: var(--r); padding: 20px 17px; position: sticky; top: 78px; box-shadow: var(--shm); }
.sbt { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; margin-bottom: 2px; color: var(--ink); }
.sbs { font-size: 0.72rem; color: var(--muted2); margin-bottom: 14px; }
.day-tabs { display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap; }
.day-tab { background: var(--sand); border: 1.5px solid var(--border2); border-radius: 30px; padding: 6px 14px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.18s; color: var(--muted); }
.day-tab:hover { border-color: var(--ocean3); color: var(--ocean); }
.day-tab.active { background: var(--ocean); border-color: var(--ocean); color: white; }
.day-tab .cnt { background: rgba(255,255,255,0.25); border-radius: 20px; padding: 1px 6px; font-size: 0.7rem; margin-left: 4px; }
.day-tab:not(.active) .cnt { background: var(--sand2); color: var(--muted); }
/* Drop zone highlighting */
.day-drop-zone { min-height: 60px; border-radius: var(--rxs); transition: all 0.2s; }
.day-drop-zone.drag-over { background: rgba(27,94,138,0.06); border: 2px dashed var(--ocean3); }
.ii { background: var(--sand); border-radius: var(--rxs); padding: 9px 11px; display: flex; align-items: center; justify-content: space-between; font-size: 0.81rem; margin-bottom: 6px; border: 1.5px solid transparent; transition: all 0.15s; }
.ii.dragging { opacity: 0.3; border-style: dashed; border-color: var(--ocean3); }
.ii-l { display: flex; align-items: center; gap: 8px; }
.dh { color: var(--muted2); font-size: 0.85rem; cursor: grab; }
.ii-dh { cursor: grab; }
.ii-dh:active { cursor: grabbing; }
.iis { font-size: 0.67rem; color: var(--muted2); margin-top: 1px; }
.rmbt { background: none; border: none; color: var(--muted2); cursor: pointer; font-size: 0.88rem; transition: color 0.15s; }
.rmbt:hover { color: var(--ocean); }
.em { text-align: center; padding: 16px 0; font-size: 0.78rem; color: var(--muted2); }
.finbt { width: 100%; margin-top: 12px; background: linear-gradient(135deg, var(--ocean), var(--ocean2)); color: white; border: none; border-radius: 60px; padding: 13px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
.finbt:hover:not(:disabled) { filter: brightness(1.08); }
.finbt:disabled { opacity: 0.28; cursor: not-allowed; }

/* ── ITINERARY ── */
.ih { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 34px; flex-wrap: wrap; gap: 14px; }
.imt { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,5vw,3rem); line-height: 1.1; }
.imt em { font-style: italic; color: var(--ocean); }
.iml { color: var(--muted); font-size: 0.84rem; margin-top: 8px; }
.iac { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.obt { background: white; border: 2px solid var(--border2); color: var(--ink); border-radius: 60px; padding: 9px 22px; font-size: 0.84rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
.obt:hover { border-color: var(--ocean3); color: var(--ocean); }
.dbt { background: var(--ocean); color: white; border: none; border-radius: 60px; padding: 9px 22px; font-size: 0.84rem; cursor: pointer; transition: all 0.2s; font-weight: 600; }
.dbt:hover { background: var(--ocean2); }
.aib { display: inline-flex; align-items: center; gap: 5px; background: rgba(74,124,89,0.1); color: var(--sage2); border: 1px solid rgba(74,124,89,0.25); border-radius: 20px; padding: 4px 11px; font-size: 0.71rem; font-weight: 600; margin-top: 8px; }
.itin-day-tabs { display: flex; gap: 6px; margin-bottom: 26px; flex-wrap: wrap; }
.idt { background: white; border: 2px solid var(--border2); border-radius: 30px; padding: 8px 20px; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: all 0.18s; color: var(--muted); }
.idt.active { background: var(--ocean); border-color: var(--ocean); color: white; }
.cost-box { background: linear-gradient(135deg, rgba(27,94,138,0.05), rgba(36,116,173,0.03)); border: 2px solid rgba(27,94,138,0.2); border-radius: var(--r); padding: 20px 22px; margin-bottom: 26px; border-left: 4px solid var(--ocean); }
.cost-ttl { font-weight: 700; font-size: 0.88rem; color: var(--ink); margin-bottom: 12px; }
.cost-rows { display: flex; flex-direction: column; gap: 5px; }
.cost-row { display: flex; justify-content: space-between; font-size: 0.84rem; }
.cost-lbl { color: var(--muted); }
.cost-val { font-weight: 600; color: var(--ink); }
.cost-note { font-size: 0.7rem; color: var(--muted2); margin-left: 8px; }
.cost-total { display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1.5px solid rgba(200,130,10,0.2); font-size: 0.95rem; font-weight: 700; }
.cost-total-val { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: var(--ocean); }
.tl { display: flex; flex-direction: column; }
.tlb { display: grid; grid-template-columns: 88px 1fr; gap: 0 18px; }
.ttc { text-align: right; padding-top: 18px; position: relative; }
.ttime { font-size: 0.79rem; font-weight: 600; color: var(--ocean); white-space: nowrap; cursor: pointer; border-bottom: 1.5px dashed rgba(27,94,138,0.3); display: inline-block; transition: color 0.15s; }
.ttime:hover { color: var(--ocean); }
.tdur { font-size: 0.63rem; color: var(--muted2); margin-top: 1px; }
.tline { position: absolute; right: -10px; top: 24px; bottom: -24px; width: 2px; background: var(--sand3); }
.tdot { position: absolute; right: -16px; top: 18px; width: 12px; height: 12px; border-radius: 50%; background: var(--ocean); border: 2.5px solid var(--warm); box-shadow: 0 0 0 2px var(--ocean); z-index: 1; }
.tcc { padding: 12px 0 22px; }
.tcard { background: white; border: 1.5px solid var(--border); border-radius: var(--r); overflow: hidden; display: flex; box-shadow: var(--sh); transition: all 0.2s; }
.tcard:hover { border-color: var(--border2); box-shadow: var(--shm); }
.tcimg { width: 110px; min-width: 110px; height: 115px; overflow: hidden; background: var(--sand2); display: flex; align-items: center; justify-content: center; font-size: 1.9rem; }
.tcimg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tcb { padding: 14px; flex: 1; }
.tctype { font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase; color: var(--ocean); margin-bottom: 2px; font-weight: 600; }
.tcname { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 5px; color: var(--ink); }
.tcdesc { font-size: 0.79rem; color: var(--muted); line-height: 1.55; }
.tcmeta { font-size: 0.73rem; color: var(--gold); margin-top: 7px; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.cbadge { background: rgba(200,130,10,0.12); color: var(--gold); border: 1px solid rgba(200,130,10,0.25); border-radius: 20px; padding: 2px 9px; font-size: 0.7rem; font-weight: 700; }
.edit-link { font-size: 0.69rem; color: var(--ocean3); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
.edit-link:hover { color: var(--ocean); }
.trvl { display: grid; grid-template-columns: 88px 1fr; gap: 0 18px; }
.trvli { font-size: 0.73rem; color: var(--muted); display: flex; align-items: center; gap: 6px; background: var(--sand); border-radius: 7px; padding: 5px 11px; margin: 2px 0; }
.travel-calc { font-size: 0.73rem; color: var(--ocean3); display: flex; align-items: center; gap: 6px; padding: 5px 0; }

/* ── MODALS ── */
.pov { position: fixed; inset: 0; background: rgba(26,20,16,0.55); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px); }
.pmodal { background: white; border-radius: var(--r); padding: 32px; width: 100%; max-width: 520px; box-shadow: var(--shl); max-height: 90vh; overflow-y: auto; position: relative; border: 1px solid var(--border2); }
.pmc { position: absolute; top: 12px; right: 12px; background: var(--sand); border: none; font-size: 1.1rem; cursor: pointer; color: var(--muted); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.pmc:hover { background: var(--sand2); color: var(--ink); }
.pm-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.pm-av { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--ocean), var(--ocean2)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; color: white; }
.pm-name { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 600; color: var(--ink); }
.pm-sub { font-size: 0.78rem; color: var(--muted2); margin-top: 2px; }
.pm-stats { display: flex; gap: 10px; margin-bottom: 22px; }
.pms { background: var(--sand); border-radius: var(--rs); padding: 14px 16px; flex: 1; text-align: center; border: 1px solid var(--border); }
.pms-n { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--ocean); font-weight: 600; }
.pms-l { font-size: 0.7rem; color: var(--muted2); margin-top: 1px; }
.pm-sec { font-size: 0.69rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; font-weight: 600; }
.pm-map { width: 100%; height: 200px; border-radius: var(--rs); overflow: hidden; margin-bottom: 18px; border: 2px solid var(--border2); }
.pm-map iframe { width: 100%; height: 100%; border: none; }
.pm-map img { width: 100%; height: 100%; object-fit: cover; }
.pm-trips { display: flex; flex-direction: column; gap: 7px; max-height: 240px; overflow-y: auto; }
.pm-trip { background: var(--sand); border-radius: var(--rs); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
.pm-trip-city { font-family: 'Cormorant Garamond', serif; font-size: 0.98rem; font-weight: 600; color: var(--ink); }
.pm-trip-meta { font-size: 0.72rem; color: var(--muted2); margin-top: 2px; }
.pm-trip-stops { font-size: 0.76rem; color: var(--sage2); font-weight: 700; }
.pm-empty { color: var(--muted2); text-align: center; padding: 20px; font-size: 0.85rem; }
.pm-btns { display: flex; gap: 9px; margin-top: 18px; }
.pm-btn { flex: 1; padding: 10px; background: var(--sand); border: 2px solid var(--border2); border-radius: 60px; font-size: 0.83rem; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.pm-btn:hover { color: var(--ink); border-color: var(--border2); }
.pm-btn.danger:hover { color: var(--ocean2); border-color: rgba(27,94,138,0.3); }
.usetup { background: white; border-radius: var(--r); padding: 36px; width: 100%; max-width: 400px; box-shadow: var(--shl); border: 2px solid var(--border2); }
.ust { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 600; margin-bottom: 5px; color: var(--ink); }
.uss { color: var(--muted); font-size: 0.84rem; margin-bottom: 22px; line-height: 1.6; }
.uinp { width: 100%; padding: 13px 16px; border: 2px solid var(--border2); border-radius: var(--rs); font-family: 'DM Sans', sans-serif; font-size: 0.94rem; background: var(--sand); color: var(--ink); outline: none; transition: all 0.2s; margin-bottom: 12px; }
.uinp:focus { border-color: var(--ocean); background: white; }
.uinp::placeholder { color: var(--muted2); }
.ubf { width: 100%; padding: 13px; background: linear-gradient(135deg, var(--ocean), var(--ocean2)); color: white; border: none; border-radius: 60px; font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.ubf:hover { filter: brightness(1.07); }
.div-or { display: flex; align-items: center; gap: 10px; margin: 16px 0; color: var(--muted2); font-size: 0.77rem; }
.div-or::before,.div-or::after { content:''; flex:1; height:1px; background:var(--border2); }
.user-list { display: flex; flex-direction: column; gap: 7px; }
.user-item { display: flex; align-items: center; gap: 11px; background: var(--sand); border: 2px solid var(--border); border-radius: var(--rs); padding: 10px 13px; cursor: pointer; transition: all 0.2s; }
.user-item:hover { border-color: var(--ocean3); background: var(--sand2); }
.user-item-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,var(--ocean3),var(--ocean)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: white; flex-shrink: 0; }
.user-item-name { font-weight: 600; font-size: 0.86rem; color: var(--ink); }
.user-item-meta { font-size: 0.7rem; color: var(--muted2); }
.user-item-del { background: none; border: none; color: var(--muted2); cursor: pointer; margin-left: auto; font-size: 0.85rem; padding: 4px; transition: color 0.15s; }
.user-item-del:hover { color: var(--ocean); }
.teov { position: fixed; inset: 0; background: rgba(26,20,16,0.5); z-index: 400; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
.temod { background: white; border: 2px solid var(--border2); border-radius: var(--r); padding: 26px; width: 100%; max-width: 310px; box-shadow: var(--shl); }
.temt { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 600; margin-bottom: 4px; color: var(--ink); }
.tems { color: var(--muted2); font-size: 0.8rem; margin-bottom: 16px; }
.temr { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.teml { font-size: 0.69rem; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
.temi { padding: 10px 13px; border: 2px solid var(--border2); border-radius: var(--rs); font-family: 'DM Sans', sans-serif; font-size: 0.91rem; background: var(--sand); color: var(--ink); outline: none; width: 100%; transition: all 0.2s; }
.temi:focus { border-color: var(--ocean); background: white; }
.tembtns { display: flex; gap: 9px; margin-top: 14px; }
.tem-c { flex:1; padding:10px; background:var(--sand); border:2px solid var(--border2); border-radius:60px; font-size:0.82rem; cursor:pointer; color:var(--muted); transition:all 0.2s; }
.tem-s { flex:1; padding:10px; background:var(--ocean); color:white; border:none; border-radius:60px; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
.tem-s:hover { background:var(--ocean2); }

/* LOADING */
.ls { position: fixed; inset: 0; background: rgba(26,20,16,0.65); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; backdrop-filter: blur(8px); }
.spin { width: 38px; height: 38px; border: 3px solid rgba(255,255,255,0.2); border-top-color: var(--ocean); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.lt { color: white; font-size: 0.9rem; }
.lt-sub { color: rgba(255,255,255,0.6); font-size: 0.77rem; }
.toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); background: var(--ink2); color: white; padding: 10px 22px; border-radius: 60px; font-size: 0.83rem; z-index: 600; transition: opacity 0.3s; pointer-events: none; white-space: nowrap; box-shadow: var(--shm); }
@media print { .np { display: none !important; } }
`;

// ─── DATA ─────────────────────────────────────────────────────
const BUDGETS = [
  {id:"free",tier:"$",label:"Free & Budget",range:"$0–$25/person",desc:"Parks, free museums, street food & hidden gems.",color:"#4a7c59"},
  {id:"mid",tier:"$$",label:"Mid-Range",range:"$25–$75/person",desc:"Casual dining, paid attractions & comfortable experiences.",color:"#c8820a"},
  {id:"upscale",tier:"$$$",label:"Upscale",range:"$75–$150/person",desc:"Nicer restaurants, private tours & premium venues.",color:"#7c5cbf"},
  {id:"luxury",tier:"$$$$",label:"Luxury",range:"$150+/person",desc:"Fine dining, exclusive experiences & VIP access.",color:"#1b5e8a"},
];
const TRANSPORT = [
  {id:"walking",icon:"🚶",name:"Walking"},
  {id:"transit",icon:"🚌",name:"Transit"},
  {id:"driving",icon:"🚗",name:"Driving"},
  {id:"cycling",icon:"🚴",name:"Cycling"},
  {id:"rideshare",icon:"🚕",name:"Rideshare"},
];
const PREFS = [
  {val:"sightseeing",icon:"🏛️",name:"Sightseeing",desc:"Landmarks & historic sites"},
  {val:"restaurants",icon:"🍽️",name:"Dining",desc:"Local favorites & top-rated"},
  {val:"museums",icon:"🎨",name:"Museums",desc:"Art, history & science"},
  {val:"hiking",icon:"🥾",name:"Nature & Hiking",desc:"Trails, parks & outdoors"},
  {val:"shopping",icon:"🛍️",name:"Shopping",desc:"Markets & boutiques"},
  {val:"entertainment",icon:"🎭",name:"Entertainment",desc:"Shows & nightlife"},
  {val:"cafes",icon:"☕",name:"Cafés",desc:"Coffee & cozy spots"},
  {val:"sports",icon:"⚽",name:"Sports",desc:"Active experiences"},
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
const PHOTO_CAPTIONS = ["Paris, France","Tokyo, Japan","Rome, Italy","New York City, USA","Bali, Indonesia"];
const MOCK = [
  {id:1,name:"Central Park",type:"Park",rating:4.8,reviews:42300,emoji:"🌳",desc:"An iconic 843-acre urban oasis with meadows, lakes, and world-famous skyline views.",duration:90,lat:40.7851,lng:-73.9683,priceLevel:0},
  {id:2,name:"Metropolitan Museum of Art",type:"Museum",rating:4.9,reviews:31000,emoji:"🎨",desc:"One of the world's great art museums spanning 5,000 years of civilizations.",duration:120,lat:40.7794,lng:-73.9632,priceLevel:2},
  {id:3,name:"Brooklyn Bridge",type:"Landmark",rating:4.8,reviews:55000,emoji:"🌉",desc:"Walk this iconic 1883 suspension bridge for breathtaking Manhattan skyline views.",duration:45,lat:40.7061,lng:-73.9969,priceLevel:0},
  {id:4,name:"Katz's Delicatessen",type:"Restaurant",rating:4.5,reviews:12000,emoji:"🥪",desc:"A legendary NYC institution since 1888, famous for its towering pastrami sandwiches.",duration:60,lat:40.7223,lng:-73.9874,priceLevel:2},
  {id:5,name:"Times Square",type:"Landmark",rating:4.5,reviews:98000,emoji:"🌆",desc:"The neon-lit heart of Manhattan — overwhelming and utterly unforgettable.",duration:45,lat:40.758,lng:-73.9855,priceLevel:0},
  {id:6,name:"The High Line",type:"Park",rating:4.7,reviews:29000,emoji:"🌿",desc:"A 1.45-mile elevated park on a former freight rail line with Hudson River views.",duration:75,lat:40.748,lng:-74.0048,priceLevel:0},
  {id:7,name:"Museum of Modern Art",type:"Museum",rating:4.7,reviews:22000,emoji:"🖼️",desc:"MoMA houses extraordinary modern art from Picasso to Warhol to Basquiat.",duration:120,lat:40.7614,lng:-73.9776,priceLevel:2},
  {id:8,name:"Smorgasburg",type:"Food Market",rating:4.6,reviews:8900,emoji:"🍜",desc:"Brooklyn's beloved open-air food market with 100+ local vendors every weekend.",duration:90,lat:40.7223,lng:-73.9592,priceLevel:1},
];

// ─── HELPERS ──────────────────────────────────────────────────
function purl(ref){if(!ref||!GOOGLE_KEY||GOOGLE_KEY==="PASTE_YOUR_GOOGLE_KEY_HERE")return null;return`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${GOOGLE_KEY}`;}
function ft(h,m){const ap=h>=12?"PM":"AM";const hh=h>12?h-12:h===0?12:h;return`${hh}:${String(m).padStart(2,"0")} ${ap}`;}
function useToast(){const[msg,setMsg]=useState("");const[vis,setVis]=useState(false);const t=useRef();const show=m=>{setMsg(m);setVis(true);clearTimeout(t.current);t.current=setTimeout(()=>setVis(false),2600);};return{msg,vis,show};}

// Build an interactive Embed API URL showing all pinned places
// Uses directions mode (origin -> destination + waypoints) for 2+ places, place mode for 1
function buildStaticMapUrl(places, focusedPlace=null){
  if(!GOOGLE_KEY||!places.length)return null;
  if(places.length===1){
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${places[0].lat},${places[0].lng}&zoom=15`;
  }
  // Directions mode: origin, destination, up to 8 waypoints in between
  const origin=`${places[0].lat},${places[0].lng}`;
  const dest=`${places[places.length-1].lat},${places[places.length-1].lng}`;
  const middle=places.slice(1,-1);
  const waypoints=middle.map(p=>`${p.lat},${p.lng}`).join("|");
  let url=`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_KEY}&origin=${origin}&destination=${dest}`;
  if(waypoints)url+=`&waypoints=${encodeURIComponent(waypoints)}`;
  url+=`&mode=walking&zoom=13`;
  return url;
}

// Build a self-contained Leaflet HTML map as a data URL — fully pannable/zoomable,
// shows one labeled pin per visited city using exact lat/lng coords. No API key needed.
function buildCityEmbedUrl(tripHistory){
  if(!tripHistory.length)return null;
  const seen=new Set();
  const entries=tripHistory.reduce((acc,h)=>{
    if(!seen.has(h.city)&&h.lat&&h.lng&&!(h.lat===0&&h.lng===0)){
      seen.add(h.city);acc.push({city:h.city,lat:h.lat,lng:h.lng});
    }
    return acc;
  },[]);
  if(!entries.length)return null;

  const markers=entries.map((e,i)=>{
    const colors=["#c45c26","#1b5e8a","#4a7c59","#c8820a","#7c5cbf","#e06b30"];
    const color=colors[i%colors.length];
    return `L.circleMarker([${e.lat},${e.lng}],{radius:9,fillColor:"${color}",color:"#fff",weight:2,fillOpacity:0.92})
      .addTo(map).bindPopup("<b>${e.city.replace(/"/g,"&quot;")}</b>",{closeButton:false});`;
  }).join("\n    ");

  // Compute bounds center
  const avgLat=entries.reduce((s,e)=>s+e.lat,0)/entries.length;
  const avgLng=entries.reduce((s,e)=>s+e.lng,0)/entries.length;
  const zoom=entries.length===1?9:2;

  const html=`<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<style>*{margin:0;padding:0;}html,body,#map{width:100%;height:100%;}</style>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head><body>
<div id="map"></div>
<script>
  var map=L.map("map",{zoomControl:true,scrollWheelZoom:true}).setView([${avgLat},${avgLng}],${zoom});
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"© OpenStreetMap contributors",maxZoom:19
  }).addTo(map);
  ${markers}
  ${entries.length>1?`var group=new L.featureGroup([${entries.map((e,i)=>`L.marker([${e.lat},${e.lng}])`).join(",")}]);map.fitBounds(group.getBounds().pad(0.3));`:""}
</script></body></html>`;

  return "data:text/html;charset=utf-8,"+encodeURIComponent(html);
}

// ─── AI ───────────────────────────────────────────────────────
async function aiCall(prompt, maxTokens=1200){
  if(!ANTHROPIC_KEY||ANTHROPIC_KEY==="PASTE_YOUR_ANTHROPIC_KEY_HERE")return null;
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();
    return d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
  }catch{return null;}
}

// aiCall with web_search tool — handles multi-turn tool use automatically
async function aiCallWithSearch(prompt, maxTokens=1024){
  if(!ANTHROPIC_KEY||ANTHROPIC_KEY==="PASTE_YOUR_ANTHROPIC_KEY_HERE")return null;
  try{
    const messages=[{role:"user",content:prompt}];
    const tools=[{type:"web_search_20250305",name:"web_search"}];
    // Loop up to 5 turns to handle tool use
    for(let i=0;i<5;i++){
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,tools,messages})
      });
      const d=await r.json();
      if(!d.content)return null;
      // If stopped normally, return text
      if(d.stop_reason==="end_turn"){
        return d.content.map(c=>c.type==="text"?c.text:"").join("").replace(/```json|```/g,"").trim();
      }
      // If tool use, add assistant turn + tool results and continue
      if(d.stop_reason==="tool_use"){
        messages.push({role:"assistant",content:d.content});
        const toolResults=d.content
          .filter(c=>c.type==="tool_use")
          .map(c=>({type:"tool_result",tool_use_id:c.id,content:"Search completed."}));
        messages.push({role:"user",content:toolResults});
        continue;
      }
      // Any other stop reason — extract text if present
      return d.content.map(c=>c.type==="text"?c.text:"").join("").replace(/```json|```/g,"").trim()||null;
    }
    return null;
  }catch(e){console.error("aiCallWithSearch error",e);return null;}
}

async function fetchAIDescs(places,city,budget,prefs){
  const list=places.map((p,i)=>`${i+1}. ${p.name} (${p.type})`).join("\n");
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:"moderate";
  const txt=await aiCall(`Write vivid, specific 2-sentence travel descriptions for each place in ${city}. Budget: ${blabel}. Interests: ${prefs||"general"}. Be specific about what makes each place uniquely worth visiting.\n${list}\nRespond ONLY as JSON array: [{"id":1,"desc":"..."}]\nNo markdown.`);
  if(!txt)return null;
  try{return JSON.parse(txt);}catch{return null;}
}

async function fetchAICosts(places,city,budget){
  const list=places.map((p,i)=>`${i+1}. ${p.name} (${p.type})`).join("\n");
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:"mid-range";
  const txt=await aiCall(`You are a travel cost researcher. For each place below in ${city}, research and give a realistic per-person cost in USD for a ${blabel} traveler.

Be specific to the actual venue:
- Museums/attractions: use real published admission prices (MoMA $30, British Museum free, Louvre €22, etc.)
- Restaurants: typical meal + drink per person at that specific restaurant
- Free parks/landmarks: cost = 0
- Give a short note explaining what the cost covers
- Do NOT give the same price to multiple places

Places:
${list}

Respond ONLY as JSON array with no markdown:
[{"id":1,"cost":0,"note":"Free entry"},{"id":2,"cost":30,"note":"Adult admission"},{"id":3,"cost":25,"note":"Avg meal + drink"}]`, 700);
  if(!txt)return null;
  try{return JSON.parse(txt);}catch{return null;}
}

// Travel time via Directions API backend
async function fetchTravelTime(origin,destination,mode){
  try{
    const modeMap={walking:"walking",transit:"transit",driving:"driving",cycling:"bicycling",rideshare:"driving"};
    const params=new URLSearchParams({origin:`${origin.lat},${origin.lng}`,destination:`${destination.lat},${destination.lng}`,mode:modeMap[mode]||"walking"});
    const r=await fetch(`/api/directions?${params}`);
    const d=await r.json();
    return{minutes:d.minutes||15,text:d.text||"~15 min"};
  }catch{return{minutes:15,text:"~15 min"};}
}

// ─── STORAGE ──────────────────────────────────────────────────
const UKEY="mapistry_u3";const AKEY="mapistry_a3";
function loadU(){try{return JSON.parse(localStorage.getItem(UKEY)||"{}");}catch{return{};}}
function saveU(u){localStorage.setItem(UKEY,JSON.stringify(u));}
function loadA(){return localStorage.getItem(AKEY)||null;}
function saveA(n){localStorage.setItem(AKEY,n);}
function getHist(name){return loadU()[name]?.history||[];}
function saveHist(name,h){const u=loadU();if(!u[name])u[name]={created:new Date().toLocaleDateString()};u[name].history=h;saveU(u);}
function getCreated(name){return loadU()[name]?.created||"";}

// ─── PDF EXPORT ───────────────────────────────────────────────
function exportPDF(city,dayPlans,budget,transport,descMap,costMap,travelMap,startTime){
  const{jsPDF}=window.jspdf||{};
  if(!jsPDF){alert("jsPDF not loaded.");return;}

  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();
  const H=doc.internal.pageSize.getHeight();
  const MAR=14; const INNER=W-MAR*2;
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=TRANSPORT.find(t=>t.id===transport)?.name||"Walking";
  const ticon=TRANSPORT.find(t=>t.id===transport)?.icon||"🚶";
  const allPlaces=dayPlans.flat();
  const hasCosts=costMap&&allPlaces.some(p=>costMap[p.id]!=null);
  const totalCost=hasCosts?allPlaces.reduce((s,p)=>s+((costMap[p.id]?.cost)||0),0):null;
  const today=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  // ── PALETTE ──
  const TERRA=[27,94,138];
  const TERRA_L=[232,242,251];
  const OCEAN=[27,94,138]; // kept same
  const SAGE=[74,124,89];
  const INK=[26,20,16];
  const INK2=[55,45,38];
  const MUTED=[120,103,90];
  const MUTED2=[170,155,143];
  const GOLD=[190,125,8];
  const GOLD_L=[253,248,232];
  const WHITE=[255,255,255];
  const DIVIDER=[225,210,195];
  const BG=[252,249,245];

  // ── HELPERS ──
  function badge(label,x,y,fg,bg,fontSize=6.5){
    doc.setFont("helvetica","bold"); doc.setFontSize(fontSize);
    const tw=doc.getTextWidth(label);
    const ph=5.2, pw=tw+7;
    doc.setFillColor(...bg); doc.roundedRect(x,y,pw,ph,1.5,1.5,"F");
    doc.setTextColor(...fg); doc.text(label,x+3.5,y+3.6);
    return pw;
  }
  function hRule(y,color=DIVIDER){
    doc.setDrawColor(...color); doc.setLineWidth(0.25); doc.line(MAR,y,W-MAR,y);
  }
  function addFooter(){
    const pg=doc.internal.getNumberOfPages();
    for(let i=1;i<=pg;i++){
      doc.setPage(i);
      doc.setFillColor(...BG); doc.rect(0,H-9,W,9,"F");
      doc.setDrawColor(...DIVIDER); doc.setLineWidth(0.2); doc.line(0,H-9,W,H-9);
      doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(...MUTED2);
      doc.text("Mapistry — Your personal travel planner",MAR,H-3.5);
      doc.text(`${i} / ${pg}`,W-MAR,H-3.5,{align:"right"});
      doc.text(today,W/2,H-3.5,{align:"center"});
    }
  }

  // ═══════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════

  // Compact header bar
  doc.setFillColor(...TERRA); doc.rect(0,0,W,32,"F");
  doc.setFillColor(18,72,110); doc.rect(W-10,0,10,32,"F");

  // Brand + city on one line
  doc.setFont("times","bold"); doc.setFontSize(14);
  doc.setTextColor(...WHITE); doc.text("Mapistry",MAR,13);
  doc.setFont("helvetica","normal"); doc.setFontSize(6.5);
  doc.setTextColor(180,220,245); doc.text("TRAVEL PLANNER",MAR,19.5);

  // Thin rule
  doc.setDrawColor(150,200,240); doc.setLineWidth(0.3); doc.line(MAR,22,W-12,22);

  // City on same header
  doc.setFont("helvetica","bold"); doc.setFontSize(6); doc.setTextColor(160,210,240);
  doc.text("ITINERARY FOR",MAR,27);
  doc.setFont("times","bold"); doc.setFontSize(13); doc.setTextColor(...WHITE);
  doc.text(city.toUpperCase(),MAR+28,27);

  // ── SUMMARY STRIP (single row, not a tall card) ──
  let y=36;
  const cols=[
    {label:"STOPS",value:String(allPlaces.length)},
    {label:"TRANSPORT",value:tlabel},
    ...(blabel?[{label:"BUDGET",value:blabel}]:[]),
    ...(totalCost!=null?[{label:"EST. COST",value:totalCost===0?"Free":`$${totalCost}`}]:[]),
  ];
  const stripH=16;
  doc.setFillColor(...WHITE); doc.roundedRect(MAR,y,INNER,stripH,2,2,"F");
  doc.setDrawColor(...DIVIDER); doc.setLineWidth(0.25); doc.roundedRect(MAR,y,INNER,stripH,2,2,"S");
  const colW=INNER/Math.min(cols.length,4);
  cols.slice(0,4).forEach((c,ci)=>{
    const cx=MAR+ci*colW+colW/2;
    if(ci>0){doc.setDrawColor(...DIVIDER);doc.setLineWidth(0.2);doc.line(MAR+ci*colW,y+3,MAR+ci*colW,y+stripH-3);}
    doc.setFont("helvetica","bold"); doc.setFontSize(5.5); doc.setTextColor(...MUTED2);
    doc.text(c.label,cx,y+5.5,{align:"center"});
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...INK);
    doc.text(c.value,cx,y+12.5,{align:"center"});
  });

  y+=22;

  // ── DAYS ──
  const[sh0,sm0]=startTime.split(":").map(Number);

  dayPlans.forEach((day,di)=>{
    if(!day.length)return;

    // Day header
    if(y>H-40){doc.addPage();y=16;}

    if(dayPlans.length>1){
      if(y>H-30){doc.addPage();y=14;}
      doc.setFillColor(...OCEAN); doc.roundedRect(MAR,y,INNER,7,2,2,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(...WHITE);
      doc.text(`DAY ${di+1}`,MAR+4,y+5);
      doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(185,215,240);
      doc.text(`${day.length} stop${day.length!==1?"s":""}  ·  ${tlabel}`,MAR+18,y+5);
      y+=11;
    }else{
      doc.setFont("helvetica","bold"); doc.setFontSize(6); doc.setTextColor(...MUTED2);
      doc.text("YOUR ITINERARY",MAR,y+3);
      hRule(y+6);
      y+=10;
    }

    let h=sh0, m=sm0;

    day.forEach((p,i)=>{
      const ts=ft(h,m);
      const durMin=p.duration||60;
      const eH=h+Math.floor((m+durMin)/60), eM=(m+durMin)%60;
      const te=ft(eH,eM);
      const desc=(descMap?.[p.id]||p.desc||"").trim();
      const costEntry=costMap?.[p.id];
      const hasDesc=!!desc;

      // Dynamic card height
      const cardH=hasDesc?28:22;
      if(y+cardH>H-12){doc.addPage();y=16;}

      // Card bg
      doc.setFillColor(...BG); doc.roundedRect(MAR,y,INNER,cardH,2.5,2.5,"F");
      doc.setDrawColor(...DIVIDER); doc.setLineWidth(0.2); doc.roundedRect(MAR,y,INNER,cardH,2.5,2.5,"S");

      // Left accent
      doc.setFillColor(...TERRA); doc.roundedRect(MAR,y,3.5,cardH,1.5,1.5,"F");

      // Step number
      const numX=MAR+3.5+6.5; const numY=y+cardH/2;
      doc.setFillColor(...TERRA_L); doc.circle(numX,numY,4.2,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(...TERRA);
      const numStr=String(i+1);
      doc.text(numStr,numX-(numStr.length>1?1.5:1),numY+2.5);

      // Content area starts here
      const cx=MAR+18; const cRight=W-MAR-3;

      // Place name
      doc.setFont("times","bold"); doc.setFontSize(10.5); doc.setTextColor(...INK);
      const maxNameW=cRight-cx-36;
      const nameLines=doc.splitTextToSize(p.name,maxNameW);
      doc.text(nameLines[0],cx,y+8);

      // Meta row: type · rating · duration
      doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(...MUTED);
      doc.text(`${p.type}  ·  ★ ${p.rating}  ·  ${durMin} min`,cx,y+(hasDesc?14:14));

      // Badges flush right
      let bx=cRight;
      const timeStr=`${ts}–${te}`;
      const tpw=doc.getTextWidth(timeStr)+7;
      bx-=tpw;
      doc.setFillColor(...OCEAN); doc.roundedRect(bx,y+3.5,tpw,5.2,1.5,1.5,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(...WHITE);
      doc.text(timeStr,bx+3.5,y+7.2);

      if(costEntry!=null){
        const costStr=costEntry.cost===0?"FREE":`$${costEntry.cost}`;
        const cpw=doc.getTextWidth(costStr)+7;
        bx-=cpw+3;
        doc.setFillColor(...(costEntry.cost===0?[235,248,238]:[GOLD_L[0],GOLD_L[1],GOLD_L[2]]));
        doc.roundedRect(bx,y+3.5,cpw,5.2,1.5,1.5,"F");
        doc.setTextColor(...(costEntry.cost===0?SAGE:GOLD));
        doc.setFont("helvetica","bold"); doc.setFontSize(6.5);
        doc.text(costStr,bx+3.5,y+7.2);
      }

      // Description — truncated to 1 line
      if(hasDesc){
        doc.setFont("helvetica","normal"); doc.setFontSize(6.8); doc.setTextColor(...MUTED);
        const descLines=doc.splitTextToSize(desc,INNER-22);
        doc.text(descLines[0],cx,y+20);
      }

      y+=cardH+3;

      // Travel connector
      if(i<day.length-1){
        const tv=travelMap?.[`${di}-${i}`]?.minutes||15;
        if(y+6>H-12){doc.addPage();y=16;}
        doc.setFont("helvetica","italic"); doc.setFontSize(7); doc.setTextColor(...MUTED2);
        doc.text(`↓  ${tv} min by ${tlabel.toLowerCase()}`,MAR+8,y+3.5);
        y+=8;
        h=eH+Math.floor((eM+tv)/60); m=(eM+tv)%60;
      } else {
        h=eH; m=eM;
      }
    });

    y+=6;
  });

  // ── COST BREAKDOWN TABLE (if costs exist) ──
  if(hasCosts&&totalCost!=null){
    if(y+16+allPlaces.length*7>H-12){doc.addPage();y=16;}

    // Section heading
    doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(...MUTED2);
    doc.text("COST BREAKDOWN",MAR,y+4);
    hRule(y+7);
    y+=12;

    allPlaces.forEach((p,i)=>{
      if(y>H-14){doc.addPage();y=16;}
      const c=costMap[p.id];
      const even=i%2===0;
      if(even){doc.setFillColor(248,244,239); doc.roundedRect(MAR,y-2,INNER,7,1,1,"F");}
      doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(...INK2);
      doc.text(p.name,MAR+3,y+3.5);
      if(c!=null){
        const costStr=c.cost===0?"Free":`$${c.cost}`;
        doc.setFont("helvetica","bold"); doc.setFontSize(7.5);
        doc.setTextColor(c.cost===0?SAGE[0]:TERRA[0],c.cost===0?SAGE[1]:TERRA[1],c.cost===0?SAGE[2]:TERRA[2]);
        doc.text(costStr,W-MAR-3,y+3.5,{align:"right"});
        if(c.note){
          doc.setFont("helvetica","normal"); doc.setFontSize(6.2); doc.setTextColor(...MUTED2);
          doc.text(c.note,W-MAR-3-doc.getTextWidth(costStr)-5,y+3.5,{align:"right"});
        }
      }
      y+=7;
    });

    // Total row
    hRule(y);
    y+=5;
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...INK);
    doc.text("Total per person",MAR+3,y+4);
    doc.setTextColor(...TERRA);
    doc.text(totalCost===0?"Free":`$${totalCost}`,W-MAR-3,y+4,{align:"right"});
    y+=10;
  }

  addFooter();
  doc.save(`mapistry-${city.replace(/\s+/g,"-").toLowerCase()}.pdf`);
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App(){
  const[step,setStep]=useState(1);
  const[photoIdx,setPhotoIdx]=useState(0);
  const[city,setCity]=useState("");
  const[cin,setCin]=useState("");
  const[sugg,setSugg]=useState([]);
  const[showS,setShowS]=useState(false);
  const[prefs,setPrefs]=useState(new Set());
  const[cprefs,setCprefs]=useState([]);
  const[cpinput,setCpinput]=useState("");
  const[budget,setBudget]=useState(null);
  const[transport,setTransport]=useState("walking");
  const[numDays,setNumDays]=useState(1);
  const[startTime,setStartTime]=useState("09:00");
  const[endTime,setEndTime]=useState("21:00");
  const[places,setPlaces]=useState(MOCK);
  const[allPlaces,setAllPlaces]=useState(MOCK);
  const[visibleCount,setVisibleCount]=useState(8);
  const[focusedId,setFocusedId]=useState(null);
  // dayPlans: array of arrays of places, one per day
  const[dayPlans,setDayPlans]=useState([[]]);
  const[activeSideDay,setActiveSideDay]=useState(0);
  const[itinViewDay,setItinViewDay]=useState(0);
  // map
  const[previewSrc,setPreviewSrc]=useState("");
  const[staticMapUrl,setStaticMapUrl]=useState("");
  // AI results
  const[descMap,setDescMap]=useState(null);
  const[costMap,setCostMap]=useState(null);
  const[travelMap,setTravelMap]=useState({});
  const[travelLoading,setTravelLoading]=useState(false);
  const[aiUsed,setAiUsed]=useState(false);
  const[loading,setLoading]=useState(false);
  const[lmsg,setLmsg]=useState("");
  const[lsub,setLsub]=useState("");
  // drag — use refs to avoid stale state in handlers
  const dragInfo=useRef({idx:null,day:null});
  const[editingPlace,setEditingPlace]=useState(null);
  const[cardPriceMap,setCardPriceMap]=useState({});   // id -> {price,note} or "loading"

  const[editTimeVal,setEditTimeVal]=useState("");
  const[editDurVal,setEditDurVal]=useState(60);
  // accounts
  const[activeUser,setActiveUser]=useState(null);
  const[hist,setHist]=useState([]);
  const[showProfile,setShowProfile]=useState(false);
  const[showUserSetup,setShowUserSetup]=useState(false);
  const[usernameInput,setUsernameInput]=useState("");
  const toast=useToast();
  const sref=useRef();
  const nextToken=useRef(null);

  // Hero photo slideshow
  useEffect(()=>{
    const id=setInterval(()=>setPhotoIdx(i=>(i+1)%HERO_PHOTOS.length),4500);
    return()=>clearInterval(id);
  },[]);

  // Load user
  useEffect(()=>{
    const a=loadA();
    if(a&&loadU()[a]){setActiveUser(a);setHist(getHist(a));}
  },[]);

  // Sync dayPlans count when numDays changes
  useEffect(()=>{
    setDayPlans(prev=>{
      const next=[...prev];
      while(next.length<numDays)next.push([]);
      while(next.length>numDays)next.pop();
      return next;
    });
    setActiveSideDay(d=>Math.min(d,numDays-1));
  },[numDays]);

  // Rebuild interactive map URL whenever pinned places change
  useEffect(()=>{
    const all=dayPlans.flat();
    if(all.length>0){
      const url=buildStaticMapUrl(all);
      if(url)setStaticMapUrl(url);
    }else{
      setStaticMapUrl("");
    }
  },[dayPlans]);

  // City autocomplete
  useEffect(()=>{
    if(cin.length<2){setSugg([]);return;}
    const q=cin.toLowerCase();
    setSugg(CITIES.filter(s=>s.city.toLowerCase().includes(q)||s.country.toLowerCase().includes(q)).slice(0,6));
    setShowS(true);
  },[cin]);

  useEffect(()=>{
    const fn=e=>{if(sref.current&&!sref.current.contains(e.target))setShowS(false);};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);

  function selCity(c){setCin(c);setCity(c);setShowS(false);}

  // ── ACCOUNTS ──────────────────────────────────────────────
  function createUser(){
    const name=usernameInput.trim();
    if(!name){toast.show("Please enter a name!");return;}
    const u=loadU();
    if(!u[name])u[name]={created:new Date().toLocaleDateString(),history:[]};
    saveU(u);saveA(name);
    setActiveUser(name);setHist(u[name].history||[]);
    setShowUserSetup(false);setUsernameInput("");
    toast.show(`Welcome, ${name}! 👋`);
  }
  function switchUser(name){
    saveA(name);setActiveUser(name);setHist(getHist(name));
    setShowUserSetup(false);setShowProfile(false);
    toast.show(`Switched to ${name}`);
  }
  function deleteUser(name,e){
    e.stopPropagation();
    const u=loadU();delete u[name];saveU(u);
    if(activeUser===name){setActiveUser(null);setHist([]);localStorage.removeItem(AKEY);}
    toast.show(`Deleted ${name}`);
  }
  function logout(){
    setActiveUser(null);setHist([]);
    localStorage.removeItem(AKEY);setShowProfile(false);
    toast.show("Logged out");
  }
  // Each call to saveTrip = 1 trip entry (not per day)
  function saveTrip(tripCity,dPlans){
    if(!activeUser)return;
    const all=dPlans.flat();
    if(!all.length)return;
    // Use centroid of all places so the city coord is more representative
    const validCoords=all.filter(p=>p.lat&&p.lng);
    const centerLat=validCoords.length?validCoords.reduce((s,p)=>s+p.lat,0)/validCoords.length:0;
    const centerLng=validCoords.length?validCoords.reduce((s,p)=>s+p.lng,0)/validCoords.length:0;
    const entry={
      id:Date.now(),city:tripCity,
      lat:centerLat,
      lng:centerLng,
      date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),
      stops:all.length,days:dPlans.length,
      img:all[0]?.photoRef?purl(all[0].photoRef):null,
      emoji:all[0]?.emoji||"📍",
      places:all.map(p=>p.name)
    };
    // Read fresh from localStorage to avoid stale closure bug (hist state may lag)
    const freshHist=getHist(activeUser);
    const nh=[entry,...freshHist].slice(0,30);
    setHist(nh);saveHist(activeUser,nh);
  }

  function addCpref(){const v=cpinput.trim();if(!v)return;if(cprefs.includes(v)){toast.show("Already added!");return;}setCprefs(c=>[...c,v]);setCpinput("");}

  // ── FETCH PLACES ──────────────────────────────────────────
  async function doFetch(c,token=null){
    try{
      const allP=[...prefs,...cprefs];
      const q=allP.length>0?`${allP.join(" and ")} in ${c}`:`top attractions in ${c}`;
      const url=token?`/api/places?query=${encodeURIComponent(q)}&pagetoken=${token}`:`/api/places?query=${encodeURIComponent(q)}`;
      const r=await fetch(url);const d=await r.json();
      if(d.results?.length>0){
        return{
          places:d.results.map((p,i)=>({
            id:Date.now()+i,name:p.name,
            type:(p.types?.[0]||"attraction").replace(/_/g," "),
            rating:p.rating||4.0,reviews:p.user_ratings_total||0,
            emoji:"📍",
            desc:p.editorial_summary?.overview||p.formatted_address||`A great spot in ${c}.`,
            duration:60,lat:p.geometry.location.lat,lng:p.geometry.location.lng,
            photoRef:p.photos?.[0]?.photo_reference||null,
            priceLevel:p.price_level??1,
          })),
          nextToken:d.next_page_token||null
        };
      }
    }catch(e){console.log(e);}
    return{places:MOCK,nextToken:null};
  }

  async function goToResults(){
    const c=cin.trim();if(!c){toast.show("Please enter a city!");return;}
    setCity(c);
    setPreviewSrc(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(c)}&zoom=13`);
    setLmsg(`Finding the best spots in ${c}…`);setLsub("");setLoading(true);
    const{places:p,nextToken:nt}=await doFetch(c);
    nextToken.current=nt;setAllPlaces(p);setPlaces(p);setVisibleCount(8);
    setDayPlans(Array.from({length:numDays},()=>[]));
    setStaticMapUrl("");setLoading(false);setStep(3);
  }

  async function showMore(){
    setLmsg("Loading more places…");setLoading(true);
    if(nextToken.current){
      await new Promise(r=>setTimeout(r,2000));
      const{places:more,nextToken:nt}=await doFetch(city,nextToken.current);
      nextToken.current=nt;
      const combined=[...allPlaces,...more];
      setAllPlaces(combined);setPlaces(combined);setVisibleCount(v=>v+9);
    }else{setVisibleCount(v=>v+8);}
    setLoading(false);
  }

  async function fetchCardPrice(p){
    // Already fetched or loading — treat 0 as valid so we don't skip free places
    if(cardPriceMap[p.id]!==undefined)return;
    setCardPriceMap(prev=>({...prev,[p.id]:"loading"}));
    const prompt=`Search the web and find the REAL current price for visiting "${p.name}" in ${city}.
Type: ${p.type}.
- Museums/attractions: find the official admission price (e.g. search "${p.name} admission price")
- Restaurants/bars/cafes: find typical cost per person from their menu
- Free parks/public spaces: cost is 0
- Shopping: typical spend per visit
Use web search to find the current price. Then respond ONLY with this exact JSON and nothing else:
{"cost":NUMBER,"note":"one short phrase explaining what cost covers"}
Example: {"cost":25,"note":"Adult general admission"}
Do not include any explanation or markdown. Just the JSON object.`;
    const txt=await aiCallWithSearch(prompt,800);
    let result={cost:null,note:""};
    if(txt){
      try{
        const clean=txt.replace(/```json|```/g,"").trim();
        // Extract JSON object if surrounded by other text
        const match=clean.match(/\{[^{}]*"cost"\s*:\s*[\d.]+[^{}]*\}/);
        const parsed=JSON.parse(match?match[0]:clean);
        if(typeof parsed.cost==="number"){
          result={cost:Math.round(parsed.cost),note:parsed.note||""};
        }
      }catch(e){console.log("price parse error",e,txt);}
    }
    setCardPriceMap(prev=>({...prev,[p.id]:result}));
  }

  function focusPlace(p){
    setFocusedId(p.id);
    fetchCardPrice(p);
    // If pins already exist, keep showing the multi-pin static map — don't switch to single preview
    if(dayPlans.flat().length>0)return;
    // No pins yet — show single place preview
    setPreviewSrc(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(p.name+", "+city)}&zoom=16`);
    setStaticMapUrl("");
  }

  function isAdded(id){return dayPlans.some(d=>d.find(p=>p.id===id));}

  function addToDay(place,dayIdx){
    setDayPlans(prev=>{
      const next=prev.map(d=>[...d]);
      const existingDay=next.findIndex(d=>d.find(p=>p.id===place.id));
      if(existingDay>=0){
        next[existingDay]=next[existingDay].filter(p=>p.id!==place.id);
      }else{
        next[dayIdx]=[...next[dayIdx],place];
        toast.show(`Added to Day ${dayIdx+1}!`);
      }
      return next;
    });
  }
  function removeFromDay(placeId,dayIdx){
    setDayPlans(prev=>{const n=prev.map(d=>[...d]);n[dayIdx]=n[dayIdx].filter(p=>p.id!==placeId);return n;});
  }

  // ── GENERATE ─────────────────────────────────────────────
  async function goToItinerary(){
    const all=dayPlans.flat();
    if(!all.length){toast.show("Add at least one place!");return;}
    setLmsg("Crafting your itinerary…");setLsub("");setLoading(true);
    let dm=null,cm=null;
    if(ANTHROPIC_KEY&&ANTHROPIC_KEY!=="PASTE_YOUR_ANTHROPIC_KEY_HERE"){
      setLmsg("✨ AI is personalizing your itinerary…");
      setLsub("Researching descriptions and real costs for each place");
      const allP=[...prefs,...cprefs].join(", ");
      const[descRes,costRes]=await Promise.all([
        fetchAIDescs(all,city,budget,allP),
        fetchAICosts(all,city,budget),
      ]);
      if(descRes){dm={};descRes.forEach(x=>{dm[x.id]=x.desc;});setAiUsed(true);}
      if(costRes){cm={};costRes.forEach(x=>{cm[x.id]={cost:x.cost,note:x.note||""};});}
    }
    setDescMap(dm);setCostMap(cm);
    setLoading(false);setStep(4);setItinViewDay(0);
    saveTrip(city,dayPlans);
    // Fetch real travel times asynchronously after render
    setTravelLoading(true);
    const tm={};
    for(let di=0;di<dayPlans.length;di++){
      const day=dayPlans[di];
      for(let i=0;i<day.length-1;i++){
        const res=await fetchTravelTime({lat:day[i].lat,lng:day[i].lng},{lat:day[i+1].lat,lng:day[i+1].lng},transport);
        tm[`${di}-${i}`]=res;
      }
    }
    setTravelMap(tm);setTravelLoading(false);
  }

  // ── DRAG & DROP ── use refs so handlers always have fresh values
  function onDragStart(e,i,dayIdx){
    dragInfo.current={idx:i,day:dayIdx};
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text/plain","");
    // add dragging class after tiny delay so the original shows while dragging
    setTimeout(()=>{
      setDayPlans(prev=>{
        // mark as dragging — we'll use a ref for this
        return prev;
      });
    },0);
  }

  function onDragOver(e){
    e.preventDefault();
    e.dataTransfer.dropEffect="move";
  }

  function onDropOnDay(e,targetDayIdx){
    e.preventDefault();
    const{idx:fromIdx,day:fromDayIdx}=dragInfo.current;
    if(fromIdx===null||fromDayIdx===null)return;
    if(fromDayIdx===targetDayIdx)return; // same day, no-op (reorder handled separately)
    setDayPlans(prev=>{
      const next=prev.map(d=>[...d]);
      const[item]=next[fromDayIdx].splice(fromIdx,1);
      next[targetDayIdx].push(item);
      return next;
    });
    dragInfo.current={idx:null,day:null};
    toast.show(`Moved to Day ${targetDayIdx+1}`);
  }

  function onDropReorder(e,targetIdx,targetDayIdx){
    e.preventDefault();e.stopPropagation();
    const{idx:fromIdx,day:fromDayIdx}=dragInfo.current;
    if(fromIdx===null)return;
    if(fromDayIdx===targetDayIdx&&fromIdx===targetIdx)return;
    setDayPlans(prev=>{
      const next=prev.map(d=>[...d]);
      const[item]=next[fromDayIdx].splice(fromIdx,1);
      next[targetDayIdx].splice(targetIdx,0,item);
      return next;
    });
    dragInfo.current={idx:targetIdx,day:targetDayIdx};
  }

  function onDragEnd(){
    dragInfo.current={idx:null,day:null};
  }

  // ── TIME EDITING ────────────────────────────────────────────
  function openEdit(p){setEditingPlace(p);setEditTimeVal(p.customTime||"");setEditDurVal(p.duration||60);}
  function saveEdit(){
    setDayPlans(prev=>prev.map(day=>day.map(p=>p.id===editingPlace.id?{...p,customTime:editTimeVal||undefined,duration:editDurVal}:p)));
    setEditingPlace(null);toast.show("Updated!");
  }

  // ── TIMELINE COMPUTATION ────────────────────────────────────
  function computeDayTimes(dayIdx){
    const[sh,sm]=startTime.split(":").map(Number);let h=sh,m=sm;
    return(dayPlans[dayIdx]||[]).map((place,i)=>{
      const tv=travelMap[`${dayIdx}-${i}`];
      const travelMin=tv?.minutes||15;
      const travelText=tv?.text||"~15 min";
      if(place.customTime){
        const[ch,cm2]=place.customTime.split(":").map(Number);
        const eH=ch+Math.floor((cm2+place.duration)/60),eM=(cm2+place.duration)%60;
        if(i<(dayPlans[dayIdx]||[]).length-1){h=eH+Math.floor((eM+travelMin)/60);m=(eM+travelMin)%60;}
        return{start:ft(ch,cm2),end:ft(eH,eM),travelMin,travelText};
      }
      const ts=ft(h,m);
      const eH=h+Math.floor((m+place.duration)/60),eM=(m+place.duration)%60;
      if(i<(dayPlans[dayIdx]||[]).length-1){h=eH+Math.floor((eM+travelMin)/60);m=(eM+travelMin)%60;}
      return{start:ts,end:ft(eH,eM),travelMin,travelText};
    });
  }

  // ── DERIVED ─────────────────────────────────────────────────
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=TRANSPORT.find(t=>t.id===transport)?.name||"Walking";
  const allAdded=dayPlans.flat();
  const totalCost=costMap?allAdded.reduce((s,p)=>s+((costMap[p.id]?.cost)??0),0):null;
  const visiblePlaces=places.slice(0,visibleCount);
  const initials=activeUser?activeUser.slice(0,2).toUpperCase():"";
  const knownUsers=Object.keys(loadU());
  const visitedCities=[...new Set(hist.map(h=>h.city))];
  const cityEmbedUrl=buildCityEmbedUrl(hist);

  return(
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="nav np">
        <div className="nav-l">
          <div className="logo" onClick={()=>{setStep(1);setDayPlans([[]]); setCin("");setCity("");}}>
            Mapit<em>stry</em>
          </div>
          {step>1&&<button className="back" onClick={()=>setStep(step-1)}>← Back</button>}
        </div>
        <div className="nav-r">
          {city&&step>1&&<div className="nav-city">📍 {city}</div>}
          {step>1&&<div className="prog">{[1,2,3,4].map(s=><div key={s} className={`pd ${s===step?"on":s<step?"done":""}`}/>)}</div>}
          {activeUser
            ?<button className="ubtn" onClick={()=>setShowProfile(true)}><div className="uav">{initials}</div>{activeUser}</button>
            :<button className="ubtn guest" onClick={()=>setShowUserSetup(true)}>👤 Sign In</button>
          }
        </div>
      </nav>

      {/* STEP 1: HERO */}
      {step===1&&(
        <div className="hero">
          <div className="hero-photo-side">
            {HERO_PHOTOS.map((src,i)=>(
              <img key={src} className="hero-photo" src={src} alt={PHOTO_CAPTIONS[i]}
                style={{opacity:i===photoIdx?1:0}}/>
            ))}
            <div className="hero-photo-overlay"/>
            <div className="hero-photo-caption">{PHOTO_CAPTIONS[photoIdx]}</div>
            <div className="photo-dots">
              {HERO_PHOTOS.map((_,i)=>(
                <div key={i} className={`photo-dot ${i===photoIdx?"on":""}`} onClick={()=>setPhotoIdx(i)}/>
              ))}
            </div>
          </div>
          <div className="hero-content">
            <div className="hero-eyebrow"><div className="eyebrow-dot"/>AI-Powered Travel Planner</div>
            <h1 className="hero-h1">Plan your <em>perfect trip</em>,<br/>anywhere in the world.</h1>
            <p className="hero-sub">Enter any city — get a personalized day-by-day itinerary with real photos, AI-researched costs, and live travel times.</p>
            <div className="feature-list">
              {[
                {cls:"feat-green",icon:"✓",text:"Real photos from Google Places"},
                {cls:"feat-orange",icon:"✦",text:"AI-written descriptions for each spot"},
                {cls:"feat-blue",icon:"⏱",text:"Live travel times via Google Maps"},
                {cls:"feat-gold",icon:"$",text:"AI-researched realistic costs per place"},
              ].map(f=>(
                <div key={f.text} className="feat">
                  <div className={`feat-icon ${f.cls}`}>{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
            <div className="sc" ref={sref}>
              <div className="sw">
                <div className="si-wrap">
                  <div className="sicon">📍</div>
                  <input className="si" placeholder="Type any city or town…" value={cin}
                    onChange={e=>{setCin(e.target.value);setCity(e.target.value);}}
                    onKeyDown={e=>{if(e.key==="Enter"&&cin.trim()){setShowS(false);setStep(2);}}}
                    onFocus={()=>cin.length>=2&&setShowS(true)}
                  />
                </div>
                <button className="sbtn" onClick={()=>{if(cin.trim()){setShowS(false);setStep(2);}else toast.show("Please enter a city!")}}>
                  Explore →
                </button>
              </div>
              {showS&&sugg.length>0&&(
                <div className="ssugg">
                  {sugg.map(s=>(
                    <div key={s.city} className="sitem" onClick={()=>selCity(s.city)}>
                      <span>{s.flag}</span><div><div>{s.city}</div><div className="ssub">{s.country}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="chips">
              {["🗽 New York City","🗼 Paris","🏯 Kyoto","🎸 Nashville","🏛️ Rome","🌊 Bali"].map(c=>(
                <div key={c} className="chip" onClick={()=>{const v=c.split(" ").slice(1).join(" ");setCin(v);setCity(v);setShowS(false);}}>{c}</div>
              ))}
            </div>
            <div className="hero-proof">
              <div className="proof-item"><div className="proof-dot"/>Free to use</div>
              <div className="proof-item"><div className="proof-dot"/>No sign-up required</div>
              <div className="proof-item"><div className="proof-dot"/>AI-powered recommendations</div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step===2&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 2 of 4</div>
            <h2 className="st">Customize your trip to <span>{city}</span></h2>
            <p className="ss">Tell us what you love, how you're getting around, and how long you're staying.</p>
          </div>
          <div className="pg">
            {PREFS.map(p=>(
              <div key={p.val} className={`pc ${prefs.has(p.val)?"sel":""}`} onClick={()=>setPrefs(prev=>{const n=new Set(prev);n.has(p.val)?n.delete(p.val):n.add(p.val);return n;})}>
                <div className="pi">{p.icon}</div><div className="pn">{p.name}</div><div className="pd2">{p.desc}</div>
              </div>
            ))}
          </div>
          <div className="cpw">
            <input className="cpi" placeholder="Type your own interest… e.g. jazz bars, rooftop views, street art" value={cpinput} onChange={e=>setCpinput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCpref()}/>
            <button className="cap" onClick={addCpref}>+ Add</button>
          </div>
          {cprefs.length>0&&<div className="ctags">{cprefs.map(t=><div key={t} className="ctag">{t}<button onClick={()=>setCprefs(c=>c.filter(x=>x!==t))}>✕</button></div>)}</div>}

          <div className="sec-label" style={{marginTop:8}}>How many days?</div>
          <div className="days-row">
            <div className="days-text">
              <div className="days-title">Trip Length</div>
              <div className="days-subtitle">We'll create a separate day-by-day plan. Drag places between days in the next step.</div>
            </div>
            <div className="days-ctrl">
              <button className="daybtn" onClick={()=>setNumDays(d=>Math.max(1,d-1))}>−</button>
              <div className="daynum">{numDays}</div>
              <button className="daybtn" onClick={()=>setNumDays(d=>Math.min(7,d+1))}>+</button>
              <span style={{fontSize:"0.82rem",color:"var(--muted2)"}}>day{numDays!==1?"s":""}</span>
            </div>
          </div>

          <div className="sec-label">Getting Around</div>
          <div className="transport-grid">
            {TRANSPORT.map(t=>(
              <div key={t.id} className={`tc ${transport===t.id?"sel":""}`} onClick={()=>setTransport(t.id)}>
                <div className="tc-icon">{t.icon}</div><div className="tc-name">{t.name}</div>
              </div>
            ))}
          </div>

          <div className="sec-label">Daily Schedule</div>
          <div className="time-row">
            <div className="tg"><label>Start Time</label><input type="time" className="tinput" value={startTime} onChange={e=>setStartTime(e.target.value)}/></div>
            <div className="tg"><label>End Time</label><input type="time" className="tinput" value={endTime} onChange={e=>setEndTime(e.target.value)}/></div>
            <div style={{display:"flex",alignItems:"flex-end",paddingBottom:4,color:"var(--muted2)",fontSize:"0.81rem"}}>Applied to each day of your trip</div>
          </div>

          <div className="sec-label">Budget (per person per day)</div>
          <div className="bg">
            {BUDGETS.map(b=>(
              <div key={b.id} className={`bc ${budget===b.id?"sel":""}`} onClick={()=>setBudget(budget===b.id?null:b.id)}>
                <div className="btr" style={{color:b.color}}>{b.tier}</div>
                <div className="bl">{b.label}</div>
                <div className="br" style={{color:b.color}}>{b.range}</div>
                <div className="bd">{b.desc}</div>
              </div>
            ))}
          </div>

          <div className="brow"><button className="gobt" onClick={goToResults}>Find Places →</button></div>
        </div>
      )}

      {/* STEP 3 */}
      {step===3&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 3 of 4</div>
            <h2 className="st">Best spots in <span>{city}</span></h2>
            <p className="ss">Click a card to preview it. Hit Add to pin it. Drag pins between day tabs in the sidebar to move them.</p>
          </div>
          <div className="rl">
            <div>
              <div className="map-wrap">
                <div className="mapbox">
                  <iframe
                    key={staticMapUrl&&allAdded.length>0?staticMapUrl:previewSrc}
                    title="map"
                    src={staticMapUrl&&allAdded.length>0
                      ?staticMapUrl
                      :(previewSrc||`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(city)}&zoom=13`)}
                    allowFullScreen
                    style={{width:"100%",height:"100%",border:"none"}}
                  />
                </div>
                <div className="map-hint">
                  {allAdded.length>0
                    ?<>📍 {allAdded.length} location{allAdded.length!==1?"s":""} pinned — showing numbered markers on map</>
                    :<>Click any card to preview its location</>
                  }
                </div>
              </div>
              <div className="plgrid">
                {visiblePlaces.map(p=>{
                  const added=isAdded(p.id);
                  const focused=focusedId===p.id;
                  const img=p.photoRef?purl(p.photoRef):null;
                  const cp=cardPriceMap[p.id];
                  const pb=cp==="loading"?"…"
                    :cp&&cp.cost!=null?(cp.cost===0?"Free":`~$${cp.cost}`)
                    :p.priceLevel===0?"Free":p.priceLevel===1?"$":p.priceLevel===2?"$$":p.priceLevel===3?"$$$":null;
                  const pbLoading=cp==="loading";
                  return(
                    <div key={p.id} className={`plcard ${added?"added":""} ${focused&&!added?"focused":""}`} onClick={()=>focusPlace(p)}>
                      <div className="plimg">
                        {img?<img src={img} alt={p.name} onError={e=>{e.target.parentElement.innerHTML=p.emoji;}} loading="lazy"/>:<span>{p.emoji}</span>}
                        {pb&&<div className="pbadge" style={{opacity:pbLoading?0.6:1,fontStyle:pbLoading?"italic":"normal"}}>{pb}</div>}
                        {added&&<div className="pin-badge">📍 Pinned</div>}
                      </div>
                      <div className="plbody">
                        <div className="pltype">{p.type}</div>
                        <div className="plname">{p.name}</div>
                        <div className="plrat">★ {p.rating} <span>({p.reviews.toLocaleString()} reviews)</span></div>
                        <div className="pldesc">{p.desc}</div>
                      </div>
                      <div className="plfoot">
                        <div className="pldur">~{p.duration} min</div>
                        <button className={`addbt ${added?"added":""}`} onClick={e=>{e.stopPropagation();addToDay(p,activeSideDay);}}>
                          {added?"✓ Pinned":`+ Day ${activeSideDay+1}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {places.length>visibleCount&&<button className="show-more" onClick={showMore}>+ Show More Places</button>}
              {places.length<=visibleCount&&allPlaces.length>=8&&<button className="show-more" onClick={showMore} disabled={!nextToken.current}>{nextToken.current?"+ Load More from Google":"✓ All places loaded"}</button>}
            </div>

            {/* SIDEBAR */}
            <div className="sb np">
              <div className="sbt">Your Itinerary</div>
              <div className="sbs">{allAdded.length} place{allAdded.length!==1?"s":""} across {numDays} day{numDays!==1?"s":""}</div>
              {numDays>1&&(
                <>
                  <div style={{fontSize:"0.72rem",color:"var(--muted2)",marginBottom:8}}>
                    Drag places onto a different day tab to move them
                  </div>
                  <div className="day-tabs">
                    {dayPlans.map((day,di)=>(
                      <div key={di} className={`day-tab ${activeSideDay===di?"active":""}`}
                        onClick={()=>setActiveSideDay(di)}
                        onDragOver={onDragOver}
                        onDrop={e=>onDropOnDay(e,di)}>
                        Day {di+1}<span className="cnt">{day.length}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="day-drop-zone"
                onDragOver={onDragOver}
                onDrop={e=>onDropOnDay(e,activeSideDay)}>
                {dayPlans[activeSideDay]?.length===0
                  ?<div className="em">Add places to Day {activeSideDay+1}</div>
                  :dayPlans[activeSideDay].map((p,i)=>(
                    <div key={p.id} className="ii"
                      draggable
                      onDragStart={e=>onDragStart(e,i,activeSideDay)}
                      onDragOver={e=>{e.preventDefault();e.stopPropagation();}}
                      onDrop={e=>onDropReorder(e,i,activeSideDay)}
                      onDragEnd={onDragEnd}>
                      <div className="ii-l">
                        <span className="dh ii-dh">⠿</span>
                        <div><div>{p.emoji} {p.name}</div><div className="iis">{p.type} · ~{p.duration} min</div></div>
                      </div>
                      <button className="rmbt" onClick={()=>removeFromDay(p.id,activeSideDay)}>✕</button>
                    </div>
                  ))
                }
              </div>
              {numDays>1&&<div style={{fontSize:"0.71rem",color:"var(--muted2)",textAlign:"center",marginTop:8}}>Tip: drop a card onto a Day tab above to move it between days</div>}
              <button className="finbt" onClick={goToItinerary} disabled={allAdded.length===0}>✨ Generate Itinerary</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step===4&&(
        <div className="page">
          <div className="ih">
            <div>
              <h2 className="imt">Your {numDays>1?`${numDays}-day trip to`:"day in"} <em>{city}</em></h2>
              <div className="iml">{[blabel,`by ${tlabel}`].filter(Boolean).join(" · ")}{allAdded.length>0?` · ${allAdded.length} stops`:""}</div>
              {aiUsed&&<div className="aib">✦ AI-personalized descriptions & researched costs</div>}
              {travelLoading&&<div style={{fontSize:"0.75rem",color:"var(--ocean3)",marginTop:6}}>⏱ Calculating real travel times via Google Maps…</div>}
            </div>
            <div className="iac np">
              <button className="obt" onClick={()=>setStep(3)}>← Edit Places</button>
              <button className="dbt" onClick={()=>exportPDF(city,dayPlans,budget,transport,descMap,costMap,travelMap,startTime)}>⬇ Export PDF</button>
            </div>
          </div>

          {costMap&&Object.keys(costMap).length>0&&(
            <div className="cost-box">
              <div className="cost-ttl">💰 Estimated Cost Per Person{numDays>1?` — All ${numDays} Days`:""}</div>
              {numDays>1&&(
                <div className="cost-rows" style={{marginBottom:10}}>
                  {dayPlans.map((day,di)=>{
                    const dayTotal=day.reduce((s,p)=>s+((costMap[p.id]?.cost)??0),0);
                    const hasCosts=day.some(p=>costMap[p.id]!=null);
                    if(!hasCosts)return null;
                    return(
                      <div key={di} className="cost-row" style={{fontWeight:600}}>
                        <span className="cost-lbl">Day {di+1}</span>
                        <span className="cost-val">{dayTotal===0?"Free":`~$${dayTotal}`}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="cost-rows">
                {allAdded.map(p=>{
                  const c=costMap?.[p.id];
                  return c!=null?(
                    <div key={p.id} className="cost-row">
                      <span className="cost-lbl">{p.name}{c.note?<span style={{fontSize:"0.72rem",color:"var(--muted2)",marginLeft:6}}>{c.note}</span>:null}</span>
                      <span className="cost-val">{c.cost===0?"Free":`~$${c.cost}`}</span>
                    </div>
                  ):null;
                })}
              </div>
              <div className="cost-total"><span>Grand total</span><span className="cost-total-val">{totalCost===0?"Free":`~$${totalCost} per person`}</span></div>
            </div>
          )}

          {numDays>1&&(
            <div className="itin-day-tabs">
              {dayPlans.map((_,di)=>(
                <div key={di} className={`idt ${itinViewDay===di?"active":""}`} onClick={()=>setItinViewDay(di)}>
                  Day {di+1} · {dayPlans[di].length} stop{dayPlans[di].length!==1?"s":""}
                </div>
              ))}
            </div>
          )}

          {(()=>{
            const day=dayPlans[itinViewDay]||[];
            const times=computeDayTimes(itinViewDay);
            return(
              <div className="tl">
                {day.map((place,i)=>{
                  const t=times[i]||{start:"9:00 AM",end:"10:00 AM",travelMin:15,travelText:"~15 min"};
                  const img=place.photoRef?purl(place.photoRef):null;
                  const isLast=i===day.length-1;
                  const cost=costMap?.[place.id];
                  const desc=descMap?.[place.id]||place.desc;
                  return(
                    <div key={place.id}>
                      <div className="tlb">
                        <div className="ttc">
                          <div className="ttime" onClick={()=>openEdit(place)} title="Click to edit">{t.start}</div>
                          <div className="tdur">until {t.end}</div>
                          {!isLast&&<div className="tline"/>}<div className="tdot"/>
                        </div>
                        <div className="tcc">
                          <div className="tcard">
                            <div className="tcimg">{img?<img src={img} alt={place.name} onError={e=>{e.target.parentElement.innerHTML=place.emoji;}}/>:<span>{place.emoji}</span>}</div>
                            <div className="tcb">
                              <div className="tctype">{place.type}</div>
                              <div className="tcname">{place.name}</div>
                              <div className="tcdesc">{desc}</div>
                              <div className="tcmeta">
                                <span>★ {place.rating}</span>
                                <span>~{place.duration} min</span>
                                {cost!=null&&<span className="cbadge">{cost.cost===0?"Free":`~$${cost.cost}`}{cost.note?<span style={{fontSize:"0.65rem",opacity:0.75,marginLeft:3}}>· {cost.note}</span>:null}</span>}
                                <span className="edit-link" onClick={()=>openEdit(place)}>✏️ edit time</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!isLast&&(
                        <div className="trvl"><div/>
                          {travelLoading&&!travelMap[`${itinViewDay}-${i}`]
                            ?<div className="travel-calc">⏱ Calculating travel time…</div>
                            :<div className="trvli">{TRANSPORT.find(x=>x.id===transport)?.icon||"🚶"} {t.travelText} by {tlabel.toLowerCase()} to next stop</div>
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Day cost summary strip */}
                {costMap&&(()=>{
                  const dayCosts=day.filter(pl=>costMap[pl.id]!=null);
                  if(!dayCosts.length)return null;
                  const dayTotal=dayCosts.reduce((s,pl)=>s+(costMap[pl.id]?.cost||0),0);
                  return(
                    <div style={{marginTop:16,padding:"12px 16px",background:"rgba(27,94,138,0.05)",borderRadius:10,border:"1px solid rgba(27,94,138,0.15)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:"0.8rem",color:"var(--muted)",fontWeight:600}}>💰 Day {itinViewDay+1} estimated cost</span>
                      <span style={{fontSize:"1rem",fontWeight:700,color:"var(--ocean)",fontFamily:"'Cormorant Garamond',serif"}}>{dayTotal===0?"Free":`~$${dayTotal} per person`}</span>
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      )}

      {/* USER SETUP */}
      {showUserSetup&&(
        <div className="pov" onClick={e=>e.target===e.currentTarget&&setShowUserSetup(false)}>
          <div className="usetup">
            <div className="ust">Create your profile</div>
            <div className="uss">Pick a username to save trips and track your adventures. No password needed — saved locally to this device.</div>
            <input className="uinp" placeholder="Enter a username…" value={usernameInput} onChange={e=>setUsernameInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createUser()} autoFocus/>
            <button className="ubf" onClick={createUser}>Create Profile →</button>
            {knownUsers.length>0&&(
              <>
                <div className="div-or">or switch to existing profile</div>
                <div className="user-list">
                  {knownUsers.map(name=>(
                    <div key={name} className="user-item" onClick={()=>switchUser(name)}>
                      <div className="user-item-av">{name.slice(0,2).toUpperCase()}</div>
                      <div><div className="user-item-name">{name}</div><div className="user-item-meta">{getHist(name).length} trip{getHist(name).length!==1?"s":""} · since {getCreated(name)}</div></div>
                      <button className="user-item-del" onClick={e=>deleteUser(name,e)}>🗑</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PROFILE */}
      {showProfile&&activeUser&&(
        <div className="pov" onClick={e=>e.target===e.currentTarget&&setShowProfile(false)}>
          <div className="pmodal">
            <button className="pmc" onClick={()=>setShowProfile(false)}>✕</button>
            <div className="pm-hdr">
              <div className="pm-av">{initials}</div>
              <div><div className="pm-name">{activeUser}</div><div className="pm-sub">Member since {getCreated(activeUser)}</div></div>
            </div>
            <div className="pm-stats">
              <div className="pms"><div className="pms-n">{hist.length}</div><div className="pms-l">Trips planned</div></div>
              <div className="pms"><div className="pms-n">{hist.reduce((s,h)=>s+(h.stops||0),0)}</div><div className="pms-l">Places visited</div></div>
              <div className="pms"><div className="pms-n">{visitedCities.length}</div><div className="pms-l">Cities explored</div></div>
            </div>
            {visitedCities.length>0&&(
              <>
                <div className="pm-sec">🌍 Cities Explored</div>
                <div className="pm-map">
                  {cityEmbedUrl
                    ?<iframe key={cityEmbedUrl} title="cities-map" src={cityEmbedUrl} allowFullScreen loading="lazy" style={{width:"100%",height:"100%",border:"none"}}/>
                    :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--muted2)",fontSize:"0.82rem",background:"var(--sand)"}}>Plan your first trip to see it here!</div>
                  }
                </div>
              </>
            )}
            <div className="pm-sec">🧳 Your Trips</div>
            {hist.length===0
              ?<div className="pm-empty">No trips yet — go plan one! ✈️</div>
              :<div className="pm-trips">
                {(()=>{
                  const MC=["#c45c26","#1b5e8a","#4a7c59","#c8820a","#7c5cbf","#e06b30"];
                  const seen=new Set(); const order=[];
                  hist.forEach(h=>{if(!seen.has(h.city)&&h.lat&&h.lng&&!(h.lat===0&&h.lng===0)){seen.add(h.city);order.push(h.city);}});
                  return hist.map(h=>{
                    const ci=order.indexOf(h.city);
                    const dot=ci>=0?MC[ci%MC.length]:"#9b8c80";
                    return(
                      <div key={h.id} className="pm-trip">
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:10,height:10,borderRadius:"50%",background:dot,flexShrink:0,outline:`2px solid ${dot}`,outlineOffset:2}}/>
                          <div>
                            <div className="pm-trip-city">{h.city}</div>
                            <div className="pm-trip-meta">{h.date}{h.days>1?` · ${h.days} days`:""} · {h.places?.slice(0,2).join(", ")}{h.stops>2?` +${h.stops-2} more`:""}</div>
                          </div>
                        </div>
                        <div className="pm-trip-stops" style={{color:dot}}>📍 {h.stops}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            }
            <div className="pm-btns">
              <button className="pm-btn" onClick={()=>{setShowProfile(false);setShowUserSetup(true);}}>Switch Profile</button>
              <button className="pm-btn danger" onClick={logout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* TIME EDIT */}
      {editingPlace&&(
        <div className="teov" onClick={e=>e.target===e.currentTarget&&setEditingPlace(null)}>
          <div className="temod">
            <div className="temt">Edit Time</div>
            <div className="tems">{editingPlace.name}</div>
            <div className="temr"><div className="teml">Start Time</div><input type="time" className="temi" value={editTimeVal} onChange={e=>setEditTimeVal(e.target.value)}/></div>
            <div className="temr"><div className="teml">Duration (minutes)</div><input type="number" className="temi" value={editDurVal} min={15} max={480} step={15} onChange={e=>setEditDurVal(Number(e.target.value))}/></div>
            <div className="tembtns">
              <button className="tem-c" onClick={()=>setEditingPlace(null)}>Cancel</button>
              <button className="tem-s" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {loading&&<div className="ls"><div className="spin"/><div className="lt">{lmsg}</div>{lsub&&<div className="lt-sub">{lsub}</div>}</div>}
      <div className="toast" style={{opacity:toast.vis?1:0}}>{toast.msg}</div>
    </>
  );
}
