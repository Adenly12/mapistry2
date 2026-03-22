import { useState, useEffect, useRef } from "react";
import CONFIG from "./config";

const GOOGLE_KEY = CONFIG.GOOGLE_KEY;
const ANTHROPIC_KEY = CONFIG.ANTHROPIC_KEY;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
:root {
  --night:#0d1117;--night2:#161b22;
  --cream:#faf8f4;--warm:#f0ebe2;
  --green:#2d6a4f;--green2:#40916c;--gold:#d4a017;
  --rust:#bc4749;--muted:#6b7280;--border:#e5e7eb;--card:#ffffff;
  --sh:0 2px 8px rgba(13,17,23,0.08);--shm:0 8px 28px rgba(13,17,23,0.12);--shl:0 20px 60px rgba(13,17,23,0.18);
  --r:16px;--rs:10px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--cream);color:var(--night);min-height:100vh;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--warm);}::-webkit-scrollbar-thumb{background:#c5c5c5;border-radius:3px;}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 44px;height:62px;background:var(--night);position:sticky;top:0;z-index:200;box-shadow:0 1px 0 rgba(255,255,255,0.06);}
.nav-l{display:flex;align-items:center;gap:18px;}
.logo{font-family:'Fraunces',serif;font-size:1.65rem;color:var(--cream);cursor:pointer;letter-spacing:-0.5px;font-style:italic;}
.logo em{color:var(--gold);font-style:normal;}
.back{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:rgba(250,248,244,0.7);border-radius:30px;padding:6px 14px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
.back:hover{background:rgba(255,255,255,0.14);color:var(--cream);}
.nav-r{display:flex;align-items:center;gap:10px;}
.nav-city{font-size:0.74rem;color:rgba(250,248,244,0.38);letter-spacing:1.5px;text-transform:uppercase;}
.prog{display:flex;gap:6px;}
.pd{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.16);transition:all 0.3s;}
.pd.on{background:var(--gold);width:20px;border-radius:3px;}
.pd.done{background:var(--green2);}
.ubtn{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:var(--cream);border-radius:30px;padding:6px 14px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
.ubtn:hover{background:rgba(255,255,255,0.16);}
.uav{width:26px;height:26px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:white;}

/* HERO — full redesign */
.hero{min-height:calc(100vh - 62px);display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;}
@media(max-width:900px){.hero{grid-template-columns:1fr;}}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 7vw;background:var(--night);position:relative;z-index:2;}
.hero-left::after{content:'';position:absolute;top:0;right:-60px;bottom:0;width:120px;background:var(--night);transform:skewX(-4deg);z-index:1;}
.hero-right{position:relative;overflow:hidden;}
.hero-right-img{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85') center/cover;filter:brightness(0.75);}
.hero-right-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(13,17,23,0.5) 0%,rgba(13,17,23,0.1) 100%);}
.hero-floating-cards{position:absolute;bottom:40px;left:30px;right:30px;display:flex;flex-direction:column;gap:10px;z-index:2;}
.hero-float-card{background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;animation:floatup 0.6s ease both;}
.hero-float-card:nth-child(2){animation-delay:0.1s;}
.hero-float-card:nth-child(3){animation-delay:0.2s;}
@keyframes floatup{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.hfc-icon{font-size:1.4rem;}
.hfc-text{color:white;}
.hfc-name{font-size:0.84rem;font-weight:600;}
.hfc-sub{font-size:0.72rem;opacity:0.7;margin-top:1px;}
.hero-tag{font-size:0.68rem;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;opacity:0.9;}
.hero-h1{font-family:'Fraunces',serif;font-size:clamp(2.6rem,4vw,4.2rem);color:var(--cream);line-height:1.05;margin-bottom:20px;}
.hero-h1 em{color:var(--gold);font-style:italic;}
.hero-sub{color:rgba(250,248,244,0.5);font-size:0.97rem;max-width:420px;margin-bottom:36px;font-weight:300;line-height:1.8;}
.hero-features{display:flex;flex-direction:column;gap:10px;margin-bottom:36px;}
.hero-feat{display:flex;align-items:center;gap:10px;color:rgba(250,248,244,0.6);font-size:0.83rem;}
.hero-feat-dot{width:6px;height:6px;border-radius:50%;background:var(--green2);flex-shrink:0;}
.sc{width:100%;max-width:500px;position:relative;z-index:3;}
.sw{display:flex;background:var(--card);border-radius:60px;overflow:visible;box-shadow:0 12px 50px rgba(0,0,0,0.45);position:relative;z-index:1;}
.si-wrap{display:flex;align-items:center;flex:1;overflow:hidden;border-radius:60px 0 0 60px;}
.sicon{padding:0 0 0 20px;color:var(--muted);font-size:1rem;flex-shrink:0;}
.si{flex:1;border:none;padding:17px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.93rem;background:transparent;color:var(--night);outline:none;}
.si::placeholder{color:#aaa;}
.ssugg{position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--card);border-radius:var(--rs);box-shadow:var(--shl);z-index:100;overflow:hidden;border:1px solid var(--border);}
.sitem{display:flex;align-items:center;gap:11px;padding:11px 17px;cursor:pointer;transition:background 0.15s;font-size:0.88rem;}
.sitem:hover{background:var(--warm);}
.ssub{font-size:0.72rem;color:var(--muted);}
.sbtn{background:var(--green);color:white;border:none;padding:17px 24px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;font-weight:600;cursor:pointer;transition:background 0.2s;white-space:nowrap;border-radius:0 60px 60px 0;flex-shrink:0;}
.sbtn:hover{background:var(--green2);}
.chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:18px;}
.chip{background:rgba(250,248,244,0.07);border:1px solid rgba(250,248,244,0.14);color:rgba(250,248,244,0.55);border-radius:30px;padding:6px 14px;font-size:0.76rem;cursor:pointer;transition:all 0.2s;}
.chip:hover{background:rgba(45,106,79,0.3);border-color:var(--green2);color:var(--cream);}

