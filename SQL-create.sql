DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS post CASCADE;

Create Table usuario(
id_usuario SERIAL PRIMARY KEY,
nome varchar(255) not null,
idade integer
);

Create Table post(
id_post serial primary key,
titulo varchar(255) not null,
mensagem text,
author integer references usuario(id_usuario)ON DELETE CASCADE
);

INSERT INTO usuario (nome, idade) VALUES ('vanda', 18),('zawer',30);
INSERT INTO post (titulo, author, mensagem) values ('zawer adventure',2,'um mundo novo'),('vanda adventure',1,'kkkkkk');

select * from usuario;
select * from post;
SELECT nome,titulo,p.mensagem FROM post p INNER JOIN usuario u ON p.author = u.id_usuario;


