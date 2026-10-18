"""
Generate custom bespoke SVG visual assets for Varanasi.
Creates decorative patterns, illustrations, textures, icons, and animated components.
"""
import os

BASE_DIR = r"D:\homi\public\assets\cities\varanasi"

def write_asset(subfolder, filename, content):
    folder_path = os.path.join(BASE_DIR, subfolder)
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created: {subfolder}/{filename} ({len(content)} bytes)")

# ==============================================================================
# 1. DECORATIVE ASSETS
# ==============================================================================

# Banarasi Brocade Zari Pattern (Seamless tileable SVG pattern)
write_asset("decorative", "banarasi-brocade-zari-pattern.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="goldZari" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <pattern id="banarasiTile" width="40" height="40" patternUnits="userSpaceOnUse">
      <!-- Background subtle silk grid -->
      <rect width="40" height="40" fill="#FFFBEB" />
      <!-- Stylized floral paisley motif -->
      <path d="M20,6 C23,12 28,15 28,20 C28,24.4 24.4,28 20,28 C15.6,28 12,24.4 12,20 C12,15 17,12 20,6 Z" fill="none" stroke="url(#goldZari)" stroke-width="1.2" />
      <circle cx="20" cy="20" r="3" fill="url(#goldZari)" />
      <!-- Corner floral leaves -->
      <path d="M0,0 Q6,6 0,12 Q-6,6 0,0" fill="url(#goldZari)" opacity="0.75" />
      <path d="M40,0 Q46,6 40,12 Q34,6 40,0" fill="url(#goldZari)" opacity="0.75" />
      <path d="M0,40 Q6,46 0,52 Q-6,46 0,40" fill="url(#goldZari)" opacity="0.75" />
      <path d="M40,40 Q46,46 40,52 Q34,46 40,40" fill="url(#goldZari)" opacity="0.75" />
      <!-- Tiny golden dots -->
      <circle cx="20" cy="4" r="0.8" fill="#F59E0B" />
      <circle cx="4" cy="20" r="0.8" fill="#F59E0B" />
      <circle cx="36" cy="20" r="0.8" fill="#F59E0B" />
      <circle cx="20" cy="36" r="0.8" fill="#F59E0B" />
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#banarasiTile)" />
</svg>
""")

# Ganga River Wave Divider (Smooth flowing wave SVG divider)
write_asset("decorative", "ganga-river-wave-divider.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none" width="100%" height="100%">
  <defs>
    <linearGradient id="gangaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F766E" stop-opacity="0.8" />
      <stop offset="35%" stop-color="#14B8A6" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#0284C7" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#0F766E" stop-opacity="0.95" />
    </linearGradient>
    <linearGradient id="morningLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </linearGradient>
  </defs>
  <!-- Background gentle ripple -->
  <path d="M0,32 C240,64 480,10 720,45 C960,80 1200,20 1440,50 L1440,120 L0,120 Z" fill="url(#gangaGradient)" opacity="0.25" />
  <!-- Secondary deep ripple -->
  <path d="M0,60 C320,10 640,90 960,40 C1200,5 1320,55 1440,40 L1440,120 L0,120 Z" fill="url(#gangaGradient)" opacity="0.5" />
  <!-- Foreground crisp wave -->
  <path d="M0,80 C280,30 560,95 840,55 C1120,15 1300,75 1440,65 L1440,120 L0,120 Z" fill="url(#gangaGradient)" />
  <!-- Golden morning crest highlights -->
  <path d="M0,80 C280,30 560,95 840,55 C1120,15 1300,75 1440,65" fill="none" stroke="#FDE68A" stroke-width="2.5" opacity="0.7" />
</svg>
""")

