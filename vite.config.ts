import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// YouTube Live Search Proxy Plugin
function youtubeSearchPlugin() {
  return {
    name: 'youtube-search-api',
    configureServer(server: any) {
      server.middlewares.use('/api/search-yt', async (req: any, res: any) => {
        const url = new URL(req.url, 'http://localhost:3000');
        const q = url.searchParams.get('q');
        if (!q || !q.trim()) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
          return;
        }

        try {
          const searchQuery = encodeURIComponent(q.trim() + ' song');
          const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIQAQ%253D%253D`;
          const ytRes = await fetch(searchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          });
          const html = await ytRes.text();
          const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData = ({.*?});/s);
          const results: any[] = [];

          if (match && match[1]) {
            const data = JSON.parse(match[1]);
            const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
            const itemSection = contents?.find((c: any) => c?.itemSectionRenderer)?.itemSectionRenderer?.contents || [];

            for (const item of itemSection) {
              const vr = item?.videoRenderer;
              if (vr && vr.videoId) {
                const title = vr.title?.runs?.map((r: any) => r.text).join('') || vr.title?.simpleText || 'Unknown Song';
                const artist = vr.ownerText?.runs?.map((r: any) => r.text).join('') || vr.shortBylineText?.runs?.map((r: any) => r.text).join('') || 'YouTube Music';
                const durationFormatted = vr.lengthText?.simpleText || '3:30';
                const thumbnails = vr.thumbnail?.thumbnails || [];
                const thumbnail = thumbnails[thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${vr.videoId}/hqdefault.jpg`;

                // Calculate approx duration in seconds from mm:ss or hh:mm:ss
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
