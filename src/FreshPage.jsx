import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownload24Regular,
  ArrowRight24Regular,
  ArrowShuffle24Regular,
  CheckmarkCircle24Regular,
  Code24Regular,
  Desktop24Regular,
  Flash24Regular,
  FolderOpen24Regular,
  Image24Regular,
  LeafOne24Regular,
  Library24Regular,
  Open24Regular,
  Pause24Filled,
  Play24Filled,
  ShieldCheckmark24Regular,
  Sparkle24Regular,
  Video24Regular,
  WeatherMoon24Regular,
} from "@fluentui/react-icons";
import "./fresh-page.css";

const GITHUB_URL = "https://github.com/1114656/MotionWallpaper";
const RELEASE_URL = `${GITHUB_URL}/releases/tag/v1.0.0`;
const INSTALLER_URL = `${GITHUB_URL}/releases/download/v1.0.0/MotionWallpaper-.-v1.0.0-Windows-x64-.exe`;
const SLIDE_MS = 6000;

const scenes = [
  { src: "/assets/wallpaper-leaves.png", name: "Morning Leaves", tone: "晨光 · 树叶" },
  { src: "/assets/wallpaper-clouds.png", name: "Cloud Drift", tone: "午后 · 流云" },
  { src: "/assets/wallpaper-underwater.png", name: "Aqua Light", tone: "浅海 · 光斑" },
  { src: "/assets/wallpaper-flow.png", name: "Blue Current", tone: "抽象 · 水流" },
];

const modes = [
  {
    key: "original",
    icon: <Image24Regular />,
    label: "原画优先",
    tag: "保真",
    title: "细节与色彩，原样留在桌面。",
    copy: "直接使用导入的源素材播放，适合插着电源、想要最好画面的时候。",
    quality: 100,
    calm: 35,
  },
  {
    key: "balanced",
    icon: <Flash24Regular />,
    label: "自动平衡",
    tag: "推荐",
    title: "好看，也不打扰。",
    copy: "根据素材建立性能副本，在画质与资源占用之间取得平衡，日常使用的默认之选。",
    quality: 78,
    calm: 72,
  },
  {
    key: "low",
    icon: <WeatherMoon24Regular />,
    label: "低功耗",
    tag: "安静",
    title: "把空间，留给工作与续航。",
    copy: "用更克制的播放策略降低占用，画面依旧在，只是更安静。",
    quality: 52,
    calm: 100,
  },
];

const features = [
  { icon: <Desktop24Regular />, title: "多显示器", copy: "每块屏幕可以分别设置壁纸，主屏副屏各有风景。" },
  { icon: <Sparkle24Regular />, title: "动态屏保", copy: "离开电脑时，喜欢的画面继续在屏幕上流动。" },
  { icon: <Library24Regular />, title: "媒体库", copy: "图片与视频分组管理，随机轮换也井井有条。" },
  { icon: <ShieldCheckmark24Regular />, title: "本地优先", copy: "素材留在你的电脑上，切换模式不会改写源文件。" },
];

const steps = [
  { icon: <FolderOpen24Regular />, title: "导入素材", copy: "把本地的图片或视频拖进媒体库。" },
  { icon: <Desktop24Regular />, title: "选择屏幕", copy: "为每块显示器挑一张喜欢的壁纸。" },
  { icon: <LeafOne24Regular />, title: "选好模式", copy: "原画、平衡或低功耗，随心切换。" },
];

function useReveal(rootRef) {
  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll(".fr-reveal") ?? [];
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [rootRef]);
}

