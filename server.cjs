const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.webm': 'audio/webm',
};

async function handleYouTubeSearch(req, res, query) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!query || !query.trim()) {
    res.end(JSON.stringify([]));
    return;
  }

  const cleanQuery = query.trim();
  const searchHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; CONSENT=PENDING+999;'
  };

  const parseResultsFromHtml = (html) => {
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData = ({.*?});/s);
    if (!match || !match[1]) return [];
    try {
      const data = JSON.parse(match[1]);
      const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
      const itemSection = contents?.find((c) => c?.itemSectionRenderer)?.itemSectionRenderer?.contents || [];
      const list = [];
      for (const item of itemSection) {
        const vr = item?.videoRenderer;
        if (vr && vr.videoId) {
          const title = vr.title?.runs?.map((r) => r.text).join('') || vr.title?.simpleText || 'YouTube Song';
          const artist = vr.ownerText?.runs?.map((r) => r.text).join('') || vr.shortBylineText?.runs?.map((r) => r.text).join('') || 'YouTube Artist';
          const durationFormatted = vr.lengthText?.simpleText || '3:30';
          const thumbnail = `https://i.ytimg.com/vi/${vr.videoId}/hqdefault.jpg`;

          const timeParts = durationFormatted.split(':').map((p) => parseInt(p, 10));
          let durationSec = 210;
          if (timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
            durationSec = timeParts[0] * 60 + timeParts[1];
          } else if (timeParts.length === 3 && !isNaN(timeParts[0]) && !isNaN(timeParts[1]) && !isNaN(timeParts[2])) {
            durationSec = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
          }

          list.push({
            id: vr.videoId,
            title,
            artist,
            durationFormatted,
            duration: durationSec,
            thumbnail,
            category: 'YouTube Search',
          });
          if (list.length >= 24) break;
        }
      }
      return list;
    } catch {
      return [];
    }
  };

  try {
    // 1. Try direct YouTube search with audio filter
    const u1 = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}&sp=EgIQAQ%253D%253D`;
    let ytRes = await fetch(u1, { headers: searchHeaders });
    let html = await ytRes.text();
    let results = parseResultsFromHtml(html);

    // 2. If no results, try general YouTube search
    if (results.length === 0) {
      const u2 = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery + ' song')}`;
      ytRes = await fetch(u2, { headers: searchHeaders });
      html = await ytRes.text();
      results = parseResultsFromHtml(html);
    }

    // 3. Fallback to public Invidious API if scrape failed
    if (results.length === 0) {
      try {
        const invRes = await fetch(`https://inv.tux.pizza/api/v1/search?q=${encodeURIComponent(cleanQuery)}&type=video`, {
          signal: AbortSignal.timeout(3000),
        });
        if (invRes.ok) {
          const invData = await invRes.json();
          if (Array.isArray(invData)) {
            results = invData.slice(0, 20).map((item) => ({
              id: item.videoId,
              title: item.title,
              artist: item.author || 'YouTube Artist',
              durationFormatted: item.lengthSeconds ? `${Math.floor(item.lengthSeconds / 60)}:${(item.lengthSeconds % 60).toString().padStart(2, '0')}` : '3:30',
              duration: item.lengthSeconds || 210,
              thumbnail: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
              category: 'YouTube Search',
            }));
          }
        }
      } catch (invErr) {
        // Invidious timeout/fail is non-fatal
      }
    }

    res.end(JSON.stringify(results));
  } catch (err) {
    console.error('YouTube search error:', err.message);
    res.end(JSON.stringify([]));
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Health check endpoint
  if (pathname === '/_health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Live YouTube search endpoint
  if (pathname === '/api/search-yt') {
    const q = parsedUrl.query.q || '';
    await handleYouTubeSearch(req, res, q);
    return;
  }

  // Safe file path resolution inside DIST_DIR
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  // Check if requested file exists in dist
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback: Serve index.html for non-asset routes
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.stat(indexPath, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
          });
          fs.createReadStream(indexPath).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Smart Subha Beats Server running on http://0.0.0.0:${PORT}`);
});
