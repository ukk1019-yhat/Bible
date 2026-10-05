import type { Speaker, Video } from '../../types/content'

/**
 * Satya Sakshi publishes its Bible messages on the YouTube channel
 * "Church of The Living God – Kakinada" (@sudhaword).
 *
 * Titles, channel and speaker names below are taken verbatim from the channel's
 * own metadata — nothing is paraphrased or invented. `duration` and
 * `publishedAt` are intentionally absent because YouTube's oEmbed endpoint does
 * not expose them; the UI omits those fields rather than guessing.
 */
export const speakers: Speaker[] = [
  {
    name: 'Bro. P. SunilKumar Garu',
    honorific: 'బ్రో.',
    slug: 'p-sunilkumar',
  },
]

const sunilKumar = speakers[0]

export const videos: Video[] = [
  {
    slug: 'bible-chadive-kramamu',
    title: 'బైబిల్ చదివే క్రమము',
    description:
      'దేవుని వాక్యాన్ని ఏ క్రమంలో చదవాలి, ప్రతి అధ్యాయంలో ఏమి గ్రహించాలి — బైబిల్ అధ్యయనానికి మంచి పాఠం.',
    youtubeId: 'BvDAnUwlGnk',
    category: 'బైబిల్ సందేశాలు',
    speaker: sunilKumar,
    featured: true,
  },
  {
    slug: 'lukha-15-vivarana',
    title:
      'ఆనందం, తప్పిపోయి దొరికిన గొర్రెను బట్టా? లేక తాను కలిగియున్న గొర్రెల సంఖ్యను బట్టా? లూకా 15 వివరణ',
    description: 'లూకా అధ్యాయం 15 వివరణ — ఇశ్రాయేలీయుల ప్రజల గొర్రె గురించి.',
    youtubeId: 'U6JQVb2-oLY',
    category: 'బైబిల్ అధ్యయనం',
    speaker: sunilKumar,
    scripture: 'లూకా 15',
  },
  {
    slug: 'nishchayamuga-chatturu',
    title:
      "'నిశ్చయముగా చత్తురు' దేవుడు పలికిన ఈ మాట వారిపట్ల ఎలా నెరవేరింది? వారు చనిపోయారా? అయితే ఎలా?",
    description:
      "దేవుడు 'నిశ్చయముగా చత్తురు' అని పలికిన ఆ మాట గురించి బైబిల్ ఆధారంగా వివరణ.",
    youtubeId: 'ZV-lPF5i-Po',
    category: 'ప్రశ్నలు & సమాధానాలు',
    speaker: sunilKumar,
  },
]

export const featuredVideo: Video = videos.find((v) => v.featured) ?? videos[0]

export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug)
}

export function getSpeakerBySlug(slug: string): Speaker | undefined {
  return speakers.find((s) => s.slug === slug)
}

export function getVideosByCategory(category: Video['category']): Video[] {
  return videos.filter((v) => v.category === category)
}