# Ghat Steps Architectural Border (Geometric stepped chevron motif)
write_asset("decorative", "ghat-steps-architectural-border.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" preserveAspectRatio="none" width="100%" height="40">
  <defs>
    <pattern id="ghatStep" width="40" height="40" patternUnits="userSpaceOnUse">
      <!-- Stepped masonry stone tier -->
      <path d="M0,40 L0,30 L10,30 L10,20 L20,20 L20,10 L30,10 L30,20 L40,20 L40,40 Z" fill="#78350F" opacity="0.12" />
      <path d="M0,40 L0,32 L8,32 L8,24 L16,24 L16,16 L24,16 L24,24 L32,24 L32,32 L40,32 L40,40 Z" fill="#9A3412" opacity="0.2" />
      <!-- Top stone coping -->
      <line x1="0" y1="40" x2="40" y2="40" stroke="#78350F" stroke-width="2" />
      <line x1="0" y1="32" x2="40" y2="32" stroke="#B45309" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="400" height="40" fill="url(#ghatStep)" />
</svg>
""")

# Marigold Garland Accent (Traditional Genda Phool string)
write_asset("decorative", "marigold-garland-garland-accent.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 80" width="100%" height="80">
  <defs>
    <linearGradient id="marigoldPetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
    <g id="flower">
      <circle cx="0" cy="0" r="14" fill="#D97706" opacity="0.3" />
      <circle cx="0" cy="0" r="11" fill="url(#marigoldPetal)" />
      <!-- Petal scallops -->
      <circle cx="-6" cy="-6" r="5" fill="#FBBF24" />
      <circle cx="6" cy="-6" r="5" fill="#F59E0B" />
      <circle cx="-6" cy="6" r="5" fill="#EA580C" />
      <circle cx="6" cy="6" r="5" fill="#F59E0B" />
      <circle cx="0" cy="0" r="4" fill="#B45309" />
    </g>
  </defs>
  <!-- Garland string curve -->
  <path d="M0,20 Q150,75 300,40 T600,30" fill="none" stroke="#65A30D" stroke-width="2.5" />
  <!-- Strung marigold blossoms -->
  <use href="#flower" x="40" y="28" />
  <use href="#flower" x="90" y="44" />
  <use href="#flower" x="145" y="56" />
  <use href="#flower" x="205" y="58" />
  <use href="#flower" x="265" y="48" />
  <use href="#flower" x="325" y="38" />
  <use href="#flower" x="385" y="32" />
  <use href="#flower" x="445" y="30" />
  <use href="#flower" x="505" y="32" />
  <use href="#flower" x="560" y="34" />
</svg>
""")

# Temple Arch Kashi Gateway (Cusped trefoil arch)
write_asset("decorative", "temple-arch-kashi-gateway.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%">
  <defs>
    <linearGradient id="stoneArch" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9A3412" />
      <stop offset="50%" stop-color="#C2410C" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
  </defs>
  <!-- Gateway Pillars -->
  <rect x="20" y="100" width="24" height="130" fill="url(#stoneArch)" rx="2" />
  <rect x="156" y="100" width="24" height="130" fill="url(#stoneArch)" rx="2" />
  <!-- Pillar bases -->
  <rect x="14" y="220" width="36" height="14" fill="#451A03" rx="2" />
  <rect x="150" y="220" width="36" height="14" fill="#451A03" rx="2" />
  <!-- Cusped trefoil arch -->
  <path d="M44,100 C44,60 70,50 100,20 C130,50 156,60 156,100" fill="none" stroke="url(#stoneArch)" stroke-width="16" stroke-linecap="round" />
  <!-- Inner scalloped border -->
  <path d="M54,105 C54,72 76,62 100,38 C124,62 146,72 146,105" fill="none" stroke="#FDE68A" stroke-width="2.5" stroke-dasharray="3,3" />
  <!-- Shikhara kalash pinnacle above arch -->
  <circle cx="100" cy="14" r="5" fill="#F59E0B" />
  <path d="M96,14 L100,4 L104,14 Z" fill="#D97706" />
</svg>
""")

# ==============================================================================
# 2. ILLUSTRATIONS
# ==============================================================================

# Traditional Bajra Wooden Boat
write_asset("illustrations", "traditional-bajra-wooden-boat.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="100%" height="100%">
  <defs>
    <linearGradient id="hullWood" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#854D0E" />
      <stop offset="60%" stop-color="#713F12" />
      <stop offset="100%" stop-color="#3F2208" />
    </linearGradient>
    <linearGradient id="riverWater" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F766E" />
      <stop offset="50%" stop-color="#14B8A6" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#F59E0B" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>
  </defs>
  <!-- Morning Sun -->
  <circle cx="380" cy="90" r="55" fill="url(#sunGlow)" />
  <circle cx="380" cy="90" r="32" fill="#FDE047" />

  <!-- River water base -->
  <path d="M0,210 Q120,200 250,215 T500,210 L500,300 L0,300 Z" fill="url(#riverWater)" opacity="0.9" />
  <path d="M0,230 Q140,220 280,235 T500,230 L500,300 L0,300 Z" fill="#0D5E57" />

  <!-- Boat hull (Banarasi Bajra curved silhouette) -->
  <path d="M70,165 C140,215 340,215 420,165 C380,210 130,210 70,165 Z" fill="url(#hullWood)" />
  <!-- Boat planks / ribs -->
  <path d="M90,173 Q250,212 400,173" stroke="#A16207" stroke-width="2" fill="none" />
  <path d="M110,183 Q250,216 380,183" stroke="#542C07" stroke-width="1.8" fill="none" />

  <!-- Wooden mast and canvas canopy canopy -->
  <line x1="240" y1="180" x2="240" y2="85" stroke="#451A03" stroke-width="4.5" />
  <!-- Bamboo cross poles -->
  <line x1="170" y1="110" x2="310" y2="110" stroke="#78350F" stroke-width="3" />
  <!-- Cloth awning -->
  <path d="M165,112 Q240,102 315,112 L305,135 Q240,128 175,135 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
  <path d="M185,110 L185,133 M215,108 L215,131 M245,107 L245,130 M275,108 L275,131 M295,110 L295,133" stroke="#EF4444" stroke-width="2.5" />

  <!-- Steering Oar (Chappu) dipping into the Ganga -->
  <line x1="120" y1="160" x2="50" y2="240" stroke="#713F12" stroke-width="4" stroke-linecap="round" />
  <!-- Oar paddle -->
  <ellipse cx="45" cy="245" rx="14" ry="7" transform="rotate(-40 45 245)" fill="#542C07" />
  <!-- Water ripples around oar -->
  <ellipse cx="45" cy="250" rx="22" ry="4" fill="none" stroke="#99F6E4" stroke-width="1.5" />

  <!-- Marigold garland on bow -->
  <path d="M380,172 Q405,180 415,170" stroke="#EA580C" stroke-width="3" stroke-dasharray="2,3" fill="none" />
</svg>
""")

