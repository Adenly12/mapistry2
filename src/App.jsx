import { useState, useEffect, useRef } from "react";
import CONFIG from "./config";

const GOOGLE_KEY = CONFIG.GOOGLE_KEY;
const ANTHROPIC_KEY = CONFIG.ANTHROPIC_KEY;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
:root {
  --bg:#07070f;--bg2:#0d0d1c;--bg3:#121224;
  --surf:#161628;--surf2:#1c1c34;--surf3:#222240;
  --cream:#f5f2ee;--warm:#e8e2d8;
  --vi:#7c5cbf;--vi2:#9b7de0;--vi3:#c4a8f8;
  --teal:#1aaa8e;--teal2:#22ccaa;--teal3:#88eedd;
  --amber:#d4920a;--amber2:#f0ac18;--amber3:#ffd060;
  --rose:#cc3355;--rose2:#ee4466;--rose3:#ff8899;
  --blue:#2255cc;--blue2:#4488ff;
  --muted:#525870;--muted2:#7880a0;--muted3:#a0a8c0;
  --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.11);--border3:rgba(255,255,255,0.18);
  --r:16px;--rs:10px;
  --sh:0 2px 16px rgba(0,0,0,0.4);--shm:0 8px 36px rgba(0,0,0,0.5);--shl:0 24px 72px rgba(0,0,0,0.6);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--cream);min-height:100vh;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg2);}::-webkit-scrollbar-thumb{background:var(--surf3);border-radius:2px;}

/* ── NAV ── */
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:62px;background:rgba(7,7,15,0.88);backdrop-filter:blur(24px);position:sticky;top:0;z-index:200;border-bottom:1px solid var(--border);}
.logo{font-family:'Instrument Serif',serif;font-size:1.65rem;color:var(--cream);cursor:pointer;font-style:italic;letter-spacing:-0.3px;}
.logo b{font-style:normal;color:var(--amber2);font-weight:400;}
.nav-l{display:flex;align-items:center;gap:18px;}
.back{display:flex;align-items:center;gap:5px;background:var(--surf);border:1px solid var(--border2);color:var(--muted3);border-radius:30px;padding:6px 14px;font-size:0.78rem;cursor:pointer;transition:all 0.2s;}
.back:hover{color:var(--cream);border-color:var(--border3);}
.nav-r{display:flex;align-items:center;gap:10px;}
.nav-city{font-size:0.71rem;color:var(--muted);letter-spacing:2px;text-transform:uppercase;}
.prog{display:flex;gap:5px;}
.pd{width:6px;height:6px;border-radius:50%;background:var(--border2);transition:all 0.3s;}
.pd.on{background:var(--amber2);width:18px;border-radius:3px;}
.pd.done{background:var(--teal2);}
.ubtn{display:flex;align-items:center;gap:7px;background:var(--surf);border:1px solid var(--border2);color:var(--cream);border-radius:30px;padding:6px 14px;font-size:0.78rem;cursor:pointer;transition:all 0.2s;}
.ubtn:hover{background:var(--surf2);}
.uav{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--vi),var(--teal));display:flex;align-items:center;justify-content:center;font-size:0.66rem;font-weight:700;color:white;}

/* ── HERO ── */
.hero{min-height:calc(100vh - 62px);position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;align-items:center;}
@media(max-width:900px){.hero{grid-template-columns:1fr;}}
.hero-bg{position:absolute;inset:0;background:var(--bg);}
.hero-orb1{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(124,92,191,0.22) 0%,transparent 65%);top:-200px;right:-100px;pointer-events:none;}
.hero-orb2{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(26,170,142,0.14) 0%,transparent 65%);bottom:-150px;left:-50px;pointer-events:none;}
.hero-orb3{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(212,146,10,0.1) 0%,transparent 65%);top:40%;left:35%;pointer-events:none;}
.hero-grid-lines{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%);}
.hero-left{position:relative;z-index:2;padding:80px 60px 80px 7vw;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(124,92,191,0.12);border:1px solid rgba(124,92,191,0.28);border-radius:30px;padding:6px 14px;font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--vi3);margin-bottom:26px;}
.badge-dot{width:6px;height:6px;border-radius:50%;background:var(--vi2);animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
.hero-h1{font-family:'Instrument Serif',serif;font-size:clamp(3rem,5vw,4.8rem);line-height:1.03;margin-bottom:22px;}
.hero-h1 em{font-style:italic;color:var(--amber2);}
.hero-h1 span{display:block;color:var(--cream);}
.hero-sub{color:var(--muted3);font-size:0.97rem;max-width:440px;margin-bottom:36px;line-height:1.8;font-weight:300;}
.hero-feats{display:flex;flex-direction:column;gap:9px;margin-bottom:40px;}
.hfeat{display:flex;align-items:center;gap:10px;font-size:0.83rem;color:var(--muted3);}
.hfeat-icon{width:20px;height:20px;border-radius:50%;background:rgba(26,170,142,0.15);border:1px solid rgba(26,170,142,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:var(--teal2);}
.sc{width:100%;max-width:500px;position:relative;z-index:3;}
.sw{display:flex;background:var(--surf2);border:1px solid var(--border2);border-radius:60px;box-shadow:0 0 0 1px rgba(255,255,255,0.03),var(--shm);}
.si-wrap{display:flex;align-items:center;flex:1;overflow:hidden;border-radius:60px 0 0 60px;}
.sicon{padding:0 0 0 18px;color:var(--muted);font-size:0.95rem;flex-shrink:0;}
.si{flex:1;border:none;padding:16px 13px;font-family:'Inter',sans-serif;font-size:0.91rem;background:transparent;color:var(--cream);outline:none;}
.si::placeholder{color:var(--muted);}
.ssugg{position:absolute;top:calc(100%+8px);left:0;right:0;background:var(--surf2);border-radius:var(--rs);box-shadow:var(--shl);z-index:100;overflow:hidden;border:1px solid var(--border2);}
.sitem{display:flex;align-items:center;gap:10px;padding:11px 16px;cursor:pointer;transition:background 0.15s;font-size:0.86rem;}
.sitem:hover{background:var(--surf3);}
.ssub{font-size:0.7rem;color:var(--muted);}
.sbtn{background:linear-gradient(135deg,var(--vi) 0%,var(--blue2) 100%);color:white;border:none;padding:16px 24px;font-family:'Syne',sans-serif;font-size:0.86rem;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap;border-radius:0 60px 60px 0;letter-spacing:0.5px;}
.sbtn:hover{filter:brightness(1.12);}
.chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px;}
.chip{background:rgba(255,255,255,0.04);border:1px solid var(--border2);color:var(--muted3);border-radius:30px;padding:5px 13px;font-size:0.74rem;cursor:pointer;transition:all 0.2s;}
.chip:hover{background:rgba(124,92,191,0.15);border-color:rgba(124,92,191,0.35);color:var(--vi3);}

/* HERO RIGHT */
.hero-right{position:relative;z-index:2;padding:60px 7vw 60px 20px;}
.dest-stack{display:flex;flex-direction:column;gap:11px;}
.dest-card{background:var(--surf);border:1px solid var(--border2);border-radius:16px;padding:15px 18px;display:flex;align-items:center;gap:14px;transition:all 0.35s;animation:sfadeIn 0.5s ease both;}
.dest-card:nth-child(1){animation-delay:0.1s;}
.dest-card:nth-child(2){animation-delay:0.22s;}
.dest-card:nth-child(3){animation-delay:0.34s;}
@keyframes sfadeIn{from{opacity:0;transform:translateX(18px);}to{opacity:1;transform:translateX(0);}}
.dest-card:hover{background:var(--surf2);transform:translateX(-3px);}
.dest-emo{width:48px;height:48px;border-radius:10px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;}
.dest-info{flex:1;}
.dest-name{font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:600;margin-bottom:2px;}
.dest-meta{font-size:0.73rem;color:var(--muted3);}
.dest-badge{font-size:0.7rem;font-weight:600;border-radius:20px;padding:3px 9px;white-space:nowrap;}
.dest-badge.green{background:rgba(26,170,142,0.15);color:var(--teal2);}
.dest-badge.amber{background:rgba(212,146,10,0.15);color:var(--amber2);}
.dest-badge.rose{background:rgba(204,51,85,0.15);color:var(--rose2);}
.hero-micro{display:flex;gap:0;margin-top:18px;background:var(--surf);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
.micro-stat{flex:1;padding:14px 16px;text-align:center;border-right:1px solid var(--border);}
.micro-stat:last-child{border-right:none;}
.micro-n{font-family:'Instrument Serif',serif;font-size:1.5rem;color:var(--amber2);}
.micro-l{font-size:0.69rem;color:var(--muted);margin-top:1px;}

/* ── STEP PAGES ── */
.page{padding:44px 5vw 72px;max-width:1380px;margin:0 auto;}
.sh{margin-bottom:30px;}
.sey{font-size:0.66rem;letter-spacing:3px;text-transform:uppercase;color:var(--rose2);margin-bottom:7px;font-family:'Syne',sans-serif;}
.st{font-family:'Instrument Serif',serif;font-size:2.3rem;color:var(--cream);line-height:1.1;font-style:italic;}
.st span{color:var(--teal2);font-style:italic;}
.ss{color:var(--muted3);margin-top:8px;font-weight:300;font-size:0.9rem;}

/* PREFS */
.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:9px;margin:20px 0;}
.pc{background:var(--surf);border:1.5px solid var(--border);border-radius:var(--r);padding:15px 13px;cursor:pointer;transition:all 0.2s;}
.pc:hover{border-color:rgba(26,170,142,0.35);background:var(--surf2);}
.pc.sel{border-color:var(--teal2);background:rgba(26,170,142,0.07);}
.pi{font-size:1.5rem;margin-bottom:6px;}
.pn{font-weight:500;font-size:0.85rem;}
.pd2{font-size:0.71rem;color:var(--muted);margin-top:2px;}
.cpw{display:flex;gap:8px;margin-bottom:13px;}
.cpi{flex:1;padding:10px 16px;border:1.5px solid var(--border2);border-radius:60px;font-family:'Inter',sans-serif;font-size:0.88rem;background:var(--surf);color:var(--cream);outline:none;transition:border-color 0.2s;}
.cpi:focus{border-color:var(--teal2);}
.cpi::placeholder{color:var(--muted);}
.cap{background:var(--surf2);color:var(--cream);border:1.5px solid var(--border2);border-radius:60px;padding:10px 18px;font-size:0.82rem;font-weight:500;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
.cap:hover{border-color:var(--teal2);color:var(--teal2);}
.ctags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:13px;}
.ctag{background:rgba(26,170,142,0.1);color:var(--teal2);border:1px solid rgba(26,170,142,0.25);border-radius:30px;padding:4px 11px;font-size:0.77rem;display:flex;align-items:center;gap:5px;}
.ctag button{background:none;border:none;color:rgba(26,170,142,0.5);cursor:pointer;font-size:0.82rem;line-height:1;}
.ctag button:hover{color:var(--rose2);}

/* TRANSPORT */
.section-label{font-size:0.69rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;font-family:'Syne',sans-serif;}
.transport-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(115px,1fr));gap:8px;margin-bottom:26px;}
.tc{background:var(--surf);border:1.5px solid var(--border);border-radius:var(--r);padding:14px 10px;cursor:pointer;transition:all 0.2s;text-align:center;}
.tc:hover{border-color:rgba(124,92,191,0.35);}
.tc.sel{border-color:var(--vi2);background:rgba(124,92,191,0.08);}
.tc-icon{font-size:1.5rem;margin-bottom:5px;}
.tc-name{font-weight:500;font-size:0.82rem;}
.tc-time{font-size:0.68rem;color:var(--muted);margin-top:1px;}

