const installSteps=[
 {title:'01 · 分离待装',body:'墙侧铝条与产品铝挂件分别固定，上下两道一一对应。',y:0,z:.42},
 {title:'02 · 抬高板材',body:'先抬高整板，为正反扣口留出挂入空间。',y:.12,z:.42},
 {title:'03 · 靠墙对位',body:'保持抬高状态，向墙体靠近，使两道扣口同时对准。',y:.12,z:0},
 {title:'04 · 下落扣合',body:'平稳向下落位，正反扣口互挂。挂装完成后再做顶部收口。',y:0,z:0},
 {title:'05 · 上移脱扣',body:'拆卸前恢复上移空间，向上抬起整板，使两道扣口脱开。',y:.12,z:0},
 {title:'06 · 向外取下',body:'保持抬起状态，再向外取出整板。',y:.12,z:.42}
];
function createWall(){
 wall=new THREE.Group();wall.visible=false;scene.add(wall);
 const m=new THREE.MeshStandardMaterial({color:0xe5e2da,roughness:.9});
 const b=new THREE.Mesh(new THREE.BoxGeometry(.8,2.4,.08),m);b.position.set(0,0,-.095746);wall.add(b);
 const pts=[[79,44],[137,44],[137,346],[199,346],[199,290],[210,251],[246,251],[257,290],[257,379],[79,379]];
 const tri=THREE.ShapeUtils.triangulateShape(pts.map(([u,v])=>new THREE.Vector2(u,v)),[]);
 for(const z of [.55,1.85]){
  const vertices=[];const n=pts.length;
  for(const x of [-.35,.35]) for(const [u,v] of pts)vertices.push(x,z+(387-v)*.000058-1.2,-(.042+(316-u)*.000058));
  const idx=[];for(const [a,b,c] of tri)idx.push(c,b,a,a+n,b+n,c+n);
  for(let i=0;i<n;i++){const j=(i+1)%n;idx.push(i,j,j+n,i,j+n,i+n)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(idx);g.computeVertexNormals();
  const rail=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xa7b1af,metalness:.4,roughness:.45,side:THREE.DoubleSide}));rail.userData.rail=true;wall.add(rail);
 }
}
function stopInstall(){playing=false;$('#play-install').textContent='播放安装与拆卸';$('#play-install').setAttribute('aria-pressed','false')}
function setInstallStep(i,manual=true){
 if(manual)stopInstall();state.installStep=i;const st=installSteps[i];installGoal={y:st.y,z:st.z};
 $('#install-title').textContent=st.title;$('#install-body').textContent=st.body;
 document.querySelectorAll('[data-step]').forEach(b=>{const yes=+b.dataset.step===i;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',yes)});
 if(reduced&&root){root.position.y=-1.2+st.y;root.position.z=st.z}
 announce(st.title+'。'+st.body);
}
function setModule(i){
 stopInstall();state.module=i;
 document.querySelectorAll('[data-module]').forEach(b=>{const yes=+b.dataset.module===i;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',yes)});
 $('#viewer-layout').hidden=i===2;$('#comparison').hidden=i!==2;$('#config-panel').hidden=i===3;$('#install-panel').hidden=i!==3;
 $('#variant-name').parentElement.hidden=i===3;$('#detail-card').hidden=true;
 document.querySelector('.view-nav').hidden=i===3;
 if(!state.ready){$("#fallback img").src=i===3?"assets/poster-03.png":"assets/poster-01.png";return;}
 state.exploded=false;$('#explode').setAttribute('aria-pressed','false');$('#explode-controls').hidden=true;
 wall.visible=i===3;root.position.set(0,-1.2,0);controls.autoRotate=false;
 if(i===3){state.variant=2;state.on=true;setInstallStep(0);moveView('install')}else if(i===1)moveView('front');
 updateAppearance();resize();
}
document.querySelectorAll('[data-module]').forEach(b=>b.onclick=()=>setModule(+b.dataset.module));
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>setInstallStep(+b.dataset.step));
$('#play-install').onclick=()=>{if(playing){stopInstall();return}setInstallStep(0);playing=true;playClock=performance.now();$('#play-install').textContent='暂停演示';$('#play-install').setAttribute('aria-pressed','true')};
$('#install-prev').onclick=()=>setInstallStep(Math.max(0,state.installStep-1));$('#install-next').onclick=()=>setInstallStep(Math.min(5,state.installStep+1));
document.querySelectorAll('[data-compare]').forEach(b=>b.onclick=()=>{const [v,on]=b.dataset.compare.split(',');state.variant=+v;state.on=on==='on';setModule(1);updateAppearance();$('#viewer-layout').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})});
const dialog=$('#poster-dialog');let posterOpener;
document.querySelectorAll('[data-poster]').forEach(b=>b.onclick=()=>{posterOpener=b;const n=b.dataset.poster;$('#poster-image').src='assets/poster-0'+n+'.png';$('#poster-image').alt=['构造、挂件与透光表现','框型样式比选','墙体安装示意'][n-1];$('#poster-original').href='assets/poster-0'+n+'.png';dialog.showModal()});
$('#poster-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>posterOpener?.focus());
