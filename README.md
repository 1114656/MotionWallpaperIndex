# MotionWallpaper Index

MotionWallpaper 的官方宣传网站，用于展示这款 Windows 原生动态壁纸应用的核心能力、性能策略与开源信息。

网站提供两套彼此独立的视觉方向：

- **Aqua Glass**：浅青水光、通透玻璃与克制的层次感。
- **Cloudline Motion**：云轨流线、视差构图与更强的动态叙事。

核心应用仓库：[MotionWallpaper-Windows](https://github.com/1114656/MotionWallpaper-Windows)

## 页面入口

| 路径 | 内容 |
| --- | --- |
| `/` | 两套视觉方向的选择页 |
| `/aqua` | Aqua Glass 水光玻璃版 |
| `/cloudline` | Cloudline Motion 云轨动势版 |

## 网站内容

- MotionWallpaper 产品定位与能力介绍
- 本地图片、视频与多显示器壁纸展示
- 原画优先、自动平衡、低功耗三种性能模式
- GitHub 开源入口与下载说明
- 桌面端、平板与移动端响应式布局
- 壁纸切换、动效暂停及下载说明弹窗

## 技术栈

- React 19
- Vite 6
- Fluent UI React Icons
- Playwright 视觉与交互回归检查
- Sites/Worker 构建适配

## 本地开发

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

开发服务器启动后，可访问：

- `http://localhost:5173/aqua`
- `http://localhost:5173/cloudline`

## 构建与检查

```bash
# 生产构建
npm run build

# Worker/Sites 构建测试
npm run test:sites

# 桌面端、移动端与核心交互回归截图
npm run qa:visual
```

生产构建输出位于 `dist/`。视觉回归截图输出位于 `qa/`，两者均不提交到仓库。

## 项目结构

```text
.
├─ public/assets/       # 正式图片、壁纸与品牌素材
├─ src/                 # React 页面与样式
├─ scripts/             # 构建准备与视觉回归脚本
├─ tests/               # Worker/Sites 测试
├─ worker/              # 部署运行入口
└─ .openai/             # 托管配置
```

## 素材说明

网站使用项目自有品牌图标与原创视觉素材。页面没有直接使用 Apple 或 macOS 官方壁纸，也不复刻可识别的 Apple 壁纸构图。

## 关联项目

- 宣传网站：`MotionWallpaperIndex`
- Windows 应用：[MotionWallpaper-Windows](https://github.com/1114656/MotionWallpaper-Windows)
