# 韩金 AI FDE Portfolio

一个纯静态个人作品集网站首版，定位为“弱化简历，突出能力证明”。页面包含首屏身份展示、AI 执行引擎、技术栈、落地系统图、作品证明、现场分享、服务范围和联系入口。

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
