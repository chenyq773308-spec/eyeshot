import { useMemo, useState } from "react";

const navItems = [
  { label: "材质系统", href: "#materials" },
  { label: "空间方案", href: "#spaces" },
  { label: "标杆案例", href: "#cases" },
  { label: "交付能力", href: "#delivery" },
  { label: "联系", href: "#contact" },
];

const assets = {
  logo: "/assets/logo/logo-primary.svg",
  logoDark: "/assets/logo/logo-dark.svg",
  hero: "/assets/scenes/rain-courtyard.png",
  material: "/assets/scenes/material-texture-banner.png",
  luxury: "/assets/scenes/luxury-store.png",
  tea: "/assets/scenes/lakeside-tea.png",
  theater: "/assets/scenes/theater.png",
  library: "/assets/scenes/library.png",
  museum: "/assets/scenes/museum.png",
  cafe: "/assets/scenes/cafe.png",
  bar: "/assets/scenes/bar.png",
  wallPdf: "/assets/pdf/wall-panel-02.png",
  doorPdf: "/assets/pdf/barn-door-02.png",
  trayPdf: "/assets/pdf/art-tray-2.png",
  curtainPdf: "/assets/pdf/curtain-wall-02.png",
  landscapePdf: "/assets/pdf/landscape-wall-02.png",
  huarunPdf: "/assets/pdf/huarun-case-02.png",
};

const productLines = [
  {
    title: "热熔天然石墙板",
    en: "Translucent stone-glass",
    text: "以天然石纹、透光复合与墙面系统节点，服务会所、零售、酒店与高端住宅背景空间。",
    image: assets.wallPdf,
  },
  {
    title: "热熔天然石谷仓门 PRO",
    en: "Barn door system",
    text: "将透光石材、移门结构与节点深化合为一体，适合隔断、入口、陈列与私宅动线。",
    image: assets.doorPdf,
  },
  {
    title: "天然光感艺术盘",
    en: "Illuminated art tray",
    text: "以天然玉石纹理和三档色温光效承载茶席、照明、陈设与空间仪式感。",
    image: assets.trayPdf,
  },
];

const spaceSolutions = [
  {
    title: "建筑幕墙",
    text: "从高透光复合石材、LED 系统到幕墙节点，形成昼夜皆可被识别的建筑表皮。",
    image: assets.curtainPdf,
  },
  {
    title: "景观展墙",
    text: "让山水、庭院、礼序与光影进入入口界面，塑造项目归家与社交的第一感受。",
    image: assets.landscapePdf,
  },
  {
    title: "地产会所",
    text: "以自然、秩序与光影为线索，构建从装饰到情绪体验的项目空间表达。",
    image: assets.huarunPdf,
  },
];

const cases = [
  {
    type: "建筑幕墙",
    title: "新加坡 The Reserve",
    text: "珍稀材质幕墙系统化精研，整合透光、耐候、结构与光效，让建筑表面成为地标记忆。",
    image: assets.curtainPdf,
  },
  {
    type: "建筑幕墙",
    title: "圣罗兰 YSL 旗舰店",
    text: "以黑白石材图腾和昼夜双生光效回应品牌识别，让橱窗和建筑共同讲述品牌故事。",
    image: assets.luxury,
  },
  {
    type: "景观展墙",
    title: "杭州保利云城",
    text: "以轩屏、画卷、四季与社交场域为主线，让展墙成为项目精神入口。",
    image: assets.landscapePdf,
  },
  {
    type: "地产会所",
    title: "杭州华润元起观潮",
    text: "在现代结构与自然光线之间，保留光线流淌与材质温度，形成归家旅程。",
    image: assets.huarunPdf,
  },
  {
    type: "商业空间",
    title: "奢侈品旗舰店",
    text: "以背光天然石纹强化品牌圣殿感，兼顾陈列、橱窗、体验与长时间视觉记忆。",
    image: assets.luxury,
  },
  {
    type: "室内系统",
    title: "墙板、谷仓门与茶席光感",
    text: "把材料、构造、照明与陈设整合到室内系统，服务从背景墙到移动界面的完整落地。",
    image: assets.tea,
  },
];

const filters = ["全部", "建筑幕墙", "景观展墙", "地产会所", "商业空间", "室内系统"];

const process = ["项目沟通", "材质选型", "光效验证", "节点深化", "工厂预制", "现场协同"];

const capabilities = [
  "透光石材复合系统",
  "幕墙与展墙节点深化",
  "室内墙板、谷仓门与光感产品落地",
];

