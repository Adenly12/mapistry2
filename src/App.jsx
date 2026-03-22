import { useState, useEffect, useRef } from "react";
import CONFIG from "./config";

const GOOGLE_KEY = CONFIG.GOOGLE_KEY;
const ANTHROPIC_KEY = CONFIG.ANTHROPIC_KEY;

// ─── STYLES ──────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
:root {
  --night: #0d1117; --night2: #161b22; --forest: #1a2e1e;
  --sage: #f0f4f0; --cream: #faf8f4; --warm: #f0ebe2;
  --green: #2d6a4f; --green2: #40916c; --gold: #d4a017;
  --rust: #bc4749; --muted: #6b7280; --border: #e5e7eb;
  --card: #ffffff;
  --sh: 0 2px 8px rgba(13,17,23,0.08);
  --shm: 0 8px 28px rgba(13,17,23,0.12);
  --shl: 0 20px 60px rgba(13,17,23,0.18);
  --r: 16px; --rs: 10px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--cream);color:var(--night);min-height:100vh;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:var(--warm);}
::-webkit-scrollbar-thumb{background:#c5c5c5;border-radius:3px;}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 44px;height:62px;background:var(--night);position:sticky;top:0;z-index:200;box-shadow:0 1px 0 rgba(255,255,255,0.06);}
.nav-l{display:flex;align-items:center;gap:18px;}
.logo{font-family:'Fraunces',serif;font-size:1.6rem;color:var(--cream);cursor:pointer;letter-spacing:-0.5px;}
.logo em{color:var(--gold);font-style:italic;}
.back{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:rgba(250,248,244,0.7);border-radius:30px;padding:6px 14px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
.back:hover{background:rgba(255,255,255,0.14);color:var(--cream);}
.nav-r{display:flex;align-items:center;gap:10px;}
.nav-city{font-size:0.74rem;color:rgba(250,248,244,0.38);letter-spacing:1.5px;text-transform:uppercase;}
.prog{display:flex;gap:6px;}
.pd{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.16);transition:all 0.3s;}
.pd.on{background:var(--gold);width:20px;border-radius:3px;}
.pd.done{background:var(--green2);}
.ubtn{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:var(--cream);border-radius:30px;padding:6px 14px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
.ubtn:hover{background:rgba(255,255,255,0.16);}
.uav{width:25px;height:25px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:600;color:white;}

/* HERO */
.hero{min-height:calc(100vh - 62px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;position:relative;overflow:hidden;}
.hero-bg{position:absolute;inset:0;background:var(--night);z-index:0;}
.hero-img{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80') center/cover;opacity:0.18;z-index:1;}
.hero-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(13,17,23,0.5) 0%,rgba(13,17,23,0.85) 60%,var(--night) 100%);z-index:2;}
.hero-content{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;}
.hero-tag{font-size:0.7rem;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;opacity:0.9;}
.hero-h1{font-family:'Fraunces',serif;font-size:clamp(3rem,7vw,5.8rem);color:var(--cream);text-align:center;line-height:1.02;margin-bottom:18px;}
.hero-h1 em{color:var(--gold);font-style:italic;}
.hero-sub{color:rgba(250,248,244,0.5);font-size:1rem;text-align:center;max-width:440px;margin-bottom:44px;font-weight:300;line-height:1.75;}
.sc{width:100%;max-width:580px;position:relative;}
.sw{display:flex;background:var(--card);border-radius:60px;overflow:visible;box-shadow:0 12px 50px rgba(0,0,0,0.45);position:relative;z-index:1;}
.si-wrap{display:flex;align-items:center;flex:1;overflow:hidden;border-radius:60px 0 0 60px;}
.sicon{padding:0 0 0 20px;color:var(--muted);font-size:1rem;flex-shrink:0;}
.si{flex:1;border:none;padding:18px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;background:transparent;color:var(--night);outline:none;}
.si::placeholder{color:#aaa;}
.ssugg{position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--card);border-radius:var(--rs);box-shadow:var(--shl);z-index:100;overflow:hidden;border:1px solid var(--border);}
.sitem{display:flex;align-items:center;gap:11px;padding:11px 17px;cursor:pointer;transition:background 0.15s;font-size:0.88rem;}
.sitem:hover{background:var(--warm);}
.ssub{font-size:0.72rem;color:var(--muted);}
.sbtn{background:var(--green);color:white;border:none;padding:18px 26px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;transition:background 0.2s;white-space:nowrap;border-radius:0 60px 60px 0;flex-shrink:0;}
.sbtn:hover{background:var(--green2);}
.chips{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin-top:20px;}
.chip{background:rgba(250,248,244,0.08);border:1px solid rgba(250,248,244,0.14);color:rgba(250,248,244,0.6);border-radius:30px;padding:7px 15px;font-size:0.78rem;cursor:pointer;transition:all 0.2s;}
.chip:hover{background:rgba(45,106,79,0.3);border-color:var(--green2);color:var(--cream);}

/* AUTH */
.ov{position:fixed;inset:0;background:rgba(13,17,23,0.75);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);}
.modal{background:var(--card);border-radius:var(--r);padding:36px;width:100%;max-width:410px;box-shadow:var(--shl);position:relative;}
.mc{position:absolute;top:13px;right:13px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--muted);}
.mc:hover{color:var(--night);}
.mt{font-family:'Fraunces',serif;font-size:1.8rem;margin-bottom:4px;}
.ms{color:var(--muted);font-size:0.85rem;margin-bottom:24px;line-height:1.5;}
.fg{margin-bottom:13px;}
.fl{display:block;font-size:0.75rem;font-weight:600;letter-spacing:0.5px;margin-bottom:5px;color:var(--night2);}
.fi{width:100%;padding:11px 14px;border:2px solid var(--border);border-radius:var(--rs);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;background:var(--cream);color:var(--night);outline:none;transition:border-color 0.2s;}
.fi:focus{border-color:var(--green2);}
.bf{width:100%;padding:13px;background:var(--night);color:var(--cream);border:none;border-radius:60px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:6px;}
.bf:hover{background:var(--green);}
.asw{text-align:center;margin-top:15px;font-size:0.83rem;color:var(--muted);}
.asw span{color:var(--green2);cursor:pointer;font-weight:600;}
.asw span:hover{text-decoration:underline;}

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
.ctag button:hover{color:white;}

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

