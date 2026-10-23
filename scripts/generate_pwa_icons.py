#!/usr/bin/env python3
import struct
import zlib
import math

def create_png(width, height, get_pixel_func, output_path):
    # PNG signature: 89 50 4E 47 0D 0A 1A 0A
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel_func(x, y, width, height)
            raw_data.extend([int(r) & 0xFF, int(g) & 0xFF, int(b) & 0xFF, int(a) & 0xFF])
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0) # 8-bit RGBA
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)

    # IDAT chunk
    compressed_data = zlib.compress(bytes(raw_data), level=9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)

    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)

    png_bytes = b'\x89PNG\r\n\x1a\n' + ihdr_chunk + idat_chunk + iend_chunk
    with open(output_path, 'wb') as f:
        f.write(png_bytes)
    print(f"Generated {output_path} ({width}x{height}) - {len(png_bytes)} bytes")

def get_subha_beats_pixel(x, y, w, h):
    nx = x / float(w)
    ny = y / float(h)
    cx = nx - 0.5
    cy = ny - 0.5
    dist = math.sqrt(cx * cx + cy * cy)

    # Base background: deep space dark blue #07090e -> #0f172a
    bg_r = 7 + (nx + ny) * 8
    bg_g = 9 + (nx + ny) * 12
    bg_b = 14 + (nx + ny) * 20
    bg_a = 255

    # Rounded rectangle badge: rx = 0.38
    dx = max(abs(cx) - 0.32, 0)
    dy = max(abs(cy) - 0.32, 0)
    box_dist = math.sqrt(dx * dx + dy * dy)

    # Radial aurora glow in center
    aurora_glow = max(0.0, 1.0 - (dist / 0.45))
    r = bg_r + aurora_glow * 70
    g = bg_g + aurora_glow * 35
    b = bg_b + aurora_glow * 110

    # Inside badge or neon border
    if box_dist < 0.12:
        # Inner badge
        inner_r = 9 + nx * 10
        inner_g = 13 + ny * 15
        inner_b = 22 + (nx + ny) * 20

        # Draw musical notes and beams
        # Stem 1: x in [0.36, 0.40], y in [0.24, 0.62]
        # Stem 2: x in [0.60, 0.64], y in [0.18, 0.56]
        # Beam: top connecting stem 1 and 2
        # Note heads: ellipses at bottom of stems
        is_stem1 = (0.36 <= nx <= 0.40) and (0.24 <= ny <= 0.62)
        is_stem2 = (0.60 <= nx <= 0.64) and (0.18 <= ny <= 0.56)

        # Slanted beam between stems: y around 0.24 - 0.18 slope
        beam_target_y = 0.24 - (nx - 0.36) * (0.06 / 0.24)
        is_beam = (0.36 <= nx <= 0.64) and (abs(ny - beam_target_y) <= 0.035)

        # Note heads:
        nh1_dx = (nx - 0.32) / 0.08
        nh1_dy = (ny - 0.62) / 0.06
        is_head1 = (nh1_dx * nh1_dx + nh1_dy * nh1_dy) <= 1.0

        nh2_dx = (nx - 0.56) / 0.08
        nh2_dy = (ny - 0.56) / 0.06
        is_head2 = (nh2_dx * nh2_dx + nh2_dy * nh2_dy) <= 1.0

        # Equalizer soundwaves on right:
        is_wave = False
        for wave_r in [0.18, 0.23, 0.28]:
            wd = abs(math.sqrt((nx - 0.60)**2 + (ny - 0.35)**2) - wave_r)
            if wd < 0.012 and (0.66 <= nx <= 0.85) and (0.22 <= ny <= 0.48):
                is_wave = True

        # Neon gradient color for notes: purple (#8b5cf6) to cyan (#06b6d4)
        grad_t = (nx + ny) * 0.5
        note_r = 139 * (1 - grad_t) + 6 * grad_t
        note_g = 92 * (1 - grad_t) + 182 * grad_t
        note_b = 246 * (1 - grad_t) + 212 * grad_t

        if is_stem1 or is_stem2 or is_beam or is_head1 or is_head2:
            r = note_r
            g = note_g
            b = note_b
        elif is_wave:
            r = 6
            g = 182
            b = 212
        else:
            # Subtle border
            if abs(box_dist - 0.11) < 0.015:
                r = 139 * 0.8
                g = 92 * 0.8
                b = 246 * 0.8
            else:
                r = inner_r + aurora_glow * 30
                g = inner_g + aurora_glow * 20
                b = inner_b + aurora_glow * 40
    else:
        # Outside badge corner smoothing
        if box_dist > 0.14:
            pass # Keep dark background

    return (min(255, max(0, r)), min(255, max(0, g)), min(255, max(0, b)), bg_a)

if __name__ == '__main__':
    create_png(192, 192, get_subha_beats_pixel, 'public/icon-192.png')
    create_png(512, 512, get_subha_beats_pixel, 'public/icon-512.png')
    create_png(512, 512, get_subha_beats_pixel, 'public/maskable-icon-512.png')
    create_png(180, 180, get_subha_beats_pixel, 'public/apple-touch-icon.png')
    print("All PWA icons successfully generated!")
