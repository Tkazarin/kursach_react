USE kursach_react_db;

DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user
  (
     id_user         INT PRIMARY KEY auto_increment,
     username   VARCHAR(25) UNIQUE NOT NULL,
     password   CHAR(60) NOT NULL,
     name VARCHAR(50) NOT NULL,
     email      VARCHAR(100) UNIQUE NOT NULL,
     role       ENUM('Admin', 'SuperUser') DEFAULT 'SuperUser'
  );