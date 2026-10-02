# 韩金 AI FDE Portfolio

当前版本是代码驱动的叙事式简历，线上地址：https://hanjin.site 。七个章节呈现业务现场、关键构建、系统交付、团队管理、公开作品及交流经历。正文不依赖动画播放，支持手机、暂停动效、减少动态效果和打印。

维护当前版本请以 `IMPLEMENTATION.md` 为准。动画由 `script.js` 的 Canvas 粒子、SVG 路径和 24 秒时间轴构成，不使用下方旧版视频素材。字体与许可证位于 `assets/fonts/`。项目替换图片位于 `index.html` 的 `#delivery`，仅使用获准公开的素材。

验证：`node --check script.js` 和 `node scripts/verify.cjs`；仍须另做桌面及手机浏览器检查。GitHub Pages 发布仓库根目录，保留 `CNAME` 与 `.nojekyll`。

项目数量是协同跟踪数量，不代表全部个人独立完成。核心上架节点完成已有记录支持，完整上下架系统的正式上线及验收范围仍需本人确认。

以下为旧版素材记录，保留供维护参考，不代表当前页面依赖这些文件。

## 文件结构

```text
AI-FDE-Portfolio/
├── index.html
├── styles.css
└── assets/
    ├── hanjin-executive-portrait.png
    ├── hanjin-candid-reference.jpg
    ├── ai-execution-core.png
    └── video/
        ├── brand-logo-cinematic-original.mp4
        ├── brand-logo-cinematic-1080p.mp4
        └── brand-logo-cinematic-poster.jpg
```

## 后续替换素材

- 首屏职业照：替换 `assets/hanjin-executive-portrait.png`
- 电影感开场视频：替换 `assets/video/brand-logo-cinematic-1080p.mp4`
- 演讲/现场照片：建议新增到 `assets/`，再扩展 `Proof Of Work` 或新增 `Speaking` 模块
- 项目链接：在 `index.html` 的 `Selected Work` 区域补充真实仓库或线上地址
- 对外发布前：建议补充真实项目链接、微信/邮箱联系方式，以及更正式的演讲或门店现场照片

## 本地预览

直接打开 `index.html` 即可，不需要启动开发服务器。

## 部署

可直接部署到 GitHub Pages、Vercel、Cloudflare Pages，或挂到 `beilunjuzhen.cn` 的子路径/子域名。
