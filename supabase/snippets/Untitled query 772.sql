SELECT
    id,
    user_id,
    user_book_id,
    reflection_text,
    favorite_takeaway
FROM public.reflections;

UPDATE public.reflections
SET reflection_text = 'HACKED BY USER A'
WHERE user_id = 'e57ac9eb-bdfe-4462-8037-a3e5a63877b6'
RETURNING id, user_id, reflection_text;

DELETE FROM public.reflections
WHERE user_id = 'e57ac9eb-bdfe-4462-8037-a3e5a63877b6'
RETURNING id, user_id;


SELECT
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'notes';

  SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'notes'
ORDER BY ordinal_position;


SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT
    t.tablename,
    t.rowsecurity AS rls_enabled,
    COUNT(p.policyname) AS policy_count
FROM pg_tables t
LEFT JOIN pg_policies p
    ON p.schemaname = t.schemaname
    AND p.tablename = t.tablename
WHERE t.schemaname = 'public'
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;

SELECT
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;


SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reflection_emotion_ratings'
ORDER BY ordinal_position;
\

SELECT
    id,
    name
FROM public.emotions
ORDER BY name
LIMIT 10;

SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'emotions'
ORDER BY ordinal_position;

SELECT
    id,
    key,
    label
FROM public.emotions
WHERE is_active = true
ORDER BY label
LIMIT 10;

SELECT
    id,
    key,
    label,
    is_active
FROM public.emotions
ORDER BY label;

SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'goals'
ORDER BY ordinal_position;


SELECT
    conname,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.goals'::regclass
ORDER BY conname;