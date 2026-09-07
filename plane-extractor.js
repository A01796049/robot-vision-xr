import {CFG} from "./config.js";

function bounds(cluster){
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity,sx=0,sy=0,sz=0,hits=0;
 for(const c of cluster){
  minX=Math.min(minX,c.x);maxX=Math.max(maxX,c.x);
  minY=Math.min(minY,c.y);maxY=Math.max(maxY,c.y);
  minZ=Math.min(minZ,c.z);maxZ=Math.max(maxZ,c.z);
  sx+=c.x;sy+=c.y;sz+=c.z;hits+=c.hits;
 }
 const n=cluster.length;
 return {minX,maxX,minY,maxY,minZ,maxZ,cx:sx/n,cy:sy/n,cz:sz/n,
  spanX:maxX-minX,spanY:maxY-minY,spanZ:maxZ-minZ,hits};
}

function confidence(count, compactness=1){
 return Math.min(.99,.42+count/130+Math.min(.18,compactness*.08));
}

function segmentHorizontal(cells){
 // Group by quantized height first so consecutive stair treads are not merged.
 const bands=new Map();
 for(const c of cells){
  const band=Math.round(c.y/CFG.HORIZONTAL_Y_TOL);
  if(!bands.has(band))bands.set(band,[]);
  bands.get(band).push(c);
 }
 const planes=[];
 for(const bandCells of bands.values()){
  const byKey=new Map(bandCells.map(c=>[c.key,c])),visited=new Set();
  for(const seed of bandCells){
   if(visited.has(seed.key))continue;
   const queue=[seed],cluster=[];visited.add(seed.key);
   while(queue.length&&cluster.length<1800){
    const c=queue.pop();cluster.push(c);
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
     if(!dx&&!dz)continue;
     // Search within the same height band, tolerating only a small Y offset.
     for(let dy=-1;dy<=1;dy++){
      const n=byKey.get(`${c.ix+dx},${c.iy+dy},${c.iz+dz}`);
      if(n&&!visited.has(n.key)&&Math.abs(n.y-seed.y)<=CFG.STEP_MAX_HEIGHT_SPREAD){
       visited.add(n.key);queue.push(n);
      }
     }
    }
   }
   if(cluster.length<CFG.MIN_CLUSTER)continue;
   const b=bounds(cluster);
   const width=Math.max(b.spanX,b.spanZ),depth=Math.min(b.spanX,b.spanZ);
   let label="HORIZONTAL SURFACE";
   if(width>1.15&&depth>.65)label="FLOOR";
   else if(width>.65&&depth>.45)label="LANDING";
   planes.push({type:0,label,count:cluster.length,confidence:confidence(cluster.length,width+depth),...b});
  }
 }
 return planes;
}

function segmentVertical(cells){
 const byKey=new Map(cells.map(c=>[c.key,c])),visited=new Set(),planes=[];
 for(const seed of cells){
  if(visited.has(seed.key))continue;
  const queue=[seed],cluster=[];visited.add(seed.key);
  while(queue.length&&cluster.length<2400){
   const c=queue.pop();cluster.push(c);
   for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){
    if(!dx&&!dy&&!dz)continue;
    const n=byKey.get(`${c.ix+dx},${c.iy+dy},${c.iz+dz}`);
    if(n&&!visited.has(n.key)){visited.add(n.key);queue.push(n)}
   }
  }
  if(cluster.length<CFG.MIN_CLUSTER)continue;
  const b=bounds(cluster);
  const horizontalLength=Math.max(b.spanX,b.spanZ);
  if(b.spanY<.25||horizontalLength<.25)continue;
  planes.push({type:1,label:"WALL",count:cluster.length,confidence:confidence(cluster.length,horizontalLength),...b});
 }
 return planes;
}

function segmentInclined(cells){
 const byKey=new Map(cells.map(c=>[c.key,c])),visited=new Set(),planes=[];
 for(const seed of cells){
  if(visited.has(seed.key))continue;
  const queue=[seed],cluster=[];visited.add(seed.key);
  while(queue.length&&cluster.length<1800){
   const c=queue.pop();cluster.push(c);
   for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){
    if(!dx&&!dy&&!dz)continue;
    const n=byKey.get(`${c.ix+dx},${c.iy+dy},${c.iz+dz}`);
    if(n&&!visited.has(n.key)){visited.add(n.key);queue.push(n)}
   }
  }
  if(cluster.length<CFG.MIN_CLUSTER)continue;
  const b=bounds(cluster);
  planes.push({type:2,label:"INCLINED SURFACE",count:cluster.length,confidence:confidence(cluster.length),...b});
 }
 return planes;
}

export function extractPlanes(cells){
 const confirmed=cells.filter(c=>c.hits>=CFG.MIN_HITS);
 const horizontal=segmentHorizontal(confirmed.filter(c=>c.type===0));
 const vertical=segmentVertical(confirmed.filter(c=>c.type===1));
 const inclined=segmentInclined(confirmed.filter(c=>c.type===2));
 return [...horizontal,...vertical,...inclined]
  .sort((a,b)=>b.count-a.count)
  .slice(0,CFG.MAX_PLANES)
  .map((p,i)=>({...p,id:`P${String(i+1).padStart(2,"0")}`}));
}

function overlap1D(a0,a1,b0,b1){
 return Math.max(0,Math.min(a1,b1)-Math.max(a0,b0));
}

