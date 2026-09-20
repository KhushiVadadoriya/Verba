db70d752-f33a-4f04-b36a-8ec0a9ff93d3
e57ac9eb-bdfe-4462-8037-a3e5a63877b6

INSERT INTO public.profiles (user_id)
VALUES
    ('db70d752-f33a-4f04-b36a-8ec0a9ff93d3'),
    ('e57ac9eb-bdfe-4462-8037-a3e5a63877b6');

SELECT user_id
FROM public.profiles;

BEGIN;

SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claims',
    '{"sub":"db70d752-f33a-4f04-b36a-8ec0a9ff93d3","role":"authenticated"}',
    true
);

SELECT
    user_id,
    user_id = auth.uid() AS belongs_to_current_user
FROM public.profiles;

ROLLBACK;