/* PROFILE MODAL */
.pov{position:fixed;inset:0;background:rgba(13,17,23,0.75);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);}
.pmodal{background:var(--card);border-radius:var(--r);padding:36px;width:100%;max-width:520px;box-shadow:var(--shl);position:relative;max-height:90vh;overflow-y:auto;}
.pmc{position:absolute;top:13px;right:13px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--muted);}
.pmc:hover{color:var(--night);}
.pm-header{display:flex;align-items:center;gap:16px;margin-bottom:28px;}
.pm-av{width:56px;height:56px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:white;font-weight:700;}
.pm-name{font-family:'Fraunces',serif;font-size:1.6rem;}
.pm-sub{color:var(--muted);font-size:0.82rem;margin-top:2px;}
.pm-stats{display:flex;gap:12px;margin-bottom:24px;}
.pm-stat{background:var(--warm);border-radius:var(--rs);padding:14px 18px;flex:1;text-align:center;}
.pm-stat-n{font-family:'Fraunces',serif;font-size:1.8rem;color:var(--green);font-weight:700;}
.pm-stat-l{font-size:0.74rem;color:var(--muted);margin-top:2px;}
.pm-map{width:100%;height:220px;border-radius:var(--r);overflow:hidden;margin-bottom:20px;border:1px solid var(--border);}
.pm-map iframe{width:100%;height:100%;border:none;}
.pm-trips-title{font-family:'Fraunces',serif;font-size:1.1rem;margin-bottom:12px;}
.pm-trips{display:flex;flex-direction:column;gap:8px;}
.pm-trip{background:var(--warm);border-radius:var(--rs);padding:12px 14px;display:flex;justify-content:space-between;align-items:center;}
.pm-trip-city{font-weight:600;font-size:0.9rem;}
.pm-trip-meta{font-size:0.76rem;color:var(--muted);margin-top:2px;}
.pm-trip-stops{font-size:0.78rem;color:var(--green2);font-weight:600;}
.pm-empty{color:var(--muted);text-align:center;padding:24px;font-size:0.88rem;}
.pm-btns{display:flex;gap:10px;margin-top:20px;}
.pm-logout{flex:1;padding:11px;background:var(--warm);border:none;border-radius:60px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.87rem;cursor:pointer;transition:all 0.2s;}
.pm-logout:hover{background:#fddede;color:var(--rust);}

/* USERNAME SETUP */
.usetup{background:var(--card);border-radius:var(--r);padding:36px;width:100%;max-width:380px;box-shadow:var(--shl);}
.ust{font-family:'Fraunces',serif;font-size:1.7rem;margin-bottom:6px;}
.uss{color:var(--muted);font-size:0.86rem;margin-bottom:22px;line-height:1.5;}
.uinp{width:100%;padding:13px 16px;border:2px solid var(--border);border-radius:var(--rs);font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;background:var(--cream);color:var(--night);outline:none;transition:border-color 0.2s;margin-bottom:14px;}
.uinp:focus{border-color:var(--green2);}
.ubf{width:100%;padding:13px;background:var(--night);color:var(--cream);border:none;border-radius:60px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.93rem;font-weight:600;cursor:pointer;transition:all 0.2s;}
.ubf:hover{background:var(--green);}

/* STEP */
.page{padding:42px 5vw 68px;max-width:1360px;margin:0 auto;}
.sh{margin-bottom:30px;}
.sey{font-size:0.68rem;letter-spacing:3px;text-transform:uppercase;color:var(--rust);margin-bottom:6px;}
.st{font-family:'Fraunces',serif;font-size:2.2rem;color:var(--night);line-height:1.1;}
.st span{color:var(--green);font-style:italic;}
.ss{color:var(--muted);margin-top:8px;font-weight:300;font-size:0.91rem;}

/* PREFS */
.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px;margin:22px 0;}
.pc{background:var(--card);border:2px solid transparent;border-radius:var(--r);padding:16px 14px;cursor:pointer;transition:all 0.2s;box-shadow:var(--sh);}
.pc:hover{border-color:var(--green2);transform:translateY(-2px);box-shadow:var(--shm);}
.pc.sel{border-color:var(--green);background:#f0f7f3;}
.pi{font-size:1.6rem;margin-bottom:7px;}
.pn{font-weight:600;font-size:0.87rem;}
.pd2{font-size:0.72rem;color:var(--muted);margin-top:2px;}
.cpw{display:flex;gap:8px;margin-bottom:16px;}
.cpi{flex:1;padding:11px 17px;border:2px solid var(--border);border-radius:60px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;background:var(--card);color:var(--night);outline:none;transition:border-color 0.2s;}
.cpi:focus{border-color:var(--green2);}
.cap{background:var(--night2);color:var(--cream);border:none;border-radius:60px;padding:11px 19px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
.cap:hover{background:var(--green);}
.ctags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.ctag{background:var(--green);color:white;border-radius:30px;padding:5px 12px;font-size:0.79rem;display:flex;align-items:center;gap:5px;}
.ctag button{background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:0.85rem;line-height:1;padding:0;}

/* TRANSPORT */
.transport-section{margin-bottom:28px;}
.transport-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;}
.tc{background:var(--card);border:2px solid transparent;border-radius:var(--r);padding:16px 14px;cursor:pointer;transition:all 0.2s;box-shadow:var(--sh);text-align:center;}
.tc:hover{border-color:var(--green2);transform:translateY(-2px);}
.tc.sel{border-color:var(--green);background:#f0f7f3;}
.tc-icon{font-size:1.8rem;margin-bottom:6px;}
.tc-name{font-weight:600;font-size:0.85rem;}
.tc-time{font-size:0.72rem;color:var(--muted);margin-top:2px;}

/* BUDGET */
.bsec{margin-bottom:28px;}
.bt{font-size:0.74rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
.bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;}
.bc{background:var(--card);border:2px solid transparent;border-radius:var(--r);padding:16px;cursor:pointer;transition:all 0.2s;box-shadow:var(--sh);}
.bc:hover{border-color:var(--gold);transform:translateY(-2px);}
.bc.sel{border-color:var(--gold);background:#fdf9ee;}
.btr{font-size:1.2rem;font-weight:700;margin-bottom:3px;}
.bl{font-weight:600;font-size:0.88rem;margin-bottom:2px;}
.br{font-size:0.75rem;font-weight:600;margin-bottom:5px;}
.bd{font-size:0.72rem;color:var(--muted);line-height:1.4;}
.conds{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:28px;}
.cg label{font-size:0.7rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:7px;}
.pills{display:flex;gap:6px;flex-wrap:wrap;}
.pill{background:var(--warm);border:2px solid transparent;border-radius:30px;padding:6px 13px;font-size:0.8rem;cursor:pointer;transition:all 0.18s;}
.pill:hover{border-color:var(--green2);}
.pill.sel{background:var(--green2);color:white;border-color:var(--green2);}
.time-picker-row{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:28px;background:var(--card);border-radius:var(--r);padding:20px;box-shadow:var(--sh);}
.time-picker-group{display:flex;flex-direction:column;gap:6px;}
.time-picker-label{font-size:0.72rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);}
.time-input{padding:10px 16px;border:2px solid var(--border);border-radius:var(--rs);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;background:var(--cream);color:var(--night);outline:none;transition:border-color 0.2s;}
.time-input:focus{border-color:var(--green2);}

/* RESULTS */
.rl{display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start;}
@media(max-width:960px){.rl{grid-template-columns:1fr;}}
.mapbox{width:100%;height:280px;border-radius:var(--r);margin-bottom:20px;overflow:hidden;box-shadow:var(--shm);}
.mapbox iframe{width:100%;height:100%;border:none;border-radius:var(--r);}
.plgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;}
.plcard{background:var(--card);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);cursor:pointer;transition:all 0.22s;border:2px solid transparent;}
.plcard:hover{transform:translateY(-3px);box-shadow:var(--shm);}
.plcard.added{border-color:var(--green2);}
.plcard.focused{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,160,23,0.2);}
.plimg{width:100%;height:158px;overflow:hidden;background:var(--warm);display:flex;align-items:center;justify-content:center;font-size:2.6rem;position:relative;}
.plimg img{width:100%;height:100%;object-fit:cover;display:block;}
.pbadge{position:absolute;top:8px;right:8px;background:rgba(13,17,23,0.7);color:var(--gold);border-radius:20px;padding:3px 8px;font-size:0.69rem;font-weight:700;backdrop-filter:blur(4px);}
.plbody{padding:12px 14px;}
.pltype{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:3px;}
.plname{font-family:'Fraunces',serif;font-size:1.05rem;margin-bottom:3px;font-weight:600;}
.plrat{font-size:0.79rem;color:var(--gold);}
.plrat span{color:var(--muted);}
.pldesc{font-size:0.78rem;color:var(--muted);margin-top:6px;line-height:1.5;}
.plfoot{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-top:1px solid var(--border);}
.pldur{font-size:0.74rem;color:var(--muted);}
.addbt{background:var(--night);color:var(--cream);border:none;border-radius:30px;padding:6px 15px;font-size:0.78rem;cursor:pointer;transition:all 0.18s;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;}
.addbt:hover{background:var(--green2);}
.addbt.added{background:var(--green2);}
.show-more-btn{width:100%;margin-top:16px;padding:13px;background:var(--card);border:2px solid var(--border);border-radius:var(--r);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:600;color:var(--night);cursor:pointer;transition:all 0.2s;}
.show-more-btn:hover{border-color:var(--green2);color:var(--green2);}
.show-more-btn:disabled{opacity:0.4;cursor:not-allowed;}