/* CONDITIONS */
.conds{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:28px;}
.cg label{font-size:0.7rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:7px;}
.pills{display:flex;gap:6px;flex-wrap:wrap;}
.pill{background:var(--warm);border:2px solid transparent;border-radius:30px;padding:6px 13px;font-size:0.8rem;cursor:pointer;transition:all 0.18s;}
.pill:hover{border-color:var(--green2);}
.pill.sel{background:var(--green2);color:white;border-color:var(--green2);}

/* RESULTS */
.rl{display:grid;grid-template-columns:1fr 345px;gap:24px;align-items:start;}
@media(max-width:960px){.rl{grid-template-columns:1fr;}}
.mapbox{width:100%;height:280px;border-radius:var(--r);margin-bottom:20px;overflow:hidden;background:var(--night2);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:rgba(250,248,244,0.3);border:none;position:relative;}
.mapbox-inner{text-align:center;}
.plgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;}
.plcard{background:var(--card);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);cursor:pointer;transition:all 0.22s;border:2px solid transparent;}
.plcard:hover{transform:translateY(-3px);box-shadow:var(--shm);}
.plcard.added{border-color:var(--green2);}
.plimg{width:100%;height:158px;overflow:hidden;background:var(--warm);display:flex;align-items:center;justify-content:center;font-size:2.6rem;position:relative;}
.plimg img{width:100%;height:100%;object-fit:cover;display:block;}
.pbadge{position:absolute;top:8px;right:8px;background:rgba(13,17,23,0.7);color:var(--gold);border-radius:20px;padding:3px 8px;font-size:0.69rem;font-weight:700;backdrop-filter:blur(4px);}
.plbody{padding:12px 14px;}
.pltype{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:3px;}
.plname{font-family:'Fraunces',serif;font-size:1.05rem;margin-bottom:3px;font-weight:600;}
.plrat{font-size:0.79rem;color:var(--gold);}
.plrat span{color:var(--muted);}
.plfoot{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-top:1px solid var(--border);}
.pldur{font-size:0.74rem;color:var(--muted);}
.addbt{background:var(--night);color:var(--cream);border:none;border-radius:30px;padding:6px 15px;font-size:0.78rem;cursor:pointer;transition:all 0.18s;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;}
.addbt:hover{background:var(--green2);}
.addbt.added{background:var(--green2);}

