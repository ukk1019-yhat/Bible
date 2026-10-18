import qrcode
from PIL import Image

def generate_qr():
    url = "https://satyasakshi.in/"
    
    # Use Error Correction Level H (up to 30% damage/overlay recovery) so we can place the logo in center
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=3,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Base QR image with forest-green dark modules on white background
    img = qr.make_image(fill_color="#10291e", back_color="#ffffff").convert('RGBA')
    qr_w, qr_h = img.size

    # Load logo to place in the center
    try:
        logo = Image.open('public/brand/satyasakshi-logo-full.png').convert('RGBA')
        
        # Logo should take at most 22% of QR code width to ensure 100% scannability
        logo_size = int(qr_w * 0.22)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Create a white rounded background badge for the logo
        pad = int(logo_size * 0.15)
        badge_size = logo_size + pad * 2
        badge = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
        
        from PIL import ImageDraw
        draw = ImageDraw.Draw(badge)
        draw.rounded_rectangle([(0, 0), (badge_size, badge_size)], radius=int(badge_size * 0.22), fill=(255, 255, 255, 255), outline=(212, 175, 55, 180), width=3)
        
        # Paste logo onto badge
        badge.paste(logo, (pad, pad), logo)
        
        # Calculate center position
        pos_x = (qr_w - badge_size) // 2
        pos_y = (qr_h - badge_size) // 2
        
        # Paste badge onto QR code
        img.paste(badge, (pos_x, pos_y), badge)
        print("Embedded center logo into QR code")
    except Exception as e:
        print(f"Logo embedding skipped: {e}")

    # Save high-res PNG
    img.save('public/brand/qr-download-app.png')
    print("Saved public/brand/qr-download-app.png (scans to https://satyasakshi.in/)")

if __name__ == '__main__':
    generate_qr()
