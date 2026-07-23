export class NavigationMap{
 constructor(canvas){this.canvas=canvas;this.range=12;this.origin=null;this.path=[];this.last=null;this.distance=0}
 reset(x,z){this.origin={x,z};this.path=[{x,z}];this.last={x,z};this.distance=0}
 update(x,z){if(!this.origin)this.reset(x,z);const d=Math.hypot(x-this.last.x,z-this.last.z);if(d>.06){if(d<1)this.distance+=d;this.last={x,z};this.path.push({x,z});if(this.path.length>800)this.path.shift()}}
 draw(cells,planes,x,z,yaw){
  const cv=this.canvas,ctx=cv.getContext("2d"),w=cv.width,h=cv.height,rx=this.range,rz=rx*h/w,sx=w/rx,sz=h/rz;
  ctx.fillStyle="#02090e";ctx.fillRect(0,0,w,h);ctx.strokeStyle="#11313a";
  for(let m=-Math.ceil(rx/2);m<=Math.ceil(rx/2);m++){ctx.beginPath();ctx.moveTo(w/2+m*sx,0);ctx.lineTo(w/2+m*sx,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,h/2-m*sz);ctx.lineTo(w,h/2-m*sz);ctx.stroke()}
  const pr=(wx,wz)=>[w/2-(wx-this.origin.x)*sx,h/2-(wz-this.origin.z)*sz];
  ctx.strokeStyle="white";ctx.lineWidth=2;ctx.beginPath();this.path.forEach((p,i)=>{const q=pr(p.x,p.z);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.stroke();
  for(const c of cells){if(c.hits<4)continue;const q=pr(c.x,c.z);if(q[0]<0||q[0]>w||q[1]<0||q[1]>h)continue;ctx.fillStyle=c.type===0?"#55ff78":c.type===1?"#34e5ff":c.type===2?"#ffad42":"#a876ff";ctx.fillRect(q[0]-1.5,q[1]-1.5,3,3)}
  ctx.lineWidth=3;for(const p of planes){ctx.strokeStyle=p.type===0?"#55ff78":p.type===1?"#34e5ff":"#ffad42";const a=pr(p.minX,p.minZ),b=pr(p.maxX,p.maxZ);ctx.strokeRect(Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.abs(b[0]-a[0])||4,Math.abs(b[1]-a[1])||4)}
  const phone=pr(x,z);ctx.save();ctx.translate(...phone);ctx.rotate(yaw);ctx.fillStyle="#fff";ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(8,10);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();ctx.restore();
 }
}
