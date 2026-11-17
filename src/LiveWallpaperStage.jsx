import { useEffect, useRef, useState } from "react";
import AquaCurrent from "./AquaCurrent";
import "./live-wallpaper-stage.css";

const scenes = [
  { name: "深海", image: "/assets/wallpaper-underwater.png", description: "阳光穿过水面，照亮蓝色海水" },
  { name: "晴空", image: "/assets/wallpaper-clouds.png", description: "云层和阳光铺满天空" },
  { name: "叶影", image: "/assets/wallpaper-leaves.png", description: "阳光落在带着露珠的绿叶上" },
  { name: "流光", image: "/assets/wallpaper-flow.png", description: "浅蓝色光带在画面中流动" },
];

const normalizeIndex = (value) => ((Math.trunc(value) % scenes.length) + scenes.length) % scenes.length;

/**
 * Large wallpaper preview with its own scene and playback controls.
 * activeIndex + onActiveIndexChange can optionally control the scene from a parent;
 * otherwise initialIndex selects the first scene. className styles the outer wrapper.
 */
export default function LiveWallpaperStage({
  activeIndex,
  onActiveIndexChange,
  initialIndex = 0,
  autoAdvance = true,
  className = "",
}) {
  const stageRef = useRef(null);
  const sceneButtons = useRef([]);
  const [internalIndex, setInternalIndex] = useState(() => normalizeIndex(initialIndex));
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  const controlled = Number.isFinite(activeIndex);
  const currentIndex = normalizeIndex(controlled ? activeIndex : internalIndex);
  const motionPlaying = !paused && !reducedMotion && inView && pageVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);

    if (!stageRef.current || typeof IntersectionObserver === "undefined") {
      return () => document.removeEventListener("visibilitychange", updateVisibility);
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(stageRef.current);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const changeScene = (next) => {
    const nextIndex = normalizeIndex(next);
    if (nextIndex === currentIndex) return;
    if (!controlled) setInternalIndex(nextIndex);
    onActiveIndexChange?.(nextIndex, scenes[nextIndex]);
  };

  useEffect(() => {
    if (!motionPlaying || !autoAdvance) return undefined;
    const timer = window.setInterval(() => changeScene(currentIndex + 1), 9000);
    return () => window.clearInterval(timer);
  }, [motionPlaying, autoAdvance, currentIndex, controlled, onActiveIndexChange]);

  const handleSceneKeyDown = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = index + 1;
    else if (event.key === "ArrowLeft") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = scenes.length - 1;
    else return;

    event.preventDefault();
    const nextIndex = normalizeIndex(next);
    changeScene(nextIndex);
    sceneButtons.current[nextIndex]?.focus();
  };

  return (
    <div
      ref={stageRef}
      className={`live-wallpaper-stage${motionPlaying ? " is-motion-playing" : ""}${className ? ` ${className}` : ""}`}
    >
      <div
        className="live-wallpaper-stage__frame"
        role="img"
        aria-label={`当前壁纸：${scenes[currentIndex].name}。${scenes[currentIndex].description}`}
      >
        {scenes.map((scene, index) => (
          <div
            className={`live-wallpaper-stage__scene live-wallpaper-stage__scene--${index}${currentIndex === index ? " is-active" : ""}`}
            key={scene.name}
            aria-hidden="true"
          >
            <img src={scene.image} alt="" draggable="false" />
            <span className="live-wallpaper-stage__light" />
            {index === 0 && currentIndex === 0 && <AquaCurrent paused={!motionPlaying} />}
          </div>
        ))}
      </div>

      <div className="live-wallpaper-stage__caption">
        <div className="live-wallpaper-stage__caption-name">
          <span>{String(currentIndex + 1).padStart(2, "0")} / 04</span>
          <strong>{scenes[currentIndex].name}</strong>
        </div>
        <button
          className="live-wallpaper-stage__playback"
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={reducedMotion ? "系统已启用减少动态效果" : paused ? "播放壁纸动效" : "暂停壁纸动效"}
          aria-pressed={paused}
          disabled={reducedMotion}
        >
          {paused || reducedMotion ? (
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m5.5 3.25 7 4.75-7 4.75V3.25Z" fill="currentColor" /></svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="M4.5 3.5h2v9h-2zM9.5 3.5h2v9h-2z" fill="currentColor" /></svg>
          )}
          <span>{reducedMotion ? "减少动态" : paused ? "播放" : "暂停"}</span>
        </button>
      </div>

      <div className="live-wallpaper-stage__choices" role="group" aria-label="切换壁纸预览">
        {scenes.map((scene, index) => (
          <button
            ref={(node) => { sceneButtons.current[index] = node; }}
            className={`live-wallpaper-stage__choice${currentIndex === index ? " is-active" : ""}`}
            key={scene.name}
            type="button"
            aria-pressed={currentIndex === index}
            onClick={() => changeScene(index)}
            onKeyDown={(event) => handleSceneKeyDown(event, index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {scene.name}
          </button>
        ))}
      </div>
    </div>
  );
}
