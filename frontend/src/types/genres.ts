export interface GenreBook {
  id: string
  title: string
  author: string
  coverUrl: string
  rating?: number
  popularity?: number
  year?: number
  genres: string[]
  bgGradient?: string
}

export const GENRE_OPTIONS = [
  'Fiction',
  'Mystery',
  'Psychology',
  'Self Growth',
  'Business',
  'Fantasy',
  'Romance',
  'Thriller',
  'Contemporary',
  'Non-Fiction',
  'Classic',
  'Science Fiction',
  'Horror',
  'Poetry',
  'Young Adult',
  'Historical',
] as const

export type GenreName = (typeof GENRE_OPTIONS)[number]

export const SORT_OPTIONS = [
  'Most Popular',
  'Highest Rated',
  'Recently Added',
  'Title: A–Z',
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]

export const INITIAL_GENRE_BOOKS: GenreBook[] = [
  // --- 10 Reference Books (Fiction Default Display) ---
  {
    id: 'genre-1',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg',
    rating: 4.4,
    popularity: 99,
    year: 2017,
    genres: ['Fiction', 'Romance', 'Historical', 'Contemporary'],
    bgGradient: 'linear-gradient(175deg, #1B4D3E 0%, #0D261F 100%)',
  },
  {
    id: 'genre-2',
    title: 'Normal People',
    author: 'Sally Rooney',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571334650-L.jpg',
    rating: 4.2,
    popularity: 96,
    year: 2018,
    genres: ['Fiction', 'Contemporary', 'Romance', 'Young Adult'],
    bgGradient: 'linear-gradient(165deg, #F8B4C0 0%, #E87A90 100%)',
  },
  {
    id: 'genre-3',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg',
    rating: 4.5,
    popularity: 95,
    year: 2011,
    genres: ['Fiction', 'Historical', 'Fantasy', 'Romance'],
    bgGradient: 'linear-gradient(170deg, #3A7387 0%, #1A3E4D 100%)',
  },
  {
    id: 'genre-4',
    title: 'Circe',
    author: 'Madeline Miller',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg',
    rating: 4.3,
    popularity: 94,
    year: 2018,
    genres: ['Fiction', 'Fantasy', 'Historical'],
    bgGradient: 'linear-gradient(175deg, #8A4318 0%, #3B1B09 100%)',
  },
  {
    id: 'genre-5',
    title: 'Daisy Jones & The Six',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781524798628-L.jpg',
    rating: 4.4,
    popularity: 93,
    year: 2019,
    genres: ['Fiction', 'Historical', 'Contemporary'],
    bgGradient: 'linear-gradient(180deg, #A8422B 0%, #6E2214 100%)',
  },
  {
    id: 'genre-6',
    title: 'Lessons in Chemistry',
    author: 'Bonnie Garmus',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385547345-L.jpg',
    rating: 4.3,
    popularity: 92,
    year: 2022,
    genres: ['Fiction', 'Historical', 'Contemporary'],
    bgGradient: 'linear-gradient(175deg, #E66874 0%, #B83C49 100%)',
  },
  {
    id: 'genre-7',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V. E. Schwab',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780765387561-L.jpg',
    rating: 4.2,
    popularity: 91,
    year: 2020,
    genres: ['Fiction', 'Fantasy', 'Historical', 'Romance'],
    bgGradient: 'linear-gradient(175deg, #1C1C20 0%, #0E0E12 100%)',
  },
  {
    id: 'genre-8',
    title: 'A Little Life',
    author: 'Hanya Yanagihara',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385539258-L.jpg',
    rating: 4.3,
    popularity: 90,
    year: 2015,
    genres: ['Fiction', 'Contemporary', 'Psychology'],
    bgGradient: 'linear-gradient(180deg, #3A3D40 0%, #1A1C1E 100%)',
  },
  {
    id: 'genre-9',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    rating: 4.1,
    popularity: 89,
    year: 2020,
    genres: ['Fiction', 'Contemporary', 'Fantasy', 'Self Growth'],
    bgGradient: 'linear-gradient(175deg, #1C2D42 0%, #15202B 100%)',
  },
  {
    id: 'genre-10',
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781335430991-L.jpg',
    rating: 4.3,
    popularity: 88,
    year: 2019,
    genres: ['Fiction', 'Fantasy', 'Contemporary', 'Psychology'],
    bgGradient: 'linear-gradient(170deg, #7AA88B 0%, #355C42 100%)',
  },

  // --- Extended Mock Items for other 15 genres ---
  {
    id: 'genre-11',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg',
    rating: 4.3,
    popularity: 87,
    year: 2019,
    genres: ['Mystery', 'Thriller', 'Psychology', 'Fiction'],
    bgGradient: 'linear-gradient(175deg, #A83232 0%, #4A0E0E 100%)',
  },
  {
    id: 'genre-12',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    rating: 4.8,
    popularity: 98,
    year: 2018,
    genres: ['Self Growth', 'Psychology', 'Business', 'Non-Fiction'],
    bgGradient: 'linear-gradient(175deg, #FBF8F1 0%, #D8CEBC 100%)',
  },
  {
    id: 'genre-13',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg',
    rating: 4.4,
    popularity: 85,
    year: 2011,
    genres: ['Psychology', 'Non-Fiction', 'Business', 'Self Growth'],
    bgGradient: 'linear-gradient(170deg, #E6E6E6 0%, #8C8C8C 100%)',
  },
  {
    id: 'genre-14',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501135910-L.jpg',
    rating: 4.7,
    popularity: 86,
    year: 2016,
    genres: ['Business', 'Non-Fiction', 'Self Growth'],
    bgGradient: 'linear-gradient(175deg, #D4421E 0%, #681C09 100%)',
  },
  {
    id: 'genre-15',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    rating: 4.6,
    popularity: 97,
    year: 1965,
    genres: ['Science Fiction', 'Classic', 'Fantasy', 'Fiction'],
    bgGradient: 'linear-gradient(175deg, #B5651D 0%, #4A2605 100%)',
  },
  {
    id: 'genre-16',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg',
    rating: 4.7,
    popularity: 94,
    year: 2021,
    genres: ['Science Fiction', 'Fiction', 'Thriller'],
    bgGradient: 'linear-gradient(170deg, #D18D26 0%, #4D320A 100%)',
  },
  {
    id: 'genre-17',
    title: 'Mexican Gothic',
    author: 'Silvia Moreno-Garcia',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525620785-L.jpg',
    rating: 4.1,
    popularity: 84,
    year: 2020,
    genres: ['Horror', 'Mystery', 'Historical', 'Fiction'],
    bgGradient: 'linear-gradient(175deg, #4A5B2B 0%, #1F2810 100%)',
  },
  {
    id: 'genre-18',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    rating: 4.7,
    popularity: 95,
    year: 1813,
    genres: ['Classic', 'Romance', 'Historical', 'Fiction'],
    bgGradient: 'linear-gradient(180deg, #E8D4C0 0%, #8A6848 100%)',
  },
  {
    id: 'genre-19',
    title: 'The Sun and Her Flowers',
    author: 'Rupi Kaur',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781449486792-L.jpg',
    rating: 4.2,
    popularity: 82,
    year: 2017,
    genres: ['Poetry', 'Non-Fiction'],
    bgGradient: 'linear-gradient(175deg, #F5D372 0%, #9C7D25 100%)',
  },
  {
    id: 'genre-20',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg',
    rating: 4.5,
    popularity: 97,
    year: 2008,
    genres: ['Young Adult', 'Science Fiction', 'Fiction', 'Thriller'],
    bgGradient: 'linear-gradient(175deg, #262626 0%, #0F0F0F 100%)',
  },
  {
    id: 'genre-21',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    rating: 4.5,
    popularity: 95,
    year: 2014,
    genres: ['Non-Fiction', 'Psychology', 'Historical'],
    bgGradient: 'linear-gradient(175deg, #C29B38 0%, #4D3D12 100%)',
  },
]

