import os
import subprocess
import base64

def generate():
    os.makedirs('public', exist_ok=True)
    img_path = 'public/subhajit-sanpui.jpg'
    
    # 1. Base64 encode photo for SVG
    with open(img_path, 'rb') as f:
        img_b64 = base64.b64encode(f.read()).decode('utf-8')
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070B"/>
      <stop offset="50%" stop-color="#0B0F19"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="neonRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="50%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <radialGradient id="auroraGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#06B6D4" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="circleClip">
      <circle cx="256" cy="225" r="130" />
    </clipPath>
    <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Dark Obsidian Squircle Canvas -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Outer Neon Pulse Border -->
  <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="url(#neonRing)" stroke-width="4.5" opacity="0.85"/>

  <!-- Radial Aurora Ambience -->
  <circle cx="256" cy="225" r="210" fill="url(#auroraGlow)"/>

  <!-- Neon Equalizer Soundwaves radiating outwards -->
  <g stroke="url(#neonRing)" stroke-width="3" stroke-linecap="round" opacity="0.6">
    <line x1="72" y1="225" x2="100" y2="225" stroke-width="5" />
    <line x1="84" y1="195" x2="104" y2="205" stroke-width="4" />
    <line x1="84" y1="255" x2="104" y2="245" stroke-width="4" />
    <line x1="412" y1="225" x2="440" y2="225" stroke-width="5" />
    <line x1="408" y1="195" x2="428" y2="205" stroke-width="4" />
    <line x1="408" y1="255" x2="428" y2="245" stroke-width="4" />
  </g>

  <!-- Glowing Circular Frame for Subhajit Photo -->
  <circle cx="256" cy="225" r="138" fill="#080B14" stroke="url(#neonRing)" stroke-width="6" filter="url(#neonBlur)" />

  <!-- Subhajit Sanpui Custom Photo -->
  <g clip-path="url(#circleClip)">
    <image href="data:image/jpeg;base64,{img_b64}" x="126" y="95" width="260" height="260" preserveAspectRatio="xMidYMid slice" />
  </g>

  <!-- Shiny Glass Reflection on Photo -->
  <path d="M126 225 A130 130 0 0 1 386 225 Z" fill="white" opacity="0.04" clip-path="url(#circleClip)"/>

  <!-- Music Emblem Badge Floating on Bottom-Right of Avatar -->
  <g transform="translate(325, 290)" filter="url(#neonBlur)">
    <circle cx="26" cy="26" r="30" fill="#0A0E1A" stroke="url(#neonRing)" stroke-width="3.5" />
    <!-- Glowing Headphone / Music Note -->
    <path d="M16 32 V23 C16 18 20 14 26 14 C32 14 36 18 36 23 V32" fill="none" stroke="#06B6D4" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="13" y="27" width="6" height="10" rx="3" fill="#8B5CF6"/>
    <rect x="33" y="27" width="6" height="10" rx="3" fill="#8B5CF6"/>
  </g>

  <!-- Subha Verified Live Green Badge Floating on Bottom-Left -->
  <g transform="translate(130, 290)">
    <circle cx="24" cy="24" r="22" fill="#080C16" stroke="#10B981" stroke-width="3" />
    <circle cx="24" cy="24" r="9" fill="#10B981" />
  </g>

  <!-- Modern Futuristic Typography -->
  <text x="256" y="415" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
    SMART SUBHA
  </text>
  <text x="256" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', sans-serif" font-weight="800" font-size="19" fill="#06B6D4" text-anchor="middle" letter-spacing="7">
    BEATS • PRO
  </text>
</svg>
'''
    with open('public/icon.svg', 'w') as f:
        f.write(svg_content)
    print("Created public/icon.svg")

    # 2. Rasterize to PNG icons via ImageMagick
    # First create circular cropped photo
    subprocess.run([
        'convert', 'public/subhajit-sanpui.jpg',
        '-gravity', 'center',
        '-crop', '720x720+0+0',
        '+repage',
        '-resize', '260x260',
        'public/subha_avatar_sq.png'
    ], check=True)

    # Create 512x512 PNG using convert commands
    # Background squircle + glow + composite avatar + borders + text
    convert_cmd = [
        'convert',
        '-size', '512x512', 'xc:#05070B',
        '-fill', '#090D18',
        '-stroke', '#8B5CF6', '-strokewidth', '4',
        '-draw', 'roundrectangle 24,24 488,488 92,92',
        'public/icon-512.png'
    ]
    subprocess.run(convert_cmd, check=True)

    # Create round avatar with cyan border
    subprocess.run([
        'convert', 'public/subha_avatar_sq.png',
        '-alpha', 'set',
        '(', '+clone', '-alpha', 'extract',
        '-draw', 'fill black polygon 0,0 0,260 260,260 260,0 fill white circle 130,130 130,5',
        ')',
        '-compose', 'Multiply', '-composite',
        'public/subha_avatar_round.png'
    ], check=True)

    # Composite round avatar in center (x=126, y=95)
    subprocess.run([
        'composite', '-geometry', '+126+95',
        'public/subha_avatar_round.png',
        'public/icon-512.png',
        'public/icon-512.png'
    ], check=True)

    # Add neon ring around avatar and typography onto icon-512.png
    subprocess.run([
        'convert', 'public/icon-512.png',
        '-stroke', '#06B6D4', '-strokewidth', '6', '-fill', 'none',
        '-draw', 'circle 256,225 256,92',
        '-stroke', '#8B5CF6', '-strokewidth', '2', '-fill', 'none',
        '-draw', 'circle 256,225 256,86',
        '-fill', '#FFFFFF', '-stroke', 'none',
        '-pointsize', '28', '-font', 'DejaVu-Sans-Bold', '-gravity', 'north',
        '-annotate', '+0+395', 'SMART SUBHA',
        '-fill', '#06B6D4',
        '-pointsize', '18', '-font', 'DejaVu-Sans-Bold', '-gravity', 'north',
        '-annotate', '+0+430', 'BEATS • PRO',
        'public/icon-512.png'
    ], check=True)

    # Generate 192x192, apple-touch-icon (180x180), and maskable-512
    subprocess.run(['convert', 'public/icon-512.png', '-resize', '192x192', 'public/icon-192.png'], check=True)
    subprocess.run(['convert', 'public/icon-512.png', '-resize', '180x180', 'public/apple-touch-icon.png'], check=True)
    subprocess.run(['cp', 'public/icon-512.png', 'public/maskable-icon-512.png'], check=True)
    print("Successfully generated all app icons with Subhajit photo!")

if __name__ == '__main__':
    generate()
