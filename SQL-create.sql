-- Apagar tabelas antigas
DROP TABLE IF EXISTS agendamento CASCADE;
DROP TABLE IF EXISTS avaliacao CASCADE;
DROP TABLE IF EXISTS complementos CASCADE;
DROP TABLE IF EXISTS post CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- Usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    idade INT,
    sexo VARCHAR(20),
    url_foto_perfil TEXT
);

-- Post
CREATE TABLE post (
    id_post SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Complementos
CREATE TABLE complementos (
    id_complemento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    especialidade VARCHAR(255),
    regiao VARCHAR(255),
    CONSTRAINT fk_complementos_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Avaliação
CREATE TABLE avaliacao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_manicure INT NOT NULL,
    descricao TEXT,
    CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_avaliacao_manicure FOREIGN KEY (id_manicure) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Agendamento
CREATE TABLE agendamento (
    id_avaliacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_manicure INT NOT NULL,
    descricao TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamento_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_agendamento_manicure FOREIGN KEY (id_manicure) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Dados iniciais de teste
INSERT INTO usuario (nome, email, senha, idade, sexo) 
VALUES 
    ('Vanda', 'vanda@email.com', '123456', 18, 'F'),
    ('Zawer', 'zawer@email.com', '123456', 30, 'M');

INSERT INTO post (id_usuario, titulo, descricao) 
VALUES 
    (1, 'Primeiro Post', 'Esse é o primeiro post da Vanda'),
    (2, 'Post do Zawer', 'Esse é o post do Zawer');