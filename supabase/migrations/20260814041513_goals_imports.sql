-- ============================================================
-- VERBA — MIGRATION 005
-- GOALS + IMPORT SYSTEM
-- ============================================================


-- ============================================================
-- 1. GOALS
-- ============================================================

CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    type TEXT NOT NULL,

    target_value INTEGER NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT goals_target_value_positive
        CHECK (target_value > 0),

    CONSTRAINT goals_date_range_valid
        CHECK (
            end_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT goals_status_valid
        CHECK (
            status IN (
                'active',
                'completed',
                'cancelled',
                'expired'
            )
        )
);


-- ============================================================
-- 2. GOAL GENRES
-- Optional genre targeting for a goal.
-- ============================================================

CREATE TABLE public.goal_genres (
    goal_id UUID NOT NULL
        REFERENCES public.goals(id)
        ON DELETE CASCADE,

    genre_id UUID NOT NULL
        REFERENCES public.genres(id)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (goal_id, genre_id)
);


-- ============================================================
-- 3. IMPORTS
-- Represents one import operation.
--
-- Examples:
-- Goodreads CSV import
-- StoryGraph import
-- Notion sync/import
-- Hardcover sync/import
-- ============================================================

CREATE TABLE public.imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    source TEXT NOT NULL,

    type TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'pending',

    records_found INTEGER NOT NULL DEFAULT 0,
    records_processed INTEGER NOT NULL DEFAULT 0,
    records_imported INTEGER NOT NULL DEFAULT 0,
    records_skipped INTEGER NOT NULL DEFAULT 0,
    records_failed INTEGER NOT NULL DEFAULT 0,

    error_message TEXT,

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT imports_status_valid
        CHECK (
            status IN (
                'pending',
                'processing',
                'completed',
                'completed_with_errors',
                'failed',
                'cancelled'
            )
        ),

    CONSTRAINT imports_type_valid
        CHECK (
            type IN (
                'file',
                'sync',
                'manual'
            )
        ),

    CONSTRAINT imports_records_found_valid
        CHECK (records_found >= 0),

    CONSTRAINT imports_records_processed_valid
        CHECK (records_processed >= 0),

    CONSTRAINT imports_records_imported_valid
        CHECK (records_imported >= 0),

    CONSTRAINT imports_records_skipped_valid
        CHECK (records_skipped >= 0),

    CONSTRAINT imports_records_failed_valid
        CHECK (records_failed >= 0),

    CONSTRAINT imports_completed_after_started
        CHECK (
            completed_at IS NULL
            OR started_at IS NULL
            OR completed_at >= started_at
        )
);


-- ============================================================
-- 4. IMPORT ITEMS
-- One external record inside an import operation.
-- ============================================================

CREATE TABLE public.import_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    import_id UUID NOT NULL
        REFERENCES public.imports(id)
        ON DELETE CASCADE,

    external_record_id TEXT,

    raw_data JSONB NOT NULL DEFAULT '{}'::JSONB,

    normalized_data JSONB,

    status TEXT NOT NULL DEFAULT 'pending',

    error_message TEXT,

    matched_book_id UUID
        REFERENCES public.books(id)
        ON DELETE SET NULL,

    match_method TEXT,

    match_confidence NUMERIC(5,4),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT import_items_status_valid
        CHECK (
            status IN (
                'pending',
                'processing',
                'completed',
                'skipped',
                'failed',
                'needs_review'
            )
        ),

    CONSTRAINT import_items_match_confidence_valid
        CHECK (
            match_confidence IS NULL
            OR (
                match_confidence >= 0
                AND match_confidence <= 1
            )
        )
);