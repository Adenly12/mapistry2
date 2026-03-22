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
  padding: 0 32px; height: 62px;
  background: rgba(250,246,240,0.96); backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border2);
  position: sticky; top: 0; z-index: 300;
}
.logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; color: var(--ocean); cursor: pointer; font-weight: 600; letter-spacing: -0.3px; flex-shrink: 0; }
.logo em { font-style: italic; color: var(--ocean2); }
.nav-l { display: flex; align-items: center; gap: 16px; }
.back { display: flex; align-items: center; gap: 6px; background: var(--sand); border: 1px solid var(--border2); color: var(--muted); border-radius: 30px; padding: 7px 16px; font-size: 0.79rem; cursor: pointer; transition: all 0.2s; }
.back:hover { background: var(--sand2); color: var(--ink); }
.nav-r { display: flex; align-items: center; gap: 10px; }
.nav-city { font-size: 0.71rem; color: var(--muted2); letter-spacing: 1.5px; text-transform: uppercase; }
.ubtn { display: flex; align-items: center; gap: 7px; background: var(--ocean); color: white; border: none; border-radius: 30px; padding: 7px 16px; font-size: 0.79rem; cursor: pointer; transition: all 0.2s; font-weight: 500; flex-shrink:0; }
.ubtn:hover { background: var(--ocean2); }
.ubtn.guest { background: var(--sand); color: var(--ocean); border: 1px solid var(--border2); }
.ubtn.guest:hover { background: var(--sand2); }
.uav { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg,var(--ocean),var(--ocean2)); display: flex; align-items: center; justify-content: center; font-size: 0.66rem; font-weight: 700; }
/* ── STEP BREADCRUMB ── */
.step-nav { display: flex; align-items: center; gap: 0; flex: 1; justify-content: center; padding: 0 16px; overflow: hidden; }
.step-nav-item { display: flex; align-items: center; gap: 0; }
.step-nav-btn { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px; border: none; background: none; cursor: pointer; font-family: 'DM Sans',sans-serif; font-size: 0.75rem; font-weight: 500; color: var(--muted2); transition: all 0.18s; white-space: nowrap; }
.step-nav-btn:hover:not(:disabled) { background: var(--sand); color: var(--ink); }
.step-nav-btn.active { background: var(--ocean); color: white; font-weight: 600; }
.step-nav-btn.done { color: var(--ocean); }
.step-nav-btn.done:hover { background: rgba(27,94,138,0.08); }
.step-nav-btn:disabled { cursor: default; opacity: 0.4; }
.step-nav-num { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; background: var(--sand2); color: var(--muted); transition: all 0.18s; flex-shrink: 0; }
.step-nav-btn.active .step-nav-num { background: rgba(255,255,255,0.25); color: white; }
.step-nav-btn.done .step-nav-num { background: var(--ocean); color: white; }
.step-nav-divider { color: var(--border2); font-size: 0.7rem; padding: 0 2px; user-select: none; }
@media(max-width:760px){ .step-nav-label { display: none; } .step-nav { gap: 0; } }

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

/* ── HERO INPUTS ── */
.hero-inputs { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 480px; margin-bottom: 16px; }
.hero-input-row { display: flex; gap: 10px; }
.hero-input-wrap { flex: 1; position: relative; }
.hero-input-label { font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted2); font-weight: 600; margin-bottom: 5px; }
.hero-ibox { display: flex; align-items: center; background: white; border-radius: 14px; border: 1.5px solid var(--border2); box-shadow: var(--sh); overflow: hidden; transition: border-color 0.2s; }
.hero-ibox:focus-within { border-color: var(--ocean3); }
.hero-ibox .sicon { padding: 0 0 0 14px; font-size: 0.9rem; color: var(--ocean3); }
.hero-ibox input { flex: 1; border: none; padding: 12px 12px; font-family: 'DM Sans',sans-serif; font-size: 0.88rem; background: transparent; color: var(--ink); outline: none; }
.hero-ibox input::placeholder { color: var(--muted2); }
.hero-date-row { display: flex; gap: 10px; }
.hero-date-box { flex: 1; background: white; border-radius: 14px; border: 1.5px solid var(--border2); box-shadow: var(--sh); padding: 10px 14px; transition: border-color 0.2s; }
.hero-date-box:focus-within { border-color: var(--ocean3); }
.hero-date-box label { font-size: 0.62rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted2); font-weight: 600; display: block; margin-bottom: 3px; }
.hero-date-box input { border: none; font-family: 'DM Sans',sans-serif; font-size: 0.88rem; color: var(--ink); outline: none; background: transparent; width: 100%; }

