import base64
from PIL import Image

# 1. Load official logo
emblem = Image.open('public/brand/satyasakshi-logo-full.png')
ew, eh = emblem.size

# 2. Generate PNG and ICO favicons
def create_fav_canvas(size):
    canvas = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    padding = max(1, int(size * 0.05))
    target = size - (padding * 2)
    ratio = min(target / ew, target / eh)
    nw, nh = int(ew * ratio), int(eh * ratio)
    resized = emblem.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas

fav16 = create_fav_canvas(16)
fav32 = create_fav_canvas(32)
fav48 = create_fav_canvas(48)
fav64 = create_fav_canvas(64)

fav16.save('public/icons/favicon-16x16.png')
fav32.save('public/icons/favicon-32x32.png')
fav48.save('public/icons/favicon-48x48.png')
fav48.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print('Saved favicon.ico and PNGs')

# 3. Generate SVG favicon with embedded official logo
with open('public/brand/satyasakshi-logo-full.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="సత్య సాక్షి">
  <rect width="64" height="64" rx="14" fill="#ffffff" />
  <image href="data:image/png;base64,{b64}" x="4" y="5" width="56" height="54" />
</svg>'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('Updated public/favicon.svg with official logo')
