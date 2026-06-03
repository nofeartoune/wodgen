import { useState, useEffect, useRef } from "react";

const THEMES = {
  dark:  { bg:"#0d0f0e",surf:"#151918",card:"#1a1f1d",brd:"#2a3330",acc:"#c8f54a",teal:"#2dc897",coral:"#ff6b47",blue:"#4a9eff",tx:"#f0f5f2",txs:"#7a9990",txm:"#3d5550",shadow:"0 2px 12px #00000040" },
  light: { bg:"#f2f5f1",surf:"#ffffff",card:"#ffffff",brd:"#dde8e4",acc:"#5a8a00",teal:"#1a8a6a",coral:"#d44a28",blue:"#2266cc",tx:"#1a2420",txs:"#4a6660",txm:"#9ab8b0",shadow:"0 2px 12px #0000001a" },
};

const DB = {
  warmup:[
    {name:"Rameur",detail:"3 min cardio léger"},{name:"Vélo Assault",detail:"3 min intensité modérée"},
    {name:"Corde à sauter",detail:"2 min simple/double-under"},{name:"Air Squat",detail:"2 × 15 reps"},
    {name:"Inchworms",detail:"2 × 8 reps"},{name:"Cercles épaules",detail:"2 × 10 reps"},
    {name:"Hip circles",detail:"2 × 10 reps/côté"},{name:"Leg swings",detail:"2 × 12 reps/jambe"},
    {name:"PVC pass-through",detail:"2 × 10 reps"},{name:"Lunge + twist",detail:"2 × 8 reps"},
    {name:"Samson stretch",detail:"30 sec/côté"},{name:"Bear crawl",detail:"2 × 10m A/R"},
    {name:"Glute bridge",detail:"2 × 15 reps"},{name:"Cat-cow",detail:"2 × 10 reps"},
    {name:"Thoracic rotation",detail:"2 × 8 reps/côté"},{name:"Burpee léger",detail:"2 × 5 reps"},
  ],
  cooldown:[
    {name:"Pigeon pose",detail:"45 sec/côté"},{name:"Ischio-jambiers",detail:"30 sec/jambe"},
    {name:"Étirement pectoraux",detail:"30 sec/côté"},{name:"Child's pose",detail:"45 sec"},
    {name:"Couch stretch",detail:"45 sec/côté"},{name:"Supine twist",detail:"30 sec/côté"},
    {name:"Downward dog",detail:"45 sec"},{name:"Shoulder cross stretch",detail:"30 sec/côté"},
    {name:"Foam roller dos",detail:"60 sec"},{name:"Hip flexor stretch",detail:"40 sec/côté"},
    {name:"Wrist circles",detail:"30 sec"},{name:"Doorway chest stretch",detail:"30 sec/côté"},
  ],
  strength:{
    "Tout le corps":[
      {name:"Power Clean",rm:"Clean",pct:[70,75,80,85],sets:"5",reps:"3"},
      {name:"Hang Power Snatch",rm:"Snatch",pct:[65,70,75,80],sets:"5",reps:"3"},
      {name:"Clean & Jerk",rm:"Clean",pct:[75,80,85,90],sets:"4",reps:"2"},
      {name:"Power Snatch",rm:"Snatch",pct:[70,75,80,85],sets:"5",reps:"2"},
      {name:"Clean Pull",rm:"Clean",pct:[90,95,100,105],sets:"4",reps:"3"},
    ],
    "Bas du corps":[
      {name:"Back Squat",rm:"Back Squat",pct:[70,75,80,85],sets:"5",reps:"5"},
      {name:"Front Squat",rm:"Front Squat",pct:[65,70,75,80],sets:"4",reps:"6"},
      {name:"Romanian Deadlift",rm:"Deadlift",pct:[60,65,70,75],sets:"4",reps:"8"},
      {name:"Deadlift",rm:"Deadlift",pct:[70,75,80,85],sets:"5",reps:"3"},
      {name:"Pause Squat",rm:"Back Squat",pct:[60,65,70,75],sets:"4",reps:"4"},
      {name:"Bulgarian Split Squat",rm:null,load:{b:"20kg",i:"30kg",r:"40kg",e:"50kg"},sets:"3",reps:"8/jambe"},
    ],
    "Haut du corps":[
      {name:"Strict Press",rm:"Press",pct:[70,75,80,85],sets:"5",reps:"5"},
      {name:"Push Press",rm:"Press",pct:[80,85,90,95],sets:"4",reps:"4"},
      {name:"Bench Press",rm:"Bench Press",pct:[70,75,80,85],sets:"4",reps:"6"},
      {name:"Pendlay Row",rm:null,load:{b:"40kg",i:"60kg",r:"80kg",e:"100kg"},sets:"4",reps:"5"},
      {name:"Weighted Pull-up",rm:null,load:{b:"BW",i:"+5kg",r:"+10kg",e:"+20kg"},sets:"4",reps:"5"},
    ],
    "Core / Abs":[
      {name:"Strict Toes-to-Bar",rm:null,load:{b:"BW",i:"BW",r:"BW",e:"BW"},sets:"4",reps:"10"},
      {name:"GHD Sit-up",rm:null,load:{b:"BW",i:"BW",r:"BW",e:"BW"},sets:"4",reps:"15"},
      {name:"Hollow Hold",rm:null,load:{b:"30s",i:"40s",r:"50s",e:"60s"},sets:"4",reps:""},
      {name:"Ab Wheel",rm:null,load:{b:"BW",i:"BW",r:"BW",e:"BW"},sets:"4",reps:"10"},
    ],
    "Postérieure":[
      {name:"Deadlift",rm:"Deadlift",pct:[75,80,85,90],sets:"5",reps:"3"},
      {name:"Sumo Deadlift",rm:"Deadlift",pct:[70,75,80,85],sets:"4",reps:"5"},
      {name:"Glute Ham Raise",rm:null,load:{b:"BW",i:"BW",r:"+5kg",e:"+10kg"},sets:"4",reps:"8"},
      {name:"KB Swing lourd",rm:null,load:{b:"16kg",i:"24kg",r:"32kg",e:"40kg"},sets:"5",reps:"10"},
    ],
    "Épaules / Bras":[
      {name:"Strict Press",rm:"Press",pct:[72,77,82,87],sets:"5",reps:"4"},
      {name:"Z-press",rm:"Press",pct:[55,60,65,70],sets:"4",reps:"6"},
      {name:"HSPU Strict",rm:null,load:{b:"box pike",i:"BW",r:"BW",e:"+5kg"},sets:"4",reps:"5"},
      {name:"Single Arm DB Press",rm:null,load:{b:"10kg",i:"16kg",r:"22kg",e:"30kg"},sets:"4",reps:"8"},
    ],
  },
  wod:{
    gymnastics:[
      {name:"Pull-up",load:{b:"Ring Row",i:"Banded",r:"Strict",e:"C2B"}},
      {name:"Toes-to-Bar",load:{b:"Knee Raise",i:"K2E",r:"T2B",e:"Strict T2B"}},
      {name:"HSPU",load:{b:"Box Pike",i:"Kipping",r:"Strict",e:"Déficit 10cm"}},
      {name:"Muscle-up Barre",load:{b:"Jumping MU",i:"Banded MU",r:"MU",e:"Strict MU"}},
      {name:"Muscle-up Anneaux",load:{b:"Jumping MU",i:"Banded MU",r:"MU",e:"Strict MU"}},
      {name:"Rope Climb",load:{b:"Laying",i:"3 tours",r:"15ft",e:"15ft L-sit"}},
      {name:"Ring Dip",load:{b:"Box Dip",i:"Banded",r:"Strict",e:"+10kg"}},
      {name:"Box Jump",load:{b:"50cm",i:"60cm",r:"75cm",e:"90cm"}},
      {name:"Double-under",load:{b:"Simple ×3",i:"50 DU",r:"Unbroken",e:"Triple under"}},
      {name:"Handstand Walk",load:{b:"10m mur",i:"5m libre",r:"10m",e:"15m"}},
    ],
    weightlifting:[
      {name:"Power Clean",load:{b:"40kg",i:"60kg",r:"80kg",e:"100kg"}},
      {name:"Thruster",load:{b:"30kg",i:"42kg",r:"52kg",e:"65kg"}},
      {name:"Clean & Jerk",load:{b:"40kg",i:"60kg",r:"80kg",e:"102kg"}},
      {name:"Power Snatch",load:{b:"30kg",i:"45kg",r:"60kg",e:"75kg"}},
      {name:"Push Jerk",load:{b:"35kg",i:"52kg",r:"70kg",e:"90kg"}},
      {name:"Deadlift",load:{b:"60kg",i:"90kg",r:"120kg",e:"150kg"}},
      {name:"Wall Ball",load:{b:"6kg",i:"9kg",r:"9kg",e:"10kg"}},
      {name:"KB Swing américain",load:{b:"12kg",i:"16kg",r:"24kg",e:"32kg"}},
      {name:"Overhead Squat",load:{b:"25kg",i:"40kg",r:"55kg",e:"70kg"}},
      {name:"Hang Power Clean",load:{b:"35kg",i:"52kg",r:"70kg",e:"90kg"}},
      {name:"Sled Push",load:{b:"40kg",i:"80kg",r:"120kg",e:"160kg"}},
      {name:"Sled Pull",load:{b:"40kg",i:"70kg",r:"100kg",e:"140kg"}},
      {name:"Farmers Carry",load:{b:"20kg/m",i:"32kg/m",r:"48kg/m",e:"64kg/m"}},
    ],
    cardio:[
      {name:"Burpee",load:{b:"BW",i:"BW",r:"Bar-facing",e:"Bar-facing"}},
      {name:"Box Jump Over",load:{b:"50cm",i:"60cm",r:"75cm",e:"90cm"}},
      {name:"Row (Cal)",load:{b:"Cal",i:"Cal",r:"Cal",e:"Cal"}},
      {name:"Assault Bike (Cal)",load:{b:"Cal",i:"Cal",r:"Cal",e:"Cal"}},
      {name:"Run 400m",load:{b:"200m",i:"400m",r:"400m",e:"400m"}},
      {name:"Burpee Box Jump",load:{b:"50cm",i:"60cm",r:"60cm",e:"75cm"}},
      {name:"Mountain Climber",load:{b:"20",i:"30",r:"40",e:"50"}},
      {name:"Ski Erg (Cal)",load:{b:"Cal",i:"Cal",r:"Cal",e:"Cal"}},
    ],
    core:[
      {name:"Toes-to-Bar",load:{b:"Knee Raise",i:"K2E",r:"T2B",e:"Strict T2B"}},
      {name:"GHD Sit-up",load:{b:"Ab-mat",i:"Ab-mat",r:"GHD",e:"GHD pondéré"}},
      {name:"V-up",load:{b:"Tuck-up",i:"V-up",r:"V-up",e:"Pondéré"}},
      {name:"Hollow Rock",load:{b:"Hold 20s",i:"10 reps",r:"20 reps",e:"30 reps"}},
      {name:"Ab Wheel",load:{b:"Genoux",i:"BW",r:"BW",e:"Pieds élevés"}},
    ],
  },
};