/* ── BUDGET BREAKDOWN ── */
.bbd-loading { display: flex; align-items: center; gap: 10px; padding: 16px 0; color: var(--muted2); font-size: 0.82rem; }
.bbd-spinner { width: 16px; height: 16px; border: 2px solid var(--border2); border-top-color: var(--ocean); border-radius: 50%; animation: spin 0.7s linear infinite; }
.total-budget-input { width: 100%; padding: 14px 18px; border: 2px solid var(--border2); border-radius: var(--r); font-family: 'DM Sans',sans-serif; font-size: 1.1rem; font-weight: 600; background: white; color: var(--ink); outline: none; transition: all 0.2s; box-shadow: var(--sh); }
.total-budget-input:focus { border-color: var(--ocean); }
.total-budget-wrap { position: relative; margin-bottom: 8px; }
.total-budget-wrap::before { content: "$"; position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; font-weight: 700; color: var(--ocean); pointer-events: none; }
.total-budget-wrap input { padding-left: 30px; }
/* Cost cards */
.cost-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px; }
.cost-card { background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 18px; box-shadow: var(--sh); }
.cost-card-icon { font-size: 1.5rem; margin-bottom: 8px; }
.cost-card-label { font-size: 0.68rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted2); font-weight: 600; margin-bottom: 4px; }
.cost-card-amount { font-family: 'Cormorant Garamond',serif; font-size: 1.8rem; font-weight: 700; color: var(--ocean); line-height: 1; margin-bottom: 4px; }
.cost-card-note { font-size: 0.71rem; color: var(--muted2); margin-bottom: 10px; min-height: 16px; }
.cost-card-edit { display: flex; align-items: center; gap: 6px; }
.cost-card-override { flex: 1; border: 1.5px solid var(--border2); border-radius: var(--rs); padding: 7px 10px; font-family: 'DM Sans',sans-serif; font-size: 0.85rem; color: var(--ink); outline: none; background: var(--sand); transition: border-color 0.2s; }
.cost-card-override:focus { border-color: var(--ocean); background: white; }
.cost-card-editbtn { background: none; border: none; color: var(--ocean3); cursor: pointer; font-size: 0.75rem; text-decoration: underline; text-underline-offset: 2px; white-space: nowrap; }
.cost-card-editbtn:hover { color: var(--ocean); }
/* Donut chart */
.donut-wrap { display: flex; align-items: center; gap: 32px; background: white; border: 2px solid var(--border); border-radius: var(--r); padding: 24px; box-shadow: var(--sh); margin-bottom: 28px; }
.donut-svg { flex-shrink: 0; }
.donut-legend { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.donut-legend-item { display: flex; align-items: center; gap: 10px; font-size: 0.84rem; }
.donut-legend-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.donut-legend-lbl { flex: 1; color: var(--muted); }
.donut-legend-amt { font-weight: 700; color: var(--ink); }
.donut-legend-pct { font-size: 0.7rem; color: var(--muted2); }
.donut-over-warn { margin-top: 10px; padding: 10px 14px; background: rgba(196,92,38,0.08); border: 1px solid rgba(196,92,38,0.2); border-radius: var(--rs); font-size: 0.78rem; color: #c45c26; }

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
.plcard.focused { border-color: var(--ocean); box-shadow: 0 0 0 3px rgba(27,94,138,0.12), var(--shm); }
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
.day-drop-zone.ii { background: var(--sand); border-radius: var(--rxs); padding: 9px 11px; display: flex; align-items: center; justify-content: space-between; font-size: 0.81rem; margin-bottom: 6px; border: 1.5px solid transparent; transition: all 0.15s; }
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
function getAIHeaders(key){
  return{
    "Content-Type":"application/json",
    "x-api-key":key,
    "anthropic-version":"2023-06-01",
    "anthropic-dangerous-direct-browser-access":"true",
  };
}

async function aiCall(prompt, maxTokens=1200){
  if(!ANTHROPIC_KEY||ANTHROPIC_KEY==="PASTE_YOUR_ANTHROPIC_KEY_HERE")return null;
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:getAIHeaders(ANTHROPIC_KEY),
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})
    });
    const d=await r.json();
    if(d.error){console.error("aiCall error",d.error);return null;}
    return d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim()||null;
  }catch(e){console.error("aiCall error",e);return null;}
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
async function exportPDF(city,dayPlans,budget,transport,descMap,costMap,travelMap,startTime){
  // Load jsPDF dynamically if not already available
  if(!window.jspdf){
    await new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload=resolve; s.onerror=reject;
      document.head.appendChild(s);
    });
  }
  const{jsPDF}=window.jspdf||{};
  if(!jsPDF){alert("Could not load PDF library. Please check your internet connection.");return;}

  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();
  const H=doc.internal.pageSize.getHeight();
  const MAR=14; const INNER=W-MAR*2;
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  // Use AI costs if available, fall back to instant price lookup for PDF
  const allP=dayPlans.flat();
  const mergedCostMap={};
  allP.forEach(p=>{
    if(costMap&&costMap[p.id]!=null)mergedCostMap[p.id]=costMap[p.id];
    else{const ip=getInstantPrice(p);mergedCostMap[p.id]=ip;}
  });
  const effectiveCostMap=mergedCostMap;
  const tlabel=TRANSPORT.find(t=>t.id===transport)?.name||"Walking";
  const allPlaces=dayPlans.flat();
  const hasCosts=effectiveCostMap&&allPlaces.some(p=>effectiveCostMap[p.id]!=null);
  const totalCost=hasCosts?allPlaces.reduce((s,p)=>s+((effectiveCostMap[p.id]?.cost)||0),0):null;
  const today=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  // ── PALETTE ──
  const TERRA=[27,94,138];
  const TERRA_L=[232,242,251];
  const OCEAN=[27,94,138];
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
      const costEntry=effectiveCostMap?.[p.id];
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
      const c=effectiveCostMap[p.id];
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

