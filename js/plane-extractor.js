import {CFG} from "./config.js";
export function extractPlanes(cells){
 const confirmed=cells.filter(c=>c.hits>=CFG.MIN_HITS),visited=new Set(),planes=[];
 const byKey=new Map(confirmed.map(c=>[c.key,c]));
 const neighbors=(c)=>{
  const out=[];for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){
   if(!dx&&!dy&&!dz)continue;const n=byKey.get(`${c.ix+dx},${c.iy+dy},${c.iz+dz}`);
   if(n&&n.type===c.type)out.push(n)
  }return out;
 };
 for(const seed of confirmed){
  if(visited.has(seed.key)||seed.type===3)continue;
  const queue=[seed],cluster=[];visited.add(seed.key);
  while(queue.length&&cluster.length<2200){const c=queue.pop();cluster.push(c);for(const n of neighbors(c))if(!visited.has(n.key)){visited.add(n.key);queue.push(n)}}
  if(cluster.length<CFG.MIN_CLUSTER)continue;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity,sx=0,sy=0,sz=0,hits=0;
  for(const c of cluster){minX=Math.min(minX,c.x);maxX=Math.max(maxX,c.x);minY=Math.min(minY,c.y);maxY=Math.max(maxY,c.y);minZ=Math.min(minZ,c.z);maxZ=Math.max(maxZ,c.z);sx+=c.x;sy+=c.y;sz+=c.z;hits+=c.hits}
  const spanX=maxX-minX,spanY=maxY-minY,spanZ=maxZ-minZ;
  const type=seed.type,confidence=Math.min(.99,.45+cluster.length/140);
  let label=type===0?(spanX>1||spanZ>1?"FLOOR":"HORIZONTAL SURFACE"):type===1?"WALL":"INCLINED SURFACE";
  planes.push({type,label,count:cluster.length,confidence,cx:sx/cluster.length,cy:sy/cluster.length,cz:sz/cluster.length,minX,maxX,minY,maxY,minZ,maxZ,spanX,spanY,spanZ,hits})
 }
 planes.sort((a,b)=>b.count-a.count);return planes.slice(0,CFG.MAX_PLANES);
}
export function planeLineVertices(planes){
 const v=[],c=[];
 const color=t=>t===0?[.35,1,.5]:t===1?[.25,.9,1]:[1,.7,.25];
 const line=(a,b,co)=>{v.push(...a,...b);c.push(...co,...co)};
 for(const p of planes){
  const co=color(p.type);
  if(p.type===0){
   const y=p.cy;const a=[p.minX,y,p.minZ],b=[p.maxX,y,p.minZ],d=[p.minX,y,p.maxZ],e=[p.maxX,y,p.maxZ];
   line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co);
  }else if(p.type===1){
   if(p.spanX>=p.spanZ){const z=p.cz,a=[p.minX,p.minY,z],b=[p.maxX,p.minY,z],d=[p.minX,p.maxY,z],e=[p.maxX,p.maxY,z];line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co)}
   else{const x=p.cx,a=[x,p.minY,p.minZ],b=[x,p.minY,p.maxZ],d=[x,p.maxY,p.minZ],e=[x,p.maxY,p.maxZ];line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co)}
  }else{
   const y=p.cy,a=[p.minX,y,p.minZ],b=[p.maxX,y,p.minZ],d=[p.minX,y,p.maxZ],e=[p.maxX,y,p.maxZ];line(a,b,co);line(b,e,co);line(e,d,co);line(d,a,co)
  }
 }return{positions:new Float32Array(v),colors:new Float32Array(c)}
}
