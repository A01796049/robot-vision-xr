import {CFG} from "./config.js";
import {invert4,mulPoint} from "./math.js";
import {VoxelMap} from "./voxel-map.js";
import {extractPlanes,planeLineVertices} from "./plane-extractor.js";
import {Renderer} from "./renderer.js";
import {NavigationMap} from "./navigation-map.js";

const $=id=>document.getElementById(id);
const voxels=new VoxelMap();const nav=new NavigationMap($("mapCanvas"));
let gl,session,space,renderer,planes=[],paused=false,showFloor=false,showMap=true;
let lastCapture=0,lastPointUpload=0,lastPlaneExtract=0,lastMap=0,lastFps=0,frames=0;
let cx=0,cy=0,cz=0,yaw=0;const modes=["BOTH","PLANES","POINTS"];let modeIndex=0;

function capture(view,depth,t){
 const inv=invert4(view.projectionMatrix);if(!inv)return;const world=view.transform.matrix;
 for(let j=0;j<CFG.SAMPLE_Y;j++)for(let i=0;i<CFG.SAMPLE_X;i++){
  const u=(i+.5)/CFG.SAMPLE_X,v=(j+.5)/CFG.SAMPLE_Y;let d;
  try{d=depth.getDepthInMeters(u,v)}catch{continue}
  if(!Number.isFinite(d)||d<CFG.MIN_D||d>CFG.MAX_D)continue;
  const q=mulPoint(inv,u*2-1,1-v*2,-1,1);if(Math.abs(q[3])<1e-6)continue;
  let x=q[0]/q[3],y=q[1]/q[3],z=q[2]/q[3],L=Math.hypot(x,y,z);if(L<1e-6)continue;
  x=x/L*d;y=y/L*d;z=z/L*d;const p=mulPoint(world,x,y,z,1);voxels.add(p[0],p[1],p[2],t,cy,showFloor)
 }
 $("depth").textContent=`${depth.width}×${depth.height}`;
}
function updatePlaneUI(){
 const counts=[0,0,0];planes.forEach(p=>counts[p.type]++);
 $("planes").textContent=planes.length;$("walls").textContent=counts[1];$("floors").textContent=counts[0];$("slopes").textContent=counts[2];
 const top=planes.slice(0,5);$("planeItems").innerHTML=top.length?top.map((p,i)=>`<div class="planeItem">${i+1}. ${p.label} · <span>${Math.round(p.confidence*100)}%</span> · ${p.count} vox</div>`).join(""):"Esperando geometría…";
 $("analysis").textContent=`${planes.length} planos / ${renderer.pointCount} puntos`;
}
async function startXR(){
 gl=$("xrCanvas").getContext("webgl",{xrCompatible:true,alpha:true,antialias:false});await gl.makeXRCompatible();renderer=new Renderer(gl);
 session=await navigator.xr.requestSession("immersive-ar",{requiredFeatures:["local","depth-sensing","dom-overlay"],depthSensing:{usagePreference:["cpu-optimized"],dataFormatPreference:["luminance-alpha","float32"]},domOverlay:{root:document.body}});
 session.updateRenderState({baseLayer:new XRWebGLLayer(session,gl)});space=await session.requestReferenceSpace("local");
 $("home").style.display="none";$("xrCanvas").style.display="block";$("hud").style.display="flex";$("legend").style.display="block";$("mapBox").style.display="block";$("planeList").style.display="block";$("controls").style.display="flex";
 session.addEventListener("end",endXR);session.requestAnimationFrame(frame)
}
function frame(t,f){
 session.requestAnimationFrame(frame);const pose=f.getViewerPose(space);if(!pose)return;$("tracking").textContent="activo";
 const v0=pose.views[0],m=v0.transform.matrix;cx=m[12];cy=m[13];cz=m[14];yaw=Math.atan2(-m[8],-m[10]);nav.update(cx,cz);
 const layer=session.renderState.baseLayer;gl.bindFramebuffer(gl.FRAMEBUFFER,layer.framebuffer);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 for(const view of pose.views){
  const vp=layer.getViewport(view);gl.viewport(vp.x,vp.y,vp.width,vp.height);
  if(!paused&&t-lastCapture>180){try{const d=f.getDepthInformation(view);if(d)capture(view,d,t)}catch{}}
  renderer.draw(view)
 }
 if(!paused&&t-lastCapture>180)lastCapture=t;
 voxels.processDirty(45);voxels.prune(t);
 if(t-lastPointUpload>850){renderer.uploadPoints(voxels.cells.values());$("voxels").textContent=renderer.pointCount;lastPointUpload=t}
 if(t-lastPlaneExtract>CFG.PLANE_INTERVAL){
  planes=extractPlanes(voxels.confirmed());renderer.uploadPlanes(planeLineVertices(planes));updatePlaneUI();lastPlaneExtract=t
 }
 if(showMap&&t-lastMap>300){nav.draw(voxels.cells.values(),planes,cx,cz,yaw);$("mapScale").textContent=`${nav.range} × ${(nav.range*480/680).toFixed(1)} m`;lastMap=t}
 frames++;if(t-lastFps>1000){$("fps").textContent=frames;frames=0;lastFps=t}
}
function reset(){voxels.clear();planes=[];nav.reset(cx,cz);renderer.uploadPoints([]);renderer.uploadPlanes({positions:new Float32Array(),colors:new Float32Array()});updatePlaneUI()}
function endXR(){$("home").style.display="block";["xrCanvas","hud","legend","mapBox","planeList","controls"].forEach(id=>$(id).style.display="none")}
$("startBtn").onclick=startXR;$("liveBtn").onclick=()=>{paused=!paused;$("liveBtn").classList.toggle("on",!paused);$("liveBtn").textContent=paused?"PAUSA":"LIVE"};
$("modeBtn").onclick=()=>{modeIndex=(modeIndex+1)%modes.length;renderer.setMode(modes[modeIndex]);$("modeBtn").textContent=modes[modeIndex];$("modeValue").textContent=modes[modeIndex]};
$("floorBtn").onclick=()=>{showFloor=!showFloor;$("floorBtn").classList.toggle("on",showFloor);$("floorBtn").textContent=showFloor?"SUELO ON":"SUELO OFF"};
$("mapBtn").onclick=()=>{showMap=!showMap;$("mapBox").style.display=showMap?"block":"none";$("mapBtn").classList.toggle("on",showMap)};
$("scaleBtn").onclick=()=>{nav.range=nav.range===8?12:nav.range===12?20:8;$("scaleBtn").textContent=nav.range+" M"};
$("resetBtn").onclick=reset;$("exitBtn").onclick=()=>session?.end();
(async()=>{$("httpsStatus").textContent=window.isSecureContext?"OK":"NO";if(navigator.xr){const ok=await navigator.xr.isSessionSupported("immersive-ar");$("xrStatus").textContent=ok?"compatible":"no compatible";$("startBtn").disabled=!ok}else $("xrStatus").textContent="no disponible"})();
