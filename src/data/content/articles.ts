import type { Article, ArticleCategory } from '../../types/content'

export const articleCategories: ArticleCategory[] = [
  { slug: 'rakshana', telugu: 'రక్షణ' },
  { slug: 'praarthana', telugu: 'ప్రార్థన' },
  { slug: 'vishvaasam', telugu: 'విశ్వాసం' },
]

/**
 * The three articles Satya Sakshi has published. Titles and excerpts are taken
 * verbatim from the existing site — only presentation has changed.
 *
 * `status: 'coming-soon'` because the full article body has never been
 * published. The article page renders the real excerpt and an honest notice
 * instead of inventing paragraphs.
 */
export const articles: Article[] = [
  {
    slug: 'rakshana-ante-emiti',
    title: 'రక్షణ అంటే ఏమిటి?',
    excerpt: 'యేసుక్రీస్తు ద్వారా కలిగే రక్షణ గురించి.',
    category: articleCategories[0],
    status: 'coming-soon',
  },
  {
    slug: 'praarthana-shakti',
    title: 'ప్రార్థన శక్తి',
    excerpt: 'ప్రార్థన విశ్వాసిని ఎలా మార్చుతుంది?',
    category: articleCategories[1],
    status: 'coming-soon',
  },
  {
    slug: 'vishvaasam-jeevitam',
    title: 'విశ్వాస జీవితం',
    excerpt: 'దేవుని చిత్తంలో నడిచే జీవితం.',
    category: articleCategories[2],
    status: 'coming-soon',
  },
]

export const publishedArticles = articles.filter((a) => a.status === 'published')

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}