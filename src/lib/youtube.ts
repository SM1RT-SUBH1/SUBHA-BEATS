export interface ExtractedYTInfo {
  videoId: string | null;
  playlistId: string | null;
  type: 'video' | 'playlist' | 'unknown';
}

export function parseYouTubeUrl(url: string): ExtractedYTInfo {
  if (!url || typeof url !== 'string') {
    return { videoId: null, playlistId: null, type: 'unknown' };
  }

  const cleanUrl = url.trim();

  // Playlist check
  const playlistMatch = cleanUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const playlistId = playlistMatch ? playlistMatch[1] : null;

  // Video ID regex checks
  // 1. standard watch?v=ID
  let videoId: string | null = null;
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }

  // 2. youtu.be/ID
  if (!videoId) {
    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
  }

  // 3. /embed/ID
  if (!videoId) {
    const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
  }

  // 4. /shorts/ID
  if (!videoId) {
    const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) {
      videoId = shortsMatch[1];
    }
  }

  // 5. Bare 11-char ID
  if (!videoId && /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    videoId = cleanUrl;
  }

  if (playlistId && !videoId) {
    return { videoId: null, playlistId, type: 'playlist' };
  } else if (videoId) {
    return { videoId, playlistId, type: playlistId ? 'playlist' : 'video' };
  }

  return { videoId: null, playlistId: null, type: 'unknown' };
}

export async function fetchYouTubeOEmbed(urlOrId: string): Promise<{ title: string; author_name: string; thumbnail_url: string } | null> {
  try {
    const targetUrl = urlOrId.startsWith('http') 
      ? urlOrId 
      : `https://www.youtube.com/watch?v=s${urlOrId}`;
      
    const endpoint = `https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`;
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      title: data.title || 'Untitled Track',
      author_name: data.author_name || 'YouTube Artist',
      thumbnail_url: data.thumbnail_url || '',
    };
  } catch (error) {
    console.warn('Could not fetch oEmbed metadata:', error);
    return null;
  }
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