// ─── INSTANT PRICE LOOKUP ─────────────────────────────────────
// Known venues with real prices (USD, per person)
const KNOWN_PRICES = {
  // Museums & Art
  "metropolitan museum of art":30,"met museum":30,"moma":30,"museum of modern art":30,
  "guggenheim":28,"whitney museum":25,"natural history museum":0,"smithsonian":0,
  "louvre":22,"musée d'orsay":16,"centre pompidou":15,"british museum":0,
  "national gallery":0,"tate modern":0,"rijksmuseum":22,"van gogh museum":22,
  "uffizi":25,"colosseum":18,"vatican museums":20,"sagrada familia":26,
  "anne frank house":16,"pergamon museum":12,"prado":15,"acropolis museum":10,
  "national museum of anthropology":5,"palace of fine arts":0,
  "art institute of chicago":32,"mca chicago":15,"field museum":24,
  "california academy of sciences":40,"de young museum":15,"sfmoma":25,
  "getty museum":0,"lacma":25,"broad museum":0,"hammer museum":0,
  "perez art museum":16,"bass museum":10,"norton museum":18,
  "museum of flight":26,"space needle":40,"intrepid museum":36,
  "9/11 memorial museum":33,"ellis island":24,"statue of liberty":24,
  "national air and space museum":0,"national zoo":0,
  "dallas museum of art":0,"kimbell art museum":0,
  "houston museum of natural science":25,"menil collection":0,
  "seattle art museum":30,"portland art museum":25,
  "cleveland museum of art":0,"detroit institute of arts":14,
  "philadelphia museum of art":30,"barnes foundation":30,
  "museum of science boston":30,"isabella stewart gardner":20,
  "denver art museum":15,"denver museum of nature and science":18,
  "minneapolis institute of art":0,"walker art center":15,

  // Landmarks & Attractions
  "eiffel tower":30,"arc de triomphe":13,"versailles":20,
  "big ben":0,"tower of london":34,"buckingham palace":30,"windsor castle":28,
  "stonehenge":22,"edinburgh castle":18,
  "colosseum":18,"roman forum":12,"trevi fountain":0,"spanish steps":0,
  "sistine chapel":20,"st peter's basilica":0,
  "acropolis":20,"parthenon":20,
  "burj khalifa":40,"palm jumeirah":0,
  "sydney opera house":43,"sydney harbour bridge climb":174,
  "central park":0,"high line":0,"brooklyn bridge":0,"times square":0,
  "statue of liberty":24,"one world observatory":42,
  "hollywood walk of fame":0,"griffith observatory":0,"getty center":0,
  "alcatraz":45,"golden gate bridge":0,"fisherman's wharf":0,
  "navy pier":0,"millennium park":0,"willis tower":35,
  "freedom trail":0,"fenway park":23,
  "national mall":0,"lincoln memorial":0,"washington monument":1,
  "kennedy space center":75,"universal studios":120,"seaworld":110,
  "disneyland":109,"disney world":109,"six flags":70,
  "las vegas strip":0,"hoover dam":10,"grand canyon":35,
  "yellowstone":35,"yosemite":35,"zion national park":35,
  "niagara falls":0,"mount rushmore":0,
  "space needle":40,"pike place market":0,
  "reunion tower":24,"the dallas world aquarium":25,
  "alamo":0,"river walk":0,
  "french quarter":0,"bourbon street":0,
  "graceland":45,"nashville honky tonk highway":0,
  "bourbon street":0,"garden district":0,

  // Aquariums & Zoos
  "georgia aquarium":45,"shedd aquarium":40,"monterey bay aquarium":55,
  "new england aquarium":32,"national aquarium":42,"tennessee aquarium":35,
  "dallas world aquarium":25,"denver aquarium":25,
  "san diego zoo":64,"bronx zoo":38,"philadelphia zoo":24,
  "st louis zoo":0,"lincoln park zoo":0,"houston zoo":18,
  "los angeles zoo":22,"miami zoo":22,"nashville zoo":20,

  // Restaurants (typical per person)
  "nobu":120,"spago":95,"the french laundry":350,"per se":350,
  "eleven madison park":365,"le bernardin":185,"daniel":165,
  "gordon ramsay":120,"joël robuchon":300,
  "shake shack":15,"five guys":14,"in-n-out":10,
  "cheesecake factory":25,"olive garden":20,"applebee's":18,
  "mcdonalds":10,"starbucks":8,"dunkin":6,
  "katz's delicatessen":25,"peter luger":80,"joe's pizza":5,

  // Generic fallbacks by type
  "aquarium":35,"zoo":25,"theme park":100,"amusement park":80,
  "national park":20,"state park":10,"city park":0,"botanical garden":15,
  "art museum":20,"history museum":15,"science museum":20,"children's museum":15,
  "theater":80,"opera":120,"concert hall":90,"comedy club":30,
  "casino":0,"nightclub":20,"bar":25,"pub":20,
  "restaurant":35,"cafe":15,"coffee shop":8,"bakery":10,"food market":15,
  "spa":100,"gym":20,"yoga studio":20,
  "shopping mall":0,"market":0,"souvenir shop":0,
  "church":0,"cathedral":0,"mosque":0,"temple":0,"synagogue":0,
  "library":0,"city hall":0,"palace":15,"castle":18,"fortress":12,
  "beach":0,"lake":0,"mountain":0,"waterfall":0,"viewpoint":0,
  "tour":30,"boat tour":40,"bike tour":35,"walking tour":20,
};

function getInstantPrice(place){
  const nameLower=place.name.toLowerCase();
  // Check known venues first (exact or partial match)
  for(const[key,price] of Object.entries(KNOWN_PRICES)){
    if(nameLower.includes(key)||key.includes(nameLower)){
      return{cost:price,note:price===0?"Free entry":"Est. per person"};
    }
  }
  // Fallback: type + priceLevel from Google
  const typeLower=(place.type||"").toLowerCase();
  const pl=place.priceLevel??1;
  // Free types
  if(["park","beach","lake","monument","landmark","plaza","square","garden","trail",
      "library","government","church","cathedral","mosque","temple","synagogue",
      "market","neighborhood","district"].some(t=>typeLower.includes(t))&&pl===0){
    return{cost:0,note:"Free entry"};
  }
  // Price level estimates by type
  const ranges={
    0:[0,0],1:[8,20],2:[20,45],3:[50,100],4:[100,200]
  };
  const [lo,hi]=ranges[Math.min(pl,4)];
  const est=lo===0?0:Math.round((lo+hi)/2);
  const note=est===0?"Free entry":typeLower.includes("restaurant")||typeLower.includes("food")||typeLower.includes("cafe")||typeLower.includes("bar")?"Est. per person meal":"Est. per person";
  return{cost:est,note};
}