/* BUDGET */
.bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(182px,1fr));gap:9px;margin-bottom:26px;}
.bc{background:var(--surf);border:1.5px solid var(--border);border-radius:var(--r);padding:15px;cursor:pointer;transition:all 0.2s;}
.bc:hover{border-color:rgba(212,146,10,0.3);}
.bc.sel{border-color:var(--amber2);background:rgba(212,146,10,0.07);}
.btr{font-size:1.15rem;font-weight:700;margin-bottom:2px;font-family:'Syne',sans-serif;}
.bl{font-weight:500;font-size:0.86rem;margin-bottom:2px;}
.br{font-size:0.72rem;font-weight:600;margin-bottom:4px;}
.bd{font-size:0.71rem;color:var(--muted);line-height:1.4;}
.conds{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:26px;}
.cg label{font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px;}
.pills{display:flex;gap:5px;flex-wrap:wrap;}
.pill{background:var(--surf);border:1.5px solid var(--border);border-radius:30px;padding:5px 12px;font-size:0.78rem;cursor:pointer;transition:all 0.18s;color:var(--muted3);}
.pill:hover{border-color:var(--border3);color:var(--cream);}
.pill.sel{background:rgba(124,92,191,0.12);border-color:var(--vi2);color:var(--vi3);}
.time-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:26px;background:var(--surf);border:1px solid var(--border2);border-radius:var(--r);padding:18px;}
.tg{display:flex;flex-direction:column;gap:5px;}
.tg label{font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);}
.tinput{padding:9px 14px;border:1.5px solid var(--border2);border-radius:var(--rs);font-family:'Inter',sans-serif;font-size:0.9rem;background:var(--bg2);color:var(--cream);outline:none;transition:border-color 0.2s;}
.tinput:focus{border-color:var(--teal2);}
.brow{display:flex;justify-content:flex-end;gap:10px;margin-top:10px;}
.gobt{background:linear-gradient(135deg,var(--vi),var(--blue2));color:white;border:none;border-radius:60px;padding:12px 38px;font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.5px;}
.gobt:hover{filter:brightness(1.1);}

