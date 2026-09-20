SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reading_sessions'
ORDER BY ordinal_position;

SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.reading_sessions'::regclass;

SELECT
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'reading_sessions'
ORDER BY policyname;


INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    '5e076765-ead1-4e16-b8de-c8b28854dac0',
    NOW() - INTERVAL '30 minutes',
    NOW(),
    1,
    25
)
RETURNING *;


INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    '5e076765-ead1-4e16-b8de-c8b28854dac0',
    NOW() - INTERVAL '30 minutes',
    NOW(),
    50,
    25
);

INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    '5e076765-ead1-4e16-b8de-c8b28854dac0',
    NOW(),
    NOW() - INTERVAL '30 minutes',
    25,
    50
);


INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    '5e076765-ead1-4e16-b8de-c8b28854dac0',
    NOW() - INTERVAL '30 minutes',
    NOW(),
    -1,
    25
);



INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    '5e076765-ead1-4e16-b8de-c8b28854dac0',
    NOW() - INTERVAL '30 minutes',
    NOW(),
    1,
    -5
);



INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    'a9c9088b-12c3-4399-b775-f66aa61f308c',
    NOW() - INTERVAL '30 minutes',
    NOW(),
    1,
    25
);

SELECT *
FROM public.reading_sessions;


SELECT
    id,
    user_id,
    user_book_id
FROM public.reading_sessions
ORDER BY created_at;


INSERT INTO public.reading_sessions (
    user_id,
    user_book_id,
    started_at,
    ended_at,
    start_page,
    end_page
)
VALUES (
    'e57ac9eb-bdfe-4462-8037-a3e5a63877b6',
    'a9c9088b-12c3-4399-b775-f66aa61f308c',
    NOW() - INTERVAL '20 minutes',
    NOW(),
    10,
    30
)
RETURNING id, user_id, user_book_id;


UPDATE public.reading_sessions
SET end_page = 40
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e'
RETURNING *;

SELECT
    current_user,
    session_user,
    auth.uid() AS authenticated_user_id;

    UPDATE public.reading_sessions
SET end_page = 30
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e';


UPDATE public.reading_sessions
SET end_page = 30
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e';


BEGIN;

SELECT set_config(
    'request.jwt.claim.sub',
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    true
);

SELECT set_config(
    'request.jwt.claim.role',
    'authenticated',
    true
);

SELECT
    current_user,
    auth.uid() AS authenticated_user_id;

ROLLBACK;

ALTER TABLE public.reading_sessions FORCE ROW LEVEL SECURITY;


BEGIN;

SELECT set_config(
    'request.jwt.claim.sub',
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    true
);

SELECT set_config(
    'request.jwt.claim.role',
    'authenticated',
    true
);

UPDATE public.reading_sessions
SET end_page = 40
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e'
RETURNING *;

ROLLBACK;


UPDATE public.reading_sessions
SET end_page = 30
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e';


BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claim.sub',
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    true
);

SELECT set_config(
    'request.jwt.claim.role',
    'authenticated',
    true
);

SELECT
    current_user,
    auth.uid() AS authenticated_user_id;

UPDATE public.reading_sessions
SET end_page = 40
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e'
RETURNING *;

ROLLBACK;


BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claim.sub',
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    true
);

SELECT set_config(
    'request.jwt.claim.role',
    'authenticated',
    true
);

UPDATE public.reading_sessions
SET end_page = 40
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e'
RETURNING *;

ROLLBACK;


UPDATE public.reading_sessions
SET end_page = 40
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e'
RETURNING *;

SELECT
    relname AS table_name,
    relrowsecurity AS rls_enabled,
    relforcerowsecurity AS rls_forced
FROM pg_class
WHERE oid = 'public.reading_sessions'::regclass;


SELECT
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'reading_sessions';


  UPDATE public.reading_sessions
SET end_page = 30
WHERE id = '9d191204-b842-41e1-89a9-d0c8e928ee1e';

SELECT
    table_name,
    constraint_name,
    foreign_table_name,
    foreign_column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'public'
ORDER BY table_name, constraint_name;


SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;



SELECT 'book_authors' AS table_name, COUNT(*) AS orphan_count
FROM public.book_authors ba
LEFT JOIN public.books b ON b.id = ba.book_id
LEFT JOIN public.authors a ON a.id = ba.author_id
WHERE b.id IS NULL OR a.id IS NULL

UNION ALL

SELECT 'book_genres', COUNT(*)
FROM public.book_genres bg
LEFT JOIN public.books b ON b.id = bg.book_id
LEFT JOIN public.genres g ON g.id = bg.genre_id
WHERE b.id IS NULL OR g.id IS NULL

UNION ALL

SELECT 'book_identifiers', COUNT(*)
FROM public.book_identifiers bi
LEFT JOIN public.books b ON b.id = bi.book_id
WHERE b.id IS NULL

UNION ALL

SELECT 'book_sources', COUNT(*)
FROM public.book_sources bs
LEFT JOIN public.books b ON b.id = bs.book_id
WHERE b.id IS NULL

UNION ALL

SELECT 'goal_genres', COUNT(*)
FROM public.goal_genres gg
LEFT JOIN public.goals g ON g.id = gg.goal_id
LEFT JOIN public.genres ge ON ge.id = gg.genre_id
WHERE g.id IS NULL OR ge.id IS NULL

UNION ALL

SELECT 'import_items', COUNT(*)
FROM public.import_items ii
LEFT JOIN public.imports i ON i.id = ii.import_id
WHERE i.id IS NULL

UNION ALL

SELECT 'user_books', COUNT(*)
FROM public.user_books ub
LEFT JOIN public.books b ON b.id = ub.book_id
WHERE b.id IS NULL;


SELECT
    table_name,
    (
        xpath(
            '/row/count/text()',
            query_to_xml(
                format('SELECT COUNT(*) FROM public.%I', table_name),
                false,
                true,
                ''
            )
        )
    )[1]::text::int AS row_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
      'authors',
      'books',
      'genres',
      'emotions',
      'reading_purposes'
  )
ORDER BY table_name;