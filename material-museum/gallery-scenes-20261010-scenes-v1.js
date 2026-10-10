import {scenes as original} from './scenes.js';
const base='https://www.eyeshot.art/';
const application=(file,title,url,relation)=>({title,kind:'官网应用素材',image:`assets/${file}.jpg`,url:base+url,relation});
const luxury={id:3,room:'奢品展廊',en:'THE LUXURY GALLERY',product:'黑洞石透光陈列系统',point:'把星空的深邃，带进奢品空间。',description:'黑洞石的天然孔隙与透光点构成星空般的背景。展墙与陈列台保持完整的材料语言，细腻光点衬托展品，而不是抢走展品的视线。',features:['天然孔隙与点状透光','展墙与陈列台的整体表达','结合展柜与重点照明'],source:base+'solutions/interior/index.html',cases:[application('official-luxury','黑洞石 · 奢品店应用','solutions/interior/index.html','官网的空间应用示意，不作为已建项目证明'),original[0].cases[1]]};
const cinema={id:6,room:'星空影院',en:'THE STARLIGHT CINEMA',product:'黑洞石透光墙顶系统',point:'让每一次观影，从走进星空开始。',description:'依据官网私家影院的应用方向，将黑洞石延伸至墙面和顶面，形成包裹式星空体验。亮度、投影反射与声学构造需要在具体项目中协调。',features:['墙顶连续的星空氛围','低亮度环境与重点照明','灯光、声学与检修一体深化'],source:base+'solutions/luxury-home/index.html',cases:[application('official-cinema','黑洞石 · 私家影院','solutions/luxury-home/index.html','官网应用示意，展示材料氛围，不作为已建项目证明'),original[2].cases[0]]};
const dining={id:7,room:'石纹餐厅',en:'THE BOOKMATCH DINING ROOM',product:'雪花白四拼透光背景墙',point:'四片石纹，汇成一幅完整的画。',description:'参考官网餐厅应用，以雪花白四拼镜像形成空间主景。自然纹理、拼接秩序与暖白透光共同营造用餐氛围；最终排版按实际荒料和整板纹理确认。',features:['四拼镜像与连续画面','自然石纹与暖白透光','拼缝、灯光与检修节点'],source:base+'solutions/interior/index.html',cases:[application('official-dining','雪花白 · 餐厅应用','solutions/interior/index.html','官网应用示意，非已建餐厅项目照片'),original[2].cases[1]]};
export const scenes=[original[0],original[1],original[2],luxury,{...original[3],id:4,description:'外露轨道让整片天然石门沿墙面横向移动。会客厅与相邻展廊由同一门洞相连，展示门片、墙面和家具之间的空间关系。'},{...original[4],id:5,description:'偏轴旋转的天然石门作为礼宾玄关的主景。门片关闭时形成完整石纹画面，打开后把中庭与室内空间相连。'},cinema,dining,original[8],original[9]];
const websiteReferences=[
 ['solutions/facade/index.html','室外幕墙应用','GSG 精研组合构造','the-reserve-sg-1'],
 ['solutions/landscape/index.html','景观园林应用','展墙界面','poly-yuncheng-1'],
 ['products/wall-panel/index.html','墙板系列','墙板系列','wall-panel-cover'],
 ['solutions/interior/index.html','公共空间 · 奢侈品旗舰店','黑洞石品牌界面','official-luxury'],
 ['products/barn-door-pro/index.html','透光门系列 · 谷仓门 Plus','谷仓门Plus','barn-door-plus-cover'],
 ['products/barn-door-pro/index.html','透光门系列 · 旋转门','旋转门','pivot-door-01'],
 ['solutions/luxury-home/index.html','豪宅家居 · 私人影院','私人影院','official-cinema'],
 ['solutions/interior/index.html','公共空间 · 米其林餐厅','米其林餐厅','official-dining'],
 ['products/art-tray/index.html','天然光感艺术盘','天然光感艺术盘','art-tray-01'],
 ['material/index.html','热熔天然石 · 材料体系','GSG 组合构造','stone-texture-01'],
];
scenes.forEach((s,i)=>{const [path,title,section,image]=websiteReferences[i];s.sourcePage=base+path;s.source=base+path+'#:~:text='+encodeURIComponent(section);s.website={title,section,image:`assets/${image}.jpg`,url:s.source};});
export const variants=[{name:'谷仓门 Plus',path:'scene-05',reference:original[3]},{name:'旋转门',path:'scene-06',reference:original[4]},{name:'平开门',path:'door-hinged',reference:original[5]},{name:'平移门',path:'door-sliding',reference:original[6]},{name:'折叠门',path:'door-folding',reference:original[7]}];

// 与本次已选场景图片一致；原始素材、实景证据和模型保持原有来源。
Object.assign(scenes[0],{description:'二层退台展廊延续首层入口与水景，以规则竖向分板呈现透光石幕墙。天然石纹、透光表情与玻璃开口共同构成建筑表皮。',features:['二层退台与首层入口','竖向分格与连续石纹','透光幕墙、收口与工程深化']});
Object.assign(scenes[1],{description:'连续展墙中交替展示背光发光板与自然透光板。傍晚低角度阳光呈现自然透光，石纹、树影与水面倒影共同组织庭院路径。',features:['背光发光与自然透光交替','天然纹理与柔和树影','庭院路径与水面倒影']});
Object.assign(scenes[2],{description:'以 800 × 2400 mm 整板为展示基准，三块墙板采用柔和中性白均匀背光，保留天然纹理。进入独立产品页查看复合构造、框型与 C 形铝挂件安装。'});
Object.assign(scenes[3],{description:'黑洞石以天然孔隙与细碎透光点形成陈列背景。背景墙与展柜底座加入竖向分缝，保留材料整体感，并明确板块尺度。',features:['天然孔隙与点状透光','背景墙与展柜竖向分缝','展品陈列与重点照明']});
Object.assign(scenes[4],{description:'谷仓门 Plus 以自然光穿过天然石门片，呈现柔和通透的石纹界面。外露轨道沿墙横向开合，右端收至与门片协调的位置。',features:['自然光透过天然石门片','外露轨道横向开合','门片、轨道与墙面协调']});
Object.assign(scenes[6],{description:'黑洞石延伸至墙面和顶面，形成包裹式星空体验。墙面分段与顶面板块网格明确材料尺度，灯光、声学和检修构造按具体项目深化。',features:['墙顶连续的星空氛围','墙面分段与顶面板块网格','灯光、声学与检修深化']});
Object.assign(scenes[8],{product:'天然光感艺术盘与透光柜体',description:'前景艺术盘与背景展示柜共同呈现天然石的多样应用。纤薄透光层板和透光背板衬托器物，延续茶室与庭院的暖光氛围。',features:['茶席艺术盘与案头陈设','纤薄透光层板与透光背板','柜体、器物与空间氛围']});
Object.assign(scenes[9],{description:'墙面八块样板按官网 01–08 纹理展示，以均匀整面背光保留各款材料特征。复合层、框型、挂接与维护资料在工坊汇合，方便进入项目深化。',features:['官网 01–08 天然石纹理','整面均匀透光与材料选型','构造、挂接与项目深化']});
variants[0].path='scene-05-20261010-scenes-v1';
variants[0].reference=scenes[4];
