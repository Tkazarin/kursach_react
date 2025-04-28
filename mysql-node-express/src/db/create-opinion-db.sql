USE kursach_react_db;

DROP TABLE IF EXISTS opinion;

CREATE TABLE IF NOT EXISTS opinion
  (
     id_opinion         INT PRIMARY KEY auto_increment,
     text   VARCHAR(500) NOT NULL,
     date   DATE NOT NULL,
     progress INT,
     id_book INT NOT NULL,
     FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
  );