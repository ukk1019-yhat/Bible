import type { Video } from '../types/content'
import { featuredVideo as fallbackFeatured } from '../data/content/videos'

const LATEST_VIDEO_STORAGE_KEY = 'satyasakshi:latest-video'
const RECENT_VIDEOS_STORAGE_KEY = 'satyasakshi:recent-youtube-videos'

/**
 * Returns the cached latest video from localStorage, or the default featured video from static data.
 * Safe for SSR/first-paint with zero delay.
 */
export function getInitialFeaturedVideo(): Video {
  if (typeof window === 'undefined') return fallbackFeatured
  try {
    const raw = localStorage.getItem(LATEST_VIDEO_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Video
      if (parsed && parsed.youtubeId && parsed.title) {
        return parsed
      }
    }
  } catch {
    // Ignore JSON/storage errors
  }
  return fallbackFeatured
}

/**
 * Returns any cached recent YouTube videos from localStorage.
 */
export function getCachedRecentYouTubeVideos(): Video[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_VIDEOS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Video[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Ignore JSON/storage errors
  }
  return []
}

/**
 * Fetches the latest video(s) released on the official YouTube channel (@sudhaword).
 * Automatically caches the response in localStorage for instantaneous subsequent loads.
 */
export async function fetchLatestYouTubeVideos(): Promise<{ latest: Video | null; videos: Video[] }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch('/api/latest-video', {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`Failed to fetch latest video: HTTP ${res.status}`)
    }

    const data = await res.json()
    if (!data || !data.success) {
      throw new Error(data?.error || 'Unknown error fetching latest video')
    }

    const latest = (data.latest as Video) || null
    const videos = Array.isArray(data.videos) ? (data.videos as Video[]) : []

    if (latest && latest.youtubeId) {
      try {
        localStorage.setItem(LATEST_VIDEO_STORAGE_KEY, JSON.stringify(latest))
      } catch {
        // Storage full or disabled
      }
    }

    if (videos.length > 0) {
      try {
        localStorage.setItem(RECENT_VIDEOS_STORAGE_KEY, JSON.stringify(videos))
      } catch {
        // Storage full or disabled
      }
    }

    return { latest, videos }
  } catch (err) {
    console.info('Using fallback/cached latest video (YouTube fetch skipped):', err)
    return {
      latest: getInitialFeaturedVideo(),
      videos: getCachedRecentYouTubeVideos(),
    }
  }
}
