INSERT INTO public.books (title)
VALUES
    ('RLS Test Book A'),
    ('RLS Test Book B')
RETURNING id, title;

INSERT INTO public.user_books (
    user_id,
    book_id,
    status
)
VALUES
    (
        'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
        'e0708072-7479-4857-9080-4bddfe351a33',
        'finished'
    ),
    (
        'e57ac9eb-bdfe-4462-8037-a3e5a63877b6',
        '668db150-e0e9-4fc5-93a2-3ed0c61289a4',
        'currently_reading'
    )
RETURNING id, user_id, book_id, status;

SELECT
    conname,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'user_books_status_valid';


SELECT
    regexp_matches(
        pg_get_constraintdef(oid),
        '''([^'']+)''::text',
        'g'
    ) AS allowed_status
FROM pg_constraint
WHERE conname = 'user_books_status_valid';


INSERT INTO public.user_books (
    user_id,
    book_id,
    status
)
VALUES
(
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    'e0708072-7479-4857-9080-4bddfe351a33',
    'completed'
),
(
    'e57ac9eb-bdfe-4462-8037-a3e5a63877b6',
    '668db150-e0e9-4fc5-93a2-3ed0c61289a4',
    'reading'
)
RETURNING id, user_id, book_id, status;

SELECT
    user_id,
    book_id,
    status
FROM public.user_books;

BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    '{"sub":"db70d752-f33a-4f04-b36a-8ec0a9ff93d3","role":"authenticated"}',
    true
);

SELECT
    user_id,
    book_id,
    status
FROM public.user_books;

ROLLBACK;

BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    '{"sub":"db70d752-f33a-4f04-b36a-8ec0a9ff93d3","role":"authenticated"}',
    true
);

UPDATE public.user_books
SET status = 'completed'
WHERE user_id = 'e57ac9eb-bdfe-4462-8037-a3e5a63877b6';

ROLLBACK;

DELETE FROM public.user_books
WHERE user_id = 'e57ac9eb-bdfe-4462-8037-a3e5a63877b6'
RETURNING id, user_id, book_id;



SELECT
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'books';

SELECT
    id,
    title
FROM public.books
WHERE id IN (
    'e0708072-7479-4857-9080-4bddfe351a33',
    '668db150-e0e9-4fc5-93a2-3ed0c61289a4'
);

UPDATE public.books
SET title = 'HACKED BOOK'
WHERE id = 'e0708072-7479-4857-9080-4bddfe351a33'
RETURNING id, title;

SELECT
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'reflections';

  SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reflections'
ORDER BY ordinal_position;


SELECT
    id,
    user_id,
    book_id,
    status
FROM public.user_books
WHERE book_id IN (
    'e0708072-7479-4857-9080-4bddfe351a33',
    '668db150-e0e9-4fc5-93a2-3ed0c61289a4'
);\

SELECT
    id,
    user_id,
    book_id,
    status
FROM public.user_books
WHERE book_id = '668db150-e0e9-4fc5-93a2-3ed0c61289a4';


INSERT INTO public.reflections (
    user_id,
    user_book_id,
    reflection_text,
    favorite_takeaway
)
VALUES
(
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    '5e076765-ead1-4e16-b8de-c8b28854dac0',
    'User A reflection',
    'User A takeaway'
),
(
    'e57ac9eb-bdfe-4462-8037-a3e5a63877b6',
    'a9c9088b-12c3-4399-b775-f66aa61f308c',
    'User B reflection',
    'User B takeaway'
)
RETURNING id, user_id, user_book_id, reflection_text;