# Priest Performing Ganga Aarti
write_asset("illustrations", "priest-performing-ganga-aarti.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450" width="100%" height="100%">
  <defs>
    <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="1" />
      <stop offset="35%" stop-color="#F59E0B" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#EA580C" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#991B1B" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="brassLamp" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>
  </defs>

  <!-- Big fire aura -->
  <circle cx="200" cy="150" r="130" fill="url(#flameGlow)" />

  <!-- Multi-tiered heavy brass Aarti Lamp (Deepam) -->
  <!-- Topmost tier flame -->
  <path d="M200,60 Q206,80 200,95 Q194,80 200,60 Z" fill="#FEF08A" />
  <ellipse cx="200" cy="95" rx="12" ry="4" fill="url(#brassLamp)" />
  <!-- Second tier flames (3 flames) -->
  <path d="M185,90 Q190,105 185,115 Q180,105 185,90 Z" fill="#FDE047" />
  <path d="M200,85 Q205,102 200,115 Q195,102 200,85 Z" fill="#FEF08A" />
  <path d="M215,90 Q220,105 215,115 Q210,105 215,90 Z" fill="#FDE047" />
  <ellipse cx="200" cy="118" rx="26" ry="6" fill="url(#brassLamp)" />
  <!-- Third tier flames (5 flames) -->
  <ellipse cx="200" cy="144" rx="42" ry="8" fill="url(#brassLamp)" />
  <!-- Fourth tier flames (7 flames) -->
  <ellipse cx="200" cy="172" rx="58" ry="10" fill="url(#brassLamp)" />
  <!-- Bottom tier flames (9 flames) -->
  <ellipse cx="200" cy="204" rx="72" ry="12" fill="url(#brassLamp)" />

  <!-- Multi-tiered brass lamp stand -->
  <path d="M192,204 L190,265 L175,275 L225,275 L210,265 L208,204 Z" fill="url(#brassLamp)" />
  <!-- Snake hood handle (Sheshnaag brass motif) -->
  <path d="M175,260 C140,240 135,190 155,160 C165,145 180,140 185,145" fill="none" stroke="url(#brassLamp)" stroke-width="7" stroke-linecap="round" />

  <!-- Priest Silhouette in Devotion (Saffron Kurta & Dhoti) -->
  <!-- Hands holding lamp base -->
  <path d="M170,270 L195,272 L210,285 L180,288 Z" fill="#9A3412" />
  <path d="M215,270 L235,272 L245,285 L220,288 Z" fill="#9A3412" />
  <!-- Arms & shoulders -->
  <path d="M130,350 L170,275 L185,285 L155,365 Z" fill="#EA580C" />
  <path d="M270,350 L230,275 L215,285 L245,365 Z" fill="#EA580C" />
  <!-- Torso clad in saffron -->
  <path d="M150,330 L250,330 L260,430 L140,430 Z" fill="#C2410C" />
  <path d="M175,330 L200,370 L225,330 Z" fill="#FEF3C7" opacity="0.6" />
  <!-- Devotional head profile / tilak -->
  <ellipse cx="200" cy="300" rx="20" ry="24" fill="#9A3412" />
  <path d="M198,285 L202,285 L200,305 Z" fill="#DC2626" /> <!-- Chandan Tilak -->

  <!-- Incense smoke swirls -->
  <path d="M160,130 C130,90 150,50 130,20" fill="none" stroke="#FDE68A" stroke-width="2" opacity="0.4" stroke-dasharray="4,4" />
  <path d="M240,130 C270,90 250,50 270,20" fill="none" stroke="#FDE68A" stroke-width="2" opacity="0.4" stroke-dasharray="4,4" />
</svg>
""")

# Kulhad Chai & Tamatar Chaat
write_asset("illustrations", "kulhad-chai-tamatar-chaat.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="clayKulhad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9A3412" />
      <stop offset="40%" stop-color="#C2410C" />
      <stop offset="100%" stop-color="#7C2D12" />
    </linearGradient>
    <linearGradient id="teaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="tomatoChaat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="60%" stop-color="#B91C1C" />
      <stop offset="100%" stop-color="#991B1B" />
    </linearGradient>
  </defs>

  <!-- Left: Terracotta Kulhad Chai -->
  <!-- Steam swirls -->
  <path d="M120,90 Q110,60 130,35 Q145,15 125,5" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" opacity="0.6" />
  <path d="M140,85 Q150,55 135,30 Q120,10 145,2" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" opacity="0.6" />
  <!-- Kulhad rim & tea surface -->
  <ellipse cx="130" cy="110" rx="38" ry="12" fill="url(#teaGradient)" />
  <ellipse cx="130" cy="110" rx="42" ry="14" fill="none" stroke="#7C2D12" stroke-width="3" />
  <!-- Kulhad clay body (tapering downwards) -->
  <path d="M88,110 L104,220 Q130,230 156,220 L172,110 Z" fill="url(#clayKulhad)" />
  <!-- Clay grooves / potter wheel marks -->
  <path d="M96,145 Q130,155 164,145" stroke="#7C2D12" stroke-width="2" fill="none" />
  <path d="M100,180 Q130,190 160,180" stroke="#7C2D12" stroke-width="2" fill="none" />

  <!-- Right: Shallow Clay Shikora / Dona containing Tamatar Chaat -->
  <ellipse cx="270" cy="180" rx="75" ry="32" fill="url(#clayKulhad)" />
  <!-- Fiery tomato chaat mixture -->
  <ellipse cx="270" cy="176" rx="68" ry="26" fill="url(#tomatoChaat)" />
  <!-- Desi Ghee glistening pool -->
  <ellipse cx="260" cy="172" rx="28" ry="10" fill="#FBBF24" opacity="0.75" />
  <!-- Sev / crunchy gram flour crisps on top -->
  <line x1="240" y1="170" x2="255" y2="168" stroke="#FEF08A" stroke-width="2" />
  <line x1="260" y1="165" x2="275" y2="167" stroke="#FEF08A" stroke-width="2" />
  <line x1="280" y1="172" x2="295" y2="169" stroke="#FEF08A" stroke-width="2" />
  <line x1="250" y1="175" x2="265" y2="173" stroke="#FEF08A" stroke-width="2" />
  <!-- Fresh coriander green flakes -->
  <circle cx="245" cy="172" r="2.5" fill="#16A34A" />
  <circle cx="275" cy="170" r="2.5" fill="#16A34A" />
  <circle cx="290" cy="175" r="2" fill="#16A34A" />
  <!-- Wooden chaat spoon / chamach -->
  <path d="M320,130 L275,175 Q270,180 278,182 L330,138 Z" fill="#FDE68A" stroke="#B45309" stroke-width="1" />
</svg>
""")