/* SIDEBAR */
.sb{background:var(--night);border-radius:var(--r);padding:22px 18px;position:sticky;top:74px;color:var(--cream);}
.sbt{font-family:'Fraunces',serif;font-size:1.2rem;margin-bottom:3px;}
.sbs{font-size:0.74rem;color:rgba(250,248,244,0.36);margin-bottom:15px;}
.il{list-style:none;min-height:44px;}
.ii{background:rgba(250,248,244,0.07);border-radius:8px;padding:9px 11px;display:flex;align-items:center;justify-content:space-between;font-size:0.82rem;margin-bottom:6px;}
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
.tl{display:flex;flex-direction:column;}
.tlb{display:grid;grid-template-columns:82px 1fr;gap:0 18px;}
.ttc{text-align:right;padding-top:18px;position:relative;}
.ttime{font-size:0.79rem;font-weight:600;color:var(--rust);white-space:nowrap;}
.tdur{font-size:0.66rem;color:var(--muted);margin-top:1px;}
.tline{position:absolute;right:-10px;top:24px;bottom:-24px;width:2px;background:var(--border);}
.tdot{position:absolute;right:-16px;top:18px;width:12px;height:12px;border-radius:50%;background:var(--rust);border:3px solid var(--cream);box-shadow:0 0 0 2px var(--rust);z-index:1;}
.tcc{padding:12px 0 22px;}
.tcard{background:var(--card);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);display:flex;}
.tcimg{width:105px;min-width:105px;height:105px;overflow:hidden;background:var(--warm);display:flex;align-items:center;justify-content:center;font-size:1.8rem;}
.tcimg img{width:100%;height:100%;object-fit:cover;display:block;}
.tcb{padding:14px;flex:1;}
.tctype{font-size:0.64rem;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:2px;}
.tcname{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:600;margin-bottom:4px;}
.tcdesc{font-size:0.8rem;color:var(--muted);line-height:1.55;}
.tcmeta{font-size:0.75rem;color:var(--gold);margin-top:6px;}
.trvl{display:grid;grid-template-columns:82px 1fr;gap:0 18px;}
.trvli{font-size:0.74rem;color:var(--muted);padding:3px 0;display:flex;align-items:center;gap:5px;}

/* PROFILE */
.prof{padding:42px 5vw 68px;max-width:1160px;margin:0 auto;}
.ph{display:flex;align-items:center;gap:16px;margin-bottom:36px;}
.pavl{width:64px;height:64px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:white;font-weight:700;}
.pname{font-family:'Fraunces',serif;font-size:1.85rem;}
.psub{color:var(--muted);font-size:0.85rem;margin-top:3px;}
.secttitle{font-family:'Fraunces',serif;font-size:1.5rem;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.sbadge{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.71rem;background:var(--green);color:white;border-radius:20px;padding:2px 8px;}
.stats{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:36px;}
.stc{background:var(--card);border-radius:var(--r);padding:17px 20px;box-shadow:var(--sh);flex:1;min-width:120px;}
.stn{font-family:'Fraunces',serif;font-size:2.2rem;color:var(--green);font-weight:700;}
.stl{font-size:0.77rem;color:var(--muted);margin-top:2px;}
.wmap{background:var(--night);border-radius:var(--r);height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;margin-bottom:36px;position:relative;overflow:hidden;}
.wdots{position:absolute;inset:0;padding:18px;display:flex;flex-wrap:wrap;gap:18px;align-content:flex-start;pointer-events:none;}
.wd{width:8px;height:8px;border-radius:50%;background:var(--green2);box-shadow:0 0 6px var(--green2);}
.hgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(265px,1fr));gap:13px;margin-bottom:36px;}
.hcard{background:var(--card);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);transition:all 0.2s;cursor:pointer;}
.hcard:hover{transform:translateY(-2px);box-shadow:var(--shm);}
.himg{width:100%;height:130px;background:var(--warm);display:flex;align-items:center;justify-content:center;font-size:2.2rem;overflow:hidden;}
.himg img{width:100%;height:100%;object-fit:cover;display:block;}
.hbody{padding:14px;}
.hcity{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:600;}
.hdate{font-size:0.75rem;color:var(--muted);margin-top:2px;}
.hstops{font-size:0.79rem;color:var(--green2);margin-top:4px;font-weight:600;}

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

