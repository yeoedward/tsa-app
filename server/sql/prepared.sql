/* Check in. */
BEGIN;
SELECT buddy_task_id, my_user_id, completion_id FROM buddy_completed
  WHERE verified = FALSE AND buddy_user_id = $1
        AND completion_id = (
            SELECT MAX(completion_id) FROM buddy_completed
              WHERE verified = FALSE and buddy_user_id = $1);
/* If null, insert new complete entry. */
/* For each buddy_task_id returned, update verified to true. */
UPDATE buddy_completed
  SET verified = TRUE
  WHERE buddy_task_id = $1
/* For each my_user_id not returned, insert an entry. */
INSERT INTO buddy_completed
  (buddy_task_id, completion_id, my_user_id, buddy_user_id, verified)
  VALUES ($1, $2, $3, $4, FALSE);
COMMIT;

/* Tasks. */
SELECT t.task_id, t.name, t.description, t.buddy_required, t.create_time,
       t.expiry_time, u.first_name, u.last_name
  FROM tasks as t
  INNER JOIN users as u
    ON t.creator_user_id = u.user_id
  WHERE t.expiry_time >= now()

/* Completed. */
SELECT c.completion_id, c.task_id, c.time, c.details, t.name, t.buddy_required
  FROM completed as c
  INNER JOIN tasks as t
    ON c.task_id = t.task_id
  INNER JOIN buddy_completed as b
    ON c.completion_id = b.completion_id
  WHERE $1 = c.user_id OR $1 = b.my_user_id OR $1 = b.buddy_user_id

/* Buddy ranking. */
SELECT my_user_id, buddy_user_id, COUNT(*) AS count
  FROM buddy_completed
  WHERE verified = TRUE
  GROUP BY user_id1, user_id2
  ORDER BY count DESC
  LIMIT $1;

/* My buddy pair stats. */
SELECT my_user_id, buddy_user_id, COUNT(*) AS count
  FROM buddy_completed
  WHERE verified = TRUE AND ($1 = my_user_id OR $1 = buddy_user_id)
  GROUP BY my_user_id, buddy_user_id
  ORDER BY count DESC
  LIMIT $2;