/* RESULTS */
.rl{display:grid;grid-template-columns:1fr 355px;gap:24px;align-items:start;}
@media(max-width:960px){.rl{grid-template-columns:1fr;}}
.map-wrap{margin-bottom:18px;}
.mapbox{width:100%;height:300px;border-radius:var(--r);overflow:hidden;border:1px solid var(--border2);}
.mapbox iframe{width:100%;height:100%;border:none;}
.map-hint{font-size:0.75rem;color:var(--muted);margin-top:6px;display:flex;align-items:center;gap:5px;}
.plgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:13px;}
.plcard{background:var(--surf);border-radius:var(--r);overflow:hidden;border:1.5px solid var(--border);cursor:pointer;transition:all 0.22s;}
.plcard:hover{border-color:var(--border3);transform:translateY(-2px);}
.plcard.focused{border-color:var(--amber2);box-shadow:0 0 0 2px rgba(212,146,10,0.2);}
.plcard.added{border-color:var(--teal2);}
.plimg{width:100%;height:155px;overflow:hidden;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:2.5rem;position:relative;}
.plimg img{width:100%;height:100%;object-fit:cover;display:block;}
.pbadge{position:absolute;top:8px;right:8px;background:rgba(7,7,15,0.8);color:var(--amber2);border-radius:20px;padding:3px 8px;font-size:0.68rem;font-weight:700;backdrop-filter:blur(6px);}
.pin-badge{position:absolute;top:8px;left:8px;background:rgba(26,170,142,0.9);color:white;border-radius:20px;padding:3px 8px;font-size:0.68rem;font-weight:700;}
.plbody{padding:12px 14px;}
.pltype{font-size:0.63rem;letter-spacing:2px;text-transform:uppercase;color:var(--rose2);margin-bottom:3px;}
.plname{font-family:'Instrument Serif',serif;font-size:1.05rem;margin-bottom:3px;font-style:italic;}
.plrat{font-size:0.78rem;color:var(--amber2);}
.plrat span{color:var(--muted3);}
.pldesc{font-size:0.77rem;color:var(--muted3);margin-top:5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.plfoot{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-top:1px solid var(--border);}
.pldur{font-size:0.73rem;color:var(--muted3);}
.addbt{background:var(--surf2);color:var(--cream);border:1px solid var(--border2);border-radius:30px;padding:6px 15px;font-size:0.77rem;cursor:pointer;transition:all 0.18s;font-weight:500;}
.addbt:hover{border-color:var(--teal2);color:var(--teal2);}
.addbt.added{background:rgba(26,170,142,0.15);border-color:var(--teal2);color:var(--teal2);}
.show-more{width:100%;margin-top:14px;padding:12px;background:var(--surf);border:1.5px solid var(--border2);border-radius:var(--r);font-size:0.87rem;font-weight:500;color:var(--muted3);cursor:pointer;transition:all 0.2s;}
.show-more:hover{border-color:var(--teal2);color:var(--teal2);}
.show-more:disabled{opacity:0.4;cursor:not-allowed;}

/* SIDEBAR */
.sb{background:var(--surf);border:1px solid var(--border2);border-radius:var(--r);padding:20px 17px;position:sticky;top:74px;}
.sbt{font-family:'Instrument Serif',serif;font-size:1.2rem;font-style:italic;margin-bottom:2px;}
.sbs{font-size:0.73rem;color:var(--muted);margin-bottom:14px;}
.il{list-style:none;}
.ii{background:var(--surf2);border-radius:9px;padding:9px 11px;display:flex;align-items:center;justify-content:space-between;font-size:0.81rem;margin-bottom:6px;cursor:grab;user-select:none;transition:all 0.15s;border:1px solid transparent;}
.ii:active{cursor:grabbing;}
.ii.dragging{opacity:0.35;}
.ii.drag-over{border-color:var(--teal2);}
.ii-l{display:flex;align-items:center;gap:8px;}
.dh{color:var(--muted);font-size:0.82rem;cursor:grab;}
.iis{font-size:0.67rem;color:var(--muted);margin-top:1px;}
.rmbt{background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.88rem;transition:color 0.15s;}
.rmbt:hover{color:var(--rose2);}
.em{text-align:center;padding:18px 0;font-size:0.79rem;color:var(--muted);}
.finbt{width:100%;margin-top:12px;background:linear-gradient(135deg,var(--vi),var(--blue2));color:white;border:none;border-radius:60px;padding:13px;font-family:'Syne',sans-serif;font-weight:600;font-size:0.88rem;cursor:pointer;transition:all 0.2s;letter-spacing:0.3px;}
.finbt:hover:not(:disabled){filter:brightness(1.1);}
.finbt:disabled{opacity:0.28;cursor:not-allowed;}

/* ITINERARY PAGE */
.ih{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:14px;}
.imt{font-family:'Instrument Serif',serif;font-size:clamp(1.9rem,4.5vw,2.9rem);line-height:1.1;font-style:italic;}
.imt em{color:var(--rose2);}
.iml{color:var(--muted3);font-size:0.84rem;margin-top:8px;}
.iac{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.obt{background:transparent;border:1.5px solid var(--border3);color:var(--cream);border-radius:60px;padding:9px 20px;font-size:0.83rem;cursor:pointer;transition:all 0.2s;}
.obt:hover{background:var(--surf);}
.dbt{background:var(--surf2);color:var(--cream);border:1px solid var(--border2);border-radius:60px;padding:9px 20px;font-size:0.83rem;cursor:pointer;transition:all 0.2s;}
.dbt:hover{border-color:var(--teal2);color:var(--teal2);}
.aib{display:inline-flex;align-items:center;gap:5px;background:rgba(26,170,142,0.1);color:var(--teal2);border:1px solid rgba(26,170,142,0.2);border-radius:20px;padding:4px 10px;font-size:0.7rem;font-weight:600;margin-top:8px;}

/* COST SUMMARY */
.cost-box{background:var(--surf);border:1px solid rgba(212,146,10,0.25);border-radius:var(--r);padding:20px 22px;margin-bottom:30px;border-left:3px solid var(--amber2);}
.cost-ttl{font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--amber2);margin-bottom:12px;}
.cost-rows{display:flex;flex-direction:column;gap:5px;}
.cost-row{display:flex;justify-content:space-between;font-size:0.84rem;}
.cost-lbl{color:var(--muted3);}
.cost-val{font-weight:500;}
.cost-total{display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--border2);font-size:0.95rem;font-weight:600;}
.cost-total-val{font-family:'Instrument Serif',serif;font-size:1.25rem;color:var(--amber2);}

/* TIMELINE */
.tl{display:flex;flex-direction:column;}
.tlb{display:grid;grid-template-columns:84px 1fr;gap:0 16px;}
.ttc{text-align:right;padding-top:17px;position:relative;}
.ttime{font-size:0.78rem;font-weight:500;color:var(--rose2);white-space:nowrap;cursor:pointer;border-bottom:1px dashed rgba(204,51,85,0.3);display:inline-block;transition:color 0.15s;}
.ttime:hover{color:var(--teal2);}
.tdur{font-size:0.64rem;color:var(--muted);margin-top:1px;}
.tline{position:absolute;right:-9px;top:22px;bottom:-22px;width:1.5px;background:var(--border2);}
.tdot{position:absolute;right:-15px;top:17px;width:11px;height:11px;border-radius:50%;background:var(--rose2);border:2.5px solid var(--bg);box-shadow:0 0 0 2px var(--rose2);z-index:1;}
.tcc{padding:11px 0 20px;}
.tcard{background:var(--surf);border:1px solid var(--border2);border-radius:var(--r);overflow:hidden;display:flex;transition:border-color 0.2s;}
.tcard:hover{border-color:var(--border3);}
.tcimg{width:108px;min-width:108px;height:112px;overflow:hidden;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:1.8rem;}
.tcimg img{width:100%;height:100%;object-fit:cover;display:block;}
.tcb{padding:13px;flex:1;}
.tctype{font-size:0.62rem;letter-spacing:2px;text-transform:uppercase;color:var(--rose2);margin-bottom:2px;}
.tcname{font-family:'Instrument Serif',serif;font-size:1.05rem;font-style:italic;margin-bottom:4px;}
.tcdesc{font-size:0.79rem;color:var(--muted3);line-height:1.55;}
.tcmeta{font-size:0.73rem;color:var(--amber2);margin-top:7px;display:flex;align-items:center;gap:9px;flex-wrap:wrap;}
.cbadge{background:rgba(212,146,10,0.12);color:var(--amber2);border:1px solid rgba(212,146,10,0.25);border-radius:20px;padding:2px 8px;font-size:0.7rem;font-weight:600;}
.edit-link{font-size:0.69rem;color:var(--teal2);cursor:pointer;opacity:0.7;}
.edit-link:hover{opacity:1;}
.trvl{display:grid;grid-template-columns:84px 1fr;gap:0 16px;}
.trvli{font-size:0.73rem;color:var(--muted3);display:flex;align-items:center;gap:6px;background:rgba(26,170,142,0.05);border-radius:6px;padding:5px 10px;margin:2px 0;}

/* PROFILE MODAL */
.pov{position:fixed;inset:0;background:rgba(7,7,15,0.8);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);}
.pmodal{background:var(--surf);border:1px solid var(--border2);border-radius:var(--r);padding:32px;width:100%;max-width:520px;box-shadow:var(--shl);max-height:90vh;overflow-y:auto;position:relative;}
.pmc{position:absolute;top:12px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--muted);}
.pmc:hover{color:var(--cream);}
.pm-hdr{display:flex;align-items:center;gap:14px;margin-bottom:24px;}
.pm-av{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--vi),var(--teal));display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;}
.pm-name{font-family:'Instrument Serif',serif;font-size:1.6rem;font-style:italic;}
.pm-sub{font-size:0.79rem;color:var(--muted3);margin-top:2px;}
.pm-stats{display:flex;gap:10px;margin-bottom:22px;}
.pms{background:var(--surf2);border-radius:var(--rs);padding:13px 16px;flex:1;text-align:center;border:1px solid var(--border);}
.pms-n{font-family:'Instrument Serif',serif;font-size:1.7rem;color:var(--amber2);}
.pms-l{font-size:0.7rem;color:var(--muted);margin-top:1px;}
.pm-sec{font-family:'Syne',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
.pm-map{width:100%;height:200px;border-radius:var(--rs);overflow:hidden;margin-bottom:18px;border:1px solid var(--border2);}
.pm-map iframe{width:100%;height:100%;border:none;}
.pm-trips{display:flex;flex-direction:column;gap:7px;max-height:260px;overflow-y:auto;}
.pm-trip{background:var(--surf2);border-radius:var(--rs);padding:11px 13px;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--border);}
.pm-trip-city{font-family:'Instrument Serif',serif;font-size:0.95rem;font-style:italic;}
.pm-trip-meta{font-size:0.72rem;color:var(--muted3);margin-top:1px;}
.pm-trip-stops{font-size:0.75rem;color:var(--teal2);font-weight:600;}
.pm-empty{color:var(--muted);text-align:center;padding:20px;font-size:0.85rem;}
.pm-btns{display:flex;gap:9px;margin-top:18px;}
.pm-logout{flex:1;padding:10px;background:var(--surf2);border:1px solid var(--border2);border-radius:60px;font-size:0.84rem;cursor:pointer;color:var(--muted3);transition:all 0.2s;}
.pm-logout:hover{color:var(--rose2);border-color:rgba(204,51,85,0.3);}
.pm-switch{flex:1;padding:10px;background:var(--surf2);border:1px solid var(--border2);border-radius:60px;font-size:0.84rem;cursor:pointer;color:var(--muted3);transition:all 0.2s;}
.pm-switch:hover{color:var(--teal2);border-color:rgba(26,170,142,0.3);}