// ─── DONUT CHART ──────────────────────────────────────────────
function DonutChart({segments, budgetNum, remaining, over}){
  const size=180, r=62, stroke=24;
  const cx=size/2, cy=size/2;
  const circ=2*Math.PI*r;
  const total=segments.reduce((s,sg)=>s+sg.value,0)||1;
  let offset=0;
  const arcs=segments.filter(sg=>sg.value>0).map((sg,i)=>{
    const dash=(sg.value/total)*circ;
    const arc=(
      <circle key={i} cx={cx} cy={cy} r={r} fill="none"
        stroke={sg.color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ-dash}`}
        strokeDashoffset={circ/4-offset}
      />
    );
    offset+=dash;
    return arc;
  });
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--sand2)" strokeWidth={stroke}/>
      {arcs}
      {budgetNum>0&&(
        <>
          <text x={cx} y={cy-10} textAnchor="middle"
            style={{fontSize:"9px",fill:"var(--muted2)",fontFamily:"DM Sans,sans-serif",fontWeight:600,letterSpacing:"0.5px"}}>
            REMAINING
          </text>
          <text x={cx} y={cy+12} textAnchor="middle"
            style={{fontSize:remaining>9999?"14px":"18px",fill:over?"#c45c26":"var(--ocean)",fontFamily:"Cormorant Garamond,serif",fontWeight:700}}>
            ${remaining.toLocaleString()}
          </text>
          <text x={cx} y={cy+26} textAnchor="middle"
            style={{fontSize:"8px",fill:"var(--muted2)",fontFamily:"DM Sans,sans-serif"}}>
            of ${budgetNum.toLocaleString()}
          </text>
        </>
      )}
    </svg>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App(){
  const[step,setStep]=useState(1);
  const[photoIdx,setPhotoIdx]=useState(0);
  const[city,setCity]=useState("");
  const[cin,setCin]=useState("");
  const[sugg,setSugg]=useState([]);
  const[showS,setShowS]=useState(false);
  // Origin city
  const[originCity,setOriginCity]=useState("");
  const[originIn,setOriginIn]=useState("");
  const[originSugg,setOriginSugg]=useState([]);
  const[showOriginS,setShowOriginS]=useState(false);
  const originRef=useRef();
  // Dates
  const[departDate,setDepartDate]=useState("");
  const[returnDate,setReturnDate]=useState("");
  // Total trip budget
  const[totalBudget,setTotalBudget]=useState("");
  const[budgetBreakdown,setBudgetBreakdown]=useState(null);
  const[budgetLoading,setBudgetLoading]=useState(false);
  const[flightCost,setFlightCost]=useState(null);   // real or estimated
  const[hotelCost,setHotelCost]=useState(null);     // real or estimated
  const[flightOverride,setFlightOverride]=useState(""); // user override
  const[hotelOverride,setHotelOverride]=useState(""); // user override
  const[editingFlight,setEditingFlight]=useState(false);
  const[editingHotel,setEditingHotel]=useState(false);
  const[costFetchError,setCostFetchError]=useState(null);
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
    if(originIn.length<2){setOriginSugg([]);return;}
    const q=originIn.toLowerCase();
    setOriginSugg(CITIES.filter(s=>s.city.toLowerCase().includes(q)||s.country.toLowerCase().includes(q)).slice(0,6));
    setShowOriginS(true);
  },[originIn]);

  useEffect(()=>{
    const fn=e=>{
      if(sref.current&&!sref.current.contains(e.target))setShowS(false);
      if(originRef.current&&!originRef.current.contains(e.target))setShowOriginS(false);
    };
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);

  function selCity(c){setCin(c);setCity(c);setShowS(false);}
  function selOriginCity(c){setOriginIn(c);setOriginCity(c);setShowOriginS(false);}

  // Auto-calculate numDays from dates
  useEffect(()=>{
    if(departDate&&returnDate){
      const diff=Math.round((new Date(returnDate)-new Date(departDate))/(1000*60*60*24));
      if(diff>0&&diff<=30)setNumDays(diff);
    }
  },[departDate,returnDate]);



  // Fetch real flight prices + hotel estimates
  async function fetchRealCosts(){
    if(!city||!departDate||!returnDate)return;
    setBudgetLoading(true);
    setCostFetchError(null);
    try{
      // Flights — real data from Serpapi Google Flights
      const flightParams=new URLSearchParams({
        origin:originCity||"",
        destination:city,
        depart_date:departDate,
        return_date:returnDate,
      });
      // Hotels — smart estimate by city
      const hotelParams=new URLSearchParams({
        city,
        nights:String(numDays),
        ...(departDate?{check_in_date:departDate}:{}),
        ...(returnDate?{check_out_date:returnDate}:{}),
      });
      const [flightRes, hotelRes] = await Promise.all([
        fetch(`/api/flights?${flightParams}`),
        fetch(`/api/hotels?${hotelParams}`),
      ]);
      const [fd, hd] = await Promise.all([flightRes.json(), hotelRes.json()]);

      if(fd.price){
        setFlightCost({
          cost:fd.price,
          note:fd.airline?`${fd.airline} · ${fd.stops===0?"Nonstop":`${fd.stops} stop${fd.stops>1?"s":""}`}·  Economy round-trip`:"Economy round-trip",
          priceLevel:fd.price_level,
          typicalRange:fd.typical_range,
          real:true,
        });
      } else if(fd.error&&!originCity){
        setFlightCost({cost:0,note:"No origin city — add one for flight prices",real:false});
      } else {
        setFlightCost({cost:0,note:fd.error||"No flights found for these dates",real:false});
      }

      if(hd.nightly){
        setHotelCost({
          cost:hd.nightly,
          total:hd.total,
          note:hd.note,
          real:false, // estimate
        });
      }
    }catch(e){
      console.error("fetchRealCosts error",e);
      setCostFetchError("Could not load estimates. Check your connection.");
    }
    setBudgetLoading(false);
  }

  // Auto-fetch when entering step 2
  useEffect(()=>{
    if(step===2&&city&&departDate&&returnDate&&!flightCost&&!budgetLoading){
      fetchRealCosts();
    }
  },[step]);

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
  // Budget → search keywords and price_level filter range
  const BUDGET_CONFIG={
    free: {keywords:["free","budget","cheap","affordable"],priceLevels:[0,1],   searchHint:"free and budget-friendly"},
    mid:  {keywords:["popular","casual","local"],          priceLevels:[1,2],   searchHint:"popular mid-range"},
    upscale:{keywords:["upscale","popular","best"],        priceLevels:[2,3],   searchHint:"upscale"},
    luxury:{keywords:["luxury","exclusive","fine dining","premium"],priceLevels:[3,4],searchHint:"luxury exclusive"},
  };

  async function doFetch(c,token=null){
    try{
      const allP=[...prefs,...cprefs];
      const bc=budget?BUDGET_CONFIG[budget]:null;
      // Build a richer query that reflects budget + interests
      let q;
      if(token){
        q=null; // pagetoken ignores query
      } else if(allP.length>0&&bc){
        q=`${bc.searchHint} ${allP.join(" and ")} in ${c}`;
      } else if(allP.length>0){
        q=`${allP.join(" and ")} in ${c}`;
      } else if(bc){
        q=`${bc.searchHint} things to do in ${c}`;
      } else {
        q=`top attractions in ${c}`;
      }
      const url=token
        ?`/api/places?query=${encodeURIComponent("attractions in "+c)}&pagetoken=${token}`
        :`/api/places?query=${encodeURIComponent(q)}`;
      const r=await fetch(url);const d=await r.json();
      if(d.results?.length>0){
        let mapped=d.results.map((p,i)=>({
          id:Date.now()+i,name:p.name,
          type:(p.types?.[0]||"attraction").replace(/_/g," "),
          rating:p.rating||4.0,reviews:p.user_ratings_total||0,
          emoji:"📍",
          desc:p.editorial_summary?.overview||p.formatted_address||`A great spot in ${c}.`,
          duration:60,lat:p.geometry.location.lat,lng:p.geometry.location.lng,
          photoRef:p.photos?.[0]?.photo_reference||null,
          priceLevel:p.price_level??null,
        }));

        // Filter & sort by budget if selected
        if(bc){
          const allowed=bc.priceLevels;
          // Separate into matches, unknowns (null priceLevel), and mismatches
          const matches=mapped.filter(p=>p.priceLevel!=null&&allowed.includes(p.priceLevel));
          const unknowns=mapped.filter(p=>p.priceLevel==null);
          const mismatches=mapped.filter(p=>p.priceLevel!=null&&!allowed.includes(p.priceLevel));
          // Show matches first, then unknowns, then mismatches (softly filtered, not hard removed)
          mapped=[...matches,...unknowns,...mismatches];
        }

        // Always sort by rating within each group
        mapped.sort((a,b)=>{
          if(bc){
            const aMatch=bc.priceLevels.includes(a.priceLevel??-1)?0:a.priceLevel==null?1:2;
            const bMatch=bc.priceLevels.includes(b.priceLevel??-1)?0:b.priceLevel==null?1:2;
            if(aMatch!==bMatch)return aMatch-bMatch;
          }
          return b.rating-a.rating;
        });

        return{places:mapped,nextToken:d.next_page_token||null};
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
    setStaticMapUrl("");setLoading(false);setStep(4);
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

  function focusPlace(p){
    setFocusedId(p.id);
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
    setLoading(false);setStep(5);setItinViewDay(0);
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
      {(()=>{
        const STEPS=[
          {n:1,label:"Trip"},
          {n:2,label:"Budget"},
          {n:3,label:"Preferences"},
          {n:4,label:"Places"},
          {n:5,label:"Itinerary"},
        ];
        function goToStep(n){
          // Can only jump to steps already reached (step <= current step)
          if(n>step)return;
          setStep(n);
        }
        return(
          <nav className="nav">
            <div className="nav-l">
              <div className="logo" onClick={()=>{setStep(1);setDayPlans([[]]);setCin("");setCity("");setOriginIn("");setOriginCity("");setDepartDate("");setReturnDate("");setTotalBudget("");setBudgetBreakdown(null);}}>
                Mapit<em>stry</em>
              </div>
            </div>
            <div className="step-nav">
              {STEPS.map((s,i)=>(
                <div key={s.n} className="step-nav-item">
                  {i>0&&<div className="step-nav-divider">›</div>}
                  <button
                    className={`step-nav-btn ${s.n===step?"active":s.n<step?"done":""}`}
                    onClick={()=>goToStep(s.n)}
                    disabled={s.n>step}
                    title={s.n>step?"Complete previous steps first":""}
                  >
                    <div className="step-nav-num">{s.n<step?"✓":s.n}</div>
                    <span className="step-nav-label">{s.label}</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="nav-r">
              {city&&step>1&&(
                <div className="nav-city">
                  {originCity&&<span>{originCity} → </span>}
                  📍 {city}
                </div>
              )}
              {activeUser
                ?<button className="ubtn" onClick={()=>setShowProfile(true)}><div className="uav">{initials}</div>{activeUser}</button>
                :<button className="ubtn guest" onClick={()=>setShowUserSetup(true)}>👤 Sign In</button>
              }
            </div>
          </nav>
        );
      })()}

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
            <div className="hero-inputs">
              {/* Destination */}
              <div>
                <div className="hero-input-label">📍 Where to?</div>
                <div className="hero-ibox" ref={sref} style={{position:"relative"}}>
                  <input className="si" style={{padding:"14px 14px"}} placeholder="Destination city…" value={cin}
                    onChange={e=>{setCin(e.target.value);setCity(e.target.value);}}
                    onKeyDown={e=>{if(e.key==="Enter"&&cin.trim()){setShowS(false);}}}
                    onFocus={()=>cin.length>=2&&setShowS(true)}
                  />
                  {showS&&sugg.length>0&&(
                    <div className="ssugg" style={{top:"calc(100% + 6px)"}}>
                      {sugg.map(s=>(
                        <div key={s.city} className="sitem" onClick={()=>selCity(s.city)}>
                          <span>{s.flag}</span><div><div>{s.city}</div><div className="ssub">{s.country}</div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Origin */}
              <div>
                <div className="hero-input-label">🛫 Flying from?</div>
                <div className="hero-ibox" ref={originRef} style={{position:"relative"}}>
                  <input style={{padding:"14px 14px",flex:1,border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",background:"transparent",color:"var(--ink)",outline:"none"}}
                    placeholder="Your home city (for flight estimates)…"
                    value={originIn}
                    onChange={e=>{setOriginIn(e.target.value);setOriginCity(e.target.value);}}
                    onFocus={()=>originIn.length>=2&&setShowOriginS(true)}
                  />
                  {showOriginS&&originSugg.length>0&&(
                    <div className="ssugg" style={{top:"calc(100% + 6px)"}}>
                      {originSugg.map(s=>(
                        <div key={s.city} className="sitem" onClick={()=>selOriginCity(s.city)}>
                          <span>{s.flag}</span><div><div>{s.city}</div><div className="ssub">{s.country}</div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Dates */}
              <div className="hero-date-row">
                <div className="hero-date-box">
                  <label>Departure</label>
                  <input type="date" value={departDate} onChange={e=>setDepartDate(e.target.value)} min={new Date().toISOString().split("T")[0]}/>
                </div>
                <div className="hero-date-box">
                  <label>Return</label>
                  <input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} min={departDate||new Date().toISOString().split("T")[0]}/>
                </div>
              </div>
              {/* Explore button */}
              <button className="sbtn" style={{borderRadius:14,padding:"14px",width:"100%",fontSize:"0.95rem"}}
                onClick={()=>{
                  if(!cin.trim()){toast.show("Please enter a destination!");return;}
                  if(!departDate||!returnDate){toast.show("Please add travel dates to continue.");return;}
                  setShowS(false);setStep(2);
                }}>
                Plan My Trip →
              </button>
              {(!departDate||!returnDate)&&cin.trim()&&(
                <div style={{fontSize:"0.73rem",color:"#c45c26",marginTop:6,textAlign:"center"}}>
                  ✕ Travel dates are required to continue
                </div>
              )}
            </div>
            <div className="chips">
              {["🗽 New York","🗼 Paris","🏯 Kyoto","🎸 Nashville","🏛️ Rome","🌊 Bali"].map(c=>(
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

      {/* STEP 2 — BUDGET */}
      {step===2&&(()=>{
        const effFlight=flightOverride!==""?Number(flightOverride):(flightCost?.cost||0);
        const effHotel=hotelOverride!==""?(Number(hotelOverride)*numDays):(hotelCost?.total||0);
        const budgetNum=Number(totalBudget)||0;
        const remaining=Math.max(0,budgetNum-effFlight-effHotel);
        const totalSpend=effFlight+effHotel;
        const over=budgetNum>0&&totalSpend>budgetNum;

        // CSS conic-gradient donut — no SVG math needed
        const flightPct=budgetNum>0?Math.round(effFlight/budgetNum*100):0;
        const hotelPct=budgetNum>0?Math.round(effHotel/budgetNum*100):0;
        const remPct=Math.max(0,100-flightPct-hotelPct);
        const gradient=budgetNum>0
          ?`conic-gradient(#1b5e8a 0% ${flightPct}%, #4a9fd4 ${flightPct}% ${flightPct+hotelPct}%, ${over?"#e07060":"#c8e6d4"} ${flightPct+hotelPct}% 100%)`
          :`conic-gradient(var(--sand2) 0% 100%)`;

        const segments=[
          {label:"✈️ Flights",color:"#1b5e8a",value:effFlight},
          {label:"🏨 Hotel",color:"#4a9fd4",value:effHotel},
          {label:"💰 Remaining",color:over?"#e07060":"#c8e6d4",value:remaining},
        ];

        return(
          <div className="page">
            <div className="sh">
              <div className="sey">Step 2 of 5</div>
              <h2 className="st">Plan your <span>budget</span></h2>
              <p className="ss">Set your total budget then enter your estimated flight and hotel costs. The chart updates as you type.</p>
            </div>

            <div className="sec-label">Your Total Trip Budget (per person)</div>
            <div className="total-budget-wrap" style={{marginBottom:6}}>
              <input className="total-budget-input" type="number" min={0} placeholder="e.g. 2000"
                value={totalBudget} onChange={e=>setTotalBudget(e.target.value)}/>
            </div>
            <div style={{fontSize:"0.75rem",color:"var(--muted2)",marginBottom:24}}>
              {departDate&&returnDate
                ?`${numDays} night${numDays!==1?"s":""} · ${new Date(departDate).toLocaleDateString("en-US",{month:"short",day:"numeric"})} → ${new Date(returnDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`
                :""}
            </div>

            {/* Cost input cards */}
            <div className="cost-cards">
              {/* Flight card */}
              <div className="cost-card">
                <div className="cost-card-icon">✈️</div>
                <div className="cost-card-label">Round-Trip Flight</div>
                {budgetLoading&&!flightCost
                  ?<div className="bbd-loading" style={{padding:"8px 0"}}><div className="bbd-spinner"/>Searching Google Flights…</div>
                  :<>
                    <div className="cost-card-amount" style={{color:"#1b5e8a"}}>
                      {flightOverride!==""?`$${Number(flightOverride).toLocaleString()}`:flightCost?.cost>0?`$${flightCost.cost.toLocaleString()}`:"—"}
                    </div>
                    <div className="cost-card-note">
                      {flightOverride!==""?"Your override"
                        :flightCost?.real?<span style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                          <span style={{background:"rgba(74,124,89,0.12)",color:"var(--sage)",borderRadius:10,padding:"1px 7px",fontSize:"0.65rem",fontWeight:700}}>LIVE</span>
                          {flightCost.note}
                        </span>
                        :flightCost?.note||"Add origin city for live prices"}
                    </div>
                    {flightCost?.typicalRange&&!flightOverride&&(
                      <div style={{fontSize:"0.68rem",color:"var(--muted2)",marginBottom:6}}>
                        Typical: ${flightCost.typicalRange[0]}–${flightCost.typicalRange[1]}
                        {flightCost.priceLevel&&<span style={{marginLeft:6,fontWeight:600,color:flightCost.priceLevel==="low"?"var(--sage)":flightCost.priceLevel==="high"?"#c45c26":"var(--muted)"}}>· {flightCost.priceLevel}</span>}
                      </div>
                    )}
                    <div className="cost-card-edit">
                      {editingFlight
                        ?<><input className="cost-card-override" type="number" min={0} placeholder="Your flight cost"
                            value={flightOverride} onChange={e=>setFlightOverride(e.target.value)}
                            autoFocus onKeyDown={e=>e.key==="Enter"&&setEditingFlight(false)}/>
                          <button className="cost-card-editbtn" onClick={()=>setEditingFlight(false)}>Done</button></>
                        :<button className="cost-card-editbtn" onClick={()=>setEditingFlight(true)}>
                            {flightOverride!==""?"✎ Edit":"✎ Override"}
                          </button>
                      }
                      {flightOverride!==""&&!editingFlight&&<button className="cost-card-editbtn" style={{color:"var(--muted2)"}} onClick={()=>setFlightOverride("")}>Reset</button>}
                      {!flightOverride&&flightCost&&<button className="cost-card-editbtn" style={{color:"var(--muted2)"}} onClick={()=>{setFlightCost(null);fetchRealCosts();}}>🔄</button>}
                    </div>
                  </>
                }
              </div>
              {/* Hotel card */}
              <div className="cost-card">
                <div className="cost-card-icon">🏨</div>
                <div className="cost-card-label">Hotel · {numDays} night{numDays!==1?"s":""}</div>
                <div className="cost-card-amount" style={{color:"#4a9fd4"}}>
                  {hotelOverride!==""?`$${(Number(hotelOverride)*numDays).toLocaleString()}`:hotelCost?.total>0?`$${hotelCost.total.toLocaleString()}`:"—"}
                </div>
                <div className="cost-card-note">
                  {hotelOverride!==""?`$${hotelOverride}/night · your override`
                    :hotelCost?.note||"Loading estimate…"}
                </div>
                <div className="cost-card-edit">
                  {editingHotel
                    ?<><input className="cost-card-override" type="number" min={0} placeholder="Price per night"
                        value={hotelOverride} onChange={e=>setHotelOverride(e.target.value)}
                        autoFocus onKeyDown={e=>e.key==="Enter"&&setEditingHotel(false)}/>
                      <button className="cost-card-editbtn" onClick={()=>setEditingHotel(false)}>Done</button></>
                    :<button className="cost-card-editbtn" onClick={()=>setEditingHotel(true)}>
                        {hotelOverride!==""?"✎ Edit price":"+ Add price"}
                      </button>
                  }
                  {hotelOverride!==""&&!editingHotel&&(
                    <button className="cost-card-editbtn" style={{color:"var(--muted2)"}} onClick={()=>setHotelOverride("")}>Clear</button>
                  )}
                </div>
              </div>
            </div>

            {/* CSS Donut chart — always visible, placeholder when no budget */}
            <div className="donut-wrap">
              <div style={{position:"relative",width:160,height:160,flexShrink:0}}>
                <div style={{
                  width:160,height:160,borderRadius:"50%",
                  background:budgetNum>0?gradient:"var(--sand2)",
                  transition:"background 0.5s ease",
                }}/>
                <div style={{
                  position:"absolute",top:"50%",left:"50%",
                  transform:"translate(-50%,-50%)",
                  width:100,height:100,borderRadius:"50%",
                  background:"white",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 2px 8px rgba(26,20,16,0.08)",
                }}>
                  {budgetNum>0
                    ?<>
                      <div style={{fontSize:"0.55rem",letterSpacing:"1px",textTransform:"uppercase",color:"var(--muted2)",fontWeight:600}}>Left</div>
                      <div style={{fontSize:remaining>9999?"0.95rem":"1.15rem",fontWeight:700,color:over?"#c45c26":"var(--ocean)",fontFamily:"Cormorant Garamond,serif",lineHeight:1.1}}>${remaining.toLocaleString()}</div>
                      <div style={{fontSize:"0.55rem",color:"var(--muted2)"}}>of ${budgetNum.toLocaleString()}</div>
                    </>
                    :<div style={{fontSize:"0.65rem",color:"var(--muted2)",textAlign:"center",padding:"0 10px",lineHeight:1.4}}>Enter budget above</div>
                  }
                </div>
              </div>
              <div className="donut-legend">
                {segments.map(sg=>(
                  <div key={sg.label} className="donut-legend-item">
                    <div className="donut-legend-dot" style={{background:budgetNum>0?sg.color:"var(--sand3)"}}/>
                    <div className="donut-legend-lbl">{sg.label}</div>
                    <div className="donut-legend-amt" style={{color:budgetNum>0?"var(--ink)":"var(--muted2)"}}>{budgetNum>0&&sg.value>0?`$${sg.value.toLocaleString()}`:"—"}</div>
                    <div className="donut-legend-pct">{budgetNum>0?`${Math.round(sg.value/budgetNum*100)}%`:""}</div>
                  </div>
                ))}
                {over&&<div className="donut-over-warn">⚠️ Over budget by ${(totalSpend-budgetNum).toLocaleString()}</div>}
                {!budgetNum&&<div style={{fontSize:"0.75rem",color:"var(--muted2)",marginTop:8}}>Add your budget to see the breakdown</div>}
              </div>
            </div>

            <div className="brow"><button className="gobt" onClick={()=>setStep(3)}>Set Preferences →</button></div>
          </div>
        );
      })()}

            {/* STEP 3 — PREFERENCES */}
      {step===3&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 3 of 5</div>
            <h2 className="st">Customize your trip to <span>{city}</span></h2>
            <p className="ss">Tell us what you love, how long you're staying, and when you start each day.</p>
          </div>
          <div className="sec-label">Getting Around</div>
          <div className="transport-grid" style={{marginBottom:24}}>
            {TRANSPORT.map(t=>(
              <div key={t.id} className={`tc ${transport===t.id?"sel":""}`} onClick={()=>setTransport(t.id)}>
                <div className="tc-icon">{t.icon}</div><div className="tc-name">{t.name}</div>
              </div>
            ))}
          </div>

          <div className="sec-label">Your Interests</div>
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
              <div className="days-subtitle">{departDate&&returnDate?`Auto-calculated from your dates (${numDays} day${numDays!==1?"s":""}). You can adjust manually.`:"We'll create a separate day-by-day plan."}</div>
            </div>
            <div className="days-ctrl">
              <button className="daybtn" onClick={()=>setNumDays(d=>Math.max(1,d-1))}>−</button>
              <div className="daynum">{numDays}</div>
              <button className="daybtn" onClick={()=>setNumDays(d=>Math.min(7,d+1))}>+</button>
              <span style={{fontSize:"0.82rem",color:"var(--muted2)"}}>day{numDays!==1?"s":""}</span>
            </div>
          </div>

          <div className="sec-label">Daily Schedule</div>
          <div className="time-row">
            <div className="tg"><label>Start Time</label><input type="time" className="tinput" value={startTime} onChange={e=>setStartTime(e.target.value)}/></div>
            <div className="tg"><label>End Time</label><input type="time" className="tinput" value={endTime} onChange={e=>setEndTime(e.target.value)}/></div>
            <div style={{display:"flex",alignItems:"flex-end",paddingBottom:4,color:"var(--muted2)",fontSize:"0.81rem"}}>Applied to each day of your trip</div>
          </div>

          <div className="sec-label">Spending Style (per person per day)</div>
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
      {step===4&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 4 of 5</div>
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
                  const ip=getInstantPrice(p);
                  // If AI itinerary costs are available, prefer those
                  const costEntry=costMap?.[p.id];
                  const displayPrice=costEntry!=null?costEntry:ip;
                  const pb=displayPrice.cost===0?"Free":`~$${displayPrice.cost}`;
                  const pbNote=displayPrice.note||null;
                  // Budget match indicator
                  const bc=budget?{free:[0,1],mid:[1,2],upscale:[2,3],luxury:[3,4]}[budget]:null;
                  const plMatch=!bc||p.priceLevel==null||bc.includes(p.priceLevel);
                  return(
                    <div key={p.id} className={`plcard ${added?"added":""} ${focused&&!added?"focused":""}`} onClick={()=>focusPlace(p)}>
                      <div className="plimg">
                        {img?<img src={img} alt={p.name} onError={e=>{e.target.parentElement.innerHTML=p.emoji;}} loading="lazy"/>:<span>{p.emoji}</span>}
                        {pb&&<div className="pbadge" style={{
                          background:costMap?.[p.id]!=null?"rgba(27,94,138,0.85)":plMatch?"rgba(26,20,16,0.7)":"rgba(180,60,60,0.75)",
                        }} title={plMatch?"":"May not match your budget"}>{pb}</div>}
                        {added&&<div className="pin-badge">📍 Pinned</div>}
                      </div>
                      <div className="plbody">
                        <div className="pltype">{p.type}</div>
                        <div className="plname">{p.name}</div>
                        <div className="plrat">★ {p.rating} <span>({p.reviews.toLocaleString()} reviews)</span></div>
                        <div className="pldesc">{p.desc}</div>
                      </div>
                      <div className="plfoot" style={{flexDirection:"column",gap:4,alignItems:"stretch"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div className="pldur">~{p.duration} min</div>
                          <button className={`addbt ${added?"added":""}`} onClick={e=>{e.stopPropagation();addToDay(p,activeSideDay);}}>
                            {added?"✓ Pinned":`+ Day ${activeSideDay+1}`}
                          </button>
                        </div>
                        {pbNote&&<div style={{fontSize:"0.7rem",color:"var(--muted2)",paddingBottom:2}}>{pbNote}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {places.length>visibleCount&&<button className="show-more" onClick={showMore}>+ Show More Places</button>}
              {places.length<=visibleCount&&allPlaces.length>=8&&<button className="show-more" onClick={showMore} disabled={!nextToken.current}>{nextToken.current?"+ Load More from Google":"✓ All places loaded"}</button>}
            </div>

            {/* SIDEBAR */}
            <div className="sb">
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
      {step===5&&(
        <div className="page">
          <div className="ih">
            <div>
              <h2 className="imt">Your {numDays>1?`${numDays}-day trip to`:"day in"} <em>{city}</em></h2>
              <div className="iml">{[blabel,`by ${tlabel}`].filter(Boolean).join(" · ")}{allAdded.length>0?` · ${allAdded.length} stops`:""}</div>
              {aiUsed&&<div className="aib">✦ AI-personalized descriptions & researched costs</div>}
              {travelLoading&&<div style={{fontSize:"0.75rem",color:"var(--ocean3)",marginTop:6}}>⏱ Calculating real travel times via Google Maps…</div>}
            </div>
            <div className="iac">
              <button className="obt" onClick={()=>setStep(3)}>← Edit Places</button>
              <button className="dbt" onClick={()=>{exportPDF(city,dayPlans,budget,transport,descMap,costMap,travelMap,startTime);}}>⬇ Export PDF</button>
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
