import {CFG} from "./config.js";
export class VoxelMap{
 constructor(){this.cells=new Map();this.dirty=[];this.dirtySet=new Set()}
 clear(){this.cells.clear();this.dirty.length=0;this.dirtySet.clear()}
 key(x,y,z){return`${Math.round(x/CFG.CELL)},${Math.round(y/CFG.CELL)},${Math.round(z/CFG.CELL)}`}
 mark(c){if(c&&!this.dirtySet.has(c.key)){this.dirtySet.add(c.key);this.dirty.push(c.key)}}
 nearest(x,y,z){
  const ix=Math.round(x/CFG.CELL),iy=Math.round(y/CFG.CELL),iz=Math.round(z/CFG.CELL);let best=null,bd=CFG.MERGE;
  for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){
   const c=this.cells.get(`${ix+dx},${iy+dy},${iz+dz}`);if(!c)continue;
   const d=Math.hypot(c.x-x,c.y-y,c.z-z);if(d<bd){bd=d;best=c}
  }return best;
 }
 add(x,y,z,t,cameraY,showFloor){
  if(!showFloor&&y<cameraY-1.35)return;
  let c=this.nearest(x,y,z);
  if(c){const w=Math.min(c.hits,18);c.x=(c.x*w+x)/(w+1);c.y=(c.y*w+y)/(w+1);c.z=(c.z*w+z)/(w+1);c.hits=Math.min(255,c.hits+1);c.last=t;this.mark(c);return}
  const key=this.key(x,y,z);if(this.cells.has(key))return;
  const [ix,iy,iz]=key.split(",").map(Number);
  c={key,ix,iy,iz,x,y,z,hits:1,last:t,type:3,score:[0,0,0,1]};this.cells.set(key,c);this.mark(c)
 }
 confirmed(){return[...this.cells.values()].filter(c=>c.hits>=CFG.MIN_HITS)}
 prune(t){for(const[k,c]of this.cells)if(t-c.last>18000&&c.hits<CFG.MIN_HITS)this.cells.delete(k)}
 localNeighbors(c,r=4,maxDistance=.38){
  const out=[];
  for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)for(let dz=-r;dz<=r;dz++){
   if(!dx&&!dy&&!dz)continue;const n=this.cells.get(`${c.ix+dx},${c.iy+dy},${c.iz+dz}`);
   if(n&&n.hits>=CFG.MIN_HITS&&Math.hypot(n.x-c.x,n.y-c.y,n.z-c.z)<=maxDistance)out.push(n)
  }return out;
 }
 classify(c){
  const n=this.localNeighbors(c);if(n.length<6)return 3;
  let mx=0,my=0,mz=0;for(const q of n){mx+=q.x;my+=q.y;mz+=q.z}mx/=n.length;my/=n.length;mz/=n.length;
  let vx=0,vy=0,vz=0;for(const q of n){vx+=(q.x-mx)**2;vy+=(q.y-my)**2;vz+=(q.z-mz)**2}vx/=n.length;vy/=n.length;vz/=n.length;
  const hs=vx+vz,hmin=Math.min(vx,vz),hmax=Math.max(vx,vz);
  if(vy<.0035&&hs>.0055)return 0;
  if(vy>.006&&hmax>.0045&&hmin<.0045)return 1;
  if(vy>.010&&vy>hs*.35)return 1;
  if(vy>.0025&&hs>.005)return 2;return 3;
 }
 processDirty(limit=160){
  let count=0;while(this.dirty.length&&count<limit){const k=this.dirty.shift();this.dirtySet.delete(k);const c=this.cells.get(k);if(!c||c.hits<CFG.MIN_HITS)continue;
   const type=this.classify(c);for(let i=0;i<4;i++)c.score[i]*=.72;c.score[type]+=1;c.type=c.score.indexOf(Math.max(...c.score));count++}return count
 }
}
