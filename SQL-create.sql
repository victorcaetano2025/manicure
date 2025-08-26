DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS post CASCADE;

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    idade INT
);

CREATE TABLE post (
    id_post SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data TIMESTAMP NOT NULL,
    id_author BIGINT NOT NULL,
    CONSTRAINT fk_author FOREIGN KEY (id_author) REFERENCES usuario(id_usuario)
);

INSERT INTO usuario (nome, idade) VALUES ('vanda', 18),('zawer',30);
INSERT INTO post (titulo, author, mensagem, id_author)

select * from usuario;
select * from post;
SELECT nome,titulo,p.mensagem FROM post p INNER JOIN usuario u ON p.author = u.id_usuario;


