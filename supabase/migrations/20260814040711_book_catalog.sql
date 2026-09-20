-- ============================================================
-- VERBA — MIGRATION 003
-- BOOK CATALOG
-- ============================================================


-- ============================================================
-- 1. BOOKS
-- Canonical Verba representation of a book.
-- ============================================================

CREATE TABLE public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,

    cover_url TEXT,

    page_count INTEGER,

    publisher TEXT,

    published_date DATE,
    published_date_precision TEXT,

    language TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT books_page_count_positive
        CHECK (
            page_count IS NULL
            OR page_count > 0
        ),

    CONSTRAINT books_published_date_precision_valid
        CHECK (
            published_date_precision IS NULL
            OR published_date_precision IN (
                'year',
                'month',
                'day',
                'unknown'
            )
        )
);


-- ============================================================
-- 2. AUTHORS
-- Shared author catalog.
-- ============================================================

CREATE TABLE public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. BOOK IDENTIFIERS
-- Supports multiple ISBNs and future identifier types.
-- ============================================================

CREATE TABLE public.book_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    book_id UUID NOT NULL
        REFERENCES public.books(id)
        ON DELETE CASCADE,

    type TEXT NOT NULL,
    value TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT book_identifiers_type_valid
        CHECK (
            type IN (
                'isbn_10',
                'isbn_13'
            )
        ),

    CONSTRAINT book_identifiers_unique_value
        UNIQUE (type, value)
);


-- ============================================================
-- 4. BOOK AUTHORS
-- Many-to-many relationship between books and authors.
-- ============================================================

CREATE TABLE public.book_authors (
    book_id UUID NOT NULL
        REFERENCES public.books(id)
        ON DELETE CASCADE,

    author_id UUID NOT NULL
        REFERENCES public.authors(id)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (book_id, author_id)
);


-- ============================================================
-- 5. BOOK GENRES
-- Many-to-many relationship between books and genres.
-- ============================================================

CREATE TABLE public.book_genres (
    book_id UUID NOT NULL
        REFERENCES public.books(id)
        ON DELETE CASCADE,

    genre_id UUID NOT NULL
        REFERENCES public.genres(id)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (book_id, genre_id)
);


-- ============================================================
-- 6. BOOK SOURCES
-- Provider-specific representation of a canonical book.
--
-- Examples:
-- Google Books
-- Goodreads
-- StoryGraph
-- Notion
-- Hardcover
-- ============================================================

CREATE TABLE public.book_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    book_id UUID NOT NULL
        REFERENCES public.books(id)
        ON DELETE CASCADE,

    provider TEXT NOT NULL,
    external_book_id TEXT NOT NULL,

    source_title TEXT,
    source_author TEXT,
    source_cover_url TEXT,
    source_page_count INTEGER,
    source_published_date DATE,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT book_sources_status_valid
        CHECK (
            status IN (
                'active',
                'removed',
                'invalid'
            )
        ),

    CONSTRAINT book_sources_page_count_positive
        CHECK (
            source_page_count IS NULL
            OR source_page_count > 0
        ),

    CONSTRAINT book_sources_provider_external_id_unique
        UNIQUE (provider, external_book_id)
);