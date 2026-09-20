INSERT INTO public.goals (
    user_id,
    type,
    target_value,
    start_date,
    end_date,
    status
)
VALUES
(
    'db70d752-f33a-4f04-b36a-8ec0a9ff93d3',
    'books_per_month',
    5,
    '2026-08-01',
    '2026-08-31',
    'active'
),
(
    'e57ac9eb-bdfe-4462-8037-a3e5a63877b6',
    'books_per_month',
    3,
    '2026-08-01',
    '2026-08-31',
    'active'
)
RETURNING
    id,
    user_id,
    type,
    target_value,
    status;


SELECT
    id,
    user_id,
    type,
    target_value,
    status
FROM public.goals;


UPDATE public.goals
SET target_value = 999
WHERE user_id = 'e57ac9eb-bdfe-4462-8037-a3e5a63877b6'
RETURNING id, user_id, target_value;

DELETE FROM public.goals
WHERE user_id = 'e57ac9eb-bdfe-4462-8037-a3e5a63877b6'
RETURNING id, user_id;