# Kashi Vishwanath Shikhar Silhouette
write_asset("illustrations", "kashi-vishwanath-shikhar-silhouette.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 400" width="100%" height="100%">
  <defs>
    <linearGradient id="goldShikhara" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <radialGradient id="templeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Aura of divinity -->
  <circle cx="175" cy="180" r="140" fill="url(#templeGlow)" />

  <!-- Central Tall Nagara Shikhara (Golden Spire) -->
  <!-- Top Trishul & Kalash -->
  <line x1="175" y1="65" x2="175" y2="25" stroke="#B45309" stroke-width="3.5" />
  <!-- Trishul prongs -->
  <path d="M164,38 Q164,28 175,25 Q186,28 186,38" fill="none" stroke="#D97706" stroke-width="2.5" />
  <!-- Amalaka (Ribbed Stone Ring at apex) -->
  <ellipse cx="175" cy="72" rx="24" ry="8" fill="url(#goldShikhara)" />
  <ellipse cx="175" cy="65" rx="14" ry="5" fill="#FDE047" />

  <!-- Main Shikhara Tower Profile with Urushringas (Miniature spires) -->
  <path d="M175,72 C160,110 135,170 120,240 L230,240 C215,170 190,110 175,72 Z" fill="url(#goldShikhara)" />
  <!-- Horizontal temple moulding ridges (Bhumis) -->
  <line x1="158" y1="110" x2="192" y2="110" stroke="#78350F" stroke-width="2" />
  <line x1="148" y1="145" x2="202" y2="145" stroke="#78350F" stroke-width="2" />
  <line x1="138" y1="180" x2="212" y2="180" stroke="#78350F" stroke-width="2" />
  <line x1="128" y1="215" x2="222" y2="215" stroke="#78350F" stroke-width="2" />

  <!-- Flanking side spires (Urushringas) -->
  <path d="M100,180 C95,205 85,230 75,260 L125,260 C120,230 110,205 100,180 Z" fill="#D97706" />
  <path d="M250,180 C245,205 235,230 225,260 L275,260 C270,230 260,205 250,180 Z" fill="#D97706" />

  <!-- Temple Mandapa Base Platform -->
  <rect x="50" y="260" width="250" height="90" fill="#7C2D12" rx="3" />
  <!-- Pilasters / Pillars -->
  <rect x="70" y="270" width="16" height="80" fill="#9A3412" />
  <rect x="120" y="270" width="16" height="80" fill="#9A3412" />
  <rect x="167" y="270" width="16" height="80" fill="#9A3412" />
  <rect x="214" y="270" width="16" height="80" fill="#9A3412" />
  <rect x="264" y="270" width="16" height="80" fill="#9A3412" />

  <!-- Sanctum Arch Doorway -->
  <path d="M155,350 L155,300 C155,285 195,285 195,300 L195,350 Z" fill="#451A03" />
  <circle cx="175" cy="318" r="7" fill="#FDE047" opacity="0.8" /> <!-- Inner Jyotirlinga Glow -->
</svg>
""")

# Subah-e-Banaras Sunrise Landscape
write_asset("illustrations", "subah-e-banaras-sunrise-landscape.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" width="100%" height="100%">
  <defs>
    <linearGradient id="dawnSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#431407" />
      <stop offset="30%" stop-color="#9A3412" />
      <stop offset="60%" stop-color="#EA580C" />
      <stop offset="85%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>
    <linearGradient id="riverMorning" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#0F766E" />
      <stop offset="100%" stop-color="#134E4A" />
    </linearGradient>
  </defs>

  <!-- Dramatic Dawn Sky -->
  <rect width="1000" height="250" fill="url(#dawnSky)" />

  <!-- Rising Surya (Sun) on Eastern Horizon -->
  <circle cx="650" cy="180" r="45" fill="#FFFBEB" />
  <circle cx="650" cy="180" r="75" fill="#FDE047" opacity="0.4" />

  <!-- Distant Ghat Skyline Silhouettes (Nagara Temples, Minarets, Havelis) -->
  <path d="M0,230 L50,210 L60,160 L75,210 L140,210 L150,140 L165,140 L175,210 L240,210 L260,110 L280,210 L350,210 L370,170 L390,210 L480,210 L500,130 L515,130 L530,210 L620,210 L635,165 L650,210 L740,210 L760,145 L780,210 L880,210 L900,180 L920,210 L1000,230 L1000,250 L0,250 Z" fill="#291206" />

  <!-- Ghat Masonry Steps Descending into Ganga -->
  <path d="M0,250 L350,285 L650,270 L1000,255 L1000,280 L0,280 Z" fill="#451A03" opacity="0.8" />
  <path d="M0,280 L350,300 L650,290 L1000,280 L1000,305 L0,305 Z" fill="#78350F" opacity="0.6" />

  <!-- Sacred River Ganga -->
  <rect y="275" width="1000" height="125" fill="url(#riverMorning)" />
  <!-- Sun reflections shimmering across the water -->
  <ellipse cx="650" cy="300" rx="40" ry="4" fill="#FEF08A" opacity="0.75" />
  <ellipse cx="650" cy="320" rx="70" ry="6" fill="#FDE047" opacity="0.6" />
  <ellipse cx="650" cy="345" rx="110" ry="8" fill="#F59E0B" opacity="0.5" />
  <ellipse cx="650" cy="370" rx="160" ry="10" fill="#EA580C" opacity="0.3" />

  <!-- Wooden Boats gliding across the water (Silhouettes) -->
  <!-- Main Foreground Boat -->
  <path d="M280,310 C320,335 440,335 480,310 C460,330 310,330 280,310 Z" fill="#1C1917" />
  <line x1="390" y1="318" x2="350" y2="350" stroke="#1C1917" stroke-width="3" stroke-linecap="round" />
  <circle cx="370" cy="305" r="7" fill="#1C1917" /> <!-- Boatman -->

  <!-- Distant Boat 2 -->
  <path d="M720,295 C740,308 800,308 820,295 C810,305 735,305 720,295 Z" fill="#1C1917" opacity="0.8" />

  <!-- Migratory Siberian Seagulls in Morning Sky -->
  <path d="M520,120 Q530,110 540,120 Q550,110 560,120" stroke="#FFFBEB" stroke-width="2" fill="none" opacity="0.85" />
  <path d="M570,140 Q578,132 586,140 Q594,132 602,140" stroke="#FFFBEB" stroke-width="1.8" fill="none" opacity="0.75" />
  <path d="M480,150 Q487,143 494,150 Q501,143 508,150" stroke="#FFFBEB" stroke-width="1.6" fill="none" opacity="0.7" />
</svg>
""")

