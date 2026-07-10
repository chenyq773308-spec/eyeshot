import { useEffect, useRef, useState } from "react";

const projects = [
  {
    number: "01",
    title: "The Reserve",
    place: "Singapore · Architecture",
    image: "./assets/img/projects/the-reserve-sg-1.jpg",
    href: "./projects/the-reserve-sg/",
    size: "wide",
  },
  {
    number: "02",
    title: "YSL Flagship",
    place: "China · Retail",
    image: "./assets/img/projects/ysl-flagship-1.jpg",
    href: "./projects/ysl-flagship/",
    size: "portrait",
  },
  {
    number: "03",
    title: "Poly Yuncheng",
    place: "Hangzhou · Landscape",
    image: "./assets/img/projects/poly-yuncheng-1.jpg",
    href: "./projects/poly-yuncheng/",
    size: "landscape",
  },
  {
    number: "04",
    title: "Yuanqi Guanchao",
    place: "Hangzhou · Interior",
    image: "./assets/img/projects/crland-hangzhou-1.jpg",
    href: "./projects/crland-hangzhou/",
    size: "wide",
  },
  {
    number: "05",
    title: "Wuhan Riverfront",
    place: "Wuhan · Landscape",
    image: "./assets/img/projects/wuhan-riverfront-1.jpg",
    href: "./projects/wuhan-riverfront/",
    size: "portrait",
  },
];

