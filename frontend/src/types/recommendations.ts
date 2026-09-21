export interface TextSegment {
  text: string
  highlighted?: boolean
}

export interface RecommendationReason {
  icon: 'heart' | 'book' | 'sparkles'
  segments: TextSegment[]
}

export interface RecommendationBook {
  id: string
  title: string
  author: string
  coverUrl: string
  rating: number
  ratingsCount: string
  badge: string
  shortReason: {
    segments: TextSegment[]
  }
  reasons: RecommendationReason[]
  bgGradient?: string
}

export const RECOMMENDED_DATASET: RecommendationBook[] = [
  {
    id: 'normal-people',
    title: 'Normal People',
    author: 'Sally Rooney',
    coverUrl: 'https://covers.openlibrary.org/b/id/10582964-L.jpg',
    rating: 4.2,
    ratingsCount: '980K ratings',
    badge: 'Because you enjoy character-driven stories',
    bgGradient: 'linear-gradient(165deg, #F8B4C0 0%, #E87A90 50%, #C85A70 100%)',
    shortReason: {
      segments: [
        { text: 'You enjoy ' },
        { text: 'emotional, character-driven stories', highlighted: true },
      ],
    },
    reasons: [
      {
        icon: 'heart',
        segments: [
          { text: 'You enjoy ' },
          { text: 'character-driven', highlighted: true },
          { text: ' stories with ' },
          { text: 'emotional depth', highlighted: true },
        ],
      },
      {
        icon: 'book',
        segments: [
          { text: 'Similar to books you liked (e.g. ' },
          { text: 'Daisy Jones & The Six', highlighted: true },
          { text: ')' },
        ],
      },
      {
        icon: 'sparkles',
        segments: [
          { text: 'Explores themes of relationships, ' },
          { text: 'identity and growing up', highlighted: true },
        ],
      },
    ],
  },
  {
    id: 'before-the-coffee',
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    coverUrl: 'https://covers.openlibrary.org/b/id/9255566-L.jpg',
    rating: 4.3,
    ratingsCount: '450K ratings',
    badge: 'Thought-Provoking Pick',
    bgGradient: 'linear-gradient(170deg, #E6F0EA 0%, #B8D8C2 50%, #7AA88B 100%)',
    shortReason: {
      segments: [
        { text: 'Matches your interest in ' },
        { text: 'contemplative and thought-provoking reads', highlighted: true },
      ],
    },
    reasons: [
      {
        icon: 'heart',
        segments: [
          { text: 'Matches your interest in ' },
          { text: 'contemplative and thought-provoking', highlighted: true },
          { text: ' reads' },
        ],
      },
      {
        icon: 'book',
        segments: [
          { text: 'Magical realism focusing on ' },
          { text: 'second chances and memory', highlighted: true },
        ],
      },
      {
        icon: 'sparkles',
        segments: [
          { text: 'Beloved by readers who enjoy ' },
          { text: 'gentle and heartfelt', highlighted: true },
          { text: ' storytelling' },
        ],
      },
    ],
  },
  {
    id: 'midnight-library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://covers.openlibrary.org/b/id/10313767-L.jpg',
    rating: 4.1,
    ratingsCount: '1.8M ratings',
    badge: 'Popular with Readers Like You',
    bgGradient: 'linear-gradient(175deg, #1C2D42 0%, #15202B 100%)',
    shortReason: {
      segments: [
        { text: 'You liked books about ' },
        { text: 'self-discovery and second chances', highlighted: true },
      ],
    },
    reasons: [
      {
        icon: 'book',
        segments: [
          { text: 'You liked books about ' },
          { text: 'self-discovery and second chances', highlighted: true },
        ],
      },
      {
        icon: 'heart',
        segments: [
          { text: 'Explores infinite choices that shape ' },
          { text: 'a meaningful life', highlighted: true },
        ],
      },
      {
        icon: 'sparkles',
        segments: [
          { text: 'Shared thematic resonance with ' },
          { text: 'your reading journey', highlighted: true },
        ],
      },
    ],
  },
  {
    id: 'daisy-jones',
    title: 'Daisy Jones & The Six',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    rating: 4.4,
    ratingsCount: '1.5M ratings',
    badge: 'Because You Love Music & Drama',
    bgGradient: 'linear-gradient(180deg, #A8422B 0%, #6E2214 100%)',
    shortReason: {
      segments: [
        { text: 'You’ve read and enjoyed author ' },
        { text: 'Taylor Jenkins Reid', highlighted: true },
      ],
    },
    reasons: [
      {
        icon: 'book',
        segments: [
          { text: 'You’ve read and enjoyed author ' },
          { text: 'Taylor Jenkins Reid', highlighted: true },
        ],
      },
      {
        icon: 'heart',
        segments: [
          { text: 'Immersive oral-history style with ' },
          { text: 'flawed, unforgettable characters', highlighted: true },
        ],
      },
      {
        icon: 'sparkles',
        segments: [
          { text: 'Captures vibrant atmosphere of the ' },
          { text: '1970s music scene', highlighted: true },
        ],
      },
    ],
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/id/12886416-L.jpg',
    rating: 4.3,
    ratingsCount: '2.1M ratings',
    badge: 'Habit Transformation Essential',
    bgGradient: 'linear-gradient(175deg, #FBF8F1 0%, #E8E2D5 100%)',
    shortReason: {
      segments: [
        { text: 'Popular among readers who enjoy ' },
        { text: 'self-growth and building habits', highlighted: true },
      ],
    },
    reasons: [
      {
        icon: 'sparkles',
        segments: [
          { text: 'Popular among readers who enjoy ' },
          { text: 'self-growth and building habits', highlighted: true },
        ],
      },
      {
        icon: 'book',
        segments: [
          { text: 'Practical, actionable frameworks for ' },
          { text: 'continuous personal growth', highlighted: true },
        ],
      },
      {
        icon: 'heart',
        segments: [
          { text: 'Aligns with your goal of ' },
          { text: 'intentional daily routines', highlighted: true },
        ],
      },
    ],
  },
  {
    id: 'evelyn-hugo',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/id/8432047-L.jpg',
    rating: 4.4,
    ratingsCount: '1.2M ratings',
    badge: 'Top Pick for You',
    bgGradient: 'linear-gradient(175deg, #1B4D3E 0%, #0D261F 100%)',
    shortReason: {
      segments: [
        { text: 'Matches your interest in ' },
        { text: 'glamour, secrets and complex characters', highlighted: true },
      ],
    },
    reasons: [
      {
        icon: 'heart',
        segments: [
          { text: 'Matches your interest in ' },
          { text: 'character-driven fiction', highlighted: true },
        ],
      },
      {
        icon: 'book',
        segments: [
          { text: 'Similar to books you enjoyed (e.g. ' },
          { text: 'Daisy Jones & The Six', highlighted: true },
          { text: ')' },
        ],
      },
      {
        icon: 'sparkles',
        segments: [
          { text: 'Popular among readers with ' },
          { text: 'similar taste', highlighted: true },
        ],
      },
    ],
  },
]
