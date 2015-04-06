/* IMPORTANT: Don't run this if there is non-discardable data in the db! */
DROP DATABASE IF EXISTS tsa;
CREATE DATABASE tsa;
/* Connect to database. */
\c tsa

/* Schema */
CREATE TABLE users
  (user_id TEXT,
   token TEXT,
   first_name TEXT,
   last_name TEXT,
   gender TEXT,
   cmu_id TEXT,
   PRIMARY KEY (user_id));

/*
CREATE TABLE tasks
  (task_id INTEGER,
   name TEXT,
   description TEXT,
   creator_user_id TEXT));
*/
