-- ============================================================
-- VERBA — MIGRATION 007
-- CONSTRAINTS + INDEXES
-- ============================================================


-- ============================================================
-- USER-OWNED DATA
-- ============================================================

CREATE INDEX idx_user_books_user_id
    ON public.user_books(user_id);

CREATE INDEX idx_user_books_book_id
    ON public.user_books(book_id);

CREATE INDEX idx_user_books_user_status
    ON public.user_books(user_id, status);

CREATE INDEX idx_user_books_user_deleted_at
    ON public.user_books(user_id, deleted_at);


CREATE INDEX idx_user_book_sources_user_book_id
    ON public.user_book_sources(user_book_id);


CREATE INDEX idx_reading_sessions_user_id
    ON public.reading_sessions(user_id);

CREATE INDEX idx_reading_sessions_user_book_id
    ON public.reading_sessions(user_book_id);

CREATE INDEX idx_reading_sessions_started_at
    ON public.reading_sessions(user_id, started_at);


CREATE INDEX idx_reflections_user_id
    ON public.reflections(user_id);

CREATE INDEX idx_reflections_user_book_id
    ON public.reflections(user_book_id);

CREATE INDEX idx_reflections_created_at
    ON public.reflections(user_id, created_at);


CREATE INDEX idx_goals_user_id
    ON public.goals(user_id);

CREATE INDEX idx_goals_user_status
    ON public.goals(user_id, status);

CREATE INDEX idx_goal_genres_genre_id
    ON public.goal_genres(genre_id);


-- ============================================================
-- BOOK CATALOG
-- ============================================================

CREATE INDEX idx_books_title
    ON public.books(title);

CREATE INDEX idx_authors_name
    ON public.authors(name);

CREATE INDEX idx_book_identifiers_book_id
    ON public.book_identifiers(book_id);

CREATE INDEX idx_book_authors_author_id
    ON public.book_authors(author_id);

CREATE INDEX idx_book_genres_genre_id
    ON public.book_genres(genre_id);

CREATE INDEX idx_book_sources_book_id
    ON public.book_sources(book_id);

CREATE INDEX idx_book_sources_provider
    ON public.book_sources(provider);


-- ============================================================
-- EMOTION SYSTEM
-- ============================================================

CREATE INDEX idx_genre_emotions_emotion_id
    ON public.genre_emotions(emotion_id);

CREATE INDEX idx_reflection_emotion_ratings_emotion_id
    ON public.reflection_emotion_ratings(emotion_id);


-- ============================================================
-- IMPORT SYSTEM
-- ============================================================

CREATE INDEX idx_imports_user_id
    ON public.imports(user_id);

CREATE INDEX idx_imports_user_status
    ON public.imports(user_id, status);

CREATE INDEX idx_import_items_import_id
    ON public.import_items(import_id);

CREATE INDEX idx_import_items_matched_book_id
    ON public.import_items(matched_book_id);

CREATE INDEX idx_import_items_status
    ON public.import_items(import_id, status);


-- ============================================================
-- INTEGRATIONS
-- ============================================================

CREATE INDEX idx_connected_accounts_user_id
    ON public.connected_accounts(user_id);

CREATE INDEX idx_connected_accounts_user_status
    ON public.connected_accounts(user_id, status);


CREATE INDEX idx_sync_jobs_connected_account_id
    ON public.sync_jobs(connected_account_id);

CREATE INDEX idx_sync_jobs_status
    ON public.sync_jobs(connected_account_id, status);


-- ============================================================
-- CONFLICTS + SYNC HISTORY
-- ============================================================

CREATE INDEX idx_data_conflicts_user_id
    ON public.data_conflicts(user_id);

CREATE INDEX idx_data_conflicts_user_status
    ON public.data_conflicts(user_id, status);

CREATE INDEX idx_data_conflicts_entity
    ON public.data_conflicts(entity_type, entity_id);


CREATE INDEX idx_sync_history_sync_job_id
    ON public.sync_history(sync_job_id);

CREATE INDEX idx_sync_history_entity
    ON public.sync_history(entity_type, entity_id);


-- ============================================================
-- SOURCE FIELD POLICIES
-- ============================================================

CREATE INDEX idx_source_field_policies_entity_field
    ON public.source_field_policies(entity_type, field_name);

CREATE INDEX idx_source_field_policies_provider
    ON public.source_field_policies(provider);