function App() {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [formStatus, setFormStatus] = useState("");

  const visibleCases = useMemo(() => {
    if (activeFilter === "全部") return cases;
    return cases.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["name", "phone", "city", "type", "message"];
    const missing = required.some((key) => !String(data.get(key) || "").trim());

    if (missing) {
      setFormStatus("请补充姓名、联系方式、项目城市、空间类型和需求说明。");
      return;
    }

    setFormStatus("已记录本次项目需求。正式上线后可接入邮件或表单服务。");
    event.currentTarget.reset();
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="EYESHOT 颜界首页">
          <img src={assets.logo} alt="EYESHOT 颜界" />
        </a>
        <nav aria-label="主导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="mailto:hello@eyeshot.art">
          项目咨询
        </a>
      </header>

      <main id="top">
        <section className="hero section-anchor" aria-labelledby="hero-title">
          <div className="hero-copy">
            <img className="hero-logo" src={assets.logo} alt="EYESHOT 颜界" />
            <h1 id="hero-title">透光石材与空间系统交付</h1>
            <p className="hero-slogan">透 以 颜 • 臻 于 界</p>
            <p className="hero-intro">
              颜界热熔天然石连接天然纹理、光影科技与节点深化，面向建筑幕墙、景观展墙、商业空间与室内系统，完成从材料判断到现场协同的项目落地。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contact">
                预约项目沟通
              </a>
              <a className="button ghost" href="#cases">
                查看空间案例
              </a>
            </div>
            <div className="hero-meta">
              <span>颜界热熔天然石</span>
              <span>Fused Natural Stone</span>
            </div>
          </div>
          <div className="hero-media">
            <img src={assets.hero} alt="雨中庭院里的透光天然石展墙" />
          </div>
        </section>

        <section id="materials" className="materials section-anchor">
          <div className="section-heading">
            <p className="section-index">01 / MATERIAL SYSTEM</p>
            <h2>材质系统</h2>
            <p>让天然石纹拥有透光、结构与交付边界。</p>
          </div>

          <div className="material-banner">
            <img src={assets.material} alt="颜界热熔天然石材质纹理横幅" />
            <div>
              <span>颜界热熔天然石</span>
              <strong>清透、温润、可进入工程节点</strong>
            </div>
          </div>

          <div className="product-lines">
            {productLines.map((item) => (
              <article className="product-row" key={item.title}>
                <div className="product-text">
                  <span>{item.en}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <figure>
                  <img src={item.image} alt={item.title} />
                </figure>
              </article>
            ))}
          </div>
        </section>

        <section id="spaces" className="spaces section-anchor">
          <div className="section-heading">
            <p className="section-index">02 / SPATIAL SOLUTIONS</p>
            <h2>空间方案</h2>
            <p>从材料、光影到节点，形成可交付的空间表达。</p>
          </div>

          <div className="solution-grid">
            {spaceSolutions.map((item) => (
              <article className="solution-panel" key={item.title}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cases" className="cases section-anchor">
          <div className="section-heading split">
            <div>
              <p className="section-index">03 / SELECTED CASES</p>
              <h2>标杆案例</h2>
            </div>
            <p>
              以现有项目资料为基础，呈现建筑幕墙、景观展墙、地产会所、奢侈品商业与室内系统的不同落点。
            </p>
          </div>

          <div className="filter-bar" aria-label="案例筛选">
            {filters.map((filter) => (
              <button
                key={filter}
                className={filter === activeFilter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="case-grid">
            {visibleCases.map((item) => (
              <article className="case-card" key={`${item.type}-${item.title}`}>
                <img src={item.image} alt={item.title} />
                <div className="case-body">
                  <span>{item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="delivery" className="delivery section-anchor">
          <div className="delivery-copy">
            <p className="section-index">04 / DELIVERY</p>
            <h2>交付能力</h2>
            <p>
              EYESHOT 颜界不只提供一张漂亮材料图，而是围绕项目场景完成材质判断、光效验证、节点深化、工厂预制与现场协同。
            </p>
            <div className="capability-list">
              {capabilities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="process-board">
            {process.map((item, index) => (
              <div className="process-step" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="atelier">
          <div className="atelier-image wide">
            <img src={assets.luxury} alt="奢侈品旗舰店中的热熔天然石应用" />
          </div>
          <div className="atelier-image tall">
            <img src={assets.theater} alt="剧院场景中的热熔天然石应用" />
          </div>
          <div className="atelier-image tall">
            <img src={assets.library} alt="图书馆场景中的热熔天然石应用" />
          </div>
          <div className="atelier-caption">
            <span>从品牌圣殿到公共文化空间</span>
            <strong>让材料成为空间情绪的主角。</strong>
          </div>
        </section>

        <section id="contact" className="contact section-anchor">
          <div className="contact-copy">
            <p className="section-index">05 / CONTACT</p>
            <h2>让下一处空间，拥有被光穿透的边界</h2>
            <p>
              提交项目场景、尺寸与材料方向，颜界团队将协助完成材质选型与节点深化。
            </p>
            <div className="contact-details">
              <a href="mailto:hello@eyeshot.art">hello@eyeshot.art</a>
              <a href="tel:13512133553">135 1213 3553</a>
              <span>江苏太仓 大连东路70号</span>
              <span>上海展厅即将开放</span>
              <span>蒙星 / Founder</span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              姓名
              <input name="name" type="text" autoComplete="name" />
            </label>
            <label>
              电话 / 微信
              <input name="phone" type="text" autoComplete="tel" />
            </label>
            <label>
              项目城市
              <input name="city" type="text" />
            </label>
            <label>
              空间类型
              <select name="type" defaultValue="">
                <option value="" disabled>
                  请选择
                </option>
                <option>建筑幕墙</option>
                <option>景观展墙</option>
                <option>地产会所</option>
                <option>奢侈品商业</option>
                <option>室内系统</option>
              </select>
            </label>
            <label className="full">
              需求说明
              <textarea name="message" rows="5" />
            </label>
            <button className="button primary" type="submit">
              发送项目需求
            </button>
            <p className="form-status" role="status">
              {formStatus}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <img src={assets.logoDark} alt="EYESHOT 颜界" />
        <div>
          <strong>透 以 颜 • 臻 于 界</strong>
          <span>eyeshot.art / hello@eyeshot.art</span>
        </div>
        <nav aria-label="页脚导航">
          {navItems.slice(0, 4).map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}

export default App;