const materials = [
  { name: "毕加索", en: "Picasso", image: "./assets/img/textures/series/picasso.webp" },
  { name: "巴西白玉", en: "Crystal White", image: "./assets/img/textures/series/crystal-white.webp" },
  { name: "山水云", en: "Cloudy", image: "./assets/img/textures/series/cloudy.webp" },
  { name: "云白玉", en: "White Onyx", image: "./assets/img/textures/series/white-onyx.webp" },
  { name: "鱼肚白", en: "Calacatta", image: "./assets/img/textures/series/calacatta.webp" },
  { name: "黑洞石", en: "Black Basalt", image: "./assets/img/textures/series/black-basalt.webp" },
  { name: "金兰玉", en: "Blue Pearl", image: "./assets/img/textures/series/blue-pearl.webp" },
  { name: "雪花白", en: "Statuario", image: "./assets/img/textures/series/statuario.webp" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    if (reduceMotion) return () => observer.disconnect();

    const moveCursor = (event) => {
      cursorRef.current?.style.setProperty("transform", `translate3d(${event.clientX}px, ${event.clientY}px, 0)`);
    };
    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", moveCursor);
    };
  }, []);

  function handleHeroMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroRef.current?.style.setProperty("--hero-x", `${x * 18}px`);
    heroRef.current?.style.setProperty("--hero-y", `${y * 18}px`);
  }

  function resetHero() {
    heroRef.current?.style.setProperty("--hero-x", "0px");
    heroRef.current?.style.setProperty("--hero-y", "0px");
  }

  function handleProjectMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--mx", `${x * 14}px`);
    event.currentTarget.style.setProperty("--my", `${y * 14}px`);
  }

  function resetProject(event) {
    event.currentTarget.style.setProperty("--mx", "0px");
    event.currentTarget.style.setProperty("--my", "0px");
  }

  return (
    <div className="site-shell">
      <div className="cursor" ref={cursorRef} aria-hidden="true">
        <span>VIEW</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="EYESHOT 颜界首页">
          <img src="./assets/eyeshot/logo-for-dark-bg.png" alt="EYESHOT 颜界" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span>{menuOpen ? "关闭" : "菜单"}</span>
          <i />
        </button>
        <nav id="site-nav" className={menuOpen ? "is-open" : ""} aria-label="主导航">
          <a href="#projects" onClick={() => setMenuOpen(false)}>项目</a>
          <a href="#material" onClick={() => setMenuOpen(false)}>材质</a>
          <a href="./products/">产品</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>联系</a>
          <a className="nav-en" href="./en/">EN</a>
        </nav>
      </header>

      <main id="top">
        <section
          className="hero"
          ref={heroRef}
          onPointerMove={handleHeroMove}
          onPointerLeave={resetHero}
        >
          <div className="hero-image" aria-hidden="true">
            <img src="./assets/img/projects/the-reserve-sg-1.jpg" alt="" />
          </div>
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">EYESHOT · Fused natural stone</p>
            <h1>
              Light,
              <br />
              held in <em>stone.</em>
            </h1>
            <div className="hero-foot">
              <p>透光云石 · 建筑表皮与空间系统</p>
              <a href="#projects" aria-label="向下浏览精选项目">探索项目 <span>↓</span></a>
            </div>
          </div>
        </section>

        <section className="statement page-pad" data-reveal>
          <p className="section-label">01 / About</p>
          <h2>
            让天然石的纹理，
            <br />
            成为光的建筑。
          </h2>
          <p className="statement-note">
            EYESHOT 颜界以热熔工艺连接石材、玻璃与光，
            <br />
            服务透光石材幕墙、景观、室内与豪宅家居应用。
          </p>
        </section>

        <section id="projects" className="projects page-pad">
          <div className="section-intro" data-reveal>
            <p className="section-label">02 / Selected work</p>
            <h2>精选项目</h2>
            <a href="./projects/">全部项目 <span>↗</span></a>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className={`project project--${project.size}`} key={project.title} data-reveal>
                <a
                  href={project.href}
                  className="project-link cursor-target"
                  onPointerMove={handleProjectMove}
                  onPointerLeave={resetProject}
                >
                  <figure>
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <span className="project-index">{project.number}</span>
                  </figure>
                  <div className="project-meta">
                    <h3>{project.title}</h3>
                    <p>{project.place}</p>
                    <span className="project-arrow">↗</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="material" className="material">
          <div className="material-heading page-pad" data-reveal>
            <p className="section-label">03 / Material</p>
            <h2>Stone becomes light.</h2>
            <a href="./material/">材质系统 <span>↗</span></a>
          </div>
          <div className="material-grid">
            {materials.map((material) => (
              <a className="material-card cursor-target" href="./material/" key={material.name}>
                <img src={material.image} alt={`${material.name}天然石材质大版图`} loading="lazy" />
                <div>
                  <strong>{material.name}</strong>
                  <span>{material.en}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="discipline page-pad" data-reveal>
          <p className="section-label">04 / Practice</p>
          <div className="discipline-list">
            <a href="./solutions/facade/"><span>01</span>透光石材幕墙<i>Architecture</i><b>↗</b></a>
            <a href="./solutions/interior/"><span>02</span>室内空间<i>Interior</i><b>↗</b></a>
            <a href="./solutions/luxury-home/"><span>03</span>豪宅家居应用<i>Residence</i><b>↗</b></a>
            <a href="./solutions/landscape/"><span>04</span>景观园林<i>Landscape</i><b>↗</b></a>
          </div>
        </section>

        <section className="specs page-pad" data-reveal>
          <p className="section-label">05 / Specifications</p>
          <div className="specs-grid">
            <article>
              <span>Facade</span>
              <strong>≤ 1800 × 5000 mm</strong>
              <p>幕墙项目常规规格，超大规格可按项目定制。</p>
            </article>
            <article>
              <span>Barn Door</span>
              <strong>1200 × 2400 mm</strong>
              <p>谷仓门标准尺寸。</p>
            </article>
            <article>
              <span>Wall Panel</span>
              <strong>≤ 1200 × 3000 mm</strong>
              <p>发光墙板系统；所有项目均可提供样板与打样。</p>
            </article>
          </div>
        </section>

        <section id="contact" className="contact page-pad">
          <div data-reveal>
            <p className="section-label">06 / Contact</p>
            <h2>Start a project.</h2>
          </div>
          <div className="contact-grid" data-reveal>
            <a className="contact-mail" href="mailto:hello@eyeshot.art">
              hello@eyeshot.art <span>↗</span>
            </a>
            <div>
              <p>江苏太仓 · 上海</p>
              <a href="tel:+8613512133553">+86 135 1213 3553</a>
            </div>
            <p>透 以 颜 · 臻 于 界</p>
          </div>
        </section>
      </main>

      <footer className="site-footer page-pad">
        <img src="./assets/eyeshot/logo-for-dark-bg.png" alt="EYESHOT 颜界" />
        <p>© {new Date().getFullYear()} EYESHOT</p>
        <a href="#top">返回顶部 ↑</a>
      </footer>
    </div>
  );
}

export default App;