function Showcase({ paused }) {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  const go = useCallback((index) => {
    setActive(index);
    setCycle((value) => value + 1);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setTimeout(() => go((active + 1) % scenes.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, cycle, go]);

  const current = scenes[active];
  return (
    <div className="fr-showcase fr-reveal" style={{ "--d": "160ms" }}>
      <div className="fr-sheet fr-sheet--back" aria-hidden="true" />
      <div className="fr-sheet fr-sheet--mid" aria-hidden="true" />
      <figure className="fr-stage">
        {scenes.map((scene, index) => (
          <img
            key={scene.src}
            src={scene.src}
            alt={index === active ? `${scene.name} 壁纸预览` : ""}
            className={`fr-stage__img ${index === active ? "is-active" : ""}`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="fr-stage__light" aria-hidden="true" />
        <figcaption className="fr-stage__caption">
          <span className="fr-live-dot" aria-hidden="true" />
          <span><b>{current.name}</b><small>{current.tone}</small></span>
        </figcaption>
        <div className="fr-stage__progress" aria-hidden="true">
          <i key={`${active}-${cycle}`} style={{ animationDuration: `${SLIDE_MS}ms` }} />
        </div>
      </figure>
      <div className="fr-thumbs" role="tablist" aria-label="切换预览壁纸">
        {scenes.map((scene, index) => (
          <button
            key={scene.src}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={`fr-thumb ${index === active ? "is-active" : ""}`}
            onClick={() => go(index)}
          >
            <img src={scene.src} alt="" />
            <span>{scene.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModesSection() {
  const [modeIndex, setModeIndex] = useState(1);
  const mode = modes[modeIndex];
  return (
    <section className="fr-modes fr-shell" id="modes" aria-labelledby="fr-modes-title">
      <div className="fr-section-head fr-reveal">
        <p className="fr-kicker">三种性能模式</p>
        <h2 id="fr-modes-title">想要画质，还是安静？<br /><span>不必二选一。</span></h2>
        <p>切换模式只改变播放策略，不会改写你导入的源文件。</p>
      </div>

      <div className="fr-modes__panel fr-reveal">
        <div className="fr-modes__side">
          <div className="fr-segment" role="tablist" aria-label="性能模式">
            {modes.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={index === modeIndex}
                className={index === modeIndex ? "is-active" : ""}
                onClick={() => setModeIndex(index)}
              >
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
            <i className="fr-segment__pill" style={{ "--i": modeIndex }} aria-hidden="true" />
          </div>

          <div className="fr-modes__copy" key={mode.key}>
            <span className="fr-tag">{mode.tag}</span>
            <h3>{mode.title}</h3>
            <p>{mode.copy}</p>
          </div>

          <dl className="fr-meters">
            <div>
              <dt>画面细节</dt>
              <dd><span style={{ "--v": `${mode.quality}%` }} /></dd>
            </div>
            <div>
              <dt>安静程度</dt>
              <dd><span style={{ "--v": `${mode.calm}%` }} /></dd>
            </div>
            <p className="fr-meters__note">示意，非实测数据</p>
          </dl>
        </div>

        <div className={`fr-modes__preview is-${mode.key}`}>
          <img src="/assets/wallpaper-clouds.png" alt="性能模式效果示意" />
          <div className="fr-modes__badge">{mode.icon}<span>{mode.label}</span></div>
        </div>
      </div>
    </section>
  );
}

export default function FreshPage({ onDownload, versionLinks = true }) {
  const rootRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useReveal(rootRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main ref={rootRef} className={`fr-site ${paused ? "fr-paused" : ""}`} id="top">
      <div className="fr-atmosphere" aria-hidden="true">
        <span className="fr-blob fr-blob--mint" />
        <span className="fr-blob fr-blob--sky" />
        <span className="fr-blob fr-blob--sun" />
        {Array.from({ length: 14 }, (_, i) => <i key={i} className="fr-mote" style={{ "--n": i }} />)}
      </div>

      <header className={`fr-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="fr-header__inner">
          <a className="fr-brand" href="#top" aria-label="MotionWallpaper 首页">
            <img src="/assets/motion-logo.png" alt="" />
            <span>MotionWallpaper</span>
          </a>
          <nav className="fr-nav" aria-label="主导航">
            <a href="#features">功能</a>
            <a href="#modes">性能模式</a>
            <a href="#start">上手</a>
            <a href="#open">开源</a>
          </nav>
          <div className="fr-header__actions">
            <a className="fr-icon-link" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub 仓库">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
            </a>
            <a className="fr-btn fr-btn--small" href={INSTALLER_URL}>下载</a>
          </div>
        </div>
      </header>

      <section className="fr-hero fr-shell">
        <div className="fr-hero__copy">
          <a className="fr-badge fr-reveal" href={RELEASE_URL} target="_blank" rel="noreferrer">
            <span className="fr-badge__dot" aria-hidden="true" />
            v1.0.0 正式版已发布
            <ArrowRight24Regular aria-hidden="true" />
          </a>
          <h1 className="fr-reveal" style={{ "--d": "60ms" }}>
            让桌面<br /><em>轻轻地</em>动起来
          </h1>
          <p className="fr-lede fr-reveal" style={{ "--d": "120ms" }}>
            {"MotionWallpaper 是一款原生、轻量、开源的 Windows 动态壁纸应用。视频、图片、多显示器与动态屏保，都在一个干净的窗口里。"}
          </p>
          <div className="fr-actions fr-reveal" style={{ "--d": "180ms" }}>
            <a className="fr-btn" href={INSTALLER_URL}>
              <ArrowDownload24Regular aria-hidden="true" />下载 Windows 版
            </a>
            <button className="fr-btn fr-btn--ghost" type="button" onClick={onDownload}>
              安装与校验说明
            </button>
          </div>
          <ul className="fr-facts fr-reveal" style={{ "--d": "240ms" }}>
            <li><CheckmarkCircle24Regular aria-hidden="true" />免费 · MIT 开源</li>
            <li><CheckmarkCircle24Regular aria-hidden="true" />Windows 10 22H2+ · x64</li>
          </ul>
        </div>
        <Showcase paused={paused} />
      </section>

      <section className="fr-features fr-shell" id="features" aria-labelledby="fr-features-title">
        <div className="fr-section-head fr-reveal">
          <p className="fr-kicker">为 Windows 桌面而生</p>
          <h2 id="fr-features-title">安静地陪着你，<br /><span>也让每次回到桌面都有点不一样。</span></h2>
        </div>

        <div className="fr-bento">
          <article className="fr-card fr-card--media fr-reveal">
            <div className="fr-card__text">
              <span className="fr-card__icon"><Video24Regular /></span>
              <h3>视频和图片，都能当壁纸</h3>
              <p>导入本地素材即可使用。基于 WinUI 3 的原生窗口，打开就是熟悉的 Windows 质感。</p>
            </div>
            <div className="fr-marquee" aria-hidden="true">
              <div className="fr-marquee__track">
                {[...scenes, ...scenes].map((scene, i) => (
                  <img key={`${scene.src}-${i}`} src={scene.src} alt="" />
                ))}
              </div>
            </div>
          </article>

          <article className="fr-card fr-card--shuffle fr-reveal" style={{ "--d": "80ms" }}>
            <span className="fr-card__icon"><ArrowShuffle24Regular /></span>
            <h3>随机轮换</h3>
            <p>让收藏的画面按自己的节奏轮流登场。</p>
            <div className="fr-stack" aria-hidden="true">
              {scenes.slice(0, 3).map((scene, i) => (
                <img key={scene.src} src={scene.src} alt="" style={{ "--k": i }} />
              ))}
            </div>
          </article>

          {features.map((item, i) => (
            <article className="fr-card fr-card--small fr-reveal" key={item.title} style={{ "--d": `${120 + i * 70}ms` }}>
              <span className="fr-card__icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <ModesSection />

      <section className="fr-start fr-shell" id="start" aria-labelledby="fr-start-title">
        <div className="fr-section-head fr-section-head--center fr-reveal">
          <p className="fr-kicker">三步上手</p>
          <h2 id="fr-start-title">从收藏，到桌面。</h2>
        </div>
        <ol className="fr-steps">
          {steps.map((step, i) => (
            <li className="fr-step fr-reveal" key={step.title} style={{ "--d": `${i * 110}ms` }}>
              <span className="fr-step__num">0{i + 1}</span>
              <span className="fr-step__icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="fr-open fr-shell" id="open" aria-labelledby="fr-open-title">
        <div className="fr-open__card fr-reveal">
          <div className="fr-open__art" aria-hidden="true">
            <img src="/assets/wallpaper-leaves.png" alt="" />
          </div>
          <div className="fr-open__copy">
            <img className="fr-open__logo" src="/assets/motion-logo.png" alt="MotionWallpaper 图标" />
            <p className="fr-kicker">开源 · MIT License</p>
            <h2 id="fr-open-title">一款可以了解、参与<br />和改进的壁纸应用。</h2>
            <p>架构说明、更新记录与贡献指南都在 GitHub 上公开。欢迎提 Issue，也欢迎一起写代码。</p>
            <div className="fr-actions">
              <a className="fr-btn" href={INSTALLER_URL}><ArrowDownload24Regular aria-hidden="true" />下载安装包</a>
              <a className="fr-btn fr-btn--ghost" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <Code24Regular aria-hidden="true" />查看源代码
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="fr-footer fr-shell">
        <a className="fr-brand" href="#top">
          <img src="/assets/motion-logo.png" alt="" />
          <span>MotionWallpaper</span>
        </a>
        <p>原生、轻量、开源，为 Windows 桌面而生。</p>
        <div className="fr-footer__links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub <Open24Regular aria-hidden="true" /></a>
          <a href={RELEASE_URL} target="_blank" rel="noreferrer">版本说明</a>
          {versionLinks && <a href="/versions">往期设计</a>}
        </div>
      </footer>

      <button
        className="fr-pause"
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "继续播放动效" : "暂停动效"}
        title={paused ? "继续播放动效" : "暂停动效"}
      >
        {paused ? <Play24Filled /> : <Pause24Filled />}
      </button>
    </main>
  );
}