const BUDGETS = [
  { id:"free", tier:"$", label:"Free & Budget", range:"$0–$25/person", desc:"Parks, free museums, street food & hidden gems.", color:"#2d6a4f" },
  { id:"mid", tier:"$$", label:"Mid-Range", range:"$25–$75/person", desc:"Casual dining, paid attractions & comfortable experiences.", color:"#d4a017" },
  { id:"upscale", tier:"$$$", label:"Upscale", range:"$75–$150/person", desc:"Nicer restaurants, private tours & premium venues.", color:"#7b5ea7" },
  { id:"luxury", tier:"$$$$", label:"Luxury", range:"$150+/person", desc:"Fine dining, exclusive experiences & VIP access.", color:"#bc4749" },
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
  {city:"New York City",country:"United States",flag:"🇺🇸"},
  {city:"Paris",country:"France",flag:"🇫🇷"},
  {city:"Tokyo",country:"Japan",flag:"🇯🇵"},
  {city:"London",country:"United Kingdom",flag:"🇬🇧"},
  {city:"Rome",country:"Italy",flag:"🇮🇹"},
  {city:"Barcelona",country:"Spain",flag:"🇪🇸"},
  {city:"Kyoto",country:"Japan",flag:"🇯🇵"},
  {city:"Amsterdam",country:"Netherlands",flag:"🇳🇱"},
  {city:"Chicago",country:"United States",flag:"🇺🇸"},
  {city:"Sydney",country:"Australia",flag:"🇦🇺"},
  {city:"Dubai",country:"UAE",flag:"🇦🇪"},
  {city:"Lisbon",country:"Portugal",flag:"🇵🇹"},
  {city:"Prague",country:"Czech Republic",flag:"🇨🇿"},
  {city:"Nashville",country:"United States",flag:"🇺🇸"},
  {city:"New Orleans",country:"United States",flag:"🇺🇸"},
  {city:"Charlottesville",country:"United States",flag:"🇺🇸"},
  {city:"Mexico City",country:"Mexico",flag:"🇲🇽"},
  {city:"Bali",country:"Indonesia",flag:"🇮🇩"},
  {city:"Istanbul",country:"Turkey",flag:"🇹🇷"},
  {city:"Buenos Aires",country:"Argentina",flag:"🇦🇷"},
];

const MOCK = [
  {id:1,name:"Central Park",type:"Park",rating:4.8,reviews:42300,emoji:"🌳",desc:"An iconic 843-acre urban oasis offering lakes, meadows, and world-famous skyline views.",duration:90,lat:40.7851,lng:-73.9683,priceLevel:0},
  {id:2,name:"Metropolitan Museum of Art",type:"Museum",rating:4.9,reviews:31000,emoji:"🎨",desc:"One of the world's great art museums, spanning 5,000 years of civilizations.",duration:120,lat:40.7794,lng:-73.9632,priceLevel:1},
  {id:3,name:"Brooklyn Bridge",type:"Landmark",rating:4.8,reviews:55000,emoji:"🌉",desc:"Walk this iconic 1883 suspension bridge for sweeping views of the Manhattan skyline.",duration:45,lat:40.7061,lng:-73.9969,priceLevel:0},
  {id:4,name:"Katz's Delicatessen",type:"Restaurant",rating:4.5,reviews:12000,emoji:"🥪",desc:"A legendary NYC institution since 1888, famous for its world-class pastrami sandwich.",duration:60,lat:40.7223,lng:-73.9874,priceLevel:2},
  {id:5,name:"Times Square",type:"Landmark",rating:4.5,reviews:98000,emoji:"🌆",desc:"The neon-lit, electric heart of Manhattan — overwhelming and utterly unforgettable.",duration:45,lat:40.758,lng:-73.9855,priceLevel:0},
  {id:6,name:"The High Line",type:"Park",rating:4.7,reviews:29000,emoji:"🌿",desc:"A 1.45-mile elevated park on a former rail line with curated gardens and Hudson views.",duration:75,lat:40.748,lng:-74.0048,priceLevel:0},
  {id:7,name:"Museum of Modern Art",type:"Museum",rating:4.7,reviews:22000,emoji:"🖼️",desc:"MoMA houses an extraordinary modern art collection from Picasso to Warhol to Basquiat.",duration:120,lat:40.7614,lng:-73.9776,priceLevel:2},
  {id:8,name:"Smorgasburg",type:"Food Market",rating:4.6,reviews:8900,emoji:"🍜",desc:"Brooklyn's beloved open-air food market with 100+ local vendors every weekend.",duration:90,lat:40.7223,lng:-73.9592,priceLevel:1},
];

function purl(ref) {
  if (!ref || !GOOGLE_KEY || GOOGLE_KEY === "PASTE_YOUR_GOOGLE_KEY_HERE") return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${GOOGLE_KEY}`;
}

function ft(h, m) {
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hh}:${String(m).padStart(2,"0")} ${ap}`;
}

function useToast() {
  const [msg, setMsg] = useState(""); const [vis, setVis] = useState(false); const t = useRef();
  const show = m => { setMsg(m); setVis(true); clearTimeout(t.current); t.current = setTimeout(() => setVis(false), 2500); };
  return { msg, vis, show };
}

