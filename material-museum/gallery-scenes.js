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