function dominantAxis(planes){
 if(planes.length<2)return "z";
 let spreadX=0,spreadZ=0;
 const mx=planes.reduce((s,p)=>s+p.cx,0)/planes.length;
 const mz=planes.reduce((s,p)=>s+p.cz,0)/planes.length;
 for(const p of planes){spreadX+=(p.cx-mx)**2;spreadZ+=(p.cz-mz)**2}
 return spreadX>spreadZ?"x":"z";
}

export function buildSceneGraph(planes){
 const entities=planes.map(p=>({...p,entityType:p.label}));
 const horizontal=planes.filter(p=>p.type===0 && Math.max(p.spanX,p.spanZ)>=CFG.STEP_MIN_WIDTH);
 const axis=dominantAxis(horizontal);
 const sorted=[...horizontal].sort((a,b)=>a.cy-b.cy);
 const candidates=[];

 for(let i=0;i<sorted.length;i++){
  let sequence=[sorted[i]];
  for(let j=i+1;j<sorted.length;j++){
   const prev=sequence[sequence.length-1],cur=sorted[j];
   const rise=cur.cy-prev.cy;
   if(rise<CFG.STEP_MIN_RISE)continue;
   if(rise>CFG.STEP_MAX_RISE)break;

   const run=axis==="x"?Math.abs(cur.cx-prev.cx):Math.abs(cur.cz-prev.cz);
   const lateral=axis==="x"
    ? overlap1D(prev.minZ,prev.maxZ,cur.minZ,cur.maxZ)
    : overlap1D(prev.minX,prev.maxX,cur.minX,cur.maxX);
   const minWidth=Math.min(axis==="x"?prev.spanZ:prev.spanX,axis==="x"?cur.spanZ:cur.spanX);

   if(run>=CFG.STEP_MIN_RUN&&run<=CFG.STEP_MAX_RUN&&lateral>=Math.max(.18,minWidth*.35)){
    sequence.push(cur);
   }
  }
  if(sequence.length>=CFG.STAIR_MIN_STEPS)candidates.push(sequence);
 }

 let stairs=null;
 if(candidates.length){
  candidates.sort((a,b)=>b.length-a.length);
  const seq=candidates[0];
  const rises=[],runs=[];
  for(let i=1;i<seq.length;i++){
   rises.push(seq[i].cy-seq[i-1].cy);
   runs.push(axis==="x"?Math.abs(seq[i].cx-seq[i-1].cx):Math.abs(seq[i].cz-seq[i-1].cz));
  }
  const avg=a=>a.reduce((s,v)=>s+v,0)/Math.max(1,a.length);
  const meanRise=avg(rises),meanRun=avg(runs);
  const variation=a=>Math.sqrt(avg(a.map(v=>(v-avg(a))**2)));
  const regularity=Math.max(0,1-(variation(rises)/.08+variation(runs)/.18)/2);
  const conf=Math.min(.98,.50+seq.length*.09+regularity*.20);
  const allBounds=bounds(seq.flatMap(p=>[
   {x:p.minX,y:p.minY,z:p.minZ,hits:1},{x:p.maxX,y:p.maxY,z:p.maxZ,hits:1}
  ]));
  stairs={id:"STAIRS_01",entityType:"STAIRS",label:"STAIRS",steps:seq.length,
   confidence:conf,avgRise:meanRise,avgRun:meanRun,axis,planes:seq.map(p=>p.id),...allBounds};
  for(const p of seq){
   const e=entities.find(x=>x.id===p.id);
   if(e){e.entityType="STEP";e.label="STEP";e.parent=stairs.id}
  }
  entities.unshift(stairs);
 }

 // Mark the largest remaining horizontal plane as floor or landing.
 const remaining=entities.filter(e=>e.type===0&&e.entityType!=="STEP")
  .sort((a,b)=>(b.spanX*b.spanZ)-(a.spanX*a.spanZ));
 if(remaining[0])remaining[0].entityType=remaining[0].label=remaining[0].cy<0.35?"FLOOR":remaining[0].label;

 return {entities,stairs};
}

export function planeLineVertices(planes,scene){
 const v=[],c=[];
 const color=p=>{
  if(p.label==="STEP")return[1,.62,.18];
  if(p.type===0)return[.35,1,.5];
  if(p.type===1)return[.25,.9,1];
  return[1,.7,.25];
 };
 const line=(a,b,co)=>{v.push(...a,...b);c.push(...co,...co)};
 const labels=new Map((scene?.entities||[]).map(e=>[e.id,e.entityType]));
 for(const p of planes){
  p.label=labels.get(p.id)||p.label;
  const co=color(p);
  if(p.type===0){
   const y=p.cy,a=[p.minX,y,p.minZ],b=[p.maxX,y,p.minZ],d=[p.minX,y,p.maxZ],e=[p.maxX,y,p.maxZ];
   line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co);
  }else if(p.type===1){
   if(p.spanX>=p.spanZ){
    const z=p.cz,a=[p.minX,p.minY,z],b=[p.maxX,p.minY,z],d=[p.minX,p.maxY,z],e=[p.maxX,p.maxY,z];
    line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co)
   }else{
    const x=p.cx,a=[x,p.minY,p.minZ],b=[x,p.minY,p.maxZ],d=[x,p.maxY,p.minZ],e=[x,p.maxY,p.maxZ];
    line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co)
   }
  }else{
   const y=p.cy,a=[p.minX,y,p.minZ],b=[p.maxX,y,p.minZ],d=[p.minX,y,p.maxZ],e=[p.maxX,y,p.maxZ];
   line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co)
  }
 }
 return{positions:new Float32Array(v),colors:new Float32Array(c)};
}
