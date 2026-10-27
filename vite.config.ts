import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// YouTube Live Search Proxy Plugin
function youtubeSearchPlugin() {
  return {
    name: 'youtube-search-api',
    configureServer(server: any) {
      server.middlewares.use('/api/search-yt', async (req: any, res: any) => {
        let q = '';
        try {
          const url = new URL(req.url, 'http://localhost:3000/api/search-yt');
          q = url.searchParams.get('q') || '';
        } catch {
          const m = req.url?.match(/[?&]q=([^&]+)/);
          q = m ? decodeURIComponent(m[1]) : '';
        }

        if (!q || !q.trim()) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
          return;
        }

        const cleanQuery = q.trim();
        const searchHeaders = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cookie': 'SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; CONSENT=PENDING+999;'
        };

        const parseFromHtml = (html: string) => {
          const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData = ({.*?});/s);
          if (!match || !match[1]) return [];
          try {
            const data = JSON.parse(match[1]);
            const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
            const itemSection = contents?.find((c: any) => c?.itemSectionRenderer)?.itemSectionRenderer?.contents || [];
            const results: any[] = [];
            for (const item of itemSection) {
              const vr = item?.videoRenderer;
              if (vr && vr.videoId) {
                const title = vr.title?.runs?.map((r: any) => r.text).join('') || vr.title?.simpleText || 'Unknown Song';
                const artist = vr.ownerText?.runs?.map((r: any) => r.text).join('') || vr.shortBylineText?.runs?.map((r: any) => r.text).join('') || 'YouTube Music';
                const durationFormatted = vr.lengthText?.simpleText || '3:30';
                const thumbnail = `https://i.ytimg.com/vi/${vr.videoId}/hqdefault.jpg`;
                const timeParts = durationFormatted.split(':').map((p: string) => parseInt(p, 10));
                let durationSec = 210;
                if (timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
                  durationSec = timeParts[0] * 60 + timeParts[1];
                } else if (timeParts.length === 3 && !isNaN(timeParts[0]) && !isNaN(timeParts[1]) && !isNaN(timeParts[2])) {
                  durationSec = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                }
                results.push({
                  id: vr.videoId,
                  title,
                  artist,
                  durationFormatted,
                  duration: durationSec,
                  thumbnail,
                  category: 'YouTube Search',
                });
                if (results.length >= 24) break;
              }
            }
            return results;
          } catch {
            return [];
          }
        };

        try {
          const u1 = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}&sp=EgIQAQ%253D%253D`;
          let ytRes = await fetch(u1, { headers: searchHeaders });
          let html = await ytRes.text();
          let results = parseFromHtml(html);

          if (results.length === 0) {
            const u2 = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery + ' song')}`;
            ytRes = await fetch(u2, { headers: searchHeaders });
            html = await ytRes.text();
            results = parseFromHtml(html);
          }

          if (results.length === 0) {
            try {
              const invRes = await fetch(`https://inv.tux.pizza/api/v1/search?q=${encodeURIComponent(cleanQuery)}&type=video`, {
                signal: AbortSignal.timeout(3000),
              });
              if (invRes.ok) {
                const invData = await invRes.json();
                if (Array.isArray(invData)) {
                  results = invData.slice(0, 20).map((item: any) => ({
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
            } catch {}
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results));
        } catch (err) {
          console.error('YouTube search error:', err);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), youtubeSearchPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
});