# ==============================================================================
# 3. TEXTURES
# ==============================================================================

# Varanasi Chunar Sandstone Texture
write_asset("textures", "varanasi-sandstone-texture.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <filter id="sandstoneGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0.8 0 0 0 0.82  0 0.6 0 0 0.65  0 0 0.4 0 0.45  0 0 0 0.18 0" />
    </filter>
  </defs>
  <rect width="200" height="200" fill="#FBF7EE" />
  <rect width="200" height="200" filter="url(#sandstoneGrain)" />
</svg>
""")

# River Ripple Shimmer Texture
write_asset("textures", "river-ripple-shimmer.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <pattern id="rippleTile" width="80" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 Q20,10 40,20 T80,20" fill="none" stroke="#0F766E" stroke-width="1.2" opacity="0.35" />
      <path d="M0,40 Q20,30 40,40 T80,40" fill="none" stroke="#14B8A6" stroke-width="0.8" opacity="0.25" />
    </pattern>
  </defs>
  <rect width="160" height="160" fill="url(#rippleTile)" />
</svg>
""")

# Banarasi Silk Crosshatch Texture
write_asset("textures", "banarasi-silk-crosshatch.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <pattern id="silkGrid" width="10" height="10" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="10" y2="10" stroke="#F59E0B" stroke-width="0.5" opacity="0.2" />
      <line x1="10" y1="0" x2="0" y2="10" stroke="#F59E0B" stroke-width="0.5" opacity="0.2" />
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#silkGrid)" />
</svg>
""")

# ==============================================================================
# 4. ICONS
# ==============================================================================

# Icon: Diya Lamp
write_asset("icons", "icon-diya-lamp.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <path d="M8,30 C12,38 36,38 40,30 C36,34 12,34 8,30 Z" fill="#9A3412" />
  <ellipse cx="24" cy="30" rx="16" ry="4" fill="#C2410C" />
  <!-- Flame -->
  <path d="M24,10 C27,16 29,22 24,28 C19,22 21,16 24,10 Z" fill="#F59E0B" />
  <path d="M24,15 C26,19 27,23 24,27 C21,23 22,19 24,15 Z" fill="#FEF08A" />
</svg>
""")

