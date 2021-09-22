-- \? list of commends
-- \l list of database
-- \c db_name connect to db
-- \d show the tables
-- \d table_name shows the actual table
-- CREATE DATABASE db_name; create db
-- DROP DATABASE db_name; delete db
-- CREATE TABLE table_name {
  -- col_name datatype
-- }
-- DROP TABLE table_name 
------ delete table 
-- ALTER TABLE table_name ADD/DROP COLUMN col_name datatype
----- choose the table you want to alter
-- INSERT INTO table_name (col1, col2,..) values () 
----- insert data
-- SELECT * /(col1, col2) FROM table_name 
----- view the table * means all or just col 
-- SELECT * FROM table_name WHERE id = id_num
----- grab an data 

CREATE TABLE users (
  user_id SERIAL primary key,
  first_name VARCHAR(50) not null,
  last_name VARCHAR(50) not null,
  email CITEXT not null unique,
  password text not null
);