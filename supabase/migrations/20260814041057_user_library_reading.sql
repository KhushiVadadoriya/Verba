-- ============================================================
-- VERBA — MIGRATION 004
-- USER LIBRARY + READING SYSTEM
-- ============================================================


-- ============================================================
-- 1. USER BOOKS
-- Represents a user's relationship with a canonical book.
-- ============================================================

CREATE TABLE public.user_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    book_id UUID NOT NULL
        REFERENCES public.books(id)
        ON DELETE RESTRICT,

    status TEXT NOT NULL DEFAULT 'want_to_read',

    format TEXT,

    current_page INTEGER,

    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,

    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT user_books_status_valid
        CHECK (
            status IN (
                'want_to_read',
                'reading',
                'completed',
                'paused',
                'dropped'
            )
        ),

    CONSTRAINT user_books_current_page_valid
        CHECK (
            current_page IS NULL
            OR current_page >= 0
        ),

    CONSTRAINT user_books_dates_valid
        CHECK (
            finished_at IS NULL
            OR started_at IS NULL
            OR finished_at >= started_at
        ),

    CONSTRAINT user_books_unique_active_book
        UNIQUE (user_id, book_id)
);


-- ============================================================
-- 2. USER BOOK SOURCES
-- Connects a user's library item to an external record.
--
-- Example:
-- User's Goodreads record
-- User's Notion record
-- User's Hardcover record
-- ============================================================

CREATE TABLE public.user_book_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_book_id UUID NOT NULL
        REFERENCES public.user_books(id)
        ON DELETE CASCADE,

    provider TEXT NOT NULL,

    external_record_id TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    removed_at TIMESTAMPTZ,

    CONSTRAINT user_book_sources_unique_user_record
       UNIQUE (user_book_id, provider, external_record_id)
);


-- ============================================================
-- 3. READING SESSIONS
-- Tracks individual reading sessions.
-- ============================================================

CREATE TABLE public.reading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    user_book_id UUID NOT NULL
        REFERENCES public.user_books(id)
        ON DELETE CASCADE,

    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,

    start_page INTEGER,
    end_page INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT reading_sessions_start_page_valid
        CHECK (
            start_page IS NULL
            OR start_page >= 0
        ),

    CONSTRAINT reading_sessions_end_page_valid
        CHECK (
            end_page IS NULL
            OR end_page >= 0
        ),

    CONSTRAINT reading_sessions_page_order_valid
        CHECK (
            end_page IS NULL
            OR start_page IS NULL
            OR end_page >= start_page
        ),

    CONSTRAINT reading_sessions_time_order_valid
        CHECK (
            ended_at IS NULL
            OR ended_at >= started_at
        )
);


-- ============================================================
-- 4. REFLECTIONS
-- Multiple reflections are intentionally supported.
-- ============================================================

CREATE TABLE public.reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    user_book_id UUID NOT NULL
        REFERENCES public.user_books(id)
        ON DELETE CASCADE,

    reflection_text TEXT,

    favorite_takeaway TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 5. GENRE → EMOTION MAPPING
-- Defines which emotions are presented for each genre.
--
-- Your product decision:
-- Different genres can expose different sets of emotions.
-- ============================================================

CREATE TABLE public.genre_emotions (
    genre_id UUID NOT NULL
        REFERENCES public.genres(id)
        ON DELETE CASCADE,

    emotion_id UUID NOT NULL
        REFERENCES public.emotions(id)
        ON DELETE RESTRICT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (genre_id, emotion_id),

    CONSTRAINT genre_emotions_display_order_valid
        CHECK (display_order >= 0)
);


-- ============================================================
-- 6. REFLECTION EMOTION RATINGS
-- User rates emotions from 1–5 for a reflection.
-- ============================================================

CREATE TABLE public.reflection_emotion_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reflection_id UUID NOT NULL
        REFERENCES public.reflections(id)
        ON DELETE CASCADE,

    emotion_id UUID NOT NULL
        REFERENCES public.emotions(id)
        ON DELETE RESTRICT,

    rating INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT reflection_emotion_rating_range
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT reflection_emotion_unique
        UNIQUE (reflection_id, emotion_id)
);