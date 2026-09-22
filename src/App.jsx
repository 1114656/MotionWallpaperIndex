import { useEffect, useMemo, useState } from "react";
import {
  Add24Regular,
  ArrowDownload24Regular,
  ArrowRight24Regular,
  CheckmarkCircle24Filled,
  ChevronRight24Regular,
  Code24Regular,
  Desktop24Regular,
  Dismiss24Regular,
  Flash24Regular,
  Home24Regular,
  Image24Regular,
  Library24Regular,
  Open24Regular,
  Pause24Filled,
  Play24Filled,
  Settings24Regular,
  ShieldCheckmark24Regular,
  Video24Regular,
  WeatherMoon24Regular,
} from "@fluentui/react-icons";

const GITHUB_URL = "https://github.com/1114656/MotionWallpaper-Windows";

const wallpapers = [
  { src: "/assets/wallpaper-underwater.png", label: "Aqua Light", kind: "视频" },
  { src: "/assets/wallpaper-flow.png", label: "Blue Current", kind: "视频" },
  { src: "/assets/wallpaper-clouds.png", label: "Cloud Drift", kind: "视频" },
  { src: "/assets/wallpaper-leaves.png", label: "Morning Leaves", kind: "图片" },
];

const modeItems = [
  { icon: <Image24Regular />, eyebrow: "保真", title: "原画优先", copy: "直接使用源素材，让细节与色彩完整留在桌面上。" },
  { icon: <Flash24Regular />, eyebrow: "推荐", title: "自动平衡", copy: "根据素材建立性能副本，在画质与占用之间取得平衡。" },
  { icon: <WeatherMoon24Regular />, eyebrow: "安静", title: "低功耗", copy: "用更克制的播放策略，给工作与续航留出空间。" },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="MotionWallpaper 首页">
      <img src="/assets/motion-logo.png" alt="" />
      <span>MotionWallpaper</span>
    </a>
  );
}

function PageNav({ variant, onDownload }) {
  const other = variant === "aqua" ? "/cloudline" : "/aqua";
  const otherLabel = variant === "aqua" ? "查看云轨版" : "查看水光版";
  return (
    <nav className="site-nav" aria-label="主导航">
      <Brand />
      <div className="nav-links">
        {variant === "cloudline" && <a href="#features">功能</a>}
        <a href="#performance">性能模式</a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">开源</a>
      </div>
      <div className="nav-actions">
        <a className="variant-link" href={other}>{otherLabel}</a>
        <button className="nav-download" type="button" onClick={onDownload}>下载</button>
      </div>
    </nav>
  );
}

function PlayerButton({ paused, setPaused }) {
  return (
    <button className="player-button" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "继续播放动效" : "暂停动效"} title={paused ? "继续播放动效" : "暂停动效"}>
      {paused ? <Play24Filled /> : <Pause24Filled />}
    </button>
  );
}

