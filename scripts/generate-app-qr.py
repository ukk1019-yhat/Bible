import qrcode
from PIL import Image, ImageDraw

def generate_qr():
    # Canonical working domain specified by user: www.satyasakshi.in
    # Include ?download=app so scanning the QR code triggers the direct download/install prompt immediately!
    url = "https://www.satyasakshi.in/?download=app"
    
    # Error Correction Level H ensures the centered logo does not interfere with scanning
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#10291e", back_color="#ffffff").convert('RGBA')
    qr_w, qr_h = img.size

    try:
        logo = Image.open('public/brand/satyasakshi-logo-full.png').convert('RGBA')
        logo_size = int(qr_w * 0.20)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        pad = int(logo_size * 0.15)
        badge_size = logo_size + pad * 2
        badge = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
        
        draw = ImageDraw.Draw(badge)
        draw.rounded_rectangle(
            [(0, 0), (badge_size, badge_size)],
            radius=int(badge_size * 0.22),
            fill=(255, 255, 255, 255),
            outline=(212, 175, 55, 220),
            width=3,
        )
        badge.paste(logo, (pad, pad), logo)
        
        pos_x = (qr_w - badge_size) // 2
        pos_y = (qr_h - badge_size) // 2
        img.paste(badge, (pos_x, pos_y), badge)
    except Exception as e:
        print(f"Logo embedding note: {e}")

    img.save('public/brand/qr-download-app.png')
    print("Saved public/brand/qr-download-app.png for:", url)

if __name__ == '__main__':
    generate_qr()
