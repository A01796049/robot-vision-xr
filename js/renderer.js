import {CFG,COLORS} from "./config.js";
function shader(gl,t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(x));return x}
export class Renderer{
 constructor(gl){
  this.gl=gl;this.mode="BOTH";this.pointCount=0;this.lineCount=0;
  const vs=`attribute vec3 p;attribute vec3 c;uniform mat4 P;uniform mat4 V;uniform float size;varying vec3 C;void main(){gl_Position=P*V*vec4(p,1.);gl_PointSize=size;C=c;}`;
  const fs=`precision mediump float;varying vec3 C;uniform float alpha;uniform bool roundPoint;void main(){if(roundPoint){vec2 q=gl_PointCoord-.5;if(dot(q,q)>.25)discard;}gl_FragColor=vec4(C,alpha);}`;
  this.program=gl.createProgram();gl.attachShader(this.program,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(this.program,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(this.program);
  this.pb=gl.createBuffer();this.cb=gl.createBuffer();this.lb=gl.createBuffer();this.lcb=gl.createBuffer();
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
 }
 setMode(m){this.mode=m}
 uploadPoints(cells){
  const p=[],c=[];let n=0;
  for(const q of cells){if(q.hits<CFG.MIN_HITS||n>=CFG.MAX_RENDER)continue;const co=q.type===0?COLORS.horizontal:q.type===1?COLORS.vertical:q.type===2?COLORS.inclined:COLORS.unknown;p.push(q.x,q.y,q.z);c.push(...co);n++}
  const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(p),gl.DYNAMIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,this.cb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(c),gl.DYNAMIC_DRAW);this.pointCount=n
 }
 uploadPlanes(data){const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.lb);gl.bufferData(gl.ARRAY_BUFFER,data.positions,gl.DYNAMIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,this.lcb);gl.bufferData(gl.ARRAY_BUFFER,data.colors,gl.DYNAMIC_DRAW);this.lineCount=data.positions.length/3}
 drawBuffers(view,posBuffer,colorBuffer,count,primitive,size,alpha,round){
  if(!count)return;const gl=this.gl,p=this.program;gl.useProgram(p);gl.uniformMatrix4fv(gl.getUniformLocation(p,"P"),false,view.projectionMatrix);gl.uniformMatrix4fv(gl.getUniformLocation(p,"V"),false,view.transform.inverse.matrix);gl.uniform1f(gl.getUniformLocation(p,"size"),size);gl.uniform1f(gl.getUniformLocation(p,"alpha"),alpha);gl.uniform1i(gl.getUniformLocation(p,"roundPoint"),round?1:0);
  gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);const ap=gl.getAttribLocation(p,"p");gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);const ac=gl.getAttribLocation(p,"c");gl.enableVertexAttribArray(ac);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,0,0);gl.drawArrays(primitive,0,count)
 }
 draw(view){
  if(this.mode==="POINTS"||this.mode==="BOTH")this.drawBuffers(view,this.pb,this.cb,this.pointCount,this.gl.POINTS,3,.62,true);
  if(this.mode==="PLANES"||this.mode==="BOTH"){this.gl.lineWidth(3);this.drawBuffers(view,this.lb,this.lcb,this.lineCount,this.gl.LINES,1,1,false)}
 }
}
