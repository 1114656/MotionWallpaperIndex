import { useEffect, useRef, useState } from "react";
import { ArrowDownload24Regular, ArrowRight24Regular, Open24Regular } from "@fluentui/react-icons";
import LiveWallpaperStage from "./LiveWallpaperStage.jsx";
import "./new-motion-page.css";

const GITHUB_URL = "https://github.com/1114656/MotionWallpaper";
const INSTALLER_URL = `${GITHUB_URL}/releases/download/v1.0.0/MotionWallpaper-.-v1.0.0-Windows-x64-.exe`;

const steps = [
  {
    number: "01",
    title: "选一张喜欢的壁纸",
    copy: "把本地图片或视频加入媒体库。画面由你自己决定。",
    scene: 1,
  },
  {
    number: "02",
    title: "放到想要的屏幕",
    copy: "多个显示器可以分别设置壁纸，桌面不必只停留在一张图片。",
    scene: 2,
  },
  {
    number: "03",
    title: "需要安静时，就暂停",
    copy: "播放和暂停都在你的控制之中；也可以按需要选择性能模式。",
    scene: 3,
  },
];

export default function NewMotionPage({ onDownload }) {
  const [activeScene, setActiveScene] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const introRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const targets = [introRef.current, ...stepRefs.current].filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const step = Number(visible.target.dataset.scene);
        setActiveStep(step);
        setActiveScene(step);
      }
    }, { rootMargin: "-25% 0px -35% 0px", threshold: [0, 0.25, 0.5, 0.75] });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="new-site" id="top">
      <header className="new-header">
        <a className="new-brand" href="#top" aria-label="MotionWallpaper 首页">
          <img src="/assets/motion-logo.png" alt="" />
          <span>MotionWallpaper</span>
        </a>
        <nav className="new-nav" aria-label="主导航">
          <a href="#preview">壁纸预览</a>
          <a href="#about">软件介绍</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub <Open24Regular aria-hidden="true" /></a>
        </nav>
        <a className="new-header-download" href={INSTALLER_URL}>下载 <ArrowDownload24Regular aria-hidden="true" /></a>
      </header>

      <section className="new-demo new-shell" id="preview" aria-label="动态壁纸预览">
        <div className="new-intro" ref={introRef} data-scene="0">
          <p className="new-kicker">Windows 动态壁纸 · v1.0.0</p>
          <h1>把喜欢的画面<br />放到桌面上。</h1>
          <p className="new-lede">MotionWallpaper 可以将视频和图片设为 Windows 桌面壁纸，支持多显示器与性能模式。</p>
          <div className="new-hero-actions">
            <a className="new-primary" href={INSTALLER_URL}><ArrowDownload24Regular aria-hidden="true" />下载 Windows 安装包</a>
            <button className="new-text-button" type="button" onClick={onDownload}>安装与校验说明 <ArrowRight24Regular aria-hidden="true" /></button>
          </div>
          <p className="new-system-note">Windows 10 22H2 或更高版本 · x64</p>
          <a className="new-scroll-link" href="#scene-1">向下看使用方式 <span aria-hidden="true">↓</span></a>
        </div>

        <div className="new-demo-display">
          <LiveWallpaperStage activeIndex={activeScene} onActiveIndexChange={setActiveScene} autoAdvance={activeStep === 0} />
          <p className="new-preview-note">网页交互预览 · 点击画面下方可切换场景</p>
        </div>

        <div className="new-step-list" id="about">
          {steps.map((step, index) => (
            <article
              className={`new-step${activeStep === step.scene ? " is-active" : ""}`}
              id={`scene-${index + 1}`}
              key={step.number}
              ref={(node) => { stepRefs.current[index] = node; }}
              data-scene={step.scene}
            >
              <span className="new-step-number">{step.number} / 03</span>
              <h2>{step.title}</h2>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="new-details" aria-labelledby="new-details-title">
        <div className="new-shell new-details-layout">
          <div>
            <p className="new-kicker">保持简单</p>
            <h2 id="new-details-title">画面在桌面上，<br />控制权在你手里。</h2>
          </div>
          <div className="new-details-list">
            <div><span>01</span><p>原画优先、自动平衡、低功耗三种性能模式。</p></div>
            <div><span>02</span><p>媒体文件留在本地，导入源文件不会被改写。</p></div>
            <div><span>03</span><p>项目以 MIT 许可证开源，代码和更新记录公开可查。</p></div>
          </div>
        </div>
      </section>

      <footer className="new-footer new-shell">
        <div className="new-footer-title"><img src="/assets/motion-logo.png" alt="" /><span>MotionWallpaper</span></div>
        <p>Windows 动态壁纸 · 开源项目</p>
        <div><a href={GITHUB_URL} target="_blank" rel="noreferrer">源代码</a><a href={INSTALLER_URL}>下载安装包</a><a href="#top">回到顶部</a></div>
      </footer>
    </main>
  );
}