# Icon: Wooden Boat
write_asset("icons", "icon-wooden-boat.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <!-- Boat Hull -->
  <path d="M6,26 C14,36 34,36 42,26 C36,32 12,32 6,26 Z" fill="#78350F" />
  <!-- Oar -->
  <line x1="28" y1="20" x2="14" y2="38" stroke="#B45309" stroke-width="2.5" stroke-linecap="round" />
  <!-- Water lines -->
  <path d="M4,38 Q14,35 24,38 T44,38" fill="none" stroke="#0F766E" stroke-width="2" />
</svg>
""")

# Icon: Temple Bell
write_asset("icons", "icon-temple-bell.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <!-- Hanging loop -->
  <circle cx="24" cy="8" r="4" fill="none" stroke="#D97706" stroke-width="2.5" />
  <!-- Bell Body -->
  <path d="M19,12 L29,12 C30,22 37,26 37,34 L11,34 C11,26 18,22 19,12 Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
  <!-- Rim -->
  <rect x="8" y="34" width="32" height="4" rx="2" fill="#D97706" />
  <!-- Clapper -->
  <circle cx="24" cy="41" r="3" fill="#78350F" />
</svg>
""")

# Icon: Banarasi Paan
write_asset("icons", "icon-banarasi-paan.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <!-- Folded Betel Leaf (Triangle envelope) -->
  <polygon points="24,8 40,36 8,36" fill="#15803D" stroke="#166534" stroke-width="2" />
  <!-- Inner fold line -->
  <line x1="24" y1="8" x2="24" y2="36" stroke="#22C55E" stroke-width="1.5" />
  <!-- Silver Vark (Chandi Ka Vark) accent -->
  <polygon points="20,20 28,18 25,26" fill="#E2E8F0" opacity="0.9" />
  <!-- Clove pin (Laung) -->
  <circle cx="24" cy="22" r="2.5" fill="#451A03" />
</svg>
""")

# Icon: Rudraksha Bead
write_asset("icons", "icon-rudraksha-bead.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <circle cx="24" cy="24" r="18" fill="#78350F" stroke="#9A3412" stroke-width="2" />
  <!-- 5 Mukhi Deep Ridges -->
  <line x1="24" y1="6" x2="24" y2="42" stroke="#451A03" stroke-width="2" />
  <line x1="8" y1="18" x2="40" y2="30" stroke="#451A03" stroke-width="2" />
  <line x1="8" y1="30" x2="40" y2="18" stroke="#451A03" stroke-width="2" />
  <!-- Textural stipples -->
  <circle cx="18" cy="18" r="1.5" fill="#B45309" />
  <circle cx="30" cy="18" r="1.5" fill="#B45309" />
  <circle cx="18" cy="30" r="1.5" fill="#B45309" />
  <circle cx="30" cy="30" r="1.5" fill="#B45309" />
</svg>
""")