export const GENRE_BOOKS_DATASET = INITIAL_GENRE_BOOKS

/**
 * Normalizes a genre name or query parameter for case- and separator-insensitive comparison.
 * e.g., "Self Growth", "self-growth", "self growth" -> "selfgrowth"
 */
export const normalizeGenre = (genre: string): string => {
  return genre.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Converts a genre title into a URL query slug.
 * e.g., "Self Growth" -> "self-growth", "Fiction" -> "fiction"
 */
export const toGenreSlug = (genre: string): string => {
  return genre.toLowerCase().trim().replace(/\s+/g, '-')
}

/**
 * Matches an optional genre parameter from the URL to a valid GenreName in GENRE_OPTIONS.
 * Defaults safely to 'Fiction' if missing, invalid, or unknown.
 */
export const matchGenreFromParam = (param: string | null | undefined): GenreName => {
  if (!param) return 'Fiction'
  const normalizedParam = normalizeGenre(param)
  if (!normalizedParam) return 'Fiction'

  const matched = GENRE_OPTIONS.find((genre) => {
    return normalizeGenre(genre) === normalizedParam
  })

  return matched || 'Fiction'
}

/**
 * Safely extracts the genre query parameter from a URL hash string.
 * Supports hashes like "#discover/genres?genre=fantasy" or "#/discover/genres?genre=psychology".
 */
export const getGenreFromHash = (rawHash?: string): string | null => {
  try {
    const hash =
      rawHash !== undefined
        ? rawHash
        : typeof window !== 'undefined'
          ? window.location.hash
          : ''
    const queryIndex = hash.indexOf('?')
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1)
      const params = new URLSearchParams(queryString)
      return params.get('genre')
    }
  } catch {
    // safely ignore
  }
  return null
}