/* USERNAME SETUP */
.usetup{background:var(--surf);border:1px solid var(--border2);border-radius:var(--r);padding:36px;width:100%;max-width:380px;box-shadow:var(--shl);}
.ust{font-family:'Instrument Serif',serif;font-size:1.8rem;font-style:italic;margin-bottom:5px;}
.uss{color:var(--muted3);font-size:0.85rem;margin-bottom:22px;line-height:1.6;}
.uinp{width:100%;padding:12px 15px;border:1.5px solid var(--border2);border-radius:var(--rs);font-family:'Inter',sans-serif;font-size:0.95rem;background:var(--bg2);color:var(--cream);outline:none;transition:border-color 0.2s;margin-bottom:12px;}
.uinp:focus{border-color:var(--teal2);}
.uinp::placeholder{color:var(--muted);}
.ubf{width:100%;padding:13px;background:linear-gradient(135deg,var(--vi),var(--blue2));color:white;border:none;border-radius:60px;font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.3px;}
.ubf:hover{filter:brightness(1.1);}
.user-list{display:flex;flex-direction:column;gap:7px;margin-top:16px;}
.user-item{display:flex;align-items:center;gap:11px;background:var(--surf2);border:1px solid var(--border);border-radius:var(--rs);padding:10px 13px;cursor:pointer;transition:all 0.2s;}
.user-item:hover{border-color:var(--teal2);}
.user-item-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--vi),var(--teal));display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;flex-shrink:0;}
.user-item-name{font-weight:500;font-size:0.87rem;}
.user-item-meta{font-size:0.71rem;color:var(--muted);}
.user-item-del{background:none;border:none;color:var(--muted);cursor:pointer;margin-left:auto;font-size:0.85rem;padding:4px;}
.user-item-del:hover{color:var(--rose2);}
.divider-or{display:flex;align-items:center;gap:10px;margin:16px 0;color:var(--muted);font-size:0.78rem;}
.divider-or::before,.divider-or::after{content:'';flex:1;height:1px;background:var(--border2);}

