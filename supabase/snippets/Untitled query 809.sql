SELECT
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';


BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    '{"sub":"a6ad651d-e028-4ee5-a9af-b1aee40023c4","role":"authenticated"}',
    true
);

SELECT
    auth.uid() AS auth_uid,
    'a6ad651d-e028-4ee5-a9af-b1aee40023c4'::uuid AS expected_uid,
    auth.uid() = 'a6ad651d-e028-4ee5-a9af-b1aee40023c4'::uuid AS ids_match;

ROLLBACK;


SELECT
    id,
    user_id,
    user_id = 'a6ad651d-e028-4ee5-a9af-b1aee40023c4'::uuid AS is_user_a
FROM public.profiles;


SELECT
    current_user,
    has_table_privilege(
        'authenticated',
        'public.profiles',
        'SELECT'
    ) AS has_select,
    row_security_active('public.profiles') AS rls_active;

    SELECT
    id,
    email
FROM auth.users
ORDER BY created_at;