function AppWindow({ selected, setSelected, compact = false }) {
  const current = wallpapers[selected] || wallpapers[0];
  return (
    <div className={`app-window ${compact ? "app-window--compact" : ""}`}>
      <div className="window-titlebar">
        <div className="window-name"><img src="/assets/motion-logo.png" alt="" /><span>MotionWallpaper</span></div>
        <div className="window-controls" aria-hidden="true"><span>—</span><span>□</span><span>×</span></div>
      </div>
      <div className="window-body">
        <aside className="app-sidebar">
          <div className="side-item is-active"><Home24Regular /><span>主页</span></div>
          <div className="side-item"><Library24Regular /><span>媒体库</span></div>
          <div className="side-item"><Desktop24Regular /><span>显示器</span></div>
          <div className="side-item"><Settings24Regular /><span>设置</span></div>
          <div className="side-version">v0.1.0</div>
        </aside>
        <div className="app-content">
          <div className="app-heading">
            <div><small>正在播放</small><strong>{current.label}</strong></div>
            <button type="button" aria-label="添加媒体"><Add24Regular /></button>
          </div>
          <div className="preview-frame">
            <img src={current.src} alt={`${current.label} 壁纸预览`} />
            <div className="preview-status"><span></span> 桌面 1 · 自动平衡</div>
          </div>
          <div className="library-row">
            {wallpapers.map((item, index) => (
              <button className={`media-thumb ${selected === index ? "is-selected" : ""}`} type="button" key={item.label} onClick={() => setSelected(index)} aria-label={`切换到 ${item.label}`}>
                <img src={item.src} alt="" />
                <span>{item.kind === "视频" ? <Video24Regular /> : <Image24Regular />}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WallpaperRail({ selected, setSelected }) {
  return (
    <div className="wallpaper-rail" aria-label="壁纸选择">
      {wallpapers.map((item, index) => (
        <button type="button" key={item.label} className={`rail-card ${selected === index ? "is-selected" : ""}`} onClick={() => setSelected(index)}>
          <img src={item.src} alt={`${item.label} 预览`} /><span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function DownloadDialog({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="download-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" type="button" onClick={onClose} aria-label="关闭"><Dismiss24Regular /></button>
        <div className="dialog-icon"><ArrowDownload24Regular /></div>
        <p className="eyebrow">下载说明</p>
        <h2 id="download-title">公开下载地址准备中</h2>
        <p>项目当前为 v0.1.0，仓库内已经具备安装版与便携版构建流程，但公开 GitHub Release 尚未发布。</p>
        <div className="dialog-note"><ShieldCheckmark24Regular /> 正式提供下载时，会同时展示版本、SHA-256 校验值和未签名提示。</div>
        <a className="primary-button" href={GITHUB_URL} target="_blank" rel="noreferrer">前往 GitHub <Open24Regular /></a>
      </section>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="trust-strip reveal">
      <span><CheckmarkCircle24Filled /> MIT 开源</span>
      <span><CheckmarkCircle24Filled /> Windows 原生</span>
      <span><CheckmarkCircle24Filled /> 源文件不改写</span>
      <span><CheckmarkCircle24Filled /> 支持多显示器</span>
    </div>
  );
}

function ModesSection({ variant }) {
  return (
    <section className={`modes-section modes-section--${variant} section-shell`} id="performance">
      <div className="section-heading reveal">
        <p className="eyebrow">三种性能模式</p>
        <div className="mode-heading-layout">
          <h2 className="mode-title"><span>想要画质，</span><span>还是安静？</span><span className="mode-title__answer">不必二选一。</span></h2>
          <p className="mode-description">从原画到低功耗，切换只改变播放策略，不会改写你导入的源文件。</p>
        </div>
      </div>
      <div className="mode-list">
        {modeItems.map((item, index) => (
          <article className="mode-row reveal" key={item.title} style={{ "--delay": `${index * 90}ms` }}>
            <div className="mode-index">0{index + 1}</div><div className="mode-icon">{item.icon}</div>
            <div className="mode-copy"><small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.copy}</p></div><ChevronRight24Regular />
          </article>
        ))}
      </div>
    </section>
  );
}

function CloudStory({ selected, setSelected }) {
  return (
    <section className="feature-story cloud-story section-shell" id="features">
      <div className="section-heading reveal"><p className="eyebrow">一条流动的桌面轨道</p><h2>从收藏，到屏幕。<br />每一步都看得见。</h2></div>
      <div className="timeline-line reveal"><span>01 导入</span><span>02 选择屏幕</span><span>03 调整模式</span><span>04 开始流动</span></div>
      <WallpaperRail selected={selected} setSelected={setSelected} />
      <div className="cloud-note reveal"><Video24Regular /><p><strong>本地媒体库</strong><br />图片与视频分组管理，随机轮换也可以很有秩序。</p></div>
    </section>
  );
}

function OpenSourceSection({ onDownload }) {
  return (
    <section className="open-section section-shell" id="opensource">
      <div className="open-art reveal">
        <img src="/assets/motion-logo.png" alt="MotionWallpaper 图标" />
        <span className="code-chip code-chip--one"><Code24Regular /> MIT</span><span className="code-chip code-chip--two"><Desktop24Regular /> WinUI 3</span><span className="code-chip code-chip--three"><ShieldCheckmark24Regular /> Local first</span>
      </div>
      <div className="open-copy reveal">
        <p className="eyebrow">开放，不只是可以看见</p><h2><span>一款可以真正了解、</span><span>参与和改进的壁纸应用。</span></h2>
        <p>MotionWallpaper 以 MIT 许可证开源。架构、更新记录与贡献指南，都在 GitHub 上公开。</p>
        <div className="open-actions"><a className="primary-button" href={GITHUB_URL} target="_blank" rel="noreferrer">查看源代码 <Open24Regular /></a><button className="secondary-button" type="button" onClick={onDownload}>下载说明</button></div>
      </div>
    </section>
  );
}

function SiteFooter({ variant }) {
  return (
    <footer className="site-footer section-shell">
      <Brand /><p>原生、开源、为 Windows 桌面而生。</p>
      <div className="footer-links"><a href={variant === "aqua" ? "/cloudline" : "/aqua"}>对比另一版</a><a href={GITHUB_URL}>GitHub</a><a href="#top">回到顶部</a></div>
    </footer>
  );
}

function AquaPage({ selected, setSelected, paused, setPaused, onDownload }) {
  return (
    <main className={`site aqua-site ${paused ? "motion-paused" : ""}`} id="top">
      <div className="ambient-layer" aria-hidden="true"></div><PageNav variant="aqua" onDownload={onDownload} />
      <section className="hero aqua-hero">
        <div className="hero-copy hero-copy--center reveal">
          <p className="eyebrow">Windows 桌面的另一种呼吸</p><h1 className="product-hero-title"><span>MotionWallpaper</span></h1>
          <p className="hero-summary">一款原生、轻量、开源的动态壁纸应用。<br />视频、图片、多显示器与动态屏保，都在一个干净的窗口里。</p>
          <div className="hero-actions"><button className="primary-button" type="button" onClick={onDownload}><ArrowDownload24Regular /> 查看下载说明</button><a className="secondary-button" href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub <Open24Regular /></a></div>
          <small className="hero-meta">Windows 10 2004+ · x64 · v0.1.0</small>
        </div>
        <div className="hero-window-stage reveal">
          <div className="glass-disc glass-disc--left" aria-hidden="true"></div><div className="glass-disc glass-disc--right" aria-hidden="true"></div>
          <AppWindow selected={selected} setSelected={setSelected} />
        </div>
        <PlayerButton paused={paused} setPaused={setPaused} />
      </section>
      <TrustStrip /><ModesSection variant="aqua" /><OpenSourceSection onDownload={onDownload} /><SiteFooter variant="aqua" />
    </main>
  );
}

function CloudlinePage({ selected, setSelected, paused, setPaused, onDownload }) {
  return (
    <main className={`site cloudline-site ${paused ? "motion-paused" : ""}`} id="top">
      <div className="ambient-layer" aria-hidden="true"></div><PageNav variant="cloudline" onDownload={onDownload} />
      <section className="hero cloudline-hero">
        <div className="cloud-hero-copy reveal">
          <p className="eyebrow">Cloudline Motion</p><h1 className="product-hero-title"><span>MotionWallpaper</span></h1>
          <p>把喜欢的视频与图片留在桌面。原生播放、多屏适配，在需要安静时自动退场。</p>
          <div className="hero-actions"><button className="primary-button" type="button" onClick={onDownload}>开始了解 <ArrowRight24Regular /></button><a className="round-link" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="打开 GitHub"><Open24Regular /></a></div>
        </div>
        <div className="cloud-window-stage reveal">
          <div className="window-echo window-echo--back" aria-hidden="true"></div><div className="window-echo window-echo--middle" aria-hidden="true"></div>
          <AppWindow selected={selected} setSelected={setSelected} compact />
        </div>
        <div className="hero-rail-wrap reveal"><WallpaperRail selected={selected} setSelected={setSelected} /></div><div className="scroll-cue"><span>SCROLL</span><i></i></div><PlayerButton paused={paused} setPaused={setPaused} />
      </section>
      <TrustStrip /><CloudStory selected={selected} setSelected={setSelected} /><ModesSection variant="cloudline" /><OpenSourceSection onDownload={onDownload} /><SiteFooter variant="cloudline" />
    </main>
  );
}

function CompareHome() {
  return (
    <main className="compare-home">
      <Brand /><div className="compare-copy"><p className="eyebrow">MotionWallpaper 视觉方向</p><h1>选择一个版本查看</h1><p>两版分别呈现独立的内容结构、首屏节奏与动效语言。</p></div>
      <div className="compare-grid"><a href="/aqua"><img src="/assets/aqua-glass-background.png" alt="水光玻璃版预览" /><span><b>02</b> 水光玻璃版 <ArrowRight24Regular /></span></a><a href="/cloudline"><img src="/assets/cloudline-background.png" alt="云轨动势版预览" /><span><b>03</b> 云轨动势版 <ArrowRight24Regular /></span></a></div>
    </main>
  );
}

export function App() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const route = useMemo(() => window.location.pathname.replace(/\/$/, "") || "/", []);

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { nodes.forEach((node) => node.classList.add("is-visible")); return undefined; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [route]);

  const shared = { selected, setSelected, paused, setPaused, onDownload: () => setDialogOpen(true) };
  return <>{route === "/aqua" ? <AquaPage {...shared} /> : route === "/cloudline" ? <CloudlinePage {...shared} /> : <CompareHome />}<DownloadDialog open={dialogOpen} onClose={() => setDialogOpen(false)} /></>;
}
