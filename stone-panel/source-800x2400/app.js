import * as THREE from '../backpanel-interactive/vendor/package/build/three.module.js';
import { OrbitControls } from '../backpanel-interactive/vendor/package/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../backpanel-interactive/vendor/package/examples/jsm/loaders/GLTFLoader.js';
const $=s=>document.querySelector(s), A=window.PANEL_ASSETS;
const state={variant:2,on:false,exploded:false,detail:null,ready:false,view:'front',module:1,installStep:0};
const cards=[
 {name:'全明框',sub:'四边明框',off:[[94,1036],[579,1028],[573,372],[90,374]],on:[[284,991],[713,969],[659,354],[203,383]],show:['左','右','上','下']},
 {name:'半隐框',sub:'上下明框 · 左右隐框',off:[[726,1020],[1203,1017],[1204,382],[725,379]],on:[[776,970],[1214,945],[1213,320],[723,347]],show:['上','下']},
 {name:'全隐框',sub:'正面无外露框',off:[[1325,1045],[1798,1049],[1798,395],[1327,388]],on:[[1290,949],[1750,923],[1791,287],[1299,311]],show:[]}
];
const details={
 stone:{title:'天然石材与复合面层',body:'800 × 2400 mm 整板。天然石材、胶片、磨砂玻璃与导光层依次复合。5 / 1.52 / 4 / 8 mm 为典型样品层厚，整板配置以项目深化为准。',view:'front'},
 cap:{title:'顶部连续封装',body:'顶部采用与侧边一致的封装材质，衔接两侧；封装位于正面之后，保留石材正面表现。',view:'top'},
 rail:{title:'产品铝挂件',body:'板背与墙侧各布置上下两道横向铝条，C 形扣口正反相对。先抬高、靠墙对位，再向下落位；拆卸时先上移脱扣，再向外取下。',view:'rear'},
 wire:{title:'双路引线',body:'两路独立引线及末端接头。可放大查看线束走向与接口位置。',view:'rear'}
};
const stage=$('#stage'), canvas=$('#canvas');
let renderer,scene,camera,controls,root,front,meshCount=0,motion=null,uvLog=[];
const meshes=[],trims=[],layers=[]; let wall, installGoal={y:0,z:.42},playing=false,playClock=0;
let lastTime=performance.now();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function announce(s){$('#status').textContent=s;}
function error(e){console.error(e);$('#loading').hidden=true;$('#fallback').hidden=false;$('#fallback img').src=A.poster;$('#fallback p').textContent='当前浏览器无法显示三维模型。你仍可查看样品图；建议使用新版 Chrome、Safari 或 Edge 打开。';announce('已切换为图片预览');document.body.dataset.ready='fallback';}
function asBuffer(b64){const b=atob(b64);return Uint8Array.from(b,c=>c.charCodeAt(0)).buffer;}
async function init(){
 try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=1.11;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(36,1,.01,30);camera.position.set(1.1,.65,4.6);
 controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=.35;controls.maxDistance=8;controls.maxPolarAngle=Math.PI*.93;controls.enablePan=true;controls.autoRotateSpeed=1;
 controls.target.set(0,0,0);controls.addEventListener('start',()=>{motion=null;$('#gesture').classList.add('used');});
 scene.add(new THREE.HemisphereLight(0xffffff,0x657168,2.4));
 for(const [x,y,z,p] of [[1,2,3,3],[-2,1,-2,2],[1,0,-3,1]]){const light=new THREE.DirectionalLight(0xffffff,p);light.position.set(x,y,z);scene.add(light);}
 const loader=new GLTFLoader();const gltf=await loader.loadAsync(A.model);root=gltf.scene;scene.add(root);root.position.set(0,-1.2,0);
 root.traverse(o=>{if(!o.isMesh)return;meshCount++;const name=o.userData.sourceName||o.name;o.userData.originalName=name;o.userData.base=o.position.clone();meshes.push(o);
  if(name==='实拍纹理面'){front=o;o.material=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.FrontSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4});}
  else {const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.metalness=Math.min(m.metalness??0,.35);m.roughness=Math.max(m.roughness??.4,.4);}}
  if(['左','右','上','下'].includes(name))trims.push(o);
  if(name==='天然石材'||name==='实拍纹理面')o.userData.layer=.45;
  else if(name==='胶片')o.userData.layer=.30;
  else if(name==='磨砂玻璃')o.userData.layer=.17;
  else if(name.startsWith('导光板'))o.userData.layer=.07;
  if(o.userData.layer)layers.push(o);
 });
 if(!front)throw Error('模型缺少正面');
 const tl=new THREE.TextureLoader();const textures=await Promise.all([A.off,A.on].map(url=>tl.loadAsync(url)));
 for(const t of textures){t.colorSpace=THREE.SRGBColorSpace;t.flipY=false;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}
 window.panelTextures=textures;
 state.ready=true;createWall();updateAppearance();resize();$('#loading').hidden=true;document.body.dataset.ready='true';$('#stage').setAttribute('aria-busy','false');announce('模型已加载，可拖动旋转或选择细节');
 document.querySelectorAll('button[data-requires-model],input[data-requires-model]').forEach(b=>b.disabled=false);
 controls.saveState();loop();
 }catch(e){error(e)}
}
function updateAppearance(){if(!state.ready)return;const c=cards[state.variant];front.material.map=window.panelTextures[state.on?1:0];front.material.color.setScalar(state.on?1.8:1.0);front.material.needsUpdate=true;
 const uv=front.geometry.attributes.uv,position=front.geometry.attributes.position,coords=state.on?c.on:c.off;
 for(let i=0;i<uv.count;i++){const u=(position.getX(i)+.4)/.8,v=position.getY(i)/2.4;
 // Geometry exported by Blender: X spans the face and Y points upward; images use top-down UV.
 const x=(1-v)*((1-u)*coords[0][0]+u*coords[1][0])+v*((1-u)*coords[3][0]+u*coords[2][0]);
 const y=(1-v)*((1-u)*coords[0][1]+u*coords[1][1])+v*((1-u)*coords[3][1]+u*coords[2][1]);uv.setXY(i,x/1920,y/1295);}
 uv.needsUpdate=true;uvLog=Array.from(uv.array);
 trims.forEach(o=>o.visible=!state.exploded&&c.show.includes(o.userData.originalName));
 $('#variant-name').textContent=c.name;$('#variant-desc').textContent=c.sub;$('#light-label').textContent=state.on?'亮灯 · 透光表现':'熄灯 · 自然纹理';
 document.querySelectorAll('[data-variant]').forEach(b=>{let active=+b.dataset.variant===state.variant;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
 document.querySelectorAll('[data-light]').forEach(b=>{let active=(b.dataset.light==='on')===state.on;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
 $('#stage').classList.toggle('lit',state.on);announce(`${c.name}，${state.on?'亮灯':'熄灯'}状态`);
}
const views={front:{eye:[1.1,.65,4.6],at:[0,0,0]},rear:{eye:[-1.25,.6,-4.6],at:[0,0,-.03]},top:{eye:[.9,2.7,1.6],at:[0,.9,0]},side:{eye:[3,.55,.8],at:[0,0,0]},exploded:{eye:[2.6,1.2,4.3],at:[0,0,.18]},install:{eye:[-2.2,.8,4.1],at:[0,0,-.12]}};
function moveView(name){if(!state.ready)return;const v=views[name];state.view=name;controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');$('#rotate').textContent='自动旋转';
 motion={start:performance.now(),from:camera.position.clone(),to:new THREE.Vector3(...v.eye),atFrom:controls.target.clone(),atTo:new THREE.Vector3(...v.at),duration:reduced?0:650};
 document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===name;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
}
function showDetail(key){const d=details[key];state.detail=key;$('#detail-title').textContent=d.title;$('#detail-body').textContent=d.body;$('#detail-card').hidden=false;moveView(d.view);announce(d.title);}
function resize(){if(!renderer)return;const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage);
function loop(now=performance.now()){
 requestAnimationFrame(loop);const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;
 if(motion){const t=motion.duration?Math.min(1,(now-motion.start)/motion.duration):1;const e=1-(1-t)**3;camera.position.lerpVectors(motion.from,motion.to,e);controls.target.lerpVectors(motion.atFrom,motion.atTo,e);if(t>=1)motion=null;}
 const factor=state.exploded?+$('#explode-range').value/100:0;
 for(const o of layers){const target=o.userData.base.z+o.userData.layer*factor;o.position.z=THREE.MathUtils.damp(o.position.z,target,10,dt);}
 if(state.module===3){root.position.y=THREE.MathUtils.damp(root.position.y,-1.2+installGoal.y,9,dt);root.position.z=THREE.MathUtils.damp(root.position.z,installGoal.z,9,dt);if(playing && now-playClock>1800){if(state.installStep<5){setInstallStep(state.installStep+1,false);playClock=now}else{stopInstall()}}}
 controls.update();renderer.render(scene,camera);
 const rear=camera.position.z<controls.target.z;
 document.querySelectorAll('.hotspot').forEach(b=>{let key=b.dataset.detail;let point=key==='cap'?new THREE.Vector3(0,1.2,.01):key==='rail'?new THREE.Vector3(.23,.65,-.055):key==='wire'?new THREE.Vector3(-.18,.15,-.06):new THREE.Vector3(.3,.25,.015+.45*factor);
 point.project(camera);const r=stage.getBoundingClientRect();b.style.left=`${(point.x*.5+.5)*r.width}px`;b.style.top=`${(-point.y*.5+.5)*r.height}px`;b.hidden=state.module===3||point.z>1||Math.abs(point.x)>1||Math.abs(point.y)>1||((key==='rail'||key==='wire')?!rear:rear);});
}
document.querySelectorAll('[data-variant]').forEach(b=>b.addEventListener('click',()=>{state.variant=+b.dataset.variant;updateAppearance()}));
document.querySelectorAll('[data-light]').forEach(b=>b.addEventListener('click',()=>{state.on=b.dataset.light==='on';updateAppearance()}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>moveView(b.dataset.view)));
document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.detail)));
$('#detail-close').onclick=()=>{$('#detail-card').hidden=true;state.detail=null};
$('#explode').onclick=()=>{if(state.module===3)setModule(1);state.exploded=!state.exploded;$('#explode').setAttribute('aria-pressed',state.exploded);$('#explode-controls').hidden=!state.exploded;updateAppearance();$('#detail-card').hidden=true;moveView(state.exploded?'exploded':'front');};
$('#rotate').onclick=()=>{motion=null;controls.autoRotate=!controls.autoRotate;$('#rotate').setAttribute('aria-pressed',controls.autoRotate);$('#rotate').textContent=controls.autoRotate?'暂停旋转':'自动旋转'};
$('#reset').onclick=()=>{if(state.module===3){setInstallStep(0);moveView('install');return}state.exploded=false;$('#explode').setAttribute('aria-pressed','false');$('#explode-controls').hidden=true;$('#detail-card').hidden=true;updateAppearance();moveView('front')};
$('#zoom-in').onclick=()=>{motion=null;const d=camera.position.clone().sub(controls.target);camera.position.copy(controls.target).add(d.setLength(Math.max(controls.minDistance,d.length()*.8)))};
$('#zoom-out').onclick=()=>{motion=null;const d=camera.position.clone().sub(controls.target);camera.position.copy(controls.target).add(d.setLength(Math.min(controls.maxDistance,d.length()*1.25)))};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(stage.requestFullscreen)await stage.requestFullscreen();else announce('可横屏查看更大画面')}catch{announce('当前浏览器不支持全屏，请横屏查看')}};
canvas.addEventListener('keydown',e=>{if(!state.ready)return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const d=camera.position.clone().sub(controls.target);d.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?-.15:.15);camera.position.copy(controls.target).add(d)}if(e.key==='+')$('#zoom-in').click();if(e.key==='-')$('#zoom-out').click();});
window.viewerDebug=()=>({ready:state.ready,...state,meshCount,uv:uvLog,visibleTrims:trims.filter(o=>o.visible).map(o=>o.userData.originalName),camera:camera?.position.toArray(),target:controls?.target.toArray(),layerOffsets:layers.map(o=>({name:o.userData.originalName,z:o.position.z-o.userData.base.z})),calls:renderer?.info.render.calls,dimensions:[800,2400],rootPosition:root?.position.toArray(),wallVisible:wall?.visible,playing,wallRailCount:wall?.children.filter(o=>o.userData.rail).length});
__EXTRA__
init();