/* SIDEBAR */
.sb{background:var(--night);border-radius:var(--r);padding:22px 18px;position:sticky;top:74px;color:var(--cream);}
.sbt{font-family:'Fraunces',serif;font-size:1.2rem;margin-bottom:3px;}
.sbs{font-size:0.74rem;color:rgba(250,248,244,0.36);margin-bottom:15px;}
.il{list-style:none;min-height:44px;}
.ii{background:rgba(250,248,244,0.07);border-radius:8px;padding:9px 11px;display:flex;align-items:center;justify-content:space-between;font-size:0.82rem;margin-bottom:6px;cursor:grab;user-select:none;transition:all 0.15s;}
.ii:active{cursor:grabbing;}
.ii.dragging{opacity:0.4;}
.ii-left{display:flex;align-items:center;gap:8px;}
.drag-handle{color:rgba(250,248,244,0.25);font-size:0.85rem;cursor:grab;}
.iis{font-size:0.68rem;color:rgba(250,248,244,0.34);margin-top:2px;}
.rmbt{background:none;border:none;color:rgba(250,248,244,0.26);cursor:pointer;font-size:0.9rem;transition:color 0.15s;}
.rmbt:hover{color:var(--rust);}
.em{text-align:center;padding:18px 0;font-size:0.8rem;color:rgba(250,248,244,0.24);}
.finbt{width:100%;margin-top:13px;background:var(--gold);color:var(--night);border:none;border-radius:60px;padding:13px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 0.2s;}
.finbt:hover:not(:disabled){background:#e8b420;}
.finbt:disabled{opacity:0.3;cursor:not-allowed;}

/* ITINERARY */
.ih{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:42px;flex-wrap:wrap;gap:16px;}
.imt{font-family:'Fraunces',serif;font-size:clamp(1.9rem,5vw,2.9rem);line-height:1.1;}
.imt em{color:var(--rust);font-style:italic;}
.iml{color:var(--muted);font-size:0.85rem;margin-top:8px;}
.iac{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.obt{background:transparent;border:2px solid var(--night);color:var(--night);border-radius:60px;padding:9px 21px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;cursor:pointer;transition:all 0.2s;}
.obt:hover{background:var(--night);color:var(--cream);}
.dbt{background:var(--night);color:var(--cream);border:none;border-radius:60px;padding:9px 21px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;cursor:pointer;transition:all 0.2s;}
.dbt:hover{background:var(--green);}
.aib{display:inline-flex;align-items:center;gap:5px;background:#edf7f1;color:var(--green);border-radius:20px;padding:4px 10px;font-size:0.71rem;font-weight:600;margin-top:8px;}
.cost-summary{background:var(--card);border-radius:var(--r);padding:20px 24px;margin-bottom:32px;box-shadow:var(--sh);border-left:4px solid var(--gold);}
.cost-title{font-family:'Fraunces',serif;font-size:1.2rem;margin-bottom:12px;}
.cost-rows{display:flex;flex-direction:column;gap:6px;}
.cost-row{display:flex;justify-content:space-between;align-items:center;font-size:0.86rem;}
.cost-label{color:var(--muted);}
.cost-val{font-weight:600;}
.cost-total{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:2px solid var(--border);font-size:1rem;font-weight:700;}
.cost-total-val{color:var(--gold);font-family:'Fraunces',serif;font-size:1.3rem;}
.tl{display:flex;flex-direction:column;}
.tlb{display:grid;grid-template-columns:90px 1fr;gap:0 18px;}
.ttc{text-align:right;padding-top:18px;position:relative;}
.ttime{font-size:0.79rem;font-weight:600;color:var(--rust);white-space:nowrap;cursor:pointer;border-bottom:1px dashed rgba(188,71,73,0.3);display:inline-block;}
.ttime:hover{color:var(--green);}
.tdur{font-size:0.66rem;color:var(--muted);margin-top:1px;}
.tline{position:absolute;right:-10px;top:24px;bottom:-24px;width:2px;background:var(--border);}
.tdot{position:absolute;right:-16px;top:18px;width:12px;height:12px;border-radius:50%;background:var(--rust);border:3px solid var(--cream);box-shadow:0 0 0 2px var(--rust);z-index:1;}
.tcc{padding:12px 0 22px;}
.tcard{background:var(--card);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);display:flex;}
.tcimg{width:115px;min-width:115px;height:120px;overflow:hidden;background:var(--warm);display:flex;align-items:center;justify-content:center;font-size:1.8rem;}
.tcimg img{width:100%;height:100%;object-fit:cover;display:block;}
.tcb{padding:14px;flex:1;}
.tctype{font-size:0.64rem;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:2px;}
.tcname{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:600;margin-bottom:5px;}
.tcdesc{font-size:0.8rem;color:var(--muted);line-height:1.55;}
.tcmeta{font-size:0.75rem;color:var(--gold);margin-top:8px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.cost-badge{background:#fdf9ee;color:var(--gold);border-radius:20px;padding:2px 9px;font-size:0.72rem;font-weight:600;border:1px solid rgba(212,160,23,0.3);}
.trvl{display:grid;grid-template-columns:90px 1fr;gap:0 18px;}
.trvli{font-size:0.74rem;color:var(--muted);display:flex;align-items:center;gap:6px;background:rgba(64,145,108,0.07);border-radius:6px;padding:5px 10px;margin:2px 0;}

/* TIME EDIT MODAL */
.teov{position:fixed;inset:0;background:rgba(13,17,23,0.6);z-index:400;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
.temod{background:var(--card);border-radius:var(--r);padding:28px;width:100%;max-width:320px;box-shadow:var(--shl);}
.temt{font-family:'Fraunces',serif;font-size:1.4rem;margin-bottom:4px;}
.tems{color:var(--muted);font-size:0.82rem;margin-bottom:18px;}
.temr{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
.teml{font-size:0.73rem;font-weight:600;letter-spacing:0.5px;color:var(--night2);}
.temi{padding:10px 13px;border:2px solid var(--border);border-radius:var(--rs);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;background:var(--cream);color:var(--night);outline:none;width:100%;transition:border-color 0.2s;}
.temi:focus{border-color:var(--green2);}
.tembtns{display:flex;gap:10px;margin-top:16px;}
.tem-cancel{flex:1;padding:10px;background:var(--warm);border:none;border-radius:60px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.86rem;cursor:pointer;}
.tem-save{flex:1;padding:10px;background:var(--night);color:var(--cream);border:none;border-radius:60px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.86rem;font-weight:600;cursor:pointer;transition:all 0.2s;}
.tem-save:hover{background:var(--green);}

/* LOADING */
.ls{position:fixed;inset:0;background:rgba(13,17,23,0.9);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;backdrop-filter:blur(5px);}
.spin{width:38px;height:38px;border:3px solid rgba(250,248,244,0.1);border-top-color:var(--gold);border-radius:50%;animation:spin 0.7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.lt{color:var(--cream);font-size:0.9rem;font-weight:300;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--night);color:var(--cream);padding:10px 20px;border-radius:60px;font-size:0.84rem;z-index:600;transition:opacity 0.3s;pointer-events:none;white-space:nowrap;}
.brow{display:flex;justify-content:flex-end;gap:10px;margin-top:10px;}
.gobt{background:var(--night);color:var(--cream);border:none;border-radius:60px;padding:12px 36px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;font-weight:600;cursor:pointer;transition:all 0.2s;}
.gobt:hover{background:var(--green);}
@media print{.np{display:none !important;}}
`;

const BUDGETS=[
  {id:"free",tier:"$",label:"Free & Budget",range:"$0–$25/person",desc:"Parks, free museums, street food & local gems.",color:"#2d6a4f",avg:15},
  {id:"mid",tier:"$$",label:"Mid-Range",range:"$25–$75/person",desc:"Casual dining, paid attractions & comfortable experiences.",color:"#d4a017",avg:45},
  {id:"upscale",tier:"$$$",label:"Upscale",range:"$75–$150/person",desc:"Nicer restaurants, private tours & premium venues.",color:"#7b5ea7",avg:110},
  {id:"luxury",tier:"$$$$",label:"Luxury",range:"$150+/person",desc:"Fine dining, exclusive experiences & VIP access.",color:"#bc4749",avg:200},
];

const TRANSPORT=[
  {id:"walking",icon:"🚶",name:"Walking",mult:1.0,travelMin:15,label:"~15 min between stops"},
  {id:"transit",icon:"🚌",name:"Transit",mult:0.85,travelMin:10,label:"~10 min between stops"},
  {id:"driving",icon:"🚗",name:"Driving",mult:0.7,travelMin:8,label:"~8 min between stops"},
  {id:"cycling",icon:"🚴",name:"Cycling",mult:0.9,travelMin:12,label:"~12 min between stops"},
  {id:"rideshare",icon:"🚕",name:"Rideshare",mult:0.75,travelMin:9,label:"~9 min + wait"},
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
  {id:1,name:"Central Park",type:"Park",rating:4.8,reviews:42300,emoji:"🌳",desc:"An iconic 843-acre urban oasis with meadows, lakes, and skyline views. One of the most visited urban parks in the world, perfect for a morning stroll.",duration:90,lat:40.7851,lng:-73.9683,priceLevel:0},
  {id:2,name:"Metropolitan Museum of Art",type:"Museum",rating:4.9,reviews:31000,emoji:"🎨",desc:"One of the world's great art museums, spanning 5,000 years of civilizations from every corner of the globe. Home to over 2 million works.",duration:120,lat:40.7794,lng:-73.9632,priceLevel:1},
  {id:3,name:"Brooklyn Bridge",type:"Landmark",rating:4.8,reviews:55000,emoji:"🌉",desc:"Walk this iconic 1883 suspension bridge connecting Manhattan and Brooklyn for sweeping views of the city skyline and East River.",duration:45,lat:40.7061,lng:-73.9969,priceLevel:0},
  {id:4,name:"Katz's Delicatessen",type:"Restaurant",rating:4.5,reviews:12000,emoji:"🥪",desc:"A legendary New York institution since 1888. Famous for its world-class pastrami and corned beef sandwiches, piled impossibly high.",duration:60,lat:40.7223,lng:-73.9874,priceLevel:2},
  {id:5,name:"Times Square",type:"Landmark",rating:4.5,reviews:98000,emoji:"🌆",desc:"The neon-lit, electric heart of Manhattan buzzing 24/7. Overwhelming, loud, and utterly unforgettable — the city at its most intense.",duration:45,lat:40.758,lng:-73.9855,priceLevel:0},
  {id:6,name:"The High Line",type:"Park",rating:4.7,reviews:29000,emoji:"🌿",desc:"A 1.45-mile elevated park built on a former freight rail line, winding through the West Side with curated gardens and Hudson River views.",duration:75,lat:40.748,lng:-74.0048,priceLevel:0},
  {id:7,name:"Museum of Modern Art",type:"Museum",rating:4.7,reviews:22000,emoji:"🖼️",desc:"MoMA houses an extraordinary collection of modern and contemporary art, from Picasso's Les Demoiselles to Warhol's Campbell's Soup Cans.",duration:120,lat:40.7614,lng:-73.9776,priceLevel:2},
  {id:8,name:"Smorgasburg",type:"Food Market",rating:4.6,reviews:8900,emoji:"🍜",desc:"Brooklyn's beloved open-air food market with 100+ local vendors every weekend. A paradise of creative, independent NYC food makers.",duration:90,lat:40.7223,lng:-73.9592,priceLevel:1},
];

function purl(ref){if(!ref||!GOOGLE_KEY||GOOGLE_KEY==="PASTE_YOUR_GOOGLE_KEY_HERE")return null;return`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${GOOGLE_KEY}`;}
function ft(h,m){const ap=h>=12?"PM":"AM";const hh=h>12?h-12:h===0?12:h;return`${hh}:${String(m).padStart(2,"0")} ${ap}`;}
function useToast(){const[msg,setMsg]=useState("");const[vis,setVis]=useState(false);const t=useRef();const show=m=>{setMsg(m);setVis(true);clearTimeout(t.current);t.current=setTimeout(()=>setVis(false),2500);};return{msg,vis,show};}
function estCost(place,budget){const b=BUDGETS.find(b=>b.id===budget);if(!b)return null;const pl=place.priceLevel??1;const base=b.avg;if(pl===0)return Math.round(base*0.1);if(pl===1)return Math.round(base*0.5);if(pl===2)return Math.round(base*1.0);if(pl===3)return Math.round(base*1.8);return Math.round(base);}

async function fetchAIDescs(places,city,budget,prefs){
  if(!ANTHROPIC_KEY||ANTHROPIC_KEY==="PASTE_YOUR_ANTHROPIC_KEY_HERE")return null;
  const list=places.map((p,i)=>`${i+1}. ${p.name} (${p.type})`).join("\n");
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:`Write vivid, specific 2-sentence travel descriptions for each place in ${city}. Budget: ${budget||"moderate"}. Interests: ${prefs||"general"}. Be specific about what makes each place special.\n${list}\nRespond ONLY as JSON: [{"id":1,"desc":"..."}]`}]})});
    const d=await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  }catch{return null;}
}

function exportPDF(city,itin,budget,transport,startTime,descMap){
  const{jsPDF}=window.jspdf||{};
  if(!jsPDF){alert("jsPDF not loaded.");return;}
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();
  doc.setFillColor(13,17,23);doc.rect(0,0,W,36,"F");
  doc.setFont("times","italic");doc.setFontSize(22);doc.setTextColor(250,248,244);doc.text("Mapistry",14,20);
  doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(180,170,155);doc.text("Your personal travel planner",14,28);
  doc.setFont("times","bold");doc.setFontSize(18);doc.setTextColor(13,17,23);doc.text(`A Day in ${city}`,14,50);
  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=transport?TRANSPORT.find(t=>t.id===transport)?.name:null;
  let meta=[blabel,tlabel].filter(Boolean).join(" · ");
  if(meta){doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(107,114,128);doc.text(meta,14,58);}
  const tr=TRANSPORT.find(t=>t.id===transport)||TRANSPORT[0];
  let y=66;
  const[sh,sm]=startTime.split(":").map(Number);
  let h=sh,m=sm;
  itin.forEach((p,i)=>{
    if(y>250){doc.addPage();y=20;}
    const customT=p.customTime;let ts,te;
    if(customT){const[ch,cm]=customT.split(":").map(Number);ts=ft(ch,cm);const eH=ch+Math.floor((cm+p.duration)/60);const eM=(cm+p.duration)%60;te=ft(eH,eM);}
    else{ts=ft(h,m);const eH=h+Math.floor((m+p.duration)/60);const eM=(m+p.duration)%60;te=ft(eH,eM);if(i<itin.length-1){const tv=tr.travelMin;h=eH+Math.floor((eM+tv)/60);m=(eM+tv)%60;}}
    doc.setFillColor(188,71,73);doc.roundedRect(14,y-4,38,8,4,4,"F");
    doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(255,255,255);doc.text(`${ts}–${te}`,16,y+1.5);
    const cost=estCost(p,budget);
    if(cost){doc.setFillColor(212,160,23);doc.roundedRect(54,y-4,22,8,4,4,"F");doc.setTextColor(13,17,23);doc.text(`~$${cost}`,57,y+1.5);}
    y+=10;doc.setFont("times","bold");doc.setFontSize(13);doc.setTextColor(13,17,23);doc.text(p.name,14,y);y+=6;
    doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(107,114,128);doc.text(`${p.type} · ★ ${p.rating} · ~${p.duration} min`,14,y);y+=6;
    const desc=descMap?.[p.id]||p.desc;
    doc.setFontSize(9);doc.setTextColor(60,60,60);const lines=doc.splitTextToSize(desc,W-28);doc.text(lines,14,y);y+=lines.length*5+4;
    if(i<itin.length-1){doc.setFont("helvetica","italic");doc.setFontSize(8);doc.setTextColor(64,145,108);doc.text(`  ${tr.icon||"→"} ~${tr.travelMin} min ${tr.name} to next stop`,14,y);y+=7;}
    doc.setDrawColor(229,231,235);doc.line(14,y,W-14,y);y+=7;
  });
  const pg=doc.internal.getNumberOfPages();
  for(let i=1;i<=pg;i++){doc.setPage(i);doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(107,114,128);doc.text(`Mapistry · Page ${i} of ${pg}`,W/2,290,{align:"center"});}
  doc.save(`mapistry-${city.replace(/\s+/g,"-").toLowerCase()}.pdf`);
}

export default function App(){
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
  const[focusedPlace,setFocusedPlace]=useState(null);
  const[mapQuery,setMapQuery]=useState("");
  const[itin,setItin]=useState([]);
  const[descMap,setDescMap]=useState(null);
  const[aiUsed,setAiUsed]=useState(false);
  const[loading,setLoading]=useState(false);
  const[lmsg,setLmsg]=useState("");
  const[dragIdx,setDragIdx]=useState(null);
  const[editingPlace,setEditingPlace]=useState(null);
  const[editTimeVal,setEditTimeVal]=useState("");
  const[editDurVal,setEditDurVal]=useState(60);
  const[user,setUser]=useState(null);
  const[showProfile,setShowProfile]=useState(false);
  const[showUserSetup,setShowUserSetup]=useState(false);
  const[usernameInput,setUsernameInput]=useState("");
  const[hist,setHist]=useState([]);
  const toast=useToast();
  const sref=useRef();
  const nextToken=useRef(null);

  useEffect(()=>{
    const u=localStorage.getItem("mapistry_user");
    const h=localStorage.getItem("mapistry_hist");
    if(u)setUser(JSON.parse(u));
    if(h)setHist(JSON.parse(h));
  },[]);

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

  function createUser(){
    const name=usernameInput.trim();
    if(!name){toast.show("Please enter a name!");return;}
    const u={name,created:new Date().toLocaleDateString()};
    setUser(u);localStorage.setItem("mapistry_user",JSON.stringify(u));
    setShowUserSetup(false);toast.show(`Welcome, ${name}! 👋`);
  }

  function logout(){setUser(null);localStorage.removeItem("mapistry_user");setShowProfile(false);toast.show("Logged out");}

  function addCpref(){const v=cpinput.trim();if(!v)return;if(cprefs.includes(v)){toast.show("Already added!");return;}setCprefs(c=>[...c,v]);setCpinput("");}

  async function doFetch(c,token=null){
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
            emoji:"📍",desc:p.editorial_summary?.overview||p.formatted_address||"A must-visit spot in "+c+".",
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
    const c=cin.trim();if(!c){toast.show("Please enter a city or town!");return;}
    setCity(c);setMapQuery(c);setLmsg(`Finding the best spots in ${c}…`);setLoading(true);
    const{places:p,nextToken:nt}=await doFetch(c);
    nextToken.current=nt;setAllPlaces(p);setPlaces(p);setVisibleCount(8);setLoading(false);setStep(3);
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
    setFocusedPlace(p.id);
    setMapQuery(`${p.name} ${city}`);
  }

  async function goToItinerary(){
    if(itin.length===0){toast.show("Add at least one place first!");return;}
    setLmsg("Crafting your perfect day…");setLoading(true);
    let dm=null;
    if(ANTHROPIC_KEY&&ANTHROPIC_KEY!=="PASTE_YOUR_ANTHROPIC_KEY_HERE"){
      setLmsg("✨ AI is writing your itinerary…");
      const allP=[...prefs,...cprefs].join(", ");
      const result=await fetchAIDescs(itin,city,budget?BUDGETS.find(b=>b.id===budget)?.label:null,allP);
      if(result){dm={};result.forEach(x=>{dm[x.id]=x.desc;});setDescMap(dm);setAiUsed(true);}
    }
    await new Promise(r=>setTimeout(r,400));setLoading(false);setStep(4);
    if(user){
      const entry={id:Date.now(),city,lat:places[0]?.lat||0,lng:places[0]?.lng||0,date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),stops:itin.length,img:itin[0]?.photoRef?purl(itin[0].photoRef):null,emoji:itin[0]?.emoji||"📍",places:itin.map(p=>p.name)};
      const nh=[entry,...hist].slice(0,30);setHist(nh);localStorage.setItem("mapistry_hist",JSON.stringify(nh));
    }
  }

  // drag and drop
  function onDragStart(i){setDragIdx(i);}
  function onDragOver(e,i){e.preventDefault();if(dragIdx===null||dragIdx===i)return;const a=[...itin];const[it]=a.splice(dragIdx,1);a.splice(i,0,it);setItin(a);setDragIdx(i);}
  function onDragEnd(){setDragIdx(null);}

  // time editing
  function openEdit(p){setEditingPlace(p);setEditTimeVal(p.customTime||"");setEditDurVal(p.duration||60);}
  function saveEdit(){setItin(it=>it.map(p=>p.id===editingPlace.id?{...p,customTime:editTimeVal||undefined,duration:editDurVal}:p));setEditingPlace(null);toast.show("Updated!");}

  // compute timeline
  function computeTimes(){
    const[sh,sm]=startTime.split(":").map(Number);
    let h=sh,m=sm;
    const tr=TRANSPORT.find(t=>t.id===transport)||TRANSPORT[0];
    return itin.map((place,i)=>{
      if(place.customTime){
        const[ch,cm]=place.customTime.split(":").map(Number);
        const eH=ch+Math.floor((cm+place.duration)/60),eM=(cm+place.duration)%60;
        if(i<itin.length-1){h=eH+Math.floor((eM+tr.travelMin)/60);m=(eM+tr.travelMin)%60;}
        return{start:ft(ch,cm),end:ft(eH,eM),travel:tr.travelMin,mode:tr};
      }
      const ts=ft(h,m);
      const eH=h+Math.floor((m+place.duration)/60),eM=(m+place.duration)%60;
      if(i<itin.length-1){h=eH+Math.floor((eM+tr.travelMin)/60);m=(eM+tr.travelMin)%60;}
      return{start:ts,end:ft(eH,eM),travel:tr.travelMin,mode:tr};
    });
  }

  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const tlabel=transport?TRANSPORT.find(t=>t.id===transport)?.name:null;
  const times=step===4?computeTimes():[];
  const totalCost=budget?itin.reduce((s,p)=>s+(estCost(p,budget)||0),0):null;
  const visiblePlaces=places.slice(0,visibleCount);
  const initials=user?user.name.slice(0,2).toUpperCase():"";

  // build visited cities map src
  const visitedCities=[...new Set(hist.map(h=>h.city))];
  const mapCenterCity=visitedCities[0]||"World";
  const profileMapSrc=visitedCities.length>0
    ?`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_KEY}&q=${encodeURIComponent(visitedCities.slice(0,5).join("|"))}&zoom=2`
    :`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=World&zoom=2`;

  return(
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="nav np">
        <div className="nav-l">
          <div className="logo" onClick={()=>{setStep(1);setItin([]);setCin("");setCity("");}}>Mapit<em>stry</em></div>
          {step>1&&<button className="back" onClick={()=>setStep(step-1)}>← Back</button>}
        </div>
        <div className="nav-r">
          {city&&step>1&&<div className="nav-city">📍 {city}</div>}
          {step>1&&<div className="prog">{[1,2,3,4].map(s=><div key={s} className={`pd ${s===step?"on":s<step?"done":""}`}/>)}</div>}
          {user
            ?<button className="ubtn" onClick={()=>setShowProfile(true)}><div className="uav">{initials}</div>{user.name}</button>
            :<button className="ubtn" onClick={()=>setShowUserSetup(true)}>👤 Sign In</button>
          }
        </div>
      </nav>

      {/* STEP 1 — NEW HERO */}
      {step===1&&(
        <div className="hero">
          <div className="hero-left">
            <div className="hero-tag">✦ Your personal travel planner</div>
            <h1 className="hero-h1">Plan your<br/><em>perfect day</em>,<br/>anywhere.</h1>
            <p className="hero-sub">Enter any city or town — get a real, personalized itinerary with actual photos, cost estimates, and hour-by-hour scheduling.</p>
            <div className="hero-features">
              {["Real photos from Google Places","AI-personalized descriptions","Hour-by-hour scheduling","Cost estimates per stop"].map(f=>(
                <div key={f} className="hero-feat"><div className="hero-feat-dot"/>{f}</div>
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
              {["🗽 New York City","🗼 Paris","🏯 Kyoto","🎸 Nashville","🏛️ Rome"].map(c=>(
                <div key={c} className="chip" onClick={()=>{const v=c.split(" ").slice(1).join(" ");setCin(v);setCity(v);setShowS(false);}}>{c}</div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-right-img"/>
            <div className="hero-right-overlay"/>
            <div className="hero-floating-cards">
              {[
                {icon:"🗼",name:"Eiffel Tower",sub:"Paris, France · ★ 4.7"},
                {icon:"🏛️",name:"Colosseum",sub:"Rome, Italy · ★ 4.8"},
                {icon:"🌸",name:"Fushimi Inari",sub:"Kyoto, Japan · ★ 4.9"},
              ].map(c=>(
                <div key={c.name} className="hero-float-card">
                  <div className="hfc-icon">{c.icon}</div>
                  <div className="hfc-text"><div className="hfc-name">{c.name}</div><div className="hfc-sub">{c.sub}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step===2&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 2 of 4</div>
            <h2 className="st">What's your vibe in <span>{city}</span>?</h2>
            <p className="ss">Pick categories or type your own. Set your transport, budget, and trip times.</p>
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

          {/* TRANSPORT */}
          <div className="transport-section">
            <div className="bt">Getting Around</div>
            <div className="transport-grid">
              {TRANSPORT.map(t=>(
                <div key={t.id} className={`tc ${transport===t.id?"sel":""}`} onClick={()=>setTransport(t.id)}>
                  <div className="tc-icon">{t.icon}</div>
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-time">{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TRIP TIMES */}
          <div style={{marginBottom:8,fontSize:"0.74rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)"}}>Trip Times</div>
          <div className="time-picker-row">
            <div className="time-picker-group">
              <div className="time-picker-label">Start Time</div>
              <input type="time" className="time-input" value={startTime} onChange={e=>setStartTime(e.target.value)}/>
            </div>
            <div className="time-picker-group">
              <div className="time-picker-label">End Time</div>
              <input type="time" className="time-input" value={endTime} onChange={e=>setEndTime(e.target.value)}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",paddingBottom:4,color:"var(--muted)",fontSize:"0.82rem"}}>
              Schedule will fit within these times
            </div>
          </div>

          <div className="bsec">
            <div className="bt">Budget (per person)</div>
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

      {/* STEP 3 */}
      {step===3&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 3 of 4</div>
            <h2 className="st">Best spots in <span>{city}</span></h2>
            <p className="ss">Click a card to see it on the map. Hit <strong>Add</strong> to build your itinerary. Drag to reorder in the sidebar.</p>
          </div>
          <div className="rl">
            <div>
              <div className="mapbox">
                <iframe key={mapQuery} title="map"
                  src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_KEY}&q=${encodeURIComponent(mapQuery||city)}&zoom=15`}
                  allowFullScreen/>
              </div>
              <div className="plgrid">
                {visiblePlaces.map(p=>{
                  const added=!!itin.find(x=>x.id===p.id);
                  const focused=focusedPlace===p.id;
                  const img=p.photoRef?purl(p.photoRef):null;
                  const pb=p.priceLevel===0?"Free":p.priceLevel===1?"$":p.priceLevel===2?"$$":p.priceLevel===3?"$$$":null;
                  const cost=estCost(p,budget);
                  return(
                    <div key={p.id} className={`plcard ${added?"added":""} ${focused?"focused":""}`} onClick={()=>focusPlace(p)}>
                      <div className="plimg">
                        {img?<img src={img} alt={p.name} onError={e=>{e.target.parentElement.innerHTML=p.emoji;}} loading="lazy"/>:<span>{p.emoji}</span>}
                        {pb&&<div className="pbadge">{pb}{cost?` · ~$${cost}`:""}</div>}
                      </div>
                      <div className="plbody">
                        <div className="pltype">{p.type}</div>
                        <div className="plname">{p.name}</div>
                        <div className="plrat">★ {p.rating} <span>({p.reviews.toLocaleString()} reviews)</span></div>
                        <div className="pldesc">{p.desc}</div>
                      </div>
                      <div className="plfoot">
                        <div className="pldur">~{p.duration} min</div>
                        <button className={`addbt ${added?"added":""}`} onClick={e=>{e.stopPropagation();setItin(it=>it.find(x=>x.id===p.id)?it.filter(x=>x.id!==p.id):[...it,p]);if(!added)toast.show(`"${p.name}" added!`);}}>{added?"✓ Added":"+ Add"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {places.length>visibleCount&&<button className="show-more-btn" onClick={showMore}>+ Show More Places</button>}
              {places.length<=visibleCount&&allPlaces.length>=8&&<button className="show-more-btn" onClick={showMore} disabled={!nextToken.current}>{nextToken.current?"+ Load More from Google":"✓ All places loaded"}</button>}
            </div>
            <div className="sb np">
              <div className="sbt">Your Itinerary</div>
              <div className="sbs">{itin.length} place{itin.length!==1?"s":""} · drag to reorder</div>
              <ul className="il">
                {itin.length===0
                  ?<div className="em">Add places to get started →</div>
                  :itin.map((p,i)=>(
                    <li key={p.id} className={`ii ${dragIdx===i?"dragging":""}`} draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDragEnd={onDragEnd}>
                      <div className="ii-left">
                        <span className="drag-handle">⠿</span>
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

      {/* STEP 4 */}
      {step===4&&(
        <div className="page">
          <div className="ih">
            <div>
              <h2 className="imt">Your day in<br/><em>{city}</em></h2>
              <div className="iml">{[blabel,tlabel,conds.group,conds.day].filter(Boolean).join(" · ")}{itin.length>0?` · ${itin.length} stops`:""}</div>
              {aiUsed&&<div className="aib">✦ AI-personalized descriptions</div>}
            </div>
            <div className="iac np">
              <button className="obt" onClick={()=>setStep(3)}>← Edit Places</button>
              <button className="dbt" onClick={()=>exportPDF(city,itin,budget,transport,startTime,descMap)}>⬇ Export PDF</button>
            </div>
          </div>
          {budget&&totalCost>0&&(
            <div className="cost-summary">
              <div className="cost-title">💰 Estimated Trip Cost</div>
              <div className="cost-rows">
                {itin.map(p=>{const c=estCost(p,budget);return c?(<div key={p.id} className="cost-row"><span className="cost-label">{p.name}</span><span className="cost-val">~${c}</span></div>):null;})}
              </div>
              <div className="cost-total"><span>Total estimate</span><span className="cost-total-val">~${totalCost} per person</span></div>
            </div>
          )}
          <div className="tl">
            {itin.map((place,i)=>{
              const t=times[i]||{start:"9:00 AM",end:"10:00 AM",travel:15,mode:TRANSPORT[0]};
              const img=place.photoRef?purl(place.photoRef):null;
              const isLast=i===itin.length-1;
              const cost=estCost(place,budget);
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
                            {cost&&<span className="cost-badge">~${cost}</span>}
                            <span style={{fontSize:"0.7rem",color:"var(--green2)",cursor:"pointer"}} onClick={()=>openEdit(place)}>✏️ Edit time</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isLast&&(
                    <div className="trvl"><div/>
                      <div className="trvli">{t.mode?.icon||"🚶"} ~{t.travel} min by {t.mode?.name||"foot"} to next stop</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* USERNAME SETUP */}
      {showUserSetup&&(
        <div className="pov" onClick={e=>e.target===e.currentTarget&&setShowUserSetup(false)}>
          <div className="usetup">
            <div className="ust">Create your profile</div>
            <div className="uss">Pick a name to save your trips and see where you've been. No password needed — everything stays on this device.</div>
            <input className="uinp" placeholder="Your name…" value={usernameInput} onChange={e=>setUsernameInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createUser()} autoFocus/>
            <button className="ubf" onClick={createUser}>Get Started →</button>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfile&&user&&(
        <div className="pov" onClick={e=>e.target===e.currentTarget&&setShowProfile(false)}>
          <div className="pmodal">
            <button className="pmc" onClick={()=>setShowProfile(false)}>✕</button>
            <div className="pm-header">
              <div className="pm-av">{initials}</div>
              <div><div className="pm-name">{user.name}</div><div className="pm-sub">Member since {user.created}</div></div>
            </div>
            <div className="pm-stats">
              <div className="pm-stat"><div className="pm-stat-n">{hist.length}</div><div className="pm-stat-l">Trips</div></div>
              <div className="pm-stat"><div className="pm-stat-n">{hist.reduce((s,h)=>s+h.stops,0)}</div><div className="pm-stat-l">Places visited</div></div>
              <div className="pm-stat"><div className="pm-stat-n">{visitedCities.length}</div><div className="pm-stat-l">Cities</div></div>
            </div>
            {visitedCities.length>0&&(
              <>
                <div className="pm-trips-title">🌍 Cities You've Explored</div>
                <div className="pm-map">
                  <iframe key={profileMapSrc} title="visited" src={profileMapSrc} allowFullScreen/>
                </div>
              </>
            )}
            <div className="pm-trips-title">🧳 Past Trips</div>
            {hist.length===0
              ?<div className="pm-empty">No trips yet — go plan one! ✈️</div>
              :<div className="pm-trips">
                {hist.map(h=>(
                  <div key={h.id} className="pm-trip">
                    <div>
                      <div className="pm-trip-city">{h.emoji} {h.city}</div>
                      <div className="pm-trip-meta">{h.date}</div>
                    </div>
                    <div className="pm-trip-stops">📍 {h.stops} stops</div>
                  </div>
                ))}
              </div>
            }
            <div className="pm-btns">
              <button className="pm-logout" onClick={logout}>Sign Out</button>
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
            <div className="tembtns"><button className="tem-cancel" onClick={()=>setEditingPlace(null)}>Cancel</button><button className="tem-save" onClick={saveEdit}>Save</button></div>
          </div>
        </div>
      )}

      {loading&&<div className="ls"><div className="spin"/><div className="lt">{lmsg}</div></div>}
      <div className="toast" style={{opacity:toast.vis?1:0}}>{toast.msg}</div>
    </>
  );
}
