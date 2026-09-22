import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";

const baseUrl = "http://127.0.0.1:5173";
await mkdir("qa", { recursive: true });

let devServer;

async function serverIsReady() {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

if (!(await serverIsReady())) {
  devServer = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "5173", "--strictPort"], {
    cwd: process.cwd(),
    stdio: "ignore",
  });

  for (let attempt = 0; attempt < 50 && !(await serverIsReady()); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  if (!(await serverIsReady())) {
    devServer.kill();
    throw new Error("Vite preview did not become ready on port 5173.");
  }
}

const stopDevServer = () => devServer?.kill();
process.once("exit", stopDevServer);
process.once("SIGINT", () => { stopDevServer(); process.exit(130); });
process.once("SIGTERM", () => { stopDevServer(); process.exit(143); });
const cases = [
  { route: "aqua", width: 1440, height: 1100, output: "qa/aqua-desktop.png" },
  { route: "cloudline", width: 1440, height: 1100, output: "qa/cloudline-desktop.png" },
  { route: "aqua", width: 390, height: 844, output: "qa/aqua-mobile.png" },
  { route: "cloudline", width: 390, height: 844, output: "qa/cloudline-mobile.png" },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const item of cases) {
  const context = await browser.newContext({
    viewport: { width: item.width, height: item.height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${baseUrl}/${item.route}`, { waitUntil: "networkidle" });
  await page.locator(".app-window").waitFor({ state: "visible" });

  await page.screenshot({ path: item.output, fullPage: true });

  const secondThumb = page.locator(".media-thumb").nth(1);
  await secondThumb.click();
  const wallpaperSelected = await secondThumb.evaluate((node) => node.classList.contains("is-selected"));

  await page.getByRole("button", { name: "下载", exact: true }).click();
  const dialogVisible = await page.getByRole("dialog").isVisible();
  await page.getByRole("button", { name: "关闭" }).click();

  await page.getByRole("button", { name: "暂停动效" }).click();
  const pauseStateApplied = await page.locator("main.site").evaluate((node) => node.classList.contains("motion-paused"));
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  const transition = await page.evaluate((route) => {
    const trust = document.querySelector(".trust-strip")?.getBoundingClientRect();
    const next = document.querySelector(route === "aqua" ? ".modes-section .section-heading" : ".cloud-story .section-heading")?.getBoundingClientRect();
    return {
      trustBottom: trust ? Math.round(trust.bottom + window.scrollY) : null,
      nextContentTop: next ? Math.round(next.top + window.scrollY) : null,
      visualGap: trust && next ? Math.round(next.top - trust.bottom) : null,
    };
  }, item.route);

  results.push({ ...item, wallpaperSelected, dialogVisible, pauseStateApplied, overflow, transition, consoleErrors, pageErrors });
  await context.close();
}

for (const item of [
  { route: "aqua", width: 1024, height: 1536, output: "qa/aqua-source-viewport.png" },
  { route: "cloudline", width: 1018, height: 1545, output: "qa/cloudline-source-viewport.png" },
]) {
  const context = await browser.newContext({
    viewport: { width: item.width, height: item.height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/${item.route}`, { waitUntil: "networkidle" });
  await page.locator(".app-window").waitFor({ state: "visible" });
  await page.screenshot({ path: item.output });
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/aqua`, { waitUntil: "networkidle" });
  await page.locator(".trust-strip").screenshot({ path: "qa/aqua-trust-strip.png" });
  await page.locator(".modes-section .section-heading").screenshot({ path: "qa/aqua-modes-heading.png" });
  await page.locator(".open-section").screenshot({ path: "qa/aqua-open-section.png" });
  await page.goto(`${baseUrl}/cloudline`, { waitUntil: "networkidle" });
  await page.locator(".modes-section .section-heading").screenshot({ path: "qa/cloudline-modes-heading.png" });
  await context.close();
}

for (const item of [
  { route: "aqua", trust: ".aqua-site > .trust-strip", next: ".modes-section .section-heading", output: "qa/aqua-hero-transition.png" },
  { route: "cloudline", trust: ".cloudline-site > .trust-strip", next: ".cloud-story .section-heading", output: "qa/cloudline-hero-transition.png" },
]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/${item.route}`, { waitUntil: "networkidle" });
  const trustBox = await page.locator(item.trust).boundingBox();
  const nextBox = await page.locator(item.next).boundingBox();
  const y = Math.max(0, trustBox.y - 110);
  const height = Math.min(960, nextBox.y + Math.min(nextBox.height, 420) - y);
  await page.screenshot({ path: item.output, clip: { x: 0, y, width: 1440, height } });
  await context.close();
}

await browser.close();
stopDevServer();
console.log(JSON.stringify(results, null, 2));
