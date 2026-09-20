
SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'sub', 'a6ad651d-e028-4ee5-a9af-b1aee40023c4',
        'role', 'authenticated'
    )::text,
    true
);


SELECT *
FROM public.profiles;

INSERT INTO public.profiles (user_id)
VALUES ('a6ad651d-e028-4ee5-a9af-b1aee40023c4');

SELECT *
FROM public.profiles;



SET LOCAL ROLE postgres;

INSERT INTO public.profiles (user_id)
VALUES ('8aa798e6-b15e-4aab-b0a9-26799682ba4e');

RESET ROLE;

SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'sub', 'USER_A_UUID',
        'role', 'authenticated'
    )::text,
    true
);

SELECT *
FROM public.profiles;

BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'sub', 'a6ad651d-e028-4ee5-a9af-b1aee40023c4',
        'role', 'authenticated'
    )::text,
    true
);

SELECT auth.uid();

SELECT *
FROM public.profiles;

ROLLBACK;


BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'sub', 'a6ad651d-e028-4ee5-a9af-b1aee40023c4',
        'role', 'authenticated'
    )::text,
    true
);

SELECT auth.uid();

SELECT *
FROM public.profiles;

ROLLBACK;


BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'sub', 'a6ad651d-e028-4ee5-a9af-b1aee40023c4',
        'role', 'authenticated'
    )::text,
    true
);

SELECT
    id,
    user_id,
    avatar_url
FROM public.profiles;

ROLLBACK;

BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    '{"sub":"a6ad651d-e028-4ee5-a9af-b1aee40023c4","role":"authenticated"}',
    true
);

SELECT id, user_id, avatar_url
FROM public.profiles;

ROLLBACK;


BEGIN;

SET LOCAL ROLE authenticated;

WITH auth_setup AS (
    SELECT set_config(
        'request.jwt.claims',
        '{"sub":"a6ad651d-e028-4ee5-a9af-b1aee40023c4","role":"authenticated"}',
        true
    )
)
SELECT
    id,
    user_id,
    avatar_url
FROM public.profiles, auth_setup;

ROLLBACK;

SELECT
    user_id,
    auth.uid() AS current_auth_uid,
    current_user,
    (SELECT COUNT(*) FROM public.profiles) AS visible_profiles
FROM public.profiles;


BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    '{"sub":"a6ad651d-e028-4ee5-a9af-b1aee40023c4","role":"authenticated"}',
    true
);

SELECT
    auth.uid() AS auth_user,
    current_user AS database_role,
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE user_id = 'a6ad651d-e028-4ee5-a9af-b1aee40023c4'
    ) AS profile_visible;

ROLLBACK;