# Icon: Kulhad Cup
write_asset("icons", "icon-kulhad-cup.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <!-- Rim -->
  <ellipse cx="24" cy="12" rx="14" ry="4" fill="#C2410C" />
  <!-- Clay cup body -->
  <path d="M10,12 L14,38 Q24,42 34,38 L38,12 Z" fill="#9A3412" />
  <!-- Ridge markings -->
  <path d="M12,22 Q24,25 36,22" stroke="#7C2D12" stroke-width="1.5" fill="none" />
  <path d="M13,30 Q24,33 35,30" stroke="#7C2D12" stroke-width="1.5" fill="none" />
</svg>
""")

# Icon: Trishul Shiva
write_asset("icons", "icon-trishul-shiva.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <!-- Central shaft -->
  <line x1="24" y1="4" x2="24" y2="44" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
  <!-- Trishul side prongs -->
  <path d="M12,14 Q14,24 24,26 Q34,24 36,14" fill="none" stroke="#F59E0B" stroke-width="2.5" />
  <!-- Damru at center -->
  <polygon points="18,28 30,28 18,36 30,36" fill="#B45309" stroke="#78350F" stroke-width="1" />
</svg>
""")

# ==============================================================================
# 5. ANIMATED ASSETS
# ==============================================================================

# Animated Floating Diya
write_asset("animated", "animated-floating-diya.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="100%" height="100%">
  <style>
    @keyframes bobbing {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(6px) rotate(-2deg); }
    }
    @keyframes flameFlicker {
      0%, 100% { transform: scale(1) translateY(0); opacity: 0.95; }
      25% { transform: scale(1.08, 0.92) translateY(-1px); opacity: 1; }
      50% { transform: scale(0.94, 1.05) translateY(1px); opacity: 0.88; }
      75% { transform: scale(1.04, 0.98) translateY(-0.5px); opacity: 0.98; }
    }
    @keyframes rippleOut {
      0% { r: 15px; opacity: 0.7; }
      100% { r: 65px; opacity: 0; }
    }
    .diya-group { animation: bobbing 3.8s ease-in-out infinite; transform-origin: 100px 95px; }
    .flame-core { animation: flameFlicker 0.4s ease-in-out infinite; transform-origin: 100px 65px; }
    .ripple-circle { animation: rippleOut 2.8s linear infinite; }
  </style>

  <!-- Water Surface -->
  <path d="M0,110 C50,105 150,115 200,110 L200,160 L0,160 Z" fill="#0F766E" opacity="0.3" />

  <!-- Animated water ripples expanding outward -->
  <ellipse cx="100" cy="115" rx="35" ry="8" fill="none" stroke="#2DD4BF" stroke-width="1.5" class="ripple-circle" />
  <ellipse cx="100" cy="115" rx="55" ry="12" fill="none" stroke="#2DD4BF" stroke-width="1.2" class="ripple-circle" style="animation-delay: 1.4s;" />

  <!-- Floating Diya assembly -->
  <g class="diya-group">
    <!-- Earthen leaf cup (patra dona) -->
    <path d="M50,105 C70,125 130,125 150,105 C135,115 65,115 50,105 Z" fill="#78350F" />
    <ellipse cx="100" cy="105" rx="50" ry="10" fill="#9A3412" />

    <!-- Fresh Marigold petals ring around diya -->
    <circle cx="65" cy="102" r="6" fill="#F59E0B" />
    <circle cx="80" cy="106" r="6" fill="#EA580C" />
    <circle cx="100" cy="108" r="6" fill="#FBBF24" />
    <circle cx="120" cy="106" r="6" fill="#EA580C" />
    <circle cx="135" cy="102" r="6" fill="#F59E0B" />

    <!-- Small terracotta lamp inside -->
    <ellipse cx="100" cy="98" rx="20" ry="6" fill="#C2410C" />

    <!-- Flickering flame and golden aura -->
    <g class="flame-core">
      <circle cx="100" cy="75" r="22" fill="#FDE047" opacity="0.3" />
      <path d="M100,50 C108,68 114,78 100,92 C86,78 92,68 100,50 Z" fill="#F59E0B" />
      <path d="M100,60 C104,72 108,80 100,90 C92,80 96,72 100,60 Z" fill="#FEF08A" />
    </g>
  </g>