/* TIME EDIT MODAL */
.teov{position:fixed;inset:0;background:rgba(7,7,15,0.7);z-index:400;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);}
.temod{background:var(--surf);border:1px solid var(--border2);border-radius:var(--r);padding:26px;width:100%;max-width:310px;box-shadow:var(--shl);}
.temt{font-family:'Instrument Serif',serif;font-size:1.35rem;font-style:italic;margin-bottom:4px;}
.tems{color:var(--muted3);font-size:0.8rem;margin-bottom:16px;}
.temr{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
.teml{font-size:0.7rem;letter-spacing:1px;text-transform:uppercase;color:var(--muted);}
.temi{padding:9px 13px;border:1.5px solid var(--border2);border-radius:var(--rs);font-family:'Inter',sans-serif;font-size:0.92rem;background:var(--bg2);color:var(--cream);outline:none;width:100%;transition:border-color 0.2s;}
.temi:focus{border-color:var(--teal2);}
.tembtns{display:flex;gap:9px;margin-top:14px;}
.tem-c{flex:1;padding:9px;background:var(--surf2);border:1px solid var(--border2);border-radius:60px;font-size:0.83rem;cursor:pointer;color:var(--muted3);}
.tem-s{flex:1;padding:9px;background:linear-gradient(135deg,var(--vi),var(--blue2));color:white;border:none;border-radius:60px;font-size:0.83rem;font-weight:600;cursor:pointer;}

/* LOADING */
.ls{position:fixed;inset:0;background:rgba(7,7,15,0.92);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;backdrop-filter:blur(8px);}
.spin{width:36px;height:36px;border:2.5px solid rgba(255,255,255,0.08);border-top-color:var(--amber2);border-radius:50%;animation:spin 0.7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.lt{color:var(--muted3);font-size:0.88rem;font-weight:300;}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--surf2);border:1px solid var(--border2);color:var(--cream);padding:9px 20px;border-radius:60px;font-size:0.83rem;z-index:600;transition:opacity 0.3s;pointer-events:none;white-space:nowrap;}
@media print{.np{display:none !important;}}
`;

const BUDGETS=[
  {id:"free",tier:"$",label:"Free & Budget",range:"$0–$25/person",desc:"Parks, free museums, street food & local gems.",color:"#1aaa8e",avg:12},
  {id:"mid",tier:"$$",label:"Mid-Range",range:"$25–$75/person",desc:"Casual dining, paid attractions & comfortable experiences.",color:"#d4920a",avg:45},
  {id:"upscale",tier:"$$$",label:"Upscale",range:"$75–$150/person",desc:"Nicer restaurants, private tours & premium venues.",color:"#9b7de0",avg:110},
  {id:"luxury",tier:"$$$$",label:"Luxury",range:"$150+/person",desc:"Fine dining, exclusive experiences & VIP access.",color:"#cc3355",avg:220},
];

const TRANSPORT=[
  {id:"walking",icon:"🚶",name:"Walking",travelMin:18,label:"~18 min avg"},
  {id:"transit",icon:"🚌",name:"Transit",travelMin:12,label:"~12 min avg"},
  {id:"driving",icon:"🚗",name:"Driving",travelMin:8,label:"~8 min avg"},
  {id:"cycling",icon:"🚴",name:"Cycling",travelMin:14,label:"~14 min avg"},
  {id:"rideshare",icon:"🚕",name:"Rideshare",travelMin:10,label:"~10 min avg"},
];

const PREFS=[
  {val:"sightseeing",icon:"🏛️",name:"Sightseeing",desc:"Landmarks & historic sites"},
  {val:"restaurants",icon:"🍽️",name:"Dining",desc:"Local favorites & top-rated"},
  {val:"museums",icon:"🎨",name:"Museums",desc:"Art, history & science"},
  {val:"hiking",icon:"🥾",name:"Nature & Hiking",desc:"Trails, parks & outdoors"},
  {val:"shopping",icon:"🛍️",name:"Shopping",desc:"Markets & boutiques"},
  {val:"entertainment",icon:"🎭",name:"Entertainment",desc:"Shows & nightlife"},
  {val:"cafes",icon:"☕",name:"Cafés",desc:"Coffee & cozy spots"},
  {val:"sports",icon:"⚽",name:"Sports",desc:"Active experiences"},
];

const CITIES=[
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

const MOCK=[
  {id:1,name:"Central Park",type:"Park",rating:4.8,reviews:42300,emoji:"🌳",desc:"An iconic 843-acre urban oasis with meadows, lakes, and world-famous skyline views. Perfect for a morning stroll or lazy afternoon.",duration:90,lat:40.7851,lng:-73.9683,priceLevel:0},
  {id:2,name:"Metropolitan Museum of Art",type:"Museum",rating:4.9,reviews:31000,emoji:"🎨",desc:"One of the world's great art museums, spanning 5,000 years of civilizations. Home to over 2 million remarkable works.",duration:120,lat:40.7794,lng:-73.9632,priceLevel:2},
  {id:3,name:"Brooklyn Bridge",type:"Landmark",rating:4.8,reviews:55000,emoji:"🌉",desc:"Walk this iconic 1883 suspension bridge connecting Manhattan and Brooklyn for breathtaking city skyline views.",duration:45,lat:40.7061,lng:-73.9969,priceLevel:0},
  {id:4,name:"Katz's Delicatessen",type:"Restaurant",rating:4.5,reviews:12000,emoji:"🥪",desc:"A legendary NYC institution since 1888 — famous for its towering pastrami sandwiches that defined New York deli culture.",duration:60,lat:40.7223,lng:-73.9874,priceLevel:2},
  {id:5,name:"Times Square",type:"Landmark",rating:4.5,reviews:98000,emoji:"🌆",desc:"The neon-lit, electric heart of Manhattan — overwhelming, loud, and utterly unforgettable at any hour.",duration:45,lat:40.758,lng:-73.9855,priceLevel:0},
  {id:6,name:"The High Line",type:"Park",rating:4.7,reviews:29000,emoji:"🌿",desc:"A 1.45-mile elevated park on a former freight rail line with curated gardens and stunning Hudson River views.",duration:75,lat:40.748,lng:-74.0048,priceLevel:0},
  {id:7,name:"Museum of Modern Art",type:"Museum",rating:4.7,reviews:22000,emoji:"🖼️",desc:"MoMA houses an extraordinary collection from Picasso's Les Demoiselles to Warhol's Campbell's Soup Cans.",duration:120,lat:40.7614,lng:-73.9776,priceLevel:2},
  {id:8,name:"Smorgasburg",type:"Food Market",rating:4.6,reviews:8900,emoji:"🍜",desc:"Brooklyn's beloved open-air food market with 100+ independent local vendors — a paradise for food lovers.",duration:90,lat:40.7223,lng:-73.9592,priceLevel:1},
];

function purl(ref){if(!ref||!GOOGLE_KEY||GOOGLE_KEY==="PASTE_YOUR_GOOGLE_KEY_HERE")return null;return`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${GOOGLE_KEY}`;}
function ft(h,m){const ap=h>=12?"PM":"AM";const hh=h>12?h-12:h===0?12:h;return`${hh}:${String(m).padStart(2,"0")} ${ap}`;}
function useToast(){const[msg,setMsg]=useState("");const[vis,setVis]=useState(false);const t=useRef();const show=m=>{setMsg(m);setVis(true);clearTimeout(t.current);t.current=setTimeout(()=>setVis(false),2500);};return{msg,vis,show};}

// ── AI COST ESTIMATION ─────────────────────────────────────────
async function fetchAICosts(places, city, budget) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "PASTE_YOUR_ANTHROPIC_KEY_HERE") return null;
  const list = places.map((p,i) => `${i+1}. ${p.name} (${p.type}, price_level: ${p.priceLevel})`).join("\n");
  const blabel = budget ? BUDGETS.find(b=>b.id===budget)?.label : "mid-range";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:800,
        messages:[{role:"user",content:`Estimate realistic per-person costs in USD for visiting each place in ${city} for a ${blabel} traveler. Consider entry fees, typical spending, meals if restaurant. Be specific and realistic — not all the same price.\n${list}\nRespond ONLY as JSON: [{"id":1,"cost":25,"note":"Entry fee"}]\nNo markdown.`}]
      })
    });
    const d = await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  } catch { return null; }
}

// ── AI DESCRIPTIONS ────────────────────────────────────────────
async function fetchAIDescs(places, city, budget, prefs) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "PASTE_YOUR_ANTHROPIC_KEY_HERE") return null;
  const list = places.map((p,i)=>`${i+1}. ${p.name} (${p.type})`).join("\n");
  const blabel = budget ? BUDGETS.find(b=>b.id===budget)?.label : "moderate";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1200,
        messages:[{role:"user",content:`Write vivid, specific 2-sentence travel descriptions for each place in ${city}. Budget: ${blabel}. Interests: ${prefs||"general"}. Be specific about what makes each place uniquely worth visiting.\n${list}\nRespond ONLY as JSON: [{"id":1,"desc":"..."}]\nNo markdown.`}]
      })
    });
    const d = await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  } catch { return null; }
}

// ── AI TRAVEL TIMES ────────────────────────────────────────────
async function fetchAITravelTimes(itin, transport) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "PASTE_YOUR_ANTHROPIC_KEY_HERE") return null;
  if (itin.length < 2) return null;
  const pairs = itin.slice(0,-1).map((p,i)=>`${i+1}. ${p.name} → ${itin[i+1].name}`).join("\n");
  const mode = TRANSPORT.find(t=>t.id===transport)?.name || "walking";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:400,
        messages:[{role:"user",content:`Estimate realistic travel times in minutes between these location pairs by ${mode}. Consider actual distances — they are NOT all the same.\n${pairs}\nRespond ONLY as JSON: [{"index":1,"minutes":12}]\nNo markdown.`}]
      })
    });
    const d = await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  } catch { return null; }
}

function exportPDF(city, itin, budget, transport, startTime, descMap, costMap) {
  const{jsPDF}=window.jspdf||{};
  if(!jsPDF){alert("jsPDF not loaded.");return;}
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();
  doc.setFillColor(7,7,15);doc.rect(0,0,W,36,"F");
  doc.setFont("times","italic");doc.setFontSize(22);doc.setTextColor(245,242,238);doc.text("Mapistry",14,20);
  doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(160,160,180);doc.text("Your personal travel planner",14,28);
  doc.setFont("times","bold");doc.setFontSize(18);doc.setTextColor(7,7,15);doc.text(`A Day in ${city}`,14,50);
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=transport?TRANSPORT.find(t=>t.id===transport)?.name:null;
  const meta=[blabel,tlabel].filter(Boolean).join(" · ");
  if(meta){doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(107,114,128);doc.text(meta,14,58);}
  const tr=TRANSPORT.find(t=>t.id===transport)||TRANSPORT[0];
  let y=66;const[sh,sm]=startTime.split(":").map(Number);let h=sh,m=sm;
  itin.forEach((p,i)=>{
    if(y>250){doc.addPage();y=20;}
    const ts=ft(h,m),eH=h+Math.floor((m+p.duration)/60),eM=(m+p.duration)%60,te=ft(eH,eM);
    doc.setFillColor(204,51,85);doc.roundedRect(14,y-4,36,8,4,4,"F");
    doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(255,255,255);doc.text(`${ts}–${te}`,16,y+1.5);
    const cost=costMap?.[p.id];
    if(cost!=null){doc.setFillColor(212,146,10);doc.roundedRect(52,y-4,20,8,4,4,"F");doc.setTextColor(7,7,15);doc.text(`$${cost}`,54,y+1.5);}
    y+=10;doc.setFont("times","bold");doc.setFontSize(13);doc.setTextColor(7,7,15);doc.text(p.name,14,y);y+=6;
    doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(107,114,128);doc.text(`${p.type} · ★ ${p.rating} · ~${p.duration} min`,14,y);y+=6;
    const desc=descMap?.[p.id]||p.desc;
    doc.setFontSize(9);doc.setTextColor(50,50,60);const lines=doc.splitTextToSize(desc,W-28);doc.text(lines,14,y);y+=lines.length*5+4;
    if(i<itin.length-1){const tv=tr.travelMin;doc.setFont("helvetica","italic");doc.setFontSize(8);doc.setTextColor(26,170,142);doc.text(`  ~${tv} min ${tr.name.toLowerCase()} to next stop`,14,y);y+=7;h=eH+Math.floor((eM+tv)/60);m=(eM+tv)%60;}
    doc.setDrawColor(220,220,230);doc.line(14,y,W-14,y);y+=7;
  });
  const pg=doc.internal.getNumberOfPages();
  for(let i=1;i<=pg;i++){doc.setPage(i);doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(107,114,128);doc.text(`Mapistry · Page ${i} of ${pg}`,W/2,290,{align:"center"});}
  doc.save(`mapistry-${city.replace(/\s+/g,"-").toLowerCase()}.pdf`);
}

// ── STORAGE HELPERS — per-user isolated storage ──────────────
const USERS_KEY = "mapistry_users";
const ACTIVE_KEY = "mapistry_active_user";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)||"{}"); } catch { return {}; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function loadActiveUser() { return localStorage.getItem(ACTIVE_KEY)||null; }
function saveActiveUser(name) { localStorage.setItem(ACTIVE_KEY, name); }

function getUserHistory(username) {
  const users = loadUsers();
  return users[username]?.history || [];
}
function saveUserHistory(username, history) {
  const users = loadUsers();
  if (!users[username]) users[username] = { created: new Date().toLocaleDateString() };
  users[username].history = history;
  saveUsers(users);
}
function getUserCreated(username) {
  const users = loadUsers();
  return users[username]?.created || "";
}

export default function App() {
  const[step,setStep]=useState(1);
  const[city,setCity]=useState("");
  const[cin,setCin]=useState("");
  const[sugg,setSugg]=useState([]);
  const[showS,setShowS]=useState(false);
  const[prefs,setPrefs]=useState(new Set());
  const[cprefs,setCprefs]=useState([]);
  const[cpinput,setCpinput]=useState("");
  const[budget,setBudget]=useState(null);
  const[transport,setTransport]=useState("walking");
  const[conds,setConds]=useState({});
  const[startTime,setStartTime]=useState("09:00");
  const[endTime,setEndTime]=useState("21:00");
  const[places,setPlaces]=useState(MOCK);
  const[allPlaces,setAllPlaces]=useState(MOCK);
  const[visibleCount,setVisibleCount]=useState(8);
  const[mapQuery,setMapQuery]=useState("");
  const[focusedId,setFocusedId]=useState(null);
  const[itin,setItin]=useState([]);
  const[descMap,setDescMap]=useState(null);
  const[costMap,setCostMap]=useState(null);
  const[travelTimes,setTravelTimes]=useState(null);
  const[aiUsed,setAiUsed]=useState(false);
  const[loading,setLoading]=useState(false);
  const[lmsg,setLmsg]=useState("");
  const[dragIdx,setDragIdx]=useState(null);
  const[editingPlace,setEditingPlace]=useState(null);
  const[editTimeVal,setEditTimeVal]=useState("");
  const[editDurVal,setEditDurVal]=useState(60);
  // accounts
  const[activeUser,setActiveUser]=useState(null);
  const[hist,setHist]=useState([]);
  const[showProfile,setShowProfile]=useState(false);
  const[showUserSetup,setShowUserSetup]=useState(false);
  const[usernameInput,setUsernameInput]=useState("");
  const[allUsers,setAllUsers]=useState({});
  const toast=useToast();
  const sref=useRef();
  const nextToken=useRef(null);

  // Load state on mount
  useEffect(()=>{
    const users=loadUsers();
    setAllUsers(users);
    const active=loadActiveUser();
    if(active&&users[active]){
      setActiveUser(active);
      setHist(users[active]?.history||[]);
    }
  },[]);

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

  // ── ACCOUNT FUNCTIONS ──────────────────────────────────────
  function createUser(){
    const name=usernameInput.trim();
    if(!name){toast.show("Please enter a name!");return;}
    const users=loadUsers();
    if(!users[name]) users[name]={created:new Date().toLocaleDateString(),history:[]};
    saveUsers(users);
    saveActiveUser(name);
    setAllUsers({...users});
    setActiveUser(name);
    setHist(users[name].history||[]);
    setShowUserSetup(false);
    setUsernameInput("");
    toast.show(`Welcome, ${name}! 👋`);
  }

  function switchUser(name){
    saveActiveUser(name);
    setActiveUser(name);
    const h=getUserHistory(name);
    setHist(h);
    setShowUserSetup(false);
    setShowProfile(false);
    toast.show(`Switched to ${name}`);
  }

  function deleteUser(name, e){
    e.stopPropagation();
    const users=loadUsers();
    delete users[name];
    saveUsers(users);
    setAllUsers({...users});
    if(activeUser===name){
      setActiveUser(null);setHist([]);
      localStorage.removeItem(ACTIVE_KEY);
    }
    toast.show(`Deleted ${name}`);
  }

  function logout(){
    setActiveUser(null);setHist([]);
    localStorage.removeItem(ACTIVE_KEY);
    setShowProfile(false);
    toast.show("Logged out");
  }

  function saveTrip(tripCity,tripItin,tripPlaces){
    if(!activeUser)return;
    const entry={
      id:Date.now(),city:tripCity,
      lat:tripPlaces[0]?.lat||0,lng:tripPlaces[0]?.lng||0,
      date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),
      stops:tripItin.length,
      img:tripItin[0]?.photoRef?purl(tripItin[0].photoRef):null,
      emoji:tripItin[0]?.emoji||"📍",
      places:tripItin.map(p=>p.name)
    };
    const newHist=[entry,...hist].slice(0,30);
    setHist(newHist);
    saveUserHistory(activeUser,newHist);
  }

  function addCpref(){const v=cpinput.trim();if(!v)return;if(cprefs.includes(v)){toast.show("Already added!");return;}setCprefs(c=>[...c,v]);setCpinput("");}

  // ── FETCH PLACES ──────────────────────────────────────────
  async function doFetch(c, token=null){
    try{
      const allP=[...prefs,...cprefs];
      const q=allP.length>0?`${allP.join(" and ")} in ${c}`:`top attractions in ${c}`;
      const url=token?`/api/places?query=${encodeURIComponent(q)}&pagetoken=${token}`:`/api/places?query=${encodeURIComponent(q)}`;
      const res=await fetch(url);
      const data=await res.json();
      if(data.results?.length>0){
        return{
          places:data.results.map((p,i)=>({
            id:Date.now()+i,name:p.name,
            type:(p.types?.[0]||"attraction").replace(/_/g," "),
            rating:p.rating||4.0,reviews:p.user_ratings_total||0,
            emoji:"📍",
            desc:p.editorial_summary?.overview||p.formatted_address||`A notable spot in ${c}.`,
            duration:60,lat:p.geometry.location.lat,lng:p.geometry.location.lng,
            photoRef:p.photos?.[0]?.photo_reference||null,
            priceLevel:p.price_level??1,
          })),
          nextToken:data.next_page_token||null
        };
      }
    }catch(e){console.log(e);}
    return{places:MOCK,nextToken:null};
  }

  async function goToResults(){
    const c=cin.trim();if(!c){toast.show("Please enter a city!");return;}
    setCity(c);setMapQuery(c);setLmsg(`Finding the best spots in ${c}…`);setLoading(true);
    const{places:p,nextToken:nt}=await doFetch(c);
    nextToken.current=nt;setAllPlaces(p);setPlaces(p);setVisibleCount(8);
    setItin([]);setFocusedId(null);setLoading(false);setStep(3);
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

  // Click card → show on map (preview only, doesn't persist pin)
  function focusPlace(p){
    setFocusedId(p.id);
    setMapQuery(`${p.name}, ${city}`);
  }

  // Build map query showing ALL pinned (added) places
  function getMapSrc(){
    if(itin.length>0){
      // show all added places as a search query
      const q=itin.map(p=>`${p.name} ${city}`).join("|");
      return`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_KEY}&q=${encodeURIComponent(itin.map(p=>p.name).join(" OR ")+" in "+city)}&zoom=13`;
    }
    if(mapQuery){
      return`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(mapQuery)}&zoom=15`;
    }
    return`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(city)}&zoom=13`;
  }

  async function goToItinerary(){
    if(itin.length===0){toast.show("Add at least one place first!");return;}
    setLmsg("Crafting your perfect day…");setLoading(true);
    let dm=null, cm=null, tt=null;
    if(ANTHROPIC_KEY&&ANTHROPIC_KEY!=="PASTE_YOUR_ANTHROPIC_KEY_HERE"){
      setLmsg("✨ AI is personalizing your itinerary…");
      const allP=[...prefs,...cprefs].join(", ");
      const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
      // Run all three AI calls in parallel
      const[descRes,costRes,ttRes]=await Promise.all([
        fetchAIDescs(itin,city,budget,allP),
        fetchAICosts(itin,city,budget),
        fetchAITravelTimes(itin,transport),
      ]);
      if(descRes){dm={};descRes.forEach(x=>{dm[x.id]=x.desc;});setAiUsed(true);}
      if(costRes){cm={};costRes.forEach(x=>{cm[x.id]=x.cost;});}
      if(ttRes){tt={};ttRes.forEach(x=>{tt[x.index]=x.minutes;});}
    }
    setDescMap(dm);setCostMap(cm);setTravelTimes(tt);
    await new Promise(r=>setTimeout(r,300));
    setLoading(false);setStep(4);
    saveTrip(city,itin,places);
  }

  // ── DRAG & DROP ──────────────────────────────────────────
  function onDragStart(i){setDragIdx(i);}
  function onDragOver(e,i){e.preventDefault();if(dragIdx===null||dragIdx===i)return;const a=[...itin];const[it]=a.splice(dragIdx,1);a.splice(i,0,it);setItin(a);setDragIdx(i);}
  function onDragEnd(){setDragIdx(null);}

  // ── TIME EDITING ─────────────────────────────────────────
  function openEdit(p){setEditingPlace(p);setEditTimeVal(p.customTime||"");setEditDurVal(p.duration||60);}
  function saveEdit(){setItin(it=>it.map(p=>p.id===editingPlace.id?{...p,customTime:editTimeVal||undefined,duration:editDurVal}:p));setEditingPlace(null);toast.show("Updated!");}

  // ── COMPUTE TIMELINE ─────────────────────────────────────
  function computeTimes(){
    const[sh,sm]=startTime.split(":").map(Number);
    let h=sh,m=sm;
    const tr=TRANSPORT.find(t=>t.id===transport)||TRANSPORT[0];
    return itin.map((place,i)=>{
      const travelMin=travelTimes?.[i+1]||tr.travelMin;
      if(place.customTime){
        const[ch,cm2]=place.customTime.split(":").map(Number);
        const eH=ch+Math.floor((cm2+place.duration)/60),eM=(cm2+place.duration)%60;
        if(i<itin.length-1){h=eH+Math.floor((eM+travelMin)/60);m=(eM+travelMin)%60;}
        return{start:ft(ch,cm2),end:ft(eH,eM),travel:travelMin,mode:tr};
      }
      const ts=ft(h,m);
      const eH=h+Math.floor((m+place.duration)/60),eM=(m+place.duration)%60;
      if(i<itin.length-1){h=eH+Math.floor((eM+travelMin)/60);m=(eM+travelMin)%60;}
      return{start:ts,end:ft(eH,eM),travel:travelMin,mode:tr};
    });
  }

  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=transport?TRANSPORT.find(t=>t.id===transport)?.name:null;
  const times=step===4?computeTimes():[];
  const totalCost=costMap?itin.reduce((s,p)=>s+(costMap[p.id]??0),0):null;
  const visiblePlaces=places.slice(0,visibleCount);
  const initials=activeUser?activeUser.slice(0,2).toUpperCase():"";

  // visited cities map — markers for each unique city
  const visitedCities=[...new Set(hist.map(h=>h.city))];
  const profileMapSrc=visitedCities.length>0
    ?`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_KEY}&q=${encodeURIComponent(visitedCities.join("|"))}&zoom=2`
    :`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=world&zoom=2`;

  const knownUsers=Object.keys(loadUsers());

  return(
    <>
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className="nav np">
        <div className="nav-l">
          <div className="logo" onClick={()=>{setStep(1);setItin([]);setCin("");setCity("");}}>
            Mapit<b>stry</b>
          </div>
          {step>1&&<button className="back" onClick={()=>setStep(step-1)}>← Back</button>}
        </div>
        <div className="nav-r">
          {city&&step>1&&<div className="nav-city">📍 {city}</div>}
          {step>1&&<div className="prog">{[1,2,3,4].map(s=><div key={s} className={`pd ${s===step?"on":s<step?"done":""}`}/>)}</div>}
          {activeUser
            ?<button className="ubtn" onClick={()=>setShowProfile(true)}><div className="uav">{initials}</div>{activeUser}</button>
            :<button className="ubtn" onClick={()=>setShowUserSetup(true)}>👤 Sign In</button>
          }
        </div>
      </nav>

      {/* ── HERO (STEP 1) ── */}
      {step===1&&(
        <div className="hero">
          <div className="hero-bg"/>
          <div className="hero-orb1"/><div className="hero-orb2"/><div className="hero-orb3"/>
          <div className="hero-grid-lines"/>
          <div className="hero-left">
            <div className="hero-badge"><div className="badge-dot"/>Your personal travel planner</div>
            <h1 className="hero-h1">
              <span>Plan your</span>
              <em>perfect day,</em>
              <span>anywhere.</span>
            </h1>
            <p className="hero-sub">Enter any city or town — get a real, personalized itinerary with actual photos, AI cost estimates, and hour-by-hour scheduling.</p>
            <div className="hero-feats">
              {["Real photos from Google Places","AI-written descriptions & cost estimates","Accurate travel times between stops","Hour-by-hour scheduling with your transport"].map(f=>(
                <div key={f} className="hfeat"><div className="hfeat-icon">✓</div>{f}</div>
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
                <button className="sbtn" onClick={()=>{if(cin.trim()){setShowS(false);setStep(2);}else toast.show("Please enter a city!")}}>Explore →</button>
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
          </div>
          <div className="hero-right">
            <div className="dest-stack">
              {[
                {emo:"🗼",name:"Eiffel Tower",meta:"Paris · ★ 4.7 · Landmark",badge:"Free entry",badgeClass:"green"},
                {emo:"🏯",name:"Fushimi Inari",meta:"Kyoto · ★ 4.9 · Temple",badge:"~2 hrs",badgeClass:"amber"},
                {emo:"🎨",name:"Uffizi Gallery",meta:"Florence · ★ 4.6 · Museum",badge:"~$20",badgeClass:"rose"},
              ].map(d=>(
                <div key={d.name} className="dest-card">
                  <div className="dest-emo">{d.emo}</div>
                  <div className="dest-info">
                    <div className="dest-name">{d.name}</div>
                    <div className="dest-meta">{d.meta}</div>
                  </div>
                  <div className={`dest-badge ${d.badgeClass}`}>{d.badge}</div>
                </div>
              ))}
            </div>
            <div className="hero-micro">
              <div className="micro-stat"><div className="micro-n">50+</div><div className="micro-l">Cities</div></div>
              <div className="micro-stat"><div className="micro-n">AI</div><div className="micro-l">Powered</div></div>
              <div className="micro-stat"><div className="micro-n">Free</div><div className="micro-l">Always</div></div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: PREFERENCES ── */}
      {step===2&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 2 of 4</div>
            <h2 className="st">What's your vibe in <span>{city}</span>?</h2>
            <p className="ss">Pick your interests, transport, budget and trip times. The more you pick, the better your results.</p>
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

          <div className="section-label">Getting Around</div>
          <div className="transport-grid">
            {TRANSPORT.map(t=>(
              <div key={t.id} className={`tc ${transport===t.id?"sel":""}`} onClick={()=>setTransport(t.id)}>
                <div className="tc-icon">{t.icon}</div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-time">{t.label}</div>
              </div>
            ))}
          </div>

          <div className="section-label" style={{marginTop:4}}>Trip Times</div>
          <div className="time-row">
            <div className="tg"><label>Start Time</label><input type="time" className="tinput" value={startTime} onChange={e=>setStartTime(e.target.value)}/></div>
            <div className="tg"><label>End Time</label><input type="time" className="tinput" value={endTime} onChange={e=>setEndTime(e.target.value)}/></div>
            <div style={{display:"flex",alignItems:"flex-end",paddingBottom:4,color:"var(--muted)",fontSize:"0.8rem"}}>Schedule fits between these times</div>
          </div>

          <div className="section-label">Budget (per person)</div>
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
          <div className="conds">
            {[
              {g:"group",l:"Traveling with",o:["Solo","Couple","Family & Kids","Friends"]},
              {g:"day",l:"Day Type",o:["Full day","Half day","Evening only"]},
              {g:"pace",l:"Pace",o:["Relaxed","Balanced","Packed"]},
            ].map(({g,l,o})=>(
              <div key={g} className="cg">
                <label>{l}</label>
                <div className="pills">{o.map(v=><div key={v} className={`pill ${conds[g]===v?"sel":""}`} onClick={()=>setConds(c=>({...c,[g]:c[g]===v?undefined:v}))}>{v}</div>)}</div>
              </div>
            ))}
          </div>
          <div className="brow"><button className="gobt" onClick={goToResults}>Find Places →</button></div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ── */}
      {step===3&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 3 of 4</div>
            <h2 className="st">Best spots in <span>{city}</span></h2>
            <p className="ss">Click a card to preview it on the map. Hit Add to pin it permanently and build your itinerary.</p>
          </div>
          <div className="rl">
            <div>
              <div className="map-wrap">
                <div className="mapbox">
                  <iframe key={mapQuery+itin.length} title="map"
                    src={getMapSrc()}
                    allowFullScreen/>
                </div>
                <div className="map-hint">
                  {itin.length>0
                    ?<>📍 Showing all {itin.length} pinned location{itin.length!==1?"s":""} · Click a card to preview others</>
                    :<>Click any card to see it on the map</>
                  }
                </div>
              </div>
              <div className="plgrid">
                {visiblePlaces.map(p=>{
                  const added=!!itin.find(x=>x.id===p.id);
                  const focused=focusedId===p.id;
                  const img=p.photoRef?purl(p.photoRef):null;
                  const pb=p.priceLevel===0?"Free":p.priceLevel===1?"$":p.priceLevel===2?"$$":p.priceLevel===3?"$$$":null;
                  return(
                    <div key={p.id} className={`plcard ${added?"added":""} ${focused&&!added?"focused":""}`}
                      onClick={()=>focusPlace(p)}>
                      <div className="plimg">
                        {img?<img src={img} alt={p.name} onError={e=>{e.target.parentElement.innerHTML=p.emoji;}} loading="lazy"/>:<span>{p.emoji}</span>}
                        {pb&&<div className="pbadge">{pb}</div>}
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
                        <button className={`addbt ${added?"added":""}`} onClick={e=>{
                          e.stopPropagation();
                          setItin(it=>{
                            if(it.find(x=>x.id===p.id)){
                              const updated=it.filter(x=>x.id!==p.id);
                              return updated;
                            }
                            toast.show(`"${p.name}" pinned to map!`);
                            return [...it,p];
                          });
                        }}>{added?"✓ Pinned":"+ Add"}</button>
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
              <div className="sbs">{itin.length} place{itin.length!==1?"s":""} pinned · drag to reorder</div>
              <ul className="il">
                {itin.length===0
                  ?<div className="em">Add places to get started →</div>
                  :itin.map((p,i)=>(
                    <li key={p.id} className={`ii ${dragIdx===i?"dragging":""}`} draggable
                      onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDragEnd={onDragEnd}>
                      <div className="ii-l">
                        <span className="dh">⠿</span>
                        <div><div>{p.emoji} {p.name}</div><div className="iis">{p.type} · ~{p.duration} min</div></div>
                      </div>
                      <button className="rmbt" onClick={()=>setItin(it=>it.filter(x=>x.id!==p.id))}>✕</button>
                    </li>
                  ))
                }
              </ul>
              <button className="finbt" onClick={goToItinerary} disabled={itin.length===0}>✨ Generate Itinerary</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: ITINERARY ── */}
      {step===4&&(
        <div className="page">
          <div className="ih">
            <div>
              <h2 className="imt">Your day in <em>{city}</em></h2>
              <div className="iml">{[blabel,tlabel,conds.group,conds.day].filter(Boolean).join(" · ")}{itin.length>0?` · ${itin.length} stops`:""}</div>
              {aiUsed&&<div className="aib">✦ AI-personalized descriptions, costs & travel times</div>}
            </div>
            <div className="iac np">
              <button className="obt" onClick={()=>setStep(3)}>← Edit Places</button>
              <button className="dbt" onClick={()=>exportPDF(city,itin,budget,transport,startTime,descMap,costMap)}>⬇ Export PDF</button>
            </div>
          </div>
          {totalCost!=null&&(
            <div className="cost-box">
              <div className="cost-ttl">💰 Estimated Trip Cost</div>
              <div className="cost-rows">
                {itin.map(p=>{
                  const c=costMap?.[p.id];
                  return c!=null?(<div key={p.id} className="cost-row"><span className="cost-lbl">{p.name}</span><span className="cost-val">~${c}</span></div>):null;
                })}
              </div>
              <div className="cost-total"><span>Total per person</span><span className="cost-total-val">~${totalCost}</span></div>
            </div>
          )}
          <div className="tl">
            {itin.map((place,i)=>{
              const t=times[i]||{start:"9:00 AM",end:"10:00 AM",travel:15,mode:TRANSPORT[0]};
              const img=place.photoRef?purl(place.photoRef):null;
              const isLast=i===itin.length-1;
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
                            {cost!=null&&<span className="cbadge">~${cost}</span>}
                            <span className="edit-link" onClick={()=>openEdit(place)}>✏️ edit time</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isLast&&(
                    <div className="trvl"><div/>
                      <div className="trvli">{t.mode?.icon||"🚶"} ~{t.travel} min by {t.mode?.name?.toLowerCase()||"foot"} to next stop</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── USER SETUP MODAL ── */}
      {showUserSetup&&(
        <div className="pov" onClick={e=>e.target===e.currentTarget&&setShowUserSetup(false)}>
          <div className="usetup">
            <div className="ust">Your profile</div>
            <div className="uss">Pick a name to save trips and track where you've been. No password needed — everything stays on this device.</div>
            <input className="uinp" placeholder="Enter a username…" value={usernameInput}
              onChange={e=>setUsernameInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&createUser()} autoFocus/>
            <button className="ubf" onClick={createUser}>Create Profile →</button>
            {knownUsers.length>0&&(
              <>
                <div className="divider-or">or switch to existing</div>
                <div className="user-list">
                  {knownUsers.map(name=>(
                    <div key={name} className="user-item" onClick={()=>switchUser(name)}>
                      <div className="user-item-av">{name.slice(0,2).toUpperCase()}</div>
                      <div>
                        <div className="user-item-name">{name}</div>
                        <div className="user-item-meta">{getUserHistory(name).length} trips · since {getUserCreated(name)}</div>
                      </div>
                      <button className="user-item-del" onClick={e=>deleteUser(name,e)}>🗑</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE MODAL ── */}
      {showProfile&&activeUser&&(
        <div className="pov" onClick={e=>e.target===e.currentTarget&&setShowProfile(false)}>
          <div className="pmodal">
            <button className="pmc" onClick={()=>setShowProfile(false)}>✕</button>
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
            {visitedCities.length>0&&(
              <>
                <div className="pm-sec">🌍 Cities Explored</div>
                <div className="pm-map">
                  <iframe key={profileMapSrc} title="visited-map" src={profileMapSrc} allowFullScreen/>
                </div>
              </>
            )}
            <div className="pm-sec">🧳 Past Trips</div>
            {hist.length===0
              ?<div className="pm-empty">No trips yet — go plan one! ✈️</div>
              :<div className="pm-trips">
                {hist.map(h=>(
                  <div key={h.id} className="pm-trip">
                    <div>
                      <div className="pm-trip-city">{h.emoji} {h.city}</div>
                      <div className="pm-trip-meta">{h.date} · {h.places?.slice(0,2).join(", ")}{h.stops>2?` +${h.stops-2} more`:""}</div>
                    </div>
                    <div className="pm-trip-stops">📍 {h.stops}</div>
                  </div>
                ))}
              </div>
            }
            <div className="pm-btns">
              <button className="pm-switch" onClick={()=>{setShowProfile(false);setShowUserSetup(true);}}>Switch User</button>
              <button className="pm-logout" onClick={logout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TIME EDIT MODAL ── */}
      {editingPlace&&(
        <div className="teov" onClick={e=>e.target===e.currentTarget&&setEditingPlace(null)}>
          <div className="temod">
            <div className="temt">Edit Time</div>
            <div className="tems">{editingPlace.name}</div>
            <div className="temr"><div className="teml">Start Time</div><input type="time" className="temi" value={editTimeVal} onChange={e=>setEditTimeVal(e.target.value)}/></div>
            <div className="temr"><div className="teml">Duration (minutes)</div><input type="number" className="temi" value={editDurVal} min={15} max={480} step={15} onChange={e=>setEditDurVal(Number(e.target.value))}/></div>
            <div className="tembtns"><button className="tem-c" onClick={()=>setEditingPlace(null)}>Cancel</button><button className="tem-s" onClick={saveEdit}>Save</button></div>
          </div>
        </div>
      )}

      {loading&&<div className="ls"><div className="spin"/><div className="lt">{lmsg}</div></div>}
      <div className="toast" style={{opacity:toast.vis?1:0}}>{toast.msg}</div>
    </>
  );
}
