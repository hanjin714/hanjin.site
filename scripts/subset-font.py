"""Subset the OFL Noto Sans SC source to this portfolio's HTML/JS glyphs.

Usage: python scripts/subset-font.py /path/to/NotoSansSC.ttf
Requires fonttools and brotli. Regenerate after changing Chinese copy.
"""
import sys
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parents[1]
text = ''.join((root / name).read_text() for name in ('index.html', 'script.js'))
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
font = subset.load_font(sys.argv[1], options)
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
subset.save_font(font, str(root / 'assets/fonts/noto-sans-sc-subset.woff2'), options)