</svg>
""")

# Animated Morning Boat
write_asset("animated", "animated-morning-boat.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" width="100%" height="100%">
  <style>
    @keyframes boatGlide {
      0% { transform: translateX(-15px) rotate(-1deg); }
      50% { transform: translateX(15px) rotate(1.5deg); }
      100% { transform: translateX(-15px) rotate(-1deg); }
    }
    @keyframes oarStroke {
      0%, 100% { transform: rotate(-8deg); }
      50% { transform: rotate(18deg); }
    }
    .boat-mover { animation: boatGlide 6s ease-in-out infinite; }
    .oar-rower { animation: oarStroke 3s ease-in-out infinite; transform-origin: 120px 105px; }
  </style>

  <!-- Golden morning glow -->
  <circle cx="220" cy="60" r="35" fill="#FDE047" opacity="0.4" />
  <circle cx="220" cy="60" r="20" fill="#FEF08A" />

  <!-- River waves -->
  <path d="M0,120 Q75,110 150,120 T300,120 L300,180 L0,180 Z" fill="#0F766E" opacity="0.8" />
  <path d="M0,135 Q75,128 150,135 T300,135 L300,180 L0,180 Z" fill="#115E59" />

  <!-- Boat & Oar -->
  <g class="boat-mover">
    <!-- Hull -->
    <path d="M60,110 C100,135 180,135 210,110 C190,130 90,130 60,110 Z" fill="#78350F" />
    <!-- Boatman silhouette -->
    <circle cx="150" cy="92" r="6" fill="#1C1917" />
    <path d="M144,98 L156,98 L160,112 L140,112 Z" fill="#1C1917" />
    <!-- Animated oar -->
    <g class="oar-rower">
      <line x1="150" y1="102" x2="110" y2="140" stroke="#B45309" stroke-width="2.5" stroke-linecap="round" />
      <ellipse cx="106" cy="144" rx="8" ry="4" fill="#78350F" />
    </g>
  </g>
</svg>
""")

# Animated Temple Bell
write_asset("animated", "animated-temple-bell.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%">
  <style>
    @keyframes bellRing {
      0%, 100% { transform: rotate(0deg); }
      15% { transform: rotate(14deg); }
      30% { transform: rotate(-12deg); }
      45% { transform: rotate(8deg); }
      60% { transform: rotate(-6deg); }
      75% { transform: rotate(2deg); }
    }
    @keyframes soundWave {
      0% { opacity: 0; transform: scale(0.6); }
      50% { opacity: 0.8; }
      100% { opacity: 0; transform: scale(1.4); }
    }
    .bell-group { animation: bellRing 4s ease-in-out infinite; transform-origin: 50px 15px; cursor: pointer; }
    .sound-pulse { animation: soundWave 4s ease-out infinite; transform-origin: 50px 80px; }
  </style>

  <!-- Hanging Chain -->
  <line x1="50" y1="0" x2="50" y2="15" stroke="#B45309" stroke-width="3" />

  <!-- Acoustic Ring Pulses -->
  <circle cx="50" cy="80" r="30" fill="none" stroke="#F59E0B" stroke-width="1.5" class="sound-pulse" opacity="0" />

  <!-- Swinging Bell Assembly -->
  <g class="bell-group">
    <!-- Top loop -->
    <circle cx="50" cy="18" r="5" fill="none" stroke="#D97706" stroke-width="2.5" />
    <!-- Bell dome -->
    <path d="M42,24 L58,24 C60,42 72,50 72,66 L28,66 C28,50 40,42 42,24 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
    <!-- Flared lip -->
    <rect x="24" y="66" width="52" height="6" rx="3" fill="#D97706" stroke="#92400E" stroke-width="1.5" />
    <!-- Clapper ball -->
    <circle cx="50" cy="76" r="5" fill="#78350F" />
  </g>
</svg>
""")

print("ALL SVG ASSETS GENERATED SUCCESSFULLY!")
