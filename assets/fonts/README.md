# Local open-source typography

- Inter variable (Latin): Fontsource package 5.2.8, SIL Open Font License.
- JetBrains Mono variable (Latin): Fontsource package 5.2.8, SIL Open Font License.
- Orbitron variable (Latin): Fontsource package 5.2.8, SIL Open Font License.
- Noto Sans SC variable: Google Fonts source, SIL Open Font License; subset to the page and animation copy to avoid delivering the 17 MB source font.

Corresponding OFL files are included here. Fonts are served from this repository; no third-party font request is required at runtime.

The Chinese subset should be rebuilt after copy changes, using `scripts/subset-font.py` and the upstream `ofl/notosanssc/NotoSansSC[wght].ttf` source from google/fonts. Glyphs outside the subset fall back to the user's system font.