const LK=["b","i","r","e"];
const LI={beginner:0,intermediate:1,rx:2,elite:3};
const LEVELS={beginner:{l:"Beginner",d:"Débutant, formes à apprendre"},intermediate:{l:"Intermediate",d:"1–2 ans de CrossFit"},rx:{l:"RX",d:"Rx complet, bonne technique"},elite:{l:"Elite",d:"Compétition, full charge"}};
const MUSCLES=["Tout le corps","Haut du corps","Bas du corps","Core / Abs","Postérieure","Épaules / Bras"];
const WOD_TYPES=["AMRAP","EMOM","For Time","Tabata","Chipper"];
const WOD_TYPES_RANDOM="🎲 Aléatoire";
const SK="wod_history_v4",RK="wod_1rm_v2",PK="wod_prefs_v3",TK="wod_theme_v1";

const pick=(arr,n)=>{const c=[...arr],o=[];while(o.length<n&&c.length){const i=Math.floor(Math.random()*c.length);o.push(c.splice(i,1)[0]);}return o;};
const loadS=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}};
const saveS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const fmtDate=iso=>new Date(iso).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"});
const fmtTime=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function generateAlgo({level,muscles,wodType,forceRatio,cardioRatio,duration,oneRMs}){
  const li=LI[level],lk=LK[li];
  const warmup={duration:10,exercises:pick(DB.warmup,5).map(e=>({name:e.name,detail:e.detail}))};
  const focusKey=muscles.includes("Tout le corps")?"Tout le corps":muscles.find(m=>DB.strength[m])||"Tout le corps";
  const strPool=DB.strength[focusKey]||DB.strength["Tout le corps"];
  const numStr=forceRatio>=70?3:forceRatio>=40?2:1;
  const strExercises=pick(strPool,numStr).map(e=>{
    let loadStr;
    if(e.rm&&oneRMs[e.rm]>0){const pct=e.pct[li];const kg=Math.round(oneRMs[e.rm]*pct/100/2.5)*2.5;loadStr=`${kg}kg (${pct}% 1RM)`;}
    else if(e.rm){loadStr=`${e.pct[li]}% 1RM`;}
    else{loadStr=e.load[lk];}
    return{name:e.name,sets:e.sets,reps:e.reps,load:loadStr};
  });
  const strDuration=Math.round(duration*(forceRatio/200+0.2));
  let pool=[];
  if(muscles.includes("Tout le corps")||muscles.includes("Haut du corps"))pool=[...pool,...DB.wod.gymnastics,...DB.wod.weightlifting];
  if(muscles.includes("Bas du corps")||muscles.includes("Postérieure"))pool=[...pool,...DB.wod.weightlifting];
  if(muscles.includes("Core / Abs"))pool=[...pool,...DB.wod.core];
  if(muscles.includes("Épaules / Bras"))pool=[...pool,...DB.wod.gymnastics,...DB.wod.weightlifting];
  if(pool.length===0)pool=[...DB.wod.gymnastics,...DB.wod.weightlifting];
  const cardioCount=cardioRatio>=70?2:cardioRatio>=40?1:0;
  const mainEx=pick(pool,4-cardioCount);
  const cardioEx=pick(DB.wod.cardio,cardioCount);
  const wodExercises=[...mainEx,...cardioEx].map(e=>{
    const loadVal=e.load[lk];
    const reps=wodType==="EMOM"?`${8+li*2} reps`:wodType==="Tabata"?"Max reps":`${10+li*2} reps`;
    return{name:e.name,reps,load:loadVal};
  });
  const wodDuration=duration-10-strDuration-5;
  let format,rxLoad="Charges RX",scaledLoad="Charges réduites 20–30%";
  if(wodType==="AMRAP"){format=`AMRAP ${wodDuration} min`;}
  else if(wodType==="EMOM"){format=`EMOM ${Math.min(wodDuration,15)} min`;scaledLoad="Allègement si besoin";}
  else if(wodType==="For Time"){format=`${li>=2?5:3} Rounds For Time`;}
  else if(wodType==="Tabata"){format="Tabata — 8 × (20s / 10s)";rxLoad="Intensité max";scaledLoad="Intensité modérée";}
  else{format="Chipper — 1 Round For Time";}
  const tips=["Garde la barre proche du corps sur tes mouvements d'haltérophilie.","Commence conservateur — pace-toi sur les 3 premiers rounds.","Respiration : expire à l'effort, inspire à la récupération.","Brace ton core à chaque rep de soulevé de terre.","Sur le EMOM, note ton score dès le départ et maintiens-le.","Broken sets > no reps : mieux vaut 3+3+4 que de tomber à 0.","Sur les mouvements overhead, lock tes scapulas avant de soulever.","Hydrate-toi entre les blocs force et WOD.","Sur le Tabata, les 3 derniers rounds sont les plus importants.","Log ton score immédiatement après le WOD."];
  const adjs=["IRON","FIRE","STORM","ALPHA","BEAST","FORGE","APEX","FURY","TITAN","BLAZE","GRIND","PEAK"];
  const nouns=["PROTOCOL","SESSION","CIRCUIT","COMPLEX","SERIES","SEQUENCE","CYCLE","MATRIX","LOOP","FLOW"];
  return{
    title:`${adjs[Math.floor(Math.random()*adjs.length)]} ${nouns[Math.floor(Math.random()*nouns.length)]}`,
    warmup,
    strength:{duration:strDuration,focus:`${focusKey} — ${forceRatio}% intensité`,exercises:strExercises},
    wod:{type:wodType,duration:wodDuration,format,rx_load:rxLoad,scaled_load:scaledLoad,exercises:wodExercises},
    cooldown:{duration:5,exercises:pick(DB.cooldown,4)},
    coaching_tip:tips[Math.floor(Math.random()*tips.length)],
    _generated:"algo",
  };
}

