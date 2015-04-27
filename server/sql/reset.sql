/* IMPORTANT: Don't run this if there is non-discardable data in the db! */
DROP DATABASE IF EXISTS tsa;
CREATE DATABASE tsa;

/* Connect to database. */
\c tsa

/* Schemas */

CREATE TABLE users
  (user_id SERIAL,
   fb_user_id TEXT UNIQUE,
   admin BOOLEAN,
   first_name TEXT,
   last_name TEXT,
   gender TEXT,
   cmu_id TEXT,
   PRIMARY KEY (user_id));

CREATE TABLE buddies
  (big_user_id INTEGER,
   little_user_id INTEGER,
   PRIMARY KEY (big_user_id, little_user_id),
   FOREIGN KEY (big_user_id) REFERENCES users(user_id),
   FOREIGN KEY (little_user_id) REFERENCES users(user_id));

CREATE TABLE tasks
  (task_id SERIAL,
   name TEXT,
   description TEXT,
   creator_user_id INTEGER,
   buddy_required BOOLEAN,
   created_time TIMESTAMP WITH TIME ZONE,
   expiry_time TIMESTAMP WITH TIME ZONE,
   PRIMARY KEY (task_id));

CREATE TABLE completed
  (completion_id SERIAL,
   user_id INTEGER,
   task_id INTEGER,
   time TIMESTAMP WITH TIME ZONE,
   details TEXT,
   PRIMARY KEY (completion_id),
   FOREIGN KEY (task_id) REFERENCES tasks(task_id));

CREATE TABLE buddy_completed
  (buddy_task_id SERIAL,
   completion_id INTEGER,
   my_user_id INTEGER,
   buddy_user_id INTEGER,
   verified BOOLEAN,
   PRIMARY KEY (buddy_task_id),
   FOREIGN KEY (completion_id) REFERENCES completed(completion_id),
   FOREIGN KEY (my_user_id) REFERENCES users(user_id),
   FOREIGN KEY (buddy_user_id) REFERENCES users(user_id));
