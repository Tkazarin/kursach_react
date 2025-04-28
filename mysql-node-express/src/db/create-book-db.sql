USE kursach_react_db;

DROP TABLE IF EXISTS book;

CREATE TABLE IF NOT EXISTS book
  (
     id_book         INT PRIMARY KEY auto_increment,
     title   VARCHAR(40) NOT NULL,
     author   VARCHAR(40) NOT NULL,
     description VARCHAR(300),
     id_author INT NOT NULL,
     size INT,
     progress INT,
     raiting INT,
     file_img VARCHAR(300),
     file VARCHAR(300),
     FOREIGN KEY (id_author) REFERENCES user(id_user)
  );