async function enhanceWithAI(wod,level,muscles,oneRMs){
  const rmText=Object.entries(oneRMs).filter(([,v])=>v>0).map(([k,v])=>`${k}: ${v}kg`).join(", ");
  const prompt=`Tu es un coach CrossFit expert. Améliore ce WOD et renvoie UNIQUEMENT le JSON valide (pas de markdown, pas de texte avant/après).

WOD actuel:
${JSON.stringify(wod,null,2)}

Paramètres:
- Niveau: ${LEVELS[level].l}
- Focus: ${muscles.join(", ")}
- 1RM: ${rmText||"non renseignés"}

Instructions:
1. Garde la structure JSON identique
2. Affine les charges selon le niveau et les 1RM
3. Améliore le coaching_tip avec un conseil précis lié aux exercices
4. Rends le title plus accrocheur (2-3 mots, majuscules)
5. Assure-toi que les exercices sont cohérents avec le focus musculaire

Retourne le JSON complet.`;
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  const text=data.content?.find(b=>b.type==="text")?.text||"";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

const makeCSS=T=>`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;background:${T.bg};color:${T.tx};font-family:'DM Sans',sans-serif;transition:background .25s,color .25s}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.brd};border-radius:2px}
.app{display:flex;flex-direction:column;height:100dvh;max-width:430px;margin:0 auto;overflow:hidden;position:relative;background:${T.bg}}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:max(16px, env(safe-area-inset-top)) 20px 10px;flex-shrink:0}
.logo{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;color:${T.acc}}
.logo span{color:${T.txs}}
.topbar-right{display:flex;align-items:center;gap:8px}
.level-pill{background:${T.card};border:1px solid ${T.brd};border-radius:20px;padding:5px 12px;font-size:12px;font-weight:500;color:${T.teal};cursor:pointer;font-family:'DM Sans',sans-serif}
.theme-btn{width:32px;height:32px;border-radius:50%;border:1px solid ${T.brd};background:${T.card};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}
.screen{flex:1;overflow-y:auto;padding:0 16px 16px}
.nav{display:flex;background:${T.surf};border-top:1px solid ${T.brd};flex-shrink:0}
.nb{flex:1;padding:10px 4px 14px;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:transparent;cursor:pointer;color:${T.txm};font-size:10px;font-family:'DM Sans',sans-serif;transition:color .15s}
.nb.active{color:${T.acc}}
.nb svg{width:22px;height:22px;stroke-width:1.8}
.card{background:${T.card};border:1px solid ${T.brd};border-radius:14px;padding:14px 16px;margin-bottom:10px;box-shadow:${T.shadow}}
.sl{font-size:10px;font-weight:600;letter-spacing:.12em;color:${T.txm};text-transform:uppercase;margin:18px 0 8px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px}
.chip{padding:6px 13px;border-radius:20px;border:1px solid ${T.brd};font-size:13px;color:${T.txs};background:transparent;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
.chip.on{background:${T.acc}18;border-color:${T.acc};color:${T.acc}}
.chip.coral.on{background:${T.coral}18;border-color:${T.coral};color:${T.coral}}
.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lcard{border:1px solid ${T.brd};border-radius:12px;padding:12px;cursor:pointer;transition:all .15s;background:transparent;text-align:left;font-family:'DM Sans',sans-serif;width:100%}
.lcard.active{border-color:${T.acc};background:${T.acc}0d}
.lcard h4{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:1px;color:${T.tx};margin-bottom:2px}
.lcard p{font-size:11px;color:${T.txs}}
.slider-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.slider-row label{font-size:13px;color:${T.txs};width:50px}
.sv{font-size:13px;font-weight:600;color:${T.tx};min-width:42px;text-align:right}
input[type=range]{flex:1;-webkit-appearance:none;height:3px;border-radius:2px;background:${T.brd};outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${T.acc};cursor:pointer}
.gbtn{width:100%;padding:14px;background:${T.acc};border:none;border-radius:12px;color:${T.bg};font-size:15px;font-weight:700;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px;transition:opacity .15s}
.gbtn:disabled{opacity:.4;cursor:not-allowed}
.aibtn{width:100%;padding:12px;background:transparent;border:2px solid ${T.blue};border-radius:12px;color:${T.blue};font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;transition:all .15s}
.aibtn:disabled{opacity:.4;cursor:not-allowed}
.ai-badge{display:inline-flex;align-items:center;gap:4px;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:500}
.ai-algo{background:${T.txm}33;color:${T.txs};border:1px solid ${T.brd}}
.ai-enhanced{background:${T.blue}18;color:${T.blue};border:1px solid ${T.blue}44}
.phase{border-radius:12px;border:1px solid ${T.brd};margin-bottom:10px;overflow:hidden}
.ph{display:flex;align-items:center;gap:8px;padding:10px 14px;background:${T.surf}}
.badge{font-size:10px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:5px}
.bw{background:${T.teal}22;color:${T.teal}}
.bs{background:${T.blue}22;color:${T.blue}}
.bwod{background:${T.coral}22;color:${T.coral}}
.bc{background:${T.txm}33;color:${T.txs}}
.ph h3{font-size:14px;font-weight:500;color:${T.tx};flex:1}
.ph .dur{font-size:12px;color:${T.txs}}
.pb{padding:6px 14px 12px;background:${T.card}}
.er{display:flex;justify-content:space-between;align-items:baseline;padding:6px 0;border-bottom:1px solid ${T.brd}}
.er:last-child{border-bottom:none}
.en{font-size:13px;color:${T.tx}}
.ed{font-size:12px;color:${T.txs};text-align:right;margin-left:8px;flex-shrink:0}
.wban{border-radius:12px;padding:12px 16px;margin-bottom:10px;border:1px solid ${T.coral}44;background:${T.coral}0d}
.wbt{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:2px;color:${T.coral}}
.wbs{font-size:12px;color:${T.txs};margin-top:2px}
.brow{display:flex;gap:8px;margin-top:12px}
.btn{flex:1;padding:11px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;font-family:'DM Sans',sans-serif;transition:opacity .15s}
.btn:active{opacity:.8}
.btn-o{background:transparent;border:1px solid ${T.brd};color:${T.tx}}
.btn-g{background:${T.teal};border:none;color:#fff;font-weight:700}
.sgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}
.sc{background:${T.surf};border-radius:10px;padding:12px;border:1px solid ${T.brd}}
.sc .lb{font-size:11px;color:${T.txs};margin-bottom:4px}
.sc .nm{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:1px;color:${T.acc}}
.sc .un{font-size:12px;color:${T.txs};margin-left:3px}
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;gap:16px}
.spin{width:32px;height:32px;border:3px solid ${T.brd};border-top-color:${T.acc};border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading p{font-size:14px;color:${T.txs};text-align:center}
.tip{background:${T.card};border:1px solid ${T.acc}33;border-radius:12px;padding:12px 14px;margin-bottom:10px}
.tip-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;color:${T.acc};margin-bottom:5px}
.tip-txt{font-size:13px;color:${T.txs};line-height:1.6}
.score-wrap{background:${T.surf};border:1px solid ${T.acc}33;border-radius:12px;padding:16px;margin-top:12px}
.score-wrap h4{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:1px;color:${T.acc};margin-bottom:10px}
.score-wrap input{width:100%;background:${T.card};border:1px solid ${T.brd};border-radius:8px;padding:10px 12px;font-size:14px;color:${T.tx};outline:none;font-family:'DM Sans',sans-serif}
.score-wrap input:focus{border-color:${T.acc}}
.empty{text-align:center;padding:60px 24px;color:${T.txs}}
.empty p{font-size:14px;margin-top:16px;line-height:1.7}
.hi{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid ${T.brd}}
.hi:last-child{border-bottom:none}
.hdot{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:13px;flex-shrink:0;background:${T.coral}22;color:${T.coral}}
.hinfo{flex:1;min-width:0}
.htitle{font-size:14px;font-weight:500;color:${T.tx}}
.hmeta{font-size:12px;color:${T.txs};margin-top:2px}
.htags{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}
.tag{font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid ${T.brd};color:${T.txs}}
.tag-ai{font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid ${T.blue}44;color:${T.blue}}
.tag-sc{font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid ${T.acc}44;color:${T.acc}}
.rmgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.rmi{background:${T.surf};border-radius:10px;padding:10px 12px;border:1px solid ${T.brd}}
.rmi label{font-size:11px;color:${T.txs};display:block;margin-bottom:5px}
.rmi input{width:100%;background:transparent;border:none;outline:none;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;color:${T.tx}}
.rmi .un{font-size:11px;color:${T.txm}}
.toast{position:absolute;top:70px;left:50%;transform:translateX(-50%);background:${T.teal};color:#fff;font-size:13px;font-weight:600;padding:8px 18px;border-radius:20px;white-space:nowrap;z-index:200;animation:fio 2.5s forwards;pointer-events:none}
@keyframes fio{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}75%{opacity:1}100%{opacity:0}}
.modal-ov{position:absolute;inset:0;background:${T.bg}cc;display:flex;align-items:flex-end;z-index:100}
.modal-sh{background:${T.surf};border-top:1px solid ${T.brd};border-radius:20px 20px 0 0;padding:20px 16px 32px;width:100%;max-height:85dvh;overflow-y:auto}
.mhandle{width:36px;height:4px;background:${T.brd};border-radius:2px;margin:0 auto 16px}
.mtitle{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:${T.tx};margin-bottom:16px}
.tdisplay{font-family:'Bebas Neue',sans-serif;font-size:72px;letter-spacing:4px;color:${T.tx};line-height:1;text-align:center}
.tctrl{display:flex;justify-content:center;gap:12px;margin-top:16px}
.tbtn{width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .15s}
.tbtn svg{width:22px;height:22px;stroke-width:2}
`;

const Ic={
  bolt:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  barbell:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12v6H6z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  history:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3M3 4v4h4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  user:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>,
  timer:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 3h6M12 3v2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  play:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  pause:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>,
  reset:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function App(){
  const [theme,setTheme]=useState(()=>loadS(TK,"dark"));
  const T=THEMES[theme];
  const [tab,setTab]=useState("generate");
  const [level,setLevel]=useState(()=>loadS(PK,{}).level||"rx");
  const [muscles,setMuscles]=useState(()=>loadS(PK,{}).muscles||["Tout le corps"]);
  const [wodType,setWodType]=useState(()=>loadS(PK,{}).wodType||"AMRAP");
  const [forceRatio,setForceRatio]=useState(()=>loadS(PK,{}).force??50);
  const [cardioRatio,setCardioRatio]=useState(()=>loadS(PK,{}).cardio??50);
  const [duration,setDuration]=useState(()=>loadS(PK,{}).duration??60);
  const [oneRMs,setOneRMs]=useState(()=>loadS(RK,{"Back Squat":0,"Deadlift":0,"Clean":0,"Snatch":0,"Press":0,"Bench Press":0,"Front Squat":0,"Push Jerk":0}));
  const [history,setHistory]=useState(()=>loadS(SK,[]));
  const [wod,setWod]=useState(null);
  const [loading,setLoading]=useState(false);
  const [aiLoading,setAiLoading]=useState(false);
  const [showLevel,setShowLevel]=useState(false);
  const [scoreInput,setScoreInput]=useState("");
  const [toast,setToast]=useState(null);
  const [timerSecs,setTimerSecs]=useState(0);
  const [timerRunning,setTimerRunning]=useState(false);
  const [timerRounds,setTimerRounds]=useState(0);
  const timerRef=useRef(null);
  const toastRef=useRef(null);

  useEffect(()=>{saveS(PK,{level,muscles,wodType,force:forceRatio,cardio:cardioRatio,duration});},[level,muscles,wodType,forceRatio,cardioRatio,duration]);
  useEffect(()=>{saveS(RK,oneRMs);},[oneRMs]);
  useEffect(()=>{saveS(SK,history);},[history]);
  useEffect(()=>{saveS(TK,theme);},[theme]);
  useEffect(()=>{
    if(timerRunning){timerRef.current=setInterval(()=>setTimerSecs(s=>s+1),1000);}
    else{clearInterval(timerRef.current);}
    return()=>clearInterval(timerRef.current);
  },[timerRunning]);

  const showToast=msg=>{if(toastRef.current)clearTimeout(toastRef.current);setToast(msg);toastRef.current=setTimeout(()=>setToast(null),2600);};
  const toggleMuscle=m=>setMuscles(p=>p.includes(m)?p.filter(x=>x!==m):[...p,m]);

  const handleGenerate=()=>{
    if(!muscles.length)return;
    setLoading(true);
    setTimeout(()=>{
      const resolvedType=wodType==="random"?WOD_TYPES[Math.floor(Math.random()*WOD_TYPES.length)]:wodType;
      const w=generateAlgo({level,muscles,wodType:resolvedType,forceRatio,cardioRatio,duration,oneRMs});
      w._id=Date.now();w._date=new Date().toISOString();w._level=level;
      w._muscles=muscles;w._force=forceRatio;w._cardio=cardioRatio;w._score="";
      setWod(w);setScoreInput("");setTab("wod");setLoading(false);
    },400);
  };

  const handleEnhanceAI=async()=>{
    if(!wod)return;
    setAiLoading(true);
    try{
      const enhanced=await enhanceWithAI(wod,level,muscles,oneRMs);
      setWod(prev=>({...enhanced,_id:prev._id,_date:prev._date,_level:prev._level,_muscles:prev._muscles,_force:prev._force,_cardio:prev._cardio,_score:prev._score,_generated:"ai"}));
      showToast("✨ WOD amélioré par l'IA !");
    }catch{showToast("Erreur IA — vérifie ta connexion");}
    finally{setAiLoading(false);}
  };

  const saveWOD=()=>{
    if(!wod)return;
    const w={...wod,_score:scoreInput};
    setHistory(h=>[w,...h.filter(x=>x._id!==w._id)]);
    showToast("WOD sauvegardé ✓");
  };

  const TABS=[
    {id:"generate",label:"Générer",icon:Ic.bolt},
    {id:"wod",label:"Mon WOD",icon:Ic.barbell},
    {id:"timer",label:"Timer",icon:Ic.timer},
    {id:"history",label:"Historique",icon:Ic.history},
    {id:"profile",label:"Profil",icon:Ic.user},
  ];

  const GenerateScreen=()=>(
    <div className="screen">
      <p className="sl">Niveau</p>
      <div className="lgrid">
        {Object.entries(LEVELS).map(([k,v])=>(
          <button key={k} className={`lcard ${level===k?"active":""}`} onClick={()=>setLevel(k)}>
            <h4>{v.l}</h4><p>{v.d}</p>
          </button>
        ))}
      </div>
      <p className="sl">Focus musculaire</p>
      <div className="chips">
        {MUSCLES.map(m=><button key={m} className={`chip ${muscles.includes(m)?"on":""}`} onClick={()=>toggleMuscle(m)}>{m}</button>)}
      </div>
      <p className="sl">Type de WOD</p>
      <div className="chips">
        <button className={`chip coral ${wodType==="random"?"on":""}`} onClick={()=>setWodType("random")}>🎲 Aléatoire</button>
        {WOD_TYPES.map(t=><button key={t} className={`chip coral ${wodType===t?"on":""}`} onClick={()=>setWodType(t)}>{t}</button>)}
      </div>
      {wodType==="random" && <div style={{fontSize:11,color:T.txs,marginTop:-2,marginBottom:4}}>Un type sera choisi aléatoirement à la génération</div>}
      <p className="sl">Paramètres</p>
      <div className="card">
        <div className="slider-row"><label>Force</label><input type="range" min={0} max={100} step={10} value={forceRatio} onChange={e=>setForceRatio(+e.target.value)}/><span className="sv">{forceRatio}%</span></div>
        <div className="slider-row"><label>Cardio</label><input type="range" min={0} max={100} step={10} value={cardioRatio} onChange={e=>setCardioRatio(+e.target.value)}/><span className="sv">{cardioRatio}%</span></div>
        <div className="slider-row"><label>Durée</label><input type="range" min={30} max={90} step={15} value={duration} onChange={e=>setDuration(+e.target.value)}/><span className="sv">{duration} min</span></div>
      </div>
      {loading
        ?<div className="loading"><div className="spin"/><p>Génération en cours...</p></div>
        :<button className="gbtn" onClick={handleGenerate} disabled={!muscles.length}>⚡ GÉNÉRER MON WOD</button>
      }
    </div>
  );

  const WODScreen=()=>{
    if(!wod)return(
      <div className="screen">
        <div className="empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.txs} strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round"/></svg>
          <p>Génère ton premier WOD<br/>depuis l'onglet ⚡</p>
        </div>
      </div>
    );
    const w=wod;
    return(
      <div className="screen">
        <div style={{display:"flex",alignItems:"baseline",gap:10,margin:"10px 0 4px"}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:T.tx}}>{w.title}</span>
          <span style={{fontSize:12,color:T.txs}}>{LEVELS[w._level]?.l}</span>
        </div>
        <div style={{fontSize:12,color:T.txs,marginBottom:8}}>{fmtDate(w._date)} · {duration} min · {(w._muscles||[]).join(", ")}</div>
        <div style={{marginBottom:12}}>
          <span className={`ai-badge ${w._generated==="ai"?"ai-enhanced":"ai-algo"}`}>
            {w._generated==="ai"?"✨ Amélioré par l'IA":"⚡ Généré localement"}
          </span>
        </div>
        <div className="sgrid">
          <div className="sc"><div className="lb">Force</div><div><span className="nm">{w._force}</span><span className="un">%</span></div></div>
          <div className="sc"><div className="lb">Cardio</div><div><span className="nm">{w._cardio}</span><span className="un">%</span></div></div>
        </div>
        <div className="phase">
          <div className="ph"><span className="badge bw">WARM-UP</span><h3>Échauffement</h3><span className="dur">{w.warmup?.duration} min</span></div>
          <div className="pb">{w.warmup?.exercises?.map((e,i)=><div key={i} className="er"><span className="en">{e.name}</span><span className="ed">{e.detail}</span></div>)}</div>
        </div>
        <div className="phase">
          <div className="ph"><span className="badge bs">FORCE</span><h3>{w.strength?.focus}</h3><span className="dur">{w.strength?.duration} min</span></div>
          <div className="pb">{w.strength?.exercises?.map((e,i)=><div key={i} className="er"><span className="en">{e.name}</span><span className="ed">{e.sets}×{e.reps} · {e.load}</span></div>)}</div>
        </div>
        <div className="wban">
          <div className="wbt">{w.wod?.format}</div>
          <div className="wbs">RX: {w.wod?.rx_load} · Scaled: {w.wod?.scaled_load}</div>
        </div>
        <div className="phase">
          <div className="ph"><span className="badge bwod">WOD</span><h3>{w.wod?.type}</h3><span className="dur">{w.wod?.duration} min</span></div>
          <div className="pb">{w.wod?.exercises?.map((e,i)=><div key={i} className="er"><span className="en">{e.name}</span><span className="ed">{e.reps}{e.load&&e.load!=="BW"&&e.load!=="bodyweight"?" · "+e.load:""}</span></div>)}</div>
        </div>
        <div className="phase">
          <div className="ph"><span className="badge bc">COOL-DOWN</span><h3>Récupération</h3><span className="dur">{w.cooldown?.duration} min</span></div>
          <div className="pb">{w.cooldown?.exercises?.map((e,i)=><div key={i} className="er"><span className="en">{e.name}</span><span className="ed">{e.detail}</span></div>)}</div>
        </div>
        {w.coaching_tip&&<div className="tip"><div className="tip-lbl">COACH TIP</div><div className="tip-txt">{w.coaching_tip}</div></div>}
        {w._generated!=="ai"&&(
          <button className="aibtn" onClick={handleEnhanceAI} disabled={aiLoading}>
            {aiLoading?<><div className="spin" style={{width:16,height:16,borderWidth:2}}/> Amélioration en cours...</>:<>✨ Améliorer ce WOD avec l'IA</>}
          </button>
        )}
        <div className="score-wrap">
          <h4>Ton score</h4>
          <input placeholder="Ex: 8 rounds + 14 reps / 23:47..." value={scoreInput} onChange={e=>setScoreInput(e.target.value)}/>
        </div>
        <div className="brow">
          <button className="btn btn-o" onClick={()=>setTab("timer")}>⏱ Timer</button>
          <button className="btn btn-o" onClick={()=>setTab("generate")}>🔄 Nouveau</button>
          <button className="btn btn-g" onClick={saveWOD}>💾 Sauver</button>
        </div>
      </div>
    );
  };

  const TimerScreen=()=>{
    const total=(wod?.wod?.duration||20)*60;
    const remaining=Math.max(0,total-timerSecs);
    const pct=Math.min(1,timerSecs/total);
    const r=80,circ=2*Math.PI*r;
    return(
      <div className="screen">
        <p className="sl">Timer — {wod?.wod?.format||"WOD"}</p>
        <div style={{textAlign:"center",padding:"20px 16px 8px"}}>
          <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="196" height="196" style={{position:"absolute",transform:"rotate(-90deg)"}}>
              <circle cx="98" cy="98" r={r} fill="none" stroke={T.brd} strokeWidth="6"/>
              <circle cx="98" cy="98" r={r} fill="none" stroke={T.acc} strokeWidth="6"
                strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
                style={{transition:"stroke-dashoffset .5s"}}/>
            </svg>
            <div style={{width:196,height:196,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div className="tdisplay">{fmtTime(remaining)}</div>
              <div style={{fontSize:13,color:T.txs,marginTop:6}}>{fmtTime(timerSecs)} écoulé</div>
            </div>
          </div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,color:T.txs,margin:"8px 0"}}>
            ROUND <span style={{color:T.acc}}>{timerRounds+1}</span>
          </div>
          <div className="tctrl">
            <button className="tbtn" style={{background:T.card,border:`1px solid ${T.brd}`,color:T.txs}} onClick={()=>{setTimerRunning(false);setTimerSecs(0);setTimerRounds(0);}}>{Ic.reset}</button>
            <button className="tbtn" style={{background:T.acc,color:T.bg}} onClick={()=>setTimerRunning(r=>!r)}>{timerRunning?Ic.pause:Ic.play}</button>
            <button className="tbtn" style={{background:T.coral+"22",border:`1px solid ${T.coral}44`,color:T.coral,fontSize:22,fontWeight:700}} onClick={()=>{setTimerRounds(r=>r+1);showToast(`Round ${timerRounds+1} terminé !`);}}>+1</button>
          </div>
        </div>
        {wod?.wod?.exercises&&<><p className="sl">Exercices du WOD</p><div className="card">{wod.wod.exercises.map((e,i)=><div key={i} className="er"><span className="en">{e.name}</span><span className="ed">{e.reps}{e.load&&e.load!=="BW"?" · "+e.load:""}</span></div>)}</div></>}
      </div>
    );
  };

  const HistoryScreen=()=>(
    <div className="screen">
      {!history.length
        ?<div className="empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.txs} strokeWidth="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 3h6M12 3v2" strokeLinecap="round"/></svg><p>Aucun WOD sauvegardé<br/>pour l'instant</p></div>
        :<div className="card" style={{marginTop:10}}>
          {history.map(w=>(
            <div key={w._id} className="hi">
              <div className="hdot">{(w.wod?.type||"WD").slice(0,2)}</div>
              <div className="hinfo" style={{cursor:"pointer"}} onClick={()=>{setWod({...w,_id:Date.now(),_date:new Date().toISOString(),_score:""});setScoreInput("");setTab("wod");}}>
                <div className="htitle">{w.title} · {w.wod?.type}</div>
                <div className="hmeta">{fmtDate(w._date)} · {LEVELS[w._level]?.l}</div>
                <div className="htags">
                  {(w._muscles||[]).slice(0,2).map(m=><span key={m} className="tag">{m}</span>)}
                  {w._generated==="ai"&&<span className="tag-ai">✨ IA</span>}
                  {w._score&&<span className="tag-sc">{w._score}</span>}
                </div>
              </div>
              <button style={{background:"transparent",border:"none",color:T.txm,cursor:"pointer",padding:4,fontSize:16}} onClick={()=>setHistory(h=>h.filter(x=>x._id!==w._id))}>✕</button>
            </div>
          ))}
        </div>
      }
    </div>
  );

  const ProfileScreen=()=>{
    const typed={};
    history.forEach(w=>{const t=w.wod?.type;if(t)typed[t]=(typed[t]||0)+1;});
    const fav=Object.entries(typed).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
    return(
      <div className="screen">
        <p className="sl">Mes 1RM (kg)</p>
        <div className="rmgrid">
          {Object.entries(oneRMs).map(([k,v])=>(
            <div key={k} className="rmi">
              <label>{k}</label>
              <input type="number" value={v||""} placeholder="0" onChange={e=>setOneRMs(r=>({...r,[k]:+e.target.value}))}/>
              <span className="un">kg</span>
            </div>
          ))}
        </div>
        <button className="btn btn-o" style={{width:"100%",marginTop:8}} onClick={()=>{saveS(RK,oneRMs);showToast("1RM sauvegardés ✓");}}>💾 Sauvegarder les 1RM</button>
        <p className="sl" style={{marginTop:24}}>Niveau par défaut</p>
        <div className="lgrid">
          {Object.entries(LEVELS).map(([k,v])=>(
            <button key={k} className={`lcard ${level===k?"active":""}`} onClick={()=>setLevel(k)}>
              <h4>{v.l}</h4><p>{v.d}</p>
            </button>
          ))}
        </div>
        <p className="sl" style={{marginTop:24}}>Statistiques</p>
        <div className="sgrid">
          <div className="sc"><div className="lb">WODs réalisés</div><div><span className="nm">{history.length}</span></div></div>
          <div className="sc"><div className="lb">WOD favori</div><div style={{fontSize:15,fontWeight:500,color:T.teal,marginTop:4}}>{fav}</div></div>
        </div>
      </div>
    );
  };

  return(
    <>
      <style>{makeCSS(T)}</style>
      <div className="app">
        {toast&&<div className="toast">{toast}</div>}
        <div className="topbar">
          <div className="logo">WOD<span>GEN</span></div>
          <div className="topbar-right">
            <button className="theme-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} title="Changer de thème">
              {theme==="dark"?"☀️":"🌙"}
            </button>
            <button className="level-pill" onClick={()=>setShowLevel(true)}>⚡ {LEVELS[level]?.l}</button>
          </div>
        </div>
        {tab==="generate"&&<GenerateScreen/>}
        {tab==="wod"&&<WODScreen/>}
        {tab==="timer"&&<TimerScreen/>}
        {tab==="history"&&<HistoryScreen/>}
        {tab==="profile"&&<ProfileScreen/>}
        <nav className="nav">
          {TABS.map(t=>(
            <button key={t.id} className={`nb ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </nav>
        {showLevel&&(
          <div className="modal-ov" onClick={()=>setShowLevel(false)}>
            <div className="modal-sh" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div className="mtitle">CHOISIR SON NIVEAU</div>
              <div className="lgrid">
                {Object.entries(LEVELS).map(([k,v])=>(
                  <button key={k} className={`lcard ${level===k?"active":""}`} onClick={()=>{setLevel(k);setShowLevel(false);}}>
                    <h4>{v.l}</h4><p>{v.d}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
