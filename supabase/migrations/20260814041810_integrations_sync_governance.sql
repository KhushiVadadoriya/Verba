-- ============================================================
-- VERBA — MIGRATION 006
-- INTEGRATIONS + SYNC GOVERNANCE
-- ============================================================


-- ============================================================
-- 1. CONNECTED ACCOUNTS
--
-- One connected account per provider for each user.
--
-- IMPORTANT:
-- OAuth access/refresh tokens are NOT stored here.
-- Credentials must remain in secure server-side storage.
-- ============================================================

CREATE TABLE public.connected_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    provider TEXT NOT NULL,

    external_account_id TEXT,

    status TEXT NOT NULL DEFAULT 'connected',

    connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    disconnected_at TIMESTAMPTZ,

    last_synced_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT connected_accounts_status_valid
        CHECK (
            status IN (
                'connected',
                'disconnected',
                'error',
                'reauthorization_required'
            )
        ),

    CONSTRAINT connected_accounts_disconnect_valid
        CHECK (
            disconnected_at IS NULL
            OR disconnected_at >= connected_at
        ),

    CONSTRAINT connected_accounts_user_provider_unique
        UNIQUE (user_id, provider)
);


-- ============================================================
-- 2. SYNC JOBS
--
-- Represents one synchronization operation.
-- ============================================================

CREATE TABLE public.sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    connected_account_id UUID NOT NULL
        REFERENCES public.connected_accounts(id)
        ON DELETE CASCADE,

    status TEXT NOT NULL DEFAULT 'pending',

    started_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    records_found INTEGER NOT NULL DEFAULT 0,
    records_processed INTEGER NOT NULL DEFAULT 0,
    records_created INTEGER NOT NULL DEFAULT 0,
    records_updated INTEGER NOT NULL DEFAULT 0,
    records_skipped INTEGER NOT NULL DEFAULT 0,
    records_failed INTEGER NOT NULL DEFAULT 0,

    error_message TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT sync_jobs_status_valid
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

    CONSTRAINT sync_jobs_records_found_valid
        CHECK (records_found >= 0),

    CONSTRAINT sync_jobs_records_processed_valid
        CHECK (records_processed >= 0),

    CONSTRAINT sync_jobs_records_created_valid
        CHECK (records_created >= 0),

    CONSTRAINT sync_jobs_records_updated_valid
        CHECK (records_updated >= 0),

    CONSTRAINT sync_jobs_records_skipped_valid
        CHECK (records_skipped >= 0),

    CONSTRAINT sync_jobs_records_failed_valid
        CHECK (records_failed >= 0),

    CONSTRAINT sync_jobs_completed_after_started
        CHECK (
            completed_at IS NULL
            OR started_at IS NULL
            OR completed_at >= started_at
        )
);


-- ============================================================
-- 3. SOURCE FIELD POLICIES
--
-- Defines which provider is authoritative for a specific
-- entity field.
--
-- Examples:
-- book.title → google_books
-- book.cover_url → google_books
-- book.page_count → hardcover
--
-- Verba remains the source of truth for user-owned fields.
-- ============================================================

CREATE TABLE public.source_field_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type TEXT NOT NULL,

    field_name TEXT NOT NULL,

    provider TEXT NOT NULL,

    priority INTEGER NOT NULL DEFAULT 1,

    is_authoritative BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT source_field_policies_priority_valid
        CHECK (priority > 0),

    CONSTRAINT source_field_policies_unique
        UNIQUE (
            entity_type,
            field_name,
            provider
        )
);


-- ============================================================
-- 4. DATA CONFLICTS
--
-- Records genuine conflicts between Verba and external data.
-- ============================================================

CREATE TABLE public.data_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    field_name TEXT NOT NULL,

    verba_value JSONB,

    external_value JSONB,

    external_provider TEXT NOT NULL,

    resolution_strategy TEXT,

    status TEXT NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    resolved_at TIMESTAMPTZ,

    CONSTRAINT data_conflicts_status_valid
        CHECK (
            status IN (
                'pending',
                'resolved',
                'ignored'
            )
        ),

    CONSTRAINT data_conflicts_resolution_strategy_valid
        CHECK (
            resolution_strategy IS NULL
            OR resolution_strategy IN (
                'verba_wins',
                'external_wins',
                'manual',
                'ignored'
            )
        ),

    CONSTRAINT data_conflicts_resolution_time_valid
        CHECK (
            resolved_at IS NULL
            OR resolved_at >= created_at
        )
);


-- ============================================================
-- 5. SYNC HISTORY
--
-- Append-only audit trail of synchronization changes.
-- ============================================================

CREATE TABLE public.sync_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sync_job_id UUID NOT NULL
        REFERENCES public.sync_jobs(id)
        ON DELETE CASCADE,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    field_name TEXT NOT NULL,

    old_value JSONB,

    new_value JSONB,

    source TEXT NOT NULL,

    resolution_strategy TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);