async function aiDescs(places, city, budget, prefs) {
  if (!ANTHROPIC_KEY || ANTHROPIC_KEY === "PASTE_YOUR_ANTHROPIC_KEY_HERE") return null;
  const list = places.map((p,i) => `${i+1}. ${p.name} (${p.type})`).join("\n");
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Write vivid 1-2 sentence travel descriptions for each place in ${city}. Budget: ${budget||"moderate"}. Interests: ${prefs||"general"}.\n${list}\nRespond ONLY as JSON array: [{"id":1,"desc":"..."}]`}]})
    });
    const d = await r.json();
    return JSON.parse(d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim());
  } catch { return null; }
}

function exportPDF(city, itin, budget) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) { alert("jsPDF not loaded. Check public/index.html has the CDN script."); return; }
  const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(13,17,23); doc.rect(0,0,W,36,"F");
  doc.setFont("times","italic"); doc.setFontSize(22); doc.setTextColor(250,248,244); doc.text("Mapistry2",14,20);
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(180,170,155); doc.text("Your personal travel planner",14,28);
  doc.setFont("times","bold"); doc.setFontSize(18); doc.setTextColor(13,17,23); doc.text(`A Day in ${city}`,14,50);
  if(budget){doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(107,114,128);doc.text(`Budget: ${budget}`,14,58);}
  let y=68,h=9,m=0;
  itin.forEach((p,i)=>{
    if(y>250){doc.addPage();y=20;}
    const ts=ft(h,m),eH=h+Math.floor((m+p.duration)/60),eM=(m+p.duration)%60,te=ft(eH,eM);
    doc.setFillColor(188,71,73);doc.roundedRect(14,y-4,40,8,4,4,"F");
    doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(255,255,255);doc.text(`${ts} – ${te}`,17,y+1.5);
    y+=10;doc.setFont("times","bold");doc.setFontSize(13);doc.setTextColor(13,17,23);doc.text(p.name,14,y);y+=6;
    doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(107,114,128);doc.text(`${p.type}  ·  ★ ${p.rating}  ·  ~${p.duration} min`,14,y);y+=6;
    doc.setFontSize(9);doc.setTextColor(60,60,60);const lines=doc.splitTextToSize(p.desc,W-28);doc.text(lines,14,y);y+=lines.length*5+4;
    if(i<itin.length-1){const tr=15+((i*7)%12);doc.setFont("helvetica","italic");doc.setFontSize(8);doc.setTextColor(180,170,155);doc.text(`  ~${tr} min travel to next stop`,14,y);y+=8;h=eH+Math.floor((eM+tr)/60);m=(eM+tr)%60;}
    doc.setDrawColor(229,231,235);doc.line(14,y,W-14,y);y+=8;
  });
  const pg=doc.internal.getNumberOfPages();
  for(let i=1;i<=pg;i++){doc.setPage(i);doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(107,114,128);doc.text(`Mapistry2  ·  Page ${i} of ${pg}`,W/2,290,{align:"center"});}
  doc.save(`mapistry2-${city.replace(/\s+/g,"-").toLowerCase()}.pdf`);
}

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
  const [conds, setConds] = useState({});
  const [places, setPlaces] = useState(MOCK);
  const [itin, setItin] = useState([]);
  const [descs, setDescs] = useState(null);
  const [aiUsed, setAiUsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lmsg, setLmsg] = useState("");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [amode, setAmode] = useState("login");
  const [aform, setAform] = useState({name:"",email:"",password:""});
  const [showProf, setShowProf] = useState(false);
  const [hist, setHist] = useState([]);
  const toast = useToast();
  const sref = useRef();

  const hasKey = GOOGLE_KEY && GOOGLE_KEY !== "PASTE_YOUR_GOOGLE_KEY_HERE";

  useEffect(()=>{
    const u=localStorage.getItem("m2_user");
    const h=localStorage.getItem("m2_hist");
    if(u) setUser(JSON.parse(u));
    if(h) setHist(JSON.parse(h));
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

  function handleAuth(e){
    e.preventDefault();
    if(amode==="signup"&&!aform.name){toast.show("Please enter your name");return;}
    if(!aform.email){toast.show("Please enter your email");return;}
    const u={name:aform.name||aform.email.split("@")[0],email:aform.email,joined:new Date().toLocaleDateString()};
    setUser(u);localStorage.setItem("m2_user",JSON.stringify(u));
    setShowAuth(false);toast.show(`Welcome${amode==="signup"?" to Mapistry2":"back"}, ${u.name}! 👋`);
  }

  function logout(){setUser(null);localStorage.removeItem("m2_user");setShowProf(false);toast.show("Logged out");}

  function addCpref(){
    const v=cpinput.trim();if(!v)return;
    if(cprefs.includes(v)){toast.show("Already added!");return;}
    setCprefs(c=>[...c,v]);setCpinput("");
  }

  async function fetchPlaces(c) {
    if (!hasKey) return MOCK;
    try {
      const allP=[...prefs,...cprefs];
      const q=allP.length>0?`${allP.join(" and ")} in ${c}`:`top attractions in ${c}`;
      // Use a CORS proxy so the request works from the browser
      const url=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&key=${GOOGLE_KEY}`;
      const res=await fetch(url);
      const data=await res.json();
      if(data.results?.length>0){
        return data.results.slice(0,9).map((p,i)=>({
          id:i+1,name:p.name,
          type:(p.types?.[0]||"attraction").replace(/_/g," "),
          rating:p.rating||4.0,reviews:p.user_ratings_total||0,
          emoji:"📍",desc:p.formatted_address||"",duration:60,
          lat:p.geometry.location.lat,lng:p.geometry.location.lng,
          photoRef:p.photos?.[0]?.photo_reference||null,
          priceLevel:p.price_level??1,
        }));
      }
    } catch(e){ console.log("Places fetch error:",e); }
    return MOCK;
  }

  async function goToResults(){
    const c=cin.trim();if(!c){toast.show("Please enter a city or town!");return;}
    setCity(c);setLmsg(`Finding the best spots in ${c}…`);setLoading(true);
    const p=await fetchPlaces(c);
    setPlaces(p);setLoading(false);setStep(3);
  }

  async function goToItinerary(){
    if(itin.length===0){toast.show("Add at least one place first!");return;}
    setLmsg("Crafting your perfect day…");setLoading(true);
    let d=null;
    if(ANTHROPIC_KEY&&ANTHROPIC_KEY!=="PASTE_YOUR_ANTHROPIC_KEY_HERE"){
      setLmsg("✨ AI is personalizing your itinerary…");
      const allP=[...prefs,...cprefs].join(", ");
      d=await aiDescs(itin,city,budget?BUDGETS.find(b=>b.id===budget)?.label:null,allP);
      if(d)setAiUsed(true);
    }
    setDescs(d);await new Promise(r=>setTimeout(r,400));setLoading(false);setStep(4);
    if(user){
      const entry={id:Date.now(),city,date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),stops:itin.length,img:itin[0]?.photoRef?purl(itin[0].photoRef):null,emoji:itin[0]?.emoji||"📍",itinerary:itin.map(p=>p.name)};
      const nh=[entry,...hist].slice(0,20);setHist(nh);localStorage.setItem("m2_hist",JSON.stringify(nh));
    }
  }

  function getDesc(p){if(descs){const f=descs.find(d=>d.id===p.id);if(f)return f.desc;}return p.desc;}

  function renderTl(){
    let h=9,m=0;
    return itin.map((place,i)=>{
      const ts=ft(h,m),eH=h+Math.floor((m+place.duration)/60),eM=(m+place.duration)%60,te=ft(eH,eM),tr=15+((i*7)%12),isL=i===itin.length-1;
      if(!isL){h=eH+Math.floor((eM+tr)/60);m=(eM+tr)%60;}
      const img=place.photoRef?purl(place.photoRef):null;
      return(
        <div key={place.id}>
          <div className="tlb">
            <div className="ttc">
              <div className="ttime">{ts}</div><div className="tdur">until {te}</div>
              {!isL&&<div className="tline"/>}<div className="tdot"/>
            </div>
            <div className="tcc">
              <div className="tcard">
                <div className="tcimg">{img?<img src={img} alt={place.name} onError={e=>{e.target.parentElement.innerHTML=place.emoji;}}/>:<span>{place.emoji}</span>}</div>
                <div className="tcb">
                  <div className="tctype">{place.type}</div>
                  <div className="tcname">{place.name}</div>
                  <div className="tcdesc">{getDesc(place)}</div>
                  <div className="tcmeta">★ {place.rating} · ~{place.duration} min</div>
                </div>
              </div>
            </div>
          </div>
          {!isL&&<div className="trvl"><div/><div className="trvli">🚶 ~{tr} min travel to next stop</div></div>}
        </div>
      );
    });
  }

  const blabel=budget?BUDGETS.find(b=>b.id===budget)?.label:null;
  const initials=user?user.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2):"";

  function goBack(){
    if(showProf){setShowProf(false);return;}
    if(step>1)setStep(step-1);
  }

  return(
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="nav np">
        <div className="nav-l">
          <div className="logo" onClick={()=>{setStep(1);setItin([]);setShowProf(false);setCin("");setCity("");}}>Map<em>istry</em>2</div>
          {(step>1||showProf)&&<button className="back" onClick={goBack}>← Back</button>}
        </div>
        <div className="nav-r">
          {city&&step>1&&!showProf&&<div className="nav-city">📍 {city}</div>}
          {step>1&&!showProf&&<div className="prog">{[1,2,3,4].map(s=><div key={s} className={`pd ${s===step?"on":s<step?"done":""}`}/>)}</div>}
          {user
            ?<button className="ubtn" onClick={()=>setShowProf(true)}><div className="uav">{initials}</div>{user.name.split(" ")[0]}</button>
            :<button className="ubtn" onClick={()=>{setAmode("login");setShowAuth(true);}}>👤 Sign In</button>
          }
        </div>
      </nav>

      {/* PROFILE */}
      {showProf&&user&&(
        <div className="prof">
          <div className="ph">
            <div className="pavl">{initials}</div>
            <div><div className="pname">{user.name}</div><div className="psub">{user.email} · Member since {user.joined}</div></div>
            <button className="obt" style={{marginLeft:"auto"}} onClick={logout}>Sign Out</button>
          </div>
          <div className="stats">
            <div className="stc"><div className="stn">{hist.length}</div><div className="stl">Trips planned</div></div>
            <div className="stc"><div className="stn">{hist.reduce((s,h)=>s+h.stops,0)}</div><div className="stl">Places visited</div></div>
            <div className="stc"><div className="stn">{new Set(hist.map(h=>h.city)).size}</div><div className="stl">Cities explored</div></div>
          </div>
          <div className="secttitle">🌍 Cities Explored <span className="sbadge">{new Set(hist.map(h=>h.city)).size}</span></div>
          <div className="wmap">
            {hist.length>0
              ?<><div className="wdots">{hist.slice(0,20).map((_,i)=><div key={i} className="wd"/>)}</div><span style={{color:"rgba(250,248,244,0.55)",zIndex:1}}>🗺️ {new Set(hist.map(h=>h.city)).size} cities explored</span></>
              :<><span style={{fontSize:"2rem"}}>🗺️</span><span style={{color:"rgba(250,248,244,0.35)"}}>Plan your first trip to see it here!</span></>
            }
          </div>
          <div className="secttitle">🧳 Past Itineraries <span className="sbadge">{hist.length}</span></div>
          {hist.length===0
            ?<div style={{color:"var(--muted)",textAlign:"center",padding:"36px 0"}}>No trips yet — go plan one! ✈️</div>
            :<div className="hgrid">{hist.map(h=>(
              <div key={h.id} className="hcard">
                <div className="himg">{h.img?<img src={h.img} alt={h.city} onError={e=>{e.target.parentElement.innerHTML=h.emoji;}}/>:<span>{h.emoji}</span>}</div>
                <div className="hbody"><div className="hcity">{h.city}</div><div className="hdate">{h.date}</div><div className="hstops">📍 {h.stops} stops · {h.itinerary?.slice(0,2).join(", ")}{h.stops>2?` +${h.stops-2} more`:""}</div></div>
              </div>
            ))}</div>
          }
        </div>
      )}

      {/* STEP 1 */}
      {!showProf&&step===1&&(
        <div className="hero">
          <div className="hero-bg"/><div className="hero-img"/><div className="hero-grad"/>
          <div className="hero-content">
            <div className="hero-tag">✦ Your personal travel planner</div>
            <h1 className="hero-h1">Plan your <em>perfect day</em>,<br/>anywhere.</h1>
            <p className="hero-sub">Enter any city or town — we'll build a real, personalized itinerary with actual photos from every spot.</p>
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
              {["🗽 New York City","🗼 Paris","🏯 Kyoto","🌉 San Francisco","🏛️ Rome","🎸 Nashville"].map(c=>(
                <div key={c} className="chip" onClick={()=>{const v=c.split(" ").slice(1).join(" ");setCin(v);setCity(v);setShowS(false);}}>{c}</div>
              ))}
            </div>
            {!hasKey&&(
              <div style={{marginTop:24,background:"rgba(212,160,23,0.15)",border:"1px solid rgba(212,160,23,0.3)",borderRadius:10,padding:"10px 18px",color:"rgba(250,248,244,0.7)",fontSize:"0.8rem",textAlign:"center",maxWidth:500}}>
                ⚠️ Open <strong>src/config.js</strong> and paste your Google API key to get real photos & places
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {!showProf&&step===2&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 2 of 4</div>
            <h2 className="st">What's your vibe in <span>{city}</span>?</h2>
            <p className="ss">Click categories or type your own. Set your exact budget and travel style for better results.</p>
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
      {!showProf&&step===3&&(
        <div className="page">
          <div className="sh">
            <div className="sey">Step 3 of 4</div>
            <h2 className="st">Best spots in <span>{city}</span></h2>
            <p className="ss">Hit <strong>Add</strong> to build your itinerary on the right.{blabel&&` Showing ${blabel} options.`}</p>
          </div>
          <div className="rl">
            <div>
              <div className="mapbox" style={{padding:0,border:"none"}}>
  <iframe
    width="100%"
    height="280"
    style={{border:0,borderRadius:"var(--r)"}}
    loading="lazy"
    allowFullScreen
    src={`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_KEY}&q=things+to+do+in+${encodeURIComponent(city)}&zoom=13`}
  />
</div>
              <div className="plgrid">
                {places.map(p=>{
                  const added=!!itin.find(x=>x.id===p.id);
                  const img=p.photoRef?purl(p.photoRef):null;
                  const pb=p.priceLevel===0?"Free":p.priceLevel===1?"$":p.priceLevel===2?"$$":p.priceLevel===3?"$$$":null;
                  return(
                    <div key={p.id} className={`plcard ${added?"added":""}`}>
                      <div className="plimg">
                        {img?<img src={img} alt={p.name} onError={e=>{e.target.parentElement.innerHTML=p.emoji;}} loading="lazy"/>:<span>{p.emoji}</span>}
                        {pb&&<div className="pbadge">{pb}</div>}
                      </div>
                      <div className="plbody">
                        <div className="pltype">{p.type}</div>
                        <div className="plname">{p.name}</div>
                        <div className="plrat">★ {p.rating} <span>({p.reviews.toLocaleString()} reviews)</span></div>
                      </div>
                      <div className="plfoot">
                        <div className="pldur">~{p.duration} min</div>
                        <button className={`addbt ${added?"added":""}`} onClick={()=>{setItin(it=>it.find(x=>x.id===p.id)?it.filter(x=>x.id!==p.id):[...it,p]);if(!added)toast.show(`"${p.name}" added!`);}}>{added?"✓ Added":"+ Add"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sb np">
              <div className="sbt">Your Itinerary</div>
              <div className="sbs">{itin.length} place{itin.length!==1?"s":""} added</div>
              <ul className="il">
                {itin.length===0
                  ?<div className="em">Add places to get started →</div>
                  :itin.map(p=>(
                    <li key={p.id} className="ii">
                      <div><div>{p.emoji} {p.name}</div><div className="iis">{p.type} · ~{p.duration} min</div></div>
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
      {!showProf&&step===4&&(
        <div className="page">
          <div className="ih">
            <div>
              <h2 className="imt">Your day in<br/><em>{city}</em></h2>
              <div className="iml">{[blabel,conds.group,conds.day,conds.pace].filter(Boolean).join("  ·  ")}{itin.length>0?`  ·  ${itin.length} stops`:""}</div>
              {aiUsed&&<div className="aib">✦ AI-personalized descriptions</div>}
            </div>
            <div className="iac np">
              <button className="obt" onClick={()=>setStep(3)}>← Edit Places</button>
              <button className="dbt" onClick={()=>exportPDF(city,itin,blabel)}>⬇ Export PDF</button>
            </div>
          </div>
          <div className="tl">{renderTl()}</div>
        </div>
      )}

      {/* AUTH */}
      {showAuth&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setShowAuth(false)}>
          <div className="modal">
            <button className="mc" onClick={()=>setShowAuth(false)}>✕</button>
            <div className="mt">{amode==="login"?"Welcome back":"Create account"}</div>
            <div className="ms">{amode==="login"?"Sign in to save trips and view your travel history.":"Join to save itineraries and track your adventures."}</div>
            <form onSubmit={handleAuth}>
              {amode==="signup"&&<div className="fg"><label className="fl">Full Name</label><input className="fi" placeholder="Your name" value={aform.name} onChange={e=>setAform(f=>({...f,name:e.target.value}))}/></div>}
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="you@email.com" value={aform.email} onChange={e=>setAform(f=>({...f,email:e.target.value}))}/></div>
              <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={aform.password} onChange={e=>setAform(f=>({...f,password:e.target.value}))}/></div>
              <button className="bf" type="submit">{amode==="login"?"Sign In":"Create Account"}</button>
            </form>
            <div className="asw">{amode==="login"?<>No account? <span onClick={()=>setAmode("signup")}>Sign up free</span></>:<>Have an account? <span onClick={()=>setAmode("login")}>Sign in</span></>}</div>
          </div>
        </div>
      )}

      {loading&&<div className="ls"><div className="spin"/><div className="lt">{lmsg}</div></div>}
      <div className="toast" style={{opacity:toast.vis?1:0}}>{toast.msg}</div>
    </>
  );
}
